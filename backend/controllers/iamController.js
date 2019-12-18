const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const AwsService = require('../utility/iamAwsService.js');
const fileName = "IAM Controller: ";
const AWS = require('aws-sdk');
var async = require("async");
const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });

/**
 * Servive:IAM
 * API to check keyRotationCheck.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of IAM users with key not rotated for 90 days.
 */
exports.keyRotationCheck = function(req, res) {
    let log = logger.getLogger(fileName + 'IAM keyRotation CheckAPI')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    // This gets the configuration details of all IAM users
    AwsService.getAllIAMUsersKeyInfo(creds,function(err,listOfIAMUsers){
        if (err) { // To handle any errors during the service call and return error message
            log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        let passed=[];
        let failed=[];
        let iamList=[];
        // For each IAM user, check the created date to determine if it is older than 90 days
        for(let i=0;i<listOfIAMUsers.length;i++){
            let CreatedDate=new Date(listOfIAMUsers[i].CreateDate);
            let currentDate=new Date();
            if(Math.round((currentDate-CreatedDate)/(60*60*24))>90){
                failed.push(listOfIAMUsers[i].UserName);
            }
            else {
                passed.push(listOfIAMUsers[i].UserName);
            }
            iamList.push(listOfIAMUsers[i].UserName);
        }
        log.info("All Users with Key More than 90 days old : " + JSON.stringify(failed));
        
        resultObject.success = true
            let data = {
                iamList,
                passed,
                failed
            }
            resultObject.data = data
        // return result object with list of users created older than 90 days,
        // list of users created within 90 days and list of all IAM users
            res.status(200).json(resultObject);
    })
}

/**
 * Servive:IAM
 * API to check Unnecessary Access Keys.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of IAM users which have unnecessary Access Keys.
 */
exports.unnecessaryAccessKeys = function(req, res) {
    let log = logger.getLogger(fileName + 'IAM Unnecessary Access Keys CheckAPI')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    // This gets the configuration details of all IAM users
    AwsService.getAllIAMUsersKeyInfo(creds,function(err,listOfIAMUsers){
        if (err) { // To handle any errors during the service call and return error message
            log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Users with Key More than 90 days old : " + JSON.stringify(listOfIAMUsers));
        let listOfUsersWithUnnecessaryAccessKeys=new Set();
        let listOfUsers=[];
        const promises = [];
        // For each IAM user, get the details of access keys associated with the user
        for(let i=0;i<listOfIAMUsers.length;i++){
            promises.push(new Promise(resolve=>AwsService.getAllAccessKeys(creds,listOfIAMUsers[i].UserName,function(err,data){
            resolve(data)
        })));
        }
        Promise.all(promises)
        .then(dataSet => {
            let iamList=[];
            let passed=[];
            let failed=[];
            // For each access key received from the data, check AccessKeyMetadata parameter to check if the access is unnecessary
            for(let j=0;j<dataSet.length;j++){
                let accessKeyMetadata=dataSet[j].AccessKeyMetadata
                    if(accessKeyMetadata.length>1){
                        let counter=0;
                        for(let x=0;x<accessKeyMetadata.length;x++){
                            counter++;
                            if(accessKeyMetadata[x].Status==='Active' && counter>1){
                                failed.push(accessKeyMetadata[x].UserName);
                            }
                        }
                    }else {
                        for(let x=0;x<accessKeyMetadata.length;x++){
                            if(accessKeyMetadata[x].Status==='Active'){
                                passed.push(accessKeyMetadata[x].UserName); 
                            }
                        }
                    }
                     
            }
            for(let i=0;i<passed.length;i++){
                iamList.push(passed[i]); 
            }
            for(let i=0;i<failed.length;i++){
                iamList.push(failed[i]); 
            }
            resultObject.success = true
            let data = {
                iamList,
                passed,
                failed
            }
            resultObject.data = data
            // return result object with list of necessary access keys, list of unnecessary access keys and list of all IAM users
            res.status(200).json(resultObject);
        })
        
    })
}

/**
 * Servive:IAM
 * API to check Iam Users with Admin Access.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of Iam Users with Admin Access.
 */

exports.iamUserswithAdminAccess = function(req, res) {
    let log = logger.getLogger(fileName + 'IAM Users with Admin Access Check API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    // This gets the configuration details of all IAM users
    AwsService.getAllIAMUsersKeyInfo(creds,function(err,listOfIAMUsers){
        if (err) { // To handle any errors during the service call and return error message
            log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Users with Key More than 90 days old : " + JSON.stringify(listOfIAMUsers));
        let listOfUsersWithAdminAccess=new Set();
        
        const promises = [];
        // For each IAM user, get the list of policies attacked to each user
        for(let i=0;i<listOfIAMUsers.length;i++){
            let userName=listOfIAMUsers[i].UserName;
            promises.push(new Promise(resolve=>AwsService.getAllAttachedPolicies(creds,listOfIAMUsers[i].UserName,function(err,data){
                
                let obj={
                    userName:userName,
                    policies:data 
                }
            resolve(obj)
        })));
        }
        Promise.all(promises)
        .then(dataSet => {
            let iamList=[];
            let passed=[];
            let failed=[];
            // For each policy received from data, check the AttachedPolicies to check if the user has admin privileges
            for(let j=0;j<dataSet.length;j++){
                let policies=dataSet[j].policies;
                let AttachedPolicies= policies.AttachedPolicies; 
                for(let i=0;i<AttachedPolicies.length;i++){
                    if(AttachedPolicies[i].PolicyName==='AdministratorAccess'){
                        failed.push(dataSet[j].userName);
                    }
                }
                iamList.push(dataSet[j].userName);  
            }
            for(let i=0;i<iamList.length;i++){
                if(failed.indexOf(iamList[i])==-1){
                    passed.push(iamList[i]);
                }
            }
            resultObject.success = true
            let data = {
                iamList,
                passed,
                failed
            }
            resultObject.data = data
            // return result object with list of IAM users with admin access, list of IAM users without admin access and list of all IAM users
            res.status(200).json(resultObject);
        })
    })
}

/**
 * Servive:IAM
 * API to check Iam Users with Policy Edit Access.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of Iam Users with Policy Edit Access
 */

exports.iamUserswithPolicyEditAccess = function(req, res) {
    let log = logger.getLogger(fileName + 'IAM Users with Policy Edit Access Check API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    // This gets the configuration details of all IAM users
    AwsService.getAllIAMUsersKeyInfo(creds,function(err,listOfIAMUsers){
        if (err) { // To handle any errors during the service call and return error message
            log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Users with Key More than 90 days old : " + JSON.stringify(listOfIAMUsers));
        let listOfUsersWithPolicyEditAccess=new Set();
        let iamList=[];
        for(let i=0;i<listOfIAMUsers.length;i++){
            iamList.push(listOfIAMUsers[i].UserName);
        }
        const promises = [];
        // For each IAM user, get the list of policies attacked to each user
        for(let i=0;i<listOfIAMUsers.length;i++){
            let userName=listOfIAMUsers[i].UserName;
            promises.push(new Promise(resolve=>AwsService.getAllAttachedPolicies(creds,listOfIAMUsers[i].UserName,function(err,data){
                
                let obj={
                    userName:userName,
                    policies:data 
                }
            resolve(obj)
        })));
        }
        Promise.all(promises)
        .then(dataSet => {
            //let listOfUsers=[];
            let passed=[];
            let failed=[];
            // For each policy received from data, check the AttachedPolicies to check if the user has policy edit access
            for(let j=0;j<dataSet.length;j++){
                let policies=dataSet[j].policies;
                let AttachedPolicies= policies.AttachedPolicies; 
                for(let i=0;i<AttachedPolicies.length;i++){
                    if(AttachedPolicies[i].PolicyName==='IAMFullAccess'){
                        failed.push(dataSet[j].userName);
                    }
                }  
            }
            for(let i=0;i<iamList.length;i++){
                if(failed.indexOf(iamList[i])==-1){
                    passed.push(iamList[i]);
                }
            }
            resultObject.success = true
            let data = {
                iamList,
                passed,
                failed
            }
            resultObject.data = data
            // return result object with list of IAM users with policy edit access, list of IAM users without policy edit access and list of all IAM users
            res.status(200).json(resultObject);

            
        })
       
    })
}

/**
 * Servive:IAM
 * API to check Unused IAM Users.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of Unused IAM Users
 */

exports.unusedIamUsers = function(req, res) {
    let log = logger.getLogger(fileName + 'Unused IAM Users Check API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    // This gets the configuration details of all IAM users
    AwsService.getAllIAMUsersKeyInfo(creds,function(err,listOfIAMUsers){
        if (err) { // To handle any errors during the service call and return error message
            log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Users with Key More than 90 days old : " + JSON.stringify(listOfIAMUsers));
        let listOfIAMUsersWithKeyMoreThan90DaysOld=[];
        // For each IAM user check the created date to see if it is older than 90 days
        for(let i=0;i<listOfIAMUsers.length;i++){
            let CreatedDate=new Date(listOfIAMUsers[i].CreateDate);
            let currentDate=new Date();
            if(Math.round((currentDate-CreatedDate)/(60*60*24))>90)
                listOfIAMUsersWithKeyMoreThan90DaysOld.push(listOfIAMUsers[i].UserName);
        }
        let listOfUnusedIAMUsers=new Set();
        const promises = [];
        // For each IAM user older than 90 days get the list of all access keys associated with the user
        for(let i=0;i<listOfIAMUsersWithKeyMoreThan90DaysOld.length;i++){
            let userName=listOfIAMUsersWithKeyMoreThan90DaysOld[i];
            promises.push(new Promise(resolve=>AwsService.getAllAccessKeys(creds,userName,function(err,data){
                let obj={
                    userName:userName,
                    details:data 
                }
            resolve(obj)
        })));
        }
        Promise.all(promises)
        .then(dataSet => {
            let iamList=[];
            let passed=[];
            let failed=[];
            // For each access key received from data, check the AccessKeyMetadata parameter to determine if the user is active
            for(let j=0;j<dataSet.length;j++){
                let detail=dataSet[j].details
                let accessKeyMetadata=detail.AccessKeyMetadata
                    if(accessKeyMetadata.length==0){
                     failed.push(dataSet[j].userName)    
                    }
                    else {
                        passed.push(dataSet[j].userName);
                    }
                    iamList.push(dataSet[j].userName);
            }
            resultObject.success = true
            let data = {
                iamList,
                passed,
                failed
            }
            resultObject.data = data
            // return result object with list of active IAM users, list of inactive IAM users and list of all IAM users
            res.status(200).json(resultObject);
        })
        
    })
}

/**
 * Servive:IAM
 * API to check keyRotationCheck.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of IAM users with key not rotated for 90 days.
 */
exports.sshKeyRotationCheck = function(req, res) {
    let log = logger.getLogger(fileName + 'IAM keyRotation CheckAPI')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    // This gets the configuration details of all IAM users
    AwsService.getAllIAMUsersKeyInfo(creds,function(err,listOfIAMUsers){
        if (err) { // To handle any errors during the service call and return error message
            log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        let listOfUsersWithSSHRotationKeyMoreThan90Days=new Set();
        const promises = [];
        // For each existing IAM user, get the list of SSH public keys associated with the user
        for(let i=0;i<listOfIAMUsers.length;i++){
            let userName=listOfIAMUsers[i].UserName;
            promises.push(new Promise(resolve=>AwsService.getAllSSHAccessKeys(creds,userName,function(err,data){
                let obj={
                    userName:userName,
                    details:data 
                }
            resolve(obj)
        })));
        }
        Promise.all(promises)
        .then(dataSet => {
            let iamList=[];
            let passed=[];
            let failed=[];
            // For each SSH public key received from the data, check the created date to determine whether it is older than 90 days
            for(let j=0;j<dataSet.length;j++){
                let detail=dataSet[j].details;
                let sshPublicKeys=detail.SSHPublicKeys;
                if(sshPublicKeys.length==0){
                    failed.push(dataSet[j].userName);
                    iamList.push(dataSet[j].userName);
                    continue
                }
                for(let i=0;i<sshPublicKeys.length;i++){
                    let CreatedDate=new Date(sshPublicKeys[i].CreateDate);
                    let currentDate=new Date();
                    if(Math.round((currentDate-CreatedDate)/(60*60*24))>90){
                        failed.push(dataSet[j].userName);
                        iamList.push(dataSet[j].userName);
                    }
                }
                
            }
            for(let i=0;i<iamList.length;i++){
                if(failed.indexOf(iamList[i])==-1){
                    passed.push(iamList[i]);
                }
            }
            resultObject.success = true
            let data = {
                iamList,
                passed,
                failed
            }
            resultObject.data = data
            // return result object with list of users with SSH public keys created older than 90 days,
            // list of users with SSH public keys created within 90 days and list of all IAM users
            res.status(200).json(resultObject);

        })
       
    })
}

