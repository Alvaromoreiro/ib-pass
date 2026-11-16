(function () {
    'use strict';

    /* istanbul ignore next */
    angular.module('ib-MmB-your-documents-tab-module')
        .component('ibMmbYourDocumentsTab', {
            controller: 'MmBYourDocumentsTabController',
            controllerAs: 'documentsTabCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-your-documents-tab-view.html';
            }]
        });
})();
