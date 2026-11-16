describe('KeepAliveUtilService Test', () => {
    let KeepAliveUtilService, $window, interval, rootScope, localStorageService;

    let fakeMmBModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(angular.noop),
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(() => {
            return { result: { then: angular.noop } };
        }),
        finishWaiting: jasmine.createSpy('finishWaiting').and.callFake(angular.noop),
        showGenericError: jasmine.createSpy()
    };

    let fakeMmBUtilService = {
        initStorage: jasmine.createSpy()
    };

    let fakeCommonsKeepAliveService = {
        keepAlive: jasmine.createSpy()
    };

    let fakeCommercialInfo = {
        sessionTimeLifeInMinutes: 50
    };

    beforeEach(() => {
        angular.mock.module('ib-keep-alive-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('CommonsKeepAliveService', fakeCommonsKeepAliveService);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            // $provide.value('$window', windowFake);
        });
        inject((_KeepAliveUtilService_, _$window_, $rootScope, $interval, _localStorageService_) => {
            KeepAliveUtilService = _KeepAliveUtilService_;
            $window = _$window_;
            interval = $interval;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
        });
        
        rootScope.blockedKeepAliveModal = false;
        rootScope.timeSession = {
            startTime: 20,
            openedModal: false
        };
        localStorageService.set('flowId', 'test');
        localStorageService.set('retrieveReservation', false);
    });

    describe('When keepAliveInitMessage() is called', () => {
        beforeEach(() => {
            localStorageService.set('commercialInfo', { test: 'test' });
        });

        it('It must starts Keeps alive session checkers with 15 min default', (done) => {
            KeepAliveUtilService.keepAliveInitMessage();
            interval.flush(3000);
            expect(KeepAliveUtilService).toBeDefined();
            done();
        });
    });
    describe('When keepAliveInitMessage() is called', () => {
        beforeEach(() => {
            localStorageService.set('commercialInfo', fakeCommercialInfo);
        });

        it('It must starts Keeps alive session checkers', (done) => {
            KeepAliveUtilService.keepAliveInitMessage();
            interval.flush(3000);
            expect(KeepAliveUtilService).toBeDefined();
            done();
        });
    });


    describe('When showSessionModal() is called & openedModal is true', () => {
        beforeEach(() => {
            rootScope.timeSession = {
                startTime: 20,
                openedModal: true
            };
        });
        it('It must not show showSessionModal', (done) => {
            KeepAliveUtilService.showSessionModal();
            expect(fakeMmBModalService.showGenericModal).toBeDefined();
            done();
        });
    });

    describe('When showSessionModal() is called & openedModal is false', () => {
        beforeEach(() => {
            rootScope.timeSession = {
                openedModal: false
            };
        });
        it('It must not show showSessionModal', (done) => {
            KeepAliveUtilService.showSessionModal();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });
    });

    describe('When keepSessionAlive() is called', () => {
        beforeEach(() => {
            localStorageService.set('flowId', 'test');
            localStorageService.set('retrieveReservation', false);
            inject(($q) => {
                fakeCommonsKeepAliveService.keepAlive = jasmine.createSpy('keepAlive').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
            });
        });
        it('It must show showWaitingModal', (done) => {
            KeepAliveUtilService.keepSessionAlive();
            expect(fakeMmBModalService.showWaitingModal).not.toHaveBeenCalled();
            done();
        });
    });

    describe('When refreshTimeSession() is called', () => {
        beforeEach(() => {
            rootScope.timeSession = {
                openedModal: false
            };
        });
        it('It must show finishWaiting', (done) => {
            KeepAliveUtilService.refreshTimeSession();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });
    });

    describe('When refreshTimeSessionError() is called', () => {
        beforeEach(() => {
            rootScope.timeSession = {
                openedModal: false
            };
        });
        it('It must show finishWaiting', (done) => {
            KeepAliveUtilService.refreshTimeSessionError();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });
    });

    xdescribe('When cancelSession() is called', () => {
        beforeEach(() => {
            rootScope.keepAlive = true;
            $window.location = { reload: jasmine.createSpy('reload')};
        });
        it('It must show showWaitingModal', (done) => {
            
            KeepAliveUtilService.cancelSession();
            expect(fakeMmBModalService.showWaitingModal).toHaveBeenCalled();
            done();
        });
    });
});
