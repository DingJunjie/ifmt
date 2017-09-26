var Request = require('../request');

var prefix = "/api/accounts";

var Account = function (provider) {
    this.request = new Request(provider);
}


Account.prototype.getBalance = function (body, callback) {
    var payload = {
        method: "GET",
        path: prefix + "/" + "getBalance",
        body: body
    };
    this.request.send(payload, callback);
}

module.exports = Account;