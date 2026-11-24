(function () {
    'use strict';

    angular
        .module('ib-pmt-utils-module')
        .factory('PmtTokenService', PmtTokenService);

    PmtTokenService.$inject = ['$q', 'PmtConstants', 'PmtTokenProxy', 'localStorageService', '$rootScope'];
    function PmtTokenService($q, PmtConstants, PmtTokenProxy, localStorageService, $rootScope) {
        var service = {
            getAnonymousToken: getAnonymousToken,
            loginUser: loginUser,
            refreshUserLoggedToken: refreshUserLoggedToken
        };

        return service;

        ////////////////
        /**
         * Gets Anonymous token for a Pmt process and stores it in Session Storage. If there was and error in the http call, 
         * this method treats these http error code and returns the object to show an error in the view.
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getAnonymousToken() {
            var defer = $q.defer();
            PmtTokenProxy.getPmtToken(PmtConstants.tokenServiceURI, PmtConstants.globalAuthorizationToken, 'grant_type=client_credentials')
                .then(getAnonymousTokenSuccess, getAnonymousTokenError);
            return defer.promise;

            function getAnonymousTokenSuccess(data) {
                localStorageService.set('anonymousToken', data.access_token);
                defer.resolve(data);
            }

            function getAnonymousTokenError(error) {
                defer.reject(processTokenError(error));
            }
        };

        /**
         * Gets the user logged token for a Pmt process and stores the logged token, the refresh token and a flag to know if the current user is logged in Session Storage.
         *  If there was and error in the http call, this method treats these http error code and returns the object to show an error in the view.
         * @param {string} username - The Iberia plus number
         * @param {string} password - The user´s Iberia plus pin
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function loginUser(username, password) {
            var defer = $q.defer();
            var tokenParams = $.param({ grant_type: 'password', username: username, password: password, login_type: 'iberia_plus_standard', scope: 'offline_access' });
            PmtTokenProxy.getPmtToken(PmtConstants.tokenServiceURI, PmtConstants.globalAuthorizationToken, tokenParams)
                .then(function (data) {
                    loginUserSuccess(data, defer);
                }, loginUserError);
            return defer.promise;

            function loginUserError(error) {
                defer.reject(processTokenError(error));
            }
        }

        /**
         * Stores the logged token, the refresh token and a flag to know if the current user is logged in Session Storage from data input parameter,
         * and resolve the input promise with the input data
         * @param {Object} data - The service response data with the information to store and to resolve into the promise
         * @param {Object.<Promise>} promise - the promise to be resolved
         */
        function loginUserSuccess(data, promise) {
            localStorageService.set('loggedToken', data.access_token);
            localStorageService.set('refreshToken', data.refresh_token);
            localStorageService.set('userLogged', true);
            $rootScope.isLogged = true;
            promise.resolve(data);
        }

        /**
         * Gets a new user logged token for a Pmt process and stores the new logged token, the new refresh token and a flag to know if the current user is logged in Session Storage.
         *  If there was and error in the http call, this method treats these http error code and returns the object to show an error in the view.
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function refreshUserLoggedToken() {
            var defer = $q.defer();
            var tokenParams = $.param({ grant_type: 'refresh_token', refresh_token: localStorageService.get('refreshToken') });
            PmtTokenProxy.getPmtToken(PmtConstants.tokenServiceURI, PmtConstants.globalAuthorizationToken, tokenParams)
                .then(function (data) {
                    loginUserSuccess(data, defer);
                }, refreshUserError);
            return defer.promise;

            function refreshUserError(error) {
                defer.reject(processTokenError(error));
            }
        }

        function processTokenError(error) {
            var processedError = { errorCode: error.errorCode };
            var hasDescription = error.data && error.data.error_description;
            var hasReason = error.data && error.data.errors && error.data.errors.length > 0;
            processedError.message = hasReason ? error.data.error_description : 'REST_SERVICE_ERROR_GENERAL';
            processedError.needsTranslate = !hasReason;
            processedError.internalErrorCode = hasReason ? error.data.error : '';
            return processedError;
        }
    }
})();