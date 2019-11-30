const AWS = require('aws-sdk');
const logger = require('../config/logger');
const fileName = 'ElbService: ';
AWS.config.update({region: 'us-east-2'});

exports.getAllElbsInfo = (credentials, callback) => {
    let log = logger.getLogger(fileName + 'getAllElbsInfo');
    log.info('Started');
    const elb = new AWS.ELBv2({"credentials": credentials});

    elb.describeLoadBalancers((err, data) => {
        if (err) {
            log.error("Error Calling describeLoadBalancers: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            log.info("Returning with list of ELBs: " + JSON.stringify(data.LoadBalancers));
            callback(null, data.LoadBalancers);
        }
    });
};

exports.getElbListeners = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getElbListeners');
    log.info('Started');
    const elb = new AWS.ELBv2({"credentials": credentials});

    elb.describeListeners(params, (err, data) => {
        if (err) {
            log.error("Error Calling describeListeners: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            log.info("Returning with list of Listeners: " + JSON.stringify(data.Listeners));
            callback(null, data.Listeners);
        }
    });
};

exports.getAllTargetGroups = (credentials, callback) => {
    let log = logger.getLogger(fileName + 'getAllTargetGroups');
    log.info('Started');
    const elb = new AWS.ELBv2({"credentials": credentials});

    elb.describeTargetGroups((err, data) => {
        if (err) {
            log.error("Error Calling describeTargetGroups: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            log.info("Returning with list of Target Groups: " + JSON.stringify(data.TargetGroups));
            callback(null, data.TargetGroups);
        }
    });
};

exports.getTargetHealth = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getTargetHealth');
    log.info('Started');
    const elb = new AWS.ELBv2({"credentials": credentials});

    elb.describeTargetHealth(params, (err, data) => {
        if (err) {
            log.error("Error Calling describeTargetHealth: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            log.info("Returning with list of Target Health Descriptions: " + JSON.stringify(data.TargetHealthDescriptions));
            callback(null, data.TargetHealthDescriptions);
        }
    });
};

exports.getMetricStatistics = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getMetricStatistics');
    log.info('Started');
    const cloudWatch = new AWS.CloudWatch({"credentials": credentials});

    cloudWatch.getMetricStatistics(params, (err, data) => {
        if (err) {
            log.error("Error Calling getMetricStatistics: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            log.info("Returning with list of Metric Statistics: " + JSON.stringify(data.Datapoints));
            callback(null, data.Datapoints);
        }
    });
};

exports.getElbListenerPorts = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getElbListenerPorts');
    log.info('Started');
    const elb = new AWS.ELBv2({"credentials": credentials});

    elb.describeListeners(params, (err, data) => {
        if (err) {
            log.error("Error Calling describeListeners: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            let ports = [];
            data.Listeners.forEach(listener => {
                ports.push(listener.Port);
            });
            log.info("Returning with list of Listener Ports: " + JSON.stringify(ports));
            callback(null, ports);
        }
    });
};

exports.getSecurityGroupInputPorts = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getSecurityGroupInfo');
    log.info('Started');
    const ec2 = new AWS.EC2({"credentials": credentials});

    ec2.describeSecurityGroups(params, (err, data) => {
        if (err) {
            log.error("Error Calling describeSecurityGroups: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            let ports = [];
            data.SecurityGroups.forEach(securityGroup => {
                securityGroup.IpPermissions.forEach(ipPermission => {
                    if (typeof ipPermission.FromPort !== 'undefined') ports.push(ipPermission.FromPort);
                });
            });
            log.info("Returning with list of Security Group input ports: " + JSON.stringify(ports));
            callback(null, ports);
        }
    });
};

exports.getElbDeleteAttribute = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getElbAttributes');
    log.info('Started');
    const elb = new AWS.ELBv2({"credentials": credentials});

    elb.describeLoadBalancerAttributes(params, (err, data) => {
        if (err) {
            log.error("Error Calling describeLoadBalancerAttributes: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            log.info("Returning with list of attributes: " + JSON.stringify(data.Attributes));
            let attributeList = data.Attributes;
            attributeList.forEach(attribute => {
                if (attribute.Key === "deletion_protection.enabled")
                    callback(null, attribute.Value);
            });
        }
    });
};