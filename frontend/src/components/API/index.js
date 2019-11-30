import axios from 'axios'
const BASE_URL = "http://localhost:3001/"

export default {
  unusedAmis(user, callback){
    let URL = BASE_URL + "/ec2/unusedAmis"
    axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
      .then((response) => {
        console.log(response);
        let data = response.data.data;
        if('amis' in data){
          callback(null,data)
        }else{
          callback("Service not in use.", null)
        }
      }, (error) => {
        console.log(error);
        callback("Service not in use.", null)
      });
},

underutilizedInstances(user, callback){
  let URL = BASE_URL + "/ec2/underutilizedInstances"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('amis' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},

unEncryptedAMIS(user, callback){
  let URL = BASE_URL + "/ec2/unEncryptedAMIS"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('amis' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},

unrestrictedSecurityGroupAttachedEC2Instance(user, callback){
  let URL = BASE_URL + "/ec2/unrestrictedSecurityGroupAttachedEC2Instance"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('amis' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},

unAssociatedEIPs(user, callback){
  let URL = BASE_URL + "/ec2/unAssociatedEIPs"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('amis' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},

unusedEc2KeyPairs(user, callback){
  let URL = BASE_URL + "/ec2/unusedEc2KeyPairs"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('amis' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},

keyRotationCheck(user, callback){
  let URL = BASE_URL + "/iam/keyRotationCheck"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('amis' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},

unnecessaryAccessKeys(user, callback){
let URL = BASE_URL + "/iam/unnecessaryAccessKeys"
axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
  .then((response) => {
    console.log(response);
    let data = response.data.data;
    if('amis' in data){
      callback(null,data)
    }else{
      callback("Service not in use.", null)
    }
  }, (error) => {
    console.log(error);
    callback("Service not in use.", null)
  });
},

iamUserswithAdminAccess(user, callback){
let URL = BASE_URL + "/iam/iamUserswithAdminAccess"
axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
  .then((response) => {
    console.log(response);
    let data = response.data.data;
    if('amis' in data){
      callback(null,data)
    }else{
      callback("Service not in use.", null)
    }
  }, (error) => {
    console.log(error);
    callback("Service not in use.", null)
  });
},

iamUserswithPolicyEditAccess(user, callback){
let URL = BASE_URL + "/iam/iamUserswithPolicyEditAccess"
axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
  .then((response) => {
    console.log(response);
    let data = response.data.data;
    if('amis' in data){
      callback(null,data)
    }else{
      callback("Service not in use.", null)
    }
  }, (error) => {
    console.log(error);
    callback("Service not in use.", null)
  });
},

unusedIamUsers(user, callback){
let URL = BASE_URL + "/iam/unusedIamUsers"
axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
  .then((response) => {
    console.log(response);
    let data = response.data.data;
    if('amis' in data){
      callback(null,data)
    }else{
      callback("Service not in use.", null)
    }
  }, (error) => {
    console.log(error);
    callback("Service not in use.", null)
  });
},

sshKeyRotationCheck(user, callback){
let URL = BASE_URL + "/iam/sshKeyRotationCheck"
axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
  .then((response) => {
    console.log(response);
    let data = response.data.data;
    if('amis' in data){
      callback(null,data)
    }else{
      callback("Service not in use.", null)
    }
  }, (error) => {
    console.log(error);
    callback("Service not in use.", null)
  });
},

s3FullControlAccess(user, callback){
  let URL = BASE_URL + "s3FullControlAccess"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('bucketList' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},
s3BucketEncryption(user, callback){
  let URL = BASE_URL + "s3BucketEncryption"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('bucketList' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},
s3BucketMfaDelete(user, callback){
  let URL = BASE_URL + "s3BucketMfaDelete"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('bucketList' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},
s3PublicAccess(user, callback){
  let URL = BASE_URL + "s3PublicAccess"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('bucketList' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},
s3BucketCustomerEncryption(user, callback){
  let URL = BASE_URL + "s3BucketCustomerEncryption"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('bucketList' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},
s3LimitByIpAccess(user, callback){
  let URL = BASE_URL + "s3LimitByIpAccess"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('bucketList' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},
s3BucketLogging(user, callback){
  let URL = BASE_URL + "s3BucketLogging"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('bucketList' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},
rdsAutomatedBackup(user, callback){
  let URL = BASE_URL + "rdsAutomatedBackup"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('rdsList' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},
rdsDeletionProtection(user, callback){
  let URL = BASE_URL + "rdsDeletionProtection"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('rdsList' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},
rdsEncryption(user, callback){
  let URL = BASE_URL + "rdsEncryption"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('rdsList' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},
rdsIAMAuthentication(user, callback){
  let URL = BASE_URL + "rdsIAMAuthentication"
  axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
    .then((response) => {
      console.log(response);
      let data = response.data.data;
      if('rdsList' in data){
        callback(null,data)
      }else{
        callback("Service not in use.", null)
      }
    }, (error) => {
      console.log(error);
      callback("Service not in use.", null)
    });
},
}
