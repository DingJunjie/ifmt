angular.module('IfmCoinApp').filter('dateDiffFilter', ['gettext', 'gettextCatalog', function (gettext, gettextCatalog) {
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

        if (_year >= 1) result = parseInt(_year) + gettextCatalog.getString(' years ago');
        else if (_month >= 1) result = parseInt(_month) + gettextCatalog.getString(' month ago');
        else if (_week >= 1) result = parseInt(_week) + gettextCatalog.getString(' weeks ago');
        else if (_day >= 1) result = parseInt(_day) + gettextCatalog.getString(' days ago');
        else if (_hour >= 1) result = parseInt(_hour) + gettextCatalog.getString(' hours ago');
        else if (_min >= 1) result = parseInt(_min) + gettextCatalog.getString(' minutes ago');
        else if (_year <= -1) result = parseInt(-_year) + gettextCatalog.getString(' years later');
        else if (_month <= -1) result = parseInt(-_month) + gettextCatalog.getString(' month later');
        else if (_week <= -1) result = parseInt(-_week) + gettextCatalog.getString(' weeks later');
        else if (_day <= -1) result = parseInt(-_day) + gettextCatalog.getString(' days later');
        else if (_hour <= -1) result = parseInt(-_hour) + gettextCatalog.getString(' hours later');
        else if (_min <= -1) result = parseInt(-_min) + gettextCatalog.getString(' minutes later');
        else result = gettextCatalog.getString('just now');
        return result;
	}
}])