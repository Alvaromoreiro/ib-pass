import angular from "angular";
import { MMBDatalayerConstants } from "../services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";


@Component(
    'ib-MmB-search-module',
    'ibMmbSearchComponent',
    {
        controllerAs: 'searchCtrl',
        templateUrl: ['MmBAppConstants', 'MmBRouterConstants', (MmBAppConstants, MmBRouterConstants) => {
            return MmBAppConstants.templatesRoute + MmBRouterConstants.searchViewRoute;
        }]
    },
    ['$rootScope', '$timeout', 'MmBAppConstants', 'localStorageService', '$location', 'MmBSearchService', '$scope', 'MmBModalService', 'BookingSearchService', 'MmBDatalayerUtilsService', 'MmBUtilService', 'ComponentsUtils', 'CommonsGetWcsPhonesService', '$filter', 'RedirectionService', 'CommonsUtilService'],

    [])
export class ibMmbSearchComponent {

    bannerRenderedEvent;
    initializeIsAddOnEvent;
    logginContinueEvent;
    containsAd;
    showAds;
    loginParameters;
    isOnbUserLogged;

    constructor(
        private $rootScope,
        private $timeout,
        private MmBAppConstants,
        private localStorageService,
        private $location,
        private MmBSearchService,
        private $scope,
        private MmBModalService,
        private BookingSearchService,
        private MmBDatalayerUtilsService,
        private MmBUtilService,
        private ComponentsUtils,
        private CommonsGetWcsPhonesService,
        private $filter,
        private RedirectionService,
        private CommonsUtilService) {
        this.$scope.$on('anonymousSubmit', (event, data) => this.handleBookingSearch(data));
        this.$scope.$on('openGenericModal', this.openGenericModal);
        this.$scope.$on('showWaitingModal', this.showWaitingModal);
        this.$scope.$on('modalDeepLinkErrorEvent', this.modalDeepLinkError);
        this.CommonsGetWcsPhonesService.getPhoneByCode(this.MmBAppConstants.WCS.PHONE_TYPES.IBHOLIDAYS);
        this.bannerRenderedEvent = this.$rootScope.$on('bannerRenderedEvent', (event, containsAd) => {
            this.$rootScope.$apply(() => {
                this.containsAd = containsAd;
                this.showAds = containsAd;
            });
            $timeout(() => {
                this.ComponentsUtils.equalHeight(angular.element('#check_in_boxes'));
            });
        });
        this.initializeIsAddOnEvent = this.$rootScope.$on('initializeIsAddOnEvent', () => {
            this.$rootScope.$apply(() => {
                this.containsAd = false;
                this.showAds = false;
            });
        });
        this.logginContinueEvent = this.$rootScope.$on('loginContinueEvent', this.$onInit);
        this.$scope.$on('destroy', this.logginContinueEvent);
        this.$scope.$on('$destroy', this.bannerRenderedEvent);
        this.$scope.$on('$destroy', this.initializeIsAddOnEvent);
    }

    $onInit = () => {
        const market = this.$rootScope.appMarket;
        if (this.MmBAppConstants.NEWMMB_TRIPLIST_MARKETS.indexOf(market) !== -1 && !this.localStorageService.get('digitalWebError')) {
            this.$location.path('/chktrpnew');
            return;
        };
        this.localStorageService.remove('digitalWebError');
        const paymentStatus = this.MmBUtilService.getURLFirstParameterByName('paymentStatus');
        const componentType = this.MmBUtilService.getURLFirstParameterByName('componentType');
        const paySucces = this.localStorageService.get('paySucces') || null;
        this.$rootScope.showMainHeader = true;
        this.$rootScope.showHeaders = true;
        this.$rootScope.$emit('clearBasket', {});
        this.$rootScope.$broadcast('hideBasket', {});
        this.$rootScope.$broadcast('backToMainBackground', false);
        this.localStorageService.remove('voucherDeleteInfo');


        if (this.conditionalPaymentStatus(paymentStatus, componentType, paySucces)) {
            this.$location.path('/ohinfo');
        } else {
            this.$timeout(() => {
                this.CommonsUtilService.setTitlePage('MMB_TITLE_TICKET_SEARCH');
            }, 1500);
            this.MmBSearchService.initializeFlow();
            this.MmBDatalayerUtilsService.updateDatalayerInfo(null, null, this.MmBAppConstants.QUADRIGAM.SEARCH);
            this.localStorageService.set('flowApp', this.MmBAppConstants.flowName);
            this.loginParameters = {
                language: this.MmBAppConstants.lang,
                market: this.MmBAppConstants.market,
                returnURL: this.$location.absUrl()
            };
            this.containsAd = false;
            this.showAds = true;
            if (this.localStorageService.get('deepLinkParams')) {
                this.BookingSearchService.searchFlightsPassengersEvent(null, { pnr: null, surname: null });
            }
        }
        this.localStorageService.remove('activitiesData');
        this.localStorageService.remove('bookingReferencesActivities');
        this.localStorageService.remove('removeGlobickActivities');
        this.isOnbUserLogged = this.localStorageService.get('userLogged')=== this.MmBAppConstants.LOGIN_ONB;
    }

    private conditionalPaymentStatus = (paymentStatus, componentType, paySucces) => {
        return (paymentStatus === 'OK' || paymentStatus === 'KO' || componentType) && !paySucces
    };

    openGenericModal = (event, data) => {
        this.MmBModalService.showGenericModal(data.isBlocked, data.template, { idModal: MMBDatalayerConstants.DATALAYER_MODAL_ID.WHERE_IS_PNR }).result.then(angular.noop, angular.noop);
    }

    showWaitingModal = () => {
        this.MmBModalService.showWaitingModal();
    }

    afterLogin = () => {
        this.$rootScope.$emit('loginHeaderUpdate');
        this.$onInit();
    }

    onError = (error) => {
        this.MmBModalService.finishWaiting();
    }

    /**
    * This functions is executed by event when ancillaries service response with a error and the user stay on deepLink flow.
    * Show a modal with the information and  redirect at user to external company origin url.
    * @param {Event} modalDeepLinkErrorEvent event executed if the ancillaries service failed.
    * @returns {VoidFunction}
    */
    modalDeepLinkError = (event) => {
        var airlineName = this.localStorageService.get('bookingInfo').deepLinkInformation && this.localStorageService.get('bookingInfo').deepLinkInformation.airline.name || '',
            modelObject = {
                title: { needsTranslate: true, message: 'MMB_DEEPLINK_ERROR_MODAL_TITLE' },
                message: 'MMB_DEEPLINK_ERROR_MODAL_MESSAGE',
                buttonMessage: (this.$filter('translate')('MMB_DEEPLINK_COMEBACK_TO')) + ' ' + airlineName,
                needsTranslate: true
            };
        this.MmBModalService.finishWaiting();
        this.MmBModalService.showGenericError(modelObject, true, null).result.then(() => {
            this.redirectToExternalAirline();
        }, () => {
            this.redirectToExternalAirline();
        });
    }

    private redirectToExternalAirline = () => {
        var returnUrl = this.localStorageService.get('bookingInfo').deepLinkInformation.returnUrl;
        this.RedirectionService.externalRedirect(returnUrl, false);
    }

    handleBookingSearch = (data) => {
        this.BookingSearchService.searchFlightsPassengersEvent(null, data)
    }
}
