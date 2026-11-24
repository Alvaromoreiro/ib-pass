import * as angular from 'angular';
import { CommonsNewHttpUtilsErrorService } from 'ib-web-commons/app/core/utils/http-utils-services/ib-commons-new-http-utils-error-service';
import { SeatBoostApiResponse, SeatBoostResponse } from '../cmpnts/ib-seatboost-banner/model/seatboost.interface';
export class ConfirmationService {
    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CheckinConfirmationTransformer,
        private GetAirlinesService,
        private CloseSessionService,
        private PmtAssFassAncillariesService,
        private PmtConstants,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}


    locationForWidget = (airport) => {
        const dictionary = this.PmtConstants.diccionaryWidget;
        return dictionary[airport];
    };

    getTokenWidget = (activities) => {
        return new Promise( (resolve, reject) => {
            const widgetProMonetate = this.localStorageService.get('widgetProMonetate');
            const envCopy: any = {};
            (<any>Object).assign(envCopy, (<any>window).env);
            const parameters = {
                endpoint: '',
                Authorization: ''
            };

            if(activities) {
                if(envCopy.production || widgetProMonetate) {
                    parameters.endpoint = this.PmtConstants.ENDPOINTS.tokenActivitiesPRO;
                    parameters.Authorization = 'Basic NW9maGZ1amg3M3NzOTQ2aDdncmFpa2Z2NGY6N3NodTdzYjRkaXAzazRhb2FqNmNwdmdmNGN0cDFrb3UybGZtdTdkdjkxMWhpcmVqMGZh';
                }else {
                    parameters.endpoint = this.PmtConstants.ENDPOINTS.tokenActivitiesPREE;
                    parameters.Authorization = 'Basic NDhyaGVtaWhpcTEwNG8xaGhoY2tvODAydjk6ZmxhNW92MnVrY2lxamw1dGs5cjI0ZGF0ajAwcjE3YTcxaWk3dWpmbW9mNG5kZmllYnMx';
                }
            } else {
                if(envCopy.production || widgetProMonetate) {
                    parameters.endpoint = this.PmtConstants.ENDPOINTS.tokenTransfersPRO;
                    parameters.Authorization = 'Basic NW9maGZ1amg3M3NzOTQ2aDdncmFpa2Z2NGY6N3NodTdzYjRkaXAzazRhb2FqNmNwdmdmNGN0cDFrb3UybGZtdTdkdjkxMWhpcmVqMGZh';
                }else {
                    parameters.endpoint = this.PmtConstants.ENDPOINTS.tokenTransfersPREE;
                    parameters.Authorization = 'Basic NDhyaGVtaWhpcTEwNG8xaGhoY2tvODAydjk6ZmxhNW92MnVrY2lxamw1dGs5cjI0ZGF0ajAwcjE3YTcxaWk3dWpmbW9mNG5kZmllYnMx';
                }
            }
            const headerConfig = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: parameters.Authorization
                }
            };


            this.CommonsGenericProxy.postGeneric(parameters.endpoint, {}, headerConfig).then((response) => {
                resolve(response);
            }, (error) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            });
        });
    };

    padTo2Digits = (num) => {
        return num.toString().padStart(2, '0');
    };
    formatDate = (date) => {
        return(
            [
                date.getFullYear(),
                this.padTo2Digits(date.getMonth() + 1),
                this.padTo2Digits(date.getDate())
            ].join('-') +
          ' ' +
          [
              this.padTo2Digits(date.getHours()),
              this.padTo2Digits(date.getMinutes())
          ].join(':')
        );
    };
    completeConfirmOrderCallback = (bookingReference, confirmOrderCallback) => {
        const confirmOrderList = [];
        const confirmOrderTemp = confirmOrderCallback;
        const startDate = new Date (bookingReference.startDate);

        confirmOrderTemp.confirmationId = bookingReference.bookingReference;
        confirmOrderTemp.price = bookingReference.price.toString();
        confirmOrderTemp.orderName = bookingReference.name;
        confirmOrderTemp.startDate = this.formatDate(startDate);
        confirmOrderTemp.type = 'EXP';

        confirmOrderList.push(confirmOrderTemp);
        return confirmOrderList;
    };

    generateConfirmOrderCallback = (isExperience) => {
        const confirmationInfo: ConfirmationTypes.confirmationInfo = this.localStorageService.get('confirmationInfo');
        const confirmationDataLayerInfo: ConfirmationTypes.confirmationDataLayerInfo = this.localStorageService.get('confirmationDatalayerInfo');
        const createOrderData: createOrderData.createOrderData = this.localStorageService.get('summaryInfo');
        const postOrderModel: confirmOrderGlobickModel.confirmOrderGlobick = {
            locator: confirmationInfo.locator,
            surname: createOrderData.context.passengers[0].surname,
            country: confirmationDataLayerInfo.mercado,
            officeCode: createOrderData.context.issueOffice,
            currency: createOrderData.currencies[0].code,
            confirmationId: '',
            price: '',
            orderName: '',
            startDate: '',
            endDate: null,
            clientId: '',
            type: ''
        };
        if (isExperience) {
            postOrderModel.clientId = this.localStorageService.get('clientBookingIdActivities');
        }else {
            postOrderModel.clientId = this.localStorageService.get('clientBookingIdTransfer');
        }
        return postOrderModel;
    };
    confirmOrderCallback = (bookingReference) => {
        return new Promise( (resolve, reject) => {
            if(bookingReference.status === 'PAID') {
                const endpoint = this.PmtConstants.ENDPOINTS.reactWidgetCallbackURI.replaceAll('{flow-id}', this.localStorageService.get('flowId') );
                let confirmOrderCallback = this.generateConfirmOrderCallback(true);
                let confirmOrderCallbackList = this.completeConfirmOrderCallback(bookingReference, confirmOrderCallback);
                this.CommonsGenericProxy.postGeneric(endpoint, confirmOrderCallbackList).then((data) => {
                    resolve(data);
                }, (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
            }
        });
    };
    formatDateTransfer = (date) => {
        let dateReturned = '';
        const dateTemp = date.replaceAll('T', ' ').split(' ');

        dateReturned = (dateTemp[0]+' ' + dateTemp[1]);
        dateReturned = dateReturned.substring(0, dateReturned.length - 3);

        return dateReturned;
    };
    completeTransferConfirmOrderCallback = (bookingReference, confirmOrderCallback) => {
        const confirmOrderList = [];
        const confirmOrderTemp = Object.assign({}, confirmOrderCallback);

        confirmOrderTemp.confirmationId = bookingReference.goingTrip.bookingReference;
        confirmOrderTemp.price = bookingReference.goingTrip.price.toString();
        confirmOrderTemp.orderName = bookingReference.goingTrip.name;
        confirmOrderTemp.startDate = this.formatDateTransfer(bookingReference.goingTrip.startDate);
        confirmOrderTemp.type = 'TRANS';

        confirmOrderList.push(confirmOrderTemp);

        if(bookingReference.returnTrip !== null) {
            const confirmOrderTempReturn = Object.assign({}, confirmOrderCallback);
            confirmOrderTempReturn.confirmationId = bookingReference.returnTrip.bookingReference;
            confirmOrderTempReturn.price = bookingReference.returnTrip.price.toString();
            confirmOrderTempReturn.orderName = bookingReference.returnTrip.name;
            confirmOrderTempReturn.startDate = this.formatDateTransfer(bookingReference.returnTrip.startDate);
            confirmOrderTempReturn.type = 'TRANS';
            confirmOrderList.push(confirmOrderTempReturn);
        }

        return confirmOrderList;
    };
    confirmTransferOrderCallback = (bookingReference) => {
        return new Promise( (resolve, reject) => {
            if(bookingReference.goingTrip.status === 'PAID' || bookingReference.returnTrip.status === 'PAID') {
                const endpoint = this.PmtConstants.ENDPOINTS.reactWidgetCallbackURI.replaceAll('{flow-id}', this.localStorageService.get('flowId') );
                let confirmOrderCallback = this.generateConfirmOrderCallback(false);
                let confirmOrderCallbackList = this.completeTransferConfirmOrderCallback(bookingReference, confirmOrderCallback);
                this.CommonsGenericProxy.postGeneric(endpoint, confirmOrderCallbackList).then((data) => {
                    resolve(data);
                }, (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
            }
        });
    };
    ////////////////

    searchConfirmationInfo = (isInhibitBoardingCard: boolean) => {
        return new Promise( (resolve, reject) => {
            var airlinesList;
            var confirmationInfo = this.localStorageService.get('confirmationInfo');

            const getAirlinesServiceSucces = (airLineResponse) => {
                airlinesList = airLineResponse;
                this.PmtAssFassAncillariesService.getConfirmationAncillaries().then(callAncillariesServiceSucces, callAncillariesServiceError);
            };

            const callAncillariesServiceSucces = (ancillariesInfo) => {
                if (ancillariesInfo) {
                    if (ancillariesInfo.ancillaries.length > 0) {
                        this.localStorageService.set('ancillariesInfo', ancillariesInfo);
                    }
                }

                if (!this.localStorageService.get('checkinPa')) {
                    this.CloseSessionService.closeSession();
                }
                resolve(this.CheckinConfirmationTransformer.transformConfirmationInfo(confirmationInfo, airlinesList));
            };

            const callAncillariesServiceError = () => {
                resolve(this.CheckinConfirmationTransformer.transformConfirmationInfo(confirmationInfo, airlinesList));
            };
            const getAirlinesServiceError = (error) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };


            if (isInhibitBoardingCard || confirmationInfo != null) {
                this.GetAirlinesService.getAirlines().then(getAirlinesServiceSucces, getAirlinesServiceError);
            }
        });
    };



    showBanner (): Promise<SeatBoostResponse> {
        let endpoint = this.PmtConstants.ENDPOINTS.shouldShowBannerURI;
        endpoint = endpoint.replace('{flowId}', this.localStorageService.get('flowId'));

        return new Promise((resolve, reject) => {
            this.CommonsGenericProxy.getGeneric(endpoint)
                .then((response: SeatBoostApiResponse) => {
                    resolve(response.data); 
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }


}
ConfirmationService.$inject = ['localStorageService', 'CheckinConfirmationTransformer', 'GetAirlinesService', 'CloseSessionService', 'PmtAssFassAncillariesService', 'PmtConstants', 'CommonsGenericProxy', 'CommonsNewHttpUtilsErrorService'];
try {
    const mod = angular.module('ib-check-in-confirmation-module');
    mod.service(
        'ConfirmationService',
        ConfirmationService
    );
} catch (error) {
    const mod = angular.module('ib-check-in-confirmation-module', []);
    mod.service(
        'ConfirmationService',
        ConfirmationService
    );
}
