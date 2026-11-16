import angular from 'angular';
import { filterFake } from '../../../../../mocks/constants/filterTranslate-mock';
describe('MmBGenericModalController test', () => {
    let controller, $rootScope, $scope, localStorageService, $controller, object, $timeout, $document, $compile, $injector, localStorageGetSpy;
    let fakeMmBAppConstants = {
        MmBPatterns: {
            MAX_LENGTH_IBERIA_CARD: 8,
        },
        QUADRIGAM: {
            CONFIRM_SPECIAL_NEEDS_ADD: 'MOCPMR',
            CONFIRM_ADD_APIS: 'MOCAPI',
            CONFIRM_EMERGENCY_CONTACT: 'MOCEME',
            MODAL_SELECT_SEAT_JBA: 'SEATMPJBR',
            CONFIRM_FF: 'MOCFFL'
        },
        PHONESIBV: [{
            market: 'ES',
            phone: '+34 '
        }]
    };
    let fake$uibModalInstance = {
        dismiss: jasmine.createSpy(),
        close: jasmine.createSpy(),
        result: Promise.resolve()
    }
    let fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES:{
            VIEW: 'VIEW'
        },
        DIGITAL_DATA_PROCESS: {
            MOCFFL: 'MOCFFL',
            MOCAPI: 'MOCAPI',
            MOCEME: 'MOCEME',
            MOCPMR: 'MOCPMR'
        },
        DIGITAL_DATA_STEP: {
            MOCFFL: 'MOCFFL',
            MOCAPI: 'MOCAPI',
            MOCEME: 'MOCEME',
            MOCPMR: 'MOCPMR'
        }
    }
    let fakeWindow = {
        'open': function(){

        }
    }
    let fakeInitModel = {
        arrFrequentFlyerInfo:true,
        showError:false,
        submitted:false
    };
    let fakeConfirmModel = {
        arrFrequentFlyerInfo:true,
        showError:false,
        submitted:false,
        data: {
            name: 'Yos',
            phone: '0412',
            emailRepeat: 'yos@email.com',
            email: 'yos@email.com'
        },
        passengerApisInfo: {}
    };
    let fakeForm = {
        $valid:true
    };
    let fakeFormFailed = {
        $valid:false
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
        finishWaiting: jasmine.createSpy(),
        showGenericError:jasmine.createSpy().and.callFake(()=>{
            return {result: Promise.resolve('test')}
        })
    };
    let fakeMmBUtilService = {
        isUserLogged: jasmine.createSpy('isUserLogged').and.callFake(() => {
            return true;
        })
    };
    let fakeMmBUtilsSharedService = {
        generateRedirectionFormCancel: jasmine.createSpy()
    };
    let fakeObject = {};
    let fakefrequentFlyersCompanies=[{
        iataCompanyCode: 'IB',
        airlineName: 'Yosplane'
    }];
    let faketempFrequentFlyerInfoIB = {
        company: 'IB',
        number: '12345678'
    };
    let faketempFrequentFlyerInfoIBCARD9 = {
        company: 'IB',
        number: '123456789'
    };
    let faketempFrequentFlyerInfoIBH = {
        company: 'IBH',
        number: '123456789012345678901321'
    };
    let faketempFrequentFlyerInfoIBHCARD20 = {
        company: 'IBH',
        number: '12345678901234567890'
    };
    let fakeDatalayerUtilsService = {
        sendDatalayerModalEvent: jasmine.createSpy(),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDatalayerWithQuadrigam: jasmine.createSpy(),
        removeDatalayerModalAttrs: jasmine.createSpy().and.callFake(() => {
            return 'removeDatalayer'
        }),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy()
    };
    let fakeEvent = {
        preventDefault: function (){
        }
    };
    let fakeThirdPartyCompanies = {
        deeplinks: [
            {
                externalUrl: "https://www.ba.com",
                segmentId: "IB1234567890"
            }
        ],
        provider: "BA"
    };
    let fakeFlight = {
        operationalCarrier:{
            name: ' Yos'
        }
    };

    let fakeBookingSearchService = {
        searchFlightsPassengersEvent: jasmine.createSpy(),
    };

    let fakeRedirectionService = {
        externalRedirect: jasmine.createSpy(),
    };

    let fakeCommonsUtilService = {
        setTitlePage: jasmine.createSpy(),
    };
    let fakeCancelIBVOrderService = {
        cancelIBVOrder: jasmine.createSpy().and.callFake(($timeout)=>{
           return Promise.resolve(() => {
                $timeout.flush()
           })
        })
    }

    let fakeResetMmbService = {
        deleteVolatileOffers: jasmine.createSpy().and.callFake(()=>{
            return Promise.resolve({})
        })
    };

    let fakeCommonsSessionStorageService = {
        get: jasmine.createSpy('get').and.callFake((storage)=>{
            switch (storage) {
                case 'confirmationDatalayerInfo':
                    return {mercado: 'ES'}
                    break;
                default:
                    break;
            }
        })
    };

    let fakeBookingInfo = {
        passengers: [{
            personalInfo: {
                surname: 'testname'
            }
        }],
        order: {
            bookingReferences: [{
                reference: 'test'
            }]
        }
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-modal-module', 'LocalStorageModule', ($provide) => {
            $provide.value('$uibModalInstance', fake$uibModalInstance);
            $provide.value('object', fakeObject);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBModalService', fakeModalService);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('$window', fakeWindow);
            $provide.value('BookingSearchService', fakeBookingSearchService);
            $provide.value('RedirectionService', fakeRedirectionService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('CancelIBVOrderService', fakeCancelIBVOrderService);
            $provide.value('ResetMmbService', fakeResetMmbService);
            $provide.value('CommonsSessionStorageService', fakeCommonsSessionStorageService);
            $provide.value('$filter', filterFake);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
        });
        inject(( _$controller_, _$injector_, _$rootScope_, _object_, _$timeout_, _$document_, _$compile_) => {
            $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                clone[key] = _$injector_[key];
                return clone
            } , {});
            $rootScope = _$rootScope_;
            object = _object_;
            $scope = $rootScope.$new();
            $timeout = _$timeout_;
            $document = _$document_;
            $compile = _$compile_;
            localStorageService = $injector.get('localStorageService');
            $controller = _$controller_;
            localStorageGetSpy = spyOn(localStorageService, 'get');

            spyOn(localStorageService, 'set');
            localStorageGetSpy.withArgs('cvFlowInitialized').and.returnValue(true);
            localStorageGetSpy.withArgs('frequentFlyersCompanies').and.returnValue(fakefrequentFlyersCompanies);
            localStorageGetSpy.withArgs('bookingInfo').and.returnValue(fakeBookingInfo);

            controller = $controller('MmBGenericModalController', {
                object: object,
                $rootScope: $rootScope,
                localStorageService: localStorageService,
                $timeout: $timeout,
                $scope: $scope,
                $document: $document,
                $compile: $compile
            });
            controller.modalContactForm = {emailRepeat: {$setValidity: jasmine.createSpy()}};
        });
    });

    describe('when functions is called ', () => {
        it('and activate() is Called', (done) => {
            controller.model = fakeInitModel;
            controller.$onInit();
            $timeout.flush();
            expect(controller).toBeDefined();
            done();
        });

        it('and closeModal() is Called', (done) => {
            controller.model = fakeInitModel;
            controller.close();
            expect(controller).toBeDefined();
            done();
        });

        it('and redirect() is Called', (done) => {
            controller.model = fakeInitModel;
            controller.redirect('www.url.com');
            expect(controller).toBeDefined();
            done();
        });

        it('and cancelModal() is Called', (done) => {
            controller.model = fakeInitModel;
            controller.cancel();
            expect(controller).toBeDefined();
            done();
        });

        it('and acceptModal() is Called', (done) => {
            controller.model = fakeInitModel;
            controller.accept();
            expect(controller).toBeDefined();
            done();
        });

        it('and acceptModalData() is Called', (done) => {
            controller.model = fakeInitModel;
            controller.acceptModalData();
            expect(controller).toBeDefined();
            done();
        });

        it('and confirm() is Called with data defined', (done) => {
            controller.model = fakeConfirmModel;
            controller.confirm();
            expect(controller.model.generalError).toEqual(false);
            done();
        });

        it('confirm() is Called without data defined', (done) => {
            controller.model = fakeInitModel;
            controller.confirm();
            expect(controller.model.generalError).toEqual(true);
            done();
        });

        it('acceptForm() is Called', (done) => {
            controller.acceptForm(fakeForm);
            expect(controller).toBeDefined();
            done();
        });

        it('checked() is Called', (done) => {
            controller.checked(1);
            expect(controller).toBeDefined();
            done();
        });

        it('areEmailsEquals() is Called with email', (done) => {
            controller.model = fakeConfirmModel;
            controller.areEmailsEquals();
            expect(controller).toBeDefined();
            done();
        });
        it('areEmailsEquals() is Called without email', (done) => {
            controller.model = fakeConfirmModel;
            controller.model.data.email = undefined;
            controller.model.data.emailRepeat = undefined;
            controller.areEmailsEquals();
            expect(controller).toBeDefined();
            done();
        });
        it('goToCustomizeSpecialMeals() is Called', (done) => {
            controller.goToCustomizeSpecialMeals({});
            expect(controller).toBeDefined();
            done();
        });
        it('goToCustomizeSeats() is Called', (done) => {
            controller.goToCustomizeSeats({});
            expect(controller).toBeDefined();
            done();
        });

        it('goToCustomizeBaggage() is Called', (done) => {
            controller.goToCustomizeBaggage({});
            expect(controller).toBeDefined();
            done();
        });
        it('goToCustomize() is Called', (done) => {
            controller.goToCustomize();
            expect(controller).toBeDefined();
            done();
        });
        it('emitGoToPaymentPage() is Called', (done) => {
            controller.emitGoToPaymentPage();
            expect(controller).toBeDefined();
            done();
        });

        it('closeGoHome() is Called', (done) => {

            controller.closeGoHome();
            expect(controller).toBeDefined();
            done();
        });

        it('deletePendingAncillaries() is Called', (done) => {
            controller.deletePendingAncillaries();
            expect(controller).toBeDefined();
            done();
        });

        it('transformAsHTML() is Called', (done) => {
            controller.transformAsHTML();
            expect(controller).toBeDefined();
            done();
        });
        it('redirectModal() is Called', (done) => {
            controller.redirectModal(fakeEvent,fakeFlight,fakeThirdPartyCompanies);
            expect(controller).toBeDefined();
            done();
        });
        it('backStep() is Called', (done) => {
            controller.backStep(fakeForm);
            expect(controller).toBeDefined();
            done();
        });
        it('nextStep() is Called', (done) => {
            controller.nextStep(fakeForm,1);
            expect(controller.model.indexFormApis ).toEqual(1);
            expect(controller.model.showError ).toEqual(false);
            done();
        });
        it('nextStep() is Called with Form invalid', (done) => {
            controller.nextStep(fakeFormFailed,1);
            expect(controller.model.shouldLoad  ).toEqual(false);
            done();
        });

    });

    describe('when updatePassengerData is called ', () => {
        it('and type is frequentFlyer + tempFrequentFlyerInfo.company  === IB + number equal to 8', (done) => {
            controller.model = fakeConfirmModel;
            controller.model.passengerApisInfo = {
                existInfant: true
            }
            controller.tempFrequentFlyerInfo = faketempFrequentFlyerInfoIB;

            controller.updatePassengerData(fakeForm, 0, 'frequentFlyer');
            expect(controller.model.showError).toEqual(false);
            done();
        });
        it('and type is frequentFlyer + tempFrequentFlyerInfo.company === IB + number equal to 9', (done) => {
            controller.model = fakeConfirmModel;
            controller.model.passengerApisInfo = {}
            controller.tempFrequentFlyerInfo = faketempFrequentFlyerInfoIBCARD9;
            controller.updatePassengerData(fakeForm, 0, 'frequentFlyer');
            expect(controller.model.showError).toEqual(true);
            done();
        });
        it('and type is frequentFlyer + tempFrequentFlyerInfo.company === IBH + number equal to 21', (done) => {
            controller.model = fakeConfirmModel;
            controller.tempFrequentFlyerInfo = faketempFrequentFlyerInfoIBH;
            controller.updatePassengerData(fakeForm, 0, 'frequentFlyer');
            expect(controller.model.showError).toEqual(true);
            done();
        });
        it('and type is frequentFlyer + tempFrequentFlyerInfo.company === IBH + number equal to 20', (done) => {
            controller.model = fakeConfirmModel;
            controller.tempFrequentFlyerInfo = faketempFrequentFlyerInfoIBHCARD20;
            controller.updatePassengerData(fakeForm, 0, 'frequentFlyer');
            expect(controller.model.showError).toEqual(false);
            done();
        });
        it('and type is APIS + tempFrequentFlyerInfo.company === IBH + number equal to 20', (done) => {
            controller.model = fakeConfirmModel;
            controller.tempFrequentFlyerInfo = faketempFrequentFlyerInfoIBHCARD20;
            controller.updatePassengerData(fakeForm, 0, 'APIS');
            expect(controller.model.showError).toEqual(false);
            done();
        });
        it('and type is emergencyContact + tempFrequentFlyerInfo.company === IBH + number equal to 20', (done) => {
            controller.model = fakeConfirmModel;
            controller.tempFrequentFlyerInfo = faketempFrequentFlyerInfoIBHCARD20;
            controller.updatePassengerData(fakeForm, 0, 'emergencyContact');
            expect(controller.model.showError).toEqual(false);
            done();
        });
        it('and type is Yos + tempFrequentFlyerInfo.company === IBH + number equal to 20', (done) => {
            controller.model = fakeConfirmModel;
            controller.tempFrequentFlyerInfo = faketempFrequentFlyerInfoIBHCARD20;
            controller.updatePassengerData(fakeForm, 0, 'Yos');
            expect(controller.model.showError).toEqual(false);
            done();
        });

        it('and type is Yos + tempFrequentFlyerInfo.company === IBH + number equal to 20', (done) => {
            controller.model = fakeConfirmModel;
            controller.tempFrequentFlyerInfo = faketempFrequentFlyerInfoIBHCARD20;
            controller.updatePassengerData(fakeFormFailed, 0, 'Yos');
            expect(controller.model.showError).toEqual(true);
            done();
        });
    });

    describe('when closeMessageWithTimeoutApis is called ', () => {
        it('and apisShowOk is true', (done) => {
            controller.model = fakeConfirmModel;
            controller.closeMessageWithTimeoutApis(fakeEvent, true);
            expect(controller.model.shouldLoad).toEqual(false);
            expect(controller.model.showOk).toEqual(true);
            $timeout.flush();
            done();
        });
        it('and apisShowOk is false', (done) => {
            controller.model = fakeConfirmModel;
            controller.closeMessageWithTimeoutApis(fakeEvent, false);
            expect(controller.model.shouldLoad).toEqual(false);
            expect(controller.model.showError).toEqual(true);
            $timeout.flush();
            done();
        });

    });

    describe('when goToCustomizeSpeqs is called ', () => {
        it('and goToCustomizeSpeqs', (done) => {
            controller.goToCustomizeSpeqs({});
            expect(controller.goToCustomizeSpeqs).toBeDefined();
            done();
        });
    });

    describe('when retrieveReservation is called ', () => {
        it('and retrieveReservation', (done) => {
            localStorageGetSpy.withArgs('bookingInfo').and.returnValue(fakeBookingInfo);
            controller.retrieveReservation();
            //expect(fakeModalService.showWaitingModal).toHaveBeenCalled();
            done();
        });
        it('and retrieveReservation without bookingInfo', (done) => {
            localStorageGetSpy.withArgs('bookingInfo').and.returnValue(undefined);
            controller.retrieveReservation();
            //expect(fakeModalService.showWaitingModal).toHaveBeenCalled();
            done();
        });
    });

    describe('when redirectThisPage is called ', () => {
        it('and redirectThisPage', (done) => {
            let timeSession = {openedModal: true};
            $rootScope.timeSession = timeSession;
            let url = 'https://iberia.es';
            controller.redirectThisPage(url);
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalled();
            done();
        });
    });

    describe('when cancelIBV is called ', () => {
        it('and resolve promise', (done) => {
            controller.cancelIBV();
            expect(controller.cancelIBV).toBeDefined();
            done();
        });
    });
    describe('when cancelIBV is called ', () => {
        beforeEach(()=>{
            fakeCancelIBVOrderService.cancelIBVOrder = jasmine.createSpy().and.callFake(()=>{
                return Promise.reject({error: 'test'})
            })
        })
        it('and reject promise', (done) => {
            controller.cancelIBV();
            expect(fakeModalService.showGenericError).toBeDefined();
            done();
        });
        afterEach(()=>{
            fakeCancelIBVOrderService.cancelIBVOrder = jasmine.createSpy().and.callFake(($timeout)=>{
                return Promise.resolve(() => {
                    $timeout.flush()
               })
            })
        })
    });


});
