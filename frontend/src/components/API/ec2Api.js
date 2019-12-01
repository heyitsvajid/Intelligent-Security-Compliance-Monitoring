import axios from 'axios';
const BASE_URL = "http://localhost:3001";

export default {
    unusedAmis(user, callback){
      let URL = BASE_URL + "/ec2/unusedAmis"
      axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
        .then((response) => {
          console.log(response);
          let data = response.data.data;
          if('ec2List' in data){
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
        if('ec2List' in data){
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
    let URL = BASE_URL + "/ec2/unEncrytedAMIs"
    axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
      .then((response) => {
        console.log(response);
        let data = response.data.data;
        if('ec2List' in data){
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
        if('ec2List' in data){
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
        if('ec2List' in data){
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
        if('ec2List' in data){
          callback(null,data)
        }else{
          callback("Service not in use.", null)
        }
      }, (error) => {
        console.log(error);
        callback("Service not in use.", null)
      });
  }
}