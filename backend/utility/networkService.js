const AWS = require('aws-sdk')
const logger = require('../config/logger')
const fileName = 'networkService: ';
const openIp = "0.0.0.0/0";
const creds = new AWS.Credentials({
    accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, sessionToken: null
    });

/*
"1. Get all the security groups for the region.
2. For each security look for the groups having 22 and 3389 port open
3.Look for open address (0.0.0.0/0) in the IP ranges of the security groups"
*/

let getAllSecurityGroups = function (params={},callback){
    let log = logger.getLogger(fileName + 'getAllSecurityGroups');
    log.info("Started");
    //Passing region for region specific data
    //AWS.config.update({ region: 'us-west-2' })
    const ec2Client = new AWS.EC2({"credentials": creds});
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
/*
@params groups - list of all security groups
Filters groups for 22 and 3389 and looks for open ingress ports
*/
let validateSecurityGroups = function (groups){
    let warningGroups = [];
    let goodGroups = [];
    (groups).forEach(element => {
        let warningFound = false;
        for(let j=0; j<element.IpPermissions.length; j++){
            ipPermission = element.IpPermissions[j];
            if((ipPermission.FromPort == 22 && ipPermission.ToPort == 22) ||(ipPermission.FromPort == 3389 && ipPermission.ToPort == 3389) ){
                let ipRanges = ipPermission.IpRanges;
                for(var i=0; i<ipRanges.length; i++){
                    if(ipRanges[i].CidrIp == openIp){
                        warningFound =  true;
                        break;
                    }
                        
                }
            }
        }
        if(warningFound)
            warningGroups.push(element);
        else
            goodGroups.push(element);

        
    });
    return {'all_groups': groups,'good_groups' : goodGroups, 'warning_groups' : warningGroups};
}

module.exports = {getAllSecurityGroups};
