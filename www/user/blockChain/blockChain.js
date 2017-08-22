/**
 * Created by 俊杰 on 2017/7/26.
 */

app.controller('chainCtrl',['$scope', '$timeout', function($scope, $timeout) {
  $scope.chainSelected = 0;

  $scope.$on('$ionicSlides.sliderInitialized', function(event, data) {
    $scope.slider = data.slider;
  })

  $scope.$on('$ionicSlides.slideChangeEnd', function(event, data) {
    $scope.activeIndex = data.slider.activeIndex;
    $scope.previousIndex = data.slider.previousIndex;
    $scope.chainSelected = data.slider.activeIndex;
    $timeout(function() {
      $scope.chainSelected;
    },0);
  })

  $scope.chainTabClick = function(i) {
    if($scope.chainSelected == i) {
      return;
    }else {
      $scope.chainSelected = i;
    }

    if($scope.slider) {
      $scope.slider.slideTo(i);
    }
  }

}])
