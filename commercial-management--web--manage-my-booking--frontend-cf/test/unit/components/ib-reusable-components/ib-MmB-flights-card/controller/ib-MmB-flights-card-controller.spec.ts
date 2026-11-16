describe('MmBFlightsController test', () => {

    var controller, $rootScope, $scope;

    var fakeEvent = {
        preventDefault: () => {
            return null;
        }
    }
    var fakeSegmentSelected = [
        {
            code: 'test'
        }
    ];

    var mockTranslateFilter = (value) => {
        switch (value) {
            case 'UPGRADING_TO_FREE_SELECTION_SEAT':
                return 'Selección de asiento gratuita';
            default:
                break;
        }
    };
    var fakeMmbInvoluntaryChangeService = {
        'flightHasInvoluntaryChange': jasmine.createSpy('flightHasInvoluntaryChange').and.callFake(() => {
            return true;
        }),

        'flightIsChange': jasmine.createSpy('flightIsChange').and.callFake(() => {
            return true;
        }),

        'flightIsCancel': jasmine.createSpy('flightIsCancel').and.callFake(() => {
            return true;
        }),
    }
    var fakeBookingInfo = {
        'flowId':'TWFuYWdlTXlCb29raW5nQElCNmU1NzgyZjg1ODVhNDIzM2EwZDJkOTdiZDkxODFjOTg%3D',
        'order':{
            'orderId':'Qm9va2luZ0BJQmY5M2ZkMzA5ZmQ5ZTRjNTVhMjdiMWQ3YzA4OTgzZjA1T1A%3D',
            'status':'ISSUED','bookingReferences':[{'provider':'IB','reference':'K5X6T'}],
            'orderItems':[
                {
                    'type':'flight',
                    'orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_01',
                    'bookingReferences':[{'provider':'IB','reference':'K5X6T'}],
                    'price':{'fare':114,'tax':98.02,'total':212.02,'currency':'EUR','ticketingFee':0},
                    'sliceIds':['MADFCO20210315090500','FCOMAD20210322121500'],
                    'passengerPrices':[
                        {
                            'fareCalculation':'MAD IB ROM28.29IB MAD40.33NUC68.62END ROE0.830521',
                            'passengerId':'ADULT_01',
                            'price':{'fare':57,'tax':49.01,'total':106.01,'currency':'EUR','ticketingFee':0},
                            'segmentPrices':[
                                {'price':null,'fareCode':'ADNNANB4','segmentsIds':['IB323020210315'],'ticketDesignator':'','penalties':[]},
                                {'price':null,'fareCode':'OWNNANB4','segmentsIds':['IB323120210322'],'ticketDesignator':'','penalties':[]}
                            ],
                            'taxes':[
                                {'code':'JD','amount':14.95,'currency':'EUR','description':'Cargo por salida'},
                                {'code':'OG','amount':0.62,'currency':'EUR','description':'Tasa de seguridad'},
                                {'code':'QV','amount':3.38,'currency':'EUR','description':'Seguridad'},
                                {'code':'EX','amount':2.32,'currency':'EUR','description':'Cargo por seguridad del equipaje'},
                                {'code':'HB','amount':7.5,'currency':'EUR','description':'Tasa municipal'},
                                {'code':'IT','amount':15.99,'currency':'EUR','description':'Tasa de embarque'},
                                {'code':'MJ','amount':1.05,'currency':'EUR','description':'Cargo por servicio al pasajero'},
                                {'code':'VT','amount':3.2,'currency':'EUR','description':'Cargo por seguridad'}
                            ],
                            'orderItemPaymentInfos':[]
                        },
                        {
                            'fareCalculation':'MAD IB ROM28.29IB MAD40.33NUC68.62END ROE0.830521',
                            'passengerId':'ADULT_02',
                            'price':{'fare':57,'tax':49.01,'total':106.01,'currency':'EUR','ticketingFee':0},
                            'segmentPrices':[
                                {'price':null,'fareCode':'ADNNANB4','segmentsIds':['IB323020210315'],'ticketDesignator':'','penalties':[]},
                                {'price':null,'fareCode':'OWNNANB4','segmentsIds':['IB323120210322'],'ticketDesignator':'','penalties':[]}
                            ],
                            'taxes':[
                                {'code':'JD','amount':14.95,'currency':'EUR','description':'Cargo por salida'},
                                {'code':'OG','amount':0.62,'currency':'EUR','description':'Tasa de seguridad'},
                                {'code':'QV','amount':3.38,'currency':'EUR','description':'Seguridad'},
                                {'code':'EX','amount':2.32,'currency':'EUR','description':'Cargo por seguridad del equipaje'},
                                {'code':'HB','amount':7.5,'currency':'EUR','description':'Tasa municipal'},
                                {'code':'IT','amount':15.99,'currency':'EUR','description':'Tasa de embarque'},
                                {'code':'MJ','amount':1.05,'currency':'EUR','description':'Cargo por servicio al pasajero'},
                                {'code':'VT','amount':3.2,'currency':'EUR','description':'Cargo por seguridad'}
                            ],
                            'orderItemPaymentInfos':[]
                        }
                    ]
                },
                {
                    'type':'baggage',
                    'orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_02',
                    'price':{'fare':120,'tax':0,'total':120,'currency':'EUR','ticketingFee':0},
                    'sliceId':'FCOMAD20210322121500',
                    'passengerId':'ADULT_02',
                    'amount':1,
                    'emd':'0755569497597',
                    'orderItemPaymentInfos':[],
                    'subtype':'BAGGAGE_32'
                },
                {
                    'type':'baggage',
                    'orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_03',
                    'price':{'fare':100,'tax':0,'total':100,'currency':'EUR','ticketingFee':0},
                    'sliceId':'FCOMAD20210322121500',
                    'passengerId':'ADULT_02',
                    'amount':1,
                    'emd':'0755569497596',
                    'orderItemPaymentInfos':[],
                    'subtype':'BAGGAGE_32'
                },
                {
                    'type':'baggage',
                    'orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_04',
                    'price':{'fare':30,'tax':0,'total':30,'currency':'EUR','ticketingFee':0},
                    'sliceId':'FCOMAD20210322121500',
                    'passengerId':'ADULT_02',
                    'amount':1,
                    'emd':'0755569497595',
                    'orderItemPaymentInfos':[],
                    'subtype':'BAGGAGE_23'
                },{
                    'type':'baggage','orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_05','price':{'fare':25,'tax':0,'total':25,'currency':'EUR','ticketingFee':0},'sliceId':'FCOMAD20210322121500','passengerId':'ADULT_02','amount':1,'emd':'0755569497594','orderItemPaymentInfos':[],'subtype':'BAGGAGE_23'},{'type':'baggage','orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_06','price':{'fare':120,'tax':0,'total':120,'currency':'EUR','ticketingFee':0},'sliceId':'MADFCO20210315090500','passengerId':'ADULT_01','amount':1,'emd':'0755569497593','orderItemPaymentInfos':[],'subtype':'BAGGAGE_32'},{'type':'baggage','orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_07','price':{'fare':100,'tax':0,'total':100,'currency':'EUR','ticketingFee':0},'sliceId':'MADFCO20210315090500','passengerId':'ADULT_01','amount':1,'emd':'0755569497592','orderItemPaymentInfos':[],'subtype':'BAGGAGE_32'},{'type':'baggage','orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_08','price':{'fare':120,'tax':0,'total':120,'currency':'EUR','ticketingFee':0},'sliceId':'MADFCO20210315090500','passengerId':'ADULT_02','amount':1,'emd':'0755569497591','orderItemPaymentInfos':[],'subtype':'BAGGAGE_32'},{'type':'baggage','orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_09','price':{'fare':100,'tax':0,'total':100,'currency':'EUR','ticketingFee':0},'sliceId':'MADFCO20210315090500','passengerId':'ADULT_02','amount':1,'emd':'0755569497590','orderItemPaymentInfos':[],'subtype':'BAGGAGE_32'},{'type':'baggage','orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_10','price':{'fare':30,'tax':0,'total':30,'currency':'EUR','ticketingFee':0},'sliceId':'MADFCO20210315090500','passengerId':'ADULT_02','amount':1,'emd':'0755569497589','orderItemPaymentInfos':[],'subtype':'BAGGAGE_23'},{'type':'baggage','orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_11','price':{'fare':25,'tax':0,'total':25,'currency':'EUR','ticketingFee':0},'sliceId':'MADFCO20210315090500','passengerId':'ADULT_02','amount':1,'emd':'0755569497588','orderItemPaymentInfos':[],'subtype':'BAGGAGE_23'}],
            'slices':[
                {
                    'sliceId':'MADFCO20210315090500',
                    'type':'REGULAR',
                    'departureDateTime':'2021-03-15 09:05',
                    'arrivalDateTime':'2021-03-15 11:35',
                    'duration':150,
                    'stopsNumber':0,
                    'detailedPrices':[{'fare':0,'currency':null,'passengerIds':['ADULT_01','ADULT_02'],'segmentPrices':[]}],
                    'segments':[
                        {
                            'type':'CONFIRMED',
                            'mmbAllowed':true,
                            'ckiStatus':{'code':'CHECKABLE','message':null},
                            'noShow':false,
                            'flyNow':false,
                            'flown':false,
                            'departure':{
                                'code':'MAD',
                                'name':'BARAJAS',
                                'terminal':'4',
                                'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}
                            },
                            'arrival':{
                                'code':'FCO',
                                'name':'FIUMICINO',
                                'terminal':'3',
                                'city':{'code':'ROM','description':'Roma','countryCode':'IT','country':{'code':'IT','description':'Italia'}}
                            },
                            'departureCity':{
                                'code':'MAD',
                                'description':'Madrid',
                                'countryCode':'ES',
                                'timeZone':'Europe/Madrid',
                                'city':{
                                    'description': 'Madrid',
                                }
                            },
                            'arrivalCity':{'code':'ROM','description':'Roma','countryCode':'IT','timeZone':'Europe/Rome'},
                            'flight':{
                                'marketingCarrier':{'code':'IB','name':'Iberia'},
                                'operationalCarrier':{'code':'IB','name':'Iberia'},
                                'marketingFlightNumber':'3230',
                                'operationalFlightNumber':'3230',
                                'operationalDisclosure':'IB',
                                'aircraft':{'code':'320','description':'Airbus A320'}
                            },
                            'cabin':{'rbd':'A','description':'','remainingSeats':9,'fareFamily':'TBAESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},
                            'overnight':false,
                            'id':'IB323020210315',
                            'duration':150,
                            'waitingTime':0,
                            'operatorLocator':null,
                            'stop':null,
                            'departureDateTime':'2021-03-15 09:05',
                            'departureUtcDateTime':'2021-03-15T08:05:00.000',
                            'arrivalDateTime':'2021-03-15 11:35',
                            'arrivalUtcDateTime':'2021-03-15T10:35:00.000',
                            'status':{'code':'HK','description':'Confirmado'},
                            'upgradingBids': true,
                            'fareFamilyConditions':[
                                {
                                    code: 'ASIENTO',
                                    title:'Asiento',
                                    message:'Tienes un asiento'
                                }
                            ],
                            'warnings':[
                                {
                                    code:'SSE_ORM_20001',
                                    description:'Error'
                                },
                                {
                                    code:'SSE_ORM_20002',
                                    description:'Error'
                                },
                                {
                                    code:'SSE_ORM_20004',
                                    description:'Error'
                                },
                                {
                                    code:'SSE_ORM_20014',
                                    description:'Error'
                                },
                            ],
                            sliceBaggage: {
                                passBaggages: [
                                    {
                                        test: 'test'
                                    }
                                ]
                            }
                        }
                    ],
                }]
            }
        }
    var fakeBookingInfoFlightStop = {
        'flowId':'TWFuYWdlTXlCb29raW5nQElCNmU1NzgyZjg1ODVhNDIzM2EwZDJkOTdiZDkxODFjOTg%3D',
        'order':{
            'orderId':'Qm9va2luZ0BJQmY5M2ZkMzA5ZmQ5ZTRjNTVhMjdiMWQ3YzA4OTgzZjA1T1A%3D',
            'status':'ISSUED','bookingReferences':[{'provider':'IB','reference':'K5X6T'}],
            'orderItems':[
                {
                    'type':'flight',
                    'orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_01',
                    'bookingReferences':[{'provider':'IB','reference':'K5X6T'}],
                    'price':{'fare':114,'tax':98.02,'total':212.02,'currency':'EUR','ticketingFee':0},
                    'sliceIds':['MADFCO20210315090500','FCOMAD20210322121500'],
                    'passengerPrices':[
                        {
                            'fareCalculation':'MAD IB ROM28.29IB MAD40.33NUC68.62END ROE0.830521',
                            'passengerId':'ADULT_01',
                            'price':{'fare':57,'tax':49.01,'total':106.01,'currency':'EUR','ticketingFee':0},
                            'segmentPrices':[
                                {'price':null,'fareCode':'ADNNANB4','segmentsIds':['IB323020210315'],'ticketDesignator':'','penalties':[]},
                                {'price':null,'fareCode':'OWNNANB4','segmentsIds':['IB323120210322'],'ticketDesignator':'','penalties':[]}
                            ],
                            'taxes':[
                                {'code':'JD','amount':14.95,'currency':'EUR','description':'Cargo por salida'},
                                {'code':'OG','amount':0.62,'currency':'EUR','description':'Tasa de seguridad'},
                                {'code':'QV','amount':3.38,'currency':'EUR','description':'Seguridad'},
                                {'code':'EX','amount':2.32,'currency':'EUR','description':'Cargo por seguridad del equipaje'},
                                {'code':'HB','amount':7.5,'currency':'EUR','description':'Tasa municipal'},
                                {'code':'IT','amount':15.99,'currency':'EUR','description':'Tasa de embarque'},
                                {'code':'MJ','amount':1.05,'currency':'EUR','description':'Cargo por servicio al pasajero'},
                                {'code':'VT','amount':3.2,'currency':'EUR','description':'Cargo por seguridad'}
                            ],
                            'orderItemPaymentInfos':[]
                        },
                        {
                            'fareCalculation':'MAD IB ROM28.29IB MAD40.33NUC68.62END ROE0.830521',
                            'passengerId':'ADULT_02',
                            'price':{'fare':57,'tax':49.01,'total':106.01,'currency':'EUR','ticketingFee':0},
                            'segmentPrices':[
                                {'price':null,'fareCode':'ADNNANB4','segmentsIds':['IB323020210315'],'ticketDesignator':'','penalties':[]},
                                {'price':null,'fareCode':'OWNNANB4','segmentsIds':['IB323120210322'],'ticketDesignator':'','penalties':[]}
                            ],
                            'taxes':[
                                {'code':'JD','amount':14.95,'currency':'EUR','description':'Cargo por salida'},
                                {'code':'OG','amount':0.62,'currency':'EUR','description':'Tasa de seguridad'},
                                {'code':'QV','amount':3.38,'currency':'EUR','description':'Seguridad'},
                                {'code':'EX','amount':2.32,'currency':'EUR','description':'Cargo por seguridad del equipaje'},
                                {'code':'HB','amount':7.5,'currency':'EUR','description':'Tasa municipal'},
                                {'code':'IT','amount':15.99,'currency':'EUR','description':'Tasa de embarque'},
                                {'code':'MJ','amount':1.05,'currency':'EUR','description':'Cargo por servicio al pasajero'},
                                {'code':'VT','amount':3.2,'currency':'EUR','description':'Cargo por seguridad'}
                            ],
                            'orderItemPaymentInfos':[]
                        }
                    ]
                },
                {
                    'type':'baggage',
                    'orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_02',
                    'price':{'fare':120,'tax':0,'total':120,'currency':'EUR','ticketingFee':0},
                    'sliceId':'FCOMAD20210322121500',
                    'passengerId':'ADULT_02',
                    'amount':1,
                    'emd':'0755569497597',
                    'orderItemPaymentInfos':[],
                    'subtype':'BAGGAGE_32'
                },
                {
                    'type':'baggage',
                    'orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_03',
                    'price':{'fare':100,'tax':0,'total':100,'currency':'EUR','ticketingFee':0},
                    'sliceId':'FCOMAD20210322121500',
                    'passengerId':'ADULT_02',
                    'amount':1,
                    'emd':'0755569497596',
                    'orderItemPaymentInfos':[],
                    'subtype':'BAGGAGE_32'
                },
                {
                    'type':'baggage',
                    'orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_04',
                    'price':{'fare':30,'tax':0,'total':30,'currency':'EUR','ticketingFee':0},
                    'sliceId':'FCOMAD20210322121500',
                    'passengerId':'ADULT_02',
                    'amount':1,
                    'emd':'0755569497595',
                    'orderItemPaymentInfos':[],
                    'subtype':'BAGGAGE_23'
                },
                {
                    'type':'baggage',
                    'orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_05',
                    'price':{'fare':25,'tax':0,'total':25,'currency':'EUR','ticketingFee':0},
                    'sliceId':'FCOMAD20210322121500','passengerId':'ADULT_02','amount':1,'emd':'0755569497594','orderItemPaymentInfos':[],'subtype':'BAGGAGE_23'
                },
                {
                    'type':'baggage','orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_06','price':{'fare':120,'tax':0,'total':120,'currency':'EUR','ticketingFee':0},'sliceId':'MADFCO20210315090500','passengerId':'ADULT_01','amount':1,'emd':'0755569497593','orderItemPaymentInfos':[],'subtype':'BAGGAGE_32'
                },
                {
                    'type':'baggage','orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_07','price':{'fare':100,'tax':0,'total':100,'currency':'EUR','ticketingFee':0},'sliceId':'MADFCO20210315090500','passengerId':'ADULT_01','amount':1,'emd':'0755569497592','orderItemPaymentInfos':[],'subtype':'BAGGAGE_32'
                },
                {
                    'type':'baggage','orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_08','price':{'fare':120,'tax':0,'total':120,'currency':'EUR','ticketingFee':0},'sliceId':'MADFCO20210315090500','passengerId':'ADULT_02','amount':1,'emd':'0755569497591','orderItemPaymentInfos':[],'subtype':'BAGGAGE_32'
                },
                {
                    'type':'baggage','orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_09','price':{'fare':100,'tax':0,'total':100,'currency':'EUR','ticketingFee':0},'sliceId':'MADFCO20210315090500','passengerId':'ADULT_02','amount':1,'emd':'0755569497590','orderItemPaymentInfos':[],'subtype':'BAGGAGE_32'
                },
                {
                    'type':'baggage','orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_10','price':{'fare':30,'tax':0,'total':30,'currency':'EUR','ticketingFee':0},'sliceId':'MADFCO20210315090500','passengerId':'ADULT_02','amount':1,'emd':'0755569497589','orderItemPaymentInfos':[],'subtype':'BAGGAGE_23'
                },
                {
                    'type':'baggage','orderItemId':'IBf93fd309fd9e4c55a27b1d7c08983f05OP_11','price':{'fare':25,'tax':0,'total':25,'currency':'EUR','ticketingFee':0},'sliceId':'MADFCO20210315090500','passengerId':'ADULT_02','amount':1,'emd':'0755569497588','orderItemPaymentInfos':[],'subtype':'BAGGAGE_23'
                }
            ],
            'slices':[
                {
                    'sliceId':'MADFCO20210315090500',
                    'type':'REGULAR',
                    'departureDateTime':'2021-03-15 09:05',
                    'arrivalDateTime':'2021-03-15 11:35',
                    'duration':150,
                    'stopsNumber':0,
                    'detailedPrices':[{'fare':0,'currency':null,'passengerIds':['ADULT_01','ADULT_02'],'segmentPrices':[]}],
                    'segments':[
                        {
                            'type':'CONFIRMED',
                            'mmbAllowed':true,
                            'ckiStatus':{'code':'CHECKABLE','message':null},
                            'noShow':false,
                            'flyNow':false,
                            'flown':false,
                            'departure':{
                                'code':'MAD',
                                'name':'BARAJAS',
                                'terminal':'4',
                                'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}
                            },
                            'arrival':{
                                'code':'FCO',
                                'name':'FIUMICINO',
                                'terminal':'3',
                                'city':{'code':'ROM','description':'Roma','countryCode':'IT','country':{'code':'IT','description':'Italia'}}
                            },
                            'departureCity':{
                                'code':'MAD',
                                'description':'Madrid',
                                'countryCode':'ES',
                                'timeZone':'Europe/Madrid',
                                'city':{
                                    'description': 'Madrid',
                                }
                            },
                            'arrivalCity':{'code':'ROM','description':'Roma','countryCode':'IT','timeZone':'Europe/Rome'},
                            'flight':{
                                'marketingCarrier':{'code':'IB','name':'Iberia'},
                                'operationalCarrier':{'code':'IB','name':'Iberia'},
                                'marketingFlightNumber':'3230',
                                'operationalFlightNumber':'3230',
                                'operationalDisclosure':'IB',
                                'aircraft':{'code':'320','description':'Airbus A320'}
                            },
                            'cabin':{'rbd':'A','description':'','remainingSeats':9,'fareFamily':'TBAESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},
                            'overnight':false,
                            'id':'IB323020210315',
                            'duration':150,
                            'waitingTime':0,
                            'waitingTimeParsed':150,
                            'operatorLocator':null,
                            'stop':null,
                            'departureDateTime':'2021-03-15 09:05',
                            'departureUtcDateTime':'2021-03-15T08:05:00.000',
                            'arrivalDateTime':'2021-03-15 11:35',
                            'arrivalUtcDateTime':'2021-03-15T10:35:00.000',
                            'status':{'code':'HK','description':'Confirmado'},
                            'upgradingBids': true,
                            'fareFamilyConditions':[
                                {
                                    code: 'ASIENTO',
                                    title:'Asiento',
                                    message:'Tienes un asiento'
                                }
                            ],
                            'warnings':[
                                {
                                    code:'SSE_ORM_20001',
                                    description:'Error'
                                },
                                {
                                    code:'SSE_ORM_20002',
                                    description:'Error'
                                },
                                {
                                    code:'SSE_ORM_20014',
                                    description:'Error'
                                },
                            ],
                            sliceBaggage: {
                                passBaggages: [
                                    {
                                        test: 'test'
                                    }
                                ]
                            }
                        }
                    ],
                }
            ]
            }
        }


    let fakeCommonsConstants = {
        FARE_FAMILY_ICON_PROPERTY_CODE: {
            test: 'test',
        }
    }

    let fakeMmBDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'setProcessAndStep': jasmine.createSpy(),
        'updateDatalayerActionForAncillaries':jasmine.createSpy()
    };

    let fakeMmBAppConstants = {
        FARE_FAMILY_ICON_PROPERTY_CODE: {
            test: 'test'
        }
    }

    beforeEach(() => {
        angular.mock.module('ib-MmB-flights-card-module', function ($provide) {
            $provide.value('MmbInvoluntaryChangeService', fakeMmbInvoluntaryChangeService);
            $provide.value('translateFilter', mockTranslateFilter);
            $provide.value('MmBDatalayerUtilsService', fakeMmBDatalayerUtilsService);
            $provide.value('CommonsConstants', fakeCommonsConstants);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject(function ($controller, _$rootScope_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('MmBFlightsController', {
                $scope: $scope
            });

            $rootScope.$digest();
        });
    });

    describe('when $onInit() function is called', () => {

        it('and check  setStringFShortlightStop ', (done) => {
            controller.model = fakeBookingInfoFlightStop.order.slices[0];
            controller.$onInit();
            expect(controller.model).toBeDefined();
            done();
            $rootScope.$digest();
        });

    });

    describe('when $onInit() function is called', () => {
        it('and model have data ', (done) => {
            controller.model = fakeBookingInfo.order.slices[0];

            controller.$onInit();
            expect(controller.model).toBeDefined();
            done();
            $rootScope.$digest();
        });

    });

    describe('when openModalConditions() function is called', () => {
        it('should emit "openFareModal" ', (done) => {
            spyOn($scope, '$emit');
            controller.openModalConditions(fakeEvent, fakeSegmentSelected);
            expect($scope.$emit).toHaveBeenCalledWith('openFareModal',  [{code: 'test', icon: 'test' }]);
            done();
            $rootScope.$digest();
        });
    });

    describe('when flight isCancel', () => {

        it('should return correct data', (done) => {
            controller.model = {
                'daysToGo': 1
            };
            controller.documents = false;
            controller.hasInvoluntaryChange = false;
            controller.isCancel = true;
            controller.isChange = false
            expect(controller.showLabelChangeTime()).toEqual(false);
            expect(controller.showLabelCancel()).toEqual(true);
            expect(controller.showLabelNumDays()).toEqual(false);
            expect(controller.showIconFlight()).toEqual(true);
            expect(controller.classDates()).toEqual('');
            done();
            $rootScope.$digest();
        });

    });

    describe('when flight isChange', () => {

        it('should return correct data', (done) => {
            controller.model = {
                'daysToGo': 1
            };
            controller.hasInvoluntaryChange = false;
            controller.isCancel = false;
            controller.isChange = true;
            expect(controller.showLabelChangeTime()).toEqual(true);
            expect(controller.showLabelCancel()).toEqual(false);
            expect(controller.showLabelNumDays()).toEqual(false);
            expect(controller.showIconFlight()).toEqual(true);
            expect(controller.classDates()).toEqual('');
            done();
            $rootScope.$digest();
        });

    });

    describe('when flight hasInvoluntaryChange', () => {

        it('should return correct data', (done) => {
            controller.model = {
                'daysToGo': 1
            };
            controller.hasInvoluntaryChange = true;
            controller.isCancel = false;
            controller.isChange = false;
            expect(controller.showLabelChangeTime()).toEqual(false);
            expect(controller.showLabelCancel()).toEqual(false);
            expect(controller.showLabelNumDays()).toEqual(true);
            expect(controller.showIconFlight()).toEqual(false);
            expect(controller.classDates()).toEqual('ib-ticket-block__wrapper--two-dates');
            done();
            $rootScope.$digest();
        });

    });

    describe('when flightHasChangeTime() is called', () => {
        it('should have been called.', (done) => {

            controller.flightHasChangeTime();
            expect(controller.flightHasChangeTime).toBeDefined();
            done();
            $rootScope.$digest();
        });
    });

    describe('when getDurationScale() is called', () => {
        it('should have been called.', (done) => {

            var data = controller.getDurationScale(60);
            expect(data).toEqual('01h ');
            done();
            $rootScope.$digest();
        });
    });

    describe('when updateDatalayer () is called', () => {
        it('should have been called.', (done) => {
            controller.updateDatalayer();
            done();
            $rootScope.$digest();
        });
    });

    describe('when iconTypePass () is called', () => {
        it('should have been called.', (done) => {
            let idPassenger = ['CHILD'];
            expect(controller.iconTypePass(idPassenger)).toEqual('icon-iberia_ninos');
            done();
            $rootScope.$digest();
        });
    });

    describe('when getFareFamilyIcon () is called', () => {
        it('should have been called.', (done) => {
            let code = 'test';
            expect(controller.getFareFamilyIcon(code)).toEqual('test');
            done();
            $rootScope.$digest();
        });
    });

});
