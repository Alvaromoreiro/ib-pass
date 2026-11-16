(function () {
    'use strict';

    // Usage: <ib-apis-docs></ib-apis-docs>
    //
    // Creates: APIS form documents section
    //
    /* istanbul ignore next */
    angular
        .module('ib-apis-docs-module')
        .component('ibApisDocs', {
            controller: 'ApisDocsController',
            controllerAs: 'apisDocsCtrl',
            bindings: {
                pasDocsData: '=',
                countries: '<',
                containerForm: '=',
                idDocument:'<',
                isInfant: '<',
                relatedAdultData: '<',
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-apis-docs-view.html';
            }]
        });
})();
