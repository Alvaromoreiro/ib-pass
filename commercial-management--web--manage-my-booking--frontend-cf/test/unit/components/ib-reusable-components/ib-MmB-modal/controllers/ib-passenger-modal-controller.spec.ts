import angular from "angular";
import { filterFake } from '@test/mocks/constants/filterTranslate-mock';

describe('MmBPassengerModalController test', () => {
    let controller, $rootScope, $scope, localStorageService, $controller, object, timeout, $q;
    let fakeMmBAppConstants = {
        QUADRIGAM: {
            CONFIRM_EMERGENCY_CONTACT: 'MOCEME',
            MODAL_CORRECTION_NAME: 'test',
            MODAL_CORRECTION_NAME_CONFIRMATION: 'test',
            MODAL_CORRECTION_NAME_ERROR: 'test'
        },
        SPECIAL_NEEDS: {
            SVAN_STATUS: {
                HK: { 'code': 'HK', 'description': 'SPECIAL_NEED_STATUS_HK' }, //Confirmado
                KK: { 'code': 'KK', 'description': 'SPECIAL_NEED_STATUS_HK' }, //Confirmado
                UC: { 'code': 'UC', 'description': 'SPECIAL_NEED_STATUS_XX' }, //Cancelado
                UN: { 'code': 'UN', 'description': 'SPECIAL_NEED_STATUS_XX' }, //Cancelado
                DEFAULT: { 'code': '', 'description': 'MMB_PASSENGERS_SPECIAL_NEEDS_STATUS' }, //Pendiente
            },
            CODE: {
                BLND: 'BLND',
                DEAF: 'DEAF',
                SVAN: 'SVAN',
                WHEEL_CHAIR: [
                    'WCHR',
                    'WCHS',
                    'WCHC'
                ]
            }
        },
        WARNING_MESSAGES: {
            CORRECTION_NAME_NOT_PERMITED: 'SSE_ORM_900562'
        }
    };
    let fake$uibModalInstance = {
        dismiss: jasmine.createSpy(),
        close: jasmine.createSpy(),
        result: { 'then': () => { } }
    }
    let fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES:{
            VIEW: 'VIEW'
        },
        DIGITAL_DATA_PROCESS: {
            MOCEME: 'test',
            test: 'test'
        },
        DIGITAL_DATA_STEP: {
            MOCEME: 'test',
            test: 'test'
        }
    }
    let fakeWindow = {
        'open': () => {},
        location: {
            origin: 'test'
        }
    }
    let fakeInitModel = {
        index: 0,
        arrFrequentFlyerInfo:true,
        showError:false,
        submitted:false,
        serviceData:{
            contactData:{
                primaryContactInfo:{
                    email: 'yos@email.com'
                }
            }
        },
        type: 'contactInfo',
        contactInfo :{
            email:'yos@email.com',
            phone:'12312321312321312',
            phoneType: 'MOBILE'
        },
        email:'yos@email.com',
        phone:'12312321312321312',
        originalData:{
            id:1,
            contactInfo :{
                email:'yos@email.com',
                phone:'12312321312321312'
            }
        },
        data:{
            id:1,
            contactInfo :{
                email:'yos@email.com',
                phone:'12312321312321312'
            }
        },
        specialNeeds:{
			specialGuideDogStatus: 'HK',
            specialVision:false,
            specialHearing:false,
            specialWheelchair: false,
            specialWheelchairValue: ''
        }
    };
    let fakeModalSpecialNeedsForm = {
        check_chair: {
            $setValidity: jasmine.createSpy('$setValidity')
        }
    };
    let fakeInitModelDistinct = {
        index : 0,
        arrFrequentFlyerInfo:true,
        showError:false,
        submitted:false,
        serviceData:{
            contactData:{
                primaryContactInfo:{
                    email: 'yos@email.com'
                }
            }
        },
        type: 'contactInfo',
        phoneDetails: {
            countryCode: '34',
            number: '12312321312321312'
        },
        countryCode: '34',
        contactInfo :{
            email:'yos@email.com',
            phone:'12312321312321312',
            language: 'es'
        },
        email:'yos@email.com',
        phone:'12312321312321312',
        originalData:{
            id:1
        },
        data:{
            contactInfo :{
                email:'yos@email.com',
                phone:'12312321312321312'
            }
        },
        passengersModelCopy:{
            passengers:[
                {
                    personalInfo: {
                        name: 'testname',
                        surname: 'test'
                    },
                    externalPersonalInfo: {
                        name: 'testname',
                        firstSurname: 'test',
                        lastSurname: 'test'
                    },
                    oldPassengerId: 'AD0',
                    passengerId: 'AD1',
                    emergencyContactInfo:{
                        contactInfo :{
                            email:'yos@email.com',
                            phone:'12312321312321312'
                        }
                    },
                    additionalFFInfo: {},
                    modifiedPersonalInfo: true
                }
            ]
        },
        bookingInfo:{
            passengers:[
                {
                    contactInfo :{
                        email:'yos@email.com',
                        phone:'12312321312321312'
                    },
                    additionalFFInfo: {}
                },
                {
                    contactInfo :{
                        email:'ab@ab.com',
                        phone:'12312321312321312'
                    },
                    additionalFFInfo: {}
                }
            ]
        },
        personalInfo: {
            name: 'testname',
            surname: 'test'
        },
        externalPersonalInfo: {
            name: 'testname',
            firstSurname: 'test',
            lastSurname: 'test'
        },
        oldPassengerId: 'AD0',
        passengerId: 'AD1',
        desactiveLastSurname: true
    };
    let fakeInitModelFF = {
        arrFrequentFlyerInfo:true,
        showError:false,
        submitted:false,
        serviceData:{
            contactData:{
                primaryContactInfo:{
                    email: 'yos@email.com'
                }
            }
        },
        type: 'contactInfo',
        contactInfo :{
            email:'yos@email.com',
            phone:'12312321312321312',
            phoneType: 'MOBILE'
        },
        email:'yos@email.com',
        phone:'12312321312321312',
        originalData:{
            passengerId:'AD1',
        },
        passengerId:'AD1',
        frequentFlyerInfo:{
            company: 'YosCompany',
            number: 1
        },
        data:{
            passengerId:'AD1',
            frequentFlyerInfo:{
                company: 'YosCompany',
                number: 1
            }
        },
        frequentFlyersCompanies:[
            {
                iataCompanyCode: 'YosCompany',
                airlineName: 'AIRYOS',
            }
        ]
    };
    let fakeInitModelSpecialNeeds = {
        arrFrequentFlyerInfo:true,
        showError:false,
        submitted:false,
        serviceData:{
            contactData:{
                primaryContactInfo:{
                    email: 'yos@email.com'
                }
            }
        },
        type: 'contactInfo',
        contactInfo :{
            email:'yos@email.com',
            phone:'12312321312321312',
            phoneType: 'MOBILE'
        },
        email:'yos@email.com',
        phone:'12312321312321312',
        originalData:{
            id:1
        },
        data:{
            id:1
        },
        specialNeeds:{
            specialVision:true,
            specialGuideDogStatus: 'HK',
            specialHearing:true,
            specialWheelchair:true,
            specialWheelchairValue:'WCHR',
            values: [
                {
                    serviceCode: 'BLND'
                }
            ]
        }
    };
    let fakeFrequentFlyerInfoNotIB21 = {
        company: 'IBH',
        number:'123456789012345678901'
    };
    let fakeFrequentFlyerInfoNotIB = {
        company: 'IBH',
        number:'1234567890123456789'
    };
    let fakeFrequentFlyerInfoIB10 = {
        company: 'IB',
        number:'1234567890'
    };
    let fakeFrequentFlyerInfoIB3 = {
        company: 'IB',
        number:'123'
    };
    let fakeForm = {
        $valid:true
    };
    let fakeFormFailed = {
        $valid:false
    };
    let fakeBookingInfo = {
        passengers:[
            {
                passengerId: 'AD1',
                personalInfo: {
                    name: 'testname',
                    surname: 'test',
                    birthDate: ''
                },
                externalPersonalInfo: {
                    name: 'testname',
                    firstSurname: 'test',
                    lastSurname: 'test',
                    birthDate: ''
                },
                contactInfo :{
                    email:'yos@email.com',
                    phone:'12312321312321312'
                },
                emergencyContactInfo:{
                    contactInfo :{
                        email:'yos@email.com',
                        phone:'12312321312321312'
                    }
                },
                modifiedPersonalInfo: true
            }
        ],
        order:{
            orderId:1
        }
    };
    let fakeModalService = {
        dismiss: jasmine.createSpy(),
        showWaitingModal: jasmine.createSpy(),
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(() => {
            return {
                result: {
                    then: angular.noop
                }
            };
        }),
    };
    let fakeMmBUtilsSharedService = {
        getPrefixFromMarket: jasmine.createSpy('getPrefixFromMarket').and.callFake(() => {
            return {code: 'es', countryCode: 'ES'};
        })
    };
    let fakeObject = {};
    let fakeSpecialNeedsPassengersEdit = [
        {
            test: 'test'
        }
    ];
    let fakeOrderItems = {
        order:{
            orderItems:[
                {
                    type:'arbi',
                    passengerId:'AD1',
                    serviceCode:'XX1'
                }
            ]
        }
    };
    let fakeDatalayerUtilsService = {
        sendDatalayerModalEvent: jasmine.createSpy(),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDatalayerWithQuadrigam: jasmine.createSpy(),
        removeDatalayerModalAttrs: jasmine.createSpy().and.callFake(() => {
            return 'removeDatalayer'
        }),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy()
    };

    let error = {
        messageList:[{
            message: 'Error Grande'
        }]
    };
    let errorMessage = {
        message: 'Error Grande'
    };
    let fakeBookingDashboardService = {
        updateDataContactInfo: jasmine.createSpy(),
        updatePassengerSpecialNeeds: jasmine.createSpy('updatePassengerSpecialNeeds').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({order: {orderItems:[{}]}});
            return deferred.promise;
        }),
        updateDataPersonalInfo: jasmine.createSpy(),
    };

    let fakeFfLocal =[
        {
            id:'AD1',
            allCompany:[]
        }
    ];
    let fakeLocalStorageService = {
        set: jasmine.createSpy(),
        get: jasmine.createSpy('get').and.callFake(function (key) {
            let value;
            switch (key){
                case 'bookingInfo':
                    value = fakeBookingInfo;
                    break;
                case 'flowId':
                    value = 'asdadasdadasdq123132asdaeqw3';
                    break;
                case 'ffLocal':
                    value = fakeFfLocal;
                    break;
                case 'specialNeedsPassengersEdit':
                    value = fakeSpecialNeedsPassengersEdit;
                    break;
                default:
                    value = '';
                    break;
            }
            return value;
        }),
    };

    let faketranslate = {
        'onReady': jasmine.createSpy(),
        'use': jasmine.createSpy('use').and.callFake(() => { })
    };

    let fakeCommonsUserUtilsService = {
        isSoftUser: jasmine.createSpy('isSoftUser').and.callFake(() => {
            return false;
        }),
        isIbZero: jasmine.createSpy('isIbZero').and.callFake(() => {
            return false;
        }),
    }

    let fakeCommonsUtilService = {
        setTitlePage: jasmine.createSpy(),
    }

    let fakePassengers: [
        {
            passengerId: 'AD1',
            personalInfo: {
                name: 'testname',
                surname: 'test',
                birthDate: ''
            },
            externalPersonalInfo: {
                name: 'testname',
                firstSurname: 'test',
                lastSurname: 'test',
                birthDate: ''
            },
            modifiedPersonalInfo: true
        }
    ];

    let fakeCustomerData = {
        personalInfo: {
            ibPlusNumber : '1234'
        }
    }

    beforeEach(() => {
        angular.mock.module('ib-MmB-modal-module', 'LocalStorageModule', ($provide) => {
            $provide.value('$uibModalInstance', fake$uibModalInstance);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('object', fakeObject);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBModalService', fakeModalService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
            $provide.value('$window', fakeWindow);
            $provide.value('BookingDashboardService', fakeBookingDashboardService);
            $provide.value('$filter', filterFake);
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('$translate', faketranslate);
            $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);

        });
        inject((_$rootScope_, _localStorageService_, _$controller_, _object_, $timeout, _$q_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            object = fakeInitModel;
            timeout = $timeout;
            $q = _$q_;
            localStorageService = _localStorageService_;
            $controller = _$controller_;

            controller = $controller('MmBPassengerModalController', {
                $scope: $scope,
                $rootScope: $rootScope,
                object: object,
                $timeout: timeout,
                $translate: faketranslate,
            });
            localStorageService.set('userLogged', true);
            localStorageService.set('bookingInfo', fakeBookingInfo);
            localStorageService.set('passengers', fakePassengers);
            localStorageService.set('customerData', fakeCustomerData);

            controller.modelOld = {values: [{serviceCode: 'WCHR'}]};
            $rootScope.$digest();
        });
    });

    describe('when functions is called ', () => {

        it('activate() is Called', (done) => {
            faketranslate.onReady = jasmine.createSpy('onReady').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
            controller.model = fakeInitModel;
            controller.model.specialNeeds = {specialGuideDogStatus: 'HK'};
            controller.model.type = 'contactInfo';
            controller.$onInit();
            $rootScope.$digest();
            expect(controller).toBeDefined();
            done();
        });

        it('checked() is Called', (done) => {
            controller.model = fakeInitModel;
            // spyOn($rootScope, '$emit');
            controller.model.specialNeeds = {}
            controller.model.specialNeeds.specialWheelchair = false;
            controller.modalSpecialNeedsForm = fakeModalSpecialNeedsForm;
            controller.checked(1);
            // expect(scope.$emit).toHaveBeenCalledWith('checkSpecialNeedsEvent', 1);
            expect(controller).toBeDefined();
            done();
        });

        it('closeModal() is Called', (done) => {
            controller.model = fakeInitModel;
            controller.showError = false;
            controller.submitted = false;
            controller.model.type = 'specialNeeds';
            controller.closeModal();
            expect(controller.submitted ).toEqual(false);
            expect(controller.showError).toEqual(false);
            done();
        });

        it('areEmailsEquals() is Called', (done) => {
            controller.model = fakeInitModel;
            controller.modalContactForm = {
                emailRepeat: {
                    $setValidity: jasmine.createSpy()
                }
            }
            controller.areEmailsEquals();
            expect(controller.hasEquals).toBeFalse();
            done();
        });

        it('model type is equal personalInfo', (done) => {
            faketranslate.onReady = jasmine.createSpy('onReady').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
            controller.model.type = 'personalInfo';
            controller.$onInit();
            $rootScope.$digest();
            done();
        });
    });

    describe('when updateEmergencyContactInfo is called ', () => {
        it('currentForm.$valid is false', (done) => {
            controller.model = fakeInitModel;
            controller.updateEmergencyContactInfo(fakeFormFailed);
            expect(controller.model.submitted).toEqual(false);
            // expect(controller.model.showError).toEqual(false);
            // expect(controller.model.showOk).toEqual(true);
            // timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.model.originalData === vm.model.data', (done) => {
            controller.model = fakeInitModel;
            controller.updateEmergencyContactInfo(fakeForm);
            expect(controller.model.showError).toEqual(false);
            expect(controller.model.showOk).toEqual(true);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.model.originalData !== vm.model.data', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModelDistinct;
            controller.updateEmergencyContactInfo(fakeForm);
            expect(controller.model.showError).toEqual(false);
            expect(controller.model.showOk).toEqual(false);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.model.originalData !== vm.model.data AND SERVICE FAILED WITH OUT ERROR MESSAGE', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject({});
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModelDistinct;
            controller.updateEmergencyContactInfo(fakeForm);
            expect(controller.model.showError).toEqual(false);
            expect(controller.model.showOk).toEqual(false);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.model.originalData !== vm.model.data AND SERVICE FAILED WITH ERROR MESSAGE', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject(error);
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModelDistinct;
            controller.updateEmergencyContactInfo(fakeForm);
            expect(controller.model.showError).toEqual(false);
            expect(controller.model.showOk).toEqual(false);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
    });

    describe('when updateDataContact is called ', () => {
        it('currentForm.$valid is false', (done) => {
            controller.model = fakeInitModel;
            controller.model.contactInfo = {
                phone:'12312321312321312',
                email:'yos@email.com',
                phoneDetails: null,
            };
            controller.updateDataContact(fakeFormFailed);
            expect(controller.model.submitted).toEqual(false);
            expect(controller.model.showOk).toEqual(false);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.model.contactInfo === valueChanged', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModel;
            controller.model.contactInfo = {
                phone:'12312321312321312',
                email:'yos@email.com',
                phoneDetails: null,
            };
            controller.updateDataContact(fakeForm);
            expect(controller.model.showErrorForm).toEqual(false);
            expect(controller.model.showOk).toEqual(false);
            expect(controller.model.submitted).toEqual(true);
            // timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.model.contactInfo !== valueChanged', (done) => {
            controller.model = fakeInitModelDistinct;
            controller.model.contactInfo = {
                phone:'3412312321312321312',
                phoneDetails: {countryCode: '34', number: '12312321312321312'},
                email:'yos@email.com',
                phoneType: 'MOBILE',
                idIbplus: null,
                countryCode: '34',
                language: 'es'
            };
            controller.updateDataContact(fakeForm);
            expect(controller.model.submitted).toEqual(false);
            expect(controller.model.showOk).toEqual(false);
            expect(controller.model.showErrorForm).toEqual(true);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.model.contactInfo !== valueChanged AND SERVICE FAILED WITH OUT ERROR MESSAGE', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject({});
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModelDistinct;
            controller.model.contactInfo = {
                phone:'12312321312321312',
                email:'yos@email.com',
                phoneDetails: null,
            };
            controller.updateDataContact(fakeForm);
            expect(controller.model.showError).toEqual(false);
            expect(controller.model.showOk).toEqual(false);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.model.contactInfo !== valueChanged AND SERVICE FAILED WITH ERROR MESSAGE', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject(error);
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModelDistinct;
            controller.updateDataContact(fakeForm);
            expect(controller.model.showError).toEqual(false);
            expect(controller.model.showOk).toEqual(false);
            timeout.flush();
            $rootScope.$digest();
            done();
        });

    });

    describe('when updatePersonalInfo is called ', () => {
        it('currentForm.$valid is true AND updateDataPersonalInfo resolve promise with personalInfo', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataPersonalInfo = jasmine.createSpy('updateDataPersonalInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve({data:{passengers:[{personalInfo: {name: 'testname', firstSurname: 'test', passengerId: 'AD1'}}]}});
                    return deferred.promise;
                });
            });
            localStorageService.set('passengers', fakePassengers);
            controller.model = fakeInitModelDistinct;
            controller.updatePersonalInfo(fakeForm);
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND updateDataPersonalInfo resolve promise with externalPersonalInfo', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataPersonalInfo = jasmine.createSpy('updateDataPersonalInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve({data:{passengers:[{externalPersonalInfo: {name: 'testname', firstSurname: 'test', passengerId: 'AD1'}}]}});
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModelDistinct;
            controller.updatePersonalInfo(fakeForm);
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND updateDataPersonalInfo reeject promise', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataPersonalInfo = jasmine.createSpy('updateDataPersonalInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject({errorCode: 412, internalErrorCode: fakeMmBAppConstants.WARNING_MESSAGES.CORRECTION_NAME_NOT_PERMITED, message: 'test/test'});
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModelDistinct;
            controller.updatePersonalInfo(fakeForm);
            $rootScope.$digest();
            expect(controller.model.showError).toBe(true);
            expect(controller.model.showOk).toBe(false);
            expect(controller.model.errorCode).toEqual(412);
            expect(controller.model.internalErrorCode).toEqual(fakeMmBAppConstants.WARNING_MESSAGES.CORRECTION_NAME_NOT_PERMITED);
            done();
        });
        it('currentForm.$valid is true AND updateDataPersonalInfo reject promise', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataPersonalInfo = jasmine.createSpy('updateDataPersonalInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject({errorCode: 400, internalErrorCode: 'testError'});
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModelDistinct;
            controller.updatePersonalInfo(fakeForm);
            $rootScope.$digest();
            expect(controller.model.showError).toBe(true);
            expect(controller.model.showOk).toBe(false);
            expect(controller.model.errorCode).toEqual(400);
            expect(controller.model.internalErrorCode).toEqual('testError');
            done();
        });
        it('currentForm.$valid is false', (done) => {
            controller.model = fakeInitModelDistinct;
            controller.updatePersonalInfo(fakeFormFailed);
            $rootScope.$digest();
            expect(controller.model.submitted).toBeFalse();
            expect(controller.model.showOk).toBeFalse();
            done();
        });
    });
    describe('when updateFrequentFlyerContactInfo is called ', () => {
        it('currentForm.$valid is false', (done) => {
            controller.model = fakeInitModel;
            controller.updateFrequentFlyerContactInfo(fakeFormFailed, 0,'frequentFlyer');
            expect(controller.model.submitted).toEqual(false);
            expect(controller.model.showOk).toEqual(false);
            expect(controller.model.showErrorForm).toEqual(true);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.tempFrequentFlyerInfo.company !== IB AND NUMBER ====21', (done) => {
            controller.model = fakeInitModel;
            controller.tempFrequentFlyerInfo = fakeFrequentFlyerInfoNotIB21;
            controller.updateFrequentFlyerContactInfo(fakeForm, 0,'frequentFlyer');
            expect(controller.model.submitted ).toEqual(false);
            expect(controller.model.showOk).toEqual(false);
            expect(controller.model.showErrorForm ).toEqual(true);
            expect(controller.model.showError  ).toEqual(true);
            expect(controller.model.showPatternError   ).toEqual(false);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.tempFrequentFlyerInfo.company !== IB AND NUMBER < 20 AND SERVICE FAILED', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject({});
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModel;
            controller.tempFrequentFlyerInfo = fakeFrequentFlyerInfoNotIB;
            controller.updateFrequentFlyerContactInfo(fakeForm, 0,'frequentFlyer');
            expect(controller.model.showErrorForm ).toEqual(false);
            expect(controller.model.showError  ).toEqual(false);
            expect(controller.model.showPatternError   ).toEqual(false);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.tempFrequentFlyerInfo.company !== IB AND NUMBER < 20 AND SERVICE FAILED WITH ERROR MESSAGE (MESSAGELIST)', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject(error);
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModel;
            controller.tempFrequentFlyerInfo = fakeFrequentFlyerInfoNotIB;
            controller.updateFrequentFlyerContactInfo(fakeForm, 0,'frequentFlyer');
            expect(controller.model.showErrorForm ).toEqual(false);
            expect(controller.model.showError  ).toEqual(false);
            expect(controller.model.showPatternError   ).toEqual(false);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.tempFrequentFlyerInfo.company !== IB AND NUMBER < 20 AND SERVICE FAILED WITH ERROR MESSAGE (MESSAGE)', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject(errorMessage);
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModel;
            controller.tempFrequentFlyerInfo = fakeFrequentFlyerInfoNotIB;
            controller.updateFrequentFlyerContactInfo(fakeForm, 0,'frequentFlyer');
            expect(controller.model.showErrorForm ).toEqual(false);
            expect(controller.model.showError  ).toEqual(false);
            expect(controller.model.showPatternError   ).toEqual(false);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.tempFrequentFlyerInfo.company !== IB AND NUMBER < 20 AND SERVICE SUCCESS', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModelFF;
            controller.tempFrequentFlyerInfo = fakeFrequentFlyerInfoNotIB;
            controller.updateFrequentFlyerContactInfo(fakeForm, 0,'frequentFlyer');
            expect(controller.model.showErrorForm).toEqual(false);
            expect(controller.model.showError).toEqual(false);
            expect(controller.model.showPatternError).toEqual(false);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.tempFrequentFlyerInfo.company === IB AND NUMBER 3 AND SERVICE SUCCESS', (done) => {
            controller.model = fakeInitModelFF;
            controller.tempFrequentFlyerInfo = fakeFrequentFlyerInfoIB3;
            controller.updateFrequentFlyerContactInfo(fakeForm, 0,'frequentFlyer');
            expect(controller.model.showErrorForm ).toEqual(true);
            expect(controller.model.showError  ).toEqual(true);
            expect(controller.model.showPatternError   ).toEqual(true);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND vm.tempFrequentFlyerInfo.company === IB AND NUMBER 10 AND SERVICE SUCCESS', (done) => {
            inject(() => {
                fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModelFF;
            controller.tempFrequentFlyerInfo = fakeFrequentFlyerInfoIB10;
            controller.updateFrequentFlyerContactInfo(fakeForm, 0,'frequentFlyer');
            expect(controller.model.showErrorForm).toEqual(false);
            expect(controller.model.showError).toEqual(false);
            expect(controller.model.showPatternError).toEqual(false);
            timeout.flush();
            $rootScope.$digest();
            done();
        });
    });
    describe('when updateSpecialNeedsContactInfo is called ', () => {
        it('currentForm.$valid is false and specialWheelchair is defined but specialWheelchairValue = null', (done) => {
            controller.model = fakeInitModel;
            controller.model.specialNeeds = {}
            controller.model.specialNeeds.specialWheelchair = true;
            controller.model.specialNeeds.specialWheelchairValue = null;
            controller.modalSpecialNeedsForm = fakeModalSpecialNeedsForm;
            controller.updateSpecialNeedsContactInfo(fakeFormFailed);
            expect(controller.model.submitted ).toEqual(true);
            // expect(controller.model.showError).toEqual(true);
            // expect(controller.model.showOk).toEqual(false);
            // expect(controller.model.showErrorForm).toEqual(true);
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is false', (done) => {
            controller.model = fakeInitModel;
            controller.model.specialNeeds = {}
            controller.model.specialNeeds.specialWheelchair = false;
            controller.model.specialNeeds.specialWheelchairValue = '';
            controller.modalSpecialNeedsForm = fakeModalSpecialNeedsForm;
            controller.updateSpecialNeedsContactInfo(fakeFormFailed);
            expect(controller.model.submitted ).toEqual(true);
            // expect(controller.model.showError).toEqual(true);
            // expect(controller.model.showOk).toEqual(false);
            // expect(controller.model.showErrorForm).toEqual(true);
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND SERVICE resolve promise', (done) => {
            inject(($q) => {
                fakeBookingDashboardService.updatePassengerSpecialNeeds = jasmine.createSpy('updatePassengerSpecialNeeds').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve({order: {orderItems:{}}});
                    return deferred.promise;
                });
            });
                
            controller.model = fakeInitModelSpecialNeeds;
            controller.model.specialNeeds = {}
            controller.model.specialNeeds.specialWheelchair = true;
            controller.model.specialNeeds.specialVision = true;
            controller.model.specialNeeds.specialIntellectual = true;
            controller.model.specialNeeds.specialHearing = true;
            controller.model.specialNeeds.specialGuideDog = true;
            controller.model.specialNeeds.specialWheelchairValue = 'WCHR';
            controller.model.specialNeeds.values = [{serviceCode: 'BLND'}, {serviceCode: 'DEAF'}, {serviceCode: 'SVAN'}, {serviceCode: 'WCHR'}, {serviceCode: 'WCHS'}, {serviceCode: 'WCHC'}];
            controller.modelOld = {values: [{serviceCode: 'WCHR'}]};
            controller.modalSpecialNeedsForm = fakeModalSpecialNeedsForm;
            controller.tempFrequentFlyerInfo = fakeFrequentFlyerInfoNotIB21;
            controller.updateSpecialNeedsContactInfo(fakeForm);
            expect(controller.model.showOk).toEqual(false);
            // expect(controller.model.showError).toEqual(false);
            $rootScope.$digest();
            done();
        });
        it('currentForm.$valid is true AND SERVICE FAILED reject', (done) => {
            inject(($q) => {
                fakeBookingDashboardService.updatePassengerSpecialNeeds = jasmine.createSpy('updatePassengerSpecialNeeds').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject({});
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModelSpecialNeeds;
            controller.model.specialNeeds = {}
            controller.model.specialNeeds.specialWheelchair = true;
            controller.model.specialNeeds.specialWheelchairValue = 'WCHR';
            controller.modelOld = {values: [{serviceCode: 'WCHR'}]}
            controller.modalSpecialNeedsForm = fakeModalSpecialNeedsForm;
            controller.tempFrequentFlyerInfo = fakeFrequentFlyerInfoNotIB21;
            controller.updateSpecialNeedsContactInfo(fakeForm);
            // expect(controller.model.showOk).toEqual(false);
            // expect(controller.model.showError).toEqual(false);
            // timeout.flush();
            $rootScope.$digest();
            done();
        });

        it('currentForm.$valid is true AND SERVICE FAILED (ERROR LIST)', (done) => {
            inject(($q) => {
                fakeBookingDashboardService.updatePassengerSpecialNeeds = jasmine.createSpy('updatePassengerSpecialNeeds').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject({messageList: [{message:'test'}] });
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModelSpecialNeeds;
            controller.model.specialNeeds = {}
            controller.model.specialNeeds.specialWheelchair = false;
            controller.model.specialNeeds.specialWheelchairValue = '';
            controller.modalSpecialNeedsForm = fakeModalSpecialNeedsForm;
            controller.tempFrequentFlyerInfo = fakeFrequentFlyerInfoNotIB21;
            controller.updateSpecialNeedsContactInfo(fakeForm);
            expect(controller.model.showOk).toEqual(false);
            expect(controller.model.showError).toEqual(false);
            // timeout.flush();
            $rootScope.$digest();
            done();
        });

        it('currentForm.$valid is true AND SERVICE FAILED (ERROR MESSAGE)', (done) => {
            inject(($q) => {
                fakeBookingDashboardService.updatePassengerSpecialNeeds = jasmine.createSpy('updatePassengerSpecialNeeds').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject(errorMessage);
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModelSpecialNeeds;
            controller.model.specialNeeds = {}
            controller.model.specialNeeds.specialWheelchair = false;
            controller.model.specialNeeds.specialWheelchairValue = '';
            controller.modalSpecialNeedsForm = fakeModalSpecialNeedsForm;
            controller.tempFrequentFlyerInfo = fakeFrequentFlyerInfoNotIB21;
            controller.updateSpecialNeedsContactInfo(fakeForm);
            expect(controller.model.showOk).toEqual(false);
            expect(controller.model.showError).toEqual(false);

            $rootScope.$digest();
            done();
        });

        it('currentForm.$valid is true AND SERVICE SUCCESS', (done) => {
            inject(($q) => {
                fakeBookingDashboardService.updatePassengerSpecialNeeds = jasmine.createSpy('updatePassengerSpecialNeeds').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve(fakeOrderItems);
                    return deferred.promise;
                });
            });
            controller.model = fakeInitModelSpecialNeeds;
            controller.model.specialNeeds = {}
            controller.model.specialNeeds.specialWheelchair = false;
            controller.model.specialNeeds.specialWheelchairValue = '';
            controller.modalSpecialNeedsForm = fakeModalSpecialNeedsForm;
            controller.tempFrequentFlyerInfo = fakeFrequentFlyerInfoNotIB21;
            controller.updateSpecialNeedsContactInfo(fakeForm);
            expect(controller.model.showOk).toEqual(false);
            expect(controller.model.showError).toEqual(false);
            $rootScope.$digest();
            done();
        });
    });
    describe('when checkStatusSVAN is called ', () => {
        it('status = UC', (done) => {
            expect(controller.checkStatusSVAN('UC')).toBe('denied');
            done();
        });
        it('status = HK', (done) => {
            expect(controller.checkStatusSVAN('HK')).toBe('approved');
            done();
        });
        it('status = HN', (done) => {
            expect(controller.checkStatusSVAN('HN')).toBe('pending');
            done();
        });
        it('status = other', (done) => {
            expect(controller.checkStatusSVAN('other')).toBeFalse();
            done();
        });
    });

     describe('When groupByKey() is called', () => {
        it('Should return the data of array', (done) => {
            let response, array1 = [{ 'A': 'A' }, { 'B': 'B' }, { 'C': 'C' }, { 'A': 'A' }]
            response = controller.groupByKey(array1, 'A');
            expect(response.A).toEqual([{ A: 'A' }, { A: 'A' }]);
            done();
        });
    });

});
