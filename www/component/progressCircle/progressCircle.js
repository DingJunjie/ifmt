/**
 * 用于展示区块链页面中的挖矿进度
 **/
(function() {

  var progressCircle = angular.module('progressCircle', ['ionic']);

  progressCircle.directive('progressCircle', function() {
    return {
      restrict : "E",
      template: "",
      replace: true,
      link: function($scope) {

      }
    };
  });
})();
