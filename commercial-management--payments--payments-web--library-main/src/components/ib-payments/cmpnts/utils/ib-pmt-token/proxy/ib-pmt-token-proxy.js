import { lastValueFrom } from 'rxjs';

(function () {
    'use strict';

    angular
        .module('ib-pmt-utils-module')
        .factory('PmtTokenProxy', PmtTokenProxy);

    PmtTokenProxy.$inject = ['PmtRxProxy'];
    function PmtTokenProxy(PmtRxProxy) {

        return {
            getPmtToken : getPmtToken
        };

        ////////////////
        /**
         * Calls HTTP POST method on the get authorization token rest service with app global autorization token and the token params
         * @param {string} uri - the http url of authorization token rest service
         * @param {string} authorizationToken - the global app autorization token using "basic" autorization type
         * @param {string} tokenParams - the requested type of authorization token, depending if you want an anonymous token, logged access token or refresh a logged token
         * The current posible values are:
         * <ul>
         *      <li>"grant_type=client_credentials" - This is used for anonymous token</li>
         *      <li>"grant_type=password;login_type=iberia_plus_standard;username=<Nº IB plus>;password=<IB plus pin>;scope=offline_access" - This is for iberia plus logged access</li>
         *      <li>"grant_type=refresh_token;refresh_token=<The current refresh token>" - this is used for refresh the iberia plus logged access when it is expired</li>
         * </ul>
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getPmtToken(uri,authorizationToken,tokenParams) {
            var config = {
                headers: {
                    'Authorization': authorizationToken,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                }
            };
            return lastValueFrom(PmtRxProxy.post(uri, tokenParams, config))
            .then(response => response.data)
            .catch(response => Promise.reject({    
                data: response?.error,
                errorCode: response?.status
            }));
        }
    }
})();