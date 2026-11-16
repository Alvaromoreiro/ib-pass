import * as angular from 'angular';
import dayjs from 'dayjs';
import { BookingBackgroundImagesService } from '@shared/services/ib-booking-backgrounds-image-service';
import { BookingGetDestinationCitiesListService } from '@shared/http-services/rdu-loc/ib-booking-get-destination-cities.service';
import { IbFlashOfferUtilsService } from './ib-flash-offer-utils-service';
import { IbBookingCalculatePointsService } from '@src/app/shared/http-services/prlm-pc/ib-booking-calculate-points.service';
import { BookingRedirectionService } from '@shared/services/ib-utils/ib-booking-redirection.service';
import { BookingCommercialSellingDataService } from '@src/app/shared/http-services/rdu-loc/ib-booking-commercial-selling-data.service';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { AvailabilitySearchDateFilterService } from '@src/app/pages/ib-booking-availability-page/services/ib-booking-availability-searchDate-filter.service';

export class IbFlashOfferService {
    public isMetasearch = false;
    public isMultiCity = false;
    public isHMAD = false;
    public isPointsOB = false;
    public isRedemption = false;
    constructor (
        private BookingUtilService: any,
        private $location: angular.ILocationService,
        private CommonsGetLoginInfoService: CommonsGetLoginInfoService,
        private BookingModalService: any,
        private $rootScope,
        private IbCAuthTokenService: IbCAuthTokenService,
        private BookingRedirectionService: BookingRedirectionService,
        private BookingAppConstants: BookingAppConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private BookingAvailabilityConstants: any,
        private IbFlashOfferUtilsService: IbFlashOfferUtilsService,
        private IbCallDirectFareService,
        private $window: angular.IWindowService,
        private BookingBackgroundImagesService: BookingBackgroundImagesService,
        private BookingGetDestinationCitiesListService: BookingGetDestinationCitiesListService,
        private BookingCommercialSellingDataService: BookingCommercialSellingDataService,
        private BookingAvailabilityTransformer,
        private IbBookingCalculatePointsService: IbBookingCalculatePointsService,
        private AvailabilitySearchDateFilterService: AvailabilitySearchDateFilterService

    ) {}
    private getDirectFare = (data, resolve) => {
        const faredata = data.data.offers[0];
        const oBDiscountInfo = [];
        let  index = 0,  obIndex = 0;
        while (faredata.specialDiscountsApplied.length > index) {
            if (faredata.specialDiscountsApplied[index].type === this.BookingAvailabilityConstants.CORPORATE) {
                oBDiscountInfo[obIndex] = {};
                oBDiscountInfo[obIndex].corporateDiscountType = faredata.specialDiscountsApplied[index].discountType;
                oBDiscountInfo[obIndex].discount =
                    faredata.priceSpecialDiscount && faredata.priceSpecialDiscount.totalDiscount ?
                        faredata.priceSpecialDiscount.totalDiscount :
                        this.localStorageService.get('formatedPriceDifference');
                obIndex++;
            }
            index++;
        }
        this.localStorageService.set('fareData', data.data);
        this.localStorageService.set('loadingNextFlow', 2);
        this.localStorageService.set('orderItemsId', [data.data.offers[0].offerItems[0].offerItemId]);
        this.localStorageService.set('oBDiscountInfo', oBDiscountInfo);
        this.localStorageService.set('fareFamilyConditionsInfo', data.data.fareFamilyConditions);
        this.localStorageService.set('cashAviosPossibilities', data.data.offers[0].cashAviosPossibilities);
        this.localStorageService.set('responseId', data.data.responseId);
        this.getCalculatedPoints(data.data).then(
            () => {
                resolve(data);
            },
            (error) => {
                if (error) {
                    resolve(data);
                }
            }
        );
    };

    private startBasicAvailabilityServices = (resolve, reject) => {
        const values = this.IbFlashOfferUtilsService.createRequestDirectFare();
        const getCommercialInfoSuccess = () =>{
            this.IbCallDirectFareService.getDirectFare(values.request)
                .then((data) =>{
                    this.getDirectFare(data, resolve);
                })
                .catch((error) => {
                    this.BookingModalService.showGenericError(error).result.finally(() => {
                        this.BookingUtilService.redirectToFlash();
                    });
                });
        };

        this.initBooking().then(
            () => {
                this.BookingCommercialSellingDataService.getCommercialInfo().finally(
                    getCommercialInfoSuccess
                );
            },
            (error) =>{
                reject(error);
            });
    };
    private checkIsLogged = (isLogged, resolve, reject) => {
        if (
            (isLogged === true && !this.$rootScope.isPointsOBFlow) ||
            (
                isLogged === 'ONB' &&
                ( this.$rootScope.isRedemptionFlow === this.$rootScope.isPointsOBFlow)
            )
        ) {
            this.startBasicAvailabilityServices(resolve, reject);
        } else {
            if (!this.$rootScope.isRedemptionFlow || !this.$rootScope.isPointsOBFlow) {
                this.IbCAuthTokenService.getAnonymousToken().then(() => {
                    this.startBasicAvailabilityServices(resolve, reject);
                },
                (error)=>{
                    reject(error);
                });

            } else if (this.$rootScope.isPointsOBFlow) {
                this.BookingRedirectionService.redirectToLoginPage();
            } else {
                this.BookingRedirectionService.redirectToLoginPage(this.$location.absUrl());
            }
        }
    };

