angular.module('IfmCoinApp').service('languageService', function($rootScope, $window, gettextCatalog) {
	$rootScope.language = [
		{id: 'en', name: 'English', flag: './images/ifmt/login/en.png'},
		{id: 'zh', name: "简体中文", flag: './images/ifmt/login/zh.png'}
	];

	$rootScope.changeLang = function(changed) {
		if (!changed) return;

		var lang = findLang(changed);
        // console.log(changed, lang);

		if(lang) {
			$rootScope.lang = lang;
			$rootScope.selectedLang = $rootScope.lang.id;
            $rootScope.flag = $rootScope.lang.flag;
			gettextCatalog.setCurrentLanguage(lang.id);
		}
	}

	var detectLang = function () {
        var lang = $window.navigator.languages ? $window.navigator.languages[0] : null;
            lang = lang || $window.navigator.language || $window.navigator.browserLanguage || $window.navigator.userLanguage;

        if (lang.indexOf('-') !== -1) { lang = lang.split('-')[0]; }
        if (lang.indexOf('_') !== -1) { lang = lang.split('_')[0]; }

        return findLang(lang) || $rootScope.languages[0];
    };

    var findLang = function (id) {
        for(var i in $rootScope.language) {
            if($rootScope.language[i].id == id) {
                return $rootScope.language[i];
            }
        }
        // }
        // return _.find($rootScope.languages, function (lang) {
        //     return (lang.id == id) || (lang == id);
        // });
    }

    return function () {
        $rootScope.lang = detectLang();
        $rootScope.selectedLang = $rootScope.lang.id;
        gettextCatalog.setCurrentLanguage($rootScope.lang.id);
    }
})