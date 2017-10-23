(function() {
  "use strict";
  var chainSwiper = angular.module("chainSwiper", ['ionic']);

  chainSwiper.directive("chainSwiper", function() {
    return {
      restrict : "E",
      template :"<div class='chain-swiper-container'>\n" +
      "  <div class='swiper-container swiper-container-horizontal chain-swiper' id='chainSwiper'>\n" +
      "    <div class='swiper-wrapper'>\n" +
      "      <div class='swiper-slide chain-slide-1 chain-slide'>\n" +
      "        <div class='chain-slide-title'>已进行轮数</div>\n" +
      "        <div class='chain-slide-content'>{{currentRound}}</div>\n" +
      "      </div>\n" +
      "      <div class='swiper-slide chain-slide-3 chain-slide'>\n" +
      "        <div class='chain-slide-title'>本轮已产出数量</div>\n" +
      "        <div class='chain-slide-content'>26000.33221221</div>\n" +
      "      </div>\n" +
      "      <div class='swiper-slide chain-slide-4 chain-slide'>\n" +
      "        <div class='chain-slide-title'>区块高度</div>\n" +
      "        <div class='chain-slide-content'>{{currentBlock}}</div>\n" +
      "      </div>\n" +
      "      <div class='swiper-slide chain-slide-5 chain-slide'>\n" +
      "        <div class='chain-slide-title'>本轮累计收益</div>\n" +
      "        <div class='chain-slide-content'>17171</div>\n" +
      "      </div>\n" +
      "    </div>\n" +
      "    <div class='swiper-pagination'></div>\n" +
      "  </div>\n" +
      "</div>\n",
      replace : true,
      controller: function($scope, runtimeData, $interval) {
        $scope.blockInfo = {};
        $scope.currentRound = 0;
        $scope.currentBlock = 0;
        var getBlockHeight = function(){
          getOnce(true, '/api/blocks/getLastBlock', null, function(bl) {
            if(bl.success === true) {
              $scope.currentBlock = bl.height[0].height;
              runtimeData.currentBlock = $scope.currentBlock;
              $scope.currentRound = parseInt(bl.height[0].height/57);
              runtimeData.currentRound = $scope.currentRound;
            }else {
            }
          });
        }

        $interval(getBlockHeight, 10000);
        getBlockHeight();
      },
      link : function($scope) {
        var chainSwiper = new Swiper('.chain-swiper', {
          //paginationClickable: true,
          autoPlay: true,
          spaceBetween: 40,
          effect : 'coverflow',
          slidesPerView: 2,
          centeredSlides: true,
          coverflow: {
            rotate: 10,
            stretch: 5,
            depth: 80,
            modifier: 1,
            slideShadows : false
          },
          //pagination : '.mission-swiper-pagination',
          loop : false,
          slideToClickedSlide:true,
          initialSlide : 1
        });

      }
    };
  });
})();
