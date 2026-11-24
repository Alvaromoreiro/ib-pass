(function() {
    'use strict';

    var ibSummaryItem = {
        controller: 'ibSummaryItemController',
        controllerAs: 'summaryItemCtrl',
        templateUrl: ['$rootScope', function ($rootScope) {
            return $rootScope.routes.templates + 'ib-summary-item-module.html';
        }],
        bindings: {
            model: '<'
        }
    };

    angular
        .module('ib-summary-item')
        .component('ibSummaryItem', ibSummaryItem);
})();