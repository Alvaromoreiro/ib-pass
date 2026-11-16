import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-MmB-passengers-info-module')
        .controller('PassengersInfoController', PassengersInfoController);

    PassengersInfoController.$inject = ['$scope', 'PassengersInfoModel', 'MmBAppConstants', 'PassengersInfoService', 'MmBModalService', '$location', 'PassengersInfoConstants', 'localStorageService', 'MmBDatalayerUtilsService', 'CommonsUtilService', '$timeout'];
    function PassengersInfoController($scope, PassengersInfoModel, MmBAppConstants, PassengersInfoService, MmBModalService, $location, PassengersInfoConstants, localStorageService, MmBDatalayerUtilsService, CommonsUtilService, $timeout) {
        var vm = this;
        var originalInfo;
        vm.model = PassengersInfoModel;


        $scope.$on('passengerFormContactNext', passengerFormContactNext);
        $scope.$on('passengerFormContactBack', backPage);
        $scope.$on('updateContactInfo', updateContactInfo);
        $scope.$on('dataContactFormBack', backPage);
        $scope.$on('updateIndexTab', updateIndexTab);
        $scope.$on('infantFormContactNext', infantFormContactNext);
        $scope.$on('openSpecialPassengers', openSpecialPassengersPage);



        activate();

        ////////////////

        function activate() {
            var transformedInfo = PassengersInfoService.generatePassengerData();
            $timeout(function () {
                CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_AIR_SHUTTLE_CONTACT_DATA');
            },1400);
            vm.model.initializeModel();
            MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOINFO,MMBDatalayerConstants.DIGITAL_DATA_STEP.MOINFO, MmBAppConstants.QUADRIGAM.PASSENGER_INFO);
            vm.model.passengersInfo = {
                'passengersContactInfo': transformedInfo.passengersContactInfo,
                'primaryContactInfo': transformedInfo.primaryContactInfo,
            };
            vm.model.indexTab = transformedInfo.indexTab;
            vm.model.optionalInformation = transformedInfo.optionalInformation;
            vm.model.passengerContactData = transformedInfo.passengerContactData;
            vm.model.companies = transformedInfo.companies;
            originalInfo = angular.copy(vm.model.passengersInfo);
        }


        /**
         * Change tab for info-tab child component
         */
        function updateIndexTab(event, data) {
            vm.model.indexTab = data.index;
        }


        /**
         * Check information of form passenger and if have data send to service.
         * @param {*} event
         * @param {*} data Pointer to model of information of passenger
         *         .id
         *         .number_phone
         *         .email
         */
        function passengerFormContactNext(event, dataPassenger, needsUpdate) {
            if (dataPassenger.frequentFlyerInfo && dataPassenger.frequentFlyerInfo.number && dataPassenger.frequentFlyerInfo.company && dataPassenger.frequentFlyerInfo.company !== PassengersInfoConstants.DEFAULT_COMPANY_CODE && needsUpdate) {
                MmBModalService.showWaitingModal();
                PassengersInfoService.updateDataPassenger(dataPassenger).then(function (passengerInfo) {
                    MmBModalService.finishWaiting();
                    vm.model.passengersInfo.passengersContactInfo[vm.model.indexTab].status = PassengersInfoConstants.STATUS_COMPLETE;
                    PassengersInfoService.updateLocalPassengers(vm.model.passengersInfo);
                    localStorageService.set('savedChangeSuccess', true);
                    localStorageService.set('savedPasSuccess', true);
                    vm.model.indexTab++;
                }, function (error) {
                    MmBModalService.finishWaiting();
                    vm.model.passengersInfo.passengersContactInfo[vm.model.indexTab].status = PassengersInfoConstants.STATUS_INCOMPLETE;
                    MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
                });
            } else {
                vm.model.indexTab++;
            }
        }

        /**
         * Next tab for passenger when is a INFANT
         */
        function infantFormContactNext() {
            vm.model.indexTab++;
        }



        /**
          * Check information of data contact form and if have data send to service.
          * @param {*} event
          * @param {*} data Data contact info
          * @param {Object} passengers Model of passengers
          */
        function updateContactInfo(event, passengers, dataContact, needsUpdate) {
            if (needsUpdate) {
                MmBModalService.showWaitingModal();
                PassengersInfoService.updateDataContactInfo(vm.model.passengersInfo, originalInfo).then(function (dataContactInfo) {
                    MmBModalService.finishWaiting();
                    PassengersInfoService.updateLocalPassengers(vm.model.passengersInfo);
                    localStorageService.set('savedChangeSuccess', true);
                    localStorageService.set('savedPasSuccess', true);
                    localStorageService.set('savedDataContactSuccess', PassengersInfoConstants.STATUS_COMPLETE);
                    $location.path(MmBAppConstants.PAGES_URL.BOOKING_MANAGE);
                }, function (error) {
                    MmBModalService.finishWaiting();
                    MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
                });
            } else {
                $location.path(MmBAppConstants.PAGES_URL.BOOKING_MANAGE);
            }
        }

        /**
         * Show modal for confirmation back to IBCOAC on form of passengers info
         * @param {Object} event
         * @param {Object} data
         */
        function backPage(event, data) {
            MmBModalService.showGenericModal(true, 'ib-MmB-passengers-back-modal.html', { 'idModal': MMBDatalayerConstants.DATALAYER_MODAL_ID.BACK_MODAL }).result.then(function () {
                $location.path(MmBAppConstants.PAGES_URL.BOOKING_MANAGE);
            }, angular.noop);
        }


        /**
         * Open special passenger page with the passengerId
         * @param {Object} evt Event emits
         * @param {Object} data PassengerId of passenger selected
         */
        function openSpecialPassengersPage(evt, data) {
            localStorageService.set('selectedPassengerSpecial', data);
            $location.path(MmBAppConstants.PAGES_URL.CHANGE_PASSENGERS_SPECIAL_NEEDS);
        }
    }
})();
