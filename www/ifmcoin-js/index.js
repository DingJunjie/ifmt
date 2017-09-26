var ifmcoin = {
    setting: require("./lib/setting"),    
    transaction: require("./lib/transactions/transaction.js"),
    tx: require("./lib/tx/index.js"),
    account: require("./lib/accounts/account.js"),
    Api: require("./lib/api/index"),
    Mnemonic: require('bitcore-mnemonic'),
    transactionTypes: require('./lib/helpers/transactionType'),
    keypairHelper: require("./lib/helpers/keypair")
}

// var Mnemonic = require('bitcore-mnemonic');
// for (var i = 0; i < 10; i++) {
//     var code = new Mnemonic(Mnemonic.Words.ENGLISH);
//     console.log(code.toString()); // natal hada sutil año sólido papel jamón combate aula flota ver esfera...
// }


module.exports = ifmcoin;
