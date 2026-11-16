
import * as angular from 'angular';
import {MmBDatalayerUtilsService} from '../services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service';

import { CallBundleService } from './ib-call-bundle-service';
import {AncillariesMMBConstants} from '../ib-MmB-ancillaries-page/constants/ib-MmB-ancillaries-constants';
import { AncGetCachedInformationService } from 'ib-web-ancillaries';
import { AncillariesTransformer } from 'ib-web-ancillaries/dist/app/features/transformers/ib-web-ancillaries-transformer';
import { AncillariesCallPaymentsService } from 'ib-web-ancillaries/dist/app/features/services/pmt-ppm/services/ib-call-payments-service';
import { ModalServiceAncillaries } from 'ib-web-ancillaries/dist/app/features/components/ib-modal/services/ib-modal-ancillaries-service';
import { PmtMethodsUpgradingBidsService } from 'ib-web-ancillaries/dist/app/features/services/rdu-loc/services/ib-upg-bids-pmt-methods-service';
import { PmtUpgBidsCreditCardsService } from 'ib-web-ancillaries/dist/app/features/services/cust-cust/services/ib-pmt-credit-cards-service';

export class MmBAncillariesService {

    constructor (
        private $location: ng.ILocationService,
        private AncGetCachedInformationService: AncGetCachedInformationService,
        private AncillariesTransformer: AncillariesTransformer,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private AncillariesCallPaymentsService: AncillariesCallPaymentsService,
        private CommonsAncillariesService: CommonsAncillariesService,
        private CurrencyService: CurrencyService,
        private ModalServiceAncillaries: ModalServiceAncillaries,
        private AncillariesMMBConstants: AncillariesMMBConstants,
        private PmtMethodsUpgradingBidsService: PmtMethodsUpgradingBidsService,
        private GetCountriesListService: GetCountriesListService,
        private PmtUpgBidsCreditCardsService: PmtUpgBidsCreditCardsService,
        private $rootScope: CommonsRootScope,
        private CommonsModalService: CommonsModalService,
        private DatalayerUtilsService: MmBDatalayerUtilsService,
        private IbCPermanentUserService: any,
        private CommonsLoginUtilsService: any,
        private CommonsGetLoginInfoService: any,
        private NewMainHeaderFacade: any,
        private DatalayerMenusService: any,
        private CallBundleService: CallBundleService
    ) { }


    ////////////////

