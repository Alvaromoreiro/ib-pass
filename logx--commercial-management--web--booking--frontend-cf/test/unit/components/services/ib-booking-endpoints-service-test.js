xdescribe('BookingEndpointsService Test', function () {

    var fakeData = { data: 'Ok' }
    var BookingEndpointsService, rootScope, q;
    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy(),
    };
    var mockError = {
        'errorCode': 400,
        'data': {
            'errors': [{ 'reason': 'error' }]
        }
    };
    var fakeCommonsGenericProxy = {
        getGeneric: jasmine.createSpy()
    };
    var fakeBookingUtilService = {
        getMetaTagValueByName: jasmine.createSpy('getMetaTagValueByName').and.callFake(function () {
            return '';
        })
    };

    var fakeBookingAppConstants = { 'endpointsServiceURI': 'endpointsServiceURI' };

    beforeEach(function () {
        angular.mock.module('ib-booking-services-module', function ($provide) {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('BookingUtilService', fakeBookingUtilService);
        });
        inject(function ($rootScope, _BookingEndpointsService_, $q) {
            BookingEndpointsService = _BookingEndpointsService_;
            rootScope = $rootScope;
            q= $q;
        });
    });

    describe('when getEndpoints is called', function () {
        it('reject and should return an object with processed error structure', function (done) {
            inject(function () {
                fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                    var deferred = q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            })
            BookingEndpointsService.getEndpoints().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');
                expect(responseError.needsTranslate).toEqual(false);
                done();
            });
            rootScope.$digest();
            done();
        });
        it(' resolve and return the rest service destination areas list data', function (done) {
            inject(function () {
                fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                    var deferred = q.defer();
                    deferred.resolve(fakeData);
                    return deferred.promise;
                });
            });
            BookingEndpointsService.getEndpoints().then(function (responseData) {
                expect(responseData).toEqual('Ok');
                done();
            }, angular.noop);
            rootScope.$digest();
            done();
        });
    });
});