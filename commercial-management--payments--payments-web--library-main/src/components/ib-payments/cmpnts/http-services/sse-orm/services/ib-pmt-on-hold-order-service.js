(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtOnHoldOrderService', PmtOnHoldOrderService);

    PmtOnHoldOrderService.$inject = ['$q', 'PmtOnHoldOrderProxy', 'PmtConstants', '$timeout', 'PmtHttpErrorFilter', 'localStorageService', 'pmtEndPointsFilterService', '$rootScope'];
    function PmtOnHoldOrderService ($q, PmtOnHoldOrderProxy, PmtConstants, $timeout, PmtHttpErrorFilter, localStorageService, pmtEndPointsFilterService, $rootScope) {

        const self = this;
        self.onHoldOrder = onHoldOrder;
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
        function onHoldOrder (serviceURI, requestData, orderId, isRecall) {
            const redirectionInfo = localStorageService.get('redirectionPaymentCallback');
            const paymentStatus = redirectionInfo ? redirectionInfo.paymentStatus : null,
                isRedirectionComponent =  redirectionInfo ? redirectionInfo.paymentTypeCallback === 'REDIRECT' || redirectionInfo.syncPayment : false,
                statusWaitingTime = PmtConstants.SERVICE_WAITING_TIMES.ISSUE_INFO_OK_WAITING_TIME;
            self.defer = self.defer || $q.defer();
            const endpoint = pmtEndPointsFilterService.getEndPointIssue(serviceURI, paymentStatus, requestData, isRecall);
            if ((paymentStatus && !isRedirectionComponent) || isRecall === '3ds2OneSite') {
                PmtOnHoldOrderProxy.onHoldInfoBy3dsPay(endpoint, requestData, isRecall).then(onHoldInfoBy3dsPaySuccess, onHoldOrderError);
            } else {
                PmtOnHoldOrderProxy.onHoldOrder(endpoint, requestData, isRecall).then(onHoldOrderSuccess, onHoldOrderError);
            }
            return self.defer.promise;
            function onHoldInfoBy3dsPaySuccess (data) {
                if (data.code === 204 && self.waitingTime < statusWaitingTime) {
                    $timeout(() => {
                        onHoldOrder(serviceURI, requestData, orderId, false);
                        self.waitingTime += self.waitingTime;
                    }, self.waitingTime);
                } else if (data.code === 204 && self.waitingTime >= statusWaitingTime) {
                    data.paymentStatus = paymentStatus;
                    data.errorCode = data.code;
                    onHoldOrderError(data);
                } else {
                    self.defer.resolve(data);
                    self.defer = null;
                    self.numberAttemps = 0;
                }
            }
            function onHoldOrderError (error) {
                const errorObject = {
                    actualAttemps: self.numberAttemps,
                    paymentMethodCallback: onHoldOrderCallback,
                    response: error,
                    url: endpoint
                };
                if (error.errorCode === 417) {
                    localStorageService.set('onHoldOrderInfo', error.data);
                }
                if(error.errorCode !== 451) {
                    $rootScope.$broadcast('rejectAfopPaypal', error);
                }
                if (error.errorCode === 449 || (error.errorCode === 412 && error.errorInternalCode === 'PMT_PPM_8014')) {
                    localStorageService.set('errorIssueService', { data: error.data, otherPayment: false });
                }
                returnProcessedError(PmtHttpErrorFilter.errorHandlerFactory(error.errorCode, errorObject));
            }
            function onHoldOrderCallback () {
                self.numberAttemps++;
                onHoldOrder(serviceURI, requestData, orderId, isRecall);
            }
        }
        /**
         * Resolve the service promise with data received from the service and initialize service attributes
         * @param {Object} data - the data received from the service
         */
        function onHoldOrderSuccess (data) {
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