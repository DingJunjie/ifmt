/**
 * 前端页面的基础功能
 * 需要在jquery之后引入
 */
var cacheUrl = ["/getDicInfo", "/getContryList", "/getCurrencyList"];//缓存白名单
var hostUrl = "http://192.168.16.252:4000";
// var hostUrl = "http://192.168.16.154:3000";

//var hostUrl = "http://192.168.16.246:3000";
//var hostUrl = "http://192.168.0.103:3000";
//var hostUrl = "http://192.168.16.158:3000";

//var hostUrl = "http://192.168.16.201:3000";
//var hostUrl = "http://100.83.171.160:3000";

//var hostUrl = "http://192.168.16.246:4000";

var apkVer = "v0.0.9";
var iLoadCount = 0 ;//记录记载效果显示次数，归零时取消加载效果

//这里不应该有直接对$scope的引用，所有对他的引用都应该改为从外部传入。
//window.ontouchstart = function(e) { e.preventDefault(); };//组织放大镜弹出

(function (window) {
    /**
     * 以post的方式提交业务数据
     * @param url 数据提交目的地
     * @param data 提交的数据，必须为json数组对象
     * @param okfn 业务执行成功时的回调函数，传入返回数据，
     * @param errfn 业务执行错误时的回调函数，网络错误时也会执行该方法，模式在业务错误时进行提示
     */
    var postBiz = function (url, data, okfn, errfn, noloading) {

        //因为一次登录多次使用，那么可能存在某一次提交业务时实时会话已丢失
        //每一次与服务器的交互，都要检查实时会话
        /*if (window.socket){
         window.socket = io.connect(hostUrl);
         window.socket.emit("addUser", window.workerInfo);
         }*/


        url = hostUrl + url;
        if (!data) data = {};
        var token = window.localStorage.getItem('token');
        if (token) {
            data.token = token;
        }

        if (!noloading) {
            iLoadCount++;
            //$rootScope.initfished = false;
            //$rootScope.loading = true;
            if ($rootScope.initfished) {
                $rootScope.postfinished = false;
            }
            safeApply($scope);
        }
        $.post(url, data, function (a, b) {
            if (b == "success") {//通信成功
                var data = JSON.parse(a);
                if (data.scode == 0) {// 业务成功
                    if (data.token) {
                        window.localStorage.setItem('token', data.token);//保存本地授权
                    }
                    if (okfn) okfn(data.msg);
                } else {
                    if (errfn) {
                        errfn(data);
                    } else {
                        //配置提示框对象
                        var config = {
                            content: data.msg?data.msg: ('post error，data.scode：'+data.scode),
                            status: 'error',
                            //callback: function () {
                            //console.log('关闭提示框完成');
                            //}
                        };
                        //通过触发监听打开提示框
                        $scope.$emit('openAlert', config);
                    }
                }
            } else {
                if (errfn) errfn("newwork have error");
            }
            if (!noloading){
                if (--iLoadCount<=0) {
                    //$rootScope.loading = false;
                    //$rootScope.initfished = true;
                    $rootScope.postfinished = true;
                }
                safeApply($scope);
            }
        }).error(function(){
            if (!noloading){
                if (--iLoadCount<=0){
                    //$rootScope.initfished = true;
                    //$rootScope.loading = false;
                    $rootScope.postfinished = true;
                }
                safeApply($scope);
            }
        })
    };

    /**
     * 以post方式查询数据
     * @param url 查询地址
     * @param data 有数据时，返回全部为查询的数据
     * @param okfn 查询成功时用来接收数据的方法
     * @param errfn 通信出错时的方法
     */
    var postQry = function (url, postData, okfn, errfn, noloading) {

        /*if (window.socket){
         window.socket = io.connect(hostUrl);
         window.socket.emit("addUser", window.workerInfo);
         }*/

        url = hostUrl + url;
        if (!postData) postData = {};
        var token = window.localStorage.getItem('token');
        if (token) {
            postData.token = token;
        }

        //优先从缓存中获取
        var resultData = undefined;
        //只有白名单中的url才从缓存中获取
        window.localStorage.setItem("heoDB", "value");
        //定义存入字符串的键
        var myKey = (url + JSON.stringify(postData)).replace(/\:/g, '').replace(/\"/g, '').replace(/\,/g, '').replace(/\[/g, '').replace(/\]/g, '').replace(/\{/g, '').replace(/\}/g, '');

        if (inArray(url, cacheUrl)) {
            resultData = window.localStorage.getItem(myKey);
            //console.log("从缓存获取："+url+JSON.stringify(postData)+"的结果："+resultData);
        }

        if (resultData) {
            if (okfn) okfn(JSON.parse(resultData));
        } else {
            if (!noloading) {
                iLoadCount++;
                //$rootScope.initfished = false;
                //$rootScope.loading = true;
                if ($rootScope.initfished) {
                    $rootScope.postfinished = false;
                }
                safeApply($scope);
            }

            $.post(url, postData, function (a, b) {
                if (b == "success") {//通信成功
                    if (a && a!='') {
                        var data = JSON.parse(a);
                        if (data && data.scode && data.scode != "0") {
                            switch (data.scode) {//查询过程中超时直接退出
                                case "-99":
                                    window.location.href = "../index.html";
                                    break;
                                case "-98":
                                    window.location.href = "../psadmin/index.html";
                                    break;
                            }
                            if (errfn) {
                                errfn(data.msg)
                            } else {
                                console.log(data.msg);
                                //alert(data.msg);
                                //由于服务端重定向没有处理，导致超时时会弹N次未登录，所以这里暂时取消提示
                            }
                        } else {
                            if (inArray(url, cacheUrl)) {
                                window.localStorage.setItem(myKey, a);
                            }
                            if (okfn) okfn(data);
                        }
                    }else{
                        var msg = url + "服务异常";
                        if (errfn) {
                            errfn(msg)
                        } else {
                            console.log(msg);
                            //alert(data.msg);
                            //由于服务端重定向没有处理，导致超时时会弹N次未登录，所以这里暂时取消提示
                        }
                    }
                } else {
                    if (errfn) errfn("newwork have error");
                }
                if (!noloading){
                    if (--iLoadCount<=0){
                        //$rootScope.initfished = true;
                        //$rootScope.loading = false;
                        $rootScope.postfinished = true;
                    }
                    safeApply($scope);
                }
            }).error(function(){
                if (!noloading){
                    if (--iLoadCount<=0){
                        //$rootScope.initfished = true;
                        //$rootScope.loading = false;
                        $rootScope.postfinished = true;
                    }
                    safeApply($scope);
                }
            })
        }
    };

    /**
     * 以get方式查询数据
     * @param url 查询地址
     * @param data 有数据时，返回全部为查询的数据
     * @param okfn 查询成功时用来接收数据的方法
     * @param errfn 通信出错时的方法
     */
    var getQry = function (url, data, okfn, errfn) {

        /*if (window.socket){
         window.socket = io.connect(hostUrl);
         window.socket.emit("addUser", window.workerInfo);
         }*/

        url = hostUrl + url;
        var token = window.localStorage.getItem('token');
        if (token) {
            data.token = token;
        }

        $.get(url, data, function (a, b) {
            if (b == "success") {//通信成功
                var data = JSON.parse(a);
                if (okfn) okfn(data);
            } else {
                if (errfn) errfn("newwork have error");
            }
        })
    };


    /**
     * 获取该等级对应的图标html代码
     * @param creditLevel
     * @returns {string}
     */
    var getCreditImg = function (creditLevel) {
        var xx = creditLevel - 1000;
        var yy = '';
        for (var a = 0; a < xx; a++) {
            //yy=yy+"<img src=\"../images/b_blue_1.gif\"/>";//淘宝钻石
            yy = yy + "<i class='fa fa-star text-info'></i> "
            //yy += "❤️"
        }
        return yy;
    }

    /**
     * [dateDiff 算时间差]
     * @param  {[type=Number]} hisTime [历史时间戳，必传]
     * @param  {[type=Number]} nowTime [当前时间戳，不传将获取当前时间戳]
     * @return {[string]}         [string]
     */
    var dateDiff = function (hisTime, nowTime) {
        hisTime = isNaN(hisTime) ? new Date(hisTime) : hisTime;

        var now = nowTime ? nowTime : new Date().getTime(),
            diffValue = now - hisTime,
            result = '',
            minute = 1000 * 60,
            hour = minute * 60,
            day = hour * 24,
            halfamonth = day * 15,
            month = day * 30,
            year = month * 12,

            _year = diffValue / year,
            _month = diffValue / month,
            _week = diffValue / (7 * day),
            _day = diffValue / day,
            _hour = diffValue / hour,
            _min = diffValue / minute;

        if (_year >= 1) result = parseInt(_year) + "年前";
        else if (_month >= 1) result = parseInt(_month) + "个月前";
        else if (_week >= 1) result = parseInt(_week) + "周前";
        else if (_day >= 1) result = parseInt(_day) + "天前";
        else if (_hour >= 1) result = parseInt(_hour) + "个小时前";
        else if (_min >= 1) result = parseInt(_min) + "分钟前";
        else if (_year <= -1) result = parseInt(-_year) + "年后";
        else if (_month <= -1) result = parseInt(-_month) + "个月后";
        else if (_week <= -1) result = parseInt(-_week) + "周后";
        else if (_day <= -1) result = parseInt(-_day) + "天后";
        else if (_hour <= -1) result = parseInt(-_hour) + "个小时后";
        else if (_min <= -1) result = parseInt(-_min) + "分钟后";
        else result = "刚刚";
        return result;
    }

    /**
     * 获取指定货币类别的配置
     */
    var getCurrencyCfg = function (list, currencyType) {
        var o = null;
        for (var i in list) {
            if (list[i].currencyType == currencyType) {
                o = list[i];
                break;
            }
        }
        return o;
    }


    /**
     * 判断是否在微信
     */
    var isWeiXin = function (userAgent) {
        var ua;// by wzx 2017/2/9
        if(userAgent){
            ua = userAgent.toLowerCase();;
        }else{
            ua = window.navigator.userAgent.toLowerCase();
        }
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 获取字符串版的已格式化的日期
     * @param d
     * @param f
     */
    var getDataFormat = function (d, f) {
        d = d ? d : new Date();
        var sr = d.toLocaleString();
        switch (f) {
            case "yyyy-mm-dd":
            {
                var syear = d.getFullYear();
                var smonth = d.getMonth() + 1;
                smonth = smonth < 10 ? "0" + "" + smonth : smonth;
                var sday = d.getDate();
                sday = sday < 10 ? "0" + "" + sday : sday;
                sr = syear + "-" + smonth + "-" + sday;
            }
                ;
                break;
            case "yyyymmdd":
            {
                var syear = d.getFullYear();
                var smonth = d.getMonth() + 1;
                smonth = smonth < 10 ? "0" + "" + smonth : smonth;
                var sday = d.getDate();
                sday = sday < 10 ? "0" + "" + sday : sday;
                sr = syear + "" + smonth + "" + sday;
            }
                ;
                break;
            case "yyyymmddhhmmss":
            {
                var syear = d.getFullYear();
                var smonth = d.getMonth() + 1;
                smonth = smonth < 10 ? "0" + "" + smonth : smonth;
                var sday = d.getDate();
                sday = sday < 10 ? "0" + "" + sday : sday;
                var shour = d.getHours();
                shour = shour < 10 ? "0" + "" + shour : shour;
                var smis = d.getMinutes();
                smis = smis < 10 ? "0" + "" + smis : smis;
                var ssec = d.getSeconds();
                ssec = ssec < 10 ? "0" + "" + ssec : ssec;
                sr = syear + "" + smonth + "" + sday + shour + smis + ssec;
            }
                ;
                break;
            case "yyyy-mm-dd hh:mm:ss":
            {
                var syear = d.getFullYear();
                var smonth = d.getMonth() + 1;
                smonth = smonth < 10 ? "0" + "" + smonth : smonth;
                var sday = d.getDate();
                sday = sday < 10 ? "0" + "" + sday : sday;
                var shour = d.getHours();
                shour = shour < 10 ? "0" + "" + shour : shour;
                var smis = d.getMinutes();
                smis = smis < 10 ? "0" + "" + smis : smis;
                var ssec = d.getSeconds();
                ssec = ssec < 10 ? "0" + "" + ssec : ssec;
                sr = syear + "-" + smonth + "-" + sday + " " + shour + ":" + smis + ":" + ssec;
            }
                ;
                break;
        }
        return sr;
    }

    //获取客户端的操作系统
    var getClientOS = function (mynavigator) {
        if (mynavigator && mynavigator.userAgent) {
            var sUserAgent = mynavigator.userAgent;


            var isWin = (mynavigator.platform == "Win32") || (mynavigator.platform == "Windows");
            var isMac = (mynavigator.platform == "Mac68K") || (mynavigator.platform == "MacPPC") || (mynavigator.platform == "Macintosh") || (mynavigator.platform == "MacIntel");
            if (isMac) return "Mac";
            var isUnix = (mynavigator.platform == "X11") && !isWin && !isMac;
            if (isUnix) return "Unix";
            var isLinux = (String(mynavigator.platform).indexOf("Linux") > -1);

            var bIsAndroid = sUserAgent.toLowerCase().match(/android/i) == "android";
            if (isLinux) {
                if (bIsAndroid) return "Android";
                else return "Linux";
            }
            if (isWin) {
                var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
                if (isWin2K) return "Win2000";
                var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 ||
                    sUserAgent.indexOf("Windows XP") > -1;
                if (isWinXP) return "WinXP";
                var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
                if (isWin2003) return "Win2003";
                var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
                if (isWinVista) return "WinVista";
                var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
                if (isWin7) return "Win7";
                var isWin8 = sUserAgent.indexOf("Windows NT 6.3") > -1 || sUserAgent.indexOf("Windows 8") > -1;
                if (isWin8) return "Win8";
                var isWin10 = sUserAgent.indexOf("Windows NT 10.0") > -1 || sUserAgent.indexOf("Windows 10") > -1;
                if (isWin10) return "Win10";
            }
            var isIphone = sUserAgent.indexOf("iPhone") > -1;
            if (isIphone) return "iPhone";

            return "other";
        } else {
            return null
        }
    };

    /**
     * 检查字符串是否在数组中
     * @param s
     * @param ar
     * @returns {boolean}
     */
    var inArray = function (s, ar) {
        var isIn = false;
        for (var i in ar) {
            if (ar[i] == s) {
                isIn = true;
                break;
            }
        }
        ;
        return isIn;
    };

    /**
     * 安全更新试图，如果已经在更新了就不再更新
     * @param scope
     * @param fn
     */
    var safeApply = function (scope, fn) {
        if (scope.$$phase) {
            if (fn) fn();
        } else {
            scope.$apply(fn);
        }
    };

    //检查apk版本
    var checkApkVer = function (ionic) {
        var silent = false;
        try {
            if ($scope.userOperation != "Android") {
                silent = true;
                throw ("不是android系统");
            }
            postQry('/getApkVer', null, function (data) {
                try {
                    console.log("apk版本: " + data.version);
                    if (apkVer != data.version) {
                        if (window.confirm("检测到新版本， 请下载更新")) {
                            var url = hostUrl + "/dl/" + data.file;
                            window.open(url, "_system", "location=yes");
                            // cordova.InAppBrowser.open(url, "_system", "location=yes");
                            // FIXME
                            window.close();
                            ionic.Platform.exitApp();
                        }
                    }
                } catch (e) {
                    var err = e.message ? e.message : e;
                    //配置提示框对象
                    var config = {

                        content: err,
                        status: 'error',
                        //callback: function () {
                        //console.log('关闭提示框完成');
                        //}
                    };
                    //通过触发监听打开提示框
                    $scope.$emit('openAlert', config);
                }
            },null,true);
        } catch (e) {
            if (!silent) {

                var err = e.message ? e.message : e;
                //配置提示框对象
                var config = {

                    content: err,
                    status: 'error',
                    //callback: function () {
                    //console.log('关闭提示框完成');
                    //}
                };
                //通过触发监听打开提示框
                $scope.$emit('openAlert', config);
            }
        }
    };
    function nearlyWeeks (mode, weekcount, end) {
        /*
         功能：计算当前时间（或指定时间），向前推算周数(weekcount)，得到结果周的第一天的时期值；
         参数：
         mode -推算模式（'cn'表示国人习惯【周一至周日】；'en'表示国际习惯【周日至周一】）
         weekcount -表示周数（0-表示本周， 1-前一周，2-前两周，以此推算）；
         end -指定时间的字符串（未指定则取当前时间）；
         */

        if (mode == undefined) mode = "cn";
        if (weekcount == undefined) weekcount = 0;
        if (end != undefined)
            end = new Date(new Date(end).toDateString());
        else
            end = new Date(new Date().toDateString());

        var days = 0;
        if (mode == "cn")
            days = (end.getDay() == 0 ? 7 : end.getDay()) - 1;
        else
            days = end.getDay();

        return new Date(end.getTime() - (days + weekcount * 7) * 24 * 60 * 60 * 1000);
    };
    /**
     * [workDayDiff 算工作日时间差]
     */
    var workDayDiff = function (beginDay, endDay,specialDays,mode) {
        /*
         功能：计算一段时间内工作的天数。不包括周末和法定节假日，法定调休日为工作日，周末为周六、周日两天；
         参数：
         mode -推算模式（'cn'表示国人习惯【周一至周日】；'en'表示国际习惯【周日至周一】）
         beginDay -时间段开始日期;
         endDay -时间段结束日期;
         specialDays - 特殊日期;
         */
        if(!beginDay) return null;
        if(!endDay) return null;
        var holiday = [];
        var weekendsOff = [];
        if(specialDays && specialDays.length > 0){
            for(var i in specialDays){
                if(specialDays[i].specialType == '1001'){
                    holiday.push(new Date(specialDays[i].specialDate).getFullYear() + '-' + (new Date(specialDays[i].specialDate).getMonth() + 1) + '-' + new Date(specialDays[i].specialDate).getDate());
                }
                if(specialDays[i].specialType == '1002'){
                    weekendsOff.push(new Date(specialDays[i].specialDate).getFullYear() + '-' + (new Date(specialDays[i].specialDate).getMonth() + 1) + '-' + new Date(specialDays[i].specialDate).getDate());
                }
            }
        }
        if (mode == undefined) mode = "cn";
        var begin = new Date(beginDay.toDateString());
        var end = new Date(endDay.toDateString());

        //每天的毫秒总数，用于以下换算
        var daytime = 24 * 60 * 60 * 1000;
        //两个时间段相隔的总天数
        var days = (end - begin) / daytime + 1;
        //时间段起始时间所在周的第一天
        var beginWeekFirstDay = nearlyWeeks(mode, 0, beginDay.getTime()).getTime();
        //时间段结束时间所在周的最后天
        var endWeekOverDay = nearlyWeeks(mode, 0, endDay.getTime()).getTime() + 6 * daytime;

        //由beginWeekFirstDay和endWeekOverDay换算出，周末的天数
        var weekEndCount = ((endWeekOverDay - beginWeekFirstDay) / daytime + 1) / 7 * 2;
        //根据参数mode，调整周末天数的值
        if (mode == "cn") {
            if (endDay.getDay() > 0 && endDay.getDay() < 6)
                weekEndCount -= 2;
            else if (endDay.getDay() == 6)
                weekEndCount -= 1;

            if (beginDay.getDay() == 0) weekEndCount -= 1;
        }
        else {
            if (endDay.getDay() < 6) weekEndCount -= 1;

            if (beginDay.getDay() > 0) weekEndCount -= 1;
        }

        //根据调休设置，调整周末天数（排除调休日）
        $.each(weekendsOff, function (i, offitem) {
            var itemDay = new Date(offitem.split('-')[0] + "/" + offitem.split('-')[1] + "/" + offitem.split('-')[2]);
            //如果调休日在时间段区间内，且为周末时间（周六或周日），周末天数值-1
            if (itemDay.getTime() >= begin.getTime() && itemDay.getTime() <= end.getTime() && (itemDay.getDay() == 0 || itemDay.getDay() == 6))
                weekEndCount -= 1;
        });
        //根据法定假日设置，计算时间段内周末的天数（包含法定假日）
        $.each(holiday, function (i, itemHoliday) {
            var itemDay = new Date(itemHoliday.split('-')[0] + "/" + itemHoliday.split('-')[1] + "/" + itemHoliday.split('-')[2]);
            //如果法定假日在时间段区间内，且为工作日时间（周一至周五），周末天数值+1
            if (itemDay.getTime() >= begin.getTime() && itemDay.getTime() <= end.getTime() && itemDay.getDay() > 0 && itemDay.getDay() < 6)
                weekEndCount += 1;
        });

        return days - weekEndCount - 1;
    };

    /**
     * 生成随机字符串
     * @returns {string}
     */
    var uniqueID = function (){
        function chr4(){
            return Math.random().toString(16).slice(-4);
        }
        return chr4() + chr4() +
            '-' + chr4() +
            '-' + chr4() +
            '-' + chr4() +
            '-' + chr4() + chr4() + chr4();
    }

    //生成分享类别，每周、每月、每季度、每年
    var shareTypeJudge = function(shareTypeCode) {
        switch (shareTypeCode) {
            case "1004" :
                return "年度分享";
                break;
            case "1003" :
                return "季度分享";
                break;
            case "1002" :
                return "每月分享";
                break;
            case "1001" :
                return "每周分享";
                break;
            default :
                break;
        }
    }

    /**
     * caculate the great circle distance
     * @param {Object} lat1
     * @param {Object} lng1
     * @param {Object} lat2
     * @param {Object} lng2
     */
    var EARTH_RADIUS = 6378137.0;    //单位M
    var PI = Math.PI;

    function getRad(d) {
        return d * PI / 180.0;
    }
    var getGreatCircleDistance = function(lat1, lng1, lat2, lng2) {
        var radLat1 = getRad(lat1);
        var radLat2 = getRad(lat2);

        var a = radLat1 - radLat2;
        var b = getRad(lng1) - getRad(lng2);

        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000.0;

        return s;
    }
    window.getQry = getQry;
    window.postQry = postQry;
    window.postBiz = postBiz;
    window.dateDiff = dateDiff;
    window.getCreditImg = getCreditImg;
    window.getCurrencyCfg = getCurrencyCfg;
    window.isInWx = isWeiXin;
    window.getDataFormat = getDataFormat;
    window.getClientOS = getClientOS;
    window.inArray = inArray;
    window.safeApply = safeApply;
    window.checkApkVer = checkApkVer;
    window.workDayDiff = workDayDiff;
    window.uniqueID = uniqueID;
    window.uniqueID = uniqueID;
    window.shareTypeJudge = shareTypeJudge;
    window.getGreatCircleDistance = getGreatCircleDistance;
})(window);

