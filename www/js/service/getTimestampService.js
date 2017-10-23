angular.module('IfmCoinApp').service('getTimestampService', function() {
	this.getTimestamp = function() {
		getOnce(true, '/api/transactions/getslottime', null, function(data) {
			if(data && data.success === true) {
				return data;
			}else {
				return false;
			}
		}, function(err) {
			return err;
		})
	}
})