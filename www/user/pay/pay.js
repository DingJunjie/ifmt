/**
 * Created by 俊杰 on 2017/7/12.
 */

app.controller('payCtrl', ['$scope', '$timeout', function($scope, $timeout) {
    $scope.bnlcHeight = $(document).height() - 48;

    var paySwiper = new Swiper('.pay-swipers', {
        //paginationClickable: true,
        spaceBetween: 40,
        effect : 'slide',
        slidesPerView: 1,
        centeredSlides: true,
        //coverflow: {
        //    rotate: 0,
        //    stretch: 0,
        //    depth: 80,
        //    modifier: 1,
        //    slideShadows : false
        //},
        //pagination : '.mission-swiper-pagination',
        loop : false,
        slideToClickedSlide:true,
        initialSlide : 0
    });

    $scope.paySelected = 0;

    $scope.$on('$ionicSlides.sliderInitialized', function(event, data) {
      $scope.slider = data.slider;
    })

    $scope.$on('$ionicSlides.slideChangeEnd', function(event, data) {
      $scope.paySelected = data.slider.activeIndex;
      $timeout(function() {
        $scope.paySelected;
      },0);
    })

    $scope.payTabClick = function(i) {
      if($scope.paySelected == i) {
        return;
      }else {
        $scope.paySelected = i;
      }

      if($scope.slider) {
        $scope.slider.slideTo(i);
      }
    }
}]);
