import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';

let resolveSpy;
let rejectSpy;

describe('IbShuttleService test: ', () => {

    let IbShuttleService, $q, $rootScope, $location, $filter;
    const mockBookingAppConstants = {
        BOOKING_PARAMS_NAMES: {
            MARKET: '',
            LANGUAGE: '',
            ORIGIN: '',
            DESTINATION: '',
            SENIOR: '',
            ADULT: '',
            CHILD: '',
            INFANT: '',
            YOUNG: '',
            TEENAGER: ['BNN'],
            FLEXIBLE_DATES: '',
            DEPARTURE_DATE: '',
            INBOUND_DATE: '',
            CODE_ERROR: '',
            SEARCH_ORIGIN: '',
            WEB_MODE: '',
            TRIP_TYPE: '',
            RESIDENT: '',
            LARGE_FAMILY_TYPE: '',
            IB_GROUP: '',
            PREFERED_CLASS: '',
            AVIOS_PAY: '',
            CHANNEL: '',
            DEVICE: '',
            REFERRALID: '',
            DISPLAYEDPRICE: '',
            FLIGHTNUMBER: '',
            BOOKINGCODE: '',
            CARRIER: '',
            CABIN: '',
            SLICE: '',
            PRICECURRENCY: '',
            USERCURRENCY: '',
            NUMTRIPS: '',
            BACKTOURL: '',
            BEGIN_CITY: '',
            END_CITY: '',
            BEGIN_DAY: '',
            BEGIN_MONTH: '',
            BEGIN_YEAR: '',
            END_DAY: '',
            END_MONTH: '',
            END_YEAR: '',
            FARE_TYPE: '',
            FARE_TYPE_END: '',
            CODE_TRACKING: '',
            CHECK_AVIOS : '',
            CHECK_POINTS : ''
        }
    };
    const mockBookingUtilService = {
        getURLFirstParameterByName: jasmine.createSpy('getURLFirstParameterByName').and.callFake(() => {
            return 'Ok';
        }),
        initStorage: jasmine.createSpy()
    };

    const mockShuttleFareService = {};
    const mockBookingModalService = {
        showGenericError: jasmine.createSpy(),
        showWaitingModal: jasmine.createSpy()
    };
    const mockCommonsGetLoginInfoService = {
        checkCustomerStatus: jasmine.createSpy()
    };
    const mockRedirectionService = {
        externalRedirect: jasmine.createSpy('externalRedirect').and.callFake(() => {}),
        redirectToLoginPage: jasmine.createSpy('redirectToLoginPage').and.callFake(() => {})
    };
    const mockTransformedShuttleData = {
        passengerInfo: {
            adults: 0,
            childs: 0,
            infants: 0
        },
        slices: [],
        priceInfo: {
            totalFormatter: '',
            text: ''
        },
        fareFamilyConditions: []
    };
    const mockIbFareShuttleTransformer = {
        transform: jasmine.createSpy('transform').and.callFake(() => {
            return mockTransformedShuttleData;
        }),
        processHeaderData: jasmine.createSpy('processHeaderData').and.callFake(() => {
            return {};
        })
    };
    const mockHttpUtilService = {
        refreshToken: jasmine.createSpy('refreshToken').and.callFake(() => {
            return {};
        })
    };

    const mockCommonsUserUtilsService = {
        isIbZero: jasmine.createSpy('refreshToken').and.stub(),
        isSoftUser: jasmine.createSpy('refreshToken').and.stub()
    };

    const mockCommonsModalService = {};

    const mockCommonsCommercialInfobyMarketService = {
        getCommercialInfo: jasmine.createSpy()
    };
    const mockLinksFilterFilter = () => {
        return '';
    };
    const mockShuttleFareRedentionService = {};
    const fareResponse = { responseId: 'Qm9va2luZ0BHVy0xNTcxODI2NzA4MTQyLVNWT1Ji', offers: [{ offerId: 'IB3fe17033dcc743c49ef25d55c16d5603OP', price: { fare: 420.00, tax: 41.79, total: 461.79, currency: 'EUR', ticketingFee: 0 }, slices: [{ sliceId: '1MADBCN', departureDateTime: null, arrivalDateTime: null, duration: null, stopsNumber: 0, price: { fare: 165.00, tax: 21.46, total: 186.46, currency: 'EUR', ticketingFee: 0 }, detailedPrices: [{ fare: 165.00, tax: 21.46, total: 186.46, currency: 'EUR', passengerIds: ['ADULT_01'], segmentPrices: null, ticketingFee: 0 }], segments: [{ departure: { code: 'MAD', name: 'Madrid Adolfo Suarez-Barajas', terminal: '4', city: { code: 'MAD', description: 'Madrid', countryCode: 'ES', country: { code: 'ES', description: 'España' } } }, arrival: { code: 'BCN', name: 'Barcelona', terminal: '1', city: { code: 'BCN', description: 'Barcelona', countryCode: 'ES', country: { code: 'ES', description: 'España' } } }, flight: { marketingCarrier: { code: 'IB', name: 'Iberia' }, operationalCarrier: { code: 'IB', name: 'Iberia' }, marketingFlightNumber: 'OPEN', operationalFlightNumber: 'OPEN', operationalDisclosure: 'IB', aircraft: null }, cabin: { rbd: 'Y', bookingCode: null, bookingClass: 'TOURIST', remainingSeats: 0, fareFamily: 'YPA', fareBasis: 'YDRT', seatDisplays: null, extendedFareCode: '', cabinDescription: 'Turista' }, overnight: false, id: 'GZXilH0Glymr8XzB', duration: null, waitingTime: 0, providerId: '', ticketDesignator: '', accrualQuote: null, delayInformation: null, stop: null, departureDateTime: null, arrivalDateTime: null }], overnight: false }, { sliceId: '2BCNMAD', departureDateTime: null, arrivalDateTime: null, duration: null, stopsNumber: 0, price: { fare: 255.00, tax: 20.33, total: 275.33, currency: 'EUR', ticketingFee: 0 }, detailedPrices: [{ fare: 255.00, tax: 20.33, total: 275.33, currency: 'EUR', passengerIds: ['ADULT_01'], segmentPrices: null, ticketingFee: 0 }], segments: [{ departure: { code: 'BCN', name: 'Barcelona', terminal: '1', city: { code: 'BCN', description: 'Barcelona', countryCode: 'ES', country: { code: 'ES', description: 'España' } } }, arrival: { code: 'MAD', name: 'Madrid Adolfo Suarez-Barajas', terminal: '4', city: { code: 'MAD', description: 'Madrid', countryCode: 'ES', country: { code: 'ES', description: 'España' } } }, flight: { marketingCarrier: { code: 'IB', name: 'Iberia' }, operationalCarrier: { code: 'IB', name: 'Iberia' }, marketingFlightNumber: 'OPEN', operationalFlightNumber: 'OPEN', operationalDisclosure: 'IB', aircraft: null }, cabin: { rbd: 'J', bookingCode: null, bookingClass: 'BUSINESS', remainingSeats: 0, fareFamily: 'BPA', fareBasis: 'JDRT', seatDisplays: null, extendedFareCode: '', cabinDescription: 'Business' }, overnight: false, id: 'G+ThiV10kunEO4oB', duration: null, waitingTime: 0, providerId: '', ticketDesignator: '', accrualQuote: null, delayInformation: null, stop: null, departureDateTime: null, arrivalDateTime: null }], overnight: false }], offerExpiration: '2019-10-23T13:21:49.953+02:00', onHoldOptions: [], cashAviosPossibilities: [], carryOnBaggageAllowances: [{ totalQuantity: 1, segmentIds: ['GZXilH0Glymr8XzB', 'G+ThiV10kunEO4oB'] }], checkedBagAllowances: [{ totalQuantity: 1, pieceAllowances: [{ totalQuantity: 1, commercialName: 'UP TO 23 KG AND 158 LCM', descriptions: [], type: 'PIECE' }], segmentIds: ['GZXilH0Glymr8XzB'] }, { totalQuantity: 2, pieceAllowances: [{ totalQuantity: 2, commercialName: 'UP TO 23 KG AND 158 LCM', descriptions: [], type: 'PIECE' }], segmentIds: ['G+ThiV10kunEO4oB'] }], availableServices: [], selectedServices: [], specialDiscountsApplied: [], accrualQuote: { redemptionPoints: null, qualificationPoints: null }, offerItems: [{ offerItemId: 'IB3fe17033dcc743c49ef25d55c16d5603OP_01', passengerIds: ['ADULT_01'], price: { fare: 420.00, tax: 41.79, total: 461.79, currency: 'EUR', ticketingFee: 0 }, detailedTaxes: [{ code: 'QV', amount: 7.70, currency: 'EUR', description: 'Seguridad' }, { code: 'OG', amount: 1.34, currency: 'EUR', description: 'Tasa de seguridad' }, { code: 'JD', amount: 32.75, currency: 'EUR', description: 'Cargo por salida' }], fareCalculation: null, fareComponents: [] }], type: 'SHUTTLE' }], passengers: [{ passengerId: 'ADULT_01', passengerType: 'ADULT', firstName: null, surname: null, frequentFlyerInfo: null }], contextMetadata: { language: 'es', country: 'ES', currencies: [{ code: 'EUR', description: 'Euro', symbol: '€', alignment: 'R', groupingSeparator: '.', decimalSeparator: ',', decimals: 2, recommendedDisplay: 'symbol' }] }, fareFamilyConditions: [{ cabinType: 'E', cabinDescription: 'Turista', commercialCode: 'YPA', commercialName: 'Turista Puente Aéreo', commercialNameES: 'Turista Puente Aéreo', priority: 500, conditions: [{ code: 'EQMANO', name: 'Equipaje de mano', text: '1 bulto', units: 1, extendedInfo: { title: '1 bulto en cabina', message: '1 bulto/ 56x45x25cm', code: 'CA_EQP_MANO_10KG', conditionStatus: true, observationCode: null } }, { code: 'EQBODEGA', name: 'Equipaje en bodega', text: '1 pieza.', units: 1, extendedInfo: { title: '1 equipaje en bodega', message: 'Incluido: 1 pieza', code: 'CA_1_PIEZAS', conditionStatus: true, observationCode: null } }, { code: 'ASIENTO', name: 'Selección de asiento', text: 'Incluido', units: null, extendedInfo: { title: 'Con selección de asiento', message: 'Incluido', code: 'CA_Asiento_Gratuito', conditionStatus: true, observationCode: null } }, { code: 'CAMBIO', name: 'Cambios', text: 'Permitidos en cualquier momento', units: null, extendedInfo: { title: 'Cambio permitido', message: 'Permitidos en cualquier momento', code: 'CA_CAMBIO SIEMPRE', conditionStatus: true, observationCode: null } }, { code: 'REEMBOLSO', name: 'Reembolso (por sentido)', text: 'Permitido en cualquier momento', units: null, extendedInfo: { title: 'Reembolso permitido', message: 'Reembolso permitido en cualquier momento.', code: 'CA_REEMBOLSO SIEMPRE', conditionStatus: true, observationCode: null } }], observations: [], conditionsPriority: ['EQMANO', 'EQBODEGA', 'COMIDA', 'ASIENTO', 'CAMBIO', 'REEMBOLSO'] }], advices: [], services: [], relatedContent: [{ key: 'TOTAL_PRICE', value: 'Precio total, incluye tarifa aérea, <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&modal=true&cntCat=Productos/INFLEG&cntId=tasas_gubernamentales&market=ES&language=es\'>tasas</a> (salvo las que se cobren en determinados aeropuertos en el momento de facturar), gastos de gestión, cargos del operador, y las opciones seleccionadas. Si eliges abonar el viaje con una de estas <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&modal=true&cntCat=Productos/INFLEG&cntId=tarjetas_empresa&market=ES&language=es\'>tarjetas</a>, se aplicará un cargo adicional por reserva de un 1% del importe final en vuelos de largo radio y 2% en el resto de vuelos.' }] };
    const dataFareResponse = { data: fareResponse };

    const localStorageService = new StorageServiceMock();

    const mockBookingParamsMADOneWayBusiness2ADT = { tripType: '1', arrival: 'MAD', destination: 'BCN', beginFareType: 'B', adult: 2 };
    const mockBookingParamsMADOneWayBusiness2ADT2 = { tripType: '1', arrival: 'MAD', destination: 'BCN', beginFareType: 'R', adult: 2 };
    const mockBookingParamsBCNMADTourist2ADT = { tripType: '2', arrival: 'BCN', destination: 'MAD', beginFareType: 'R', endFareType: 'B', adult: 2 };
    const mockBookingParamsBCNMADBusinessAndTourist2ADT = { tripType: '2', arrival: 'BCN', destination: 'MAD', beginFareType: 'B', endFareType: 'R', adult: 2 };
    const mockBookingParamsBCNMADTourist2ADT1CHILD = { tripType: '2', arrival: 'BCN', destination: 'MAD', beginFareType: 'R', endFareType: 'R', adult: 2, child: 1 };
    const mockBookingParamsBCNMADTourist2ADT1CHILD2 = { tripType: '0', arrival: 'BCN', destination: 'MAD', beginFareType: 'R', endFareType: 'R', adult: 2, child: 1 };
    const mockFareRequest = {
        slices: [{ origin: 'MAD', destination: 'BCN', cabin: 'BUSINESS' }],
        passengers: [{ passengerType: 'ADULT', count: 1 }],
        marketCode: 'ES'
    };
    const mockCommonsHttpUtilService = {
        refreshToken: jasmine.createSpy()
    };
    const mockBookingAvailabilityTransformer = {
        genCalcAviosFlightReq: jasmine.createSpy(),
        TransCalcPointsData: jasmine.createSpy()
    };
    const mockIbBookingCalculatePointsService = {
        getCalculateFlightsAvios: jasmine.createSpy(),
        getCalculatedPoints: jasmine.createSpy()
    };

    let data, result;

    beforeEach(() => {

        angular.mock.module('ib-shuttle-module', 'LocalStorageModule', ($provide) => {
            $provide.value('BookingUtilService', mockBookingUtilService);
            $provide.value('BookingAppConstants', mockBookingAppConstants);
            $provide.value('ShuttleFareService', mockShuttleFareService);
            $provide.value('BookingRedirectionService', mockRedirectionService);
            $provide.value('BookingModalService', mockBookingModalService);
            $provide.value('CommonsGetLoginInfoService', mockCommonsGetLoginInfoService);
            $provide.value('IbFareShuttleTransformer', mockIbFareShuttleTransformer);
            $provide.value('HttpUtilService', mockHttpUtilService);
            $provide.value('ShuttleFareRedentionService', mockShuttleFareRedentionService);
            $provide.value('LinksFilterFilter', mockLinksFilterFilter);
            $provide.value('BookingCommercialSellingDataService', mockCommonsCommercialInfobyMarketService);
            $provide.value('CommonsHttpUtilService', mockCommonsHttpUtilService);
            $provide.value('BookingAvailabilityTransformer', mockBookingAvailabilityTransformer);
            $provide.value('IbBookingCalculatePointsService', mockIbBookingCalculatePointsService);
            $provide.value('CommonsSessionStorageService',localStorageService);
            $provide.value('CommonsUserUtilsService', mockCommonsUserUtilsService);
            $provide.value('CommonsModalService', mockCommonsModalService);
        });

        inject((_$rootScope_, _$filter_, _$q_, _$location_, _IbShuttleService_) => {
            IbShuttleService = _IbShuttleService_;
            $rootScope = _$rootScope_;
            $location = _$location_;
            $filter = _$filter_;
            $q = _$q_;
            mockShuttleFareService.getShuttleFare = jasmine.createSpy('getShuttleFare').and.callFake(() => {
                return $q.resolve(dataFareResponse);
            });
            mockShuttleFareRedentionService.getShuttleFare = jasmine.createSpy('getShuttleFare').and.callFake(() => {
                return $q.resolve(dataFareResponse);
            });

            mockRedirectionService.externalRedirect = jasmine.createSpy('externalRedirect').and.callFake(() => {
                return;
            });
            IbShuttleService.getCalculatedPoints = jasmine.createSpy().and.returnValue($q.resolve());
        } );

        resolveSpy = jasmine.createSpy('resolve');
        rejectSpy = jasmine.createSpy( 'reject' );

        $rootScope.$digest();
    });

    describe('getFareRequestObject', () => {

        it('exist method', () => {
            expect(IbShuttleService.getFareRequestObject({})).toBeDefined();
        });

        it('when params is null', () => {

            localStorageService.remove('bookingUrlParams');
            result = IbShuttleService.getFareRequestObject(data);
            expect(result.slices.length).toEqual(0);
            expect(result.passengers.length).toEqual(0);
        });

        it('when params is empty', () => {
            data = {};
            localStorageService.remove('bookingUrlParams');
            result = IbShuttleService.getFareRequestObject(data);
            expect(result.slices.length).toEqual(0);
            expect(result.passengers.length).toEqual(0);
        });

        it('when one way from MAD and 2 ADT', () => {
            result = IbShuttleService.getFareRequestObject(mockBookingParamsMADOneWayBusiness2ADT);
            expect(result.slices.length).toEqual(1);
            expect(result.slices[0]).toEqual({ origin: 'MAD', destination: 'BCN', cabin: 'BUSINESS' });
            expect(result.passengers.length).toEqual(1);
            expect(result.passengers[0]).toEqual({ passengerType: 'ADULT', count: 2 });
        });

        it('when one way from MAD and 2 ADT and begin faretype is tourist', () => {
            result = IbShuttleService.getFareRequestObject(mockBookingParamsMADOneWayBusiness2ADT2);
            expect(result.slices.length).toEqual(1);
            expect(result.slices[0]).toEqual({ origin: 'MAD', destination: 'BCN', cabin: 'TOURIST' });
            expect(result.passengers.length).toEqual(1);
            expect(result.passengers[0]).toEqual({ passengerType: 'ADULT', count: 2 });
        });

        it('when one way from MAD and 2 ADT in localStorage', () => {
            data = undefined;
            localStorageService.set('bookingUrlParams', mockBookingParamsMADOneWayBusiness2ADT);
            result = IbShuttleService.getFareRequestObject(data);
            expect(result.slices.length).toEqual(1);
            expect(result.slices[0]).toEqual({ origin: 'MAD', destination: 'BCN', cabin: 'BUSINESS' });
            expect(result.passengers.length).toEqual(1);
            expect(result.passengers[0]).toEqual({ passengerType: 'ADULT', count: 2 });
        });

        it('when BCN-MAD with 2 ADT in Tourist', () => {
            result = IbShuttleService.getFareRequestObject(mockBookingParamsBCNMADTourist2ADT);
            expect(result.slices.length).toEqual(2);
            expect(result.slices[0]).toEqual({ origin: 'BCN', destination: 'MAD', cabin: 'TOURIST' });
            expect(result.slices[1]).toEqual({ origin: 'MAD', destination: 'BCN', cabin: 'BUSINESS' });
            expect(result.passengers.length).toEqual(1);
            expect(result.passengers[0]).toEqual({ passengerType: 'ADULT', count: 2 });
        });

        it('when BCN-MAD with 2 ADT in Business and Tourist', () => {
            result = IbShuttleService.getFareRequestObject(mockBookingParamsBCNMADBusinessAndTourist2ADT);
            expect(result.slices.length).toEqual(2);
            expect(result.slices[0]).toEqual({ origin: 'BCN', destination: 'MAD', cabin: 'BUSINESS' });
            expect(result.slices[1]).toEqual({ origin: 'MAD', destination: 'BCN', cabin: 'TOURIST' });
            expect(result.passengers.length).toEqual(1);
            expect(result.passengers[0]).toEqual({ passengerType: 'ADULT', count: 2 });
        });

        it('when BCN-MAD with 2 ADT + 1 CHILD in Tourist', () => {
            result = IbShuttleService.getFareRequestObject(mockBookingParamsBCNMADTourist2ADT1CHILD);
            expect(result.slices.length).toEqual(2);
            expect(result.slices[0]).toEqual({ origin: 'BCN', destination: 'MAD', cabin: 'TOURIST' });
            expect(result.slices[1]).toEqual({ origin: 'MAD', destination: 'BCN', cabin: 'TOURIST' });
            expect(result.passengers.length).toEqual(2);
            expect(result.passengers[0]).toEqual({ passengerType: 'ADULT', count: 2 });
            expect(result.passengers[1]).toEqual({ passengerType: 'CHILD', count: 1 });
        });

        it('when BCN-MAD with 2 ADT + 1 CHILD in Tourist and trip type distint of 1 or 2', () => {
            result = IbShuttleService.getFareRequestObject(mockBookingParamsBCNMADTourist2ADT1CHILD2);
            expect(result.slices.length).toEqual(0);
            expect(result.passengers.length).toEqual(2);
            expect(result.passengers[0]).toEqual({ passengerType: 'ADULT', count: 2 });
            expect(result.passengers[1]).toEqual({ passengerType: 'CHILD', count: 1 });
        });

    });

    describe('getInitialParameters', () => {

        it('exist method', () => {
            expect(IbShuttleService.getInitialParameters()).toBeDefined();
        });

        xit('the return object have all necesary fields', () => {
            result = IbShuttleService.getInitialParameters();
            expect(result.arrival).toEqual('BCN');
            expect(result.destination).toEqual('MAD');
        });

        xit('the return object have all necesary fields with avios', () => {
            result = IbShuttleService.getInitialParameters();
            expect(result.checkAvios).toEqual('1');
        });

        it('the return object have all necesary fields except destination and arrival is equal to MAD', () => {
            mockBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((data) => {
                let result;
                mockBookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_CITY = 'MAD';
                mockBookingAppConstants.BOOKING_PARAMS_NAMES.END_CITY = 'END';
                if(data === 'MAD') {
                    result = 'MAD';
                }else if(data === 'END') {
                    result = false;
                }
                return result;
            });
            $rootScope.redirectFromRedention = true;
            mockBookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_CITY = '';
            mockBookingAppConstants.BOOKING_PARAMS_NAMES.END_CITY = '';
            result = IbShuttleService.getInitialParameters();
            expect(result.arrival).toEqual('MAD');

        });

        it('the return object have all necesary fields except destination and arrival is distint to MAD', () => {
            mockBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((data) => {
                let result;
                mockBookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_CITY = 'BCN';
                mockBookingAppConstants.BOOKING_PARAMS_NAMES.END_CITY = 'END';
                mockBookingAppConstants.BOOKING_PARAMS_NAMES.POINTS_PAY = 'UNO';
                if(data === 'BCN') {
                    result = 'BCN';
                }else if(data === 'END') {
                    result = null;
                }else if(data === 'UNO') {
                    result = '1';
                }
                return result;
            });
            $rootScope.redirectFromRedention = false;
            mockBookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_CITY = '';
            mockBookingAppConstants.BOOKING_PARAMS_NAMES.END_CITY = '';
            mockBookingAppConstants.BOOKING_PARAMS_NAMES.POINTS_PAY = '';
            result = IbShuttleService.getInitialParameters();
            expect(result.arrival).toEqual('BCN');

        });

        it('the return object have all necesary fields except destination and arrival with points', () => {
            mockBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((data) => {
                let result;
                mockBookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_CITY = 'BCN';
                mockBookingAppConstants.BOOKING_PARAMS_NAMES.CHECK_AVIOS = 'CHECK_AVIOS';
                mockBookingAppConstants.BOOKING_PARAMS_NAMES.CHECK_POINTS = 'CHECK_POINTS';
                if(data === 'CHECK_AVIOS') {
                    result = '2';
                }else if(data === 'CHECK_POINTS') {
                    result = '1';
                }else if(data === 'BCN') {
                    result = 'BCN';
                }
                return result;
            });
            $rootScope.redirectFromRedention = false;
            mockBookingAppConstants.BOOKING_PARAMS_NAMES.CHECK_AVIOS = '';
            mockBookingAppConstants.BOOKING_PARAMS_NAMES.CHECK_POINTS = '';
            result = IbShuttleService.getInitialParameters();
            expect(result.arrival).toEqual('BCN');
        });

    });

    describe('initShuttleFlow correctly', () => {

        it('initShuttleFlow and logged', () => {
            inject(($q) =>{
                mockCommonsGetLoginInfoService.checkCustomerStatus = jasmine.createSpy('checkCustomerStatus').and.callFake(() => {
                    return $q.resolve({});
                });
                mockBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(() => {
                    return '1';
                });
            });
            spyOn(IbShuttleService, 'getCommercialInfo');
            IbShuttleService.getInitialParameters();
            IbShuttleService.initShuttleFlow();
            $rootScope.$digest();
            expect(IbShuttleService.getCommercialInfo).toHaveBeenCalled();

        });


        it('initShuttleFlow and no logged and modal error ok', () => {
            inject(($q) =>{
                mockCommonsGetLoginInfoService.checkCustomerStatus = jasmine.createSpy('checkCustomerStatus').and.callFake(() => {
                    return $q.reject({});
                });
                mockBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(() => {
                    return '1';
                });
                mockBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => {
                    return { result: $q.resolve({}) };
                });
            });
            spyOn(IbShuttleService, 'getCommercialInfo');
            IbShuttleService.getInitialParameters();
            IbShuttleService.initShuttleFlow();
            $rootScope.$digest();
            expect(mockBookingModalService.showGenericError).toHaveBeenCalled();
            expect(IbShuttleService.getCommercialInfo).toHaveBeenCalled();

        });



        it('initShuttleFlow and no logged and modal error closed', () => {
            inject(() =>{
                mockCommonsGetLoginInfoService.checkCustomerStatus = jasmine.createSpy('checkCustomerStatus').and.callFake(() => {
                    return $q.reject({});
                });
                mockCommonsGetLoginInfoService.getCommercialInfo = jasmine.createSpy('checkCustomerStatus').and.callFake(() => {
                    return $q.reject({});
                });
                mockBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(() => {
                    return '1';
                });
                mockBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => {
                    return { result: $q.reject({}) };
                });
            });
            spyOn(IbShuttleService, 'getCommercialInfo');
            IbShuttleService.getInitialParameters();
            IbShuttleService.initShuttleFlow();
            $rootScope.$digest();
            expect(mockBookingModalService.showGenericError).toHaveBeenCalled();
            expect(IbShuttleService.getCommercialInfo).toHaveBeenCalled();
        });

    });

    describe('checkIsLogged', () =>{
        it('is not redention', () => {
            inject(($q) =>{
                mockBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(() => {
                    return '0';
                });
            });
            IbShuttleService.initShuttleObtention = jasmine.createSpy('initShuttleObtention').and.callFake(() => {
                return ;
            });
            IbShuttleService.getInitialParameters();
            IbShuttleService.isLogged = false;
            IbShuttleService.checkIsLogged(resolveSpy, rejectSpy);
            expect(IbShuttleService.initShuttleObtention).toHaveBeenCalled();
        });

        it('logged is ok', () => {
            IbShuttleService.initShuttleRedention = jasmine.createSpy('initShuttleRedention').and.callFake(() => {
                return;
            });
            inject(($q) =>{
                mockBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(() => {
                    return '1';
                });
            });
            IbShuttleService.getInitialParameters();
            IbShuttleService.isLogged = true;
            IbShuttleService.checkIsLogged(resolveSpy, rejectSpy);
            expect(IbShuttleService.initShuttleRedention).toHaveBeenCalled();
        });

        it('logged is ko', () => {
            inject(($q) =>{
                mockBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(() => {
                    return '1';
                });
            });
            IbShuttleService.getInitialParameters();
            IbShuttleService.isLogged = false;
            IbShuttleService.checkIsLogged(resolveSpy, rejectSpy);
            expect(mockRedirectionService.redirectToLoginPage).toHaveBeenCalled();
        });
    });

    describe('initShuttleObtention', () => {

        const resolveSpy = jasmine.createSpy('resolve');
        const rejectSpy = jasmine.createSpy('reject');

        it('ShuttleFareService.getShuttleFare is ok', () => {
            inject(() => {
                mockShuttleFareService.getShuttleFare = jasmine.createSpy().and.callFake(() => {
                    return $q.resolve(dataFareResponse);
                });
            });

            IbShuttleService.getFareRequestObject = jasmine.createSpy().and.returnValue(mockFareRequest);

            IbShuttleService.initShuttleObtention({}, false, resolveSpy, rejectSpy);
            $rootScope.$digest();

            expect(IbShuttleService.getFareRequestObject).toHaveBeenCalled();
            expect(localStorageService.get('flowApp')).toEqual('PAOB');
            expect(localStorageService.get('fareShuttleRequest')).toEqual(mockFareRequest);
            expect(localStorageService.get('fareData')).toEqual(fareResponse);

            expect(resolveSpy).toHaveBeenCalled();
        });

        it('ShuttleFareService.getShuttleFare is ok with business', () => {
            inject(() => {
                mockShuttleFareService.getShuttleFare = jasmine.createSpy().and.returnValue($q.resolve(dataFareResponse));
            });

            IbShuttleService.getFareRequestObject = jasmine.createSpy().and.returnValue(mockFareRequest);

            IbShuttleService.initShuttleObtention({}, false, resolveSpy, rejectSpy);
            $rootScope.$digest();

            expect(resolveSpy).toHaveBeenCalled();
        });

        it('ShuttleFareService.getShuttleFare is ko', () => {
            inject(() => {
                mockShuttleFareService.getShuttleFare = jasmine.createSpy().and.returnValue($q.reject({}));
            });

            IbShuttleService.getFareRequestObject = jasmine.createSpy().and.returnValue(mockFareRequest);

            IbShuttleService.initShuttleObtention({}, false, resolveSpy, rejectSpy);
            $rootScope.$digest();

            expect(rejectSpy).toHaveBeenCalled();
        });

    });

    describe('initShuttleRedention', () => {

        const resolveSpy = jasmine.createSpy('resolve');
        const rejectSpy = jasmine.createSpy('reject');

        it('ShuttleFareRedentionService.getShuttleFare is ok', () => {
            inject(() => {
                mockShuttleFareRedentionService.getShuttleFare = jasmine.createSpy().and.returnValue($q.resolve(dataFareResponse));
            });

            IbShuttleService.getFareRequestObject = jasmine.createSpy().and.returnValue(mockFareRequest);

            IbShuttleService.initShuttleRedention({}, false, resolveSpy, rejectSpy);
            $rootScope.$digest();

            expect(localStorageService.get('flowApp')).toEqual('PARE');
            expect(resolveSpy).toHaveBeenCalled();
        });

        it('ShuttleFareRedentionService.getShuttleFare is ok with business', () => {
            inject(() => {
                mockShuttleFareRedentionService.getShuttleFare = jasmine.createSpy().and.returnValue($q.resolve(dataFareResponse));
            });

            IbShuttleService.getFareRequestObject = jasmine.createSpy().and.returnValue(mockFareRequest);

            IbShuttleService.initShuttleRedention({}, true, resolveSpy, rejectSpy);
            $rootScope.$digest();

            expect(localStorageService.get('flowApp')).toEqual('PAREONB');
            expect(resolveSpy).toHaveBeenCalled();
        });

        it('ShuttleFareRedentionService.getShuttleFare is ko', () => {
            inject(() => {
                mockShuttleFareRedentionService.getShuttleFare = jasmine.createSpy().and.returnValue($q.reject({}));
            });

            IbShuttleService.getFareRequestObject = jasmine.createSpy().and.returnValue(mockFareRequest);

            IbShuttleService.initShuttleRedention({}, false, resolveSpy, rejectSpy);
            $rootScope.$digest();

            expect(rejectSpy).toHaveBeenCalled();
        });

    });


    describe('redirectToLogin', () => {
        it('it should call redirectToLoginPage service', () => {
            IbShuttleService.redirectToLogin();
            expect(mockRedirectionService.redirectToLoginPage).toHaveBeenCalled();
        });
    });
});
