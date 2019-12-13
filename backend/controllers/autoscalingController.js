const logger = require('../config/logger');
const Model = require('../model/resultObject.js');
const AutoScalingService = require('../utility/autoScaling');
const fileName = "Auto Scaling";

let getAllAutoScaling = function(req, res){
    console.log(req.body);
    let resultObject = new Model.ResultObject();
    let log = logger.getLogger(fileName);
    AutoScalingService.getAllAutoscalingGroups({}, function(err, groups){
        if(err){
            log.error("Error calling AutoScalingService.getAllAutoscalingGroups" + JSON.stringify(err));
            resultObject.success = false;
            resultObject.errorMessage = err.message
            res.status(400).json(resultObject);
            return;
        }

        if(groups){
            log.info("AutoScaling groups: "+groups.length);
            resultObject.success = true;
            resultObject.successMessage = "Got all AutoScaling Groups";
            resultObject.data = groups;
            res.status(200).json(resultObject);
        }
    });
}

module.exports = {getAllAutoScaling};