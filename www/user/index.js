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

/**
 * QRcode插件，用于生成地址的QRCODE
 */
angular.module('IfmCoinApp').directive('qrcode', ['$window', function ($window) {

        var canvas2D = !!$window.CanvasRenderingContext2D,
            levels = {
                'L': 'Low',
                'M': 'Medium',
                'Q': 'Quartile',
                'H': 'High'
            },
            draw = function (context, qr, modules, tile) {
                for (var row = 0; row < modules; row++) {
                    for (var col = 0; col < modules; col++) {
                        var w = (Math.ceil((col + 1) * tile) - Math.floor(col * tile)),
                            h = (Math.ceil((row + 1) * tile) - Math.floor(row * tile));

                        context.fillStyle = qr.isDark(row, col) ? '#000' : '#fff';
                        context.fillRect(Math.round(col * tile),
                            Math.round(row * tile), w, h);
                    }
                }
            };

        return {
            restrict: 'E',
            template: '<canvas class="qrcode"></canvas>',
            link: function (scope, element, attrs) {
                var domElement = element[0],
                    $canvas = element.find('canvas'),
                    canvas = $canvas[0],
                    context = canvas2D ? canvas.getContext('2d') : null,
                    download = 'download' in attrs,
                    href = attrs.href,
                    link = download || href ? document.createElement('a') : '',
                    trim = /^\s+|\s+$/g,
                    error,
                    version,
                    errorCorrectionLevel,
                    data,
                    size,
                    modules,
                    tile,
                    qr,
                    $img,
                    setVersion = function (value) {
                        version = Math.max(1, Math.min(parseInt(value, 10), 40)) || 5;
                    },
                    setErrorCorrectionLevel = function (value) {
                        errorCorrectionLevel = value in levels ? value : 'M';
                    },
                    setData = function (value) {
                        if (!value) {
                            return;
                        }

                        data = value.replace(trim, '');
                        qr = qrcode(version, errorCorrectionLevel);
                        qr.addData(data);

                        try {
                            qr.make();
                        } catch (e) {
                            error = e.message;
                            return;
                        }

                        error = false;
                        modules = qr.getModuleCount();
                    },
                    setSize = function (value) {
                        size = parseInt(value, 10) || modules * 2;
                        tile = size / modules;
                        canvas.width = canvas.height = size;
                    },
                    render = function () {
                        if (!qr) {
                            return;
                        }

                        if (error) {
                            if (link) {
                                link.removeAttribute('download');
                                link.title = '';
                                link.href = '#_';
                            }
                            if (!canvas2D) {
                                domElement.innerHTML = '<img src width="' + size + '"' +
                                    'height="' + size + '"' +
                                    'class="qrcode">';
                            }
                            scope.$emit('qrcode:error', error);
                            return;
                        }

                        if (download) {
                            domElement.download = 'qrcode.png';
                            domElement.title = 'Download QR code';
                        }

                        if (canvas2D) {
                            draw(context, qr, modules, tile);

                            if (download) {
                                //domElement.href = canvas.toDataURL('image/png');
                                return;
                            }
                        } else {
                            domElement.innerHTML = qr.createImgTag(tile, 0);
                            $img = element.find('img');
                            $img.addClass('qrcode');

                            if (download) {
                                //domElement.href = $img[0].src;
                                return;
                            }
                        }

                        if (href) {
                            //domElement.href = href;
                        }
                    };

                if (link) {
                    link.className = 'qrcode-link';
                    $canvas.wrap(link);
                    domElement = domElement.firstChild;
                }

                setVersion(attrs.version);
                setErrorCorrectionLevel(attrs.errorCorrectionLevel);
                setSize(attrs.size);

                attrs.$observe('version', function (value) {
                    if (!value) {
                        return;
                    }

                    setVersion(value);
                    setData(data);
                    setSize(size);
                    render();
                });

                attrs.$observe('errorCorrectionLevel', function (value) {
                    if (!value) {
                        return;
                    }

                    setErrorCorrectionLevel(value);
                    setData(data);
                    setSize(size);
                    render();
                });

                attrs.$observe('data', function (value) {
                    if (!value) {
                        return;
                    }

                    setData(value);
                    setSize(size);
                    render();
                });

                attrs.$observe('size', function (value) {
                    if (!value) {
                        return;
                    }

                    setSize(value);
                    render();
                });

                //attrs.$observe('href', function (value) {
                //    if (!value) {
                //        return;
                //    }
                //
                //    href = value;
                //    render();
                //});
            }
        };
    }]);


