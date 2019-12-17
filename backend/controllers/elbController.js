const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const fileName = "ElbController: ";
const ElbService = require('../utility/elbService');
const AWS = require('aws-sdk');

// This function is the controller for API path /checkElbListenerSecurity
// This API checks the listener security for App-Tier ELBs by getting data from service
exports.checkElbListenerSecurity = (req, res) => {
    let log = logger.getLogger(fileName + 'checkListenerSecurity API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });

    // This function call gets the list of all ELBs along with their configuration information
    ElbService.getAllElbsInfo(credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling ElbService.getAllElbsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else {
            let elbList = data;
            let applicationElbs = [];
            let failed = [];
            let passed = [];
            let params = {};
            elbList.forEach(elb => { // For each ELB in the data received check if it is App-Tier ELB
                if (elb.Type === "application") applicationElbs.push(elb);
            });
            let count = 0;
            applicationElbs.forEach(applicationElb => {
                params = {LoadBalancerArn: applicationElb.LoadBalancerArn};
                // This function is invoked for each App-Tier ELB to get the listeners configuration of ELB
                ElbService.getElbListeners(params, credentials, (err, data) => {
                    if (err) { // To handle any errors occurred while invoking service
                        log.error("Error Calling ElbService.getElbListeners: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject); // returns result object with error message if error occurs
                    }
                    else { // Validate and check if there are any insecure listeners
                        let isSecure = false;
                        data.forEach(listener => { // For each listener linked to ELB, check the listen protocol used
                            if (listener.Protocol === "HTTPS" || listener.Protocol === "SSL") isSecure = true;
                        });
                        if (isSecure) passed.push(applicationElb.LoadBalancerName);
                        else failed.push(applicationElb.LoadBalancerName);
                        count++;
                        if (count === applicationElbs.length) {
                            resultObject.success = true;
                            // create a result object containing the following data:
                            // 1. a list of ELBs with secure listeners (passed)
                            // 2. a list of ELBs with insecure listeners (failed)
                            // 3. a list of all existing ELBs (elbList)
                            resultObject.data = {
                                elbList,
                                passed,
                                failed
                            };
                            // returns the result object created above containing the compliance information
                            res.status(200).json(resultObject);
                        }
                    }
                });
            });
        }
    });
};

// This function is the controller for API path /checkElbHealth
// This API checks the ELB health by getting data from service
exports.checkElbHealth = (req, res) => {
    let log = logger.getLogger(fileName + 'checkElbHealth API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });

    // This function call gets the list of all Target Groups along with their configuration information
    ElbService.getAllTargetGroups(credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling ElbService.getAllTargetGroups: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else {
            let targetGroupList = data;
            let passed = [];
            let failed = [];
            let params = {};
            let count = 0;
            targetGroupList.forEach(targetGroup => {
                params = {TargetGroupArn: targetGroup.TargetGroupArn};
                // This function is invoked for each target group to get the health configuration of target group
                ElbService.getTargetHealth(params, credentials, (err, data) => {
                    if (err) { // To handle any errors occurred while invoking service
                        log.error("Error Calling ElbService.getTargetHealth: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject); // returns result object with error message if error occurs
                    }
                    else { // Validate and check if there are any unhealthy target instances
                        data.forEach(target => { // For each target instance, check the TargetHealth.State parameter
                            if (target.TargetHealth.State === "healthy") passed.push(target.Target.Id);
                            else failed.push(target.Target.Id);
                        });
                        count++;
                        if (count === targetGroupList.length) {
                            resultObject.success = true;
                            // create a result object containing the following data:
                            // 1. a list of ELBs with healthy target instances (passed)
                            // 2. a list of ELBs with unhealthy target instances (failed)
                            // 3. a list of all existing ELBs (elbList)
                            resultObject.data = {
                                elbList: targetGroupList,
                                passed,
                                failed
                            };
                            // returns the result object created above containing the compliance information
                            res.status(200).json(resultObject);
                        }
                    }
                });
            });
        }
    });
};

// This function is the controller for API path /checkIdleElbs
// This API checks for Idle ELBs by getting data from service
exports.checkIdleElbs = (req, res) => {
    let log = logger.getLogger(fileName + 'checkIdleElbs API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });

    // This function call gets the list of all ELBs along with their configuration information
    ElbService.getAllElbsInfo(credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling ElbService.getAllElbsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else {
            let elbList = data;
            let failed = [];
            let passed = [];
            let params = {};
            let startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            let count = 0;
            elbList.forEach(elb => {
                params = { // create parameters required for getting metrics data
                    MetricName: 'RequestCount',
                    StartTime: startDate.toISOString(),
                    EndTime: new Date().toISOString(),
                    Period: 3600,
                    Namespace: 'AWS/EC2',
                    Statistics: ['Sum'],
                    Dimensions: [{
                        Name: 'LoadBalancerName',
                        Value: elb.LoadBalancerName
                    }]
                };
                // This function is invoked for each ELB to get the metrics statistics data of ELB
                ElbService.getMetricStatistics(params, credentials, (err, data) => {
                    if (err) { // To handle any errors occurred while invoking service
                        log.error("Error Calling ElbService.getMetricStatistics: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject); // returns result object with error message if error occurs
                    }
                    else { // Validate and check if there are any idle ELBs
                        let requestCount = 0;
                        data.forEach(dataPoint => { // For each ELB, check the number of requests received in last 7 days
                            requestCount += dataPoint.Sum;
                        });
                        if (requestCount === 0) failed.push(elb.LoadBalancerName);
                        else passed.push(elb.LoadBalancerName);
                        count++;
                        if (count === elbList.length) {
                            resultObject.success = true;
                            // create a result object containing the following data:
                            // 1. a list of ELBs that are not idle (passed)
                            // 2. a list of ELBs that are idle (failed)
                            // 3. a list of all existing ELBs (elbList)
                            resultObject.data = {
                                elbList,
                                failed,
                                passed
                            };
                            // returns the result object created above containing the compliance information
                            res.status(200).json(resultObject);
                        }
                    }
                });
            });
        }
    });
};

// This function is the controller for API path /checkElbSecurityGroup
// This API checks for ELb security groups by getting data from service
exports.checkElbSecurityGroup = (req, res) => {
    let log = logger.getLogger(fileName + 'checkElbSecurityGroup API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });

    // This function call gets the list of all ELBs along with their configuration information
    ElbService.getAllElbsInfo(credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling ElbService.getAllElbsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else {
            let elbList = data;
            let listenerParams = {};
            let securityGroupParams = {};
            let secureGroupList = new Set();
            let insecureGroupList = new Set();
            let elbCount = 0;
            elbList.forEach(elb => {
                let listenerPorts = {};
                listenerParams = {LoadBalancerArn: elb.LoadBalancerArn};
                // This function is invoked for each ELB to get the listener ports data of ELB
                ElbService.getElbListenerPorts(listenerParams, credentials, (err, data) => {
                    if (err) { // To handle any errors occurred while invoking service
                        log.error("Error Calling ElbService.getElbListenerPorts: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject); // returns result object with error message if error occurs
                    }
                    else {
                        listenerPorts = new Set(data);
                    }
                });
                let securityGroupList = elb.SecurityGroups; // get list of security groups associated with ELB from received data
                let sgCount = 0;
                securityGroupList.forEach(securityGroup => {
                    securityGroupParams = {GroupIds: [securityGroup]};
                    // This function is invoked for each security group associated with ELB to get the input ports data of security group
                    ElbService.getSecurityGroupInputPorts(securityGroupParams, credentials, (err, data) => {
                        if (err) { // To handle any errors occurred while invoking service
                            log.error("Error Calling ElbService.getSecurityGroupInputPorts: ", JSON.stringify(err));
                            resultObject.success = false;
                            resultObject.errorMessage = err.message;
                            res.status(400).json(resultObject); // returns result object with error message if error occurs
                        }
                        else { // Validate and check if there are any additional ports open in security groups that are not used by listeners
                            let securityGroupInputPorts = new Set(data);
                            let extraPorts = securityGroupInputPorts - listenerPorts;
                            if (extraPorts.size === 0) secureGroupList.add(securityGroup);
                            else insecureGroupList.add(securityGroup);
                            sgCount++;
                            if (sgCount === securityGroupList.length) elbCount++;
                            if (elbCount === elbList.length && sgCount === securityGroupList.length) {
                                resultObject.success = true;
                                // create a result object containing the following data:
                                // 1. a list of Security Groups that have secure input ports (passed)
                                // 2. a list of Security Groups that have additional open ports not used by any listener (failed)
                                // 3. a list of all existing ELBs (elbList)
                                resultObject.data = {
                                    elbList,
                                    passed: Array.from(secureGroupList),
                                    failed: Array.from(insecureGroupList)
                                };
                                // returns the result object created above containing the compliance information
                                res.status(200).json(resultObject);
                            }
                        }
                    });
                });
            });
        }
    });
};

// This function is the controller for API path /checkInternetFacingElbs
// This API checks for internet facing ELBs by getting data from service
exports.checkInternetFacingElbs = (req, res) => {
    let log = logger.getLogger(fileName + 'checkInternetFacingElbs API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });

    // This function call gets the list of all ELBs along with their configuration information
    ElbService.getAllElbsInfo(credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling ElbService.getAllElbsInfo: ", JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else { // Validate and check if there are any internet facing ELBs
            let elbList = data;
            let failed = [];
            let passed = [];
            elbList.forEach(elb => { // For each ELB check the Scheme parameter to see if they are internet facing
                if (elb.Scheme === 'internet-facing') failed.push(elb.LoadBalancerName);
                else passed.push(elb.LoadBalancerName);
            });
            resultObject.success = true;
            // create a result object containing the following data:
            // 1. a list of ELBs that are internal facing (passed)
            // 2. a list of ELBs that are internet facing (failed)
            // 3. a list of all existing ELBs (elbList)
            resultObject.data = {
                elbList,
                failed,
                passed
            };
            // returns the result object created above containing the compliance information
            res.status(200).json(resultObject);
        }
    });
};

// This function is the controller for API path /checkElbDeleteProtection
// This API checks delete protection for ELBs by getting data from service
exports.checkElbDeleteProtection = (req, res) => {
    let log = logger.getLogger(fileName + 'checkElbDeleteProtection API');
    let resultObject = new Model.ResultObject();
    const credentials = new AWS.Credentials({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        sessionToken: null
    });

    ElbService.getAllElbsInfo(credentials, (err, data) => {
        if (err) { // To handle any errors occurred while invoking service
            log.error("Error Calling ElbService.getAllElbsInfo: ", JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject); // returns result object with error message if error occurs
        }
        else {
            let elbList = data;
            let passed = [];
            let failed = [];
            let params = {};
            let elbCount = 0;
            elbList.forEach(elb => {
                params = {LoadBalancerArn: elb.LoadBalancerArn};
                // This function is invoked for each ELB to get the Delete Attribute information of ELB
                ElbService.getElbDeleteAttribute(params, credentials, (err, isDeleteProtectionEnabled) => {
                    if (err) { // To handle any errors occurred while invoking service
                        log.error("Error Calling ElbService.getElbAttributes: ", JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject); // returns result object with error message if error occurs
                    }
                    else { // Validate and check for delete protection by seeing isDeleteProtectionEnabled parameter
                        if (isDeleteProtectionEnabled === "true")
                            passed.push(elb.LoadBalancerName);
                        else
                            failed.push(elb.LoadBalancerName);
                        elbCount++;
                        if (elbCount === elbList.length) {
                            resultObject.success = true;
                            // create a result object containing the following data:
                            // 1. a list of ELBs with delete protection enabled (passed)
                            // 2. a list of ELBs with delete protection disabled (failed)
                            // 3. a list of all existing ELBs (elbList)
                            resultObject.data = {
                                elbList,
                                passed,
                                failed
                            };
                            // returns the result object created above containing the compliance information
                            res.status(200).json(resultObject);
                        }
                    }
                });
            });
        }
    });
};