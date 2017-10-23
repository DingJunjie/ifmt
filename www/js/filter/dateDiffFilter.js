angular.module('IfmCoinApp').filter('dateDiffFilter', function () {
	return function(dateTime) {
		dateTime = isNaN(dateTime) ? new Date(dateTime) : dateTime;

        var nowTime = new Date().getTime(),
            diffValue = nowTime - dateTime,
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
        else result = "0秒前";
        return result;
	}
})