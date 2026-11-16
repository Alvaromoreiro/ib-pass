describe('MmBFlightReminderModalController test', () => {
    let controller, $rootScope, $scope, localStorageService, $controller, $q, timeout;

    let fakeMmBAppConstants = {

        QUADRIGAM: {
            ORDER_TICKETS: 'IBENIT',
            ORDER_TICKETS_CONFIRMATION: 'IBCENIT',
        },
        market: "ES"
    };
    let fake$uibModalInstance = {
        dismiss: jasmine.createSpy(),
        close: jasmine.createSpy(),
        result: { 'then': () => { } }
    };

    let fakeInitModel = {
        arrFrequentFlyerInfo:true,
        showError:false,
        submitted:false,
        passengersModel:{
            contactData:{
                primaryContactInfo:{
                    email: 'yos@email.com'
                }
            },
            passengers: [
                {
                    "personalInfo": {
                        "name": "Test",
                        "surname": "Test "
                    },
                    "contactInfo": {
                        "email": "abc@email.com"
                    }
                }
            ]
        },
        bookingGeneralInfo:{
            flowId:'12312321312321312'
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
        finishWaiting: jasmine.createSpy(),
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(() => {
            return {
                result: {
                    then: angular.noop
                }
            };
        }),
    };
    let fakeIbItinerarySendService = {
        itinerarySendServiceInfo: jasmine.createSpy('itinerarySendServiceInfo').and.callFake(() => {
            return Promise.resolve({});
        })
    }
    let fakeMmBUtilService = {
        isUserLogged: jasmine.createSpy('isUserLogged').and.callFake(() => {
            return true;
        }),
    }
    let fakeObject = {};
    let fakeDatalayerUtilsService = {
        sendDatalayerModalEvent: jasmine.createSpy(),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDatalayerWithQuadrigam: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        removeDatalayerModalAttrs: jasmine.createSpy().and.callFake(() => {
            return 'removeDatalayer'
        }),
        updateDatalayerInfo: jasmine.createSpy()
    };
    const fakeCommonsUtilService = {
        setTitlePage: jasmine.createSpy()
    }

    beforeEach(() => {
        angular.mock.module('ib-MmB-modal-module', 'LocalStorageModule', ($provide) => {
            $provide.value('$uibModalInstance', fake$uibModalInstance);
            $provide.value('object', fakeObject);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('IbItinerarySendService', fakeIbItinerarySendService);
            $provide.value('MmBModalService', fakeModalService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
        });
        inject((_$rootScope_, _localStorageService_, _$controller_, _object_, $timeout, _$q_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            timeout = $timeout;
            $q = _$q_;
            localStorageService = _localStorageService_;
            $controller = _$controller_;
            controller = $controller('MmBFlightReminderModalController', {
                $scope: $scope,
                $rootScope: $rootScope,
                localStorageService: localStorageService,
                object: fakeInitModel,
                $timeout: timeout
            });
        });
        controller.model = fakeInitModel;
    });

    describe('when functions is called ', () => {
        it('$onInit() is Called', (done) => {
            controller.$onInit();
            expect(controller).toBeDefined();
            done();
        });

        it('closeModal() is Called', (done) => {
            controller.close();
            expect(fake$uibModalInstance.close).toHaveBeenCalled();
            done();
        });

        it('sendMails() is Called and resolve itinerarySendServiceInfo', (done) => {
            controller.sendMails();
            expect(fakeIbItinerarySendService.itinerarySendServiceInfo).toHaveBeenCalled();
            expect(fakeDatalayerUtilsService.updateDatalayerInfo).toHaveBeenCalled();
            done();
        });


        it('addOtherEmails() is Called', (done) => {
            const arr = controller.addOtherEmails();
            expect(arr).toEqual([{ email: 'abc@email.com', checked: false }]);
            done();
        });

        it('changeSelected() is Called and return false', (done) => {
            controller.arrEmails = [{
                email: '',
                checked: false
            }];
            controller.changeSelected();
            expect(controller.allChecked).toBe(false);
            done();
        });

        it('changeSelected() is Called and return true', (done) => {
            controller.arrEmails = [{
                email: '',
                checked: true
            }];
            controller.changeSelected();
            expect(controller.allChecked).toBe(true);
            done();
        });

        it('changeAllSelected() is Called', (done) => {
            controller.arrEmails = [{
                email: '',
                checked: false
            }];
            controller.allChecked = true;
            controller.changeAllSelected();
            expect(controller.arrEmails[0].checked).toBe(true)
            done();
        });

        it('getDataMails() is Called', (done) => {

            controller.arrEmails = [];
            const obj = controller.getDataMails();
            expect(obj.emails.length).toBe(1);
            done();
        });

        it('getListMails() is Called', (done) => {
            controller.arrEmails = [{
                checked: true,
                email: 'test'
            }];
            const arr = controller.getListMails();
            expect(arr.length).toBe(2);
            done();
        });

        it('isNotPrincipalPassenger() and is same email is Called', (done) => {
            const passenger = { contactInfo: { email: 'yos@email.com' }};
            const isNotPrincipalPassenger = controller.isNotPrincipalPassenger(passenger);
            expect(isNotPrincipalPassenger).toBeFalse();
            done();
        });

        it('isNotPrincipalPassenger() and is different email is Called', (done) => {
            const passenger = { contactInfo: { email: 'yos2@email.com' }};
            const isNotPrincipalPassenger = controller.isNotPrincipalPassenger(passenger);
            expect(isNotPrincipalPassenger).toBeTrue();
            done();
        });

        it('isNotDuplicatedEmails() and find email is Called', (done) => {
            const emails = [{ email: 'yos@email.com' }];
            const passenger = { contactInfo: { email: 'yos@email.com' }};
            const isNotDuplicatedEmails = controller.isNotDuplicatedEmails(emails, passenger);
            expect(isNotDuplicatedEmails).toBeFalse();
            done();
        });

        it('isNotDuplicatedEmails() and not find email is Called', (done) => {
            const emails = [{ email: 'yos2@email.com' }];
            const passenger = { contactInfo: { email: 'yos@email.com' }};
            const isNotDuplicatedEmails = controller.isNotDuplicatedEmails(emails, passenger);
            expect(isNotDuplicatedEmails).toBeTrue();
            done();
        });
    });

    describe('when functions is called ', () => {
        beforeEach(()=> {
            fakeIbItinerarySendService.itinerarySendServiceInfo = jasmine.createSpy('itinerarySendServiceInfo').and.callFake(() => {
                return Promise.reject({});
            })
        });
        it('sendMails() is Called and reject itinerarySendServiceInfo', (done) => {
            controller.sendMails();
            expect(fakeIbItinerarySendService.itinerarySendServiceInfo).toHaveBeenCalled();
            expect(fakeDatalayerUtilsService.updateDatalayerInfo).toHaveBeenCalled();
            done();
        });
        afterEach(()=> {
            fakeIbItinerarySendService.itinerarySendServiceInfo = jasmine.createSpy('itinerarySendServiceInfo').and.callFake(() => {
                return Promise.resolve({});
            })
        });
    });
});
