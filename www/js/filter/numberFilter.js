angular.module('IfmCoinApp').filter('numberFilter', function () {
	return function(num) {
		if(num !== 0) {
			num = num * 1;
			num = num/100000000
		}
		return num;
	}
})