(function () {
    'use strict';

    angular
        .module('ib-MmB-check-list-module')
        .controller('MmBCheckListController', MmBCheckListController);

    MmBCheckListController.$inject = ['$scope', '$timeout'];
    function MmBCheckListController($scope, $timeout) {
        var vm = this;
        vm.openLink = openLink;
        vm.seat = false;
        vm.baggage = false;

        vm.$onInit = activate;

        ////////////////

        function activate() {
            $timeout(function () {
                vm.progressList = 0;

                if (vm.model) {
                    if (vm.model.seat) {
                        ++vm.progressList;
                        vm.seat = true;
                        vm.model.seat.forEach(function (element){
                            if(element.emd === 'PENDING_PAYMENT') {
                                vm.seat = false;
                            }
                        });
                    }
                    if (vm.model.baggage) {
                        ++vm.progressList;
                        vm.booking = true;
                        vm.model.baggage.forEach(function (element){
                            if(element.emd === 'PENDING_PAYMENT') {
                                vm.booking = false;
                            }
                        });
                    }
                    if (vm.model.insurance) {
                        ++vm.progressList;
                        vm.insurance = true;
                    }
                    if (!vm.model.document) {
                        ++vm.progressList;
                        vm.document = true;
                    }
                }
            });
        }

        function openLink(type) {
            $scope.$emit('openLink', type);
        }
    }
})();