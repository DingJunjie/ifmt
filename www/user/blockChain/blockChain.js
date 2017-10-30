/**
 * Created by 俊杰 on 2017/7/26.
 */

angular.module('IfmCoinApp').controller('chainCtrl',[ '$scope', '$timeout', '$interval', 'userService', '$ionicPopup', 'runtimeData', 'gettext', 'gettextCatalog', 'languageService', function($scope, $timeout, $interval, userService, $ionicPopup, runtimeData, gettext, gettextCatalog, languageService) {
  /**
   * TIP:由于ANGULARJS和IONIC的作用域问题，$scope和页面上的$scope不一致
   * 所以要使用$scope.$parent或者使用$rootScope来设置部分值，一部分全局放置在$rootScope
   */
  $scope.blocks = {};
  $scope.blockDetail = {};
  $scope.trades = {};
  $scope.tradeDetail = {};
  $scope.userData = {};
  $scope.userData.autoDig = $rootScope.autoDig;

  /**
   * 设置幻灯片的显示
   * @param  {[type]} event [description]
   * @param  {[type]} data) {               $scope.slider [description]
   * @return {[type]}       [description]
   */
  $scope.$on('$ionicSlides.sliderInitialized', function(event, data) {
    $scope.slider = data.slider;
  });

  $scope.$on('$ionicSlides.slideChangeEnd', function(event, data) {
    $scope.activeIndex = data.slider.activeIndex;
    $scope.previousIndex = data.slider.previousIndex;
    $scope.chainSelected = data.slider.activeIndex;
    $timeout(function() {
      $scope.chainSelected;
    },0);
  });

  $scope.chainSelected = 0;

  $scope.chainTabClick = function(i) {
    if($scope.chainSelected == i) {
      return;
    }else {
      $scope.chainSelected = i;
    }

    if($scope.slider) {
      $scope.slider.slideTo(i);
    }
  };

  $scope.blockChainOpt = {
    loop: false,
    effect: 'slide',
    speed: 500,
    pagination: false
  };

  /**
   * 获取10个块
   * @return {[type]} [description]
   */
  function getBlock() {
    var blockRequest = {
      'limit' : 40,
      'offset' : 0,
      'orderBy' : 'height:desc'
    };
    getOnce(true, '/api/blocks/', blockRequest, function(data) {
      if(data.success === true) {
        for(var i in data.blocks) {
          data.blocks[i].rewardName = (data.blocks[i].reward/100000000).toFixed(2);
          data.blocks[i].totalFeeName = (data.blocks[i].totalFee/100000000).toFixed(2);
          data.blocks[i].totalForgedName = (data.blocks[i].totalForged/100000000).toFixed(2);
        }
        $scope.blocks = data.blocks;
      }
    })
  }
  getBlock();

  /**
   * 打开显示块信息
   * @param  {[type]} block [需要显示的块]
   * @return {[type]}       [description]
   */
  $scope.showBlock = function(block) {
    // $scope.blockDetail = block;
    $rootScope.blockDetail = block;
    runtimeData.setBlock(block);
    window.location.href = '#/blockChain/blockDetail';
  }

  /**
   * 开启自动挖矿，获取输入的手续费和密码，再引用自动挖矿方法
   * @return {[type]} [description]
   */
  $scope.startDig = function() {

    $ionicPopup.prompt({
      title: gettextCatalog.getString("FEE"),
      template: gettextCatalog.getString("Please enter a valid transaction fee: >= 0.00000001"),
      inputType: 'number',
      inputPlaceholder: parseFloat($scope.fee),
      buttons: [
        {text: gettextCatalog.getString('CANCEL'), 
         onTap: function(e) {
           return
        }},
        {text: gettextCatalog.getString('CONFIRM'),
         type: 'button-positive'}
      ]
    }).then(function(digFee) {
        if(digFee && digFee > 0.00000001 && digFee < $rootScope.maxFee) {
          if(window.localStorage.remember === 'true') {
            vote(digFee, window.localStorage.pass);
          }else {
            $ionicPopup.prompt({
              title: gettextCatalog.getString("Please enter your passphrase."),
              template: gettextCatalog.getString("Please enter your passphrase below."),
              inputType: 'text',
              inputValue: '123'
            }).then(function(pass) {
              if(pass.length>0 && ifmjs.Mnemonic.isValid(pass) === true) {
                vote(digFee, pass);
              }else {
                $ionicPopup.alert({
                  "title" : gettextCatalog.getString("Invalid secret"),
                  "template" : "<h4>"+gettextCatalog.getString("Passphrase doesn't match.")+"</h4>"
                }, function() {
                  return;
                })
              }
            })
          }
        }else {
          $ionicPopup.alert({
            "title" : gettextCatalog.getString("Invalid transaction type/fee"),
            "template" : "<h4>"+gettextCatalog.getString('Please enter a valid transaction fee: >= 0.00000001')+"</h4>"
          }, function() {
            return;
          })
        }
      })
  }

  /**
   * 开启自动投票
   * @param  {[type]} fee  [手续费设置]
   * @param  {[type]} pass [密码设置]
   * @return {[type]}      [返回]
   */
  function vote(fee, pass) {
    getOnce(true, '/api/transactions/getslottime', null, function(res) {
        if(res.success === true) {
          // 获取投票结果
          getOnce(true, '/api/accounts/randomAccessDelegates', {
            address: userService.address
          }, function(resp) {
            var delegates = resp.delegate;

            var voteList = [];

            for(var i=0; i<delegates.length; i++) {
              voteList.push("+"+delegates[i].publicKey);
              if(i == (delegates.length-1)) {
                var data = {
                  type: ifmjs.transactionTypes.VOTE,
                  secret: pass,
                  publicKey: userService.publicKey,
                  fee: fee,
                  timestamp: res.timestamp,
                  asset: {
                    votes: voteList
                  }
                }
              

                ifmjs.transaction.createTransaction(data, function(err, transaction) {
                  try {
                    if(err) {
                      throw err;
                    }else {
                      putOnce(true, '/api/accounts/tx/delegates', transaction, function(data) {
                        if(data.success === true) {
                          runtimeData.autoDig = true;
                          $rootScope.autoDig = true;
                          window.localStorage.autoDig = true;
                          $timeout(function() {
                            $scope.userData.autoDig = true;
                          }, 0);
                        }else {
                          console.log(data);
                          $ionicPopup.alert({
                            "title" : gettextCatalog.getString('Tips'),
                            "template" : "<h4>"+gettextCatalog.getString(data.error.message)+"</h4>"
                          })
                        }
                      })
                    }
                  }catch(e) {
                    $ionicPopup.alert({
                      "title" : gettextCatalog.getString('Tips'),
                      "template" : "<h4>"+gettextCatalog.getString(e.error.message)+"</h4>"
                    })
                  }
                })
              }

          }
        })
      }else {
        $ionicPopup.alert({
          "title" : gettextCatalog.getString('Tips'),
          "template" : "<h4>"+gettextCatalog.getString(res.error.message)+"</h4>"
        })
      }
    })
  }

  $scope.cancelDig = function() {
    $ionicPopup.confirm({
      "title" : gettextCatalog.getString('Close Forging'),
      "template" : "<h4>"+gettextCatalog.getString('Please confirm whether to close forging.')+"</h4>"
    }).then(function(makeSure) {
      if(makeSure === true) {
        var req = {
          "publicKey" : userService.publicKey
        }
        getOnce(true, '/api/delegates/forging/status', req, function(res) {
          if(res.success === true) {
            runtimeData.autoDig = false;
            $rootScope.autoDig = false;
            window.localStorage.removeItem('autoDig');
            $timeout(function() {
              $scope.userData.autoDig = false;
            }, 0);
          }else {
            $ionicPopup.alert({
              "title" : gettextCatalog.getString('Tips'),
              "template" : "<h4>"+gettextCatalog.getString(res.error.message)+"</h4>"
            })
          }
        })

      }
    })
  }

  /**
   * 当缓存自动挖矿开启时自动挖矿
   * @return {[type]} [description]
   */
  var initDig = function() {
    if(window.localStorage.autoDig === 'true') {
      $scope.startDig();
    }
  }

  initDig();

  /**
   * 获取20个交易信息
   * @return {[type]} [description]
   */
  function getNewestTrade () {
    var tradeOpt = {
      "limit" : 20,
      "offset" : 0,
      "orderBy" : 'b_height:desc'
    }
    getOnce(true, '/api/transactions', tradeOpt, function(data) {
      // console.log(data);
      if(data.success === true) {
        $scope.trades = data.transactions;
        console.log($scope.trades);
      }else {
        $scope.trades = {};
      }
    })
  }
  getNewestTrade();

  /**
   * 10秒获取1次交易和块
   */
  $interval(getNewestTrade, 10000);
  $interval(getBlock, 10000);

  $scope.showTrade = function(trade) {
    $rootScope.tradeDetail = trade;
    runtimeData.setTrade(trade);
    window.location.href = '#/blockChain/tradeDetail';
  }

  $scope.$watch('$viewContentLoaded', function() {  
      getNewestTrade();
      getBlock();
  });

}]).controller('blockDetailCtrl', ['$scope', '$timeout', 'runtimeData', 'gettext', 'gettextCatalog', 'languageService', function($scope, $timeout, runtimeData, gettext, gettextCatalog, languageService) {
  // $scope.blockDetail = runtimeData.getBlock();

}]).controller('tradeDetailCtrl', ['$scope', '$timeout', 'runtimeData', 'gettext', 'gettextCatalog', 'languageService', function($scope, $timeout, runtimeData, gettext, gettextCatalog, languageService) {
  // $scope.tradeDetail = runtimeData.getTrade();
}]).controller('blockMoreCtrl', ['$scope', 'userService', 'runtimeData', 'gettext', 'gettextCatalog', 'languageService', function($scope, userService, runtimeData, gettext, gettextCatalog, languageService) {
  $scope.block = {};
  $scope.block.page = 0;
  $scope.block.current = 0;

  function getBlockByPage(page, limit) {
    var blockRequest = {
      'limit' : limit,
      'offset' : limit*page,
      'orderBy' : 'height:desc'
    };
    getOnce(true, '/api/blocks/', blockRequest, function(data) {
      if(data.success === true) {
        for(var i in data.blocks) {
          data.blocks[i].rewardName = (data.blocks[i].reward/100000000).toFixed(2);
          data.blocks[i].totalFeeName = (data.blocks[i].totalFee/100000000).toFixed(2);
          data.blocks[i].totalForgedName = (data.blocks[i].totalForged/100000000).toFixed(2);
        }
        $scope.block.page = Math.ceil(data.count/limit);
        $scope.blocks = data.blocks;
      }
    })
  }

  getBlockByPage(0, 10);

  $scope.showBlock = function(block) {
    // $scope.blockDetail = block;
    $rootScope.blockDetail = block;
    runtimeData.setBlock(block);
    window.location.href = '#/blockChain/blockDetail';
  }

  $scope.nextPage = function(limit) {
    $scope.block.current ++;
    getBlockByPage($scope.block.current, limit);
  }

  $scope.prevPage = function(limit) {
    $scope.block.current --;
    getBlockByPage($scope.block.current, limit);
  }
}])
