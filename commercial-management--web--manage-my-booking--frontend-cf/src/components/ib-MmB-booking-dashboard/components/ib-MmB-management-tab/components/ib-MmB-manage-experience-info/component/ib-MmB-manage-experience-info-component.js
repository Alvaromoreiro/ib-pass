(function () {
    'use strict';

    // Usage: <ib-mmb-manage-experience-info model="" ></ib-mmb-manage-experience-info>
    //
    // Creates:
    //

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-experience-info-module')
        .component('ibMmbManageExperienceInfo', {
            controller: 'MmBManageExperienceInfoController',
            controllerAs: 'manageExperienceInfoCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-experience-info-view.html';
            }]
        });
})();
