import axios from 'axios';
const BASE_URL = "http://localhost:3001/";

export default {
    checkElbListenerSecurity(user, callback) {
        let URL = BASE_URL + "checkElbListenerSecurity";
        axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
            .then(response => {
                console.log("Response from checkElbListenerSecurity: ", response);
                let data = response.data.data;
                if('elbList' in data){
                    callback(null,data);
                }else{
                    callback("Service not in use.", null);
                }
            }, (error) => {
                console.log(error);
                callback("Service not in use.", null);
            })
    },

    checkElbHealth(user, callback) {
        let URL = BASE_URL + "checkElbHealth";
        axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
            .then(response => {
                console.log("Response from checkElbHealth: ", response);
                let data = response.data.data;
                if('elbList' in data){
                    callback(null,data);
                }else{
                    callback("Service not in use.", null);
                }
            }, (error) => {
                console.log(error);
                callback("Service not in use.", null);
            })
    },

    checkIdleElbs(user, callback) {
        let URL = BASE_URL + "checkIdleElbs";
        axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
            .then(response => {
                console.log("Response from checkIdleElbs: ", response);
                let data = response.data.data;
                if('elbList' in data){
                    callback(null,data);
                }else{
                    callback("Service not in use.", null);
                }
            }, (error) => {
                console.log(error);
                callback("Service not in use.", null);
            })
    },

    checkElbSecurityGroup(user, callback) {
        let URL = BASE_URL + "checkElbSecurityGroup";
        axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
            .then(response => {
                console.log("Response from checkElbSecurityGroup: ", response);
                let data = response.data.data;
                if('elbList' in data){
                    callback(null,data);
                }else{
                    callback("Service not in use.", null);
                }
            }, (error) => {
                console.log(error);
                callback("Service not in use.", null);
            })
    },

    checkInternetFacingElbs(user, callback) {
        let URL = BASE_URL + "checkInternetFacingElbs";
        axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
            .then(response => {
                console.log("Response from checkInternetFacingElbs: ", response);
                let data = response.data.data;
                if('elbList' in data){
                    callback(null,data);
                }else{
                    callback("Service not in use.", null);
                }
            }, (error) => {
                console.log(error);
                callback("Service not in use.", null);
            })
    },

    checkElbDeleteProtection(user, callback) {
        let URL = BASE_URL + "checkElbDeleteProtection";
        axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
            .then(response => {
                console.log("Response from checkElbDeleteProtection: ", response);
                let data = response.data.data;
                if('elbList' in data){
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