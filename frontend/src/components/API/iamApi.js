import axios from 'axios';
const BASE_URL = "http://localhost:3001";

export default {
    keyRotationCheck(user, callback){
      let URL = BASE_URL + "/iam/keyRotationCheck"
      axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
        .then((response) => {
          console.log(response);
          let data = response.data.data;
          if('iamList' in data){
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
        if('iamList' in data){
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
        if('iamList' in data){
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
        if('iamList' in data){
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
        if('iamList' in data){
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
        if('iamList' in data){
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