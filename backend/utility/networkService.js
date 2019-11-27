const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-west-2' })
const logger = require('../config/logger')
const fileName = 'networkService: ';
const openIp = "0.0.0.0/0";
const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });
const ec2Client = new AWS.EC2({"credentials": creds});

let getAllSecurityGroups = function (params={},callback){
    let log = logger.getLogger(fileName + 'getAllSecurityGroups');
    log.info("Started");
    ec2Client.describeSecurityGroups(params, function(err,data){
        if(err){
            log.error("Error calling describeSecurityGroups: "+ JSON.stringify(err));
            callback(err, null);
            return;
        }
        console.log(data.SecurityGroups);
        let groups = validateSecurityGroups(data.SecurityGroups);
        log.info("Returning with list size: " + groups.length)
        callback(null, groups);
    });
}

let validateSecurityGroups = function (groups){
    let warningGroups = [];
    let goodGroups = [];
    (groups).forEach(element => {
        element.IpPermissions.forEach(ipPermission => {
            if(ipPermission.FromPort<= 22 && ipPermission.ToPort>=22){
                let ipRanges = ipPermission.IpRanges;
                for(var i=0; i<ipRanges.length; i++){
                    if(ipRanges[i].CidrIp == openIp){
                        warningGroups.push(element);
                    }else{
                        goodGroups.push(element);
                    }
                        
                }
            }else{
                goodGroups.push(element);
            }
        })
        
    });
    return {'good_groups' : goodGroups, 'warning_groups' : warningGroups};
}

module.exports = {getAllSecurityGroups};