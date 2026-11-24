(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('CheckVoucherCodeService', CheckVoucherCodeService);

    CheckVoucherCodeService.$inject = ['$q', 'CheckVoucherCodeProxy', 'PmtConstants', 'PmtHttpErrorFilter', 'IbCoupletPmtVoucherOtpModalService'];
    function CheckVoucherCodeService ($q, CheckVoucherCodeProxy, PmtConstants, PmtHttpErrorFilter, IbCoupletPmtVoucherOtpModalService) {

        const self = this;
        self.checkVoucherCode = checkVoucherCode;
        self.deleteVoucherCode = deleteVoucherCode;
        self.defer;
        self.numberAttemps = 0;

        ////////////////

        /**
         * Realise the check of voucher code disscount. If there was and error in the http call,
         * this method treats these http error code and returns the object to show an error in the view.
         * @param {Object} requestData - parameters that are passed to the service request
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function checkVoucherCode (serviceURI, voucherCode, flowId) {
            let endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.checkVoucherCodeServiceURI;
            self.defer = self.defer || $q.defer();


            CheckVoucherCodeProxy.checkVoucherCode(endpoint + '/' + flowId + '/voucher/' + voucherCode)
                .then(bookingVoucherCodeSuccess, (error) => {
                    voucherCodeError(error, checkVoucherCodeCallback, endpoint + '/' + flowId + '/voucher/' + voucherCode);
                });

            return self.defer.promise;

            function checkVoucherCodeCallback () {
                self.numberAttemps++;
                checkVoucherCode(serviceURI, voucherCode, flowId);
            }

        }

        /**
        * Realise the check of voucher code disscount. If there was and error in the http call,
        * this method treats these http error code and returns the object to show an error in the view.
        * @param {Object} requestData - parameters that are passed to the service request
        * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
        *  When the promise rejects, it returns an object with the error data to show in the view
        */
        function deleteVoucherCode (serviceURI, voucherCode, flowId) {
            let endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.checkVoucherCodeServiceURI;
            self.defer = self.defer || $q.defer();

            CheckVoucherCodeProxy.deleteVoucherCode(endpoint + '/' + flowId + '/voucher/' + voucherCode)
                .then(bookingVoucherCodeSuccess, (error) => {
                    voucherCodeError(error, deleteVoucherCodeCallback, endpoint + '/' + flowId + '/voucher/' + voucherCode);
                });

            return self.defer.promise;

            function deleteVoucherCodeCallback () {
                self.numberAttemps++;
                deleteVoucherCode(serviceURI, voucherCode, flowId);
            }
        }

        /**
         * Resolve the service promise with data received from the service and initialize service attributes
         * @param {Object} data - the data received from the service
         */
        function bookingVoucherCodeSuccess (data) {
            self.defer.resolve(data?.data);
            self.defer = null;
            self.numberAttemps = 0;
        }

        function voucherCodeError (error, callback, endpoint) {
            const errorObject = {
                actualAttemps: self.numberAttemps,
                paymentMethodCallback: callback,
                response: error,
                url: endpoint
            };
            returnProcessedError(PmtHttpErrorFilter.errorHandlerFactory(error.errorCode, errorObject));

            /**
             * If there is a response error object as input, the function rejects the service promise and initialize service attributes
             * @param {Object} responseError - the processed http response error. It could be undefined or null
             */
            function returnProcessedError (responseError) {
                if (responseError) {
                    self.defer.reject(responseError);
                    self.defer = null;
                    self.numberAttemps = 0;
                }
            }
        }
    }
})();
