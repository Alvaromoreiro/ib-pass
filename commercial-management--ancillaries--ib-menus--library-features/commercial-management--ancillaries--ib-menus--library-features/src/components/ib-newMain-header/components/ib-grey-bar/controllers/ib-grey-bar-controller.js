(function () {
    'use strict';

    angular
        .module('ib-grey-bar-module')
        .controller('GreyBarController', GreyBarController);

    GreyBarController.$inject = ['ibGreyBarTransformer', 'localStorageService', '$window', '$timeout', '$scope', '$rootScope', '$location'];
    function GreyBarController (ibGreyBarTransformer, localStorageService, $window, $timeout, $scope, $rootScope, $location) {
        const vm = this;
        vm.afterLogin = afterLogin;
        vm.responsive = responsive;
        vm.showComponentChooseLanguage = showComponentChooseLanguage;
        vm.isLogged = isLogged;
        vm.isNotLogged = isNotLogged;
        vm.isMobile = false;
        vm.isFlowCki = false;
        vm.model = vm.model;
        $scope.$on('iframeLoginFailed', hideLogin);
        activate();

        function activate () {
            responsive();
        }
        function responsive () {
            vm.innerWidth = $window.innerWidth;
            if (vm.innerWidth < 768) {
                $timeout(() => {
                    vm.isMobile = true;
                });
            } else {
                $timeout(() => {
                    vm.isMobile = false;
                });
            }
        }
        angular.element($window).bind('resize', () => {
            responsive();
        });
        function afterLogin (data) {
            const headerModel = localStorageService.get('headerModel');
            vm.model.loggedData = ibGreyBarTransformer.updateLoggedData(data);
            vm.model.isLogged = true;
            headerModel.greyBarModel = vm.model;
            localStorageService.set('headerModel', headerModel);
            if (typeof vm.model.login?.afterLogin === 'function') {
                if (localStorageService.get('flowApp') === 'MMB') {
                    localStorageService.set('RechargeBookingInfo', true);
                }
                vm.model.login.afterLogin(data);
            } else {
                $window.location.reload();
            }
        }
        function hideLogin () {
            vm.model.show = false;
        }

        function showComponentChooseLanguage () {
            const quadrigamsValid = ['ibcoac', 'ibcoacpa', 'ibcoed'];
            const actualQuadrigam = $location.path().replace('/', '');
            vm.isFlowCki = $rootScope.flowName === 'CKI' && quadrigamsValid.includes(actualQuadrigam);
            return vm.isFlowCki;
        }

        function getUserState () {
            return {
                isLogged: Boolean(vm.model?.isLogged),
                show: Boolean(vm.model?.show),
                isSoftUser: Boolean(ibGreyBarTransformer.isSoftUser())
            };
        }

        function isLogged () {
            const { isLogged, isSoftUser } = getUserState();
            return isLogged && !isSoftUser;
        }

        function isNotLogged () {
            const { isLogged, isSoftUser, show } = getUserState();
            return (!isLogged || isSoftUser) && show;
        }
    }
})();