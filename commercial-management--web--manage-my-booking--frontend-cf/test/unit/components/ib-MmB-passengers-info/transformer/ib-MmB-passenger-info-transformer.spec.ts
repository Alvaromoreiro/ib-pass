describe('PassengersInfotransformer test', () => {

    let PassengersInfoTransformer, scope, localStorageService, controller;
    let mockPassengersInfo = {
        'passengerId': 1, 'frequentFlyerInfo': { 'company': 'AB', 'number': '123123124' }
    };

    let fakePassengersInfoConstants = {
        'PHONE_TYPE': 'MOBILE',
        'STATUS_COMPLETE': 'COMPLETE',
        'STATUS_INCOMPLETE': 'INCOMPLETE',
        'DEFAULT_COMPANY_CODE': 'CKI_COMBO_BLANK',
        'DATA_CONTACT_TAB': 1,
        'PASSENGER_INFANT': 'INFANT',
    }

    let fakeFrequentlyFlyers = [
        { 'iataCompanyCode': 'IB', 'airlineName': 'Iberia' },
        { 'iataCompanyCode': 'AB', 'airlineName': 'Air Berlin' }
    ];


    let fakePassengers = [
        { 'passengerType': 'ADULT', 'personalInfo': { 'name': 'MANEL', 'surname': 'ARENASGARCIA', 'birthDate': null }, 'passengerId': '1', 'ckiStatus': 'UNCHECKABLE', 'optionalInformation': ['CONTACT_DATA', 'FF'] },
        { 'passengerType': 'INFANT', 'relatedPassengerId': '1', 'personalInfo': { 'name': 'BUEN', 'surname': 'REBESWEINDL', 'birthDate': null }, 'passengerId': '2', 'ckiStatus': 'UNCHECKABLE', 'optionalInformation': ['CONTACT_DATA', 'FF'] },
        { 'passengerType': 'INFANT', 'relatedPassengerId': null, 'personalInfo': { 'name': 'BUEN', 'surname': 'REBESWEINDL', 'birthDate': null }, 'passengerId': '3', 'ckiStatus': 'UNCHECKABLE', 'optionalInformation': ['CONTACT_DATA', 'FF']},
        { 'passengerType': 'CHILD', 'personalInfo': { 'name': 'TERCER', 'surname': 'HIJO', 'birthDate': null }, 'passengerId': '4', 'ckiStatus': 'UNCHECKABLE', 'optionalInformation': {'contactData': true}, 'specialNeed': {description: 'test '}  }

    ];

    let fakeBookingInfo = {
        'flowId': 'CHECKID4',
        'order': {
            'orderId': 'ORDER_ID_FIRST',
            'status': 'ISSUED',
            'bookingReferences': [
                {
                    'provider': '1A',
                    'reference': 'KU75XE'
                }
            ],
            'orderItems': [
                {
                    'type': 'flight',
                    'orderItemId': '71d7129a7a834e0eb15e003d465e00ec_01',
                    'bookingReferences': [{
                        'provider': 'IB',
                        'reference': 'ABCDE'
                    }],
                    'sliceIds': ['SHUTTLE']
                },
                {
                    'type': 'specialNeed',
                    'orderItemId': '71d7129a7a834e0eb15e003d465e00ec_04',
                    'passengerId': '1',
                    'description': 'Descripción de special need del pasajero 1',
                    'status': 'NN'
                },
                {
                    'type': 'specialNeed',
                    'orderItemId': '71d7129a7a834e0eb15e003d465e00ec_04',
                    'passengerId': '4',
                    'description': 'Descripción de special need del pasajero 4',
                    'status': 'NN'
                }
            ]
        },
        'passengers': [
            {
                'passengerType': 'ADULT',
                'personalInfo': {
                    'name': 'MANEL',
                    'surname': 'ARENASGARCIA',
                    'birthDate': null
                },
                'passengerId': '1',
                'ckiStatus': 'UNCHECKABLE'
            },
            {
                'passengerType': 'INFANT',
                'relatedPassengerId': '1',
                'personalInfo': {
                    'name': 'BUEN',
                    'surname': 'REBESWEINDL',
                    'birthDate': null
                },
                'passengerId': '2',
                'ckiStatus': 'UNCHECKABLE'
            },
        ],
        'tickets': [
            {
                'ticketNumbers': [
                    '075-1220361286'
                ],
                'type': 'ET',
                'orderItemId': '',
                'passengerId': '2',
                'issueDateTime': '2017-04-20 00:00'
            },
            {
                'ticketNumbers': [
                    '075-1220361285'
                ],
                'type': 'ET',
                'orderItemId': '',
                'passengerId': '1',
                'issueDateTime': '2017-04-20 00:00'
            },
        ]
    }


    let fakeDataContactInfo = {
        'passengersContactInfo': [
            {
                'passengerType': 'ADULT',
                'contactInfo': { 'email': 'patata@patata.es', 'phone': '112112113', 'phoneType': 'MOBILE' },
                'passengerId': '1',
                'frequentFlyerInfo': 'CKI_COMBO_BLANK'
            }, {
                'passengerType': 'INFANT',
                'contactInfo': { 'email': 'mini@patata.es', 'phone': '112112115', 'phoneType': 'MOBILE' },
                'passengerId': '2',
                'frequentFlyerInfo': 'CKI_COMBO_BLANK'
            }
        ],
        'primaryContactInfo': {
            'email': 'mini@patata.es', 'phone': '112112114', 'phoneType': 'MOBILE'
        }
    };




    let fakePassengerformData = {
        'passengersContactInfo': [
            {
                'passengerType': 'ADULT',
                'contactInfo': { 'email': 'tete@patata.es', 'phone': '112112113', 'phoneType': 'MOBILE' },
                'passengerId': '1',
                'frequentFlyerInfo': 'CKI_COMBO_BLANK'
            }, {
                'passengerType': 'INFANT',
                'contactInfo': { 'email': 'seee@patata.es', 'phone': '112112114', 'phoneType': 'MOBILE' },
                'passengerId': '2',
                'frequentFlyerInfo': 'CKI_COMBO_BLANK'
            }
        ],
        'primaryContactInfo': {
            'email': 'eeee@patata.es', 'phone': '33322112', 'phoneType': 'MOBILE'
        }
    };

    let fakeOriginalInfo = {
        'passengersContactInfo': [
            {
                'passengerType': 'ADULT',
                'contactInfo': { 'email': 'patata@patata.es', 'phone': '112112113', 'phoneType': 'MOBILE' },
                'passengerId': '1',
                'frequentFlyerInfo': 'CKI_COMBO_BLANK'
            }, {
                'passengerType': 'INFANT',
                'contactInfo': { 'email': 'mini@patata.es', 'phone': '112112115', 'phoneType': 'MOBILE' },
                'passengerId': '2',
                'frequentFlyerInfo': 'CKI_COMBO_BLANK'
            }
        ],
        'primaryContactInfo': {
            'email': 'mini@patata.es', 'phone': '112112114', 'phoneType': 'MOBILE'
        }
    };

    let fakePassengerformDataEmpty = {
        'passengersContactInfo': [],
        'primaryContactInfo': {
            'email': 'eeee@patata.es', 'phone': '33322112', 'phoneType': 'MOBILE'
        }
    };

    let fakePassengerformDataEmpty2 = {
        'passengersContactInfo': [],
        'primaryContactInfo': null
    };


    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-passengers-info-module', ($provide) => {
            $provide.value('PassengersInfoConstants', fakePassengersInfoConstants)
            $provide.value('MmBAppConstants', { 'PASSENGER_TYPES': { 'infant': 'INFANT' } });
        });

        inject((_PassengersInfoTransformer_, _localStorageService_) => {
            PassengersInfoTransformer = _PassengersInfoTransformer_;
            localStorageService = _localStorageService_;
        });
    });

    describe('when transformUpdatePassengerInfoData is called', () => {
        it('and have ffInfo and id of passenger ', (done) => {
            let returnedValue = PassengersInfoTransformer.transformUpdatePassengerInfoData(mockPassengersInfo);
            expect(returnedValue.passengersContactInfo[0].passengerId).toEqual(1);
            expect(returnedValue.passengersContactInfo[0].ffInfo.company).toEqual('AB');
            done();
        });
    });


    describe('when transformPassengerInfoData  is called', () => {
        it('should return transformed', (done) => {
            let returnedValue;
            localStorageService.set('frequentFlyersCompanies', fakeFrequentlyFlyers);
            localStorageService.set('passengers', fakePassengers);
            localStorageService.set('selectedPassengerId', {passengerId: 1});
            localStorageService.set('bookingInfo', fakeBookingInfo);
            returnedValue = PassengersInfoTransformer.transformPassengerInfoData();
            expect(returnedValue.passengersContactInfo[0].personalInfo.name).toEqual('MANEL');
            expect(returnedValue.passengersContactInfo[1].parent_info.tickets).toEqual('075-1220361285');
            done();
        });

        it('should return transformed else cases', (done) => {
            let returnedValue;
            let fakeBookingInfoCopy = {...fakeBookingInfo};
            fakeBookingInfo.tickets[0].ticketNumbers = [];
            localStorageService.set('frequentFlyersCompanies', fakeFrequentlyFlyers);
            localStorageService.set('passengers', fakePassengers);
            localStorageService.set('selectedPassengerId', 0);
            localStorageService.set('bookingInfo', fakeBookingInfoCopy);

            returnedValue = PassengersInfoTransformer.transformPassengerInfoData();
            expect(returnedValue.passengersContactInfo[0].personalInfo.name).toEqual('MANEL');
            expect(returnedValue.passengersContactInfo[1].parent_info.tickets).toEqual('075-1220361285');
            done();
        });
    });


    describe('when transformUpdateDataContactData  is called', () => {
        let returnedValue;
        it('and value one and value two are diferent and have primaryContactInfo ', (done) => {
            returnedValue = PassengersInfoTransformer.transformUpdateDataContactData(fakePassengerformData, fakeOriginalInfo);
            expect(returnedValue.primaryContactInfo).toEqual({ phone: '33322112', phoneType: 'MOBILE', email: 'eeee@patata.es', phoneDetails: { countryCode: undefined, number: undefined } });
            expect(returnedValue.passengersContactInfo[0].contactInfo.phone).toEqual('112112113');
            expect(returnedValue.passengersContactInfo[0].contactInfo.phoneType).toEqual('MOBILE');
            done();
        });

        it('and value one and value two are diferent and haven´t passengersContactInfo ', (done) => {
            returnedValue = PassengersInfoTransformer.transformUpdateDataContactData(fakePassengerformDataEmpty, fakeOriginalInfo);
            expect(returnedValue.primaryContactInfo).toEqual({ phone: '33322112', phoneType: 'MOBILE', email: 'eeee@patata.es', phoneDetails: { countryCode: undefined, number: undefined } });
            done();
        });

        it('and generateContactInfo empty contactData', (done) => {
            returnedValue = PassengersInfoTransformer.transformUpdateDataContactData(fakePassengerformDataEmpty2, fakeOriginalInfo);
            expect(returnedValue).toEqual({});
            done();
        });
    });

    describe('when updatePassengerData is called', () => {
        it('and have primaryContactInfo', (done) => {
            localStorageService.set('bookingInfo', fakeBookingInfo);
            PassengersInfoTransformer.updatePassengerData(fakeDataContactInfo);
            expect(localStorageService.get('bookingInfo').passengers[0].contactInfo.email).toEqual('patata@patata.es');
            expect(localStorageService.get('bookingInfo').passengers[0].frequentFlyerInfo).toEqual('CKI_COMBO_BLANK');
            done();
        });

        it('and don´t have primaryContactInfo', (done) => {
            let fakeDataContact = angular.copy(fakeDataContactInfo);
            fakeDataContact.primaryContactInfo = null;
            localStorageService.set('bookingInfo', fakeBookingInfo);
            PassengersInfoTransformer.updatePassengerData(fakeDataContact);
            expect(localStorageService.get('bookingInfo').passengers[0].contactInfo.email).toEqual('patata@patata.es');
            expect(localStorageService.get('bookingInfo').primaryContactInfo).toBe(undefined);
            done();
        });
    });
});
