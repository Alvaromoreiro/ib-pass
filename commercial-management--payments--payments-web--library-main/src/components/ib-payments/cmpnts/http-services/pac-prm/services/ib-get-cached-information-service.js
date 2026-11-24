(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtGetCachedInformationService', PmtGetCachedInformationService);

    PmtGetCachedInformationService.$inject = ['$q', '$timeout', 'PmtConstants', 'localStorageService', 'PmtCachedInformationProxy', '$filter'];
    function PmtGetCachedInformationService($q, $timeout, PmtConstants, localStorageService, PmtCachedInformationProxy, $filter) {

        var self = this;
        self.getCachedInformation = getCachedInformation;
        self.counterAttemps = 0;
        self.deferred;
        self.reCallService = false;
        ////////////////
        function getCachedInformation() {
            var checkinId = localStorageService.get('flowId'), endpoint;
            if (checkinId != null) {
                if (self.reCallService || !self.deferred) {
                    self.deferred = self.deferred || $q.defer();
                    endpoint = PmtConstants.ENDPOINTS.DEFAULT.cachedInformationURI;
                    PmtCachedInformationProxy.getCachedInformation(endpoint, checkinId)
                        .then(getBookingInformationSuccess, getBookingInformationError)['catch'](getBookingInformationError);
                }
            } else {
                self.deferred = self.deferred || $q.defer();
                $timeout(function () {
                    self.deferred.reject({ 'errorCode': 'IB_00002', 'message': $filter('translate')('SESSION_EXPIRED'), 'internalErrorCode': 'IB_00002' });
                    self.deferred = null;
                });
            }
            return self.deferred.promise;

            function getBookingInformationSuccess(data) {
                self.deferred.resolve(data);
                self.deferred = null;
            }

            function getBookingInformationError(error) {
                var response = { errorCode: error.errorCode, message: '', internalErrorCode: '' };
                if (error.errorCode === 408) {
                    if (self.counterAttemps < PmtConstants.numAttemps) {
                        self.counterAttemps++;
                        $timeout(function () {
                            self.reCallService = true;
                            self.getCachedInformation();
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