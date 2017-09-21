/**
 * Created by 俊杰 on 2017/7/26.
 */

app.controller('chainCtrl',['$scope', '$timeout', function($scope, $timeout) {


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

  // new Swiper("#chainSwiper", {autoplay: 1000});

  /*var chainSwiper = new Swiper('.chain-swiper', {
    //paginationClickable: true,
    autoPlay: true,
    spaceBetween: 40,
    effect : 'coverflow',
    slidesPerView: 2,
    centeredSlides: true,
    coverflow: {
      rotate: 0,
      stretch: 0,
      depth: 80,
      modifier: 1,
      slideShadows : false
    },
    //pagination : '.mission-swiper-pagination',
    loop : true,
    slideToClickedSlide:true,
    initialSlide : 1
  });*/

  $scope.dig = true;

}])
