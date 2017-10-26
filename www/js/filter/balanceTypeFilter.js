angular.module('IfmCoinApp').filter('balanceTypeFilter', ['gettext', 'gettextCatalog', function (gettext, gettextCatalog) {
	return function(type) {
		if(type == 1) {
			return gettextCatalog.getString('forge reward');
		}
		if(type == 2) {
			return gettextCatalog.getString('vote reward');
		}
		if(type == 3) {
			return gettextCatalog.getString('transaction reward');
		}
	}
}])