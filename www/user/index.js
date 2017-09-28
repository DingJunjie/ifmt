/**
 * Created by 俊杰 on 2017/6/20.
 */
/*var app = angular.module('IfmCoinApp', [
    'ngRoute',
    // 'pascalprecht.translate',
    'ionic',
    'ngCordova',
    'ngAnimate',
    'ngSanitize',
    'pinyin',
    'contactMenu',
    'contactIndex',
    'progressCircle',
    'progressWave',
    'chainSwiper',
    // 'ui.grid',
]);*/




angular.module('IfmCoinApp').run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // alert(" ionic ready");
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);

            // 判断是否在 IOS 中，如果是，需要使用 30 像素的修正值
            var heightFix = $ionicPlatform.is('ios') ? 30 : 0;

            // 对于键盘弹出与收起使用统一方式进行处理。
            // fix 参数在键盘弹出时会传入软键盘高度，
            // 在键盘收起时则传入 0 。
            function setModalHeight(fix){
                var height = $scope.modalContentHeighChatNoPx - fix - heightFix;
                // 对于含有 Text 栏的 Modal ，不需要多减修正值 30 。
                // 这样就能够解决问题。但为何能解决，仍然有疑问。
                var heightWithText = parseFloat($scope.modalContentHeighTextAndButton) - fix;
                $('div.modal-body').each(function(){
                    var $this = $(this);
                    if ($this.attr('data-ng-includeText') === 'true'){
                        $this.css('height', heightWithText);
                    } else if ($this.attr('data-ng-noFixHeight') === 'true'){
                        // 聊天界面弹出软键盘时，不需要使用高度修正
                        $this.css('height', height + heightFix);
                    } else {
                        $this.css('height', height);
                    }
                });
            }

            try {
                window.addEventListener('native.keyboardshow', function (e) {
                    // $('div.modal-body').css('background', 'red');
                    $scope.keyboardHeight = e.keyboardHeight;
                    setModalHeight($scope.keyboardHeight);
                });
                window.addEventListener('native.keyboardhide', function() {
                    setModalHeight(0);
                    //FIXME:去除焦点后再次成为焦点时才会滚动
                    $('input:focus').blur();
                    $('textarea:focus').blur();
                });
            } catch (e) {
                var err = e.message ? e.message : e;
                //配置提示框对象
                var config = {
                    content: err,
                    status: 'error'
                    //callback: function () {
                    //console.log('关闭提示框完成');
                    //}
                };
                //通过触发监听打开提示框
                $scope.$emit('openAlert', config);
            }
        }
        if (window.StatusBar) {
          // StatusBar.hide();
          // StatusBar.styleDefault();
          StatusBar.overlaysWebView(true);
          // StatusBar.backgroundColorByHexString("#fff");
          StatusBar.backgroundColorByHexString("#ffffffff")
        }
    });
})

