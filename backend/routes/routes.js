module.exports = function (app) {

  var controller = require('../controllers/controller.js');

  //Ping Server
  app.get('/ping', controller.ping);

  //Unused AMIs
  app.post('/ec2/unusedAmis', controller.unusedAmis);

  //Underutilized Instances
  app.post('/ec2/underutilizedInstances', controller.underutilizedInstances);

}


