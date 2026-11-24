(function () {
    'use strict';

    angular
        .module('ib-modal-module')
        .controller('PaymentGenericModalController', PaymentGenericModalController);

    PaymentGenericModalController.$inject = ['$uibModalInstance', 'object', '$window', 'localStorageService', '$rootScope', 'ibMarketingPermissionService'];
    function PaymentGenericModalController ($uibModalInstance, object, $window, localStorageService, $rootScope, ibMarketingPermissionService) {
        const vm = this;
        vm.model = object;

        vm.$onInit = activate;
        vm.close = closeModal;
        vm.accept = acceptModal;
        vm.returnToHomepage = returnToHomepage;
        vm.showInfoWaitingModal = showInfoWaitingModal;
        vm.flowName = $rootScope.flowName;
        vm.isMarketingAccepted = false;
        vm.continueModalMP = continueModalMP;
        ////////////////

        function activate () {
            vm.showInfoWaitingModal();
        }

        /**
         * Closes the modal dismissing its instance
         */
        function closeModal () {
            $uibModalInstance.dismiss();
        }

        /**
         * Closes the marketing permission modal dismissing its instance and sending request if checkbox is accepted
         */
        function continueModalMP (showModalMP) {
            if(showModalMP) {
                ibMarketingPermissionService.reqMarketingPermission();
            }
            $uibModalInstance.dismiss();
        }

        /**
         * Closes the modal calling close method of its instance
         */
        function acceptModal (type) {
            $uibModalInstance.close(type);
        }

        /**
         * Sends the user to the homepage (it is used for the modal warning the user in confirmation page in case the browser back button is pressed).
         */
        function returnToHomepage () {
            $window.location.href = $window.location.origin;
        }

        function showInfoWaitingModal () {
            const logged = localStorageService.get('userLogged');
            let calculatedPoints = null;
            let customerData = null;
            let loadingEarnMessage = false;
            if (logged !== null && logged) {
                calculatedPoints = localStorageService.get('CalculatedPoints') !== null ? localStorageService.get('CalculatedPoints') : null;
                customerData = localStorageService.get('customerData') !== null ? localStorageService.get('customerData') : {};
                loadingEarnMessage = localStorageService.get('loadingEarnMessage') !== null ? localStorageService.get('loadingEarnMessage') : false;
                vm.model = angular.isDefined(vm.model) ? vm.model : {};
                vm.model.userData = {};
                vm.model.userData.isLogged = logged;
                vm.model.userData.earnMessage = loadingEarnMessage;
                vm.model.userData.earnAvios = calculatedPoints !== null && calculatedPoints.Avios !== null ? calculatedPoints.Avios : null;
                vm.model.userData.earnElite = calculatedPoints !== null && calculatedPoints.Elite !== null ? calculatedPoints.Elite : null;
                if (angular.isDefined(customerData) && customerData !== null && typeof customerData === 'object') {
                    vm.model.userData.name = (typeof customerData.personalInfo === 'object' && typeof customerData.personalInfo.name === 'string') ? customerData.personalInfo.name : '';
                    vm.model.userData.avios = (typeof customerData.generalInfo === 'object' && typeof customerData.generalInfo.aviosTransformed === 'string') ? customerData.generalInfo.aviosTransformed : '';
                    vm.model.userData.category = (typeof customerData.generalInfo === 'object' && typeof customerData.generalInfo.category === 'string') ? customerData.generalInfo.category : '';
                }
                if (calculatedPoints !== null) {
                    vm.model.userData.earnAvios = calculatedPoints.Avios;
                    vm.model.userData.earnElite = calculatedPoints.Elite;
                }
            }
        }
    }
})();
