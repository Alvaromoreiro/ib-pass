import * as angular from 'angular';
import dayjs from 'dayjs';
import { IbCLinksService } from 'ib-web-commons/dist/app/core/http-services/angular-statics/services/ib-links-service';
import { DatalayerUtilsService } from 'ib-web-commons/dist/app/core/ib-datalayer/services/ib-datalayer-utils-service';
import { CommonsLanguageAndMarketService } from 'ib-web-commons/dist/app/core/utils/ib-commons-language-and-market-service';
import { CommonsSessionStorageService, TranslateFactoryService } from 'ib-web-commons/utils';
import { MmBDatalayerUtilsService } from './components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service';
import { MmBUtilService } from './components/services/Utils/ib-MmB-utils';
import { MmBModalService } from './components/ib-reusable-components/ib-MmB-modal/services/ib-MmB-modal-service';
import { KeepAliveUtilService } from './components/ib-reusable-components/ib-keep-alive/services/ib-keep-alive-utils-service';
import { MonetateUtilsService } from './components/ib-reusable-components/ib-monetate/services/ib-monetate-utils';
import { IbMmBGetPhoneCodeService } from './components/services/ib-MmB-get-phone-code-service';
import { SecurityOtpService } from 'ib-web-commons/security';
import 'ib-web-ancillaries/preload';

class InitMmBApp {
    constructor (
        private $translate: any,
        private $rootScope: any,
        private MmBAppConstants: MmBAppConstants,
        private CommonsLanguageAndMarketService: CommonsLanguageAndMarketService,
        private IbCLinksService: IbCLinksService,
        private CommonsKeepAliveService: CommonsKeepAliveService,
        private tmhDynamicLocale: any,
        private DatalayerUtilsService: DatalayerUtilsService,
        private MmBDatalayerUtilsService: MmBDatalayerUtilsService,
        private MmBUtilService: MmBUtilService,
        private CommonsAncillariesService: CommonsAncillariesService,
        private MmBModalService: MmBModalService,
        private KeepAliveUtilService: KeepAliveUtilService,
        private localStorageService: any,
        private CommonsUtilService: CommonsUtilService,
        private MonetateUtilsService: MonetateUtilsService,
        private CommonsGetWcsPhonesService: CommonsGetWcsPhonesService,
        private TranslateFactoryService: TranslateFactoryService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbMmBGetPhoneCodeService: IbMmBGetPhoneCodeService,
        private $ocLazyLoad: any,
        private $window: angular.IWindowService,
        private SecurityOtpService: SecurityOtpService
    ) {}

    activate = async () => {
        this.registerRootScopeEvents();
        const marketLang = this.initLanguageAndMarket();
        this.initRootScopeConfig(marketLang);
        this.initServices(marketLang);
        await this.loadDayjsLocale();
        this.initSessionAndKeepAlive();
        this.SecurityOtpService.initialize();
    };

    private registerRootScopeEvents = () => {
        this.$rootScope.$on('backToMainRoot', () => {
            this.CommonsSessionStorageService.clearAll();
            this.$window.location.href = this.$window.location.origin;
        });
        this.$rootScope.$on('backToMainBackground', (event, isBackground) => {
            this.$rootScope.isBackground = isBackground;
            this.$rootScope.extraClassFooter = isBackground ? '' : 'ib-footer--medium';
        });
    };

    private initLanguageAndMarket = () => {
        const marketLang = this.CommonsLanguageAndMarketService.init();
        this.CommonsSessionStorageService.setPrefix('ib-MmB-app');
        this.toggleFlags();
        this.tmhDynamicLocale.set(marketLang.language);
        this.MmBAppConstants.market = marketLang.market;
        this.MmBAppConstants.lang = marketLang.language;
        this.$translate.use(marketLang.language);
        this.TranslateFactoryService.setLanguage(this.MmBAppConstants.lang);
        return marketLang;
    };

