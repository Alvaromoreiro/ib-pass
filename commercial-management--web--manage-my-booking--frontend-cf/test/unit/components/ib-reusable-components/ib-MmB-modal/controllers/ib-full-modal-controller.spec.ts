describe('MmBFullModalController test', () => {
    var fake$uibModalInstance, fakeObject, fakeDatalayerUtilsService, $controller, $rootScope, $scope, controller, fakeMmBModalService,
        fakeBookingDashboardConstants, timeout, location, window, fakeBookingSearchService, localStorageService, fakeVoucherInformationService,
        fakeVoucherRefundConfirmationTransformer, fakeCashRefundService, fakeCashRefundConfirmationTransformer, fakeMmBUtilService, fakeLocation, $q;
    fake$uibModalInstance = {
        dismiss: jasmine.createSpy(),
        close: jasmine.createSpy(),
        result: { 'then': () => { } }
    };
    fakeLocation = {
        path: jasmine.createSpy('path').and.returnValue('/'),
        origin: 'replace'
    };
    fakeObject = {};
    fakeDatalayerUtilsService = {
        sendDatalayerErrorEvent: jasmine.createSpy(),
        removeDatalayerErrorAttrs: jasmine.createSpy().and.callFake(() => {
            return 'removeDatalayer'
        })
    };
    fakeMmBModalService = {
        closeAllCurrentModals: jasmine.createSpy().and.callFake(() => { return true }),
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(() => {
            return {
                result: $q.when({})
            };
        }),
        showWaitingModal: jasmine.createSpy(),
        finishWaiting: jasmine.createSpy(),
        showGenericError: jasmine.createSpy(),
    };
    fakeBookingDashboardConstants = {
        TABS: {
            management: 'managment',
            refunds: 'refunds'
        }
    };
    fakeBookingSearchService = {
        searchFlightsPassengersEvent: jasmine.createSpy()
    };
    fakeVoucherInformationService = {
        getVoucherConfirmationInfo: jasmine.createSpy('getVoucherConfirmationInfo').and.callFake(() => {
            var deferred = $q.defer();
            deferred.resolve(true);
            return deferred.promise;
        })
    };
    fakeVoucherRefundConfirmationTransformer = {
        generateConfirmationRefundRequest: jasmine.createSpy('generateConfirmationRefundRequest').and.callFake(() => {
            return {};
        }),
        generateVoucherData: jasmine.createSpy('generateVoucherData').and.callFake(() => {
            return {};
        })
    };
    fakeCashRefundService = {
        getCashRefundConfirmation: jasmine.createSpy('getCashRefundConfirmation').and.callFake(() => {
            var deferred = $q.defer();
            deferred.resolve(true);
            return deferred.promise;
        })
    };
    fakeCashRefundConfirmationTransformer = {
        generateCashConfirmationRequest: jasmine.createSpy('generateCashConfirmationRequest').and.callFake(() => {
            return {};
        }),
        generateCashConfirmationData: jasmine.createSpy('generateCashConfirmationData').and.callFake(() => {
            return {};
        })
    };
    fakeMmBUtilService = {
        removeAllParams: jasmine.createSpy('removeAllParams').and.callFake(() => {
            return {origin: 'replace'};
        })
    };

    let fakeMmBAppConstants = {
        PAGES_URL: {
            SEARCH: 'test'
        }
    }
    beforeEach(() => {
        angular.mock.module('ib-MmB-modal-module', 'LocalStorageModule', ($provide) => {
            $provide.value('$uibModalInstance', fake$uibModalInstance);
            $provide.value('object', fakeObject);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
            $provide.value('BookingSearchService', fakeBookingSearchService);
            $provide.value('VoucherInformationService', fakeVoucherInformationService);
            $provide.value('VoucherRefundConfirmationTransformer', fakeVoucherRefundConfirmationTransformer);
            $provide.value('CashRefundService', fakeCashRefundService);
            $provide.value('CashRefundConfirmationTransformer', fakeCashRefundConfirmationTransformer);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('$location', fakeLocation);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject((_$controller_, _$rootScope_, _localStorageService_, $timeout, $window, _$q_, $location) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            timeout = $timeout;
            $q = _$q_;
            location = $location;
            window = { scrollTo: jasmine.createSpy().and.callFake(() => { return true }), location: { origin: 'replace'} };
            localStorageService = _localStorageService_;
            controller = $controller('MmBFullModalController', {
                $scope: $scope,
                $rootScope: $rootScope,
                $timeout: timeout,
                $location: location,
                $window: window,
                localStorageService: _localStorageService_
            });
            $scope.$apply();
            $scope.$digest();
        });
    });
    describe('when modal is initialized', () => {
        it('and model is set', (done) => {
            expect(controller).toBeDefined();
            expect(controller.model).toBeDefined();
            done();
        });
        it('and activate is called with empty object', (done) => {
            controller.$onInit();
            timeout.flush();
            expect(controller.isCashFlow).toEqual(false);
            expect(controller.totalSteps).toEqual(2);
            done();
        });
        it('and activate is called with filled model', (done) => {
            controller.model = {
                totalSteps: 3,
                isCashFlow: true
            };
            controller.$onInit();
            expect(controller.isCashFlow).toEqual(true);
            expect(controller.totalSteps).toEqual(3);
            done();
        });
    });
    describe('when close method is called', () => {
        it('and model is empty', (done) => {
            controller.model.isDisruption = false;
            controller.currentStep = 2;
            controller.close();
            $scope.$digest();
            expect(location.path).toHaveBeenCalledWith('replace');
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalledWith();
            done();
        });
        it('and currentStep is 1', (done) => {
            controller.model.isDisruption = false;
            controller.currentStep = 1;
            controller.close();
            $scope.$digest();
            expect(fake$uibModalInstance.dismiss).toHaveBeenCalledWith('cancel');
            done();
        });
        it('and isDisruption exist, and currentStep is 1', (done) => {
            controller.model.isDisruption = true;
            controller.currentStep = 1;
            controller.close();
            $scope.$digest();
            expect(controller.isCashFlow).toEqual(false);
            expect(fake$uibModalInstance.dismiss).toHaveBeenCalledWith('cancel');
            done();
        });
        it('and isDisruption exist, and currentStep is 2', (done) => {
            controller.currentStep = 2;
            controller.model.isDisruption = true;
            controller.modelStep = [];
            controller.modelStep[0] = {};
            controller.modelStep[1] = {};
            controller.close();
            $scope.$digest();
            expect(controller.isCashFlow).toEqual(false);
            done();
        });
        it('and isDisruption exist, and currentStep is 3', (done) => {
            controller.currentStep = 3;
            controller.model.isDisruption = true;
            controller.modelStep = [];
            controller.modelStep[0] = {};
            controller.modelStep[1] = {};
            controller.close();
            $scope.$digest();
            expect(location.path).toHaveBeenCalledWith('replace');
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalledWith();
            done();
        });
    });
    describe('when showModalClose is called', () => {
        it('and tpl exist', (done) => {
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    result: $q.when('goHome')
                };
            });
            controller.model = {};
            controller.showModalClose('hola');
            $rootScope.$digest();
            expect($rootScope.blockedKeepAliveModal).toBe(false);
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalledWith(false, 'hola', {});
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
        it('and tpl is null', (done) => {
            controller.model = {};
            controller.showModalClose();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalledWith(false, 'generic-close-change-flight.html', {});
            done();
        });
    });
    describe('when showModalCloseAndGoToInitMMB event is called', () => {
        it('and openModal is true', (done) => {
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    result: $q.when('goHome')
                };
            });
            let openModal = true;
            controller.showModalCloseAndGoToInitMMB(openModal);
            $rootScope.$digest();
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
        it('and openModal is false', (done) => {
            let openModal = false;
            controller.showModalCloseAndGoToInitMMB(openModal);
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
    });
    describe('when showModalCloseAndReload event is called', () => {
        it('and openModal is true', (done) => {
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    result: $q.when('goHome')
                };
            });
            let openModal = true;
            controller.showModalCloseAndReload(openModal);
            $rootScope.$digest();
            expect($rootScope.blockedKeepAliveModal).toBe(false);
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
        it('and openModal is false', (done) => {
            let openModal = false;
            controller.showModalCloseAndReload(openModal);
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
    });
    describe('when proceedToVoucherNextStep event is called', () => {
        it('and resolve promise and nextStep is called', (done) => {
            fakeVoucherInformationService.getVoucherConfirmationInfo = jasmine.createSpy('getVoucherConfirmationInfo').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve({price: {fare: 30, currency: '€'} });
                return deferred.promise;
            });
            controller.modelStep = [];
            controller.currentStep = 1;
            controller.totalSteps = 3;
            $rootScope.$broadcast('proceedToVoucherNextStep');
            $rootScope.$digest();
            expect(fakeVoucherRefundConfirmationTransformer.generateVoucherData).toHaveBeenCalled();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });
        it('and reject promise and nextStep is called', (done) => {
            fakeVoucherInformationService.getVoucherConfirmationInfo = jasmine.createSpy('getVoucherConfirmationInfo').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject({errorCode: 409, internalErrorCode: 'SSE_ORM_9404'});
                return deferred.promise;
            });
            fakeMmBModalService.showGenericError = jasmine.createSpy('getVoucherConfirmationInfo').and.callFake(() => {
                return {
                    result: $q.when({})
                }
            });
            $rootScope.$broadcast('proceedToVoucherNextStep');
            $rootScope.$digest();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });
    });
    describe('when proceedToCashNextStep event is called', () => {
        it('and nextStep is called', (done) => {
            fakeCashRefundService.getCashRefundConfirmation = jasmine.createSpy('getCashRefundConfirmation').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
            $rootScope.$broadcast('proceedToCashNextStep');
            $rootScope.$digest();
            expect(fakeCashRefundConfirmationTransformer.generateCashConfirmationData).toHaveBeenCalled();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });
        it('and nextStep is called', (done) => {
            fakeCashRefundService.getCashRefundConfirmation = jasmine.createSpy('getCashRefundConfirmation').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject();
                return deferred.promise;
            });
            fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => {
                return {
                    result: $q.when({})
                };
            });
            $rootScope.$broadcast('proceedToCashNextStep');
            // expect(fakeCashRefundConfirmationTransformer.showGenericError).toHaveBeenCalled();
            // expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });
    });
    describe('when getStepModel event is called', () => {
        it('and getStepModel', (done) => {
            controller.modelStep = [];
            controller.modelStep[0] = {test:'test'};
            controller.getStepModel(1);
            expect(controller.modelStep[0]).toEqual({test:'test'});
            done();
        });
    });

    describe('when showModalCloseRefunds event is called', () => {
        it('and isDisruptions is true and currentStep = 1', (done) => {
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    result: $q.when({})
                };
            });
            controller.currentStep = 1;
            controller.model.isDisruption = true;
            controller.showModalCloseRefunds(true);
            $rootScope.$digest();
            expect($rootScope.blockedKeepAliveModal).toBe(false);
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
        it('and isDisruptions is true and currentStep = 3', (done) => {
            controller.currentStep = 3;
            controller.model.isDisruption = true;
            controller.showModalCloseRefunds(true);
            $rootScope.$digest();
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
        it('and isDisruptions is false and currentStep = 1', (done) => {
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    result: $q.when({})
                };
            });
            controller.model.isDisruption = false;
            controller.currentStep = 1;
            controller.showModalCloseRefunds(true);
            $rootScope.$digest();
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
        it('and isDisruptions is false and currentStep = 3', (done) => {
            controller.model.isDisruption = false;
            controller.currentStep = 3;
            controller.showModalCloseRefunds(true);
            $rootScope.$digest();
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
    });

    describe('when showModalCloseAndGoToIberia event is called', () => {
        it('and isDisruptions is true and currentStep = 1', (done) => {
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    result: $q.when('goHome')
                };
            });
            controller.currentStep = 1;
            controller.model.isDisruption = true;
            controller.showModalCloseAndGoToIberia(true);
            $rootScope.$digest();
            expect(location.path).toHaveBeenCalledWith('replace');
            expect($rootScope.blockedKeepAliveModal).toBe(false);
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
        it('and isDisruptions is true and currentStep = 3', (done) => {
            controller.currentStep = 3;
            controller.model.isDisruption = true;
            controller.showModalCloseAndGoToIberia(true);
            $rootScope.$digest();
            expect(location.path).toHaveBeenCalledWith('replace');
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
        it('and isDisruptions is false and currentStep = 1', (done) => {
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    result: $q.when('goHome')
                };
            });
            controller.model.isDisruption = false;
            controller.currentStep = 1;
            controller.showModalCloseAndGoToIberia(true);
            $rootScope.$digest();
            expect(location.path).toHaveBeenCalledWith('replace');
            expect($rootScope.blockedKeepAliveModal).toBe(false);
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
        it('and isDisruptions is false and currentStep = 3', (done) => {
            controller.model.isDisruption = false;
            controller.currentStep = 3;
            controller.showModalCloseAndGoToIberia(true);
            $rootScope.$digest();
            expect(location.path).toHaveBeenCalledWith('replace');
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
    });

    describe('when showModalCloseAndGoToLoginMMB event is called', () => {
        it('and showGenericModal called', (done) => {
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    result: $q.when('goHome')
                };
            });

            controller.showModalCloseAndGoToLoginMMB();
            $rootScope.$digest();
            expect($rootScope.blockedKeepAliveModal).toBe(false);
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
    });

    describe('when activateCashFlow event is called', () => {
        it('and activateCashFlow', (done) => {
            $rootScope.$broadcast('activateCashFlow', {});
            expect(controller.isCashFlow).toEqual(true);
            done();
        });
    });

});
