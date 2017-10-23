angular.module('IfmCoinApp').filter('noEulerNumberFilter', function () {
	return function(Num) {
		Num = Num/100000000;
		var NumString = '' + Num;
		if(/e/.test(NumString) === true) {
			Num = Num.toFixed(8);
			if(Num[Num.length - 1] == 0) {
				return parseFloat(Num).toFixed(7);
			}
			return Num;
		}else {
			return Num;
		}
	}
})