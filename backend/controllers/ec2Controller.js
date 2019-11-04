const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const AwsService = require('../utility/ec2AwsService.js');
const fileName = "Controller: ";
const AWS = require('aws-sdk');
const creds = new AWS.Credentials({
    accessKeyId: 'AKIAJIVGCX5EZE7PH75Q', secretAccessKey: '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', sessionToken: null
    });

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
    let resultObject = new Model.ResultObject();

    AwsService.getAllEc2InstanceInfo(creds, function(err, listOfEc2Description) {
        if (err) {
            log.error("Error Calling AwsService.getAllEc2InstanceInfo: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        let usedAmiIds = []
        for (var i = 0; i < listOfEc2Description.length; i++) {
            usedAmiIds.push(listOfEc2Description[i].ImageId)
        }
        log.info("Used Ami Ids List: " + JSON.stringify(usedAmiIds));

        AwsService.getAllAmiInfo(creds, function(err, allAmiIds) {
            if (err) {
                log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
                resultObject.success = false
                resultObject.errorMessage = err.message
                res.status(400).json(resultObject);
                return
            }
            log.info("All Ami Ids List: " + JSON.stringify(allAmiIds));
            let result = []
            for (var j = 0; j < allAmiIds.length; j++) {
                if (!usedAmiIds.includes(allAmiIds[j].ImageId)) {
                    result.push(allAmiIds[j]
                        );
                }
            }
            resultObject.success = true
            let data = {
                unusedAmis : result
            }
            resultObject.data = data
            res.status(200).json(resultObject);
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
    let log = logger.getLogger(fileName + 'underUtilized API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

        let underUtilizedInstances=[];
        getUnderUtilizedInstances(creds,underUtilizedInstances,function(err,underUtilizedInstancesList) {
            if (err) {
                resultObject.success = false
                resultObject.errorMessage = err.message
                res.status(400).json(resultObject);
                return
            }
            resultObject.success = true
            let data = {
                underUtilizedInstancesList : underUtilizedInstancesList
            }
            resultObject.data = data
            res.status(200).json(resultObject);
        })
}

const getUnderUtilizedInstances=(creds,underUtilizedInstances,callback)=>{
    
    AwsService.getAllEc2InstanceInfo(creds, function(err, listOfEc2Description) {
        if (err) {
            log.error("Error Calling AwsService.getAllEc2InstanceInfo: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            callback(err)
            return
        }
        for (var i = 0; i < listOfEc2Description.length; i++) {
            let instanceId=listOfEc2Description[i].InstanceId
            AwsService.getMetricsStatistics(creds,instanceId,function(err, response){
                if(err){
                    console.log(err);
                }
                if(response<=60) {
                    underUtilizedInstances.push(instanceId);
                }
            })
        }
        callback(null,underUtilizedInstances);
})
    
}


/**
 * Servive:EC2
 * API to check amis encryption enabled.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of unused instances.
 */
exports.unEncryptedAMIS = function(req, res) {
    let log = logger.getLogger(fileName + 'not encrypted EC2 AMIS API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    AwsService.getAllEc2InstanceInfo(creds, function(err, listOfEc2Description) {
        if (err) {
            log.error("Error Calling AwsService.getAllEc2InstanceInfo: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        let usedAmiIds = []
        for (var i = 0; i < listOfEc2Description.length; i++) {
            usedAmiIds.push(listOfEc2Description[i].ImageId)
        }
        log.info("Used Ami Ids List: " + JSON.stringify(usedAmiIds));

        AwsService.getAllAmiInfo(creds, function(err, allAmiIds) {
            if (err) {
                log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
                resultObject.success = false
                resultObject.errorMessage = err.message
                res.status(400).json(resultObject);
                return
            }
            log.info("All Ami Ids List: " + JSON.stringify(allAmiIds));
            let result = []
            for (var j = 0; j < allAmiIds.length; j++) {
                let blockDeviceMappings=allAmiIds[j].BlockDeviceMappings;
                for(let x=0;x<blockDeviceMappings.length;x++) {
                    if(!blockDeviceMappings[x].Ebs.Encrypted){
                        result.push(allAmiIds[j].ImageId);
                    }
                }
            }
            resultObject.success = true
            let data = {
                unEncrytedAMIs : result
            }
            resultObject.data = data
            res.status(200).json(resultObject);
        })
    })
}


/**
 * Servive:EC2
 * API to check default security groups attached to Ec2 instances 
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of unused instances.
 */
exports.unrestrictedSecurityGroupAttachedEC2Instance = function(req, res) {
    let log = logger.getLogger(fileName + 'unrestrictedSecurityGroupAttachedEC2Instance API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    AwsService.getAllEc2InstanceInfo(creds, function(err, listOfEc2Description) {
        if (err) {
            log.error("Error Calling AwsService.getAllEc2InstanceInfo: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        let usedSGs = [];
        for (var i = 0; i < listOfEc2Description.length; i++) {
            securityGroups=listOfEc2Description[i].SecurityGroups;
            for(let j=0;j<securityGroups.length;j++){
                usedSGs.push(securityGroups[i].GroupId);
            }
        }
        log.info("Used SG Ids List: " + JSON.stringify(usedSGs));

        AwsService.getAllUnrestrictedSecurityGroup(creds, usedSGs,function(err, listOfUnrestrictedSecurityGroups) {
            if (err) {
                log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
                resultObject.success = false
                resultObject.errorMessage = err.message
                res.status(400).json(resultObject);
                return
            }
            log.info("All Unrestricted SecurityGroup Ids List: " + JSON.stringify(listOfUnrestrictedSecurityGroups));
            resultObject.success = true
            let data = {
                listOfUnrestrictedSecurityGroups : listOfUnrestrictedSecurityGroups
            }
            resultObject.data = data
            res.status(200).json(resultObject);
        })
    })
}

/**
 * Servive:EC2
 * API to check UnAssociated Elastic Ips.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of unused instances.
 */
exports.unAssociatedEIPs = function(req, res) {
    let log = logger.getLogger(fileName + 'UnAssociated EIPs API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    AwsService.describeAddresses(creds,function(err,listOfAddressDescription){
        if (err) {
            log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Ami Ids List: " + JSON.stringify(listOfAddressDescription));
        let unAssociatedEIPs=[];
        for(let i=0;i<listOfAddressDescription.length;i++){
            if(!listOfAddressDescription[i].AssociationId) {
                unAssociatedEIPs.push(listOfAddressDescription[i].PublicIp);
            }
        }
        resultObject.success = true
            let data = {
                listOfUnAssociatedAddress : unAssociatedEIPs
            }
            resultObject.data = data
            res.status(200).json(resultObject);
    })
}


/**
 * Servive:EC2
 * API to check unusedEc2KeyPairs.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of unused instances.
 */
exports.unusedEc2KeyPairs = function(req, res) {
    let log = logger.getLogger(fileName + 'Unused Ec2 Key Pairs');
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();
    
    
    const ec2Client = new AWS.EC2({"credentials": creds});
    ec2Client.describeKeyPairs({},function(err,listOfKeyPairs){
        if (err) {
            log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All unused Ec2 Key Pairs List: " + JSON.stringify(listOfKeyPairs));
        let unUsedEc2KeyPairs=[];
        let keyPairsList=listOfKeyPairs.KeyPairs;
        console.log(keyPairsList);
        for(let i=0;i<keyPairsList.length;i++){
            unUsedEc2KeyPairs.push(keyPairsList[i].KeyName);
        }
        resultObject.success = true
            let data = {
                UnusedEc2keyPairsList : unUsedEc2KeyPairs
            }
            resultObject.data = data
            res.status(200).json(resultObject);
    })
}