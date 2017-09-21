/**
 * 用于展示区块链页面中的挖矿进度
 **/
(function() {

  var progressWave = angular.module('progressWave', ['ionic']);

  progressWave.directive('progressWave', function() {
    return {
      restrict : "E",
      template: "<canvas id='canvasWave'></canvas>",
      replace: true,
      link: function($scope) {
        var canvas = document.getElementById("canvasWave"),
          context = canvas.getContext('2d'),
          PI = Math.PI,
          radius = 200,
          currentProgress = 50,
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

        function wave() {
          context.clearRect(0,0,canvas.width, canvas.height);

          context.fillStyle = "rgba(0, 222, 255, 0.2)";
          step ++;
          var angle = (PI/180)*step;
          var deltaHeight = Math.sin(angle) * 30;
          var deltaHeightRight = Math.cos(angle) * 50;
          context.beginPath();
          context.moveTo(0, canvas.height/2+deltaHeight);
          context.bezierCurveTo(canvas.width/2 + deltaHeight, canvas.height/2+deltaHeight -50, canvas.width/2, canvas.height/2+deltaHeightRight-50, canvas.width, canvas.height/2+deltaHeightRight);
          context.lineTo(canvas.width, canvas.height/2+deltaHeightRight);
          context.lineTo(canvas.width, canvas.height);
          context.lineTo(0, canvas.height);
          context.lineTo(0, canvas.height/2+deltaHeight);
          context.closePath();
          context.fill();

          context.fillStyle = "rgba(0, 222, 255, 0.1)";
          context.beginPath();
          context.moveTo(0, canvas.height/2+deltaHeight);
          context.bezierCurveTo(canvas.width/2 - 50, canvas.height/2+deltaHeight -80, canvas.width/2 + 50, canvas.height/2+deltaHeightRight+20, canvas.width, canvas.height/2+deltaHeightRight + 20);
          context.lineTo(canvas.width, canvas.height/2+deltaHeightRight);
          context.lineTo(canvas.width, canvas.height);
          context.lineTo(0, canvas.height);
          context.lineTo(0, canvas.height/2+deltaHeight);
          context.closePath();
          context.fill();

          // context.fillStyle = "blue";
          // context.fillRect(0, 0, canvas.width, canvas.height/ 2);

          // outCircle();
          requestAnimFrame(wave);
        }

        wave();
      }
    };
  });
})();
