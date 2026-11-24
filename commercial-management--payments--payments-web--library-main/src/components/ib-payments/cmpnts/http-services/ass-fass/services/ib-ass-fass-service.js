(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtAssFassAncillariesService', PmtAssFassAncillariesService);

    PmtAssFassAncillariesService.$inject = ['PmtAncillariesProxy', '$q', 'PmtConstants', 'localStorageService', '$timeout', '$filter', 'PmtHttpErrorFilter'];
    function PmtAssFassAncillariesService (PmtAncillariesProxy, $q, PmtConstants, localStorageService, $timeout, $filter, PmtHttpErrorFilter) {

        const self = this;
        self.getAncillaries = getAncillaries;
        self.updateAncillaries = updateAncillaries;
        self.getInsurance = getInsurance;
        self.getConfirmationAncillaries = getConfirmationAncillaries;
        self.updatePayments = updatePayments;
        self.getVoucherValidation = getVoucherValidation;
        self.deleteVoucher = deleteVoucher;
        self.deleteAssistCard = deleteAssistCard;
        self.counterAttemps = 0;
        self.deferred;
        self.reCallService = false;

        ////////////////

        function getAncillaries () {
            const checkinId = localStorageService.get('flowId');
            let endpoint;
            if (checkinId !== null) {
                endpoint = PmtConstants.ENDPOINTS.DEFAULT.ancillariesURI;
                if (self.reCallService || !self.deferred) {
                    self.deferred = self.deferred || $q.defer();
                    PmtAncillariesProxy.getAncillaries(endpoint, checkinId).then(getAncillariesSuccess, getAncillariesError);
                }
            } else {
                self.deferred = self.deferred || $q.defer();
                $timeout( () => {
                    self.deferred.reject({ errorCode: 'IB_00002', message: $filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
                    self.deferred = null;
                });
            }
            return self.deferred.promise;

            function getAncillariesSuccess (data) {
                self.deferred.resolve(data);
                self.deferred = null;
            }

            function getAncillariesError (error) {
                const response = { errorCode: error.errorCode, message: '', internalErrorCode: '' };

                if (error.errorCode === 408) {
                    if (self.counterAttemps < PmtConstants.numAttemps) {
                        self.counterAttemps++;
                        $timeout( () => {
                            self.reCallService = true;
                            self.getAncillaries();
                        }, PmtConstants.timeWait);
                    } else {
                        response.message = error.data && error.data.errors ?
                            error.data.errors[0].reason : $filter('translate')('REST_SERVICE_ERROR_GENERAL');
                        response.internalErrorCode = error.data && error.data.errors ? error.data.errors[0].code : '';
                        self.deferred.reject(response);
                        self.deferred = null;
                    }
                } else {
                    response.message = error.data && error.data.errors ?
                        error.data.errors[0].reason : $filter('translate')('REST_SERVICE_ERROR_GENERAL');
                    response.internalErrorCode = error.data && error.data.errors ? error.data.errors[0].code : '';
                    self.deferred.reject(response);
                    self.deferred = null;
                }
            }
        }

        function updateAncillaries (ancillariesInfo) {
            const checkinId = localStorageService.get('flowId');
            let endpoint;
            if (checkinId !== null) {
                endpoint = PmtConstants.ENDPOINTS.DEFAULT.ancillariesURI;
                self.deferred = self.deferred || $q.defer();
                PmtAncillariesProxy.updateAncillaries(endpoint, checkinId, ancillariesInfo).then(updateAncillariesSuccess, updateAncillariesError);
            } else {
                self.deferred = self.deferred || $q.defer();
                $timeout(() => {
                    self.deferred.reject({ errorCode: 'IB_00002', message: $filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
                    self.deferred = null;
                });
            }

            return self.deferred.promise;

            function updateAncillariesSuccess (data) {
                self.deferred.resolve(data);
                self.deferred = null;
            }

            function updateAncillariesError (error) {
                const response = { errorCode: error.errorCode, message: '', internalErrorCode: '' };

                if (error.errorCode === 408) {
                    if (self.counterAttemps < PmtConstants.numAttemps) {
                        self.counterAttemps++;
                        $timeout(() => {
                            self.updateAncillaries(ancillariesInfo);
                        }, PmtConstants.timeWait);
                    } else {
                        response.message = error.data && error.data.errors ?
                            error.data.errors[0].reason : $filter('translate')('REST_SERVICE_ERROR_GENERAL');
                        response.internalErrorCode = error.data && error.data.errors ? error.data.errors[0].code : '';
                        self.deferred.reject(response);
                        self.deferred = null;
                    }
                } else {
                    response.message = error.data && error.data.errors ?
                        error.data.errors[0].reason : $filter('translate')('REST_SERVICE_ERROR_GENERAL');
                    response.internalErrorCode = error.data && error.data.errors ? error.data.errors[0].code : '';
                    self.deferred.reject(response);
                    self.deferred = null;
                }
            }
        }
        /**
         * Call service of ancillaries for get insurance ancillarrie
         * @param {String} country Country for retrieve insurance
         */
        function getInsurance (country) {
            const checkinId = localStorageService.get('flowId');
            let endpoint;
            if (checkinId !== null) {
                endpoint = PmtConstants.ENDPOINTS.DEFAULT.ancillariesURI;
                self.deferred = self.deferred || $q.defer();
                PmtAncillariesProxy.getInsurance(endpoint, checkinId, country).then(updateAncillariesSuccess, updateAncillariesError);
            } else {
                self.deferred = self.deferred || $q.defer();
                $timeout(() => {
                    self.deferred.reject({ errorCode: 'IB_00002', message: $filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
                    self.deferred = null;
                });
            }

            return self.deferred.promise;

            function updateAncillariesSuccess (data) {
                self.deferred.resolve(data);
                self.deferred = null;
            }

            function updateAncillariesError (error) {
                const response = { errorCode: error.errorCode, message: '', internalErrorCode: '' };
                if (error.errorCode === 408) {
                    if (self.counterAttemps < PmtConstants.numAttemps) {
                        self.counterAttemps++;
                        $timeout(() => {
                            self.updateAncillaries(ancillariesInfo);
                        }, PmtConstants.timeWait);
                    } else {
                        response.message = error.data && error.data.errors ?
                            error.data.errors[0].reason : $filter('translate')('REST_SERVICE_ERROR_GENERAL');
                        response.internalErrorCode = error.data && error.data.errors ? error.data.errors[0].code : '';
                        self.deferred.reject(response);
                        self.deferred = null;
                    }
                } else {
                    response.message = error.data && error.data.errors ?
                        error.data.errors[0].reason : $filter('translate')('REST_SERVICE_ERROR_GENERAL');
                    response.internalErrorCode = error.data && error.data.errors ? error.data.errors[0].code : '';
                    self.deferred.reject(response);
                    self.deferred = null;
                }
            }
        }


        /**
         * Call service of ancillaries for get insurance ancillarrie
         * @param {String} country Country for retrieve vechile rental offers
         */
        function getConfirmationAncillaries () {
            const isShuttleFlow = localStorageService.get('isShuttleFlow');
            const  flowApp = localStorageService.get('flowApp');
            let endpoint, checkinId = localStorageService.get('flowId'), defer = $q.defer();
            if (flowApp === 'BBKI' || flowApp === 'BBKIOH' || isShuttleFlow ) {
                checkinId = localStorageService.get('createOrderData').order.orderId;
            }
            if (checkinId !== null) {
                endpoint = PmtConstants.ENDPOINTS.DEFAULT.ancillariesNewURI;
                PmtAncillariesProxy.getConfirmationAncillaries(endpoint, checkinId).then(getConfirmationAncillariesSucces, getConfirmationAncillariesError);
            } else {
                $timeout(() => {
                    defer.reject({ errorCode: 'IB_00002', message: $filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
                    defer = null;
                });
            }

            return defer.promise;

            function getConfirmationAncillariesSucces (data) {
                defer.resolve(data);
                defer = null;
            }

            function getConfirmationAncillariesError (error) {
                const response = { errorCode: error.errorCode, message: '', internalErrorCode: '' };
                if (error.errorCode === 408) {
                    if (self.counterAttemps < PmtConstants.numAttemps) {
                        self.counterAttemps++;
                        $timeout(() => {
                            self.getConfirmationAncillaries();
                        }, PmtConstants.timeWait);
                    } else {
                        response.message = error.data && error.data.errors ?
                            error.data.errors[0].reason : $filter('translate')('REST_SERVICE_ERROR_GENERAL');
                        response.internalErrorCode = error.data && error.data.errors ? error.data.errors[0].code : '';
                        defer.reject(response);
                        defer = null;
                    }
                } else {
                    response.message = error.data && error.data.errors ?
                        error.data.errors[0].reason : $filter('translate')('REST_SERVICE_ERROR_GENERAL');
                    response.internalErrorCode = error.data && error.data.errors ? error.data.errors[0].code : '';
                    defer.reject(response);
                    defer = null;
                }
            }
        }

        function updatePayments (paymentData, paymentInfo, selectedLoggedCard) {
            const paymentTransformed = PmtAssFassTransformer.createPaymentsRequest(paymentData, paymentInfo, selectedLoggedCard);
            const checkinId = localStorageService.get('flowId');
            let endpoint;
            defer = $q.defer();

            if (checkinId !== null) {
                endpoint = PmtConstants.ENDPOINTS.DEFAULT.payAndIssueURI;
                PmtAncillariesProxy.updatePaymentsInfo(endpoint, checkinId, paymentTransformed).then(updatePaymentsSuccess, updatePaymentsError);
            } else {
                $timeout(() => {
                    defer.reject({ errorCode: 'IB_00002', message: $filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
                });
            }
            return defer.promise;

            function updatePaymentsSuccess (data) {
                defer.resolve(data);
            }

            function updatePaymentsError (error) {
                const response = { errorCode: error.errorCode, message: '', internalErrorCode: '' };
                if (error.errorCode === 408) {
                    if (self.counterAttemps < PmtConstants.numAttemps) {
                        self.counterAttemps++;
                        $timeout(() => {
                            self.updatePayments(paymentData, paymentInfo, selectedLoggedCard);
                        }, PmtConstants.timeWait);
                    } else {
                        response.message = error.data && error.data.errors ?
                            error.data.errors[0].reason : $filter('translate')('REST_SERVICE_ERROR_GENERAL');
                        response.internalErrorCode = error.data && error.data.errors ? error.data.errors[0].code : '';
                        defer.reject(response);
                    }
                } else {
                    response.message = error.data && error.data.errors ?
                        error.data.errors[0].reason : $filter('translate')('REST_SERVICE_ERROR_GENERAL');
                    response.internalErrorCode = error.data && error.data.errors ? error.data.errors[0].code : '';
                    defer.reject(response);
                }
            }
        }


        function getVoucherValidation (voucherId, data) {
            const checkinId = localStorageService.get('flowId');
            let endpoint;
            if (checkinId !== null) {
                endpoint = PmtConstants.ENDPOINTS.DEFAULT.ancillariesNewURI;
                if (self.reCallService || !self.deferred) {
                    self.deferred = self.deferred || $q.defer();
                    PmtAncillariesProxy.getVoucherValidation(endpoint, checkinId, voucherId, data).then(getVoucherValidationSuccess, voucherCodeError);
                }
            } else {
                self.deferred = self.deferred || $q.defer();
                $timeout(() => {
                    self.deferred.reject({ errorCode: 'IB_00002', message: $filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
                    self.deferred = null;
                });
            }
            return self.deferred.promise;

            function getVoucherValidationSuccess (data) {
                self.deferred.resolve(data);
                self.deferred = null;
                self.counterAttemps = 0;
            }


            function voucherCodeError (error, callback) {
                const errorObject = {
                    actualAttemps: self.counterAttemps,
                    paymentMethodCallback: callback,
                    response: error,
                    url: endpoint + checkinId + '/voucher/validation/' + voucherId
                };
                returnProcessedError(PmtHttpErrorFilter.errorHandlerFactory(error.errorCode, errorObject));

                /**
                 * If there is a response error object as input, the function rejects the service promise and initialize service attributes
                 * @param {Object} responseError - the processed http response error. It could be undefined or null
                 */
                function returnProcessedError (responseError) {
                    if (responseError) {
                        self.deferred.reject(responseError);
                        self.deferred = null;
                        self.numberAttemps = 0;
                    }
                }
            }
        }


        function deleteVoucher (voucherId) {
            const checkinId = localStorageService.get('flowId');
            let endpoint;
            if (checkinId !== null) {
                endpoint = PmtConstants.ENDPOINTS.DEFAULT.ancillariesNewURI;
                if (self.reCallService || !self.deferred) {
                    self.deferred = self.deferred || $q.defer();
                    PmtAncillariesProxy.deleteVoucher(endpoint, checkinId, voucherId).then(deleteVoucherSuccess, deleteVoucherError);
                }
            } else {
                self.deferred = self.deferred || $q.defer();
                $timeout(() => {
                    self.deferred.reject({ errorCode: 'IB_00002', message: $filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
                    self.deferred = null;
                });
            }
            return self.deferred.promise;

            function deleteVoucherSuccess (data) {
                self.deferred.resolve(data);
                self.deferred = null;
            }

            function deleteVoucherError (error) {
                const response = { errorCode: error.errorCode, message: '', internalErrorCode: '' };

                if (error.errorCode === 408) {
                    if (self.counterAttemps < PmtConstants.numAttemps) {
                        self.counterAttemps++;
                        $timeout(() => {
                            self.reCallService = true;
                            self.getAncillaries();
                        }, PmtConstants.timeWait);
                    } else {
                        response.message = error.data && error.data.errors ?
                            error.data.errors[0].reason : $filter('translate')('REST_SERVICE_ERROR_GENERAL');
                        response.internalErrorCode = error.data && error.data.errors ? error.data.errors[0].code : '';
                        self.deferred.reject(response);
                        self.deferred = null;
                    }
                } else {
                    response.message = error.data && error.data.errors ?
                        error.data.errors[0].reason : $filter('translate')('REST_SERVICE_ERROR_GENERAL');
                    response.internalErrorCode = error.data && error.data.errors ? error.data.errors[0].code : '';
                    self.deferred.reject(response);
                    self.deferred = null;
                }
            }
        }

        function deleteAssistCard () {
            const flowId = localStorageService.get('flowId');
            let endpoint;
            if (flowId !== null) {
                endpoint = PmtConstants.ENDPOINTS.DEFAULT.deleteAssistCard;
                endpoint = endpoint.replace('{flowId}', flowId);
                if (self.reCallService || !self.deferred) {
                    self.deferred = self.deferred || $q.defer();
                    PmtAncillariesProxy.deleteAssistCard(endpoint).then(deleteAssistCardSuccess, deleteAssistCardError);
                }
            } else {
                self.deferred = self.deferred || $q.defer();
                $timeout(() => {
                    self.deferred.reject({ errorCode: 'IB_00002', message: $filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
                    self.deferred = null;
                });
            }
            return self.deferred.promise;

            function deleteAssistCardSuccess (data) {
                self.deferred.resolve(data);
                self.deferred = null;
            }

            function deleteAssistCardError (error) {
                const response = { errorCode: error.errorCode, message: '', internalErrorCode: '' };

                if (error.errorCode === 408) {
                    if (self.counterAttemps < PmtConstants.numAttemps) {
                        self.counterAttemps++;
                        $timeout(() => {
                            self.reCallService = true;
                            self.getAncillaries();
                        }, PmtConstants.timeWait);
                    } else {
                        response.message = error.data && error.data.errors ?
                            error.data.errors[0].reason : $filter('translate')('REST_SERVICE_ERROR_GENERAL');
                        response.internalErrorCode = error.data && error.data.errors ? error.data.errors[0].code : '';
                        self.deferred.reject(response);
                        self.deferred = null;
                    }
                } else {
                    response.message = error.data && error.data.errors ?
                        error.data.errors[0].reason : $filter('translate')('REST_SERVICE_ERROR_GENERAL');
                    response.internalErrorCode = error.data && error.data.errors ? error.data.errors[0].code : '';
                    self.deferred.reject(response);
                    self.deferred = null;
                }
            }
        }
    }
})();