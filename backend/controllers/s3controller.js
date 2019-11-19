const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const S3Service = require('../utility/s3Service');
const fileName = "s3Controller: ";
const AWS = require('aws-sdk')

/**
 * Servive:S3
 * Rule: AWS S3 Bucket Public 'FULL_CONTROL' Access.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of failed and success bucket names for this rule..
 */
exports.s3FullControlAccess = function(req, res) {
    let log = logger.getLogger(fileName + 's3FullControlAccess API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });

    S3Service.getAllS3BucketsList(creds, function(err, bucketList) {
        if (err) {
            log.error("Error Calling s3Service.getAllS3BucketsList: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Bucket List: " + JSON.stringify(bucketList));
        
        S3Service.getAllS3BucketsAcl(creds,bucketList["Buckets"], (err, bucketAcl)=>{
            if (err) {
                log.error("Error Calling s3Service.getAllS3BucketsAcl: " + JSON.stringify(err));
                resultObject.success = false
                resultObject.errorMessage = err.message
                res.status(400).json(resultObject);
                return
            }
        log.info("All Bucket Acl: " + JSON.stringify(bucketAcl));
        let failed = [];
        let passed = [];
        for(let i = 0; i<bucketAcl.length; i++){
            let ownerId = bucketAcl[i]["Owner"]["ID"]
            let grants = bucketAcl[i]["Grants"]
            for(let j = 0; j<grants.length; j++){
                if(grants[j]["Grantee"]["ID"] !== ownerId && grants[j]["Permission"] === 'FULL_CONTROL'){
                    failed.push(bucketAcl[i].Name)
                }
            }
            if(!failed.includes(bucketAcl[i].Name))
                passed.push(bucketAcl[i].Name)

        }
        resultObject.success = true
        let data = {
            bucketList,
            failed,
            passed
         }
         resultObject.data = data
        res.status(200).json(resultObject);
    
        })
    })    
}


/**
 * Servive:S3
 * Rule: Enable S3 Bucket Default Encryption.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of failed and success bucket names for this rule.
 */
exports.s3BucketEncryption = function(req, res) {
    let log = logger.getLogger(fileName + 's3BucketEncryption API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });

    S3Service.getAllS3BucketsList(creds, function(err, bucketList) {
        if (err) {
            log.error("Error Calling s3Service.getAllS3BucketsList: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Bucket List: " + JSON.stringify(bucketList));
        
        S3Service.getAllS3BucketsEncryption(creds,bucketList["Buckets"], (err, bucketEncryption)=>{
            if (err) {
                log.error("Error Calling s3Service.getAllS3BucketsEncryption: " + JSON.stringify(err));
                resultObject.success = false
                resultObject.errorMessage = err.message
                res.status(400).json(resultObject);
                return
            }
            log.info("Buckets Encryption: " + JSON.stringify(bucketEncryption));
            let passed = []
            let failed = []
            for(let i = 0; i<bucketEncryption.length; i++){
                let bucketNames =  Object.keys(bucketEncryption[i])
                log.info("Bucket Names: " + JSON.stringify(bucketNames));
                if(bucketNames.length > 0){
                    if(bucketEncryption[i][bucketNames[0]]){
                        passed.push(bucketNames[0])
                    }else{
                        failed.push(bucketNames[0])
                    }
                }
            }    
        resultObject.success = true
        let data = {
            bucketList,
            passed,
            failed
        }
        resultObject.data = data
        res.status(200).json(resultObject);
    
        })
    })    
}

/**
 * Servive:S3
 * Rule: MFA Delete for AWS S3 Buckets
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of failed and success bucket names for this rule.
 */
exports.s3BucketMfaDelete = function(req, res) {
    let log = logger.getLogger(fileName + 's3BucketEncryption API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });

    S3Service.getAllS3BucketsList(creds, function(err, bucketList) {
        if (err) {
            log.error("Error Calling s3Service.getAllS3BucketsList: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Bucket List: " + JSON.stringify(bucketList));
        
        S3Service.getAllS3BucketsVersioning(creds,bucketList["Buckets"], (err, bucketVersioning)=>{
            if (err) {
                log.error("Error Calling s3Service.getAllS3BucketsVersioning: " + JSON.stringify(err));
                resultObject.success = false
                resultObject.errorMessage = err.message
                res.status(400).json(resultObject);
                return
            }
        log.info("Buckets Without MFA/Versioning: " + JSON.stringify(bucketVersioning));
        resultObject.success = true
        let data = {
            bucketVersioning
        }
        resultObject.data = data
        res.status(200).json(resultObject);    
        })
    })    
}

/**
 * Servive:S3
 * Rule: Publicly Accessible AWS S3 Buckets.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of failed and success bucket names for this rule..
 */
exports.s3PublicAccess = function(req, res) {
    let log = logger.getLogger(fileName + 's3PublicAccess API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });

    S3Service.getAllS3BucketsList(creds, function(err, bucketList) {
        if (err) {
            log.error("Error Calling s3Service.getAllS3BucketsList: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Bucket List: " + JSON.stringify(bucketList));
        
        S3Service.getAllS3BucketsAcl(creds,bucketList["Buckets"], (err, bucketAcl)=>{
            if (err) {
                log.error("Error Calling s3Service.getAllS3BucketsAcl: " + JSON.stringify(err));
                resultObject.success = false
                resultObject.errorMessage = err.message
                res.status(400).json(resultObject);
                return
            }
        log.info("All Bucket Acl: " + JSON.stringify(bucketAcl));
        let failedBucketsName = [];
        let passedBucketsName = [];
        let PERMISSIONS = ['WRITE', 'FULL_CONTROL', 'READ_ACP', 'WRITE_ACP', 'READ']
        for(let i = 0; i<bucketAcl.length; i++){
            let ALL_USER_URI = 'http://acs.amazonaws.com/groups/global/AllUsers';
            let grants = bucketAcl[i]["Grants"]
            for(let j = 0; j<grants.length; j++){
                if(grants[j]["Grantee"]["URI"] === ALL_USER_URI && PERMISSIONS.includes(grants[j]["Permission"]) && !failedBucketsName.includes(bucketAcl[i].Name)){
                    failedBucketsName.push(bucketAcl[i].Name)
                }
            }
            if(!failedBucketsName.includes(bucketAcl[i].Name))
                passedBucketsName.push(bucketAcl[i].Name)

        }
        resultObject.success = true
        let data = {
            failedBucketsName,
            passedBucketsName
         }
         resultObject.data = data
        res.status(200).json(resultObject);
    })
    })    
}

/**
 * Servive:S3
 * Rule: S3 Buckets Encrypted with Customer-Provided CMKs.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of failed and success bucket names for this rule.
 */
exports.s3BucketCustomerEncryption = function(req, res) {
    let log = logger.getLogger(fileName + 's3BucketEncryption API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });

    S3Service.getAllS3BucketsList(creds, function(err, bucketList) {
        if (err) {
            log.error("Error Calling s3Service.getAllS3BucketsList: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Bucket List: " + JSON.stringify(bucketList));
        
        S3Service.getAllS3BucketsCustomerEncryption(creds,bucketList["Buckets"], (err, bucketEncryption)=>{
            if (err) {
                log.error("Error Calling s3Service.getAllS3BucketsEncryption: " + JSON.stringify(err));
                resultObject.success = false
                resultObject.errorMessage = err.message
                res.status(400).json(resultObject);
                return
            }
        log.info("Buckets Encryption: " + JSON.stringify(bucketEncryption));
        let failedBucketsName = [];
        let passedBucketsName = [];

        for(let i = 0; i< bucketEncryption.length; i++){

            let bucketEncryptionInfo = bucketEncryption[i]
            let keys = Object.keys(bucketEncryptionInfo)
            let bucketName = keys[0]
            if(JSON.stringify(bucketEncryptionInfo).includes("AES256")){
                failedBucketsName.push(bucketName)
            }else{
                passedBucketsName.push(bucketName)
            }
        }


        resultObject.success = true
        let data = {
            failedBucketsName,
            passedBucketsName
        }
        resultObject.data = data
        res.status(200).json(resultObject);
    
        })
    })    
}


/**
 * Servive:S3
 * Rule: Limit S3 Bucket Access by IP Address.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of failed and success bucket names for this rule..
 */
exports.s3LimitByIpAccess = function(req, res) {
    let log = logger.getLogger(fileName + 's3PublicAccess API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });

    S3Service.getAllS3BucketsList(creds, function(err, bucketList) {
        if (err) {
            log.error("Error Calling s3Service.getAllS3BucketsList: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Bucket List: " + JSON.stringify(bucketList));
        
        S3Service.getAllS3BucketsPolicy(creds,bucketList["Buckets"], (err, bucketPolicies)=>{
            if (err) {
                log.error("Error Calling s3Service.getAllS3BucketsPolicy: " + JSON.stringify(err));
                resultObject.success = false
                resultObject.errorMessage = err.message
                res.status(400).json(resultObject);
                return
            }
        log.info("All Bucket Acl: " + JSON.stringify(bucketPolicies));
        let failedBucketsName = [];
        let passedBucketsName = [];
        for(let i = 0; i<bucketPolicies.length; i++){

            if(JSON.stringify(bucketPolicies[i]).includes("NoSuchBucketPolicy")){
                failedBucketsName.push(Object.keys(bucketPolicies[i])[0])
            }else{
                passedBucketsName.push(Object.keys(bucketPolicies[i])[0])
            }

        }
        resultObject.success = true
        let data = {
            failedBucketsName,
            passedBucketsName
         }
         resultObject.data = data
        res.status(200).json(resultObject);
    })
    })    
}


/**
 * Servive:S3
 * Rule: Ensure S3 bucket access logging is enabled on the CloudTrail S3.
 * 
 * @param accountId
 * @param accountKey 
 * 
 * @returns List of failed and success bucket names for this rule..
 */
exports.s3BucketLogging = function(req, res) {
    let log = logger.getLogger(fileName + 's3BucketLogging API')
    log.info("Started: ")
    log.info("Request Data: " + JSON.stringify(req.body))
    let resultObject = new Model.ResultObject();

    const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });

    S3Service.getAllS3BucketsList(creds, function(err, bucketList) {
        if (err) {
            log.error("Error Calling s3Service.getAllS3BucketsList: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }
        log.info("All Bucket List: " + JSON.stringify(bucketList));
        
        S3Service.getAllS3BucketsLogging(creds,bucketList["Buckets"], (err, bucketLogging)=>{
            if (err) {
                log.error("Error Calling s3Service.getAllS3BucketsLogging: " + JSON.stringify(err));
                resultObject.success = false
                resultObject.errorMessage = err.message
                res.status(400).json(resultObject);
                return
            }
        log.info("All Bucket Logging: " + JSON.stringify(bucketLogging));
        let failedBucketsName = [];
        let passedBucketsName = [];
        for(let i = 0; i<bucketLogging.length; i++){

            if(!JSON.stringify(bucketLogging[i]).includes("LoggingEnabled")){
                failedBucketsName.push(Object.keys(bucketLogging[i])[0])
            }else{
                passedBucketsName.push(Object.keys(bucketLogging[i])[0])
            }
        }
        resultObject.success = true
        let data = {
            bucketLogging,
            failedBucketsName,
            passedBucketsName
         }
         resultObject.data = data
        res.status(200).json(resultObject);
    })
    })    
}