(function () {
    'use strict';

    // Usage: <ib-MmB-experience-card></ib-MmB-experience-card>
    //
    // Creates:
    //
    /* istanbul ignore next */
    angular.module('ib-MmB-experience-card-module')
        .component('ibMmbExperience', {
            controller: 'MmBExperienceController',
            controllerAs: 'experienceCardCtrl',
            bindings: {
                model: '=',
                index: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-experience-card-view.html';
            }]
        });
})();
