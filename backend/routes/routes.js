module.exports = function (app) {

  var controller = require('../controllers/controller.js');
  let cloudTrailController = require('../controllers/cloudTrailController');
  let elbController = require('../controllers/elbController');
  let kmsController = require('../controllers/kmsController');

  //Ping Server
  app.get('/ping', controller.ping);

  //Unused AMIs
  app.post('/unusedAmis', controller.unusedAmis);

  //Underutilized Instances
  app.post('/underutilizedInstances', controller.underutilizedInstances);

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

}


