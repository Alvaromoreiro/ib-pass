(function () {
    'use strict';

    angular
        .module('ib-checkin-services-module')
        .factory('CheckAncillariesService', CheckAncillariesService);

    CheckAncillariesService.$inject = ['CommonsAncillariesService', 'localStorageService', '$q', 'CheckinAppConstants'];
    function CheckAncillariesService (CommonsAncillariesService, localStorageService, $q, CheckinAppConstants) {
        var service = {
            checkAncillaries: checkAncillaries
        };

        return service;

        ////////////////
        function checkAncillaries () {
            const deferred = $q.defer(), pnr = localStorageService.get('PNR');
            CommonsAncillariesService.getAncillaries(undefined, pnr).then(getAncillariesSuccess, getAncillariesError);
            return deferred.promise;

            function getAncillariesSuccess (ancillariesInfo) {
                let ancillaries = false, baggageAvailable, seatsAvailable = false, insurance, i, j, urlbob = false, preorder, priority;
                const segmentsAvailable = [], isEarlyCKI = localStorageService.get('isFirstEarlyMap');

                for (i = 0; i < ancillariesInfo.ancillaries.length; i++) {
                    if (ancillariesInfo.ancillaries[i].type === CheckinAppConstants.ANCILLARIES_TYPES.BAGGAGE) {
                        baggageAvailable = ancillariesInfo.ancillaries[i].status.code === CheckinAppConstants.GENERAL_STATUS.AVAILABLE;
                    } else if (ancillariesInfo.ancillaries[i].type === CheckinAppConstants.ANCILLARIES_TYPES.SEAT) {
                        seatsAvailable = ancillariesInfo.ancillaries[i].status.code === CheckinAppConstants.GENERAL_STATUS.AVAILABLE;
                        for (j = 0; j < ancillariesInfo.ancillaries[i].segments.length; j++) {
                            segmentsAvailable[j] = ancillariesInfo.ancillaries[i].segments[j].id;
                        }
                        localStorageService.set('ancillariesAvailableSegments', segmentsAvailable);
                    } else if (ancillariesInfo.ancillaries[i].type === CheckinAppConstants.ANCILLARIES_TYPES.INSURANCE) {
                        insurance = ancillariesInfo.ancillaries[i].status.code === CheckinAppConstants.GENERAL_STATUS.AVAILABLE;
                    } else if (ancillariesInfo.ancillaries[i].type === CheckinAppConstants.ANCILLARIES_TYPES.BOB) {
                        urlbob = ancillariesInfo.ancillaries[i].externalUrl;
                    } else if (ancillariesInfo.ancillaries[i].type === CheckinAppConstants.ANCILLARIES_TYPES.PREORDER) {
                        preorder = ancillariesInfo.ancillaries[i].status.code === CheckinAppConstants.GENERAL_STATUS.AVAILABLE;
                    } else if (ancillariesInfo.ancillaries[i].type === CheckinAppConstants.ANCILLARIES_TYPES.PRIORITY_BOARDING) {
                        priority = ancillariesInfo.ancillaries[i].status.code === CheckinAppConstants.GENERAL_STATUS.AVAILABLE;
                    }
                }
                if (seatsAvailable || baggageAvailable || insurance || preorder || priority) {
                    ancillaries = true;
                    localStorageService.set('ancillariesInfo', ancillariesInfo);
                }
                if (isEarlyCKI && !seatsAvailable) {
                    ancillaries = false;
                }
                localStorageService.set('ancillariesBob', urlbob);
                deferred.resolve({ancillaries, seatsAvailable});
            }

            function getAncillariesError (error) {
                deferred.reject(error);
            }
        }
    }
})();
