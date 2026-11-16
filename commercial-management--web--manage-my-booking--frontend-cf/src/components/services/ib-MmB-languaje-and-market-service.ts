import * as angular from 'angular';
import dayjs from 'dayjs';

@Service(
    'ib-MmB-services-module',
    ['$cookies', '$window', 'MmBAppConstants', 'MmBUtilService'],
    []
)
export class MmBLanguageAndMarketService {

    constructor (
        private $cookies: angular.cookies.ICookiesService,
        private $window: angular.IWindowService,
        private MmBAppConstants,
        private MmBUtilService) {}

    ////////////////
    init = () => {
        /////////////LANGUAGE AND MARKET///////////
        var langCookie = this.$cookies.get(this.MmBAppConstants.COOKIES.PERSONALIZATION);
        var langUrl = this.MmBUtilService.getParameterByName(this.MmBAppConstants.nameParameters.lang);
        var langUrlMarket = this.MmBUtilService.getParameterByName(this.MmBAppConstants.nameParameters.market);
        var langNav = this.$window.navigator.language;
        var lang = '';
        var market = '';
        var content, expiration;
        langNav = langNav && langNav.split('-')[0];

        //The first criterion to define the language is by parameter in the URL
        lang = angular.isDefined(langUrl) && langUrl != null ? langUrl.toLowerCase()
            : angular.isDefined(langCookie) ? langCookie.split('|')[2]
                : angular.isDefined(langNav) ? langNav.toLowerCase()
                    : this.MmBAppConstants.defaultLang;

        //The first criterion to define the market is by parameter in the URL
        market = angular.isDefined(langUrlMarket) && langUrlMarket != null ? langUrlMarket.toUpperCase()
            : angular.isDefined(langCookie) ? langCookie.split('|')[1]
                : this.MmBAppConstants.defaultMarket;

        if (this.MmBAppConstants.availableLanguages.indexOf(lang) === -1) {
            lang = this.MmBAppConstants.defaultLang;
        }

        //update the cookie with the new values of market and language
        content = market + '|' + market + '|' + lang + '| | |' + market + '|';
        expiration = new Date();
        expiration.setTime(expiration.getTime() + this.MmBAppConstants.COOKIES.DEFAULT_EXPIRY_TIME);
        this.$cookies.put(this.MmBAppConstants.COOKIES.PERSONALIZATION, content, { 'expires': expiration, 'path': this.MmBAppConstants.COOKIES.DEFAULT_PATH });
        this.MmBAppConstants.market = market;
        this.MmBAppConstants.lang = lang;
        dayjs().locale(lang);
    };
}
