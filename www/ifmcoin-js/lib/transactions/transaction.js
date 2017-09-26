'use strict';

var Validator = require('../validator');
var crypto = require('crypto');
// var ed = require('ed25519');
var nacl_factory = require("js-nacl");
var Buffer = require('buffer/').Buffer;
var tx = require('../tx');

var addressHelper = require('../helpers/address');
var slots = require('../helpers/slots');
var TransactionTypes = require('../helpers/transaction-types');
var nacl = null;
// function createTransaction(body, cb) {
//     tx.validateInput(body, function (err) {
//         if (err) {
//             return cb(err[0].message);
//         }
//
//         //验证密码信息（根据登录密码生成 keypair）
//         let hash = crypto.createHash('sha256').update(body.secret, 'utf8').digest();
//         let keypair = ed.MakeKeypair(hash);
//
//         if (body.publicKey) {
//             if (keypair.publicKey.toString('hex') != body.publicKey) {
//                 return cb("Invalid passphrase");
//             }
//         }
//
//         let secondKeypair = null;
//
//         if (body.secondSecret) {
//             let secondHash = crypto.createHash('sha256').update(body.secondSecret, 'utf8').digest();
//             secondKeypair = ed.MakeKeypair(secondHash);
//         }
//         var senderId = addressHelper.generateBase58CheckAddress(keypair.publicKey.toString('hex'));
//
//         let data = {
//             type: body.type,
//             amount: body.amount || 0,
//             senderPublicKey: keypair.publicKey.toString('hex'),
//             senderId: senderId,
//             recipientId: body.recipientId || null,
//             fee: body.fee,
//             recipientUsername: body.recipientUsername || null,
//             keypair: keypair,
//             secondKeypair: secondKeypair,
//             asset: body.asset || {}
//         }
//         if (body.multisigAccountPublicKey) {
//             //多重签名公钥
//             data.senderPublicKey = body.multisigAccountPublicKey;
//             data.senderId = addressHelper.generateBase58CheckAddress(keypair.senderPublicKey.toString('hex'));
//             data.requester = keypair;//多重签名交易发起人
//         }
//
//         let trs = {
//             type: data.type,    //交易类型
//             amount: data.amount,  //交易接额
//             senderId: data.senderId,
//             senderPublicKey: data.senderPublicKey,
//             requesterPublicKey: data.requester ? data.requester.publicKey.toString('hex') : null,
//             timestamp: slots.getTime(), //生成交易时间戳
//             asset: {}
//         };
//
//
//         trs = tx.create(data, trs);//todo:
//
//
//         //添加账户签名(登录密码)
//         trs.signature = tx.sign(data.keypair, trs);
//
//         //添加支付密码
//         if (data.secondKeypair) {
//             trs.signSignature = tx.sign(data.secondKeypair, trs);
//         }
//
//         //添加交易的 id
//         trs.id = tx.getId(trs);
//
//         trs.fee = accMul(data.fee, 100000000);
//
//         //计算交易费用
//         // trs.fee = privated.types[trs.type].calculateFee.call(this, trs, data.sender) || false;
//
//         cb(null, trs);
//
//     });
// };

function createTransaction(body, cb) {
    tx.validateInput(body, function (err) {
        if (err) {
            return cb(
                {
                    message: "Parameter error",
                    details: err
                }
            );
        }

        if (!nacl) {
            nacl_factory.instantiate(function (tmpNacl) {

                nacl = tmpNacl;
                // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
            });
        }

        //验证密码信息（根据登录密码生成 keypair）
        var hash = crypto.createHash('sha256').update(body.secret, 'utf8').digest();
        var keypair = nacl.crypto_sign_seed_keypair(hash);
        keypair.publicKey = Buffer.from(keypair.signPk);
        keypair.privateKey = Buffer.from(keypair.signSk);

        //let keypair2 = ed.MakeKeypair(hash);
        //console.log("~~~~~~~~~~~~~~~qqqqqqqqqqqqqqqqqkeypair2.publicKey:"+keypair2.privateKey+"   keypair.publicKey"+keypair.privateKey);

        if (body.publicKey) {
            if (keypair.publicKey.toString('hex') != body.publicKey) {
                return cb({
                    message: "Invalid passphrase"
                });
            }
        }

        var secondKeypair = null;

        if (body.secondSecret) {
            var secondHash = crypto.createHash('sha256').update(body.secondSecret, 'utf8').digest();
            secondKeypair = nacl.crypto_sign_seed_keypair(secondHash);
            secondKeypair.publicKey = Buffer.from(secondKeypair.signPk);
            secondKeypair.privateKey = Buffer.from(secondKeypair.signSk);
            // let secondHash = crypto.createHash('sha256').update(body.secondSecret, 'utf8').digest();
            // secondKeypair = ed.MakeKeypair(secondHash);
        }
        var senderId = addressHelper.generateBase58CheckAddress(keypair.publicKey.toString('hex'));

        var data = {
            type: body.type,
            amount: body.amount || 0,
            senderPublicKey: keypair.publicKey.toString('hex'),
            senderId: senderId,
            recipientId: body.recipientId || null,
            fee: body.fee,
            recipientUsername: body.recipientUsername || null,
            keypair: keypair,
            secondKeypair: secondKeypair,
            timestamp: body.timestamp,
            asset: body.asset || {}
        };
        if (body.multisigAccountPublicKey) {
            //多重签名公钥
            data.senderPublicKey = body.multisigAccountPublicKey;
            data.senderId = addressHelper.generateBase58CheckAddress(keypair.senderPublicKey.toString('hex'));
            data.requester = keypair; //多重签名交易发起人
        }

        var trs = {
            type: data.type, //交易类型
            amount: data.amount, //交易接额
            senderId: data.senderId,
            senderPublicKey: data.senderPublicKey,
            requesterPublicKey: data.requester ? data.requester.publicKey.toString('hex') : null,
            timestamp: data.timestamp, //生成交易时间戳
            asset: {}
        };

        trs = tx.create(data, trs); //todo:


        //添加账户签名(登录密码)
        trs.signature = tx.sign(data.keypair, trs);

        //添加支付密码
        if (data.secondKeypair && data.type != 1) {
            trs.signSignature = tx.sign(data.secondKeypair, trs);
        }

        //添加交易的 id
        trs.id = tx.getId(trs);

        trs.fee = accMul(data.fee, 100000000);

        //计算交易费用
        // trs.fee = privated.types[trs.type].calculateFee.call(this, trs, data.sender) || false;

        cb(null, trs);
    });
};

// function calc(height) {
//     return Math.floor(height / constants.delegates) + (height % constants.delegates > 0 ? 1 : 0);
// }

function accMul(arg1, arg2) {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {}
    try {
        m += s2.split(".")[1].length;
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

module.exports = {
    createTransaction: createTransaction
};