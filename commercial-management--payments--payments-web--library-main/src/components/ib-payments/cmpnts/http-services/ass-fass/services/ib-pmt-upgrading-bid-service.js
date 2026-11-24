(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtUpgradingBidService', PmtUpgradingBidService);

    PmtUpgradingBidService.$inject = ['$q', 'PmtUpgradingBidProxy', 'PmtConstants', '$timeout', 'PmtHttpErrorFilter', 'localStorageService', 'pmtEndPointsFilterService', 'PmtDatalayerConstants', '$rootScope', 'CommonsAncillariesService'];
    function PmtUpgradingBidService ($q, PmtUpgradingBidProxy, PmtConstants, $timeout, PmtHttpErrorFilter, localStorageService, pmtEndPointsFilterService, PmtDatalayerConstants, $rootScope, CommonsAncillariesService) {

        const self = this;
        self.upgradingBidOrder = upgradingBidOrder;
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
        function upgradingBidOrder (serviceURI, requestData, orderId, isRecall) {
            const redirectionInfo = localStorageService.get('redirectionPaymentCallback');
            const paymentStatus = redirectionInfo ? redirectionInfo.paymentStatus : null,
                isRedirectionComponent =  redirectionInfo ? redirectionInfo.paymentTypeCallback === 'REDIRECT' || redirectionInfo.syncPayment : false,
                statusWaitingTime = PmtConstants.SERVICE_WAITING_TIMES.ISSUE_INFO_OK_WAITING_TIME;
            self.defer = self.defer || $q.defer();
            const endpoint = pmtEndPointsFilterService.getEndPointIssue(serviceURI, paymentStatus, requestData, isRecall);
            if ((paymentStatus && !isRedirectionComponent) || isRecall === '3ds2OneSite') {
                PmtUpgradingBidProxy.getUpgradingBidInfoBy3dsPay(endpoint).then(upgradingBidInfoSuccess, upgradingBidOrderError);
            } else {
                PmtUpgradingBidProxy.upgradingBidOrder(endpoint, requestData, isRecall).then(upgradingBidOrderSuccess, upgradingBidOrderError);
            }
            return self.defer.promise;

            function upgradingBidInfoSuccess (data) {
                if (data.code === 204 && self.waitingTime < statusWaitingTime) {
                    $timeout(() => {
                        upgradingBidOrder(serviceURI, requestData, orderId, false);
                        self.waitingTime += self.waitingTime;
                    }, self.waitingTime);
                } else if (data.code === 204 && self.waitingTime >= statusWaitingTime) {
                    data.paymentStatus = paymentStatus;
                    data.errorCode = data.code;
                    upgradingBidOrderError(data);
                } else {
                    if(localStorageService.get('UPG_BIDS_AVIOS')) {
                        localStorageService.remove('headerModel');
                        CommonsAncillariesService.deleteAllAncillaries().then((deleteResponse) => {
                            if (deleteResponse.failedToDelete && deleteResponse.failedToDelete.length > 0) {
                                const errorDelete = {
                                    message: deleteResponse.failedToDelete[0].error.description,
                                    internalErrorCode: deleteResponse.failedToDelete[0].error.code
                                };
                                localStorageService.set('errorDeleteAllUPGAVIOS', errorDelete);
                                continueFlowUpgradingBids(data);
                            }
                        }, (error) => {
                            continueFlowUpgradingBids(data);
                        });
                    } else {
                        continueFlowUpgradingBids(data);
                    }
                }
            }

            function continueFlowUpgradingBids (data) {
                localStorageService.set('RechargeBookingInfo', true);
                localStorageService.remove('upgBidPutMade');
                self.defer.resolve(data);
                self.defer = null;
                self.numberAttemps = 0;
            }

            function upgradingBidOrderError (error) {
                const errorObject = {
                    actualAttemps: self.numberAttemps,
                    paymentMethodCallback: upgradingBidOrderCallback,
                    response: error,
                    url: endpoint
                };
                const errorInternalCode = error.data && error.data.error ? error.data.error.code : error.data && error.data.errors ? error.data.errors[0].code : null;
                localStorageService.set('RechargeBookingInfo', true);
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
                returnProcessedError(PmtHttpErrorFilter.errorHandlerFactory(error.errorCode, errorObject, true));
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

            function upgradingBidOrderCallback () {
                self.numberAttemps++;
                upgradingBidOrder(serviceURI, requestData, orderId, isRecall);
            }
        }

        /**
         * Resolve the service promise with data received from the service and initialize service attributes
         * @param {Object} data - the data received from the service
         */
        function upgradingBidOrderSuccess (data) {
            localStorageService.remove('upgBidPutMade');
            if (data.data && data.data.issuedItems.length > 0) {
                if (data.data.issuedItems[0].type !== 'UPGRADING_BID') {
                    localStorageService.set('RechargeBookingInfo', true);
                    localStorageService.remove('headerModel');
                }
            }
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

    }
})();
