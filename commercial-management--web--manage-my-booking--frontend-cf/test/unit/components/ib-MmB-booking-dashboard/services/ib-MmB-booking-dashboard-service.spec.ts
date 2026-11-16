describe('BookingDashboardService test', () => {
    let BookingDashboardService, localStorageService, rootScope;

    let fakeInputBookingInfo = {};

    let fakeOutputBookingInfo = {
        'model': {
            'managementModel': {}
        },
        'passengersModel': 'test',
        'insurance': '',
        'selectedInsurance': ''
    };

    let fakeSpecialNeedsOutput = {
        specialNeeds: {}
    };


    let fakeflowId = 'TWFuYWdlTXlCb29raW5nQElCNDg0YmI3YjQ5OTBkNDI4Zjg5Y2MyY2Y4NGExYTkzMDM%3D';
    let fakepassId = '123';
    let fakeTypePassenger = ['frequentFlyer', 'primaryContact', 'emergencyContact'];

    let fakePassengerContactInfoOutputFrequentFlyer = {
        'passengersContactInfo': [{
            'passengerId': undefined,
            'ffInfo': undefined
        }]
    };

    let fakeMmBGetPrefixesService = {};
    let fakepassApisInfo = {};
    let fakeEmergencyContactInfo = {};
    let fakepassengers = {};

    let fakeMmBModalService = {
        'showWaitingModal': jasmine.createSpy('showWaitingModal').and.callFake(() => { }),
        'showGenericError': jasmine.createSpy('showGenericError').and.callFake(() => { }),
    };

    let fakeBookingManagementService = {
        'getBookingInfo': jasmine.createSpy()
    };

    let fakeBookingSearchService = {
        'searchFlightsPassengers': jasmine.createSpy()
    };

    let fakeChangeOrderContactInfoService = {
        'changeOrderContactInfo': jasmine.createSpy()
    };
    let fakeChangeOrderPersonalInfoService = {
        'changeOrderPersonalInfo': jasmine.createSpy()
    };

    let fakeChangePassengerSpecialNeedsService = {
        'changePassengerSpecialNeedsServiceInfo': jasmine.createSpy()
    };

    let fakeCallApisFormService = {
        'updateApisInfo': jasmine.createSpy(),
        'getApisInfo': jasmine.createSpy()
    };

    let fakeFrequentFlyersCompaniesService = {
        'getFrequentFlyersCompaniesPromised': jasmine.createSpy('getFrequentFlyersCompaniesPromised').and.returnValue({data: {}})
    };

    let fakeCountriesListService = {
        'getCountriesList': jasmine.createSpy()
    };

    let fakeStatesListService = {
        'getStatesList': jasmine.createSpy()
    };

    let fakeBookingDashboardTransformer = {
        'transformBookingDashBoardInfo': jasmine.createSpy().and.callFake(() => {
            return {
                insurance: '',
                selectedInsurance: ''
            }
        }),
        'generateUpdateApisRequest': jasmine.createSpy(),
        'transformApisForm': jasmine.createSpy(),
        'transformUpdateDataContactData': jasmine.createSpy(),
        'transformUpdateSpecialNeeds': jasmine.createSpy()
    };
    let fakeMmBAppConstants = {
        URL_PARAMETERS: {
            SURNAME: 'test',
            LOCATOR: 'test'
        },
        PAGES_URL: {
            SEARCH: 'test'
        }
    };
    let fakeMmBTokenProxy = {
        'mmBTokenProxy': jasmine.createSpy()
    };

    let fakeAncillariesTransformer = {
        'buildAncillariesRequest': jasmine.createSpy()
    };

    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        'sendDatalayerEvent': jasmine.createSpy('sendDatalayerEvent').and.callFake(angular.noop),
        'addDataLayerInfo': jasmine.createSpy('addDataLayerInfo').and.callFake(angular.noop),

    };


    let fakeCommonsAncillariesService = {
        'updateAncillaries': jasmine.createSpy(),
        'getAncillarieSummary': jasmine.createSpy()
    };

    let fakeMmBUtilService = {
        'getURLFirstParameterByName':jasmine.createSpy()
    };

    let fakeibPlusContactDetailsService = {
        updateContactData : jasmine.createSpy('updateContactData'),
        getContactData : jasmine.createSpy('getContactData')
    };
    let fakeIBCTravelPreferencesService = {
        getTravelPreferences : jasmine.createSpy('getTravelPreferences'),
        updateTravelPreferences : jasmine.createSpy('updateTravelPreferences')
    };
    let fakeIBCTripDocumentsService = {
        getTripDocuments : jasmine.createSpy('getTripDocuments'),
        addTripDocument : jasmine.createSpy('addTripDocument'),
        modifyTripDocument : jasmine.createSpy('modifyTripDocument'),
        deleteTripDocument : jasmine.createSpy('deleteTripDocument')
    };
    let fakeUpdateMemberService = {
        updateMember : jasmine.createSpy('updateMember'),

    };
    let fakeIBCPersonalDataService = {
        getPersonalData : jasmine.createSpy('getPersonalData'),
        updatePersonalData : jasmine.createSpy('updatePersonalData')
    };

    let fakeIBCContactDataService = {
        getContactData : jasmine.createSpy('getContactData'),
        updateContactData: jasmine.createSpy()
    };

    let fakeIBCContactDetailsService = {
        getContactDetailsData : jasmine.createSpy('getContactDetailsData'),
        updateContactDetailsData : jasmine.createSpy('updateContactDetailsData')
    };

    let fakeModalServiceAncillaries = {
        openAncillariesErrorModal:  jasmine.createSpy()
    };

    let fakeUpdateSpecialNeedsTransformer = {
        transformUpdateSpecialNeeds: jasmine.createSpy()
    };

    let fakeUpdateApisRequestTransformer = {
        generateUpdateApisRequest: jasmine.createSpy()
    };

    let fakeUpdateDataContactDataTransformer = {
        transformUpdateDataContactData: jasmine.createSpy()
    };

    let fakeApisFormTransformer = {
        transformApisForm: jasmine.createSpy()
    };

    const fakeMemeberDetails = [
        {
            data: {
                termsAndConditions: {
                    version: 'version',
                    acceptedDate: 'acceptedDate'
                },
                person: {
                    emailAddress: {
                        email: 'email'
                    }
                }
            }
        }
    ];

    const dataGenerteMemberDate  = {
        basicInfo: {
            birthDate: {
                year: 'year',
                month: 'month',
                day: 'day'
            },
            gender: 'gender',
            nationality: 'nationality',
            homeCountry: 'homeCountry'
        }
    };

    const travelPreferencesData = {
        check_chair: {$modelValue: true},
        accessible_wheelchair: {$modelValue: 'WCHR'},
        check_vision: {$modelValue: true},
        check_hearing: {$modelValue: true},
        check_dog: {$modelValue: true}
    };

    let fakeLocation = {
        'path': jasmine.createSpy()
    };

    const fakeHeaderModel = {
        headerModel: {
            shoppingBasket: {
                seats: {
                    segments: [
                        {
                            segmentId: 'segmentId',
                            seats: [
                                {
                                    passengers: [
                                        {
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    hasSeats: true
                }
            }
        }
    }
    const fakeBreakdownInfo = {
        pendingPaymentItems: [
            {
                segments: [
                    {
                        id: 'segmentId',
                        passengers: [
                            {
                                id: 'passengerId',
                                seat: {}
                            }
                        ]
                    }
                ]
            }
        ],
        freeItems: [
            {
                segments: [
                    {
                        id: 'segmentId',
                        passengers: [
                            {
                                id: 'passengerId',
                                seat: {}
                            }
                        ]
                    }
                ]
            }
        ],
        issuedItems: [
            {
                segments: [
                    {
                        id: 'segmentId',
                        passengers: [
                            {
                                id: 'passengerId',
                                seat: {}
                            }
                        ]
                    }
                ]
            }
        ],
        context: {
            passengers: [
                {
                    id: 'passengerId'
                }
            ]
        }
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-booking-management-module', 'ib-MmB-booking-dashboard-module', 'LocalStorageModule', 'ib-MmB-services-module', 'ib-MmB-modal-module', 'ib-MmB-filters-module', 'ngCookies', ($provide) => {
            $provide.value('BookingManagementService', fakeBookingManagementService);
            $provide.value('BookingDashboardTransformer', fakeBookingDashboardTransformer);
            $provide.value('ChangeOrderContactInfoService', fakeChangeOrderContactInfoService);
            $provide.value('ChangeOrderPersonalInfoService', fakeChangeOrderPersonalInfoService);
            $provide.value('MmBGetPrefixesService', fakeMmBGetPrefixesService);
            $provide.value('CallApisFormService', fakeCallApisFormService);
            $provide.value('FrequentFlyersCompaniesService', fakeFrequentFlyersCompaniesService);
            $provide.value('CountriesListService', fakeCountriesListService);
            $provide.value('StatesListService', fakeStatesListService);
            $provide.value('ChangePassengerSpecialNeedsService', fakeChangePassengerSpecialNeedsService);
            $provide.value('BookingSearchService', fakeBookingSearchService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBTokenProxy', fakeMmBTokenProxy);
            $provide.value('AncillariesTransformer', fakeAncillariesTransformer);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('CommonsAncillariesService', fakeCommonsAncillariesService);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('ibPlusContactDetailsService', fakeibPlusContactDetailsService);
            $provide.value('IBCTravelPreferencesService', fakeIBCTravelPreferencesService);
            $provide.value('IBCTripDocumentsService', fakeIBCTripDocumentsService);
            $provide.value('UpdateMemberService', fakeUpdateMemberService);
            $provide.value('updateMember', fakeUpdateMemberService);
            $provide.value('IBCPersonalDataService', fakeIBCPersonalDataService);
            $provide.value('IBCContactDataService', fakeIBCContactDataService);
            $provide.value('IBCContactDetailsService', fakeIBCContactDetailsService);
            $provide.value('$location', fakeLocation);
            $provide.value('ModalServiceAncillaries', fakeModalServiceAncillaries);
            $provide.value('UpdateSpecialNeedsTransformer', fakeUpdateSpecialNeedsTransformer);
            $provide.value('UpdateApisRequestTransformer', fakeUpdateApisRequestTransformer);
            $provide.value('UpdateDataContactDataTransformer', fakeUpdateDataContactDataTransformer);
            $provide.value('ApisFormTransformer', fakeApisFormTransformer);
        });
        inject((_BookingDashboardService_, _localStorageService_, $rootScope) => {
            BookingDashboardService = _BookingDashboardService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
        });
        rootScope.timeSession = { 'startTime': {} };
    });


    describe('when initializeDashboard() is called with bookingInfo loaded', () => {
        it('Should return bookingInfoTransformed correctly', () => {
            localStorageService.set('bookingInfo', fakeInputBookingInfo);
            BookingDashboardService.initializeDashboard().then((data) => {
                //expect(data).toEqual(expectedInitializeDashboardOutputTest);
            });
            rootScope.$digest();
        });

        it('Should return bookingInfoTransformed correctly without add information ', () => {
            localStorageService.set('bookingInfo', fakeInputBookingInfo);
            BookingDashboardService.initializeDashboard().then(() => { }, (error) => {
                expect(error).toEqual(fakeOutputBookingInfo);
            });
            rootScope.$digest();
        });

        it('Should return bookingInfoTransformed correctly', (done) => {
            inject(($q) => {
                fakeBookingSearchService.searchFlightsPassengers = jasmine.createSpy('searchFlightsPassengers').and.callFake(({}) => {
                    let deferred = $q.defer();
                    deferred.resolve({});
                    return deferred.promise;
                });
            });
            localStorageService.set('checkinSurname', 'test');
            localStorageService.set('PNR', 'FFXXAA');
            localStorageService.set('bookingInfoLight', false);
            localStorageService.set('bookingInfo', null);
            BookingDashboardService.initializeDashboard().then((data) => {
                expect(data).toEqual({
                    'insurance': '',
                    'selectedInsurance': ''});
            });
            rootScope.$digest();
            done();
        });

        it('Should reject', () => {
            inject(($q) => {
                fakeBookingSearchService.searchFlightsPassengers = jasmine.createSpy('searchFlightsPassengers').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject(null);
                    return deferred.promise;
                });
                localStorageService.set('checkinSurname', true);
                localStorageService.set('PNR', true);
            });
            
            localStorageService.remove('bookingInfo');
            BookingDashboardService.initializeDashboard().then((data) => { }, (error) => {
                expect(error).toEqual(null);
            });
            rootScope.$digest();
        });

        it('Should searchFlightsPassengers resolve and remove bookingInfoLight', () => {
            inject(($q) => {
                fakeMmBUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.returnValue(false);
            });
            spyOn(fakeLocation, 'path');
            localStorageService.set('checkinSurname', false);
            localStorageService.set('PNR', false);
            localStorageService.set('bookingInfoLight', false);
            localStorageService.remove('bookingInfo');

            BookingDashboardService.initializeDashboard().then((data) => {
                expect(fakeLocation.path).toHaveBeenCalled();
            });
            rootScope.$digest();
        });
    });

    describe('when recoverDashboardDataAfterLogin() is called with bookingInfo loaded', () => {
        it('Should call recoverDashboardDataAfterLogin correctly', () => {
            inject(($q) => {
                localStorageService.set('bookingInfo', fakeInputBookingInfo);
                localStorageService.set('selectInsurance', {});
                localStorageService.set('insuranceSelected', 'insuranceSelected');
            });
            const fakeRecoverDashboardDataAfterLogin = {
                insurance: 'insuranceSelected',
                selectedInsurance: 'insuranceSelected'
            };
            const result = BookingDashboardService.recoverDashboardDataAfterLogin();
            expect(result).toEqual(fakeRecoverDashboardDataAfterLogin);
            rootScope.$digest();
        });
    });

    describe('when updateDataContactInfo() is called with bookingInfo loaded', () => {
        it('Should set dataContactInfo correctly', () => {
            inject(($q) => {
                fakeBookingDashboardTransformer.transformUpdateDataContactData = jasmine.createSpy('transformUpdateDataContactData').and.callFake(() => {
                    return fakePassengerContactInfoOutputFrequentFlyer;
                }),
                    fakeChangeOrderContactInfoService.changeOrderContactInfo = jasmine.createSpy('changeOrderContactInfo').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.resolve('test');
                        return deferred.promise;
                    });
            });
            BookingDashboardService.updateDataContactInfo(fakeflowId, fakeOutputBookingInfo.passengersModel, fakeTypePassenger[0]).then((data) => {
                expect(data).toEqual('test');
            });
            rootScope.$digest();
        });

        it('Should reject', () => {

            inject(($q) => {
                fakeBookingDashboardTransformer.transformUpdateDataContactData = jasmine.createSpy('transformUpdateDataContactData').and.callFake(() => {
                    return fakePassengerContactInfoOutputFrequentFlyer;
                }),
                    fakeChangeOrderContactInfoService.changeOrderContactInfo = jasmine.createSpy('changeOrderContactInfo').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.reject('test');
                        return deferred.promise;
                    });
            });
            BookingDashboardService.updateDataContactInfo(fakeflowId, fakeOutputBookingInfo.passengersModel, fakeTypePassenger[0]).then((data) => { }, (error) => {
                expect(error).toEqual('test');
            });
            rootScope.$digest();
        });
    });

    describe('when updateDataPersonalInfo ()', () => {
        it('is called and promise is success', (done) => {
            inject(($q) => {
                localStorageService.set('contactDataInfo', {});
                fakeChangeOrderPersonalInfoService.changeOrderPersonalInfo = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('ok');
                    return deferred.promise;
                });
            });
            const passengerPersonalInfo = {
                passengerId: 'passengerId',
                personalInfo: {}
            };
            BookingDashboardService.updateDataPersonalInfo('', passengerPersonalInfo, 'personalInfo').then((data) => {
                expect(data).toEqual('ok');
                done();
            });
            rootScope.$digest();
        });

        it('is called and promise is reject', (done) => {
            inject(($q) => {
                localStorageService.set('contactDataInfo', {});
                fakeChangeOrderPersonalInfoService.changeOrderPersonalInfo = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            const passengerPersonalInfo = {
                passengerId: 'passengerId',
                personalInfo: {}
            };
            BookingDashboardService.updateDataPersonalInfo('', passengerPersonalInfo, 'personalInfo').catch((data) => {
                expect(data).toEqual('ko');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when transformUpdateDataPersonalData()', () => {
        it('is called', () => {
            const passengerPersonalInfo = {
                passengerId: 'passengerId',
                personalInfo: {}
            };
            const fakeOrderPersonalInfo = {
                passengerId: 'passengerId',
                personalInfo: {}
            };
            const result = BookingDashboardService.transformUpdateDataPersonalData(passengerPersonalInfo, 'personalInfo');
            expect(result).toEqual(fakeOrderPersonalInfo);
            rootScope.$digest();
        });
    });

    describe('when updatePassengerSpecialNeeds() is called with bookingInfo loaded', () => {
        it('Should set dataSpecialNeeds correctly', () => {
            inject(($q) => {
                fakeUpdateSpecialNeedsTransformer.transformUpdateSpecialNeeds = jasmine.createSpy('transformUpdateSpecialNeeds').and.callFake(() => {
                    return fakeSpecialNeedsOutput;
                }),
                fakeChangePassengerSpecialNeedsService.changePassengerSpecialNeedsServiceInfo = jasmine.createSpy('changeOrderContactInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('test');
                    return deferred.promise;
                });
            });
            const passenger = {passengerId: 'passengerId'};
            BookingDashboardService.updatePassengerSpecialNeeds(fakeflowId, passenger).then((data) => {
                expect(data).toEqual('test');
            });
            rootScope.$digest();
        });

        it('Should reject', () => {
            inject(($q) => {
                fakeUpdateSpecialNeedsTransformer.transformUpdateSpecialNeeds = jasmine.createSpy('transformUpdateSpecialNeeds').and.callFake(() => {
                    return fakeSpecialNeedsOutput;
                }),
                fakeChangePassengerSpecialNeedsService.changePassengerSpecialNeedsServiceInfo = jasmine.createSpy('changeOrderContactInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('test');
                    return deferred.promise;
                });
            });
            const passenger = {passengerId: 'passengerId'};
            BookingDashboardService.updatePassengerSpecialNeeds(fakeflowId, passenger).then((data) => { }, (error) => {
                expect(error).toEqual('test');
            });
            rootScope.$digest();
        });
    });

    describe('when callApisService() is called with bookingInfo loaded', () => {
        it('Should set apisFormInfo,companiesList,countriesList and statesList correctly', () => {
            inject(($q) => {
                fakeBookingDashboardTransformer.transformApisForm = jasmine.createSpy('transformApisForm').and.callFake(() => {
                    return 'test';
                });
                fakeCallApisFormService.getApisInfo = jasmine.createSpy('getApisInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
                fakeFrequentFlyersCompaniesService.getFrequentFlyersCompaniesPromised = jasmine.createSpy('getFrequentFlyersCompaniesPromised').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
                fakeCountriesListService.getCountriesList = jasmine.createSpy('getCountriesList').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
                fakeStatesListService.getStatesList = jasmine.createSpy('getStatesList').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
            });
            BookingDashboardService.callApisService(fakeflowId, fakepassId).then((data) => {
                // expect(data).toEqual('test');
            });
            rootScope.$digest();
        });

        it('Should reject', () => {
            inject(($q) => {
                fakeBookingDashboardTransformer.transformApisForm = jasmine.createSpy('transformApisForm').and.callFake(() => {
                    return 'test';
                });
                fakeCallApisFormService.getApisInfo = jasmine.createSpy('getApisInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
                fakeFrequentFlyersCompaniesService.getFrequentFlyersCompaniesPromised = jasmine.createSpy('getFrequentFlyersCompaniesPromised').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
                fakeCountriesListService.getCountriesList = jasmine.createSpy('getCountriesList').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
                fakeStatesListService.getStatesList = jasmine.createSpy('getStatesList').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('error');
                    return deferred.promise;
                });
            });
            BookingDashboardService.callApisService(fakeflowId, fakepassId).then((data) => { }, (error) => {
                expect(error).toEqual('error');
            });
            rootScope.$digest();
        });
    });

    describe('when updateApisInfo() is called with bookingInfo loaded', () => {
        it('Should call updateApisInfo correctly', () => {
            inject(($q) => {
                fakeBookingDashboardTransformer.generateUpdateApisRequest = jasmine.createSpy('generateUpdateApisRequest').and.callFake(() => {
                    return 'test';
                })
                fakeCallApisFormService.updateApisInfo = jasmine.createSpy('updateApisInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
            });
            BookingDashboardService.updateApisInfo(fakeflowId, fakepassApisInfo, fakepassId, fakeEmergencyContactInfo, fakepassengers).then((data) => {
                // expect(data).toEqual(undefined);
            });
            rootScope.$digest();
        });

        it('Should call updateApisInfo correctly', () => {
            inject(($q) => {
                fakeBookingDashboardTransformer.generateUpdateApisRequest = jasmine.createSpy('generateUpdateApisRequest').and.callFake(() => {
                    return 'test';
                })
                fakeCallApisFormService.updateApisInfo = jasmine.createSpy('updateApisInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('error');
                    return deferred.promise;
                });
            });
            BookingDashboardService.updateApisInfo(fakeflowId, fakepassApisInfo, fakepassId, fakeEmergencyContactInfo, fakepassengers).then((data) => { },
                (error) => {
                    expect(error).toEqual('error');
                });
            rootScope.$digest();
        });
    });

    describe('updateAncillariesInfo call', () =>{
        it('Should else case', (done) => {
            localStorageService.set('hasSelectedInsurance', true);
            BookingDashboardService.updateAncillariesInfo({},{},null);
            rootScope.$digest();
            expect(localStorageService.get('hasSelectedInsurance')).toEqual(false);
            done();
        });
        it('Should call correctly', (done) => {
            let dataResponse = [{code:'test'}];
            inject(($q) => {
                fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve(dataResponse);
                    return deferred.promise;
                });
                fakeAncillariesTransformer.buildAncillariesRequest = jasmine.createSpy().and.callFake(() => {
                    return [{}];
                });
                fakeCountriesListService.getCountriesList = jasmine.createSpy('getCountriesList').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve(dataResponse);
                    return deferred.promise;
                });
                fakeStatesListService.getStatesList = jasmine.createSpy('getStatesList').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve(dataResponse);
                    return deferred.promise;
                });
                fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getAncillarieSummary').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve(dataResponse);
                    return deferred.promise;
                });
                localStorageService.set('insuranceAllianzFusionPassengerInfo', {type: 'test'});
            });
            
            BookingDashboardService.updateAncillariesInfo({},{},{})
                .then((data) => {
                    expect( localStorageService.get('breakdownInfo')).toEqual(dataResponse);
                    done();
                });
            rootScope.$digest();
        });
        it('Should reject', (done) => {
            inject(($q) => {
                fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
                fakeAncillariesTransformer.buildAncillariesRequest = jasmine.createSpy().and.callFake(() => {
                    return [{}];
                });
                fakeCountriesListService.getCountriesList = jasmine.createSpy('getCountriesList').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject();
                    return deferred.promise;
                });
                localStorageService.set('insuranceAllianzFusionPassengerInfo', null);
            });
            BookingDashboardService.updateAncillariesInfo({},{},{})
                .catch(() => {
                    done();
                });
            rootScope.$digest();
        });

        it('Should call other success', (done) => {
            let dataResponse = [];
            inject(($q) => {
                fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve(dataResponse);
                    return deferred.promise;
                });
                fakeAncillariesTransformer.buildAncillariesRequest = jasmine.createSpy().and.callFake(() => {
                    return [{code: 'test'}];
                });
                fakeCountriesListService.getCountriesList = jasmine.createSpy('getCountriesList').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve(dataResponse);
                    return deferred.promise;
                });
                fakeStatesListService.getStatesList = jasmine.createSpy('getStatesList').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve(dataResponse);
                    return deferred.promise;
                });
                fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getAncillarieSummary').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve(dataResponse);
                    return deferred.promise;
                });
                localStorageService.set('insuranceAllianzFusionPassengerInfo', null);
            });
            BookingDashboardService.updateAncillariesInfo({},{},null)
                .then((data) => {
                    expect( localStorageService.get('breakdownInfo')).toEqual(dataResponse);
                    done();
                });
            rootScope.$digest();
        });

        it('Should call other reject', (done) => {
            spyOn(fakeMmBModalService, 'showGenericError');
            let dataResponse = [];
            inject(($q) => {
                fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve(dataResponse);
                    return deferred.promise;
                });
                fakeAncillariesTransformer.buildAncillariesRequest = jasmine.createSpy().and.callFake(() => {
                    return [];
                });
                fakeCountriesListService.getCountriesList = jasmine.createSpy('getCountriesList').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject([]);
                    return deferred.promise;
                });
                fakeStatesListService.getStatesList = jasmine.createSpy('getStatesList').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve(dataResponse);
                    return deferred.promise;
                });
                fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getAncillarieSummary').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject({});
                    return deferred.promise;
                });
                localStorageService.set('insuranceAllianzFusionPassengerInfo', null);
            });

            BookingDashboardService.updateAncillariesInfo({},{},{})
                .catch(() => {
                    expect(fakeMmBModalService.showGenericError).toHaveBeenCalled();
                    done();
                });
            rootScope.$digest();
        });
    });

    describe('updateAncillarieSummary call', () =>{
        it('Should call correctly', (done) => {
            inject(($q) => {
                fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getAncillarieSummary').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('ok');
                    return deferred.promise;
                });
            });
            BookingDashboardService.updateAncillarieSummary()
                .then((data) => {
                    expect( localStorageService.get('breakdownInfo')).toEqual('ok');
                    done();
                });
            rootScope.$digest();
        });
        it('Should reject', (done) => {
            inject(($q) => {
                fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getAncillarieSummary').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            BookingDashboardService.updateAncillarieSummary()
                .then()
                .catch(() => {
                    done();
                });
            rootScope.$digest();
        });
    });

    describe('when updateContactDetails ()', () => {
        it('is called and promise is success', (done) => {
            inject(($q) => {
                localStorageService.set('contactDataInfo', {});
                fakeIBCContactDataService.updateContactData = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('ok');
                    return deferred.promise;
                });
            });
            BookingDashboardService.updateContactDetails({}).then((data) => {
                expect(data).toEqual('ok');
                done();
            });
            rootScope.$digest();
        });

        it('is called and promise is reject', (done) => {
            inject(($q) => {
                localStorageService.set('contactDataInfo', {});
                fakeIBCContactDataService.updateContactData = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            BookingDashboardService.updateContactDetails({}).catch((data) => {
                expect(data).toEqual('ko');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when getContactData ()', () => {
        it('is called and promise is success', (done) => {
            inject(($q) => {
                fakeIBCContactDataService.getContactData = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve({data:'ok'});
                    return deferred.promise;
                });
            });
            BookingDashboardService.getContactData().then((data) => {
                expect(data).toEqual('ok');
                done();
            });
            rootScope.$digest();
        });

        it('is called and promise is reject', (done) => {
            inject(($q) => {
                fakeIBCContactDataService.getContactData = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            BookingDashboardService.getContactData().catch((data) => {
                expect(data).toEqual('ko');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when getTravelPreferences ()', () => {
        it('is called and promise is success', (done) => {
            inject(($q) => {
                fakeIBCTravelPreferencesService.getTravelPreferences = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('ok');
                    return deferred.promise;
                });
            });
            BookingDashboardService.getTravelPreferences().then((data) => {
                expect(data).toEqual('ok');
                done();
            });
            rootScope.$digest();
        });

        it('is called and promise is reject', (done) => {
            inject(($q) => {
                fakeIBCTravelPreferencesService.getTravelPreferences = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            BookingDashboardService.getTravelPreferences().catch((data) => {
                expect(data).toEqual('ko');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when updateTravelPreferences ()', () => {
        it('is called and promise is success', (done) => {
            inject(($q) => {
                fakeIBCTravelPreferencesService.updateTravelPreferences = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('ok');
                    return deferred.promise;
                });
            });
            BookingDashboardService.updateTravelPreferences(travelPreferencesData, {}).then((data) => {
                expect(data).toEqual('ok');
                done();
            });
            rootScope.$digest();
        });

        it('is called and promise is reject', (done) => {
            inject(($q) => {
                fakeIBCTravelPreferencesService.updateTravelPreferences = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            BookingDashboardService.updateTravelPreferences(travelPreferencesData, {}).catch((data) => {
                expect(data).toEqual('ko');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when getIronSide ()', () => {
        it('is called case WCHR', () => {
            const result = BookingDashboardService.getIronSide('WCHR');
            expect(result).toEqual('01');
            rootScope.$digest();
        });
        it('is called case WCHS', () => {
            const result = BookingDashboardService.getIronSide('WCHS');
            expect(result).toEqual('02');
            rootScope.$digest();
        });
        it('is called case WCHC', () => {
            const result = BookingDashboardService.getIronSide('WCHC');
            expect(result).toEqual('03');
            rootScope.$digest();
        });
        it('is called other case', () => {
            const result = BookingDashboardService.getIronSide('');
            expect(result).toEqual('00');
            rootScope.$digest();
        });
    });

    describe('when getTripDocuments ()', () => {
        it('is called and promise is success', (done) => {
            inject(($q) => {
                fakeIBCTripDocumentsService.getTripDocuments = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('ok');
                    return deferred.promise;
                });
            });
            BookingDashboardService.getTripDocuments().then((data) => {
                expect(data).toEqual('ok');
                done();
            });
            rootScope.$digest();
        });

        it('is called and promise is reject', (done) => {
            inject(($q) => {
                fakeIBCTripDocumentsService.getTripDocuments = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            BookingDashboardService.getTripDocuments().catch((data) => {
                expect(data).toEqual('ko');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when addTripDocument()', () => {
        it('is called and promise is success', (done) => {
            inject(($q) => {
                fakeIBCTripDocumentsService.addTripDocument  = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('ok');
                    return deferred.promise;
                });
            });
            BookingDashboardService.addTripDocument(null).then((data) => {
                expect(data).toEqual('ok');
                done();
            });
            rootScope.$digest();
        });

        it('is called and promise is reject', (done) => {
            inject(($q) => {
                fakeIBCTripDocumentsService.addTripDocument  = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            BookingDashboardService.addTripDocument(null).catch((data) => {
                expect(data).toEqual('ko');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when modifyTripDocument ()', () => {
        it('is called and promise is success', (done) => {
            inject(($q) => {
                fakeIBCTripDocumentsService.modifyTripDocument  = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('ok');
                    return deferred.promise;
                });
            });
            BookingDashboardService.modifyTripDocument ({id: 'id'}).then((data) => {
                expect(data).toEqual('ok');
                done();
            });
            rootScope.$digest();
        });

        it('is called and promise is reject', (done) => {
            inject(($q) => {
                fakeIBCTripDocumentsService.modifyTripDocument  = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            BookingDashboardService.modifyTripDocument ({id: 'id'}).catch((data) => {
                expect(data).toEqual('ko');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when deleteTripDocument()', () => {
        it('is called and promise is success', (done) => {
            inject(($q) => {
                fakeIBCTripDocumentsService.deleteTripDocument = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('ok');
                    return deferred.promise;
                });
            });
            BookingDashboardService.deleteTripDocument(null).then((data) => {
                expect(data).toEqual('ok');
                done();
            });
            rootScope.$digest();
        });

        it('is called and promise is reject', (done) => {
            inject(($q) => {
                fakeIBCTripDocumentsService.deleteTripDocument = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            BookingDashboardService.deleteTripDocument(null).catch((data) => {
                expect(data).toEqual('ko');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when updateMember()', () => {
        it('is called and promise is success', (done) => {
            inject(($q) => {
                localStorageService.set('memeberDetails', fakeMemeberDetails);
                fakeUpdateMemberService.updateMember = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('ok');
                    return deferred.promise;
                });
            });
            BookingDashboardService.updateMember(dataGenerteMemberDate).then((data) => {
                expect(data).toEqual('ok');
                done();
            });
            rootScope.$digest();
        });

        it('is called and promise is reject', (done) => {
            inject(($q) => {
                localStorageService.set('memeberDetails', fakeMemeberDetails);
                fakeUpdateMemberService.updateMember = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            BookingDashboardService.updateMember(dataGenerteMemberDate).catch((data) => {
                expect(data).toEqual('ko');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when getPersonalData()', () => {
        it('is called and promise is success', (done) => {
            inject(($q) => {
                fakeIBCPersonalDataService.getPersonalData = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve({data:'ok'});
                    return deferred.promise;
                });
            });
            BookingDashboardService.getPersonalData().then((data) => {
                expect(data).toEqual('ok');
                done();
            });
            rootScope.$digest();
        });

        it('is called and promise is reject', (done) => {
            inject(($q) => {
                fakeIBCPersonalDataService.getPersonalData = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            BookingDashboardService.getPersonalData().catch((data) => {
                expect(data).toEqual('ko');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when updatePersonalData()', () => {
        it('is called and promise is success', (done) => {
            inject(($q) => {
                fakeIBCPersonalDataService.updatePersonalData = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('ok');
                    return deferred.promise;
                });
            });
            BookingDashboardService.updatePersonalData({}, null).then((data) => {
                expect(data).toEqual('ok');
                done();
            });
            rootScope.$digest();
        });

        it('is called and promise is reject', (done) => {
            inject(($q) => {
                fakeIBCPersonalDataService.updatePersonalData = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            BookingDashboardService.updatePersonalData({}, null).catch((data) => {
                expect(data).toEqual('ko');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when getContactDetailsData()', () => {
        it('is called and promise is success', (done) => {
            inject(($q) => {
                fakeIBCContactDetailsService.getContactDetailsData = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('ok');
                    return deferred.promise;
                });
            });
            BookingDashboardService.getContactDetailsData().then((data) => {
                expect(data).toEqual('ok');
                done();
            });
            rootScope.$digest();
        });

        it('is called and promise is reject', (done) => {
            inject(($q) => {
                fakeIBCContactDetailsService.getContactDetailsData = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            BookingDashboardService.getContactDetailsData().catch((data) => {
                expect(data).toEqual('ko');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when updateContactDetailsData()', () => {
        it('is called and promise is success', (done) => {
            inject(($q) => {
                fakeIBCContactDetailsService.updateContactDetailsData = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('ok');
                    return deferred.promise;
                });
            });
            const reqContactData = {};
            BookingDashboardService.updateContactDetailsData(reqContactData).then((data) => {
                expect(data).toEqual('ok');
                done();
            });
            rootScope.$digest();
        });

        it('is called and promise is reject', (done) => {
            inject(($q) => {
                fakeIBCContactDetailsService.updateContactDetailsData = jasmine.createSpy().and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('ko');
                    return deferred.promise;
                });
            });
            const reqContactData = {};
            BookingDashboardService.updateContactDetailsData(reqContactData).catch((data) => {
                expect(data).toEqual('ko');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when deleteAllInsurance()', () => {
        it('is called', () => {
            const model = {
                ancillariesInfo: {
                }
            };
            BookingDashboardService.deleteAllInsurance(model);
            rootScope.$digest();
        });
    });

    describe('when deleteAllBaggages()', () => {
        it('is called', () => {
            const model = {
                ancillariesInfo: {
                    passengerBaggagesTrips: [
                        {
                            trips: [
                                {
                                    pieces: [
                                        {}
                                    ]
                                }
                            ]
                        }
                    ]
                }
            };
            BookingDashboardService.deleteAllBaggages(model);
            rootScope.$digest();
        });
    });

    describe('when deleteAllSpeqs()', () => {
        it('is called', () => {
            const model = {
                ancillariesInfo: {
                    passengerSpeqsTrips: [
                        {
                            trips: [
                                {
                                    pieces: [
                                        {}
                                    ]
                                }
                            ]
                        }
                    ]
                }
            };
            BookingDashboardService.deleteAllSpeqs(model);
            rootScope.$digest();
        });
    });

    describe('when deleteAllPriorityBoarding()', () => {
        it('is called', () => {
            const model = {
                ancillariesInfo: {
                    priorityBoardingInfo: {
                        info: [
                            {
                                trips: [
                                    {
                                        checkedTrip: true
                                    }
                                ]
                            }
                        ]
                    }
                }
            };
            BookingDashboardService.deleteAllPriorityBoarding (model);
            rootScope.$digest();
        });
    });

    describe('when deleteAllSeats() is called', () => {
        it('and !seatsSelectedInfoData', (done) => {
            localStorageService.set('headerModel', fakeHeaderModel);
            localStorageService.set('breakdownInfo', fakeBreakdownInfo);
            localStorageService.set('seatsSelectedInfoData', null);
            BookingDashboardService.deleteAllSeats();
            rootScope.$digest();
            done();
        });
    });
});
