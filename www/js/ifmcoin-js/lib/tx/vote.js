'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by wmc on 17-7-10.
 */

var constants = require('../helpers/constants.js');
var Diff = require('../helpers/diff.js');
var util = require('util');
var Validator = require('../validator');

// private fields
var modules = void 0,
    library = void 0,
    self = void 0,
    shared = {};

/**
 * 投票生成委托人
 */

var Vote = function () {
    /**
     *
     * @param data
     * @param trs
     * @returns {*}
     */
    function Vote() {
        _classCallCheck(this, Vote);
    }

    _createClass(Vote, [{
        key: 'create',
        value: function create(data, trs) {
            trs.recipientId = data.senderId;
            trs.recipientUsername = data.senderUsername;
            trs.asset.votes = data.asset.votes;

            return trs;
        }
    }, {
        key: 'validateInput',
        value: function validateInput(data, cb) {
            Validator.validate(data, {
                type: "object",
                properties: {
                    secret: {
                        type: "string",
                        minLength: 1
                    },
                    secondSecret: {
                        type: "string"
                    },
                    publicKey: {
                        type: "string",
                        format: "publicKey"
                    },
                    multisigAccountPublicKey: {
                        type: "string",
                        format: "publicKey"
                    },
                    fee: {
                        type: 'number',
                        minimum: constants.minTransactionFee,
                        maximum: constants.maxTransactionFee
                    },
                    asset: {
                        type: "object",
                        format: "votesAsset"
                    }
                },
                required: ["secret", "fee", "asset"]
            }, cb);
        }

        /**
         * 计算费用
         * @param trs
         * @param sender
         * @returns {number}
         */

    }, {
        key: 'calculateFee',
        value: function calculateFee(trs, sender) {
            return 1 * constants.fixedPoint;
        }

        /**
         * 验证投票是否合法
         * @param trs
         * @param sender
         * @param cb
         * @returns {*}
         */

    }, {
        key: 'verify',
        value: function verify(trs, sender, cb) {
            //modules = self.getModules();

            if (trs.recipientId != trs.senderId) {
                // return setImmediate(cb, {
                //     message: "Recipient is not identical to sender"
                // });
                return cb({message: "Recipient is not identical to sender"});
            }

            if (!trs.asset.votes || !trs.asset.votes.length) {
                // return setImmediate(cb, {
                //     message: "Not enough spare votes available"
                // });
                return cb({message: "Not enough spare votes available"});
            }

            if (trs.asset.votes && trs.asset.votes.length > 33) {
                // return setImmediate(cb, {
                //     message: "Voting limited exceeded. Maxmium is 33 per transaction"
                // });
                return cb({message: "Voting limited exceeded. Maxmium is 33 per transaction"});
            }
            cb(null, trs);
            // modules.delegates.checkDelegates(trs.senderPublicKey, trs.asset.votes, function (err) {
            //     setImmediate(cb, err, trs);
            // });
        }

        /**
         *
         * @param trs
         * @param sender
         * @param cb
         */

    }, {
        key: 'process',
        value: function process(trs, sender, cb) {
            // setImmediate(cb, null, trs);
            cb(null, trs);
        }

        /**
         *
         * @param trs
         * @returns {*}
         */

    }, {
        key: 'getBytes',
        value: function getBytes(trs) {
            var buf = void 0;
            try {
                buf = trs.asset.votes ? new Buffer(trs.asset.votes.join(''), 'utf8') : null;
            } catch (e) {
                throw Error(e.toString());
            }

            return buf;
        }

        /**
         *
         * @param trs
         * @returns {*}
         */

    }, {
        key: 'objectNormalize',
        value: function objectNormalize(trs) {
            var report = library.scheme.validate(trs.asset, {
                type: "object",
                properties: {
                    votes: {
                        type: "array",
                        minLength: 1,
                        maxLength: 105,
                        uniqueItems: true
                    }
                },
                required: ['votes']
            });

            if (!report) {
                throw new Error("Incorrect votes in transactions: " + library.scheme.getLastError());
            }

            return trs;
        }

        /**
         *
         * @param trs
         * @param sender
         * @returns {boolean}
         */

    }, {
        key: 'ready',
        value: function ready(trs, sender) {
            if (sender.multisignatures.length) {
                if (!trs.signatures) {
                    return false;
                }
                return trs.signatures.length >= sender.multimin - 1;
            } else {
                return true;
            }
        }
    }]);

    return Vote;
}();

module.exports = Vote;