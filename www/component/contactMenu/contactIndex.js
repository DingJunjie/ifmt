(function() {
  "use strict";
  var contactIndex = angular.module("contactIndex", ['ionic', 'pinyin']);

  contactIndex.directive("contactIndex", function(pinyin) {
    return {
      restrict : "E",
      template :
      '<div class="contact-index-container">\n' +
      '  <ul class="contact-index-list">\n' +
      '    <li class="contact-index-item" ng-repeat="l in letters track by $index">\n' +
      '       <a class="contact-index-include" ng-if="letterArray.indexOf(l.toLowerCase()) >= 0" href="#/account/contact#letter{{l.toLowerCase()}}">{{l}}</a>\n' +
      '       <a class="contact-index-exclude" ng-if="letterArray.indexOf(l.toLowerCase()) < 0">{{l}}</a>\n' +
      '      \n' +
      '    </li>\n' +
      '  </ul>\n' +
      '</div>\n',
      replace : true,
      controller: function($scope, $rootScope, userService) {
        //定义排序属性方法
        function sortArr(property) {
          return function(obj1, obj2) {
            var v1 = obj1[property].charCodeAt(0) - obj2[property].charCodeAt(0);
            if(v1 === 0) {
              var v2 = obj1[property].charCodeAt(1) - obj2[property].charCodeAt(1);
              return v2 > 0;
            }else {
              return v1 > 0;
            }
          };
        }

        //26个字母+数字
        var letterRange = '*0ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $scope.letters = letterRange.split('');
        //包含的字母列表
        $scope.letterArray = [];

        var contactReq = {
          "publicKey" : userService.publicKey
        }
        getOnce(true, '/api/contacts/', contactReq, function(data) {
          console.log(data);
          if(data.success === true) {
            $scope.originalContactList = data.following;

            if($scope.originalContactList.length > 0) {
              //将中文转为拼音
              for(var i in $scope.originalContactList) {
                if($scope.originalContactList[i].username === '') {
                   $scope.originalContactList[i].pinyin = '***';
                }else {
                  if(/\w/.test($scope.originalContactList[i].username) === false) {
                    $scope.originalContactList[i].pinyin = pinyin.toPinyin($scope.originalContactList[i].username);
                  }else {
                    $scope.originalContactList[i].pinyin = $scope.originalContactList[i].username.toLowerCase();
                  }
                }
              }

              //将拼音首字母加入字母列表
              for(var k in $scope.originalContactList) {
                if($scope.letterArray.indexOf($scope.originalContactList[k].pinyin[0]) === -1) {
                  $scope.letterArray.push($scope.originalContactList[k].pinyin[0]);
                }
              }
            }
          }
        })
        //模拟数据
        // $scope.originalContactList = [{"name" : "我的名字特别长，长到我自己都快数不清了", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "什么东西", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "知乎", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "传神", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "笑嘻嘻", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "中文", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "丁俊杰", "address" : "asdfsadfasdfsdaf", "pinyin": ''}, {"name" : "丁嘻嘻", "address" : "asdfsadfasdfsdaf", "pinyin": ''}, {"name" : "water", "address" : "323kjk2l3", "pinyin": ''}, {"name" : "123", "address" : "hahaha", "pinyin": ''}];
        // //将中文转为拼音
        // for(var i in $scope.originalContactList) {
        //   if(/\w/.test($scope.originalContactList[i].name[0]) === false) {
        //     $scope.originalContactList[i].pinyin = pinyin.toPinyin($scope.originalContactList[i].name);
        //   }else {
        //     $scope.originalContactList[i].pinyin = $scope.originalContactList[i].name.toLowerCase();
        //   }
        // }

        // //将拼音首字母加入字母列表
        // for(var k in $scope.originalContactList) {
        //   if($scope.letterArray.indexOf($scope.originalContactList[k].pinyin[0]) === -1) {
        //     $scope.letterArray.push($scope.originalContactList[k].pinyin[0]);
        //   }
        // }

        $scope.$on('showIndex', function() {
          $('.contact-index-container').eq(0).css('display', 'block');
        })

        $scope.$on('hideIndex', function() {
          $('.contact-index-container').eq(0).css('display', 'none');
        })

        
      },
      link : function($scope) {
        

      }
    };
  });
})();
