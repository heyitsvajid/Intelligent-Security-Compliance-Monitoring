module.exports = function (app) {

  var controller = require('../controllers/ec2Controller.js');

  //Ping Server
  app.get('/ping', controller.ping);

  //Unused AMIs
  app.post('/ec2/unusedAmis', controller.unusedAmis);

  //Underutilized Instances
  app.post('/ec2/underutilizedInstances', controller.underutilizedInstances);

  //UnEncrypted EC2 AMIs
  app.post('/ec2/unEncrytedAMIs', controller.unEncryptedAMIS);

  //Unrestricted SG attached to EC2 instance
  app.post('/ec2/unrestrictedSecurityGroupAttachedEC2Instance', controller.unrestrictedSecurityGroupAttachedEC2Instance);

  //UnAssociated Elastic Ips 
  app.post('/ec2/unAssociatedEIPs', controller.unAssociatedEIPs);

  app.post('/ec2/unusedEc2KeyPairs',controller.unusedEc2KeyPairs);

}


