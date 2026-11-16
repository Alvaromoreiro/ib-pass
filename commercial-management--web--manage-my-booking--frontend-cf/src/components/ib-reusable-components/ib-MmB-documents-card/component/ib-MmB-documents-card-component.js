(function () {
    'use strict';

    // Usage: <ib-MmB-documents-card></ib-MmB-documents-card>
    //
    // Creates:
    //
    /* istanbul ignore next */
    angular.module('ib-MmB-documents-card-module')
        .component('ibMmbDocumentsCard', {
            controller: 'MmBDocumentsController',
            controllerAs: 'documentsCardCtrl',
            bindings: {
                model: '=',
                index: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-documents-card-view.html';
            }]
        });
})();
