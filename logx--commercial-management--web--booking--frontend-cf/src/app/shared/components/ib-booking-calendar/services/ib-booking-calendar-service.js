(function () {


    angular
        .module('ib-booking-calendar-module')
        .factory('BookingCalendarService', BookingCalendarService);

    BookingCalendarService.$inject = ['CommonsSessionStorageService', 'BookingAvailabilityTransformer','BookingCalendarGridService','BookingCalendarTransformer'];

    function BookingCalendarService (CommonsSessionStorageService, BookingAvailabilityTransformer, BookingCalendarGridService, BookingCalendarTransformer) {

        const service = {
            initRedemptionCalendar: initRedemptionCalendar
        };

        return service;

        /**
         * Calls to the http-service for obtain the calendar info and init the model
         * @param {*} currentOriginDestinationIndex Indentify the different slice in the flight
         */
        function initRedemptionCalendar (currentOriginDestinationIndex) {
            const calendarRequest = CommonsSessionStorageService.get('newAvailabilitySearch')
                ? CommonsSessionStorageService.get('newAvailabilitySearch')
                : BookingAvailabilityTransformer.createRequestAvailability();

            calendarRequest.slices = [calendarRequest.slices[currentOriginDestinationIndex]];
            calendarRequest.maxSearchTime = CommonsSessionStorageService.get('commercialData')
                ? CommonsSessionStorageService.get('commercialData').maxSearchTime
                : undefined;

            return BookingCalendarGridService
                .getRedemptionCalendarData(calendarRequest)
                .then((data) => {
                    const responseData = data && data.data ? data.data : data;

                    return BookingCalendarTransformer.getRedemptionCalendarModel(
                        responseData,
                        currentOriginDestinationIndex
                    );
                });
        }

    }

})();