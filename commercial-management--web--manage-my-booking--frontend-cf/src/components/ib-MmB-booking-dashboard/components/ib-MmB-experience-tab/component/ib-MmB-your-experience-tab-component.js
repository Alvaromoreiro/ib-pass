(function () {
    'use strict';

    // Usage: <ib-MmB-your-experience-tab model="" index="" ></ib-MmB-your-experience-tab>
    //
    // Creates:
    //

    /* istanbul ignore next */
    angular.module('ib-MmB-your-experience-tab-module')
        .component('ibMmbYourExperienceTab', {
            controller: 'MmBYourExperienceTabController',
            controllerAs: 'experienceTabCtrl',
            bindings: {
                model: '=',
                index: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-your-experience-tab-view.html';
            }]
        });
})();
