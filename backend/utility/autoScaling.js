const AWS = require('aws-sdk')
const logger = require('../config/logger')
const fileName = 'networkService: ';
const openIp = "0.0.0.0/0";
const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });

let getAllAutoscalingGroups = function(params={}, callback){
    let log = logger.getLogger(fileName + 'getAllAutoscalingGroups');
    log.info("Started");
    //Passing region for region specific data
    //AWS.config.update({ region: 'us-west-2' })
    const autoScaling = new AWS.AutoScaling({"credentials":creds});
    autoScaling.describeAutoScalingGroups(params, function(err, data){
        if(err){
            log.error("error calling describeAutoScalingGroups: "+ JSON.stringify(err));
            callback(err, null);
            return;
        }

        console.log(data.AutoScalingGroups);
        callback(null, data.AutoScalingGroups);
    });
    
}

let getAllAutoscalingInstances = function(params={}, callback){
    let log = logger.getLogger(fileName + 'getAllAutoscalingGroups');
    log.info("Started");
    //Passing region for region specific data
    //AWS.config.update({ region: 'us-west-2' })
    const autoScaling = new AWS.AutoScaling({"credentials":creds});
    autoScaling.describeAutoScalingInstances(params, function(err, data){
        if(err){
            log.error("error calling describeAutoScalingInstances: "+ JSON.stringify(err));
            callback(err, null);
            return;
        }

        console.log(data.AutoScalingInstances);
        callback(null, data.AutoScalingInstances);
    });
}

module.exports = {getAllAutoscalingGroups, getAllAutoscalingInstances};