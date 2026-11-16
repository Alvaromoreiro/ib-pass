(function () {
    'use strict';
    angular
        .module('ib-login-access-old-module')
        .controller('IbLoginAccessOldController', IbLoginAccessOldController);
    IbLoginAccessOldController.$inject = ['$scope', '$window', '$location', 'localStorageService', 'MmBAppConstants', '$cookies'];
    function IbLoginAccessOldController($scope, $window, $location, localStorageService, MmBAppConstants, $cookies) {
        var vm = this;
        vm.doLogin = doLogin;

        vm.$onInit = activate;

        function activate() {
            vm.loginParams = {
                'loginURL': localStorageService.get('channel') === 'MOBI' ? $window.location.origin + '/mobi/newCKILogin.do' : $window.location.origin + '/web/newCKILogin.do',
                'returnURL': $location.absUrl(),
                'market': MmBAppConstants.market,
                'language': MmBAppConstants.lang
            };
        }

        function doLogin(loginForm, event) {
            var expiration, stateUserLogged;
            if (!loginForm.$valid) {
                event.preventDefault();
            } else {
                expiration = new Date();
                stateUserLogged = isNaN(vm.user) ? 'email' : 'ffnumber';
                expiration.setTime(expiration.getTime() + MmBAppConstants.COOKIES.DEFAULT_EXPIRY_TIME);
                $cookies.putObject('IBERIACOM_SSO_INFO', { 'loggedBy': stateUserLogged },
                    { 'expires': expiration, 'path': MmBAppConstants.COOKIES.DEFAULT_PATH }
                );
                $scope.$emit('showWaitingModal');
            }
        }

    };
})();