// Classes Declaration
export class CallBookingAvailabilityServiceMock {
    // Fake default responses
    public getBKIAvailabilityResponse: Promise<any> = Promise.resolve({
        data: {
            fareFamilyConditions: [{}, {}],
            offers: [
                {
                    offerId: 'oferta',
                    price:{
                        currency:'€',
                        total:'5',
                        fare: {}
                    }
                }
            ], recommendedOfferId: 'oferta'
        }
    });
    public getBKIMetasearchResponse: Promise<any> = Promise.resolve('meta');
    public runAvailabilityRequestResponseReject: Promise<any> = Promise.reject( {} );
    //Methods
    public getBookingAvailability = jasmine
        .createSpy('getBookingAvailability')
        .and.callFake(() => this.getBKIAvailabilityResponse);
    public getBookingMetaSearch = jasmine
        .createSpy('getBookingMetaSearch')
        .and.callFake( () => this.getBKIMetasearchResponse );
    public getNextInfoSlice = jasmine
        .createSpy('getNextInfoSlice');
    public runAvailabilityRequest = jasmine.createSpy( 'runAvailabilityRequest' ).and.returnValue({});
}
export class CallPriceMatrixServiceMock {
    //Responses
    public getPriceMatrixResponse: Promise<any> = Promise.resolve({ data: { inbound: { availabilityCalendar: true }, calendarRibbon: { inBoundRow: { cells: {} }, outBoundRow: { cells: {} } }, outbound: { availabilityCalendar: true } } });
    //Methods
    public getPriceMatrixPromised = jasmine
        .createSpy('getPriceMatrix')
        .and.callFake(() => this.getPriceMatrixResponse);
}
export class BookingAvailabilityTransformerMock {
    //Responses
    public createRequestAvailabilityResponse: Promise<any> = Promise.resolve(
        {}
    );
    public generateInitialCalendarRequestResponse: Promise<any> = Promise.resolve(
        {}
    );
    public transformGetAvailabilityDataResponse: Promise<any> = Promise.resolve(
        {}
    );
    public updateLimitsCalendarDataResponse: Promise<any> = Promise.resolve(
        {}
    );
    public getSelectedOfferResponse: Promise<any> = Promise.resolve(
        {}
    );
    public generateSelectedSliceInfoResponse: Promise<any> = Promise.resolve(
        {}
    );
    //Methods
    public createRequestAvailability = jasmine
        .createSpy('createRequestAvailability')
        .and.returnValue(() => { });
    public generateInitialCalendarRequest = jasmine.createSpy('generateInitialCalendarRequest').and.returnValue({});
    public transformGetAvailabilityData = jasmine.createSpy('transformGetAvailabilityData').and.returnValue({});
    public generateSelectedSliceInfo = jasmine.createSpy('generateSelectedSliceInfo').and.returnValue({});
    public updateLimitsCalendarData = jasmine.createSpy('updateLimitsCalendarData').and.returnValue({});
    public getSelectedOffer = jasmine.createSpy('getSelectedOffer').and.returnValue({});
    public getOriginDestinationLimitDates = jasmine.createSpy('getOriginDestinationLimitDates').and.returnValue({});
    public createRedemptionOriginDestinationInfo = jasmine.createSpy('createRedemptionOriginDestinationInfo').and.returnValue({});
    public genCalcAviosFlightReq = jasmine.createSpy('genCalcAviosFlightReq').and.returnValue({});
    public TransCalcPointsData = jasmine.createSpy('TransCalcPointsData').and.returnValue({});
    public transformOBRedemptionFare = jasmine.createSpy('transformOBRedemptionFare').and.returnValue({});
    public transformRedemptionFare = jasmine.createSpy('transformRedemptionFare').and.returnValue({});
    public getNextDate = jasmine.createSpy('getNextDate').and.returnValue({});
    public generateCalendarRequest = jasmine.createSpy('generateCalendarRequest').and.returnValue({});
    public transformSlidesData = jasmine.createSpy('transformSlidesData').and.returnValue({});
    public checkCabinDescription = jasmine.createSpy('checkCabinDescription').and.returnValue({});
    public transformGetRedemptionAvailabilityData = jasmine.createSpy('transformGetRedemptionAvailabilityData').and.returnValue({});
    public createOBPointsRequest = jasmine.createSpy('createOBPointsRequest').and.returnValue({});
}
export class BookingModalServiceMock {
    //Responses
    public showGenericErrorResponse = { result: { then: Promise.resolve({}) } };
    //Methods
    public showGenericError = jasmine
        .createSpy('showGenericError')
        .and.callFake(() => this.showGenericErrorResponse);
}
export class BookingUtilServiceMock {
    //Responses
    public getOriginDestinationResponse = {
        destinationCity: { description: 'DEST', code: 'CODE' }
    };
    public getURLFirstParameterResponse = 'param';
    //Methods
    public saveEndpoints = jasmine.createSpy('saveEndpoints');
    public generateBuildNumberQueryString = jasmine.createSpy(
        'generateBuildNumberQueryString'
    );
    public initStorage = jasmine.createSpy('initStorage');
    public getParameterByName = jasmine.createSpy('getParameterByName');
    public getOriginDestination = jasmine
        .createSpy('getOriginDestination')
        .and.callFake(() => this.getOriginDestinationResponse);
    public getBackGroundURL = jasmine.createSpy('getBackGroundURL');
    public removeParam = jasmine.createSpy('removeParam');
    public generateAvailabilityRequestData = jasmine.createSpy('generateAvailabilityRequestData');
    public addflightRatioInDataLayer = jasmine.createSpy('addflightRatioInDataLayer');
    public addflightHaulInDigitalInfo = jasmine.createSpy('addflightHaulInDigitalInfo');
    public addPriceParametersInDigitalInfo = jasmine.createSpy('addPriceParametersInDigitalInfo');
    public addPriceParametersInDatalayer = jasmine.createSpy('addPriceParametersInDatalayer');
    public getURLFirstParameterByName = jasmine
        .createSpy('getURLFirstParameterByName')
        .and.callFake(() => this.getURLFirstParameterResponse);
}
export class BookingAirlinesLogoServiceMock {
    //Response
    public getAirlinesLogosResponse: Promise<any> = Promise.resolve({});
    //Methods
    public getAirlinesLogos = jasmine
        .createSpy('getAirlinesLogos')
        .and.callFake(() => this.getAirlinesLogosResponse);
}
export class BookingFareServiceMock {
    //Response
    public getBookingFareResponse: Promise<any> = Promise.resolve({});
    // Methods
    public getBookingFare = jasmine
        .createSpy('getBookingFare')
        .and.callFake(() => this.getBookingFareResponse);
}
export class BookingFareRedemptionMock {
    //Response
    public getBookingFareRedemptionResponse: Promise<any> = Promise.resolve({});
    //Methods
    public getBookingRedemptionFare = jasmine
        .createSpy('getBookingRedemptionFare')
        .and.callFake(() => this.getBookingFareRedemptionResponse);
}
export class CommonsLoginUtilsServiceMock {
}
export class BookingGetDestinationCitiesListServiceMock {
    //Response
    public getDestinationCitiesListResponse: Promise<any> = Promise.resolve({});
    //Methods
    public getDestinationCitiesList = jasmine.createSpy('getDestinationCitiesList').and.callFake(() => this.getDestinationCitiesListResponse);
}
export class BookingBackgroundImagesServiceMock {
    //Response
    public getBackgroundImagesResponse: Promise<any> = Promise.resolve({});
    //Methods
    public getBackgroundImages = jasmine.createSpy('getBackgroundImages').and.callFake(() => this.getBackgroundImagesResponse);
}
export class CommonsGetLoginInfoServiceMock {
    //Response
    public checkCustomerStatusResponse: Promise<any> = Promise.resolve(true);
    //Methods
    public checkCustomerStatus = jasmine.createSpy('checkCustomerStatus').and.callFake(() => this.checkCustomerStatusResponse);
}
export class CookiesUtilServiceMock {
    //Methods
    public getCookieParams = jasmine.createSpy('getCookie').and.callFake(() => 'test');
    public updateCookie = jasmine.createSpy('updateCookie');
}
export class CallBookingMetaSearchServiceMock {
    //Response
    public getBookingMetaSearchResponse: Promise<any> = Promise.resolve({});
    //Methods
    public getBookingMetaSearch = jasmine.createSpy('getBookingMetaSearch').and.callFake(() => this.getBookingMetaSearchResponse);
}
export class CallBookingRedemptionAvailabilityServiceMock {
    //Response
    public getBookingRedemptionAvailabilityResponse: Promise<any> = Promise.resolve({});
    //Methods
    public getBookingRedemptionAvailability = jasmine.createSpy('getBookingRedemptionAvailability').and.callFake(() => this.getBookingRedemptionAvailabilityResponse);
}
export class RedirectionServiceMock {

