describe('GetCitiesImagesService', function () {
    var service;
    var rootScope;
    var q;
    var cityImagesProxy;
    var localStorageService;

    beforeEach(function () {
        cityImagesProxy = {
            getCitiesimages: jasmine.createSpy('getCitiesimages')
        };
        localStorageService = {
            get: jasmine.createSpy('get'),
            set: jasmine.createSpy('set')
        };

        angular.mock.module('ib-checkin-ib-plus', function ($provide) {
            $provide.value('GetCitiesImagesProxy', cityImagesProxy);
            $provide.value('CheckinAppConstants', { imgCitiesJsonRoute: '/cities.json' });
            $provide.value('localStorageService', localStorageService);
        });
    });

    beforeEach(inject(function (GetCitiesImagesService, $rootScope, $q) {
        service = GetCitiesImagesService;
        rootScope = $rootScope;
        q = $q;
    }));

    it('should return cached city images without calling the proxy', function () {
        var cachedImages = [{ cityCode: 'MAD', url: 'madrid.jpg' }];
        var result;
        localStorageService.get.and.returnValue(cachedImages);

        service.getCitiesImages().then(function (images) {
            result = images;
        });
        rootScope.$digest();

        expect(result).toBe(cachedImages);
        expect(cityImagesProxy.getCitiesimages).not.toHaveBeenCalled();
    });

    it('should fetch and persist city images when the cache is empty', function () {
        var cityImages = [{ cityCode: 'MAD', url: 'madrid.jpg' }];
        var result;
        localStorageService.get.and.returnValue(null);
        cityImagesProxy.getCitiesimages.and.returnValue(q.when(cityImages));

        service.getCitiesImages().then(function (images) {
            result = images;
        });
        rootScope.$digest();

        expect(cityImagesProxy.getCitiesimages).toHaveBeenCalledOnceWith('/cities.json');
        expect(localStorageService.set).toHaveBeenCalledOnceWith('citiesImagesList', cityImages);
        expect(result).toBe(cityImages);
    });

    it('should resolve with an empty list when fetching city images fails', function () {
        var result;
        localStorageService.get.and.returnValue(null);
        cityImagesProxy.getCitiesimages.and.returnValue(q.reject(new Error('Request failed')));

        service.getCitiesImages().then(function (images) {
            result = images;
        });
        rootScope.$digest();

        expect(result).toEqual([]);
        expect(localStorageService.set).not.toHaveBeenCalled();
    });
});