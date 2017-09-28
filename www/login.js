/**
 * Created by 俊杰 on 2017/7/5.
 */
/*require('angular');
require('./lib/ionic/js/ionic.bundle.js');
require('./lib/ngCordova/dist/ng-cordova.js');
require('./dist/js/jquery-1.8.3.min.js');
require('./dist/js/angular-route.min.js');
require('./dist/js/angular-animate.min.js');
require('./js/swiper.jquery.min.js');
require('./js/commonAPI.js');
require('./login.js');
require('./js/pinyin.js');
require('./component/contactMenu/contactMenu.js');
require('./component/contactMenu/contactIndex.js');
require('./component/chainSwiper/chainSwiper.js');
require('./component/progressCircle/progressCircle.js');
require('./component/progressCircle/progressWave.js');
require('./user/index.js');
require('./user/home/home.js');
require('./user/pay/pay.js');
require('./user/blockChain/blockChain.js');
require('./user/account/account.js');*/

require("./lib/ionic/js/ionic.bundle.js");
require("ng-cordova");
require("./dist/js/jquery-1.8.3.min.js");
require("./dist/js/angular-route.min.js");
require("./dist/js/angular-animate.min.js");
require('./js/swiper.jquery.min.js');
require("./dist/js/socket.io.js");
require("./js/commonAPI.js");

// require("./js/userService.js");

// var Buffer = require('buffer/').Buffer;
var ifmjs = require("ifmcoin-js");



/*var app = angular.module('IfmCoinLoginApp', [
    'ngRoute',
    'ionic',
    'ngCordova',
    'ngAnimate',
]);*/

var app = angular.module('IfmCoinApp', [
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
]);

angular.module('IfmCoinApp').run(function ($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      // StatusBar.hide();
      // StatusBar.hide();
      StatusBar.overlaysWebView(true);
      StatusBar.backgroundColorByHexString("#fff");
      // StatusBar.backgroundColorByHexString("#ffffffff")
    }
  });
})



angular.module('IfmCoinApp').controller('loginController', ['$rootScope', '$scope',  '$timeout', '$interval', '$http', 'userService', '$ionicPopup', '$ionicPlatform', '$location', '$anchorScroll', '$cordovaImagePicker', '$cordovaCamera', '$cordovaGeolocation', '$cordovaNetwork', '$cordovaActionSheet', '$cordovaContacts','$ionicSlideBoxDelegate','$ionicTabsDelegate', function ($rootScope, $scope, $timeout, $interval, $http, userService, $ionicPopup, $ionicPlatform, $location, $anchorScroll,$cordovaImagePicker,$cordovaCamera,$cordovaGeolocation,$cordovaNetwork,$cordovaActionSheet,$cordovaContacts,blockChainService, $ionicSlideBoxDelegate,$ionicTabsDelegate) {
    window.$rootScope = $rootScope;//用来全局控制动态加载效果
    window.$scope = $scope;

    $scope.gridContentHeight = ($(document).height() - 200);
    $scope.fullHeight = $(document).height();
    $scope.bnlcHeight = $(document).height() - 48;
    $scope.expSlideHeight = $(document).height() -324;
    $scope.serviceHeight = $(document).height() - 110;
    $scope.blockChainTableHeight = $(document).height();
    $scope.loginOpt = {};
    //选择注册
    $scope.reg = false;
    // $scope.secret = '';
    //重新输入主密码
    $scope.repwd = false;

    //注册
    $scope.newAccount = function() {
      $scope.reg = true;
    }

    //保存密码
    $scope.savedPwd = function() {
      //window.clipboardData.setData("Text", $scope.pwd);
      //angular.element();

      //$('.login-pwd-content').focus();
      document.querySelectorAll('.login-pwd-content')[0].select();
      document.execCommand("Copy");
      $ionicPopup.alert({
        title: '保存成功',
        template: '<h4 style="text-align: center">主密码已保存至剪贴板</h4>'
      });
    }

    //重新输入主密码
    $scope.reSubmit = function() {
      $scope.repwd = true;
    }

    //返回主密码保存界面
    $scope.returnPwd  = function() {
      $scope.repwd = false;
    }

    //生成密钥
    $scope.generatePassphrase = function () {
      var Mnemonic = require('ifmcoin-js').Mnemonic;
      var code = new Mnemonic(Mnemonic.Words.ENGLISH);
      $scope.loginOpt.passphrase = code.toString();
    };

    $scope.generatePassphrase();

    //登陆
    $scope.login = function() {
        try {
            if($scope.loginOpt.secret && $scope.reg === false) {
                var flag = ifmjs.Mnemonic.isValid($scope.loginOpt.secret);
                if(flag === true) {
                    var keypair = ifmjs.keypairHelper.create($scope.loginOpt.secret);
                    var req = {
                        "publicKey": keypair.publicKey.toString('hex')
                    }

                    putOnce(true, '/api/accounts/open/', req, function(data) {
                      window.localStorage.userData = JSON.stringify(data);
                      window.location.href = "./user/index.html#/home";
                    }, function(err) {
                      console.log(err);
                      $ionicPopup.alert({
                        title : '<div>温馨提示</div>',
                        template: '<div class="text-center">' + err + '</div>'
                      });
                       // alert(err.error.message);
                    });
                }else {
                   throw ("主密码错误，请重新输入。");
                }
            }else if($scope.loginOpt.rePassphrase && $scope.reg === true) {
                var flag = ifmjs.Mnemonic.isValid($scope.loginOpt.rePassphrase);
                if(flag === true) {
                  var keypair = ifmjs.keypairHelper.create($scope.loginOpt.rePassphrase);
                  var req = {
                    "publicKey": keypair.publicKey.toString('hex')
                  }

                  putOnce(true, '/api/accounts/open/', req, function(data) {
                    if(data.success && data.success === true) {
                      userService.setData(data.account.address, data.account.publicKey, data.account.balance, data.account.unconfirmedBalance, data.account.effectiveBalance);
                      userService.setForging(data.account.forging);
                      userService.unconfirmedPassphrase = data.account.unconfirmedSignature;
                      
                      window.location.href = "./user/index.html#/home";
                    }
                    
                  }, function(err) {
                    console.log(err);
                    $ionicPopup.alert({
                      title : '<div>温馨提示</div>',
                      template: '<div class="text-center">' + err + '</div>'
                    });
                    // alert(err.error.message);
                  });
                }else {
                  throw ("主密码错误，请重新输入。");
                }
            }else {
                throw ("请输入正确的主密码。");
            }
            // window.location.href = "./user/index.html#/home";
        }catch (e) {
            $ionicPopup.alert({
                title : '<div>温馨提示</div>',
                template: '<div class="text-center">' + e + '</div>'
            });
        }
    };

}])


require('./js/pinyin.js');
require('./component/contactMenu/contactMenu.js');
require('./component/contactMenu/contactIndex.js');
require('./component/chainSwiper/chainSwiper.js');
require('./component/progressCircle/progressCircle.js');
require('./component/progressCircle/progressWave.js');
require('./user/index.js');
require('./user/home/home.js');
require('./user/pay/pay.js');
require('./user/blockChain/blockChain.js');
require('./user/account/account.js');

require('./js/service/userService.js');
require('./js/filter/timeStampFilter.js');
require('./js/service/runtimeDataService.js');