const AWS = require('aws-sdk');
const logger = require('../config/logger');
const fileName = 'ElbService: ';
AWS.config.update({region: 'us-east-2'});

// This function is responsible to interact with AWS API to get the information of all existing ELBs
exports.getAllElbsInfo = (credentials, callback) => {
    let log = logger.getLogger(fileName + 'getAllElbsInfo');
    log.info('Started');
    // Instantiate an object of AWS SDK for invoking AWS API
    const elb = new AWS.ELBv2({"credentials": credentials});

    // This function invokes AWS API using the object created above to get the configuration data of all existing ELBs
    elb.describeLoadBalancers((err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.error("Error Calling describeLoadBalancers: " + JSON.stringify(err));
            callback(err, null);
        }
        else { // Return, a list containing the configuration details of all existing ELBs, to controller using the callback function
            log.info("Returning with list of ELBs: " + JSON.stringify(data.LoadBalancers));
            callback(null, data.LoadBalancers);
        }
    });
};

// This function is responsible to interact with AWS API to get the information of all listeners associated to ELB
exports.getElbListeners = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getElbListeners');
    log.info('Started');
    // Instantiate an object of AWS SDK for invoking AWS API
    const elb = new AWS.ELBv2({"credentials": credentials});

    // This function invokes AWS API using the object created above to get
    // the configuration data of all listeners associated with the ELB
    elb.describeListeners(params, (err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.error("Error Calling describeListeners: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            // Return, a list containing the configuration details of
            // all listeners associated with the requested ELB, to controller using the callback function
            log.info("Returning with list of Listeners: " + JSON.stringify(data.Listeners));
            callback(null, data.Listeners);
        }
    });
};

// This function is responsible to interact with AWS API to get the information of all existing Target Groups associated to ELB
exports.getAllTargetGroups = (credentials, callback) => {
    let log = logger.getLogger(fileName + 'getAllTargetGroups');
    log.info('Started');
    // Instantiate an object of AWS SDK for invoking AWS API
    const elb = new AWS.ELBv2({"credentials": credentials});

    // This function invokes AWS API using the object created above to get
    // the configuration data of all existing Target Groups associated with ELB
    elb.describeTargetGroups((err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.error("Error Calling describeTargetGroups: " + JSON.stringify(err));
            callback(err, null);
        }
        else {
            // Return, a list containing the configuration details of
            // all Target Groups associated with the requested ELB, to controller using the callback function
            log.info("Returning with list of Target Groups: " + JSON.stringify(data.TargetGroups));
            callback(null, data.TargetGroups);
        }
    });
};

// This function is responsible to interact with AWS API to get the information Target Health
exports.getTargetHealth = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getTargetHealth');
    log.info('Started');
    // Instantiate an object of AWS SDK for invoking AWS API
    const elb = new AWS.ELBv2({"credentials": credentials});

    // This function invokes AWS API using the object created above to get Target instance health data
    elb.describeTargetHealth(params, (err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.error("Error Calling describeTargetHealth: " + JSON.stringify(err));
            callback(err, null);
        }
        else { // Return, a list containing the configuration details of requested target instance, to controller using the callback function
            log.info("Returning with list of Target Health Descriptions: " + JSON.stringify(data.TargetHealthDescriptions));
            callback(null, data.TargetHealthDescriptions);
        }
    });
};

// This function is responsible to interact with AWS API to get the information of ELB metric statistics
exports.getMetricStatistics = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getMetricStatistics');
    log.info('Started');
    // Instantiate an object of AWS SDK for invoking AWS API
    const cloudWatch = new AWS.CloudWatch({"credentials": credentials});

    // This function invokes AWS API using the object created above to get the metrics data of ELB
    cloudWatch.getMetricStatistics(params, (err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.error("Error Calling getMetricStatistics: " + JSON.stringify(err));
            callback(err, null);
        }
        else { // Return, a list containing the metric details of requested ELB, to controller using the callback function
            log.info("Returning with list of Metric Statistics: " + JSON.stringify(data.Datapoints));
            callback(null, data.Datapoints);
        }
    });
};

// This function is responsible to interact with AWS API to get the information of listener ports
exports.getElbListenerPorts = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getElbListenerPorts');
    log.info('Started');
    // Instantiate an object of AWS SDK for invoking AWS API
    const elb = new AWS.ELBv2({"credentials": credentials});

    // This function invokes AWS API using the object created above to get
    // the configuration data of all ports associated with the listener
    elb.describeListeners(params, (err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.error("Error Calling describeListeners: " + JSON.stringify(err));
            callback(err, null);
        }
        else { // Return, a list of ports assigned to the requested listener, to controller using the callback function
            let ports = [];
            data.Listeners.forEach(listener => {
                ports.push(listener.Port);
            });
            log.info("Returning with list of Listener Ports: " + JSON.stringify(ports));
            callback(null, ports);
        }
    });
};

// This function is responsible to interact with AWS API to get the information of all input ports assigned to security group
exports.getSecurityGroupInputPorts = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getSecurityGroupInfo');
    log.info('Started');
    // Instantiate an object of AWS SDK for invoking AWS API
    const ec2 = new AWS.EC2({"credentials": credentials});

    // This function invokes AWS API using the object created above to get
    // the configuration data of all input ports assigned to the security group
    ec2.describeSecurityGroups(params, (err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.error("Error Calling describeSecurityGroups: " + JSON.stringify(err));
            callback(err, null);
        }
        else { // Return, a list of input ports assigned to the security group, to controller using the callback function
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

// This function is responsible to interact with AWS API to get the information of delete attribute
exports.getElbDeleteAttribute = (params, credentials, callback) => {
    let log = logger.getLogger(fileName + 'getElbAttributes');
    log.info('Started');
    // Instantiate an object of AWS SDK for invoking AWS API
    const elb = new AWS.ELBv2({"credentials": credentials});

    // This function invokes AWS API using the object created above to get the delete attribute data of ELB
    elb.describeLoadBalancerAttributes(params, (err, data) => {
        if (err) { // To handle any errors occurred while invoking AWS API
            log.error("Error Calling describeLoadBalancerAttributes: " + JSON.stringify(err));
            callback(err, null);
        }
        else { // Return, a list of attributes containing the key deletion_protection.enabled, to controller using the callback function
            log.info("Returning with list of attributes: " + JSON.stringify(data.Attributes));
            let attributeList = data.Attributes;
            attributeList.forEach(attribute => {
                if (attribute.Key === "deletion_protection.enabled")
                    callback(null, attribute.Value);
            });
        }
    });
};