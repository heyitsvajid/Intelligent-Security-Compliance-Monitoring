import axios from 'axios'
const BASE_URL = "http://localhost:3001/"


export default{
    securityGroupsChecks(user, callback){
        let URL = BASE_URL+'securityGroups';
        axios.post(URL,
            user,
            {
                headers : {
                    'Content-Type' : 'application/json'
                }
            }).then((response)=>{
                console.log(response);
                let data = response.data.data;
                if('good_groups' in data || 'warning_groups' in data) callback(null, data)
                else callback("Service not in use", null)
            }, (error) => {
                console.log(error);
                callback("Error Occured", null);
            });
    }
}