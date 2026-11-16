describe('ChangeOrderSliceService Test', () =>{

    let rootScope, changeOrderSliceService;
    let data = 'test';
    let mockResponse = { data: 'promesa' };
    let processedResponse;
    let mockError;


    let fakeChangeOrderSliceProxy = { putGeneric: jasmine.createSpy() };
    let fakeMmBAppConstants = { 'changeOrderSliceURI': 'URI' };
    let fakeMmBUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake((error) =>{
            return error;
        }),
        timeOutError: jasmine.createSpy('controlError').and.callFake((error) =>{
            return error;
        }),
        unauthorizedError: jasmine.createSpy('controlError').and.callFake((error) =>{
            return error;
        }),
        processGeneralError: jasmine.createSpy('controlError').and.callFake((error) =>{
            return error;
        }),
    };

    beforeEach(() =>{
        angular.mock.module('LocalStorageModule', 'ib-MmB-flight-confirmation-module', ($provide) => {
            $provide.value('CommonsGenericProxy', fakeChangeOrderSliceProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeMmBUtilsErrorService);

        });
        inject(function ($rootScope, _ChangeOrderSliceService_) {
            changeOrderSliceService = _ChangeOrderSliceService_;
            rootScope = $rootScope;
        });
    });


    describe('When changeOrderSlice() is called', () =>{
        it('and resolve promise , should be returned transformed data', (done) =>{
            inject(function ($q) {
                fakeChangeOrderSliceProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(() =>{
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });
            changeOrderSliceService.changeOrderSlice().then(function (returnedInfo) {
                expect(returnedInfo).toEqual(mockResponse.data)
                done();
            })
            rootScope.$digest();
        });
    });
    describe('When changeOrderSlice() reject promise', () =>{
        it('with 408 errorCode, should be returned errorObject', () =>{
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            inject(function ($q) {
                fakeChangeOrderSliceProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function (returnedInfo) {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });

                fakeMmBUtilsErrorService.timeOutError = jasmine.createSpy('timeOutError').and.callFake(function (attemps, callback, error) {
                    mockError.errorCode = 400;
                    callback();
                });
            });

            changeOrderSliceService.changeOrderSlice().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });
        it('with 401 errorCode, should be returned errorObject', () =>{
            var mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            inject(function ($q) {
                fakeChangeOrderSliceProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function (returnedInfo) {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });

                fakeMmBUtilsErrorService.unauthorizedError = jasmine.createSpy('unauthorizedError').and.callFake(function (attemps, callback, error) {
                    mockError.errorCode = 400;
                    callback();
                });
            });

            changeOrderSliceService.changeOrderSlice().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(400);
                
            });
            rootScope.$digest();
        });
        it('with non 401 or 408 errorCode, should be returned procesedError', () =>{
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            processedResponse = { 'errorCode': 400, 'message': 'error', 'needsTranslate': false, 'internalErrorCode': 'internal_error' };
            inject(function ($q) {
                fakeChangeOrderSliceProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function (returnedInfo) {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });

                fakeMmBUtilsErrorService.processGeneralError = jasmine.createSpy('processGeneralError').and.callFake(function (attemps, callback, error) {
                    return processedResponse;
                });
            });

            changeOrderSliceService.changeOrderSlice().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(400);
                
            });
            rootScope.$digest();
        });
    });
});