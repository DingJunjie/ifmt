(function() {
  "use strict";
  var chainSwiper = angular.module("chainSwiper", ['ionic', 'pinyin']);

  chainSwiper.directive("chainSwiper", function(pinyin) {
    return {
      restrict : "E",
      template :"<div class='chain-swiper-container'>\n" +
      "  <div class='swiper-container swiper-container-horizontal chain-swiper' id='chainSwiper'>\n" +
      "    <div class='swiper-wrapper'>\n" +
      "      <div class='swiper-slide chain-slide-1 chain-slide'>\n" +
      "        <div class='chain-slide-title'>已进行轮数</div>\n" +
      "        <div class='chain-slide-content'>203</div>\n" +
      "      </div>\n" +
      "      <div class='swiper-slide chain-slide-2 chain-slide'>\n" +
      "        <div class='chain-slide-title'>本轮已参与人数</div>\n" +
      "        <div class='chain-slide-content'>66</div>\n" +
      "      </div>\n" +
      "      <div class='swiper-slide chain-slide-3 chain-slide'>\n" +
      "        <div class='chain-slide-title'>本轮已产出数量</div>\n" +
      "        <div class='chain-slide-content'>26000.33221221</div>\n" +
      "      </div>\n" +
      "      <div class='swiper-slide chain-slide-4 chain-slide'>\n" +
      "        <div class='chain-slide-title'>区块高度</div>\n" +
      "        <div class='chain-slide-content'>2600</div>\n" +
      "      </div>\n" +
      "      <div class='swiper-slide chain-slide-5 chain-slide'>\n" +
      "        <div class='chain-slide-title'>历史累计收益</div>\n" +
      "        <div class='chain-slide-content'>17171</div>\n" +
      "      </div>\n" +
      "    </div>\n" +
      "    <div class='swiper-pagination'></div>\n" +
      "  </div>\n" +
      "</div>\n",
      replace : true,
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
          loop : true,
          slideToClickedSlide:true,
          initialSlide : 1
        });
      }
    };
  });
})();
