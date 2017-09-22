'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var constants = require('./constants.js');

var milestones = [500000000, // Initial Reward
400000000, // Milestone 1
300000000, // Milestone 2
200000000, // Milestone 3
100000000 // Milestone 4
];

var distance = Math.floor(constants.rewards.distance),
    // Distance between each milestone
rewardOffset = Math.floor(constants.rewards.offset); // Start rewards at block (n)

var parseHeight = function parseHeight(height) {
	height = parseInt(height);

	if (isNaN(height)) {
		throw new Error('Invalid block height');
	} else {
		return Math.abs(height);
	}
};

var Milestones = function () {
	function Milestones() {
		_classCallCheck(this, Milestones);
	}

	_createClass(Milestones, [{
		key: 'calcMilestone',
		value: function calcMilestone(height) {
			var location = Math.floor(parseHeight(height - rewardOffset) / distance),
			    lastMile = milestones[milestones.length - 1];

			if (location > milestones.length - 1) {
				return milestones.lastIndexOf(lastMile);
			} else {
				return location;
			}
		}
	}, {
		key: 'calcReward',
		value: function calcReward(height) {
			height = parseHeight(height);

			if (height < rewardOffset) {
				return 0;
			} else {
				return milestones[this.calcMilestone(height)];
			}
		}
	}, {
		key: 'calcSupply',
		value: function calcSupply(height) {
			height = parseHeight(height);
			var milestone = this.calcMilestone(height),
			    supply = constants.totalAmount / Math.pow(10, 8),
			    rewards = [];

			var amount = 0,
			    multiplier = 0;

			for (var i = 0; i < milestones.length; i++) {
				if (milestone >= i) {
					multiplier = milestones[i] / Math.pow(10, 8);

					if (height < rewardOffset) {
						break; // Rewards not started yet
					} else if (height < distance) {
						amount = height % distance; // Measure distance thus far
					} else {
						amount = distance; // Assign completed milestone
						height -= distance; // Deduct from total height

						// After last milestone
						if (height > 0 && i == milestones.length - 1) {
							var postHeight = rewardOffset - 1;

							if (height >= postHeight) {
								amount += height - postHeight;
							} else {
								amount += postHeight - height;
							}
						}
					}

					rewards.push([amount, multiplier]);
				} else {
					break; // Milestone out of bounds
				}
			}

			for (var _i = 0; _i < rewards.length; _i++) {
				var reward = rewards[_i];
				supply += reward[0] * reward[1];
			}

			return supply * Math.pow(10, 8);
		}
	}]);

	return Milestones;
}();

// Exports


module.exports = Milestones;