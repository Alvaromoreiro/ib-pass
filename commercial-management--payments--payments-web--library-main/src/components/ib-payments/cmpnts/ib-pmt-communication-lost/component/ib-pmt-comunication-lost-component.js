import { ibPmtWithStylesHost } from '../../../../../styles/ib-pmt-styles-host';
(function () {
    'use strict';

    // Usage: <ib-pmt-communication-lost as-component= "boolean"></ib-pmt-communication-lost>
    // 
    // Creates:  show communication lost page
    // 

    /* istanbul ignore next */
    angular.module('ib-pmt-communication-lost-module')
        .component('ibPmtCommunicationLost', {
            controller: ibPmtWithStylesHost('PmtCommunicationLostController'),
            controllerAs: 'pmtComLostCtr',
            bindings: {
                asComponent: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-communication-lost-view.html';
            }]
        });

})();