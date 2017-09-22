var Request = require('../request');

var prefix = "/api/transactions";

var Transaction = function (provider) {
    this.request = new Request(provider);
}


Transaction.prototype.getTransactions = function (body, callback) {
    var payload = {
        method: "GET",
        path: prefix + "/",
        body: body
    };
    this.request.send(payload, callback);
}
Transaction.prototype.postTransactions = function (body, callback) {
    var payload = {
        method: "PUT",
        path: prefix + "/tx",
        body: body
    };
    this.request.send(payload, callback);
}

// Transaction.prototype.addTransactions = function (body, callback) {
//     var payload = {
//         method: "PUT",
//         path: prefix + "/",
//         body: body
//     }
//     this.request.send(payload, callback);
// }


module.exports = Transaction;