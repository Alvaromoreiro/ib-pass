describe('FlightsPassengerDesController test', function () {
    let $scope, $rootScope, $timeout, localStorageService, controller;

    let fakeFlightsDesInvoiceModel = {
        'mock': {
            'dataLayer': {
                'quadrigam': 'quadrigam'
            },
        },
        'initializeModel': jasmine.createSpy()
    };

    let fakeDeinvoicingService = {
        'mock': {
            'dataLayer': {
                'quadrigam': 'quadrigam'
            }
        }
    };
    let fakeIbAncillariesPaymentUtilsService = {
        getInfoHeader: jasmine.createSpy().and.callFake(function () {
            return { trips: true, loggedInfo: false };
        })
    };
    let fakeIbUtilsService = {
        getDeviceType: jasmine.createSpy(),
        setTitlePage: jasmine.createSpy('setTitlePage'),
        goIbCose: jasmine.createSpy('goIbCose')
    };
    let fakeModalService = {
        isWaiting: angular.noop,
        isNotWaiting: angular.noop,
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(function() {
            return { 'result': { 'then': angular.noop } };
        })
    };

    let mockSearchFlights = {
        'flightsPassengersInfo': {
            'activeFields': {
                'additionalInfoUseForAllCheck': {
                    'show': true,
                    'showId': 1,
                    'status': false
                },
                'emergencyDataUseForAllCheck': {
                    'show': true,
                    'showId': 1,
                    'status': false
                }
            },
            'allSegmentChecked': true,
            'checkinAvailable': true,
            'checkinSegmentsInGroup': {
                'info': 'MAD-BIO, BIO-MAD',
                'segments': [{
                    '0': 3,
                    '1': 4
                }]
            },
            'companies': [{
                '0': {
                    'airlineName': {
                        'description': 'CKI_COMBO_BLANK',
                        'needsTranslate': true
                    },
                    'iataCompanyCode': 'CKI_COMBO_BLANK'
                },
                '1': {
                    'airlineName': 'Iberia',
                    'iataCompanyCode': 'IB'
                }
            }],
            'dataLayer': {
                'datalayerBookingType': 'E',
                'isAirShuttle': false,
                'quadrigam': ''
            },
            'emergency': [],
            'gdprInfo': {
                'modals': [{
                    '0': {
                        'code': '1476373673799',
                        'elements': [{
                            '0': {
                                'description': '',
                                'items': [{},
                                ],
                                'subtitle': '',
                                'tittle': '',
                                'type': 'Accordion_C'
                            }
                        }]
                    }
                }],
                'text': 'TrustedValueHolderType',
                'onlyShuttleSegments': false
            },
            'passengers': [
                 {
                    'contactData': {
                        'available': true,
                        'denyNewsLetter': false,
                        'phone': {
                            'countryCode': '34'
                        },
                        'emergency': {
                            'phone': {
                                'countryCode': '34'
                            }
                        }
                    },
                    'fieldStatus': {
                        'contactData': {
                            'available': true,
                            'mandatory': false,
                            'show': true
                        },
                        'emergencyData': {
                            'available': true,
                            'mandatory': false,
                            'show': true
                        },
                        'frequentFlyer': {
                            'isOpenPA': false,
                            'mandatory': false,
                            'show': true
                        },
                        'gender': {
                            'mandatory': false,
                            'show': false
                        }
                    },
                    'frequentFlyer': {
                        'enabled': true,
                        'info': {
                            'number': '',
                            'iataCompanyCode': ''
                        }
                    },
                    'gender': 'MALE',
                    'id': 1,
                    'infant': null,
                    'inhibitBoardingCard': {
                        'reason': [],
                        'status': false,
                        'url': ''
                    },
                    'initialData': {
                        'contact': {
                            'gender': 'MALE',
                            'phone': {
                                'countryCode': '34',
                                'number': '125215222'
                            },
                            'email': 'AS@AS.ES',
                            'frequentFlyer': {
                                'info': {
                                    'number': '',
                                    'iataCompanyCode': ''
                                },
                                'enabled': true
                            }
                        },
                        'emergency': {
                            'phone': {
                                'countryCode': '34'
                            }
                        }
                    },
                    'isOpen': undefined,
                    'isSelected': true,
                    'items': [],
                    'name': 'DESARROLLO',
                    'pasStatus': {
                        'available': true,
                        'isChecked': true,
                        'reason': null
                    },
                    'requiredInformation': [],
                    'requiresApis': false,
                    'surname': 'TEST',
                    'type': 'ADULT'
                },
                {
                'contactData': {
                    'available': true,
                    'denyNewsLetter': false,
                    'phone': {
                        'countryCode': '34'
                    },
                    'emergency': {
                        'phone': {
                            'countryCode': '34'
                        }
                    }
                },
                'fieldStatus': {
                    'contactData': {
                        'available': true,
                        'mandatory': false,
                        'show': true
                    },
                    'emergencyData': {
                        'available': true,
                        'mandatory': false,
                        'show': true
                    },
                    'frequentFlyer': {
                        'isOpenPA': false,
                        'mandatory': false,
                        'show': true
                    },
                    'gender': {
                        'mandatory': false,
                        'show': false
                    }
                },
                'frequentFlyer': {
                    'enabled': true,
                    'info': {
                        'number': '',
                        'iataCompanyCode': ''
                    }
                },
                'gender': 'MALE',
                'id': 2,
                'infant': null,
                'inhibitBoardingCard': {
                    'reason': [],
                    'status': false,
                    'url': ''
                },
                'initialData': {
                    'contact': {
                        'gender': 'MALE',
                        'phone': {
                            'countryCode': '34',
                        },
                        'email': undefined,
                        'frequentFlyer': {
                            'info': {
                                'number': '',
                                'iataCompanyCode': ''
                            },
                            'enabled': true
                        }
                    },
                    'emergency': {
                        'phone': {
                            'countryCode': '34'
                        }
                    }
                },
                'isOpen': undefined,
                'isSelected': true,
                'items': [],
                'name': 'DESARROLLO',
                'pasStatus': {
                    'available': true,
                    'isChecked': true,
                    'reason': null
                },
                'requiredInformation': [],
                'requiresApis': false,
                'surname': 'TESTDOS',
                'type': 'ADULT'
            }],
            'prefixes': [],
            'requiredFiles': [],
            'segments': [{
                '0': {
                    'airCheck': {
                        'status': false,
                        'url': ''
                    },
                    'airlineLogo': '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                    'airlineName': "IBERIA AEROLINEAS",
                    'arrival': {
                        'cityDescription': '',
                        'cityCode': '',
                        'airportDescription': 'AIRPORT',
                        'airportCode': 'BIO',
                        'terminal': null
                    },
                    'cabinClass': {
                        'code': 'Y',
                        'type': 'ECONOMY',
                        'description': 'Turista',
                        'fareFamily': null,
                        'mainClass': 'Y'
                    },
                    'departure': {
                        'cityDescription': '',
                        'cityCode': '',
                        'airportDescription': 'BARAJAS',
                        'airportCode': 'MAD',
                        'terminal': '4'},
                    'detailedType': undefined,
                    'flightCode': 'IB',
                    'flightNumber': 'IB0426',
                    'flown': false,
                    'generalType': 'REGULAR',
                    'id': 3,
                    'isSelected': true,
                    'operatedBy': 'IBERIA AEROLINEAS',
                    'passengersStatus': [{
                        '0': {
                            'airCheckDocumentationRequired': false,
                            'flyNow': false,
                            'id': 1,
                            'inhibitBoardingCard': {
                                'isAVIHReason': false,
                                'isAircheckReason': false,
                                'isInhibitReason': false,
                                'reason': [],
                            },
                            'isSelected': true,
                            'items': [],
                            'name': 'DESARROLLO',
                            'status': 'CHECKED',
                            'surname': 'TEST'
                        },
                        '1': {
                            'airCheckDocumentationRequired': false,
                            'flyNow': false,
                            'id': 2,
                            'inhibitBoardingCard': {
                                'isAVIHReason': false,
                                'isAircheckReason': false,
                                'isInhibitReason': false,
                                'reason': [],
                            },
                            'isSelected': true,
                            'items': [],
                            'name': 'DESARROLLO',
                            'status': 'CHECKED',
                            'surname': 'TESTDOS'

                        }
                    }],
                    'segmentStatus': 'CHECKED',
                    'segmentStatusReason': '',
                    'type': 'FLIGHT'
                },
                '1': {
                    'airCheck': {
                        'status': false,
                        'url': ''
                    },
                    'airlineLogo': '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                    'airlineName': "IBERIA AEROLINEAS",
                    'arrival': {
                        'cityDescription': '',
                        'cityCode': '',
                        'airportDescription': 'BARAJAS',
                        'airportCode': 'MAD',
                        'terminal': 4
                    },
                    'cabinClass': {
                        'code': 'Y',
                        'type': 'ECONOMY',
                        'description': 'Turista',
                        'fareFamily': null,
                        'mainClass': 'Y'
                    },
                    'departure': {
                        'cityDescription': '',
                        'cityCode': '',
                        'airportDescription': 'BARAJAS',
                        'airportCode': 'MAD',
                        'terminal': '4'},
                    'detailedType': undefined,
                    'flightCode': 'IB',
                    'flightNumber': 'IB0443',
                    'flown': false,
                    'generalType': 'REGULAR',
                    'id': 4,
                    'isSelected': true,
                    'operatedBy': 'IBERIA AEROLINEAS',
                    'passengersStatus': [{
                        '0': {
                            'airCheckDocumentationRequired': false,
                            'flyNow': false,
                            'id': 1,
                            'inhibitBoardingCard': {
                                'isAVIHReason': false,
                                'isAircheckReason': false,
                                'isInhibitReason': false,
                                'reason': [],
                            },
                            'isSelected': true,
                            'items': [],
                            'name': 'DESARROLLO',
                            'status': 'CHECKED',
                            'surname': 'TEST'
                        },
                        '1': {
                            'airCheckDocumentationRequired': false,
                            'flyNow': false,
                            'id': 2,
                            'inhibitBoardingCard': {
                                'isAVIHReason': false,
                                'isAircheckReason': false,
                                'isInhibitReason': false,
                                'reason': [],
                            },
                            'isSelected': true,
                            'items': [],
                            'name': 'DESARROLLO',
                            'status': 'CHECKED',
                            'surname': 'TESTDOS'

                        }
                    }],
                    'segmentStatus': 'CHECKED',
                    'segmentStatusReason': '',
                    'type': 'FLIGHT'
                }
            }],
            'selectedShuttleSegmentIndex': null,
            'whatToDo': {
                'active': true,
                'options': [{
                    '0': {
                        'icon': 'icon-imprimir',
                        'id': 'print',
                        'isSelected': false,
                        'title': 'IBCOAC_WHAT_TO_DO_BOARDING_CARDS_TITLE',
                        'type': 'REGULAR'
                    },
                    '1': {
                        'icon': 'icon-e_equipaje',
                        'id': 'manageCki',
                        'isSelected': false,
                        'title': 'IBCOAC_PASS_DUPLICADO',
                        'type': 'REGULAR'
                    }
                }]
            }
        },
        'summaryInfo': null
    };
    let fakeFlightsPassengersService = {
        searchFlightsAndPassengers: jasmine.createSpy('searchFlightsAndPassengers').and.callFake(() => {
            return Promise.resolve(mockSearchFlights);
        }),
        searchFlightsAndPassengers2: jasmine.createSpy('searchFlightsAndPassengers2'),
        summaryInfo: jasmine.createSpy('summaryInfo'),
        updateSegmentsHeader: jasmine.createSpy('updateSegmentsHeader').and.callFake(function() {
            return 'data'
        }),
        getWCSPhones:jasmine.createSpy(),
    };

    let fakeSearchFlightsPassengersService = {
        searchFlighsPassengersByLocatorAndSurname: jasmine.createSpy('searchFlighsPassengersByLocatorAndSurname')
    }

    let fakeCkiDatalayerConstants = require('test/constants/datalayer-cki-constants.json');

    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': angular.noop,
        'sendDatalayerEvent': angular.noop,
        'initializeDatalayer': jasmine.createSpy(),
        'initDatalayer': jasmine.createSpy(),
        'addDataLayerGeneralInfo': jasmine.createSpy('addDataLayerGeneralInfo').and.callFake(angular.noop),
        'removeDatalayerGeneralInfo': jasmine.createSpy('removeDatalayerGeneralInfo').and.callFake(angular.noop),
        'getDatalayerGeneral': angular.noop
    };

    let fakeCheckinAppConstants = {
        'market': 'ES',
        'lang': 'ES',
        'PASSENGERS_TYPES': {
            'ADULT': 'ADULT'
        },
        'FLIGHT_PASSENGERS_STATUS': {
            'NOT_AVAILABLE': 'NOT_AVAILABLE'
        },
        'QUADRIGAM': {
            'UN_SEARCH': 'UNCOSE',
            'UN_RECOVERY': 'UN_RECOVERY'
        },
        'FLIGHT_PASSENGERS_STATUS_LIST': {
            'CHECKED': ['CHECKED', 'STANDBY', 'REISSUE'],
            'AVAILABLE': ['CHECKABLE', 'PENDING_AQQ', 'PENDING_EVUS'],
            'NOT_AVAILABLE': ['UNCHECKABLE'],
            'SHUTTLE': ['OPEN', 'CONFIRMED']
        },
        'TITLE_PAGE': {
            'UN_RECOVERY': 'UN_RECOVERY'
        }
    };

    let fakeCkiDataLayerService = {
        'initializeDatalayer': jasmine.createSpy(),
        'getDatalayerGeneral': jasmine.createSpy('getDatalayerGeneral').and.callFake(() => {
            return Promise.resolve(mockSearchFlights);
        }),
        'sendDatalayerEvent': angular.noop,
        'addDatalayerInfo': jasmine.createSpy(),
        'addDigitalDataInfo': jasmine.createSpy(),
        'updateLoggedDatalayer': jasmine.createSpy(),
        'updateLoggedDigitalData': jasmine.createSpy(),
        'getAviosCoins': jasmine.createSpy(),
        'generateDatalayerDOM': jasmine.createSpy(),
        'generateDigitalData DOM': jasmine.createSpy(),
        'removeDatalayerObjects': jasmine.createSpy(),
        'removeDigitalDataObjects': jasmine.createSpy(),
        'updateDatalayerWithQuadrigam': angular.noop,
        'updateDigitalDataWithQuadrigam': angular.noop,
        'sendDatalayerErrorEvent': jasmine.createSpy(),
        'sendDigitalDataErrorEvent': jasmine.createSpy(),
        'removeDatalayerErrorAttrs': jasmine.createSpy(),
        'sendDatalayerModalEvent': jasmine.createSpy(),
        'removeDatalayerModalAttrs': jasmine.createSpy(),
        'addDataLayerEcommerceInfo': jasmine.createSpy(),
        'updateDatalayerInitType': jasmine.createSpy(),
        'resetDatalayer': jasmine.createSpy(),
        'updateDatalayerEvent': jasmine.createSpy(),
        'updateDatalayerViewEvent': jasmine.createSpy(),
        'updateDatalayerInteractionEvent': jasmine.createSpy(),
        'updateDatalayerWithTaxs': jasmine.createSpy(),
        'generateDatalayerConfirmation': jasmine.createSpy(),
        'updateDatalayerForFlexFlights': jasmine.createSpy(),
        'updateDigitalDataForFlexFlights': jasmine.createSpy(),
        'updateSlicesDatalayerForFlexFlights': jasmine.createSpy(),
        'updateAircraft': jasmine.createSpy(),
        'updatePnr': jasmine.createSpy(),
        'updateDatalayerForUpgrade': jasmine.createSpy(),
        'addDatalayerInfoHashEID': jasmine.createSpy(),
        'addDigitalDataInfoHashEID': jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy(),
        'setProcessAndStep': jasmine.createSpy(),
        'removeProcessAndStep': jasmine.createSpy(),
        'updateProcessAndStep': jasmine.createSpy(),
    };

    let fakeMonetateUtilsService = {
        updateMonetateWithQuadrigam: jasmine.createSpy(),
        initializeMonetate: jasmine.createSpy()
    };

    let fakeMonetateConstants = {
        MONETATE_INFO: {
            SETPAGETYPE: 'testPageType'
        }
    };

    let mockBookingInfo = {
        'passengers':
            [{
                'pasStatus': {
                    isChecked: true
                }
            }],
        'segments': [],
        'outwardSegments': [
            {
                'passengers': [
                    {
                        'id': 1,
                        'status': {
                            'code':'CHECKED'
                        }
                    },
                    {
                        'id': 2,
                        'status': {
                            'code': 'CHECKED'
                        }
                    }
                ]
            }
        ],
        'returnSegments': [
            {
                'passengers': [
                    {
                        'id': 1,
                        'status': {
                            'code':'CHECKED'
                        }
                    },
                    {
                        'id': 2,
                        'status': {
                            'code': 'CHECKED'
                        }
                    }
                ]
            }
        ]
    };

    
    let fakeIbSessionConfigService = {
        isUserLogged: jasmine.createSpy('isUserLogged').and.callFake(function () {
            return true
        })
    };

    beforeEach(function () {
        angular.mock.module('ib-checkin-flights-des-invoice-module', 'LocalStorageModule', function ($provide) {
            $provide.value('FlightsDesInvoiceModel', fakeFlightsDesInvoiceModel);
            $provide.value('DeinvoicingService', fakeDeinvoicingService);
            $provide.value('ModalService', fakeModalService);
            $provide.value('FlightsPassengersService', fakeFlightsPassengersService);
            $provide.value('SearchFlightsPassengersService', fakeSearchFlightsPassengersService);
            $provide.value('CkiDatalayerConstants', fakeCkiDatalayerConstants);
            $provide.value('CkiDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('CheckinAppConstants', fakeCheckinAppConstants);
            $provide.value('CkiDataLayerService', fakeCkiDataLayerService);
            $provide.value('MonetateUtilsService', fakeMonetateUtilsService);
            $provide.value('MonetateConstants', fakeMonetateConstants);
            $provide.value('IbSessionConfigService', fakeIbSessionConfigService);
            $provide.value('IbAncillariesPaymentUtilsService', fakeIbAncillariesPaymentUtilsService);
            $provide.value('IbUtilsService', fakeIbUtilsService);
        });
        inject(function (_$rootScope_, _$timeout_, _localStorageService_, _$controller_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $timeout = _$timeout_;
            localStorageService = _localStorageService_;
            controller = _$controller_('FlightsPassengerDesController', {
                '$rootScope' : $rootScope,
                '$scope': $scope,
                '$timeout': $timeout,
                'localStorageService': localStorageService
            });
        });
        controller.model = {
            'segmentsPassengersInfo': {
                    'segments': [
                        {'id':1, 'isSelected': false},
                        {'id':2, 'isSelected': false},
                        {'id':3, 'isSelected': false}
                    ],
                    'passengers': [
                        {'id':1, 'isSelected': false},
                        {'id':2, 'isSelected': false},
                        {'id':3, 'isSelected': false}
                    ]
            }
        }
    });

    describe('When activate() is called', function() {
        beforeEach(inject(function () {
            localStorageService.set('bookingInfo',mockBookingInfo);
        }));
        it('FlightsPassengerDesController should be defined', function() {
            expect(controller).toBeDefined();
        })
        it('and getDatalayerGeneral function is called', function(done) {
            expect(fakeCkiDataLayerService.getDatalayerGeneral).toHaveBeenCalled();
            done();
        })
    })

    describe('when controlCheckAllPassengers is called', function() {
        const passengers = [
            {'name': 'passenger 1', 'isSelected': false},
            {'name': 'passenger 2', 'isSelected': false},
            {'name': 'passenger 3', 'isSelected': false}
        ];
        it('should check all passengers if event.target.checked is true', () => {
            const event = {
                'target': {
                    'checked': true
                }
            }
            controller.controlCheckAllPassengers(passengers, event);
            for (const passenger of passengers) {
                expect(passenger.isSelected).toBe(true);
            }
        })
        it('should not check all passengers if event.target.checked is false', () => {
            const event = {
                'target': {
                    'checked': false
                }
            }
            controller.controlCheckAllPassengers(passengers, event);
            for (const passenger of passengers) {
                expect(passenger.isSelected).toBe(false);
            }
        })
    })

    describe('when checkSelectedSegments and checkSelectedPassengers functions', () => {
        beforeEach(inject(function () {
            $rootScope.$broadcast('checkSelectedSegmentsEvent', eventDom, idSegmentSelected);
            $rootScope.$broadcast('checkSelectedPassengersEvent', passengerInfo, mainEvent);
        }));
        let eventDom = {
            'target': {
                'checked': true
            }
        }
        let mainEvent = {
            'target': {
                'checked': true
            }
        }
        let idSegmentSelected = 1;
        let passengerInfo = {
            'id': 1
        };

        describe('and checkSelectedSegments is called', function() {

            it('should check the specified segment if eventDom.target.checked is true', () => {
                eventDom = {
                    'target': {
                        'checked': true
                    }
                }
                idSegmentSelected = 2;
                controller.checkSelectedSegments(null, eventDom, idSegmentSelected);
                expect(controller.model.segmentsPassengersInfo.segments[1].isSelected).toBe(true);
            })
            it('should not check the specified segment if eventDom.target.checked is false', () => {
                eventDom = {
                    'target': {
                        'checked': false
                    }
                }
                idSegmentSelected = 3;
                controller.checkSelectedSegments(eventDom, idSegmentSelected);
                expect(controller.model.segmentsPassengersInfo.segments[2].isSelected).toBe(false);
            })
        })
        describe('and checkSelectedPassengers is called', function() {
            beforeEach(inject(function () {
                mainEvent = {
                    'target': {
                        'checked': true
                    }
                }
                passengerInfo = {
                    'id': 1
                };
                controller.model = {
                    'segmentsPassengersInfo': {
                            'segments': [
                                {'id':1, 'isSelected': false},
                                {'id':2, 'isSelected': false},
                                {'id':3, 'isSelected': false}
                            ],
                            'passengers': [
                                {'id':1, 'isSelected': true},
                                {'id':2, 'isSelected': true},
                                {'id':3, 'isSelected': true}
                            ]
                    }
                }
            }));

            it ('should check the specified passenger if mainEvent.target.checked is true', function() {
                passengerInfo = {
                    'id': 1
                };
                controller.checkSelectedPassengers(null, passengerInfo, mainEvent);
                expect(controller.model.segmentsPassengersInfo.passengers[0].isSelected).toBe(true);
            })
            it ('should check the specified passenger if mainEvent.target.checked is false', function() {
                mainEvent = {
                    'target': {
                        'checked': false
                    }
                }
                passengerInfo = {
                    'id': 1
                };

                controller.model.segmentsPassengersInfo.passengers[0].isSelected = true;
                controller.checkSelectedPassengers(null, passengerInfo, mainEvent);
                expect(controller.model.segmentsPassengersInfo.passengers[0].isSelected).toBe(false);
            })
            it('should update checkboxAllSelected property based on selected passengers', () => {


                controller.checkSelectedPassengers(null, passengerInfo, mainEvent);
                expect(controller.checkboxAllSelected).toBe(true);
            })
        })
    })

    describe('when the openModal function is called', () => {
        it('should open the modal when both a segment and a passenger are selected', () => {
            const template = 'template.html';
            const segments = [
                { 'isSelected': true}
            ];
            const passengers = [
                { 'isSelected': true,
                    'pasStatus': {
                        'undoChecked': false
                    }
                }
            ]
            const isSegmentSelected = true;
            const isPassengerSelected = true;
            controller.openModal(template, segments, passengers);
            expect(fakeModalService.showGenericModal).toHaveBeenCalled();
        })
        xit('should not open the modal if either a segment or a passenger is not selected', () => {
            const template = 'template.html';
            const segments = [
                { 'isSelected': false}
            ];
            const passengers = [
                {
                'isSelected': false,
                'pasStatus': {
                        'undoChecked': false
                    }
                }
            ];
            const isSegmentSelected = false;
            const isPassengerSelected = true;
            controller.openModal(template, segments, passengers);
            expect(fakeModalService.showGenericModal).not.toHaveBeenCalled();

        })
    })

    describe('goToIbCose', () => {
        beforeEach(inject(() => {
            localStorageService.set('PNR', 'pnr');
            localStorageService.set('checkinSurname', 'pnr');
        }));

        it('should redirect to ibcose', () => {
            const initialStorage = {
                PNR: localStorageService.get('PNR'),
                checkinSurname: localStorageService.get('checkinSurname')
            };

            controller.goToIbCose();

            expect(fakeIbUtilsService.goIbCose).toHaveBeenCalled();
            expect(initialStorage).not.toEqual({
                PNR: localStorageService.get('PNR'),
                checkinSurname: localStorageService.get('checkinSurname')
            });
        });
    });
});
