/**
 * Created by 俊杰 on 2017/7/5.
 */
var cacheUrl = [];  //用于缓存白名单

// var hostUrl = 'http://test1.ifmchain.org:19001'; //测试主机地址
// var hostUrl = 'http://test2.ifmchain.org:19002'; //测试主机地址
var hostUrl = 'http://test3.ifmchain.org:19003'; //测试主机地址
// var hostUrl = 'http://test4.ifmchain.org:19004'; //测试主机地址
// var hostUrl = 'http://192.168.16.161:19000';

var apkVer = "v0.1";
var iLoadCount = 0; //记录加载效果显示次数，0时取消加载效果

(function() {
    /**
     * 对后端的一次POST请求
     * @param url   请求地址
     * @param data  请求数据
     * @param okfn  请求成功回调方法
     * @param errfn 请求失败方法
     * @param noloading 是否取消加载
     */
    var postOnce = function(useHostUrl, url, data, okfn, errfn, noloading) {

        var fullUrl = '';
        fullUrl = useHostUrl ? hostUrl + url : url;

        if(!data) {data = {};}

        /*
        //当确定使用token后将token加入data传入后端
        var token = window.localStorage.getItem('token');
        if (token) {
            data.token = token;
        }*/
        /*if (!noloading) {
            iLoadCount ++;
            if($rootScope.initfinished) {
                $rootScope.postfinished = false;
            }
            safeApply($scope);
        }*/

        $.ajax({
            url : fullUrl,
            type : "POST",
            contentType : "application/json; charset=utf=8",
            data : JSON.stringify(data),
            dataType: "json",
            success : function(data) {
                if(data.error) {
                    alert(data.error.message);
                }else {
                    if(okfn) okfn(data);
                }
            },
            error : function(err) {
                //console.log(err);
                if(errfn) errfn(err);
            }
        })
    }


    /**
     * get一次
     */
    var getOnce = function(useHostUrl, url, data, okfn, errfn, noloading) {
        var fullUrl = '';
        fullUrl = useHostUrl ? hostUrl + url : url;

        if(!data) {
            data = {};
        }else {
            fullUrl += '?';
        }

        /*if (!noloading) {
            iLoadCount ++;
            if($rootScope.initfinished) {
                $rootScope.postfinished = false;
            }
            safeApply($scope);
        }*/
        for (var i in data) {
            fullUrl += i + '=' + data[i] + '&';
        }
        fullUrl[fullUrl.length-1].replace('&', '');

        $.ajax({
            url : fullUrl,
            type : "GET",
            contentType : "application/json; charset=utf=8",
            dataType: "json",
            success : function(data) {
                if(okfn) okfn(data);
            },
            error : function(err) {
                //console.log(err);
                if(errfn) errfn(err);
            }
        });
    }

  /**
   * put方法
   * @param useHostUrl 是否使用hostURL来填充URL
   * @param url
   * @param data
   * @param okfn
   * @param errfn
   * @param noloading
   */
    var putOnce = function(useHostUrl, url, data, okfn, errfn, noloading) {
      var fullUrl = '';
      fullUrl = useHostUrl ? hostUrl + url : url;

      $.ajax({
        url: fullUrl,
        type: "PUT",
        contentType : "application/json",
        // dataType: "json",
        data: JSON.stringify(data),
        success : function(data) {
          if(okfn) okfn(data);
        },
        error : function(err) {
          //console.log(err);
          if(errfn) errfn(err);
        }
      });
    }


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
     * [dateDiff 算时间差]
     * @param  {[type=Number]} hisTime [历史时间戳，必传]
     * @param  {[type=Number]} nowTime [当前时间戳，不传将获取当前时间戳]
     * @return {[string]}         [string]
     */
    var dateDiff = function (hisTime) {
        hisTime = isNaN(hisTime) ? new Date(hisTime) : hisTime;

        var nowTime = new Date().getTime(),
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

    /**
     * 当前轮次起始时间
     * 目前每轮57个块，每个块10秒
     */
    var roundStartTime = function(endTime, blockTime) {
        blockTime = blockTime ? blockTime : 10;
        return endTime - (blockTime * 57);
    }


    window.getQry = getQry;
    window.getOnce = getOnce;
    window.postOnce = postOnce;
    window.putOnce = putOnce;
    window.dateDiff = dateDiff;
    window.getDataFormat = getDataFormat;
    window.getClientOS = getClientOS;
    window.inArray = inArray;
    window.uniqueID = uniqueID;
    window.roundStartTime = roundStartTime;
})(window);
