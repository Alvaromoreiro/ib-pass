(function () {
    'use strict';

    /**
     *    Usage: <ib-passenger-form></ib-passenger-form>
     *    Creates: Creates an html form for input the information of passengers 
     * 
     */
    /* istanbul ignore next */
    angular
        .module('ib-passenger-form-module')
        .component('ibPassengerForm', {
            controller: 'PassengerFormController',
            controllerAs: 'pasFormCtrl',
            bindings: {
                passengerModel: '=',
                companies: '<',
                index: '<'
              
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-passenger-form-view.html';
            }]
        });
})();