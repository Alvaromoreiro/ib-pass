(function () {

    'use strict';

    angular.module('ib-checkin-biometric-boarding-module').service('BiometricErrorFilter', BiometricErrorFilter);

    BiometricErrorFilter.$inject = ['BiometricsHandlerProvider'];

    function BiometricErrorFilter(BiometricsHandlerProvider) {

        var vm = this;
        vm.errorHandler = createErrorHandler();
        vm.errorHandlerManagement = errorHandlerManagement;

        function errorHandlerManagement(error) {
            var handler;
            //404 PAC_UTIL44001
            handler = vm.errorHandler[error.errorCode + error.internalErrorCode] || { 'apply': BiometricsHandlerProvider.defaultErrorHandler };
            handler.apply(error);

        }

        function createErrorHandler() {

            return {
                //400
                '400CUST_BIO_9001': { 'apply': BiometricsHandlerProvider.userDataInconsistencyHandler},
                '400CUST_BIO_0002': { 'apply': BiometricsHandlerProvider.invalidDateFormatHandler},
                '400CUST_BIO_0004': { 'apply': BiometricsHandlerProvider.orderNotFoundHandler},
                '400CUST_BIO_0005': { 'apply': BiometricsHandlerProvider.flightNotFoundHandler},
                //404
                '404CUST_BIO_0011': { 'apply': BiometricsHandlerProvider.documentNotFoundHandler},
                '404BIO_AENA_0001': { 'apply': BiometricsHandlerProvider.biometricGenericModalHandler},
                //409
                '409CUST_BIO_9001': { 'apply': BiometricsHandlerProvider.infoAssociatedNotFoundPnrHandler},
                //412
                '412CUST_BIO_0003': { 'apply': BiometricsHandlerProvider.expirationDateErrorHandler},
                '412CUST_BIO_0001': { 'apply': BiometricsHandlerProvider.passengerDataIdConflictHandler}
            };

        }
    }

})();