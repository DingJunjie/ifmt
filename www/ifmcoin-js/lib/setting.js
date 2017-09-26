"use strict";

module.exports = {
  testnet: function testnet() {
    this.netVersion = "testnet";
  },

  runnet: function runnet(publicKey) {
    this.netVersion = "runtest";
  }
};