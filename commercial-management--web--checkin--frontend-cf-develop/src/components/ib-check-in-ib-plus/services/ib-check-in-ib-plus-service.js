(function () {
    'use strict';

    angular
        .module('ib-checkin-ib-plus')
        .service('CheckInIbPlusService', CheckInIbPlusService);

    CheckInIbPlusService.$inject = ['$q', 'UserLoggedBookingTransformer', 'GetCitiesImagesService', 'UserLoggedBookingService', 'ModalService'];
    function CheckInIbPlusService($q, UserLoggedBookingTransformer, GetCitiesImagesService, UserLoggedBookingService, ModalService) {

        var self = this;
        self.userLoggedBookingInfo;
        self.citiesImagesList;
        self.searchUserLoggedBookings = searchUserLoggedBookings;

        ////////////////

        function searchUserLoggedBookings() {
            var deferred = $q.defer();
            GetCitiesImagesService.getCitiesImages().then(function (data) {
                self.citiesImagesList = data;
                UserLoggedBookingService.getUserLoggedBookingInformation()
                    .then(getUserLoggedBookingInformationSuccess, getUserLoggedBookingInformationError)['catch'](getUserLoggedBookingInformationError);
            });

            return deferred.promise;

            function getUserLoggedBookingInformationSuccess(loggedData) {
                var viewData;
                self.userLoggedBookingInfo = angular.copy(loggedData);
                viewData = UserLoggedBookingTransformer.transformUserBookingInfo(self.userLoggedBookingInfo, self.citiesImagesList);
                ModalService.isNotWaiting();
                deferred.resolve({ 'data': viewData, 'isError': false });
            }

            function getUserLoggedBookingInformationError(error) {
                ModalService.isNotWaiting();
                if (error.showError) {
                    ModalService.setErrorMessage(error.message);
                    ModalService.setErrorCode(error.code);
                    ModalService.isError(error);
                }
                deferred.resolve({ 'data': [], 'isError': error.showError || false});
            }
        }
    }
})();