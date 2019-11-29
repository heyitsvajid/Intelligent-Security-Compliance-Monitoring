const AWS = require('aws-sdk');
const logger = require('../config/logger');
const fileName = 'KmsService: ';
AWS.config.update({region: 'us-east-2'});

exports.getAllKeys = (credentials, callback) => {
    let log = logger.getLogger(fileName + "getAllKeys");
    log.info("Started");
    const kms = new AWS.KMS({"credentials": credentials});

    kms.listAliases((err, data) => {
       if (err) {
           log.error("Error calling listAliases: " + JSON.stringify(err));
           callback(err, null);
       }
       else {
           let keyList = [];
           data.Aliases.forEach(key => {
               if (typeof key.TargetKeyId !== "undefined") keyList.push(key);
           });
           log.info("Returning with list of keys: " + JSON.stringify(keyList));
           callback(null, keyList);
       }
    });
};

exports.getKeyPolicy = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + "getKeyPolicy");
    log.info("Started");
    const kms = new AWS.KMS({"credentials": credentials});

    kms.getKeyPolicy(params, (err, data) => {
        if (err) {
            log.error("Error calling getKeyPolicy: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            log.info("Returning with Key Policy: " + JSON.stringify(data.Policy));
            callback(null, JSON.parse(data.Policy));
        }
    });
};

exports.getCallerIdentity = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + "getCallerIdentity");
    log.info("Started");
    const sts = new AWS.STS({"credentials": credentials});

    sts.getCallerIdentity(params, (err, data) => {
        if (err) {
            log.error("Error calling getCallerIdentity: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            log.info("Returning with Caller Identity: " + JSON.stringify(data));
            callback(null, data);
        }
    });
};