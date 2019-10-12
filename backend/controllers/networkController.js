const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const NetworkService = require('../utility/networkService');
const fileName = "Network Controller: ";

let getAllSecurityGroups = function(req, res){
    let resultObject = new Model.ResultObject();
    let log = logger.getLogger(fileName + 'Network Controller');
    NetworkService.getAllSecurityGroups({}, function(err, secruityGroups){
        if (err) {
            log.error("Error Calling NetworkService.getAllSecurityGroups: " + JSON.stringify(err));
            resultObject.success = false
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return
        }

        if(secruityGroups){
            log.info("Security Groups: "+secruityGroups.length);
            resultObject.success = true;
            resultObject.successMessage = "Got all Security Groups";
            resultObject.data = secruityGroups;
            res.status(200).json(resultObject);
        }
    });
}

module.exports = {getAllSecurityGroups};