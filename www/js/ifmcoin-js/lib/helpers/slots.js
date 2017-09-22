'use strict';

var constants = require('./constants.js');
/**
 * Get time from ifmcoin epoch.
 * @param {number|undefined} time Time in unix seconds
 * @returns {number}
 */

function beginEpochTime() {
    var d = new Date(Date.UTC(2017, 5, 20, 0, 0, 0, 0)); //Testnet starts from 2017.6.20

    return d;
}

function getEpochTime(time) {
    if (time === undefined) {
        time = new Date().getTime();
    }
    var d = beginEpochTime();
    var t = d.getTime();
    return Math.floor((time - t) / 1000);
}

module.exports = {
    getTime: function getTime(time) {
        return getEpochTime(time);
    },
    getRealTime: function getRealTime(epochTime) {
        if (epochTime === undefined) {
            epochTime = this.getTime();
        }
        var d = beginEpochTime();
        var t = Math.floor(d.getTime() / 1000) * 1000;
        return t + epochTime * 1000;
    },
    getSlotNumber: function getSlotNumber(epochTime) {
        if (epochTime === undefined) {
            epochTime = this.getTime();
        }
        return Math.floor(epochTime / constants.slots.interval);
    },
    getSlotTime: function getSlotTime(slot) {
        return slot * constants.slots.interval;
    },
    getNextSlot: function getNextSlot() {
        var slot = this.getSlotNumber();

        return slot + 1;
    },
    getLastSlot: function getLastSlot(nextSlot) {
        return nextSlot + constants.delegates;
    }
};