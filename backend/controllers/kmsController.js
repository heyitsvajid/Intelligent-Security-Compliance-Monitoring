const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const fileName = "KmsController: ";
const KmsService = require('../utility/kmsService');
const AWS = require('aws-sdk');

exports.checkExposedKeys = (req, res) => {
    let log = logger.getLogger(fileName + 'checkExposedKeys API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        sessionToken: null
    });

    KmsService.getAllKeys(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling KmsService.getAllKeys: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let keyList = data;
            let exposedKeyList = new Set();
            let nonExposedKeyList = new Set();
            let keyCount = 0;

            keyList.forEach(key => {
                let params = {
                    KeyId: key.TargetKeyId,
                    PolicyName: "default"
                };
                KmsService.getKeyPolicy(params, credentials, (err, data) => {
                    if (err) {
                        log.error("Error Calling KmsService.getKeyPolicy: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject);
                    }
                    else {
                        let statementList = [].concat(data.Statement);
                        let statementCount = 0;
                        statementList.forEach(statement => {
                            if (statement.Principal.AWS === "*" && typeof statement.Condition === "undefined") {
                                exposedKeyList.add(key.AliasName);
                            }
                            else nonExposedKeyList.add(key.AliasName);
                            statementCount++;
                            if (statementCount === statementList.length) keyCount++;
                            if (keyCount === keyList.length && statementCount === statementList.length) {
                                resultObject.success = true;
                                resultObject.data = {
                                    keyList,
                                    failed: Array.from(exposedKeyList),
                                    passed: Array.from(nonExposedKeyList)
                                };
                                res.status(200).json(resultObject);
                            }
                        });
                    }
                });
            });
        }
    });
};

exports.checkCrossAccountAccess = (req, res) => {
    let log = logger.getLogger(fileName + 'checkCrossAccountAccess API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        sessionToken: null
    });
    let callerIdentity = {};
    KmsService.getCallerIdentity({}, credentials, (err, data) => {
        if (err) {
            log.error("Error Calling KmsService.getCallerIdentity: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            callerIdentity = data;
            KmsService.getAllKeys(credentials, (err, data) => {
                if (err) {
                    log.error("Error Calling KmsService.getAllKeys: " + JSON.stringify(err));
                    resultObject.success = false;
                    resultObject.errorMessage = err.message;
                    res.status(400).json(resultObject);
                }
                else {
                    let keyList = data;
                    let crossAccountList = new Set();
                    let sameAccountList = new Set();
                    let keyCount = 0;

                    keyList.forEach(key => {
                        let params = {
                            KeyId: key.TargetKeyId,
                            PolicyName: "default"
                        };
                        KmsService.getKeyPolicy(params, credentials, (err, data) => {
                            if (err) {
                                log.error("Error Calling KmsService.getKeyPolicy: " + JSON.stringify(err));
                                resultObject.success = false;
                                resultObject.errorMessage = err.message;
                                res.status(400).json(resultObject);
                            }
                            else {
                                let statementList = [].concat(data.Statement);
                                let statementCount = 0;
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
                                        resultObject.data = {
                                            keyList,
                                            failed: Array.from(crossAccountList),
                                            passed: Array.from(sameAccountList)
                                        };
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