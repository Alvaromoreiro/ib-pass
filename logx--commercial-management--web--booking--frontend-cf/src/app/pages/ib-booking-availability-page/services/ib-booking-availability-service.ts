import * as angular from 'angular';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { IbBookingAirlinesLogoService } from '@shared/services/ib-booking-airlines-logo.service';
import { BookingBackgroundImagesService } from '@shared/services/ib-booking-backgrounds-image-service';
import { IbBookingCalculatePointsService } from '@src/app/shared/http-services/prlm-pc/ib-booking-calculate-points.service';
import { BookingFareRedemptionService } from '@shared/http-services/sse-rpa/ib-booking-fare-redemption-service';
import { BookingFareService } from '@src/app/shared/services/ib-booking-fare/ib-booking-fare.service';
import { BookingGetDestinationCitiesListService } from '@shared/http-services/rdu-loc/ib-booking-get-destination-cities.service';
import { OnBusinessPointsService } from '@shared/http-services/cmlm-lpm/ib-onbusiness-points-service';
import { CallBookingAvailabilityService } from '@shared/http-services/sse-avm/ib-call-booking-availability.service';
import { CallBookingMetaSearchService } from '@shared/http-services/sse-avm/ib-call-booking-metasearch.service';
import { CallBookingRedemptionAvailabilityService } from '@shared/http-services/sse-rpa/ib-call-booking-redemption-availability-service';
import { IbCheckPartnersDiscountsService } from '@shared/services/ib-check-partners-discount/ib-check-partners-discount.service';
import { IbSetPartnersSelectionUtilsService } from '@shared/components/ib-booking-partners-modal/ib-set-partners-selection.service';
import { CallPriceMatrixService } from '@shared/http-services/sse-avm/ib-call-booking-price-matrix-service.service';
import { BookingRedirectionService } from '@shared/services/ib-utils/ib-booking-redirection.service';
import { BookingCommercialSellingDataService } from '@shared/http-services/rdu-loc/ib-booking-commercial-selling-data.service';
import { AvailabilityDataTransformer } from '../components/ib-booking-availability-legacy/services/ib-booking-availability-data-transformer';
import { IbOriginDestinationInfoService } from '@src/app/pages/ib-booking-availability-page/components/transformers/ib-origin-destination-info-service';
import { IbBookingAvailabilityUtilsService } from '@shared/services/ib-booking-availability/ib-booking-availability-utils-service';
import { DatalayerGeneralConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-general-constants';
import { IbBookingPassengerInfoUtilsService } from '@src/app/shared/services/ib-booking-passenger-info/ib-booking-passenger-info-utils.service';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { BookingErrorPageStore, ErrorType } from '@src/app/core/store/ib-booking-error-page.store';
import { AvailabilitySearchDateFilterService } from '@src/app/pages/ib-booking-availability-page/services/ib-booking-availability-searchDate-filter.service';
import { DigitalDataUtilsService } from '@shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { FareDataModel } from '@src/app/core/models/generic-models/fare-models';
dayjs.extend(localizedFormat);


export class BookingAvailabilityService {
    constructor (
        private $rootScope: any,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CallBookingAvailabilityService: CallBookingAvailabilityService,
        private CallPriceMatrixService: CallPriceMatrixService,
        private BookingAvailabilityTransformer,
        private BookingModalService,
        private BookingUtilService,
        private IbBookingAirlinesLogoService: IbBookingAirlinesLogoService,
        private BookingFareService: BookingFareService,
        private BookingFareRedemptionService: BookingFareRedemptionService,
        private $filter: ng.FilterFactory,
        private BookingAppConstants: any,
        private BookingGetDestinationCitiesListService: BookingGetDestinationCitiesListService,
        private BookingBackgroundImagesService: BookingBackgroundImagesService,
        private CommonsGetLoginInfoService: CommonsGetLoginInfoService,
        private $location: angular.ILocationService,
        private CookiesUtilService,
        private CallBookingMetaSearchService: CallBookingMetaSearchService,
        private CallBookingRedemptionAvailabilityService: CallBookingRedemptionAvailabilityService,
        private BookingRedirectionService: BookingRedirectionService,
        private OnBusinessPointsService: OnBusinessPointsService,
        private IbBookingCalculatePointsService: IbBookingCalculatePointsService,
        private $window: angular.IWindowService,
        private BookingCommercialSellingDataService: BookingCommercialSellingDataService,
        private AvailabilityDataTransformer: AvailabilityDataTransformer,
        private IbOriginDestinationInfoService: IbOriginDestinationInfoService,
        private CommonsModalService: CommonsModalService,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private IbCheckPartnersDiscountsService:  IbCheckPartnersDiscountsService,
        private IbSetPartnersSelectionUtilsService: IbSetPartnersSelectionUtilsService,
        private BookingIgnoreOrderService,
        private IbBookingAvailabilityUtilsService: IbBookingAvailabilityUtilsService,
        private IbBookingPassengerInfoUtilsService: IbBookingPassengerInfoUtilsService,
        private BookingErrorPageStore: BookingErrorPageStore,
        private AvailabilitySearchDateFilterService: AvailabilitySearchDateFilterService,
        private DigitalDataUtilsService: DigitalDataUtilsService
    ) { }

    private isMetasearch: boolean = false;
    private isMultiCity: boolean = false;
    private isHMAD: boolean = false;
    private isRedemption: boolean = false;
    private isPointsOB: boolean = false;
    private PARAM_YES: string = 'SI';
    private PARAM_TRUE: string = 'true';

    ////////////////
    /**
    * Inicialize the booking flow, with parameters.
    */

    callInitBooking = () => {
        if (this.$location.url() !== '/ibpbah') {
            this.BookingUtilService.initStorage();
        }
        return new Promise((resolve, reject) => {
            this.CommonsGetLoginInfoService.checkCustomerStatus(true).then((data) => this.checkIsLogged(data, resolve, reject), (error) => {
                this.BookingModalService.showGenericError(error, false).result.then(() => {
                    this.checkIsLogged(false, resolve, reject);
                }, () => {
                    this.checkIsLogged(false, resolve, reject);
                });
            });
        });
    };

    /**
     * Depending on user state and flow type, starts availability flow (getting an anonymous token if needed) or redirects to login WCS page
     * @param {boolean} isLogged logged or anonymous user
     */
    private checkIsLogged = (isLogged, resolve, reject) => {
        const removeAviosPayAndUpdate = () => {
            const newUrl = this.BookingUtilService.removeParam(this.BookingAppConstants.BOOKING_PARAMS_NAMES.AVIOS_PAY);
            this.BookingRedirectionService.externalRedirect(newUrl);
        };
        if ((isLogged === true && !this.$rootScope.isPointsOBFlow) || (isLogged === 'ONB' && this.$rootScope.isRedemptionFlow === this.$rootScope.isPointsOBFlow)) {
            if (this.CommonsUserUtilsService.isIbZero() && this.$rootScope.isRedemptionFlow) {
                this.CommonsModalService.finishWaiting();
                this.CommonsModalService.showWaitingModal('ib-modal-loading-plane-ib-zero', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
                this.CommonsModalService.showComponentModal('upgradeZeroModalComponent', true, {
                    title: 'CANT_BOOK_AVIOS',
                    closeWindow: 'GENERIC_MODAL_ACCESSIBLE_CLOSE',
                    body: 'U_NOT_REGISTRED',
                    accept: 'SING_IN_IB_PLUS',
                    cancel: 'MODAL_CANCEL_BUTTON',
                    redirectionUrl: this.$window.location.href
                }).result.finally(() => {
                    removeAviosPayAndUpdate();
                });
                // ADD GA4 SERVICE
                const extendDatalayer = {};
                extendDatalayer[DatalayerGeneralConstants.USER_SEGMENT] = 0;
                /* Despite the name it obtains the account identifier of IB0 too */
                extendDatalayer[DatalayerGeneralConstants.USER_ID] = this.CommonsUserUtilsService.getFrequentFlyer();
                extendDatalayer[DatalayerGeneralConstants.PROCESS] = this.BookingAppConstants.DATALAYER_PROCESS.REDEMPTION;
                extendDatalayer[DatalayerGeneralConstants.STEP] = 'error';
                this.DigitalDataUtilsService.updateDigitalDataWithQuadrigam(this.BookingAppConstants.QUADRIGAMS.BK_ERROR, extendDatalayer);
            } else if (this.CommonsUserUtilsService.isSoftUser() && this.CommonsUserUtilsService.isIbPlus() && this.$rootScope.isRedemptionFlow) {
                this.BookingRedirectionService.redirectToLoginPage( this.$location.absUrl());
            } else {
                this.startBasicAvailabilityServices(resolve, reject);
            }
        } else {
            if (!this.$rootScope.isRedemptionFlow || !this.$rootScope.isPointsOBFlow) {
                this.startBasicAvailabilityServices(resolve, reject);
            } else if (this.$rootScope.isPointsOBFlow) {
                this.BookingRedirectionService.redirectToLoginPage();
            } else {
                this.BookingRedirectionService.redirectToLoginPage(this.$location.absUrl());
            }
        }
    };

    private startBasicAvailabilityServices = (resolve, reject) => {
        this.initBooking().then(this.initCommercialSellingData)
            .then((data) => resolve(data), (error) => {reject(error);});
    };

    private initBooking = () => {
        return new Promise((resolve, reject) => {
            const initParams = (params) => {
                this.localStorageService.set('channel', params.channel || '');
                this.localStorageService.set('bookingUrlParams', params.bookingUrlParams);
                this.localStorageService.set('isFlexibleDates', params.bookingUrlParams.flexDates && (params.bookingUrlParams.flexDates.toUpperCase() === this.PARAM_YES || params.bookingUrlParams.flexDates.toLowerCase() === this.PARAM_TRUE));
                resolve(null);
            };

            const checkParamsOfURL = (params) => {
                let i, result = false;
                for (i in params) {
                    if (params[i] !== null && params[i] !== '') {
                        result = true;
                    }
                }
                if (!result) {
                    this.redirectToErrorPage();
                }
            };

            const getOriginDestinations = (bookingUrlParams) => {
                const originDestinations = [];
                const originDestinationMulticity = [];
                let segmentEnd = false;
                return new Promise((resolve, reject) => {
                    const getDestinationCitiesListSuccess = (resolve, reject) => {
                        let i = 1;
                        let currentOrigins = [], currentDestinations = [], availabilityDestinations = [];
                        let originDestination = <any>[];
                        const getTripParamNames = (paramNames, index) => {
                            const finalParamNames = [];
                            for (let pIndex = 0; pIndex < paramNames.length; pIndex++) {
                                finalParamNames.push(paramNames[pIndex] + index);
                            }
                            return finalParamNames;
                        };

                        const getTripDateParam = (paramsDatesNames, index) => {
                            const paramsParsed = getTripParamNames(paramsDatesNames, index);
                            let date = null, beginDay = null, beginMonth = null;
                            date = this.BookingUtilService.getURLFirstParameterByName(paramsParsed[0]);
                            if (date === null) {
                                beginDay = this.BookingUtilService.getURLFirstParameterByName(paramsParsed[1]);
                                beginMonth = this.BookingUtilService.getURLFirstParameterByName(paramsParsed[2]);
                                if (beginDay !== null && beginMonth !== null) {
                                    date = beginMonth.substring(0, 4) + '-' + beginMonth.substring(4, 6) + '-' + beginDay;
                                }
                            }
                            return dayjs(date).format('YYYY-MM-DD');
                        };

                        while (!segmentEnd) {
                            if (this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.TRIP_TYPE) === '2' &&
                                i === 2) {
                                originDestinations[i - 1] = {
                                    origin: originDestinations[i - 2].destination,
                                    destination: originDestinations[i - 2].origin,
                                    date: getTripDateParam(this.BookingAppConstants.BOOKING_PARAMS_NAMES.INBOUND_DATE, i - 1)
                                };
                            } else {

                                currentOrigins = getTripParamNames(this.BookingAppConstants.BOOKING_PARAMS_NAMES.ORIGIN, i);
                                currentDestinations = getTripParamNames(this.BookingAppConstants.BOOKING_PARAMS_NAMES.DESTINATION, i);
                                segmentEnd = this.BookingUtilService.getURLFirstParameterByName(currentOrigins) === null
                                    || this.BookingUtilService.getURLFirstParameterByName(currentDestinations) === null
                                    || getTripDateParam(this.BookingAppConstants.BOOKING_PARAMS_NAMES.DEPARTURE_DATE, i) === null;
                                if (!segmentEnd) {
                                    originDestinations[i - 1] = {
                                        origin: this.BookingUtilService.getURLFirstParameterByName(currentOrigins),
                                        destination: this.BookingUtilService.getURLFirstParameterByName(currentDestinations),
                                        date: getTripDateParam(this.BookingAppConstants.BOOKING_PARAMS_NAMES.DEPARTURE_DATE, i)
                                    };
                                    if (this.isMetasearch) {
                                        const flightNumber = this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.FLIGHTNUMBER + i);
                                        const bookingCode = this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.BOOKINGCODE + i);
                                        const carrier = this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.CARRIER + i);
                                        const cabin = this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.CABIN + i);
                                        const fareCode = this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.FARE_CODE + i);
                                        if (flightNumber && flightNumber.length > 0) {
                                            originDestinations[i - 1].flightNumber = flightNumber;
                                        }
                                        if (bookingCode && bookingCode.length > 0) {
                                            originDestinations[i - 1].bookingCode = bookingCode;
                                        }
                                        if (carrier && carrier.length > 0) {
                                            originDestinations[i - 1].carrier = carrier;
                                        }
                                        if (cabin && cabin.length > 0) {
                                            originDestinations[i - 1].cabin = cabin;
                                        }
                                        if (fareCode && fareCode.length > 0) {
                                            originDestinations[i - 1].fareBasis = fareCode;
                                        }
                                    }
                                }
                            }
                            i++;
                        }
                        const getOriginDestinationsMulticity = () => {
                            let i, slicesInfo, originDestinationAux = {destination: null}, destinationAux = null;
                            if (bookingUrlParams && bookingUrlParams.slices) {
                                slicesInfo = bookingUrlParams.slices;
                            } else {
                                slicesInfo = [];
                            }
                            if (this.isMetasearch && slicesInfo.length > 0) {
                                for (i = 0; i < slicesInfo.length; i++) {
                                    originDestinationAux = {destination: null}, destinationAux = null;
                                    if (slicesInfo[i].length > 1) {
                                        originDestinationAux = angular.copy(originDestinations[parseInt(slicesInfo[i][0]) - 1]);
                                        destinationAux = originDestinations[parseInt(slicesInfo[i][slicesInfo[i].length - 1]) - 1].destination;
                                        originDestinationAux.destination = destinationAux;
                                        originDestinationMulticity.push(this.BookingUtilService.getOriginDestination([originDestinationAux]));
                                    } else {
                                        originDestinationMulticity.push(this.BookingUtilService.getOriginDestination([originDestinations[parseInt(slicesInfo[i][0]) - 1]]));
                                    }
                                }
                            } else {
                                for (i = 0; i < originDestinations.length; i++) {
                                    originDestinationMulticity.push(this.BookingUtilService.getOriginDestination([originDestinations[i]]));
                                }
                            }

                            this.localStorageService.set('originDestinationMulticity', originDestinationMulticity);
                        };

                        const newAvailabilityRequestData: any = this.localStorageService.get('newAvailabilityRequestData');
                        const availabilityRequestData: any = this.localStorageService.get('availabilityRequestData');
                        if (newAvailabilityRequestData && newAvailabilityRequestData.slices) {
                            availabilityDestinations = newAvailabilityRequestData.slices;
                        } else if (availabilityRequestData && availabilityRequestData.slices) {
                            availabilityDestinations = availabilityRequestData.slices;
                        }
                        if (availabilityDestinations && originDestinations.length !== availabilityDestinations.length) {
                            availabilityDestinations = null;
                        }
                        if (this.localStorageService.get('destinationCitiesList')) {
                            originDestination = this.BookingUtilService.getOriginDestination(availabilityDestinations || originDestinations);
                            this.localStorageService.set('originDestination', originDestination);
                        }
                        if (this.isMultiCity || this.localStorageService.get('openJaw')) {
                            getOriginDestinationsMulticity();
                        }
                        if (originDestination && originDestination.destinationCity && originDestination.destinationCity.description) {
                            this.$rootScope.destinationCity = originDestination.destinationCity.description;
                        }
                        const getBackgroundImagesSuccess = (resolve) => {
                            const originDestination: any = this.localStorageService.get('originDestination');
                            if (originDestination && originDestination.destinationCity && originDestination.destinationCity.code) {
                                this.$rootScope.backGroundImage = this.BookingUtilService.getBackGroundURL(originDestination.destinationCity.code);
                            } else {
                                this.$rootScope.backGroundImage = this.BookingAppConstants.backgroundImagesBaseRoute + this.BookingAppConstants.defaultBackgroundImage;
                            }

                            resolve(originDestinations);
                        };
                        this.BookingBackgroundImagesService.getBackgroundImages().then(() => getBackgroundImagesSuccess(resolve), () => getBackgroundImagesSuccess(resolve));
                    };

                    this.BookingGetDestinationCitiesListService.getDestinationCitiesList().then(() => getDestinationCitiesListSuccess(resolve, reject), reject);
                });
            };

            const getInitialParameters = () => {
                let invalidTripDate = false;
                const getSlices = (slice) => {
                    let i = 1, slicesEnd = false;
                    const slices = [], auxSlice = [], regex = /(\d+)/g;
                    while (!slicesEnd) {

                        slicesEnd = this.BookingUtilService.getURLFirstParameterByName(slice + i) === null;
                        if (!slicesEnd) {
                            auxSlice[i] = (this.BookingUtilService.getURLFirstParameterByName(slice + i).match(regex));
                            if (slices.length < 4) {
                                slices.push(auxSlice[i]);
                            }
                        }
                        i++;
                    }

                    return slices;
                };
                const bookingUrlParams = {
                    modeWeb: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.WEB_MODE),
                    searchOrigin: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.SEARCH_ORIGIN),
                    tripType: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.TRIP_TYPE),
                    senior: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.SENIOR),
                    adult: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.ADULT),
                    young: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.YOUNG),
                    teenager: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.TEENAGER),
                    child: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.CHILD),
                    infant: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.INFANT),
                    resident: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.RESIDENT),
                    largeFamilyType: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.LARGE_FAMILY_TYPE),
                    flexDates: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.FLEXIBLE_DATES),
                    preferredCabin: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.PREFERED_CLASS),
                    payWithAvios: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.AVIOS_PAY),
                    payWithPoints: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.POINTS_PAY),
                    ibGroup: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.IB_GROUP),
                    referralId: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.REFERRALID),
                    displayedPrice: parseInt(this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.DISPLAYEDPRICE)),
                    slices: getSlices(this.BookingAppConstants.BOOKING_PARAMS_NAMES.SLICE),
                    userCurrency: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.USERCURRENCY),
                    priceCurrency: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.PRICECURRENCY),
                    numTrips: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.NUMTRIPS),
                    originDestinations: '',
                    bookingCode1: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.BOOKINGCODE + '1'),
                    backToUrl: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.BACKTOURL),
                    codeTracking: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.CODE_TRACKING),
                    travelAgent: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.TRAVEL_AGENT),
                    fromMarket: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.MARKET_FROM),
                    fromLanguage: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.LANGUAGE_FROM),
                    metasearchMainCabin : this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.METASEARCH_CABIN)

                };

                this.isMultiCity = !!(bookingUrlParams.numTrips || bookingUrlParams.tripType === 'MultiCity');
                this.isMetasearch = !!(bookingUrlParams.referralId ) && !this.isMultiCity;
                this.isHMAD = bookingUrlParams.searchOrigin === 'HMADVS' || bookingUrlParams.searchOrigin === 'HMADVS-ANTIGUO';
                this.localStorageService.set('isHMAD', this.isHMAD);
                this.isPointsOB = !!bookingUrlParams.payWithPoints;
                if (this.CommonsUserUtilsService.isIbZero()) { this.isRedemption = false; } else { this.isRedemption = bookingUrlParams.payWithAvios ? true : this.isPointsOB; }
                this.$rootScope.isRedemptionFlow = this.isRedemption;
                this.$rootScope.isPointsOBFlow = this.isPointsOB;
                let searchFlightType = this.BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY;
                if (this.isMetasearch && !this.isMultiCity) {
                    searchFlightType = this.BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH;
                } else if (this.isMultiCity) {
                    searchFlightType = this.BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP;
                } else if (this.isRedemption) {
                    searchFlightType = this.BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION;
                } else if (this.isPointsOB) {
                    searchFlightType = this.BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTIONOB;
                }
                let openJaw = false;
                if ((this.isMultiCity && bookingUrlParams.numTrips === '2') || (this.isMetasearch && bookingUrlParams.tripType === 'OpenJaw')) {
                    openJaw = true;
                }
                this.localStorageService.set('searchFlightType', searchFlightType);
                this.localStorageService.set('openJaw', openJaw);
                if (this.localStorageService.get('metasearchOrderError') && this.isMetasearch && !this.localStorageService.get('openJaw')) {
                    this.localStorageService.set('searchFlightType', this.BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY);
                } else if (this.localStorageService.get('metasearchOrderError') && this.localStorageService.get('openJaw')) {
                    this.localStorageService.set('searchFlightType', this.BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP);
                } checkParamsOfURL(bookingUrlParams);

                if (!this.localStorageService.get('openJaw') && !this.localStorageService.get('isHMAD ')) {
                    if (this.localStorageService.get('searchFlightType') === this.BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY) {
                        const comeFromSearch = angular.isString(this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_MONTH[0])) && this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_MONTH[0]).length > 0;
                        invalidTripDate = comeFromSearch ? this.AvailabilitySearchDateFilterService.pastDatesAvailabilityCheck() : false;
                    } else if (this.localStorageService.get('searchFlightType') === this.BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH) {
                        invalidTripDate = this.AvailabilitySearchDateFilterService.pastDatesMetasearchCheck();
                    }
                }

                const returnParams = (originDestinations, resolve) => {
                    bookingUrlParams.originDestinations = originDestinations;
                    const params = {
                        market: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.MARKET),
                        language: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.LANGUAGE),
                        channel: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.CHANNEL),
                        device: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.DEVICE),
                        errorCode: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.CODE_ERROR),
                        bookingUrlParams: bookingUrlParams
                    };
                    resolve(params);
                };

                return new Promise((resolve, reject) => {
                    if (!invalidTripDate) {
                        getOriginDestinations(bookingUrlParams).then((data) => {
                            returnParams(data, resolve);
                        }, (error) => {
                            reject();
                            //returnParams(error, resolve);
                        });
                    }
                });
            };

            if (this.localStorageService.isSupported) {
                this.localStorageService.set('buildNumber', this.BookingUtilService.generateBuildNumberQueryString());
                getInitialParameters().then(initParams, reject);
            } else {
                this.BookingModalService.showGenericError({
                    title: 'PRIVATE_BROWSER_DETECTED_TITLE',
                    needsTranslate: true,
                    hideClose: true,
                    hideFooter: true,
                    message: 'PRIVATE_BROWSER_DETECTED_BODY'
                }, true).result.then(angular.noop, angular.noop);
                reject(null);
            }
        });
    };

    /**
     * Calls availability service and transforms it for the view. In case of error returns the error objecto to show it in the view
     * @returns {Object.<Promise>} - returns a promise which when it is resolved returns the transformed data for the view and when it is rejected
     * returns the error object processed to be shown in the view
     */
    getBookingAvailability = () => {
        return new Promise((resolve, reject) => {
            this.initCommercialSellingData().then(this.runAvailabilityFlowRequest, this.runAvailabilityFlowRequest)
                .then(resolve, reject);
        });
    };

    initCommercialSellingData = () => {
        return new Promise((resolve, reject) => {
            const getAirlinesLogosSuccess = () => {
                this.BookingCommercialSellingDataService.getCommercialInfo().then(() => getCommercialInfoSuccess(), () => getCommercialInfoSuccess());
            };

            const getCommercialInfoSuccess = () => {
                if (!this.localStorageService.get('commercialData')) {
                    this.localStorageService.set('commercialData', this.BookingAppConstants.defaultCommercialInfo);
                }
                resolve (this.localStorageService.get('commercialData'));
            };

            this.IbBookingAirlinesLogoService.getAirlinesLogos().then(() => getAirlinesLogosSuccess(), () => getAirlinesLogosSuccess());
        });
    };

    runAvailabilityFlowRequest = () => {
        return new Promise((resolve, reject) => {
            this.$rootScope.isRedemptionFlow ? this.runAvailabilityRedemptionRequest(resolve, reject) : this.runAvailabilityRequest(resolve, reject);
        });

    };

    /**
     * Creates the originDestinations object to show in the view. Builds an array de slices with the possible offers for the slice.
     * @param modelState
     * @param {Array<Object>} offers -The possible offers in the current availability state
     * @param {Array<Object>} fareFamilyConditions -The list of fare families condition of the service
     * @param originCalendarData
     * @param currentSelectedOffers
     * @param selectedIndex
     * @returns {Object} - returns the originDestination object with its associated slices and offers
     */
    createOriginDestinationInfo = (modelState, offers, fareFamilyConditions, originCalendarData, currentSelectedOffers, selectedIndex) => {
        let offersSelected, fareFamilyConditionsSelected;
        const limitDates = this.BookingAvailabilityTransformer.getOriginDestinationLimitDates(modelState.currentOriginDestinationIndex);
        const calendarData = {
            originCalendarData: originCalendarData,
            minDate: limitDates.minDate,
            maxDate: limitDates.maxDate,
            originDestinationIndex: modelState.currentOriginDestinationIndex
        };
        if (this.localStorageService.get('multiCitySearch')) {
            offersSelected = offers[modelState.currentOriginDestinationIndex];
            fareFamilyConditionsSelected = fareFamilyConditions[modelState.currentOriginDestinationIndex];
        } else {
            offersSelected = offers;
            fareFamilyConditionsSelected = fareFamilyConditions;
        }

        const offerParams = this.IbOriginDestinationInfoService.generateOfferParams(modelState.availabilityData.originDestinations[modelState.currentOriginDestinationIndex], offersSelected, fareFamilyConditionsSelected, currentSelectedOffers);
        const config = this.IbOriginDestinationInfoService.generateOptionParams(modelState.availabilityData.currencies, calendarData);
        return this.IbOriginDestinationInfoService.create(offerParams, config);
    };

    /**
     * Creates the originDestinations object to show in the view. Builds an array of slices with the offers for the slice or segment (if stopovers).
     * @param {Array<Object>} originDestination -The current originDestination
     * @param {Array<Object>} fareFamilyConditions -The list of fare families condition of the service
     * @param {string} provider - Name of the provider for the availability data (MN, AWS or COMPOSITE)
     * @returns {Object} - returns the originDestination object with its associated slices
     */
    createRedemptionOriginDestinationInfo = (originDestination, fareFamilyConditions, originCalendarData, incompatibleCabin) => {
        const limitDates = this.BookingAvailabilityTransformer.getOriginDestinationLimitDates(originDestination.originDestinationId === 'OD1' ? 1 : 0);
        const calendarData = {
            originCalendarData: originCalendarData,
            minDate: limitDates.minDate,
            maxDate: limitDates.maxDate,
            originDestinationIndex: originDestination.originDestinationId === 'OD1' ? 1 : 0
        };
        return this.BookingAvailabilityTransformer.createRedemptionOriginDestinationInfo(originDestination, fareFamilyConditions, calendarData, incompatibleCabin);
    };

    /**
     * Creates the originDestinations object to show in the view. Builds an array de slices with the possible offers for the slice.
     * @param {Object} originDestinationInfo  the current origin destination information
     * @param {Integer} originDestinationIndex the current origin destination index
     * @param {Array<Object>} currencies the list of available currencies
     * @param {Array<Object>} offers the list of all available offers
     * @param {Array<Object>} fareFamilyConditions the fare families conditions list
     * @param {Array<Object>} originCalendarData the original calendar information of the current origin destination
     * @param {Array<Object>} currentSelectedOffers the selected offers to see if they are compatibles
     * @returns {Object} - returns the originDestination object with its associated slices and offers
     */
    createOriginDestinationInfoTransformed = (originDestinationInfo, originDestinationIndex, currencies, offers, fareFamilyConditions, originCalendarData, currentSelectedOffers) => {
        let offersSelected, fareFamilyConditionsSelected;
        const calendarData = this.setCalendarInfo(originDestinationIndex, originCalendarData);

        if (this.localStorageService.get('multiCitySearch')) {
            offersSelected = offers[originDestinationIndex];
            fareFamilyConditionsSelected = fareFamilyConditions[originDestinationIndex];
        } else {
            offersSelected = offers;
            fareFamilyConditionsSelected = fareFamilyConditions;
        }
        const index = this.BookingAppConstants.AVAILABLE_REFACTOR ? originDestinationIndex : null;

        const offerParams = this.IbOriginDestinationInfoService.generateOfferParams(originDestinationInfo, offersSelected, fareFamilyConditionsSelected, currentSelectedOffers);
        const config = this.IbOriginDestinationInfoService.generateOptionParams(currencies, calendarData, index);
        return this.IbOriginDestinationInfoService.create(offerParams, config);
    };

    createRedemptionOriginDestinationInfoTransformed = (originDestination, originDestinationIndex, fareFamilyConditions, originCalendarData, incompatibleCabin) => {
        const calendarData = this.setCalendarInfo(originDestinationIndex, originCalendarData);

        return this.BookingAvailabilityTransformer.createRedemptionOriginDestinationInfo(originDestination, fareFamilyConditions, calendarData, incompatibleCabin);
    };

    /**
     * Generates the calendar data needed for the IbOriginDestinationInfoService.create. 
     * @param {number} ODIndex - Needed to specify the date limits
     * @param {Cell} originCalendarData - array of Cells containing price info
     * @returns {CalendarData} - returns the CalendarData object
     */
    private setCalendarInfo = (ODIndex: number, originCalendarData: AvailabilityTransformerModel.Cell[]): AvailabilityTransformerModel.CalendarData => {
        const limitDates = this.BookingAvailabilityTransformer.getOriginDestinationLimitDates(ODIndex);
        const calendarData = {
            originCalendarData: originCalendarData,
            minDate: limitDates.minDate,
            maxDate: limitDates.maxDate,
            originDestinationIndex: ODIndex
        };
        return calendarData;
    };

    /**
     * calls the get fare service with the offer selected by the user.
     * @param {Array<Object>} offers -The possible offers in the current availability state
     * @returns {Object.<Promise>} - returns a promise which when it is resolved is posible to continue on the booking flow
     */
    selectAvailability = ():Promise<FareDataModel> => {
        return new Promise((resolve, reject) => {
            this.BookingFareService.getBookingFare(this.localStorageService.get('requestFareInfo')).then((data) => {
                this.localStorageService.set('orderItemsId', [data.offers[0].offerItems[0].offerItemId]);
                this.localStorageService.set('fareFamilyConditionsInfo', data.fareFamilyConditions);
                this.localStorageService.set('cashAviosPossibilities', data.offers[0].cashAviosPossibilities);
                if (this.$rootScope.isLogged !== 'ONB') {
                    this.getCalculatedPoints(data).then(() => {
                        resolve(data);
                    }, (error) => {
                        if (error) {
                            resolve(data);
                        }
                    });
                } else {
                    resolve(data);
                }

            }, reject);
        });
    };

    private getCalculatedPoints = (fareData, showLoading = false) => {
        if (showLoading) {
            this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
        }
        let trans_points = { Avios: 0, Elite: 0 };
        const request = this.BookingAvailabilityTransformer.genCalcAviosFlightReq(fareData);
        this.localStorageService.set('flightAviosInfo', request);
        return new Promise((resolve, reject) => {
            this.IbBookingCalculatePointsService.getCalculateFlightsAvios(request).then((response) => {
                trans_points = this.BookingAvailabilityTransformer.TransCalcPointsData(response);
                if (this.localStorageService.get(BkiStorageConstants.CALCULATED_POINTS)) { this.localStorageService.remove(BkiStorageConstants.CALCULATED_POINTS); }
                this.localStorageService.set(BkiStorageConstants.CALCULATED_POINTS, trans_points);
                if (showLoading) {
                    this.BookingModalService.finishWaiting();
                }
                resolve(response);
            }, (error) => {
                if (this.localStorageService.get(BkiStorageConstants.CALCULATED_POINTS)) { this.localStorageService.remove(BkiStorageConstants.CALCULATED_POINTS); }
                if (showLoading) {
                    this.BookingModalService.finishWaiting();
                }
                reject(error);
            });
        });
    };

    /**
     * calls the get redemption fare service with the offer selected by the user.
     * @param {Array<Object>} offers -The possible offers in the current availability state
     * @returns {Object.<Promise>} - returns a promise which when it is resolved is posible to continue on the booking flow
     */
    selectRedemptionAvailability = () => {
        return new Promise((resolve, reject) => {
            this.BookingFareRedemptionService.getBookingRedemptionFare(this.localStorageService.get('requestRedemptionFareInfo')).then((data: any) => {
                this.localStorageService.set('orderItemsId', [data.offers[0].offerId]);
                this.localStorageService.set('fareData', data);
                this.localStorageService.set('fareFamilyConditionsInfo', data.fareFamilyConditions);
                if (this.$rootScope.isPointsOBFlow) {
                    resolve(this.BookingAvailabilityTransformer.transformOBRedemptionFare(data));
                } else {
                    resolve(this.BookingAvailabilityTransformer.transformRedemptionFare(data));
                }
            }, reject);
        });
    };

    /**
     * calls the next seven days availability price.
     * @param {Object} slickModel -The current state model of slick component
     * @param {Boolean} nextSelected - true if the user is going to futures dates of current selected date
     * @returns {Object.<Promise>} - returns a promise which when it is resolved returns the calendar ribbon data
     */
    getCalendarRibbon = (slickModel, nextSelected, originDestinationIndex) => {
        return new Promise((resolve, reject) => {
            const nextDate = this.BookingAvailabilityTransformer.getNextDate(slickModel, nextSelected);
            const transformSlidesData = (nextCalendarData, nextDate, resolve) => {
                let calendarInfo = null;
                if (nextCalendarData.data) {
                    if (originDestinationIndex === 1) {
                        if ((this.$rootScope.isRedemptionFlow || this.$rootScope.isPointsOBFlow)) {
                            calendarInfo = nextCalendarData.data.inbound && nextCalendarData.data.inbound.availabilityCalendar;
                        } else {
                            calendarInfo = nextCalendarData.data.calendarRibbon.inBoundRow && nextCalendarData.data.calendarRibbon.inBoundRow.cells;
                        }
                    } else if (originDestinationIndex === 0) {
                        if ((this.$rootScope.isRedemptionFlow || this.$rootScope.isPointsOBFlow)) {
                            calendarInfo = nextCalendarData.data.outbound && nextCalendarData.data.outbound.availabilityCalendar;

                        } else {
                            calendarInfo = nextCalendarData.data.calendarRibbon.outBoundRow && nextCalendarData.data.calendarRibbon.outBoundRow.cells;
                        }
                    }
                }
                resolve(this.BookingAvailabilityTransformer.transformSlidesData(slickModel, calendarInfo, nextSelected, nextDate.startIndex));
            };

            if (nextDate) {
                this.CallPriceMatrixService.getPriceMatrixPromised(this.BookingAvailabilityTransformer.generateCalendarRequest(nextDate.date, originDestinationIndex), true).then((data) => transformSlidesData(data, nextDate, resolve), (data) => transformSlidesData(data, nextDate, resolve));
            } else {
                resolve(slickModel);
            }
        });
    };

    /**
     * Generates a new availability model with the current selected slide information
     * @param {Object} selectedSlide the current selected slide by the user in slick carousel component
     * @param {Object} currentModelState the current availability model state
     */
    updateBookingAvailability = (selectedSlideInfo, currentModelState) => {
        let currentAvailabilityRequest: any = this.localStorageService.get('availabilityRequestData');
        const currentNewAvailabilityRequest: any = this.localStorageService.get('newAvailabilityRequestData');
        const bookingUrlParams: any = this.localStorageService.get('bookingUrlParams');

        if (currentNewAvailabilityRequest) {
            currentAvailabilityRequest = currentNewAvailabilityRequest;
            bookingUrlParams.originDestinations = currentNewAvailabilityRequest.slices;
            this.localStorageService.set('availabilityRequestData', currentAvailabilityRequest);
            this.BookingUtilService.checkExistNewAvailabilitySearch();
            this.localStorageService.remove('newAvailabilityRequestData');
            this.localStorageService.set('calditMode', false);
        }

        currentAvailabilityRequest.slices[currentModelState.currentOriginDestinationIndex].date = selectedSlideInfo.serviceDate;
        bookingUrlParams.originDestinations[currentModelState.currentOriginDestinationIndex].date = selectedSlideInfo.serviceDate;
        this.localStorageService.set('availabilityRequestData', currentAvailabilityRequest);
        this.localStorageService.set('bookingUrlParams', bookingUrlParams);
        return new Promise((resolve, reject) => {
            this.$rootScope.isRedemptionFlow ? this.runAvailabilityRedemptionRequest(resolve, reject) : this.runAvailabilityRequest(resolve, reject);
        });
    };

    /**
     * Generates a new availability model with the current selected discount information
     * @param {Object} selectedDiscounts the current selected discount by the user in local discount selector component
     */
    updateBookingAvailabilityDiscount = (selectedDiscounts) => {
        const bookingUrlParams: any = this.localStorageService.get('bookingUrlParams');
        bookingUrlParams.largeFamilyType = selectedDiscounts.largeFamilyType;
        bookingUrlParams.resident = selectedDiscounts.resident;
        this.localStorageService.set('bookingUrlParams', bookingUrlParams);
        this.localStorageService.set('availabilityRequestData', this.BookingUtilService.generateAvailabilityRequestData());
        return new Promise((resolve, reject) => {
            this.$rootScope.isRedemptionFlow ? this.runAvailabilityRedemptionRequest(resolve, reject) : this.runAvailabilityRequest(resolve, reject);
        });
    };

    /**
     * Finds and slice which matchs with the departure an arrival date and returns it and its index
     * @param {String} departureDate the departure date to find
     * @param {String} arrivalDate the arrival date to find
     * @param {Object} currentModelState the current availability model state
     */
    getSelectedSlice = (departureDate, arrivalDate, currentModelState) => {
        return this.BookingAvailabilityTransformer.generateSelectedSliceInfo(departureDate, arrivalDate, currentModelState.availabilityData.originDestinations[currentModelState.currentOriginDestinationIndex].slices);
    };

    /**
     * Updates the current calendar info data of origin destinations needs to be updated because of limits modification
     * @param {Object} model the current availability model state
     * @param {Object} eventInfo the event information when change availability is requested
     * @param {Boolean} isNext true if the new day requested is later than current day
     * @return the model updated with the new calendar info
     */
    updateLimitsCalendarData = (model, eventInfo, isNext) => {
        return this.BookingAvailabilityTransformer.updateLimitsCalendarData(model, eventInfo, isNext);
    };

    /**
     * Returns the selected offer for the current model state
     * @param {Array<Object>} selectedSlices the selected slices by the user
     */
    getSelectedOffer = (selectedSlices) => {
        return this.BookingAvailabilityTransformer.getSelectedOffer(selectedSlices);
    };


    /**
     *
     * @param {Object<Promise>} requestPromise
     */
    public runAvailabilityRequest = (resolve, reject) => {
        let availabilityRequestData: any = this.localStorageService.get('availabilityRequestData');
        const availabilityRequest = this.localStorageService.get('newAvailabilitySearch') ? this.localStorageService.get('newAvailabilitySearch') : this.BookingAvailabilityTransformer.createRequestAvailability();
        const isHMAD = this.localStorageService.get('isHMAD') ? this.localStorageService.get('isHMAD') : false;
        const availabilityReqGetBookingMetaSearch = !!(availabilityRequest && availabilityRequest.referralId);
        const currentlySelectedPartner = this.IbCheckPartnersDiscountsService.getSelectedPartner();
        const passengerNotAllowed = () => {
            const bookingUrlParams: any = this.localStorageService.get('bookingUrlParams') || {};
            return ((bookingUrlParams.senior > 0 || bookingUrlParams.teenager > 0 || bookingUrlParams.young > 0));
        };
        const runAvailabilityPromises  = () => {
            const getCalendarFlightsDates = () => {
                return new Promise((resolve, reject) => {
                    const availabilityRequestData: any = this.localStorageService.get('availabilityRequestData');
                    const originDestination = availabilityRequestData.slices;
                    this.localStorageService.remove('calditMode');
                    const isSearchAfterMaxSearchTime = () => {
                        const commercialInfo: any = this.localStorageService.get('commercialData');
                        const availabilityRequestData: any = this.localStorageService.get('availabilityRequestData');
                        let isAfterMax = false;
                        if (commercialInfo?.maxSearchTime && availabilityRequestData?.slices) {
                            const date = new Date(availabilityRequestData.slices[availabilityRequestData.slices.length - 1].date);
                            const maxDate = new Date((new Date()).getTime() + (commercialInfo.maxSearchTime * 24 * 60 * 60 * 1000));
                            isAfterMax = date.getTime() > maxDate.getTime();
                        }
                        return isAfterMax;
                    };

                    if (this.localStorageService.get('isFlexibleDates') && originDestination.length <= 2 && !isSearchAfterMaxSearchTime()) {
                        this.CallPriceMatrixService.getPriceMatrixPromised(this.BookingAvailabilityTransformer.generateInitialCalendarRequest(), true).then((response) => {
                            resolve(response);
                        }, (error) => {
                            resolve(null);
                        });
                    } else {
                        resolve(null);
                    }
                });
            };

            const bookingInfo: any = this.localStorageService.get('bookingInfo');
            const orderId: string | null = bookingInfo?.order?.orderId ? bookingInfo.order.orderId : null;
            const ignoreOrderBKI: boolean = ((this.localStorageService.get('ignoreOrderBKI') || false) && typeof orderId === 'string') || false;
            if(ignoreOrderBKI) {
                this.localStorageService.remove('ignoreOrderBKI');
                this.BookingIgnoreOrderService.ignoreOrder(orderId).then(() => {
                    this.IbBookingPassengerInfoUtilsService.deleteTemporalPNR();
                }, () => {});
            }
            const promiseOne = this.isMetasearch && !this.isMultiCity && availabilityReqGetBookingMetaSearch ? this.CallBookingMetaSearchService.getBookingMetaSearch(availabilityRequest) : this.CallBookingAvailabilityService.getBookingAvailability(availabilityRequest);
            const promiseTwo = getCalendarFlightsDates();
            Promise.all([promiseOne, promiseTwo]).then((availabilityInfo) => {
                const getBookingAvailabilitySuccess = (availabilityData, calendarFlightsDatesData, resolve, reject) => {
                    if (angular.isUndefined(availabilityData.data.fareFamilyConditions) || availabilityData.data.fareFamilyConditions.length === 0) {
                        this.redirectToErrorPage();
                    } else {
                        const availabilityRequest = this.localStorageService.get('newAvailabilitySearch') ? this.localStorageService.get('newAvailabilitySearch') : this.BookingAvailabilityTransformer.createRequestAvailability();
                        resolve(
                            this.AvailabilityDataTransformer.transformGetAvailabilityData(
                                availabilityData.data,
                                calendarFlightsDatesData && calendarFlightsDatesData.data,
                                availabilityRequest
                            )
                        );
                    }
                };

                if (this.isMetasearch && availabilityReqGetBookingMetaSearch) {
                    const recommendedOffer = this.IbBookingAvailabilityUtilsService.getOfferInfoRecommended(availabilityInfo[0]?.data?.recommendedOfferId, availabilityInfo[0]?.data?.offers);
                    const existCurrency = recommendedOffer.price?.currency ?? availabilityInfo[0]?.data?.offers[0]?.price?.currency;
                    const existTotal =  recommendedOffer.price?.total ??  availabilityInfo[0]?.data?.offers[0]?.price?.total;
                    const existFare = recommendedOffer.price?.fare ??  availabilityInfo[0]?.data?.offers[0]?.price?.fare;
                    let priceDigitalDataParameters = { Currency: existCurrency, TotalPrice: existTotal, TotalPriceWithoutTaxes: existFare };
                    if (existCurrency && existTotal && existFare) {
                        this.BookingUtilService.addPriceParametersInDigitalInfo(priceDigitalDataParameters);
                    }
                    const flightHaul = { FlightHaul: recommendedOffer?.flightRatio ?? availabilityInfo[0].data.offers[0].flightRatio };
                    this.BookingUtilService.addflightHaulInDigitalInfo(flightHaul);
                    if (availabilityInfo[0]?.data?.offers[0]?.slices) {
                        this.getCalculatedPoints(availabilityInfo[0].data).then(() => {
                            getBookingAvailabilitySuccess(availabilityInfo[0], availabilityInfo[1], resolve, reject);
                        }, () => { getBookingAvailabilitySuccess(availabilityInfo[0], availabilityInfo[1], resolve, reject); });
                    } else {
                        getBookingAvailabilitySuccess(availabilityInfo[0], availabilityInfo[1], resolve, reject);
                    }
                } else {
                    getBookingAvailabilitySuccess(availabilityInfo[0], availabilityInfo[1], resolve, reject);
                }

            }, (error) => {
                const extendedAvalabilityEmpty = ( error?.errorCode === 404 && error?.internalErrorCode === 'SSE_AVM_12001' ) || false ;
                const isMetasearchSearch = this.isMetasearch;

                const newMetaRequest = { ...availabilityRequest };
                if (extendedAvalabilityEmpty && isMetasearchSearch) {
                    let retryRequest = false;
                    newMetaRequest.slices.forEach( slice => {
                        slice.segments.forEach(segment => {

                            const hasFareBasis = this.hasValue(segment.fareBasis);
                            const hasBookingCode = this.hasValue(segment.bookingCode);

                            if (hasFareBasis || hasBookingCode) {
                                if (hasFareBasis) delete segment.fareBasis;
                                if (hasBookingCode) delete segment.bookingCode;
                                retryRequest = true;
                            }
                        });
                    } );
                    if (retryRequest) {
                        this.localStorageService.set( 'availabilityRequestData', newMetaRequest );
                        this.runAvailabilityRequest( resolve, reject );
                    } else {
                        this.BookingErrorPageStore.setError(ErrorType.AVAILABILITY, error);
                        reject(error);
                    }
                } else {
                    this.BookingErrorPageStore.setError(ErrorType.AVAILABILITY, error);
                    reject(error);
                }
            });
        };

        if (isHMAD) {
            availabilityRequest.privateFareProduct = this.BookingAppConstants.HMAD_QUALIFIER_CODE;
        }
        if ( availabilityRequestData?.slices[0] && dayjs().startOf('day').diff(dayjs(availabilityRequestData.slices[0].date)) > 0) {
            this.CookiesUtilService.updateCookie(this.BookingAppConstants.COOKIES.IBERIACOM_LAST_SEARCH.NAME, this.CookiesUtilService.getCookieParams(this.BookingAppConstants.COOKIES.IBERIACOM_LAST_SEARCH.NAME, this.BookingAppConstants.COOKIES.IBERIACOM_LAST_SEARCH.PARAMS.DATES, true), this.BookingAppConstants.COOKIES.DEFAULT_EXPIRY_TIME, this.BookingAppConstants.COOKIES.DEFAULT_PATH);
        }
        // Se realiza este control porque en el flujo de metasearch el combo de pasajeros no admite senior, joven y adolescente. Redirigimos a availbility con un error fake.
        if (this.isMetasearch && availabilityReqGetBookingMetaSearch && passengerNotAllowed()) {
            reject({ errorCode: 99, internalErrorCode: 'NULL' });
        } else if (!this.isMetasearch && !this.isMultiCity && !this.isHMAD) {
            this.IbSetPartnersSelectionUtilsService.checkPartnerDiscountSelection().then((partnerInfo) => {
                if(partnerInfo) {
                    availabilityRequest.partnerDiscount = partnerInfo.partnerIdentifier;
                }
                this.localStorageService.set('availabilityRequestData', availabilityRequest);
                runAvailabilityPromises();
            });
        } else {
            runAvailabilityPromises();
        }
    };

    private hasValue (value: string | undefined): boolean {
        return typeof value === 'string' && value !== '';
    }

    /**
     * Creates promises for Availability service and Calendar service and when they are solved, calls transformer method to proccess data
     * @param {Object<Promise>} requestPromise Promise created for calling all REST services needed
     */

    private runAvailabilityRedemptionRequest = (resolve, reject) => {
        const availabilityRequestData: any = this.localStorageService.get('availabilityRequestData');
        const availabilityRequest = this.localStorageService.get('newAvailabilitySearch') ? this.localStorageService.get('newAvailabilitySearch') : this.BookingAvailabilityTransformer.createRequestAvailability();
        const getCalendarFlightsDates = () => {
            return new Promise((resolve, reject) => {
                const originDestination: any = this.localStorageService.get('availabilityRequestData');
                this.localStorageService.remove('calditMode');
                const isSearchAfterMaxSearchTime = () => {
                    const commercialInfo: any = this.localStorageService.get('commercialData');
                    const availabilityRequestData: any = this.localStorageService.get('availabilityRequestData');
                    let isAfterMax = false;
                    if ( commercialInfo?.maxSearchTime &&  availabilityRequestData?.slices) {
                        const date = new Date(availabilityRequestData.slices[availabilityRequestData.slices.length - 1].date);
                        const maxDate = new Date((new Date()).getTime() + (commercialInfo.maxSearchTime * 24 * 60 * 60 * 1000));
                        isAfterMax = date.getTime() > maxDate.getTime();
                    }
                    return isAfterMax;
                };
                if (this.localStorageService.get('isFlexibleDates') && originDestination.slices.length <= 2 && !isSearchAfterMaxSearchTime()) {
                    this.CallPriceMatrixService.getPriceMatrixPromised(this.BookingAvailabilityTransformer.generateInitialCalendarRequest(), true).then((response) => {
                        resolve(response);
                    }, () => {
                        resolve(null);
                    });
                } else {
                    resolve(null);
                }
            });
        };


        const promiseOne = this.CallBookingRedemptionAvailabilityService.getBookingRedemptionAvailability(availabilityRequest);
        const promiseTwo = getCalendarFlightsDates();
        if (availabilityRequestData?.slices[0] && dayjs().startOf('day').diff(dayjs(availabilityRequestData.slices[0].date)) > 0) {
            this.CookiesUtilService.updateCookie(this.BookingAppConstants.COOKIES.IBERIACOM_LAST_SEARCH.NAME, this.CookiesUtilService.getCookieParams(this.BookingAppConstants.COOKIES.IBERIACOM_LAST_SEARCH.NAME, this.BookingAppConstants.COOKIES.IBERIACOM_LAST_SEARCH.PARAMS.DATES, true), this.BookingAppConstants.COOKIES.DEFAULT_EXPIRY_TIME, this.BookingAppConstants.COOKIES.DEFAULT_PATH);
        }
        Promise.all([promiseOne, promiseTwo]).then((availabilityInfo: any) => {
            const getBookingRedemptionAvailabilitySuccess = (availabilityData, calendarFlightsDatesData, resolve, reject) => {
                this.localStorageService.remove('flightAviosInfo');
                if (availabilityData.data.fareFamilyConditions.length === 0) {
                    this.redirectToErrorPage();
                } else {
                    if (this.$rootScope.isPointsOBFlow) {
                        resolve(this.BookingAvailabilityTransformer.transformGetOBRedemptionAvailabilityData(availabilityData.data, calendarFlightsDatesData && calendarFlightsDatesData.data));
                    } else {
                        resolve(this.BookingAvailabilityTransformer.transformGetRedemptionAvailabilityData(availabilityData.data, calendarFlightsDatesData && calendarFlightsDatesData.data));
                    }
                }
            };
            availabilityInfo[0].data.fareFamilyConditions = this.BookingAvailabilityTransformer.checkCabinDescription(availabilityInfo[0].data.fareFamilyConditions);
            getBookingRedemptionAvailabilitySuccess(availabilityInfo[0], availabilityInfo[1], resolve, reject);
        }, (error) => {
            reject(error);
        });
    };

    /**
     *
     */
    getMarketOBPoints = () => {
        let marketValidator = false;
        if (this.$rootScope.appMarket === 'ES' || this.$rootScope.appMarket === 'GB') {
            marketValidator = true;
        }
        this.localStorageService.set('getMarketOBPoints', marketValidator);
    };

    /**
     * Calls the service that calculates the ONB points.
     */
    getOBPoints = (selectedSlices) => {
        return new Promise((resolve, reject) => {
            const oBPointsRequest = this.BookingAvailabilityTransformer.createOBPointsRequest(selectedSlices);
            this.OnBusinessPointsService.getOnBusinessPoints(oBPointsRequest).then((oBPointsData) => {
                resolve(oBPointsData);
            }, (error) => {
                reject(error);
            });
        });
    };
    /**
    * Calls availability/complex service. In case of error returns the error objecto to show it in the view
    * @returns {Object.<Promise>} - returns a promise which when it is resolved returns the transformed data for the view and when it is rejected
    * returns the error object processed to be shown in the view
    */
    getNextInfoSlice = (responseId, offersId) => {
        return new Promise((resolve, reject) => {
            this.CallBookingAvailabilityService.getNextInfoSlice(responseId, offersId).then((availabilityData: any) => {
                resolve(availabilityData.data);
            }, (error) => {
                reject(error);
            });
        });
    };

    /**
     * Close waiting modal and shows error page
     */
    private redirectToErrorPage = () => {
        this.BookingModalService.finishWaiting();
        this.$location.path('/ibbkerror');
    };

    redirectRedemptionMarket = (fromMarket, fromLanguage) => {
        const redemptionRedirecionMap = this.BookingAppConstants.REDEMPTION_AVIOS_REDIRECTED_MARKETS;
        let search = this.$window.location.search;
        let outMarket = fromMarket;
        let outLang = fromLanguage;
        if (typeof(fromMarket) === 'string' && typeof(fromLanguage) === 'string' && typeof(redemptionRedirecionMap[fromMarket]?.marketRedirect) === 'string') {
            outMarket = (redemptionRedirecionMap[fromMarket].marketRedirect || fromMarket).toUpperCase();
            if (angular.isObject(redemptionRedirecionMap[fromMarket].localesRedirect)
                && angular.isString(redemptionRedirecionMap[fromMarket].localesRedirect[fromLanguage])
                && redemptionRedirecionMap[fromMarket].localesRedirect[fromLanguage].length > 0) {
                outLang = (redemptionRedirecionMap[fromMarket].localesRedirect[fromLanguage] || fromLanguage).toLowerCase();
                search = search.replace(/language=\w+/g, 'language=' + outLang + '&fromLanguage=' + fromLanguage.toLowerCase());
            }
            this.localStorageService.set('newRedemptionMarketsRedirections', this.BookingAppConstants.REDEMPTION_AVIOS_REDIRECTED_MARKETS);
            search = search.replace(/market=\w+/g, 'market=' + outMarket + '&fromMarket=' + fromMarket.toUpperCase());
            this.$window.location.href = this.$window.location.pathname + search;
        }
    };

    /**
     * @description Calculates the time that lefts until the flight takes of.
     * @param selectedSlice Information about selected flight slice
     * @returns An object that returns the differences betweeen actual date and fligth departure date
     *          in hors, munutes and the total time in minutes.
     * @example getSliceTimeLeft(selectedSlice) -> If the flight takes of in 90 minutes the result will be
     *          {hours: 1, minutes: 30, totalMins: 90}
     *
     */
    getSliceTimeLeft = (selectedSlice) => {
        const isMultiCity = this.localStorageService.get('multiCitySearch');
        const originDestinations: AvailabilityModels.OriginDestinationSearchModel[]= isMultiCity ? this.localStorageService.get('originDestinationMulticity') : [this.localStorageService.get('originDestination')] ;
        let selectedOD;
        if (selectedSlice){
            selectedOD = originDestinations.find((od) => {return (od.originCity.code === selectedSlice?.origin) && (od.destinationCity.code === selectedSlice?.destination );});
            const originTimeZone = selectedOD?.originCity.timezone ?? '';
            const sliceDateString = selectedSlice?.info.departureDateParsed.formatedDate;
            // Current Date local timezone
            try{
                const currentDate = new Date(new Date().toLocaleString('en-EN', {
                    timeZone: originTimeZone,
                    hour12:false
                }));
                const sliceLocalDateObject = new Date(sliceDateString);
                const totalDiffMin = (sliceLocalDateObject.getTime() - currentDate.getTime())/(60000);
                const hDiff = Math.floor(totalDiffMin/60);
                const mDiff = Math.floor(totalDiffMin - 60 * hDiff);
                return { hours : hDiff, minutes: mDiff, totalMins: Math.floor(totalDiffMin)};
            } catch {
                return null;
            }
        } else {
            return null;
        }

    };

    redirectUnavailableMarkets = () => {
        const searchParams = new URLSearchParams(this.$window.location.search);
        const configurationConstant = this.BookingAppConstants.UNAVAILABLE_MARKETS_REDIRECTION;
        const marketRedirectionConfig = configurationConstant[this.$rootScope.appMarket.toUpperCase() ?? 'DEFAULT'] ?? configurationConstant.DEFAULT;
        const appLang = this.$rootScope?.appLang?.toLowerCase();
        if (marketRedirectionConfig.localesRedirect && marketRedirectionConfig.localesRedirect[appLang]) {
            searchParams.set('language', marketRedirectionConfig.localesRedirect[appLang]);
        }
        searchParams.set('market', marketRedirectionConfig.marketRedirect);
        searchParams.set('PointOfSaleCountry', marketRedirectionConfig.marketRedirect);
        searchParams.set('bookingMarket', marketRedirectionConfig.marketRedirect);
        this.BookingRedirectionService.externalRedirect(this.$filter('LinksFilter')('IB_SEARCH_ENGINE') + '?' + searchParams.toString());
    };

}
BookingAvailabilityService.$inject = ['$rootScope', 'localStorageService', 'CallBookingAvailabilityService', 'CallPriceMatrixService', 'BookingAvailabilityTransformer', 'BookingModalService', 'BookingUtilService', 'IbBookingAirlinesLogoService', 'BookingFareService', 'BookingFareRedemptionService', '$filter', 'BookingAppConstants', 'BookingGetDestinationCitiesListService', 'BookingBackgroundImagesService', 'CommonsGetLoginInfoService', '$location', 'CookiesUtilService', 'CallBookingMetaSearchService', 'CallBookingRedemptionAvailabilityService', 'BookingRedirectionService', 'OnBusinessPointsService', 'IbBookingCalculatePointsService', '$window', 'BookingCommercialSellingDataService', 'AvailabilityDataTransformer', 'IbOriginDestinationInfoService', 'CommonsModalService', 'CommonsUserUtilsService', 'IbCheckPartnersDiscountsService', 'IbSetPartnersSelectionUtilsService', 'BookingIgnoreOrderService', 'IbBookingAvailabilityUtilsService', 'IbBookingPassengerInfoUtilsService', 'BookingErrorPageStore', 'AvailabilitySearchDateFilterService', 'DigitalDataUtilsService'];
try {
    const mod = angular.module('ib-booking-availability-module');
    mod.service(
        'BookingAvailabilityService',
        BookingAvailabilityService
    );
} catch (error) {
    const mod = angular.module('ib-booking-availability-module', []);
    mod.service(
        'BookingAvailabilityService',
        BookingAvailabilityService
    );
}
