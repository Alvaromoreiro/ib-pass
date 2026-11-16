import { DatalayerConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-constants';
(function () {


    angular
        .module('ib-booking-availability-trip-module')
        .controller('BookingAvailabilityTripController', BookingAvailabilityTripController);
    BookingAvailabilityTripController.$inject = ['BookingAppConstants', 'localStorageService','BookingModalService', 'DatalayerUtilsService', 'MonetateUtilsService', '$timeout', '$rootScope'];
    function BookingAvailabilityTripController (BookingAppConstants, localStorageService, BookingModalService,DatalayerUtilsService, MonetateUtilsService, $timeout , $rootScope) {
        const vm = this;
        vm.LOGIN_ONB = BookingAppConstants.LOGIN_ONB;
        vm.openCalendarModal = openCalendarModal;
        vm.$onInit = activate;
        ////////////////

        function activate () {
            vm.getMarketOBPoints = localStorageService.get('getMarketOBPoints') || null;
            const calendarInfo = vm.tripModel?.calendarSlides;
            if (calendarInfo && Array.isArray(calendarInfo.slides) && calendarInfo.slides.length > 0) {
                const monatateProductDetailInfo = {
                    origin : vm.tripModel.origin ?? '',
                    destination: vm.tripModel.destination ?? '',
                    date: (calendarInfo.slides[calendarInfo.selectedSlide ?? calendarInfo.currentInitialSlide ?? 0]?.serviceDate)
                };
                $timeout(() => {
                    MonetateUtilsService.addTrackProductDetail([monatateProductDetailInfo]);
                    $rootScope.$broadcast('updateDigitalData');
                    $rootScope.$broadcast('sendUpdateToMonetate');
                });
            }




        }
        function openCalendarModal () {
            BookingModalService.showGenericModal(false,'ib-modal-calendar-avios.html',{originDestinations:vm.tripModel, currentOriginDestinationIndex:vm.currentOriginDestinationIndex},'ib-modals--desktop').result.then(closeCalendarModal,closeCalendarModal);
        }

        /**
         * Remove datalayer attributes when the calendar modal is closing
         */
        function closeCalendarModal () {
            DatalayerUtilsService.removeDatalayerObjects([DatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY,DatalayerConstants.DATALAYER_INFO.EVENT_ACTION,DatalayerConstants.DATALAYER_INFO.EVENT_LABEL]);
        }

    }
})();
