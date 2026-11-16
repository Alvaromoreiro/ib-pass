import { IbZeroRedemptionWarning } from '../constants/ib-shutte-constants';
import { cloneDeep } from 'lodash-es';
import * as angular from 'angular';
import { CommonsSessionStorageService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { BookingRedirectionService } from '@shared/services/ib-utils/ib-booking-redirection.service';
import { ShuttleFareService } from '@shared/http-services/sse-avm/ib-shuttle-fare.service';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';

export class IbShuttleService {

    constructor (
        private $rootScope,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private BookingUtilService,
        private BookingAppConstants,
        private BookingRedirectionService: BookingRedirectionService,
        private $location,
        private BookingModalService,
        private CommonsGetLoginInfoService,
        private ShuttleFareService: ShuttleFareService,
        private IbFareShuttleTransformer,
        private CommonsHttpUtilService,
        private ShuttleFareRedentionService,
        private BookingCommercialSellingDataService,
        private BookingAvailabilityTransformer,
        private IbBookingCalculatePointsService,
        private commonsUserUtilsService: IbCUserUtilsService,
        private CommonsModalService: CommonsModalService
    ) {}

    isLogged = false;
    defer;

    ////////////////

    /**
     * Initializes the necessary parameters for the shuttle from the url parameters
     */
    getInitialParameters = () => {
        const bookingUrlParams: any = {
            searchOrigin: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.SEARCH_ORIGIN),
            market: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.MARKET),
            lenguage: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.LANGUAGE),
            arrival: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_CITY),
            destination: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.END_CITY),
            beginDay: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_DAY),
            beginMonth: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_MONTH),
            beginYear: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_YEAR),
            endDay: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.END_DAY),
            endMonth: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.END_MONTH),
            endYear: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.END_YEAR),
            tripType: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.TRIP_TYPE),
            senior: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.SENIOR),
            adult: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.ADULT),
            young: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.YOUNG),
            teenager: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.TEENAGER),
            child: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.CHILD),
            infant: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.INFANT),
            beginFareType: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.FARE_TYPE),
            endFareType: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.FARE_TYPE_END),
            payWithAvios: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.AVIOS_PAY),
            checkAvios: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.CHECK_AVIOS),
            checkPoints: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.CHECK_POINTS),
            pointsPay: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.POINTS_PAY)
        };
        this.BookingUtilService.initStorage();

        if (this.shouldSetDefaultDestination(bookingUrlParams)) {
            bookingUrlParams.destination = bookingUrlParams.arrival === 'MAD' ? 'BCN' : 'MAD';
        }

        bookingUrlParams.originDestinations = [];
        bookingUrlParams.originDestinations.push({
            destination: bookingUrlParams.destination,
            origin: bookingUrlParams.arrival
        });

        this.$rootScope.isRedemptionFlow = false;
        this.$rootScope.isPointsOBFlow = false;
        if (bookingUrlParams.checkAvios !== null && bookingUrlParams.checkAvios === '1') {
            this.$rootScope.isRedemptionFlow = true;
        } else if(bookingUrlParams.checkPoints !== null && bookingUrlParams.checkPoints === '1') {
            this.$rootScope.isRedemptionFlow = true;
            this.$rootScope.isPointsOBFlow = true;
        }

        if(this.$rootScope.redirectFromRedention) {
            this.$rootScope.redirectFromRedention = false;
            this.$rootScope.isRedemptionFlow = false;
            this.$rootScope.isPointsOBFlow = false;
        }

        this.CommonsSessionStorageService.set('isRedemptionFlow', this.$rootScope.isRedemptionFlow);
        this.CommonsSessionStorageService.set('isPointsOBFlow', this.$rootScope.isPointsOBFlow);
        this.CommonsSessionStorageService.set('bookingUrlParams', bookingUrlParams);
        return bookingUrlParams;
    };
    
    
    private shouldSetDefaultDestination = (params) => {
        const hasNoDestination = angular.isUndefined(params.destination) || !params.destination;
        const hasArrival = angular.isDefined(params.arrival);

        return hasNoDestination && hasArrival;
    };


    /**
     * Redirect the user to login page
     */
    redirectToLogin = () => {
        this.BookingRedirectionService.redirectToLoginPage(this.$location.absUrl());
    };

    /**
     * Process the url params and generate request object to fare service
     * @param bookingUrlParams
     */
    getFareRequestObject = (bookingUrlParams) => {

        const params = this.normalizeBookingParams(bookingUrlParams);

        const slices = this.buildSlices(params);
        const passengers = this.buildPassengers(params);

        const fareRequestObject = {
            slices,
            passengers,
            marketCode: params.market
        };

        this.CommonsSessionStorageService.set('availabilityRequestData', fareRequestObject);

        return fareRequestObject;
    };
    
    private buildSlices = (params) => {
        if (!angular.isDefined(params.tripType)) return [];

        if (params.tripType === '2') {
            return [
                {
                    origin: params.arrival,
                    destination: params.destination,
                    cabin: params.beginFareType === 'B' ? 'BUSINESS' : 'TOURIST'
                },
                {
                    origin: params.destination,
                    destination: params.arrival,
                    cabin: params.endFareType === 'B' ? 'BUSINESS' : 'TOURIST'
                }
            ];
        }

        if (params.tripType === '1') {
            return [
                {
                    origin: params.arrival,
                    destination: params.destination,
                    cabin: params.beginFareType === 'B' ? 'BUSINESS' : 'TOURIST'
                }
            ];
        }

        return [];
    };
    
    private buildPassengers = (params) => {
        if (this.hasAdultAndChildPassengers(params)) {
            return [
                { passengerType: 'ADULT', count: params.adult },
                { passengerType: 'CHILD', count: params.child }
            ];
        }

        if (angular.isDefined(params.adult)) {
            return [
                { passengerType: 'ADULT', count: params.adult }
            ];
        }

        return [];
    };

    private normalizeBookingParams = (bookingUrlParams) => {
        if (angular.isUndefined(bookingUrlParams)) {
            bookingUrlParams = this.CommonsSessionStorageService.get('bookingUrlParams');

            if (angular.isUndefined(bookingUrlParams) || !bookingUrlParams) {
                return {};
            }
        }

        return bookingUrlParams;
    };
    
    private hasAdultAndChildPassengers = (params) => {
        const hasAdultDefined = angular.isDefined(params.adult);
        const hasChildDefined = angular.isDefined(params.child);
        const hasChildren = params.child > 0;

        return hasAdultDefined && hasChildDefined && hasChildren;
    };
    
    initShuttleFlow = () => {
        const userlogged = this.CommonsSessionStorageService.get('userLogged');

        if (userlogged) {
            this.CommonsHttpUtilService.refreshToken();
        }

        this.$rootScope.isShuttleFlow = true;
        this.CommonsSessionStorageService.set('isShuttleFlow', true);
        this.CommonsSessionStorageService.set('loadingNextFlow', 2);

        return new Promise((resolve, reject) => {

            this.CommonsGetLoginInfoService
                .checkCustomerStatus(true)
                .then(
                    (isLogged) => this.getCommercialInfo(isLogged, resolve, reject),
                    (error) => {
                        this.BookingModalService
                            .showGenericError(error, false)
                            .result.then(
                                () => this.getCommercialInfo(false, resolve, reject),
                                () => this.getCommercialInfo(false, resolve, reject)
                            );
                    }
                );

        });
    };


    initShuttleFlowSucces = (data) => {
        this.defer.resolve(data);
        this.defer = null;
    };

    initShuttleFlowError = (error) => {
        this.defer.reject(error);
        this.defer = null;
    };

    getCommercialInfo = (isLogged, resolve, reject) => {
        this.isLogged = isLogged;

        this.BookingCommercialSellingDataService
            .getCommercialInfo()
            .then(
                () => this.getCommercialInfoSuccess(resolve, reject),
                () => this.getCommercialInfoSuccess(resolve, reject)
            );
    };

    /**
     * Depending on user state and flow type, starts shuttle flow (getting an anonymous token if needed) or redirects to login WCS page
     * @param {boolean} isLogged logged or anonymous user
     */
    checkIsLogged = (resolve, reject) => {
        const bookingUrlParams = this.CommonsSessionStorageService.get('bookingUrlParams');
        const isOnBusiness = this.isLogged && this.isLogged === this.BookingAppConstants.LOGIN_ONB;

        const goToObtainment = () => {
            const url = this.BookingUtilService.removeParam(this.BookingAppConstants.BOOKING_PARAMS_NAMES.CHECK_AVIOS);
            window.location.href = url + '#!/ibshuttle';
        };

        if (!this.$rootScope.isRedemptionFlow) {
            this.initShuttleObtention(bookingUrlParams, isOnBusiness, resolve, reject);
        } else if (this.$rootScope.isRedemptionFlow && this.isLogged) {
            if (this.commonsUserUtilsService.isIbZero()) {
                this.CommonsModalService.showComponentModal('upgradeZeroModalComponent', true, {
                    ...IbZeroRedemptionWarning,
                    redirectionUrl: window.location.href
                }).result.then(goToObtainment, goToObtainment);
            } else if (this.commonsUserUtilsService.isSoftUser()) {
                this.redirectToLogin();
            } else {
                this.initShuttleRedention(bookingUrlParams, isOnBusiness, resolve, reject);
            }
        } else {
            this.redirectToLogin();
        }
    };

    /**
     * Valida si tenemos comercialData, sino cargamos un valor por defecto y seguimos el flujo validando si el usuario ha hecho login
     */
    getCommercialInfoSuccess = (resolve, reject) => {
        if (!this.CommonsSessionStorageService.get('commercialData')) {
            this.CommonsSessionStorageService.set(
                'commercialData',
                this.BookingAppConstants.defaultCommercialInfo
            );
        }

        this.checkIsLogged(resolve, reject);
    };

    initShuttleObtention = (bookingUrlParams, isOnBusiness, resolve, reject) => {
        const fareShuttleRequest = this.getFareRequestObject(bookingUrlParams);
        let fareShuttleResponse, modelTransformer;

        this.CommonsSessionStorageService.set('flowApp', isOnBusiness ? 'PAOBONB' : 'PAOB');
        this.CommonsSessionStorageService.set('fareShuttleRequest', fareShuttleRequest);

        this.ShuttleFareService.getShuttleFare(fareShuttleRequest).then(
            (data) => {
                fareShuttleResponse = data.data;
                const fareShuttleResponseClone = cloneDeep(fareShuttleResponse);

                this.CommonsSessionStorageService.set('fareData', fareShuttleResponse);
                this.CommonsSessionStorageService.set(
                    'orderItemsId',
                    [fareShuttleResponse.offers[0].offerItems[0].offerItemId]
                );
                this.CommonsSessionStorageService.set('oBDiscountInfo', []);
                this.CommonsSessionStorageService.set(
                    'fareFamilyConditionsInfo',
                    fareShuttleResponse.fareFamilyConditions
                );
                this.CommonsSessionStorageService.set(
                    'cashAviosPossibilities',
                    fareShuttleResponse.offers[0].cashAviosPossibilities
                );

                modelTransformer = this.IbFareShuttleTransformer.transform(fareShuttleResponse);
                modelTransformer.marketCode = fareShuttleRequest.marketCode;
                modelTransformer.currencies = fareShuttleResponse.contextMetadata.currencies;

                this.IbFareShuttleTransformer.processHeaderData(modelTransformer);

                this.getCalculatedPoints(fareShuttleResponseClone).then(
                    () => resolve(modelTransformer),
                    (error) => {
                        if (error) {
                            resolve(modelTransformer);
                        }
                    }
                );
            },
            (error) => reject(error)
        );
    };

    initShuttleRedention = (bookingUrlParams, isOnBusiness, resolve, reject) => {
        this.CommonsSessionStorageService.remove('flightAviosInfo');

        let fareShuttleRequest = this.getFareRequestObject(bookingUrlParams);
        let fareShuttleResponse, modelTransformer;

        this.CommonsSessionStorageService.set('flowApp', isOnBusiness ? 'PAREONB' : 'PARE');
        this.CommonsSessionStorageService.set('fareShuttleRequest', fareShuttleRequest);

        this.ShuttleFareRedentionService.getShuttleFare(fareShuttleRequest).then(
            (data) => {
                fareShuttleResponse = data.data;

                this.CommonsSessionStorageService.set('fareData', fareShuttleResponse);
                this.CommonsSessionStorageService.set(
                    'orderItemsId',
                    [fareShuttleResponse.offers[0].offerItems[0].offerItemId]
                );
                this.CommonsSessionStorageService.set('oBDiscountInfo', []);
                this.CommonsSessionStorageService.set(
                    'fareFamilyConditionsInfo',
                    fareShuttleResponse.fareFamilyConditions
                );
                this.CommonsSessionStorageService.set(
                    'cashAviosPossibilities',
                    fareShuttleResponse.offers[0].cashAviosPossibilities
                );

                modelTransformer = this.IbFareShuttleTransformer.transform(fareShuttleResponse);
                this.IbFareShuttleTransformer.processHeaderData(modelTransformer);

                modelTransformer.marketCode = fareShuttleRequest.marketCode;
                modelTransformer.currencies = fareShuttleResponse.contextMetadata.currencies;

                resolve(modelTransformer);
            },
            (error) => reject(error)
        );
    };


    getFareData = () => {
        const data = this.CommonsSessionStorageService.get('fareData');
        return this.IbFareShuttleTransformer.transformRedemptionOffers(data);
    };

    getCalculatedPoints = (fareData) => {
        this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
        let trans_points = { Avios: 0, Elite: 0 };
        const request = this.BookingAvailabilityTransformer.genCalcAviosFlightReq(fareData);
        this.CommonsSessionStorageService.set('flightAviosInfo', request);
        return new Promise((resolve, reject) => {
            this.IbBookingCalculatePointsService.getCalculateFlightsAvios(request).then((response) => {
                trans_points = this.BookingAvailabilityTransformer.TransCalcPointsData(response);
                if (this.CommonsSessionStorageService.get(BkiStorageConstants.CALCULATED_POINTS)) { this.CommonsSessionStorageService.remove(BkiStorageConstants.CALCULATED_POINTS); }
                this.CommonsSessionStorageService.set(BkiStorageConstants.CALCULATED_POINTS, trans_points);
                resolve(response);
                this.BookingModalService.finishWaiting();
            }, (error) => {
                if (this.CommonsSessionStorageService.get(BkiStorageConstants.CALCULATED_POINTS)) { this.CommonsSessionStorageService.remove(BkiStorageConstants.CALCULATED_POINTS); }
                reject(error);
                this.BookingModalService.finishWaiting();
            });
        });
    };
}
IbShuttleService.$inject = ['$rootScope', 'CommonsSessionStorageService', 'BookingUtilService', 'BookingAppConstants',  'BookingRedirectionService', '$location', 'BookingModalService', 'CommonsGetLoginInfoService', 'ShuttleFareService', 'IbFareShuttleTransformer', 'CommonsHttpUtilService', 'ShuttleFareRedentionService', 'BookingCommercialSellingDataService', 'BookingAvailabilityTransformer', 'IbBookingCalculatePointsService', 'CommonsUserUtilsService', 'CommonsModalService'];
try {
    const mod = angular.module('ib-shuttle-module');
    mod.service(
        'IbShuttleService',
        IbShuttleService
    );
} catch (error) {
    const mod = angular.module('ib-shuttle-module', []);
    mod.service(
        'IbShuttleService',
        IbShuttleService
    );
}
