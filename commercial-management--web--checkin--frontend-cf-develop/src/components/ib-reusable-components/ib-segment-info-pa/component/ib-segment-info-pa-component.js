(function () {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('ib-segment-info-pa-module')
        .component('ibSegmentInfoPa', {
            controller: 'SegmentInfoPAController',
            controllerAs: 'segmentInfoCtrl',
            bindings: {
                segmentInfoModel: '<',
                segmentSelected: '=?',
                index: '@',
                showPa: '<',
                showDetails: '<',
                showChecks: '<'
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-segment-info-pa-view.html';
            }]
        });
})();