import * as angular from 'angular';
import { DigitalBoardingService } from './ib-digital-boarding-service';
import { FrequentFlyersCompaniesService } from './ib-frequent-flyers-companies-service';
import { MmBAirlinesLogoService } from './ib-MmB-airlines-logo-service';
import { CalculatePointsService } from './ib-Mmb-calculate-points-service';
import { CashRefundService } from './ib-Mmb-cash-refund-service';
import { MmbInvoluntaryChangeService } from './ib-mmb-involuntary-change-service';
import { VoucherInformationService } from './ib-Mmb-voucher-information-service';
import { ReshopConditionsService } from './ib-reshop-conditions-service';
import { RetrieveOrderService } from './ib-retrieve-order-service';
import { SisterCitiesService } from './ib-sister-cities-service';
import { VipLoungesService } from './ib-MmB-vip-lounges-service';
import { GastroOfferService } from './ib-MmB-gastro-offer-service';
import { ibCCalculatePointsService } from 'ib-web-commons/app/core/http-services/prlm-pc/ib-calculate-points-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { DEFAULT_SISTER_CITIES_REQUEST_MODEL, SisterCitiesRequestModel } from '@src/app/core/models/availability-model/sister-cities-request-model/sister-cities-request.model';
import { MMBDatalayerConstants } from './ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';
import { IbMmbOrderHandlerService } from './ib-MmB-order-handler.service';
import { LoadingSpinnerService } from '@src/app/shared/components/loading-spinner/loading-spinner.service';
import { MmBUtilsSharedService } from './Utils/ib-MmB-utils-shared-service';
import { MmBUtilService } from './Utils/ib-MmB-utils';
import { IbMmbRetrieveOrderOtpProtectedService } from './ib-MmB-retrieve-order-otp-protected.service';
@Service(
    'ib-MmB-services-module',
    ['FrequentFlyersCompaniesService',
        'CommonsCommercialInfobyMarketService',
        'RetrieveOrderService',
        'IbMmbOrderHandlerService',
        'localStorageService',
        '$location',
        'MmBAppConstants',
        'MmBModalService',
        'MmBUtilService',
        'MmBAirlinesLogoService',
        '$cookies',
        '$rootScope',
        'MmbInvoluntaryChangeService',
        'BookingManagementService',
        'BookingNameService',
        'DigitalBoardingService',
        'CurrencyService',
        '$window',
        'IbFlagsTransformer',
        'VoucherInformationService',
        'CashRefundService',
        'SisterCitiesService',
        'CalculatePointsTransformer',
        'ChangleFlightsService',
        'CommonsAncillariesService',
        'ReshopConditionsService',
        '$filter',
        'CommonsModalService',
        'GastroOfferService',
		'VipLoungesService',
        'ibCCalculatePointsService',
        'LoadingSpinnerService',
        'RedirectionService',
        'MmBUtilsSharedService',
        'IbMmbRetrieveOrderOtpProtectedService',
    ],
    []
)
export class BookingSearchService {
    private reshopConditionsResponse : BehaviorSubject<any>;
    public readonly reshopConditionsResponseObser : Observable<any>;
    constructor (
        private FrequentFlyersCompaniesService: FrequentFlyersCompaniesService,
        private CommonsCommercialInfobyMarketService: CommonsCommercialInfobyMarketService,
        private RetrieveOrderService: RetrieveOrderService,
        private IbMmbOrderHandlerService: IbMmbOrderHandlerService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $location: angular.ILocationService,
        private MmBAppConstants,
        private MmBModalService,
        private MmBUtilService: MmBUtilService,
        private MmBAirlinesLogoService: MmBAirlinesLogoService,
        private $cookies: angular.cookies.ICookiesService,
        private $rootScope: any,
        private MmbInvoluntaryChangeService: MmbInvoluntaryChangeService,
        private BookingManagementService,
        private BookingNameService,
        private DigitalBoardingService: DigitalBoardingService,
        private CurrencyService: CurrencyService,
        private $window: angular.IWindowService,
        private IbFlagsTransformer,
        private VoucherInformationService: VoucherInformationService,
        private CashRefundService: CashRefundService,
        private SisterCitiesService: SisterCitiesService,
        private CalculatePointsTransformer,
        private ChangleFlightsService,
        private CommonsAncillariesService: CommonsAncillariesService,
        private ReshopConditionsService: ReshopConditionsService,
        private $filter: ng.FilterFactory,
        private CommonsModalService: any,
        private GastroOfferService: GastroOfferService,
		private VipLoungesService: VipLoungesService,
        private ibCCalculatePointsService: ibCCalculatePointsService,
        private LoadingSpinnerService: LoadingSpinnerService,
        private RedirectionService: RedirectionService,
        private MmBUtilsSharedService: MmBUtilsSharedService,
        private IbMmbRetrieveOrderOtpProtectedService: IbMmbRetrieveOrderOtpProtectedService

    ) {
        this.reshopConditionsResponse = new BehaviorSubject({});
        this.reshopConditionsResponseObser = this.reshopConditionsResponse.asObservable();
    }