    public externalRedirect = jasmine.createSpy('externalRedirect');
}
export class OnBusinessPointsServiceMock {
    //Response
    public getOnBusinessPointsResponse: Promise<any> = Promise.resolve({});
    //Methods
    public getOnBusinessPoints = jasmine.createSpy('getOnBusinessPoints').and.callFake(() => this.getOnBusinessPointsResponse);
}
export class CalculatePointsServiceMock {
    //Response
    public getCalculatePointsResponse: Promise<any> = Promise.resolve({});
    //Methods
    public getCalculatePoints = jasmine.createSpy('getCalculatePoints').and.callFake(() => this.getCalculatePointsResponse);

}
export class CommonsCommercialSellingDataServiceMock {
    //Response
    public getCommercialInfoResponse: Promise<any> = Promise.resolve({});
    //Methods
    public getCommercialInfo = jasmine.createSpy('getCommercialInfo').and.callFake(() => this.getCommercialInfoResponse);
}
export class AvailabilityDataTransformer {
    //Response
    public transformGetAvailabilityDataResponse: Promise<any> = Promise.resolve({});
    //Methods
    public transformGetAvailabilityData = jasmine.createSpy('transformGetAvailabilityData').and.callFake((data, availabilityRequest) => this.transformGetAvailabilityDataResponse);
}
export class IbOriginDestinationInfoServiceMock {
    //Response
    public createResponse = require('./../../../../mocks/Responses/IbOriginDestinationInfoService-Response-mock.json');     //Methods
    public getIbOriginDestination = jasmine.createSpy('getIbOriginDestination').and.callFake(() => this.createResponse);
    public create = jasmine.createSpy('create');
}
export class CustomerDataServiceMock {
    //Response
    public getCustomerDataResponse: Promise<any> = Promise.resolve({});
    //Methods
    public getCustomerData = jasmine.createSpy('getCustomerData').and.callFake(() => this.getCustomerDataResponse);
}
export class CommonsUserUtilsServiceMock {
    public isIbZero = jasmine.createSpy();
    public isSoftUser = jasmine.createSpy();
    public isIbPlus = jasmine.createSpy();
}
export class IbCheckPartnersDiscountsServiceMock {
    public getCurrentUserStoredPreference = jasmine.createSpy().and.callFake(() => {
        return {
            partnerSelected: 'SAN',
            dontAskAgain: false
        };
    });
    public setPartnersDiscountsApplicationFlag = jasmine.createSpy();
    public setSelectedPartnerDiscount = jasmine.createSpy();
    public setCurrentUserStoredPreference = jasmine.createSpy();
    public getSelectedPartner = jasmine.createSpy().and.callFake(() => {
        return {
            partnerSelected: 'SAN',
            dontAskAgain: false
        };
    });
    public getPartnersResponse = jasmine.createSpy();
}
export class IbSetPartnersSelectionUtilsServiceMock {
    public setPartnersModal = jasmine.createSpy();
}
export class BookingIgnoreOrderServiceMock {
    //Response
    public ignoreOrderResponse: Promise<any> = Promise.resolve({});
    //Methods
    public ignoreOrder = jasmine.createSpy('ignoreOrder').and.callFake(() => this.ignoreOrderResponse);
}
export class BookingEndpointsServiceMock {
    //Response
    public getBookingEndpointsResponse: Promise<any> = Promise.resolve({ 'data': { 'endpoints': {} } });
    //Methods
    public getEndpoints = jasmine.createSpy('getEndpoints').and.callFake(() => this.getBookingEndpointsResponse);
}
export class BookingCommercialInfobyMarketServiceMock {
    //Response
    public getCommercialInfoResponse: Promise<any> = Promise.resolve({});
    //Methods
    public getCommercialInfo = jasmine.createSpy('getCommercialInfo').and.callFake(() => this.getCommercialInfoResponse);
}
export class CommonsModalServiceMock {
    //Response
    public getCommercialInfoResponse: Promise<any> = Promise.resolve({});
    //Methods
    public finishWaiting = jasmine.createSpy('finishWaiting');
    public showWaitingModal = jasmine.createSpy('showWaitingModal');
    public showComponentModal = jasmine.createSpy('showComponentModal');
    public showOnholdModal = jasmine.createSpy('showOnholdModal').and.callFake( () => {
        return { result: Promise.resolve( 'ok' ) };
    } );
    public showBackMainModalComponent = jasmine.createSpy( 'showBackMainModalComponent' ).and.callFake( () => {
        return { result: Promise.resolve( 'ok' ) };
    } );
    public showModalBackToMain = jasmine.createSpy('showModalBackToMain');

}

