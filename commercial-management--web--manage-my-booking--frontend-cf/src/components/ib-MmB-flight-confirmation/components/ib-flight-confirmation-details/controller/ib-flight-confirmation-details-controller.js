(function () {
    'use strict';

    angular
        .module('ib-flight-confirmation-details-module')
        .controller('FlightConfirmationDetailsController', FlightConfirmationDetailsController);

    FlightConfirmationDetailsController.$inject = ['$scope'];
    function FlightConfirmationDetailsController($scope) {
        var vm = this;
        vm.openFareConditionsModal = openFareConditionsModal;
        vm.$onInit = activate;

        ////////////////

        function activate() { }

        /**
          * Emits an 'openFareConditionsModal' event with the modal size, template name and if it is animated or not 
          * @param {String} size the modal size. example 'md'
          * @param {String} tpl the template name
          * @param {Boolean} anim if the modal should be opened using an animation
          */
        function openFareConditionsModal(size, tpl, anim) {
            $scope.$emit('openFareConditionsModal', { 'size': size, 'template': tpl, 'animation': anim, 'isBlocked': false, 'fareFamily': vm.confirmDetailsModel.cabinClass.fareFamily });

        }

    }
})();