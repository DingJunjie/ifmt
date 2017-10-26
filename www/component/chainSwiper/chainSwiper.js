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
      "        <div class='chain-slide-title'>{{'Rounds' | translate}}</div>\n" +
      "        <div class='chain-slide-content'>{{currentRound}}</div>\n" +
      "      </div>\n" +
      "      <div class='swiper-slide chain-slide-3 chain-slide'>\n" +
      "        <div class='chain-slide-title'>{{'Blocks in round' | translate}}</div>\n" +
      "        <div class='chain-slide-content'>{{currentAmount}}</div>\n" +
      "      </div>\n" +
      "      <div class='swiper-slide chain-slide-4 chain-slide'>\n" +
      "        <div class='chain-slide-title'>{{'Block height' | translate}}</div>\n" +
      "        <div class='chain-slide-content'>{{currentBlock}}</div>\n" +
      "      </div>\n" +
      "      <div class='swiper-slide chain-slide-5 chain-slide'>\n" +
      "        <div class='chain-slide-title'>{{'Reward in round' | translate}}</div>\n" +
      "        <div class='chain-slide-content'>{{currentBenefit}}</div>\n" +
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

        var getNowParams = function() {
          getOnce(true, '/api/blocks/', {
            // 'height' : $scope.currentBlock,
            'limit' : 57,
            'offset' : 0,
            'orderBy' : 'height:desc'
          }, function(data) {
            $scope.currentAmount = 0;
            $scope.currentBenefit = 0;
            for(var i in data.blocks) {
              var cr = parseInt(data.blocks[i].height/57);
              //console.log(cr, currentRounds);
              if(cr == $scope.currentRound) {
                $scope.currentBenefit += parseFloat((data.blocks[i].reward/100000000).toFixed(2));
                $scope.currentAmount ++;
              }else {
                break;
              }
            }
            //$scope.currentBenefit += parseFloat((data.blocks[0].reward/100000000).toFixed(2));
            //$scope.currentAmount ++;
          })
        }
        
        var getBlockHeight = function(){
          getOnce(true, '/api/blocks/getLastBlock', null, function(bl) {
            if(bl.success === true) {
              $scope.currentBlock = bl.height[0].height;
              runtimeData.currentBlock = $scope.currentBlock;
              var currentRounds = parseInt(bl.height[0].height/57);
              if(currentRounds === $scope.currentRound) {
                $scope.currentBenefit += 35;
                $scope.currentAmount ++;
              }else {
                $scope.currentBenefit = 0;
                $scope.currentAmount = 0;
              }
              $scope.currentRound = currentRounds;
              runtimeData.currentRound = $scope.currentRound;
            }else {
            }
          });


        }
        getNowParams();
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
