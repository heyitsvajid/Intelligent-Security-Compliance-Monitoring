import axios from 'axios';
const BASE_URL = "http://localhost:3001/";

export default {
    checkExposedKeys(user, callback) {
        let URL = BASE_URL + "checkExposedKeys";
        axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
            .then(response => {
                console.log("Response from checkExposedKeys: ", response);
                let data = response.data.data;
                if('keyList' in data){
                    callback(null,data);
                }else{
                    callback("Service not in use.", null);
                }
            }, (error) => {
                console.log(error);
                callback("Service not in use.", null);
            })
    },

    checkCrossAccountAccess(user, callback) {
        let URL = BASE_URL + "checkCrossAccountAccess";
        axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
            .then(response => {
                console.log("Response from checkCrossAccountAccess: ", response);
                let data = response.data.data;
                if('keyList' in data){
                    callback(null,data);
                }else{
                    callback("Service not in use.", null);
                }
            }, (error) => {
                console.log(error);
                callback("Service not in use.", null);
            })
    }
}