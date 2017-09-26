module.exports = {
    maxAmount: 100000000,
    blockHeaderLength: 248,
    addressLength: 208,
    maxAddressesLength: 208 * 128,
    maxClientConnections: 100,
    numberLength: 100000000,
    feeStartVolume: 10000 * 100000000,
    feeStart: 1,
    maxRequests: 10000 * 12,
    requestLength: 104,
    signatureLength: 196,
    maxSignaturesLength: 196 * 256,
    maxConfirmations: 77 * 100,
    confirmationLength: 77,

    //
    maxPayloadLength: 8 * 1024 * 1024,
    fixedPoint: Math.pow(10, 8),
    totalAmount: 10000000000000000,

    minTransactionFee: 0.00000001,
    maxTransactionFee: 100000000,

    delegates: 57,
    autoForgingCount: 11, //随机选取账户的数量
    broadcastQuantity: 15,  //每次广播的节点数量

    enableSaveRewardDetails: true,

    slots: {
        interval: 10
    },

    rewards: {
        distance: 315000,
        // offset: 60480
        offset: 6,
        votePercent: 0.5,  //投票奖励所占比例
        forgingPercent: 0.5 //打块奖励所占比例
    },
    maxTxsPerBlock: 500,
    maxBlockSync: 570,  //同步的最大块数
    consensus: {
        defaultVotes: 6
    }
}
// module.exports = {
//     maxAmount: 100000000,
//     blockHeaderLength:
// 248,
//     addressLength: 208,
//     maxAddressesLength: 208 * 128,
//     maxClientConnections: 100,
//     numberLength: 100000000,
//     feeStartVolume: 10000 * 100000000,
//     feeStart: 1,
//     maxRequests: 10000 * 12,
//     requestLength: 104,
//     signatureLength: 196,
//     maxSignaturesLength: 196 * 256,
//     maxConfirmations: 77 * 100,
//     confirmationLength: 77,
//
//     //
//     maxPayloadLength: 8 * 1024 * 1024,
//     fixedPoint: Math.pow(10, 8),
//     totalAmount: 10000000000000000,
//
//     delegates: 101,
//
//     slots: {
//         interval: 10
//     },
//
//     rewards: {
//         distance: 3000000,
//         // offset: 60480
//         offset: 6
//     },
//     maxTxsPerBlock: 500,
//     consensus: {
//         defaultVotes: 6
//     }
// }
