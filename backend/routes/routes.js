module.exports = function (app) {

  //var controller = require('../controllers/controller.js');
  let cloudTrailController = require('../controllers/cloudTrailController');
  let elbController = require('../controllers/elbController');
  let kmsController = require('../controllers/kmsController');
  let s3Ccontroller=require('../controllers/s3controller');
  let rdsCcontroller=require('../controllers/rdsController');
  //Describe all the trails in account
  app.post('/getAllTrailsInfo', cloudTrailController.getAllTrailsInfo);

  //Check access logging status for s3 buckets linked to trails
  app.post('/checkAccessLoggingForBuckets', cloudTrailController.checkAccessLoggingForBuckets);

  //Check MFA delete status for s3 buckets linked to trails
  app.post('/checkMfaDeleteForBuckets', cloudTrailController.checkMfaDeleteForBuckets);

  //Check for publicly accessible buckets linked to trails
  app.post('/checkInsecureBuckets', cloudTrailController.checkInsecureBuckets);

  //Check File Encryption status for all the trails in the account
  app.post('/checkLogFileEncryption', cloudTrailController.checkLogFileEncryption);

  //Check whether the trails are enabled for multiple regions
  app.post('/checkMultiRegionAccess', cloudTrailController.checkMultiRegionAccess);

  //Check whether Log File Integrity Validation is enabled for trails
  app.post('/checkLogFileIntegrityValidation', cloudTrailController.checkLogFileIntegrityValidation);

  //Check the security protocol of ELB listeners
  app.post('/checkElbListenerSecurity', elbController.checkElbListenerSecurity);

  //Check the health of ELB targets
  app.post('/checkElbHealth', elbController.checkElbHealth);

  //Check for Idle ELBs
  app.post('/checkIdleElbs', elbController.checkIdleElbs);

  //Check for insecure Security Groups linked to ELBs
  app.post('/checkElbSecurityGroup', elbController.checkElbSecurityGroup);

  //Check for internet facing ELBs
  app.post('/checkInternetFacingElbs', elbController.checkInternetFacingElbs);

  //Check whether delete protection is enabled for ELBs
  app.post('/checkElbDeleteProtection', elbController.checkElbDeleteProtection);

  //Check for publicly exposed keys
  app.post('/checkExposedKeys', kmsController.checkExposedKeys);

  //Check cross account access for keys
  app.post('/checkCrossAccountAccess', kmsController.checkCrossAccountAccess);



// AWS S3 Bucket Public 'FULL_CONTROL' Access
app.post('/s3FullControlAccess', s3Ccontroller.s3FullControlAccess);

// AWS S3 Bucket Encryption
app.post('/s3BucketEncryption', s3Ccontroller.s3BucketEncryption);

// AWS S3 Bucket MFA Delete
app.post('/s3BucketMfaDelete', s3Ccontroller.s3BucketMfaDelete);

// AWS S3 Bucket Public Access
app.post('/s3PublicAccess', s3Ccontroller.s3PublicAccess);

// AWS S3 Bucket Bucket Customer Encryption
app.post('/s3BucketCustomerEncryption', s3Ccontroller.s3BucketCustomerEncryption);

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

}