    callInitBooking  = () => {
        let redirectToLogin = this.localStorageService.get('goToLoginPage');
        if(redirectToLogin === null){
            redirectToLogin = true;
        }
        if(this.$location.url() !== '/ibpbah') {
            this.BookingUtilService.initStorage();
        }
        return new Promise((resolve, reject) => {
            this.CommonsGetLoginInfoService.checkCustomerStatus(!redirectToLogin).then(
                (data) => {
                    this.checkIsLogged(data, resolve, reject);
                }, (error) => {
                    this.BookingModalService.showGenericError(error, false).result.finally(() => {
                        this.checkIsLogged(false, resolve, reject);
                    });
                });
        });
    };

    private initBooking  = () => {
        const PARAM_YES = 'SI', PARAM_TRUE = 'true';
        const redirectToErrorPage = () => {
            this.BookingModalService.finishWaiting();
            this.$location.path('/ibbkerror');
        };

        const checkParamsOfURL = (params) => {
            let i, result = false;
            for (i in params) {
                if (params[i] !== null && params[i] !== '') {
                    result = true;
                }
            }
            if (!result) {
                redirectToErrorPage();
            }
        };

        const getInitialParameters = () => {
            return new Promise((resolve, reject) => {
                const returnParams = (originDestinations) => {
                    bookingUrlParams.originDestinations = originDestinations;
                    const  params = {
                        market: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.MARKET),
                        language: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.LANGUAGE),
                        channel: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.CHANNEL),
                        device: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.DEVICE),
                        errorCode: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.CODE_ERROR),
                        bookingUrlParams: bookingUrlParams
                    };
                    resolve(params);
                };
                const getSlices = (slice) => {
                    let i = 1,  slicesEnd = false;
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
                let invalidTripDate = false;
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
                    fromLanguage: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.LANGUAGE_FROM)
                };

                this.isMetasearch = !!(bookingUrlParams.referralId && bookingUrlParams.bookingCode1);
                this.isMultiCity = !!(bookingUrlParams.numTrips || bookingUrlParams.tripType === 'MultiCity');
                this.isHMAD = bookingUrlParams.searchOrigin === 'HMADVS';
                this.localStorageService.set('isHMAD', this.isHMAD);
                this.isPointsOB = !!bookingUrlParams.payWithPoints;
                this.isRedemption = bookingUrlParams.payWithAvios ? true : this.isPointsOB;
                this.$rootScope.isRedemptionFlow = this.isRedemption;
                this.$rootScope.isPointsOBFlow = this.isPointsOB;
                let searchFlightType = this.BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY;
                if (this.isMetasearch && !this.isMultiCity) {
                    searchFlightType = this.BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH;
                }else if(this.isMultiCity) {
                    searchFlightType = this.BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP;
                }else if(this.isRedemption) {
                    searchFlightType = this.BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION;
                }else if(this.isPointsOB) {
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
                if (!invalidTripDate) {
                    getOriginDestinations(bookingUrlParams).then(returnParams, returnParams);
                }
            });
        };

        const getOriginDestinations = (bookingUrlParams) => {

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
            const originDestinations = [];
            const originDestinationMulticity = [];
            let segmentEnd = false;
            return new Promise((resolve, reject) => {
                const getBackgroundImagesSuccess  = () => {
                    const originDestination: AvailabilityTransformerModel.OriginDestination = this.localStorageService.get('originDestination');
                    if (originDestination && originDestination.destinationCity && originDestination.destinationCity.code) {
                        this.$rootScope.backGroundImage = this.BookingUtilService.getBackGroundURL(originDestination.destinationCity.code);
                    } else {
                        this.$rootScope.backGroundImage = this.BookingAppConstants.backgroundImagesBaseRoute + this.BookingAppConstants.defaultBackgroundImage;
                    }

                    resolve(originDestinations);
                };
                const getDestinationCitiesListSuccess = () => {
                    const getOriginDestinationsMulticity = () => {
                        let i, slicesInfo, originDestinationAux: AvailabilityTransformerModel.OriginDestination = null, destinationAux = null;
                        if(bookingUrlParams && bookingUrlParams.slices) {
                            slicesInfo =  bookingUrlParams.slices;
                        }else{
                            slicesInfo = [];
                        }
                        if (this.isMetasearch && slicesInfo.length > 0) {
                            for (i = 0; i < slicesInfo.length; i++) {
                                originDestinationAux = null;
                                destinationAux = null;
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
                    let i = 1;
                    let currentOrigins = [], currentDestinations = [], availabilityDestinations = [];
                    let originDestination: AvailabilityTransformerModel.OriginDestination = null;
                    const newAvailabilityRequestData: AvailabilityTransformerModel.AvailabilityRequestData = this.localStorageService.get('newAvailabilityRequestData');
                    const availabilityRequestData: AvailabilityTransformerModel.AvailabilityRequestData = this.localStorageService.get('availabilityRequestData');
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
                                    originDestinations[i - 1].flightNumber = this.BookingUtilService.getURLFirstParameterByName(`${this.BookingAppConstants.BOOKING_PARAMS_NAMES.FLIGHTNUMBER}${i}`);
                                    originDestinations[i - 1].bookingCode = this.BookingUtilService.getURLFirstParameterByName(`${this.BookingAppConstants.BOOKING_PARAMS_NAMES.BOOKINGCODE}${i}`);
                                    originDestinations[i - 1].carrier = this.BookingUtilService.getURLFirstParameterByName(`${this.BookingAppConstants.BOOKING_PARAMS_NAMES.CARRIER}${i}`);
                                    originDestinations[i - 1].cabin = this.BookingUtilService.getURLFirstParameterByName(`${this.BookingAppConstants.BOOKING_PARAMS_NAMES.CABIN}${i}`);
                                    if (this.BookingUtilService.getURLFirstParameterByName(`${this.BookingAppConstants.BOOKING_PARAMS_NAMES.FARE_CODE}${i}`)) {
                                        originDestinations[i - 1].fareBasis = this.BookingUtilService.getURLFirstParameterByName(`${this.BookingAppConstants.BOOKING_PARAMS_NAMES.FARE_CODE}${i}`);
                                    }
                                }
                            }
                        }
                        i++;
                    }
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
                    this.BookingBackgroundImagesService.getBackgroundImages().finally(getBackgroundImagesSuccess);
                };
                this.BookingGetDestinationCitiesListService.getDestinationCitiesList().finally(
                    getDestinationCitiesListSuccess
                );
            });
        };
        return new Promise((resolve, reject) => {
            const initParams  = (params) => {
                this.localStorageService.set('channel', params.channel || '');
                this.localStorageService.set('bookingUrlParams', params.bookingUrlParams);
                this.localStorageService.set('isFlexibleDates', params.bookingUrlParams.flexDates && (params.bookingUrlParams.flexDates.toUpperCase() === PARAM_YES || params.bookingUrlParams.flexDates.toLowerCase() === PARAM_TRUE));
                resolve(null);
            };
            if (this.localStorageService.isSupported) {
                this.localStorageService.set('buildNumber', this.BookingUtilService.generateBuildNumberQueryString());
                getInitialParameters().then(initParams, initParams);
            } else {
                this.BookingModalService.showGenericError({
                    title: 'PRIVATE_BROWSER_DETECTED_TITLE',
                    needsTranslate: true,
                    hideClose: true,
                    hideFooter: true,
                    message: 'PRIVATE_BROWSER_DETECTED_BODY'
                }, true).result.finally(() =>{});
                reject(null);
            }
        });
    };

    private getCalculatedPoints = (fareData) => {
        let trans_points = { Avios: 0, Elite: 0 };
        const request = this.BookingAvailabilityTransformer.genCalcAviosFlightReq(fareData);
        this.localStorageService.set('flightAviosInfo', request);
        return new Promise((resolve, reject) => {
            this.IbBookingCalculatePointsService.getCalculateFlightsAvios(request).then((response) => {
                trans_points = this.BookingAvailabilityTransformer.TransCalcPointsData(response);
                if (this.localStorageService.get(BkiStorageConstants.CALCULATED_POINTS)) { this.localStorageService.remove(BkiStorageConstants.CALCULATED_POINTS); }
                this.localStorageService.set(BkiStorageConstants.CALCULATED_POINTS, trans_points);
                resolve(response);
            }, (error) => {
                if (this.localStorageService.get(BkiStorageConstants.CALCULATED_POINTS)) { this.localStorageService.remove(BkiStorageConstants.CALCULATED_POINTS); }
                reject(error);
            });
        });
    };
}
IbFlashOfferService.$inject = [
    'BookingUtilService',
    '$location',
    'CommonsGetLoginInfoService',
    'BookingModalService',
    '$rootScope',
    'IbCAuthTokenService',
    'BookingRedirectionService',
    'BookingAppConstants',
    'localStorageService',
    'BookingAvailabilityConstants',
    'IbFlashOfferUtilsService',
    'IbCallDirectFareService',
    '$window',
    'BookingBackgroundImagesService',
    'BookingGetDestinationCitiesListService',
    'BookingCommercialSellingDataService',
    'BookingAvailabilityTransformer',
    'IbBookingCalculatePointsService',
    'AvailabilitySearchDateFilterService'
];
try {
    const mod = angular.module('ib-flash-offer-service-module');
    mod.service(
        'IbFlashOfferService',
        IbFlashOfferService
    );
} catch (error) {
    const mod = angular.module('ib-flash-offer-service-module', []);
    mod.service(
        'IbFlashOfferService',
        IbFlashOfferService
    );
}
