(function () {
    'use strict';

    angular.module('ib-booking-name').controller('BookingNameModalController', BookingNameModalController);

    BookingNameModalController.$inject = [
        '$uibModalInstance',
        'localStorageService',
        'GetBookingNameService',
        'BookingNameModel',
        'SearchFlightsPassengersService',
        'object',
        'CkiDatalayerUtilsService',
        'ModalService'
    ];

    function BookingNameModalController (
        $uibModalInstance,
        localStorageService,
        GetBookingNameService,
        BookingNameModel,
        SearchFlightsPassengersService,
        object,
        CkiDatalayerUtilsService,
        ModalService,
    ) {
        const vm = this;

        vm.model = BookingNameModel;
        vm.errorMessage = null;

        vm.accept = function () {
            const bookingData = getBookingData();

            vm.form.$submitted = true;

            if (!bookingData.flowId || !vm.form.$valid) {
                return;
            }

            ModalService.isWaiting();

            return GetBookingNameService.getBooking(vm.model.name, bookingData.surname, bookingData.flowId)
                .then(handleSuccess, handleError)
                .finally(ModalService.isCloseWaiting);
        };

        vm.close = function () {
            vm.model.name = '';
            $uibModalInstance.dismiss('cancel');
        };

        function handleSuccess (data) {
            localStorageService.set('bookingInfo', data);
            localStorageService.set('flowId', data.checkinId);

            CkiDatalayerUtilsService.updatePnr();

            SearchFlightsPassengersService.deepLinkChecked(data);
            vm.close();
        }

        function handleError (error) {
            vm.errorMessage = error.message;
        }

        function getBookingData () {
            return {
                surname: object?.surname || '',
                flowId: object?.flowId || ''
            };
        }
    }
})();
