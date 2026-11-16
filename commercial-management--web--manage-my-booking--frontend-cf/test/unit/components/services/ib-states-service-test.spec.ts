describe('StatesListService Test', function () {

    var localStorageService, rootScope, StatesListService, mockError;

    var fakeStatesList = {
        'data': [{
            'code': 'AL',
            'normalizedCode': 'AL',
            'description': 'Alabama'
        },
            {
                'code': 'AK',
                'normalizedCode': 'AK',
                'description': 'Alaska'
            }]
    };

    var fakeSelectedCountry = 'USA';

    var fakeCommonsGenericProxy = {
        getGeneric: jasmine.createSpy()
    };
    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        })
    }

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('MmBAppConstants', {});
        });
        inject(function (_StatesListService_, $rootScope, _localStorageService_) {
            StatesListService = _StatesListService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
            localStorageService.set('statesList', fakeStatesList.data);
            localStorageService.set('selectedAvios', 'test');
        });
    });

    describe('when StatesList Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(fakeStatesList);
                return deferred.promise;
            });
        }));

        it('StatesListProxy should resolve the promise', function (done) {
            StatesListService.getStatesList(fakeSelectedCountry).then(function (responseData) {
                expect(responseData).toEqual(fakeStatesList.data);
                done();
            });
            rootScope.$digest();
        })

        it('StatesListProxy should resolve the promise with local storage states list and without selected country', function (done) {
            localStorageService.remove('statesList');
            localStorageService.remove('selectedAvios');
            StatesListService.getStatesList(null).then(function (responseData) {
                expect(responseData).toEqual(fakeStatesList.data);
                done();
            });
            rootScope.$digest();
        })
    });

    describe('when StatesList Proxy rejects the promise ', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 401 error code, should be returned error data', function () {
            localStorageService.remove('statesList');
            localStorageService.remove('selectedAvios');
            mockError = {'errorCode': 400, 'data': {'errors': [{'reason': 'error'}]}};
            StatesListService.getStatesList(fakeSelectedCountry).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('with 408 error code, should be returned error data', function () {
            mockError = {'errorCode': 408, 'data': {'errors': [{'reason': 'error'}]}};
            StatesListService.getStatesList(fakeSelectedCountry).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(408);
            });
            rootScope.$digest();
        });

        it('with 500 error code, should be returned error data', function () {
            mockError = {'errorCode': 500, 'data': {'errors': [{'reason': 'error'}]}};
            StatesListService.getStatesList(fakeSelectedCountry).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(500);
            });
            rootScope.$digest();
        });


        it('with non 401 or 408 error code,should be returned procesed error', function () {
            mockError = {'errorCode': 403, 'data': {'errors': [{'reason': 'error'}]}};
            StatesListService.getStatesList(fakeSelectedCountry).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(403);
            });
            rootScope.$digest();
        });
    });
});

