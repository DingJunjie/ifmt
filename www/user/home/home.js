/**
 * Created by 俊杰 on 2017/7/26.
 */

angular.module('IfmCoinApp').controller('homeCtrl', ['$scope', 'userService', function($scope, userService) {
	// console.log(timestampFilter);
	$scope.balance = userService.balance;
	$scope.balanceCNY = ($scope.balance*2).toFixed(5);
	$scope.transactions = {};

	function getTransactions() {
		var req = {
			'limit' : 8,
			'orderBy': 't_timestamp:desc',
			'recipientId': userService.address,
			'senderPublicKey': userService.publicKey
		}
		getOnce(true, '/api/transactions', req, function(data) {
			if(data.success === true) {
				for(var i in data.transactions) {

				}
				$scope.transactions = data.transactions;
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
	getTransactions();
}])
