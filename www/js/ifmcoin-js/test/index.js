var Buffer = require("buffer/").Buffer;
var should = require("should");
var ifmcoin = require("../index.js");

describe("IfmCoin JS", function () {

	it("should be ok", function () {
		(ifmcoin).should.be.ok;
	});

	it("should be object", function () {
		(ifmcoin).should.be.type("object");
	});

	it("should have properties", function () {
		var properties = ["transaction", "account"];

		properties.forEach(function (property) {
			(ifmcoin).should.have.property(property);
		});
	});

});
