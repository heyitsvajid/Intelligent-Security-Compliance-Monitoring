const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const fileName = "CloudTrailController: ";
const CloudTrailService = require('../utility/cloudTrailService');
const AWS = require('aws-sdk');

exports.getAllTrailsInfo = (req, res) => {
    let log = logger.getLogger(fileName + 'describeTrails API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        sessionToken: null
    });

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
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        sessionToken: null
    });

    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let trailList = data;
            let successList = [];
            let failureList = [];
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
                        if (typeof data.LoggingEnabled === "undefined") failureList.push(trail.S3BucketName);
                        else successList.push(trail.S3BucketName);
                        count++;
                        if (count === trailList.length) {
                            resultObject.success = true;
                            resultObject.data = {
                                success: successList,
                                failure: failureList
                            };
                            res.status(200).json(resultObject);
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
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        sessionToken: null
    });

    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let trailList = data;
            let successList = [];
            let failureList = [];
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
                        if (data.MFADelete === "Enabled") successList.push(trail.S3BucketName);
                        else failureList.push(trail.S3BucketName);
                        count++;
                        if (count === trailList.length) {
                            resultObject.success = true;
                            resultObject.data = {
                                success: successList,
                                failure: failureList
                            };
                            res.status(200).json(resultObject);
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
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        sessionToken: null
    });

    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let trailList = data;
            let secureBucketList = [];
            let insecureBucketList = [];
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
                                insecureBucketList.push(trail.S3BucketName);
                            else secureBucketList.push(trail.S3BucketName);
                        });
                        count++;
                        if (count === trailList.length) {
                            resultObject.success = true;
                            resultObject.data = {
                                success: secureBucketList,
                                failure: insecureBucketList
                            };
                            res.status(200).json(resultObject);
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
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        sessionToken: null
    });

    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let trailList = data;
            let encryptedList = [];
            let unencryptedList = [];
            trailList.forEach(trail => {
                if (typeof trail.KmsKeyId === "undefined") unencryptedList.push(trail.Name);
                else encryptedList.push(trail.Name);
            });
            resultObject.success = true;
            resultObject.data = {
                success: encryptedList,
                failure: unencryptedList
            };
            res.status(200).json(resultObject);
        }
    });
};

exports.checkMultiRegionAccess = (req, res) => {
    let log = logger.getLogger(fileName + 'checkMultiRegionAccess API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        sessionToken: null
    });

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
            let multiRegionList = [];
            trailList.forEach(trail => {
                if (trail.IsMultiRegionTrail === false) singleRegionList.push(trail.Name);
                else multiRegionList.push(trail.Name);
            });
            resultObject.success = true;
            resultObject.data = {
                success: multiRegionList,
                failure: singleRegionList
            };
            res.status(200).json(resultObject);
        }
    });
};

exports.checkLogFileIntegrityValidation = (req, res) => {
    let log = logger.getLogger(fileName + 'checkLogFileIntegrityValidation API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        sessionToken: null
    });

    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let trailList = data;
            let validationEnabledList = [];
            let validationDisabledList = [];
            trailList.forEach(trail => {
                if (trail.LogFileValidationEnabled === false) validationDisabledList.push(trail.Name);
                else validationEnabledList.push(trail.Name);
            });
            resultObject.success = true;
            resultObject.data = {
                success: validationEnabledList,
                failure: validationDisabledList
            };
            res.status(200).json(resultObject);
        }
    });
};