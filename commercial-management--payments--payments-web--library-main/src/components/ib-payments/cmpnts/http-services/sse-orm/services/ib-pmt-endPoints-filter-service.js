(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('pmtEndPointsFilterService', pmtEndPointsFilterService);


    pmtEndPointsFilterService.$inject = ['PmtConstants', 'localStorageService'];

    function pmtEndPointsFilterService (PmtConstants, localStorageService) {

        const vm = this;
        vm.getEndPointIssue = getEndPointIssue;
        vm.getEndPointsURIHandler = getEndPointsURIHandler;

        function getEndPointIssue (serviceURI, paymentStatus, requestData, isRecall) {
            let endPointsHandler, endPointIssue,
                flowApp = localStorageService.get('flowApp');
            endPointsHandler = getEndPointsURIHandler(serviceURI, requestData);
            if (isRecall === 'offerBin') {
                endPointIssue = endPointsHandler[flowApp] + '/offerBin';
            } else if (isRecall === '3ds2Adyen') {
                endPointIssue = endPointsHandler[flowApp + '_3DS2ADYEN'];
            } else if (isRecall === '3dsOneSiteSync') {
                endPointIssue = endPointsHandler[flowApp + '_3DS2ADYEN'];
            } else if (paymentStatus || isRecall === '3ds2OneSite') {
                endPointIssue = endPointsHandler[flowApp + '_3DS'];
            } else if (paymentStatus || isRecall === 'iberiaPayAfop') {
                endPointIssue = endPointsHandler[flowApp + '_3DS2ADYEN'];
            } else if(isRecall === 'FULL_PAY_AVIOS') {
                endPointIssue = endPointsHandler[flowApp + '_AVIOS'];
            } else if(isRecall === 'COUPONS') {
                endPointIssue = endPointsHandler[flowApp + '_COUPONS'];
            } else {
                endPointIssue = endPointsHandler[flowApp];
            }
            return endPointIssue;
        }

        /**
        * Returns a Object with the  url final to call service ISSUE
        */
        function getEndPointsURIHandler (serviceURI, requestData) {
            return {
                BBKI: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceUriV3,
                BBKI_3DS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceUriV3 + '/' + requestData.orderId,
                BBKI_3DS2ADYEN: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceUriV3 + '/payment-details',
                PAOB: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceURI,
                PAOB_3DS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceURI + '/' + requestData.orderId,
                PAOB_3DS2ADYEN: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceURI + '/payment-details',
                PARE: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceURI,
                PARE_3DS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceURI + '/' + requestData.orderId,
                PARE_3DS2ADYEN: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceURI + '/payment-details',
                PAOBONB: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceURI,
                PAOBONB_3DS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceURI + '/' + requestData.orderId,
                PAOBONB_3DS2ADYEN: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceURI + '/payment-details',
                PAREONB: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceURI,
                PAREONB_3DS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceURI + '/' + requestData.orderId,
                PAREONB_3DS2ADYEN: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceURI + '/payment-details',
                MMBOH: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderOnHoldServiceURI,
                MMBOH_3DS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceURI + '/' + requestData.flowId + '?subRealm=' + PmtConstants.SUBREALM_VALUES.MMB_ONHOLD,
                MMBOH_3DS2ADYEN: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderOnHoldServiceURI + '/payment-details',
                CKI: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.payAndIssueURI,
                CKI_3DS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.payAndIssueURI + requestData.flowId + '/issue-info',
                CKI_3DS2ADYEN: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.payAndIssueURI,
                MMBANC: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.payAndIssueURI,
                MMBANC_3DS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.payAndIssueURI + requestData.flowId + '/issue-info',
                MMBANC_3DS2ADYEN: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.payAndIssueURI,
                BBKIOH: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.onHoldOrderServiceURI,
                BBKIOH_3DS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueOrderServiceUriV3 + '/' + requestData.orderId + '?onHold=true',
                BBKIOH_3DS2ADYEN: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.onHoldOrderServiceURI + '/payment-details',
                MMBUNIF: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.changeFlightOrderUnifiedServiceURI,
                MMBUNIF_3DS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.changeFlightOrderUnifiedServiceURI + '/' + requestData.flowId,
                MMBUNIF_3DS2ADYEN: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.changeFlightOrderUnifiedServiceURI + '/payment-details',
                MMBVC: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.changeFlightOrderServiceURI,
                MMBVC_3DS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.changeFlightOrderServiceURI + '/' + requestData.flowId,
                MMBVC_3DS2ADYEN: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.changeFlightOrderServiceURI + '/payment-details',
                GIFTCARDS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueGiftCardsV1 + '/' + localStorageService.get('giftCardsFlowId') + '/issue',
                GIFTCARDS_3DS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueGiftCardsV1 + '/' + localStorageService.get('giftCardsFlowId') + '/issue',
                GIFTCARDS_3DS2ADYEN: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueGiftCardsV1 + '/' + localStorageService.get('giftCardsFlowId') + '/issue/payment-details',
                SUBSCRIPTIONMODELS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueSubscriptionModelsV1 + '/' + localStorageService.get('subscriptionModelsFlowId') + '/issue',
                SUBSCRIPTIONMODELS_3DS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueSubscriptionModelsV1 + '/' + localStorageService.get('subscriptionModelsFlowId') + '/issue',
                SUBSCRIPTIONMODELS_3DS2ADYEN: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.issueSubscriptionModelsV1 + '/' + localStorageService.get('subscriptionModelsFlowId') + '/issue/payment-details',
                MMBBID: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.upgradingBidURI + '/' + requestData.flowId + '/ancillaries/' + 'pay-and-issue',
                MMBBID_3DS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.upgradingBidURI + '/' + requestData.flowId + '/ancillaries/' + 'pay-and-issue',
                MMBBID_3DS2ADYEN: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.upgradingBidURI + '/' + requestData.flowId + '/ancillaries/' + 'pay-and-issue' + '/payment-details',
                MMBBID_AVIOS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.upgradingBidURI + '/' + requestData.flowId + '/ancillaries/' + 'pay-and-issue',
                MMBBID_COUPONS: serviceURI + PmtConstants.ENDPOINTS.DEFAULT.upgradingBidURI + '/' + requestData.flowId + '/ancillaries/' + 'pay-and-issue'
            };
        }
    }
})();
