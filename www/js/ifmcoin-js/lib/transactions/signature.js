//
//
// var Validator = require('../validator');
// var ed = require('ed25519');
// var crypto = require('crypto');
//
// //签名操作
// function addSignature(data, cb) {
//     Validator.validate(data, {
//         type: "object",
//         properties: {
//             secret: {
//                 type: "string",
//                 minLength: 1
//             },
//             secondSecret: {
//                 type: "string",
//                 minLength: 1
//             },
//             publicKey: {
//                 type: "string",
//                 format: "publicKey"
//             },
//             multisigAccountPublicKey: {
//                 type: "string",
//                 format: "publicKey"
//             },
//             fee: {
//                 type: 'number',
//                 minimum: 0.0001,
//                 maximum: 100
//             }
//         },
//         required: ["secret", "secondSecret", 'fee']
//     }, err => {
//         if (err) {
//             return cb(err[0].message);
//         }
//
//         let hash = crypto.createHash('sha256').update(data.secret, 'utf8').digest();
//         let keypair = ed.MakeKeypair(hash);
//
//         if (data.publicKey) {
//             if (keypair.publicKey.toString('hex') != data.publicKey) {
//                 return cb("Invalid passphrase");
//             }
//         }
//
//         if (data.multisigAccountPublicKey && data.multisigAccountPublicKey != keypair.publicKey.toString('hex')) {
//             modules.accounts.getAccount({ publicKey: data.multisigAccountPublicKey }, function (err, account) {
//                 if (err) {
//                     return cb(err.toString());
//                 }
//
//                 if (!account || !account.publicKey) {
//                     return cb("Multisignature account not found");
//                 }
//
//                 if (!account.multisignatures || !account.multisignatures) {
//                     return cb("Account does not have multisignatures enabled");
//                 }
//
//                 if (account.multisignatures.indexOf(keypair.publicKey.toString('hex')) < 0) {
//                     return cb("Account does not belong to multisignature group");
//                 }
//
//                 if (account.secondSignature || account.u_secondSignature) {
//                     return cb("Invalid second passphrase");
//                 }
//
//                 modules.accounts.getAccount({ publicKey: keypair.publicKey }, (err, requester) => {
//                     if (err) {
//                         return cb(err.toString());
//                     }
//
//                     if (!requester || !requester.publicKey) {
//                         return cb("Invalid requester");
//                     }
//
//                     if (requester.secondSignature && !data.secondSecret) {
//                         return cb("Invalid second passphrase");
//                     }
//
//                     if (requester.publicKey == account.publicKey) {
//                         return cb("Invalid requester");
//                     }
//
//                     let secondHash = crypto.createHash('sha256').update(data.secondSecret, 'utf8').digest();
//                     let secondKeypair = ed.MakeKeypair(secondHash);
//                     let transaction;
//                     try {
//                         transaction = library.logic.transaction.create({
//                             type: TransactionTypes.SIGNATURE,
//                             sender: account,
//                             keypair: keypair,
//                             requester: keypair,
//                             fee: data.fee,
//                             secondKeypair: secondKeypair,
//
//                         });
//                     } catch (e) {
//                         return cb(e.toString());
//                     }
//
//                     modules.transactions.receiveTransactions([transaction], cb);
//                 });
//             });
//         } else {
//             modules.accounts.getAccount({ publicKey: keypair.publicKey.toString('hex') }, (err, account) => {
//                 if (err) {
//                     return cb(err.toString());
//                 }
//                 if (!account || !account.publicKey) {
//                     return cb("Invalid account");
//                 }
//
//                 if (account.secondSignature || account.u_secondSignature) {
//                     return cb("Invalid second passphrase");
//                 }
//
//                 let secondHash = crypto.createHash('sha256').update(data.secondSecret, 'utf8').digest();
//                 let secondKeypair = ed.MakeKeypair(secondHash);
//
//                 let transaction;
//                 try {
//                     transaction = library.logic.transaction.create({
//                         type: TransactionTypes.SIGNATURE,
//                         sender: account,
//                         keypair: keypair,
//                         fee: data.fee,
//                         secondKeypair: secondKeypair
//                     });
//                 } catch (e) {
//                     return cb(e.toString());
//                 }
//                 modules.transactions.receiveTransactions([transaction], cb);
//             });
//
//         }
//
//
//     });
// }
//
// module.exports = {
//     addSignature: addSignature
// }