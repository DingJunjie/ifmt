'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by xbn on 17-7-10.
 */

/**
 * TX for OutTransfer
 */

var constants = require('../helpers/constants.js');
var ByteBuffer = require("bytebuffer");
var dappCategory = require('../helpers/dappCategory.js');
var Buffer = require('buffer/').Buffer;

var mod = void 0;
var privated = void 0;
var library = void 0;
var shared = void 0;

/**
 * 是否经过ASCLL编码
 * */
function isASCII(str, extended) {
    return (extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(str);
}

/**
 * 侧链应用,Dapp商品
 *
 * @class
 * */

var DApp = function () {
    /**
     * 初始化Dapp商品
     *
     * @constructor
     * */
    function DApp() {
        _classCallCheck(this, DApp);
    }
    // mod = _mod;
    // shared = _shared;
    // privated = mod.__private;
    // library = _library;


    /**
     * 创建类型为侧链应用的交易
     *
     * @param {Object} data dapp商品信息
     * @param {Object} trs 交易信息
     * @private
     * @return {Object} 交易信息
     * */


    _createClass(DApp, [{
        key: 'create',
        value: function create(data, trs) {
            trs.recipientId = null;
            trs.amount = 0;

            trs.asset.dapp = {
                category: data.asset.dapp.category,
                name: data.asset.dapp.name,
                description: data.asset.dapp.description,
                tags: data.asset.dapp.tags,
                type: data.asset.dapp.dapp_type,
                siaAscii: data.asset.dapp.siaAscii,
                git: data.asset.dapp.git,
                icon: data.asset.dapp.icon,
                siaIcon: data.asset.dapp.siaIcon
            };

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
                        format: "dappAsset"
                    }
                },
                required: ["secret", "fee", "asset"]
            }, cb);
        }

        /**
         * 计算费用
         *
         * @param {Object} trs 交易信息
         * @param {Object} sender 发送人
         * @private
         * @return {number}
         * */

    }, {
        key: 'calculateFee',
        value: function calculateFee(trs, sender) {
            return 500 * constants.fixedPoint;
        }

        /**
         * 核对dapp商品信息
         *
         * @param {Object} trs 交易信息
         * @param {Object} sender 发送人
         * @param {Function} cb 核对后执行的函数
         * @private
         * @return {Function(Function,string)} 异步延时处理函数
         * */

    }, {
        key: 'verify',
        value: function verify(trs, sender, cb) {
            var isSia = false;
            var isSiaIcon = false;

            if (trs.recipientId) {
                // return setImmediate(cb, {
                //     message: "Invalid recipient"
                // });
                return cb({
                    message: "Invalid recipient"
                });
            }

            if (trs.amount != 0) {
                // return setImmediate(cb, {
                //     message: "Invalid transaction amount"
                // });
                return cb({
                    message: "Invalid transaction amount"
                });
            }

            if (trs.asset.dapp.category != 0 && !trs.asset.dapp.category) {
                // return setImmediate(cb, {
                //     message: "Invalid dapp category"
                // });
                return cb({
                    message: "Invalid dapp category"
                });
            }

            var foundCategory = false;
            for (var i in dappCategory) {
                if (dappCategory[i] == trs.asset.dapp.category) {
                    foundCategory = true;
                    break;
                }
            }

            if (!foundCategory) {
                // return setImmediate(cb, {
                //     message: "Unknown dapp category"
                // });
                return cb({
                    message: "Unknown dapp category"
                });
            }

            if (trs.asset.dapp.siaAscii) {
                isSia = true;

                if (trs.asset.dapp.siaAscii.trim() != trs.asset.dapp.siaAscii) {
                    // return setImmediate(cb, "Untrimmed sia ascii");
                    return cb({
                        message: "Untrimmed sia ascii"
                    });
                }

                if (trs.asset.dapp.siaAscii.trim().length == 0) {
                    // return setImmediate(cb, "Empty sia ascii");
                    return cb({
                        message: "Empty sia ascii"
                    });
                }

                if (trs.asset.dapp.siaAscii.length > 10000) {
                    // return setImmediate(cb, "Invalid sia ascii length. Maximum is 10000");
                    return cb({
                        message: "Invalid sia ascii length. Maximum is 10000"
                    });
                }

                if (typeof trs.asset.dapp.siaAscii !== 'string') {
                    // return setImmediate(cb, "Invalid sia ascii");
                    return cb({
                        message: "Invalid sia ascii"
                    });
                }

                if (!isASCII(trs.asset.dapp.siaAscii)) {
                    // return setImmediate(cb, "Invalid sia ascii");
                    return cb({
                        message: "Invalid sia ascii"
                    });
                }
            }

            if (trs.asset.dapp.siaIcon) {
                isSiaIcon = true;

                if (trs.asset.dapp.siaIcon.length == 0) {
                    // return setImmediate(cb, "Empty sia icon");
                    return cb({
                        message: "Empty sia icon"
                    });
                }

                if (trs.asset.dapp.siaIcon != trs.asset.dapp.siaIcon.trim()) {
                    // return setImmediate(cb, "Untrimmed sia icon");
                    return cb({
                        message: "Untrimmed sia icon"
                    });
                }

                if (trs.asset.dapp.siaIcon.length > 10000) {
                    // return setImmediate(cb, "Invalid sia icon length. Maximum is 10000");
                    return cb({
                        message: "Invalid sia icon length. Maximum is 10000"
                    });
                }

                if (typeof trs.asset.dapp.siaIcon !== 'string') {
                    // return setImmediate(cb, "Invalid sia icon");
                    return cb({
                        message: "Invalid sia icon"
                    });
                }

                if (!isASCII(trs.asset.dapp.siaIcon)) {
                    // return setImmediate(cb, "Invalid sia icon ascii");
                    return cb({
                        message: "Invalid sia icon ascii"
                    });
                }
            }

            if (trs.asset.dapp.icon) {
                if (isSiaIcon) {
                    // return setImmediate(cb, "Dapp already has a sia icon");
                    return cb({
                        message: "Dapp already has a sia icon"
                    });
                }

                if (!valid_url.isUri(trs.asset.dapp.icon)) {
                    // return setImmediate(cb, "Invalid sia icon link");
                    return cb({
                        message: "Invalid sia icon link"
                    });
                }

                var length = trs.asset.dapp.icon.length;

                if (trs.asset.dapp.icon.indexOf('.png') != length - 4 && trs.asset.dapp.icon.indexOf('.jpg') != length - 4 && trs.asset.dapp.icon.indexOf('.jpeg') != length - 5) {
                    // return setImmediate(cb, "Invalid sia icon file type");
                    return cb({
                        message: "Invalid sia icon file type"
                    });
                }
            }

            if (trs.asset.dapp.type > 1 || trs.asset.dapp.type < 0) {
                // return setImmediate(cb, "Invalid dapp type");
                return cb({
                    message: "Invalid dapp type"
                });
            }

            if (trs.asset.dapp.git) {
                if (isSia) {
                    // return setImmediate(cb, "Dapp can only be hosted in one location (github or sia)");
                    return cb({
                        message: "Dapp can only be hosted in one location (github or sia)"
                    });
                }

                if (!/^(https:\/\/github\.com\/|git\@github\.com\:)(.+)(\.git)$/.test(trs.asset.dapp.git)) {
                    // return setImmediate(cb, "Invalid github repository link");
                    return cb({
                        message: "Invalid github repository link"
                    });
                }
            }

            if (!isSia && !trs.asset.dapp.git) {
                // return setImmediate(cb, "Invalid dapp storage option");
                return cb({
                    message: "Invalid dapp storage option"
                });
            }

            if (!trs.asset.dapp.name || trs.asset.dapp.name.trim().length == 0 || trs.asset.dapp.name.trim() != trs.asset.dapp.name) {
                // return setImmediate(cb, "Missing dapp name");
                return cb({
                    message: "Missing dapp name"
                });
            }

            if (trs.asset.dapp.name.length > 32) {
                // return setImmediate(cb, "Dapp name is too long. Maximum is 32 characters");
                return cb({
                    message: "Dapp name is too long. Maximum is 32 characters"
                });
            }

            if (trs.asset.dapp.description && trs.asset.dapp.description.length > 160) {
                // return setImmediate(cb, "Dapp description is too long. Maximum is 160 characters");
                return cb({
                    message: "Dapp description is too long. Maximum is 160 characters"
                });
            }

            if (trs.asset.dapp.tags && trs.asset.dapp.tags.length > 160) {
                // return setImmediate(cb, "Dapp has too many tags. Maximum is 160");
                return cb({
                    message: "Dapp has too many tags. Maximum is 160"
                });
            }

            if (trs.asset.dapp.tags) {
                var tags = trs.asset.dapp.tags.split(',');

                tags = tags.map(function (tag) {
                    return tag.trim();
                }).sort();

                for (var _i = 0; _i < tags.length - 1; _i++) {
                    if (tags[_i + 1] == tags[_i]) {
                        // return setImmediate(cb, 'Encountered duplicate tags: ' + tags[_i]);
                        return cb({
                            message: 'Encountered duplicate tags: ' + tags[_i]
                        });
                    }
                }
            }

            // setImmediate(cb);
            cb();
        }

        /**
         * 处理交易
         *
         * @param {Object} trs 交易信息
         * @param {Object} sender 发送人
         * @param {Function} cb 处理函数
         * @private
         * @return {Function(Function,null,Object)} 异步延时处理函数
         * */

    }, {
        key: 'process',
        value: function process(trs, sender, cb) {
            // setImmediate(cb, null, trs);
            cb(null, trs);
        }

        /**
         * urf-8字符编码
         *
         * @param {Object} trs 交易信息
         * @private
         * @return
         * */

    }, {
        key: 'getBytes',
        value: function getBytes(trs) {
            var buf = void 0;
            try {
                buf = new Buffer([]);
                var nameBuf = new Buffer(trs.asset.dapp.name, 'utf8');
                buf = Buffer.concat([buf, nameBuf]);

                if (trs.asset.dapp.description) {
                    var descriptionBuf = new Buffer(trs.asset.dapp.description, 'utf8');
                    buf = Buffer.concat([buf, descriptionBuf]);
                }

                if (trs.asset.dapp.tags) {
                    var tagsBuf = new Buffer(trs.asset.dapp.tags, 'utf8');
                    buf = Buffer.concat([buf, tagsBuf]);
                }

                if (trs.asset.dapp.siaAscii) {
                    buf = Buffer.concat([buf, new Buffer(trs.asset.dapp.siaAscii, 'ascii')]);
                }

                if (trs.asset.dapp.siaIcon) {
                    buf = Buffer.concat([buf, new Buffer(trs.asset.dapp.siaIcon, 'ascii')]);
                }

                if (trs.asset.dapp.git) {
                    buf = Buffer.concat([buf, new Buffer(trs.asset.dapp.git, 'utf8')]);
                }

                if (trs.asset.dapp.icon) {
                    buf = Buffer.concat([buf, new Buffer(trs.asset.dapp.icon, 'utf8')]);
                }

                var bb = new ByteBuffer(4 + 4, true);
                bb.writeInt(trs.asset.dapp.type);
                bb.writeInt(trs.asset.dapp.category);
                bb.flip();

                buf = Buffer.concat([buf, Buffer.from(bb.toString('hex'), 'hex')]);
            } catch (e) {
                throw Error(e.toString());
            }

            return buf;
        }
    }, {
        key: 'apply',
        value: function apply(trs, block, sender, cb) {
            // setImmediate(cb);
            cb();
        }
    }, {
        key: 'undo',
        value: function undo(trs, block, sender, cb) {
            // setImmediate(cb);
            cb();
        }
    }, {
        key: 'applyUnconfirmed',
        value: function applyUnconfirmed(trs, sender, cb) {
            if (privated.unconfirmedNames[trs.asset.dapp.name]) {
                // return setImmediate(cb, "Dapp name already exists");
                return cb({
                    message: "Dapp name already exists"
                });
            }

            if (trs.asset.dapp.git && privated.unconfirmedLinks[trs.asset.dapp.git]) {
                // return setImmediate(cb, "Git repository link already exists");
                return cb({
                    message: "Git repository link already exists"
                });
            }

            if (trs.asset.dapp.siAscii && privated.unconfirmedAscii[trs.asset.dapp.siaAscii]) {
                // return setImmediate(cb, "Dapp ascii already exists");
                return cb({
                    message: "Dapp ascii already exists"
                });
            }

            privated.unconfirmedNames[trs.asset.dapp.name] = true;
            privated.unconfirmedLinks[trs.asset.dapp.git] = true;
            privated.unconfirmedAscii[trs.asset.dapp.siaAscii] = true;

            library.dbLite.query("SELECT name, siaAscii, git FROM dapps WHERE (name = $name or siaAscii = $siaAscii or git = $git) and transactionId != $transactionId", {
                name: trs.asset.dapp.name,
                siaAscii: trs.asset.dapp.siaAscii || null,
                git: trs.asset.dapp.git || null,
                transactionId: trs.id
            }, ['name', 'siaAscii', 'git'], function (err, rows) {
                if (err) {
                    // return setImmediate(cb, "Database error");
                    return cb({
                        message: "Database error"
                    });
                }

                if (rows.length > 0) {
                    var dapp = rows[0];

                    if (dapp.name == trs.asset.dapp.name) {
                        // return setImmediate(cb, 'Dapp name already exists: ' + dapp.name);
                        return cb({
                            message: 'Dapp name already exists: ' + dapp.name
                        });
                    } else if (dapp.siaAscii == trs.asset.dapp.siaAscii) {
                        // return setImmediate(cb, "Dapp sia code already exists");
                        return cb({
                            message: "Dapp sia code already exists"
                        });
                    } else if (dapp.git == trs.asset.dapp.git) {
                        // return setImmediate(cb, 'Git repository link already exists: ' + dapp.git);
                        return cb({
                            message: 'Git repository link already exists: ' + dapp.git
                        });
                    } else {
                        // return setImmediate(cb, "Unknown error");
                        return cb({
                            message: "Unknown error"
                        });
                    }
                } else {
                    // return setImmediate(cb, null, trs);
                    return cb(null, trs);
                }
            });
        }
    }, {
        key: 'undoUnconfirmed',
        value: function undoUnconfirmed(trs, sender, cb) {
            delete privated.unconfirmedNames[trs.asset.dapp.name];
            delete privated.unconfirmedLinks[trs.asset.dapp.git];
            delete privated.unconfirmedAscii[trs.asset.dapp.siaAscii];

            // setImmediate(cb);
            cb();
        }

        /**
         * 检查dapp商品格式
         *
         * @param {Object} trs 交易信息
         * @private
         * @return {Object} 交易信息
         * */

    }, {
        key: 'objectNormalize',
        value: function objectNormalize(trs) {
            for (var i in trs.asset.dapp) {
                if (trs.asset.dapp[i] === null || typeof trs.asset.dapp[i] === 'undefined') {
                    delete trs.asset.dapp[i];
                }
            }

            var report = library.scheme.validate(trs.asset.dapp, {
                type: "object",
                properties: {
                    category: {
                        type: "integer",
                        minimum: 0,
                        maximum: 8
                    },
                    name: {
                        type: "string",
                        minLength: 1,
                        maxLength: 32
                    },
                    description: {
                        type: "string",
                        minLength: 0,
                        maxLength: 160
                    },
                    tags: {
                        type: "string",
                        minLength: 0,
                        maxLength: 160
                    },
                    type: {
                        type: "integer",
                        minimum: 0
                    },
                    git: {
                        type: "string",
                        minLength: 0,
                        maxLength: 2000
                    },
                    icon: {
                        type: "string",
                        minLength: 0,
                        maxLength: 2000
                    }
                },
                required: ["type", "name", "category"]
            });

            if (!report) {
                throw Error('Can\'t verify dapp new transaction, incorrect parameters: ' + library.scheme.getLastError());
            }

            return trs;
        }

        /**
         * 读取一条记录并生成dapp商品对象
         *
         * @param {Object} raw 一条记录
         * @private
         * @return {Object} dapp商品信息
         * */

    }, {
        key: 'dbRead',
        value: function dbRead(raw) {
            if (!raw.dapp_name) {
                return null;
            } else {
                var dapp = {
                    name: raw.dapp_name,
                    description: raw.dapp_description,
                    tags: raw.dapp_tags,
                    type: raw.dapp_type,
                    siaAscii: raw.dapp_siaAscii,
                    siaIcon: raw.dapp_siaIcon,
                    git: raw.dapp_git,
                    category: raw.dapp_category,
                    icon: raw.dapp_icon
                };

                return { dapp: dapp };
            }
        }

        /**
         * 保存dapp商品信息
         *
         * @param {Object} trs 交易信息
         * @param {Function} cb 保存成功后的处理函数
         * @private
         * */

    }, {
        key: 'dbSave',
        value: function dbSave(trs, cb) {
            library.dbLite.query("INSERT INTO dapps(type, name, description, tags, siaAscii, siaIcon, git, category, icon, transactionId) VALUES($type, $name, $description, $tags, $siaAscii, $siaIcon, $git, $category, $icon, $transactionId)", {
                type: trs.asset.dapp.type,
                name: trs.asset.dapp.name,
                description: trs.asset.dapp.description || null,
                tags: trs.asset.dapp.tags || null,
                siaAscii: trs.asset.dapp.siaAscii || null,
                siaIcon: trs.asset.dapp.siaIcon || null,
                git: trs.asset.dapp.git || null,
                icon: trs.asset.dapp.icon || null,
                category: trs.asset.dapp.category,
                transactionId: trs.id
            }, function (err) {
                if (err) {
                    // return setImmediate(cb, err);
                    return cb(err);
                } else {
                    // Broadcast
                    library.network.io.sockets.emit('dapps/change', {});
                    // return setImmediate(cb);
                    return cb();
                }
            });
        }

        /**
         * 验证发送人是否有多重签名帐号,是否签名
         *
         * @param {Object} trs 交易信息
         * @param {Object} sender 发送人
         * @private
         * @return {boolean} 验证结果
         * */

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

    return DApp;
}();

module.exports = DApp;