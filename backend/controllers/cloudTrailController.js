const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const fileName = "CloudTrailController: ";
const CloudTrailService = require('../utility/cloudTrailService');
const AWS = require('aws-sdk');

// This function is the controller for API path /getAllTrailsInfo
// This controller responds with data containing the configuration information related to all existing trails
exports.getAllTrailsInfo = (req, res) => {
    let log = logger.getLogger(fileName + 'describeTrails API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });

    // This function call is to get the list of all trails along with their configuration information
    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else {
            resultObject.success = true;
            resultObject.data = {
                trailsInfo: data
            };
            res.status(200).json(resultObject); // returns result object with list of trails and their configuration
        }
    });
};

// This function is the controller for API path /checkAccessLoggingForBuckets
// This API checks if access logging is enabled for cloud trail buckets by getting data from service
exports.checkAccessLoggingForBuckets = (req, res) => {
    let log = logger.getLogger(fileName + 'checkAccessLoggingForBuckets API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });

    // This function call gets the list of all trails along with their configuration information
    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else {
            let trailList = data;
            let passed = [];
            let failed = [];
            let count = 0;
            //TODO: change this to communicate with s3 service
            trailList.forEach(trail => {
                // This function is invoked for each trial to get the logging configuration of buckets linked to the trail
                CloudTrailService.getBucketLogging({Bucket: trail.S3BucketName}, credentials, (err, data) => {
                    if (err) { // To handle any errors occurred while invoking service
                        log.error("Error Calling CloudTrailService.getBucketLogging: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject); // returns result object with error message if error occurs
                    }
                    else { // Validate and check if access logging is enabled by using the data received from service
                        if (typeof data.LoggingEnabled === "undefined") failed.push(trail.Name);
                        else passed.push(trail.Name);
                        count++;
                        if (count === trailList.length) {
                            resultObject.success = true;
                            // create a result object containing the following data:
                            // 1. a list of trails with access logging enabled (passed)
                            // 2. a list of trails with access logging disabled (failed)
                            // 3. a list of all existing trails (trailList)
                            resultObject.data = {
                                trailList,
                                passed,
                                failed
                            };
                            // returns the result object created above containing the compliance information
                            res.status(200).json(resultObject);
                        }
                    }
                });
            });
        }
    });
};

// This function is the controller for API path /checkMfaDeleteForBuckets
// This API checks if MFA delete is enabled for cloud trail buckets by getting data from service
exports.checkMfaDeleteForBuckets = (req, res) => {
    let log = logger.getLogger(fileName + 'checkMfaForBuckets API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });

    // This function call gets the list of all trails along with their configuration information
    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else {
            let trailList = data;
            let passed = [];
            let failed = [];
            let count = 0;
            //TODO: change this to communicate with s3 service
            trailList.forEach(trail => {
                // This function is invoked for each trial to get the version configuration of buckets linked to the trail
                CloudTrailService.getBucketVersioning({Bucket: trail.S3BucketName}, credentials, (err, data) => {
                    if (err) { // To handle any errors occurred while invoking service
                        log.error("Error Calling CloudTrailService.getBucketVersioning: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject); // returns result object with error message if error occurs
                    }
                    else { // Validate and check if MFA delete is enabled by using the data received from service
                        if (data.MFADelete === "Enabled") passed.push(trail.Name);
                        else failed.push(trail.Name);
                        count++;
                        if (count === trailList.length) {
                            resultObject.success = true;
                            // create a result object containing the following data:
                            // 1. a list of trails with MFA delete enabled (passed)
                            // 2. a list of trails with MFA delete disabled (failed)
                            // 3. a list of all existing trails (trailList)
                            resultObject.data = {
                                trailList,
                                passed,
                                failed
                            };
                            // returns the result object created above containing the compliance information
                            res.status(200).json(resultObject);
                        }
                    }
                });
            });
        }
    });
};

