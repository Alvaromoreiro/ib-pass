import * as angular from 'angular';

import { IbBookingCalculatePointsService } from '@src/app/shared/http-services/prlm-pc/ib-booking-calculate-points.service';
import { BookingGetCompaniesService } from '@shared/http-services/framework-services/ib-booking-get-companies-service';
import { BookingFareService } from '@src/app/shared/services/ib-booking-fare/ib-booking-fare.service';
import { GdprService } from '@shared/http-services/rdu-loc/ib-gdpr-service';
import { CallBookingMetaSearchService } from '@shared/http-services/sse-avm/ib-call-booking-metasearch.service';
import { IbSetPartnersSelectionUtilsService } from '@shared/components/ib-booking-partners-modal/ib-set-partners-selection.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingLocalDiscountsService } from '@shared/services/ib-booking-availability/ib-booking-utils-local-discounts.service';
import { BookingRedirectionService } from '@shared/services/ib-utils/ib-booking-redirection.service';
import { CallAncillariesService } from '@shared/http-services/ass-fass/ib-call-ancillaries.service';
import { IbBookingPassengerInfoUtilsService } from '@src/app/shared/services/ib-booking-passenger-info/ib-booking-passenger-info-utils.service';
import { IbTravelDocumentsService } from '@shared/http-services/mi-iberia-cloud/ib-travel-documents.service';
import { AncillariesStatusResponseModel } from '@src/app/core/models/ancillaries/ancillaries-status-response-model';
import { IgnoreOrderService } from '@src/app/shared/http-services/sse-orm/ib-booking-ignore-order.service';
import { PassengerControlOrderService } from './ib-booking-passenger-control-order.service';
import { CreateOrderRequestData, OrderData } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { BookingPromiseProxy} from '@shared/http-services/proxy/ib-booking-promise-proxy.service';
import { BookingPromiseSalesforceProxy } from '@src/app/shared/http-services/proxy/ib-booking-promise-salesforce-proxy.service';
import { CommercialDataMarket } from '@src/app/core/models/generic-models/generic-models';

