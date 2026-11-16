describe('MmBDeleteBasketModalController test', () => {
    let controller, $rootScope, $scope, localStorageService, $controller, $q, timeout;

    let fake$uibModalInstance = {
        dismiss: jasmine.createSpy(),
        close: jasmine.createSpy(),
        result: { 'then': () => { } }
    }

    let fakeBookingDashboardModel = {
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
                    personalInfo: {
                        name: 'test',
                        surname: 'test',
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
        finishWaiting: jasmine.createSpy(),
        showWaitingModal: jasmine.createSpy(),
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(() => {
            return {
                result: $q.when()
            }
        })
    };

    let fakeMmBAncillariesUtilsService = {
        checkFailedPendingPayments: jasmine.createSpy(),
    };

    let fakeCommonsAncillariesService = {
        deleteAllAncillaries: jasmine.createSpy('deleteAllAncillaries').and.callFake(() => {
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        })
    };
    let fakeBookingDashboardService = {
        updateAncillarieSummary: jasmine.createSpy('updateAncillarieSummary').and.callFake(() => {
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        deleteAllSeats: jasmine.createSpy(),
        deleteAllInsurance: jasmine.createSpy(),
        deleteAllBaggages: jasmine.createSpy(),
        deleteAllSpeqs: jasmine.createSpy(),
        deleteAllPriorityBoarding: jasmine.createSpy(),
    };

    let fakeNewMainHeaderFacade = {
        'initHeader': jasmine.createSpy('initHeader').and.callFake(() => {
            return {
                onLogin: jasmine.createSpy(),
                onError: jasmine.createSpy(),
            }
         }),
    };


    beforeEach(() => {
        angular.mock.module('ib-MmB-modal-module', 'LocalStorageModule',  ($provide) => {
            $provide.value('$uibModalInstance', fake$uibModalInstance);
            $provide.value('MmBAncillariesUtilsService', fakeMmBAncillariesUtilsService);
            $provide.value('MmBModalService', fakeModalService);
            $provide.value('CommonsAncillariesService', fakeCommonsAncillariesService);
            $provide.value('BookingDashboardService', fakeBookingDashboardService);
            $provide.value('BookingDashboardModel', fakeBookingDashboardModel);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
        });
        inject((_$rootScope_, _localStorageService_, _$controller_, _$q_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $q = _$q_;
            localStorageService = _localStorageService_;
            $controller = _$controller_;
            controller = $controller('MmBDeleteBasketModalController', {
                $scope: $scope,
                $rootScope: $rootScope,
                localStorageService: localStorageService
            });

            controller.model = fakeBookingDashboardModel;

            $rootScope.$digest();
        });
    });
    describe('when activate is called ', () => {
        it('$onInit() is Called and resolve CommonsAncillariesService.deleteAllAncillaries()', (done) => {
            fakeCommonsAncillariesService.deleteAllAncillaries = jasmine.createSpy('deleteAllAncillaries').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve({failedToDelete: []});
                return deferred.promise;
            });
            controller.$onInit();
            $rootScope.$digest();
            expect(controller).toBeDefined();
            expect(fakeBookingDashboardService.deleteAllSeats).toHaveBeenCalled();
            expect(fakeBookingDashboardService.deleteAllInsurance).toHaveBeenCalledWith(controller.model);
            expect(fakeBookingDashboardService.deleteAllBaggages).toHaveBeenCalledWith(controller.model);
            expect(fakeBookingDashboardService.deleteAllSpeqs).toHaveBeenCalledWith(controller.model);
            expect(fakeBookingDashboardService.deleteAllPriorityBoarding).toHaveBeenCalledWith(controller.model);
            done();
        });
    });

    describe('when deleteAllAncillaries is called and reject promise', () => {
        it('deleteAncillaries() is Called and CommonsAncillariesService.deleteAllAncillaries() reject ', (done) => {
            fakeCommonsAncillariesService.deleteAllAncillaries = jasmine.createSpy('deleteAllAncillaries').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject({failedToDelete: []});
                return deferred.promise;
            })
            controller.deleteAncillaries();
            $rootScope.$digest();
            expect(controller.showLoading).toBe(false);
            expect(controller.error).toBe(true);
            done();
        });
    });

    describe('when accept is called ', () => {
        it('and error is false', (done) => {
            controller.error = false;
            controller.accept();
            expect(fake$uibModalInstance.close).toHaveBeenCalled();
            done();
        });
        it('and error is true', (done) => {
            controller.error = true;
            controller.accept();
            expect(fake$uibModalInstance.close).toHaveBeenCalled();
            done();
        });
    });



    xdescribe('when refreshAncillaries is called ', () => {
        it('and updateAncillarieSummary resolve promise', (done) => {
            fakeBookingDashboardService.updateAncillarieSummary = jasmine.createSpy('updateAncillarieSummary').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
            controller.refreshAncillaries();
            done();
        });



        it('and updateAncillarieSummary resolve promise', (done) => {
            fakeBookingDashboardService.updateAncillarieSummary = jasmine.createSpy('updateAncillarieSummary').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject();
                return deferred.promise;
            });
            controller.refreshAncillaries();
            done();
        });

    });

});
