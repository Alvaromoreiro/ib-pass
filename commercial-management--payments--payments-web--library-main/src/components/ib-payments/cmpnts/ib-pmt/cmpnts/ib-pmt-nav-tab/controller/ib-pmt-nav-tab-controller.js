(function () {
    'use strict';

    angular
        .module('ib-pmt-nav-tab-module')
        .controller('PmtTabNavController', PmtTabNavController);

    PmtTabNavController.$inject = ['$scope', 'PmtComponentUtils', '$timeout', 'NewMainHeaderFacade'];
    function PmtTabNavController($scope, PmtComponentUtils, $timeout, NewMainHeaderFacade) {
        var vm = this;

        vm.$onInit = activate;
        vm.tabdrop = tabdrop;
        vm.showGeneralModalInfoQuota = showGeneralModalInfoQuota;

        $scope.$on('updateSelectedTabEvent', updateSelectedTab);


        ////////////////

        function activate() {
            vm.previousActiveTab = 0;
        };

        /**
         * 
         * @param {*} e 
         * @param {*} selectedIndex 
         */
        function tabdrop(e, selectedIndex) {
            var obj, dropdown, tab, dropdownTab;
            if (angular.isDefined(e)) {
                obj = angular.element(e.currentTarget);
                dropdown = PmtComponentUtils.get_parents(obj, function (el) {
                    return angular.element(el).hasClass('dropdown');
                });
                if (angular.isDefined(dropdown)) {
                    angular.element(dropdown).addClass('active');
                } else {
                    tab = PmtComponentUtils.get_parents(obj, function (el) {
                        return angular.element(el).hasClass('ib-tab');
                    });
                    dropdownTab = angular.element(tab).find('.tabdrop');
                    angular.element(dropdownTab).removeClass('active');
                }
            }
            NewMainHeaderFacade.updateBasketOthers(vm.paymentInfo.paymentMethods[selectedIndex].type);
            $scope.$emit('changeSelectedTab', selectedIndex, vm.previousActiveTab);
            vm.previousActiveTab = selectedIndex;
        }

        /**
         * Update tab if user select other payment method
         * @param {Event} e 
         * @param {Int} selectedIndex is value tab 
         */
        function updateSelectedTab(e, selectedIndex) {
            $timeout(function () {
                $scope.$apply(function () {
                    vm.selectedData.selectedTab = selectedIndex;
                });
            });
        };

        /**
         * Launch event to show modal with information
         */
        function showGeneralModalInfoQuota() {
            $scope.$emit('showGeneralModalInfoQuota');
        }

    }
})();
