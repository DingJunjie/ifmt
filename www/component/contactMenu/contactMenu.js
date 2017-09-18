(function() {
  "use strict";
  var contactMenu = angular.module("contactMenu", ['ionic', 'pinyin']);

  contactMenu.directive("contactMenu", function(pinyin) {
    return {
      restrict : "E",
      template :
      '<div class="contact-menu-content">\n' +
      '  <ul class="contact-menu-list">\n' +
      '    <li ng-repeat="la in letterArray track by $index" class="contact-menu-item-container">\n' +
      '      <div id="letter{{la}}" class="contact-menu-letter">{{la.toUpperCase()}}</div>\n' +
      '      <a href="#/account/contactUser"><div class="contact-menu-item" ng-repeat="cl in originalContactList" ng-if="la === cl.pinyin[0]">{{cl.name}}</div></a>\n' +
      '    </li>\n' +
      '  </ul>\n' +
      '\n' +
/*      '  <ul class="contact-index-list">\n' +
      '    <li class="contact-index-item" ng-repeat="l in letters track by $index">\n' +
      '       <a class="contact-index-include" ng-if="letterArray.indexOf(l.toLowerCase()) >= 0" href="#/account/contact#letter{{l.toLowerCase()}}">{{l}}</a>\n' +
      '       <a class="contact-index-exclude" ng-if="letterArray.indexOf(l.toLowerCase()) < 0">{{l}}</a>\n' +
      '      \n' +
      '    </li>\n' +
      '  </ul>\n' +*/
      '</div>\n',
      replace : true,
      link : function($scope) {
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
        //模拟数据
        $scope.originalContactList = [{"name" : "我的名字特别长，长到我自己都快数不清了", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "什么东西", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "知乎", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "传神", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "笑嘻嘻", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "中文", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "丁俊杰", "address" : "asdfsadfasdfsdaf", "pinyin": ''}, {"name" : "丁嘻嘻", "address" : "asdfsadfasdfsdaf", "pinyin": ''}, {"name" : "water", "address" : "323kjk2l3", "pinyin": ''}, {"name" : "123", "address" : "hahaha", "pinyin": ''}];
        //将中文转为拼音
        for(var i in $scope.originalContactList) {
          if(/\w/.test($scope.originalContactList[i].name[0]) === false) {
            $scope.originalContactList[i].pinyin = pinyin.toPinyin($scope.originalContactList[i].name);
          }else {
            $scope.originalContactList[i].pinyin = $scope.originalContactList[i].name.toLowerCase();
          }
        }

        //根据拼音排序
        for(var j in $scope.originalContactList) {
          if($scope.originalContactList[j] && $scope.originalContactList[j].pinyin) {
            $scope.originalContactList.sort(sortArr('pinyin'));
          }
        }

        //将拼音首字母加入字母列表
        for(var k in $scope.originalContactList) {
          if($scope.letterArray.indexOf($scope.originalContactList[k].pinyin[0]) === -1) {
            $scope.letterArray.push($scope.originalContactList[k].pinyin[0]);
          }
        }

      }
    };
  });
})();


