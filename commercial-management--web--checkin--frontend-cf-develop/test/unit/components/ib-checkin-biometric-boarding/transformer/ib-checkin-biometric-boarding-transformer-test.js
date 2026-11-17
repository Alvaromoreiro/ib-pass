import dayjs from 'dayjs';

describe('BiometricBoardingTransformer Test', function() {

    var BiometricTransformer, returnedData, mockAllowedDocumentsResponse, localStorageService;

    var mockBoardingCardInfo = {
        'boardingCards':[{
            'passengers':
                [{
                    'id': '3',
                    'name': 'POPEYE',
                    'surname': 'MARINOESPINACAS',
                    'group': null,
                    'ticketNumber': '0752393615170',
                    'barcode': 'iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQAAAACFI5MzAAACNklEQVR42u2YS44kMQhELXEtS746EtdCYoiALnUvZhe9mkmpMrP8FmAq+LhO/e06/xDxc6yi/EXgE1HBJTWJqsjn99x78Xj5sKQnbm3az7UxX0166VdI5XmkvOz3iA+BE7j/CkH4mpRbPzqiVd9irSOQQ/y8vmlHR3D5q7wjyFaKfcsFHXHrGLYUz0YUIcVe1QR3v5bQxrkPX/v9yUk/kE1wwxxiZy6bnASSKu9ekEhr8pWcFMpEi/zaFCTHbvPpCfTRRqcgMartj8kJsskSBalYkNqDzWA1aQSAn/AYfLHiTrUkDZYZzTQk70vktJ7AoKFN5GH2tnVfxSsJF85DMNEC4cIqXktii1GXCiYZIzu5ICVMXmgitiLltHg96S3mnY6BJH5Qo8kJC1Ar8L5p6L5PNWE+BfSxHrT1rRRSshFEIrcfEDsjKycw22/JQvTY/BJRlZOCRcwO0Dk3zdFLTZyWsVH4gAd+xZKTVjzKA9UO295tyqbyaUlnriXb0U6QDTgJaUkvoHzPcE/Ff1VYLYELMZO9j0R6m9uDlaQXuyuhrBbCOfPWKERL2h7rBLWP6PLsIie1Jy60v3t3OJ5eIiVQwwiEE1d3jPFHTfDWIWVR4omFE7LJSXGvSGJWWGiyvmKgJM7xB5Mj6mpw9orPyUhHoqabH3YMDCqfjqElzn7OE8vBsGKfXiInNfp4U/N8Fa8nyCrcfWcii9ITdiMekfe8EjtBasmckIuHrz1QdpE1Ofn/X9ofwSfNghY2LM8AAAAASUVORK5CYII=',
                    'barcodeContent': 'M1MARINOESPINACAS/POPEEHRQEG  MADOVDIB 0480 112V018C1004 14B>518 WM1103BIB              2A0752393615170 2                              ',
                    'boardingNumber': '1004',
                    'cabinClass': {
                        'code': 'V',
                        'type': 'ECONOMY',
                        'description': 'Turista'
                    },
                    'observations': [],
                    'boardingBaggage': null,
                    'frequentFlyer': null,
                    'seat': {
                        'row': '18',
                        'column': 'C'
                    },
                    'extraSeat': null,
                    'bagTags': null,
                    'fastTrack': false,
                    'vip': false,
                    'standby': false,
                    'type': 'ADULT',
                    'contentType': 'PLAIN'
                }]
        }]
    };

    var mockPassengerInformation = {
        'name': 'MARIANO',
        'surname': 'TOLEDOCASADO',
        'expirationDate': '19/08/2025',
        'boardingCard': [{'barcodeContent': 'test'}],
        'documentNumber': '05225949L',
        'documentType': 'DNI',
        'documentEmissionCountry':'ESP',
        'flightCompany': '',
        'flightNumber': '',
        'flightOrigin':'MAD',
        'flightDestination': 'OVD',
        'flightTime': '23/06/2020',
        'email': 'test@test.com',
        'coupon': '',
        'ticketNumber': ''
    };

    var fakeContentPreprocessorService =  {
        'processContent': jasmine.createSpy('processContent').and.callFake(function () { }),
    }

    var fakeConfig = {
        'PASSENGERS_TYPES': {
            'ADULT': 'ADULT',
            'CHILD': 'CHILD',
            'INFANT': 'INFANT'
        },
        'DOCUMENT_TYPES': {
            'DNI': '',
            'PASSPORT' : ''
        }
    };

    var fakeDocumentsResponse = {
        documents : [{countries : [{madrid: 'madrid'}], type: {type: '', description: ''}}]
    };
    var fakegdprData = {};
    var mockBookingInfo = {
        'checkinId': 'Q2hlY2tpbkBJTlRFUk5FVF9XRUJfSUJFUklBX2liZXJpYV93ZWJfUDEzMTk2M18xMy8wNC8yMDIxIDEyOjUzOjUzXzk4MzlfSUJDT00wNDFuV0VCMDNfOTA5MF92Mw%3D%3D',
        'resiberLocator': 'HRQEG',
        'gdsLocator': 'HRQEG',
        'checkinFlowMode': 'REGULAR',
        'passengers': [
            {
                'id': 1,
                'name': 'NINO',
                'surname': 'MARINO',
                'title': null,
                'gender': null,
                'type': 'CHILD',
                'frequentFlyer': null,
                'resident': false,
                'requiredInformation': [],
                'optionalInformation': [
                    'CONTACT_DATA',
                    'EMERGENCY_DATA',
                    'FREQUENT_FLYER'
                ],
                'status': {
                    'code': 'ALLOWED',
                    'reason': null
                },
                'infant': null,
                'pendingPayment': false
            },
            {
                'id': 2,
                'name': 'OLIVIA',
                'surname': 'MARINO',
                'title': null,
                'gender': null,
                'type': 'ADULT',
                'frequentFlyer': null,
                'resident': false,
                'requiredInformation': [],
                'optionalInformation': [
                    'CONTACT_DATA',
                    'EMERGENCY_DATA',
                    'FREQUENT_FLYER'
                ],
                'status': {
                    'code': 'ALLOWED',
                    'reason': null
                },
                'infant': null,
                'pendingPayment': false
            },
            {
                'id': 3,
                'name': 'POPEYE',
                'surname': 'MARINOESPINACAS',
                'title': null,
                'gender': null,
                'type': 'ADULT',
                'frequentFlyer': null,
                'resident': false,
                'requiredInformation': [],
                'optionalInformation': [
                    'CONTACT_DATA',
                    'EMERGENCY_DATA',
                    'FREQUENT_FLYER'
                ],
                'status': {
                    'code': 'ALLOWED',
                    'reason': null
                },
                'infant': null,
                'pendingPayment': false
            }
        ],
        'checkinSegmentsInGroup': [
            4
        ],
        'outwardSegments': [
            {
                'id': 4,
                'departure': {
                    'date': '2021-04-22 20:00',
                    'utcDate': '2021-04-22 18:00',
                    'airport': {
                        'code': 'MAD',
                        'description': 'BARAJAS',
                        'country': 'ES'
                    },
                    'terminal': '4'
                },
                'arrival': {
                    'date': '2021-04-22 21:10',
                    'utcDate': '2021-04-22 19:10',
                    'airport': {
                        'code': 'OVD',
                        'description': 'ASTURIAS',
                        'country': 'ES'
                    },
                    'terminal': null
                },
                'boarding': null,
                'passengers': [
                    {
                        'id': 1,
                        'seat': {
                            'row': '17',
                            'column': 'B'
                        },
                        'altLocator': null,
                        'noShow': false,
                        'flyNow': false,
                        'status': {
                            'code': 'CHECKED',
                            'message': null
                        },
                        'mmbAvailable': false,
                        'ticket': {
                            'number': '0752393615172',
                            'coupon': '1',
                            'issueDate': null,
                            'expiryDate': null,
                            'status': null
                        },
                        'infantTicket': null,
                        'farebasis': 'VZNOB4/CH',
                        'items': []
                    },
                    {
                        'id': 2,
                        'seat': {
                            'row': '17',
                            'column': 'A'
                        },
                        'altLocator': null,
                        'noShow': false,
                        'flyNow': false,
                        'status': {
                            'code': 'CHECKED',
                            'message': null
                        },
                        'mmbAvailable': false,
                        'ticket': {
                            'number': '0752393615171',
                            'coupon': '1',
                            'issueDate': null,
                            'expiryDate': null,
                            'status': null
                        },
                        'infantTicket': null,
                        'farebasis': 'VZNOB4',
                        'items': []
                    },
                    {
                        'id': 3,
                        'seat': {
                            'row': '18',
                            'column': 'C'
                        },
                        'altLocator': null,
                        'noShow': false,
                        'flyNow': false,
                        'status': {
                            'code': 'CHECKED',
                            'message': null
                        },
                        'mmbAvailable': false,
                        'ticket': {
                            'number': '0752393615170',
                            'coupon': '1',
                            'issueDate': null,
                            'expiryDate': null,
                            'status': null
                        },
                        'infantTicket': null,
                        'farebasis': 'VZNOB4',
                        'items': []
                    }
                ],
                'operatingFlightNumber': {
                    'company': {
                        'code': 'IB',
                        'description': 'Iberia'
                    },
                    'number': '0480'
                },
                'marketingFlightNumber': null,
                'cabinClass': {
                    'code': 'V',
                    'type': 'ECONOMY',
                    'description': 'Turista',
                    'fareFamily': null,
                    'mainClass': 'Y'
                },
                'estimatedFlightTime': '01:10:00',
                'typeOfTransport': 'FLIGHT',
                'flown': false,
                'aircraft': {
                    'model': '32A',
                    'cabins': [
                        'BUSINESS',
                        'ECONOMY'
                    ]
                }
            }
        ],
        'returnSegments': [],
        'airShuttleSegments': [],
        'deepLinkInformation': null,
        'carrierConnectEnabled': false,
        'relatedContent': []
    };
    var mockBiometricModel = {
        'name': 'OLIVIA',
        'surname': 'MARINO',
        'expirationDate': '',
        'boardingCard': '',
        'documentEmissionCountry': 'ESP',
        'documentNumber': '44144222T',
        'documentType': {
            'type': 'DNI',
            'description': 'Dni'
        },
        'flightCompany': '',
        'flightNumber': '',
        'flightOrigin': '',
        'flightDestination': '',
        'flightTime': '',
        'email': 'test@test.es',
        'data': {
            'name': 'Popeye',
            'surname': 'Marino',
            'expirationDate': '06/11/2024 23:00'
        },
        'status': 200
    };

    beforeEach(function(){
        angular.mock.module('ib-checkin-biometric-boarding-module','LocalStorageModule', function($provide){
            $provide.value('ContentPreprocessorService', fakeContentPreprocessorService);
            $provide.value('CheckinAppConstants', fakeConfig);
        });
        inject(function(_BiometricTransformer_, _localStorageService_){
            BiometricTransformer = _BiometricTransformer_;
            localStorageService = _localStorageService_;
        });

    });


    describe('When transformInitServiceResponse is called with documents',function(){
        it('',function(done){
            localStorageService.remove('customerData');
            BiometricTransformer.transformInitServiceResponse(fakeDocumentsResponse, fakegdprData );
            done();
        });
    });

    describe('When transformInitServiceResponse is called without documents',function(){
        it('',function(done){
            localStorageService.remove('customerData');
            BiometricTransformer.transformInitServiceResponse({documents : []}, fakegdprData );
            done();
        });
    });

    describe('When transformInitServiceResponse is called without documents with costumer data',function(){
        it('',function(done){
            localStorageService.set('customerData', {personalInfo : {contactEmail: ''}});
            BiometricTransformer.transformInitServiceResponse({documents : []}, fakegdprData );
            done();
        });
    });

    describe('When transformDataForGetBiometricalData is called',function(){
        it('', function (done) {
            localStorageService.set('biometricStatusPassengers', { passengersList: [{'biometricDocument': { 'type': '', 'number': '' }}] });
            BiometricTransformer.transformDataForGetBiometricalData();
            done();
        });
    });

    describe('When transformDataForGetBiometricalData is called witn customerData ',function(){
        it('',function(done){
            localStorageService.set('customerData', { personalInfo: { documentType: '04' } });
            localStorageService.set('biometricStatusPassengers', { passengersList: [{ 'biometricDocument': { 'type': '', 'number': '' } }] });
            BiometricTransformer.transformDataForGetBiometricalData();
            done();
        });
    });

    describe('When transformDataForGetBiometricalData is called witn customerData ',function(){
        it('',function(done){
            localStorageService.set('customerData', { personalInfo: { documentType: '03' } });
            localStorageService.set('biometricStatusPassengers', { passengersList: [{ 'biometricDocument': { 'type': '', 'number': '' } }] });
            BiometricTransformer.transformDataForGetBiometricalData();
            done();
        });
    });

    describe('When transformBiometricBoardingInfoRequest is called and should return the information', function(){
        it('must return the formed information', function(done){
            var returnedValue = BiometricTransformer.transformBiometricBoardingInfoRequest(mockPassengerInformation).associateBoardingCards[0];
            expect(returnedValue.documentNumber).toEqual(mockPassengerInformation.documentNumber);
            expect(returnedValue.documentType).toEqual(mockPassengerInformation.documentType);
            expect(returnedValue.documentEmissionCountry).toEqual(mockPassengerInformation.documentEmissionCountry);
            expect(returnedValue.email).toEqual(mockPassengerInformation.email);
            expect(returnedValue.boardingCards).toEqual(mockPassengerInformation.boardingCard.map(e => e.barcodeContent));
            done();
        });
    });
    describe('When transformAssociateBoardingCardRequest is called and should return the information', function(){
        beforeEach(function(){
            localStorageService.set('confirmationInfo', mockBoardingCardInfo);
            localStorageService.set('bookingInfo', mockBookingInfo);
            localStorageService.set('biometricModel', mockBiometricModel);
            //$provide.value('CheckinAppConstants', fakeConfig);
        });

        it('and boardingCardInfo is needed for passenger information', function(done){
            var parsedResponse = BiometricTransformer.transformAssociateBoardingCardRequest(mockPassengerInformation), boardingCard = localStorageService.get('confirmationInfo'), bookingInfo = localStorageService.get('bookingInfo');
            mockPassengerInformation.boardingCard = boardingCard.boardingCards[0].passengers[0].barcodeContent;
            //expect(parsedResponse.name).toEqual(mockPassengerInformation.name);
            //expect(parsedResponse.surname).toEqual(mockPassengerInformation.surname);
            expect(parsedResponse.expirationDate).toEqual(mockPassengerInformation.expirationDate);
            expect(parsedResponse.documentNumber).toEqual(mockPassengerInformation.documentNumber);
            expect(parsedResponse.documentType).toEqual(mockPassengerInformation.documentType);
            expect(parsedResponse.documentEmissionCountry).toEqual(mockPassengerInformation.documentEmissionCountry);
            expect(parsedResponse.flightCompany).toEqual('IB');
            expect(parsedResponse.flightNumber).toEqual('0480');
            expect(parsedResponse.flightOrigin).toEqual(mockPassengerInformation.flightOrigin);
            expect(parsedResponse.flightDestination).toEqual(mockPassengerInformation.flightDestination);
            //expect(parsedResponse.flightTime).toEqual(dayjs(mockPassengerInformation.flightTime,'DD/MM/YYYY').format('L'));
            expect(parsedResponse.email).toEqual(mockPassengerInformation.email);
            //expect(parsedResponse.boardingCard).toEqual(mockBoardingCardInfo.boardingCards[0].passengers[0].barcodeContent);
            done();
        });
    });

    describe('When transformFlightInfoPassengerResponse is called',function(){
        beforeEach(function(){
            localStorageService.set('confirmationInfo', mockBoardingCardInfo);
            //$provide.value('CheckinAppConstants', fakeConfig);
        });
        it('and everything is ok',function(done){

            var mockDataRequest = {
                flightTime: '15/03/2021',
                flightNumber: 'IB20014',
                flightCompany: 'IBERIA',
                flightOrigin: ' MAD',
                flightDestination: 'BNC'
            };

            var returnedData= BiometricTransformer.transformFlightInfoPassengerResponse(mockDataRequest);
            expect(returnedData.flightTime).toEqual(mockDataRequest.flightTime);
            expect(returnedData.flightNumber).toEqual(mockDataRequest.flightNumber);
            expect(returnedData.flightCompany).toEqual(mockDataRequest.flightCompany);
            done();
        });
    });

    describe('When transformFlightInfoPassengerRequest is called',function(){
        it('and everything is ok',function(done){
            var mockDataResponse = {
                name: 'a',
                surname: 'b',
                expirationDate:'15/03/2021',
            };

            var returnedData= BiometricTransformer.transformFlightInfoPassengerRequest(mockDataResponse);
            expect(returnedData.name).toEqual(mockDataResponse.name);
            expect(returnedData.surname).toEqual(mockDataResponse.surname);
            expect(returnedData.expirationDate).toEqual(mockDataResponse.expirationDate);
            done();
        });
    });

    describe('When transformBiometricDataResponse is called',function(){
        it('and everything is ok',function(done){

            var mockDataResponse = {
                'name': 'a',
                'surname': 'b',
                'expirationDate': '06/23/2020'
            };

            var returnedData= BiometricTransformer.transformBiometricDataResponse(mockDataResponse);
            expect(returnedData.name).toEqual(mockDataResponse.name);
            expect(returnedData.surname).toEqual(mockDataResponse.surname);
            expect(returnedData.expirationDate).toEqual(mockDataResponse.expirationDate);

            done();
        });
    });

});
