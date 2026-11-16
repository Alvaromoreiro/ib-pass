// Transformador no utilizado en el proyecto
describe('MmBCommunicationLostTransformer test', () => {
    let communicationLostTransformer;

    let fakeMmBUtilService = {
        'getCommunicationsLostInfo': jasmine.createSpy('getCommunicationsLostInfo').and.callFake(() => {
            return {}
        }),
        'getRelatedContent': jasmine.createSpy('getRelatedContent').and.callFake(() => {
            return {}
        })
    };

    let formatDate = [
        {
            'code': 'es',
            'dateFormat': {
                'fullDate': 'EEEE, D "de" MMMM "de" Y',
                'longDate': 'D "de" MMMM "de" Y',
                'medium': 'D MMM Y H:mm:ss',
                'mediumDate': 'D MMM Y',
                'mediumTime': 'H:mm:ss',
                'short': 'D/M/YY H:mm',
                'shortDate': 'D/M/YY',
                'shortTime': 'H:mm'
            }
        }
    ];

    let fakeConfirmationInfoRelated = {relatedContent: {}}
    let fakeCreditCardTypes = {};

    let MockMmBAppConstants = {
        'iconsRoute': 'iconRoute',
        'airlinesLogoBaseRoute': 'airLogoRoute',
        'defaultAirlineLogo': 'defaulturl',
        'FORMAT_DATE': formatDate,
        'COOKIES': {
            'DYNAMIC_PRICING': true
        },
        'PASSENGER_TYPE': {
            'SENIOR': 'SENIOR',
            'ADULT': 'ADULT',
            'YOUTH': 'YOUTH',
            'TEENAGER': 'YOUNG',
            'YOUNG_ADULT': 'YOUNG_ADULT',
            'CHILD': 'CHILD',
            'INFANT': 'INFANT'
        },
        'ANCILLARIES_IMPORT_ORDER_TYPE': {
            'BAGGAGE' : 'BGA'
        },
        'ANCILLARIES_TYPES': {
            'BAGGAGE': 'BAGGAGE',
            'SEAT': 'SEAT',
            'INSURANCE': 'INSURANCE',
            'VEHICLE_RENTAL': 'VEHICLE_RENTAL',
            'UPGRADING': 'UPGRADING',
            'SPEQS': 'SPECIAL_EQUIPMENT',
            'SPECIAL_MEALS': 'SPECIAL_MEALS',
            'UPGRADING_BID': 'UPGRADING_BID'
        },
        'SEAT_FEATURE': {
            'EMERGENCY_EXIT': 'EMERGENCY_EXIT',
            'EXTRA_SIZE': 'EXTRA_SIZE',
            'EMERGENCY_WINDOW': 'WINDOW',
            'WING': 'WING',
            'SCREEN': 'ENTERTAINMENT_SCREEN',
            'NON_RECLINING': 'NON_RECLINING',
            'INFANT': 'PASSENGER_WITH_INFANT',
            'MOBILITY': 'RESTRICTED_MOBILITY',
            'WC': 'WC',
            'GALLEY': 'GALLEY',
            'PROMO': 'PROMO',
            'UPFRONT': 'UPFRONT',
            'AISLE': 'AISLE'
        },
        'ACCOUNT_TYPES': {
            'REWARD': 'R',
            'LOAN': 'L'
        },
        'DESTINATION_IMAGE_SIZE': {
            'desktop': '1024',
            'tablet': '768',
            'mobile': '320'
        },
        'ORDER_STATUS_VALUES': {
            'CANCELATION_FLAG': 'UNCONFIRMED_CHANGES',
            'CANCELATION_REACOM_FLAG': 'ACCEPT_CHANGES_PENDING'
        },
        'QUADRIGAM': {
            'SEARCH': 'CHKTRP',
            'LOGGED_SEARCH': 'MYTRPS',
        },
        'OH_FLIGHT_TYPES' : {
            'MULTITRIP': 'multiCityFlight'
        },
        'PAYMENT_TYPES': {
            CREDIT_CARD: 'CREDIT_CARD',
            AVIOS: 'AVIOS',
            VOUCHER: 'VOUCHER'
        },
        'UN_UNTK_QUADRIGAMS': ['test']
    };

    let fakeConfirmationInfo = {
        contextMetadata: {currencies: ['EUR']}, 
        order: {
            bookingReferences: [{reference: 'test'}], 
            price: {currency: 'EUR'}, 
            orderItems: [
                {type: 'baggage', sliceId: '1234', segmentId: '1234'},
                {type: 'seat', sliceId: '1234', segmentId: '1234', row: 10, column: 'A'}
            ],
            slices: [{
                sliceId: '1234', 
                segments: [{
                    id: '1234', 
                    departure: {
                        city: { description: 'MAD'}
                    }, 
                    arrival: {
                        city: {description: 'BIO'}
                    }
                }]
            }]
        }, 
        paymentMethod: {cardNumber: '1234', cardTypeId: 'CC'}, 
        paymentItems:[
            {
                type: MockMmBAppConstants.PAYMENT_TYPES.CREDIT_CARD, 
                total: 200, 
                authorization: 'authorization'
            }
        ]
    };

    let fakeCurrencyService = {
        'formatPrice': jasmine.createSpy('formatPrice').and.returnValue('10€'),
        'getCurrencyObject': jasmine.createSpy('getCurrencyObject').and.callFake(() => {
            return { 'code': 'EUR', 'numberDecimals': 2, 'aviosTransformed': '100' }
        }),
        'formatAvios': jasmine.createSpy('formatAvios'),
        'getCurrenciesAsMap': jasmine.createSpy('getCurrenciesAsMap').and.returnValue({description: 'EUR'}),
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-communication-lost-module', function ($provide) {
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('MmBAppConstants', MockMmBAppConstants);
        });
        inject((_MmBCommunicationLostTransformer_) => {
            communicationLostTransformer = _MmBCommunicationLostTransformer_;
        });
    });

    describe('generateCommunicationLostInfo()', () => {
        it('When generates the communication lost info calling to transformer', (done) => {
            let result = communicationLostTransformer.generateCommunicationLostInfo(fakeConfirmationInfo, fakeCreditCardTypes);
            expect(result).toBeDefined();
            done();
        });
        it('When generates the communication lost info calling to transformer', (done) => {
            let result = communicationLostTransformer.generateCommunicationLostInfo(fakeConfirmationInfoRelated, fakeCreditCardTypes);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('When getCommunicationsLostInfo() is called', () => {
        it('Should return credit card method', (done) => {
            let result, expected;
            let mockConfirmationInfo = {...fakeConfirmationInfo};
            mockConfirmationInfo.paymentItems[0].type = MockMmBAppConstants.PAYMENT_TYPES.CREDIT_CARD;
            result = communicationLostTransformer.getCommunicationsLostInfo(fakeConfirmationInfo, [{cardTypeId: 'CC', description: 'Credit Card'}]);
            expected = {
                currency: undefined,
                pnr: 'test',
                paymentItems: {
                    CREDIT_CARD: { total: '10€', authorization: 'authorization', creditCardNumber: '1234', cardDescription: 'Credit Card' },
                },
                ancillaries: { 
                    BAGGAGES: { title: 'SUMMARY_ANCILLARIES_BAGGAGE_TITLE', info: { 1234: { baggages: 1, trip: '(MAD-BIO)' } }, viewInfo: { text: '1 (MAD-BIO)', quantity: 1 } },
                    SEATS: { title: 'SUMMARY_ANCILLARIES_SEATS_TITLE', info: { 1234: { seats: '10A', trip: '(MAD-BIO)' } }, viewInfo: { text: '10A (MAD-BIO)' } }
                },
                aviosRedeemed: {}
            };
            expect(result).toEqual(expected);
            done();
        });

        it('Should return AVIOS method', (done) => {
            let result, expected;
            let mockConfirmationInfo = {...fakeConfirmationInfo};
            mockConfirmationInfo.paymentItems[0].type = MockMmBAppConstants.PAYMENT_TYPES.AVIOS;
            result = communicationLostTransformer.getCommunicationsLostInfo(mockConfirmationInfo, []);
            expected = {
                currency: undefined,
                pnr: 'test',
                paymentItems: {
                    AVIOS: { dicount: '-10€', authorization: 'authorization', aviosRedeemed: undefined }
                },
                ancillaries: { 
                    BAGGAGES: { title: 'SUMMARY_ANCILLARIES_BAGGAGE_TITLE', info: { 1234: { baggages: 1, trip: '(MAD-BIO)' } }, viewInfo: { text: '1 (MAD-BIO)', quantity: 1 } },
                    SEATS: { title: 'SUMMARY_ANCILLARIES_SEATS_TITLE', info: { 1234: { seats: '10A', trip: '(MAD-BIO)' } }, viewInfo: { text: '10A (MAD-BIO)' } }
                },
                aviosRedeemed: undefined,
            };
            expect(result).toEqual(expected);
            done();
        });
        it('Should return VOUCHER method', (done) => {
            let result, expected;
            let mockConfirmationInfo = {...fakeConfirmationInfo};
            mockConfirmationInfo.paymentItems[0].type = MockMmBAppConstants.PAYMENT_TYPES.VOUCHER;
            result = communicationLostTransformer.getCommunicationsLostInfo(mockConfirmationInfo, []);
            expected = {
                currency: undefined,
                pnr: 'test',
                paymentItems: {
                    VOUCHER: { dicount: '-10€', authorization: 'authorization'}
                },
                ancillaries: { 
                    BAGGAGES: { title: 'SUMMARY_ANCILLARIES_BAGGAGE_TITLE', info: { 1234: { baggages: 1, trip: '(MAD-BIO)' } }, viewInfo: { text: '1 (MAD-BIO)', quantity: 1 } },
                    SEATS: { title: 'SUMMARY_ANCILLARIES_SEATS_TITLE', info: { 1234: { seats: '10A', trip: '(MAD-BIO)' } }, viewInfo: { text: '10A (MAD-BIO)' } }
                },
                aviosRedeemed: { },
            };
            expect(result).toEqual(expected);
            done();
        });
        
    }); 
});
