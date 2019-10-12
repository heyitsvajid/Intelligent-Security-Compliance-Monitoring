module.exports = function (app) {

  var controller = require('../controllers/controller.js');
  var networkController = require('../controllers/networkController');

  //Ping Server
  app.get('/ping', controller.ping);

  //Unused AMIs
  app.post('/unusedAmis', controller.unusedAmis);

  //Underutilized Instances
  app.post('/underutilizedInstances', controller.underutilizedInstances);

  //Exposed security groups
  app.get('/securityGroups', networkController.getAllSecurityGroups);

}


