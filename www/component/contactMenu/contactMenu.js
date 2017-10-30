(function() {
  "use strict";
  var contactMenu = angular.module("contactMenu", ['ionic', 'pinyin']);

  contactMenu.directive("contactMenu", function(pinyin) {
    return {
      restrict : "E",
      template :
      '<div>\n' + 
      '<div class="contact-untracked-content" ng-if="untrackedContactList.length > 0">\n' +
      '  <ul class="contact-menu-list">\n' +
      '    <li class="contact-menu-item-container">\n' +
      '      <div class="contact-menu-letter">{{"unconfirmed" | translate}}</div>\n' +
      '      <div class="contact-menu-item" ng-repeat="al in untrackedContactList">{{al.username ? al.username : al.address}}<button class="contact-menu-add-btn" ng-click="submitContact(al)">{{"Add" | translate}}</button></div>\n' +
      '    </li>\n' +
      '  </ul>\n' +
      '</div>\n' +
      '<div class="contact-menu-content">\n' +
      '  <ul class="contact-menu-list">\n' +
      '    <li ng-repeat="la in letterArray track by $index" class="contact-menu-item-container">\n' +
      '      <div id="letter{{la}}" class="contact-menu-letter">{{la === "*" ? "地址" : la.toUpperCase()}}</div>\n' +
      '      <div ng-click="showContact(cl)" class="contact-menu-item" ng-repeat="cl in originalContactList" ng-if="la === cl.pinyin[0]">{{cl.username ? cl.username : cl.address}}</div>\n' +
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
      '</div>\n' +
      '</div>\n',
      replace : true,
      controller: function($scope, $rootScope, userService, $ionicPopup, $timeout, $interval, gettextCatalog) {
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
        // $scope.originalContactList = [{"name" : "我的名字特别长，长到我自己都快数不清了", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "什么东西", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "知乎", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "传神", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "笑嘻嘻", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "中文", "address" : "asldkfjalksdfjlkasjdf", "pinyin": ''}, {"name" : "丁俊杰", "address" : "asdfsadfasdfsdaf", "pinyin": ''}, {"name" : "丁嘻嘻", "address" : "asdfsadfasdfsdaf", "pinyin": ''}, {"name" : "water", "address" : "323kjk2l3", "pinyin": ''}, {"name" : "123", "address" : "hahaha", "pinyin": ''}];
        $scope.untrackedContactList;

        var contactReq = {
          "publicKey" : userService.publicKey
        }

        function getContacts() {
          var contactReq = {
            "publicKey" : userService.publicKey
          }
          
          getOnce(true, '/api/contacts/', contactReq, function(data) {
            console.log(data);
            if(data.success === true) {
              $scope.originalContactList = data.following;
              $scope.untrackedContactList = data.followers;

              if($scope.originalContactList.length > 0) {
                //将中文转为拼音
                for(var i in $scope.originalContactList) {
                  if($scope.originalContactList[i].username === '') {
                     $scope.originalContactList[i].pinyin = '***';
                  }else {
                    if(/\w/.test($scope.originalContactList[i].username[0]) === false) {
                      $scope.originalContactList[i].pinyin = pinyin.toPinyin($scope.originalContactList[i].username);
                    }else {
                      $scope.originalContactList[i].pinyin = $scope.originalContactList[i].username.toLowerCase();
                    }
                  }
                }
                console.log($scope.originalContactList);

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
            }
          })
        }

        getContacts();

        $scope.showContact = function(co) {
          if($scope.paying === true) {
            if(co.username) {
              $rootScope.toUser = co.username;
            }else {
              $rootScope.toUser = '';
            }
            $rootScope.to = co.address;
            window.location.href = "#/pay";
          }else {
            $rootScope.contactDetail = co;
            window.location.href = "#/account/contactUser";
          }
        }

        $scope.submitContact = function(co) {
          $ionicPopup.prompt({
              title: gettextCatalog.getString('Add contact person'),
              template: gettextCatalog.getString('Please set fee amount to add new contact'),
              inputType: 'number',
              inputPlaceholder: $scope.fee
            }).then(function(addFee) {
                if(addFee && addFee > 0.00000001) {
                  $ionicPopup.prompt({
                    title: gettextCatalog.getString('Please enter your passphrase.'),
                    template: gettextCatalog.getString('Please enter your passphrase below.'),
                    inputType: 'text',
                  }).then(function(pass) {
                    if(pass.length>0 && ifmjs.Mnemonic.isValid(pass) === true) {
                      submitContactFn(addFee, pass, co);
                    }else {
                    $ionicPopup.alert({
                      "title" : gettextCatalog.getString('Tips'),
                      "template" : "<h4>"+gettextCatalog.getString('Invalid passphrase')+"</h4>"
                    }, function() {
                      return;
                    })
                  }
                })
              }else {
                $ionicPopup.alert({
                  "title" : gettextCatalog.getString('Tips'),
                  "template" : "<h4>"+gettextCatalog.getString('The fee must greater or equal than 0.00000001 and less than max-fee in settings')+"</h4>"
                }, function() {
                  return;
                })
              }
            })
          }

          function submitContactFn(fee, pass, co) {
            getOnce(true, '/api/transactions/getslottime', null, function(data) {
            console.log(data);
            try {
              if(data.success === true) {
                  var timestamp = data.timestamp;
                  var req = {
                    type: ifmjs.transactionTypes.FOLLOW,
                    amount: 0,
                    secret: pass,
                    asset: {
                      contact: {
                        address: '+' + co.address
                      }
                    },
                    fee: fee,
                    publicKey: userService.publicKey,
                    timestamp: timestamp
                  }
                  console.log(req);

                  ifmjs.transaction.createTransaction(req, function(err, transaction) {
                    try {
                      console.log(transaction);
                      if(err) {
                        throw err;
                      }else {
                        putOnce(true, "/api/contacts/tx", transaction, function(res) {
                          console.log(res);
                          if(res.success === true) {
                              $ionicPopup.alert({
                                title: gettextCatalog.getString('Submit successfully'),
                                template: '<h4 style="text-align: center">'+gettextCatalog.getString('Contacts') + gettextCatalog.getString('Submit successfully')+'</h4>'
                              })
                              getContacts();
                              /*var temp;
                              for(var i in $scope.untrackedContactList) {
                                if($scope.untrackedContactList[i].address === co.address) {
                                  temp = $scope.untrackedContactList.splice(i, 1);
                                  break;
                                }
                              }
                              console.log(temp);
                              $scope.originalContactList.push(temp);*/
                          }else {
                            throw gettextCatalog.getString(res.error.message);
                          }
                        })
                      }
                    }catch(e) {
                      e = e.error ? e.error.message : e.message;
                      $ionicPopup.alert({
                        title: gettextCatalog.getString('Tips'),
                        template: '<h4 style="text-align: center">'+gettextCatalog.getString(e)+'</h4>'
                      })
                    }
                  })
                }else {
                  throw data.error.message;
                }
              }catch(e) {
                $ionicPopup.alert({
                  title: gettextCatalog.getString('Tips'),
                  template: '<h4 style="text-align: center">'+gettextCatalog.getString(e.error.message)+'</h4>'
                })
              }
            })
          }

          $rootScope.$on('refreshContact', function() {
            getContacts();
          })

          $scope.$watch('$viewContentLoaded', function() {  
              $rootScope.$emit('refreshContact');
          });

          //$interval(getContacts, 10000);

        //将中文转为拼音
        /*for(var i in $scope.originalContactList) {
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
        }*/
      },
      link : function($scope) {
        

      }
    };
  });
})();


