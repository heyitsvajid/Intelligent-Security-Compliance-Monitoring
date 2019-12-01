import axios from 'axios'
const BASE_URL = "http://localhost:3001/"

export default {

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
