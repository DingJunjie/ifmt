 /**
 * Created by Administrator on 2017/3/20 0020.
 */

(function () {
    var globalAlert = angular.module("globalAlert", ['ionic']);

    globalAlert.directive('globalAlert', function () {
        return {
            restrict: 'E',
            template: '<div class="globalAlertContainer"><div class="masking" ></div><div class="alertContainer" ng-show="!inputError"><div ng-show="hasHeader" class="header"><font> 标题</font><i class="fa fa-close" ng-click="defaultClose()"></i></div><div class="content"><i ng-show="status===\'error\' " class="ref fa fa-warning"></i><font>{{content}}</font><textarea ng-show="hasInput" ng-model="inputValue" class="form-control" type="text"/></div><div class="btns"><div class="btn btn-info pull-right" ng-click="successClose()">确认</div><div ng-show="hasCancel" class="btn btn-default pull-right" ng-click="cancelClose()">取消</div></div></div><div class="alertContainer" ng-show="inputError"><div ng-show="hasHeader" class="header"><font> 温馨提示</font><i class="fa fa-close" ng-click="closeInputError()"></i></div><div class="content" style="color: #d24333"><i class="fa fa-warning"></i><font>请认真填写内容再提交</font></div><div class="btns"><div class="btn btn-info pull-right" ng-click="closeInputError()">确认</div></div></div></div>',
            replace: true,
            link: function ($scope) {
                /**
                 * 通过监听事件来打开提示框
                 * @param config 配置
                 *      title
                 *      content
                 *      hasInput 是否需要input框（默认为无）
                 *      status 区分通知的类型。
                 *              不输入默认为普通通知（文本颜色黑色）。
                 *              如果值为success,代表成功通知（文本颜色绿色）
                 *              如果值为error，代表错误通知（文本颜色红色）
                 *      defaultCallback 默认关闭的回调函数
                 *      successCallback 点击成功按钮的回调函数
                 *           @param inputValue 传入input框输入的内容
                 *      cancelCallback  点击取消按钮的回调函数
                 */
                var isPhone = function () {
                    //如果不是在电脑
                    if( ionic.Platform.isIPad() || ionic.Platform.isIOS() || ionic.Platform.isAndroid())
                        return true;
                    else
                        return false;
                }
                //关闭输入错误的错误提示框
                $scope.closeInputError = function () {
                    $scope.inputError = false;
                }
                $scope.$on('openAlert', function(evt, config) {
                    //配置提示框标题
                    if( config.title ){
                        $scope.hasHeader = true;
                        $('.globalAlertContainer .alertContainer .header font').eq(0).text( config.title );
                    }
                    else if(isPhone()){
                        $scope.hasHeader = false;
                    }else{
                        $scope.hasHeader = true;
                        $('.globalAlertContainer .alertContainer .header font').eq(0).text( '温馨提示' );
                    }

                    //配置提示框内容
                    if( config.content ){

                        $scope.content = config.content
                    }
                    else
                        $scope.content = '';
                    //提示状态
                    $scope.status = config.status;
                    //根据状态设置文本颜色
                    if( config.status === 'success' )
                        $('.globalAlertContainer .alertContainer .content font').eq(0).css("color", '#41cc8f');
                    else if( config.status === 'error' )
                        $('.globalAlertContainer .alertContainer .content font').eq(0).css("color", '#d24333');
                        else
                            $('.globalAlertContainer .alertContainer .content font').eq(0).css("color", 'black');

                    //如果有input则设置显示属性为真,高度内容都重置
                    if( config.hasInput ){
                        $('.globalAlertContainer .alertContainer .content .form-control').css("height", '72px');
                        $scope.inputValue = '';
                        $scope.hasInput = true;
                    }else{
                        $scope.hasInput = false;
                    }

                    //如果有传入默认关闭回调函数，在关闭后调用传入的回调函数
                    if( config.defaultCallback ){
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
                    }
                    //如果有传入成功关闭回调函数，则在点击确认后调用传入的回调函数
                    if( config.successCallback ){
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
                    }

                    //如果有传入点击取消按钮的回调函数，则在点击关闭按钮后调用传入的回调函数
                    if( config.cancelCallback ){
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
                    }

                    //打开提示框
                    $('.globalAlertContainer').css('display', 'block');

                });
            }
        }
    })
})();
