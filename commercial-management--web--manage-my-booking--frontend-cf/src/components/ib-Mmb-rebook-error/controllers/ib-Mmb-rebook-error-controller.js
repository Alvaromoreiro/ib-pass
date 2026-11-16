(function () {
    'use strict';

    angular
        .module('ib-MmB-rebook-error-module')
        .controller('MmbRebookErrorController', MmbRebookErrorController);

    MmbRebookErrorController.$inject = ['localStorageService', '$rootScope'];
    function MmbRebookErrorController(localStorageService, $rootScope) {
        var vm = this;
        activate();

        function activate() {
            var phonesList = localStorageService.get('phonesList');
            vm.callCenterNumber = phonesList.RESERVAS.prefix + ' ' + phonesList.RESERVAS.telephone;

            $rootScope.showMainHeader = true;
            $rootScope.$broadcast('setFooterFullWidth');
        }
    }
})();