// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
xdescribe('test for module ib-header-advanced-search-module - factories', function() {

    beforeEach(function() {
        module('ib-web-menus-module', 'ib-commons-utils-module');
    });

    describe('test for advancedHeaderSearchService', function() {

        var advancedHeaderSearchService;
        var $q;
        var cabinTypesService;
        var getDestinationsService;
        var advancedSearchTransformer;
        var $injector;

        beforeEach(function() {
            inject(function(_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                $q = $injector.get('$q');
                cabinTypesService = $injector.get('cabinTypesService');
                getDestinationsService = $injector.get('getDestinationsService');
                advancedSearchTransformer = $injector.get('advancedSearchTransformer');
                advancedHeaderSearchService = $injector.get('advancedHeaderSearchService');
            });
        });

        it('advancedHeaderSearchService should be defined', function() {

            expect(advancedHeaderSearchService).toBeDefined();
        });


        it('test for advancedHeaderSearchService.initAdvancedSearch', function() {

            advancedHeaderSearchService.initAdvancedSearch('MAD','BIO');

            expect(advancedHeaderSearchService.initAdvancedSearch).toBeDefined();
        });

        it('test for cabinTypesService.getCabinTypes', function() {

            cabinTypesService.getCabinTypes();

            expect(cabinTypesService.getCabinTypes).toBeDefined();
        });

        it('test for getDestinationsService.getDestinationAreasCitiesList', function() {

            getDestinationsService.getDestinationAreasCitiesList();

            expect(getDestinationsService.getDestinationAreasCitiesList).toBeDefined();
        });

        it('test for advancedHeaderSearchService.createRequestNewAdvancedSearch', function() {
            var ret;
            spyOn(advancedSearchTransformer, 'createNewAdvancedSearch').withArgs(jasmine.anything()).and.returnValue('http://localhost:8280/build/?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=2&BEGIN_CITY_01=MAD&END_CITY_01=BIO&BEGIN_DAY_01=09&BEGIN_MONTH_01=202102&BEGIN_YEAR_01=2021&END_DAY_01=12&END_MONTH_01=202102&END_YEAR_01=2021&FARE_TYPE=R&quadrigam=IBH');
            ret = advancedHeaderSearchService.createRequestNewAdvancedSearch({});
            expect(ret).toBe('http://localhost:8280/build/?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=2&BEGIN_CITY_01=MAD&END_CITY_01=BIO&BEGIN_DAY_01=09&BEGIN_MONTH_01=202102&BEGIN_YEAR_01=2021&END_DAY_01=12&END_MONTH_01=202102&END_YEAR_01=2021&FARE_TYPE=R&quadrigam=IBH');
        });
    });
});