export class BookingPassengerInfoService {
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private BookingPromiseProxy: BookingPromiseProxy,
        private HttpServicesConstants: HttpServicesConstantsType,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private BookingGetCompaniesService: BookingGetCompaniesService,
        private GetPhoneCodesService: GetPhoneCodesService,
        private GetCountriesListService: GetCountriesListService,
        private BookingPassengerInfoTransformer,
        private $timeout: angular.ITimeoutService,
        private BookingPassengerInfoConstants,
        private BookingUtilService,
        private BookingFareService: BookingFareService,
        private GdprService: GdprService,
        private IbBookingCalculatePointsService: IbBookingCalculatePointsService,
        private $window: angular.IWindowService,
        private CallBookingMetaSearchService: CallBookingMetaSearchService,
        private IBCTravelPreferencesService: IBCTravelPreferencesService,
        private IBCContactDataService: IBCContactDataService,
        private IBCAssociatesService: IBCAssociatesService,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private IBCContactDetailsZeroService: IBCContactDetailsZeroService,
        private IBCPersonalDataZeroService: IBCPersonalDataZeroService,
        private IBCPersonalDataService: IBCPersonalDataService,
        private IBCAssociatesZeroService: IBCAssociatesZeroService,
        private IbSetPartnersSelectionUtilsService:IbSetPartnersSelectionUtilsService,
        private BookingIgnoreOrderService: IgnoreOrderService,
        private BookingRedirectionService:	BookingRedirectionService,
        private BookingPromiseSalesforceProxy: BookingPromiseSalesforceProxy,
        private BookingLocalDiscountsService: BookingLocalDiscountsService,
        private BookingAppConstants: BookingAppConstants,
        private CurrencyService: CurrencyService,
        private CallAncillariesService: CallAncillariesService,
        private $cookies: angular.cookies.ICookiesService,
        private IbBookingPassengerInfoUtilsService: IbBookingPassengerInfoUtilsService,
        private IbTravelDocumentsService: IbTravelDocumentsService,
        private PassengerControlOrderService: PassengerControlOrderService
    ) {}

    createBookingOrder = (modelData, onHold) => {
        const passengersInvalid = this.BookingPassengerInfoTransformer.arePassengersBirthDatesValid( modelData );
        return new Promise((resolve: (value: OrderData) => void, reject) => {
            if (passengersInvalid.length === 0) {
                const requestData = this.BookingPassengerInfoTransformer.transformUpdatePassengerInfoData( modelData, onHold ) as CreateOrderRequestData;
                this.PassengerControlOrderService.controlOrder( requestData, onHold ).then( ( data ) => resolve( data ) ).catch( ( error ) => reject(error) );
            } else {
                this.$timeout(() => {
                    reject({
                        errorCode: this.BookingPassengerInfoConstants.BIRTH_DATE_ERROR_CODE,
                        message: 'IBAIRP_BIRTH_DATE_ERROR',
                        needsTranslate: true,
                        internalErrorCode: '',
                        passengersInvalid: passengersInvalid
                    });
                });
            }
        });
    };    

    recoverUserName = (mail) => {
        const endpoint = this.HttpServicesConstants.DEFAULT_ENDPOINTS.recoverUserName.replace('{{programme-identifier}}', 'IBP');
        return new Promise((resolve, reject) => {
            this.BookingPromiseProxy.post(endpoint, mail).then(
                (response) => {
                    resolve(response);
                },
                (error)=>{
                    reject(this.BookingPassengerInfoTransformer.transformProfileRemindError(error));
                });
        });
    };

    getCalculatedPoints = (fareData) => {
        const request = this.BookingPassengerInfoTransformer.genCalcAviosFlightReq(fareData);
        this.CommonsSessionStorageService.set('flightAviosInfo', request);
        return new Promise((resolve, reject) => {
            this.IbBookingCalculatePointsService.getCalculateFlightsAvios(request).then(
                (response) =>{
                    const calculatePoints = this.CommonsSessionStorageService.get(BkiStorageConstants.CALCULATED_POINTS);
                    const trans_points = this.BookingPassengerInfoTransformer.TransCalcPointsData(response);
                    if (calculatePoints) {
                        this.CommonsSessionStorageService.remove(BkiStorageConstants.CALCULATED_POINTS);
                    }
                    this.CommonsSessionStorageService.set(BkiStorageConstants.CALCULATED_POINTS, trans_points);
                    resolve(trans_points);
                },
                (error) => {
                    const calculatePoints = this.CommonsSessionStorageService.get(BkiStorageConstants.CALCULATED_POINTS);
                    if (calculatePoints) {
                        this.CommonsSessionStorageService.remove(BkiStorageConstants.CALCULATED_POINTS);
                    }
                    reject(error);
                });
        });
    };

    updateCalculatedPoints = () => {
        const request: CalculateAncillariesAviosSummaryRequest.AncillarySummaryRequest = this.CommonsSessionStorageService.get('flightAviosInfo');
        return new Promise((resolve, reject) => {
            this.IbBookingCalculatePointsService.getCalculateFlightsAvios(request).then(
                (response) =>{
                    const calculatePoints = this.CommonsSessionStorageService.get(BkiStorageConstants.CALCULATED_POINTS);
                    const trans_points = this.BookingPassengerInfoTransformer.TransCalcPointsData(response);
                    if (calculatePoints) {
                        this.CommonsSessionStorageService.remove(BkiStorageConstants.CALCULATED_POINTS);
                    }
                    this.CommonsSessionStorageService.set(BkiStorageConstants.CALCULATED_POINTS, trans_points);
                    resolve(trans_points);
                },
                (error) => {
                    const calculatePoints = this.CommonsSessionStorageService.get(BkiStorageConstants.CALCULATED_POINTS);
                    if (calculatePoints) {
                        this.CommonsSessionStorageService.remove(BkiStorageConstants.CALCULATED_POINTS);
                    }
                    reject(error);
                });
        });
    };
    updatePersonalData = (reqPersonaltData) => {
        return new Promise((resolve, reject) => {
            let serviceToCall;
            const requestData = this.BookingPassengerInfoTransformer.generatePersonalDataReq(reqPersonaltData);
            if (this.CommonsUserUtilsService.isIbZero()) {
                serviceToCall = this.IBCPersonalDataZeroService.updatePersonalData(requestData);
            } else {
                serviceToCall = this.IBCPersonalDataService.updatePersonalData(requestData);
            }
            serviceToCall.then(
                (response) => {
                    resolve(response);
                },
                (error) => {
                    reject(error);
                });
        });
    };

    updateTravPreferences = (reqTravPref) => {
        return new Promise((resolve, reject) => {
            this.IBCTravelPreferencesService.updateTravelPreferences(
                this.BookingPassengerInfoTransformer.generateTravPrefReq(reqTravPref)
            ).then(
                (response) =>{
                    resolve(response);
                },
                (error) => {
                    reject(error);
                });
        });
    };

    checkEmailConsent = (requestData) => {
        const url = this.HttpServicesConstants.DEFAULT_ENDPOINTS.verifyEmailConsentURI;
        return new Promise( (resolve, reject) => {
            this.BookingPromiseSalesforceProxy.post(url, requestData).then(
                (response) => {
                    resolve(response);
                },
                (error) =>{
                    reject(error);
                });
        });
    };

    insertEmailConsent = (requestData) => {
        const url = this.HttpServicesConstants.DEFAULT_ENDPOINTS.insertEmailConsentURI;
        return new Promise((resolve, reject) => {
            this.BookingPromiseSalesforceProxy.post(url, requestData).then(
                (response) => {
                    resolve(response);
                },
                (error) => {
                    reject(error);
                });
        });
    };

    checkCodePrefix = (model, prefix) => {
        const value = prefix.find( element => element.code === model.code);
        return value.countryCode;
    };

    cleanErrorResidents = (passengers) => {
        this.BookingPassengerInfoTransformer.cleanErrorResidents(passengers);
    };

    generateBookingInfoModel = (orderData) => {
        const bkiInfoModel =  this.BookingPassengerInfoTransformer.generateBookingInfoModel(orderData);
        this.CommonsSessionStorageService.set('bookingInfo', bkiInfoModel);
        return bkiInfoModel;
    };

    getPassengerInfo = () => {
        let associatesCollection = [], travelPreferences = null, contactData = null, discountData = null, travelDocuments = null;
        const passengerInfoData = {
            countriesList:null,
            businessCodeType: null,
            companiesList: null,
            securityInfoData: null
        };
        const loggedUser = this.CommonsSessionStorageService.get('userLogged') || false;



        return new Promise((resolve, reject) => {
            const getFareInfoSuccess = (securityInfoServiceData, prefixes, gdprData, phoneCodesHasError) => {
                const fareData: any = this.CommonsSessionStorageService.get('fareData');
                const setPassengerInfo = () => {
                    const { prefixes: effectivePrefixes, isFallback: phonePrefixFallback } = this.applyPhonePrefixFallback(prefixes, phoneCodesHasError);
                    passengerInfoData.securityInfoData = this.BookingPassengerInfoTransformer.transformSecurityInfoPassengerData( 
                        securityInfoServiceData, effectivePrefixes, gdprData, fareData, travelPreferences, contactData, discountData, travelDocuments);
                    passengerInfoData.securityInfoData.phonePrefixFallback = phonePrefixFallback;
                    passengerInfoData.securityInfoData.transformedSecurityInfoPassengerData.frequentlyPassengers = associatesCollection;
                    resolve(passengerInfoData);
                };
                const retrieveAssociatesFromUser = () => {
                    let serviceToCall;
                    if (this.CommonsUserUtilsService.isIbZero()) {
                        serviceToCall = this.IBCAssociatesZeroService.getRetrieveAssociateZero();
                    } else {
                        serviceToCall = this.IBCAssociatesService.getRetrieveAssociate();
                    }
                    return serviceToCall.then(
                        (response)=> {
                            associatesCollection = this.BookingPassengerInfoTransformer.getAssociatesTransformed(response);
                            return associatesCollection ?? [];
                        },
                        () => null);
                };
                const getTravelPrefSucc = (travPrefresponse) => {
                    this.CommonsSessionStorageService.set('travelPreferences', travPrefresponse.data);
                    travelPreferences = travPrefresponse.data;
                };
                const getContactDataSucc = (contactResponse) => {
                    this.CommonsSessionStorageService.set('contactDetails', contactResponse.data);
                    contactData = this.BookingPassengerInfoTransformer.transformContactData(contactResponse.data);
                };
                const getTravelPref = () => {
                    return this.IBCTravelPreferencesService.getTravelPreferences().then(
                        getTravelPrefSucc,
                        () => {
                            getTravelPrefSucc({
                                code: 200,
                                data: {
                                    airportCode: null,
                                    seatPreference: null,
                                    dietPreference: null,
                                    blind: false,
                                    deaf: false,
                                    svan: false,
                                    wheelChair: '00'
                                }
                            });
                        });
                };
                const getDiscountsData = () => {
                    const endpoint: string = this.HttpServicesConstants.SALESFORCE_ENDPOINTS.DISCOUNTS_DATA_IBPLUS;
                    const originDestination:any = this.CommonsSessionStorageService.get( 'originDestination' ) ?? null;
                    const urlParams: any = this.CommonsSessionStorageService.get( 'bookingUrlParams' ) ?? null;
                    const origin: string = originDestination?.originCity?.code ?? '';
                    const destination: string = originDestination?.destinationCity?.code ?? '';
                    const travelCities: boolean = origin !== '' && destination !== '';
                    const largeFamily:any = urlParams?.largeFamilyType ?? null;
                    const resident:any = urlParams?.resident ?? null;
                    const largeFamilyAvailable: boolean = largeFamily ?? false;
                    let residentAvailable: boolean = false;
                    if ( travelCities && resident ) residentAvailable = this.BookingLocalDiscountsService.isResidentAvailable( origin, destination );
                    const discountsAvailables = residentAvailable || largeFamilyAvailable ?  true : false;
                    if ( !discountsAvailables ) return;
                    return this.BookingPromiseSalesforceProxy.get(endpoint)
                        .then(response => {
                            discountData = response.data ?? null;
                        }, () => null);
                };
                const getContactData = () => {
                    let serviceToCall;
                    const contactDetails = this.CommonsSessionStorageService.get('contactDetails');
                    if(contactDetails != null) {
                        return getContactDataSucc({ data: contactDetails });
                    }

                    if (this.CommonsUserUtilsService.isIbZero()) {
                        serviceToCall = this.IBCContactDetailsZeroService.getContactDetailsData();
                    } else {
                        serviceToCall = this.IBCContactDataService.getContactData();
                    }
                    return serviceToCall.then(getContactDataSucc, getContactDataSucc);
                };
                const getTravelDocs = () => {
                    return this.IbTravelDocumentsService.getTravelDocuments().then((response)=>{
                        this.CommonsSessionStorageService.set('travelDocuments', response.data);
                        travelDocuments = response.data;
                    }, () => {});
                };
                /**
                 * @name getUserDetails
                 * @description  Get all user information to fill the several passenger forms.
                 *              This method is called only if the user is logged in.
                 *               All services are called in parallel and treats its own errors.
                 * @returns {Promise}
                 */
                const getUserDetails = () => {
                    const callTravelDocs = this.CommonsSessionStorageService.get<boolean>('activateTravelDocs');
                    const contactDataPromise = getContactData();
                    const userDiscountsPromise = getDiscountsData();
                    const getTravelPrefPromise = getTravelPref();
                    const retrieveAssociatesFromUserPromise = retrieveAssociatesFromUser();
                    const getTravelDocsPromise = callTravelDocs && getTravelDocs();
                    return Promise.all([contactDataPromise, userDiscountsPromise, getTravelPrefPromise, retrieveAssociatesFromUserPromise, getTravelDocsPromise])
                        .then(setPassengerInfo, setPassengerInfo);
                };
                loggedUser === true && !this.CommonsUserUtilsService.isSoftUser() ? getUserDetails() : setPassengerInfo();
            };




            const callPhoneCodesService = () => {
                return this.GetPhoneCodesService.getPhoneCodesList()
                    .then((prefixesList) => ({ prefixes: prefixesList, hasError: false }), () => ({ prefixes: [], hasError: true }));
            };
            const callCountriesListService = () => {
                return this.GetCountriesListService.getCountriesList().then((countriesList) => countriesList, () => []);
            };
            const CallCompaniesListService = () => {
                return this.BookingGetCompaniesService.getCompanies().then((companies) => companies, () => []);
            };
            const callGdprService = (isUserPlusAndHard: boolean) => {
                return this.GdprService.getGdprInfo(isUserPlusAndHard).then((data) => { return data; }, ()=> null);
            };
            const callSecurityInfoService = () => {
                const fareData: any = this.CommonsSessionStorageService.get('fareData');
                const flowId = fareData.responseId;
                const passengerId = this.BookingUtilService.getPassengersId(fareData.passengers);
                const endpoint = this.HttpServicesConstants.DEFAULT_ENDPOINTS.securityInfoServiceURI + flowId + '/security' + passengerId;
                const config: any = {
                    headers: {
                        'Cache-Control': 'private, max-age=600'
                    }
                };

                return this.BookingPromiseProxy.get(endpoint, config).then((data) => data?.data, (error) => Promise.reject(error));

            };
            /**
             * @name callPassengerPageMainServices
             * @description Call all services needed to render all fields in passenger page. The services must be called in parallel and each promise must control its own error
             *  if it does not provide any critical information required to continue with the booking flow.
             * @returns {Promise}
             */
            const callPassengerPageMainServices = () => {
                const isUserPlusAndHard = this.CommonsUserUtilsService.isIbPlus() && !this.CommonsUserUtilsService.isSoftUser();
                const phoneCodesPromise = callPhoneCodesService();
                const countriesListPromise = callCountriesListService();
                const companiesListPromise = CallCompaniesListService();
                const securityInfoPromise = callSecurityInfoService();
                const gdprDataPromise = callGdprService(isUserPlusAndHard);


                return Promise.all([phoneCodesPromise, countriesListPromise, companiesListPromise, gdprDataPromise, securityInfoPromise])
                    .then((data) => {
                        
                        const phoneCodesResponse = data[0] || { prefixes: [], hasError: true };
                        const prefixes = phoneCodesResponse.prefixes;
                        const phoneCodesHasError = phoneCodesResponse.hasError;

                        passengerInfoData.countriesList = data[1] ?? [];
                        passengerInfoData.businessCodeType = this.BookingPassengerInfoConstants.businessCodeType;
                        passengerInfoData.companiesList = data[2] ?? [];
                        const securityResponse = data[4];
                        getFareInfoSuccess(securityResponse, prefixes, data[3], phoneCodesHasError);
                    })
                    .catch((error) => {
                        this.CommonsNewHttpUtilsErrorService.controlError(error ?? {}, reject);
                    });
            };
            callPassengerPageMainServices();
        });
    };

    applyPhonePrefixFallback (prefixes, phoneCodesHasError) {
        if (!phoneCodesHasError) {
            return {
                prefixes,
                isFallback: false
            };
        }

        return {
            prefixes: this.buildFallbackPrefixesFromMarket(),
            isFallback: true
        };
    }

    buildFallbackPrefixesFromMarket () {
        const commercialSellingData: CommercialDataMarket = this.CommonsSessionStorageService.get('commercialData');
        const marketCode = commercialSellingData?.market?.code ?? null;
        const rawPrefix = commercialSellingData?.defaultValues?.defaultPhonePrefix?.code ?? null;
        const marketPhonePrefix = rawPrefix ? `+${rawPrefix}` : null;

        return marketPhonePrefix ? [{ code: marketPhonePrefix, countryCode: marketCode, isDefault: true }] : [];
    }
    
    goToRecoveryFlow = ():Promise<any> => {
        return new Promise((resolve, reject) => {
            const redirectToRecovery = () => {
                this.IbBookingPassengerInfoUtilsService.deleteTemporalPNR();
                const recoveryURL = this.BookingPassengerInfoTransformer.generateMetaUrl();
                this.BookingRedirectionService.externalRedirect(recoveryURL.recoveryLink);
                resolve(null);

            };
            const orderData: any = this.CommonsSessionStorageService.get('createOrderData');
            const orderId = orderData?.order?.orderId;
            if (orderId) {
                this.BookingIgnoreOrderService.ignoreOrder(orderId)
                    .then(redirectToRecovery, redirectToRecovery);
            } else {
                redirectToRecovery();
                resolve(null);
            }

        });
    };

    checkFareUpdated = (): Promise<any> => {
        return new Promise((resolve, reject) => {
            const searchFlightType = this.CommonsSessionStorageService.get('searchFlightType');
            const isMetasearch =  searchFlightType === 'metasearchFlight';
            const recentLoggedUrl = this.CommonsSessionStorageService.get('recentLoggedUrl');
            const successCallback = () => {
                this.CommonsSessionStorageService.set('loginAccessPassengerInfo', false);
                resolve(null);
            };
            if (recentLoggedUrl === this.$window.location.hash) {
                this.CommonsSessionStorageService.remove('recentLoggedUrl');
                if(isMetasearch) {
                    const availabilityRequestData = this.CommonsSessionStorageService.get('availabilityRequestData');
                    this.CallBookingMetaSearchService.getBookingMetaSearch(availabilityRequestData).then(successCallback, reject);
                }else {
                    const requestFareInfo : any = this.CommonsSessionStorageService.get('requestFareInfo');
                    if (this.CommonsUserUtilsService.isIbPlus()) {
                        this.IbSetPartnersSelectionUtilsService.checkPartnerDiscountSelection().then((partnerSelected)=> {
                            if (partnerSelected) {
                                requestFareInfo.partnerDiscount = partnerSelected.partnerIdentifier;
                            } else if (requestFareInfo.partnerDiscount) {
                                delete requestFareInfo.partnerDiscount;
                            }
                            this.CommonsSessionStorageService.set('requestFareInfo', requestFareInfo);
                            this.BookingFareService.getBookingFare(requestFareInfo).then(
                                successCallback, reject );

                        });
                    } else {
                        this.BookingFareService.getBookingFare(requestFareInfo).then(
                            successCallback, reject);
                    }
                }
            } else {
                resolve(null);
            }
        });


    };
    findAvailableAncillary = (ancillariesInfo: AncillariesStatusResponseModel): boolean => {
        const ancillariesToExclude = [
            this.BookingAppConstants.ANCILLARIES_TYPES.WINE_CLUB,
            this.BookingAppConstants.ANCILLARIES_TYPES.CO2_FOOTPRINT
        ];
        const hasAncillariesAvailables = ancillariesInfo.ancillaries.some(anc => (anc.status.code === this.BookingAppConstants.GENERAL_STATUS.AVAILABLE && (!ancillariesToExclude.includes(anc.type)) ));
        return hasAncillariesAvailables;
    };
    setSeatsSegmentsAvailable = ( segment, ancillariesInfo) => {
        const segments=[];
        ancillariesInfo.forEach((ancillarie) => {
            if (ancillarie.type === this.BookingAppConstants.ANCILLARIES_TYPES.SEAT ) {
                ancillarie.segments.forEach((data) => {
                    const id = segment.filter((segmentElement) => {
                        return segmentElement === data.id &&
                            this.BookingAppConstants.GENERAL_STATUS.AVAILABLE === data.status.code;
                    });
                    if(id.length > 0) {
                        segments.push(id[0]);
                    }
                });
            }
        });
        this.CommonsSessionStorageService.set('seatsAvailableSegments', segments);
    };
    checkSeatType = (ancillariesInfo: AncillariesStatusResponseModel): void => {
        const passengerSelected = [];
        const segmentsAvailable = [];
        const seatAncillary = ancillariesInfo.ancillaries.find(anc => anc.type === this.BookingAppConstants.ANCILLARIES_TYPES.SEAT);
        if(seatAncillary){
            for (let j = 0; j < seatAncillary.segments.length; j++) {
                for (let k = 0; k < seatAncillary.segments[j].passengers.length; k++) {
                    passengerSelected[k] = seatAncillary.segments[j].passengers[k].id;
                }
                this.CommonsSessionStorageService.set('passengersSelected', passengerSelected);
                segmentsAvailable[j] = seatAncillary.segments[j].id;
            }
            this.CommonsSessionStorageService.set('ancillariesAvailableSegments', segmentsAvailable);
            this.setSeatsSegmentsAvailable(segmentsAvailable, ancillariesInfo.ancillaries);
        }
    };

    checkBobType = (ancillariesInfo: AncillariesStatusResponseModel): void => {
        let urlbob;
        const bobAncillary = ancillariesInfo.ancillaries.find(anc => anc.type === this.BookingAppConstants.ANCILLARIES_TYPES.BOB);
        
        if(bobAncillary) urlbob = bobAncillary.externalUrl;
        this.CommonsSessionStorageService.set('ancillariesBob', urlbob);
    };

    checkCo2FootPrint = (ancillariesInfo: AncillariesStatusResponseModel): void => {
        let co2Info;
        const co2Ancillary = ancillariesInfo.ancillaries.find(anc => anc.type === this.BookingAppConstants.ANCILLARIES_TYPES.CO2_FOOTPRINT);
        if(co2Ancillary) {
            co2Info = {
                price: co2Ancillary.price,
                kilosCo2Equivalent: co2Ancillary.kilosCo2Equivalent,
                status: co2Ancillary.status.code
            };
            this.CommonsSessionStorageService.set('ancillariesCO2', co2Info);
        }
    };

    actionsInSpecialAncillaries = (ancillariesInfo: AncillariesStatusResponseModel ): void => {    
        this.checkSeatType(ancillariesInfo);
        this.checkBobType(ancillariesInfo);
        this.checkCo2FootPrint(ancillariesInfo);
    };

    checkAncillaries = () => {
        return new Promise((resolve, reject) => {
            const getAncillariesSuccess = (ancillariesInfo) => {
                const ancillariesAvailable = this.findAvailableAncillary(ancillariesInfo);
                
                this.actionsInSpecialAncillaries(ancillariesInfo);

                if (ancillariesAvailable) {
                    this.CommonsSessionStorageService.set('ancillariesInfo', ancillariesInfo);
                    this.CommonsSessionStorageService.set('currency', this.CurrencyService.getCurrencyObject(ancillariesInfo.currencies[0]));
                }
                resolve(ancillariesAvailable);
            };
            this.CallAncillariesService.getAncillaries().then(
                getAncillariesSuccess,
                (error) => {
                    reject(error);
                });
        });
    };
    // Se llama desde pasajeros, hay que moverlo.
    getDPCookieParameter = () => {
        return !!this.$cookies.get(this.BookingAppConstants.COOKIES.DYNAMIC_PRICING);
    };

    showGender = (requiredFields) => {
        const requiredFieldTypes = this.BookingPassengerInfoConstants.SHOW_GENDER_TYPES;
        return requiredFieldTypes.some((field) =>  (requiredFields?.hasOwnProperty(field) ?? false));
    };
}

