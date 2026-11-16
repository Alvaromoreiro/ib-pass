(function () {
    'use strict';

    angular
        .module('ib-MmB-segment-details-module')
        .controller('MmBSegmentDetailsController', MmBSegmentDetailsController);

    MmBSegmentDetailsController.$inject = ['BookingManagementConstants', '$scope', 'MmBAppConstants'];

    function MmBSegmentDetailsController(BookingManagementConstants, $scope, MmBAppConstants) {
        var vm = this;
        var availablePaLanguages = ['es', 'ca'];

        vm.openFareConditionsModal = openFareConditionsModal;
        vm.getOptionTitle = getOptionTitle;
        vm.selectOption = selectOption;
        vm.showSegmentError = showSegmentError;
        vm.$onInit = activate;


        function activate() {
            if (vm.showPreHeader) {
                vm.paIconUrl = MmBAppConstants.iconsRoute + '/puente_aereo/logo_pte_aero_short_' + (availablePaLanguages.indexOf(MmBAppConstants.lang) !== -1 ? MmBAppConstants.lang : MmBAppConstants.defaultLang) + '.png';
            }
        }

        /**
         * Sends an event with the segment option selected by the user and the curren segment info
         * @param {Object} selectedOption the segment option selected by the user
         */
        function selectOption(selectedOption) {
            $scope.$emit('optionSelected', {
                'segmentInfo': vm.segmentModel,
                'selectedOption': selectedOption
            });
        }

        /**
         * Sends a showSegmentError' event with the segment segmentStatus info
         */
        function showSegmentError() {
            $scope.$emit('showSegmentError', vm.segmentModel.segmentStatus);
        }

        /**
         * return a id label to put it in title of the segment option
         * @param {String} optionTitle the id of a segment
         */
        function getOptionTitle(optionTitle) {
            var returnedTitle = '';
            switch (optionTitle) {
                case BookingManagementConstants.SEGMENT_OPTION.SEAT: returnedTitle = 'IBCOAC_MMB_SEGMENT_DETAILS_SEAT_TITLE'; break;
                case BookingManagementConstants.SEGMENT_OPTION.BOARDING: returnedTitle = 'IBCOAC_MMB_SEGMENT_DETAILS_BOARDING_TITLE'; break;
                case BookingManagementConstants.SEGMENT_OPTION.CHECKIN: returnedTitle = 'IBCOAC_MMB_SEGMENT_DETAILS_CHECKIN_TITLE'; break;
                case BookingManagementConstants.SEGMENT_OPTION.MODIFY: returnedTitle = 'IBCOAC_MMB_SEGMENT_DETAILS_MODIFY_TITLE'; break;
                default: break;
            }
            return returnedTitle;
        }

        /**
       * Emits an 'openFareConditionsModal' event with the modal size, template name and if it is animated or not
       * @param {String} size the modal size. example 'md'
       * @param {String} tpl the template name
       * @param {Boolean} anim if the modal should be opened using an animation
       */
        function openFareConditionsModal(size, tpl, anim) {
            $scope.$emit('openFareConditionsModal', { 'size': size, 'template': tpl, 'animation': anim, 'isBlocked': false, 'fareFamily': vm.segmentModel.cabinClass.fareFamily });
        }

    }
})();
