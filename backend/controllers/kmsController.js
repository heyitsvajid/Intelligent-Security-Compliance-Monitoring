const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const fileName = "KmsController: ";
const KmsService = require('../utility/kmsService');
const AWS = require('aws-sdk');

// This function is the controller for API path /checkExposedKeys
// This API checks for exposed keys by getting data from service
exports.checkExposedKeys = (req, res) => {
    let log = logger.getLogger(fileName + 'checkExposedKeys API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });

    // This function call gets the list of all keys along with their configuration information
    KmsService.getAllKeys(credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling KmsService.getAllKeys: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else {
            let keyList = data;
            let exposedKeyList = new Set();
            let nonExposedKeyList = new Set();
            let keyCount = 0;

            keyList.forEach(key => {
                let params = { // create parameters required to get key policy
                    KeyId: key.TargetKeyId,
                    PolicyName: "default"
                };
                // This function is invoked for each key to get the policy of key
                KmsService.getKeyPolicy(params, credentials, (err, data) => {
                    if (err) { // To handle any errors occurred while invoking service
                        log.error("Error Calling KmsService.getKeyPolicy: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject); // returns result object with error message if error occurs
                    }
                    else { // Validate and check if there are any exposed keys
                        let statementList = [].concat(data.Statement);
                        let statementCount = 0;
                        // For each statement in the key policy check for global access permissions as below
                        statementList.forEach(statement => {
                            if (statement.Principal.AWS === "*" && typeof statement.Condition === "undefined") {
                                exposedKeyList.add(key.AliasName);
                            }
                            else nonExposedKeyList.add(key.AliasName);
                            statementCount++;
                            if (statementCount === statementList.length) keyCount++;
                            if (keyCount === keyList.length && statementCount === statementList.length) {
                                resultObject.success = true;
                                // create a result object containing the following data:
                                // 1. a list of secure Keys (passed)
                                // 2. a list of exposed Keys (failed)
                                // 3. a list of all existing Keys (keyList)
                                resultObject.data = {
                                    keyList,
                                    failed: Array.from(exposedKeyList),
                                    passed: Array.from(nonExposedKeyList)
                                };
                                // returns the result object created above containing the compliance information
                                res.status(200).json(resultObject);
                            }
                        });
                    }
                });
            });
        }
    });
};

// This function is the controller for API path /checkCrossAccountAccess
// This API checks for keys with cross account access by getting data from service
exports.checkCrossAccountAccess = (req, res) => {
    let log = logger.getLogger(fileName + 'checkCrossAccountAccess API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });
    let callerIdentity = {};
    // This function is invoked to get the caller identity details to get account Id
    KmsService.getCallerIdentity({}, credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling KmsService.getCallerIdentity: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else {
            callerIdentity = data;
            // This function call gets the list of all keys along with their configuration information
            KmsService.getAllKeys(credentials, (err, data) => {
                if (err) { // To handle any errors occurred while invoking service
                    log.error("Error Calling KmsService.getAllKeys: " + JSON.stringify(err));
                    resultObject.success = false;
                    resultObject.errorMessage = err.message;
                    res.status(400).json(resultObject); // returns result object with error message if error occurs
                }
                else {
                    let keyList = data;
                    let crossAccountList = new Set();
                    let sameAccountList = new Set();
                    let keyCount = 0;

                    keyList.forEach(key => {
                        let params = { // create parameters to get key policy
                            KeyId: key.TargetKeyId,
                            PolicyName: "default"
                        };
                        // This function is invoked for each key to get the policy of key
                        KmsService.getKeyPolicy(params, credentials, (err, data) => {
                            if (err) { // To handle any errors occurred while invoking service
                                log.error("Error Calling KmsService.getKeyPolicy: " + JSON.stringify(err));
                                resultObject.success = false;
                                resultObject.errorMessage = err.message;
                                res.status(400).json(resultObject); // returns result object with error message if error occurs
                            }
                            else { // Validate and check if there are any keys with cross account access
                                let statementList = [].concat(data.Statement);
                                let statementCount = 0;
                                // For each statement in the policy, check if there is any account added other than the caller
                                statementList.forEach(statement => {
                                    if (typeof statement.Principal.AWS !== 'undefined' && statement['Principal']['AWS'].includes(callerIdentity.Account))
                                        sameAccountList.add(key.AliasName);
                                    else if (statement.Principal.AWS === "*") {
                                        if (typeof statement.Condition !== "undefined") {
                                            if (typeof statement.Condition.StringEquals !== 'undefined') {
                                                if (statement.Condition.StringEquals['kms:CallerAccount'] === callerIdentity.Account)
                                                    sameAccountList.add(key.AliasName);
                                                else
                                                    crossAccountList.add(key.AliasName);
                                            }
                                        }
                                    }
                                    else if (typeof statement.Principal.AWS !== 'undefined')
                                        crossAccountList.add(key.AliasName);
                                    statementCount++;
                                    if (statementCount === statementList.length) keyCount++;
                                    if (keyCount === keyList.length && statementCount === statementList.length) {
                                        resultObject.success = true;
                                        // create a result object containing the following data:
                                        // 1. a list of Keys without cross account access (passed)
                                        // 2. a list of Keys with cross account access (failed)
                                        // 3. a list of all existing Keys (keyList)
                                        resultObject.data = {
                                            keyList,
                                            failed: Array.from(crossAccountList),
                                            passed: Array.from(sameAccountList)
                                        };
                                        // returns the result object created above containing the compliance information
                                        res.status(200).json(resultObject);
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    });
};