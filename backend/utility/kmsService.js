const AWS = require('aws-sdk');
const logger = require('../config/logger');
const fileName = 'KmsService: ';
AWS.config.update({region: 'us-east-2'});

// This function is responsible to interact with AWS API to get the information of all existing Keys
exports.getAllKeys = (credentials, callback) => {
    let log = logger.getLogger(fileName + "getAllKeys");
    log.info("Started");
    // Instantiate an object of AWS SDK for invoking AWS API
    const kms = new AWS.KMS({"credentials": credentials});

    // This function invokes AWS API using the object created above to get the configuration data of all existing Keys
    kms.listAliases((err, data) => {
       if (err) { // To handle any errors occurred while invoking AWS API
           log.error("Error calling listAliases: " + JSON.stringify(err));
           callback(err, null);
       }
       else { // Return, a list containing the configuration details of all existing Keys, to controller using the callback function
           let keyList = [];
           data.Aliases.forEach(key => {
               if (typeof key.TargetKeyId !== "undefined") keyList.push(key);
           });
           log.info("Returning with list of keys: " + JSON.stringify(keyList));
           callback(null, keyList);
       }
    });
};

// This function is responsible to interact with AWS API to get the policy of key
exports.getKeyPolicy = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + "getKeyPolicy");
    log.info("Started");
    // Instantiate an object of AWS SDK for invoking AWS API
    const kms = new AWS.KMS({"credentials": credentials});

    // This function invokes AWS API using the object created above to get the policy of requested key
    kms.getKeyPolicy(params, (err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.error("Error calling getKeyPolicy: " + JSON.stringify(err));
            callback(err, null);
        }
        else { // Return, a list containing the policy statements of requested key, to controller using the callback function
            log.info("Returning with Key Policy: " + JSON.stringify(data.Policy));
            callback(null, JSON.parse(data.Policy));
        }
    });
};

// This function is responsible to interact with AWS API to get the information of caller identity
exports.getCallerIdentity = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + "getCallerIdentity");
    log.info("Started");
    // Instantiate an object of AWS SDK for invoking AWS API
    const sts = new AWS.STS({"credentials": credentials});

    // This function invokes AWS API using the object created above to get the account details of caller
    sts.getCallerIdentity(params, (err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.error("Error calling getCallerIdentity: " + JSON.stringify(err));
            callback(err, null);
        }
        else { // Return, an object containing the account details of the caller, to controller using the callback function
            log.info("Returning with Caller Identity: " + JSON.stringify(data));
            callback(null, data);
        }
    });
};