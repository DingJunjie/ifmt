/**
 * Created by 俊杰 on 2017/7/26.
 */

angular.module('IfmCoinApp').controller('chainCtrl',['$scope', '$timeout', function($scope, $timeout) {
  $scope.blocks = {};
  $scope.blockDetail = {};

  $scope.$on('$ionicSlides.sliderInitialized', function(event, data) {
    $scope.slider = data.slider;
  });

  $scope.$on('$ionicSlides.slideChangeEnd', function(event, data) {
    $scope.activeIndex = data.slider.activeIndex;
    $scope.previousIndex = data.slider.previousIndex;
    $scope.chainSelected = data.slider.activeIndex;
    $timeout(function() {
      $scope.chainSelected;
    },0);
  });

  $scope.chainSelected = 0;

  $scope.chainTabClick = function(i) {
    if($scope.chainSelected == i) {
      return;
    }else {
      $scope.chainSelected = i;
    }

    if($scope.slider) {
      $scope.slider.slideTo(i);
    }
  };

  $scope.blockChainOpt = {
    loop: false,
    effect: 'slide',
    speed: 500,
    pagination: false
  };

  $scope.dig = true;

  function getBlock() {
    var blockRequest = {
      'limit' : 10,
      'offset' : 0,
      'orderBy' : 'height:desc'
    };
    getOnce(true, '/api/blocks/', blockRequest, function(data) {
      if(data.success === true) {
        $scope.blocks = data.blocks;
      }
    })
  }

  getBlock();

  $scope.showBlock = function(block) {
    $scope.blockDetail = block;
    console.log($scope.blockDetail);
    window.location.href = '#/blockChain/blockDetail';
  }
}])
