describe('CallAncillariesPageService', () => {
    let CallAncillariesPageService: any;
    let localStorageService: any;
    let CommonsGenericProxy: any;
    let CommonsNewHttpUtilsErrorService: any;
    let MmBAppConstants: any;
    let rootScope: angular.IRootScopeService;
    let q: angular.IQService;
    let fakeLocalStorageService: any;

    beforeEach(() => {
        MmBAppConstants = {
            DEFAULT_ENDPOINTS: {
                ancillariesURI: '/ancillaries/'
            },
            ancillariesURI: '/ancillaries/'
        };

        CommonsGenericProxy = {
            getGeneric: jasmine.createSpy('getGeneric')
        };

        CommonsNewHttpUtilsErrorService = {
            controlError: jasmine.createSpy('controlError')
        };

        fakeLocalStorageService = {
            get: jasmine.createSpy('get'),
            set: jasmine.createSpy('set')
        };

        angular.mock.module('ib-MmB-services-module', ($provide) => {
            $provide.value('MmBAppConstants', MmBAppConstants);
            $provide.value('CommonsGenericProxy', CommonsGenericProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', CommonsNewHttpUtilsErrorService);
            $provide.value('localStorageService', fakeLocalStorageService);
        });

        inject(($rootScope, _CallAncillariesPageService_, $q) => {
            CallAncillariesPageService = _CallAncillariesPageService_;
            rootScope = $rootScope;
            q = $q;
            localStorageService = fakeLocalStorageService;
        });
    });

    describe('getAncillaries', () => {
        it('should call getGeneric and resolve data', () => {
            localStorageService.get.and.callFake((key: string) => {
                if (key === 'flowId') return 'FLOW123';
                if (key === 'ancillariesServiceTimeoutValue') return 5000;
                return null;
            });

            CommonsGenericProxy.getGeneric.and.callFake(() => {
                const deferred = q.defer();
                deferred.resolve({ data: { test: true } });
                return deferred.promise;
            });

            const promise = CallAncillariesPageService.getAncillaries();
            rootScope.$digest();

            return promise.then((data) => {
                expect(CommonsGenericProxy.getGeneric).toHaveBeenCalled();
                expect(data).toEqual({ test: true });
            });
        });

        it('should call controlError on reject', () => {
            const mockError = { errorCode: 500 };
            localStorageService.set('flowId', 'FLOW123');

            CommonsGenericProxy.getGeneric.and.callFake(() => {
                const deferred = q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });

            CallAncillariesPageService.getAncillaries().then(
                angular.noop,
                angular.noop
            );

            rootScope.$digest();

            expect(CommonsNewHttpUtilsErrorService.controlError).toHaveBeenCalledWith(
                mockError,
                jasmine.any(Function)
            );
        });
    });

    describe('getInsurance', () => {
        it('should call getGeneric with insurance params and resolve data', () => {
            localStorageService.get.and.returnValue('FLOW123');

            CommonsGenericProxy.getGeneric.and.callFake(() => {
                const deferred = q.defer();
                deferred.resolve({ data: { insurance: true } });
                return deferred.promise;
            });

            const promise = CallAncillariesPageService.getInsurance('ES');
            rootScope.$digest();

            return promise.then((data) => {
                expect(CommonsGenericProxy.getGeneric).toHaveBeenCalled();
                expect(data).toEqual({ insurance: true });
            });
        });

        it('should call controlError on insurance reject', () => {
            const mockError = { errorCode: 400 };
            localStorageService.set('flowId', 'FLOW123');

            CommonsGenericProxy.getGeneric.and.callFake(() => {
                const deferred = q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });

            CallAncillariesPageService.getInsurance('ES').then(
                angular.noop,
                angular.noop
            );

            rootScope.$digest();

            expect(CommonsNewHttpUtilsErrorService.controlError).toHaveBeenCalledWith(
                mockError,
                jasmine.any(Function)
            );
        });
    });
});
