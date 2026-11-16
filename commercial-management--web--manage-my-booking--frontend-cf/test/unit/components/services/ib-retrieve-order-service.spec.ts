describe('RetrieveOrderService Test', () => {
    var mockResponse = 'Ok';
    var retrieveOrderService, rootScope, localStorageService;


    var fakeCommonsGenericProxy = {
        postGeneric: jasmine.createSpy(),
        getGeneric: jasmine.createSpy(),
    };
    var fakeCommonsHttpUtilsErrorService = {
        'controlError': jasmine.createSpy('controlError')
    }

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', ($provide) => {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsHttpUtilsErrorService);
            $provide.value('MmBAppConstants', { 'retrieveOrderURI': 'OrderURI', 'retrieveOrderByCheckIdURI': 'orderByCheck', 'retrieveOrderByDeepLinkURI': 'DeepLinkURI', 'retrieveOrderURIConsent': 'ConsentURI', 'retrieveOrderPostURI': 'postURI', 'retrieveOrderByFlightIdURI': 'test' });
        });
        inject(($rootScope, _RetrieveOrderService_, _localStorageService_) => {
            retrieveOrderService = _RetrieveOrderService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
        });
    });


    describe('when retrieveOrder() is called', () => {
        it('and RetrieveOrderProxy resolve promise, should return data', (done) => {
            inject(($q) => {
                fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });
            retrieveOrderService.retrieveOrder().then((responseData) => {
                localStorageService.clearAll();

            }, angular.noop);
            rootScope.$digest();
            done();
        });
        describe('and RetrieveOrderProxy reject promise, should return error object', () => {

            it('with 401 error code, should be returned error data', (done) => {
                let mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
                inject(($q) => {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.reject(mockError);
                        return deferred.promise;
                    });
                });
                retrieveOrderService.retrieveOrder().then(angular.noop, (responseError) => {
                    expect(responseError.errorCode).toEqual(400);

                });
                rootScope.$digest();
                done();
            });

            it('with 500 error code, should be returned error data', (done) => {
                let mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
                inject(($q) => {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.reject(mockError);
                        return deferred.promise;
                    });
                    fakeCommonsHttpUtilsErrorService.controlError = jasmine.createSpy('controlError').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.resolve(mockResponse);
                        return deferred.promise;
                    })
                });
                retrieveOrderService.retrieveOrder().then(angular.noop, (responseError) => {
                    expect(responseError.errorCode).toEqual(500);
                });
                rootScope.$digest();
                done();
            });

            it('with 408 error code, should be returned error data', () => {
                let mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
                inject(($q) => {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.reject(mockError);
                        return deferred.promise;
                    });
                });
                retrieveOrderService.retrieveOrder().then(angular.noop, (responseError) => {
                    expect(responseError.errorCode).toEqual(400);

                });
                rootScope.$digest();
            });


            it('retrieveOrder with non 400 error code,should be returned procesed error', () => {
                let mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
                let procesedResponse = { 'errorCode': 400, 'message': 'error', 'needsTranslate': false, 'internalErrorCode': 'internal_error' };
                inject(($q) => {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.reject(mockError);
                        return deferred.promise;
                    });
                    fakeCommonsHttpUtilsErrorService.controlError = jasmine.createSpy('controlError').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.resolve(mockResponse);
                        return deferred.promise;
                    })
                });
                retrieveOrderService.retrieveOrder().then(angular.noop, (responseError) => {
                    expect(responseError).toEqual(procesedResponse);

                });
                rootScope.$digest();
            });
        });
    });


    describe('When retrieveOrderByCheckinId() is called', () => {
        it('and retrieveOrderByCheckinId resolve promise, should return data', (done) => {
            inject(($q) => {
                fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });
            retrieveOrderService.retrieveOrderByCheckinId().then((responseData) => {
                localStorageService.clearAll();
                done();
            }, angular.noop);
            rootScope.$digest();
        });
        describe('and RetrieveOrderProxy reject promise, should return error object', () => {

            it('with 401 error code, should be returned error data', () => {
                let mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
                inject(($q) => {

                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.reject(mockError);
                        return deferred.promise;
                    });
                });
                retrieveOrderService.retrieveOrderByCheckinId().then(angular.noop, (responseError) => {
                    expect(responseError.errorCode).toEqual(400);

                });
                rootScope.$digest();
            });

            it('with 408 error code, should be returned error data', () => {
                let mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
                inject(($q) => {

                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.reject(mockError);
                        return deferred.promise;
                    });
                });
                retrieveOrderService.retrieveOrderByCheckinId().then(angular.noop, (responseError) => {
                    expect(responseError.errorCode).toEqual(400);

                });
                rootScope.$digest();
            });


            it('retrieveOrderByCheckinId with non 400 error code,should be returned procesed error', () => {
                let mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
                let procesedResponse = { 'errorCode': 400, 'message': 'error', 'needsTranslate': false, 'internalErrorCode': 'internal_error' };
                inject(($q) => {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.reject(mockError);
                        return deferred.promise;
                    });
                    fakeCommonsHttpUtilsErrorService.controlError = jasmine.createSpy('controlError').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.resolve(mockResponse);
                        return deferred.promise;
                    })
                });
                retrieveOrderService.retrieveOrderByCheckinId().then(angular.noop, (responseError) => {
                    expect(responseError).toEqual(procesedResponse);

                });
                rootScope.$digest();
            });
        });
    });

    describe('When retrieveOrderByDeepLink() is called', () => {
        it('and retrieveOrderByDeepLink resolve promise, should return data', (done) => {
            inject(($q) => {
                fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });
            retrieveOrderService.retrieveOrderByDeepLink({code:'code', 'source': 'source', 'returnURL': 'returnURL'}).then((responseData) => {
                localStorageService.clearAll();
                done();
            }, angular.noop);
            rootScope.$digest();
        });
        describe('and RetrieveOrderProxy reject promise, should return error object', () => {

            it('with 401 error code, should be returned error data', () => {
                let mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
                inject(($q) => {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.reject(mockError);
                        return deferred.promise;
                    });
                });
                retrieveOrderService.retrieveOrderByDeepLink({code:'code', 'source': 'source', 'returnURL': 'returnURL'}).then(angular.noop, (responseError) => {
                    expect(responseError.errorCode).toEqual(400);

                });
                rootScope.$digest();
            });

            it('with 408 error code, should be returned error data', () => {
                let mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
                inject(($q) => {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.reject(mockError);
                        return deferred.promise;
                    });
                });
                retrieveOrderService.retrieveOrderByDeepLink({code:'code', 'source': 'source', 'returnURL': 'returnURL'}).then(angular.noop, (responseError) => {
                    expect(responseError.errorCode).toEqual(400);

                });
                rootScope.$digest();
            });


            it('with non 400 error code,should be returned procesed error', (done) => {
                let mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
                let procesedResponse = { 'errorCode': 400, 'message': 'error', 'needsTranslate': false, 'internalErrorCode': 'internal_error' };
                inject(($q) => {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.reject(mockError);
                        return deferred.promise;
                    });
                    fakeCommonsHttpUtilsErrorService.controlError = jasmine.createSpy('controlError').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.resolve(mockResponse);
                        return deferred.promise;
                    })
                });
                retrieveOrderService.retrieveOrderByDeepLink({code:'code', 'source': 'source', 'returnURL': 'returnURL'}).then(angular.noop, (responseError) => {
                    expect(responseError).toEqual(procesedResponse);
                });
                rootScope.$digest();
                done();
            });
        });
    });

    describe('When retrieveOrderConsent() is called', () => {
        it('and retrieveOrderConsent resolve promise, should return data', (done) => {
            inject(($q) => {
                fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });
            retrieveOrderService.retrieveOrderConsent('flowID').then((responseData) => {
                localStorageService.clearAll();
            }, angular.noop);
            rootScope.$digest();
            done();
        });
        describe('and RetrieveOrderProxy reject promise, should return error object', () => {

            it('with 401 error code, should be returned error data', () => {
                let mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
                inject(($q) => {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.reject(mockError);
                        return deferred.promise;
                    });
                });
                retrieveOrderService.retrieveOrderConsent('flowID').then(angular.noop, (responseError) => {
                    expect(responseError.errorCode).toEqual(400);
                    localStorageService.clearAll();
                });
                rootScope.$digest();
            });

            it('with 408 error code, should be returned error data', () => {
                let mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
                inject(($q) => {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.reject(mockError);
                        return deferred.promise;
                    });
                });
                retrieveOrderService.retrieveOrderConsent('flowID').then(angular.noop, (responseError) => {
                    expect(responseError.errorCode).toEqual(400);
                    localStorageService.clearAll();
                });
                rootScope.$digest();
            });


            it('with non 400 error code,should be returned procesed error', () => {
                let mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
                let procesedResponse = { 'errorCode': 400, 'message': 'error', 'needsTranslate': false, 'internalErrorCode': 'internal_error' };
                inject(($q) => {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.reject(mockError);
                        return deferred.promise;
                    });
                    fakeCommonsHttpUtilsErrorService.controlError = jasmine.createSpy('controlError').and.callFake(() => {
                        var deferred = $q.defer();
                        deferred.resolve(mockResponse);
                        return deferred.promise;
                    })
                });
                retrieveOrderService.retrieveOrderConsent('flowID').then(angular.noop, (responseError) => {
                    expect(responseError).toEqual(procesedResponse);
                    localStorageService.clearAll();
                });
                rootScope.$digest();
            });
        });
    });

    describe('When retrieveOrderPost() is called', () => {
        it('and retrieveOrderPost resolve promise, should return data', (done) => {
            mockResponse = 'Ok';
            inject(($q) => {
                fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });
            retrieveOrderService.retrieveOrderPost('surname', 'locator').then((responseData) => {
                // expect(responseData).toEqual(mockResponse);
                localStorageService.clearAll();
            }, angular.noop);
            rootScope.$digest();
            done();
        });
    });
    describe('retrieveOrderPost is called and reject promise, should return error object', () => {
        it('with 401 error code, should be returned error data', (done) => {
            let mockError = { 'errorCode': 401, 'data': { flowId: '123456', 'errors': [{ 'reason': 'error' }] } };
            inject(($q) => {
                fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            });
            retrieveOrderService.retrieveOrderPost('surname', 'locator').then(angular.noop, (responseError) => {
                expect(responseError.errorCode).toEqual(400);
                localStorageService.clearAll();
            });
            rootScope.$digest();
            done();
        });

        it('with 408 error code, should be returned error data', (done) => {
            let mockError = { 'errorCode': 408, 'data': { flowId: '123456', 'errors': [{ 'reason': 'error' }] } };
            inject(($q) => {
                fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            });
            retrieveOrderService.retrieveOrderPost('surname', 'locator').then(angular.noop, (responseError) => {
                expect(responseError.errorCode).toEqual(400);
                localStorageService.clearAll();
            });
            rootScope.$digest();
            done()
        });


        it('retrieveOrderPost with non 400 error code,should be returned procesed error', (done) => {
            let mockError = { 'errorCode': 400, 'data': { flowId: '123456', 'errors': [{ 'reason': 'error' }] } };
            let procesedResponse = { 'errorCode': 400, 'message': 'error', 'needsTranslate': false, 'internalErrorCode': 'internal_error' };
            inject(($q) => {
                fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
                fakeCommonsHttpUtilsErrorService.controlError = jasmine.createSpy('controlError').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                })
            });
            retrieveOrderService.retrieveOrderPost('surname', 'locator').then(angular.noop, (responseError) => {
                expect(responseError).toEqual(procesedResponse);
                localStorageService.clearAll();
            });
            rootScope.$digest();
            done();
        });
    });

    describe('retrieveOrderByFlightId', () => {
        beforeEach(inject(() => {
            fakeCommonsGenericProxy.postGeneric.and.callFake(() => {
                return Promise.resolve(mockResponse);
            });
        }));
        it('should resolve promise', (done) => {
            retrieveOrderService.retrieveOrderByFlightId().then((response) => {
                expect(fakeCommonsGenericProxy.postGeneric).toHaveBeenCalled();
                localStorageService.clearAll();
            }, angular.noop);
            rootScope.$digest();
            done();
        });
        it('should reject promise', (done) => {
            let mockError = { 'errorCode': 400, 'data': { flowId: '123456', 'errors': [{ 'reason': 'error' }] } };
            let procesedResponse = { 'errorCode': 400, 'message': 'error', 'needsTranslate': false, 'internalErrorCode': 'internal_error' };
            inject(() => {
                fakeCommonsGenericProxy.postGeneric.and.callFake(() => {
                    return Promise.reject(mockError);
                });
                fakeCommonsHttpUtilsErrorService.controlError.and.callFake(() => {
                    return Promise.resolve(mockResponse);
                })
            });
            retrieveOrderService.retrieveOrderByFlightId().then(angular.noop, (responseError) => {
                expect(responseError).toEqual(procesedResponse);
                localStorageService.clearAll();
            });
            rootScope.$digest();
            done();
        });
    });
});
