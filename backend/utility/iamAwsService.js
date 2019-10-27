const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-west-1' })
AWS.config.apiVersions = {
    cloudwatch: '2010-08-01',
  };
const logger = require('../config/logger')
const fileName = 'awsService: '


exports.getAllIAMUsersKeyInfo = function (creds, callback) {
    let log = logger.getLogger(fileName + '')
    log.info("Started")

    const iamClient = new AWS.IAM({"credentials": creds});

    iamClient.listUsers({}, function (err, response) {
        if (err){
            log.error("Error Calling Listing Users: " + JSON.stringify(err));
            callback(err,null)
            return
        }
        iamUsersList=[];
        let usersInfo=response.Users;
        for(let i=0;i<usersInfo.length;i++){
            let CreatedDate=new Date(usersInfo[i].CreateDate);
            let currentDate=new Date();
            if(Math.round((currentDate-CreatedDate)/(60*60*24))>90)
            iamUsersList.push(usersInfo[i].UserName);
        }
        let listOfUsers = iamUsersList;
        log.info("Users list: " + JSON.stringify(iamUsersList))
        callback(null,iamUsersList);
    })
}