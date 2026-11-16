describe('MmbInvoluntaryChangeService Test', function () {

    var rootScope, MmbInvoluntaryChangeService, mockError;
    var mockResponse = { data: 'promesa' }

    var fakeFlowId = 'TWFuYWdlTXlCb29raW5nQElCNDg0YmI3YjQ5OTBkNDI4Zjg5Y2MyY2Y4NGExYTkzMDM%3D';

    var fakeCommonsGenericProxy = { getGeneric: jasmine.createSpy() };

    var fakeCommonsNewHttpUtilsErrorService = {
        'controlError': jasmine.createSpy('controlError').and.callFake(angular.noop)
    };

    var fakeMmBAppConstants = {
        acceptChangesURI : 'test'
    }

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject(function (_MmbInvoluntaryChangeService_, $rootScope) {
            MmbInvoluntaryChangeService = _MmbInvoluntaryChangeService_;
            rootScope = $rootScope;
        });
    });

    describe('when hasInvoluntaryChange check status of involuntary change', function () {
        var fakeStatus, responseData;

        it('with status ACCEPT_CHANGES_PENDING', function (done) {
            fakeStatus = 'ACCEPT_CHANGES_PENDING';
            responseData = MmbInvoluntaryChangeService.hasInvoluntaryChange(fakeStatus);
            expect(responseData).toEqual(true);
            done();
        })

        it('with status UNCONFIRMED_CHANGES', function (done) {
            fakeStatus = 'UNCONFIRMED_CHANGES';
            responseData = MmbInvoluntaryChangeService.hasInvoluntaryChange(fakeStatus);
            expect(responseData).toEqual(true);
            done();
        })

        it('with status CANCELATION_CHANGES', function (done) {
            fakeStatus = 'CANCELATION_CHANGES';
            responseData = MmbInvoluntaryChangeService.hasInvoluntaryChange(fakeStatus);
            expect(responseData).toEqual(true);
            done();
        })

        it('with status WAITLIST_CONFIRMED_CHANGES', function (done) {
            fakeStatus = 'WAITLIST_CONFIRMED_CHANGES';
            responseData = MmbInvoluntaryChangeService.hasInvoluntaryChange(fakeStatus);
            expect(responseData).toEqual(true);
            done();
        })

        it('with status is diferent', function (done) {
            fakeStatus = 'EXAMPLE_STATUS';
            responseData = MmbInvoluntaryChangeService.hasInvoluntaryChange(fakeStatus);
            expect(responseData).toEqual(false);
            done();
        })

    });

    describe('when flightHasInvoluntaryChange check segment status of involuntary change', function () {
        var fakeFlight = {
            'segments' : [
                {
                    'status': {
                        'code': 'HX'
                    }
                }
            ]
        };
        var responseData;

        it('with status HX', function (done) {
            fakeFlight.segments[0].status.code = 'HX';
            responseData = MmbInvoluntaryChangeService.flightHasInvoluntaryChange(fakeFlight);
            expect(responseData).toEqual(true);
            done();
        })

        it('with status TK', function (done) {
            fakeFlight.segments[0].status.code = 'TK';
            responseData = MmbInvoluntaryChangeService.flightHasInvoluntaryChange(fakeFlight);
            expect(responseData).toEqual(true);
            done();
        })

        it('with status TL', function (done) {
            fakeFlight.segments[0].status.code = 'TL';
            responseData = MmbInvoluntaryChangeService.flightHasInvoluntaryChange(fakeFlight);
            expect(responseData).toEqual(true);
            done();
        })

        it('with status UN', function (done) {
            fakeFlight.segments[0].status.code = 'UN';
            responseData = MmbInvoluntaryChangeService.flightHasInvoluntaryChange(fakeFlight);
            expect(responseData).toEqual(true);
            done();
        })

        it('with status KL', function (done) {
            fakeFlight.segments[0].status.code = 'KL';
            responseData = MmbInvoluntaryChangeService.flightHasInvoluntaryChange(fakeFlight);
            expect(responseData).toEqual(true);
            done();
        })

        it('with status UC', function (done) {
            fakeFlight.segments[0].status.code = 'UC';
            responseData = MmbInvoluntaryChangeService.flightHasInvoluntaryChange(fakeFlight);
            expect(responseData).toEqual(true);
            done();
        })

        it('with other status', function (done) {
            fakeFlight.segments[0].status.code = 'AA';
            responseData = MmbInvoluntaryChangeService.flightHasInvoluntaryChange(fakeFlight);
            expect(responseData).toEqual(false);
            done();
        })

    });

    describe('when flightIsChange check segment status of flight change', function () {
        var fakeFlight = {
            'segments' : [
                {
                    'status': {
                        'code': 'TL'
                    }
                }
            ]
        };
        var responseData: any;

        it('with status TL', function (done) {
            fakeFlight.segments[0].status.code = 'TL';
            responseData = MmbInvoluntaryChangeService.flightIsChange(fakeFlight);
            expect(responseData).toEqual(true);
            done();
        })

        it('with status TK', function (done) {
            fakeFlight.segments[0].status.code = 'TK';
            responseData = MmbInvoluntaryChangeService.flightIsChange(fakeFlight);
            expect(responseData).toEqual(true);
            done();
        })

        it('with other status', function (done) {
            fakeFlight.segments[0].status.code = 'AA';
            responseData = MmbInvoluntaryChangeService.flightIsChange(fakeFlight);
            expect(responseData).toEqual(false);
            done();
        })
    });

    describe('when flightIsCancel check segment status of flight cancelled', function () {
        var fakeFlight = {
            'segments' : [
                {
                    'status': {
                        'code': 'UC'
                    }
                }
            ]
        };
        var responseData;

        it('with status UC', function (done) {
            fakeFlight.segments[0].status.code = 'UC';
            responseData = MmbInvoluntaryChangeService.flightIsCancel(fakeFlight);
            expect(responseData).toEqual(true);
            done();
        })

        it('with status HX', function (done) {
            fakeFlight.segments[0].status.code = 'HX';
            responseData = MmbInvoluntaryChangeService.flightIsCancel(fakeFlight);
            expect(responseData).toEqual(true);
            done();
        })

        it('with status UN', function (done) {
            fakeFlight.segments[0].status.code = 'UN';
            responseData = MmbInvoluntaryChangeService.flightIsCancel(fakeFlight);
            expect(responseData).toEqual(true);
            done();
        })

        it('with other status', function (done) {
            fakeFlight.segments[0].status.code = 'AA';
            responseData = MmbInvoluntaryChangeService.flightIsCancel(fakeFlight);
            expect(responseData).toEqual(false);
            done();
        })
    });

    describe('when MmbInvoluntaryChange Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('MmbInvoluntaryChangeProxy should resolve the promise', function (done) {
            MmbInvoluntaryChangeService.submitChangesAccepted(fakeFlowId).then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            });
            rootScope.$digest();
        })
    });

    describe('when MmbInvoluntaryChange Proxy rejects the promise ', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 404 error code, should be returned error data', function () {
            mockError = { 'errorCode': 404, 'data': { 'errors': [{ 'reason': 'error' }] } };
            MmbInvoluntaryChangeService.submitChangesAccepted(fakeFlowId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(404);
            });
            rootScope.$digest();
        });

        it('with 408 error code, should be returned error data', function () {
            mockError = { 'errorCode': 409, 'data': { 'errors': [{ 'reason': 'error' }] } };
            MmbInvoluntaryChangeService.submitChangesAccepted(fakeFlowId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(409);
            });
            rootScope.$digest();
        });

        it('with 417 error code, should be returned error data', function () {
            mockError = { 'errorCode': 412, 'data': { 'errors': [{ 'reason': 'error' }] } };
            MmbInvoluntaryChangeService.submitChangesAccepted(fakeFlowId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(412);
            });
            rootScope.$digest();
        });

        it('with 500 error code, should be returned error data', function () {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            MmbInvoluntaryChangeService.submitChangesAccepted(fakeFlowId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(500);
            });
            rootScope.$digest();
        });


        it('with non 401 or 408 error code,should be returned procesed error', function () {
            mockError = { 'errorCode': 403, 'data': { 'errors': [{ 'reason': 'error' }] } };
            MmbInvoluntaryChangeService.submitChangesAccepted(fakeFlowId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(403);
            });
            rootScope.$digest();
        });
    });
});
