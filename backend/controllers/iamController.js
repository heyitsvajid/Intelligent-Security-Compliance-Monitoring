const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const AwsService = require('../utility/iamAwsService.js');
const fileName = "IAM Controller: ";
const AWS = require('aws-sdk');
const creds = new AWS.Credentials({
    accessKeyId: 'AKIAJIVGCX5EZE7PH75Q', secretAccessKey: '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', sessionToken: null
    });

/**
 * Servive:IAM
 * API to check keyRotationCheck.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of IAM users with key not rotated for 90 days.
 */
exports.keyRotationCheck = function(req, res) {
    let log = logger.getLogger(fileName + 'IAM keyRotation CheckAPI')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    AwsService.getAllIAMUsersKeyInfo(creds,function(err,listOfIAMUsersWithKeyMoreThan90DaysOld){
        if (err) {
            log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Users with Key More than 90 days old : " + JSON.stringify(listOfIAMUsersWithKeyMoreThan90DaysOld));
        
        resultObject.success = true
            let data = {
                listOfIAMUsersWithKeyMoreThan90DaysOld : listOfIAMUsersWithKeyMoreThan90DaysOld
            }
            resultObject.data = data
            res.status(200).json(resultObject);
    })
}