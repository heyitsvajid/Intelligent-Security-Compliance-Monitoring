/**
 * resultObject to be sent in all API responses.
 */
exports.ResultObject = function () {
    this.data = {};
    this.errorMessage = "";
    this.successMessage = "";
    this.success = false;
}