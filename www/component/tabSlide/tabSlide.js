/**
 * Created by 俊杰 on 2017/7/5.
 */
/**
 * Created by 俊杰 on 2017/5/25.
 */

(function () {
    var globalTip = angular.module("globalTip", ['ionic']);

    globalTip.directive('globalTip', function () {
        return {
            restrict: 'E',
            //templateUrl: './globalTip.html',
            template: '<div class="globalTipContainer"><div class="globalTipMask"></div><div class="globalTip showHideAnimation1"><div class="globalTipInnerMask globalTipInnerMask"></div><div class="globalTipTitle"><div class="title"></div></div><div class="globalTipContent"><div class="content">{{content}}</div></div></div></div>',
            replace: true,
            link: function ($scope) {
                /**
                 * 通过监听事件来打开提示框
                 * @param config 配置
                 *      content
                 *      status 区分通知的类型。
                 *              不输入默认为普通通知（文本颜色黑色）。
                 *              如果值为success,代表成功通知（文本颜色绿色）
                 *              如果值为error，代表错误通知（文本颜色红色）
                 */
                    //var isPhone = function () {
                    //    //如果不是在电脑
                    //    if( ionic.Platform.isIPad() || ionic.Platform.isIOS() || ionic.Platform.isAndroid())
                    //        return true;
                    //    else
                    //        return false;
                    //}
                    //关闭输入错误的错误提示框
                    //$scope.closeInputError = function () {
                    //    $scope.inputError = false;
                    //}
                $scope.$on('showTip', function(evt, config) {
                    //配置提示框内容
                    if( config.content ){
                        $scope.content = config.content
                    }else{
                        $scope.content = '这里有吃的';
                    }
                    //提示状态
                    $scope.status = config.status;
                    //根据状态设置文本颜色
                    if( config.status === 'success' )
                        $('.globalTipContainer').eq(0).css("color", '#41cc8f');
                    else if( config.status === 'error' )
                        $('.globalTipContainert').eq(0).css("color", '#d24333');
                    else
                        $('.globalTipContainer').eq(0).css("color", '#666666');

                    //如果有传入默认关闭回调函数，在关闭后调用传入的回调函数
                    /*if( config.defaultCallback ){
                     $scope.defaultClose = function () {
                     $('.globalAlertContainer').css('display', 'none');
                     //默认隐藏输入框
                     $scope.hasInput = false;
                     config.defaultCallback($scope.hasInput);
                     };
                     }else{
                     $scope.defaultClose = function () {
                     $('.globalAlertContainer').css('display', 'none');
                     //默认隐藏输入框
                     $scope.hasInput = false;
                     };
                     }*/
                    //如果有传入成功关闭回调函数，则在点击确认后调用传入的回调函数
                    /*if( config.successCallback ){
                     $scope.successClose = function () {
                     //如果有输入框需要验证输入框的内容
                     if( $scope.hasInput ){
                     //至少要输入一个字符
                     var inputValue = $scope.inputValue.trim()
                     if( inputValue.length < 1 ){
                     //显示input error 的提示框
                     $scope.inputError = true;
                     //验证不通过下面代码就不执行
                     return;
                     }
                     }
                     $('.globalAlertContainer').css('display', 'none');
                     //默认隐藏输入框
                     $scope.hasInput = false;
                     //传入输入框的值
                     config.successCallback($scope.inputValue);

                     }
                     }else{
                     $scope.successClose = function () {
                     $('.globalAlertContainer').css('display', 'none');
                     //默认隐藏输入框
                     $scope.hasInput = false;
                     }
                     }*/

                    //如果有传入点击取消按钮的回调函数，则在点击关闭按钮后调用传入的回调函数
                    /*if( config.cancelCallback ){
                     //如果有取消按钮的回调函数则显示取消按钮
                     $scope.hasCancel = true;
                     $scope.cancelClose = function () {
                     $('.globalAlertContainer').css('display', 'none');
                     //默认隐藏输入框
                     $scope.hasInput = false;
                     //传入输入框的值
                     config.cancelCallback($scope.inputValue);

                     }
                     }else{
                     $scope.hasCancel = false;
                     $scope.cancelClose = function () {
                     $('.globalAlertContainer').css('display', 'none');
                     //默认隐藏输入框
                     $scope.hasInput = false;
                     }
                     }*/

                    //打开提示框
                    $('.globalTip').addClass('showGlobalTip');
                    var timer = setTimeout(function() {
                        $('.globalTip').removeClass('showGlobalTip');
                        clearTimeout(timer);
                    }, 4000);
                });
            }
        }
    })
})();