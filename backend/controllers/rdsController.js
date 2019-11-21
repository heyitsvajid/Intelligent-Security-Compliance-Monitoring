const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const RDSService = require('../utility/rdsService');
const fileName = "rdsController: ";
const AWS = require('aws-sdk')

/**
 * Servive:RDS
 * Rule: Enable AWS RDS Automated Backups.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of failed and success bucket names for this rule..
 */
exports.rdsAutomatedBackup = function(req, res) {
    let log = logger.getLogger(fileName + 'rdsAutomatedBackup API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });

    RDSService.getAllRDSInstanceList(creds, function(err, rdsList) {
        if (err) {
            log.error("Error Calling RDSService.getAllRDSInstanceList: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All RDS List: " + JSON.stringify(rdsList));        
        let failed = [];
        let passed = [];
        let dbIdentifiers = Object.keys(rdsList) 
        for(let i = 0; i<dbIdentifiers.length; i++){
            let instanceDescription = rdsList[dbIdentifiers[i]]
            if(instanceDescription.BackupRetentionPeriod <= 0){
                failed.push(dbIdentifiers[i])
            }else{
                passed.push(dbIdentifiers[i])
            }
        }
        resultObject.success = true
        let data = {
            rdsList,
            passed,
            failed
         }
         resultObject.data = data
        res.status(200).json(resultObject);
    })   
     
}


/**
 * Servive:RDS
 * Rule: Enable AWS RDS Deletion Protection.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of failed and success bucket names for this rule..
 */
exports.rdsDeletionProtection = function(req, res) {
    let log = logger.getLogger(fileName + 'rdsDeletionProtection API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });

    RDSService.getAllRDSInstanceList(creds, function(err, rdsList) {
        if (err) {
            log.error("Error Calling RDSService.getAllRDSInstanceList: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All RDS List: " + JSON.stringify(rdsList));        
        let failed = [];
        let passed = [];
        let dbIdentifiers = Object.keys(rdsList) 
        for(let i = 0; i<dbIdentifiers.length; i++){
            let instanceDescription = rdsList[dbIdentifiers[i]]
            if(instanceDescription.DeletionProtection){
                passed.push(dbIdentifiers[i])
            }else{
                failed.push(dbIdentifiers[i])
            }
        }
        resultObject.success = true
        let data = {
            rdsList,
            passed,
            failed
         }
         resultObject.data = data
        res.status(200).json(resultObject);
    })     
}

/**
 * Servive:RDS
 * Rule: Enable AWS RDS Encryption.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of failed and success bucket names for this rule..
 */
exports.rdsEncryption = function(req, res) {
    let log = logger.getLogger(fileName + 'rdsEncryption API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });

    RDSService.getAllRDSInstanceList(creds, function(err, rdsList) {
        if (err) {
            log.error("Error Calling RDSService.getAllRDSInstanceList: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All RDS List: " + JSON.stringify(rdsList));        
        let failed = [];
        let passed = [];
        let dbIdentifiers = Object.keys(rdsList) 
        for(let i = 0; i<dbIdentifiers.length; i++){
            let instanceDescription = rdsList[dbIdentifiers[i]]
            if(instanceDescription.StorageEncrypted){
                passed.push(dbIdentifiers[i])
            }else{
                failed.push(dbIdentifiers[i])
            }
        }
        resultObject.success = true
        let data = {
            rdsList,
            passed,
            failed
         }
         resultObject.data = data
        res.status(200).json(resultObject);
    })     
}

// /**
//  * Servive:RDS
//  * Rule: Enable AWS RDS Encryption.
//  * 
//  * @param accountId
//  * @param accountKey 
//  * 
//  * @returns List of failed and success bucket names for this rule..
//  */
// exports.rdsEncryption = function(req, res) {
//     let log = logger.getLogger(fileName + 'rdsEncryption API')
//     log.info("Started: ")
//     log.info("Request Data: " + JSON.stringify(req.body))
//     let resultObject = new Model.ResultObject();

//     const creds = new AWS.Credentials({
//     accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
//     });

//     RDSService.getAllRDSInstanceList(creds, function(err, rdsList) {
//         if (err) {
//             log.error("Error Calling RDSService.getAllRDSInstanceList: " + JSON.stringify(err));
//             resultObject.success = false
//             resultObject.errorMessage = err.message
//             res.status(400).json(resultObject);
//             return
//         }
//         log.info("All RDS List: " + JSON.stringify(rdsList));        
//         let failedRDSName = [];
//         let passedRDSName = [];
//         let dbIdentifiers = Object.keys(rdsList) 
//         for(let i = 0; i<dbIdentifiers.length; i++){
//             let instanceDescription = rdsList[dbIdentifiers[i]]
//             if(instanceDescription.StorageEncrypted){
//                 passedRDSName.push(dbIdentifiers[i])
//             }else{
//                 failedRDSName.push(dbIdentifiers[i])
//             }
//         }
//         resultObject.success = true
//         let data = {
//             passedRDSName,
//             failedRDSName
//          }
//          resultObject.data = data
//         res.status(200).json(resultObject);
//     })     
// }

/**
 * Servive:RDS
 * Rule: Enable IAM Database Authentication.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of failed and success instances name for this rule.
 */
exports.rdsIAMAuthentication = function(req, res) {
    let log = logger.getLogger(fileName + 'rdsEncryption API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });

    RDSService.getAllRDSInstanceList(creds, function(err, rdsList) {
        if (err) {
            log.error("Error Calling RDSService.getAllRDSInstanceList: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All RDS List: " + JSON.stringify(rdsList));        
        let failed = [];
        let passed = [];
        let dbIdentifiers = Object.keys(rdsList) 
        for(let i = 0; i<dbIdentifiers.length; i++){
            let instanceDescription = rdsList[dbIdentifiers[i]]
            if(instanceDescription.IAMDatabaseAuthenticationEnabled){
                passed.push(dbIdentifiers[i])
            }else{
                failed.push(dbIdentifiers[i])
            }
        }
        resultObject.success = true
        let data = {
            rdsList,
            passed,
            failed
         }
         resultObject.data = data
        res.status(200).json(resultObject);
    })     
}