(function () {
    'use strict';

    // Usage: <ib-apis-form></ib-apis-form>
    //
    // Creates: APIS form content. Requires form.
    //
    /* istanbul ignore next */
    angular
        .module('ib-apis-form-module')
        .component('ibApisForm', {
            controller: 'ApisFormController',
            controllerAs: 'apisFormCtrl',
            bindings: {
                passengersData: '=',
                countries: '<',
                companies: '<',
                states: '<',
                containerForm: '=',
                passengers: '=',
                adultPassengersData: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-apis-form-view.html';
            }]
        });
})();
