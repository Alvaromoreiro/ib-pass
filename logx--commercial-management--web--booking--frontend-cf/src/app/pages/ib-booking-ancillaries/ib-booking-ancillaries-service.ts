
import * as angular from 'angular';

import { BkiModalServiceAncillaries } from './services/ib-modal-ancillaries-service';
import { AncillariesTransformer } from './transformer/ib-web-ancillaries-transformer';
import { AncGetCachedInformationService, type CallBundleService } from 'ib-web-ancillaries';
import { DatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service';
import { DatalayerUtils } from './services/ib-datalayer-utils';
import { DatalayerConstantsType } from 'ib-web-commons/dist/ib-datalayer/ib-datalayer-constants';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import type { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
export class AncillariesService {

    private flowApp = this.localStorageService.get('flowApp');

    constructor (
        private $location: ng.ILocationService,
        private AncGetCachedInformationService: AncGetCachedInformationService,
        private AncillariesTransformer: AncillariesTransformer,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsAncillariesService: CommonsAncillariesService,
        private CurrencyService: CurrencyService,
        private ModalServiceAncillaries: BkiModalServiceAncillaries,
        private BookingAncillariesConstant: BookingAncillariesConstant,
        private $rootScope: CommonsRootScope,
        private CommonsModalService: CommonsModalService,
        private DatalayerUtilsService: DatalayerUtilsService,
        private IbCPermanentUserService: any,
        private CommonsLoginUtilsService: any,
        private CommonsGetLoginInfoService: any,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        private CallBundleService: CallBundleService,
        private DatalayerUtils: DatalayerUtils,
        private DatalayerConstants: DatalayerConstantsType,
        private DigitalDataService: DigitalDataService
    ) { }


    ////////////////

    /**
    * Get ancillaries information from localstorage
    *
    */
    //    setter
    searchAncillariesInfo = (_isIncompatibilityReload?: boolean): angular.IPromise<any> => {
        let cachedDataInfo, locator;
        const cachedInfo = this.localStorageService.get('bookingInfo');
        const ancillariesInfo = this.localStorageService.get('ancillariesInfo');

        return new Promise((resolve, reject) => {
            const cachedInformationSuccess = (summaryInfo) => {
                const flowApp = this.localStorageService.get('flowApp');
                const ancillariesLocalInfo = this.localStorageService.get('ancillariesTransformedInfo');
                const flightAviosInfo:any = this.localStorageService.get('flightAviosInfo');
                let transformedAncillariesInfo;
                this.checkPreorder(summaryInfo);
                this.localStorageService.set('currency', this.CurrencyService.getCurrencyObject(summaryInfo.currencies[0]));
                cachedDataInfo = this.AncillariesTransformer.passengerTransformData(cachedDataInfo, summaryInfo);
                this.localStorageService.set('bookingInfo', cachedInfo);
                this.localStorageService.set('summaryInfo', summaryInfo);
                const transformedInfo = this.AncillariesTransformer.generateInfoCommon(ancillariesInfo, cachedDataInfo);
                transformedInfo.seatsQuanty = this.AncillariesTransformer.countSeatsTotal(summaryInfo.issuedItems);
                this.localStorageService.set('seatsQuanty', transformedInfo.seatsQuanty);
                // transform
                transformedAncillariesInfo = this.AncillariesTransformer.transformAncillariesView(transformedInfo, ancillariesInfo, cachedDataInfo);

                if (ancillariesLocalInfo) {
                    transformedAncillariesInfo = this.AncillariesTransformer.transformFromLocalStorage(transformedAncillariesInfo, ancillariesLocalInfo);
                    this.localStorageService.set('ancillariesTransformedInfo', transformedAncillariesInfo);
                }

                if(!flightAviosInfo && flowApp === 'CKI') {
                    const request = this.AncillariesTransformer.genCalAviosFligthReq(summaryInfo);
                    this.localStorageService.set('flightAviosInfo', request);
                }

                this.CommonsModalService.finishWaiting();
                this.ModalServiceAncillaries.isNotWaiting();
                resolve(transformedAncillariesInfo);
            };

            const getAncillarySummary = (_isIncompatibilityReload: boolean) => {
                if (_isIncompatibilityReload) {
                    cachedInformationSuccess(this.localStorageService.get('summaryInfo'));
                } else {
                    this.CommonsAncillariesService.getAncillarieSummary(undefined, null, locator).then(cachedInformationSuccess, this.showError);
                }
            };

            if (ancillariesInfo) {
                if (cachedInfo) {
                    cachedDataInfo = cachedInfo;
                    const isBookingReferences: boolean = cachedDataInfo.order && cachedDataInfo.order.bookingReferences && cachedDataInfo.order.bookingReferences.length > 0;
                    if (isBookingReferences) {
                        locator = cachedDataInfo.order.bookingReferences[0].reference;
                    }
                    getAncillarySummary(_isIncompatibilityReload);
                } else {
                    this.AncGetCachedInformationService.getCachedInformation().then(
                        (CachedInformation) => {
                            cachedDataInfo = CachedInformation;
                            getAncillarySummary(_isIncompatibilityReload);
                        },
                        (error) => {
                            reject(error);
                        });
                }
            } else {
                this.updateAncillariesSuccess(null);
            }
        });
    };

    /**
         * Build request for selected ancillaries
         * @param {Array} baggagesTrips List of baggage trips
         * @param {Array} speqsTrips List of speqs trips
         * @param {Object} insuranceInfo Insurance info
         */
    generateRequestAncillaries = (insuranceInfo: any) => {
        const flowApp: string = this.localStorageService.get('flowApp');
        const cancelInsuranceSuccess = () => {
            if (insuranceInfo) {
                const infoTransformed = this.AncillariesTransformer.buildAncillariesRequest([], [], insuranceInfo);
                this.localStorageService.set('selectedAncillariesInfo', infoTransformed);
                if (infoTransformed.length > 0) {
                    this.CommonsAncillariesService.updateAncillaries(infoTransformed)
                        .then(this.updateAncillariesSuccess, (error) => this.updateAncillariesError(error, flowApp));
                } else {
                    this.updateAncillariesSuccess(null);
                }
            } else {
                this.updateAncillariesSuccess(null);
            }
        };

        if (!insuranceInfo && this.localStorageService.get('hasSelectedInsurance')) {
            const deleteInfo = [{ type: this.BookingAncillariesConstant.TYPE_ANCILLARIE.INSURANCE }];
            this.localStorageService.set('hasSelectedInsurance', false);
            this.CommonsAncillariesService.deleteAncillarie(deleteInfo).then((data) => {
                if (data.failedToDelete && data.failedToDelete.length > 0) {
                    switch (flowApp) {
                            case this.BookingAncillariesConstant.APPLICATION_FLOW.BBOOKING:
                                this.CommonsModalService.showGenericError(data.failedToDelete[0], null, null).result.finally(this.emptyFunction);
                                break;
                            default:
                                this.showError({
                                    message: data.failedToDelete[0].error.description,
                                    internalErrorCode: data.failedToDelete[0].error.code
                                });
                                break;
                    }

                } else {
                    cancelInsuranceSuccess();
                }
            }, this.showError);
        } else {
            cancelInsuranceSuccess();
        }
    };

    updateAncillariesError (error: any, flowApp: string): void {

        const refreshSummaryInfo = () => {
            this.CommonsAncillariesService.getAncillarieSummary().then((data) => {
                this.localStorageService.set('breakdownInfo', data);
                this.cleanSessionAncillaries();
                this.$location.path(this.BookingAncillariesConstant.PAGES_ROUTES.PAYMENTS);
            }, (error) => {
                this.showServiceError(error);
            });
        };

        const removeAncillariesAndContinueToPayment = (continueToPayment: boolean): void => {
            if(continueToPayment) {
                this.CommonsAncillariesService.deleteAllAncillaries().then((data) => {
                    if (data.failedToDelete && data.failedToDelete.length > 0) {
                        this.showError({
                            message: data.failedToDelete[0].error.description,
                            internalErrorCode: data.failedToDelete[0].error.code
                        });
                    } else {
                        refreshSummaryInfo();
                    }
                }, (error) => {
                    this.showServiceError(error);
                });
            }
        };

        this.ModalServiceAncillaries.isNotWaiting();
        if (flowApp === this.BookingAncillariesConstant.APPLICATION_FLOW.BBOOKING) {
            this.ModalServiceAncillaries.openAncillariesErrorModal(
                {
                    title: 'ERROR_ANCILLARIES_BKI_TO_PAYMENT_TITLE',
                    message: 'ERROR_ANCILLARIES_BKI_TO_PAYMENT_BODY',
                    flowApp: flowApp
                }).result.then(removeAncillariesAndContinueToPayment);
        } else {
            this.showServiceError(error);
        }

    }

    /**
     * Check if error is diferent of 412 and redirect user to boarding cards pages.
     * @param {Object} error Error information
     */
    showServiceError = (error: any) => {
        let serviceCode = '';
        this.localStorageService.set('nextStepAllowed', true);
        if (error.data) {
            serviceCode = error.data.errors[0].code;
        }
        if ((error.errorCode === 412 && serviceCode !== 'PMT_PPM_8005') || error.errorCode === 410) {
            this.localStorageService.set('nextStepAllowed', false);
            this.$location.path(this.BookingAncillariesConstant.PAGES_ROUTES.BOARDING_CARDS);
        } else {
            this.showPaymentError(error);
        }
    };


    modifiedSeats = (segmentId: any, pasId: any, ancillariesModel: any) => {
        this.localStorageService.set('ancillariesTransformedInfo', ancillariesModel);
        this.localStorageService.set('seatMapSegment', { segmentId: segmentId, pasId: pasId });
        this.$location.path('/ckiancseat');
    };

    cancelSeat = (segmentId, pasId): angular.IPromise<any> => {
        const deleteInfo = [{
            type: this.BookingAncillariesConstant.TYPE_ANCILLARIE.SEAT,
            segments: [{
                id: segmentId,
                passengers: [pasId]
            }
            ]
        }];
        return new Promise((resolve, reject) => {
            this.ModalServiceAncillaries.isWaiting();
            this.CommonsAncillariesService.deleteAncillarie(deleteInfo).then((data) => {
                const transformedDeleteResponse = this.AncillariesTransformer.transformDeleteResponse(data);
                this.ModalServiceAncillaries.isNotWaiting();
                if (transformedDeleteResponse.error) {
                    this.showError(transformedDeleteResponse.error);
                }
                resolve(transformedDeleteResponse.data);
            }, (error) => {
                reject();
                this.showError(error);
            });
        });
    };

    showError = (error) => {
        const flowApp = this.localStorageService.get('flowApp');
        this.ModalServiceAncillaries.isNotWaiting();
        switch (flowApp) {
                case this.BookingAncillariesConstant.APPLICATION_FLOW.BBOOKING:
                    this.CommonsModalService.showGenericError(error, null, null).result.finally(this.emptyFunction);
                    break;
                default:
                    this.ModalServiceAncillaries.setErrorMessage(error.message);
                    this.ModalServiceAncillaries.setErrorCode(error.internalErrorCode);
                    this.ModalServiceAncillaries.isError(error, null, null);
                    break;
        }
    };

    /**
    * Save ancillaries model on localstorage
    * @param {Object} ancillariesModel Model of ancillaries
    */
    storeAncillariesModel = (ancillariesModel) => {
        this.localStorageService.set('ancillariesTransformedInfo', ancillariesModel);
    };


    /**
     * Show modal error with information
     * @param {Object} error Error information for show in modal
     */
    showPaymentError = (error) => {
        this.ModalServiceAncillaries.isNotWaiting();
        if (error.data) {
            this.ModalServiceAncillaries.setErrorMessage(error.data.errors[0].reason);
        } else {
            this.ModalServiceAncillaries.setErrorMessage(error.message);
        }
        this.ModalServiceAncillaries.isError(error.errorCode, null, null);
    };


    /**
     * Return price of offer of insurance
     * @param {Object} currency Currency
     * @param {*} ancillaries Offer of insurance
     */
    getPriceOfferInsurance = (currency, offer) => {
        const flowApp = this.$rootScope.flowName;
        const price = { originalPrice: 0, currencyPrice: '0' };
        if (flowApp === 'MMB') {
            price.currencyPrice = this.CurrencyService.formatPrice(currency, offer[0].offers[0].premium, true, false);
            price.originalPrice = offer[0].offers[0].premium;
        } else {
            price.currencyPrice = this.CurrencyService.formatPrice(currency, offer.premium, true, false);
            price.originalPrice = offer.premium;
        }

        return price;
    };

    /**
    * Return quanty of baggages selected by user
    * @param {*} trips
    */
    calculateTotalBaggages = (trips) => {
        return this.AncillariesTransformer.calculateTotalBaggages(trips);
    };

    /**
       * Return quanty of speqs selected by user
       * @param {*} trips
       */
    calculateTotalSpeqs = (trips) => {
        return this.AncillariesTransformer.calculateTotalSpeqs(trips);
    };

    /**
         * Return quantity of baggages by pnr
         * @param {*} trips
         */
    countBaggageTotal = (trips) => {
        return this.AncillariesTransformer.countBaggageTotal(trips);
    };

    /**
         * Return quantity global of speqs by pnr
         * @param {*} trips
         */
    countSpeqsTotal = (trips) => {
        return this.AncillariesTransformer.countSpeqsTotal(trips);
    };

    countSeatsTotal = (orderItems) => {
        return this.AncillariesTransformer.countSeatsTotal(orderItems);
    };

    /**
         * Return quantry of baggages selected by user
         * @param {Array} seats List of seats selected by user on seat map
         */
    calculateTotalSeats = (seats) => {
        return this.AncillariesTransformer.calculateTotalSeats(seats);
    };

    /**
         * Update information seat of passengers returned by service
         * @param {*} trips
         * @param {*} seatsTransformed
         */
    updateSeatInformation = (trips, seatsTransformed) => {
        this.AncillariesTransformer.updateSeatInformation(trips, seatsTransformed);
    };

    /**
         * Return seats updated on service
         * @param {Object} seatInfoUpdate Information seat for update
         */
    getUpdateSeatInfo = (seatInfoUpdate) => {
        return this.AncillariesTransformer.getUpdateSeatInfo(seatInfoUpdate);
    };


    /**
         * Return the payment info of upgrading bids to update the payment
         * @param {Object} upgBidsInfoUpdated Information about the upgrading bids
         * @param {Object} selectedPaymentData Information of the payment form
         */
    transformInfoSendPay = (upgBidsInfoUpdated: any, selectedPaymentData: any, selectedcontactData: any) => {
        return this.AncillariesTransformer.transformInfoSendPay(upgBidsInfoUpdated, selectedPaymentData, selectedcontactData);
    };

    upgradeBidsUpdate = (upgBidsInfoUpdated: any): angular.IPromise<any> => {
        const passengersData = this.localStorageService.get('passengers');
        const request = this.AncillariesTransformer.upgradeBidsAviosUpdate(upgBidsInfoUpdated, passengersData);

        return new Promise((resolve, reject) => {
            this.CommonsAncillariesService.updateAncillaries(request).then((data: any) => {
                resolve(data);
            },
            (error) => {
                reject(error);
            });
        });

    };
    /**
        * Return the confirmation payment info of upgrading
        */
    transformInfoSendToConfirmation = () => {
        return this.AncillariesTransformer.transformInfoSendToConfirmation();
    };

    /**
         *
         */
    cancelBidOffer = (segmentInfo: any, cabin: any) => {
        const deleteInfo = [{
            type: this.BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_BID,
            segments: [{
                id: segmentInfo.id,
                cabins: [cabin]
            }
            ]
        }];
        const refreshSummaryInfo = () => {
            this.CommonsAncillariesService.getAncillarieSummary().then(this.getAncillarieSummarySuccess, this.showError);
        };
        this.CommonsAncillariesService.deleteAncillarie(deleteInfo).then((data) => {
            if (data.failedToDelete && data.failedToDelete.length > 0) {
                this.showError({
                    message: data.failedToDelete[0].error.description,
                    internalErrorCode: data.failedToDelete[0].error.code
                });
            } else {
                refreshSummaryInfo();
            }
        }, this.showError);

    };

    getAncillarieSummarySuccess = (breakdownResponse) => {
        this.localStorageService.set('breakdownInfo', breakdownResponse);
        this.$rootScope.$broadcast('refreshBidsModalScreen');
    };

    deleteAncillaryUpgBids = (upgBidsInfoDelete): angular.IPromise<any> => {
        return new Promise((resolve, reject) => {
            const refreshSummaryInfo = () => {
                this.CommonsAncillariesService.getAncillarieSummary().then((data) => {
                    this.localStorageService.set('breakdownInfo', data);
                    resolve(data);
                }, (error) => {
                    reject(error);
                });
            };
            const getAncillariesInfo = () => {
                this.CommonsAncillariesService.getAncillaries().then((ancillariesResponse) => {
                    this.localStorageService.set('ancillariesInfo', ancillariesResponse);
                    this.$rootScope.$broadcast('reloadMMBDashboard');
                    resolve(ancillariesResponse);
                }, (error) => {
                    this.localStorageService.set('breakdownInfo', null);
                    this.localStorageService.set('ancillariesInfo', null);
                    reject(error);
                });
            };
            this.CommonsAncillariesService.deleteAllAncillaries().then((data) => {
                if (data.failedToDelete && data.failedToDelete.length > 0) {
                    this.showError({
                        message: data.failedToDelete[0].error.description,
                        internalErrorCode: data.failedToDelete[0].error.code
                    });
                    reject(data);
                } else {
                    //this.AncillariesTransformer.deleteBidsAviosRequest(upgBidsInfoDelete);
                    getAncillariesInfo();
                    refreshSummaryInfo();
                }
            }, (error) => {
                reject(error);
            });
        });
    };

    addGlobickTransfersToBasketReturn = (typeQuadrigam: string, dateGoingTrip: string, dateReturnTrip: string, transferCar: string, priceGoing: number, priceReturn: number): void => {
        this.localStorageService.set('close', typeQuadrigam);
        this.localStorageService.set('ancillariesAction', 'click');
        this.localStorageService.set('ancillariesAction', 'addtocart');
        this.$rootScope.$broadcast('updateHeaderGlobickTransfers', {
            dateGoingTrip,
            dateReturnTrip,
            transferCar,
            priceGoing,
            priceReturn
        });
    };

    addGlobickTransfersToBasket = (typeQuadrigam: string, dateGoingTrip: string, transferCar: string, price: number): void => {
        this.localStorageService.set('close', typeQuadrigam);
        this.localStorageService.set('ancillariesAction', 'click');
        this.localStorageService.set('ancillariesAction', 'addtocart');
        this.$rootScope.$broadcast('updateHeaderGlobickTransfers', {
            dateGoingTrip,
            transferCar,
            price
        });
    };

    updateGlobickTransfers = (dateGoingTrip: string, transferCar: string, price: number, hash: any, goingTripID: any, goingTripReference: any): Promise<void> => {
        const summaryInfo:any =  this.flowApp === 'MMB' ? this.localStorageService.get('breakdownInfo') : this.localStorageService.get('summaryInfo');
        const globickTransfersRequest = [
            {
                type: this.BookingAncillariesConstant.TYPE_ANCILLARIE.GLOBICK,
                clientId: hash,
                currency: summaryInfo.currencies[0].code,
                items: [
                    {
                        product: 'TRANS',
                        bookingReference: goingTripReference,
                        name: transferCar,
                        price: price,
                        startDate: dateGoingTrip,
                        endDate: ''
                    }
                ]
            }
        ];
        this.ModalServiceAncillaries.showWaitingModal(null, null, null, null);
        return new Promise((resolve, reject) => {
            this.CommonsAncillariesService.updateAncillaries(globickTransfersRequest).then(() => {
                //Add datalayer add_to_cart
                this.DatalayerUtils.setTransferEvent(this.DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART, transferCar, price, undefined, summaryInfo.context.segments);
                this.ModalServiceAncillaries.isNotWaiting();
                resolve();
            }, (error) => {
                this.ModalServiceAncillaries.isNotWaiting();
                this.ModalServiceAncillaries.showGenericError(error, false, null).result.then(angular.noop, angular.noop);
                reject();
            });
        });
    };

    updateGlobickTransfersReturn = (dateGoingTrip: string, dateReturnTrip: string, transferCar: string, priceGoing: number, priceReturn: number, hash: any, goingTripID: any, goingTripReference: any, returnTripID: any, returnTripReference: any): Promise<void> => {
        const summaryInfo:any =  this.flowApp === 'MMB' ? this.localStorageService.get('breakdownInfo') : this.localStorageService.get('summaryInfo');
        const globickTransfersRequest = [
            {
                type: this.BookingAncillariesConstant.TYPE_ANCILLARIE.GLOBICK,
                clientId: hash,
                currency: summaryInfo.currencies[0].code,
                items: [
                    {
                        product: 'TRANS',
                        bookingReference: goingTripReference,
                        name: transferCar,
                        price: priceGoing,
                        startDate: dateGoingTrip,
                        endDate: ''
                    },
                    {
                        product: 'TRANS',
                        bookingReference: returnTripReference,
                        name: transferCar,
                        price: priceReturn,
                        startDate: dateReturnTrip,
                        endDate: ''
                    }
                ]
            }
        ];
        this.ModalServiceAncillaries.showWaitingModal(null, null, null, null);
        return new Promise((resolve, reject) => {
            this.CommonsAncillariesService.updateAncillaries(globickTransfersRequest).then(() => {
                //Add datalayer add_to_cart
                this.DatalayerUtils.setTransferEvent(this.DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART, transferCar, priceGoing, priceReturn, summaryInfo.context.segments);
                this.ModalServiceAncillaries.isNotWaiting();
                resolve();
            }, (error) => {
                this.ModalServiceAncillaries.isNotWaiting();
                this.ModalServiceAncillaries.showGenericError(error, false, null).result.then(angular.noop, angular.noop);
                reject();
            });
        });
    };

    deleteGlobickTransfersFromBasket = (): void => {
        this.$rootScope.$broadcast('updateHeaderGlobickTransfers', null);
        this.$rootScope.$broadcast('basketUpdateCommonHeader');
    };

    deleteGlobickTransfers = (): any => {
        const bookingReferences:any =  this.localStorageService.get('bookingReferencesTransfers');
        const deleteInfo = [
            {
                type: this.BookingAncillariesConstant.TYPE_ANCILLARIE.GLOBICK,
                items: [
                    {
                        product: 'TRANS',
                        bookingReferences: bookingReferences
                    }
                ]
            }
        ];
        this.localStorageService.set('removeGlobickTransfers', deleteInfo);
        return deleteInfo;
    };

    addGlobickActivitiesToBasket = (typeQuadrigam: string, dateGoingTrip: [string], description: [string], price: [number]): void => {
        this.localStorageService.set('close', typeQuadrigam);
        this.localStorageService.set('ancillariesAction', 'click');
        this.localStorageService.set('ancillariesAction', 'addtocart');
        this.$rootScope.$broadcast('updateHeaderGlobickActivities', {
            dateGoingTrip,
            description,
            price
        });
    };

    updateGlobickActivities = (dateGoingTrip: [string], description: [string], price: [number], hash: any, goingTripReference: any): Promise<void> => {
        const summaryInfo:any =  this.flowApp === 'MMB' ? this.localStorageService.get('breakdownInfo') : this.localStorageService.get('summaryInfo');
        const globickActivityRequest = [
            {
                type: this.BookingAncillariesConstant.TYPE_ANCILLARIE.GLOBICK,
                clientId: hash,
                currency: summaryInfo.currencies[0].code,
                items: []
            }
        ];
        description.forEach((act, index)  => {
            globickActivityRequest[0].items.push(
                {
                    product: 'EXP',
                    bookingReference: goingTripReference[index],
                    name: description[index],
                    price: price[index],
                    startDate: dateGoingTrip[index],
                    endDate: ''
                }
            );
        });
        this.ModalServiceAncillaries.showWaitingModal(null, null, null, null);
        return new Promise((resolve, reject) => {
            this.CommonsAncillariesService.updateAncillaries(globickActivityRequest).then(() => {
                this.ModalServiceAncillaries.isNotWaiting();
                resolve();
            }, (error) => {
                this.ModalServiceAncillaries.isNotWaiting();
                this.ModalServiceAncillaries.showGenericError(error, false, null).result.then(angular.noop, angular.noop);
                reject();
            });
        });
    };


    deleteGlobickActivitiesFromBasket = (): void => {
        this.$rootScope.$broadcast('updateHeaderGlobickActivities', null);
        this.$rootScope.$broadcast('basketUpdateCommonHeader');
    };

    deleteGlobickActivities = (): any => {
        const bookingReferences:any =  this.localStorageService.get('bookingReferencesActivities');
        const deleteInfo = [
            {
                type: this.BookingAncillariesConstant.TYPE_ANCILLARIE.GLOBICK,
                items: [
                    {
                        product: 'EXP',
                        bookingReferences: bookingReferences
                    }
                ]
            }
        ];
        this.localStorageService.set('removeGlobickActivities', deleteInfo);
        this.$rootScope.$broadcast('setDisconfirmedActivities');
        return deleteInfo;
    };

    addAllianzFusionInsuranceToBasket = (typeQuadrigam: string, description: string, price: number): void => {
        this.localStorageService.set('close', typeQuadrigam);
        this.localStorageService.set('ancillariesAction', 'click');
        this.localStorageService.set('ancillariesAction', 'addtocart');
        this.$rootScope.$broadcast('updateHeaderAllianzFusionInsurance', {
            description,
            price
        });
    };

    updateAllianzFusionInsurance = (code: string, additionalInfoByPassenger: any): Promise<void> => {
        const globickAllianzFusionRequest = [
            {
                type: this.BookingAncillariesConstant.TYPE_ANCILLARIE.INSURANCE_ALLIANZ,
                externalCode: code,
                additionalInfoByPassenger: additionalInfoByPassenger
            }
        ];
        this.ModalServiceAncillaries.showWaitingModal(null, null, null, null);
        return new Promise((resolve, reject) => {
            this.CommonsAncillariesService.updateAncillaries(globickAllianzFusionRequest).then(() => {
                this.ModalServiceAncillaries.isNotWaiting();
                resolve();
            }, (error) => {
                this.ModalServiceAncillaries.isNotWaiting();
                this.ModalServiceAncillaries.showGenericError(error, false, null).result.then(angular.noop, angular.noop);
                reject();
            });
        });
    };


    deleteAllianzFusionInsuranceFromBasket = (): void => {
        this.$rootScope.$broadcast('updateHeaderAllianzFusionInsurance', null);
        const deleteInfo = [
            {
                type: 'ALLIANZ_FUSION'
            }
        ];
        this.CommonsAncillariesService.deleteAncillarie(deleteInfo).then((data) => {
            this.ModalServiceAncillaries.isNotWaiting();
        }, (error) => {
            this.ModalServiceAncillaries.isNotWaiting();
        });
    };

    deleteAllianzFusionInsurance = (): any => {
        return new Promise((resolve) => {
            const deleteInfo = [
                {
                    type: this.BookingAncillariesConstant.TYPE_ANCILLARIE.INSURANCE_ALLIANZ
                }
            ];
            resolve(deleteInfo);
        });
    };

    addCarbonFootprintToBasket = (typeQuadrigam: string, kilosCo2Equivalent: number, price: number): void => {
        this.localStorageService.set('close', typeQuadrigam);
        this.localStorageService.set('ancillariesAction', 'click');
        this.localStorageService.set('ancillariesAction', 'addtocart');
        this.$rootScope.$broadcast('updateHeaderCarbonFootprint', {
            kilosCo2Equivalent,
            price
        });
    };

    updateCarbonFootprint = (kilosCo2Equivalent: number, price: number): Promise<void> => {
        const carbonFootprintRequest = [
            {
                type: this.BookingAncillariesConstant.TYPE_ANCILLARIE.CO2_FOOTPRINT,
                kilosCo2Equivalent,
                price
            }
        ];
        this.ModalServiceAncillaries.showWaitingModal(null, null, null, null);
        return new Promise((resolve, reject) => {
            this.CommonsAncillariesService.updateAncillaries(carbonFootprintRequest).then(() => {
                this.ModalServiceAncillaries.isNotWaiting();
                resolve();
            }, (error) => {
                this.ModalServiceAncillaries.isNotWaiting();
                this.ModalServiceAncillaries.showGenericError(error, false, null).result.then(angular.noop, angular.noop);
                reject();
            });
        });
    };

    deleteCarbonFootprintFromBasket = (): void => {
        this.$rootScope.$broadcast('updateHeaderCarbonFootprint', null);
        this.$rootScope.$broadcast('basketUpdateCommonHeader');
    };

    deleteCarbonFootprint = (): Promise<void> => {
        const deleteInfo = [{ type: this.BookingAncillariesConstant.TYPE_ANCILLARIE.CO2_FOOTPRINT }];
        this.ModalServiceAncillaries.showWaitingModal(null, null, null, null);
        return this.CommonsAncillariesService.deleteAncillarie(deleteInfo).then(() => {
            this.ModalServiceAncillaries.isNotWaiting();
        }, (error) => {
            this.ModalServiceAncillaries.isNotWaiting();
            this.ModalServiceAncillaries.showGenericError(error, false, null).result.then(angular.noop, angular.noop);
        });
    };

    checkPreorder = (breakdownResponse) => {
        let i;
        if (breakdownResponse.issuedItems.length > 0) {
            for (i = 0; i < breakdownResponse.issuedItems.length; i++) {
                if (breakdownResponse.issuedItems[i].type === 'PREORDER') {
                    this.localStorageService.set('hasPreorderAncillarie', true);
                }
            }
        }
    };
    emptyFunction = () => {
    };

    genTripsAncillaries = (passenger) => {
        return this.AncillariesTransformer.genStructureForAncillaries(passenger);
    };

    getReqAviosAncillariesPriorityBoarding = (boarding) => {
        //localstorage de boarding priority
        const genAviosAncillariesPriority = this.AncillariesTransformer.genAviosPriorityReq(boarding);
        this.localStorageService.set('genAviosAncillariesPriority', genAviosAncillariesPriority);
        return genAviosAncillariesPriority;
    };

    getReqAviosAncillariesBaggages = (dataBaggages) => {
        //localstorage de baggages
        const genAviosAncillariesBaggages = this.AncillariesTransformer.genReqAviosAncillariesBaggages(dataBaggages);
        this.localStorageService.set('genAviosAncillariesBaggages', genAviosAncillariesBaggages);
        return genAviosAncillariesBaggages;
    };

    getReqAviosAncillariesSpeq = (speqs) => {
        //localstorage de Speq
        const genAviosAncillariesSpeq = this.AncillariesTransformer.genAviosSpeqReq(speqs);
        this.localStorageService.set('genAviosAncillariesSpeq', genAviosAncillariesSpeq);
        return genAviosAncillariesSpeq;
    };

    getAviosAncillariesSummaryReq = (passenger, type) => {
        //setear localstorage
        this.AncillariesTransformer.genAviosAncillariesSummaryReq(passenger, type);
        this.$rootScope.$broadcast('flightAviosInfo');
    };

    getAviosAncillariesFlex = (flex) =>{
        //localstorage de Flex
        const genAviosAncillariesFlex = this.AncillariesTransformer.genAviosFlexOnDemandReq(flex);
        this.localStorageService.set('genAviosAncillariesFlex', genAviosAncillariesFlex);
        return genAviosAncillariesFlex;
    };
    manageAviosModal = (aviosData) => {
        const modalObject = { aviosAncillariesReq: {}, passenger: {} };
        modalObject.aviosAncillariesReq = this.AncillariesTransformer.genAviosAncillariesReq(aviosData);
        modalObject.passenger = this.localStorageService.get('bookingInfo');
        this.ModalServiceAncillaries.openAviosAccumulatedModal(modalObject).result.then(() => {}, () => {});
    };
    deleteAviosAncillaries (sliceId: string | null, type: string, subType: string = null): void {
        const updateAncillaries = (data, type: string): void => {
            const anciDict = {
                [this.BookingAncillariesConstant.TYPE_ANCILLARIE.FLEXIBILITY]: 'genAviosAncillariesFlex',
                [this.BookingAncillariesConstant.TYPE_ANCILLARIE.PRIORITY_BOARDING]: 'genAviosAncillariesPriority',
                [this.BookingAncillariesConstant.TYPE_ANCILLARIE.SEAT]: 'genAviosAncillariesSeat',
                [this.BookingAncillariesConstant.TYPE_ANCILLARIE.BAGGAGE]: 'genAviosAncillariesBaggages',
                [this.BookingAncillariesConstant.TYPE_ANCILLARIE.SPEQS]: 'genAviosAncillariesSpeq'
            };
            try {
                let aviosAncillaries = data.map(el => ({id: el.id, ancillaries: el.ancillaries.filter(anci => anci?.type === type)}));
                aviosAncillaries = aviosAncillaries.filter(passenger => passenger.ancillaries.length > 0);
                this.localStorageService.set(anciDict[type], aviosAncillaries);
            } catch (error) {
                this.localStorageService.set(anciDict[type], {});
            }
        };
        const flightAviosInfo: any = this.localStorageService.get('flightAviosInfo') || null;
        if (flightAviosInfo) {
            flightAviosInfo.passengers = subType
                ? this.AncillariesTransformer.deleteAncillaryBySubType(sliceId, subType, flightAviosInfo.passengers)
                : this.AncillariesTransformer.deleteAncillaryByType(sliceId, type, flightAviosInfo.passengers);
            this.localStorageService.set('flightAviosInfo', flightAviosInfo);
            updateAncillaries(flightAviosInfo.passengers, type);
            this.$rootScope.$broadcast('flightAviosInfo');
            this.$rootScope.$broadcast('updateCalcAvios', flightAviosInfo);
        }
    }

    updateAncillariesSuccess = (data: any) => {
        this.localStorageService.set('loadingNextFlow', 4);
        this.DatalayerUtilsService.setAncillariesAction(this.localStorageService.get('ancillariesAction'));
        this.DatalayerUtilsService.setAncillariesDatalayer();
        this.localStorageService.set('nextStepAllowed', false);

        // Call put bundle if it is selected
        const selectedBundle: any = this.localStorageService.get('selectedBundle');
        if(selectedBundle) {
            selectedBundle.bundleId = selectedBundle.id;
            selectedBundle.bundleItems = selectedBundle.items;
            this.createBundleRequest(selectedBundle);
        } else {
            this.redirectToPayments();
        }

    };


    createBundleRequest (selectedBundle: any) {
        const selectedBundleItems = [];

        selectedBundle.items.forEach((item: any) => {
            selectedBundleItems.push({
                type: item.type,
                subtype: item.subtype,
                quantity: item.quantity
            });
        });

        const bundle = {
            bundleId: selectedBundle.id,
            bundleItems: selectedBundleItems
        };

        this.CallBundleService.putBundle(bundle).then(this.redirectToPayments);
    }

    redirectToPayments = () => {
        this.$location.path(this.BookingAncillariesConstant.PAGES_ROUTES.PAYMENTS);
    };

    cleanSessionAncillaries = () => {

        const emptyAncillariesBasket = {
            baggages: {
                segments: [],
                hasBaggage: false
            },
            seats: {
                segments: [],
                hasSeats: false
            },
            insurance: {
                info: null,
                hasInsurance: false
            },
            flexibilization: {
                info: null,
                hasFlexibilization: false
            },
            petc: {
                segments: [],
                hasPetc: false
            },
            upgrading: {
                segments: [],
                hasUpgrading: false
            },
            speqs: {
                segments: [],
                hasSpeqs: false
            },
            priorityBoarding: {
                info: null,
                hasPriorityBoarding: false
            },
            globickTransfers:{
                hasTransfersGlobick: false
            }
        };

        // Remove from basket
        const headerModel: any = this.localStorageService.get('headerModel');
        headerModel.headerModel.shoppingBasket.baggages = emptyAncillariesBasket.baggages;
        headerModel.headerModel.shoppingBasket.seats = emptyAncillariesBasket.seats;
        headerModel.headerModel.shoppingBasket.insurance = emptyAncillariesBasket.insurance;
        headerModel.headerModel.shoppingBasket.flexibilization = emptyAncillariesBasket.flexibilization;
        headerModel.headerModel.shoppingBasket.upgrading = emptyAncillariesBasket.upgrading;
        headerModel.headerModel.shoppingBasket.speqs = emptyAncillariesBasket.speqs;
        headerModel.headerModel.shoppingBasket.priorityBoarding = emptyAncillariesBasket.priorityBoarding;
        headerModel.headerModel.shoppingBasket.globickTransfers = emptyAncillariesBasket.globickTransfers;
        headerModel.headerModel.shoppingBasket.petc = emptyAncillariesBasket.petc;

        this.NewMainHeaderFacade.updateHeaderModel(headerModel);

        // Remove from storage
        this.localStorageService.set('passengerBaggagesTrips', null);
        this.localStorageService.set('seatsAvailableSegments', []);
        this.localStorageService.set('passengerSpeqsTrips', null);
        this.localStorageService.set('pendingSegmentSeats', []);
        this.$rootScope.$emit('cleanPriorityBoarding');
        this.$rootScope.$emit('cleanFlexibilization');
        this.$rootScope.$emit('cleanCarbonFootprintAncillary');
        this.$rootScope.$emit('modifyPendingSeat');

        // Update datalayer cart
        const cart: any = this.localStorageService.get('addToCart');

        cart.ecommerce.items = cart.ecommerce.items.filter((item: any) =>
            item.item_name === 'baggage' || item.item_name === 'seat' || item.item_name === 'insurance' ||
            item.item_name === 'flexibilization' || item.item_name === 'special baggage' || item.item_name === 'priority boarding'
            || item.item_name === 'insurance');

                    
        this.DigitalDataService.addDigitalDataEcommerceEvent(cart.ecommerce, 'remove_from_cart');
        this.DigitalDataService.setRemoveInfoAddToCart(cart.ecommerce);
        const addToCart: any = this.localStorageService.get('addToCart');
        if (addToCart) this.DigitalDataService.addDigitalDataEcommerceEvent(addToCart.ecommerce, 'add_payment_info');    

    };

}
AncillariesService.$inject = [
    '$location',
    'AncGetCachedInformationService',
    'BookingAncillariesTransformer',
    'localStorageService',
    'CommonsAncillariesService',
    'CurrencyService',
    'ModalServiceAncillaries',
    'BookingAncillariesConstant',
    '$rootScope',
    'CommonsModalService',
    'DatalayerUtilsService',
    'IbCPermanentUserService',
    'CommonsLoginUtilsService',
    'CommonsGetLoginInfoService',
    'NewMainHeaderFacade',
    'CallBundleService',
    'DatalayerUtils',
    'DatalayerConstants',
    'DigitalDataService'
];
try {
    const mod = angular.module('ib-booking-ancillaries-module');
    mod.service(
        'BookingAncillariesService',
        AncillariesService
    );
} catch (error) {
    const mod = angular.module('ib-booking-ancillaries-module', []);
    mod.service(
        'BookingAncillariesService',
        AncillariesService
    );
}
