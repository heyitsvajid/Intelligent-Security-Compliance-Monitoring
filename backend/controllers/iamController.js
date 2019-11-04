const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const AwsService = require('../utility/iamAwsService.js');
const fileName = "IAM Controller: ";
const AWS = require('aws-sdk');
var async = require("async");
const creds = new AWS.Credentials({
    accessKeyId: 'AKIAJIVGCX5EZE7PH75Q', secretAccessKey: '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', sessionToken: null
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

    AwsService.getAllIAMUsersKeyInfo(creds,function(err,listOfIAMUsers){
        if (err) {
            log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        let listOfIAMUsersWithKeyMoreThan90DaysOld=[];
        for(let i=0;i<listOfIAMUsers.length;i++){
            let CreatedDate=new Date(listOfIAMUsers[i].CreateDate);
            let currentDate=new Date();
            if(Math.round((currentDate-CreatedDate)/(60*60*24))>90)
            listOfIAMUsersWithKeyMoreThan90DaysOld.push(listOfIAMUsers[i].UserName);
        }
        log.info("All Users with Key More than 90 days old : " + JSON.stringify(listOfIAMUsersWithKeyMoreThan90DaysOld));
        
        resultObject.success = true
            let data = {
                listOfIAMUsersWithKeyMoreThan90DaysOld : listOfIAMUsersWithKeyMoreThan90DaysOld
            }
            resultObject.data = data
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

    AwsService.getAllIAMUsersKeyInfo(creds,function(err,listOfIAMUsers){
        if (err) {
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
        for(let i=0;i<listOfIAMUsers.length;i++){
            promises.push(new Promise(resolve=>AwsService.getAllAccessKeys(creds,listOfIAMUsers[i].UserName,function(err,data){
            resolve(data)
        })));
        }
        Promise.all(promises)
        .then(data => {
            
            for(let j=0;j<data.length;j++){
                let accessKeyMetadata=data[j].AccessKeyMetadata
                    if(accessKeyMetadata.length>1){
                        let counter=0;
                        for(let x=0;x<accessKeyMetadata.length;x++){
                            counter++;
                            if(accessKeyMetadata[x].Status==='Active' && counter>1){
                                listOfUsersWithUnnecessaryAccessKeys.add(accessKeyMetadata[x].UserName);
                            }
                        }
                    }
            }
            return Array.from(listOfUsersWithUnnecessaryAccessKeys);
        })
        .then(returnData => {
            resultObject.success = true
            let data = {
                listOfUsersWithUnnecessaryAccessKeys : returnData
            }
            resultObject.data = data
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

    AwsService.getAllIAMUsersKeyInfo(creds,function(err,listOfIAMUsers){
        if (err) {
            log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Users with Key More than 90 days old : " + JSON.stringify(listOfIAMUsers));
        let listOfUsersWithAdminAccess=new Set();
        let listOfUsers=[];
        const promises = [];
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
        .then(data => {
            for(let j=0;j<data.length;j++){
                let policies=data[j].policies;
                let AttachedPolicies= policies.AttachedPolicies; 
                for(let i=0;i<AttachedPolicies.length;i++){
                    if(AttachedPolicies[i].PolicyName==='AdministratorAccess'){
                        listOfUsersWithAdminAccess.add(data[j].userName);
                    }
                }  
            }
            return Array.from(listOfUsersWithAdminAccess);
        })
        .then(returnData => {
            resultObject.success = true
            let data = {
                listOfUsersWithAdminAccess : returnData
            }
            resultObject.data = data
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

    AwsService.getAllIAMUsersKeyInfo(creds,function(err,listOfIAMUsers){
        if (err) {
            log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Users with Key More than 90 days old : " + JSON.stringify(listOfIAMUsers));
        let listOfUsersWithPolicyEditAccess=new Set();
        let listOfUsers=[];
        const promises = [];
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
        .then(data => {
            for(let j=0;j<data.length;j++){
                let policies=data[j].policies;
                let AttachedPolicies= policies.AttachedPolicies; 
                for(let i=0;i<AttachedPolicies.length;i++){
                    if(AttachedPolicies[i].PolicyName==='IAMFullAccess'){
                        listOfUsersWithPolicyEditAccess.add(data[j].userName);
                    }
                }  
            }
            return Array.from(listOfUsersWithPolicyEditAccess);
        })
        .then(returnData => {
            resultObject.success = true
            let data = {
                listOfUsersWithPolicyEditAccess : returnData
            }
            resultObject.data = data
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

    AwsService.getAllIAMUsersKeyInfo(creds,function(err,listOfIAMUsers){
        if (err) {
            log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Users with Key More than 90 days old : " + JSON.stringify(listOfIAMUsers));
        let listOfIAMUsersWithKeyMoreThan90DaysOld=[];
        for(let i=0;i<listOfIAMUsers.length;i++){
            let CreatedDate=new Date(listOfIAMUsers[i].CreateDate);
            let currentDate=new Date();
            if(Math.round((currentDate-CreatedDate)/(60*60*24))>90)
            listOfIAMUsersWithKeyMoreThan90DaysOld.push(listOfIAMUsers[i].UserName);
        }
        let listOfUnusedIAMUsers=new Set();
        const promises = [];
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
        .then(data => {
            for(let j=0;j<data.length;j++){
                let detail=data[j].details
                let accessKeyMetadata=detail.AccessKeyMetadata
                    if(accessKeyMetadata.length==0){
                     listOfUnusedIAMUsers.add(data[j].userName)    
                    }
            }
            return Array.from(listOfUnusedIAMUsers);
        })
        .then(returnData => {
            resultObject.success = true
            let data = {
                listOfUnusedIAMUsers : returnData
            }
            resultObject.data = data
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

    AwsService.getAllIAMUsersKeyInfo(creds,function(err,listOfIAMUsers){
        if (err) {
            log.error("Error Calling AwsService.getAllAmiIds: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        let listOfUsersWithSSHRotationKeyMoreThan90Days=new Set();
        const promises = [];
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
        .then(data => {
            for(let j=0;j<data.length;j++){
                let detail=data[j].details;
                let sshPublicKeys=detail.SSHPublicKeys;
                if(sshPublicKeys.length==0){
                    listOfUsersWithSSHRotationKeyMoreThan90Days.add(data[j].userName);
                    continue
                }
                for(let i=0;i<sshPublicKeys.length;i++){
                    let CreatedDate=new Date(sshPublicKeys[i].CreateDate);
                    let currentDate=new Date();
                    if(Math.round((currentDate-CreatedDate)/(60*60*24))>90)
                    listOfUsersWithSSHRotationKeyMoreThan90Days.add(data[j].userName);
                }
            }
            return Array.from(listOfUsersWithSSHRotationKeyMoreThan90Days);
        })
        .then(returnData => {
            resultObject.success = true
            let data = {
                listOfUsersWithSSHRotationKeyMoreThan90Days : returnData
            }
            resultObject.data = data
            res.status(200).json(resultObject);
        })
    })
}

