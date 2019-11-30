import axios from 'axios';
const BASE_URL = "http://localhost:3001/";

export default {
    checkAccessLoggingForBuckets(user, callback) {
        let URL = BASE_URL + "checkAccessLoggingForBuckets";
        axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
            .then(response => {
                console.log("Response from checkAccessLoggingForBuckets: ", response);
                let data = response.data.data;
                if('trailList' in data){
                    callback(null,data);
                }else{
                    callback("Service not in use.", null);
                }
            }, (error) => {
                console.log(error);
                callback("Service not in use.", null);
            })
    },

    checkMfaDeleteForBuckets(user, callback) {
        let URL = BASE_URL + "checkMfaDeleteForBuckets";
        axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
            .then(response => {
                console.log("Response from checkMfaDeleteForBuckets: ", response);
                let data = response.data.data;
                if('trailList' in data){
                    callback(null,data);
                }else{
                    callback("Service not in use.", null);
                }
            }, (error) => {
                console.log(error);
                callback("Service not in use.", null);
            })
    },

    checkInsecureBuckets(user, callback) {
        let URL = BASE_URL + "checkInsecureBuckets";
        axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
            .then(response => {
                console.log("Response from checkInsecureBuckets: ", response);
                let data = response.data.data;
                if('trailList' in data){
                    callback(null,data);
                }else{
                    callback("Service not in use.", null);
                }
            }, (error) => {
                console.log(error);
                callback("Service not in use.", null);
            })
    },

    checkLogFileEncryption(user, callback) {
        let URL = BASE_URL + "checkLogFileEncryption";
        axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
            .then(response => {
                console.log("Response from checkLogFileEncryption: ", response);
                let data = response.data.data;
                if('trailList' in data){
                    callback(null,data);
                }else{
                    callback("Service not in use.", null);
                }
            }, (error) => {
                console.log(error);
                callback("Service not in use.", null);
            })
    },

    checkMultiRegionAccess(user, callback) {
        let URL = BASE_URL + "checkMultiRegionAccess";
        axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
            .then(response => {
                console.log("Response from checkMultiRegionAccess: ", response);
                let data = response.data.data;
                if('trailList' in data){
                    callback(null,data);
                }else{
                    callback("Service not in use.", null);
                }
            }, (error) => {
                console.log(error);
                callback("Service not in use.", null);
            })
    },

    checkLogFileIntegrityValidation(user, callback) {
        let URL = BASE_URL + "checkLogFileIntegrityValidation";
        axios.post(URL, user, { headers: { 'Content-Type': 'application/json'}})
            .then(response => {
                console.log("Response from checkLogFileIntegrityValidation: ", response);
                let data = response.data.data;
                if('trailList' in data){
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