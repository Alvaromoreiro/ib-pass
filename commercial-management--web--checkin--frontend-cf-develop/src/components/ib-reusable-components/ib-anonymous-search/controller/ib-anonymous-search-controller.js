(function () {
    'use strict';

    angular
        .module('ib-anonymous-search-module')
        .controller('AnonymousSearchController', AnonymousSearchController);

    AnonymousSearchController.$inject = ['$scope', 'AnonymousSearchModel', 'localStorageService'];
    function AnonymousSearchController($scope, AnonymousSearchModel, localStorageService) {

        var vm = this;
        vm.model = AnonymousSearchModel;

        vm.openGenericModal = openGenericModal;
        vm.initBooking = initBooking;
        vm.getPNRLength = getPNRLength;

        vm.$onInit = activate;

        //////////////

        function activate() {
            vm.buttonStyle = vm.buttonStyle || 'ib-button--red';
            vm.model.surname = localStorageService.get('confirmationPNR') ? localStorageService.get('checkinSurname') : '';
            vm.model.pnr = localStorageService.get('confirmationPNR') ? localStorageService.get('PNR') : '';
        }

        /**
         * Emits an 'openGenericModal' event with the modal size, template name and if it is animated or not 
         * @param {String} size the modal size. example 'md'
         * @param {String} tpl the template name
         * @param {Boolean} anim if the modal should be opened using an animation
         */
        function openGenericModal(size, tpl, anim) {
            $scope.$emit('openGenericModal', size, tpl, anim);
        }

        /**
         * Emits an 'anonymousSubmit' event with the modal size, template name and if it is animated or not 
         * @param {Object<AngularForm>} currentForm 
         */
        function initBooking(currentForm) {
            if (currentForm.$valid) {
                $scope.$emit('anonymousSubmit', { 'pnr': vm.model.pnr.replace(/-| /g, ''), 'surname': vm.model.surname });
                currentForm.$submitted = false;
                localStorageService.remove('headerModel');
            }
        }

        /**
         * returns the pnr max-length depending on current pnr value. If the current pnr length is less than 7 and its value is formed only by a-z letters
         * then max-length should be 6, otherwise max-length should be 14
         */
        function getPNRLength() {
            return vm.model.pnr ? vm.model.pnr.length < 7 && /[a-zA-Z]+/.test(vm.model.pnr) ? 6 : 14 : 14;
        }
    }
})();