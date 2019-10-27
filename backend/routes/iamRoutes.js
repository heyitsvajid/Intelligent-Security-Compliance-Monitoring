module.exports = function (app) {
    var iamController = require('../controllers/iamController.js');
  
    //Ping Server
    //app.get('/ping', iamController.ping);
  
    //Unused AMIs
    app.post('/iam/keyRotationCheck', iamController.keyRotationCheck);
  
  }
  
  
  