(function () {
    'use strict';
    angular.module('ib-disruption-flight-card-module')
        .controller('DisruptionFlightCardController', DisruptionFlightCardController);

    DisruptionFlightCardController.$inject = ['localStorageService'];

    function DisruptionFlightCardController (localStorageService) {
        var vm = this;
        vm.$onInit = activate;

        /**
         * Intialize data
         */
        function activate () {
            vm.data.value = false;
            vm.keepCollapseOpen = false;
            const downgradeCodes = localStorageService.get('downgradeCodes');
            vm.warningDowngradeSameFlightAndTime = downgradeCodes.includes('SSE_ORM_9429') && !downgradeCodes.includes('SSE_ORM_9430') && !downgradeCodes.includes('SSE_ORM_9433');
            vm.warningDowngradeDiffFlightOrTime = downgradeCodes.includes('SSE_ORM_9430') || downgradeCodes.includes('SSE_ORM_9433');

            if (vm.data.hasMissconnection) {
                vm.keepCollapseOpen = true;
            }
        }
    }
})();