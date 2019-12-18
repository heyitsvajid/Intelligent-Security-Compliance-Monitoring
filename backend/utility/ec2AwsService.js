

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

    // Create an instance of AWS SDK to invoked AWS APIs
    const ec2Client = new AWS.EC2({"credentials": creds});

    //Get only self images.
    var params = {
        Owners: [
            "self"
        ]
    };
    // Invoke AWS API to get the details of existing EC2 images
    ec2Client.describeImages(params, function (err, response) {
        if (err){ // To handle errors occurred while calling AWS API and return error message
            log.error("Error Calling describeImages: " + JSON.stringify(err));
            callback(err,null)
            return
        }
        console.log(response);
        let images = response.Images;
        log.info("Returning with list: " + JSON.stringify(images))
        callback(null,images) // return list of all existing images an their configuration
    })
}


exports.getAllEc2InstanceInfo = function (creds, callback) {
    let log = logger.getLogger(fileName + 'getAllEc2Info API')
    log.info("Started")

    // Create an instance of AWS SDK to invoked AWS APIs
    const ec2Client = new AWS.EC2({"credentials": creds});
    // Invoke AWS API to get the details of all existing instances
    ec2Client.describeInstances({}, function (err, data) {
        if (err) { // To handle errors occurred while calling AWS API and return error message
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
        //log.info("Returning with list: " + JSON.stringify(listOfEc2Description))
        callback(null,listOfEc2Description) // return list of all existing instances
    })
}

exports.getMetricsStatistics = function (creds, instanceId, callback) {
    console.log(instanceId);
    let log = logger.getLogger(fileName + 'getMetricsStatistics')
    log.info("Started")

    // Create an instance of AWS SDK to invoked AWS APIs
    let cloudwatchClient = new AWS.CloudWatch({"credentials": creds});
    console.log(cloudwatchClient);
    var MS_PER_MINUTE = 60000;
    var myStartDate = new Date(new Date - 60 * MS_PER_MINUTE);
    //console.log(date);
    var params = { // create parameters to get metrics data
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
    // Invoke AWS API to get the metric details of requested instance
    cloudwatchClient.getMetricStatistics(params, function (err, response) {
        if (err){ // To handle errors occurred while calling AWS API and return error message
            log.error("Error Calling getMetricsStatistics: " + JSON.stringify(err));
            callback(err,null)
            return
        }
        let metrics = response.Datapoints;
        log.info("Returning with list: " + JSON.stringify(metrics[0].Average))
        callback(null,metrics[0].Average) // return the average usage metrics of requested instance
    })
}

exports.getAllUnrestrictedSecurityGroup=function(creds,securityGroupsList,callback){
    let log = logger.getLogger(fileName + 'getAllUnrestrictedSecurityGroup API')
    log.info("Started")
    log.info(Array.from(securityGroupsList));
    // Create an instance of AWS SDK to invoked AWS APIs
    const ec2Client = new AWS.EC2({"credentials": creds});
    const params={
        GroupIds: Array.from(securityGroupsList)
    };

    // Invoke AWS API to get the details of security groups associated with the requested instance
    ec2Client.describeSecurityGroups(params, function (err, data) {
        if (err) { // To handle errors occurred while calling AWS API and return error message
            log.error("Error Calling describeSecurityGroups: " + JSON.stringify(err));
            callback(err,null)
            return
        }
        let unrestrictedSecurityGroups = [];
        console.log(data);
        let securityGroups=data.SecurityGroups;
        let passed=new Set();
        let failed=new Set();
        // For each security group, check if it is open to public
        for(let i=0;i<securityGroups.length;i++) {
            let ingress=securityGroups[i].IpPermissions;
            for(let j=0;j<ingress.length;j++) {
                if(ingress[j].IpProtocol==-1){
                    for(let k=0;k<ingress[j].IpRanges.length;k++){
                        let trafficIp=ingress[j].IpRanges[k].CidrIp;
                        console.log()
                        if(trafficIp==='0.0.0.0/0'){
                            failed.add(securityGroups[i].GroupId);
                        }
                        else{
                            passed.add(securityGroups[i].GroupId);
                        }
                    }
                }
                passed.add(securityGroups[i].GroupId);
            }
            
        }
        /*let values=passed.entries();
        while(values.next().value){
            value=values.next().value;
            if(failed.has(value)){
                passed.delete(value);
            }
        }*/

        function removeAll(originalSet, toBeRemovedSet) {
            [...toBeRemovedSet].forEach(function(v) {
              originalSet.delete(v); 
            });
          }
        removeAll(passed,failed);
        log.info("Returning with list: " + JSON.stringify(failed))
        callback(null,passed,failed) // return list of security groups associated with requested instance that are open to public
    })
}

exports.describeAddresses=function(creds,callback){
    let log = logger.getLogger(fileName + 'getAllUnrestrictedSecurityGroup API')
    log.info("Started")

    // Create an instance of AWS SDK to invoked AWS APIs
    const ec2Client = new AWS.EC2({"credentials": creds});
    const params={
    };

    // Invoke AWS API to get the details of elastic IPs associated with requested instance
    ec2Client.describeAddresses(params,function(err,listAddressDescription){
        if (err) { // To handle errors occurred while calling AWS API and return error message
            log.error("Error Calling describeSecurityGroups: " + JSON.stringify(err));
            callback(err,null)
            return
        }
    callback(null,listAddressDescription.Addresses);// return list of elastic IPs associated with requested instance
    })
}