    searchFlightsPassengers = (surname, pnr, updateInvoiceInfo?) => {
        return new Promise((resolve, reject) => {
            const continueWithCommercialInfo = () => {
                this.CommonsCommercialInfobyMarketService.getCommercialInfo().then((commercialInfo) => {
                    this.localStorageService.set('commercialInfo', transformCommercialInfo(commercialInfo));
                    this.MmBAirlinesLogoService.getAirlinesLogos().then(() => getAirlinesFinish(resolve, reject), () => getAirlinesFinish(resolve, reject));
                }, (error) => serviceError(error, resolve, reject));
            };

            const getAirlinesFinish = (resolve, reject) => {
                const resolveData = (bookingData) => {
                    const setDataAboutBooking = (bookingData) => {
                        this.localStorageService.set('PNR', bookingData.order.bookingReferences[0].reference);
                        this.localStorageService.set('checkinSurname', bookingData.passengers[0].personalInfo.surname);
                    };

                    const bookingInfo = this.checkOrderInfo(bookingData);
                    if (this.localStorageService.get('deepLinkParams')) {
                        setDataAboutBooking(bookingData);
                    };
                    if (bookingInfo.isAirShuttle) {
                        resolve(bookingInfo);
                    } else {
                        if (bookingInfo.order.status === this.MmBAppConstants.SLICE_STATUS.ON_HOLD_CONFIRMABLE || bookingInfo.order.status === this.MmBAppConstants.SLICE_STATUS.HOLD || bookingInfo.order.status === this.MmBAppConstants.SLICE_STATUS.FRAUD_ONHOLD) {
                            const resident = bookingData.order?.specialDiscounts?.filter((specialDiscount) => specialDiscount.type === 'RES');
                            // call flight calculation
                            const CalcServiceSuccess = (response) => {
                                this.localStorageService.set(
                                    'CalculatedPoints',
                                    {
                                        ...this.CalculatePointsTransformer.TransCalcPointsData(response),
                                        resident: resident?.length > 0
                                    }
                                );
                                this.localStorageService.set(
                                    'CalculatedPointsForPassenger',
                                    this.CalculatePointsTransformer.TransCalcPointsForPassenger(response)
                                );
                                resolve(bookingInfo);
                            };
                            const CalcServiceFailure = (error) => {
                                this.localStorageService.remove('CalculatedPoints');
                                this.localStorageService.remove('CalculatedPointsForPassenger');
                                resolve(bookingInfo);
                            };
                            const request = this.CalculatePointsTransformer.genCalAviosSummary(bookingData, null, null, true);
                            this.localStorageService.set('flightAviosInfo', request);
                            this.ibCCalculatePointsService
                                .getCalculateFlightsAvios(request)
                                .then(CalcServiceSuccess, CalcServiceFailure);

                        } else {
                            resolve(bookingInfo);
                        };

                        resolve(bookingInfo);
                    };

                    if (updateInvoiceInfo) this.$rootScope.$broadcast('updateInvoiceInfo');
                };

                const airShuttleCookie = this.$cookies.getObject(this.MmBAppConstants.COOKIES.CHECKIN_ID);
                const flightId = this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.FLIGHT_ID, null) || null;
                if (this.MmBUtilService.getParameterByName('step', null) && airShuttleCookie) {
                    this.RetrieveOrderService.retrieveOrderByCheckinId(airShuttleCookie.checkinId).then((bookingInfo) => {
                        this.$cookies.remove(this.MmBAppConstants.COOKIES.CHECKIN_ID, { path: this.MmBAppConstants.COOKIES.DEFAULT_PATH });
                        resolveData(bookingInfo);
                    }, (error) => serviceError(error, resolve, reject));
                } else if (this.localStorageService.get('deepLinkParams')) {
                    this.RetrieveOrderService.retrieveOrderByDeepLink(this.localStorageService.get('deepLinkParams')).then(resolveData, (error) => serviceError(error, resolve, reject));
                }
                else if (flightId) {
                    this.RetrieveOrderService.retrieveOrderByFlightId(flightId).then(resolveData, (error) => serviceError(error, resolve, reject));
                } else {
                    let parms = { pnr, surname, resolveData, reject, serviceError };
                    this.handleRetrievalFlow(parms);
                }
            };

            const serviceError = (error, resolve, reject) => {
                const airShuttleCookie = this.$cookies.getObject(this.MmBAppConstants.COOKIES.CHECKIN_ID);
                let objectCookieError = {};
                if (this.MmBUtilService.getParameterByName('step', null) && airShuttleCookie) {
                    // if the entry point comes from CHECKIN PA and there is an error, come back to CHECKIN PA APP With error
                    objectCookieError = {
                        nextStep: airShuttleCookie.fromStep,
                        errorCode: this.MmBAppConstants.GDR_PA_ERRORS.ERR_1
                    };
                    sessionStorage.setItem(this.MmBAppConstants.COOKIES.AIR_SHUTTLE_ERROR, JSON.stringify(objectCookieError));
                    sessionStorage.removeItem(this.MmBAppConstants.COOKIES.CHECKIN_ID);
                    this.localStorageService.set('externalRedirect', true);
                    reject(error);
                } else {
                    reject(error);
                }
            };

            const transformCommercialInfo = (commercialInfo) => {
                let i = 0, mFound = false, defaultMarket = {}, marketInfo;
                while (!mFound && i < commercialInfo.length) {
                    if (commercialInfo[i].market.code === this.MmBAppConstants.market) {
                        mFound = true;
                        marketInfo = commercialInfo[i];
                    } else if (commercialInfo[i].market.code === this.MmBAppConstants.defaultMarket) {
                        defaultMarket = commercialInfo[i];
                    }
                    i++;
                }
                return marketInfo || defaultMarket;
            };

            if (pnr && surname) {
                pnr = pnr.toUpperCase();
                this.localStorageService.set('PNR', pnr);
                this.localStorageService.set('checkinSurname', surname);
            }
            if (this.localStorageService.get('deepLinkParams')) {
                continueWithCommercialInfo();
            } else {
                this.FrequentFlyersCompaniesService.getFrequentFlyersCompaniesPromised().then(() => {
                    continueWithCommercialInfo();
                }, (error) => serviceError(error, resolve, reject));
            }
        });
    };

    private handleRetrievalFlow = (params) => {
        const { pnr, surname, resolveData, reject, serviceError } = params;
        const url = new URL(window.location.href);
        const flowBob = url.searchParams.get('flowBob');

        if (!flowBob) {
            this.handleParallelOrderRetrieval(pnr, surname)
                .then(resolveData)
                .catch(error => serviceError(error, resolveData, reject));
        } else {
            this.IbMmbRetrieveOrderOtpProtectedService.retrieveOrder(surname, pnr)
                .then(resolveData)
                .catch(err => {
                    this.LoadingSpinnerService.hide();
                    reject(err);
                });
        }
    };

    private handleParallelOrderRetrieval = (pnr: string, surname: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            // const orderHandler$ = this.IbMmbOrderHandlerService.retrieveOrderHandler(surname, pnr);
            const importOrderPromise = this.IbMmbRetrieveOrderOtpProtectedService.retrieveOrder(surname, pnr);

            // const orderHandlerSubscription = orderHandler$.subscribe({
            //     next: resp => {
            //         const lightData = { ...resp.data, isPartialData: true };
            //         this.localStorageService.set('bookingInfoLight', lightData);
            //         // this.$rootScope.$broadcast('orderHandlerReady', lightData);

            //         this.externalFlowsRedirections(lightData);

            //     },
            //     error: err => {
            //         //nothing to do
            //     },
            // });
            importOrderPromise.then(result => {
                resolve(result);
            }).catch(err => {
                // if (orderHandlerSubscription && typeof orderHandlerSubscription.unsubscribe === 'function') {
                //     orderHandlerSubscription.unsubscribe();
                // };
                this.LoadingSpinnerService.hide();
                reject(err);
            });
        });
    }
    externalFlowsRedirections(lightData) {
        const { type, flexibleDisruptedStatus, status } = lightData.order;
        let result: boolean = false;
        const isGroupPNR = type === 'PNR_GROUP';
        if (isGroupPNR) {
            return;
        }
        if (type === "AIR_SHUTTLE_FIXED" || type === "AIR_SHUTTLE_OPEN") {
            this.$location.path(this.MmBAppConstants.PAGES_URL.AIR_SHUTTLE_PAGE);
        } else if (flexibleDisruptedStatus === "DISRUPTED") {
            this.$location.path(this.MmBAppConstants.PAGES_URL.DISRUPTED_PAGE);
        } else if (status === "ON_HOLD") {
            const onHoldQuadrigam = this.MmBAppConstants.PAGES_URL.CONFIRM_ON_HOLD;
            const market = this.$rootScope.appMarket;
            const language = this.$rootScope.appLang.toLowerCase();
            const mainUrl = `${this.$window.location.origin}/flights/`;
            const endPath = `?market=${market}&language=${language}&pnr=${lightData?.order?.clientLocator}&surname=${lightData?.passengers[0]?.personalInfo?.surname}#!${onHoldQuadrigam}`;
            const url = mainUrl + endPath;
            this.RedirectionService.externalRedirect(url, false);
            this.LoadingSpinnerService.hide();
        } else {
            this.$location.path(this.MmBAppConstants.PAGES_URL.MMB_DASHBOARD);
        }
    };


    checkOrderInfo = (bookingInfo) => {
        let airShuttleIndex = 0, airShuttleFound = false, segmentsInfo = { isAirShuttle: false, isOnHold: bookingInfo.order.status === this.MmBAppConstants.SLICE_STATUS.ON_HOLD_CONFIRMABLE || bookingInfo.order.status === this.MmBAppConstants.SLICE_STATUS.HOLD || bookingInfo.order.status === this.MmBAppConstants.SLICE_STATUS.FRAUD_ONHOLD };
        while (!airShuttleFound && airShuttleIndex < bookingInfo.order.slices.length) {
            airShuttleFound = bookingInfo.order.slices[airShuttleIndex].type === this.MmBAppConstants.SLICE_TYPES.SHUTTLE;
            airShuttleIndex++;
        }
        segmentsInfo.isAirShuttle = airShuttleFound;
        angular.extend(bookingInfo, segmentsInfo);
        return bookingInfo;
    };

    retrieveOrderComplete = (bookingData, data) => {
        if(data && data==="bookingName") this.MmBModalService.showWaitingModal();
        let flagsInfo, refundsRequest = { flowId: '' }, showSisterCitiesPossibility = false, allowSisterCities = false;
        this.localStorageService.set('flowId', bookingData.flowId);
        this.localStorageService.set('pnrChannel', bookingData.channel);

        flagsInfo = this.IbFlagsTransformer.generateFlagsMenu(bookingData);

        if (bookingData && bookingData.isAirShuttle !== true) {
            this.getReshopConditions(bookingData);
        };

        if (flagsInfo.sisterCitiesData && flagsInfo.sisterCitiesData.hasSistercitiesPossibility) {
            allowSisterCities = this.MmBUtilsSharedService.getFlagValue(bookingData.orderFlags, 'type', 'enabled', 'ALLOWED_SISTER_CITIES');
            this.allowSisterCities(allowSisterCities, flagsInfo, bookingData, refundsRequest);
        } else {
            this.getVoucherAndCashData(flagsInfo, refundsRequest, bookingData, showSisterCitiesPossibility);
        };
    };

    private allowSisterCities = (allowSisterCities, flagsInfo, bookingData, refundsRequest) => {
        let sisterCitiesRequest, showSisterCitiesPossibility = false, paramsSisterCities;
        if (allowSisterCities) {
            if (flagsInfo.sisterCitiesData.allowedSlices && flagsInfo.sisterCitiesData.allowedSlices.length >= 1) {
                sisterCitiesRequest = this.createSisterCitiesRequest(flagsInfo.sisterCitiesData.allowedSlices, this.isDisruptionOrder(bookingData), bookingData);
                paramsSisterCities = {sisterCitiesRequest, flagsInfo, refundsRequest, bookingData, showSisterCitiesPossibility};
                this.getSisterCities(paramsSisterCities);
            } else {
                this.getVoucherAndCashData(flagsInfo, refundsRequest, bookingData, showSisterCitiesPossibility);
            }
        } else {
            this.getVoucherAndCashData(flagsInfo, refundsRequest, bookingData, showSisterCitiesPossibility);
        }
    };

    private getReshopConditions = (bookingData) => {
         this.ReshopConditionsService.getReshopConditions(bookingData.flowId).then((response: any) => {
            if (response.flightChangeCapabilities) {
                this.localStorageService.set('reshopConditions', response.flightChangeCapabilities);
                this.reshopConditionsResponse.next(response.flightChangeCapabilities);
            }
            if (response.disruptionSeatChangeCapabilites) {
                this.localStorageService.set('disruptionSeatChangeCapabilities', response.disruptionSeatChangeCapabilites);
            } else {
                this.localStorageService.remove('disruptionSeatChangeCapabilities');
            }
        }, angular.noop);
    };

    private getSisterCities = (params) => {
        let { sisterCitiesRequest, flagsInfo, refundsRequest, bookingData, showSisterCitiesPossibility } = params;
        this.SisterCitiesService.getSisterCities(sisterCitiesRequest).then(
            (response) => {
                showSisterCitiesPossibility = this.isSisterCitiesEnabled(response);
                this.localStorageService.set('sisterCitiesRawModel', response);
                this.getVoucherAndCashData(flagsInfo, refundsRequest, bookingData, showSisterCitiesPossibility);
            },
            () => this.getVoucherAndCashData(flagsInfo, refundsRequest, bookingData, showSisterCitiesPossibility)
        );
    };

    private continueFlow = (bookingData) => {
        this.localStorageService.set('bookingInfo', bookingData);
        this.ChangleFlightsService.getDisruptionPeriods().then((response) => {
            this.localStorageService.set('disruptionPeriodsInfo', true);
            this.localStorageService.set('blackOutPeriodsData', response);
            this.localStorageService.set('textBlackoutPeriods', this.MmBUtilService.formatDisruptionAndFlexibilizationDates(response.blackOutPeriods, 'BLACKOUT'));
            this.localStorageService.set('textAllowedPeriods', this.MmBUtilService.formatDisruptionAndFlexibilizationDates(response.allowedPeriods, 'ALLOWED_PERIODS'));
            this.localStorageService.set('allowedPeriods', response.allowedPeriods);

            this.goAhead(bookingData);
        }, (error) => {
            this.localStorageService.set('disruptionPeriodsInfo', false);
            this.goAhead(bookingData);
        });
    };

    private goAhead = (bookingData) => {
        let nextStep;
        if (this.isOnHoldAndMmbMarket(bookingData)) {
            this.localStorageService.set('bookingInfo', bookingData);
            nextStep = this.getNextStep(bookingData);
            this.actionDashboardAndInvoluntaryChange(nextStep, bookingData);
        } else {
            const error = { message: 'REST_SERVICE_ERROR_GENERAL', needsTranslate: true };
            this.MmBModalService.showWaitingModal();
            this.MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
        };
    };

    private actionDashboardAndInvoluntaryChange = (nextStep, bookingData) => {
        if (nextStep === this.MmBAppConstants.PAGES_URL.MMB_INVOLUNTARY_CHANGE || nextStep === this.MmBAppConstants.PAGES_URL.MMB_DASHBOARD) {
            const locator = this.localStorageService.get('PNR');
            //Get digitalBoarding info and save in localstorage
            this.DigitalBoardingService.getDigitalBoardingAvailability(bookingData).then(this.getDigitalBoardingSuccess, this.getDigitalBoardingError);
            //Get Ancillaries info and save in localstorage
            this.CommonsAncillariesService.getAncillaries(undefined, locator).then((response => this.getAncillariesSuccess(response, bookingData, nextStep)), () => this.getAncillariesError(bookingData, nextStep));
            //Get VipLounges info and save in localstorage
            this.loadVipLoungesData(nextStep,bookingData);
        } else {
            if (this.$location.path() === nextStep) {
                this.$window.location.reload();
            } else {
                nextStep === this.MmBAppConstants.PAGES_URL.CONFIRM_ON_HOLD && this.handleOnHoldBooking(bookingData);
                this.$location.path(nextStep);
            }
        };
    };
    private shouldCallVipLounges(): boolean {
        return this.MmBUtilService.isUserLogged();
    }
    private loadVipLoungesData(nextStep: string, bookingData): void {
        if (!this.shouldCallVipLounges()) {
            return;
        }
        const custData: any = this.localStorageService.get('customerData');
        const ibPlusNumber = custData?.personalInfo?.ibPlusNumber;

        this.VipLoungesService.getVipLounges(
            bookingData.flowId,
            ibPlusNumber
        ).then(
            response => this.vipLoungesSuccess(response, nextStep),
            () => this.vipLoungesError(nextStep)
        );
    }
    private getVoucherAndCashData = (flagsInfo, refundsRequest, bookingData, showSisterCitiesPossibility) => {
        this.localStorageService.set('showSisterCitiesPossibility', showSisterCitiesPossibility);
        if (flagsInfo.showRefundVoucherSection) {
            refundsRequest.flowId = bookingData.flowId;
            this.VoucherInformationService.getVoucherAmount(bookingData.flowId, refundsRequest)
                .then(response => this.setVoucherPrice(response, flagsInfo, bookingData, refundsRequest),
                    () => { this.continueFlow(bookingData); return undefined; }
                );
        } else if (flagsInfo.showCashRefundOnline) {
            refundsRequest.flowId = bookingData.flowId;
            this.CashRefundService.getCashRefundInformation(bookingData.flowId, refundsRequest)
                .then(response => this.generateCashRefundInformation(response, bookingData), () => this.continueFlow(bookingData));
        } else {
            this.continueFlow(bookingData);
        }
    };

    private getNextStep = (bookingData) => {
        let stepParam = this.MmBUtilService.getParameterByName('step', null);
        let segmentIdParam = this.MmBUtilService.getParameterByName('segmentId', null);

        const { returnedStep, flowTitlesApp } = this.getReturnedStep(bookingData);

        this.localStorageService.set('flowTitlesApp', flowTitlesApp);

        if (stepParam) {
            this.handleStepParam(stepParam, segmentIdParam);
        }

        return returnedStep;
    };

    private getReturnedStep = (bookingData) => {
        let flowTitlesApp = this.MmBAppConstants.TITLES_APP.MANAGEMYBOOKING_ANCILLARIES;
        let ibvProduct = false;
        let returnedStep;

        this.$rootScope.isDisruptionFlow = false;
        if (bookingData.isOnHold) {
            this.localStorageService.set('flowApp', 'MMBOH');
            returnedStep = this.MmBAppConstants.PAGES_URL.CONFIRM_ON_HOLD;
        } else if (bookingData.isAirShuttle) {
            flowTitlesApp = this.MmBAppConstants.TITLES_APP.SHUTTLE;
            returnedStep = this.MmBAppConstants.PAGES_URL.BOOKING_MANAGE;
        } else if (this.isDisruptionOrder(bookingData)) {
            this.localStorageService.set('flowApp', 'MMBANC');
            this.localStorageService.set('rebookDisable', false);
            this.$rootScope.isDisruptionFlow = true;
            ibvProduct = this.checkIBVProduct(bookingData);
            returnedStep = ibvProduct ? this.MmBAppConstants.PAGES_URL.MMB_INVOLUNTARY_CHANGE : this.MmBAppConstants.PAGES_URL.DISRUPTION_DASHBOARD;
        } else if (this.MmbInvoluntaryChangeService.hasInvoluntaryChange(bookingData.order.status)) {
            this.localStorageService.set('flowApp', 'MMBANC');
            returnedStep = this.MmBAppConstants.PAGES_URL.MMB_INVOLUNTARY_CHANGE;
        } else {
            this.checkQuadrigam();
            returnedStep = this.MmBAppConstants.PAGES_URL.MMB_DASHBOARD;
        }
        return { returnedStep, flowTitlesApp };
    };

    private handleStepParam = (stepParam, segmentIdParam) => {
        switch (stepParam) {
            case this.MmBAppConstants.STEP_PARAM_VALUES.CHANGE_FLIGHT:
                if (segmentIdParam) {
                    this.localStorageService.set('checkinSegmentId', segmentIdParam);
                    this.$location.search({});
                }
                break;
        }
    };

    private getAncillariesSuccess = (ancillariesResponse, bookingData, nextStep) => {
        const locator = this.localStorageService.get('PNR');
        const isRefreshCall = this.localStorageService.get('isRefreshCall') || null;
        const flightAviosInfoObject = this.CalculatePointsTransformer.genCalAviosSummary(bookingData, ancillariesResponse.slices, bookingData.order.orderItems);
        this.localStorageService.set('flightAviosInfo', flightAviosInfoObject);
        const ancillariesInfo = ancillariesResponse;
        this.localStorageService.set('ancillariesInfo', ancillariesInfo);
        bookingData.nextStep = nextStep;
        if (this.localStorageService.get('sendReloadEvent')) {
            this.$rootScope.$broadcast('reloadMMBDashboard');
        }

        this.CommonsAncillariesService.getAncillarieSummary(undefined, isRefreshCall, locator)
            .then(breakdownResponse => this.getAncillarieSummarySuccess(breakdownResponse, bookingData), () => this.getAncillariesError(bookingData, nextStep))
            .finally(() => {
                if (isRefreshCall) {
                    this.localStorageService.remove('isRefreshCall');
                }
            });
    };

    private getDigitalBoardingSuccess = (digitalBoardingResponse) => {
        this.localStorageService.remove('digitalBoardingInfo');
        if (digitalBoardingResponse.hasData) {
            this.localStorageService.set('digitalBoardingInfo', digitalBoardingResponse.data);
            this.$rootScope.$broadcast('showBoxYourDocuments');
        }
    };

    private getAncillarieSummarySuccess = (breakdownResponse, bookingData) => {
        let breakdownInfo = breakdownResponse;
        let currency: any = {};
        this.checkPreorder(breakdownResponse);
        breakdownResponse.currencies[0] ? currency = breakdownResponse.currencies[0] : currency = bookingData.contextMetadata.currencies[0];
        this.localStorageService.set('breakdownInfo', breakdownInfo);
        this.localStorageService.set('currency', this.CurrencyService.getCurrencyObject(currency));
        this.BookingManagementService.getBookingInfo().then(
            () => this.BookingManagementSuccess(bookingData),
            () => this.BookingManagementError(bookingData)
        );
    };

	private BookingManagementSuccess = (bookingData) => {
        this.GastroOfferService.importGastronomicProposalComponent()
            .then(() => this.digitalMenuStatusSuccess(bookingData), () => this.digitalMenuStatusError(bookingData));
    };

    private BookingManagementError = (bookingData) => {
        this.GastroOfferService.importGastronomicProposalComponent()
            .then(() => this.digitalMenuStatusSuccess(bookingData), () => this.digitalMenuStatusError(bookingData));
    };

    private digitalMenuStatusSuccess = (bookingData) => {
        this.$rootScope.$broadcast('reloadMMBDashboard');
        this.$location.path(bookingData.nextStep);

    };

    private digitalMenuStatusError = (bookingData) => {
        this.$rootScope.$broadcast('reloadMMBDashboard');
        this.$location.path(bookingData.nextStep);
    };
    private vipLoungesSuccess = (vipLoungesResponse, nextStep) => {
        this.localStorageService.set('vipLoungesInvitations', vipLoungesResponse);
        Promise.all([
            this.VipLoungesService.getExclusiveServicesLauncherComponent(),
            this.VipLoungesService.getVipInvitationsComponent(),
            this.VipLoungesService.getFastTrackCardComponent()
        ]).then(
            () => {
                this.$rootScope.$broadcast('vipLoungesDataReady', vipLoungesResponse);
                this.$location.path(nextStep);
            },
            () => {
                this.localStorageService.set('vipLoungesInvitations', null);
                this.$rootScope.$broadcast('vipLoungesDataReady', null);

                this.$location.path(nextStep);
            }
        );
        this.$location.path(nextStep);
    }

    private vipLoungesError = (nextStep) => {
        this.localStorageService.set('vipLoungesInvitations', null);
        this.$rootScope.$broadcast('reloadMMBDashboard');
        this.$location.path(nextStep);
    }

    private getAncillariesError = (bookingData, nextStep) => {
        const deepLinkFlow = this.localStorageService.get('deepLinkParams') ? true : false;
        this.localStorageService.set('breakdownInfo', null);
        this.localStorageService.set('ancillariesInfo', null);
        if (deepLinkFlow) {
            this.$rootScope.$broadcast('modalDeepLinkErrorEvent');
        } else {
            this.$rootScope.$broadcast('reloadMMBDashboard');
            this.$location.path(nextStep);
        }
        this.GastroOfferService.importGastronomicProposalComponent()
            .then(() => this.digitalMenuStatusSuccess(bookingData), () => this.digitalMenuStatusError(bookingData));
    };

    private getDigitalBoardingError = () => {
        this.localStorageService.set('digitalBoardingInfo', null);
    };

    /**
     * Transforms voucher price information and if there is cash refund option, calls the function to transform cash price info; otherwise, the flow continues.
     * @param {Object} voucherInfoResponse | Voucher price information
     */
    private setVoucherPrice = (voucherInfoResponse, flagsInfo, bookingData, refundsRequest) => {
        let voucherOrderItems = null;
        if (voucherInfoResponse.price != null) {
            this.setVoucherOrderItemsPrice(voucherInfoResponse);
        };
        voucherOrderItems = voucherInfoResponse.refundedOrderItems;
        this.localStorageService.set('voucherEmailNotification', this.haveMail(voucherInfoResponse.notifications));
        this.localStorageService.set('voucherOrderItems', voucherOrderItems);
        this.localStorageService.set('voucherCurrenciesList', voucherInfoResponse.currencies);
        this.localStorageService.set('voucherList', voucherInfoResponse.vouchers);
        this.localStorageService.set('refundFees', voucherInfoResponse.refundFees);
        this.transformVoucherPriceInfo(voucherInfoResponse);
        if (flagsInfo.showCashRefundOnline) {
            this.getCashRefundAmountInformation(bookingData, refundsRequest);
        } else {
            this.continueFlow(bookingData);
        };
    };

    private transformVoucherPriceInfo = (voucherInfoResponse) => {
        if (voucherInfoResponse?.price?.fare && voucherInfoResponse?.price?.currency) {
            this.handleTransformVoucherPriceInfo(voucherInfoResponse);
        };
    };

    private handleTransformVoucherPriceInfo = (voucherInfoResponse) => {
        let formattedVoucherPriceInfo: any = {
                'price': 0,
                'formattedPrice': '',
                'priceWOPercentage': 0,
                'priceWOPercentageFormatted': '',
                'percentagePrice': 0,
                'percentagePriceFormatted': 0,
                'percentage': '',
                'currency': '',
                'isPartialRefund': voucherInfoResponse.partialRefund,
                'totalPriceFare': 0,
                'totalPriceTax': 0,
                'totalPriceTotal': 0,
                'totalPriceTotalFormatted': ''
            }, currencyFound = false, currencyIndex = 0, currencyObject: any = {};

        formattedVoucherPriceInfo.price = voucherInfoResponse.price.totalRefund;
        formattedVoucherPriceInfo.currency = voucherInfoResponse.price.currency;
        formattedVoucherPriceInfo.priceWOPercentage = voucherInfoResponse.price.fare;
        formattedVoucherPriceInfo.percentagePrice = voucherInfoResponse.price.extraVoucherAmount;
        formattedVoucherPriceInfo.percentage = this.isExtraVoucherPercent(voucherInfoResponse.price);
        this.localStorageService.set('voucherPartialRefund', voucherInfoResponse.partialRefund);

        while (!currencyFound && currencyIndex < voucherInfoResponse.currencies.length) {
            if (voucherInfoResponse.price.currency === voucherInfoResponse.currencies[currencyIndex].code) {
                currencyFound = true;
                currencyObject = voucherInfoResponse.currencies[currencyIndex];
            } else
                currencyIndex++;
        }
        formattedVoucherPriceInfo.formattedPrice = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(currencyObject), voucherInfoResponse.price.totalRefund, true, false);
        formattedVoucherPriceInfo.priceWOPercentageFormatted = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(currencyObject), voucherInfoResponse.price.fare, true, false);
        formattedVoucherPriceInfo.percentagePriceFormatted = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(currencyObject), voucherInfoResponse.price.extraVoucherAmount, true, false);

        const totalPriceGlobick = this.getPriceGlobick();

        if (voucherInfoResponse.totalPrice &&  totalPriceGlobick === 0) {
            formattedVoucherPriceInfo.totalPriceFare = voucherInfoResponse.totalPrice.fare;
            formattedVoucherPriceInfo.totalPriceTax = voucherInfoResponse.totalPrice.tax;
            formattedVoucherPriceInfo.totalPriceTotal = voucherInfoResponse.totalPrice.total;
            formattedVoucherPriceInfo.totalPriceTotalFormatted = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(currencyObject), voucherInfoResponse.totalPrice.total, true, false);
        } else if (voucherInfoResponse.totalPrice &&  totalPriceGlobick !== 0){
            formattedVoucherPriceInfo.totalPriceFare = voucherInfoResponse.totalPrice.fare - totalPriceGlobick;
            formattedVoucherPriceInfo.totalPriceTax = voucherInfoResponse.totalPrice.tax;
            formattedVoucherPriceInfo.totalPriceTotal = voucherInfoResponse.totalPrice.total - totalPriceGlobick;
            formattedVoucherPriceInfo.totalPriceTotalFormatted = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(currencyObject), formattedVoucherPriceInfo.totalPriceTotal, true, false);
        }

        this.localStorageService.set('voucherPriceInfo', formattedVoucherPriceInfo);
    };

    private isExtraVoucherPercent = (voucherPriceInfo) => {
        return (voucherPriceInfo.extraVoucherPercent !== 0 ? voucherPriceInfo.extraVoucherPercent + '%' : angular.noop);
    };


    private getPriceGlobick = () => {
        const voucherItems:any = this.localStorageService.get('voucherOrderItems');
        if (voucherItems !== null) {
            for (let i=0; i < voucherItems?.length; i++){
                if (voucherItems[i].type === 'globickV2' || voucherItems[i].type === 'globick'){
                    return voucherItems[i].price.fare;
                };
            };
        };
        return 0;
    };

    private setVoucherOrderItemsPrice = (voucherInfoResponse) => {
        let voucherPercentage = 0;
        for (let i = 0; i < voucherInfoResponse.orderItems.length; i++) {
            if (voucherInfoResponse.orderItems[i].subtype === 'VOUCHER_REFUND') {
                voucherPercentage = voucherInfoResponse.orderItems[i].percentage;
            }
        }
        if(voucherPercentage === 0) {
            voucherPercentage = voucherInfoResponse.price.refundPercent;
        }
        this.localStorageService.set('voucherOrderItemsPrice', voucherPercentage);
    };

    private haveMail = (notifications) => {
        let i, result = false;
        for (i = 0; i < notifications.length; i++) {
            if (notifications[i].email) {
                result = true;
            }
        }
        return result;
    };

    private getCashRefundAmountInformation = (bookingData, refundsRequest) => {
        this.CashRefundService.getCashRefundInformation(bookingData.flowId, refundsRequest).then(
            response => this.generateCashRefundInformation(response, bookingData),
            () => this.continueFlow(bookingData)
        );
    };

    private generateCashRefundInformation = (cashRefundResponse, bookingData) => {
        this.localStorageService.set('cashEmailNotification', this.haveMail(cashRefundResponse.notifications));
        this.localStorageService.set('cashOrderItems', cashRefundResponse.orderItems);
        this.localStorageService.set('cashCurrenciesList', cashRefundResponse.currencies);
        if (cashRefundResponse.refundTotalAmountInfos && cashRefundResponse.currencies) {
            this.transformCashPriceInfo(cashRefundResponse.refundTotalAmountInfos, cashRefundResponse.currencies)
        };

        this.continueFlow(bookingData);
    };

    private  handleOnHoldBooking = (bookingData) => {
        const onHoldQuadrigam = this.MmBAppConstants.PAGES_URL.CONFIRM_ON_HOLD;
        const market = this.$rootScope.appMarket;
        const language = this.$rootScope.appLang.toLowerCase();
        const mainUrl = `${this.$window.location.origin}/flights/`;
        const endPath = `?market=${market}&language=${language}#!${onHoldQuadrigam}`;
        const url = mainUrl + endPath;

        this.localStorageService.set('importOrder', bookingData);
        this.RedirectionService.externalRedirect(url, false);
    };

    // Check if the URL contains 'quadrigam' and remove it
    private checkQuadrigam = () => {
        if ('quadrigam' in this.$location.search()) {
            this.$location.search('quadrigam', null);
        }
    };

    private isOnHoldAndMmbMarket = (bookingData) => {
        return (bookingData.isAirShuttle || (bookingData.isOnHold && this.checkMmbMarket(true)) || (!bookingData.isOnHold && !bookingData.isAirShuttle && this.checkMmbMarket(false)));
    };

    private checkMmbMarket = (isOnHold) => {
        let indexOpenedMarkets = 0, actualMarket = this.$rootScope.appMarket, openedMarketsList, marketFound = false;

        isOnHold ? openedMarketsList = this.MmBAppConstants.ON_HOLD_MARKETS : openedMarketsList = this.MmBAppConstants.MMB_MARKETS;

        while (marketFound === false && indexOpenedMarkets < openedMarketsList.length) {
            if (openedMarketsList[indexOpenedMarkets] === actualMarket.replace('/', '')) {
                marketFound = true;
            }
            indexOpenedMarkets++;
        }

        return marketFound;
    };


    /**
     *
     * @param {Array} sisterCitiesAllowedSlices
     * The function creates the request for the sister cities service. The list has unique elements to make sure we are not sending duplicate city
     * codes in the request, and to map the results easier.
     */
    private createSisterCitiesRequest (sisterCitiesAllowedSlices, isDisruption, bookingData) : SisterCitiesRequestModel {
        let disruptionParams = this.MmBUtilsSharedService.getDisruptionType(bookingData);
        let sliceOrigin, sliceDestination, tempSisterCitiesList = []
        let  sistCitiesFilterRequest : SisterCitiesRequestModel = DEFAULT_SISTER_CITIES_REQUEST_MODEL;
        angular.forEach(sisterCitiesAllowedSlices, (slice) => {
            sliceOrigin = null, sliceDestination = null;

            if (isDisruption && slice.originalDisruptionSliceInformation) {
                sliceOrigin = slice.originalDisruptionSliceInformation.departure.city.code;
                sliceDestination = slice.originalDisruptionSliceInformation.arrival.city.code;
            } else {
                sliceOrigin = slice.segments[0].departureCity.code;
                sliceDestination = slice.segments[slice.segments.length - 1].arrivalCity.code;
            }


            tempSisterCitiesList.push(sliceOrigin, sliceDestination);
        });
        sistCitiesFilterRequest.cities = tempSisterCitiesList.filter((item, index) => {
            return tempSisterCitiesList.indexOf(item) >= index;
        });

        sistCitiesFilterRequest.disruptionType = disruptionParams.disruptionType;
        sistCitiesFilterRequest.disruptionId = disruptionParams.disruptionId;
        return sistCitiesFilterRequest;
    };

    private handleOTPCustomErrors = (error): boolean => {
        let isCustomError = false;

        if(error.internalErrorCode === 'OTP_MODAL_CLOSED_BY_USER') {
            isCustomError = true;
            this.LoadingSpinnerService.hide();
        }
        return isCustomError;
    };

    /**
     * Makes the search of the received pnr and surname and show modal for confirm data if
     * have more of one passenger
     * @param {Object} event the received event
     * @param {Object} data the event data
     */
    searchFlightsPassengersEvent = (event, data) => {
        this.LoadingSpinnerService.show();
        return this.searchFlightsPassengers(data.surname, data.pnr, data.updateInvoiceInfo)
            .then((bookingData) => {
                this.retrieveOrderComplete(bookingData, data);
            })
            .catch((error) => {
                if (this.handleOTPCustomErrors(error)) return;
                this.handleSearchFlightsPassengersError(error, data);
                throw error;
            });
    };

    private handleSearchFlightsPassengersError = (error, data) => {
        this.LoadingSpinnerService.hide();
        if (error.errorCode === 500) {
            error.message = this.MmBAppConstants.GENERAL_ERRORS_SERVICE.SERVICE_GENERAL_ERROR;
            error.needsTranslate = true;
            this.CommonsModalService.showGenericError(error, true, null);
        } else if (error.errorCode === 412) {
            this.MmBModalService.showGenericModal(
                true,
                'ib-info-confidentiality-modal.html',
                { confirmation: error.setErrors, idModal: MMBDatalayerConstants.DATALAYER_MODAL_ID.INFO_CONFIDENTIALITY }
            ).result.then(() => {
                this.MmBModalService.showWaitingModal();
                this.RetrieveOrderService.retrieveOrderConsent(error.flowId).then((bookingData) => {
                    this.retrieveOrderComplete(this.checkOrderInfo(bookingData), data);
                    this.MmBModalService.finishWaiting();
                }, angular.noop);
            }, this.MmBModalService.finishWaiting);
        } else if (error.errorCode === 410 && error.internalErrorCode.startsWith('SSE_ORM')) {
            error.title = this.$filter('translate')('MMB_FLEXIBILIZATION_ERROR_MODAL_TITLE');
            this.CommonsModalService.showGenericError(error, true, null);
        } else if (error.errorCode === 409 && error.internalErrorCode === this.MmBAppConstants.WARNING_MESSAGES.SAME_SURNAME_WARNING) {
            this.MmBModalService.finishWaiting();
            const flowId = this.localStorageService.get('flowId');
            this.BookingNameService.checkName(data.surname, flowId);
        } else if (error.errorCode === 503) {
            this.MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
            this.$location.path(this.MmBAppConstants.PAGES_URL.SEARCH);
        } else {
            error.title = this.$filter('translate')('MMB_FLEXIBILIZATION_ERROR_MODAL_TITLE');
            this.CommonsModalService.showGenericError(error, true, null);
        }
    };

    private checkPreorder = (breakdownResponse) => {
        if (breakdownResponse.issuedItems.length > 0) {
            for (let i = 0; i < breakdownResponse.issuedItems.length; i++) {
                if (breakdownResponse.issuedItems[i].type === 'PREORDER') {
                    this.localStorageService.set('hasPreorderAncillarie', true);
                }
            }
        }
    };

    private checkIBVProduct = (bookingData) => {
        let ibvProduct = false, i;
        if (bookingData.qualifiers) {
            for (i = 0; i < bookingData.qualifiers.length; i++) {
                if (bookingData.qualifiers[i].name === 'IBDPHOLIDAYS') {
                    ibvProduct = true;
                }
            }
        }
        return ibvProduct;
    }

    /**
     * Validates if the order is a Disruption type
     * @param {Object} Order The order to validate
     * @returns {boolean} True in case the order fits the disruption scenario
     */
    private isDisruptionOrder = (data) => {
        const status = data?.order?.status;
        const tickets = data?.tickets;
        let isDisruption = false;

        const disruptionStatus = [
            this.MmBAppConstants.ORDER_STATUS_VALUES.CANCELATION_FLAG,
            this.MmBAppConstants.ORDER_STATUS_VALUES.CANCELATION_REACOM_FLAG,
            this.MmBAppConstants.ORDER_STATUS_VALUES.SCHEDULE_CHANGE,
            this.MmBAppConstants.ORDER_STATUS_VALUES.CANCELATION_MIXED_CHANGE,
            this.MmBAppConstants.ORDER_STATUS_VALUES.CANCELATION_REACOM_MIXED_CHANGE,
            this.MmBAppConstants.ORDER_STATUS_VALUES.DISRUPTION_CHANGES_MIXED
        ];

        const specialStatus = [
            this.MmBAppConstants.ORDER_STATUS_VALUES.CANCELATION_CHANGES,
            this.MmBAppConstants.ORDER_STATUS_VALUES.WAITLIST_CONFIRMED_CHANGES
        ];

        if (disruptionStatus.includes(status)) {
            isDisruption = true;
        } else if (specialStatus.includes(status)) {
            isDisruption = true;
        }

        const hasTickets = !!tickets;
        this.localStorageService.set('hasTickets', hasTickets);

        this.checkIsNotIberiaTicket(
            data.flexibilizationCapabilitiesInformation,
            data.genericDisruptionCapabilitiesInformation,
            status,
            tickets
        );

    return isDisruption;
};

    /**
     * Checks if the PNR is from an agency (due to new general disruptions).
     */
    private checkIsNotIberiaTicket = (flexibilizationCapabilitiesInformation, genericDisruptionCapabilitiesInformation, orderStatus, tickets) => {
        var notIberiaTicket = false;

        if (!flexibilizationCapabilitiesInformation && !genericDisruptionCapabilitiesInformation) {
            notIberiaTicket = true;
        }

        if (orderStatus === this.MmBAppConstants.ORDER_STATUS_VALUES.WAITLIST_CONFIRMED_CHANGES || orderStatus === this.MmBAppConstants.ORDER_STATUS_VALUES.CANCELATION_CHANGES) {
            if (!tickets) {
                notIberiaTicket = false;
            }
        }

        this.localStorageService.set('notIberiaTicket', notIberiaTicket);
    };

    private isSisterCitiesEnabled = (sisterResponse) => {
        var returnValue, cityIndex;
        returnValue = false;
        cityIndex = 0;
        if (sisterResponse && sisterResponse.cities) {
            for (cityIndex = 0; cityIndex < sisterResponse.cities.length; cityIndex++) {
                if (sisterResponse.cities[cityIndex].sisterCities && sisterResponse.cities[cityIndex].sisterCities.length > 0) {
                    returnValue = true;
                }
            }
        }
        return returnValue;
    };

    transformCashPriceInfo = (cashPricesInfo, currenciesList) => {
        let cashPriceIndex, currencyFound, currencyIndex, cashPricesInfoList = [], currencyObject: any = {};

        for (cashPriceIndex = 0; cashPriceIndex < cashPricesInfo.length; cashPriceIndex++) {
            let formattedCashPriceInfo = {
                'price': 0,
                'formattedPrice': ''
            };
            currencyFound = false, currencyIndex = 0;

            formattedCashPriceInfo.price = cashPricesInfo[cashPriceIndex].amount;
            while (!currencyFound && currencyIndex < currenciesList.length) {
                if (cashPricesInfo[cashPriceIndex].currency === currenciesList[currencyIndex].code) {
                    currencyFound = true;
                    currencyObject = currenciesList[currencyIndex];
                } else
                    currencyIndex++;
            }
            formattedCashPriceInfo.formattedPrice = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(currencyObject), cashPricesInfo[cashPriceIndex].amount, true, false);

            cashPricesInfoList.push(formattedCashPriceInfo);
        }

        this.localStorageService.set('cashPriceInfo', cashPricesInfoList);
    };
}
