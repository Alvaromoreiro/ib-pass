import * as angular from 'angular';
import dayjs from 'dayjs';

import { DatalayerUtilsService } from 'ib-web-commons/app/core/ib-datalayer/services/ib-datalayer-utils-service';
import { CommonsLanguageAndMarketService } from 'ib-web-commons/app/core/utils/ib-commons-language-and-market-service';
import { CkiDatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service';
import { IbCLinksService } from 'ib-web-commons/app/core/http-services/angular-statics/services/ib-links-service';
import { CommonsGetWcsPhonesService } from 'ib-web-commons/app/core/http-services/wcs/ib-get-wcs-phones-service';
import { CommonsKeepAliveUtilsService } from 'ib-web-commons/app/core/ib-keep-alive/ib-keep-alive-utils-service';
import { TranslateFactoryService } from 'ib-web-commons/utils/ib-commons-translate-factory.service';
import { MonetateUtilsService } from '@shared/services/ib-monetate/services/ib-monetate-utils';
import { IRootScopeExt } from './app/core/models/generic-models/generic-models';
import { AJSModalServiceType } from '@shared/services/ib-modal/ib-modal-service-bridge.service';
import { IComponentUtils } from './components/services/Utils/bridges/ib-component-utils-bridge.service';
import { SecurityOtpService } from 'ib-web-commons/security';
import { IbUtilsService } from '@shared/services/ib-utils/ib-utils.service';
import { CheckinFlowService } from '@src/app/shared/services/checkin-flow.service';


const inject = [
    '$rootScope', 
    '$window',
    '$translate', 
    '$ocLazyLoad',
    'CheckinRouterConstants', 
    'CommonsLanguageAndMarketService', 
    'CheckinAppConstants', 
    'ComponentUtils', 
    'AddOnService', 
    'DatalayerUtilsService', 
    'CkiDatalayerUtilsService', 
    'IbCLinksService', 
    'MonetateUtilsService', 
    'CommonsGetWcsPhonesService', 
    'CommonsKeepAliveUtilsService', 
    'TranslateFactoryService', 
    'CommonsSessionStorageService', 
    'CommonsUtilService',
    'CommonsAncillariesService', 
    'ModalService',
    'SecurityOtpService',
    'IbUtilsService',
    'CheckinFlowService'
];

/**
 * Initialize Check-in Angular Application
 */
export class InitCheckInApp {
    constructor (
        private $rootScope: IRootScopeExt,
        private $window: ng.IWindowService,
        private $translate: angular.translate.ITranslateService,
        private $ocLazyLoad: any,
        private CheckinRouterConstants: CheckinRouterConstants,
        private CommonsLanguageAndMarketService: CommonsLanguageAndMarketService,
        private CheckinAppConstants: CheckinAppConstants,
        private ComponentUtils: IComponentUtils,
        private AddOnService: AddOnService,
        private DatalayerUtilsService: DatalayerUtilsService,
        private CkiDatalayerUtilsService: CkiDatalayerUtilsService,
        private IbCLinksService: IbCLinksService,
        private MonetateUtilsService: MonetateUtilsService,
        private CommonsGetWcsPhonesService: CommonsGetWcsPhonesService,
        private CommonsKeepAliveUtilsService: CommonsKeepAliveUtilsService,
        private TranslateFactoryService: TranslateFactoryService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private CommonsUtilService: CommonsUtilService,
        private CommonsAncillariesService: CommonsAncillariesService,
        private ModalService: AJSModalServiceType,
        private SecurityOtpService: SecurityOtpService,
        private IbUtilsService: IbUtilsService,
        private CheckinFlowService: CheckinFlowService
    ) { }

    async activate () {
        this.initializeLanguageAndMarket();
        this.initializeBusinessConstants();
        this.initializeRoutes();
        this.initializeUIState();
        this.initializeExposedServices();
        this.initializeComputedValues();
        this.initializeServices();
        
        await this.initializeExternalLibraries();

        this.registerListeners();
        this.initializeAdditionalServices();
        this.SecurityOtpService.initialize();
    }

    /**
     * Initialize language and market
     */
    private initializeLanguageAndMarket () {
        //language and market
        const { market, language } = this.CommonsLanguageAndMarketService.init();
        
        this.$rootScope.appMarket = this.IbUtilsService.filterMarket(market);
        this.$rootScope.appLang = language;
        this.$rootScope.METAS = this.CheckinAppConstants.METAS[this.$rootScope.appLang];

        //Set translation language to use
        this.$translate.use(this.$rootScope.appLang);
        this.TranslateFactoryService.setLanguage(this.$rootScope.appLang);
        this.CommonsSessionStorageService.setPrefix('ib-check-in-app');
    }

    /**
     * Initialize business constants
     */
    private initializeBusinessConstants (): void {
        this.$rootScope.flowName = this.CheckinAppConstants.flowName;
        this.$rootScope.otpServicesURI = this.CheckinAppConstants.otpServicesURI;
        this.$rootScope.CHECKIN_FIELDS_LENGTH = this.CheckinAppConstants.CHECKIN_FIELDS_LENGTH;
        this.$rootScope.CHECKIN_PATTERNS = this.CheckinAppConstants.CHECKIN_PATTERNS;
        this.$rootScope.GOOGLE_ADS_URIS = this.CheckinAppConstants.GOOGLE_ADS_URIS;
        this.$rootScope.BANNER_IDS = this.CheckinAppConstants.BANNER_IDS;
        this.$rootScope.serviceURI = this.CheckinAppConstants.servicesURI;
    }

    /**
     * Initialize routes
     */
    private initializeRoutes (): void {
        this.$rootScope.routes = {
            icons: this.CheckinAppConstants.iconsRoute,
            images: this.CheckinAppConstants.imagesRoute,
            templates: this.CheckinRouterConstants.templatesRoute,
            links: ''
        };
    }

    /**
     * Initialize UI State
     */
    private initializeUIState (): void {
        this.$rootScope.extraClassFooter = 'ib-footer--medium';
        this.$rootScope.loadLinks = false;
        this.$rootScope.showMainHeader = false;
        this.$rootScope.showMainFooter = false;
        this.$rootScope.showHeaders = true;
        this.$rootScope.hideAdvancedSearch = true;
    }

    /**
     * Initialize exposed services
     */
    private initializeExposedServices (): void {
        this.$rootScope.serviceAncillarie = this.CommonsAncillariesService;
        this.$rootScope.serviceModal = this.ModalService;
    }

    /**
     * Initialize computed values
     */
    private initializeComputedValues (): void {
        const backGroundImage = this.IbUtilsService.getPaymentsBackgroundUrl();
        this.$rootScope.paymentBackgroundImageUrl = backGroundImage;
        this.$rootScope.backGroundImage = backGroundImage;
        this.$rootScope.generateDatalayerDOM = this.CkiDatalayerUtilsService.generateDatalayerDOM;
        this.$rootScope.isMobile = this.CommonsUtilService.isMobile();
        this.$rootScope.phonesList = this.CheckinFlowService.iniPhonesList();
    }

    /**
     * Initialize services
     */
    private initializeServices () {
        const toogleConfig = {
            isSoftUserHideEnabled: this.CheckinAppConstants.TOGGLE.isSoftUserHideEnabled
        };

        const deviceType = this.IbUtilsService.getDeviceType();

        this.IbCLinksService.getLinks(true, 'CKI').then(() => {
            this.$ocLazyLoad.load(angular.module('ib-commons-filters-module'));
            this.$rootScope.loadLinks = true;
        });

        this.CommonsSessionStorageService.set('toggle', toogleConfig);
        this.CommonsSessionStorageService.set('flowApp', this.$rootScope.flowName);

        this.DatalayerUtilsService.initializeDatalayer(this.$rootScope.appLang, this.$rootScope.appMarket, deviceType);
        this.CkiDatalayerUtilsService.initializeDatalayer(this.$rootScope.appLang, this.$rootScope.appMarket, deviceType);
        this.MonetateUtilsService.initializeMonetate();

        this.CommonsGetWcsPhonesService.getPhoneByCode(this.CheckinAppConstants.WCS.PHONE_TYPES.SALES).then(() => this.CheckinFlowService.updatePhonesList());
    }

    /**
     * Initialize external libraries
     */
    private async initializeExternalLibraries () {
        await import(
            /* webpackInclude: /[\\/](es|en|fr|de|it|pt|ru|zh|ja|ca|nl)\.js$/ */
            /* webpackChunkName: "dayjs-[request]" */
            /* webpackMode: "lazy" */
            `dayjs/locale/${this.$rootScope.appLang}`
        );
        dayjs.locale(this.$rootScope.appLang);
    }

    private onBackToMainRoot (
        _event: ng.IAngularEvent,
        goToHome: boolean
    ) {
        this.CheckinFlowService.backToMain(goToHome);
    }

    /**
     * Handler route change
     */
    private onRouteChangeStart (event) {
        const url = new URL(this.$window.location.href);
        const paramsObject = new URLSearchParams(url.search);
        const componentInfoAdyen = { 
            md: paramsObject.get('MD'), 
            paRes: paramsObject.get('PaRes') 
        };

        if (componentInfoAdyen.md && componentInfoAdyen.paRes) {
            event.preventDefault();
            this.CommonsSessionStorageService.set('componentInfoAdyen', componentInfoAdyen);

            // delete parameters
            paramsObject.delete('MD');
            paramsObject.delete('PaRes');
            
            //Go to new url
            const newSearch = paramsObject.toString();
            this.$window.location.href = url.pathname + (newSearch ? '?' + newSearch : '');
        }
    }

    /**
     * Handler listen resize
     */
    private registerResizeListener (): void {
        const win = angular.element(this.$window);

        const onResize = (): void => {
            if (angular.element('.ibe-box-form').length) {
                this.ComponentUtils.resizeHeightListElements('.ibe-box-form');
            }
        };

        win.on('resize', onResize);

        this.$rootScope.$on('$destroy', () => {
            win.off('resize', onResize);
        });
    }

    /**
     * Initialize handler listeners
     */
    private registerListeners () {
        this.registerResizeListener();
        this.$rootScope.$on('$routeChangeStart', this.onRouteChangeStart.bind(this));
        this.$rootScope.$on('backToMainRoot', this.onBackToMainRoot.bind(this));
        this.$rootScope.$on('languageChangedEvent', () => this.CommonsSessionStorageService.remove('bookingInfo'));
    }

    /**
     * Initialize additional services
     */
    private initializeAdditionalServices () {
        this.CommonsKeepAliveUtilsService.initKeepAlive();
        this.AddOnService.initAddOn();
    }

    $onInit = this.activate();
}


InitCheckInApp.$inject = inject;

/**
 * Iberia Check-in Angular Application
 * @module ib-check-in-app
 */
angular.module('ib-check-in-app', [
    'ib-check-in-app-constants-module',
    'web-checkin-templates',
    'ngRoute',
    'utf8-base64',
    'pascalprecht.translate',
    'ngCookies',
    'ui.bootstrap',
    'ngAnimate',
    'ui.select',
    'ngAria',
    'slickCarousel',
    'LocalStorageModule',
    'credit-cards',
    'ng.deviceDetector',
    'duScroll',
    'ngMessages',
    'ngScrollbars',
    'rzModule',
    'rx',
    'oc.lazyLoad',
    'ib-commons-http-new-service-module',
    'ib-interceptors-module',
    'ib-commons-login-module',
    'ib-ui-login-reusable-iframe-component',
    'ib-commons-utils-module',
    'ib-commons-http-service-module',
    'ib-commons-modal-service-module',
    'ib-commons-proxies-module',
    'ib-commons-keep-alive-module',
    'ib-commons-directives-module',
    'ib-datalayer-module',
    'ib-datalayer-cki-module',
    'ib-check-in-search',
    'ib-web-menus-module',
    'ib-checkin-flights-passengers-module',
    'ib-checkin-ib-plus',
    'ib-shared-services-module',
    'ib-flight-now-module',
    'ib-filter-module',
    'angular-bind-html-compile',
    'ib-commons-filters-module',
    'ib-components-module',
    'ib-commons-constants-module',
    'ib-commons-avios-constants',
    'ngSanitize',
    'ib-commons-ui-components-module',
    'ib-header-main-page-component-module',
    'ib-checkin-services-module',
    'ib-shared-components-module',
    'ib-loading-redirection-module',
    'ib-checkin-seat-summary-module',
    'ib-security-otp-module'
]).run(InitCheckInApp);