/**
 * Created by 俊杰 on 2017/6/20.
 */
var app = angular.module('IfmCoinApp', [
    'ngRoute',
    // 'mobile-angular-ui',
    // 'mobile-angular-ui.gestures',
    'pascalprecht.translate',
    // 'angular-simditor',
    'chart.js',
    'ngFileUpload',
    // 'ngImgCrop',
    'ionic',
    'ngCordova',
    'ngAnimate',
    //'globalAlert',
    'ngSanitize',
    'ui.grid',
]);

// app.run(function ($transform) {
//     window.$transform = $transform;
// });

//app.config(function ($routeProvider) {
//    $routeProvider.when('/', {templateUrl: 'myinfo.html', reloadOnSearch: false});
//    $routeProvider.when('/myplan', {templateUrl: 'myplan.html', reloadOnSearch: false});
//    $routeProvider.when('/myplan/:id', {templateUrl: 'myplandetail.html', reloadOnSearch: false});//钱包明细信息的路由
//    $routeProvider.when('/glorious', {templateUrl: 'project.html', reloadOnSearch: false});
//    $routeProvider.when('/compensationBenefits', {templateUrl: 'compensationBenefits.html', reloadOnSearch: false});
//    $routeProvider.when('/customer', {templateUrl: 'customer.html', reloadOnSearch: false});
//});

app.run(function ($ionicPlatform) {
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
            StatusBar.styleDefault();
        }
    });
})

app.config(['$translateProvider', function ($translateProvider) {
    var lang = window.localStorage.lang || 'en';
    $translateProvider.preferredLanguage(lang);
    $translateProvider.useStaticFilesLoader({
        prefix: '../i18n/',
        suffix: '.json'
    });
}]);

/**
 * 创建二维码
 */
