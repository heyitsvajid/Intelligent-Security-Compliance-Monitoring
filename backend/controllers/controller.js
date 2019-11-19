const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const AwsService = require('../utility/awsService.js');
const fileName = "Controller: ";
const AWS = require('aws-sdk')
 
/**
 * Ping API to check status of server.
 *  
 * @returns Success message.
 */
exports.ping = function(req, res) {
    let log = logger.getLogger(fileName + 'ping API')
    log.info("Started")
    res.status(200).json({
        message: 'API Up and Running!'
    });
}

/**
 * Servive:EC2
 * API to check unused amis.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of unused instances.
 */
exports.unusedAmis = function(req, res) {
    let log = logger.getLogger(fileName + 'unusedAmis API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();


    const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });
    
    AwsService.getAllEc2InstanceInfo(creds, function(err, listOfEc2Description) {
        if (err) {
            log.error("Error Calling AwsService.getAllEc2InstanceInfo: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        let usedAmiIds = []
        for (var i = 0; i < listOfEc2Description.length; i++) {
            usedAmiIds.push(listOfEc2Description[i].ImageId)
        }
        log.info("Used Ami Ids List: " + JSON.stringify(usedAmiIds));

        AwsService.getAllAmiInfo(creds, function(err, allAmiIds) {
            if (err) {
                log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
                resultObject.success = false
                resultObject.errorMessage = err.message
                res.status(400).json(resultObject);
                return
            }
            log.info("All Ami Ids List: " + JSON.stringify(allAmiIds));
            let failed = []
            let success = []
            for (var j = 0; j < allAmiIds.length; j++) {
                if (!usedAmiIds.includes(allAmiIds[j].ImageId)) {
                    failed.push(allAmiIds[j]);
                }else{
                    success.push(allAmiIds[j])
                }
            }
            resultObject.success = true
            let data = {
                amis: allAmiIds,
                failed,
                success
            }
            resultObject.data = data
            res.status(200).json(resultObject);
        })
    })
}

/**
 * Servive:EC2
 * API to get underutilizes instances.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of underutilized instances.
 */
exports.underutilizedInstances = function(req, res) {
    let log = logger.getLogger(fileName + 'generateWill API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    log.info("Rule 1: Get unused AMIs");
    res.status(200).json({
        message: 'API Up and Running!'
    });



}