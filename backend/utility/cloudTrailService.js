const AWS = require('aws-sdk');
const logger = require('../config/logger');
const fileName = 'CloudTrailService: ';
AWS.config.update({region: 'us-east-2'});

exports.getTrailStatus = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getTrailStatus');
    log.info('Started');
    const cloudTrail = new AWS.CloudTrail({"credentials": credentials});

    cloudTrail.getTrailStatus(params, (err, data) => {
        if (err) {
            log.error("Error Calling getTrailStatus: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            log.info("Returning with trail status: " + JSON.stringify(data));
            callback(null, data);
        }
    });
};

exports.getAllTrailsInfo = (credentials, callback) => {
    let log = logger.getLogger(fileName + 'getAllTrailsInfo');
    log.info("Started");
    const cloudTrail = new AWS.CloudTrail({"credentials": credentials});

    cloudTrail.describeTrails((err, data) => {
        if (err) {
            log.error("Error Calling describeTrails: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            log.info("Returning with list of trails: " + JSON.stringify(data.trailList));
            callback(null, data.trailList);
        }
    });
};

//TODO: Move this to S3Service
exports.getBucketLogging = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getBucketLogging');
    log.info("Started");
    const s3 = new AWS.S3({"credentials": credentials});

    s3.getBucketLogging(params, (err, data) => {
        if (err) {
            log.info("Error Calling getBucketLogging: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            log.info("Returning with bucket logging for " + params.Bucket + ": " + JSON.stringify(data));
            callback(null, data);
        }
    });
};

//TODO: Move this to S3Service
exports.getBucketVersioning = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getBucketVersioning');
    log.info("Started");
    const s3 = new AWS.S3({"credentials": credentials});

    s3.getBucketVersioning(params, (err, data) => {
        if (err) {
            log.info("Error Calling getBucketVersioning: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            log.info("Returning with bucket Versioning for " + params.Bucket + ": " + JSON.stringify(data));
            callback(null, data);
        }
    });
};

//TODO: Move this to S3Service
exports.getBucketAcl = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getBucketAcl');
    log.info("Started");
    const s3 = new AWS.S3({"credentials": credentials});

    s3.getBucketAcl(params, (err, data) => {
        if (err) {
            log.info("Error Calling getBucketAcl: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            log.info("Returning with bucket ACL for " + params.Bucket + ": " + JSON.stringify(data));
            callback(null, data);
        }
    });
};