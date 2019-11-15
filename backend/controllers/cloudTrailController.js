const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const fileName = "CloudTrailController: ";
const CloudTrailService = require('../utility/cloudTrailService');
const appConfig = require('../config/appConfig');
const credentials = appConfig.getCredentials();

exports.getTrailStatus = (req, res) => {
    let log = logger.getLogger(fileName + 'getTrailStatus API');
    log.info('received input trail name: '+ req.body.trailName);
    let resultObject = new Model.ResultObject();
    let params = {
        Name: req.body.trailName
    };

    CloudTrailService.getTrailStatus(params, credentials, (err, data) => {
        if (err) {
            log.error("Error Calling CloudTrailService.getTrailStatus: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else{
            resultObject.success = true;
            resultObject.data = {
                trailStatus: data
            };
            res.status(200).json(resultObject);
        }
    });
};

exports.getAllTrailsInfo = (req, res) => {
    let log = logger.getLogger(fileName + 'describeTrails API');
    let resultObject = new Model.ResultObject();

    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            resultObject.success = true;
            resultObject.data = {
                trailsInfo: data
            };
            res.status(200).json(resultObject);
        }
    });
};

exports.checkAccessLoggingForBuckets = (req, res) => {
    let log = logger.getLogger(fileName + 'checkAccessLoggingForBuckets API');
    let resultObject = new Model.ResultObject();

    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let trailList = data;
            let resultS3bucketList = [];
            let count = 0;
            //TODO: change this to communicate with s3 service
            trailList.forEach(trail => {
                CloudTrailService.getBucketLogging({Bucket: trail.S3BucketName}, credentials, (err, data) => {
                    if (err) {
                        log.error("Error Calling CloudTrailService.getBucketLogging: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject);
                    }
                    else {
                        if (typeof data.LoggingEnabled === "undefined") resultS3bucketList.push(trail.S3BucketName);
                        count++;
                        if (count === trailList.length) {
                            if (resultS3bucketList.length === 0) {
                                resultObject.success = true;
                                resultObject.successMessage = "All the S3 Buckets have access logging enabled";
                                res.status(200).json(resultObject);
                            }
                            else {
                                resultObject.success = false;
                                resultObject.errorMessage = "Access Logging is not enabled for " + resultS3bucketList;
                                res.status(400).json(resultObject);
                            }
                        }
                    }
                });
            });
        }
    });
};

exports.checkMfaDeleteForBuckets = (req, res) => {
    let log = logger.getLogger(fileName + 'checkMfaForBuckets API');
    let resultObject = new Model.ResultObject();

    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let trailList = data;
            let resultS3bucketList = [];
            let count = 0;
            //TODO: change this to communicate with s3 service
            trailList.forEach(trail => {
                CloudTrailService.getBucketVersioning({Bucket: trail.S3BucketName}, credentials, (err, data) => {
                    if (err) {
                        log.error("Error Calling CloudTrailService.getBucketVersioning: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject);
                    }
                    else {
                        if (data.MFADelete !== "Enabled")
                            resultS3bucketList.push(trail.S3BucketName);
                        count++;
                        if (count === trailList.length) {
                            if (resultS3bucketList.length === 0) {
                                resultObject.success = true;
                                resultObject.successMessage = "All the S3 Buckets have MFA delete enabled";
                                res.status(200).json(resultObject);
                            }
                            else {
                                resultObject.success = false;
                                resultObject.errorMessage = "MFA delete is not enabled for " + resultS3bucketList;
                                res.status(400).json(resultObject);
                            }
                        }
                    }
                });
            });
        }
    });
};

exports.checkInsecureBuckets = (req, res) => {
    let log = logger.getLogger(fileName + 'checkInsecureBuckets API');
    let resultObject = new Model.ResultObject();

    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let trailList = data;
            let resultS3bucketList = [];
            let count = 0;
            //TODO: change this to communicate with s3 service
            trailList.forEach(trail => {
                CloudTrailService.getBucketAcl({Bucket: trail.S3BucketName}, credentials, (err, data) => {
                    if (err) {
                        log.error("Error Calling CloudTrailService.getBucketAcl: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject);
                    }
                    else {
                        let grantsList = data.Grants;
                        grantsList.forEach(grantee => {
                            if (grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers')
                                resultS3bucketList.push(trail.S3BucketName);
                        });
                        count++;
                        if (count === trailList.length) {
                            if (resultS3bucketList.length === 0) {
                                resultObject.success = true;
                                resultObject.successMessage = "All the S3 Buckets are secure";
                                res.status(200).json(resultObject);
                            }
                            else {
                                resultObject.success = false;
                                resultObject.errorMessage = "Below list of S3 Buckets are  publicly accessible: " + resultS3bucketList;
                                res.status(400).json(resultObject);
                            }
                        }
                    }
                });
            });
        }
    });
};

exports.checkLogFileEncryption = (req, res) => {
    let log = logger.getLogger(fileName + 'checkLogFileEncryption API');
    let resultObject = new Model.ResultObject();

    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let trailList = data;
            let unencryptedList = [];
            trailList.forEach(trail => {
                if (typeof trail.KmsKeyId === "undefined") unencryptedList.push(trail.Name);
            });
            if (unencryptedList.length === 0) {
                resultObject.success = true;
                resultObject.successMessage = "All the Trails have log file encryption enabled";
                res.status(200).json(resultObject);
            }
            else {
                resultObject.success = false;
                resultObject.errorMessage = "Log Files not encrypted for " + unencryptedList;
                res.status(400).json(resultObject);
            }
        }
    });
};

exports.checkMultiRegionAccess = (req, res) => {
    let log = logger.getLogger(fileName + 'checkMultiRegionAccess API');
    let resultObject = new Model.ResultObject();

    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let trailList = data;
            let singleRegionList = [];
            trailList.forEach(trail => {
                if (trail.IsMultiRegionTrail === false) singleRegionList.push(trail.Name);
            });
            if (singleRegionList.length === 0) {
                resultObject.success = true;
                resultObject.successMessage = "All the Trails are enabled for global monitoring";
                res.status(200).json(resultObject);
            }
            else {
                resultObject.success = false;
                resultObject.errorMessage = "Multi region access is not enabled for " + singleRegionList;
                res.status(400).json(resultObject);
            }
        }
    });
};

exports.checkLogFileIntegrityValidation = (req, res) => {
    let log = logger.getLogger(fileName + 'checkLogFileIntegrityValidation API');
    let resultObject = new Model.ResultObject();

    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let trailList = data;
            let validationDisabledList = [];
            trailList.forEach(trail => {
                if (trail.LogFileValidationEnabled === false) validationDisabledList.push(trail.Name);
            });
            if (validationDisabledList.length === 0) {
                resultObject.success = true;
                resultObject.successMessage = "All the Trails have Log File Integrity Validation enabled";
                res.status(200).json(resultObject);
            }
            else {
                resultObject.success = false;
                resultObject.errorMessage = "Log File Integrity Validation is not enabled for " + validationDisabledList;
                res.status(400).json(resultObject);
            }
        }
    });
};