describe('GetCitiesImagesService test', () => {

    var getCitiesImagesService, rootScope, mockResponse = { data: 'promesa' };


    var fakeGetCitiesImagesProxy = {
        'getCitiesimages': jasmine.createSpy()
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-bookings-list-module', ($provide) => {
            $provide.value('MmBAppConstants', { 'imagesRoue': 'imgRoute', 'citiesJsonRoute': 'citiesRoute' });
            $provide.value('GetCitiesImagesProxy', fakeGetCitiesImagesProxy);
        });

        inject((_GetCitiesImagesService_, $rootScope) => {
            getCitiesImagesService = _GetCitiesImagesService_;
            rootScope = $rootScope;
        });
    });


    describe('When getCitiesImages() is called', () => {
        it('and resolve promise, should be returned data', (done) => {
            inject(($q) => {
                fakeGetCitiesImagesProxy.getCitiesimages = jasmine.createSpy('getCitiesimages').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });
            getCitiesImagesService.getCitiesImages().then((returnedInfo) => {
                expect(returnedInfo.data).toEqual('promesa');
                done();
            }, angular.noop);
            rootScope.$digest();
        });

        it('and reject promise, should be returned data ([])', (done) => {
            inject(($q) => {
                fakeGetCitiesImagesProxy.getCitiesimages = jasmine.createSpy('getCitiesimages').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject([]);
                    return deferred.promise;
                });
            });
            getCitiesImagesService.getCitiesImages().then((error) => {
                expect(error).toEqual([]);
                done();
            }, angular.noop);
            rootScope.$digest();
        });
    });
});
