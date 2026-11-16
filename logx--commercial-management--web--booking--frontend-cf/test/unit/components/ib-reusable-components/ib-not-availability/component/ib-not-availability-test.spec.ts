import { isDefined } from 'angular';
// import {NotAvaibilityController} from '../../../../../../src/components/ib-reusable-components/ib-not-availability/component/ib-not-avaibility';
import angular from 'angular';
import {StorageServiceMock} from '../../../../../mocks/Services/StorageServiceMock';
describe('NotAvaibilityController test', () => {

    let fakeSessionStorage = new StorageServiceMock();

    let controller, scope;
    let controllerDependencies = {

        location:{},
        $scope: {},
        rootScope:'',
        window:{},
        document:{},
        filter:{}
    };
    let fakeNotAvaibilityService = {
        sendAlertLetMeKnow : jasmine.createSpy('sendAlertLetMeKnow')
    }
    let fakeNotAvaibilityTransformer = {
        generateRequest : jasmine.createSpy('generateRequest')
    }
    let fakeCommonsModalService = {
        showGenericDynamicModal : jasmine.createSpy('showGenericDynamicModal'),
        closeAllCurrentModals : jasmine.createSpy('closeAllCurrentModals'),
    }
    let fakeDatalayerUtilsService = {
        updateDatalayerWithEvents : jasmine.createSpy('updateDatalayerWithEvents'),
        sendDatalayerEvent : jasmine.createSpy('sendDatalayerEvent'),
    }
    let fakeDigitalDataService = {
        getDigitalData : jasmine.createSpy('getDigitalData'),
        emitEvent : jasmine.createSpy('emitEvent'),
    }
    let fakeBookingRedirectionService = {
        externalRedirect : jasmine.createSpy('externalRedirect')
    }
    let fakeBookingUtilService = {
        getURLFirstParameterByName : jasmine.createSpy('getURLFirstParameterByName')
    }
    let fakeBookingAppConstants = {
        REDEMPTION_PARAMS_NAMES: {
            MARKET: ['PointOfSaleCountry', 'market', 'bookingMarket'],
            LANGUAGE: ['UserLanguage', 'language'],
            ORIGIN: ['Origin', 'BEGIN_CITY_0'],
            DESTINATION: ['Destination', 'END_CITY_0'],
            SENIOR: ['YCD'],
            ADULT: ['Adult', 'ADT'],
            CHILD: ['Child', 'CHD', 'Infant'],
            INFANT: ['InfantLap', 'INF'],
            YOUNG: ['YTH'],
            TEENAGER: ['BNN'],
            FLEXIBLE_DATES: ['fechasFlex', 'flexible'],
            DEPARTURE_DATE: ['DepartureDate', 'BEGIN_DAY_0', 'BEGIN_MONTH_0'],
            INBOUND_DATE: ['DepartureDateFake', 'END_DAY_0', 'END_MONTH_0'],
            CODE_ERROR: ['codeError'],
            SEARCH_ORIGIN: ['origenBusqueda', 'quadrigam'],
            WEB_MODE: ['modeWeb'],
            TRIP_TYPE: ['TripType', 'TRIP_TYPE'],
            RESIDENT: ['residentCode', 'residente'],
            LARGE_FAMILY_TYPE: ['familianumerosa', 'familiaNumerosaTipo'],
            IB_GROUP: ['IB_GROUP'],
            PREFERED_CLASS: ['clasePrefer', 'FARE_TYPE'],
            AVIOS_PAY: ['pagoAvios'],
            POINTS_PAY: ['pagoPuntos'],
            CHANNEL: ['channel'],
            DEVICE: ['device'],
            REFERRALID: ['ReferralId'],
            DISPLAYEDPRICE: ['DisplayedPrice'],
            FLIGHTNUMBER: ['FlightNumber'],
            BOOKINGCODE: ['BookingCode'],
            CARRIER: ['Carrier'],
            CABIN: ['Cabin'],
            SLICE: ['Slice'],
            PRICECURRENCY: ['DisplayedPriceCurrency'],
            USERCURRENCY: ['UserCurrency'],
            NUMTRIPS: ['numTrayectos'],
            BACKTOURL: ['backtourl'],
            BEGIN_CITY: ['BEGIN_CITY_01'],
            END_CITY: ['END_CITY_01'],
            BEGIN_DAY: ['BEGIN_DAY_01'],
            BEGIN_MONTH: ['BEGIN_MONTH_01'],
            BEGIN_YEAR: ['BEGIN_YEAR_01'],
            END_DAY: ['END_DAY_01'],
            END_MONTH: ['END_MONTH_01'],
            END_YEAR: ['END_YEAR_01'],
            FARE_TYPE: ['FARE_TYPE'],
            FARE_TYPE_END: ['FARE_TYPE_END'],
            CODE_TRACKING: ['codeTracking'],
            TRAVEL_AGENT: ['travelAgent'],
            FARE_CODE: ['FareCode'],
            CHECK_AVIOS: ['CHECK_AVIOS'],
            CHECK_POINTS: ['check_point'],
            MARKET_FROM: ['fromMarket'],
            LANGUAGE_FROM: [ 'fromLanguage' ],
            FLASH_OFFER: ['flashOffer']
        },
        BOOKING_PARAMS_NAMES: {
            MARKET: ['PointOfSaleCountry', 'market', 'bookingMarket'],
            LANGUAGE: ['UserLanguage', 'language'],
            ORIGIN: ['Origin', 'BEGIN_CITY_0'],
            DESTINATION: ['Destination', 'END_CITY_0'],
            SENIOR: ['YCD'],
            ADULT: ['Adult', 'ADT'],
            CHILD: ['Child', 'CHD', 'Infant'],
            INFANT: ['InfantLap', 'INF'],
            YOUNG: ['YTH'],
            TEENAGER: ['BNN'],
            FLEXIBLE_DATES: ['fechasFlex', 'flexible'],
            DEPARTURE_DATE: ['DepartureDate', 'BEGIN_DAY_0', 'BEGIN_MONTH_0'],
            INBOUND_DATE: ['DepartureDateFake', 'END_DAY_0', 'END_MONTH_0'],
            CODE_ERROR: ['codeError'],
            SEARCH_ORIGIN: ['origenBusqueda', 'quadrigam'],
            WEB_MODE: ['modeWeb'],
            TRIP_TYPE: ['TripType', 'TRIP_TYPE'],
            RESIDENT: ['residentCode', 'residente'],
            LARGE_FAMILY_TYPE: ['familianumerosa', 'familiaNumerosaTipo'],
            IB_GROUP: ['IB_GROUP'],
            PREFERED_CLASS: ['clasePrefer', 'FARE_TYPE'],
            AVIOS_PAY: ['pagoAvios'],
            POINTS_PAY: ['pagoPuntos'],
            CHANNEL: ['channel'],
            DEVICE: ['device'],
            REFERRALID: ['ReferralId'],
            DISPLAYEDPRICE: ['DisplayedPrice'],
            FLIGHTNUMBER: ['FlightNumber'],
            BOOKINGCODE: ['BookingCode'],
            CARRIER: ['Carrier'],
            CABIN: ['Cabin'],
            SLICE: ['Slice'],
            PRICECURRENCY: ['DisplayedPriceCurrency'],
            USERCURRENCY: ['UserCurrency'],
            NUMTRIPS: ['numTrayectos'],
            BACKTOURL: ['backtourl'],
            BEGIN_CITY: ['BEGIN_CITY_01'],
            END_CITY: ['END_CITY_01'],
            BEGIN_DAY: ['BEGIN_DAY_01'],
            BEGIN_MONTH: ['BEGIN_MONTH_01'],
            BEGIN_YEAR: ['BEGIN_YEAR_01'],
            END_DAY: ['END_DAY_01'],
            END_MONTH: ['END_MONTH_01'],
            END_YEAR: ['END_YEAR_01'],
            FARE_TYPE: ['FARE_TYPE'],
            FARE_TYPE_END: ['FARE_TYPE_END'],
            CODE_TRACKING: ['codeTracking'],
            TRAVEL_AGENT: ['travelAgent'],
            FARE_CODE: ['FareCode'],
            CHECK_AVIOS: ['CHECK_AVIOS'],
            CHECK_POINTS: ['check_point'],
            MARKET_FROM: ['fromMarket'],
            LANGUAGE_FROM: [ 'fromLanguage' ],
            FLASH_OFFER: ['flashOffer']
        },
    }
    let fakeWindow = {
        location: {
            href: 'https://www.iberia.com/flights/?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=2&BEGIN_CITY_01=MAD&END_CITY_01=BIO&nombreOrigen=Madrid&nombreDestino=Bilbao&BEGIN_DAY_01=24&BEGIN_MONTH_01=202309&BEGIN_YEAR_01=2023&END_DAY_01=30&END_MONTH_01=202309&END_YEAR_01=2023&FARE_TYPE=R&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&residentCode=&familianumerosa=&boton=Buscar&bookingMarket=ES&pagoAvios=true#!/availability',
            origin:'https://www.iberia.com'
        },
        innerWidth: 0,
        document: {
            getElementsByName: () => [{content:''}],
        }
    };
    let fakeLocation = {
        absUrl: () =>{return 'https://www.iberia.com/flights/?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=2&BEGIN_CITY_01=MAD&END_CITY_01=BIO&nombreOrigen=Madrid&nombreDestino=Bilbao&BEGIN_DAY_01=24&BEGIN_MONTH_01=202309&BEGIN_YEAR_01=2023&END_DAY_01=30&END_MONTH_01=202309&END_YEAR_01=2023&FARE_TYPE=R&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&residentCode=&familianumerosa=&boton=Buscar&bookingMarket=ES&pagoAvios=true#!/availability'}
    };
    let mockLinksFilterFilter = () => {
        return '';
    }

    beforeEach(() =>{
        angular.mock.module('ib-not-avaibility-module', 'LocalStorageModule', ($provide) => {
            $provide.value('localStorageService', fakeSessionStorage);
            $provide.value('NotAvaibilityService', fakeNotAvaibilityService);
            $provide.value('NotAvaibilityTransformer', fakeNotAvaibilityTransformer);
            $provide.value('CommonsModalService', fakeCommonsModalService);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('DigitalDataService', fakeDigitalDataService);
            $provide.value('BookingRedirectionService', fakeBookingRedirectionService);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('$window', fakeWindow);
            $provide.value('$location', fakeLocation);
            $provide.value('LinksFilterFilter', mockLinksFilterFilter);
        });
        inject(($componentController,$rootScope,$document,$filter) =>{
            scope = $rootScope.$new();
            controllerDependencies.$scope = scope;
            controllerDependencies.rootScope = $rootScope;
            controllerDependencies.document = $document;
            controllerDependencies.filter = $filter;
            fakeSessionStorage.set('customerData',{personalInfo:{contactEmail:'test@test.com'}})
            controllerDependencies.document[0] = {body:{style:{overflow:'shown'}}};
            controller = $componentController('ibNotAvailability', controllerDependencies);
        });

    });

    describe('When controller is called ', () =>{
        beforeEach(() =>{
        })
        it(', it will be defined', () =>{
            controller.$onInit;
            expect(controller).toBeDefined();
            expect(fakeDigitalDataService.emitEvent).toHaveBeenCalled();
        });
    });
    describe('When sendLetMeKnowAlert is called ', () =>{
        beforeEach(() =>{
            fakeCommonsModalService.showGenericDynamicModal = jasmine.createSpy('showGenericDynamicModal').and.returnValue({
                result : Promise.resolve()
            });
        })
        it(', it will generate an alert if service responses OK with 200', () =>{
            fakeNotAvaibilityService.sendAlertLetMeKnow = jasmine.createSpy('sendAlertLetMeKnow').and.returnValue(Promise.resolve({code:200}))
            controller.sendLetMeKnowAlert();
            expect(fakeDigitalDataService.emitEvent).toHaveBeenCalled();
        });
        it(', it will open soft view modal if service resolves with 408,412,502 and 504 code', () =>{
            fakeNotAvaibilityService.sendAlertLetMeKnow = jasmine.createSpy('sendAlertLetMeKnow').and.returnValue(Promise.resolve({code:408}))
            controller.sendLetMeKnowAlert();
            expect(fakeDigitalDataService.emitEvent).toHaveBeenCalled();
        });
        it(', it will open hard view modal if service resolves with non 408,412,502 and 504 code', () =>{
            fakeNotAvaibilityService.sendAlertLetMeKnow = jasmine.createSpy('sendAlertLetMeKnow').and.returnValue(Promise.resolve({code:400}))
            controller.sendLetMeKnowAlert();
            expect(fakeDigitalDataService.emitEvent).toHaveBeenCalled();
        });
        it(', it will open hard view modal if service rejects', () =>{
            fakeNotAvaibilityService.sendAlertLetMeKnow = jasmine.createSpy('sendAlertLetMeKnow').and.returnValue(Promise.reject({code:400}))
            controller.sendLetMeKnowAlert();
            expect(fakeDigitalDataService.emitEvent).toHaveBeenCalled();
        });
    });
    describe('When updateSendingState is called ', () =>{
        beforeEach(() =>{
        })
        it(', it will not generate alert', () =>{
            controller.updateSendingState();
            expect(controller.sending).toBeFalse();
        });
    });
    describe('When close is called ', () =>{
        beforeEach(() =>{

        })
        it(', it will close all modals', () =>{
            controller.close();
            expect(fakeCommonsModalService.closeAllCurrentModals).toHaveBeenCalled();
        });
    });
    describe('When getCurrentURL is called ', () =>{
        beforeEach(() =>{
        })
        it(', it will redirect to current url', () =>{
            controller.getCurrentURL();
            expect(fakeBookingRedirectionService.externalRedirect).toHaveBeenCalledWith(
                'https://www.iberia.com/flights/?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=2&BEGIN_CITY_01=MAD&END_CITY_01=BIO&nombreOrigen=Madrid&nombreDestino=Bilbao&BEGIN_DAY_01=24&BEGIN_MONTH_01=202309&BEGIN_YEAR_01=2023&END_DAY_01=30&END_MONTH_01=202309&END_YEAR_01=2023&FARE_TYPE=R&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&residentCode=&familianumerosa=&boton=Buscar&bookingMarket=ES#!/availability'
            );
        });
    });
    describe('When redirectToNewRedemptionSearchEngine is called ', () =>{
        beforeEach(() =>{
        })
        it(', it will redirect to new redemption URL', () =>{
            controller.redirectToNewRedemptionSearchEngine();
            expect(fakeBookingRedirectionService.externalRedirect).toHaveBeenCalled();
        });
    });
    describe('When goRedemptionSearchEnginePage is called ', () =>{
        beforeEach(() =>{
        })
        it(', it will redirect to redemption URL', () =>{
            controller.goRedemptionSearchEnginePage();
            expect(fakeBookingRedirectionService.externalRedirect).toHaveBeenCalled();
        });
    });
    describe('When goToBooking is called ', () =>{
        beforeEach(() =>{
            fakeSessionStorage.set('bookingUrlParams',{tripType:'RT',departure:'Madrid',adult:1,child:1,infant:1})
            controller.searchRequest = {
                departureAirport:'MAD',
                arrivalAirport: 'BCN',
                departure: 'Madrid',
                arrival:'Barcelona',
                arrivalArrival: false,
                departureDate: '22/10/2023',
                returnDate: '24/10/2023',
            }
        })
        it(', it will redirect to BKI page', () =>{
            controller.goToBooking();
            expect(controller).toBeDefined();
        });
    });
});
