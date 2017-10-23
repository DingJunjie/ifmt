angular.module('IfmCoinApp').service('runtimeData', function() {
	this.defaultFee = parseFloat(window.localStorage.fee) || 0.001;
	this.defaultMaxFee = parseFloat(window.localStorage.maxFee) || 1.009;
	this.currentFee = 0;
	this.currentMaxFee = 0;
	this.currentBlock = 0;
	this.currentRound = 0;
	this.blockDetail = {};
	this.tradeDetail = {};
	this.recipientId = '';
	this.autoDig = false;

	this.getFee = function() {
		if(this.currentFee === 0) {
			return this.defaultFee;
		}else {
			return this.currentFee;
		}
	}

	this.getMaxFee = function() {
		if(this.currentMaxFee === 0) {
			return this.defaultMaxFee;
		}else {
			return this.currentMaxFee;
		}
	}

	this.setMaxFee = function(fee) {
		this.currentMaxFee = fee;
	}

	this.setFee = function(fee) {
		this.currentFee = fee;
		$scope.$emit('refershFee');
		// $scope.currentFee = fee;
	}

	this.setBlock = function(block) {
		this.blockDetail = block;
	}

	this.getBlock = function() {
		return this.blockDetail;
	}

	this.setTrade = function(trade) {
		this.tradeDetail = trade;
	}

	this.getTrade = function() {
		return this.tradeDetail;
	}

})