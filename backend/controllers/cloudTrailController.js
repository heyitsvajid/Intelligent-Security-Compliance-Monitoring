const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const fileName = "CloudTrailController: ";
const AWS = require('aws-sdk');

exports.getTrailStatus = (req, res) => {
    let log = logger.getLogger(fileName + 'getTrailStatus API');
    log.info('received input trail name: '+ req.body.trailName);
    let resultObject = new Model.ResultObject();

    const credentials = new AWS.Credentials({
        accessKeyId: 'AKIARQG3VVSJGWWBWW43', secretAccessKey: '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', sessionToken: null
    });
    const cloudTrail = new AWS.CloudTrail({"credentials": credentials, "region": 'us-east-2'});
    let params = {
        Name: req.body.trailName
    };

    cloudTrail.getTrailStatus(params, (err, data) => {
        if (err) {
            log.error("Error Calling getTrailStatus: " + JSON.stringify(err));
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

exports.describeTrails = (req, res) => {
    let log = logger.getLogger(fileName + 'describeTrails API');
    let resultObject = new Model.ResultObject();

    const credentials = new AWS.Credentials({
        accessKeyId: 'AKIARQG3VVSJGWWBWW43', secretAccessKey: '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', sessionToken: null
    });
    const cloudTrail = new AWS.CloudTrail({"credentials": credentials});

    cloudTrail.describeTrails((err, data) => {
        if (err) {
            log.error("Error Calling describeTrails: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            resultObject.success = true;
            resultObject.data = {
                describeTrails: data
            };
            res.status(200).json(resultObject);
        }
    });
};

exports.checkLogFileEncryption = (req, res) => {
    let log = logger.getLogger(fileName + 'checkLogFileEncryption API');
    let resultObject = new Model.ResultObject();

    const credentials = new AWS.Credentials({
        accessKeyId: 'AKIARQG3VVSJGWWBWW43', secretAccessKey: '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', sessionToken: null
    });
    const cloudTrail = new AWS.CloudTrail({"credentials": credentials});

    cloudTrail.describeTrails((err, data) => {
        if (err) {
            log.error("Error Calling describeTrails: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let trailList = data.trailList;
            let unencryptedList = [];
            trailList.forEach(trail => {
                if (typeof trail.KmsKeyId === "undefined"){
                    unencryptedList.push(trail.TrailARN);
                }
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