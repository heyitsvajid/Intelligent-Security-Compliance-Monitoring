const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-west-1' })
const logger = require('../config/logger')
const fileName = 'awsService: '

exports.getAllAmiInfo = function (creds, callback) {
    let log = logger.getLogger(fileName + 'getAllAmis')
    log.info("Started")

    const ec2Client = new AWS.EC2({"credentials": creds});

    //Get only self images.
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
        let images = response.Images;
        log.info("Returning with list: " + JSON.stringify(images))
        callback(null,images)
    })
}


exports.getAllEc2InstanceInfo = function (creds, callback) {
    let log = logger.getLogger(fileName + 'getAllEc2Info API')
    log.info("Started")

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