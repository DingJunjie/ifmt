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
  /*$scope.showActionSheet = function() {
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
    });*/
    /*$timeout(function() {
      hideSheet();
    },2000);*/
  // }

  $scope.contactList = [];

  $scope.saveAddress = function() {
    $('.user-settings-list-address')[1].select();
    document.execCommand("Copy");
    $ionicPopup.alert({"title": gettextCatalog.getString('Successfully saved'), "template": gettextCatalog.getString('Address has saved in clipboard')})
  }

}]).controller('nameSettingCtrl', ['$scope', 'runtimeData', 'userService', '$ionicPopup', 'gettext', 'gettextCatalog', 'languageService', function($scope, runtimeData, userService, $ionicPopup, gettext, gettextCatalog, languageService) {
  $scope.fee = runtimeData.getFee();
  $scope.nameOpt = {};
  $scope.editName = function() {
    if($rootScope.username === '') {
      $ionicPopup.prompt({
        title: gettextCatalog.getString('TradeNumber (Fee)'),
        template: gettextCatalog.getString('Please set fee amount to modify username'),
        inputType: 'number',
        inputPlaceholder: $scope.fee
      }).then(function(editFee) {
          if(editFee && editFee > 0.00000001 && editFee < $rootScope.maxFee) {
            $ionicPopup.prompt({
              title: gettextCatalog.getString('Please enter your passphrase.'),
              template: gettextCatalog.getString('Please enter your passphrase below.'),
              inputType: 'text',
            }).then(function(pass) {
              if(pass.length>0 && ifmjs.Mnemonic.isValid(pass) === true) {
                modifyUsername(editFee, pass);
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
    }else {
      $ionicPopup.alert({
        "title" : gettextCatalog.getString('Tips'),
        "template" : "<h4>"+gettextCatalog.getString('Account already has a username')+"</h4>"
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
                  if(err) {
                    throw err;
                  }else {
                    putOnce(true, "/api/accounts/tx/username", transaction, function(res) {
                      if(res.success === true) {
                          $ionicPopup.alert({
                            title: gettextCatalog.getString('Submit successfully'),
                            template: '<h4 style="text-align: center">'+gettextCatalog.getString('Submit successfully')+'</h4>'
                          })
                          $rootScope.username = $scope.nameOpt.newUsername;
                          $scope.nameOpt.newUsername = '';
                      }else {
                          $ionicPopup.alert({
                            title: gettextCatalog.getString('Tips'),
                            template: '<h4 style="text-align: center">'+gettextCatalog.getString(res.error.message)+'</h4>'
                          })
                      }
                    })
                  }
                }catch(e) {
                  $ionicPopup.alert({
                    title: gettextCatalog.getString('Tips'),
                    template: '<h4 style="text-align: center">'+gettextCatalog.getString(e.error.message)+'</h4>'
                  })
                }
              })
          }else {
              throw data.error.message;
          }
        }catch(e) {
          $ionicPopup.alert({
            title: gettextCatalog.getString('Tips'),
            template: '<h4 style="text-align: center">'+gettextCatalog.getString(e)+'</h4>'
          })
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
          'title' : gettextCatalog.getString('Tips'),
          'template' : '<h5 style="text-align: center">'+gettextCatalog.getString('The fee must greater or equal than 0.00000001 and less than max-fee in settings')+'</h5>'
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

    $scope.$watch('$viewContentLoaded', function() {  
        $rootScope.$emit('refreshContact');
    });

}]).controller('addContactCtrl', ['$scope', '$ionicPopup', 'userService', '$cordovaBarcodeScanner', 'gettext', 'gettextCatalog', 'languageService', function($scope, $ionicPopup, userService, $cordovaBarcodeScanner, gettext, gettextCatalog, languageService) {
    $scope.contact = {};
    $scope.addContact = function() {
      if($scope.contact.addAddress && address.isAddress($scope.contact.addAddress)) {
        $ionicPopup.prompt({
          title: gettextCatalog.getString('Adding new contact'),
          template: gettextCatalog.getString('Please set fee amount to add new contact'),
          inputType: 'number',
          inputPlaceholder: $scope.fee
        }).then(function(addFee) {
            if(addFee && addFee > 0.00000001 && addFee < $rootScope.maxFee) {
              $ionicPopup.prompt({
                title: gettextCatalog.getString('Please enter your passphrase.'),
                template: gettextCatalog.getString('Please enter your passphrase below.'),
                inputType: 'text',
              }).then(function(pass) {
                if(pass.length>0 && ifmjs.Mnemonic.isValid(pass) === true) {
                  addContactFn(addFee, pass);
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

      }else {
        $ionicPopup.alert({
          "title" : gettextCatalog.getString('Invalid address'),
          "template" : "<h4>"+gettextCatalog.getString('Please enter a correct address')+"</h4>"
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

            ifmjs.transaction.createTransaction(req, function(err, transaction) {
              try {
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
                        $rootScope.$emit('refreshContact');
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
          e = e.error ? e.error.message : e.message;
          $ionicPopup.alert({
            title: gettextCatalog.getString('Tips'),
            template: '<h4 style="text-align: center">'+gettextCatalog.getString(e)+'</h4>'
          })
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
              try {
                if(err) {
                  throw err;
                }else {
                  putOnce(true, '/api/transactions/tx', transaction, function(resp) {
                    console.log(resp);
                    if(resp.error) {
                      throw resp.error.message;
                    }else {
                      $ionicPopup.alert({
                        "title": gettextCatalog.getString('Submit successfully'),
                        "template" : "<h4>"+gettextCatalog.getString('Submit successfully')+"</h4>"
                      })
                      $scope.contact = {};
                    }
                  })
                }
              }catch(e) {
                 e = e.error ? e.error.message : e.message;
                 $ionicPopup.alert({
                    "title" : gettextCatalog.getString('Tips'),
                    "template" : "<h4>"+gettextCatalog.getString(e)+"</h4>"
                 })
              }
            })

          }else {
            $ionicPopup.alert({
              "title" : gettextCatalog.getString('Tips'),
              "template" : "<h4>"+gettextCatalog.getString(res.error.message)+"</h4>"
            })
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
                  throw err;
                }else {
                  putOnce(true, '/api/transactions/tx', transaction, function(resp) {
                    console.log(resp);
                    if(resp.error) {
                      throw resp.error.message;
                    }else {
                      $ionicPopup.alert({
                        "title": gettextCatalog.getString('Submit successfully'),
                        "template" : "<h4>"+gettextCatalog.getString('Submit successfully')+"</h4>"
                      })
                    }
                  })
                }
              }catch(e) {
                 e = e.error ? e.error.message : e.message;
                 $ionicPopup.alert({
                    "title" : gettextCatalog.getString('Tips'),
                    "template" : "<h4>"+gettextCatalog.getString(e)+"</h4>"
                 })
              }
            })

          }else {
            $ionicPopup.alert({
                "title" : gettextCatalog.getString('Tips'),
                "template" : "<h4>"+gettextCatalog.getString(res.error.message)+"</h4>"
             })
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
            "title" : gettextCatalog.getString('Tips'),
            "template" : "<h4>"+gettextCatalog.getString('The fee is less than default, please modify your input')+"</h4>"
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
          "title" : gettextCatalog.getString('Error'),
          "template" : "<h4>"+gettextCatalog.getString('You already has a second passphrase')+"</h4>"
        })
      }else {
        getOnce(true, '/api/transactions/getslottime', null, function(data) {
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
                            "title" : gettextCatalog.getString('Submit successfully'),
                            "template" : "<h4>"+gettextCatalog.getString('Submit successfully') + ',' + gettextCatalog.getString('Please remember to pay the password and forget to retrieve it and lose the balance')+"</h4>"
                          })
                          userService.secondSign = true;
                        }
                      })
                    }
                  }catch(e) {
                     $ionicPopup.alert({
                        "title" : gettextCatalog.getString('Error'),
                        "template" : "<h4>"+gettextCatalog.getString(e.error.message)+"</h4>"
                     })
                  }
                })
              }else {
                throw data.error.message;
              }
            }catch(e) {
               $ionicPopup.alert({
                  "title" : gettextCatalog.getString('Error'),
                  "template" : "<h4>"+gettextCatalog.getString(e.error.message)+"</h4>"
               })
            }
          })
        }
      }
        
}])





