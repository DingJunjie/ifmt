/**
 * 用于展示区块链页面中的挖矿进度
 **/
(function() {

  var progressCircle = angular.module('progressCircle', ['ionic']);

  progressCircle.directive('progressCircle', function() {
    return {
      restrict : "E",
      template: "<canvas id='canvas'></canvas>",
      replace: true,
      controller: function($scope, userService, $interval) {
        
      },
      link: function($scope) {
        var canvas = document.getElementById("canvas"),
            context = canvas.getContext('2d'),
            PI = Math.PI,
            radius = 200,
            currentProgress = 20,
            step = 0;
        canvas.width = "500";
        canvas.height = "500";

        window.requestAnimFrame = (function(){
          return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
        })();

        function circleLine() {
          context.clearRect(0,0,canvas.width, canvas.height);

          context.closePath();

          context.beginPath();
          context.arc(canvas.width/2, canvas.height/2, radius, 0, PI*2, true);
          context.lineWidth = 2;
          context.strokeStyle = 'rgba(0,200,255,0.1)';
          context.stroke();
          context.closePath();

          context.beginPath();
          context.arc(canvas.width/2, canvas.height/2, radius - 5, PI*3/2, PI*$rootScope.roundProgress/50 - PI/2, false);
          context.lineWidth = 10;
          context.lineCap = "round";
          context.strokeStyle = 'rgba(0,200,255,1)';
          context.stroke();
          context.closePath();

          requestAnimFrame(circleLine);
        }

        circleLine();
      }
    };
  });
})();
