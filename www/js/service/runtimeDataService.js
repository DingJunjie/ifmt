angular.module('ifmCoinApp').service('runtimeData', function() {
	this.defaultFee = 0;
	this.currentFee = 0;
	this.blockDetail = {};
	this.setDefaultFee = function(feeAmount) {
		this.defaultFee = feeAmount;
	}

	this.setFee = function(fee) {
		this.currentFee = fee;
	}

	this.setBlock = function(block) {
		this.blockDetail = block;
	}

})