app.directive('qrcode', ['$window', function ($window) {

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

/**
 * 用来创建显示包含html的信息
 * 原生的ng-bind-html会提示：Attempting to use an unsafe value in a safe context.用法上还需要研究
 */
app.directive('ngHtml', ['$compile', function ($compile) {
    return function (scope, elem, attrs) {
        if (attrs.ngHtml) {
            elem.html(scope.$eval(attrs.ngHtml));
            $compile(elem.contents())(scope);
        }
        scope.$watch(attrs.ngHtml, function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                elem.html(newValue);
                $compile(elem.contents())(scope);
            }
        });
    };
}]);

//
// 我的首页
//
app.controller('MainController', ['$rootScope', '$scope', '$translate', 'Upload', '$timeout', '$interval', '$http', '$ionicPopup', '$ionicPlatform', '$location', '$anchorScroll', '$cordovaImagePicker', '$cordovaCamera', '$cordovaGeolocation', '$cordovaNetwork', '$cordovaActionSheet', '$cordovaContacts','$ionicSlideBoxDelegate','$ionicTabsDelegate', function ($rootScope, $scope, $translate, Upload, $timeout, $interval, $http, $ionicPopup, $ionicPlatform, $location, $anchorScroll,$cordovaImagePicker,$cordovaCamera,$cordovaGeolocation,$cordovaNetwork,$cordovaActionSheet,$cordovaContacts,blockChainService, $ionicSlideBoxDelegate,$ionicTabsDelegate) {
    $scope.debugJPush = false;
    if (ionic && ionic.Platform) {
        //alert("ionic platform");
        ionic.Platform.ready(function () {
            if ($scope.debugJPush) {
                var err = e.message ? e.message : e;
                //配置提示框对象
                var config = {
                    content: 'ionic ready in controller',
                    status: 'error'
                    //callback: function () {
                    //console.log('关闭提示框完成');
                    //}
                };
                //通过触发监听打开提示框
                $scope.$emit('openAlert', config);
            }
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
        if ($scope.debugJPush) {
            if ($scope.isIOS) {
                //配置提示框对象
                var config = {
                    content: 'ios detected',
                    status: 'error'
                    //callback: function () {
                    //console.log('关闭提示框完成');
                    //}
                };
                //通过触发监听打开提示框
                $scope.$emit('openAlert', config);
            }
            if ($scope.isAndroid) {
                //配置提示框对象
                var config = {
                    content: 'android detected',
                    status: 'error'
                    //callback: function () {
                    //console.log('关闭提示框完成');
                    //}
                };
                //通过触发监听打开提示框
                $scope.$emit('openAlert', config);
            }
        }

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
    $scope.isInWx = isInWx();//判断是否在微信中
    $scope.isAfternoon = (new Date().getHours() >= 12);//标记是否超过12点了
    $scope.userOperation = getClientOS(navigator);//获取操作系统

    $scope.gridContentHeight = ($(document).height() - 200);
    $scope.fullWidth = $(document).width();
    $scope.fullHeight = $(document).height();
    $scope.bnlcHeight = $(document).height() - 48;
    $scope.expSlideHeight = $(document).height() -324;
    $scope.serviceHeight = $(document).height() - 110;
    $scope.blockChainTableHeight = $(document).height();

    $scope.playing = false;//全局标识播放状态
    $scope.audio = document.createElement('audio');//创建声音播放元素
    $scope.stopPlay = function () {//停止播放
        $scope.audio.pause();
        $scope.playing = false;
    };
    $scope.audio.addEventListener('ended', function () {//添加播放完成后的事件
        $scope.$apply(function () {
            $scope.stopPlay()
        });
    });

    //播放系统通知
    $scope.playNotice = function () {
        if (!$scope.playing) {//同一时间只播放一次
            $scope.audio.src = '../media/audio/notice-ddl.mp3';//播放地址
            $scope.audio.play();
            $scope.playing = true;
        }
    }

    // User agent displayed in home page
    $scope.userAgent = navigator.userAgent;

    // Needed for the loading screen
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.loading = true;
        //弹出下载app提示 只在微信端弹出
        if (/MicroMessenger/i.test($scope.userAgent)) {
            if (!sessionStorage.getItem('askedDownloadApp')) {
                var go = false;
                var go = confirm('现在要下载APP吗？');
                if (go == true) {
                    document.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.bnqkl.ark";
                }
                sessionStorage.setItem('askedDownloadApp', true);//保证每次打开页面只提示一次
                // $rootScope.askedDownloadApp = true;
            }
        }
    });

    //Math.sign Polyfill
    if(!Math.sign){
        Math.sign = function (x) {
            x = +x // convert to a number
            if (x === 0 || isNaN(x))
                return x
            return x > 0 ? 1 : -1
        }
    }

    //路由變化
    $rootScope.$on('$routeChangeSuccess', function (angularEvent, current) {
        //console.log($('.form-search').innerHeight());
        $timeout(function() {
            if($('.form-search').hasClass('ng-hide') == false) {
                var h = $('.form-search').innerHeight();
                $('.scrollable-content').scrollTop(h);
            }
            $('.navbar-brand').bind('click', function() {
                $('.scrollable-content:animated').stop();
                $('.scrollable-content').animate({'scrollTop': 0}, 500);
            })
        }, 1);

        $rootScope.nowState = current;//当前路由缓存
        if (current.$$route.originalPath === '/') {

        }
        $rootScope.loading = false;
        $scope.workerInfo.showMyCheckPointInfo = true;
    });

    //生成一个新的比特币帐户
    $scope.makeNewBtcAccount = function () {
        postQry('/getNewBtcAccount', null, function (data) {
            //$scope.accInfo.accNum = data.publicAddress;//等于公钥地址
            //$scope.accInfo.accPrivate = data.privateKey;//等于私钥地址
            safeApply($scope);
        });
    };

    //发送比特币
    $scope.sendBtc = function (a) {
        postBiz("/sendBtc", a, function (msg) {
            //配置提示框对象
            var config = {
                content: msg,
                status: 'success'
                //callback: function () {
                //console.log('关闭提示框完成');
                //}
            };
            //通过触发监听打开提示框
            $scope.$emit('openAlert', config);
        })
    }

    //FIXME 打开页面用这个方法 可能是个坑
    $scope.openModal = function(modal){
        $scope.Ui.turnOn(modal);
        if($scope.openModals.indexOf(modal) == -1){
            $scope.openModals.push(modal);
        }
    }

    //关闭窗体
    $scope.closeMyModal = function (modalName, fn) {
        for(var i in $scope.openModals) {
            if($scope.openModals[i] == modalName) {
                $scope.openModals.splice(i, 1);
                break;
            }
        }
        $scope.Ui.turnOff(modalName);
        if (fn) eval(fn);//fn必须为字符串函数
        safeApply($scope);
    }

    //初始化极光推送相关组件
    $scope.initJPush = function () {
        if ($scope.workerInfo.theCustomer.workerStat == '1001') {
            if ($scope.isAndroid || $scope.isIOS/*window.plugins && window.plugins.jPushPlugin*/) {
                if ($scope.debugJPush) {
                    //配置提示框对象
                    var config = {
                        content: '测试极光推送',
                        status: 'success'
                        //callback: function () {
                        //console.log('关闭提示框完成');
                        //}
                    };
                    //通过触发监听打开提示框
                    $scope.$emit('openAlert', config);
                }
                // document.addEventListener("deviceready", $scope.onDeviceReady, false);
                ionic.Platform.ready(function () {
                    $scope.onDeviceReady();
                });

                document.addEventListener("pause", $scope.onPause, false);
                document.addEventListener("resume", $scope.onResume, false);
                document.addEventListener("jpush.setTagsWithAlias", $scope.onJPushTagsWithAlias, false);
                document.addEventListener("jpush.openNotification", $scope.onJPushOpenNotification, false);
                document.addEventListener("jpush.receiveNotification", $scope.onJPushReceiveNotification, false);
                document.addEventListener("jpush.receiveMessage", $scope.onJPushReceiveMessage, false);
            }
        }
    }

    //cordova 加载完成, 只在ionic中执行
    $scope.onDeviceReady = function () {
        checkApkVer(ionic);
        $scope.savArkContact();
        //启动极光推送
        //alert("onDeviceReady continue");
        try {
            window.plugins.jPushPlugin.init();
            $scope.isInIonic = true;
            //FIXME
            if ($scope.isIOS) {
                //PushConfig.plist 中delay默认为false， 表示自动注册
                //window.plugins.jPushPlugin.startJPushSDK();
                window.plugins.jPushPlugin.resetBadge();
            }

            window.setTimeout($scope.getJPushRegistrationID, 1000);
            if (device.platform != "Android") {
                if ($scope.debugJPush) {
                    window.plugins.jPushPlugin.setDebugModeFromIos();
                }
                window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
            } else {
                if ($scope.debugJPush) {
                    window.plugins.jPushPlugin.setDebugMode(true);
                }
                window.plugins.jPushPlugin.setStatisticsOpen(true);
            }
        } catch (e) {
            //TODO：通过手机浏览器会报错
            // alert(e);
        }
    };

    $scope.notificationID = 1;

    $scope.getJPushRegistrationID = function () {
        // alert("try to get registration ID");
        window.plugins.jPushPlugin.getRegistrationID($scope.onJPushGetRegistrationID);
    };

    $scope.onJPushGetRegistrationID = function (data) {
        try {
            var content = "JPushPlugin:registrationID is " + data;
            //console.log(content);
            // alert(content);

            if (data.length == 0) {
                var t1 = window.setTimeout($scope.getJPushRegistrationID, 1000);
            } else {
                //if ($scope.debugJPush) alert(content);
                // FIXME: check customerId
                // var tags = [$scope.workerInfo.customer ? $scope.workerInfo.customer.customerId : ""];
                var tags = [];
                for (var i in $scope.workerInfo.customerId) {
                    tags.push($scope.workerInfo.customerId[i].customerId);
                }
                var alias = $scope.workerInfo.workerId;
                window.plugins.jPushPlugin.setTagsWithAlias(tags, alias);
            }
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
    };

    $scope.onJPushTagsWithAlias = function (event) {
        try {
            //console.log("onTagsWithAlias");
            var result = "result code:" + event.resultCode + " ";
            result += "tags:" + event.tags + " ";
            result += "alias:" + event.alias + " ";
            if ($scope.debugJPush){
                //配置提示框对象
                var config = {
                    content: "标签和别名:" + result,
                    status: 'success'
                    //callback: function () {
                    //console.log('关闭提示框完成');
                    //}
                };
                //通过触发监听打开提示框
                $scope.$emit('openAlert', config);
            }
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
    };

    $scope.onJPushOpenNotification = function (event) {
        try {
            var alertContent;
            var from;

            window.plugins.jPushPlugin.resetBadge();
            window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
            window.plugins.jPushPlugin.clearAllNotification();

            if (device.platform == "Android") {
                alertContent = event.alert;
                from = event.extras.workerId;
            } else {
                alertContent = event.aps.alert;
                from = event.workerId;// FIXME
            }
            //清除通知计数
            try {
                $scope.notifyList[from].count = 0;
                if ($scope.debugJPush){
                    //配置提示框对象
                    var config = {
                        content: "打开通知:" + alertContent,
                        status: 'success'
                        //callback: function () {
                        //console.log('关闭提示框完成');
                        //}
                    };
                    //通过触发监听打开提示框
                    $scope.$emit('openAlert', config);
                }
            } catch (e) {
                console.log(e.message);
            }

            // alert("打开通知EXTRA:" + event.extras);
            if ($scope.debugJPush){
                //配置提示框对象
                var config = {
                    content: '"打开通知来自" + from'
                    //callback: function () {
                    //console.log('关闭提示框完成');
                    //}
                };
                //通过触发监听打开提示框
                $scope.$emit('openAlert', config);

            }
            // 打开聊天界面
            var user = undefined;
            if (from == $scope.arkWorkerId) {
                user = $scope.chatUsers[from];
            } else {
                user = $scope.chatUsers[from];
            }
            //FIXME: 判断是否已在要打开的界面
            if ($scope.showMyMessageModalStat) {
                $scope.Ui.turnOff('showMyMessageModal');
                $scope.showMyMessageModalStat = false;
            }
            $scope.showMyMessage(user);

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
    };

    $scope.onJPushReceiveNotification = function (event) {
        try {
            var alertContent;
            if (device.platform == "Android") {
                alertContent = event.alert;
            } else {
                alertContent = event.aps.alert;
            }
            if ($scope.debugJPush){

                //配置提示框对象
                var config = {
                    content: alertContent,
                    status: 'success'
                    //callback: function () {
                    //console.log('关闭提示框完成');
                    //}
                };
                //通过触发监听打开提示框
                $scope.$emit('openAlert', config);
            }
        } catch (exception) {

            //配置提示框对象
            var config = {
                content: exception,
                status: 'error'
                //callback: function () {
                //console.log('关闭提示框完成');
                //}
            };
            //通过触发监听打开提示框
            $scope.$emit('openAlert', config);
        }
    };

    $scope.notifyList = {};//{ workerId: { notifyId, count }}

    $scope.onJPushReceiveMessage = function (event) {
        var silent = false;
        try {
            var message;
            var extras = event.extras;
            // TODO: 检查是否在后台运行
            if (!$scope.runInBackground && $scope.showMyMessageModalStat && ($scope.myMessage.toWorkerId == extras.workerId)) {
                // silent = true;
                throw ("当前聊天界面不需要重复通知");
            }
            if (!$scope.notifyList[extras.workerId]) {
                $scope.notifyList[extras.workerId] = {
                    "notifyId": $scope.notificationID++,
                    "count": 1
                };
            } else {
                $scope.notifyList[extras.workerId].count++;
            }
            // 定义通知内容
            var workerName = (extras.contentType == '1002') ? "方舟" : $scope.chatUsers[extras.workerId].workerName;
            var notification = "您有" + $scope.notifyList[extras.workerId].count + "条来自" + workerName + "的消息";

            if (device.platform == "Android") {
                message = event.message;
                var builderId = 1;
                var title = $scope.workerInfo.workerName + "";
                var broadcastTime = 0;
                window.plugins.jPushPlugin.addLocalNotification(builderId, notification, title,
                    $scope.notifyList[extras.workerId].notifyId, broadcastTime, extras);

            } else {
                message = event.content;
                var delayTime = 0;
                var badge = $scope.notifyList[extras.workerId].count;
                //window.plugins.jPushPlugin.addLocalNotificationForIOS(delayTime, notification, badge, $scope.notifyList[extras.workerId].notifyId, extras);
            }
            if ($scope.debugJPush) alert("收到消息:" + message);
            // alert("收到消息EXTRA:" + extras);
        } catch (e) {
            if (!silent){
                //配置提示框对象
                var config = {
                    content: e,
                    status: 'error'
                    //callback: function () {
                    //console.log('关闭提示框完成');
                    //}
                };
                //通过触发监听打开提示框
                $scope.$emit('openAlert', config);
            };
        }
    };
    $scope.runInBackground = true;
    $scope.onPause = function () {
        $scope.runInBackground = true;
    };
    $scope.onResume = function () {
        $rootScope.loading = false;
        window.iLoadCount = 0;
        $scope.runInBackground = false;
        //后台运行导致没有收到消息， 需要刷新来同步
        $scope.loadUserChatList(true);

        $scope.reloadPage($location.url());
    };

    //转义正则表达式字符串
    function escapeRegString(str){
        return str.replace(/([\(\)\[\]\-{}\\^$.*+?|])/g,'\\$1')
    }

    $scope.onDrag = function(url, pos) {
        $location.url('/' + url);
    }

    $scope.stopDrag = function(console) {
        alert(console);
    }

    /**
     * 数字123转字符串ABC
     */
    $scope.numberToString = function (index) {
        return String.fromCharCode(index+65)
    }

    //返回上一级
    $scope.openModals = [];
    $scope.goBack = function () {
        var lastPage = $scope.openModals.pop();
        if (lastPage) {
            $scope.closeMyModal(lastPage)
        } else {
            window.history.back();
        }
    };
    $scope.convertImgToBase64URL = function (url, callback, outputFormat) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var canvas = document.createElement('CANVAS'),
                ctx = canvas.getContext('2d'), dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
            canvas = null;
        };
        img.src = url;
    }
    $scope.getPhoneImages = function () {
        var options = {
            maximumImagesCount: 10
        };
        $cordovaImagePicker.getPictures(options)
            .then(function (results) {
                for (var i in results) {
                    $scope.convertImgToBase64URL(results[i], function (dataURL) {
                        $scope.myMessage.msg = dataURL;
                        $scope.postMessage('1003');//发送图片
                    });
                }
            }, function (error) {
                // error getting photos
            });
    }

    $scope.openCamera = function () {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.PNG,
            //targetWidth: 100,
            //targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true,
            correctOrientation:true

        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.myMessage.msg = "data:image/png;base64," + imageData;
            $scope.postMessage('1003');
        }, function (err) {
            // error
        });
    }

    //打开外部网页(by wmc)
    $scope.openSourcePath = function(url){
        window.open(url, '_system', 'location=yes');
    }

    $scope.changeUserIp = function () {
        postBiz("/changeUserIp", {
            workerId: $scope.workerId
        }, function (result) {
            if (result != "nochange") {
                postQry('/getWorkerInfo', null, function (data) {
                    if (data && data._id) {
                        $scope.workerInfo = data;
                        $scope.login();
                    }
                }, null, true);
            }
        }, null, true);
    }

    $scope.showOnHoldMenu = function () {
        var options = {
            title: '你要做什么',
            buttonLabels: ['保存图片'],
            addCancelButtonWithLabel: '取消',
            androidEnableCancelButton : true,
            winphoneEnableCancelButton : true,
            //addDestructiveButtonWithLabel : 'Delete it'
        };
        if ($scope.isInIonic) {
            $cordovaActionSheet.show(options)
                .then(function (btnIndex) {
                    var index = btnIndex
                    if (index === 1) {
                        window.canvas2ImagePlugin.saveImageDataToLibrary(

                            function(msg){
                                $scope.$emit('openAlert', {'content': '保存成功'});
                            },
                            function (err) {
                                //alert(err)
                            },
                            document.getElementById('loadArea')
                        );
                    }
                });
        }
    }

    $scope.fileUploadCloseButton = function (imgCropId, obj, index) {

        var cropArea = document.getElementById(imgCropId);
        //监听窗口的变化
        window.onresize = function(){
            //图片删除后位置可能发生变化，需要改变closeBtn的位置
            $(".pictureImgCrop").each(function (index, imgCrop) {
                var canvas = imgCrop.children[0];
                var closeBtn = imgCrop.children[1];
                if(closeBtn){
                    closeBtn.style.left = canvas.offsetLeft + canvas.offsetWidth - 20 + 'px';
                    closeBtn.style.top = canvas.offsetTop + 'px';
                }
            })
        }
        var imgCrop = cropArea.children[index];//当前的imgCrop
        imgCrop.className += ' pictureImgCrop';
        var canvas = imgCrop.children[0];
        //如果图片太宽会把关闭按钮挤出去,重新设置图片宽度
        if(imgCrop.offsetWidth + 16 > cropArea.offsetWidth)
            canvas.style.width = cropArea.offsetWidth -16 + 'px';
        //如果只有图片没有关闭按钮就添加关闭按钮
        if(imgCrop.children.length < 2){
            //添加按钮
            var closeBtn  = document.createElement("span");
            closeBtn.innerHTML = '&times';
            closeBtn.style.position = 'absolute';
            //closeBtn.style.color = '#a1a3a6';
            closeBtn.style.fontSize = '20px';
            closeBtn.style.left = canvas.offsetLeft + canvas.offsetWidth - 20 + 'px';
            closeBtn.style.top = canvas.offsetTop + 'px';
            imgCrop.appendChild(closeBtn);
            //按钮添加监听
            closeBtn.onclick = function(){
                if(obj.photo && obj.photo.length)
                    obj.photo.splice(index, 1);
                if(obj.picture && obj.picture.length)
                    obj.picture.splice(index, 1);
                safeApply($scope);
                //图片删除后位置可能发生变化，需要改变closeBtn的位置
                $(".pictureImgCrop").each(function (index, imgCrop) {
                    var canvas = imgCrop.children[0];
                    var closeBtn = imgCrop.children[1];
                    if(closeBtn){
                        closeBtn.style.left = canvas.offsetLeft + canvas.offsetWidth - 20 + 'px';
                        closeBtn.style.top = canvas.offsetTop + 'px';
                    }
                })
            }
        }else{
            //on-change事件后关闭按钮位置可能发生变化，需要改变closeBtn的位置
            $(".pictureImgCrop").each(function (index, imgCrop) {
                var canvas = imgCrop.children[0];
                var closeBtn = imgCrop.children[1];
                if(closeBtn){
                    closeBtn.style.left = canvas.offsetLeft + canvas.offsetWidth - 20 + 'px';
                    closeBtn.style.top = canvas.offsetTop + 'px';
                }
            })
        }

    }

    /**
     * 根据图片id获取图片接口
     */
    $scope.getPicture = function (obj) {

        obj.picture.forEach(function (pictureId, index) {

            postQry('/getPicture',{'pictureId': pictureId}, function (data) {
                obj.picture[index] = data;
            })

        })
    }

    /**
     * grid-show
     */
    $scope.myData = [
        {
            "firstName": "Cox",
            "lastName": "Carney",
        },
        {
            "firstName": "Lorraine",
            "lastName": "Wise",
        },
        {
            "firstName": "Nancy",
            "lastName": "Waters",
        },
        {
            "firstName": "Cox",
            "lastName": "Carney",
        },
        {
            "firstName": "Lorraine",
            "lastName": "Wise",
        },
        {
            "firstName": "Nancy",
            "lastName": "Waters",
        },
        {
            "firstName": "Cox",
            "lastName": "Carney",
        },
        {
            "firstName": "Lorraine",
            "lastName": "Wise",
        },
        {
            "firstName": "Nancy",
            "lastName": "Waters",
        },
        {
            "firstName": "Cox",
            "lastName": "Carney",
        },
        {
            "firstName": "Lorraine",
            "lastName": "Wise",
        },
        {
            "firstName": "Nancy",
            "lastName": "Waters",
        },
        {
          "firstName": "Nancy",
          "lastName": "Waters",
        },
        {
          "firstName": "Nancy",
          "lastName": "Waters",
        },
        {
          "firstName": "Nancy",
          "lastName": "Waters",
        },
        {
          "firstName": "Nancy",
          "lastName": "Waters",
        }
    ];

    /**
     * blockChain fn
     */

    $scope.tradeHistoryOpt = {
        loop: false,
        effect: 'slide',
        speed: 500,
        pager: false
    }

    /*$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
        // data.slider is the instance of Swiper
        $scope.slider = data.slider;
    });

    //$scope.$on("$ionicSlides.slideChangeStart", function(event, data){
    //    console.log('Slide change is beginning');
    //});
    //
    //$scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
    //    // note: the indexes are 0-based
    //    $scope.activeIndex = data.slider.activeIndex;
    //    $scope.previousIndex = data.slider.previousIndex;
    //    $scope.tradeHistoryIndex = data.slider.activeIndex;
    //    $timeout(function() {
    //        $scope.tradeHistoryIndex;
    //    },0);

        console.log($scope.tradeHistoryIndex);
    });

    $scope.tradeHistoryIndex = 0;
    $scope.tradeHistoryTabClick = function(index) {
      alert(index);
        if($scope.tradeHistoryIndex == index) {
            return;
        }else {
            $scope.tradeHistoryIndex = index;
        }

        //console.log($ionicSlideBoxDelegate);
        //$ionicSlideBoxDelegate._instances[1].slideTo(index);
        if($scope.slider) {
            $scope.slider.slideTo(index);
        }
    }*/

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
    }

    $timeout(function() {
        $scope.loading = false;
    }, 2000);

  $rootScope.aaa = 123;
}])