    private initRootScopeConfig = (marketLang) => {
        this.$rootScope.appMarket = marketLang.market;
        this.$rootScope.appLang = marketLang.language;
        this.$rootScope.isBackground = false;
        this.$rootScope.extraClassFooter = 'ib-footer--medium';
        this.$rootScope.loadLinks = false;
        this.$rootScope.closeSession = this.CommonsKeepAliveService.closeSession;
        this.$rootScope.MmBPatterns = this.MmBAppConstants.MmBPatterns;
        this.$rootScope.paymentBackgroundImageUrl = this.getPaymentsBackGroundURL();
        this.$rootScope.flowName = this.MmBAppConstants.flowName;
        this.$rootScope.showMainHeader = false;
        this.$rootScope.showHeaders = true;
        this.$rootScope.hideAdvancedSearch = true;
        this.$rootScope.serviceAncillarie = this.CommonsAncillariesService;
        this.$rootScope.serviceModal = this.MmBModalService;
        this.$rootScope.routes = {
            icons: this.MmBAppConstants.iconsRoute,
            images: this.MmBAppConstants.imagesRoute,
            templates: this.MmBAppConstants.templatesRoute,
            defaultBackgroundImageUrl: this.MmBUtilService.getBackGroundURL(this.MmBAppConstants.defaultBackgroundImageUrl),
            links: this.MmBAppConstants.linksRoute
        };
        this.$rootScope.backGroundImage = this.$rootScope.paymentBackgroundImageUrl;
        this.$rootScope.serviceURI = this.MmBAppConstants.servicesURI;
        this.$rootScope.otpServicesURI = this.MmBAppConstants.otpServicesURI;
        this.$rootScope.generateDatalayerDOM = this.MmBDatalayerUtilsService.generateDatalayerDOM;
        this.$rootScope.isMobile = this.CommonsUtilService.isMobile();
        this.$rootScope.showPayButton = true;
        this.$rootScope.production = this.MmBAppConstants.production;
        this.$rootScope.phonesList = this.localStorageService.get('phonesList') || {};
    };

    private initServices = (marketLang) => {
        this.IbCLinksService.getLinks(true, 'MMB').then(() => {
            this.$ocLazyLoad.load(angular.module('ib-commons-filters-module'));
            this.$rootScope.loadLinks = true;
        });
        this.CommonsGetWcsPhonesService.getPhoneByCode(this.MmBAppConstants.WCS.PHONE_TYPES.SALES).then(() => {
            this.$rootScope.phonesList = this.localStorageService.get('phonesList') || {};
        });
        this.IbMmBGetPhoneCodeService.getPhoneCodesListPromised().then(() => {}, () => {});
        this.DatalayerUtilsService.initializeDatalayer(marketLang.language, marketLang.market, this.MmBUtilService.getDeviceType());
        this.MmBDatalayerUtilsService.initializeDatalayer(marketLang.language, marketLang.market, this.MmBUtilService.getDeviceType());
        this.MonetateUtilsService.initializeMonetate();
    };

    private loadDayjsLocale = async () => {
        await import(
            /* webpackInclude: /[\\/](es|en|fr|de|it|pt|ru|zh|ja|ca|nl)\.js$/ */
            /* webpackChunkName: "dayjs-[request]" */
            /* webpackMode: "lazy" */
            `dayjs/locale/${this.$rootScope.appLang}`
        );
        dayjs.locale(this.$rootScope.appLang);
    };

    private initSessionAndKeepAlive = () => {
        this.$rootScope.timeSession = {
            startTime: dayjs(),
            openedModal: false,
            failedKeepAliveService: false
        };
        this.KeepAliveUtilService.keepAliveInitMessage();
    };

