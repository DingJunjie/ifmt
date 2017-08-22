(function() {
  var chainProgress = angular.module("chainProgress", []);

  chainProgress.directive("chainProgress", function() {
    return {
      restrict : "E",
      template : "",
      replace : true,
      link : function($scope) {
        /**
         * @param config
         * progress 只需要进度即可
         *
         */
        $scope.on('showProgress', function(config) {

        })
      }
    }
  })
})
