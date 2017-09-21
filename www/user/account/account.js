/**
 * Created by 俊杰 on 2017/7/31.
 */

app.controller('accountCtrl', ['$scope', '$ionicActionSheet', '$timeout', function($scope, $ionicActionSheet, $timeout) {
    $scope.exit = function() {
      window.location.href = "/";
    }


}]).controller('settingsCtrl',  ['$scope', '$ionicActionSheet', '$timeout', function($scope, $ionicActionSheet, $timeout) {
  /**
   * 获取actionSheet
   */
  $rootScope.showActionSheet = function() {
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        {text: "查看大图"},
        {text: "拍照上传"},
        {text: "从相片中选择"},
        {text: "<span class='actionSheetSpan'>收取0.002修改头像的手续费 <a href='#/account/fee'>点击设置</a></span>"}
      ],
      destructiveText: "",//红色的字
      titleText: "设置头像",
      cancelText: "取消",
      cancel: function() {

      },
      buttonClicked: function(index) {
        return true;
      }
    });
    /*$timeout(function() {
      hideSheet();
    },2000);*/
  }

  $scope.contactList = [];

  $scope.saveAddress = function() {
    $('.user-settings-list-value')[0].select();
    document.execCommand("Copy");
  }
}])




