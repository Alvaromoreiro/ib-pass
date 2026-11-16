/* eslint-disable no-var */
/* eslint-disable prefer-arrow-callback */
xdescribe('LastSearchStorageService test', function () {
    var service, CommonsBrowserStorageService;
    var LASTSEARH_STORAGE_KEY = 'ib-booking.lastSearchs';
    var initialStoredValue = [
        {
            expirationTimestamp: new Date().setDate(new Date().getDate() + 90),
            iataOrigen: 'MAD',
            iataDestino:'BCN',
            fechaIda:{day:'03',month:'10',year: '' + new Date().getFullYear() + 1},
            fechaVuelta:{day:'03', month:'11', year: '' + new Date().getFullYear() + 1},
            fechasFlexibles:true,
            adultos:1,
            niños:0,
            bebes:0,
            senior:0,
            joven:0,
            tarifa:'R',
            residentes:'',
            familia:'',
            pagoAvios: false,
            pagoPuntos: false
        }
    ];



    beforeEach(function () {
        angular.mock.module('ib-header-advanced-search-module', 'ib-commons-utils-module');
        inject(function (_CommonsBrowserStorageService_, _LastSearchStorageService_) {
            service = _LastSearchStorageService_;
            CommonsBrowserStorageService = _CommonsBrowserStorageService_;
            CommonsBrowserStorageService.setObject(LASTSEARH_STORAGE_KEY, initialStoredValue);
        });
    });

    describe ('Test getAllStoredSearchs function' , function () {
        it('Test retrieve if undefined', function (done) {
            CommonsBrowserStorageService.remove(LASTSEARH_STORAGE_KEY);
            expect(service.getAllStoredSearchs()).toEqual([]);
            done();
        });
        it('Test retrieve stored object', function (done) {
            CommonsBrowserStorageService.remove(LASTSEARH_STORAGE_KEY);
            CommonsBrowserStorageService.setObject(LASTSEARH_STORAGE_KEY, initialStoredValue);
            expect(service.getAllStoredSearchs()).toEqual(initialStoredValue);
            done();
        });
    });

    describe ('Test getStoredSearch function' , function () {
        it('Test retrieve from undefined and index 0', function (done) {
            CommonsBrowserStorageService.remove(LASTSEARH_STORAGE_KEY);
            expect(service.getStoredSearch(0)).toEqual(undefined);
            done();
        });
        it('Test retrieve stored object', function (done) {
            CommonsBrowserStorageService.remove(LASTSEARH_STORAGE_KEY);
            CommonsBrowserStorageService.setObject(LASTSEARH_STORAGE_KEY, initialStoredValue);
            expect(service.getStoredSearch(0)).toEqual(initialStoredValue[0]);
            done();
        });
    });

    describe ('Test pushSearch function' , function () {
        it('Push an new search equivalent to one stored', function (done) {
            var stored = JSON.parse(JSON.stringify(initialStoredValue));
            var newValue = JSON.parse(JSON.stringify(initialStoredValue[0]));
            newValue.iataDestino = 'LPA';

            stored.unshift(newValue);
            CommonsBrowserStorageService.remove(LASTSEARH_STORAGE_KEY);
            CommonsBrowserStorageService.setObject(LASTSEARH_STORAGE_KEY, stored);
            service.pushSearch(stored[1]);
            expect(service.getStoredSearch(0).iataDestino).toEqual(stored[1].iataDestino);
            expect(service.getStoredSearch(1).iataDestino).toEqual(stored[0].iataDestino);
            done();
        });
        it('Push an new search - previous with old timestamp', function (done) {
            var stored = JSON.parse(JSON.stringify(initialStoredValue));
            var newValue = JSON.parse(JSON.stringify(initialStoredValue[0]));
            newValue.expirationTimestamp = 0;
            stored.unshift(newValue);
            CommonsBrowserStorageService.remove(LASTSEARH_STORAGE_KEY);
            CommonsBrowserStorageService.setObject(LASTSEARH_STORAGE_KEY, stored);
            service.pushSearch(stored[1]);
            expect(service.getAllStoredSearchs().length).toEqual(initialStoredValue.length);
            done();
        });
        it('Push an new search - previous with old date', function (done) {
            var stored = JSON.parse(JSON.stringify(initialStoredValue));
            var newValue = JSON.parse(JSON.stringify(initialStoredValue[0]));
            newValue.fechaIda.year = '1995';
            stored.unshift(newValue);
            CommonsBrowserStorageService.remove(LASTSEARH_STORAGE_KEY);
            CommonsBrowserStorageService.setObject(LASTSEARH_STORAGE_KEY, stored);
            service.pushSearch(stored[1]);
            expect(service.getAllStoredSearchs().length).toEqual(initialStoredValue.length);
            done();
        });
        it('Push an new search - create new valid entries', function (done) {
            var totalStored = 1;
            CommonsBrowserStorageService.remove(LASTSEARH_STORAGE_KEY);
            CommonsBrowserStorageService.setObject(LASTSEARH_STORAGE_KEY, initialStoredValue);
            var newSearch = JSON.parse(JSON.stringify(initialStoredValue[0]));
            newSearch.iataOrigen = 'BIO';
            service.pushSearch(newSearch);
            expect(service.getAllStoredSearchs().length).toEqual(++totalStored);

            newSearch = JSON.parse(JSON.stringify(initialStoredValue[0]));
            newSearch.iataDestino = 'BIO';
            service.pushSearch(newSearch);
            expect(service.getAllStoredSearchs().length).toEqual(++totalStored);

            newSearch = JSON.parse(JSON.stringify(initialStoredValue[0]));
            newSearch.fechaIda.year = new Date().getFullYear() + 1;
            service.pushSearch(newSearch);
            expect(service.getAllStoredSearchs().length).toEqual(++totalStored);

            newSearch = JSON.parse(JSON.stringify(initialStoredValue[0]));
            newSearch.fechaVuelta.year = new Date().getFullYear() + 1;
            service.pushSearch(newSearch);
            expect(service.getAllStoredSearchs().length).toEqual(++totalStored);

            newSearch = JSON.parse(JSON.stringify(initialStoredValue[0]));
            newSearch.adultos = 2;
            service.pushSearch(newSearch);
            expect(service.getAllStoredSearchs().length).toEqual(++totalStored);

            newSearch = JSON.parse(JSON.stringify(initialStoredValue[0]));
            newSearch.senior = 2;
            service.pushSearch(newSearch);
            expect(service.getAllStoredSearchs().length).toEqual(++totalStored);
            // test another search that is equivalent to a stored one
            newSearch = JSON.parse(JSON.stringify(initialStoredValue[0]));
            newSearch.joven = 2;
            service.pushSearch(newSearch);
            expect(service.getAllStoredSearchs().length).toEqual(totalStored);

            newSearch = JSON.parse(JSON.stringify(initialStoredValue[0]));
            newSearch.niños = 2;
            service.pushSearch(newSearch);
            expect(service.getAllStoredSearchs().length).toEqual(totalStored);

            newSearch = JSON.parse(JSON.stringify(initialStoredValue[0]));
            newSearch.bebes = 2;
            service.pushSearch(newSearch);
            expect(service.getAllStoredSearchs().length).toEqual(totalStored);

            newSearch = JSON.parse(JSON.stringify(initialStoredValue[0]));
            newSearch.pagoAvios = true;
            service.pushSearch(newSearch);
            expect(service.getAllStoredSearchs().length).toEqual(totalStored);
            done();
        });

        it('Push an new search - test limit of 30 new searches', function (done) {
            var newValue;
            for (var i=1 ; i <= 40; i++ ) {
                newValue = JSON.parse(JSON.stringify(initialStoredValue[0]));
                newValue.adultos = i;
                service.pushSearch(newValue);
            }
            expect(service.getAllStoredSearchs().length).toEqual(30);
            done();
        });
    });

});
