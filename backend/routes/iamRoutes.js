module.exports = function (app) {
    var iamController = require('../controllers/iamController.js');
    
    //90 days Key Rotation Check API
    app.post('/iam/keyRotationCheck', iamController.keyRotationCheck);

    //Unnecessary Access Keys
    app.post('/iam/unnecessaryAccessKeys', iamController.unnecessaryAccessKeys);

    //Iam Users with Admin Access
    app.post('/iam/iamUserswithAdminAccess', iamController.iamUserswithAdminAccess);

    //Iam Users with Admin Access
    app.post('/iam/iamUserswithPolicyEditAccess', iamController.iamUserswithPolicyEditAccess);

    //Unused Iam Users
    app.post('/iam/unusedIamUsers', iamController.unusedIamUsers);
  
  }
  
  
  