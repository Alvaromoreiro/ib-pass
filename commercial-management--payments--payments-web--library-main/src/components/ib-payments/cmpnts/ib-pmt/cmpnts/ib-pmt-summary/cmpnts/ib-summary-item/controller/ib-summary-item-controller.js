(function () {
    'use strict';

    angular
        .module('ib-summary-item')
        .controller('ibSummaryItemController', ibSummaryItemController);

    ibSummaryItemController.$inject = ['$scope'];
    
    function ibSummaryItemController($scope) {
        var vm = this;
        vm.deleteAncillarie = deleteAncillarie;
        
        function deleteAncillarie(callback, concept, index) {
            $scope.$emit(callback, concept, index);
        }
    }
})();
