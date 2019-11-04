const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-west-1' })
AWS.config.apiVersions = {
    cloudwatch: '2010-08-01',
  };
const logger = require('../config/logger')
const fileName = 'awsService: '
var async = require("async");


exports.getAllIAMUsersKeyInfo = function (creds, callback) {
    let log = logger.getLogger(fileName + '')
    log.info("Started")

    const iamClient = new AWS.IAM({"credentials": creds});

    iamClient.listUsers({}, function (err, response) {
        if (err){
            log.error("Error Calling Listing Users: " + JSON.stringify(err));
            callback(err,null)
            return
        }
        iamUsersList=[];
        let usersInfo=response.Users;
        let listOfUsers = iamUsersList;
        log.info("Users list: " + JSON.stringify(usersInfo))
        callback(null,usersInfo);
    })
}

exports.getAllAccessKeys=function(creds,userName,callback){
    let log = logger.getLogger(fileName + '')
    log.info("Started")
    const iamClient = new AWS.IAM({"credentials": creds}); 
        let params={
            UserName:userName
        }
        iamClient.listAccessKeys(params,function(err,data){
            if (err){
                log.error("Error Calling Listing Users: " + JSON.stringify(err));
                callback(err,null)
                return
            } 
            callback(null,data); 
        })      
        
    };

exports.getAllAttachedPolicies=function(creds,userName,callback){
    let log = logger.getLogger(fileName + '')
    log.info("Started")
    const iamClient = new AWS.IAM({"credentials": creds}); 
        let params={
            UserName:userName
        }
        iamClient.listAttachedUserPolicies(params,function(err,data){
            if (err){
                log.error("Error Calling Listing Users: " + JSON.stringify(err));
                callback(err,null)
                return
            } 
            callback(null,data); 
        })      
        
    };
    
exports.getAllSSHAccessKeys=function(creds,userName,callback){
    let log = logger.getLogger(fileName + '')
    log.info("Started")
    const iamClient = new AWS.IAM({"credentials": creds}); 
        let params={
            UserName:userName
        }
        iamClient.listSSHPublicKeys(params,function(err,data){
            if (err){
                log.error("Error Calling Listing Users: " + JSON.stringify(err));
                callback(err,null)
                return
            } 
            callback(null,data); 
        })      
        
    };