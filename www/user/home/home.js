/**
 * Created by 俊杰 on 2017/7/26.
 */

angular.module('IfmCoinApp').controller('homeCtrl', ['$scope', 'userService', function($scope, userService) {
	/**
	 * 获取当前IFMT数以及对应RMB数额
	 */
	$scope.balance = userService.balance;
	$scope.balanceCNY = ($scope.balance*2).toFixed(5);
	$scope.transactions = {};
	$scope.benefits = {};

	/**
	 * 获取交易
	 * @return {[type]} [description]
	 */
	function getTransactions() {
		var req = {
			'limit' : 10,
			'orderBy': 't_timestamp:desc',
			'recipientId': userService.address,
			'senderPublicKey': userService.publicKey
		}
		getOnce(true, '/api/transactions', req, function(data) {
			if(data.success === true) {
				for(var i in data.transactions) {
					if(data.transactions[i].recipientId) {
						data.transactions[i].recipientName = data.transactions[i].recipientId;
					}else {
						data.transactions[i].recipientName = '手续费';
					}
					data.transactions[i].showTime = false;
					data.transactions[i].amountFixed = (data.transactions[i].amount/100000000).toFixed(2);
					if(data.transactions[i].amountFixed.split('.')[1] === '00') {
						data.transactions[i].amountFixed = data.transactions[i].amountFixed * 1;
					}
				}
				data.transactions[i].plusMinus = data.transactions[i].amount < 0 ? '-' : '+';
				$scope.transactions = data.transactions;
				console.log(data.transactions);
			}else {
				$ionicPopup.alert({
					title : '<div>温馨提示</div>',
	                template: '<div class="text-center">获取最近交易失败</div>'
				})
			}
		}, function(err) {
			$ionicPopup.alert({
				title : '<div>温馨提示</div>',
                template: '<div class="text-center">' + err + '</div>'
			})
		})
	}

	/**
	 * 获取收益
	 * @return {[type]} [description]
	 */
	function getBenefits() {
		var req = {
			'maxLength' : 10,
			'address' : userService.address
		}
		getOnce(true, '/api/accounts/balanceDetails', req, function(data) {
			if(data.success === true) {
				for(var i in data.balancedetails) {
					data.balancedetails[i].amountFixed = (data.balancedetails[i].amount/100000000).toFixed(5);
				}
				$scope.benefits = data.balancedetails;
			}else {
				$ionicPopup.alert({
					title : '<div>温馨提示</div>',
	                template: '<div class="text-center">获取账户收益失败</div>'
				})
			}
		})
	}

	/**
	 * 设置获取交易函数
	 * @return {[type]} [description]
	 */
	$scope.freshTrade = function() {
		var req = {
			'limit' : 10,
			'orderBy': 't_timestamp:desc',
			'recipientId': userService.address,
			'senderPublicKey': userService.publicKey
		}
		getOnce(true, '/api/transactions', req, function(data) {
			if(data.success === true) {
				for(var i in data.transactions) {
					if(data.transactions[i].recipientId) {
						data.transactions[i].recipientName = data.transactions[i].recipientId;
					}else {
						data.transactions[i].recipientName = '手续费';
					}
					data.transactions[i].showTime = false;
				}
				data.transactions[i].plusMinus = data.transactions[i].amount < 0 ? '-' : '+';
				$scope.transactions = data.transactions;
				console.log(data.transactions);
			}else {
				$ionicPopup.alert({
					title : '<div>温馨提示</div>',
	                template: '<div class="text-center">获取最近交易失败</div>'
				})
			}
		}, function(err) {
			$ionicPopup.alert({
				title : '<div>温馨提示</div>',
                template: '<div class="text-center">' + err + '</div>'
			})
		})
	}

	/**
	 * 选取最新交易或最新收益TAB事件
	 */
	$scope.grid = {};
	$scope.grid.switch = true;

	$scope.switchGrid = function(opt) {
		if(opt === 'trade') {
			$scope.grid.switch = true;
		}else if( opt === 'benefit') {
			$scope.grid.switch = false;
		}
	}

	getTransactions();
	getBenefits();

}]).controller('tradeMoreCtrl', ['$scope', '$ionicPopup', 'userService', function($scope, $ionicPopup, userService) {
	$scope.transaction = {};
	$scope.transaction.page = 0;
	$scope.transaction.current = 0;

	/**
	 * 分页读取交易
	 * @param  {[type]} page  [页码]
	 * @param  {[type]} limit [每页数量]
	 * @return {[type]}       [description]
	 */
	function getTransactionsByPage(page, limit) {
		$scope.transaction.transactions = {};
		var req = {
			'limit' : limit,
			'offset' : page*limit,
			'orderBy': 'b_height:desc',
			'recipientId': userService.address,
			'senderPublicKey': userService.publicKey
		}
		getOnce(true, '/api/transactions', req, function(data) {
			if(data.success === true) {
				for(var i in data.transactions) {
					if(data.transactions[i].recipientId) {
						data.transactions[i].recipientName = data.transactions[i].recipientId;
					}else {
						data.transactions[i].recipientName = '手续费';
					}
					data.transactions[i].showTime = false;
					data.transactions[i].amountFixed = (data.transactions[i].amount/100000000).toFixed(2);
					data.transactions[i].amountFixed = data.transactions[i].amountFixed * 1;
				}
				data.transactions[i].plusMinus = data.transactions[i].amount < 0 ? '-' : '+';
				$scope.transaction.transactions = data.transactions;
				var len = Math.ceil(data.count/limit);
				$scope.transaction.page = len;
				$scope.transaction.pageArr = Array(len);
				console.log(data.transactions);
			}else {
				$ionicPopup.alert({
					title : '<div>温馨提示</div>',
	                template: '<div class="text-center">获取最近交易失败</div>'
				})
			}
		}, function(err) {
			$ionicPopup.alert({
				title : '<div>温馨提示</div>',
                template: '<div class="text-center">' + err + '</div>'
			})
		})
	}

	getTransactionsByPage(0, 10);

	/**
	 * 下一页交易
	 * @param  {[type]} limit [description]
	 * @return {[type]}       [description]
	 */
	$scope.nextPage = function(limit) {
		$scope.transaction.current ++;
		getTransactionsByPage($scope.transaction.current, limit);
	}

	/**
	 * 上一页交易
	 * @param  {[type]} limit [description]
	 * @return {[type]}       [description]
	 */
	$scope.prevPage = function(limit) {
		$scope.transaction.current --;
		getTransactionsByPage($scope.transaction.current, limit);
	}

}]).controller('benefitMoreCtrl', ['$scope', '$ionicPopup', 'userService', function($scope, $ionicPopup, userService) {
	$scope.benefit = {};
	$scope.benefit.page = 0;
	$scope.benefit.current = 0;

	/**
	 * 分页获取收益
	 * @param  {[type]} page  [description]
	 * @param  {[type]} limit [description]
	 * @return {[type]}       [description]
	 */
	function getBenefitsByPage(page, limit) {
		$scope.benefit.benefits = {};
		var req = {
			'address' : userService.address,
			'limit' : limit,
			'offset' : page*limit
		}
		getOnce(true, '/api/accounts/allBalanceDetails', req, function(data) {
			if(data.success === true) {
				for(var i in data.balancedetails) {
					data.balancedetails[i].amountFixed = (data.balancedetails[i].amount/100000000).toFixed(2);
					data.balancedetails[i].amountFixed = data.balancedetails[i].amountFixed * 1;
				}
				$scope.benefit.benefits = data.balancedetails;
				var len = Math.ceil(data.count[0][0]/limit);
				$scope.benefit.page = len;
			}else {
				$ionicPopup.alert({
					title : '<div>温馨提示</div>',
	                template: '<div class="text-center">获取最近交易失败</div>'
				})
			}
		}, function(err) {
			$ionicPopup.alert({
				title : '<div>温馨提示</div>',
                template: '<div class="text-center">' + err + '</div>'
			})
		})
	}

	getBenefitsByPage(0, 10);

	$scope.nextPage = function(limit) {
		$scope.benefit.current ++;
		getBenefitsByPage($scope.benefit.current, limit);
	}

	$scope.prevPage = function(limit) {
		$scope.benefit.current --;
		getBenefitsByPage($scope.benefit.current, limit);
	}

}])
