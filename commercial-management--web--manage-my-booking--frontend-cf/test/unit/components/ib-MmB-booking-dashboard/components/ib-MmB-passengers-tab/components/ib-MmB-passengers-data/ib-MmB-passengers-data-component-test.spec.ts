describe('ibMmbPassengersDataComponent test', () => {
    var controller, $rootScope, $scope, localStorage;
    var fakeMmBModalService = {
        showGenericModal: jasmine.createSpy(),
        showPassengerModal: jasmine.createSpy(),
    }

    var fakeSpecialNeeds = {
        'values': [{
            'serviceCode': 'BLND',
            'text': '',
            'status': {
                'code': 'HK',
                'description': 'Confirmado'
            }
        }],
        'specialVision': true,
        'specialVisionValue': ''
    }

    var frequentFlyersCompanies = [{
        'iataCompanyCode': 'test',
        'description': 'test'
    }];

    var fakeFrequentFlyerInfo = {
        'company': 'IB',
        'number': '11889003'
    }

    var fakeFlags = [{
        'passengerId': 'ADULT_01',
        'flags': [{
            'type': 'FLIGHT_MODIFICATION',
            'enabled': true
        },
        {
            'type': 'FLIGHT_REFUND',
            'enabled': true
        },
        {
            'type': 'FREQUENT_FLYER_MODIFICATION',
            'enabled': true
        },
        {
            'type': 'SPECIAL_NEEDS_MODIFICATION',
            'enabled': true
        },
        {
            'type': 'CONTACT_DATA_MODIFICATION',
            'enabled': true
        },
        {
            'type': 'EMERGENCY_CONTACT_MODIFICATION',
            'enabled': true
        },
        {
            'type': 'PASSENGER_NAME_CORRECTION',
            'enabled': false
        }
        ]
    }]

    var fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy()
    };

    var fakeMmBAppConstants = {
        QUADRIGAM: {
            STOP_OVER: 'STOP_OVER',
            COMPLETE_TRAVEL: 'COMPLETE_TRAVEL',
            MODAL_ADD_CONTACT: 'test'
        },
        PNR_EMITION_CHANNEL: {
            FLEX_FLIGHT_DIRECT: [
                'IBCOM',
                'CALL_CENTER',
                'NDC_DIRECT'
            ],
            FLEX_FLIGHT_INDIRECT: [
                'NDC_INDIRECT',
                'OTHER',
            ],
        },
        ORDER_ITEMS_TYPE_TO_AVOID: ['baggage', 'specialEquipment', 'flexibilityOnDemand', 'priorityBoarding'],
        COMMON_LABELS: {
            CHANNEL: {
                IBCOM: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                NDC_DIRECT: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                NDC_INDIRECT: {
                    'VALUE': 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                    'PHONE': false
                },
                CALL_CENTER: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                OTHER: {
                    'VALUE': 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                    'PHONE': false
                },
                DEFAULT: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                }


            }
        },
        WCS: {
            'PHONE_TYPES': {
                'SALES': 'RESERVAS',
                'IBHOLIDAYS': 'ATTBAH'
            }
        },
        templatesRoute: 'test'
    };
    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            'VIEW': 'VIEW'
        },
        DIGITAL_DATA_PROCESS: {
            ATCFCNA: 'ads'
        },
        DIGITAL_DATA_STEP: {
            ATCFCNA: 'asd'
        },
    };
    var fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy('isUserLogged').and.callFake(() => {
            return true;
        }),
        orderItemContained : jasmine.createSpy('orderItemContained').and.callFake(() => {
            return true;
        })
    };

    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy()
    }

    let fakeCommercialData = {
        market: {
            code: 'ES',
            description: "España"
        }
    }

    beforeEach(() => {
        angular.mock.module('ib-MmB-passengers-data-module', 'ib-MmB-booking-dashboard-module', 'ib-MmB-booking-management-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
        });
        inject((_$rootScope_, $componentController, _localStorageService_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $componentController('ibMmbPassengersDataComponent', {
                $scope: $scope
            });
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    'result': {
                        'then': () => { }
                    }
                };
            });
            fakeMmBModalService.showPassengerModal = jasmine.createSpy('showPassengerModal').and.callFake(() => {
                return {
                    'result': {
                        'then': () => { }
                    }
                };
            });
            localStorage = _localStorageService_;
            spyOn($scope, '$emit');
            spyOn($scope, '$on');
        });
    });


    describe('when the activation function is called', () => {
        it('should load specialneeds on model from LocalStorage when exist', (done) => {
            controller.model = {};
            controller.model.passengerId = 'test';
            localStorage.set('specialNeed', [{ id: 'test', need: 'test' }, { id: 'test', need: 'test' }]);
            controller.$onInit();
            done();
        });
    });

    describe('when the activation function is called', () => {
        it('should load specialneeds on model from LocalStorage when exist and passengerId is dintict of id', (done) => {
            controller.model = {};
            controller.model.passengerId = 'test';
            localStorage.set('specialNeed', [{ id: 'test1', need: 'test' }, { id: 'test', need: 'test' }]);
            controller.$onInit();
            done();
        });
    });

    describe('when the activation function is called', () => {
        it('should load specialneeds on model from LocalStorage when not exist', (done) => {
            controller.model = {};
            controller.model.passengerId = 'test';
            localStorage.remove('specialNeed');
            controller.$onInit();
            done();
        });
    });

    describe('when the changePassengerInfo function is called', () => {

        it('and show modal correctly', (done) => {
            let index = 0;
            localStorage.set('commercialData', fakeCommercialData);
            controller.model = {index: 0, type: 'personalInfo', personalInfo: {name: 'TESTUNO', surname: 'TEST', birthdate: null}, externalPersonalInfo: {name: 'TESTUNO', firstSurname: 'TEST', lastSurname: ''}, personalInfoEdit: {name:'testunocam', surname:'test'}, title:'Corrección de nombre o apellidos', originalPersonalInfo: {name: 'testuno', surname: 'test', birthdate: null}, market: 'ES'};
            controller.changePersonalInfo(index);
            expect(fakeMmBModalService.showPassengerModal).toHaveBeenCalledWith(false, 'ib-modal-passengers-update-personal-info.html', controller.model, 'ib-modals ib-modals--right fade');
            done();
        });

    });

    describe('when the addSpecialNeeds function is called', () => {

        it('and show modal correctly', (done) => {
            var outputData = {
                'index': 1,
                'specialNeeds': fakeSpecialNeeds,
                'originalSpecialNeeds': fakeSpecialNeeds,
                'type': 'specialNeeds'
            }
            controller.model = {
                'specialNeeds': fakeSpecialNeeds
            }
            controller.addSpecialNeeds(1);
            expect(fakeMmBModalService.showPassengerModal).toHaveBeenCalledWith(false, 'ib-modal-passengers-special-assistance.html', outputData, 'ib-modals ib-modals--right fade');
            done();
        });

    });

    describe('when the addFrequentFlyer function is called', () => {

        it('and show modal correctly', (done) => {
            var outputData = {
                'frequentFlyerInfo': {
                    'company': 'IB',
                    'number': '11889003'
                },
                'index': 1,
                'type': 'frequentFlyer',
                'frequentFlyersCompanies': [
                    {
                        'iataCompanyCode': 'test',
                        'description': 'test'
                    }
                ]
            }
            localStorage.set('frequentFlyersCompanies', frequentFlyersCompanies);
            controller.model = {
                'frequentFlyerInfo': fakeFrequentFlyerInfo
            }
            controller.addFrequentFlyer(1);
            expect(angular.toJson(controller.model)).toEqual(angular.toJson(outputData));
            done();
        });

    });

    describe('when the addApisData function is called', () => {

        it('and emit the event correctly', (done) => {
            controller.addApisData();
            expect($scope.$emit).toHaveBeenCalledWith('fillApisData', {
                index: undefined,
                info: undefined,
                type: ''
            });
            done();
        });

    });

    describe('when the turnLink function is called', () => {

        it('and return the object correctly', (done) => {
            var result;
            controller.index = 0;
            controller.flags = {
                'allFlags': fakeFlags
            };
            result = controller.turnLink('FLIGHT_MODIFICATION');

            expect(result).toEqual(true);
            done();
        });

    });

    describe('when the updateContactInfo function is called', () => {

        it('and return the object correctly', (done) => {
            var index = 0;
            controller.model = {};
            controller.model.index = index;
            controller.updateContactInfo(index);
            //need expect
            done();
        });

    });

    describe('when the initAdditionalServices function is called', () => {

        it('and return the object correctly', (done) => {
            const additionalServices = [
                {
                    serviceCode: 'PETC',
                    status: 'Servicio cancelado'
                }
            ]
            const bookingInfo = {
                "flowId": "TWFuYWdlTXlCb29raW5nQElCNDE2ZGIzMGJmYTJlNGUzMWJmMmIyMjc0YTNhMzc1ZDU=",
                "order": {
                    "orderItems": [
                        {
                            "type": "pet",
                            "orderItemId": "IBb6f7ecf406e346dd8178e92e90a43a0c_02",
                            "serviceCode": "PETC",
                            "passengerId": "ADULT_01",
                            "sliceId": "MADDXB20230924160500",
                            "segmentId": "IB790320230924",
                            "name": "ssr.name.PETC",
                            "text": "",
                            "description": "ssr.description.PETC",
                            "status": {
                                "code": "UC",
                                "description": "Servicio cancelado"
                            }
                        }
                    ]
                }
            };
            localStorage.set('bookingInfo', bookingInfo);
            controller.model = {
                passengerId: "ADULT_01"
            };
            controller.initAdditionalServices();
            expect(controller.model.additionalServices).toEqual(additionalServices);
            done();
        });

    });

    describe('when the createAdditionalService function is called', () => {

        it('and return the object correctly', (done) => {
            const item = {
                "type": "pet",
                "orderItemId": "IBb6f7ecf406e346dd8178e92e90a43a0c_02",
                "serviceCode": "PETC",
                "passengerId": "ADULT_01",
                "sliceId": "MADDXB20230924160500",
                "segmentId": "IB790320230924",
                "name": "ssr.name.PETC",
                "text": "",
                "description": "ssr.description.PETC",
                "status": {
                    "code": "UC",
                    "description": "Servicio cancelado"
                }
            };
            const expectAdditionalService = {
                serviceCode: "PETC",
                status: "Servicio cancelado"
            }
            controller.model = {};
            const additionalService = controller.createAdditionalService(item);
            expect(additionalService).toEqual(expectAdditionalService);
            done();
        });

    });

    describe('when the isAdditionalService function is called', () => {

        it('and return a boolean correctly', (done) => {
            expect(controller.isAdditionalService('AVIH')).toBeTrue();
            expect(controller.isAdditionalService('BIKE')).toBeTrue();
            expect(controller.isAdditionalService('BSCT')).toBeTrue();
            expect(controller.isAdditionalService('BULK')).toBeTrue();
            expect(controller.isAdditionalService('CBBG')).toBeTrue();
            expect(controller.isAdditionalService('EXST')).toBeTrue();
            expect(controller.isAdditionalService('FRAG')).toBeTrue();
            expect(controller.isAdditionalService('MAAS')).toBeTrue();
            expect(controller.isAdditionalService('MEDA')).toBeTrue();
            expect(controller.isAdditionalService('PETC')).toBeTrue();
            expect(controller.isAdditionalService('UMNR')).toBeTrue();
            expect(controller.isAdditionalService('WEAP')).toBeTrue();
            expect(controller.isAdditionalService('TUR')).toBeTrue();
            expect(controller.isAdditionalService('')).toBeFalse();
            done();
        });

    });

    describe('when the checkPassenger function is called', () => {
        it('and return the boolean correctly', (done) => {
            controller.model = {
                passengerId: "ADULT_01"
            };
            expect(controller.checkPassenger('ADULT_01')).toBeTrue();
            expect(controller.checkPassenger('ADULT_02')).toBeFalse();
            done();
        });
    });

    describe('when the updatePersonalInfoEvent function is called', () => {
        it('and updatePersonalInfoEvent', (done) => {
            controller.model = {
                passengerId: "ADULT_01",
                modifiedPersonalInfo: false,
                personalInfo: {name: 'testname', surname: 'test', birthDate: ''},
                showUpdatePersonalInfo : ''
            };
            controller.flags = {
                allFlags : [{
                    passengerId : "ADULT_01",
                    flags: [{
                        type: 'PASSENGER_NAME_CORRECTION',
                        enabled: true
                    }]
                },
                {
                    passengerId : "ADULT_02",
                    flags: [{
                        type: 'PASSENGER_NAME_CORRECTION',
                        enabled: true
                    }]
                }]
            }
            let dataHere = {data: {passengers: [{passengerId: 'ADULT_01', externalPersonalInfo: {name: 'testname', firstSurname: 'test', birthDate: ''}, personalInfo: {firstName: 'testname', firstSurname: 'test', birthDate: ''}}]}};
            let modelHere = {passengerId: 'ADULT_01', oldPassengerId: 'ADULT_02'};
            let allModifiedPersonalInfoHere = [{modifiedPersonalInfo: true, name: 'testname test'}];
            $rootScope.$broadcast('updatePersonalInfo', dataHere, modelHere, allModifiedPersonalInfoHere);
            expect(controller.model.showUpdatePersonalInfo).toEqual(true);
            $rootScope.$digest();
            done();
        });
    });

    describe('when the updateInfoSpecialNeedAccept event function is called', () => {
        it('and updateInfoSpecialNeedAccept', (done) => {
            let typeSpecialNeed = 'specialNeed';
            controller.model = {
                specialNeeds: fakeSpecialNeeds,
                passengerId: 'ADULT_01'
            };
            $rootScope.$broadcast('updateInfoSpecialNeedAccept', [{type: typeSpecialNeed, passengerId: 'ADULT_01', serviceCode: ''}]);
            $rootScope.$digest();
            expect(typeSpecialNeed).toEqual('specialNeed');
            done();
        });
    });
});
