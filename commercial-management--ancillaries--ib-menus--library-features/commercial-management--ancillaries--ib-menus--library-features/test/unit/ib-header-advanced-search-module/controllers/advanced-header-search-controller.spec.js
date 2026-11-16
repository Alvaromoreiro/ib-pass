// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-header-advanced-search-module - controllers', function() {

    beforeEach(function() {
        module('ib-web-menus-module', 'ib-commons-utils-module', 'ui.bootstrap');
    });

    describe('test for advancedHeaderSearchController', function() {

        var advancedHeaderSearchController;
        var $controller;
        var $rootScope;
        var $scope;
        var advancedSearchModel;
        var advancedHeaderSearchService;
        var CommonsModalService;
        var localStorageService;
        var AdvancedSearchConstants;
        var RedirectionService;
        var $filter;
        var $window;
        var $timeout;
        var $injector;
        var comercialDataMock = {'currency':{'code':'EUR','description':'Euro','symbol':'€','alignment':'R','groupingSeparator':'.','decimalSeparator':',','decimals':2,'recommendedDisplay':'symbol'},'languages':[{'dateFormat':{'long':'','medium':'dd/MM/yyyy','short':'dd/MM/yy'},'code':'ca','description':'Català'},{'dateFormat':{'long':'','medium':'','short':'M/d/yy'},'code':'en','description':'English'},{'dateFormat':{'long':'','medium':'dd-MMM-yyyy','short':'d/MM/yy'},'code':'es','description':'Español'}],'market':{'code':'ES','description':'España'},'marketFlags':{'allowedNameCorrection':true,'allowedAncillaries':true,'allowedFlightChange':false,'allowedRefund':true,'allowedCashAndAviosWithVoucher':true},'sessionTimeLifeInMinutes':15,'maxSearchTime':361,'minSearchTime':10,'passengerTypes':[{'passengerType':'ADULT','description':'Adulto'},{'passengerType':'INFANT','description':'Bebé'},{'passengerType':'YOUTH','description':'Joven'},{'passengerType':'CHILD','description':'Niño'},{'passengerType':'SENIOR','description':'Tercera edad'}],'discounts':[{'code':'GENERAL','description':'General','countries':['ES'],'cities':[],'relatedField':'GENERAL','type':'LGF'},{'code':'SPECIAL','description':'Especial','countries':['ES'],'cities':[],'relatedField':'SPECIAL','type':'LGF'},{'code':'BALEARES','description':'Residente en Baleares','countries':['ES'],'cities':[{'code':'IBZ','description':'Ibiza','countryCode':'ES','timezone':'Europe/Madrid','gaCode':6,'arCode':1,'saCode':5,'latitude':38.866666,'longitude':1.366666},{'code':'MAH','description':'Menorca','countryCode':'ES','timezone':'Europe/Madrid','gaCode':6,'arCode':1,'saCode':5,'latitude':39.866666,'longitude':4.216666},{'code':'PMI','description':'Palma de Mallorca','countryCode':'ES','timezone':'Europe/Madrid','gaCode':6,'arCode':1,'saCode':6,'latitude':39.55,'longitude':2.733333}],'relatedField':'balearicIslandsResident','type':'RES'},{'code':'CANARIAS','description':'Residente en Canarias','countries':['ES'],'cities':[{'code':'ACE','description':'Lanzarote','countryCode':'ES','timezone':'Atlantic/Canary','gaCode':6,'arCode':1,'saCode':10,'latitude':28.95,'longitude':-13.6},{'code':'FUE','description':'Fuerteventura','countryCode':'ES','timezone':'Atlantic/Canary','gaCode':6,'arCode':1,'saCode':10,'latitude':28.45,'longitude':-13.866666},{'code':'GMZ','description':'San Sebastián de la Gomera','countryCode':'ES','timezone':'Atlantic/Canary','gaCode':6,'arCode':1,'saCode':12,'latitude':28.0937998,'longitude':-17.1098582},{'code':'LPA','description':'Gran Canaria Las Palmas','countryCode':'ES','timezone':'Atlantic/Canary','gaCode':6,'arCode':1,'saCode':12,'latitude':27.933333,'longitude':-15.383333},{'code':'SPC','description':'Santa Cruz de La Palma','countryCode':'ES','timezone':'Europe/Madrid','gaCode':6,'arCode':1,'saCode':10,'latitude':28.683333,'longitude':-17.75},{'code':'TCI','description':'Tenerife','countryCode':'ES','timezone':'Atlantic/Canary','gaCode':6,'arCode':1,'saCode':11,'latitude':28.316666,'longitude':-16.566666},{'code':'VDE','description':'Valverde','countryCode':'ES','timezone':'Atlantic/Canary','gaCode':6,'arCode':1,'saCode':12,'latitude':27.793241,'longitude':-17.9413323}],'relatedField':'canaryIslandsResident','type':'RES'},{'code':'MELILLA','description':'Soy residente en Melilla','countries':['ES'],'cities':[{'code':'MLN','description':'Melilla','countryCode':'ES','timezone':'Europe/Madrid','gaCode':6,'arCode':1,'saCode':2,'latitude':35.283333,'longitude':-2.95}],'relatedField':'melillaResident','type':'RES'},{'code':'CEUTA','description':'Soy residente en Melilla','countries':['ES'],'cities':[{'code':'MLN','description':'Melilla','countryCode':'ES','timezone':'Europe/Madrid','gaCode':6,'arCode':1,'saCode':2,'latitude':35.283333,'longitude':-2.95}],'relatedField':'melillaResident','type':'RES'}],'defaultValues':{'defaultPaxType':'ADULT','defaultPaxTypeNumbers':[{'passengerType':'ADULT','number':1},{'passengerType':'CHILD','number':0},{'passengerType':'INFANT','number':0},{'passengerType':'SENIOR','number':0},{'passengerType':'YOUTH','number':0}],'maxPaxNumber':9,'defaultPhonePrefix':{'code':'34','description':'España / +34','countryCode':'ES'}},'roundingPolicy':'HALF_ROUND_DOWN','availabilityPriceShowPolicy':'ADULT_PRICE_WITH_TAXES_AND_EMISSION','mainCities':{'normal':{'code':'MAD','description':'Madrid','timezone':'Europe/Madrid','country':{'code':'ES','description':'España'}},'redemption':{'code':'MAD','description':'Madrid','timezone':'Europe/Madrid','country':{'code':'ES','description':'España'}}}};

        beforeEach(function() {
            inject(function(_$controller_, _$injector_) {
                $controller = _$controller_;
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                advancedSearchModel = $injector.get('advancedSearchModel');
                advancedHeaderSearchService = $injector.get('advancedHeaderSearchService');
                CommonsModalService = $injector.get('CommonsModalService');
                localStorageService = $injector.get('localStorageService');
                AdvancedSearchConstants = $injector.get('AdvancedSearchConstants');
                RedirectionService = $injector.get('RedirectionService');
                $filter = $injector.get('$filter');
                $window = $injector.get('$window');
                $timeout = $injector.get('$timeout');
                AdvancedSearchConstants.DISCOUNT_SEARCH_RESIDENT = {};
                AdvancedSearchConstants.DISCOUNT_SEARCH_FAMILY = {};
                localStorageService.set('commercialData', comercialDataMock);
                advancedHeaderSearchController = $controller('advancedHeaderSearchController', {advancedSearchModel:advancedSearchModel, advancedHeaderSearchService:advancedHeaderSearchService, CommonsModalService:CommonsModalService, $rootScope:$rootScope, localStorageService:localStorageService, $scope:$scope, AdvancedSearchConstants:AdvancedSearchConstants, RedirectionService:RedirectionService, $filter:$filter, $window:$window, $timeout:$timeout});
            });
        });

        it('advancedHeaderSearchController should be defined', function() {

            expect(advancedHeaderSearchController).toBeDefined();
        });

        it('advancedHeaderSearchController init', function() {
            expect(advancedHeaderSearchController.marketDescription).toBe('ES');
            expect(advancedHeaderSearchController.ariaText).toBe('HEADER_ADVANCED_SEARCH_PASSENGERS_CLOSED');
            expect(advancedHeaderSearchController.isCollapsed).toBe(true);
        });
    });
});