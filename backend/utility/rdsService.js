const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-west-1' })
const logger = require('../config/logger')
const fileName = 'rdsService: '

exports.getAllRDSInstanceList = function (creds, callback) {
    let log = logger.getLogger(fileName + 'getAllRDSInstanceList')
    log.info("Started")

    const rdsClient = new AWS.RDS({"credentials": creds});

    //Get only self images.
    var params = {
    };

    rdsClient.describeDBInstances(params, function (err, dbInstancesDescription) {
        if (err){
            log.error("Error Calling describeDBInstances: " + JSON.stringify(err));
            callback(err,null)
            return
        }
        let rdsList = {}
        let dbInstances = dbInstancesDescription.DBInstances ? dbInstancesDescription.DBInstances : []
        for(let i = 0; i<dbInstances.length; i++ ){
            rdsList[dbInstances[i].DBInstanceIdentifier] = dbInstances[i]
        }
        log.info("Returning with list: " + JSON.stringify(rdsList))
        callback(null,rdsList)
    })
}

exports.getAllRDSBackups = function (creds, rdsList, callback) {
    let log = logger.getLogger(fileName + 'getAllRDSBackups')
    log.info("Started with list:"+ JSON.stringify(rdsList))

    Promise.all(
        rdsList.map(identifier => getRDSBackup(creds ,identifier)),)
        .then(data => {
          callback(null, data)
        })
        .catch(error => {
          callback('Error fetching ACLs.', null)
          return error
        })
}
