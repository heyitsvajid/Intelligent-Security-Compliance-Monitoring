const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const fileName = "ElbController: ";
const ElbService = require('../utility/elbService');
const appConfig = require('../config/appConfig');
const credentials = appConfig.getCredentials();

exports.checkElbListenerSecurity = (req, res) => {
    let log = logger.getLogger(fileName + 'checkListenerSecurity API');
    let resultObject = new Model.ResultObject();

    ElbService.getAllElbsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling ElbService.getAllElbsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let elbList = data;
            let applicationElbs = [];
            let insecureListeners = [];
            let secureListeners = [];
            let params = {};
            elbList.forEach(elb => {
                if (elb.Type === "application") applicationElbs.push(elb);
            });
            let count = 0;
            applicationElbs.forEach(applicationElb => {
                params = {LoadBalancerArn: applicationElb.LoadBalancerArn};
                ElbService.getElbListeners(params, credentials, (err, data) => {
                    if (err) {
                        log.error("Error Calling ElbService.getElbListeners: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject);
                    }
                    else {
                        let isSecure = false;
                        data.forEach(listener => {
                            if (listener.Protocol === "HTTPS" || listener.Protocol === "SSL") isSecure = true;
                        });
                        if (isSecure) secureListeners.push(applicationElb.LoadBalancerName);
                        else insecureListeners.push(applicationElb.LoadBalancerName);
                        count++;
                        if (count === applicationElbs.length) {
                            resultObject.success = true;
                            resultObject.data = {
                                secure: secureListeners,
                                insecure: insecureListeners
                            };
                            res.status(200).json(resultObject);
                        }
                    }
                });
            });
        }
    });
};

exports.checkElbHealth = (req, res) => {
    let log = logger.getLogger(fileName + 'checkElbHealth API');
    let resultObject = new Model.ResultObject();

    ElbService.getAllTargetGroups(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling ElbService.getAllTargetGroups: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let targetGroupList = data;
            let healthyInstanceList = [];
            let unhealthyInstanceList = [];
            let params = {};
            let count = 0;
            targetGroupList.forEach(targetGroup => {
                params = {TargetGroupArn: targetGroup.TargetGroupArn};
                ElbService.getTargetHealth(params, credentials, (err, data) => {
                    if (err) {
                        log.error("Error Calling ElbService.getTargetHealth: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject);
                    }
                    else {
                        data.forEach(target => {
                            if (target.TargetHealth.State === "healthy") healthyInstanceList.push(target.Target.Id);
                            else unhealthyInstanceList.push(target.Target.Id);
                        });
                        count++;
                        if (count === targetGroupList.length) {
                            resultObject.success = true;
                            resultObject.data = {
                                healthyInstances: healthyInstanceList,
                                unhealthyInstances: unhealthyInstanceList
                            };
                            res.status(200).json(resultObject);
                        }
                    }
                });
            });
        }
    });
};

exports.checkIdleElbs = (req, res) => {
    let log = logger.getLogger(fileName + 'checkIdleElbs API');
    let resultObject = new Model.ResultObject();

    ElbService.getAllElbsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling ElbService.getAllElbsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let elbList = data;
            let idleElbList = [];
            let nonIdleElbList = [];
            let params = {};
            let startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            let count = 0;
            elbList.forEach(elb => {
                params = {
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
                ElbService.getMetricStatistics(params, credentials, (err, data) => {
                    if (err) {
                        log.error("Error Calling ElbService.getMetricStatistics: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject);
                    }
                    else {
                        let requestCount = 0;
                        data.forEach(dataPoint => {
                            requestCount += dataPoint.Sum;
                        });
                        if (requestCount === 0) idleElbList.push(elb.LoadBalancerName);
                        else nonIdleElbList.push(elb.LoadBalancerName);
                        count++;
                        if (count === elbList.length) {
                            resultObject.success = true;
                            resultObject.data = {
                                idleElbs: idleElbList,
                                nonIdleElbs: nonIdleElbList
                            };
                            res.status(200).json(resultObject);
                        }
                    }
                });
            });
        }
    });
};

