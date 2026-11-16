import * as angular from 'angular';
import { InitMmBApp } from '../../src/ib-MmB-app';

xdescribe('Módulo ib-MmB-app', () => {
    let $rootScope, $injector, localStorageService;
    let fakeMmBUtilService = { 
        getDeviceType: jasmine.createSpy('getDeviceType').and.returnValue('desktop'), 
        getPaymentsBackGroundURL: jasmine.createSpy('getPaymentsBackGroundURL').and.returnValue(''), 
        getBackGroundURL: jasmine.createSpy('getBackGroundURL').and.returnValue(''),
        goToHome: jasmine.createSpy()
    };
    let fakeIbMmBGetPhoneCodeService = {
        getPhoneCodesList: jasmine.createSpy('getPhoneCodesList').and.callFake(() => {
            return Promise.resolve({});
        })
    };
    
    let fakeocLazyLoad = {load: jasmine.createSpy()};
    let fakePhonesList = {test: 'test'};

    let faketranslate = {use: jasmine.createSpy()};

    let fakeCommonsLanguageAndMarketService = {init: jasmine.createSpy().and.returnValue({ language: 'es', market: 'ES' })};

    let fakeIbCLinksService = {
        getLinks: jasmine.createSpy('getPhoneCogetLinksdesList').and.callFake(() => {
            return Promise.resolve({});
        })
    };

    let fakeCommonsKeepAliveService = {closeSession: jasmine.createSpy()};

    let fakeTmhDynamicLocale = {set: jasmine.createSpy()};

    let fakeDatalayerUtilsService = { initializeDatalayer: jasmine.createSpy() };

    let fakeMmBDatalayerUtilsService = { initializeDatalayer: jasmine.createSpy() , generateDatalayerDOM: jasmine.createSpy() };
    let fakeKeepAliveUtilService = { keepAliveInitMessage: jasmine.createSpy() };
    let fakeLocalStorageService = { 
        get: jasmine.createSpy(), 
        set: jasmine.createSpy(),
        remove: jasmine.createSpy(),
        clearAll: jasmine.createSpy()
    };
    let fakeCommonsUtilService = { isMobile: jasmine.createSpy('isMobile').and.returnValue(false) };
    let fakeMonetateUtilsService =  { initializeMonetate: jasmine.createSpy() };
    let fakeCommonsGetWcsPhonesService = { 
        getPhoneByCode: jasmine.createSpy('getPhoneByCode').and.callFake(() => {
            return Promise.resolve({});
        })
    };
    let fakeTranslateFactoryService = { setLanguage: jasmine.createSpy() };
    let fakeCommonsSessionStorageService = { setPrefix: jasmine.createSpy() };

    const createModuleEmpty = (fakeModule) => {
        angular.module(fakeModule, []);
    };
    let modulesEmpty = [
        'oc.lazyLoad', 'web-manage-my-booking-templates', 'ngAria', 'ng.deviceDetector', 'duScroll', 'ui.select', 'ngAnimate', 'ngCookies', 
        'ngMessages', 'rx', 'ib-interceptors-module', 'rzModule', 'ib-MmB-routing-module', 'ib-MmB-services-module', 'ib-MmB-transformers-module',
        'ib-MmB-filters-module', 'ib-MmB-search-module', 'ib-MmB-booking-management-module', 'ib-MmB-communication-lost-module', 'ib-web-menus-module',
        'angular-bind-html-compile', 'ib-inputs', 'ib-reusable-components-module', 'slickCarousel', 'ib-flexibilization-module', 'ib-commons-login-module',
        'ib-commons-utils-module', 'ib-commons-http-service-module', 'ib-commons-modal-service-module', 'ib-commons-proxies-module',
        'ib-datalayer-module', 'ngSanitize','ib-availability-service', 'ib-simulator-availability-service','ib-fare-service',
        'ib-commons-ui-components-module','ib-commons-directives-module','ib-commons-keep-alive-module','ib-header-main-page-component-module',
        'ib-commons-http-new-service-module','ib-loading-redirection-module', 'ib-MmB-voluntary-refunds-module','ib-MmB-payment-module',
        'ib-ng-react-component-module','ib-mmb-payment-page-module','ib-mmb-confirmation-page-module',
    ];

    const mockExternalModules = () => {
        modulesEmpty.map((theModule)=> {
            createModuleEmpty(theModule);
        });
        // Mock de la directiva ib-main-footer-legacy para evitar errores en los tests
        angular.module('ib-reusable-components-module')
          .directive('ibMainFooterLegacy', function() {
            return {
              restrict: 'E',
              template: ''
            };
          });
        angular.module('LocalStorageModule', [])
            .provider('localStorageService', function(this: any) {
                this.setPrefix = () => {};
                this.setStorageType = () => {};
                this.$get = () => {
                    return { get: () => ({test: 'test'}), set: () => {} };
                };
            } as angular.IServiceProviderFactory);
        angular.module('pascalprecht.translate', [])
            .provider('$translate', function(this: any) {
                this.use = () => {};
                this.useStaticFilesLoader = () => {};
                this.useSanitizeValueStrategy = () => {};
                this.$get = () => {
                    return { use: () => {} };
                };
            } as angular.IServiceProviderFactory);
        angular.module('ui.bootstrap', [])
            .provider('uibDatepickerDirective', function(this: angular.IServiceProvider) {
                this.$get = () => {
                    return [() => {}];
                };
            } as angular.IServiceProviderFactory);
        angular.module('tmh.dynamicLocale', [])
            .provider('tmhDynamicLocale', function(this: any) {
                this.localeLocationPattern = () => {};
                this.$get = () => {
                    return { set: () => {} };
                };
            } as angular.IServiceProviderFactory);
    };

    const mockCriticalProviders = ($provide: angular.auto.IProvideService) => {
        $provide.value('$translate', faketranslate);
        $provide.constant('MmBAppConstants', { 
            TOGGLE: {isActiveVoucherMmb: false, isSoftUserHideEnabled: true},
            WCS: {
                PHONE_TYPES: { SALES: 'SALES' }
            }
        });
        $provide.value('CommonsLanguageAndMarketService', fakeCommonsLanguageAndMarketService);
        $provide.value('IbCLinksService', fakeIbCLinksService);
        $provide.value('CommonsKeepAliveService', fakeCommonsKeepAliveService);
        $provide.value('tmhDynamicLocale', fakeTmhDynamicLocale);
        $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
        $provide.value('MmBDatalayerUtilsService', fakeMmBDatalayerUtilsService);
        $provide.value('MmBUtilService', fakeMmBUtilService);
        $provide.value('CommonsAncillariesService', {});
        $provide.value('MmBModalService', {});
        $provide.value('KeepAliveUtilService', fakeKeepAliveUtilService);
        $provide.value('localStorageService', fakeLocalStorageService);
        $provide.value('CommonsUtilService', fakeCommonsUtilService);
        $provide.value('MonetateUtilsService', fakeMonetateUtilsService);
        $provide.value('CommonsGetWcsPhonesService', fakeCommonsGetWcsPhonesService);
        $provide.value('TranslateFactoryService', fakeTranslateFactoryService);
        $provide.value('CommonsSessionStorageService', fakeCommonsSessionStorageService);
        $provide.value('IbMmBGetPhoneCodeService', fakeIbMmBGetPhoneCodeService);
        $provide.value('$ocLazyLoad', fakeocLazyLoad);
    };

    beforeEach(() => {
        // Primero mockear los módulos vacíos
        mockExternalModules();
        // Ahora crear el módulo de test y registrar InitMmBApp y su run block
        const testModule = angular.module('ib-MmB-app-test', [
            ...modulesEmpty,
            'LocalStorageModule',
            'pascalprecht.translate',
            'ui.bootstrap',
            'tmh.dynamicLocale'
        ]);
        testModule.run(InitMmBApp);
        angular.mock.module('ib-MmB-app-test', mockCriticalProviders);
        inject((_$rootScope_, _localStorageService_, _$injector_) => {
            $rootScope = _$rootScope_;
            $injector = _$injector_;
            localStorageService = _localStorageService_;
            
        });
    });

    it('Should InitMmBApp', () => {
        localStorageService.set('phonesList', fakePhonesList);
        expect($rootScope).toBeDefined();
    });
    it('Should backToMainRoot event', () => {
        spyOn(fakeMmBUtilService, 'goToHome');
        $rootScope.$broadcast('backToMainRoot', 'goToHome', true);
        expect(fakeMmBUtilService.goToHome).toHaveBeenCalled();
    });
    it('Should backToMainBackground event return true', () => {
        spyOn(fakeMmBUtilService, 'goToHome');
        $rootScope.$broadcast('backToMainBackground', true);
        $rootScope.isBackground = true;
        $rootScope.$digest();
        expect($rootScope.isBackground).toBeTrue();
        expect($rootScope.extraClassFooter).toEqual('');
    });
    it('Should backToMainBackground event return false', () => {
        spyOn(fakeMmBUtilService, 'goToHome');
        $rootScope.isBackground = false;
        $rootScope.$broadcast('backToMainBackground', false);
        expect($rootScope.isBackground).toBeFalse();
    });
    it('Should phonesList null and getPhoneCodesList reject', () => {
        fakeIbMmBGetPhoneCodeService.getPhoneCodesList.and.callFake(() => {
            return Promise.reject({});
        });
        localStorageService.remove('phonesList');
        $rootScope.$digest();
        expect($rootScope.phonesList).toEqual({});
    });

    // describe('Whn getPaymentsBackGroundURL() is called', () => {
    //     it('Should return img url to mobile', (done) => {
    //         let response;
    //         window.innerWidth = 400;
    //         response = MmBUtilService.getPaymentsBackGroundURL();
    //         expect(response).toEqual('/background/generico/disponibilidad_default_320.jpg');
    //         done();
    //     });
    //     it('Should return img url to tablet', (done) => {
    //         let response;
    //         window.innerWidth = 500;
    //         response = MmBUtilService.getPaymentsBackGroundURL();
    //         expect(response).toEqual('/background/generico/disponibilidad_default_768.jpg');
    //         done();
    //     });
    //     it('Should return img url to desktop', (done) => {
    //         let response;
    //         window.innerWidth = 1026;
    //         response = MmBUtilService.getPaymentsBackGroundURL();
    //         expect(response).toEqual('/background/generico/disponibilidad_default_2000.jpg');
    //         done();
    //     });
    // });

    afterEach(()=> {
        localStorageService.clearAll = jasmine.createSpy('clearAll');
    });
});
