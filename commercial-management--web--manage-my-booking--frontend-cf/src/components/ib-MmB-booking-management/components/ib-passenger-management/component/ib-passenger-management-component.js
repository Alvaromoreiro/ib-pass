(function () {
    'use strict';

    // Usage:  <ib-passenger-management pas-mmg-model pas-mng-model="" opt-info-model=""></ <ib-passenger-management>
    // 
    // Creates: A  struture with the info of the passengers to be selected and edit its contact data information

    /* istanbul ignore next */
    angular.module('ib-passenger-management-module')
        .component('ibPassengerManagement', {
            controller: 'PassengerManagementController',
            controllerAs: 'pasMngCtrl',
            bindings: {
                pasMngModel: '<',
                optInfoModel: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-passenger-management-view.html';
            }]
        });
})(); 