const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-west-1' })
const logger = require('../config/logger')
const fileName = 'awsService: '

exports.getAllAmiIds = function (callback) {
    let log = logger.getLogger(fileName + 'getAllAmis')
    log.info("Started")

//    const cred = new AWS.Credentials("AKIAJSU3YKGFHJVNNJNA", "ErUrgelecqGVozdxlABQb4GRGTNGS56ZUGht3zd4l");
    const creds = new AWS.Credentials({
    accessKeyId: 'AKIAJSU3YKGFHJVNNJNA', secretAccessKey: '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', sessionToken: null
    });
    const ec2Client = new AWS.EC2({"credentials": creds});
    var params = {
        Owners: [
            "self"
        ]
    };
    ec2Client.describeImages(params, function (err, response) {
        if (err){
            log.error("Error Calling describeImages: " + JSON.stringify(err));
            callback(err,null)
            return
        }
        let listOfImageIds = []
        let images = response.Images;
        log.info("describeImages response: " + JSON.stringify(images))
        for(let i=0;i<images.length;i++){
            listOfImageIds.push(images[i].ImageId)
        }
        log.info("Returning with list: " + JSON.stringify(listOfImageIds))
        callback(null,listOfImageIds)
    })
}


exports.getAllEc2Info = function (callback) {
    let log = logger.getLogger(fileName + 'getAllEc2Info API')
    log.info("Started")

//    const cred = new AWS.Credentials("AKIAJSU3YKGFHJVNNJNA", "ErUrgelecqGVozdxlABQb4GRGTNGS56ZUGht3zd4l");
    const creds = new AWS.Credentials({
    accessKeyId: 'AKIAJSU3YKGFHJVNNJNA', secretAccessKey: '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', sessionToken: null
    });
    const ec2Client = new AWS.EC2({"credentials": creds});
    ec2Client.describeInstances({}, function (err, data) {
        if (err) {
            log.error("Error Calling describeInstances: " + JSON.stringify(err));
            callback(err,null)
            return
        }
        let listOfEc2Description = []
        let reservations = data.Reservations
        for (var i = 0; i < reservations.length; i++) {
            let instances = (reservations[i].Instances)
            for (var j = 0; j < instances.length; j++) {
                listOfEc2Description.push(instances[j])
            }
        }
        log.info("Returning with list: " + JSON.stringify(listOfEc2Description))
        callback(null,listOfEc2Description)
    })
}