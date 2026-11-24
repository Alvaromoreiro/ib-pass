(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtIssueOrderService', PmtIssueOrderService);

    PmtIssueOrderService.$inject = ['$q', 'PmtIssueOrderProxy', 'PmtConstants', '$timeout', 'PmtHttpErrorFilter', 'localStorageService', 'pmtEndPointsFilterService', 'PmtAncillariesProxy', 'PmtDatalayerConstants', '$rootScope'];
    function PmtIssueOrderService ($q, PmtIssueOrderProxy, PmtConstants, $timeout, PmtHttpErrorFilter, localStorageService, pmtEndPointsFilterService, PmtAncillariesProxy, PmtDatalayerConstants, $rootScope) {

        const self = this;
        self.issueOrder = issueOrder;
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
        function issueOrder (serviceURI, requestData, orderId, isRecall, requiredAdditionalFields) {
            const redirectionInfo = localStorageService.get('redirectionPaymentCallback');
            const paymentStatus = redirectionInfo ? redirectionInfo.paymentStatus : null,
                isRedirectionComponent =  redirectionInfo ? redirectionInfo.paymentTypeCallback === 'REDIRECT' || redirectionInfo.syncPayment : false,
                statusWaitingTime = PmtConstants.SERVICE_WAITING_TIMES.ISSUE_INFO_OK_WAITING_TIME, flowApp = localStorageService.get('flowApp');
            let requestDataWithAdditionalFields, passengersContactData, selectedPaymentInfo;
            self.defer = self.defer || $q.defer();
            const endpoint = pmtEndPointsFilterService.getEndPointIssue(serviceURI, paymentStatus, requestData, isRecall);
            if ((paymentStatus && !isRedirectionComponent) || isRecall === '3ds2OneSite') {
                PmtIssueOrderProxy.getIssueInfoBy3dsPay(endpoint).then(issueInfoSuccess, issueOrderError);

            } else if (flowApp === PmtConstants.APP_TYPES.CHECKIN || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES) {
                if (requiredAdditionalFields !== null && requiredAdditionalFields.info.EXTERNAL_CREDITCARD) {
                    passengersContactData = localStorageService.get('passengersContactData') ? localStorageService.get('passengersContactData') : localStorageService.get('passengers');
                    selectedPaymentInfo = localStorageService.get('selectedPaymentInfo');
                    requestDataWithAdditionalFields = {
                        flowId: requestData.flowId,
                        paymentId: requestData.paymentId,
                        paymentMethod: {
                            type: PmtConstants.PAYMENT_TYPES.EXTERNAL_CREDITCARD,
                            cardTypeId: requestData.paymentMethod.cardTypeId,
                            payer: {
                                personalInfo: {
                                    name: requiredAdditionalFields.info.EXTERNAL_CREDITCARD.PAYER.requiredFields.NAME.name,
                                    surname: requiredAdditionalFields.info.EXTERNAL_CREDITCARD.PAYER.requiredFields.SURNAME.surname
                                },
                                contactInfo: {
                                    email: passengersContactData[0].email ? passengersContactData[0].email : passengersContactData[0].contactInfo && passengersContactData[0].contactInfo.email ? passengersContactData[0].contactInfo.email : selectedPaymentInfo.email,
                                    phone: passengersContactData[0].phone ? passengersContactData[0].phone : passengersContactData[0].contactInfo && passengersContactData[0].contactInfo.phone ? passengersContactData[0].contactInfo.phone : selectedPaymentInfo.phone
                                }
                            }
                        }
                    };
                    requestData.paymentMethod.associatedDiscount ? requestDataWithAdditionalFields.paymentMethod.associatedDiscount = requestData.paymentMethod.associatedDiscount : angular.noop();
                    PmtAncillariesProxy.updatePaymentsInfo(endpoint, requestData.flowId, requestDataWithAdditionalFields, isRecall).then(issueOrderSuccess, issueOrderError);
                } else {
                    PmtAncillariesProxy.updatePaymentsInfo(endpoint, requestData.flowId, requestData, isRecall).then(issueOrderSuccess, issueOrderError);
                }
            } else {
                PmtIssueOrderProxy.issueOrder(endpoint, requestData, isRecall).then(issueOrderSuccess, issueOrderError);
            }

            return self.defer.promise;

            function issueInfoSuccess (data) {
                if (data.code === 204 && self.waitingTime < statusWaitingTime) {
                    $timeout(() => {
                        issueOrder(serviceURI, requestData, orderId, false);
                        self.waitingTime += self.waitingTime;
                    }, self.waitingTime);
                } else if (data.code === 204 && self.waitingTime >= statusWaitingTime) {
                    data.paymentStatus = paymentStatus;
                    data.errorCode = data.code;
                    issueOrderError(data);
                } else {
                    self.defer.resolve(data);
                    self.defer = null;
                    self.numberAttemps = 0;
                }
            }

            function issueOrderError (error) {
                const errorObject = {
                    actualAttemps: self.numberAttemps,
                    paymentMethodCallback: issueOrderCallback,
                    response: error,
                    url: endpoint
                };
                const errorInternalCode = error.data && error.data.error ? error.data.error.code : error.data && error.data.errors ? error.data.errors[0].code : null;
                if (error.errorCode === 417) {
                    localStorageService.set('issueOrderInfo', error.data);
                }
                if(error.errorCode !== 451) {
                    $rootScope.$broadcast('rejectAfopPaypal', error);
                }
                if (error.errorCode === 449 || (error.errorCode === 412 && PmtConstants.INTERNAL_ERRORS_CODES_TO_412.indexOf(errorInternalCode) !== -1)) {
                    localStorageService.set('errorIssueService', { data: error.data, otherPayment: false });
                }
                if (error && error.errorCode !== 451 && error.data) {
                    setQuadrigrmas(error);
                }
                returnProcessedError(PmtHttpErrorFilter.errorHandlerFactory(error.errorCode, errorObject));
            }
            function issueOrderCallback () {
                self.numberAttemps++;
                issueOrder(serviceURI, requestData, orderId, isRecall, requiredAdditionalFields);
            }
        }

        /**
         * Resolve the service promise with data received from the service and initialize service attributes
         * @param {Object} data - the data received from the service
         */
        function issueOrderSuccess (data) {
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

        /**
        * Asingn id at Modal according error code return by services Issue.
        * PAYMENT_DENIED("PMT_PPM_8009") - CREDIT_CARD_REJECT("PMT_PPM_8015") - ERROR_PCC("PMT_PPM_8014").
        * @param {Object} error - is a error Object with all information about error.
        * @returns this functions not return param, but set at localStorage variable info about quadrigam.
        * */
        function setQuadrigrmas (error) {
            let x;
            let quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;
            const flowApp = localStorageService.get('flowApp') ? localStorageService.get('flowApp') : '';
            if (!error.data.errors && error.data.error) {
                error.data.errors = [error.data.error];
            }
            if (error.data.errors) {
                for (x = 0; x < error.data.errors.length; x++) {
                    if (error.data.errors[x].code === 'PMT_PPM_8009') {
                        switch (flowApp) {

                                case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES:
                                    quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.PAYMENT_ERRORS.MANAGEMYBOOKING_ANCILLARIES.CREDITCARD_DENIED;
                                    break;

                                case PmtConstants.APP_TYPES.BOOKING:
                                case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD:
                                    quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.PAYMENT_ERRORS.BOOKING.CREDITCARD_DENIED;
                                    break;

                                default:
                                    quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;
                                    break;
                        }
                    } else if (error.data.errors[x].code === 'PMT_PPM_8015') {
                        switch (flowApp) {

                                case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES:
                                    quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.PAYMENT_ERRORS.MANAGEMYBOOKING_ANCILLARIES.CREDITCARD_REJECT;
                                    break;

                                case PmtConstants.APP_TYPES.BOOKING:
                                case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD:
                                    quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.PAYMENT_ERRORS.BOOKING.CREDITCARD_REJECT;
                                    break;

                                default:
                                    quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;
                                    break;
                        }
                    } else if (error.data.errors[x].code === 'PMT_PPM_8014') {
                        switch (flowApp) {
                                case PmtConstants.APP_TYPES.BOOKING:
                                case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD:
                                    quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.PAYMENT_ERRORS.BOOKING.CREDITCARD_PCC;
                                    break;

                                default:
                                    quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;
                                    break;
                        }
                    } else if (error.data.errors[x].code === 'PMT_PPM_8031' || error.data.errors[x].code === 'PMT_PPM_8032') {
                        switch (flowApp) {
                                case PmtConstants.APP_TYPES.BOOKING:
                                case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD:
                                    quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.PAYMENT_ERRORS.BOOKING.BIN_VALIDATION_ERROR;
                                    break;
                                default:
                                    quadrigamType = PmtDatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;
                                    break;

                        }
                    }
                }
            }
            localStorageService.set('errorModalId', quadrigamType);
        }


    }
})();