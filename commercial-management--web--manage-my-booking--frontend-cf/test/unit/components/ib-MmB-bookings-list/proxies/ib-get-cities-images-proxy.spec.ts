describe('GetCitiesImagesProxy Test', () => {

    var rootScope, httpBackend, getCitiesImagesProxy;
    var PROXY_URL = '/myURL';

    beforeEach(() => {
        angular.mock.module('ib-MmB-bookings-list-module');
        inject(function ($rootScope, _GetCitiesImagesProxy_, $injector) {
            getCitiesImagesProxy = _GetCitiesImagesProxy_;
            rootScope = $rootScope;
            httpBackend = $injector.get('$httpBackend');
        });
    });

    describe('When function getCitiesimages is called', () => {

        it('should call service and return results', (done) => {
            httpBackend.expectGET(PROXY_URL).respond({ response: 'Ok' });
            getCitiesImagesProxy.getCitiesimages(PROXY_URL).then(function (responseData) {
                expect(responseData.response).toEqual('Ok');
                done();
            }, angular.noop);
            rootScope.$digest();
            httpBackend.flush();
        });

        it('should rejects and return error', (done) => {
            httpBackend.expectGET(PROXY_URL).respond(500, { data: 'KO' });
            getCitiesImagesProxy.getCitiesimages(PROXY_URL).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(500);
                done();
            });
            rootScope.$digest();
            httpBackend.flush();
        });
    });
});

