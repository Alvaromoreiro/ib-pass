// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-header-advanced-search-module - services', function() {

    beforeEach(function() {
        module('ib-web-menus-module');
    });

    describe('test for advancedSearchModel', function() {

        var advancedSearchModel;
        var localStorageService;
        var AdvancedSearchConstants;
        var $injector;

        beforeEach(function() {
            inject(function(_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                localStorageService = $injector.get('localStorageService');
                AdvancedSearchConstants = $injector.get('AdvancedSearchConstants');
                advancedSearchModel = $injector.get('advancedSearchModel');
            });
        });

        it('advancedSearchModel should be defined', function() {

            expect(advancedSearchModel).toBeDefined();
        });


        it('test for advancedSearchModel.initializeModel', function() {
            var bookingUrlParamsMock = {'modeWeb':null,'searchOrigin':'IBHMPA','tripType':'2','senior':null,'adult':1,'young':null,'teenager':null,'child':null,'infant':null,'resident':null,'largeFamilyType':null,'flexDates':'true','preferredCabin':'R','payWithAvios':null,'payWithPoints':null,'ibGroup':null,'referralId':null,'displayedPrice':null,'slices':[],'userCurrency':null,'priceCurrency':null,'numTrips':null,'originDestinations':[{'origin':'MAD','destination':'BIO','date':'2021-02-03'},{'origin':'BIO','destination':'MAD','date':'2021-02-18'}],'bookingCode1':null,'backToUrl':null,'codeTracking':null,'travelAgent':null};
            AdvancedSearchConstants.DISCOUNT_SEARCH_RESIDENT = {
                type: 'HEADER_ADVANCED_SEARCH_RESIDENT',
                name: 'resident',
                items: [
                    {
                        description: 'HEADER_ADVANCED_SEARCH_NO_RESIDENT',
                        value: ''
                    },
                    {
                        description: 'HEADER_ADVANCED_SEARCH_RESIDENT_CANARIAS',
                        value: 'RC'
                    },
                    {
                        description: 'HEADER_ADVANCED_SEARCH_RESIDENT_BALEARES',
                        value: 'BP'
                    },
                    {
                        description: 'HEADER_ADVANCED_SEARCH_RESIDENT_MELILLA',
                        value: 'RM'
                    }
                ]
            };
            AdvancedSearchConstants.DISCOUNT_SEARCH_FAMILY = {
                type: 'HEADER_ADVANCED_SEARCH_FAMILIA_NUM',
                name: 'family',
                items: [
                    {
                        description: 'HEADER_ADVANCED_SEARCH_NO_FAMILY',
                        value: ''
                    },
                    {
                        description: 'HEADER_ADVANCED_SEARCH_FAMILY_SPECIAL',
                        value: 'F2'
                    },
                    {
                        description: 'HEADER_ADVANCED_SEARCH_FAMILY_GENERAL',
                        value: 'F1'
                    }
                ]
            };
            localStorageService.set('bookingUrlParams', bookingUrlParamsMock);
            
            advancedSearchModel.initializeModel();

            function resultMatcher1(argument) {
                return {
                    asymmetricMatch: function(result) {
                        var equals = true;
                        equals = equals && result[0].description === 'HEADER_ADVANCED_SEARCH_ONE_WAY';
                        equals = equals && result[0].code === 1;
                        equals = equals && result[1].description === 'HEADER_ADVANCED_SEARCH_ROUND_TRIP';
                        equals = equals && result[1].code === 2;
                        return equals;
                    }
                }
            };
            expect(advancedSearchModel.tripOptions).toEqual(resultMatcher1(advancedSearchModel.tripOptions));
            function resultMatcher2(argument) {
                return {
                    asymmetricMatch: function(result) {
                        var equals = true;
                        return equals;
                    }
                }
            };
            expect(advancedSearchModel.passengersSelected).toEqual(resultMatcher2(advancedSearchModel.passengersSelected));
        });
    });
});