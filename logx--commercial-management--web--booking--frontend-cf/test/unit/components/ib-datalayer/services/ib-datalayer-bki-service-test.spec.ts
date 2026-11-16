import angular from 'angular';
import { StorageServiceMock } from '../../../../mocks/Services/StorageServiceMock';

describe('DatalayerBKIService test', () => {
    // Test scoped variables
    let DatalayerBKIService,  localStorageService;
    const fakeDatalayerConstants = require('../../../../mocks/constants/DatalayerConstants-mock.json');
    const fakeDatalayerBKIConstants = {
        SEARCH_CITY: 'SearchCity',
        SEARCH_COUNTRY: 'SearchCountry',
        SEARCH_DEST: 'SearchDest',
        SEARCH_DEST_NAME: 'SearchDestName',
        SEARCH_ORIGIN: 'SearchOrigin',
        SEARCH_ORIGIN_NAME: 'SearchOriginName',
        ADVANCE_PURCHASE: 'AdvancePurchase',
        SEARCH_OD: 'SearchOD',
        SEARCH_COUNTRIES: 'SearchCountries',
        SEARCH_TYPE: 'SearchType',
        FLIGHT_HAUL: 'FlightHaul',
        LARGE_FAMILY: 'LargeFamily',
        RESIDENT_CODE: 'ResidentCode',
        PROCESS_START: 'ProcessStart',
        PAX_YOUNG: 'PaxYoung',
        PAX_ADULT: 'PaxAdult',
        PAX_INFANT: 'PaxInfant',
        PAX_CHILD: 'PaxChild',
        PAX_SENIOR: 'PaxSenior',
        PAX_TOTAL: 'PaxTotal',
        SLICE_1_RESULTS: 'Slice1Results',
        SLICE_2_RESULTS: 'Slice2Results',
        LENGTH_STAY: 'LengthStay',
        FLIGHT_TYPE: 'FlightType',
        IBPLUS_HOLDER: 'IbplusHolder',
        AVIOS_EARNED: 'AviosEarned',
        PURCHASE_TYPE: 'PurchaseType',
        TOTAL_PRICE: 'TotalPrice',
        TOTAL_PRICE_WITHOUT_TAXES: 'TotalPriceWithoutTaxes',
        DYNAMIC_PRICING:'DynamicPricing'
    }
    const fakeBookingAppConstants = require('../../../../mocks/constants/BookingAppConstants-mock.json')
    let fakeSessionStorage = new StorageServiceMock();
    const fakeDatalayerGeneralConstants = {
        PROCESS: 'Process',
        STEP: 'Step',
        USER_SEGMENT: 'UserSegment',
        CODE_TRACKING: 'UserCUG',
        ORIGIN_DESTINATIONS: 'AirportSeg',
        BOOKING_CLASS: 'BookingClass',
        CURRENCY: 'Currency',
        TOTAL_PRICE_AVIOS: 'AviosUsed',
    }
    let fakeCommonsUtilService = {
        getTypeSearch: jasmine.createSpy('getTypeSearch'),
        getProcess: jasmine.createSpy('getProcess'),
        getIdItem: jasmine.createSpy('getIdItem'),
    }
    let fakeDatalayerUtilsService = {
        changeLargeFamilyValue: jasmine.createSpy('changeLargeFamilyValue'),
        addDigitalDataInfo: jasmine.createSpy('addDigitalDataInfo'),
        getItemCategory3: jasmine.createSpy('getItemCategory3'),
        addDataLayerInfo: jasmine.createSpy('addDataLayerInfo'),
        addDestinationInfoDatalayer: jasmine.createSpy('addDestinationInfoDatalayer'),
        sendDatalayerEvent: jasmine.createSpy('sendDatalayerEvent'),
        updateDatalayerViewEvent: jasmine.createSpy('updateDatalayerViewEvent'),
        addDestinationInfoDigitalData: jasmine.createSpy('addDestinationInfoDigitalData'),
        getTripType: jasmine.createSpy('getTripType').and.returnValue('RT'),
        getTypeSearch: jasmine.createSpy('getTypeSearch'),
        LANG : 'es',
        MARKET: 'ES'
    }
    let fakeDigitalDataService = {
        addDigitalDataEcommerceEvent: jasmine.createSpy('addDigitalDataEcommerceEvent'),
        setAddInfoAddToCart: jasmine.createSpy('setAddInfoAddToCart'),
        emitEvent: jasmine.createSpy('emitEvent')
    }
    let fakeBookingUtilService = {
        addflightRatioInDataLayer: jasmine.createSpy('addflightRatioInDataLayer'),
        addflightHaulInDigitalInfo: jasmine.createSpy('addflightHaulInDigitalInfo')
    }
    const mockAvailabilityData = {
        flightRatio: 'Corto Radio',
        originDestinations: [
            {
                slices: [{}],
                origin: 'Madrid',
                originCity: {
                    countryCode: 'MAD'
                },
                destination: 'Barcelona',
                destinationCity: {
                    countryCode: 'BCN'
                }
            },
            {
                slices: [{}],
                origin: 'MAD',
                originCity: {
                    countryCode: 'MAD'
                },
                destination: 'BCN',
                destinationCity: {
                    countryCode: 'BCN'
                }
            }
        ]
    }
    const fakeBookingUrlParams = {
        'modeWeb': null,
        'searchOrigin': 'IBHMPA',
        'tripType': '1',
        'senior': null,
        'adult': 1,
        'young': null,
        'teenager': null,
        'child': null,
        'infant': null,
        'resident': true,
        'largeFamilyType': 'F2',
        'flexDates': 'true',
        'preferredCabin': 'R',
        'payWithAvios': null,
        'payWithPoints': null,
        'ibGroup': null,
        'referralId': null,
        'displayedPrice': null,
        'slices': [],
        'userCurrency': null,
        'priceCurrency': null,
        'numTrips': null,
        'originDestinations': [
            {
                'origin': 'MAD',
                'destination': 'OVD',
                'date': '2020-02-12'
            }
        ],
        'bookingCode1': null,
        'backToUrl': null,
        'codeTracking': null,
        'travelAgent': null
    };
    const mockSlices = [
        {
            departureDateTime: "2023-02-09 19:45",
            arrivalDateTime: "2023-02-09 20:50",
            segments:[
                {
                    departure:{
                        city:{
                            code:'MAD'
                        }
                    },
                    arrival:{
                        city:{
                            code:'BCN'
                        },
                        code:'BCN'
                    },
                    cabin:{
                        fareFamily:'E',
                        bookingClass:'bookingClass'
                    },
                    flight:{
                        operationalFlightNumber:'IBetc',
                        marketingFlightNumber:'IBetc',
                        operationalDisclosure:'OperationalEtc'
                    }
                }
            ]
        }
    ]
    const mockPriceInfo = {
        price:{
            totalCash:2,
            totalAvios:0,
            tax:1,
            total: 10,
            fare:1
        }
    }
    class DigitalDataPropertiesUtilsServiceMock {
        setProcess = jasmine.createSpy( 'setProcess' ).and.returnValue( 'booking' );
    }
    let fakeDigitalDataPropertiesUtilsService: DigitalDataPropertiesUtilsServiceMock;
    beforeEach(() => {
        angular.mock.module('ib-datalayer-bki-module', 'ib-commons-constants-module','ib-monetate-module', 'LocalStorageModule', ($provide) => {
            $provide.value('DatalayerConstants', fakeDatalayerConstants);
            $provide.value('DatalayerBKIConstants', fakeDatalayerBKIConstants);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('DatalayerGeneralConstants', fakeDatalayerGeneralConstants);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('DigitalDataService', fakeDigitalDataService);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('CommonsSessionStorageService', fakeSessionStorage);
            $provide.value('DigitalDataPropertiesUtilsService', fakeDigitalDataPropertiesUtilsService);
        });
        inject(( _DatalayerBKIService_, _localStorageService_) => {
            DatalayerBKIService = _DatalayerBKIService_;
            localStorageService = _localStorageService_;
        });
    });
    describe('When generateDigitalDataAvailability is called', () => {
        const advanceDate = 15
        beforeEach(inject(function () {
            localStorageService.set('bookingUrlParams', fakeBookingUrlParams);
            
            const date = new Date();
            date.setDate(date.getDate() + advanceDate);
            localStorageService.set('originDestinationMulticity', [{
                originCity: {
                    code: 'NYC',
                    timezone: 'America/New_York',
                    country:{
                        code:'USA'
                    }
                },
                destinationCity: {
                    code: 'MAD',
                    country:{
                        code:'ESP'
                    }
                },
                numberPassengrsWithoutInfant:1,
                dates: {
                    outboundFlight: date.toISOString(),
                    formatedOutboundFlight: date
                },
            }, {
                originCity: {
                    code: 'MAD',
                    timezone: 'Europe/Madrid',
                    country:{
                        code:'ESP'
                    }
                },
                destinationCity: {
                    code: 'LON',
                    country:{
                        code:'ESP'
                    }
                },
                numAdults:1,
                numberPassengrsWithoutInfant:1,
                dates: {
                    outboundFlight: date.toISOString,
                    formatedOutboundFlight: date
                },
            }]);
            const returnDate =  new Date(date);
            date.setDate(date.getDate() + advanceDate);
            localStorageService.set('originDestination', { numberPassengrsWithoutInfant: 1, destinationCity: { code: 'BCN', description: 'Barcelona' }, originCity: { code: 'MAD', description: 'Madrid', country: { code: 'ESP' } }, dates: { formatedReturnFlight: date, formatedOutboundFlight: returnDate}, numAdults:1,});
        }));
        xit(', it will return a full digitalData object', () => {
            localStorageService.set('multiCitySearch',false)
            let returnData = DatalayerBKIService.generateDigitalDataAvailability(mockAvailabilityData)
            expect(returnData).toEqual({ SearchCity: 'BCN', SearchOrigin: 'MAD', SearchDest: 'BCN', SearchCountry: 'ESP', AdvancePurchase: ''+ advanceDate, SearchOD: 'Madrid,MAD', SearchCountries: 'MAD-MAD', FlightHaul: 'Corto Radio', Process: undefined, Step: 'disponibilidad',  ResidentCode: true, ProcessStart: 'es/ES/IBHMPA', PaxTotal: '1', SearchOriginName: 'Madrid', SearchDestName: 'Barcelona', LengthStay: ''+ advanceDate, FlightType: 'RT', Slice1Results: '1', Slice2Results: '1', PaxAdult: '1' });
        });
        xit(', it will return a full digitalData object and it is multitrip', () => {
            localStorageService.set('multiCitySearch',true)
            let returnData = DatalayerBKIService.generateDigitalDataAvailability(mockAvailabilityData)
            expect(returnData).toEqual({ SearchCity: 'MAD-LON', SearchOrigin: 'NYC-MAD', SearchDest: 'MAD-LON', SearchCountry: 'USA-ESP', AdvancePurchase: `${advanceDate}-${advanceDate}`, SearchOD: 'Madrid-Barcelona/MAD-BCN', SearchCountries: 'MAD-MAD', FlightHaul: 'Corto Radio', Process: undefined, Step: 'disponibilidad',  ResidentCode: true, ProcessStart: 'es/ES/IBHMPA', PaxTotal: '1', SearchOriginName: undefined, SearchDestName: undefined, LengthStay: '0', FlightType: 'MT', Slice1Results: '1', Slice2Results: '1', PaxAdult: '1' });
        });
    });
    describe('When generateDigitalDataPassengers is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            fakeSessionStorage.set('fareFamilyConditionsInfo',[{commercialCode:'E',commercialNameES:'test'}])
        }));
        it(', it will return a full digitalData object', () => {
            let returnData = DatalayerBKIService.generateDigitalDataPassengers(mockSlices, mockPriceInfo, "€")
            expect(returnData).toEqual({Step: 'pasajeros',AirportSeg: 'MAD-BCN',Slice1Flights: 'OperationalEtcIBetc',Slice1Operator: 'OperationalEtc',BookingClass: 'b',Currency: '€',Slice1Cabin: 'bookingClass',Slice1Date: '09/02/2023',Slice1Routing: 'MAD-BCN',Slice1FareFamily: 'test',IbplusHolder: 'NO',TotalPrice: 0,TotalPriceWithoutTaxes: 0, TotalTaxes: 0});
        });
    });
    describe('When generateDigitalDataAncillaries is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
        }));
        it(', it will return a full digitalData object', () => {
            let returnData = DatalayerBKIService.generateDigitalDataAncillaries()
            expect(returnData).toEqual({Step: 'ancillaries'});
        });
    });
    describe('When emitEvent is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
        }));
        it(', it will return a full digitalData object', () => {
            DatalayerBKIService.emitEvent()
            expect(fakeDigitalDataService.emitEvent).toHaveBeenCalled();
        });
    });
    describe('When getLengthStayMultipleTrip is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            localStorageService.set('multiCitySearch',true);
        }));
        it(', it will return a full digitalData object', () => {
            DatalayerBKIService.getLengthStayMultipleTrip(mockSlices)
            expect(localStorageService.get('confirmationDigitalInfo')).toEqual({LengthStay: 0});
        });
    });
    describe('When updateDigitalDataDynamicPricing is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
        }));
        it(', it will return a full digitalData object', () => {
            DatalayerBKIService.updateDigitalDataDynamicPricing([{specialDiscountsApplied:[{description:'description'}],type:'DYNAMIC_PRICING'}])
            expect(fakeDatalayerUtilsService.addDigitalDataInfo).toHaveBeenCalled();
        });
    });
    describe('When updateDatalayerObject is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            localStorageService.set('fareData',{offers:[{offerItems:[{passengerIds:'ids',price:{total:0}}],discountsApplied:{originalPrice:{total:0},discounts:[{percentDiscount:1,totalDiscount:0.1,type:'DynamicPricing'}]}}]})
            localStorageService.set('bookingUrlParams', fakeBookingUrlParams);
        }));
        it(', it will return a full digitalData object', () => {
            DatalayerBKIService.updateDatalayerObject([{info:{bestPrice:2,slicePrice:4,selectedFareFamily:{farePriceToCalculate:4}, cabins:{'T':{fareFamilies:[{farePriceToCalculate:5, cabinDescription: 'Economy', commercialNameES: 'Turista', cabinType: 'E'}]}}}, cabin: 'T'}])
            expect(fakeDatalayerUtilsService.addDigitalDataInfo).toHaveBeenCalled();
        });
        it('and it is shuttle flow, it will return a full digitalData object', () => {
            DatalayerBKIService.updateDatalayerObject([{info:{bestPrice:2,slicePrice:4,selectedFareFamily:{farePriceToCalculate:4},cabinFullName:'Turista', cabinType: 'E', cabins:{'T':{fareFamilies:[{farePriceToCalculate:5, cabinDescription: 'Economy', commercialNameES: 'Turista'}]}}, type:'SHUTTLE', price:{total:10}}, cabin: 'T'}])
            expect(fakeDatalayerUtilsService.addDigitalDataInfo).toHaveBeenCalled();
        });
    });
    describe('When addflightRatio is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
        }));
        it(', it will return a full digitalData object', () => {
            DatalayerBKIService.addflightRatio('')
            expect(fakeBookingUtilService.addflightHaulInDigitalInfo).toHaveBeenCalled();
        });
    });
    describe('When addDestinationInfo is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
        }));
        it(', it will return a full digitalData object', () => {
            DatalayerBKIService.addDestinationInfo('','')
            expect(fakeDatalayerUtilsService.updateDatalayerViewEvent).toHaveBeenCalled();
        });
    });
    describe('When updateITravelDigitalData is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
        }));
        it('and iTravel is true', () => {
            DatalayerBKIService.updateITravelDigitalData(true);
            expect(fakeDatalayerUtilsService.addDigitalDataInfo).toHaveBeenCalledWith({IbplusHolder:'SI'});
        });
        it('and iTravel is false', () => {
            DatalayerBKIService.updateITravelDigitalData(false);
            expect(fakeDatalayerUtilsService.addDigitalDataInfo).toHaveBeenCalledWith({IbplusHolder:'NO'});
        });
    });
});
