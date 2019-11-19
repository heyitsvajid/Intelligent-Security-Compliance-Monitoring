const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-west-1' })
const logger = require('../config/logger')
const fileName = 's3Service: '


exports.getAllS3BucketsList = function (creds, callback) {
    let log = logger.getLogger(fileName + 'getAllS3BucketsList')
    log.info("Started")

    const s3Client = new AWS.S3({"credentials": creds});

    //Get only self images.
    var params = {
    };

    s3Client.listBuckets(params, function (err, bucketList) {
        if (err){
            log.error("Error Calling listBuckets: " + JSON.stringify(err));
            callback(err,null)
            return
        }

        log.info("Returning with list: " + JSON.stringify(bucketList))
        callback(null,bucketList)
    })
}

exports.getAllS3BucketsAcl = function (creds, bucketList, callback) {
    let log = logger.getLogger(fileName + 'getAllS3BucketsAcl')
    log.info("Started with list:"+ JSON.stringify(bucketList))

    Promise.all(
        bucketList.map(bucket => getBucketAcl(creds ,bucket.Name)),)
        .then(data => {
          callback(null, data)
        })
        .catch(error => {
          callback('Error fetching ACLs.', null)
          return error
        })

}

function getBucketAcl(creds, bucketName){
    let log = logger.getLogger(fileName + 'getBucketAcl')
    log.info("Started with name:"+ JSON.stringify(bucketName))

    return new Promise((resolve, reject) => {
        const s3Client = new AWS.S3({"credentials": creds});
        var params = {
            Bucket: bucketName /* required */
          };
        s3Client.getBucketAcl(params, (err, bucketAcl) => {
            if (err){
                log.error("Error Calling getBucketAcl: " + JSON.stringify(err));
                return reject(err)
            }    
            bucketAcl["Name"] = bucketName
            log.info("Returning with ACL for: "+ bucketName + "-->" + JSON.stringify(bucketAcl))
            resolve(bucketAcl)
        })
    })
}

exports.getAllS3BucketsEncryption = function (creds, bucketList, callback) {
    let log = logger.getLogger(fileName + 'getAllS3BucketsEncryption')
    log.info("Started with list:"+ JSON.stringify(bucketList))

    Promise.all(
        bucketList.map(bucket => getBucketEncryption(creds ,bucket.Name)))
        .then(data => {
          callback(null, data)
        })
        .catch(error => {
            log.error(error)
            return   callback('Error fetching Encryptions.', null)
        })
}



function getBucketEncryption(creds, bucketName){
    let log = logger.getLogger(fileName + 'getBucketEncryption')
    log.info("Started with name:"+ JSON.stringify(bucketName))

    return new Promise((resolve, reject) => {
        const s3Client = new AWS.S3({"credentials": creds});
        var params = {
            Bucket: bucketName /* required */
          };
        s3Client.getBucketEncryption(params, (err, bucketEncryption) => {
            if (err){
                log.error("No Encryption for Bucket: " + bucketName);
                return resolve({[bucketName]:null})
            }    
            log.info("Returning with Encryption for: "+ bucketName + "-->" + JSON.stringify(bucketEncryption))
            resolve({[bucketName]:bucketEncryption})
        })
    })
}

exports.getAllS3BucketsCustomerEncryption = function (creds, bucketList, callback) {
    let log = logger.getLogger(fileName + 'getAllS3BucketsEncryption')
    log.info("Started with list:"+ JSON.stringify(bucketList))

    Promise.all(
        bucketList.map(bucket => getBucketEncryption(creds ,bucket.Name)),)
        .then(data => {
          callback(null, data)
        })
        .catch(error => {
            return   callback('Error fetching Encryptions.', null)
        })
}

exports.getAllS3BucketsVersioning = function (creds, bucketList, callback) {
    let log = logger.getLogger(fileName + 'getAllS3BucketsEncryption')
    log.info("Started with list:"+ JSON.stringify(bucketList))

    Promise.all(
        bucketList.map(bucket => getBucketVersioning(creds ,bucket.Name)))
        .then(data => {
          callback(null, data)
        })
        .catch(error => {
            return   callback('Error fetching Encryptions.', null)
        })

}

function getBucketVersioning(creds, bucketName){
    let log = logger.getLogger(fileName + 'getBucketVersioning')
    log.info("Started with name:"+ JSON.stringify(bucketName))

    return new Promise((resolve, reject) => {
        const s3Client = new AWS.S3({"credentials": creds});
        var params = {
            Bucket: bucketName /* required */
          };
        s3Client.getBucketVersioning(params, (err, bucketVersioning) => {
            if (err){
                log.error("No Versioning for Bucket: " + bucketName);
                return reject(err)
            }    
            log.info("Returning with Versioning for: "+ bucketName + "-->" + JSON.stringify(bucketVersioning))
            if('Status' in bucketVersioning){
                return resolve({
                    [bucketName] : bucketVersioning['Status']
                })                
            }
            resolve({
                [bucketName] : 'Disabled'
            })
        })
    })
}


exports.getAllS3BucketsPolicy = function (creds, bucketList, callback) {
    let log = logger.getLogger(fileName + 'getAllS3BucketsPolicy')
    log.info("Started with list:"+ JSON.stringify(bucketList))

    Promise.all(
        bucketList.map(bucket => getBucketPolicy(creds ,bucket.Name)))
        .then(data => {
          callback(null, data)
        })
        .catch(error => {
            return   callback('Error fetching Policies->' + JSON.stringify(error), null)
        })

}

function getBucketLogging(creds, bucketName){
    let log = logger.getLogger(fileName + 'getBucketLogging')
    log.info("Started with name:"+ JSON.stringify(bucketName))

    return new Promise((resolve, reject) => {
        const s3Client = new AWS.S3({"credentials": creds});
        var params = {
            Bucket: bucketName /* required */
          };
        s3Client.getBucketLogging(params, (err, bucketLogging) => {
            if (err){
                log.error("No Logging Enabled for Bucket: " + bucketName);
                return reject({
                    [bucketName] : err
                }) 
            }    
            log.info("Returning with Logging for: "+ bucketName + "-->" + JSON.stringify(bucketLogging))
                return resolve({
                    [bucketName] : bucketLogging
                })                
        })
    })
}


exports.getAllS3BucketsLogging = function (creds, bucketList, callback) {
    let log = logger.getLogger(fileName + 'getAllS3BucketsLogging')
    log.info("Started with list:"+ JSON.stringify(bucketList))

    Promise.all(
        bucketList.map(bucket => getBucketLogging(creds ,bucket.Name)))
        .then(data => {
          callback(null, data)
        })
        .catch(error => {
            return   callback('Error fetching Logging->' + JSON.stringify(error), null)
        })

}

function getBucketPolicy(creds, bucketName){
    let log = logger.getLogger(fileName + 'getBucketPolicy')
    log.info("Started with name:"+ JSON.stringify(bucketName))

    return new Promise((resolve, reject) => {
        const s3Client = new AWS.S3({"credentials": creds});
        var params = {
            Bucket: bucketName /* required */
          };
        s3Client.getBucketPolicy(params, (err, bucketPolicy) => {
            if (err){
                log.error("No Policy for Bucket: " + bucketName);
                return resolve({
                    [bucketName] : err
                }) 
            }    
            log.info("Returning with Policy for: "+ bucketName + "-->" + JSON.stringify(bucketPolicy))
                return resolve({
                    [bucketName] : bucketPolicy
                })                
        })
    })
}