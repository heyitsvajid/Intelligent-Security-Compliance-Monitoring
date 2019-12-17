const AWS = require('aws-sdk');
const logger = require('../config/logger');
const fileName = 'CloudTrailService: ';
AWS.config.update({region: 'us-east-2'});

// This function is responsible to interact with AWS API to get trail status data
exports.getTrailStatus = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getTrailStatus');
    log.info('Started');
    // Instantiate an object of AWS SDK for invoking AWS API
    const cloudTrail = new AWS.CloudTrail({"credentials": credentials});

    // This function invokes AWS API using the object created above to get the status of a trail
    cloudTrail.getTrailStatus(params, (err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.error("Error Calling getTrailStatus: " + JSON.stringify(err));
            callback(err, null);
        }
        else { // Return the status of requested trail to controller using the callback function
            log.info("Returning with trail status: " + JSON.stringify(data));
            callback(null, data);
        }
    });
};

// This function is responsible to interact with AWS API to get the information of all existing trails
exports.getAllTrailsInfo = (credentials, callback) => {
    let log = logger.getLogger(fileName + 'getAllTrailsInfo');
    log.info("Started");
    // Instantiate an object of AWS SDK for invoking AWS API
    const cloudTrail = new AWS.CloudTrail({"credentials": credentials});

    // This function invokes AWS API using the object created above to get the configuration data of all existing trails
    cloudTrail.describeTrails((err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.error("Error Calling describeTrails: " + JSON.stringify(err));
            callback(err, null);
        }
        else { // Return a list containing the configuration details of all existing trails to controller using the callback function
            log.info("Returning with list of trails: " + JSON.stringify(data.trailList));
            callback(null, data.trailList);
        }
    });
};

// This function is responsible to interact with AWS API to get the logging information of S3 bucket
exports.getBucketLogging = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getBucketLogging');
    log.info("Started");
    // Instantiate an object of AWS SDK for invoking AWS API
    const s3 = new AWS.S3({"credentials": credentials});

    // This function invokes AWS API using the object created above to get the logging data of S3 buckets
    s3.getBucketLogging(params, (err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.info("Error Calling getBucketLogging: " + JSON.stringify(err));
            callback(err, null);
        }
        else { // Return an object containing the logging information of requested bucket to controller using the callback function
            log.info("Returning with bucket logging for " + params.Bucket + ": " + JSON.stringify(data));
            callback(null, data);
        }
    });
};

// This function is responsible to interact with AWS API to get the versioning information of S3 bucket
exports.getBucketVersioning = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getBucketVersioning');
    log.info("Started");
    // Instantiate an object of AWS SDK for invoking AWS API
    const s3 = new AWS.S3({"credentials": credentials});

    // This function invokes AWS API using the object created above to get the versioning data of S3 buckets
    s3.getBucketVersioning(params, (err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.info("Error Calling getBucketVersioning: " + JSON.stringify(err));
            callback(err, null);
        }
        else { // Return an object containing the versioning information of requested bucket to controller using the callback function
            log.info("Returning with bucket Versioning for " + params.Bucket + ": " + JSON.stringify(data));
            callback(null, data);
        }
    });
};

// This function is responsible to interact with AWS API to get the ACL information of S3 bucket
exports.getBucketAcl = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getBucketAcl');
    log.info("Started");
    // Instantiate an object of AWS SDK for invoking AWS API
    const s3 = new AWS.S3({"credentials": credentials});

    // This function invokes AWS API using the object created above to get the ACL data of S3 buckets
    s3.getBucketAcl(params, (err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.info("Error Calling getBucketAcl: " + JSON.stringify(err));
            callback(err, null);
        }
        else { // Return an object containing the ACL information of requested bucket to controller using the callback function
            log.info("Returning with bucket ACL for " + params.Bucket + ": " + JSON.stringify(data));
            callback(null, data);
        }
    });
};