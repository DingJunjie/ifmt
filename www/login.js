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
require("./dist/js/socket.io.js");
require("./js/commonAPI.js");
// var Buffer = require('buffer/').Buffer;
var ifmjs = require("ifmcoin-js");



var app = angular.module('IfmCoinApp', [
    'ngRoute',
    'ionic',
    'ngCordova',
    'ngAnimate',
]);

app.run(function ($ionicPlatform) {
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

//
// 我的首页
//
/*app.controller('mainController', ['$rootScope', '$scope', '$timeout', '$interval', '$http', '$ionicPopup', '$ionicPlatform', '$location', '$anchorScroll', '$cordovaImagePicker', '$cordovaCamera', '$cordovaGeolocation', '$cordovaNetwork', '$cordovaActionSheet', '$cordovaContacts','$ionicSlideBoxDelegate','$ionicTabsDelegate', function ($rootScope, $scope, $timeout, $interval, $http, $ionicPopup, $ionicPlatform, $location, $anchorScroll,$cordovaImagePicker,$cordovaCamera,$cordovaGeolocation,$cordovaNetwork,$cordovaActionSheet,$cordovaContacts,blockChainService, $ionicSlideBoxDelegate,$ionicTabsDelegate) {
    window.$rootScope = $rootScope;//用来全局控制动态加载效果
    window.$scope = $scope;


    $scope.gridContentHeight = ($(document).height() - 200);
    $scope.fullHeight = $(document).height();
    $scope.bnlcHeight = $(document).height() - 48;
    $scope.expSlideHeight = $(document).height() -324;
    $scope.serviceHeight = $(document).height() - 110;
    $scope.blockChainTableHeight = $(document).height();

}])*/

app.controller('loginController', ['$rootScope', '$scope',  '$timeout', '$interval', '$http', '$ionicPopup', '$ionicPlatform', '$location', '$anchorScroll', '$cordovaImagePicker', '$cordovaCamera', '$cordovaGeolocation', '$cordovaNetwork', '$cordovaActionSheet', '$cordovaContacts','$ionicSlideBoxDelegate','$ionicTabsDelegate', function ($rootScope, $scope, $timeout, $interval, $http, $ionicPopup, $ionicPlatform, $location, $anchorScroll,$cordovaImagePicker,$cordovaCamera,$cordovaGeolocation,$cordovaNetwork,$cordovaActionSheet,$cordovaContacts,blockChainService, $ionicSlideBoxDelegate,$ionicTabsDelegate) {
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
    $scope.pwd = 'asdkfjoiasjdfiosadflkjsdakfjlsadjflsjadlkfjasodjfoiajsdf';

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

    //登陆
    $scope.login = function() {
        try {
            if($scope.loginOpt.secret) {
                var flag = ifmjs.Mnemonic.isValid($scope.loginOpt.secret);
                if(flag === true) {
                    var keypair = ifmjs.keypairHelper.create($scope.loginOpt.secret);
                    var req = {
                        "publicKey": keypair.publicKey.toString('hex')
                    }

                  /*$http.put("http://localhost:19000/api/accounts/open/", req)
                    .then(function(data) {
                      console.log(data);
                    })
                    .catch(function(err) {
                      console.log(err);
                    })*/
                    putOnce(true, '/api/accounts/open/', req, function(data) {
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
