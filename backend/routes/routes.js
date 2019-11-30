module.exports = function (app) {

  var controller = require('../controllers/controller.js');
  let cloudTrailController = require('../controllers/cloudTrailController');

  //Ping Server
  app.get('/ping', controller.ping);

  //Unused AMIs
  app.post('/unusedAmis', controller.unusedAmis);

  //Underutilized Instances
  app.post('/underutilizedInstances', controller.underutilizedInstances);

  //Get Status of a cloud trail
  app.post('/getTrailStatus', cloudTrailController.getTrailStatus);

  //Describe all the trails in account
  app.get('/getAllTrailsInfo', cloudTrailController.getAllTrailsInfo);

  //Check File Encryption status for all the trails in the account
  app.get('/checkLogFileEncryption', cloudTrailController.checkLogFileEncryption);

  //Check access logging status for s3 buckets linked to trails
  app.get('/checkAccessLoggingForBuckets', cloudTrailController.checkAccessLoggingForBuckets);

  //Check MFA delete status for s3 buckets linked to trails
  app.get('/checkMfaDeleteForBuckets', cloudTrailController.checkMfaDeleteForBuckets);

  //Check for publicly accessible buckets linked to trails
  app.get('/checkInsecureBuckets', cloudTrailController.checkInsecureBuckets);

  //Check whether the trails are enabled for multiple regions
  app.get('/checkMultiRegionAccess', cloudTrailController.checkMultiRegionAccess);

  //Check whether Log File Integrity Validation is enabled for trails
  app.get('/checkLogFileIntegrityValidation', cloudTrailController.checkLogFileIntegrityValidation);

}

  // AWS S3 Bucket Public Access
  app.post('/s3LimitByIpAccess', s3Ccontroller.s3LimitByIpAccess);

  // AWS S3 Bucket Logging
  app.post('/s3BucketLogging', s3Ccontroller.s3BucketLogging);

  // AWS RDS Automated Backup
  app.post('/rdsAutomatedBackup', rdsCcontroller.rdsAutomatedBackup);

  // AWS RDS Deletion Protection
  app.post('/rdsDeletionProtection', rdsCcontroller.rdsDeletionProtection);

  // AWS RDS Encryption
  app.post('/rdsEncryption', rdsCcontroller.rdsEncryption);

  // AWS RDS IAMAuthentication
  app.post('/rdsIAMAuthentication', rdsCcontroller.rdsIAMAuthentication);

