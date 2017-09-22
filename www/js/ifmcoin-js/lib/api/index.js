var Transaction = require('./apis/transaction');
var HttpProvider = require('./httpprovider');


function Api(provider) {
    if (!provider) {
        provider = new HttpProvider();
    }
    return {
        transaction: new Transaction(provider),
        isConnected: provider.isConnected.bind(provider)
    }
}

module.exports = Api;