export class LocationMock {
    //Response
    public locationURLResponse = '/';
    public url = jasmine.createSpy('url').and.callFake(() => this.locationURLResponse);
}
export const BookingAppConstantsMock = {
    backgroundImagesBaseRoute: 'backImageBase', 'defaultBackgroundImage': 'defaultBackImage',
    WCS: { 'PHONE_TYPES': { 'SALES': 'info' } },
    SEARCH_FLIGHT_TYPE: {
        AVAILABILITY: 'availabilityFlight',
        METASEARCH: 'metasearchFlight',
        MULTITRIP: 'multiCityFlight',
        REDEMPTION: 'redemptionFlight',
        REDEMPTIONOB: 'redemptionOBFlight'
    },
    UNAVAILABLE_MARKETS_REDIRECTION: {
        DEFAULT: { marketRedirect: 'ES' },
        GI: { marketRedirect: 'GB' }, // Gibraltar
        AU: { marketRedirect: 'US' }, // Australia
        NZ: { marketRedirect: 'US' }, // New Zealand
        CA: { marketRedirect: 'US' } // Canada
    },
    availableMarkets: [
        'at', 'be', 'ch', 'cn', 'cu', 'cz', 'de', 'dk', 'do', 'dz', 'ec', 'fi', 'fr', 'gb', 'gr', 'gt', 'hu', 'ie', 'jp', 'il', 'ma', 'mx', 'nl', 'pa', 'pr', 'pt', 'ru', 'se', 'sn', 'sv', 'us', 'za', 'it', 'uy', 'cr', 'cl', 've', 'co', 'es', 'pe', 'br', 'ar'],
    COOKIES: {
        'IBERIACOM_LAST_SEARCH': {
            'NAME': 'IBERIACOM_LAST_SEARCH',
            'PARAMS': {
                'ORIGIN': 0,
                'DATES': [2, 3, 4, 5, 6, 7]
            }
        }
    },
    BOOKING_PARAMS_NAMES: {
        'MARKET': ['PointOfSaleCountry', 'market', 'bookingMarket'],
        'LANGUAGE': ['UserLanguage', 'language'],
        'ORIGIN': ['Origin', 'BEGIN_CITY_0'],
        'DESTINATION': ['Destination', 'END_CITY_0'],
        'SENIOR': ['YCD'],
        'ADULT': ['Adult', 'ADT'],
        'CHILD': ['Child', 'CHD', 'Infant'],
        'INFANT': ['InfantLap', 'INF'],
        'YOUNG': ['YTH'],
        'TEENAGER': ['BNN'],
        'FLEXIBLE_DATES': ['fechasFlex', 'flexible'],
        'DEPARTURE_DATE': ['DepartureDate', 'BEGIN_DAY_0', 'BEGIN_MONTH_0'],
        'INBOUND_DATE': ['DepartureDateFake', 'END_DAY_0', 'END_MONTH_0'],
        'SEARCH_ORIGIN': ['origenBusqueda', 'quadrigam'],
        'WEB_MODE': ['modeWeb'],
        'TRIP_TYPE': ['TripType', 'TRIP_TYPE'],
        'RESIDENT': ['residentCode', 'residente'],
        'LARGE_FAMILY_TYPE': ['familianumerosa', 'familiaNumerosaTipo'],
        'IB_GROUP': ['IB_GROUP'],
        'PREFERED_CLASS': ['clasePrefer', 'FARE_TYPE'],
        'AVIOS_PAY': ['pagoAvios'],
        'POINTS_PAY': ['pagoPuntos'],
        'CHANNEL': ['channel'],
        'DEVICE': ['device'],
        'REFERRALID': ['ReferralId'],
        'DISPLAYEDPRICE': ['DisplayedPrice'],
        'FLIGHTNUMBER': ['FlightNumber'],
        'BOOKINGCODE': ['BookingCode'],
        'CARRIER': ['Carrier'],
        'CABIN': ['Cabin'],
        'SLICE': ['Slice'],
        'PRICECURRENCY': ['DisplayedPriceCurrency'],
        'USERCURRENCY': ['UserCurrency'],
        'NUMTRIPS': ['numTrayectos'],
        'BACKTOURL': ['backtourl'],
        'BEGIN_CITY': ['BEGIN_CITY_01'],
        'END_CITY': ['END_CITY_01'],
        'BEGIN_DAY': ['BEGIN_DAY_01'],
        'BEGIN_MONTH': ['BEGIN_MONTH_01'],
        'BEGIN_YEAR': ['BEGIN_YEAR_01'],
        'END_DAY': ['END_DAY_01'],
        'END_MONTH': ['END_MONTH_01'],
        'END_YEAR': ['END_YEAR_01'],
        'FARE_TYPE': ['FARE_TYPE'],
        'FARE_TYPE_END': ['FARE_TYPE_END'],
        'CODE_TRACKING': ['codeTracking'],
        'TRAVEL_AGENT': ['travelAgent'],
        'FARE_CODE': ['FareCode'],
        'CHECK_AVIOS': ['CHECK_AVIOS'],
        'CHECK_POINTS': ['check_point'],
        'MARKET_FROM': ['fromMarket'],
        'LANGUAGE_FROM': ['fromLanguage']
    },
    defaultCommercialInfo: { 'maxSearchTime': 330 },
    REDEMPTION_AVIOS_REDIRECTED_MARKETS: {
        AR: { marketRedirect: 'US' },
        AT: { marketRedirect: 'ES' },
        BR: { marketRedirect: 'US' },
        CL: { marketRedirect: 'US' },
        CN: { marketRedirect: 'US' },
        CO: { marketRedirect: 'US' },
        CR: { marketRedirect: 'US' },
        CU: { marketRedirect: 'ES' },
        CZ: { marketRedirect: 'ES' },
        DK: { marketRedirect: 'ES' },
        DO: { marketRedirect: 'US' },
        DZ: { marketRedirect: 'FR' },
        EC: { marketRedirect: 'US' },
        FI: { marketRedirect: 'ES' },
        GR: { marketRedirect: 'ES' },
        GT: { marketRedirect: 'US' },
        HU: { marketRedirect: 'ES' },
        IL: { marketRedirect: 'US' },
        IE: { marketRedirect: 'ES' },
        JP: { marketRedirect: 'US', localesRedirect: { ja: 'en' } },
        MA: { marketRedirect: 'FR' },
        MX: { marketRedirect: 'US' },
        PA: { marketRedirect: 'US' },
        PE: { marketRedirect: 'US' },
        PR: { marketRedirect: 'US' },
        RU: { marketRedirect: 'ES', localesRedirect: { ru: 'en' } },
        SE: { marketRedirect: 'ES' },
        SN: { marketRedirect: 'FR' },
        SV: { marketRedirect: 'US' },
        UY: { marketRedirect: 'US' }
    }
};
export class IbBookingCalculatePointsService {
    //Methods
    public getCalculateFlightsAvios = jasmine.createSpy('getCalculateFlightsAvios');
}
export class BookingCommercialSellingDataServiceMock {
    //Response
    public getCommercialInfoResponse: Promise<any> = Promise.resolve({});
    //Methods
    public getCommercialInfo = jasmine.createSpy('getCommercialInfo').and.callFake(() => this.getCommercialInfoResponse);
}
export class IbBookingAvailabilityUtilsServiceMock {
    //Methods
    public getOfferInfoRecommended = jasmine.createSpy('getOfferInfoRecommended');
}
export const BookingAvailabilityConstantsMock = {};

export class BookingCommercialSellingDataUtilsServiceMock {
    availabilityType = 'REGULAR';
    getCommercialAvailbilityType = jasmine.createSpy('getCommercialAvailbilityType').and.callFake(()=> this.availabilityType);
}
