(function () {
    'use strict';

    // Usage: <ib-apis-visa></ib-apis-visa>
    // 
    // Creates: APIS form visa section
    // 
    /* istanbul ignore next */
    angular
        .module('ib-apis-visa-module')
        .component('ibApisVisa', {
            controller: 'ApisVisaController',
            controllerAs: 'apisVisaCtrl',
            bindings: {
                pasVisaData: '=',
                requiredFields : '<',
                countries:'<',
                containerForm: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-apis-visa-view.html';
            }]
        });
})();