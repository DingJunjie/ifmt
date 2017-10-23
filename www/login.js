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
require("./js/angular-qrcode.min.js");
window.qrcode = require("./js/qrcode.js");
window.jsQR = require("jsqr");


window.appConfig = require('./config.json');
// require("./js/userService.js");

// var Buffer = require('buffer/').Buffer;
window.ifmjs = require("ifmcoin-js");
window.address = require('./node_modules/ifmcoin-js/lib/helpers/address.js');

if(window.appConfig.netVersion === "testnet" ){
  ifmjs.setting.testnet();
} else{
  ifmjs.setting.runnet();
}



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
    // 'monospaced.qrcode',
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

    /*var walletDB = {
      dbReq : null,
      dbOpt : {
        name: "wallet",
        version: 1,
        db: null
      },

      init: function() {
        this.dbReq = window.indexedDB.open(this.dbOpt.name);
        var that = this;
        this.dbReq.onerror = function(e) {
          console.log('error' + e);
        }
        this.dbReq.onsuccess = function(e) {
          console.log("success");
          that.dbOpt.db = e.target.result;
        }

      },

      insertData: function(objName, obj) {
        this.dbReq.onupgradeneeded = function(e) {
          var db = this.dbReq.result;

          if(!db.objectStoreNames.contains('account')) {
            db.createObjectStore('account');
          }

          var transaction = db.transaction(objName, 'readwrite');
          transaction.oncomplete = function(ev) {
            console.log('事务创建成功');
          }

          transaction.onerror = function(ev) {
            console.log(ev);
          }

          transaction.onabort = function(ev) {
            console.log(ev);
          }

          var objStore = transaction.objectStore(objName);
          var req = objStore.add(obj);

          req.onsuccess = function(e) {
            console.log('数据插入成功');
          }
        }
      },

      close: function() {
        this.dbReq.close();
      },

      delete: function() {
        this.close();
        indexedDB.deleteDatabase(this.dbOpt.name);
      }
    }

    walletDB.init();*/

    var dbOpt = {
      name: "wallet",
      version: 1,
      db: null
    };

    function openDB (name, version) {
      var version = version || 1;
      var request = window.indexedDB.open(name, version);
      request.onerror = function(e) {
        console.log(e);
      }
      request.onsuccess = function(e) {
        dbOpt.db = e.target.result;
      }
      request.onupgadeneeded = function(e) {
        var db = e.target.result;
        if(!db.objectStoreNames.contains('account')) {
          db.createObjectStore('account', {keyPath: "id"});
        }
        console.log('DB version changed to ' + version);
      }
    }

    function addData(db, storeName) {
      var transaction = db.transaction(storeName, 'readwrite');
      var store = transaction.objectStore(storeName);

      store.add({
        "pass" : '123',
        "remember" : true
      })
    }

    openDB(dbOpt.name, dbOpt.version);
    $timeout(function() {
      addData(dbOpt.db, "account");
    }, 1000);

    var initAccount = function() {
      if(window.localStorage.remember === 'true') {
        $scope.loginOpt.passRemembered = true;
        $scope.loginOpt.secret = window.localStorage.pass;
      }else {
        $scope.loginOpt.secret = '';
      }
    }

    initAccount();

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

    /**
     * 登录
     * @return {[type]} [description]
     */
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
                      window.localStorage.pass = $scope.loginOpt.secret;
                      if($scope.loginOpt.passRemembered === true) {
                        window.localStorage.remember = true;
                      }else {
                        window.localStorage.removeItem('pass');
                        window.localStorage.remember = '';
                      }
                      // walletDB.insertData("account", {
                        // "pass" : $scope.loginOpt.secret,
                        // "remember" : $scope.loginOpt.passRemembered
                      // });
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
                      window.localStorage.userData = JSON.stringify(data);
                      window.localStorage.pass = $scope.loginOpt.rePassphrase;
                      window.location.href = "./user/index.html#/home";
                    }
                    
                  }, function(err) {
                    console.log(JSON.stringify(err));
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
// require('./component/qrcode/qrcode.js');
require('./user/index.js');
require('./user/home/home.js');
require('./user/pay/pay.js');
require('./user/blockChain/blockChain.js');
require('./user/account/account.js');

require('./js/service/userService.js');
require('./js/filter/timeStampFilter.js');
require('./js/filter/dateDiffFilter.js');
require('./js/filter/noEulerNumberFilter.js');
require('./js/service/runtimeDataService.js');
require('./js/filter/numberFilter.js');
require('./js/service/httpAjaxService.js');
require('./js/filter/balanceTypeFilter.js');