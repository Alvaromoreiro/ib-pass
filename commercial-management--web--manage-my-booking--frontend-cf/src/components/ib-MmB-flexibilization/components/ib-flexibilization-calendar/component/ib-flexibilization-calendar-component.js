(function () {
    'use strict';

    // Usage: <ib-flexibilization-calendar model="myCtrl.myModel"></ib-flexibilization-calendar>

    /* istanbul ignore next */
    angular.module('ib-flexibilization-calendar-module')
        .component('ibFlexibilizationCalendar', {
            controller: 'IbFlexibilizationCalendarController',
            controllerAs: 'ibFlexCalendarCtrl',
            bindings: {
                selectedDate: '=',
                updatedDateList: '<',
                slicesIndex: '<',
                ribbonFlexData: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-flexibilization-calendar-view.html';
            }]
        });
})();