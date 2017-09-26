'use strict';

/**
 * Created by XR <xr@bnqkl.cn> on 2017/6/30.
 */

var crypto = require('crypto');
var base58check = require('./base58check');

var netVersion = null;
var NORMAL_PREFIX = null;

module.exports = {
  isAddress: function isAddress(address) {

    if (!netVersion) {
      netVersion = require("../setting").netVersion;
      NORMAL_PREFIX = netVersion === "testnet" ? "c" : "b";
    }
    if (typeof address !== 'string') {
      return false;
    }

    if (!/^[0-9]{1,20}$/g.test(address)) {
      if (!base58check.decodeUnsafe(address.slice(1))) {
        return false;
      }

      if ([NORMAL_PREFIX].indexOf(address[0]) == -1) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  },

  generateBase58CheckAddress: function generateBase58CheckAddress(publicKey) {

    if (!netVersion) {
      netVersion = require("../setting").netVersion;
      NORMAL_PREFIX = netVersion === "testnet" ? "c" : "b";
    }

    if (typeof publicKey === 'string') {
      publicKey = Buffer.from(publicKey, 'hex');
    }

    var h1 = crypto.createHash('sha256').update(publicKey).digest();
    var h2 = crypto.createHash('ripemd160').update(h1).digest();

    return NORMAL_PREFIX + base58check.encode(h2);
  }
};