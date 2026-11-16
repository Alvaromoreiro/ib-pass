import * as angular from 'angular';
import dayjs from 'dayjs';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbBookingLazyLoaderAJSsingleton } from './app/core/routing/services/ib-booking-angularjs-lazy-loader';
import { IbBookingPassengerInfoUtilsService } from './app/shared/services/ib-booking-passenger-info/ib-booking-passenger-info-utils.service';
import { BookingTranslateFactoryService } from './app/core/services/ib-booking-translate-factory.service';
import { IgnoreOrderService } from './app/shared/http-services/sse-orm/ib-booking-ignore-order.service';
import 'ib-web-ancillaries/preload';
import { GetWcsPhonesService } from './app/shared/http-services/wcs/ib-booking-get-wcs-phones.service';
import { SecurityOtpService } from 'ib-web-commons/security';

class InitBookingApp {

    constructor (
        private $rootScope,
        private BookingAppConstants: BookingAppConstants,
        private CommonsLanguageAndMarketService,
        private localStorageService,
        private IbCLinksService,
        private DatalayerUtilsService,
        private BookingUtilService,
        private $sce,
        private MonetateUtilsService,
        private BookingIgnoreOrderService: IgnoreOrderService,
        private BookingPageUtilsService,
        private GetWcsPhonesService: GetWcsPhonesService,
        private BookingTranslateFactoryService:BookingTranslateFactoryService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private $ocLazyLoad,
        private IbBookingPassengerInfoUtilsService: IbBookingPassengerInfoUtilsService,
        private SecurityOtpService: SecurityOtpService
    ) {}

    activate = async (): Promise<void> => {
        IbBookingLazyLoaderAJSsingleton.$ocLazyLoad = this.$ocLazyLoad;
        let datalayerLang = this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.LANGUAGE_FROM);
        let datalayerMarket = this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.MARKET_FROM);
        //Initilize language and market
        const localObject = this.CommonsLanguageAndMarketService.init(this.BookingAppConstants.BOOKING_PARAMS_NAMES.MARKET, this.BookingAppConstants.BOOKING_PARAMS_NAMES.LANGUAGE);
        this.BookingAppConstants.lang = localObject.language;
        this.BookingAppConstants.market = localObject.market;
        //Set translation language to use
        this.BookingTranslateFactoryService.setLanguage(this.BookingAppConstants.lang);
        //Set datalayer market/Language variables
        this.CommonsSessionStorageService.setPrefix('ib-booking-app');
        datalayerMarket = !(datalayerMarket !== null && datalayerMarket.length > 0) ? this.BookingAppConstants.market : datalayerMarket.toUpperCase();
        datalayerLang = !(datalayerLang !== null && datalayerLang.length > 0) ? this.BookingAppConstants.lang : datalayerLang.toLowerCase();
        this.$rootScope.isLogged = this.localStorageService.get('userLogged');
        if (this.$rootScope.isLogged === this.BookingAppConstants.LOGIN_ONB) {
            this.$rootScope.membershipData = this.localStorageService.get('membershipData');
        } else {
            this.$rootScope.customerData = this.localStorageService.get('customerData');
        }

        this.localStorageService.get('oBDiscountType') !== null ? angular.noop : this.localStorageService.set('oBDiscountType', true);
        this.$rootScope.appMarket = this.BookingAppConstants.market;
        this.$rootScope.appLang = this.BookingAppConstants.lang;
        this.$rootScope.flowName = this.BookingAppConstants.flowName;
        this.$rootScope.showHeaders = false;
        this.$rootScope.showMainHeader = false;
        this.$rootScope.bookingPatterns = this.BookingAppConstants.bookingPatterns;
        this.$rootScope.lengthBookingPatterns = this.BookingAppConstants.FIELD_LENGTH;
        this.$rootScope.backGroundImage = this.BookingUtilService.getBackGroundURL();
        this.$rootScope.paymentBackgroundImageUrl = this.$rootScope.backGroundImage;
        this.$rootScope.appMarketDescription = this.localStorageService.get('appMarketDescription') || '';
        this.$rootScope.phonesList = {};
        this.GetWcsPhonesService.getPhoneByCode(this.BookingAppConstants.WCS.PHONE_TYPES.SALES).then(() => {
            this.$rootScope.phonesList = this.localStorageService.get('phonesList') || {};
        });
        this.$rootScope.routes = {
            icons: this.BookingAppConstants.iconsRoute,
            images: this.BookingAppConstants.imagesRoute,
            templates: this.BookingAppConstants.templatesRoute
        };
        this.$rootScope.block = true;
        this.$rootScope.serviceURI = this.BookingAppConstants.servicesURI;
        this.$rootScope.otpServicesURI = this.BookingAppConstants.otpServicesURI;
        this.IbCLinksService.getLinks(true, 'BKI');
        this.$rootScope.isMobile = this.BookingPageUtilsService.isMobile();
        this.DatalayerUtilsService.initializeDatalayer(datalayerLang, datalayerMarket, this.BookingPageUtilsService.getDeviceType());
        this.MonetateUtilsService.initializeMonetate(datalayerLang, datalayerMarket, this.BookingPageUtilsService.getDeviceType());
        
        const localeFileName = `${this.$rootScope.appLang}.js`;
        await import(
            /* webpackInclude: /[\\/](es|en|fr|de|it|pt|ru|zh|ja|ca|nl)\.js$/ */
            /* webpackChunkName: "dayjs-[request]" */
            /* webpackMode: "lazy" */
            `dayjs/locale/${localeFileName}`
        );
        dayjs.locale(this.$rootScope.appLang);
        this.$rootScope.timeSession = {
            startTime: dayjs(),
            openedModal: false,
            failedKeepAliveService: false,
            closeModalTimeWaiting: false,
            timerActivate: true
        };
        this.$rootScope.isRedemptionFlow = this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.AVIOS_PAY) || (this.localStorageService.get('searchFlightType') === this.BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION) ? true : (this.localStorageService.get('searchFlightType') === this.BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTIONOB);
        this.$rootScope.isPointsOBFlow = !!(this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.POINTS_PAY) || ((this.localStorageService.get('searchFlightType') === this.BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION) && (this.localStorageService.get('userLogged') === this.BookingAppConstants.LOGIN_ONB)));
        this.$rootScope.isShuttleFlow = false;


        this.$rootScope.MONETATE_URI = this.$sce.trustAsResourceUrl(this.BookingAppConstants.production ? '//se.monetate.net/js/2/a-5c6d3edb/p/iberia.com/entry.js' : '//se.monetate.net/js/2/a-5c6d3edb/d/preprod.iberia.com/entry.js');
        this.$rootScope.production = this.BookingAppConstants.production;
        document.documentElement.setAttribute( 'lang', this.$rootScope.appLang.toLowerCase() );
        //Init Events
        const backToMainEvent = this.$rootScope.$on('backToMainRoot', (event, goToHome, closeSession) => {
            const backToMain = (goToHome) => {
                this.BookingUtilService.backToMain(goToHome);
            };
            const createOrder = this.localStorageService.get('createOrderData');
            const orderId = createOrder?.order?.orderId ?? null;
            if (closeSession || orderId) {
                this.BookingIgnoreOrderService.ignoreOrder(orderId).then(() => {
                    this.IbBookingPassengerInfoUtilsService.deleteTemporalPNR();
                    backToMain(goToHome);
                }, () => {
                    backToMain(goToHome);
                });
            } else {
                backToMain(goToHome);
            }
        });
        const onholdLightBoxAcceptEvent = this.$rootScope.$on('acceptBuyOnhold', (event) => {
            this.BookingUtilService.onholdLightBoxAccept();
        });
        this.SecurityOtpService.initialize();
    };
 





    $onInit = this.activate();
}
InitBookingApp.$inject = ['$rootScope', 'BookingAppConstants', 'CommonsLanguageAndMarketService', 'localStorageService', 'IbCLinksService', 'DatalayerUtilsService', 'BookingUtilService', '$sce', 'MonetateUtilsService', 'BookingIgnoreOrderService', 'BookingPageUtilsService', 'GetWcsPhonesService', 'BookingTranslateFactoryService', 'CommonsSessionStorageService', '$ocLazyLoad', 'IbBookingPassengerInfoUtilsService', 'SecurityOtpService'];
/**
 * Iberia Booking Angular Application
 * @module ib-booking-app
 */
