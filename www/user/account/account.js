/**
 * Created by 俊杰 on 2017/7/31.
 */

angular.module('IfmCoinApp').controller('accountCtrl', ['$scope', '$timeout', 'userService', 'gettext', 'gettextCatalog', 'languageService', function($scope, $timeout, userService, gettext, gettextCatalog, languageService) {
    $scope.address = userService.address;
    $scope.addressShow = $scope.address[0] + $scope.address[1] + $scope.address[2] + $scope.address[3] + '****' + $scope.address[$scope.address.length-4] + $scope.address[$scope.address.length-3] + $scope.address[$scope.address.length-2] + $scope.address[$scope.address.length-1];
    
    $scope.exit = function() {
      window.location.href = "/";
    }
}]).controller('userSettingsCtrl',  ['$rootScope', '$scope', '$ionicActionSheet', '$timeout', 'userService', 'runtimeData', '$ionicPopup', 'gettext', 'gettextCatalog', 'languageService', function($rootScope, $scope, $ionicActionSheet, $timeout, userService, runtimeData, $ionicPopup, gettext, gettextCatalog, languageService) {
  $scope.address = userService.address;
  /**
   * 获取actionSheet
   */
  $scope.showActionSheet = function() {
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        {text: "查看大图"},
        {text: "拍照上传"},
        {text: "从相片中选择"},
        {text: "<span class='actionSheetSpan'>收取"+$scope.fee+"修改头像的手续费 <a href='#/account/fee'>点击设置</a></span>"}
      ],
      destructiveText: "",//红色的字
      titleText: "设置头像",
      cancelText: "取消",
      cancel: function() {

      },
      buttonClicked: function(index) {
        return true;
      }
    });
    /*$timeout(function() {
      hideSheet();
    },2000);*/
  }

  $scope.contactList = [];

  $scope.saveAddress = function() {
    $('.user-settings-list-address')[1].select();
    document.execCommand("Copy");
    $ionicPopup.alert({"title": "保存成功", "template": "地址已保存至剪贴板"})
  }

}]).controller('nameSettingCtrl', ['$scope', 'runtimeData', 'userService', '$ionicPopup', 'gettext', 'gettextCatalog', 'languageService', function($scope, runtimeData, userService, $ionicPopup, gettext, gettextCatalog, languageService) {
  $scope.fee = runtimeData.getFee();
  $scope.nameOpt = {};
  $scope.editName = function() {
    if($rootScope.username === '') {
      $ionicPopup.prompt({
        title: "修改用户名",
        template: "请输入您修改用户名的手续费",
        inputType: 'number',
        inputPlaceholder: $scope.fee
      }).then(function(editFee) {
          if(editFee && editFee > 0.00000001 && editFee < $rootScope.maxFee) {
            $ionicPopup.prompt({
              title: "请输入密码",
              template: "请输入您的主密码",
              inputType: 'text',
            }).then(function(pass) {
              if(pass.length>0 && ifmjs.Mnemonic.isValid(pass) === true) {
                modifyUsername(editFee, pass);
              }else {
                $ionicPopup.alert({
                  "title" : "密码错误",
                  "template" : "<h4>主密码错误，请重新输入。</h4>"
                }, function() {
                  return;
                })
              }
            })
          }else {
            $ionicPopup.alert({
              "title" : "手续费错误",
              "template" : "<h4>手续费应该大于0.00000001个IFMT，并小于设置的最大手续费</h4>"
            }, function() {
              return;
            })
          }
        })
    }else {
      $ionicPopup.alert({
        "title" : "用户名已被修改",
        "template" : "<h4>您的用户名已经修改过一次，不能再次修改</h4>"
      })
    }
    
  }

  /**
   * 修改姓名
   */
  function modifyUsername(fee, pass) {
    getOnce(true, '/api/transactions/getslottime', null, function(data) {
      try {
          if(data.success === true) {
              var timestamp = data.timestamp;
              var req = {
                 type: ifmjs.transactionTypes.USERNAME,
                 secret: pass,
                 // recipientId: runtimeData.recipientId,
                 publicKey: userService.publicKey,
                 fee: fee,
                 timestamp: data.timestamp,
                 asset: {
                   username: {
                      alias: $scope.nameOpt.newUsername,
                      publicKey: userService.publicKey,
                   }
                 }
              }
              console.log(req);

              ifmjs.transaction.createTransaction(req, function(err, transaction) {
                try {
                  console.log(transaction);
                  if(err) {
                    throw err;
                  }else {
                    putOnce(true, "/api/accounts/tx/username", transaction, function(res) {
                      console.log(res);
                      if(res.success === true) {
                          $ionicPopup.alert({
                            title: '修改成功',
                            template: '<h4 style="text-align: center">用户名修改成功。</h4>'
                          })
                          $rootScope.username = $scope.nameOpt.newUsername;
                          $scope.nameOpt.newUsername = '';
                      }
                    })
                  }
                }catch(e) {
                  console.log(e);
                }
              })
          }else {
              throw "获取时间戳错误";
          }
        }catch(e) {
          console.log(e);
        }
      }, function(err) {
          return err;
      })
  }
}]).controller('feeCtrl', ['$scope', 'runtimeData', '$ionicPopup', '$timeout', 'gettext', 'gettextCatalog', 'languageService', function($scope, runtimeData, $ionicPopup, $timeout, gettext, gettextCatalog, languageService) {
    $rootScope.fee = runtimeData.getFee();
    $scope.userData = {};
    $scope.userData.currentFee = parseFloat($scope.fee);

    $scope.setFee = function() {
      if($scope.userData.currentFee >= 0.00000001 && $scope.userData.currentFee < $rootScope.maxFee) {
        var NumString = '' + $scope.userData.currentFee;
        if(/e/.test(NumString) === true) {
          $scope.userData.currentFee =  (($scope.userData.currentFee*100).toPrecision(8))/100;
        }
        window.localStorage.fee = $scope.userData.currentFee;
        runtimeData.setFee($scope.userData.currentFee);
        $timeout(function() {
          $rootScope.fee = runtimeData.getFee();
        }, 0);
        window.history.go(-1);
      }else {
        $ionicPopup.alert({
          'title' : "温馨提示",
          'template' : '<h5 style="text-align: center">手续费应该大于0.00000001个IFMT，并小于设置的最大手续费</h5>'
        })
      }
    }
}]).controller('settingsCtrl', ['$scope', 'runtimeData', '$ionicPopup', 'userService', 'gettext', 'gettextCatalog', 'languageService', function($scope, runtimeData, $ionicPopup, userService, gettext, gettextCatalog, languageService) {
    $scope.autoDig = window.localStorage.autoDig;
    $rootScope.fee = runtimeData.getFee();
    $rootScope.maxFee = runtimeData.getMaxFee();
    $scope.settingOpt = {};
    console.log($scope.autoDig);
    if($scope.autoDig === 'true') {
      $scope.settingOpt.autoDigSwitch = true;
    }

    $scope.switchDig = function() {
      $scope.settingOpt.autoDigSwitch
    }
}]).controller('contactCtrl', ['$scope', function($scope) {
    $scope.contactBack = function() {
       if($rootScope.paying === true) {
          window.history.back(-1);
       }else {
          window.location.href = "#/account";
       }
    }
}]).controller('addContactCtrl', ['$scope', '$ionicPopup', 'userService', '$cordovaBarcodeScanner', 'gettext', 'gettextCatalog', 'languageService', function($scope, $ionicPopup, userService, $cordovaBarcodeScanner, gettext, gettextCatalog, languageService) {
    $scope.contact = {};
    $scope.addContact = function() {
      if($scope.contact.addAddress && address.isAddress($scope.contact.addAddress)) {
        $ionicPopup.prompt({
          title: "添加联系人",
          template: "请输入您添加联系人的手续费",
          inputType: 'number',
          inputPlaceholder: $scope.fee
        }).then(function(addFee) {
            if(addFee && addFee > 0.00000001 && addFee < $rootScope.maxFee) {
              $ionicPopup.prompt({
                title: "请输入密码",
                template: "请输入您的主密码",
                inputType: 'text',
              }).then(function(pass) {
                if(pass.length>0 && ifmjs.Mnemonic.isValid(pass) === true) {
                  addContactFn(addFee, pass);
                }else {
                $ionicPopup.alert({
                  "title" : "密码错误",
                  "template" : "<h4>主密码错误，请重新输入。</h4>"
                }, function() {
                  return;
                })
              }
            })
          }else {
            $ionicPopup.alert({
              "title" : "手续费错误",
              "template" : "<h4>手续费应该大于0.00000001个IFMT，并小于设置的最大手续费</h4>"
            }, function() {
              return;
            })
          }
        })

      }else {
        $ionicPopup.alert({
          "title" : "地址错误",
          "template" : "<h4>请输入正确的地址</h4>"
        })
      }
    }
    
    $scope.scanAddress = function() {
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        $scope.contact.addAddress = imageData.text; //二维码信息
      })
    }

    function addContactFn(fee, pass) {
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
                  address: '+' + $scope.contact.addAddress
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
                          title: '添加成功',
                          template: '<h4 style="text-align: center">联系人添加成功。</h4>'
                        })
                        $rootScope.$emit('refreshContact');
                    }else {
                      throw "发生交易失败";
                    }
                  })
                }
              }catch(e) {
                console.log(e);
              }
            })
          }
        }catch(e) {
          console.log(e);
        }
      })
    }

    $scope.$watch('$viewContentLoaded', function() {  
        $rootScope.$emit('refreshContact');
    });

}]).controller('contactUserCtrl', ['$scope', 'userService', '$ionicPopup', 'gettext', 'gettextCatalog', 'languageService', function($scope, userService, $ionicPopup, gettext, gettextCatalog, languageService) {
    $scope.contact = {};

    function getContactDetail(address) {
      getOnce(true, '/api/accounts', {
        "address" : address
      }, function(data) {
        if(data.success === true) {
          var contactUser = data.account;
          getTransactionsContact(address, contactUser.publicKey);
        }
      })
    }

    function getTransactionsContact(address, publicKey) {
      var req = {
        limit : 10,
        orderBy: 't_timestamp:desc',
        recipientId: address,
        senderPublicKey: publicKey
      }

      getOnce(true, '/api/transactions', req, function(data) {
        console.log(data);
        if(data.success === true) {
          for(var i in data.transactions) {
            data.transactions[i].amountFixed = (data.transactions[i].amount/100000000).toFixed(2);
            data.transactions[i].amountFixed = data.transactions[i].amountFixed * 1;
            // data.transactions[i].feeFixed = (data.transactions[i].fee/100000000)
          }
          $scope.contactTransactions = data.transactions;
        }
      })
    } 

    $scope.$watch('$viewContentLoaded', function() {  
        getContactDetail($rootScope.contactDetail.address);
    });

    $scope.contact = {};

    $scope.submitTransfer = function() {
      getOnce(true, "/api/transactions/getslottime", null, function(res) {
          console.log(res);
          if(res.success === true) {
            var data = {
                type: ifmjs.transactionTypes.SEND,
                secret: window.localStorage.pass,
                //支付账户的金额
                amount: parseFloat($scope.contact.contactAmount),
                //接受方账户
                recipientId: $rootScope.contactDetail.address,
                //recipientUsername:
                //支付账户的公钥
                publicKey: userService.publicKey,
                //支付账户的支付密码
                //secondSecret:"",
                //多重签名账户的公钥
                //multisigAccountPublicKey: "",
                timestamp: res.timestamp,
                fee: parseFloat($rootScope.fee)
            };
            console.log(data);

            ifmjs.transaction.createTransaction(data, function(err, transaction) {
              console.log(err, transaction);
              try {
                if(err) {
                  throw err.message;
                }else {
                  putOnce(true, '/api/transactions/tx', transaction, function(resp) {
                    console.log(resp);
                    if(resp.error) {
                      throw resp.error.message;
                    }else {
                      $ionicPopup.alert({
                        "title" : "提交成功",
                        "template" : "<h4>提交成功</h4>"
                      })
                      $scope.contact = {};
                    }
                  })
                }
              }catch(e) {
                 e = e.message ? e.message : e;
                 $ionicPopup.alert({
                    "title" : "转账出现问题",
                    "template" : "<h4>"+e+"</h4>"
                 })
              }
            })


          }else {
            throw "转账失败，请重试";
          }
        })
      }
}]).controller('contactTransferCtrl', ['$scope', 'userService', '$ionicPopup', 'gettext', 'gettextCatalog', 'languageService', function($scope, userService, $ionicPopup, gettext, gettextCatalog, languageService) {
  $scope.contact = {};

  $scope.submitTransfer = function() {
    getOnce(true, "/api/transactions/getslottime", null, function(res) {
          console.log(res);
          if(res.success === true) {
            var data = {
                type: ifmjs.transactionTypes.SEND,
                secret: window.localStorage.pass,
                //支付账户的金额
                amount: parseFloat($scope.contact.contactAmount),
                //接受方账户
                recipientId: $rootScope.contactDetail.address,
                //recipientUsername:
                //支付账户的公钥
                publicKey: userService.publicKey,
                //支付账户的支付密码
                //secondSecret:"",
                //多重签名账户的公钥
                //multisigAccountPublicKey: "",
                timestamp: res.timestamp,
                fee: parseFloat($rootScope.fee)
            };
            console.log(data);

            ifmjs.transaction.createTransaction(data, function(err, transaction) {
              console.log(err, transaction);
              try {
                if(err) {
                  throw err.message;
                }else {
                  putOnce(true, '/api/transactions/tx', transaction, function(resp) {
                    console.log(resp);
                    if(resp.error) {
                      throw resp.error.message;
                    }else {
                      $ionicPopup.alert({
                        "title" : "转账成功",
                        "template" : "<h4>转账成功</h4>"
                      })
                    }
                  })
                }
              }catch(e) {
                 e = e.message ? e.message : e;
                 $ionicPopup.alert({
                    "title" : "转账出现问题",
                    "template" : "<h4>"+e+"</h4>"
                 })
              }
            })


          }else {
            throw "转账失败，请重试";
          }
        })
    }
}]).controller('feeMaxCtrl', ['$scope', 'runtimeData', '$ionicPopup', 'gettext', 'gettextCatalog', 'languageService', function($scope, runtimeData, $ionicPopup, gettext, gettextCatalog, languageService) {
    $scope.feeOpt = {};
    $scope.feeOpt.maxFee = runtimeData.getMaxFee();

    $scope.updateMaxFee = function(ev, flag) {
      if( flag === false || (ev.keyCode === '13' && flag === true) ) {
        if($scope.feeOpt.maxFee < runtimeData.getFee()) {
          $ionicPopup.alert({
            "title" : "手续费错误",
            "template" : "<h4>最高手续费低于默认手续费，请重新设置。</h4>"
          })
        }else {
          $rootScope.maxFee = $scope.feeOpt.maxFee;
          window.localStorage.maxFee = $scope.feeOpt.maxFee;
          runtimeData.setMaxFee($scope.feeOpt.maxFee);
          window.location.href = "#/account/settings";
        }
      }
    }
}]).controller('payPwdCtrl', ['$scope', 'runtimeData', '$ionicPopup', 'userService', 'gettext', 'gettextCatalog', 'languageService', function($scope, runtimeData, $ionicPopup, userService, gettext, gettextCatalog, languageService) {
    $scope.userData = {};
    $scope.savePayPwd = function() {
      if(!$rootScope.secondSign) {
        $ionicPopup.alert({
          "title" : "设置失败",
          "template" : "<h4>您已经设置过二次密码，无法修改。</h4>"
        })
      }else {
        getOnce(true, '/api/transactions/getslottime', null, function(data) {
          console.log(data);
          try {
            if(data.success === true) {
                var timestamp = data.timestamp;
                var req = {
                  type: ifmjs.transactionTypes.SIGNATURE,
                  amount: 0,
                  secret: pass,
                  secondSecret: $scope.userData.pwd,
                  asset: {
                    signature: {
                      publicKey: userService.publicKey
                    }
                  },
                  fee: $scope.contact.fee,
                  publicKey: userService.publicKey,
                  timestamp: timestamp
                }
                console.log(req);

                ifmjs.transaction.createTransaction(req, function(err, transaction) {
                  try {
                    if(err) {
                      throw err;
                    }else {
                      putOnce(true, "/api/signatures/tx", transaction, function(res) {
                        console.log(res);
                        if(res.success === true) {
                          $ionicPopup.alert({
                            "title" : "设置成功",
                            "template" : "<h4>支付密码已经设置成功。</h4>"
                          })
                          userService.secondSign = true;
                        }
                      })
                    }
                  }catch(e) {
                     e = e.message ? e.message : e;
                     $ionicPopup.alert({
                        "title" : "设置支付密码出现问题",
                        "template" : "<h4>"+e+"</h4>"
                     })
                  }
                })


              }else {
                throw "设置支付密码失败，请重试";
              }
            }catch(e) {
               e = e.message ? e.message : e;
               $ionicPopup.alert({
                  "title" : "设置支付密码出现问题",
                  "template" : "<h4>"+e+"</h4>"
               })
            }
          })
        }
      }
        
}])





