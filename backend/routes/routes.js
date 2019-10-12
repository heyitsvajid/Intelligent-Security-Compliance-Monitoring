module.exports = function (app) {

  var controller = require('../controllers/controller.js');
  var networkController = require('../controllers/networkController');
  var s3Ccontroller = require('../controllers/s3controller.js');

  //Ping Server
  app.get('/ping', controller.ping);

  //Unused AMIs
  app.post('/unusedAmis', controller.unusedAmis);

  //Underutilized Instances
  app.post('/underutilizedInstances', controller.underutilizedInstances);

  //Exposed security groups
  app.get('/securityGroups', networkController.getAllSecurityGroups);

  // AWS S3 Bucket Public 'FULL_CONTROL' Access
  app.post('/s3FullControlAccess', s3Ccontroller.s3FullControlAccess);

  // AWS S3 Bucket Encryption
  app.post('/s3BucketEncryption', s3Ccontroller.s3BucketEncryption);

  // AWS S3 Bucket MFA Delete
  app.post('/s3BucketMfaDelete', s3Ccontroller.s3BucketMfaDelete);
  
  // AWS S3 Bucket MFA Delete
  app.post('/s3PublicAccess', s3Ccontroller.s3PublicAccess);
  
  }


