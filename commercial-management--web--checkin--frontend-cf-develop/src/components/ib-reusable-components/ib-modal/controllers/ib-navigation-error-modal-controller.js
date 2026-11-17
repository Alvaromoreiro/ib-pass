(function () {
    'use strict';

    angular
        .module('ib-cki-modal-module')
        .controller('NavigationErrorModalController', NavigationErrorModalController);

    NavigationErrorModalController.$inject = ['$uibModalInstance','$location','object','localStorageService', 'IbUtilsService', '$rootScope', '$window', 'CloseSessionService', 'IbSessionConfigService'];
    function NavigationErrorModalController ($uibModalInstance,$location,object,localStorageService, IbUtilsService, $rootScope, $window, CloseSessionService, IbSessionConfigService) {

        var vm = this;

        vm.model = object;
        vm.continueStep = continueStep;
        vm.close = close;

        function continueStep () {
            CloseSessionService.closeSession();
            $window.location.href = $window.location.origin + $window.location.pathname + IbUtilsService.removeParameterURL($window.location.search);
            IbSessionConfigService.initStorage();
            $uibModalInstance.dismiss();

        }

        function close () {
            $uibModalInstance.dismiss();
            if(localStorageService.get('invokeEarlyCheckinFunction')===true) {
                $rootScope.$broadcast('checkEarlyCheckinModal');
            }

        }

    }
})();
