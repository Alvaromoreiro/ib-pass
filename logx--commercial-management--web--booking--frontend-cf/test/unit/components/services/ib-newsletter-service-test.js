xdescribe('NewsletterService Test', function () {

    var fakeData = { data: 'Ok' }
    var NewsletterService, rootScope, q;
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
        putGeneric: jasmine.createSpy()
    };
    var fakeBookingAppConstants = { 'DEFAULT_ENDPOINTS': { 'newsletterServiceURI': 'newsletterServiceURI' } };

    beforeEach(function () {
        angular.mock.module('ib-booking-services-module', function ($provide) {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
        });
        inject(function ($rootScope, _NewsletterService_, $q) {
            NewsletterService = _NewsletterService_;
            rootScope = $rootScope;
            q= $q;
        });
    });

    describe('when putNewsletter is called', function () {
        it('reject and should return an object with processed error structure', function (done) {
            inject(function () {
                fakeCommonsGenericProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                    var deferred = q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            })
            NewsletterService.putNewsletter().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');
                expect(responseError.needsTranslate).toEqual(false);
                done();
            });
            rootScope.$digest();
            done();
        });
        it(' resolve and return the rest service destination areas list data', function (done) {
            inject(function () {
                fakeCommonsGenericProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                    var deferred = q.defer();
                    deferred.resolve(fakeData);
                    return deferred.promise;
                });
            });
            NewsletterService.putNewsletter().then(function (responseData) {
                expect(responseData).toEqual('Ok');
                done();
            }, angular.noop);
            rootScope.$digest();
            done();
        });
    });
});