    /**
    * Get ancillaries information from localstorage
    *
    */
    searchAncillariesInfo = (): angular.IPromise<any> => {
        let cachedDataInfo;
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


            if (ancillariesInfo) {
                if (cachedInfo) {
                    cachedDataInfo = cachedInfo;
                    this.CommonsAncillariesService.getAncillarieSummary().then(cachedInformationSuccess, this.showError);
                } else {
                    this.AncGetCachedInformationService.getCachedInformation().then(
                        (CachedInformation) => {
                            cachedDataInfo = CachedInformation;
                            this.CommonsAncillariesService.getAncillarieSummary().then(cachedInformationSuccess, this.showError);
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
    generateRequestAncillaries = (baggagesTrips: any, speqsTrips: any, insuranceInfo: any) => {
        const flowApp: string = this.localStorageService.get('flowApp');
        const cancelInsuranceSuccess = () => {
            if ((baggagesTrips && baggagesTrips.length > 0) || (speqsTrips && speqsTrips.length > 0) || insuranceInfo) {
                const infoTransformed = this.AncillariesTransformer.buildAncillariesRequest(baggagesTrips, speqsTrips, insuranceInfo);
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
            const deleteInfo = [{ type: this.AncillariesMMBConstants.TYPE_ANCILLARIE.INSURANCE }];
            this.localStorageService.set('hasSelectedInsurance', false);
            this.CommonsAncillariesService.deleteAncillarie(deleteInfo).then((data) => {
                if (data.failedToDelete && data.failedToDelete.length > 0) {
                    switch (flowApp) {
                            case this.AncillariesMMBConstants.APPLICATION_FLOW.BBOOKING:
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
                this.$location.path(this.AncillariesMMBConstants.PAGES_ROUTES.PAYMENTS);
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
        if (flowApp === this.AncillariesMMBConstants.APPLICATION_FLOW.BBOOKING) {
            this.ModalServiceAncillaries.openAncillariesErrorModal(
                {
                    title: 'ERROR_ANCILLARIES_BKI_TO_PAYMENT_TITLE',
                    message: 'ERROR_ANCILLARIES_BKI_TO_PAYMENT_BODY',
                    flowApp: flowApp
                }).result.then(removeAncillariesAndContinueToPayment);

        // } else if(flowApp === this.AncillariesMMBConstants.APPLICATION_FLOW.CHECKIN) {
        //     this.ModalServiceAncillaries.openAncillariesErrorModal(
        //         {
        //             title: 'ERROR_ANCILLARIES_CKI_TO_PAYMENT_TITLE',
        //             message: 'ERROR_ANCILLARIES_CKI_TO_PAYMENT_BODY'
        //         });
        } else {
            this.showServiceError(error);
        }

    }

    getPaymentsSuccess = (data: any) => {
        const flowApp = this.localStorageService.get('flowApp');
        if (data.paymentMethods && data.paymentMethods.length > 0 && data.paymentMethods[0].total > 0) {
            this.ModalServiceAncillaries.isNotWaiting();
            this.localStorageService.set('paymentsInfo', data);
            this.checkPermanentUserAndGoPayment();
        } else {
            this.ModalServiceAncillaries.isNotWaiting();
            this.localStorageService.set('nextStepAllowed', false);
            switch (flowApp) {
                    case this.AncillariesMMBConstants.APPLICATION_FLOW.BBOOKING:
                        this.$location.path(this.AncillariesMMBConstants.PAGES_ROUTES.AVAILABILITY);
                        break;
                    case this.AncillariesMMBConstants.APPLICATION_FLOW.MMB:
                        break;
                    default:
                        this.$location.path(this.AncillariesMMBConstants.PAGES_ROUTES.BOARDING_CARDS);
                        break;
            }
        }
    };

    private checkPermanentUserAndGoPayment = (): void => {
        if (this.localStorageService.get('flowApp') === this.AncillariesMMBConstants.APPLICATION_FLOW.CHECKIN) {
            this.IbCPermanentUserService.checkPermanentUserFlow('CKI')
                .then(() => {
                    this.$location.path(this.AncillariesMMBConstants.PAGES_ROUTES.PAYMENTS);
                })
                .catch(() => {});
        } else {
            this.$location.path(this.AncillariesMMBConstants.PAGES_ROUTES.PAYMENTS);
        }
    };

    redirectAfterLoginSoftUser = (): boolean => {
        const isAfterLoginPermanentUser = this.IbCPermanentUserService.isAfterLoginPermanentUser();
        const ifFlowCKI = this.localStorageService.get('flowApp') === this.AncillariesMMBConstants.APPLICATION_FLOW.CHECKIN;
        const hasToBeRedirected = ifFlowCKI && isAfterLoginPermanentUser;
        if (hasToBeRedirected) {
            //this.CommonsModalService.showWaitingModal('ib-modal-loading-plane-pmt', 'ib-modals ib-modals--transparent', true);
            this.CommonsGetLoginInfoService.checkCustomerStatus(true).then(
                () => {
                    this.CommonsModalService.closeAllCurrentModals();
                    this.$location.path(this.AncillariesMMBConstants.PAGES_ROUTES.PAYMENTS);
                },
                () => {
                    this.CommonsModalService.closeAllCurrentModals();
                    this.CommonsLoginUtilsService.updateStateToAnonymous();
                    this.IbCPermanentUserService.removeParamsAfterLogin();
                }
            );

        }
        return hasToBeRedirected;
    };

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
            this.$location.path(this.AncillariesMMBConstants.PAGES_ROUTES.BOARDING_CARDS);
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
            type: this.AncillariesMMBConstants.TYPE_ANCILLARIE.SEAT,
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
                case this.AncillariesMMBConstants.APPLICATION_FLOW.BBOOKING:
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
        const price = { originalPrice: 0, currencyPrice: '0' };
        price.currencyPrice = this.CurrencyService.formatPrice(currency, offer.premium, true, false);
        price.originalPrice = offer.premium;

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
         * Return payment methods for upgrading bids
         * @param {Object} issueCountry
         * @param {Object} changeCountry
         */
    getPaymentMethodsUpgradingBids = (issueCountry, totalBidsPrice, currency) => {
        let paymentInfo;
        return new Promise((resolve, reject) => {
            const getCreditCardsSuccess = (data) => {
                this.localStorageService.set('creditCardsImgsInfo', data);
                const getPaymentMethodsSuccess = (cachedData) => {
                    paymentInfo = this.AncillariesTransformer.generateModelPayMethods(cachedData, issueCountry);
                    this.localStorageService.set('upgradingPaymentsInfo', paymentInfo);
                    resolve(cachedData);
                }
                this.PmtMethodsUpgradingBidsService.getPaymentMethodsUpgradingBids(issueCountry, totalBidsPrice, currency).then(getPaymentMethodsSuccess, errorService);
                
            };
            const errorService = (error) => {
                reject(error);
            }
            const getCountriesListSucces = (countriesList) => {
                this.localStorageService.set('countriesList', countriesList);
                this.PmtUpgBidsCreditCardsService.getCreditCardsImgs().then(getCreditCardsSuccess, errorService);
            };
            this.GetCountriesListService.getCountriesList().then(getCountriesListSucces, () => {
                getCountriesListSucces([]);
            });
        });
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
                this.ModalServiceAncillaries.setErrorMessage(error.message);
                this.ModalServiceAncillaries.setErrorCode(error.internalErrorCode);
                this.ModalServiceAncillaries.isError(error, null, null);
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
            type: this.AncillariesMMBConstants.TYPE_ANCILLARIE.UPGRADING_BID,
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
                type: this.AncillariesMMBConstants.TYPE_ANCILLARIE.CO2_FOOTPRINT,
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
        const deleteInfo = [{ type: this.AncillariesMMBConstants.TYPE_ANCILLARIE.CO2_FOOTPRINT }];
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
                [this.AncillariesMMBConstants.TYPE_ANCILLARIE.FLEXIBILITY]: 'genAviosAncillariesFlex',
                [this.AncillariesMMBConstants.TYPE_ANCILLARIE.PRIORITY_BOARDING]: 'genAviosAncillariesPriority',
                [this.AncillariesMMBConstants.TYPE_ANCILLARIE.SEAT]: 'genAviosAncillariesSeat',
                [this.AncillariesMMBConstants.TYPE_ANCILLARIE.BAGGAGE]: 'genAviosAncillariesBaggages',
                [this.AncillariesMMBConstants.TYPE_ANCILLARIE.SPEQS]: 'genAviosAncillariesSpeq'
            };
            try {
                this.localStorageService.set(anciDict[type], data.map(el => ({id: el.id, ancillaries: el.ancillaries.filter(anci => anci?.type === type)})));
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
        if (this.localStorageService.get('flowApp') === this.AncillariesMMBConstants.APPLICATION_FLOW.CHECKIN) {
            this.AncillariesCallPaymentsService.getPayments().then(this.getPaymentsSuccess, this.showServiceError);
        } else {
            // Call put bundle if it is selected
            const selectedBundle: any = this.localStorageService.get('selectedBundle');
            if(selectedBundle) {
                selectedBundle.bundleId = selectedBundle.id;
                selectedBundle.bundleItems = selectedBundle.items;
                this.createBundleRequest(selectedBundle);
            } else {
                this.redirectToPayments();
            }
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
        this.$location.path(this.AncillariesMMBConstants.PAGES_ROUTES.PAYMENTS_MMB_ON_HOLD);
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

        this.DatalayerMenusService.updateDataLayer(cart.ecommerce);

    };

}
MmBAncillariesService.$inject = [
    '$location',
    'AncGetCachedInformationService',
    'AncillariesTransformer',
    'localStorageService',
    'AncillariesCallPaymentsService',
    'CommonsAncillariesService',
    'CurrencyService',
    'ModalServiceAncillaries',
    'AncillariesMMBConstants',
    'PmtMethodsUpgradingBidsService',
    'GetCountriesListService',
    'PmtUpgBidsCreditCardsService',
    '$rootScope',
    'CommonsModalService',
    'DatalayerUtilsService',
    'IbCPermanentUserService',
    'CommonsLoginUtilsService',
    'CommonsGetLoginInfoService',
    'NewMainHeaderFacade',
    'DatalayerMenusService',
    'CallBundleService'
];
try {
    const mod = angular.module('ib-MmB-services-module');
    mod.service(
        'MmBAncillariesService',
        MmBAncillariesService
    );
} catch (error) {
    const mod = angular.module('ib-MmB-services-module', []);
    mod.service(
        'MmBAncillariesService',
        MmBAncillariesService
    );
}
