(function() {
  var chainProgress = angular.module("chainProgress", []);

  chainProgress.directive("chainProgress", function() {
    return {
      restrict : "E",
      template : "",
      replace : true,
      controller: function($scope, userService) {
        var publicKey = userService.publicKey;
        $scope.on('showProgress', function(config) {
          getOnce(true, '/api/delegates/roundTime', {params: {publicKey: publicKey}}, function(res) {
            
          })
        })
      },
      link : function($scope) {
        /**
         * @param config
         * progress 只需要进度即可
         *
         */
        
      }
    }
  })
})