//
// 我的首页
//
angular.module('IfmCoinApp').controller('MainController', ['$rootScope', '$scope', '$timeout', '$interval', '$http', 'userService', '$ionicPopup', '$ionicPlatform', '$location', '$anchorScroll', '$cordovaImagePicker', '$cordovaCamera', '$cordovaGeolocation', '$cordovaNetwork', '$ionicActionSheet','$ionicSlideBoxDelegate','$ionicTabsDelegate', function ($rootScope, $scope, $timeout, $interval, $http, userService, $ionicPopup, $ionicPlatform, $location, $anchorScroll,$cordovaImagePicker,$cordovaCamera,$cordovaGeolocation,$cordovaNetwork,blockChainService, $ionicSlideBoxDelegate,$ionicTabsDelegate, $ionicActionSheet) {

  if (ionic && ionic.Platform) {
      //alert("ionic platform");
      ionic.Platform.ready(function () {

          // will execute when device is ready, or immediately if the device is already ready.
          ionic.Platform.fullScreen(true, false);
          $scope.deviceInformation = ionic.Platform.device();
      });

      $scope.isWebView = ionic.Platform.isWebView();
      $scope.isIPad = ionic.Platform.isIPad();
      $scope.isIOS = ionic.Platform.isIOS();
      $scope.isAndroid = ionic.Platform.isAndroid();
      $scope.isWindowsPhone = ionic.Platform.isWindowsPhone();

      $scope.currentPlatform = ionic.Platform.platform();
      $scope.currentPlatformVersion = ionic.Platform.version();
      //ionic.Platform.exitApp(); // stops the app

      try {
          $ionicPlatform.registerBackButtonAction(function () {
              //TODO: press back twice to exit app??
              var condition = false;
              if (condition) {
                  ionic.Platform.exitApp();
              } else {
                  $scope.goBack();
              }
          }, 100);
      } catch (e) {
          var err = e.message ? e.message : e;
          //配置提示框对象
          var config = {
              content: err,
              status: 'error'
              //callback: function () {
              //console.log('关闭提示框完成');
              //}
          };
          //通过触发监听打开提示框
          $scope.$emit('openAlert', config);
      }
  }

  //网页端监听 android 返回按钮(by wmc)

  if ($scope.isAndroid) {
      $ionicPlatform.onHardwareBackButton(function () {
          console.log($state.$current.name);
      });
  }


  window.$rootScope = $rootScope;//用来全局控制动态加载效果
  window.$scope = $scope;

  $scope.loading = true;
  $scope.isAfternoon = (new Date().getHours() >= 12);//标记是否超过12点了
  // $scope.userOperation = getClientOS(navigator);//获取操作系统

  $scope.gridContentHeight = ($(document).height() - 200);
  $scope.fullWidth = $(document).width();
  $scope.fullHeight = $(document).height();
  $scope.bnlcHeight = $(document).height() - 48;
  $scope.expSlideHeight = $(document).height() -324;
  $scope.serviceHeight = $(document).height() - 110;
  $scope.blockChainTableHeight = $(document).height();

  (function () {
    var userData = window.localStorage.userData;
    if(userData && JSON.parse(userData).success === true) {
      var data = JSON.parse(userData);
      userService.setData(data.account.address, data.account.publicKey, data.account.balance, data.account.unconfirmedBalance, data.account.effectiveBalance);
      userService.setForging(data.account.forging);
      userService.unconfirmedPassphrase = data.account.unconfirmedSignature;
      window.localStorage.removeItem('userData');
    }else {
      window.location.href="/";
    }
  })()
  
  /**
   * 监听路由变化，触发部分事件
   */
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.name === "tabs.contact") {
        $scope.$emit('showIndex');
      }

      if (fromState.name === "tabs.contact") {
        $scope.$emit('hideIndex');
      }

  })

  $scope.openAccount = function() {
    $location.path("/account");
  }

  /**
   * 区块链页面的SLIDER配置
   * @type {{loop: boolean, effect: string, speed: number, pager: boolean}}
   */
  $scope.blockChainOpt = {
        loop: false,
        effect: 'slide',
        speed: 500,
        pager: false
    }

  /**
   * 卡片参数配置
   */
  $scope.cards = [{
      "date" : new Date(),
      "amount" : "1.04",
      "address" : "askdjfkasjdkfjiwfn1kj3194j1kj39121kj12"
    },{
      "date" : new Date(),
      "amount" : "1.04",
      "address" : "askdjfkasjdkfjiwfn1kj3194j1kj39121kj12"
    },{
      "date" : new Date(),
      "amount" : "1.04",
      "address" : "askdjfkasjdkfjiwfn1kj3194j1kj39121kj12"
    },{
      "date" : new Date(),
      "amount" : "1.04",
      "address" : "askdjfkasjdkfjiwfn1kj3194j1kj39121kj12"
    },{
      "date" : new Date(),
      "amount" : "1.04",
      "address" : "askdjfkasjdkfjiwfn1kj3194j1kj39121kj12"
    },{
      "date" : new Date(),
      "amount" : "1.04",
      "address" : "askdjfkasjdkfjiwfn1kj3194j1kj39121kj12"
    },{
      "date" : new Date(),
      "amount" : "1.04",
      "address" : "askdjfkasjdkfjiwfn1kj3194j1kj39121kj12"
    }]

    $scope.hasLogin = true;
    $scope.exit = function() {
        $scope.hasLogin = false;
    };

}])

