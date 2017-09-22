'use strict';

var crypto = require('crypto');
var nacl_factory = require("js-nacl");
var nacl = null;
var keypairHelper = {
    create: function create(secret) {
        if (!nacl) {
            nacl_factory.instantiate(function (tmpNacl) {

                nacl = tmpNacl;
                // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
            });
        }

        //验证密码信息（根据登录密码生成 keypair）
        var hash = crypto.createHash('sha256').update(secret, 'utf8').digest();
        var keypair = nacl.crypto_sign_seed_keypair(hash);
        keypair.publicKey = Buffer.from(keypair.signPk);
        keypair.privateKey = Buffer.from(keypair.signSk);

        return keypair;
    }
};

module.exports = keypairHelper;