angular.module('IfmCoinApp').run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
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
angular.module('IfmCoinApp').controller('MainController', ['$rootScope', '$scope', '$timeout', '$interval', '$http', 'userService', 'runtimeData', 'httpAjaxService', '$ionicPopup', '$ionicPlatform', '$location', '$anchorScroll', '$cordovaImagePicker', '$cordovaCamera', '$cordovaGeolocation', '$cordovaNetwork', '$ionicActionSheet','$ionicSlideBoxDelegate','$ionicTabsDelegate', 'gettext', 'gettextCatalog', 'languageService', function ($rootScope, $scope, $timeout, $interval, $http, userService, runtimeData, httpAjaxService, $ionicPopup, $ionicPlatform, $location, $anchorScroll,$cordovaImagePicker,$cordovaCamera,$cordovaGeolocation,$cordovaNetwork, $ionicSlideBoxDelegate,$ionicTabsDelegate, $ionicActionSheet, gettext, gettextCatalog, languageService) {

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

  var inputs = $('input');

  inputs.on('focus', handleScroll);

  function handleScroll(e) {
    var ip = e.target;

    setTimeout(function() {
      ip.scrollIntoView(false);
    })
  }

  /**
   * 从login获取的数据无法在home获取，所以存至localStorage再进行获取
   * 当前端获取到login的值时进行赋值，并清空，当未获取时直接返回至登录
   * @return {[type]} [description]
   */
  (function () {
    var userData = window.localStorage.userData;
    if(userData && JSON.parse(userData).success === true) {
      var data = JSON.parse(userData);
      userService.setData(data.account.address, data.account.publicKey, data.account.balance, data.account.unconfirmedBalance, data.account.effectiveBalance);
      userService.setForging(data.account.forging);
      userService.unconfirmedPassphrase = data.account.unconfirmedSignature;
      userService.username = data.account.username;
      userService.secondSign = data.account.secondSignature;
      $rootScope.changeLang(window.localStorage.language);
      refreshAccount();
      window.localStorage.removeItem('userData');
    }else {
      window.location.href="/";
    }
  })()

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
  // window.fee = runtimeData.getFee();
  $rootScope.fee = runtimeData.getFee();
  $rootScope.maxFee = runtimeData.getMaxFee();
  $rootScope.address = userService.address;
  $rootScope.autoDig = runtimeData.autoDig;
  $rootScope.username = userService.username;
  $rootScope.balance = userService.balance;
  $rootScope.secondSign = userService.secondSign;
  
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

  /**
   * 当从非账户页面进入设置手续费，再点击账户时会跳入手续费设置页面
   * 所以设置点击进入账户为click方法，而不是通过路由进行直接跳转
   * @return {[type]} [description]
   */
  $scope.openAccount = function() {
    $rootScope.paying = false;
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
   * 获取当前轮次的相关信息，获取当前的进度
   */
  var publicKey = userService.publicKey;
  $rootScope.roundProgress = 0;
  var blockTime = 10;
  var remainTime = function() {
    getOnce(true, '/api/delegates/roundTime', {params: {publicKey: publicKey}}, function(res) {
      if(res.success === true) {
        var duringTime = res.nextRoundTime;
        // var roundProgress = ((1 - duringTime/(57*blockTime))*100).toFixed(2);
        // $rootScope.roundProgress = roundProgress;
        
        // var startTime = roundStartTime(res.nextRoundTime, blockTime);
        getOnce(true, '/api/transactions/getslottime', null, function(res) {
          if(res.success === true) {
            // console.log(res.timestamp,startTime);
            // var duringTime = res.timestamp - startTime;
            // var duringTime = res.nextRoundTime;
            var roundProgress = ((1 - duringTime/(57*blockTime))*100).toFixed(2);
            // var roundProgress = (duringTime/(57*blockTime)*100).toFixed(2);
            $rootScope.roundProgress = roundProgress;
          }
        })
      }
    })
  }

  remainTime();
  $interval(remainTime, 3000);


  function refreshAccount() {
    var req = {
      "address" : userService.address
    }
    getOnce(true, '/api/accounts', req, function(data) {
      if(data.success === true) {
        $rootScope.username = data.account.username;
      }
    })
  }


}]).run(function(languageService) {
  languageService();
})

/**
 * 进入二级页面隐藏tab需要
 * @param  {[type]} $rootScope [description]
 * @param  {[type]} $location) {               return {        restrict: 'A',        link: function (scope, element, attributes) {            scope.$on('$ionicView.beforeEnter', function () {                scope.$watch(attributes.hideTabs, function (value) {                                        if ($location.path() [description]
 * @return {[type]}            [description]
 */
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

/**
 * 定义tab位于底部
 * 当是android时默认在顶部，需要这个进行配置
 * @param  {[type]} $stateProvider        [description]
 * @param  {[type]} $urlRouterProvider    [description]
 * @param  {[type]} $ionicConfigProvider) {               $ionicConfigProvider.tabs.position('bottom');} [description]
 * @return {[type]}                       [description]
 */
angular.module('IfmCoinApp').config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
})

/**
 * 进行路由配置
 * @param  {[type]} $stateProvider      [description]
 * @param  {[type]} $urlRouterProvider) {                   $stateProvider            .state('tabs', {                abstract: true,                templateUrl: "menus.html"            })            .state('tabs.home', {                url: "/home",                views: {                    'index-tab': {                        templateUrl: "home/home.html"                    }                }            })            .state('tabs.blockChain', {                url: "/blockChain",                views: {                    'chain-tab': {                        templateUrl: "blockChain/blockChain.html"                    }                }            } [description]
 * @return {[type]}                     [description]
 */
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
            .state('tabs.tradeMore', {
                url: "/home/tradeMore",
                views: {
                    'index-tab' : {
                        templateUrl: "home/tradeMore.html"
                    }
                }
            })
            .state('tabs.benefitMore', {
                url: "/home/benefitMore",
                views: {
                    'index-tab' : {
                        templateUrl: "home/benefitMore.html"
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
            .state('tabs.blockMore', {
              url: "/blockChain/blockMore",
              views: {
                'chain-tab': {
                  templateUrl: "blockChain/blockMore.html"
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
            })
            .state('tabs.second-signature', {
              url: "/account/secondSignature",
              views: {
                "account-tab" : {
                  templateUrl: "account/secondSignature.html"
                }
              }
            });


        // $urlRouterProvider.otherwise("/home");

  })