angular.module('IfmCoinApp').directive('hideTabs', function ($rootScope, $location) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
            scope.$on('$ionicView.beforeEnter', function () {
                scope.$watch(attributes.hideTabs, function (value) {
                    //$rootScope.hideTabs = value;
                    if ($location.path() == '') {

                    }else {
                        $rootScope.hideTabs = value;
                        scope.hideTabs = value;
                    }
                });
            });

            scope.$on('$ionicView.beforeLeave', function () {
                $rootScope.hideTabs = false;
            });
        }
    };
})

angular.module('IfmCoinApp').config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
})

angular.module('IfmCoinApp').config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('tabs', {
                abstract: true,
                templateUrl: "menus.html"
            })
            .state('tabs.home', {
                url: "/home",
                views: {
                    'index-tab': {
                        templateUrl: "home/home.html"
                    }
                }
            })
            .state('tabs.blockChain', {
                url: "/blockChain",
                views: {
                    'chain-tab': {
                        templateUrl: "blockChain/blockChain.html"
                    }
                }
            })
            .state('tabs.tradeDetail', {
              url: "/blockChain/tradeDetail",
              views: {
                'chain-tab': {
                  templateUrl: "blockChain/tradeDetailModal.html"
                }
              }
            })
            .state('tabs.blockDetail', {
              url: "/blockChain/blockDetail",
              views: {
                'chain-tab': {
                  templateUrl: "blockChain/blockDetailModal.html"
                }
              }
            })
            .state('tabs.pay', {
                url: "/pay",
                views: {
                    'pay-tab': {
                        templateUrl: "pay/pay.html"
                    }
                }
            })
            .state('tabs.account', {
                url: "/account",
                views: {
                    'account-tab': {
                        templateUrl: "account/account.html"
                    }
                }
            })
            .state('tabs.suggest', {
                url: "/account/suggest",
                views: {
                    'account-tab' : {
                        templateUrl: "account/suggestModal.html"
                    }
                }
            })
            .state('tabs.about', {
                url: "/account/about",
                views: {
                    'account-tab' : {
                        templateUrl: "account/about.html"
                    }
                }
            })
            .state('tabs.settings', {
                url: "/account/settings",
                views: {
                    'account-tab' : {
                        templateUrl: "account/settings.html"
                    }
                }
            })
            .state('tabs.user-settings', {
                url: "/account/userSettings",
                views: {
                    'account-tab' : {
                        templateUrl: "account/userSettings.html"
                    }
                }
            })
            .state('tabs.name-setting', {
              url: "/account/nameSetting",
              views: {
                'account-tab' : {
                  templateUrl: "account/nameSetting.html"
                }
              }
            })
            .state('tabs.fee', {
                url: "/account/fee",
                views: {
                  "account-tab" : {
                      templateUrl: "account/feeConfig.html"
                  }
                }
            })
            .state('tabs.max-fee', {
              url: "/account/maxFee",
              views: {
                "account-tab" : {
                  templateUrl: "account/feeMaxConfig.html"
                }
              }
            })
            .state('tabs.contact', {
              url: "/account/contact",
              views: {
                "account-tab" : {
                  templateUrl: "account/contact.html"
                }
              }
            })
            .state('tabs.contact-user', {
              url: "/account/contactUser",
              views: {
                "account-tab" : {
                  templateUrl: "account/contactUser.html"
                }
              }
            })
            .state('tabs.contact-transfer', {
              url: "/account/contactTransfer",
              views: {
                "account-tab" : {
                  templateUrl: "account/contactTransfer.html"
                }
              }
            })
            .state('tabs.contact-add', {
              url: "/account/contactAdd",
              views: {
                "account-tab" : {
                  templateUrl: "account/contactAdd.html"
                }
              }
            });


        // $urlRouterProvider.otherwise("/home");

  })
