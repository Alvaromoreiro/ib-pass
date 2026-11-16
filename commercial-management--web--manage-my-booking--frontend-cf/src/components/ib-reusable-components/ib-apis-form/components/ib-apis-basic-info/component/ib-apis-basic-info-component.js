(function () {
    'use strict';

    // Usage: <ib-apis-basic-info></ib-apis-basic-info>
    //
    // Creates: APIS form basic info section
    //
    /* istanbul ignore next */
    angular
        .module('ib-apis-basic-info-module')
        .component('ibApisBasicInfo', {
            controller: 'ApisBasicInfoController',
            controllerAs: 'apisBasicInfoCtrl',
            bindings: {
                pasBasicData: '=',
                requiredFields: '<',
                countries: '<',
                containerForm: '=',
                states: '=',
                companies: '=',
                submitForm: '<',
                isInfant: '<',
                relatedAdultData: '<',
                isRequiredHomeAddress: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-apis-basic-info-view.html';
            }]
        });
})();
