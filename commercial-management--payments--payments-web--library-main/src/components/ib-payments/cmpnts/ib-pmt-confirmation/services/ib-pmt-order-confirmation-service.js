(function () {
    'use strict';

    angular
        .module('ib-pmt-order-confirmation-module')
        .factory('PmtOrderConfirmationService', PmtOrderConfirmationService);

    PmtOrderConfirmationService.$inject = ['$rootScope', '$q', 'localStorageService', 'PmtOrderConfirmationTransformer', 'PmtAssFassAncillariesService', 'PmtConstants', 'MonetateUtilsService', 'IbCNewsletterService', 'CommonsNewHttpUtilsErrorService', 'CommonsGenericProxy'];
    function PmtOrderConfirmationService ($rootScope, $q, localStorageService, PmtOrderConfirmationTransformer, PmtAssFassAncillariesService, PmtConstants, MonetateUtilsService, IbCNewsletterService, CommonsNewHttpUtilsErrorService, CommonsGenericProxy) {

        return {
            getConfirmationInfo: getConfirmationInfo,
            getConfirmationAncillaries: getConfirmationAncillaries,
            saveNewsletterSubscription: saveNewsletterSubscription,
            completeConfirmOrderCallback: completeConfirmOrderCallback,
            confirmOrderCallback: confirmOrderCallback,
            padTo2Digits: padTo2Digits,
            formatDate: formatDate,
            formatDateTransfer: formatDateTransfer,
            getTokenWidget:getTokenWidget,
            generateConfirmOrderCallback:generateConfirmOrderCallback,
            locationForWidget:locationForWidget,
            confirmTransferOrderCallback: confirmTransferOrderCallback,
            completeTransferConfirmOrderCallback: completeTransferConfirmOrderCallback,
            cleanTaxes: cleanTaxes

        };

        ////////////////
        function locationForWidget (airport) {
            const dictionary = PmtConstants.diccionaryWidget;
            return dictionary[airport];
        }

        function getTokenWidget (activities) {
            return new Promise( (resolve, reject) => {
                const widgetProMonetate = localStorageService.get('widgetProMonetate');
                const envCopy = {};
                (Object).assign(envCopy, (window).env);
                const parameters = {
                    endpoint: '',
                    Authorization: ''
                };

                if(activities) {
                    if(envCopy.production || widgetProMonetate) {
                        parameters.endpoint = PmtConstants.ENDPOINTS.tokenActivitiesPRO;
                        parameters.Authorization = 'Basic NW9maGZ1amg3M3NzOTQ2aDdncmFpa2Z2NGY6N3NodTdzYjRkaXAzazRhb2FqNmNwdmdmNGN0cDFrb3UybGZtdTdkdjkxMWhpcmVqMGZh';
                    }else {
                        parameters.endpoint = PmtConstants.ENDPOINTS.tokenActivitiesPREE;
                        parameters.Authorization = 'Basic NDhyaGVtaWhpcTEwNG8xaGhoY2tvODAydjk6ZmxhNW92MnVrY2lxamw1dGs5cjI0ZGF0ajAwcjE3YTcxaWk3dWpmbW9mNG5kZmllYnMx';
                    }
                } else {
                    if(envCopy.production || widgetProMonetate) {
                        parameters.endpoint = PmtConstants.ENDPOINTS.tokenTransfersPRO;
                        parameters.Authorization = 'Basic NW9maGZ1amg3M3NzOTQ2aDdncmFpa2Z2NGY6N3NodTdzYjRkaXAzazRhb2FqNmNwdmdmNGN0cDFrb3UybGZtdTdkdjkxMWhpcmVqMGZh';
                    }else {
                        parameters.endpoint = PmtConstants.ENDPOINTS.tokenTransfersPREE;
                        parameters.Authorization = 'Basic NDhyaGVtaWhpcTEwNG8xaGhoY2tvODAydjk6ZmxhNW92MnVrY2lxamw1dGs5cjI0ZGF0ajAwcjE3YTcxaWk3dWpmbW9mNG5kZmllYnMx';
                    }
                }
                const headerConfig = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: parameters.Authorization
                    }
                };


                CommonsGenericProxy.postGeneric(parameters.endpoint, {}, headerConfig).then((response) => {
                    resolve(response);
                }, (error) => {
                    CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
            });
        }

        function padTo2Digits (num) {
            return num.toString().padStart(2, '0');
        }
        function formatDate (date) {
            return(
                [
                    date.getFullYear(),
                    padTo2Digits(date.getMonth() + 1),
                    padTo2Digits(date.getDate())
                ].join('-') +
              ' ' +
              [
                  padTo2Digits(date.getHours()),
                  padTo2Digits(date.getMinutes())
              ].join(':')
            );
        }
        function completeConfirmOrderCallback (bookingReference, confirmOrderCallback) {
            const confirmOrderList = [];
            const confirmOrderTemp = confirmOrderCallback;
            const startDate = new Date (bookingReference.startDate);

            confirmOrderTemp.confirmationId = bookingReference.bookingReference;
            confirmOrderTemp.price = bookingReference.price.toString();
            confirmOrderTemp.orderName = bookingReference.name;
            confirmOrderTemp.startDate = formatDate(startDate);
            confirmOrderTemp.type = 'EXP';

            confirmOrderList.push(confirmOrderTemp);
            return confirmOrderList;
        }
        function generateConfirmOrderCallback (isExperience) {
            const confirmationInfo = localStorageService.get('confirmationInfo');
            const confirmationDataLayerInfo = localStorageService.get('confirmationDatalayerInfo');
            const createOrderData = localStorageService.get('createOrderData');
            const commercialData = localStorageService.get('commercialData');
            const postOrderModel = {
                locator: confirmationInfo.pnr,
                surname: confirmationInfo.summaryInfo.passengers.personalData[0].surname,
                country: confirmationDataLayerInfo.mercado,
                officeCode: createOrderData.order.bookingOffice,
                currency: commercialData.currency.code,
                confirmationId: '',
                price: '',
                orderName: '',
                startDate: '',
                endDate: null,
                clientId: '',
                type: ''
            };
            if (isExperience) {
                postOrderModel.clientId = localStorageService.get('clientBookingIdActivities');
            }else {
                postOrderModel.clientId = localStorageService.get('clientBookingIdTransfer');
            }
            return postOrderModel;
        }
        function confirmOrderCallback (bookingReference) {
            return new Promise( (resolve, reject) => {
                if(bookingReference.status === 'PAID') {
                    const endpoint = PmtConstants.ENDPOINTS.reactWidgetCallbackURI.replaceAll('{flow-id}', localStorageService.get('flowId') );
                    const confirmOrderCallback = generateConfirmOrderCallback(true);
                    const confirmOrderCallbackList = completeConfirmOrderCallback(bookingReference, confirmOrderCallback);
                    CommonsGenericProxy.postGeneric(endpoint, confirmOrderCallbackList).then((data) => {
                        resolve(data);
                    }, (error) => {
                        CommonsNewHttpUtilsErrorService.controlError(error, reject);
                    });
                }
            });
        }
        function formatDateTransfer (date) {
            let dateReturned = '';
            const dateTemp = date.replaceAll('T', ' ').split(' ');

            dateReturned = (dateTemp[0]+' ' + dateTemp[1]);
            dateReturned = dateReturned.substring(0, dateReturned.length - 3);

            return dateReturned;
        }
        function completeTransferConfirmOrderCallback (bookingReference, confirmOrderCallback) {
            const confirmOrderList = [];
            const confirmOrderTemp = Object.assign({}, confirmOrderCallback);

            confirmOrderTemp.confirmationId = bookingReference.goingTrip.bookingReference;
            confirmOrderTemp.price = bookingReference.goingTrip.price.toString();
            confirmOrderTemp.orderName = bookingReference.goingTrip.name;
            confirmOrderTemp.startDate = formatDateTransfer(bookingReference.goingTrip.startDate);
            confirmOrderTemp.type = 'TRANS';

            confirmOrderList.push(confirmOrderTemp);

            if(bookingReference.returnTrip !== null) {
                const confirmOrderTempReturn = Object.assign({}, confirmOrderCallback);
                confirmOrderTempReturn.confirmationId = bookingReference.returnTrip.bookingReference;
                confirmOrderTempReturn.price = bookingReference.returnTrip.price.toString();
                confirmOrderTempReturn.orderName = bookingReference.returnTrip.name;
                confirmOrderTempReturn.startDate = formatDateTransfer(bookingReference.returnTrip.startDate);
                confirmOrderTempReturn.type = 'TRANS';
                confirmOrderList.push(confirmOrderTempReturn);
            }

            return confirmOrderList;
        }
        function confirmTransferOrderCallback (bookingReference) {
            return new Promise( (resolve, reject) => {
                if(bookingReference.goingTrip.status === 'PAID' || bookingReference.returnTrip.status === 'PAID') {
                    const endpoint = PmtConstants.ENDPOINTS.reactWidgetCallbackURI.replaceAll('{flow-id}', localStorageService.get('flowId') );
                    const confirmOrderCallback = generateConfirmOrderCallback(false);
                    const confirmOrderCallbackList = completeTransferConfirmOrderCallback(bookingReference, confirmOrderCallback);
                    CommonsGenericProxy.postGeneric(endpoint, confirmOrderCallbackList).then((data) => {
                        resolve(data);
                    }, (error) => {
                        CommonsNewHttpUtilsErrorService.controlError(error, reject);
                    });
                }
            });
        }
        /**
         * Return un Object with all information necesary to show confirmation view
         */
        function getConfirmationInfo () {
            return new Promise( (resolve, reject) => {
                let confirmationInfo, issueOrderInfo = localStorageService.get('issueOrderInfo'), createOrderData = localStorageService.get('createOrderData');
                if (issueOrderInfo && issueOrderInfo.data && issueOrderInfo.data.contextMetadata && issueOrderInfo.data.contextMetadata.currencies && issueOrderInfo.data.contextMetadata.currencies.length < 1 && createOrderData && createOrderData.contextMetadata) {
                    issueOrderInfo.data.contextMetadata.currencies[0] = createOrderData.contextMetadata.currencies[0];
                }
                confirmationInfo = PmtOrderConfirmationTransformer.transformInfoConfirmation(issueOrderInfo.data, $rootScope.isRedemptionFlow ? localStorageService.get('fareData').fareFamilyConditions : localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS ? localStorageService.get('fareFamilyConditionsConditions') ? localStorageService.get('fareFamilyConditionsConditions') : [] : localStorageService.get('fareFamilyConditionsInfo'));
                localStorageService.set('confirmationInfo', confirmationInfo);
                if (localStorageService.get('flowApp') === PmtConstants.APP_TYPES.BOOKING) {
                    trackPurchaseInfoToMonetate(confirmationInfo.confirmationInfo);
                }
                resolve(confirmationInfo);
            });
        }

        function getConfirmationAncillaries () {
            const deferred = $q.defer();
            if (!localStorageService.get('isShuttleFlow')) {
                PmtAssFassAncillariesService.getConfirmationAncillaries().then(getConfirmationAncillariesSucces, getConfirmationAncillariesError);
            } else {
                deferred.resolve();
            }
            return deferred.promise;
            function getConfirmationAncillariesSucces (ancillariesInfo) {
                localStorageService.set('ancillariesInfo', ancillariesInfo);
                deferred.resolve();
            }
            function getConfirmationAncillariesError () {
                deferred.resolve();
            }
        }

        function trackPurchaseInfoToMonetate (confirmationInfo) {
            if (confirmationInfo) {
                MonetateUtilsService.trackPurchasedProducts(confirmationInfo);
            }
        }

        function saveNewsletterSubscription (personalInfo) {
            IbCNewsletterService.putNewsletter(personalInfo, true).then(
                () => { localStorageService.remove('newsletterPersonalDataToSave'); },
                () => { localStorageService.remove('newsletterPersonalDataToSave'); });
        }

        function cleanTaxes (taxes, redemptionId) {
            if ((redemptionId === '1') && taxes.some(tax => tax.code === 'XF') && !taxes.some(tax => tax.code.includes('YQ'))) {
                taxes = taxes.filter(item => item.code !== 'XF');
            }
            return taxes;
        }
    }
})();