    private toggleFlags = () => {
        // FLAGS to active/desactive
        this.CommonsSessionStorageService.set('isActiveVoucherMmb', this.MmBAppConstants.TOGGLE.isActiveVoucherMmb);
        this.CommonsSessionStorageService.set('isActiveAviosMmb', this.MmBAppConstants.TOGGLE.isActiveAviosMmb);
        this.CommonsSessionStorageService.set('toggle', {
            isSoftUserHideEnabled: this.MmBAppConstants.TOGGLE.isSoftUserHideEnabled
        });
        this.CommonsSessionStorageService.set('isActiveDeinvoicing', this.MmBAppConstants.TOGGLE.isActiveDeinvoicing);
        // FLAGS to active/desactive
    };

        /**
     * Return url to show backgrond payment while loading payment
     */
    private getPaymentsBackGroundURL = () => {
        let backgroundURL, widthScreen = this.$window.innerWidth > 1024 ? 2000 : (this.$window.innerWidth > 480 && this.$window.innerWidth < 1025) ? 768 : this.$window.innerWidth < 481 ? 320 : 2000;
        backgroundURL = '/background/generico/disponibilidad_default_' + widthScreen + '.jpg';
        return backgroundURL;
    };

    $onInit = this.activate();
};

InitMmBApp.$inject = ['$translate', '$rootScope', 'MmBAppConstants', 'CommonsLanguageAndMarketService', 'IbCLinksService', 'CommonsKeepAliveService', 'tmhDynamicLocale', 'DatalayerUtilsService', 'MmBDatalayerUtilsService', 'MmBUtilService', 'CommonsAncillariesService', 'MmBModalService', 'KeepAliveUtilService', 'localStorageService', 'CommonsUtilService', 'MonetateUtilsService', 'CommonsGetWcsPhonesService', 'TranslateFactoryService','CommonsSessionStorageService', 'IbMmBGetPhoneCodeService','$ocLazyLoad', '$window', 'SecurityOtpService'];
/**
 * Iberia Manage my Booking Angular Application
 * @module ib-manage-my-booking-app
 */
angular.module('ib-MmB-app', [
    'web-manage-my-booking-templates',
        'ngAria',
        'credit-cards',
        'LocalStorageModule',
        'pascalprecht.translate',
        'ng.deviceDetector',
        'ui.bootstrap',
        'duScroll',
        'ui.select',
        'ngAnimate',
        'ngCookies',
        'ngMessages',
        'tmh.dynamicLocale',
        'rx',
        'ib-interceptors-module',
        'rzModule',
        'oc.lazyLoad',
        'ib-MmB-routing-module',
        'ib-MmB-services-module',
        'ib-MmB-transformers-module',
        'ib-MmB-filters-module',
        'ib-MmB-search-module',
        'ib-MmB-booking-management-module',
        'ib-MmB-communication-lost-module',
        'ib-web-menus-module',
        'angular-bind-html-compile',
        'ib-inputs',
        'ib-reusable-components-module',
        'slickCarousel',
        'ib-flexibilization-module',
        'ib-commons-login-module',
        'ib-commons-utils-module',
        'ib-commons-http-service-module',
        'ib-commons-modal-service-module',
        'ib-commons-proxies-module',
        'ib-datalayer-module',
        'ngSanitize',
        'ib-availability-service',
        'ib-simulator-availability-service',
        'ib-fare-service',
        'ib-commons-ui-components-module',
        'ib-commons-directives-module',
        'ib-commons-keep-alive-module',
        'ib-header-main-page-component-module',
        'ib-commons-http-new-service-module',
        'ib-interceptors-module',
        'ib-loading-redirection-module',
        'ib-MmB-voluntary-refunds-module',
        'ib-MmB-payment-module',
        'ib-ng-react-component-module',
        'ib-mmb-payment-page-module',
        'ib-mmb-confirmation-page-module',
        'ib-mmb-search-new-module',
        'ib-mmb-trip-list-module',
        'ib-security-otp-module',
        'ib-ancillaries-modal-module',
        'ib-web-ancillaries-services-module',
        'ib-new-seat-map-module',
        'ib-mmb-umnr-passengers-module'
]);
angular.module('ib-MmB-app').run(InitMmBApp);

export { InitMmBApp };