angular.module('ib-booking-app', [
    'ui.bootstrap',
    'tmh.dynamicLocale',
    'web-booking-templates',
    'ngAria',
    'rx',
    'LocalStorageModule',
    'pascalprecht.translate',
    'ng.deviceDetector',
    'ngAnimate',
    'ui.select',
    'ui.date',
    'ngMessages',
    'ngCookies',
    'rzModule',
    'oc.lazyLoad',
    'ib-booking-app-constants-module',
    'ib-booking-routing-module',
    'ib-commons-http-new-service-module',
    'ib-commons-constants-module',
    'ib-commons-avios-constants',
    'ib-commons-modal-service-module',
    'ib-commons-login-module',
    'ib-http-services-module',
    'ib-ui-login-reusable-iframe-component',
    'ib-commons-utils-module',
    'ib-commons-proxies-module',
    'ib-commons-http-service-module',
    'ib-interceptors-module',
    'ib-commons-filters-module',
    'ib-commons-ui-components-module',
    'ib-commons-directives-module',
    'ib-commons-constants-module',
    'ib-flash-offer-service-module',
    'ib-set-header-service-module',
    'ib-booking-services-module',
    'ib-booking-filters-module',
    'ib-reusable-components-module',
    'ib-booking-availability-module',
    'ib-booking-partners-module',
    'ib-datalayer-bki-module',
    'angular-bind-html-compile',
    'ngSanitize',
    'ib-booking-local-discount-selector-module',
    'ib-commons-keep-alive-module',
    'ib-set-partners-selection-module',
    'ib-booking-header-module',
    'ib-booking-root-module',
    'ib-security-otp-module'
    // 'ib-ancillary-box-module'
]);
angular.module('ib-booking-app')
    .config(['$provide', function ($provide) {
    
        $provide.decorator('$browser', ['$delegate', function ($delegate) {
            var originalUrl = $delegate.url;
      
            // Deshabilitar el listener de cambios de URL
            $delegate.onUrlChange = ()=> {};
      
            // Hacer que url() sea de solo lectura
            $delegate.url = function (url, replace, state) {
                // Solo permitir LEER la URL, no escribirla
                if (arguments.length === 0) {
                    // Getter: retornar URL actual
                    return originalUrl.call($delegate);
                }

                const parsedURL = new URL(url);
                const hash = parsedURL.hash.replace('#!', '');
                window.dispatchEvent(new CustomEvent('angularjs-navigate', { detail: { path: hash } }));
                
                return $delegate;
            };
      
            return $delegate;
        }]);
    }]).run(InitBookingApp);
