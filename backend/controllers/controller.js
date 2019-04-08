const logger = require('../config/logger');
const AwsService = require('../utility/awsService.js');
const fileName = "Controller: ";

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

    AwsService.getAllEc2Info(function(err, listOfEc2Description) {
        if (err) {
            log.error("Error Calling AwsService.getAllEc2Info: " + JSON.stringify(err));
            res.status(400).json({
                message: "Internal server error"
            });
            return
        }
        let usedAmiIds = []
        for (var i = 0; i < listOfEc2Description.length; i++) {
            usedAmiIds.push(listOfEc2Description[i].ImageId)
        }
        log.info("Used Ami Ids List: " + JSON.stringify(usedAmiIds));

        AwsService.getAllAmiIds(function(err, allAmiIds) {
            if (err) {
                log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
                res.status(400).json({
                    message: "Internal server error"
                });
                return
            }
            log.info("All Ami Ids List: " + JSON.stringify(allAmiIds));
            let result = []
            for (var j = 0; j < allAmiIds.length; j++) {
                if (!usedAmiIds.includes(allAmiIds[j])) {
                    result.push(allAmiIds[j]);
                }
            }
            res.status(200).json({
                unusedAmiIds: result
            });


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