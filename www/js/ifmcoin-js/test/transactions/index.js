var Buffer = require("buffer/").Buffer;
var should = require("should");
var ifmcoin = require("../../index.js");

describe("transaction.js", function () {

    var transaction = ifmcoin.transaction;

    it("should be object", function () {
        (transaction).should.be.type("object");
    });

    it("should have properties", function () {
        (transaction).should.have.property("createTransaction");
    })

});