//显示隐藏tab
/*app.directive('showTabs', function ($rootScope) {
    return {
        restrict: 'A',
        link: function ($scope, $el) {
            $rootScope.hideTabs = false;
        }
    };
}).directive('hideTabs', function ($rootScope) {
    return {
        restrict: 'A',
        link: function ($scope, $el) {
            $rootScope.hideTabs = true;
        }
    };
})*/
    app.directive('hideTabs', function ($rootScope, $location) {
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

app.service('blockChainService', function($http) {
    this.getClassify = function() {
        return [
            {name : "最新概况", viewable: true, url: domain + '/info', page: 1, rows: 20},
            {name : "最新区块", viewable: true, url: domain + '/block', page: 1, rows: 20},
            {name : "最新交易", viewable: true, url: domain + '/trade', page: 1, rows: 20}
        ]
    }

    this.getList = function(url, page, rows) {
        return $http.post(url, {page:page, rows: rows});
    }
})

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
})

//app.config(function($ionicConfigProvider) {
//    $ionicConfigProvider.scrolling.jsScrolling(true);
//})

app.config(function($stateProvider, $urlRouterProvider) {

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
                    'plan-tab': {
                        templateUrl: "blockChain/blockChain.html"
                    }
                }
            })
            .state('tabs.pay', {
                url: "/pay",
                views: {
                    'discover-tab': {
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


        $urlRouterProvider.otherwise("/home");

    })

//显示图片
app.directive('showchatimg',function(){
    return {
        restrict: 'EA',
        template: '<canvas ng-click="closeMyModal(\'showChatImage\')"  on-hold="showOnHoldMenu()" id="loadArea"></canvas>' +
        '<img id="convertImg"  ng-src="{{myMsgImage}}" on-hold="showOnHoldMenu()" width="100%" style="max-width:100%;overflow: hidden;display: none" />',
        link: function(scope,element,attr){
            var image = document.getElementById('convertImg');
            //图片加载结束后
            image.onload = function () {
                //如果不在手机端，重新设置图片显示位置，否则图片底部可能看不见
                var canvas = document.getElementById('loadArea');
                canvas.style.maxWidth = '1000px';
                canvas.style.position = 'absolute';
                canvas.style.left = '50%';
                canvas.style.top = '50%';
                canvas.style.transform = 'translate(-50%, -50%)'
                if(!$scope.isInIonic){
                    canvas.style.width = '80%';
                }else{
                    canvas.style.width = '100%';
                }
                var loadCanvas = document.getElementById("loadArea"),
                    context = loadCanvas.getContext("2d"),
                    tmpImage = new Image(),
                    base64Str = "";
                loadCanvas.width = $('#convertImg').width();
                loadCanvas.height = $('#convertImg').height();
                tmpImage.src = $scope.myMsgImage;
                context.drawImage(tmpImage, 0, 0, loadCanvas.width, loadCanvas.height);
                base64Str = loadCanvas.toDataURL($scope.myMsgImage);
            }
        }
    }
});

// app.factory('socket', function ($rootScope) {
//     var socket = io.connect(hostUrl);
//     window.socket = socket;
//     //var socket = io(hostUrl); //默认连接部署网站的服务器
//     return {
//         on: function (eventName, callback) {
//             socket.on(eventName, function () {
//                 var args = arguments;
//                 $rootScope.$apply(function () {   //手动执行脏检查
//                     callback.apply(socket, args);
//                 });
//             });
//         },
//         emit: function (eventName, data, callback) {
//             socket.emit(eventName, data, function () {
//                 var args = arguments;
//                 $rootScope.$apply(function () {
//                     if (callback) {
//                         callback.apply(socket, args);
//                     }
//                 });
//             });
//         }
//     };
// });