// This function is the controller for API path /checkInsecureBuckets
// This API checks if any buckets linked to the trails are insecure by getting data from service
exports.checkInsecureBuckets = (req, res) => {
    let log = logger.getLogger(fileName + 'checkInsecureBuckets API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });

    // This function call gets the list of all trails along with their configuration information
    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else {
            let trailList = data;
            let passed = [];
            let failed = [];
            let count = 0;
            //TODO: change this to communicate with s3 service
            trailList.forEach(trail => {
                // This function is invoked for each trial to get the version configuration of buckets linked to the trail
                CloudTrailService.getBucketAcl({Bucket: trail.S3BucketName}, credentials, (err, data) => {
                    if (err) { // To handle any errors occurred while invoking service
                        log.error("Error Calling CloudTrailService.getBucketAcl: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject); // returns result object with error message if error occurs
                    }
                    else { // Validate and check if there are any insecure buckets by using the data received from service
                        let grantsList = data.Grants;
                        grantsList.forEach(grantee => {
                            if (grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers')
                                failed.push(trail.S3BucketName);
                            else if (!passed.includes(trail.S3BucketName)) passed.push(trail.S3BucketName);
                        });
                        count++;
                        if (count === trailList.length) {
                            resultObject.success = true;
                            // create a result object containing the following data:
                            // 1. a list of trails with secure buckets linked to them (passed)
                            // 2. a list of trails with insecure buckets linked to them (failed)
                            // 3. a list of all existing trails (trailList)
                            resultObject.data = {
                                trailList,
                                passed,
                                failed
                            };
                            // returns the result object created above containing the compliance information
                            res.status(200).json(resultObject);
                        }
                    }
                });
            });
        }
    });
};

// This function is the controller for API path /checkLogFileEncryption
// This API checks if the trails have log file encryption enabled by getting data from service
exports.checkLogFileEncryption = (req, res) => {
    let log = logger.getLogger(fileName + 'checkLogFileEncryption API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });

    // This function call gets the list of all trails along with their configuration information
    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else { // Validate and check if log file encryption is enabled by using the data received from service
            let trailList = data;
            let passed = [];
            let failed = [];
            trailList.forEach(trail => { // For each trail check the KmsKeyId parameter to validate
                if (typeof trail.KmsKeyId === "undefined") failed.push(trail.Name);
                else passed.push(trail.Name);
            });
            resultObject.success = true;
            // create a result object containing the following data:
            // 1. a list of trails with log file encryption enabled (passed)
            // 2. a list of trails with log file encryption disabled (failed)
            // 3. a list of all existing trails (trailList)
            resultObject.data = {
                trailList,
                passed,
                failed
            };
            // returns the result object created above containing the compliance information
            res.status(200).json(resultObject);
        }
    });
};

// This function is the controller for API path /checkMultiRegionAccess
// This API checks if the trails are enabled for multiple regions by getting data from service
exports.checkMultiRegionAccess = (req, res) => {
    let log = logger.getLogger(fileName + 'checkMultiRegionAccess API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });

    // This function call gets the list of all trails along with their configuration information
    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else { // Validate and check if trails are enabled for multiple regions by using the data received from service
            let trailList = data;
            let failed = [];
            let passed = [];
            trailList.forEach(trail => { // For each trail check the IsMultiRegionTrail parameter to validate
                if (trail.IsMultiRegionTrail === false) failed.push(trail.Name);
                else passed.push(trail.Name);
            });
            resultObject.success = true;
            // create a result object containing the following data:
            // 1. a list of trails with multiple regions enabled (passed)
            // 2. a list of trails with multiple regions disabled (failed)
            // 3. a list of all existing trails (trailList)
            resultObject.data = {
                trailList,
                passed,
                failed
            };
            // returns the result object created above containing the compliance information
            res.status(200).json(resultObject);
        }
    });
};

// This function is the controller for API path /checkLogFileIntegrityValidation
// This API checks if the trails have log file integrity validation enabled by getting data from service
exports.checkLogFileIntegrityValidation = (req, res) => {
    let log = logger.getLogger(fileName + 'checkLogFileIntegrityValidation API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });

    // This function call gets the list of all trails along with their configuration information
    CloudTrailService.getAllTrailsInfo(credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling CloudTrailService.getAllTrailsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else { // Validate and check if trails have log file integrity validation enabled by using the data received from service
            let trailList = data;
            let passed = [];
            let failed = [];
            trailList.forEach(trail => { // For each trail check the LogFileValidationEnabled parameter to validate
                if (trail.LogFileValidationEnabled === false) failed.push(trail.Name);
                else passed.push(trail.Name);
            });
            resultObject.success = true;
            // create a result object containing the following data:
            // 1. a list of trails with log file integrity validation enabled (passed)
            // 2. a list of trails with log file integrity validation disabled (failed)
            // 3. a list of all existing trails (trailList)
            resultObject.data = {
                trailList,
                passed,
                failed
            };
            res.status(200).json(resultObject); // returns the result object created above containing the compliance information
        }
    });
};