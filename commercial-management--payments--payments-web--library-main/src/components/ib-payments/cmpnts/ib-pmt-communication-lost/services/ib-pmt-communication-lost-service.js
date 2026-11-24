(function () {
    'use strict';

    angular
        .module('ib-pmt-communication-lost-module')
        .factory('ibPmtCommunicationLostService', ibPmtCommunicationLostService);

    ibPmtCommunicationLostService.$inject = ['ibPmtCommunicationLostTransformer', 'localStorageService'];
    function ibPmtCommunicationLostService(ibPmtCommunicationLostTransformer, localStorageService) {

        return {
            getCommunicationLostInfo: getCommunicationLostInfo
        };

        ////////////////

        /**
         * initialize the communication lost model calling to transformer
         */
        function getCommunicationLostInfo() {
            return ibPmtCommunicationLostTransformer.generateCommunicationLostInfo(localStorageService.get('issueOrderInfo'), localStorageService.get('creditCardTypes'));
        }
    }
})();