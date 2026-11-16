import angular from 'angular';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';

describe('AncillariesTemporalUtilsService', () => {

    let $scope, localStorageService, $rootScope, AncillariesUtilsService, testWindow, fakeAncillariesUtilsTransformer: AncillariesUtilsTransformer;

    class AncillariesUtilsTransformer {
        public getBookingSegmentInformation = jasmine.createSpy('getBookingSegmentInformation');
        public generateAncillariesHeaderInfo = jasmine.createSpy('generateAncillariesHeaderInfo');
    }

    let mockBookingInfo = {
        order: {
            orderItems: [{
                type: 'SEAT',
                passengerId: 'ID',
                segmentId: 'id2'
            }]
        }
    };

    const mockTrip = {
        'id': 'MADLPA20221104073500',
        'pieces': [
            {
                'subtype': 'BAGGAGE_15',
                'description': '15Kg',
                'extraPieces': null,
                'reasonForIssuance': {
                    'code': 'C',
                    'subcode': '0LM'
                },
                'franchisePieces': 0,
                'purchasedPieces': 0,
                'maxAdditionalSubtypePieces': 9,
                'availablePriceRanges': [
                    {
                        'amount': 23,
                        'airportAmount': 23,
                        'from': 1,
                        'to': 9
                    }
                ],
                'status': {
                    'code': 'AVAILABLE',
                    'reason': null
                },
                'quantySelected': 1,
                '$$hashKey': 'object:1277'
            },
            {
                'subtype': 'BAGGAGE_23',
                'description': '23Kg',
                'extraPieces': null,
                'reasonForIssuance': {
                    'code': 'C',
                    'subcode': '0GO'
                },
                'franchisePieces': 0,
                'purchasedPieces': 0,
                'maxAdditionalSubtypePieces': 9,
                'availablePriceRanges': [
                    {
                        'amount': 28,
                        'airportAmount': 28,
                        'from': 1,
                        'to': 1
                    },
                    {
                        'amount': 33,
                        'airportAmount': 33,
                        'from': 2,
                        'to': 9
                    }
                ],
                'status': {
                    'code': 'AVAILABLE',
                    'reason': null
                },
                'quantySelected': 0,
                '$$hashKey': 'object:1278'
            },
            {
                'subtype': 'BAGGAGE_32',
                'description': '32Kg',
                'extraPieces': null,
                'reasonForIssuance': {
                    'code': 'C',
                    'subcode': '0FM'
                },
                'franchisePieces': 0,
                'purchasedPieces': 0,
                'maxAdditionalSubtypePieces': 9,
                'availablePriceRanges': [
                    {
                        'amount': 50,
                        'airportAmount': 50,
                        'from': 1,
                        'to': 9
                    }
                ],
                'status': {
                    'code': 'AVAILABLE',
                    'reason': null
                },
                'quantySelected': 0,
                '$$hashKey': 'object:1279'
            }
        ],
        'maxAdditionalPieces': 9,
        'piecesChoosed': 0,
        'totalPrice': 0,
        'totalBaggages': 0,
        'departure': {
            'code': 'MAD',
            'description': 'Madrid',
            'country': {
                'code': 'ES',
                'description': 'España'
            }
        },
        'arrival': {
            'code': 'LPA',
            'description': 'Gran Canaria Las Palmas',
            'country': {
                'code': 'ES',
                'description': 'España'
            }
        },
        'text': null,
        '$$hashKey': 'object:1275'
    };

    const mockPassengers = [
        {
            'passengerType': 'ADULT',
            'personalInfo': {
                'firstName': 'pepe',
                'firstSurname': 'perez',
                'lastSurname': ''
            },
            'passengerId': 'ADULT_01',
            'idInfo': null,
            'contactInfo': null,
            'residenceAccreditationStatus': null,
            'documentInfos': null,
            'redressInfo': null,
            'emergencyContactInfo': null,
            'externalPersonalInfo': {
                'name': 'pepe',
                'firstSurname': 'perez',
                'lastSurname': ''
            },
            'indirectOnBusinessInfo': null,
            'frequentFlyerInfo': null,
            'trips': [JSON.parse(JSON.stringify(mockTrip))]
        }
    ];

    const mockSeats = [{
        id: 'ID',
        seat: {
            row: 4,
            column: 3
        },
        price: 50,
        seatTypeDescription: 'desc',
        seatType: 'type',
        originalType: 'Otype'
    }];

    const fakeLocation = { path: jasmine.createSpy('path') };
  


    const fakeCurrencyService = { 'formatPrice': jasmine.createSpy(), 'formatAvios': jasmine.createSpy() };

    beforeEach(function () {
        localStorageService = new StorageServiceMock;
        fakeAncillariesUtilsTransformer = new AncillariesUtilsTransformer();
        angular.mock.module('ib-booking-ancillaries-module', ($provide) => {
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('CommonsSessionStorageService', localStorageService);
            $provide.value('AncillariesUtilsTransformer', fakeAncillariesUtilsTransformer);
            $provide.value('$location', fakeLocation);

        });

        inject(function (_$rootScope_, _AncillariesTemporalUtilsService_, $window) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
      
            AncillariesUtilsService = _AncillariesTemporalUtilsService_;
            testWindow = $window;
            $rootScope.$apply();
        });
    });



    it('getEndpoint()', () => {
        const mockEndpoints = {'ass-fass': 'fakeEndpoint'};
        localStorageService.set('endpoints', mockEndpoints);
        expect(AncillariesUtilsService.getEndpoint('ass-fass')).toBe('fakeEndpoint');
    });

    it('calculatePiecesBaggageTrip() should return the total price when one or more pieces of bag are selected', () => {
    //In this case, the only piece of bag that is selected is the BAGGAGE_15 with quantySelected = 1;
        const expectedValue = mockTrip.totalPrice + mockTrip.pieces[0].availablePriceRanges[0].amount;
        AncillariesUtilsService.calculatePiecesBaggageTrip(mockPassengers);
        expect(mockPassengers[0].trips[0].totalPrice).toBe(expectedValue);
    });

    it('calculatePiecesSpeqsTrip() should return the total price when one or more pieces of bag are selected', () => {
    //In this case, the only piece of bag that is selected is the BAGGAGE_15 with quantySelected = 1;
        const expectedValue = mockTrip.totalPrice + mockTrip.pieces[0].availablePriceRanges[0].amount;
        AncillariesUtilsService.calculatePiecesSpeqsTrip(mockPassengers);
        expect(mockPassengers[0].trips[0].totalPrice).toBe(expectedValue);
    });


    it('isBookingFlow() should return true or false depending on flowName value', () => {
        $rootScope.flowName = 'MMB';
        expect(AncillariesUtilsService.isBookingFlow()).toBe(false);
        $rootScope.flowName = 'CKI';
        expect(AncillariesUtilsService.isBookingFlow()).toBe(false);
        $rootScope.flowName = 'BKI';
        expect(AncillariesUtilsService.isBookingFlow()).toBe(true);
    });

    it('checkConfirmationPNR() shoul return confirmationPNR if it exists', () => {
        const mockPNR = 'A1B2C3';
        localStorageService.set('confirmationPNR', mockPNR);
        expect(AncillariesUtilsService.checkConfirmationPNR()).toBe(mockPNR);
        localStorageService.set('userLogged', true);
        expect(AncillariesUtilsService.checkConfirmationPNR()).toBe(mockPNR);
    });

    it('generateUpdateSeatsMap() should return the update array', () => {
        localStorageService.set('seatMapSegment', { segmentId: 'id1', pasId: 'ADULT_01' });
        const expectedValue = [
            {
                'type': 'SEAT',
                'segments': [
                    {
                        'id': 'id1',
                        'passengers': [
                            {
                                'id': 'ID',
                                'seat': {
                                    'row': 4,
                                    'column': 3
                                }
                            }
                        ]
                    }
                ]
            }
        ];
        expect(AncillariesUtilsService.generateUpdateSeatsMap(mockSeats)).toEqual(expectedValue);
    });

    it('updateSeatCachedInformation()', () => {
        const update = [
            {
                'type': 'SEAT',
                'segments': [
                    {
                        'id': 'id1',
                        'passengers': [
                            {
                                'id': 'ID',
                                'seat': {
                                    'row': 4,
                                    'column': 3
                                }
                            }
                        ]
                    }
                ]
            }
        ];
        localStorageService.set('bookingInfo', mockBookingInfo);
        AncillariesUtilsService.updateSeatCachedInformation(update, 'id2');
        const newInfo = localStorageService.get('bookingInfo');
        expect(newInfo.order.orderItems[0].column).toBe(update[0].segments[0].passengers[0].seat.column);
        expect(newInfo.order.orderItems[0].row).toBe(update[0].segments[0].passengers[0].seat.row);
    });

    it('getCabinClassName() should return the cabin class', () => {
        expect(AncillariesUtilsService.getCabinClassName('ECONOMY')).toBe('CABIN_TOURIST');
        expect(AncillariesUtilsService.getCabinClassName('BUSINESS')).toBe('CABIN_BUSINESS');
        expect(AncillariesUtilsService.getCabinClassName('BUSINESS_PLUS')).toBe('CABIN_BUSINESS');
        expect(AncillariesUtilsService.getCabinClassName('BUSINESS_CLUB')).toBe('CABIN_BUSINESS');
        expect(AncillariesUtilsService.getCabinClassName('BUSINESS_CLASS')).toBe('CABIN_BUSINESS');
        expect(AncillariesUtilsService.getCabinClassName('PREMIUMTOURIST')).toBe('CABIN_PREMIUM_TOURIST');
        expect(AncillariesUtilsService.getCabinClassName('')).toBe('CABIN_TOURIST');
    });

    it('isResolutionToMobile() should return true or false depending on window innerWidth', () => {
        testWindow.innerWidth = 700;
        expect(AncillariesUtilsService.isResolutionToMobile()).toBe(true);
        testWindow.innerWidth = 1000;
        expect(AncillariesUtilsService.isResolutionToMobile()).toBe(false);
    });

    it('isUserLogged() should return true or false depending on the localStorage value', () => {
        localStorageService.set('userLogged', true);
        expect(AncillariesUtilsService.isUserLogged()).toBe(true);
        localStorageService.set('userLogged', false);
        expect(AncillariesUtilsService.isUserLogged()).toBe(false);
    });

    it('validatedFlightAviosInfo() should return true or false depending on the localStorage value', () => {
        localStorageService.set('flightAviosInfo', []);
        expect(AncillariesUtilsService.validatedFlightAviosInfo()).toBe(true);
        localStorageService.remove('flightAviosInfo');
        expect(AncillariesUtilsService.validatedFlightAviosInfo()).toBe(false);
    });

    it('getBookingSegmentInformation() must call to getBookingSegmentInformation', () => {
        AncillariesUtilsService.getBookingSegmentInformation();
        expect(fakeAncillariesUtilsTransformer.getBookingSegmentInformation).toHaveBeenCalled();
    });
    it('generateAncillariesHeaderInfo() must call to generateAncillariesHeaderInfo', () => {
        AncillariesUtilsService.generateAncillariesHeaderInfo('testA', 'testB');
        expect(fakeAncillariesUtilsTransformer.generateAncillariesHeaderInfo).toHaveBeenCalledWith('testA', 'testB');
    });
});