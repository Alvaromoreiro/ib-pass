xdescribe('HttpUtilsErrorService Test', function () {

    var HttpUtilsErrorService, HttpServicesConstants, actualAttemps, timeout;
    var mockResponse = 'error';
    var fakeHttpUtilService = {
        refreshToken: jasmine.createSpy(),
        getParameterByName: jasmine.createSpy()
    };
    var fakeBookingModalService = {
        'showGenericDynamicModal': jasmine.createSpy('showGenericDynamicModal').and.callFake(function () {
            return 'sendtest';   
        }),
        'closeAllCurrentModals': jasmine.createSpy('closeAllCurrentModals').and.callFake(function () {
            return 'sendtest';   
        })
    };

    beforeEach(function () {
        angular.mock.module('ib-http-services-module','LocalStorageModule', function ($provide) {
            $provide.value('HttpUtilService', fakeHttpUtilService);
            $provide.value('BookingModalService', fakeBookingModalService);

        });
        inject(function ($rootScope, _HttpUtilsErrorService_, _HttpServicesConstants_, $timeout) {
            HttpUtilsErrorService = _HttpUtilsErrorService_;
            rootScope = $rootScope;
            timeout = $timeout;
            HttpServicesConstants = _HttpServicesConstants_;
        });
    });

    describe('when services fails in timeout', function () {
        var errorResponse;
        var spyObject = {
            timeOutFunction: function () {
                return 'test';
            }
        };
        beforeEach(inject(function () {
            errorResponse = {
                errorCode: 400,
                data: {
                    errors: [{
                        reason: 'property:nombre|error:test error',
                        code: 3
                    }]
                }
            };
        }))
        xit('when actualAttemps < HttpServicesConstants.NUM_ATTEMPS', function (done) {
            spyOn(spyObject, 'timeOutFunction');
            actualAttemps = HttpServicesConstants.NUM_ATTEMPS - 1;
            HttpUtilsErrorService.timeOutError(actualAttemps, spyObject.timeOutFunction, errorResponse);
            timeout.flush();
            expect(spyObject.timeOutFunction).toHaveBeenCalled();
            done();
        })

        it('when actualAttemps >= HttpServicesConstants.NUM_ATTEMPS', function (done) {
            var returnedValue;
            actualAttemps = HttpServicesConstants.NUM_ATTEMPS + 1;
            returnedValue = HttpUtilsErrorService.timeOutError(actualAttemps, spyObject.timeOutFunction, errorResponse);
            expect(returnedValue.message).toEqual('property:nombre|error:test error');
            expect(returnedValue.needsTranslate).toEqual(false);
            expect(returnedValue.internalErrorCode).toEqual(3);
            expect(returnedValue.errorCode).toEqual(400);
            done();
            rootScope.$digest();
        });
    })

    describe('when services fails in unauthorizedError', function () {
        var spyObject = {
            timeOutFunction: function () {
                return 'test';
            }
        };
        beforeEach(inject(function ($q) {
            fakeHttpUtilService.refreshToken = jasmine.createSpy('refreshToken').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
            errorResponse = {
                errorCode: 400,
                data: {
                    errors: [{
                        reason: 'reason',
                        code: 3
                    }]
                }
            };

        }))

        it('when actualAttemps < HttpServicesConstants.NUM_ATTEMPS', function (done) {
            actualAttemps = HttpServicesConstants.NUM_ATTEMPS - 1;
            HttpUtilsErrorService.unauthorizedError(actualAttemps, spyObject.timeOutFunction, errorResponse)
            timeout(function () {
                expect(spyObject.timeOutFunction).toHaveBeenCalled();
            });
            done();
            rootScope.$digest();
        });

        it('when actualAttemps >= HttpServicesConstants.NUM_ATTEMPS', function (done) {
            var returnedValue;
            actualAttemps = HttpServicesConstants.NUM_ATTEMPS + 1;
            returnedValue = HttpUtilsErrorService.unauthorizedError(actualAttemps, spyObject.timeOutFunction, errorResponse);
            expect(returnedValue.message).toEqual('reason');
            expect(returnedValue.needsTranslate).toEqual(false);
            expect(returnedValue.internalErrorCode).toEqual(3);
            expect(returnedValue.errorCode).toEqual(400);
            done();
            rootScope.$digest();
        });
    });
    describe('procesGeneral error', function () {
        it('when processGeneralError has reason', function (done) {
            var errorResponse = {
                errorCode: 404,
                data: {
                    errors: [{
                        reason: 'test reason',
                        code: 3
                    }]
                }
            };
            var returnedValue = HttpUtilsErrorService.processGeneralError(errorResponse);
            expect(returnedValue.message).toEqual('test reason');
            expect(returnedValue.needsTranslate).toEqual(false);
            expect(returnedValue.internalErrorCode).toEqual(3);
            expect(returnedValue.errorCode).toEqual(404);
            done();
            rootScope.$digest();
        });

        it('when processGeneralError has no reason', function (done) {
            var errorResponse = {
                errorCode: 500,
                data: 'test'
            }
            var returnedValue = HttpUtilsErrorService.processGeneralError(errorResponse);
            expect(returnedValue.message).toEqual('REST_SERVICE_ERROR_GENERAL');
            expect(returnedValue.needsTranslate).toEqual(true);
            expect(returnedValue.internalErrorCode).toEqual('');
            expect(returnedValue.errorCode).toEqual(500);
            done();
            rootScope.$digest();
        });
    })

    describe('when services fails in processGeneralErrorWithProperties', function () {
        var errorResponse;
        beforeEach(inject(function () {
            errorResponse = {
                errorCode: 400,
                data: {
                    errors: [{
                        reason: 'property:nombre|error:test error',
                        code: 3
                    }]
                }
            };
        }));
        it('when processGeneralErrorWithProperties has reason = /^property:.+\|error:.+$/', function (done) {
            var returnedValue = HttpUtilsErrorService.processGeneralErrorWithProperties(errorResponse);
            expect(returnedValue.message).toEqual('test error');
            expect(returnedValue.needsTranslate).toEqual(false);
            expect(returnedValue.internalErrorCode).toEqual(3);
            expect(returnedValue.errorCode).toEqual(400);
            done();
            rootScope.$digest();
        });

        it('when processGeneralErrorWithProperties has reason != /^property:.+\|error:.+$/', function (done) {
            var returnedValue;
            errorResponse.data.errors[0].reason = 'reason2';
            returnedValue = HttpUtilsErrorService.processGeneralErrorWithProperties(errorResponse);
            expect(returnedValue.message).toEqual('reason2');
            expect(returnedValue.needsTranslate).toEqual(false);
            expect(returnedValue.internalErrorCode).toEqual(3);
            expect(returnedValue.errorCode).toEqual(400);
            done();
            rootScope.$digest();

        });
        it('when processGeneralErrorWithProperties hasnt reason', function (done) {
            var returnedValue, errorResponse = { errorCode: 500 }
            returnedValue = HttpUtilsErrorService.processGeneralErrorWithProperties(errorResponse);
            expect(returnedValue.message).toEqual('REST_SERVICE_ERROR_GENERAL');
            expect(returnedValue.needsTranslate).toEqual(true);
            expect(returnedValue.internalErrorCode).toEqual('');
            expect(returnedValue.errorCode).toEqual(500);
            done();
            rootScope.$digest();
        });
        it('when processGeneralErrorWithProperties has reason but lenght >1', function (done) {
            errorResponse.data.errors.push({
                reason: 'test error',
                code: 4
            });
            returnedValue = HttpUtilsErrorService.processGeneralErrorWithProperties(errorResponse);
            expect(returnedValue.messageList[1].message).toEqual('test error');
            expect(returnedValue.messageList[0].message).toEqual('test error');
            expect(returnedValue.needsTranslate).toEqual(false);
            expect(returnedValue.internalErrorCode).toEqual(3);
            expect(returnedValue.errorCode).toEqual(400);
            done();
            rootScope.$digest();
        });

    });
})