(function () {
    'use strict';

    angular
        .module('ib-MmB-interceptors-module')
        .factory('MmBHttpInterceptor', MmBHttpInterceptor);

    MmBHttpInterceptor.$inject = ['MmBAppConstants', '$window', 'localStorageService', 'deviceDetector'];
    function MmBHttpInterceptor(MmBAppConstants, $window, localStorageService, deviceDetector) {

        var service = {
            request: request
        };

        return service;

        ////////////////
        /**
         * Adds to the http request object the next custom headers with default values if they does not yet exist:
         * <ul>
         *      <li>'Accept' - 'application/json'</li>
         *      <li>'Content-Type' - 'application/json'</li>
         *      <li>'Accept-Language' - '<language>-<market>'</li>
         *      <li>'Authorization' - 'Bearer <User Authorization Token>'</li>
         *      <li>'X-Request-AppVersion' - '<Current MmB App Version>'</li>
         *      <li>'X-Request-OsVersion' - '<device OS>|<device OS version>'</li>
         *      <li>''X-Request-Device' - '<device Type>|<browser>|<browser version>'</li>
         * </ul>
         * @param {object} config - the htto request objecto to modify its configuration
         * @returns {object} - The config http request object modified with the custom headers
         */
        function request(config) {

            config.headers['Accept'] = config.headers['Accept'] || 'application/json';
            config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
            config.headers['Accept-Language'] = config.headers['Accept-Language'] || (MmBAppConstants.lang + '-' + MmBAppConstants.market);
            config.url.indexOf('iberia-web-content') === 1 ? delete config.headers.Authorization : config.headers['Authorization'] = config.headers['Authorization'] || ('Bearer ' + getAuthToken());
            config.headers['X-Request-AppVersion'] = config.headers['X-Request-AppVersion'] || getMetaTagValueByName('version');
            config.headers['X-Request-OsVersion'] = config.headers['X-Request-OsVersion'] || (deviceDetector.os + '|' + deviceDetector.os_version);
            config.headers['X-Request-Device'] = config.headers['X-Request-Device'] || (deviceDetector.device + '|' + deviceDetector.browser + '|' + deviceDetector.browser_version);
            config.headers['Cache-Control'] = config.headers['Cache-Control'] || 'no-cache';
            config.headers['Pragma'] = config.headers['Pragma'] || 'no-cache';

            return config;
        }

        /**
         * Returns the value for the html metatag given.
         * @param {string} metaTagName - The metatag name for get the value
         * @returns {string} - The metatag value for the given metaTagName
         */
        function getMetaTagValueByName(metaTagName) {
            var value = '';
            if (metaTagName && angular.isString(metaTagName) && $window.document.getElementsByName(metaTagName).length > 0) {
                value = $window.document.getElementsByName(metaTagName)[0].content;
            }
            return value;
        }

        /**
         * Returns the current Authorization token
         * @returns {string} - The curren user Authorization token from browser Session Storage. If the current user is logged, it returns the logged token,
         * else it returns the anonymous token
         */
        function getAuthToken() {
            return localStorageService.get('userLogged') ? localStorageService.get('loggedToken') : localStorageService.get('anonymousToken');
        }
    }
})();