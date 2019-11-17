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
                                    failure: Array.from(exposedKeyList),
                                    success: Array.from(nonExposedKeyList)
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