import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { BookingUserActivityServiceMock } from '@test-mocks/Services/BookingUserActivityServiceMock';
describe('AvailabilityController test', () => {

    let controller, scope, rootScope;

    let controllerDependencies = {
        '$scope': {},
        '$rootScope': {},
        '$timeout': {},
        'localStorageService': new StorageServiceMock(),
        '$filter': {},
        '$translate': {},
        BookingAvailabilityModel: {},
        $q : {}
    };
    let fakeWindow = {}

    const mockError = {
        "message": "",
        "needsTranslate": false,
        "errorCode": 400,
        "internalErrorCode": "PAC_UTILS_E0005",
        "messageList": [
            {
                "message": "Fallo de validación de datos. Por favor, revisalos por si hay un error",
                "internalErrorCode": "PAC_UTILS_E0005"
            },
            {
                "message": "tiene que corresponder a la expresión regular \"[A-Za-z]{3}\"",
                "internalErrorCode": "PAC_UTILS_E0005"
            }
        ],
        "serviceError": {
            "errors": [
                {
                    "code": "PAC_UTILS_E0005",
                    "reason": "Fallo de validación de datos. Por favor, revisalos por si hay un error",
                    "uuid": null,
                    "timeStamp": "2022-10-10 10:30"
                },
                {
                    "code": "PAC_UTILS_E0005",
                    "reason": "property:slices[1].origin|error:tiene que corresponder a la expresión regular \"[A-Za-z]{3}\"",
                    "uuid": null,
                    "timeStamp": "2022-10-10 10:30"
                }
            ]
        }
    };
    const mockErrorMultiTrip = {
        "message": "",
        "needsTranslate": false,
        "errorCode": 404,
        "internalErrorCode": "SSE_AVM_12001",
        "messageList": [
            {
                "message": "Fallo de validación de datos. Por favor, revisalos por si hay un error",
                "internalErrorCode": "PAC_UTILS_E0005"
            },
            {
                "message": "tiene que corresponder a la expresión regular \"[A-Za-z]{3}\"",
                "internalErrorCode": "PAC_UTILS_E0005"
            }
        ],
        "serviceError": {
            "errors": [
                {
                    "code": "PAC_UTILS_E0005",
                    "reason": "Fallo de validación de datos. Por favor, revisalos por si hay un error",
                    "uuid": null,
                    "timeStamp": "2022-10-10 10:30"
                },
                {
                    "code": "PAC_UTILS_E0005",
                    "reason": "property:slices[1].origin|error:tiene que corresponder a la expresión regular \"[A-Za-z]{3}\"",
                    "uuid": null,
                    "timeStamp": "2022-10-10 10:30"
                }
            ]
        }
    };
    const mockDiscountData = {
        "largeFamilyType": "",
        "resident": "RC"
    };

    const mockNewAvalability = require('@test-mocks/Responses/NewAvailabilityResponse-mock.json');
    const fakeCopySelected = require('@test-mocks/Responses/CopySelectedResponse-mock.json');
    const mockFareRequest = require('@test-mocks/Responses/FareRequestAvailability-mock.json');

    const fakeTranslateFilter = () => {
		return '';
	};

    const mockHeaderModal = require('@test-mocks/Responses/HeaderModal-mock.json');
    const mockDeleteSlicesModel = require('@test-mocks/Responses/DeleteSlicesModel-mock.json');
    const mockRecalculateModel = require('@test-mocks/Responses/RecalculateModel-mock.json');
    const mockRedemptionOriginDestinationInfo = require('@test-mocks/Responses/RedemptionOriginDestinationInfo-mock.json');
    const mockOriginDestination = require('@test-mocks/Responses/OriginDestination-mock.json');
    const mockAvailabilityResponse = require('@test-mocks/Responses/AvailabilityResponse-mock.json');

    const mockPassengers =[
        {
            "passengerType": "ADULT",
            "count": 2
        }
    ];
    const mockRequestData = require('@test-mocks/Responses/Request-mock.json');

    const mockNewPassengers = {
        "numberPassengers": 1,
        "numberPassengrsWithoutInfant": 1,
        "numAdults": 1,
        "numChilds": 0,
        "numInfant": 0,
        "numSeniors": 0,
        "numYoung": 0,
        "numTeenager": 0
    };
    const mockOriginInfo = require('@test-mocks/Responses/OriginInfo-mock.json');
    const mockMulticityModelOutbound = require('@test-mocks/Responses/MulticityModelOutbound-mock.json');
    const mockMulticityModelReturn = require('@test-mocks/Responses/MulticityModelReturn-mock.json');
    const mockDataMulticity = require('@test-mocks/Responses/DataMulticity-mock.json');
    const mockDataMulticityReturn = require('@test-mocks/Responses/DataMulticityReturn-mock.json');
    const mockDataSelectedSlice = require('@test-mocks/Responses/DataSelectedSlice-mock.json');
    const mockSelectedSliceModel = require('@test-mocks/Responses/SelectedSliceModel-mock.json');
    const mockModelCompleteOriginDestination = require('@test-mocks/Responses/ModelCompleteOriginDestination-mock.json');
    const mockModelCompleteOriginDestinationReturn = require('@test-mocks/Responses/ModelCompleteOriginDestinationReturn-mock.json');
    const mockOfferSelected = require('@test-mocks/Responses/OfferSelected-mock.json');
    const mockCurrentOriginDestination = require('@test-mocks/Responses/CurrentOriginDestination-mock.json');
    const mockRedemptionAvailability = require('@test-mocks/Responses/RedemptionAvailability-mock.json');
    const mockChangeFareData = require('@test-mocks/Responses/ChangeFareData-mock.json');
    const mockChangeFareModel =  require('@test-mocks/Responses/ChangeFareModel-mock.json');
    const mockSelectRedemptionModel = require('@test-mocks/Responses/SelectedRedemptionModel-mock.json');
    const mockCurrentSelectedSlice = require('@test-mocks/Responses/CurrentSelectedSlice-mock.json');
    const mockFareFamilyInfo = require('@test-mocks/Responses/FareFamilyInfo-mock.json');
    const mockChangeRedemptionModel = require('@test-mocks/Responses/ChangeRedemptionModel-mock.json');
    const mockSlideInfo = {
        "date": {
            "dateTime": "",
            "weekDay": "WEEKDAY_WEDNESDAY",
            "hour": 2,
            "minutes": 0,
            "day": 19,
            "monthNumber": 10,
            "month": "MONTH_OCTOBER",
            "year": 2022,
            "formatedDate": "19/10/2022"
        },
        "serviceDate": "2022-10-19",
        "price": 350.72,
        "state": "AVAILABLE",
        "slidePosition": 4,
        "formattedPrice": "351€",
        "$$hashKey": "object:264"
    };
    const mockUpdateLimitsCalendar = require('@test-mocks/Responses/UpdateLimitsCalentar-mock.json');
    mockUpdateLimitsCalendar.initializeModel = ()=>{};
    const mockOriginDestinationUpdate = {
        "originCity": {
            "code": "MAD",
            "description": "Madrid",
            "timezone": "Europe/Madrid",
            "country": {
                "code": "ES",
                "description": "España"
            }
        },
        "destinationCity": {
            "code": "LEI",
            "description": "Almería",
            "timezone": "Europe/Madrid",
            "country": {
                "code": "ES",
                "description": "España"
            }
        },
        "dates": {
            "outboundFlight": "2022-10-20",
            "formatedOutboundFlight": "2022-10-20T00:00:00.000Z",
            "returnFlight": "2022-10-20",
            "formatedReturnFlight": "2022-10-20T00:00:00.000Z"
        },
        "passengers": 1,
        "numAdults": 1,
        "numSeniors": 0,
        "numYoung": 0,
        "numTeenager": 0,
        "numInfant": 0,
        "numChilds": 0,
        "numberPassengrsWithoutInfant": 1
    };
    const mockSelectedSlice = require('@test-mocks/Responses/SelectedSlice-mock.json');
    const mockSelectedFare = require('@test-mocks/Responses/SelectedFare-mock.json');
    const mockFareFamilyConditions = require('@test-mocks/Responses/FareFamilyConditions-mock.json');
    const mockFareFamiliyIcons = require('@test-mocks/Responses/FareFamiliyIcons-mock.json');
    const mockFinishSelectSlice = require('@test-mocks/Responses/FinishSelectedSlice-mock.json');
    const mockLocalStorageOffers = require('@test-mocks/Responses/LocalStorageOffers-mock.json');
    const mockrefreshRedemptionAvailabilityModel = require('@test-mocks/Responses/RefreshRedemptionAvailabilityModel-mock.json');
    const mockRedemptionAvailabilityResponse = require('@test-mocks/Responses/RedemptionAvailabilityResponse-mock.json');
    const mockGenerateOldOriginDestination = require('@test-mocks/Responses/GenerateOldOriginDestination-mock.json');
    const mockBookingUrlParams = require('@test-mocks/Responses/LocalBookingUrlParams-mock.json');
    const mockBookingChangeAvailabilityModel = require('@test-mocks/Responses/BookingChangeAvailabilityModel-mock.json');
    const mockUpdateBookingAvailabilityData = require('@test-mocks/Responses/UpdateBookingAvailabilityData-mock.json');
    const mockChangeAvailabilityGetSelectedSlice = require('@test-mocks/Responses/ChangeAvailabilityGetSelectedSlice-mock.json');
    const mockChangeAvailabilityUpdateLimitsCalendar = require('@test-mocks/Responses/ChangeAvailabilityUpdateLimitsCalendar-mock.json');
    mockChangeAvailabilityUpdateLimitsCalendar.initializeModel = ()=>{};

    let fakeCommonsUtilService = {
        setTitlePage :jasmine.createSpy('setTitlePage')
    };

    let fakeBookingAvailabilityModel = {
        initializeModel: jasmine.createSpy('initializeModel'),
        availabilityData: {},
        selectedSlices: [],
        currentOriginDestinationIndex: 0
    };

    let fakeBookingModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal'),
        finishWaiting: jasmine.createSpy('finishWaiting'),
        showGenericModal: jasmine.createSpy('showGenericModal'),
        showGenericError: jasmine.createSpy('showGenericError'),
        closeAllCurrentModals: jasmine.createSpy('closeAllCurrentModals'),
        showFaresModal: jasmine.createSpy('showFaresModal'),
    };

    let fakeBookingAvailabilityService = {
        checkExistNewAvailabilitySearch: jasmine.createSpy('checkExistNewAvailabilitySearch'),
        redirectRedemptionMarket: jasmine.createSpy('redirectRedemptionMarket'),
        callInitBooking: jasmine.createSpy('callInitBooking'),
        getMarketOBPoints: jasmine.createSpy('getMarketOBPoints'),
        updateBookingAvailabilityDiscount: jasmine.createSpy('updateBookingAvailabilityDiscount'),
        createRedemptionOriginDestinationInfo: jasmine.createSpy('createRedemptionOriginDestinationInfo'),
        createOriginDestinationInfoTransformed: jasmine.createSpy('createOriginDestinationInfoTransformed'),
        createOriginDestinationInfo: jasmine.createSpy('createOriginDestinationInfo'),
        getBookingAvailability: jasmine.createSpy('getBookingAvailability'),
        updateBookingAvailability: jasmine.createSpy('updateBookingAvailability'),
        getSliceTimeLeft: jasmine.createSpy('getSliceTimeLeft'),
    };

    let fakeDatalayerUtilsService = {
        removeDatalayerObjects: jasmine.createSpy('removeDatalayerObjects'),
        setDatalayerAvailabilityInitialParams: jasmine.createSpy('setDatalayerAvailabilityInitialParams'),
        addDestinationInfoDatalayer: jasmine.createSpy('addDestinationInfoDatalayer'),
        sendDatalayerEvent: jasmine.createSpy('sendDatalayerEvent'),
        addDestinationInfoDigitalData: jasmine.createSpy('addDestinationInfoDigitalData'),
        updateDatalayerViewEvent: jasmine.createSpy('updateDatalayerViewEvent'),
        addDataLayerInfo: jasmine.createSpy('addDataLayerInfo'),
        addDigitalDataInfo: jasmine.createSpy('addDigitalDataInfo'),
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam'),
        updateDigitalDataWithQuadrigam: jasmine.createSpy('updateDigitalDataWithQuadrigam'),
        getPassengersMetasearch: jasmine.createSpy('getPassengersMetasearch'),
        removeDigitalDataObjects: jasmine.createSpy('removeDigitalDataObjects'),
        updateDiscountData: jasmine.createSpy('updateDiscountData'),
    };
    let fakeDigitalDataUtilsService = {
        removeDatalayerObjects: jasmine.createSpy('removeDatalayerObjects'),
        setDatalayerAvailabilityInitialParams: jasmine.createSpy('setDatalayerAvailabilityInitialParams'),
        addDestinationInfoDatalayer: jasmine.createSpy('addDestinationInfoDatalayer'),
        sendDatalayerEvent: jasmine.createSpy('sendDatalayerEvent'),
        addDestinationInfoDigitalData: jasmine.createSpy('addDestinationInfoDigitalData'),
        updateDatalayerViewEvent: jasmine.createSpy('updateDatalayerViewEvent'),
        addDataLayerInfo: jasmine.createSpy('addDataLayerInfo'),
        addDigitalDataInfo: jasmine.createSpy('addDigitalDataInfo'),
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam'),
        updateDigitalDataWithQuadrigam: jasmine.createSpy('updateDigitalDataWithQuadrigam'),
        getPassengersMetasearch: jasmine.createSpy('getPassengersMetasearch'),
        removeDigitalDataObjects: jasmine.createSpy('removeDigitalDataObjects'),
        updateDiscountData: jasmine.createSpy('updateDiscountData'),
    };

    let fakeBookingUtilService = {
        getURLFirstParameterByName: jasmine.createSpy('getURLFirstParameterByName').and.returnValue('ES'),
        getDeviceType: jasmine.createSpy('getDeviceType'),
        addflightRatioInDataLayer: jasmine.createSpy('addflightRatioInDataLayer'),
        addflightHaulInDigitalInfo: jasmine.createSpy('addflightHaulInDigitalInfo'),
        setSegmentOfSelectedTrip: jasmine.createSpy('setSegmentOfSelectedTrip'),
        getBackGroundURL: jasmine.createSpy('getBackGroundURL'),
        isUserLogged: jasmine.createSpy('isUserLogged'),
        getNewAvailabilityRequest: jasmine.createSpy('getNewAvailabilityRequest'),
        getOriginDestination: jasmine.createSpy('getOriginDestination'),
        setSelectedTripInfoinStorage : jasmine.createSpy('setSelectedTripInfoinStorage')
    };

    let fakeNewMainHeaderFacade = {
        deleteTripsBasketFromDispo: jasmine.createSpy('deleteTripsBasketFromDispo'),
        updateHeaderModel: jasmine.createSpy('updateHeaderModel'),
        updateBasketDiscountsNew: jasmine.createSpy('updateBasketDiscountsNew'),
        initHeader: jasmine.createSpy('initHeader'),
        updateTripsBasketFromDispo: jasmine.createSpy('updateTripsBasketFromDispo'),
        updateBasketFlexibilization: jasmine.createSpy('updateBasketFlexibilization'),
        updateStepDescription: jasmine.createSpy('updateStepDescription')
    };

    let fakeDatalayerConstants = {
        DATALAYER_INFO: {
            WEB_VERSION: 'versionWeb',
            WEB_MODE: 'modeWeb',
            LANGUAGE: 'idioma',
            MARKET: 'mercado',
            ORDER_KEY: 'claveOrdenacion',
            EVENT: 'event',
            PASSENGER_PRICE: 'precioPax',
            CHEAPER_FARE: 'tarifaBarata',
            ORIGINAL_TOTAL_PRICE: 'precioTotalOriginal',
            PERCENT_DISCOUNT: 'porcentajeDescuentos',
            TOTAL_DISCOUNT: 'totalDescuentos',
            DYNAMIC_PRICING: 'DynamicPricing',
            MULTIPLE_TRIP_RESULTS: 'resultadosMultiple',
        },
        DATALAYER_EVENT_TYPES: {
            VIEW: 'view',
        },
        EVENTS_ECOMMERCE: {
            SELECT_ITEM: 'select_item',
        },
        DATALAYER_VALUES: {
            YES: 'SI',
            NO: 'NO',
        },
        DISCOUNT_TYPES: {
            DYNAMIC_PRICING: 'DYNAMIC_PRICING'
        },
    };

    let fakeMonetateUtilsService = {
        updateMonetateWithQuadrigam: jasmine.createSpy('updateMonetateWithQuadrigam'),
        addFlightSearchMonetate: jasmine.createSpy('addFlightSearchMonetate'),
    };

    const mockFareData = require('@test-mocks/Responses/FareData-mock.json');

    let fakeMonetateConstants = {
        MONETATE_INFO: {
            SETPAGETYPE: 'setPageType'
        }
    };

    let fakeCurrencyService = {
        getCurrencyObject: jasmine.createSpy('getCurrencyObject'),
        formatPrice: jasmine.createSpy('formatPrice'),
        formatAvios: jasmine.createSpy('formatAvios'),
    };

    let fakeBookingComponentUtils = {
        equalHeight: jasmine.createSpy('formatAvios'),
    };

    let fakeRedirectionService = {
        externalRedirect: jasmine.createSpy('externalRedirect'),
        redirectToLoginPage: jasmine.createSpy('redirectToLoginPage')
    };


    let fakeBookingAvailabilityTransformer = {
        createGetFareRequest: jasmine.createSpy('createGetFareRequest'),
        getDetailedFaresInfo: jasmine.createSpy('getDetailedFaresInfo'),
        getTotalPriceMetaSearch: jasmine.createSpy('getTotalPriceMetaSearch'),
    };

    let fakeBookingLocalDiscountsService = {
        isResidentAvailable: jasmine.createSpy('isResidentAvailable'),
    };

    let fakeIbFlashOfferService = {
        callInitBooking: jasmine.createSpy('callInitBooking'),
    };

    let fakeIbFlashOfferUtilsService = {
        createRequestDirectFare: jasmine.createSpy('createRequestDirectFare'),
        createNewHeaderData: jasmine.createSpy('createNewHeaderData'),
        createModelToHeader: jasmine.createSpy('createModelToHeader'),
        generateNewrequestDataDirectFare: jasmine.createSpy('generateNewrequestDataDirectFare'),
    };

    let fakeIbSetHeaderService = {
        setHeader: jasmine.createSpy('setHeader'),
        setDataOnBasket: jasmine.createSpy('setDataOnBasket')
    };

    let fakeCommonsUserUtilsService = {
        isSoftUser: jasmine.createSpy('isSoftUser')
    };

    let fakeCommonsLoginUtilsService = {
        updateStateToAnonymous: jasmine.createSpy('updateStateToAnonymous')
    };

    let fakeGetDestinationsService = {
        getDestinationAreasCitiesList: jasmine.createSpy('getDestinationAreasCitiesList').and.callFake( () => {
            return Promise.resolve();
        })
    };

    let fakeDatalayerBKIService = {
        getDigitalDataEcommerce: jasmine.createSpy('getDigitalDataEcommerce'),
        getLengthStayMultipleTrip: jasmine.createSpy('getLengthStayMultipleTrip'),
        updateDatalayerDynamicPricing: jasmine.createSpy('updateDatalayerDynamicPricing'),
        updateDigitalDataDynamicPricing: jasmine.createSpy('updateDigitalDataDynamicPricing'),
        updateDatalayerObject: jasmine.createSpy('updateDatalayerObject'),
    };

    let fakeDatalayerBKIConstants = {
        PAX_PRICE: 'PaxPrice',
        CHEAPEST_FARE: 'CheapestFare',
        DYNAMIC_PRICING: 'DynamicPricing',
    };

    let fakeCommonsConstants = {
        FARE_FAMILY_ICON_PROPERTY_CODE: {
            EQMANO: 'icon-e_equipaje',
            EQBODEGA: 'icon-e_equipaje_facturado',
            ASIENTO: 'icon-asiento-normal',
            ASIENTOXL: 'icon-asiento-plus',
            ASIENTODELANTERO: 'icon-asiento-delantero',
            CAMBIO: 'icon-cambios_y_reembolsos',
            REEMBOLSO: 'icon-reembolsos',
            CHECKINDESK: 'icon-check_in',
            SALAVIP: 'icon-sala_vip',
            FASTTRACK: 'icon-fast_track',
            EMBARQUE: 'icon-priority-boarding',
            EQPPRIOR: 'icon-e_facturacion_prioritaria',
            COMIDA: 'icon-c_comidas_nuevas',
            WIFI: 'icon-wifi',
            CABINA: 'icon-navegador_avion',
            AVIO: 'icon-avios',
            TARJEMBANTIC: 'icon-tarjeta_de_embarque',
            CODECAMBIO: 'CAMBIO',
            CODENOCAMBIO: 'CA_CAMBIOS PERMITIDOS_NO_SHOW_NO PERMITIDO'
        }
    };

    let fakeBookingAvailabilityConstants = {
        CARROUSEL_FLIGHT_SELECTED: {
            OUTBOUND_FLIGHT: 0,
            RETURN_FLIGHT: 1
        },
        DAYS_BEFORE: 3,
        DAYS_AFTER: 3,
        SLICK_STATUS: {
            LOADING: 'LOADING'
        },
        FARE_FAMILY_ICON_PROPERTY_CODE: {
            'EQMANO': 'icon-e_equipaje',
            'EQBODEGA': 'icon-e_equipaje_facturado',
            'ASIENTO': 'icon-asiento-normal',
            'ASIENTOXL': 'icon-asiento-plus',
            'ASIENTODELANTERO': 'icon-asiento-delantero',
            'CAMBIO': 'icon-cambios_y_reembolsos',
            'REEMBOLSO': 'icon-reembolsos',
            'CHECKINDESK': 'icon-check_in',
            'SALAVIP': 'icon-sala_vip',
            'FASTTRACK': 'icon-fast_track',
            'EMBARQUE': 'icon-priority-boarding',
            'EQPPRIOR': 'icon-e_facturacion_prioritaria',
            'COMIDA': 'icon-c_comidas_nuevas',
            'WIFI': 'icon-wifi',
            'CABINA': 'icon-navegador_avion',
            'AVIO': 'icon-avios',
            'TARJEMBANTIC': 'icon-tarjeta_de_embarque',
            'CODECAMBIO': 'CAMBIO',
            'CODENOCAMBIO': 'CA_CAMBIOS PERMITIDOS_NO_SHOW_NO PERMITIDO'
        }
    };

    let fakeTranslate = {
        'onReady': jasmine.createSpy()
    };

    let fakeIbBookingAvailabilityPageUtilsService = {
        updateHeaderDates: jasmine.createSpy('updateHeaderDates'),
        redirectToLogin: jasmine.createSpy('redirectToLogin'),
        onLogin: jasmine.createSpy('onLogin'),
        onError: jasmine.createSpy('onError'),
        isSameFlight: jasmine.createSpy('isSameFlight'),
        checkSegmentCompatibility: jasmine.createSpy('checkSegmentCompatibility'),
        checkSliceCompatibility: jasmine.createSpy('checkSliceCompatibility'),
        areAllSegmentsSelected: jasmine.createSpy('areAllSegmentsSelected'),
        checkLoadingCalendarSlides: jasmine.createSpy('checkLoadingCalendarSlides'),
        scrollToOdStart: jasmine.createSpy('scrollToOdStart'),
        isReadyToCallRedemptionFare: jasmine.createSpy('isReadyToCallRedemptionFare'),
        getSelectedFareFamily: jasmine.createSpy('getSelectedFareFamily'),
        generateOldOriginDestinationInfo: jasmine.createSpy('generateOldOriginDestinationInfo'),
        setIsPointsOBFlow: jasmine.createSpy('setIsPointsOBFlow'),
        setIsRedemptionFlow: jasmine.createSpy('setIsRedemptionFlow'),
        initializeLang: jasmine.createSpy('initializeLang'),
        initializeMarket: jasmine.createSpy('initializeMarket'),
        initLocalStorage: jasmine.createSpy('initLocalStorage'),
        setPaymentStatusValue: jasmine.createSpy('setPaymentStatusValue'),
        resetShowBasketDiscounts: jasmine.createSpy('resetShowBasketDiscounts'),
    };

    let fakeSessionStorage = new StorageServiceMock();
    const elementMock = [
        {
            dispatchEvent: () => { },
            addEventListener: () => {}
        }

    ]
    const fakeIbCheckPartnersDiscountsServiceMock = {
        getSelectedPartner : jasmine.createSpy('getSelectedPartner')
    }

    const fakeBookingPageUtilsService = {
        setTitlePage: jasmine.createSpy('setTitlePage')
    }
    const fakeOptionsSource = {
        observers: [],
        subscribe: function(observer) {
            this.observers.push(observer);
            // Devuelve una función de cancelación para el observer
            return {
                unsubscribe: () => {
                    const index = this.observers.indexOf(observer);
                    if (index !== -1) {
                        this.observers.splice(index, 1);
                    }
                }
            };
        },
        next: function(value) {
            // Notifica a todos los observadores con el valor proporcionado
            this.observers.forEach(observer => observer(value));
        },
        complete: function() {
            // Completa el subject
            this.observers = [];
        }
    };

    const fakeLocation = jasmine.createSpyObj('$location', ['path']);


    const fakeIbBookingMetasearchUtilsService = {
        redirectFlightSelection : jasmine.createSpy('redirectFlightSelection')
    };

    const fakeBookingUserActivityService = new BookingUserActivityServiceMock();
    beforeEach( () => {
        angular.mock.module('ib-booking-availability-module', 'LocalStorageModule', function ($provide) {
            $provide.value('BookingAvailabilityModel', fakeBookingAvailabilityModel);
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('BookingAvailabilityService', fakeBookingAvailabilityService);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('DigitalDataUtilsService', fakeDigitalDataUtilsService);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('DatalayerConstants', fakeDatalayerConstants);
            $provide.value('BookingAppConstants', BookingAppConstants);
            $provide.value('MonetateUtilsService', fakeMonetateUtilsService);
            $provide.value('MonetateConstants', fakeMonetateConstants);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('BookingAvailabilityConstants', fakeBookingAvailabilityConstants);
            $provide.value('BookingComponentUtils', fakeBookingComponentUtils);
            $provide.value('BookingRedirectionService', fakeRedirectionService);
            $provide.value('BookingAvailabilityTransformer', fakeBookingAvailabilityTransformer);
            $provide.value('BookingLocalDiscountsService', fakeBookingLocalDiscountsService);
            $provide.value('IbFlashOfferService', fakeIbFlashOfferService);
            $provide.value('IbFlashOfferUtilsService', fakeIbFlashOfferUtilsService);
            $provide.value('IbSetHeaderService', fakeIbSetHeaderService);
            $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
            $provide.value('CommonsLoginUtilsService', fakeCommonsLoginUtilsService);
            $provide.value('GetDestinationsService', fakeGetDestinationsService);
            $provide.value('CommonsConstants', fakeCommonsConstants);
            $provide.value('DatalayerBKIConstants', fakeDatalayerBKIConstants);
            $provide.value('DatalayerBKIService', fakeDatalayerBKIService);
            $provide.value('$translate', fakeTranslate);
            $provide.value('translateFilter', fakeTranslateFilter);
            $provide.value('IbBookingAvailabilityPageUtilsService', fakeIbBookingAvailabilityPageUtilsService);
            $provide.value('CommonsSessionStorageService', fakeSessionStorage);
            $provide.value('$window', fakeWindow);
            $provide.value('$element', elementMock);
            $provide.value('IbCheckPartnersDiscountsService', fakeIbCheckPartnersDiscountsServiceMock);
            $provide.value('BookingPageUtilsService', fakeBookingPageUtilsService);
            $provide.value('$location', fakeLocation);
            $provide.value('IbBookingMetasearchUtilsService', fakeIbBookingMetasearchUtilsService);
            $provide.value('BookingUserActivityService', fakeBookingUserActivityService);
        });

        inject(function ($controller, $rootScope, _$timeout_, _$filter_, _$q_) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            controllerDependencies.$scope = scope;
            controllerDependencies.$rootScope = rootScope;
            controllerDependencies.$timeout = _$timeout_;
            controllerDependencies.$filter = _$filter_;
            controllerDependencies.$translate = fakeTranslate;
            controllerDependencies.localStorageService = new StorageServiceMock();
            controllerDependencies.$q = _$q_;
            controllerDependencies.BookingAvailabilityModel = fakeBookingAvailabilityModel;

            fakeTranslate.onReady = jasmine.createSpy('onReady').and.callFake( () => {
                return Promise.resolve();
            });

            controller = $controller('AvailabilityController', controllerDependencies);
            // controller.model = fakeModel;
            // controllerDependencies.$scope.$apply();
        });
        fakeWindow = {
            datalayer_general: { },
            datalayer_ecommerce: {},
            digital_Data: {},
            location: {
                href: '',
                reload: jasmine.createSpy('reload'),
                path: '',
                search: '',
            }

        }
    });

    describe('when activate() is called', () => {
        beforeEach( () => {
            fakeSessionStorage.set('bookingUrlParams', {resident:'RC', largeFamilyType:''});
        });
        it('and it is normal flow', (done) => {

            fakeTranslate.onReady = jasmine.createSpy('onReady').and.callFake( () => {
                return Promise.resolve({});
            });
            // controller.model = fakeModel;

            // controller.activate();
            // expect(controller.timerActivate).toEqual(fakeStartTime);
            controllerDependencies.localStorageService.set('calditMode', {});
            controllerDependencies.$timeout.verifyNoPendingTasks();
            expect(controller).toBeDefined();
            done();
        });
        it('and there is lang, market and it is BBKIOH flow', (done) => {

            fakeTranslate.onReady = jasmine.createSpy('onReady').and.callFake( () => {
                return Promise.resolve({});
            });
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake( () => {
                return null;
            })
            // controller.model = fakeModel;

            // controller.activate();
            // expect(controller.timerActivate).toEqual(fakeStartTime);
            controllerDependencies.localStorageService.set('calditMode', {});
            controllerDependencies.localStorageService.set('flowApp', 'BBKIOH');
            controllerDependencies.$timeout.verifyNoPendingTasks();
            expect(controller).toBeDefined();
            done();
        });
    });
    describe('when showServiceError() is called', () => {
        beforeEach( () => {
            fakeBookingUtilService.getNewAvailabilityRequest = jasmine.createSpy('getNewAvailabilityRequest').and.callFake(function (mockPassengers) {
                return mockRequestData;
            });
        });
            [
                {
                    description: 'and it is metasearchFlight is metasearch and multitrip',
                    errorToReject: mockErrorMultiTrip,
                    errorToShow: mockError,
                    storage: {
                        searchFlightType: 'metasearchFlight',
                        multiCitySearch: true,
                        openJaw: true
                    }
                },
                {
                    description: 'and it is metasearchFlight and search new availability',
                    errorToReject: mockError,
                    errorToShow: mockError,
                    storage: {
                        searchFlightType: 'metasearchFlight',
                        openJaw: true
                    }
                }
            ].forEach(({ description, errorToReject, errorToShow, storage }) => {
                xit(description, (done) => {
                    fakeBookingAvailabilityService.getBookingAvailability = jasmine.createSpy('getBookingAvailability').and.callFake( () => {
                        return Promise.reject(errorToReject);
                    });

                    Object.entries(storage).forEach(([key, value]) => {
                        controllerDependencies.localStorageService.set(key, value);
                    });

                    controller.showServiceError(errorToShow);

                    expect(controller.model.availabilityData.searchNewAvailability).toBeFalse();
                    done();
                });
            });
        it('and it is not metasearchFlight', (done) => {
            // controller.model = fakeModel;

            controller.showServiceError(mockErrorMultiTrip);


            expect(controller).toBeDefined();
            done();
        });
        it('and it is not metasearchFlight and it is not SSE_AVM_12001 error', (done) => {
            // controller.model = fakeModel;

            controller.showServiceError(mockError);


            expect(controller).toBeDefined();
            done();
        });
    });

    describe('when showCalendarServiceError() is called', () => {
        it('', (done) => {
            fakeBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake( () => {
                return { result: Promise.resolve('ok') };
            });
            controllerDependencies.$rootScope.$broadcast('calendarGridServiceError', mockError);
            done();
        });
    });
    describe('when updateAvailabilityWithDiscount() is called', () => {
        it('and return new availability offers', (done) => {
            fakeBookingAvailabilityService.updateBookingAvailabilityDiscount = jasmine.createSpy('updateBookingAvailabilityDiscount').and.callFake( () => {
                return Promise.resolve(mockNewAvalability);
            });
            controllerDependencies.localStorageService.set('bookingUrlParams', {resident:'RC', largeFamilyType:''});
            controllerDependencies.localStorageService.set('offers', mockLocalStorageOffers);
            controller.model.selectedSlices = fakeCopySelected;
            controllerDependencies.localStorageService.set('headerModel', mockHeaderModal);
            controller.updateAvailabilityWithDiscount(event,mockDiscountData);
            // controllerDependencies.$timeout.verifyNoPendingTasks();
            expect(controller.model.discountsAvailabilityLoading).toBe(true);
            done();
        });
    });
    describe('when selectAvailability() is called', () => {
        beforeEach(() => {
          // Espiar o resetear spies para evitar duplicados
          if (!jasmine.isSpy(fakeLocation.path)) {
            spyOn(fakeLocation, 'path');
          } else {
            fakeLocation.path.calls.reset();
          }
      
          if (!jasmine.isSpy(fakeBookingModalService.showWaitingModal)) {
            spyOn(fakeBookingModalService, 'showWaitingModal');
          } else {
            fakeBookingModalService.showWaitingModal.calls.reset();
          }
      
          if (!jasmine.isSpy(fakeDatalayerBKIService.updateDatalayerObject)) {
            spyOn(fakeDatalayerBKIService, 'updateDatalayerObject');
          } else {
            fakeDatalayerBKIService.updateDatalayerObject.calls.reset();
          }
      
          // Setup común
          fakeSessionStorage.set('selectedTripInfo', [{info:{allOperatedBy:['IBERIA'],selectedFareFamily:{commercialNameES:'Básica'}}}]);
          fakeSessionStorage.set('fareData', mockFareData);
          controller.model = mockRecalculateModel;
      
          fakeBookingAvailabilityService.getSelectedOffer = jasmine.createSpy('getSelectedOffer').and.callFake(() => mockOfferSelected);
        });
      
        it('and selectAvailability service rejected', (done) => {
          fakeBookingAvailabilityService.selectAvailability = jasmine.createSpy('selectAvailability').and.callFake(() => {
            return Promise.reject();
          });
      
          fakeBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => {
            return { result: Promise.resolve('ok') };
          });
      
          controllerDependencies.localStorageService.set('fareData', mockFareRequest);
          controller.selectAvailability();
      
          expect(controllerDependencies.$rootScope.isAvailability).toBeFalse();
          done();
        });
      
        it('should redirect to /ibpbah when selectAvailability service resolves successfully', (done) => {
            controller.model.availabilityData = {
              metaSearchInfo: false,
              multiCity: false,
              redemption: false
            };
          
            const mockFareRequest = { warnings: null };
          
            fakeBookingAvailabilityService.selectAvailability = jasmine.createSpy('selectAvailability').and.returnValue(Promise.resolve(mockFareRequest));
          
            controller.selectAvailability();
          
            setTimeout(() => {
              expect(fakeBookingAvailabilityService.selectAvailability).toHaveBeenCalled();
              expect(fakeLocation.path).toHaveBeenCalledWith('/ibpbah');
              expect(fakeDatalayerBKIService.updateDatalayerObject).toHaveBeenCalledWith(controller.model.selectedSlices);
              expect(fakeBookingModalService.showWaitingModal).toHaveBeenCalledWith(
                'ib-modal-loading-plane',
                'ib-modals ib-modals--transparent ib-modals--loading-page',
                true
              );
              done();
            }, 0);
          });
          
      });
      
    xdescribe('when deleteSlices() is called', () => {
        beforeEach( () => {
            fakeBookingAvailabilityService.createOriginDestinationInfoTransformed = jasmine.createSpy('createOriginDestinationInfoTransformed').and.callFake( () => {
                return mockOriginDestination;
            });
            controller.model = mockDeleteSlicesModel;
        });
        it('and it is not redemption flow', (done) => {
            controllerDependencies.localStorageService.set('headerModel', mockHeaderModal);
            controllerDependencies.$rootScope.isRedemptionFlow = false;
            controller.deleteSlices('ODI_0', false, 0);
            expect(fakeBookingAvailabilityService.createOriginDestinationInfoTransformed).toHaveBeenCalled();
            done();
        });
        xit('and it is not redemption flow and it is one way', (done) => {
            controllerDependencies.localStorageService.set('headerModel', mockHeaderModal);
            controllerDependencies.$rootScope.isRedemptionFlow = false;
            controller.deleteSlices('OD1', false, 0);
            expect(fakeBookingAvailabilityService.createOriginDestinationInfoTransformed).toHaveBeenCalled();
            done();
        });
        it('and it is redemption flow', (done) => {
            fakeBookingAvailabilityService.createRedemptionOriginDestinationInfo = jasmine.createSpy('createRedemptionOriginDestinationInfo').and.callFake( () => {
                return mockRedemptionOriginDestinationInfo;
            });
            controllerDependencies.$rootScope.isRedemptionFlow = true;
            controllerDependencies.localStorageService.set('headerModel', mockHeaderModal);
            controller.deleteSlices('ODI_0', false, 0);
            expect(fakeBookingAvailabilityService.createRedemptionOriginDestinationInfo).toHaveBeenCalled();
            done();
        });
    });
    xdescribe('when searchAvailabilityNew() is called', () => {
        beforeEach( () => {
            fakeBookingAvailabilityService.getBookingAvailability = jasmine.createSpy('getBookingAvailability').and.callFake( () => {
                return Promise.resolve(mockAvailabilityResponse);
            });
            fakeDatalayerUtilsService.getPassengersMetasearch = jasmine.createSpy('getPassengersMetasearch').and.callFake(function (mockPassengers) {
                return mockNewPassengers;
            });
            controllerDependencies.localStorageService.set('bookingUrlParams', {resident:'RC', largeFamilyType:''});
        });
        xit('and it is redemption flow', (done) => {
            controller.model = mockRecalculateModel;
            controllerDependencies.localStorageService.set('addPassengers', mockPassengers);
            controllerDependencies.localStorageService.set('availabilityRequestData', mockRequestData);
            controllerDependencies.localStorageService.set('originDestination', mockOriginInfo);
            controller.searchAvailabilityNew(event);
            controllerDependencies.$rootScope.isRedemptionFlow = true;
            expect(controllerDependencies.$rootScope.isRedemptionFlow).toBeTrue();
            done();
        });
        it('and it is not redemption flow', (done) => {
            fakeBookingUtilService.getNewAvailabilityRequest = jasmine.createSpy('getNewAvailabilityRequest').and.callFake(function (mockPassengers) {
                return mockRequestData;
            });
            fakeBookingUtilService.getOriginDestination = jasmine.createSpy('getOriginDestination').and.callFake(function (mockPassengers) {
                return mockOriginDestination;
            });
            controller.model = mockRecalculateModel;
            controllerDependencies.localStorageService.set('addPassengers', mockPassengers);
            controllerDependencies.localStorageService.set('availabilityRequestData', mockRequestData);
            controllerDependencies.localStorageService.set('originDestination', mockOriginInfo);
            controllerDependencies.$rootScope.isRedemptionFlow = false;
            controller.searchAvailabilityNew(event);
            expect(controllerDependencies.$rootScope.isRedemptionFlow).toBeFalse();
            done();
        });
    });
    describe('when getNextTrip() is called', () => {
        [
            {
                description: ', getNextInfoSlice service has been resolved correctly and it is return date',
                getSelectAvailabilityResult: () => Promise.resolve(mockDataMulticityReturn)
            },
            {
                description: ', getNextInfoSlice service has been resolved correctly, it is return date and selectAvailability service has been rejected',
                getSelectAvailabilityResult: () => Promise.reject()
            }
        ].forEach(({ description, getSelectAvailabilityResult }) => {
            it(description, (done) => {
                fakeBookingAvailabilityService.getNextInfoSlice = jasmine.createSpy('getNextInfoSlice').and.callFake( () => {
                    return Promise.resolve(mockDataMulticity);
                });
                fakeBookingAvailabilityService.selectAvailability = jasmine.createSpy('selectAvailability').and.callFake( () => {
                    return getSelectAvailabilityResult();
                });
                controller.model = mockMulticityModelReturn;
                controller.getNextTrip(false);
                expect(fakeBookingAvailabilityTransformer.createGetFareRequest).toHaveBeenCalled();
                done();
            });
        });
        it('and getNextInfoSlice service has been rejected', (done) => {
            fakeBookingAvailabilityService.getNextInfoSlice = jasmine.createSpy('getNextInfoSlice').and.callFake( () => {
                return Promise.reject();
            });
            controller.model = mockMulticityModelOutbound;
            controller.getNextTrip(false);
            expect(fakeBookingAvailabilityService.getNextInfoSlice).toHaveBeenCalled();
            done();
        });
    });
    
    describe('when showPopoverStopover() is called', () => {
        it('', (done) => {
            fakeBookingModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake( () => {
                return { result: Promise.resolve(true) };
            });
            controller.model = mockMulticityModelOutbound;
            controller.oBPreviousOption = true;
            controller.showPopoverStopover([{description:'Madrid'}, {description:'Barcelona'}],2);
            expect(controller.oBPreviousOption).toBeTrue();
            done();
        });
    });
    describe('when setSelectedSliceInfo() is called', () => {
        beforeEach( () => {
            fakeBookingAvailabilityService.getCalendarRibbon = jasmine.createSpy('showGenericModal').and.callFake( () => {
                return Promise.resolve({});
            });
            fakeBookingAvailabilityService.createOriginDestinationInfo = jasmine.createSpy('createOriginDestinationInfo').and.callFake( () => {
                return mockCurrentOriginDestination;
            });
            fakeBookingAvailabilityService.getSelectedOffer = jasmine.createSpy('getSelectedOffer').and.callFake( () => {
                return mockOfferSelected;
            });
            controllerDependencies.localStorageService.set('originDestination', mockOriginDestinationUpdate);
            controllerDependencies.localStorageService.set('headerModel', mockHeaderModal);
        });
        xit('and it is outbound date', (done) => {
            controller.model = mockModelCompleteOriginDestination;
            controllerDependencies.$rootScope.isRedemptionFlow = false;
            controller.setSelectedSliceInfo(event, mockDataSelectedSlice, mockSelectedSliceModel);
            done();
        });
        [
            {
                description: ', it is return date, it is redemption flow and selectRedemptionAvailability has been resolved',
                getSelectRedemptionAvailabilityResult: () => Promise.resolve(mockRedemptionAvailability)
            },
            {
                description: ', it is return date, it is redemption flow and selectRedemptionAvailability has been rejected',
                getSelectRedemptionAvailabilityResult: () => Promise.reject(),
                getGenericErrorResult: () => Promise.resolve('ok')
            },
            {
                description: ', it is return date, it is redemption flow, selectRedemptionAvailability has been rejected, showGenericError has been rejected',
                getSelectRedemptionAvailabilityResult: () => Promise.reject(),
                getGenericErrorResult: () => Promise.reject()
            }
        ].forEach(({ description, getSelectRedemptionAvailabilityResult, getGenericErrorResult }) => {
            it(description, (done) => {
                fakeBookingAvailabilityService.selectRedemptionAvailability = jasmine.createSpy('selectRedemptionAvailability').and.callFake( () => {
                    return getSelectRedemptionAvailabilityResult();
                });

                if (getGenericErrorResult) {
                    fakeBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake( () => {
                        return { result: getGenericErrorResult() };
                    });
                }

                controller.model = mockModelCompleteOriginDestinationReturn;
                controllerDependencies.$rootScope.isRedemptionFlow = true;
                controller.setSelectedSliceInfo(event, mockDataSelectedSlice, mockSelectedSliceModel);
                expect(controller.model.showLoadingFares).toBeTrue();
                done();
            });
        });
        xit(', it is return date and it is not redemption flow', (done) => {
            controller.model = mockModelCompleteOriginDestinationReturn;
            controllerDependencies.$rootScope.isRedemptionFlow = false;
            controller.setSelectedSliceInfo(event, mockDataSelectedSlice, mockSelectedSliceModel);
            expect(controller.model.numericTotalPrice).toBe(195.83);
            done();
        });
    });
    describe('when changeFareselected() is called', () => {
        beforeEach( () => {
            fakeBookingAvailabilityService.createOriginDestinationInfoTransformed = jasmine.createSpy('createOriginDestinationInfoTransformed').and.callFake( () => {
                return mockOriginDestination;
            });
            fakeBookingAvailabilityService.createRedemptionOriginDestinationInfo = jasmine.createSpy('createRedemptionOriginDestinationInfo').and.callFake( () => {
                return mockRedemptionOriginDestinationInfo;
            });
            fakeBookingAvailabilityService.createOriginDestinationInfo = jasmine.createSpy('createOriginDestinationInfo').and.callFake( () => {
                return mockCurrentOriginDestination;
            });
            controllerDependencies.localStorageService.set('originDestination', mockOriginDestinationUpdate);
            controllerDependencies.localStorageService.set('headerModel', mockHeaderModal);
            controllerDependencies.localStorageService.set('userLogged', 'ONB');
            controllerDependencies.localStorageService.set('avSelectedOffer', {});
        });
        it('', (done) => {
            controller.model = mockChangeFareModel;
            controllerDependencies.$scope.$broadcast('selectedFareFamily', mockChangeFareData, 0);
            expect(controller.showUpselling).toBeFalse();
            done();
        });
    });
    describe('when selectRedemptionSlice() is called', () => {
    beforeEach( () => {
            controllerDependencies.localStorageService.set('originDestination', mockOriginDestinationUpdate);
            controller.model = mockSelectRedemptionModel;
        });
        it('', (done) => {
            controllerDependencies.$scope.$broadcast('selectedRedemptionSliceEvent', mockCurrentSelectedSlice, true);
            expect(controller.model.currentOriginDestinationIndex).toBe(1);
            done();
        });
    });
    describe('when changeRedemptionFareselected() is called', () => {
        it('', (done) => {
            controller.model = mockChangeRedemptionModel;
            // controllerDependencies.localStorageService.set('headerModel', mockHeaderModal);
            controllerDependencies.$scope.$broadcast('selectedRedemptionFareFamily', mockFareFamilyInfo, 0, 0);
            expect(controller.model.currentOriginDestinationIndex).toBe(0);
            done();
        });
    });
    describe('when changeAvailability() is called', () => {
        beforeEach( () => {
            fakeBookingAvailabilityService.updateLimitsCalendarData = jasmine.createSpy('updateLimitsCalendarData').and.callFake( () => {
                return mockUpdateLimitsCalendar;
            });
            fakeBookingAvailabilityService.updateBookingAvailability = jasmine.createSpy('updateBookingAvailability').and.callFake( () => {
                return Promise.resolve(mockUpdateBookingAvailabilityData);
            });
            fakeBookingAvailabilityService.getSelectedSlice = jasmine.createSpy('getSelectedSlice').and.callFake( () => {
                return mockSelectedSlice;
            });
            fakeBookingAvailabilityService.createOriginDestinationInfo = jasmine.createSpy('createOriginDestinationInfo').and.callFake( () => {
                return mockCurrentOriginDestination;
            });
            fakeBookingAvailabilityService.getCalendarRibbon = jasmine.createSpy('getCalendarRibbon').and.callFake( () => {
                return Promise.resolve({});
            });
            fakeIbBookingAvailabilityPageUtilsService.generateOldOriginDestinationInfo = jasmine.createSpy('generateOldOriginDestinationInfo').and.callFake( () => {
                return mockGenerateOldOriginDestination;
            });
            controllerDependencies.localStorageService.set('originDestination', mockOriginDestinationUpdate);
            controllerDependencies.localStorageService.set('bookingUrlParams', mockBookingUrlParams);
        });
        it('and it is not redemption flow', (done) => {
            const isNext = true;
            const event = {
                name: 'slideSelected'
            };
            const slideInfo = mockSlideInfo;
            controller.showLocalDiscount = jasmine.createSpy('showLocalDiscount');
            controllerDependencies.$rootScope.isRedemptionFlow = false;
            controllerDependencies.$scope.$broadcast(event.name, slideInfo, isNext);
            expect(controller.model.currentOriginDestinationIndex).toBe(1);
            expect(fakeBookingAvailabilityService.updateBookingAvailability).toHaveBeenCalledWith(slideInfo, controller.model);
            fakeBookingAvailabilityService.updateBookingAvailability(slideInfo, controller.model).then((data) => {
                expect(controller.currentSelectedFareFamily.commercialCode).toEqual('TBAESEU');
            });
            done();
        });
        it('and it is not redemption flow and you change the ribbon data whit Optima fareFamilySelected', (done) => {

            fakeBookingAvailabilityService.updateLimitsCalendarData = jasmine.createSpy('updateLimitsCalendarData').and.callFake( () => {
                return mockChangeAvailabilityUpdateLimitsCalendar;
            });
            fakeBookingAvailabilityService.getSelectedSlice = jasmine.createSpy('getSelectedSlice').and.callFake( () => {
                return mockChangeAvailabilityGetSelectedSlice;
            });
            const isNext = true;
            const event = {
                name: 'slideSelected'
            };
            const slideInfo = {
                "date": {
                    "dateTime": "",
                    "weekDay": "WEEKDAY_FRYDAY",
                    "hour": 1,
                    "minutes": 0,
                    "day": 24,
                    "monthNumber": 2,
                    "month": "MONTH_FEBRUARY",
                    "year": 2023,
                    "formatedDate": "24/02/2023"
                },
                "serviceDate": "2023-02-24",
                "price": 24.62,
                "state": "AVAILABLE",
                "slidePosition": 10,
                "formattedPrice": "25€",
                "$$hashKey": "object:702"
            };
            controller.showLocalDiscount = jasmine.createSpy('showLocalDiscount');
            controller.model = mockBookingChangeAvailabilityModel;
            controllerDependencies.$rootScope.isRedemptionFlow = false;
            controllerDependencies.$rootScope.newFare = false;
            controllerDependencies.$scope.$broadcast(event.name, slideInfo, isNext);
            mockChangeAvailabilityUpdateLimitsCalendar.initializeModel = () => {
                controller.model.selectedSlices = [];
            }
            expect(controller.model.currentOriginDestinationIndex).toBe(1);
            expect(fakeBookingAvailabilityService.updateBookingAvailability).toHaveBeenCalledWith(slideInfo, controller.model);
            fakeBookingAvailabilityService.updateBookingAvailability(slideInfo, controller.model).then((data) => {
                expect(controller.currentSelectedFareFamily.commercialCode).toEqual('TCLESES');
            });
            done();
        });
    });
    describe('when openFareWindowModal() is called', () => {
        it('', (done) => {
            fakeBookingAvailabilityTransformer.getDetailedFaresInfo = jasmine.createSpy('getDetailedFaresInfo').and.callFake( () => {
                return mockFareFamiliyIcons;
            });
            fakeBookingModalService.showFaresModal = jasmine.createSpy('showFaresModal').and.callFake( () => {
                return { result: Promise.resolve('ok') };
            });
            controller.model.availabilityData.fareFamilyConditions = mockFareFamilyConditions;
            controllerDependencies.localStorageService.set('originDestination', mockOriginDestinationUpdate);
            // controllerDependencies.localStorageService.set('bookingUrlParams', {resident:'', largeFamilyType:''});
            controllerDependencies.$scope.$broadcast('openFareModal', mockSelectedFare);
            expect(fakeBookingModalService.showFaresModal).toHaveBeenCalled();
            done();
        });
    });
    describe('when startsSelectSliceAnimation() is called', () => {
        it('', (done) => {
            controller.model = mockChangeRedemptionModel;
            controllerDependencies.$scope.$broadcast('animationStarts', 1);
            expect(controller.model.animationRun).toBeTrue();
            done();
        });
    });
    describe('when finishSelectSliceAnimation() is called', () => {
        it('', (done) => {
            controller.model = mockFinishSelectSlice;
            controller.previouslySelectedNum = 0;
            controllerDependencies.$scope.$broadcast('animationEnds', 0);
            expect(controller.model.animationRun).toBeFalse();
            done();
        });
    });
    describe('when nextSliceDate() is called', () => {
        beforeEach( () => {
            fakeBookingAvailabilityService.getCalendarRibbon = jasmine.createSpy('showGenericModal').and.callFake( () => {
                return Promise.resolve({});
            });
            controller.model = mockModelCompleteOriginDestination;
        });
        it('', (done) => {
            controllerDependencies.$scope.$broadcast('nextSlideDate', true);
            expect(controller.model.animationRun).toBeFalse();
            done();
        });
    });
    describe('when newSearch() is called', () => {
        it('', (done) => {
            controller.model = mockModelCompleteOriginDestination;
            controllerDependencies.$scope.$broadcast('newSeach', true);
            expect(controller.model.availabilityData.changePassengers).toBeTruthy();
            done();
        });
    });
    describe('when updateEcommerce() is called', () => {
        it('', (done) => {
            controller.model = mockModelCompleteOriginDestination;
            controllerDependencies.$scope.$broadcast('updateEcommerce', );
            expect(fakeDatalayerBKIService.getDigitalDataEcommerce).toHaveBeenCalled();
            done();
        });
    });
    describe('when toggleUpselling() is called', () => {
        it('', (done) => {
            controllerDependencies.$scope.$broadcast('showUpselling', {});
            expect(controller.showUpselling).toEqual({});
            done();
        });
    });
    describe('when changeOffersTotal() is called', () => {
        it('', (done) => {
            controllerDependencies.$scope.$broadcast('changeOffersTotal', 'test');
            expect(controller.ancOffersTotal).toEqual('test');
            done();
        });
    });
    xdescribe('when refreshFares() is called', () => {
        beforeEach( () => {
            controllerDependencies.localStorageService.set('headerModel', mockHeaderModal);
            controllerDependencies.localStorageService.set('bookingUrlParams', {resident:'RC', largeFamilyType:''});
        });
        [
            {
                description: 'and selectRedemptionAvailability has been resolved',
                getSelectRedemptionAvailabilityResult: () => Promise.resolve(mockRedemptionAvailabilityResponse)
            },
            {
                description: 'and selectRedemptionAvailability has been rejected',
                getSelectRedemptionAvailabilityResult: () => Promise.reject(),
                getGenericErrorResult: () => Promise.resolve('ok')
            },
            {
                description: ', selectRedemptionAvailability has been rejected and showGenericError has been rejected',
                getSelectRedemptionAvailabilityResult: () => Promise.reject(),
                getGenericErrorResult: () => Promise.reject()
            }
        ].forEach(({ description, getSelectRedemptionAvailabilityResult, getGenericErrorResult }) => {
            it(description, (done) => {
                fakeBookingAvailabilityService.selectRedemptionAvailability = jasmine.createSpy('selectRedemptionAvailability').and.callFake( () => {
                    return getSelectRedemptionAvailabilityResult();
                });

                if (getGenericErrorResult) {
                    fakeBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake( () => {
                        return { result: getGenericErrorResult() };
                    });
                }

                controller.model = mockrefreshRedemptionAvailabilityModel;
                controllerDependencies.$scope.$broadcast('refreshAvailability', );
                expect(controller.model.showLoadingFares).toBeTruthy();
                done();
            });
        });
    });

    describe('renderMetasearchComponentByFlightType', () => {
        it('should return false if metasearchFlight is in the exclusion list', () => {
            fakeSessionStorage.set('searchFlightType','metasearchFlight');
            const result = controller.renderMetasearchComponentByFlightType();
            expect(result).toBe(false);
        });

        it('should return true if searchFlightType is not in the exclusion list', () => {
            fakeSessionStorage.set('searchFlightType','availabilityFlightType');
            const result = controller.renderMetasearchComponentByFlightType();
            expect(result).toBe(true);
        });

    });

  
    describe('selectNewFlightFromMetasearch', () => {
        it('should emit call redirectFlightSelection event', () => {
            controller.selectNewFlightFromMetasearch();
            expect(fakeIbBookingMetasearchUtilsService.redirectFlightSelection).toHaveBeenCalled();
        });
    });
    
    // describe('when showLocalDiscountModule() is called', () => {
    //     beforeEach( () => {
    //         fakeSessionStorage.set('bookingUrlParams', {resident:'RC', largeFamilyType:''});
    //     });
    //     it('', (done) => {
    //         controller.showLocalDiscount();
    //         expect(controller.localdiscountModel.selectedResident).toEqual('RC');
    //         expect(controller.localdiscountModel.selectedFamily).toEqual('');
    //         done();
    //     });
    // });
});
