/**
 * Created by 俊杰 on 2017/7/5.
 */
var app = angular.module('IfmCoinApp', [
    'ngRoute',
    'ionic',
    'ngCordova',
    'ngAnimate',
]);

//app.config(function ($routeProvider) {
//    $routeProvider.when('/', {templateUrl: 'myinfo.html', reloadOnSearch: false});
//    $routeProvider.when('/myplan', {templateUrl: 'myplan.html', reloadOnSearch: false});
//    $routeProvider.when('/myplan/:id', {templateUrl: 'myplandetail.html', reloadOnSearch: false});//钱包明细信息的路由
//    $routeProvider.when('/glorious', {templateUrl: 'project.html', reloadOnSearch: false});
//    $routeProvider.when('/compensationBenefits', {templateUrl: 'compensationBenefits.html', reloadOnSearch: false});
//    $routeProvider.when('/customer', {templateUrl: 'customer.html', reloadOnSearch: false});
//});

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
app.controller('mainController', ['$rootScope', '$scope', '$timeout', '$interval', '$http', '$ionicPopup', '$ionicPlatform', '$location', '$anchorScroll', '$cordovaImagePicker', '$cordovaCamera', '$cordovaGeolocation', '$cordovaNetwork', '$cordovaActionSheet', '$cordovaContacts','$ionicSlideBoxDelegate','$ionicTabsDelegate', function ($rootScope, $scope, $timeout, $interval, $http, $ionicPopup, $ionicPlatform, $location, $anchorScroll,$cordovaImagePicker,$cordovaCamera,$cordovaGeolocation,$cordovaNetwork,$cordovaActionSheet,$cordovaContacts,blockChainService, $ionicSlideBoxDelegate,$ionicTabsDelegate) {
    /*if (ionic && ionic.Platform) {
        //alert("ionic platform");

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
    }*/

    //网页端监听 android 返回按钮(by wmc)

    /*if ($scope.isAndroid) {
        $ionicPlatform.onHardwareBackButton(function () {
            alert("click on hardware back button");
        });
    }*/


    window.$rootScope = $rootScope;//用来全局控制动态加载效果
    window.$scope = $scope;


    $scope.gridContentHeight = ($(document).height() - 200);
    $scope.fullHeight = $(document).height();
    $scope.bnlcHeight = $(document).height() - 48;
    $scope.expSlideHeight = $(document).height() -324;
    $scope.serviceHeight = $(document).height() - 110;
    $scope.blockChainTableHeight = $(document).height();

}])

app.controller('loginController', ['$rootScope', '$scope',  '$timeout', '$interval', '$http', '$ionicPopup', '$ionicPlatform', '$location', '$anchorScroll', '$cordovaImagePicker', '$cordovaCamera', '$cordovaGeolocation', '$cordovaNetwork', '$cordovaActionSheet', '$cordovaContacts','$ionicSlideBoxDelegate','$ionicTabsDelegate', function ($rootScope, $scope, $timeout, $interval, $http, $ionicPopup, $ionicPlatform, $location, $anchorScroll,$cordovaImagePicker,$cordovaCamera,$cordovaGeolocation,$cordovaNetwork,$cordovaActionSheet,$cordovaContacts,blockChainService, $ionicSlideBoxDelegate,$ionicTabsDelegate) {

    //选择注册
    $scope.reg = false;
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
      })
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
            if($scope.pwd && /\w{10,}/.test($scope.pwd) == true) {
                //if($scope.protocolAgree == true ) {
                    var req = {
                        "phone" : $scope.phone
                    }
                    //getOnce(false, 'http://192.168.16.230:20010/api/v1/bnlc/user/sendVerifyCode', req, function(data) {
                        window.location.href = "./user/index.html#/home";
                    //}, function(err) {
                    //    alert(err.error.message);
                    //})
                //}else {
                //    throw ("您还没有同意协议。");
                //}
            }else {
                throw ("请输入正确的主密码。");
            }
        }catch (e) {
            //$ionicPopup.show({
            //    title : '温馨提示',
            //    template: e
            //})
            //console.log($ionicPopup);
            $ionicPopup.alert({
                title : '<div>温馨提示</div>',
                template: '<div class="text-center">' + e + '</div>'
            });

        }
    }
}])

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
})
