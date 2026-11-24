(function () {
    'use strict';

    angular
        .module('ib-pmt-on-hold-info-module')
        .controller('IbPmtOnHoldInfoController', IbPmtOnHoldInfoController);

    IbPmtOnHoldInfoController.$inject = ['$scope'];
    function IbPmtOnHoldInfoController($scope) {

        var vm = this;
        vm.selectOnHoldOption = selectOnHoldOption;
        vm.active;

        ////////////////

        function activate() {
          
        }

        function selectOnHoldOption(info, index) {
            $scope.$emit('selectOnHoldOptionEvent', info, index);
        }

    };
})();