exports.checkElbSecurityGroup = (req, res) => {
    let log = logger.getLogger(fileName + 'checkElbSecurityGroup API');
    let resultObject = new Model.ResultObject();

    ElbService.getAllElbsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling ElbService.getAllElbsInfo: " + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
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
                ElbService.getElbListenerPorts(listenerParams, credentials, (err, data) => {
                    if (err) {
                        log.error("Error Calling ElbService.getElbListenerPorts: " + JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject);
                    }
                    else {
                        listenerPorts = new Set(data);
                    }
                });
                let securityGroupList = elb.SecurityGroups;
                let sgCount = 0;
                securityGroupList.forEach(securityGroup => {
                    securityGroupParams = {GroupIds: [securityGroup]};
                    ElbService.getSecurityGroupInputPorts(securityGroupParams, credentials, (err, data) => {
                        if (err) {
                            log.error("Error Calling ElbService.getSecurityGroupInputPorts: ", JSON.stringify(err));
                            resultObject.success = false;
                            resultObject.errorMessage = err.message;
                            res.status(400).json(resultObject);
                        }
                        else {
                            let securityGroupInputPorts = new Set(data);
                            let extraPorts = securityGroupInputPorts - listenerPorts;
                            if (extraPorts.size === 0) secureGroupList.add(securityGroup);
                            else insecureGroupList.add(securityGroup);
                            sgCount++;
                            if (sgCount === securityGroupList.length) elbCount++;
                            if (elbCount === elbList.length && sgCount === securityGroupList.length) {
                                resultObject.success = true;
                                resultObject.data = {
                                    secureGroups: Array.from(secureGroupList),
                                    insecureGroups: Array.from(insecureGroupList)
                                };
                                res.status(200).json(resultObject);
                            }
                        }
                    });
                });
            });
        }
    });
};

exports.checkInternetFacingElbs = (req, res) => {
    let log = logger.getLogger(fileName + 'checkInternetFacingElbs API');
    let resultObject = new Model.ResultObject();

    ElbService.getAllElbsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling ElbService.getAllElbsInfo: ", JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let elbList = data;
            let internetFacingElbList = [];
            let internalElbList = [];
            elbList.forEach(elb => {
                if (elb.Scheme === 'internet-facing') internetFacingElbList.push(elb.LoadBalancerName);
                else internalElbList.push(elb.LoadBalancerName);
            });
            resultObject.success = true;
            resultObject.data = {
                internetFacingElbs: internetFacingElbList,
                internalElbs: internalElbList
            };
            res.status(200).json(resultObject);
        }
    });
};

exports.checkElbDeleteProtection = (req, res) => {
    let log = logger.getLogger(fileName + 'checkElbDeleteProtection API');
    let resultObject = new Model.ResultObject();

    ElbService.getAllElbsInfo(credentials, (err, data) => {
        if (err) {
            log.error("Error Calling ElbService.getAllElbsInfo: ", JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message;
            res.status(400).json(resultObject);
        }
        else {
            let elbList = data;
            let deleteProtectionEnabledList = [];
            let deleteProtectionDisabledList = [];
            let params = {};
            let elbCount = 0;
            elbList.forEach(elb => {
                params = {LoadBalancerArn: elb.LoadBalancerArn};
                ElbService.getElbDeleteAttribute(params, credentials, (err, isDeleteProtectionEnabled) => {
                    if (err) {
                        log.error("Error Calling ElbService.getElbAttributes: ", JSON.stringify(err));
                        resultObject.success = false;
                        resultObject.errorMessage = err.message;
                        res.status(400).json(resultObject);
                    }
                    else {
                        if (isDeleteProtectionEnabled === "true")
                            deleteProtectionEnabledList.push(elb.LoadBalancerName);
                        else
                            deleteProtectionDisabledList.push(elb.LoadBalancerName);
                        elbCount++;
                        if (elbCount === elbList.length) {
                            resultObject.success = true;
                            resultObject.data = {
                                deleteProtectionEnabled: deleteProtectionEnabledList,
                                deleteProtectionDisabled: deleteProtectionDisabledList
                            };
                            res.status(200).json(resultObject);
                        }
                    }
                });
            });
        }
    });
};