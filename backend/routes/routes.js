module.exports = function (app) {

  const controller = require('../controllers/controller.js');
  const s3Ccontroller = require('../controllers/s3controller.js');
  const rdsCcontroller = require('../controllers/rdsController.js');

  //Ping Server
  app.get('/ping', controller.ping);

  //Unused AMIs
  app.post('/unusedAmis', controller.unusedAmis);

  //Underutilized Instances
  app.post('/underutilizedInstances', controller.underutilizedInstances);

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
