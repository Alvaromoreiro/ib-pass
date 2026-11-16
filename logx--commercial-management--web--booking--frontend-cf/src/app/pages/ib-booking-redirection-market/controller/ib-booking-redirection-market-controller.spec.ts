import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import angular from 'angular';

describe('BookingRedirectionMarketController test', () => {

    let controller, scope, timeout, fakeWindow;
    let controllerDependencies = {
        $scope : {
            $apply: ()=>{},
            $emit: (event:string, ...args)=>{},
            $broadcast: (event:string, ...args)=>{}
        }
    };
    let fakeBookingAppConstants = {
        lang: 'es',
        market: 'ES',
        QUADRIGAMS: {
            REDIRECTION_MARKET: 'IBREDNM'
        },
        availableMarkets: ['es']
    };

    let fakeMonetateConstants = {
        MONETATE_INFO: {
            SETPAGETYPE: 'setPageType'
        }
    };
    fakeWindow = {
        location: {
            origin:'https://www.iberia.com',
            pathname: '/flights/'

        }
    };
    let fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filterK) {
        const filters = {
            'LinksFilter': function (key) {
                return `link|${key}`;
            },
            'default': function (data) {
                return [];
            }
        };
        return filters[filterK] ?? filters['default'];
    });

    const fakeBookingRedirectionMarketModel = {
        initializeModel: jasmine.createSpy('initializeModel')
    };
    const fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam'),
        sendDatalayerEvent: jasmine.createSpy('sendDatalayerEvent'),
        updateDigitalDataWithQuadrigam: jasmine.createSpy('updateDigitalDataWithQuadrigam'),
        updateDatalayerViewEvent: jasmine.createSpy('updateDatalayerViewEvent')
    };

    const fakeDigitalDataUtilsService = {
        'updateDigitalDataWithQuadrigam': jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(function () { })
    };


    const fakeBookingUtilService = {
        isUserLogged: jasmine.createSpy('isUserLogged')
    };
    let fakeSessionStorage = new StorageServiceMock();

    const fakeBookingRedirectionService = {
        externalRedirect: jasmine.createSpy('externalRedirect')
    };
    const fakeBookingModalService = {
        finishWaiting: jasmine.createSpy('finishWaiting')
    };
    const fakeMonetateUtilsService = {
        updateMonetateWithQuadrigam: jasmine.createSpy('updateMonetateWithQuadrigam')
    };
    const fakeCommonsLanguageAndMarketService = {
        init: jasmine.createSpy('init')
    };
    beforeEach(() =>{
        angular.mock.module('ib-booking-redirection-market-module', ($provide) => {
            $provide.value('BookingRedirectionMarketModel', fakeBookingRedirectionMarketModel);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('DigitalDataUtilsService', fakeDigitalDataUtilsService);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('MonetateConstants', fakeMonetateConstants);
            $provide.value('localStorageService', fakeSessionStorage);
            $provide.value('BookingRedirectionService', fakeBookingRedirectionService);
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('MonetateUtilsService', fakeMonetateUtilsService);
            $provide.value('CommonsLanguageAndMarketService', fakeCommonsLanguageAndMarketService);
            $provide.value('$window', fakeWindow);
            $provide.value('$filter', fakeFilter);
        });
        inject(($controller, $rootScope, $timeout) =>{
            scope = $rootScope.$new();
            controllerDependencies.$scope = scope;
            controller = $controller('BookingRedirectionMarketController', controllerDependencies);
            timeout = $timeout;
            scope.$digest();
        });
    });

    describe('When controller is called ', () =>{
        it('it will be defined', () =>{
            expect(controller).toBeDefined();
        });
    });

    describe('When activate is called', () =>{
        it('it will initialize model', () =>{
            spyOn(controllerDependencies.$scope, '$broadcast');
            timeout.flush();

            expect(controller.model).toBeDefined();
            expect(fakeBookingModalService.finishWaiting).toHaveBeenCalled();
        });
    });

    describe('When reloadNewMarket is called', () =>{
        it('should redirect to the correct URL when new market is available', () =>{
            fakeBookingAppConstants.availableMarkets = ['es'];
            controller.newMarketInfo = { newBookingMarket: 'ES' };
            let fakeNewedUrl = fakeWindow.location.origin + fakeWindow.location.pathname + location.search;

            controller.reloadNewMarket();
            expect(fakeBookingRedirectionService.externalRedirect).toHaveBeenCalledWith(fakeNewedUrl);
        });

        it('should redirect to the fallback URL when new market is not available', ()=> {

            fakeCommonsLanguageAndMarketService.init = jasmine.createSpy('CommonsLanguageAndMarketService').and.returnValue(['BP', 'RC']);
            fakeBookingAppConstants.availableMarkets = ['us'];
            controller.newMarketInfo = { newBookingMarket: 'FR' };

            controller.reloadNewMarket();

            let fakeNewedUrl = 'link|IB_SEARCH_ENGINE' + location.search;
            expect(fakeBookingRedirectionService.externalRedirect).toHaveBeenCalledWith(fakeNewedUrl);
        });
    });

    describe('when returnHomePage() is called', () =>{
        it('and BookingRedirectionService is called with the window origin', () =>{
            controller.returnHomePage();
            expect(fakeBookingRedirectionService.externalRedirect).toHaveBeenCalledWith(fakeWindow.location.origin);
        });
    });

});



