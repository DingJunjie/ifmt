angular.module('IfmCoinApp').filter('balanceTypeFilter', function () {
	return function(type) {
		if(type == 1) {
			return "打块奖励";
		}
		if(type == 2) {
			return "投票奖励";
		}
		if(type == 3) {
			return "交易奖励";
		}
	}
})