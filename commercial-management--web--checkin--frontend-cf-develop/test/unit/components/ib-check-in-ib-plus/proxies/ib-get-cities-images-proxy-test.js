describe('GetCitiesImagesProxy Test', function () {

    var rootScope, httpBackend, GetCitiesImagesProxy;
    var PROXY_URL = '/myURL';

    beforeEach(function () {
        angular.mock.module('ib-checkin-ib-plus');
        inject(function ($rootScope, _GetCitiesImagesProxy_, $injector) {
            GetCitiesImagesProxy = _GetCitiesImagesProxy_;
            rootScope = $rootScope;
            httpBackend = $injector.get('$httpBackend');
        });
    });

    describe('When function getCitiesimages is called', function () {
        it('should call service and return results', function (done) {
            httpBackend.expectGET(PROXY_URL).respond({ data: 'Ok' });
            GetCitiesImagesProxy.getCitiesimages(PROXY_URL, { 'data': 'data' }).then(function (responseData) {
                expect(responseData.data).toEqual('Ok');
                done();
            }, angular.noop);
            rootScope.$digest();
            httpBackend.flush();

        });

        it('should rejects and return error', function (done) {
            httpBackend.expectGET(PROXY_URL).respond(500, { status: 500, data: 'KO' });
            GetCitiesImagesProxy.getCitiesimages(PROXY_URL).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(500);
                done();
            });
            rootScope.$digest();
            httpBackend.flush();
        });
    });

});

