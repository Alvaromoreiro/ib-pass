(function () {
    'use strict';

    // Usage: <ib-frequent-flyer> </ib-frequent-flyer>
    // 
    // Creates: A collapse component with a frequent flyer form for one passenger with all its validations
    // 

    angular
        .module('ib-frequent-flyer-module')
        .component('ibFrequentFlyer', {
            controller: 'FrequentFlyerController',
            controllerAs: 'ffCtrl',
            bindings: {
                frequentFlyerModel: '=',
                fieldsStatus: '<',
                containerForm: '=',
                companies: '<',
                index: '@',
                isRequired: '='
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-frequent-flyer-view.html';
            }]
        });
})();