BookingPassengerInfoService.$inject = ['CommonsSessionStorageService', 'BookingPromiseProxy', 'HttpServicesConstants',
    'CommonsNewHttpUtilsErrorService', 'BookingGetCompaniesService', 'GetPhoneCodesService',
    'GetCountriesListService', 'BookingPassengerInfoTransformer', '$timeout', 'BookingPassengerInfoConstants',
    'BookingUtilService', 'BookingFareService', 'GdprService', 'IbBookingCalculatePointsService', '$window',
    'CallBookingMetaSearchService', 'IBCTravelPreferencesService', 'IBCContactDataService', 'IBCAssociatesService',
    'CommonsUserUtilsService', 'IBCContactDetailsZeroService', 'IBCPersonalDataZeroService', 'IBCPersonalDataService', 'IBCAssociatesZeroService',
    'IbSetPartnersSelectionUtilsService', 'BookingIgnoreOrderService', 'BookingRedirectionService', 'BookingPromiseSalesforceProxy', 'BookingLocalDiscountsService', 'BookingAppConstants', 'CurrencyService', 'CallAncillariesService', '$cookies', 'IbBookingPassengerInfoUtilsService', 'IbTravelDocumentsService', 'PassengerControlOrderService'];
try {
    const mod = angular.module('ib-booking-passenger-info-module');
    mod.service(
        'BookingPassengerInfoService',
        BookingPassengerInfoService
    );
} catch (error) {
    const mod = angular.module('ib-booking-passenger-info-module', []);
    mod.service(
        'BookingPassengerInfoService',
        BookingPassengerInfoService
    );
}


