describe('CallRibbonflexibleService Test', function () {
    var CallRibbonflexibleService;
    var mockResponse = { 'errorCode': 200, 'data': {} };
    var mockError = { 'errorCode': 408, 'data': {} };
    var $q, rootScope;

    var fakeMbmAppConstants = {
        'ribbonFlexibleServiceURI' : '/sse-avm/rs/v2/disruption/ribbon-flexible'
    }
    var fakeCommonsNewHttpUtilsErrorService = {
        'controlError': jasmine.createSpy('controlError').and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve(mockResponse);
            return deferred.promise;
        })
    }
    var fakeCommonsGenericProxy = {
        'postGeneric': jasmine.createSpy()
    };
    var fakeMmBUtilService = {
        'getEndpoint' : jasmine.createSpy('getEndpoint')
    }
    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', function ($provide) {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', fakeMbmAppConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
        });
        inject(function ($rootScope, _CallRibbonflexibleService_, _$q_) {
            CallRibbonflexibleService = _CallRibbonflexibleService_;
            rootScope = $rootScope;
            $q = _$q_;
        });
    });

    describe('when getRibbonFlexible() is called and resolve promise', function () {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));
        it('should return data and fail promise', (done) => {
            CallRibbonflexibleService.getRibbonFlexible().then((responseData) => {
                expect(responseData).toEqual({});
                done();
            }, angular.noop);
            rootScope.$digest();
        });
    });
    describe('when getRibbonFlexible() is called', () => {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            })
        }));
        it('and fail promise', () => {
            CallRibbonflexibleService.getRibbonFlexible().then(angular.noop, (responseData) => {
                expect(responseData).toEqual({});
            });
            rootScope.$digest();
        });
    });
});
