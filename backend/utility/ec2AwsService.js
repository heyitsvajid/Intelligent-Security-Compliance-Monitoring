const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-west-1' })
AWS.config.apiVersions = {
    cloudwatch: '2010-08-01',
  };
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
        console.log(response);
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

exports.getMetricsStatistics = function (creds, instanceId, callback) {
    console.log(instanceId);
    let log = logger.getLogger(fileName + 'getMetricsStatistics')
    log.info("Started")

    let cloudwatchClient = new AWS.CloudWatch({"credentials": creds});
    console.log(cloudwatchClient);
    var MS_PER_MINUTE = 60000;
    var myStartDate = new Date(new Date - 60 * MS_PER_MINUTE);
    //console.log(date);
    var params = {
        EndTime: new Date(),
        StartTime : myStartDate,
        MetricName : "CPUUtilization",
        Namespace : "AWS/EC2",
        Period: 3600,
        Statistics: [
            "Average"
        ],
        Dimensions: [
            {
              Name: "InstanceId", /* required */
              Value:  instanceId/* required */
            },
            /* more items */
          ]
    };
    cloudwatchClient.getMetricStatistics(params, function (err, response) {
        if (err){
            log.error("Error Calling getMetricsStatistics: " + JSON.stringify(err));
            callback(err,null)
            return
        }
        let metrics = response.Datapoints;
        log.info("Returning with list: " + JSON.stringify(metrics[0].Average))
        callback(null,metrics[0].Average)
    })
}

exports.getAllUnrestrictedSecurityGroup=function(creds,securityGroupsList,callback){
    let log = logger.getLogger(fileName + 'getAllUnrestrictedSecurityGroup API')
    log.info("Started")

    const ec2Client = new AWS.EC2({"credentials": creds});
    const params={
        GroupIds: securityGroupsList
    };

    ec2Client.describeSecurityGroups(params, function (err, data) {
        if (err) {
            log.error("Error Calling describeSecurityGroups: " + JSON.stringify(err));
            callback(err,null)
            return
        }
        let unrestrictedSecurityGroups = [];
        let securityGroups=data.SecurityGroups;
        let passed=set();
        let failed=set();
        for(let i=0;i<securityGroups.length;i++) {
            let ingress=securityGroups[i].IpPermissions;
            for(let j=0;j<ingress.length;j++) {
                if(ingress[j].IpProtocol==-1){
                    for(let k=0;k<ingress[j].IpRanges.length;k++){
                        let trafficIp=ingress[j].IpRanges[k].CidrIp;
                        if(trafficIp==='0.0.0.0/0'){
                            failed.push(securityGroups[i].GroupId);
                        }
                        else{
                            passed.push(securityGroups[i].GroupId);
                        }
                    }
                }
            }
            
        }
        log.info("Returning with list: " + JSON.stringify(unrestrictedSecurityGroups))
        callback(null,passed,failed)
    })
}

exports.describeAddresses=function(creds,callback){
    let log = logger.getLogger(fileName + 'getAllUnrestrictedSecurityGroup API')
    log.info("Started")

    const ec2Client = new AWS.EC2({"credentials": creds});
    const params={
    };

    ec2Client.describeAddresses(params,function(err,listAddressDescription){
        if (err) {
            log.error("Error Calling describeSecurityGroups: " + JSON.stringify(err));
            callback(err,null)
            return
        }
    callback(null,listAddressDescription.Addresses);
    })
}