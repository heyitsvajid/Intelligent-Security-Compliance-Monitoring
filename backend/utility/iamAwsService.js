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

    // Create an instance of AWS SDK to invoked AWS APIs
    const iamClient = new AWS.IAM({"credentials": creds});

    // Invoke AWS API to get the details of all existing IAM users
    iamClient.listUsers({}, function (err, response) {
        if (err){ // To handle errors occurred while calling AWS API and return error message
            log.error("Error Calling Listing Users: " + JSON.stringify(err));
            callback(err,null)
            return
        }
        iamUsersList=[];
        let usersInfo=response.Users;
        let listOfUsers = iamUsersList;
        log.info("Users list: " + JSON.stringify(usersInfo))
        callback(null,usersInfo); // return list of all existing IAM users an their configuration
    })
}

exports.getAllAccessKeys=function(creds,userName,callback){
    let log = logger.getLogger(fileName + '')
    log.info("Started")
    // Create an instance of AWS SDK to invoked AWS APIs
    const iamClient = new AWS.IAM({"credentials": creds}); 
        let params={
            UserName:userName
        }
    // Invoke AWS API to get the details of Access keys associated with requested IAM user
        iamClient.listAccessKeys(params,function(err,data){
            if (err){ // To handle errors occurred while calling AWS API and return error message
                log.error("Error Calling Listing Users: " + JSON.stringify(err));
                callback(err,null)
                return
            } 
            callback(null,data); // return list of all access keys associated with requested IAM user
        })      
        
    };

exports.getAllAttachedPolicies=function(creds,userName,callback){
    let log = logger.getLogger(fileName + '')
    log.info("Started")
    // Create an instance of AWS SDK to invoked AWS APIs
    const iamClient = new AWS.IAM({"credentials": creds}); 
        let params={
            UserName:userName
        }
    // Invoke AWS API to get the details of user policies attached to requested IAM user
        iamClient.listAttachedUserPolicies(params,function(err,data){
            if (err){ // To handle errors occurred while calling AWS API and return error message
                log.error("Error Calling Listing Users: " + JSON.stringify(err));
                callback(err,null)
                return
            } 
            callback(null,data); // return list of all user policies attached to requested IAM user
        })      
        
    };
    
exports.getAllSSHAccessKeys=function(creds,userName,callback){
    let log = logger.getLogger(fileName + '')
    log.info("Started")
    // Create an instance of AWS SDK to invoked AWS APIs
    const iamClient = new AWS.IAM({"credentials": creds}); 
        let params={
            UserName:userName
        }
    // Invoke AWS API to get the details of SSH public keys associated with requested user
        iamClient.listSSHPublicKeys(params,function(err,data){
            if (err){ // To handle errors occurred while calling AWS API and return error message
                log.error("Error Calling Listing Users: " + JSON.stringify(err));
                callback(err,null)
                return
            } 
            callback(null,data); // return list of all SSH public keys associated with requested user
        })      
        
    };