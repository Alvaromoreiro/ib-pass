(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtChangeflightService', PmtChangeflightService);

    PmtChangeflightService.$inject = ['$q', 'PmtChangeFlightOrderProxy', 'PmtConstants', '$timeout', 'PmtHttpErrorFilter', 'localStorageService', 'pmtEndPointsFilterService', 'PmtDatalayerConstants', '$rootScope'];
    function PmtChangeflightService ($q, PmtChangeFlightOrderProxy, PmtConstants, $timeout, PmtHttpErrorFilter, localStorageService, pmtEndPointsFilterService, PmtDatalayerConstants, $rootScope) {

        const self = this;
        self.changeFlightOrder = changeFlightOrder;
        self.defer;
        self.numberAttemps = 0;
        self.waitingTime = PmtConstants.SERVICE_WAITING_TIMES.ISSUE_INFO_WAITING_TIME_INTERVAL;

        ////////////////

        /**
         * Realise the payment of an order. If there was and error in the http call,
         * this method treats these http error code and returns the object to show an error in the view.
         * @param {Object} requestData - parameters that are passed to the service request
         * @param {boolean} isRecall - param to determinate the kind of the call
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function changeFlightOrder (serviceURI, requestData, orderId, isRecall, requiredAdditionalFields) {
            const redirectionInfo = localStorageService.get('redirectionPaymentCallback');
            const paymentStatus = redirectionInfo ? redirectionInfo.paymentStatus : null,
                isRedirectionComponent =  redirectionInfo ? redirectionInfo.paymentTypeCallback === 'REDIRECT' || redirectionInfo.syncPayment : false,
                statusWaitingTime = PmtConstants.SERVICE_WAITING_TIMES.ISSUE_INFO_OK_WAITING_TIME;
            self.defer = self.defer || $q.defer();
            const endpoint = pmtEndPointsFilterService.getEndPointIssue(serviceURI, paymentStatus, requestData, isRecall);
            if ((paymentStatus && !isRedirectionComponent) || isRecall === '3ds2OneSite') {
                PmtChangeFlightOrderProxy.getchangeFligthInfoBy3dsPay(endpoint).then(changeFligthInfoSuccess, changeFlightOrderError);
            } else {
                PmtChangeFlightOrderProxy.changeFlightOrder(endpoint, requestData, isRecall).then(changeFlightOrderSuccess, changeFlightOrderError);
            }

            return self.defer.promise;

            function changeFligthInfoSuccess (data) {
                removeNothingToPay();
                if (data.code === 204 && self.waitingTime < statusWaitingTime) {
                    $timeout(() => {
                        changeFlightOrder(serviceURI, requestData, orderId, false);
                        self.waitingTime += self.waitingTime;
                    }, self.waitingTime);
                } else if (data.code === 204 && self.waitingTime >= statusWaitingTime) {
                    data.paymentStatus = paymentStatus;
                    data.errorCode = data.code;
                    changeFlightOrderError(data);
                } else {
                    localStorageService.remove('redirectionPaymentCallback');
                    self.defer.resolve(data);
                    self.defer = null;
                    self.numberAttemps = 0;
                }
            }

            function changeFlightOrderError (error) {
                const errorObject = {
                    actualAttemps: self.numberAttemps,
                    paymentMethodCallback: changeFlightOrderCallback,
                    response: error,
                    url: endpoint
                };
                const errorInternalCode = error.data && error.data.error ? error.data.error.code : error.data && error.data.errors ? error.data.errors[0].code : null;
                if (error.errorCode === 417) {
                    localStorageService.set('issueOrderInfo', error.data);
                }
                if (error.errorCode === 449 || (error.errorCode === 412 && errorInternalCode === 'PMT_PPM_8014')) {
                    localStorageService.set('errorIssueService', { data: error.data, otherPayment: false });
                }
                if(error.errorCode !== 451) {
                    $rootScope.$broadcast('rejectAfopPaypal', error);
                }
                if (error && error.errorCode !== 451 && error.data) {
                    setQuadrigrmas(error);
                }
                returnProcessedError(PmtHttpErrorFilter.errorHandlerFactory(error.errorCode, errorObject));
            }

            /**
            * Asingn id at Modal according error code return by services Issue.
            * PAYMENT_DENIED("PMT_PPM_8009") - CREDIT_CARD_REJECT("PMT_PPM_8015") - ERROR_PCC("PMT_PPM_8014").
            * @param {Object} error - is a error Object with all information about error.
            * @returns this functions not return param, but set at localStorage variable info about quadrigam.
            * */
            function setQuadrigrmas (error) {
                let x, quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;
                if (!error.data.errors && error.data.error) {
                    error.data.errors = [error.data.error];
                }
                if (error.data.errors) {
                    for (x = 0; x < error.data.errors.length; x++) {
                        if (error.data.errors[x].code === 'PMT_PPM_8009') {
                            quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.PAYMENT_ERRORS.MANAGEMYBOOKING_VOLUNTARY_CHANGES.CREDITCARD_DENIED;
                        } else if (error.data.errors[x].code === 'PMT_PPM_8015') {
                            quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.PAYMENT_ERRORS.MANAGEMYBOOKING_VOLUNTARY_CHANGES.CREDITCARD_REJECT;
                        } else if (error.data.errors[x].code === 'PMT_PPM_8014') {
                            quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.PAYMENT_ERRORS.MANAGEMYBOOKING_VOLUNTARY_CHANGES.CREDITCARD_PCC;
                        }
                    }
                }
                localStorageService.set('errorModalId', quadrigamType);
            }

            function changeFlightOrderCallback () {
                self.numberAttemps++;
                changeFlightOrder(serviceURI, requestData, orderId, isRecall);
            }
        }

        /**
         * Resolve the service promise with data received from the service and initialize service attributes
         * @param {Object} data - the data received from the service
         */
        function changeFlightOrderSuccess (data) {
            removeNothingToPay();
            self.defer.resolve(data);
            self.defer = null;
            self.numberAttemps = 0;
        }

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

        /*
         *This function delete the localStorageService variable noPaymentVCFlow when the payment is success
         */
        function removeNothingToPay () {
            if (localStorageService.get('noPaymentVCFlow')) {
                localStorageService.remove('noPaymentVCFlow');
            }
        }

    }
})();