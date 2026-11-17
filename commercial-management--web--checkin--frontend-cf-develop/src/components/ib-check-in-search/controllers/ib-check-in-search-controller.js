(function () {
    'use strict';
    /**
     * Main controller for IBCOSE view
     */
    angular
        .module('ib-check-in-search')
        .controller('CheckInSearchController', CheckInSearchController);//Controller for IBCOSE view

    CheckInSearchController.$inject = ['$rootScope', '$scope', 'ModalService', 'CkiDatalayerUtilsService', 'CkiDatalayerConstants', '$window', '$timeout', 'CheckInSearchModel', 'CheckinSearchService', 'CheckinAppConstants', '$location', 'localStorageService', 'SearchFlightsPassengersService', 'ComponentUtils', 'MonetateUtilsService', 'MonetateConstants', 'RedirectionService', '$filter', 'CkiDataLayerService', 'IbSessionConfigService', 'IbUtilsService', 'CheckinFlowService'];
    function CheckInSearchController ($rootScope, $scope, ModalService, CkiDatalayerUtilsService, CkiDatalayerConstants, $window, $timeout, CheckInSearchModel, CheckinSearchService, CheckinAppConstants, $location, localStorageService, SearchFlightsPassengersService, ComponentUtils, MonetateUtilsService, MonetateConstants, RedirectionService, $filter, CkiDataLayerService, IbSessionConfigService, IbUtilsService, CheckinFlowService) {
        const vm = this;
        vm.addOnType;
        vm.model = CheckInSearchModel;
        vm.formIberiaPlus;
        vm.isOnbUserLogged = false;

        //ctrl functions
        vm.openGenericModal = openGenericModal;
        vm.isValidateForm = isValidateForm;
        vm.submitForm = submitForm;
        vm.moreInfoRedirection = moreInfoRedirection;
        vm.onError = onError;
        vm.showWaitingModal = showWaitingModal;
        vm.afterLogin = afterLogin;
        vm.updateDatalayerByQuadrigam = updateDatalayerByQuadrigam;
        vm.initModel = initModel;

        $scope.$on('anonymousSubmit', (event, data) => {
            initBooking(data.pnr, data.surname);
        });

        //Delete all calls to openGenericModal
        $scope.$on('openGenericModal',
            (event, size, tpl, anim) => {
                openGenericModal(size, tpl, anim);
            });
        const bannerRenderedEvent = $rootScope.$on('bannerRenderedEvent', (event, containsAd) => {
            $rootScope.$apply(() => {
                vm.model.containsAd = containsAd;
                vm.model.showAds = containsAd;
            });
        });
        const initializeIsAddOnEvent = $rootScope.$on('initializeIsAddOnEvent', () => {
            $rootScope.$apply(() => {
                vm.model.containsAd = false;
                vm.model.showAds = false;
            });
        });
        const executeInitCheckin = $rootScope.$on('loginContinueEvent', () => {
            CheckinSearchService.initCheckin();
        });
        $scope.$on('$destroy', bannerRenderedEvent);
        $scope.$on('$destroy', initializeIsAddOnEvent);
        $scope.$on('$destroy', executeInitCheckin);

        activate();

        ////////////////
        function activate () {
            const activationContext = initializeActivation();
            const {
                travelAgencies,
                reInvoicing,
                travelAgent,
                redirectStatus,
                redirectionPaymentCallback,
                urlMail,
                redirectionPmtContext
            } = activationContext;
            let quadrigam = activationContext.quadrigam;

            if (redirectionPmtContext?.status === CheckinAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT_STATUS_INIT) {
                localStorageService.set('nextStepAllowed', true);
                localStorageService.set(CheckinAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT, { ...redirectionPmtContext, status: CheckinAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT_STATUS_END });
                $location.path('/ibpurc');
                return;
            }

            if (!redirectionPmtContext?.status === CheckinAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT_STATUS_INIT) {
                localStorageService.remove(CheckinAppConstants.STORAGE_KEYS.PMT_VIEW_TYPE);
            }

            const redirectToPayment = redirectionPaymentCallback?.status && redirectStatus;
            if (redirectToPayment) {
                goToPayment(redirectionPaymentCallback, redirectStatus);
            } else {
                setRedirectLinkMail(urlMail);
                CheckinSearchService.initCheckin();
                if (travelAgencies && reInvoicing) {
                    vm.deInvoicingScreen = true;
                    quadrigam = CheckinAppConstants.QUADRIGAM.UN_SEARCH;
                    if (travelAgent === 'PUBLICUSER') {
                        ModalService.showGenericModal(true, true, 'ib-modal-need-login').result.then(goToIberAgencias, angular.noop);
                    }
                }
                vm.updateDatalayerByQuadrigam(quadrigam);
                localStorageService.set('nextStepAllowed', false);
                localStorageService.set('actualStepFlow', 'ibcose');
                vm.initModel();
            }

            vm.isOnbUserLogged = localStorageService.get('userLogged') === CheckinAppConstants.LOGIN_ONB;

            if (quadrigam === CheckinAppConstants.QUADRIGAM.UN_SEARCH) {
                IbUtilsService.setTitlePage('CKI_TITLE_PAGE_UNCOSE', 2100);
            }

            /* INIT DELETE GA4 MIGRATION*/
            updateOldGA4();
            /* FINISH DELETE GA4 MIGRATION*/

        }

        function updateOldGA4 () {
            /* INIT DELETE GA4 MIGRATION*/
            const extendedDatalayerInfo = {};
            extendedDatalayerInfo[CkiDatalayerConstants.DATALAYER_INFO.DYNAMIC_PRICING_SEAT] = CheckinSearchService.getDinamicPricingCookieParameter() ? 'SI' : 'NO';
            CkiDatalayerUtilsService.addDataLayerInfo(extendedDatalayerInfo);
            /* FINISH DELETE GA4 MIGRATION*/
        }

        function setRedirectLinkMail (urlMail) {
            if (urlMail) {
                localStorageService.set('redirectLinkMail', true);
            }
        }

        function goToPayment (redirectionPaymentCallback, redirectStatus) {
            angular.extend(redirectionPaymentCallback, { redirectStatus: redirectStatus, paymentStatus: redirectStatus });
            localStorageService.set('nextStepAllowed', true);
            localStorageService.set('redirectionPaymentCallback', redirectionPaymentCallback);
            $location.path('/ibpurc');
        }

        function initializeActivation () {
            const activationContext = getActivationContext();
            const quadrigam = CheckinAppConstants.QUADRIGAM.SEARCH;

            let contNextStep = localStorageService.get('contNextStep');
            contNextStep = contNextStep ? contNextStep++ : 1;
            localStorageService.set('contNextStep', contNextStep);

            IbUtilsService.setTitlePage(CheckinAppConstants.TITLE_PAGE.SEARCH, 2100);
            $rootScope.showMainHeader = true;
            $rootScope.showMainFooter = true;
            $rootScope.showHeaders = true;
            localStorageService.set('nextStepAllowed', false);
            localStorageService.set('nextStepAllowedHome', true);
            CheckinFlowService.warnUserOnBackPressed();
            CkiDatalayerUtilsService.resetDatalayer();
            const redirectionPmtContext = localStorageService.get(CheckinAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT);

            return {
                ...activationContext,
                quadrigam,
                redirectionPmtContext
            };
        }

        function getActivationContext () {
            const travelAgencies = IbUtilsService.getTravelAgencies(CheckinAppConstants.UNDOCHECKIN.CKI_AAVV);
            const reInvoicing = IbUtilsService.getTravelAgencies(CheckinAppConstants.UNDOCHECKIN.UNDOCKI);
            const travelAgent = IbUtilsService.getParameterByName({
                name: CheckinAppConstants.URL_PARAMS.TRAVEL_AGENT
            });
            const paymentStatus = IbUtilsService.getParameterByName({
                name: CheckinAppConstants.URL_PARAMS.PAYMENT_STATUS
            });
            const componentType = IbUtilsService.getParameterByName({
                name: CheckinAppConstants.URL_PARAMS.COMPONENT_TYPE
            });
            const redirectStatus = paymentStatus === 'OK' || paymentStatus === 'KO' || componentType;
            const redirectionPaymentCallback = localStorageService.get('redirectionPaymentCallback');
            const urlMail = new URLSearchParams(window.location.search).get('linkmail');

            return {
                travelAgencies,
                reInvoicing,
                travelAgent,
                redirectStatus,
                redirectionPaymentCallback,
                urlMail
            };
        }

        function onError (error) {
            ModalService.finishWaiting();
        }

        function showWaitingModal () {
            ModalService.isWaiting();
        }

        function afterLogin () {
            CheckinSearchService.initCheckin();
        }

        function moreInfoRedirection () {
            RedirectionService.newNavigation($window.location.origin + CheckinAppConstants.WEB_CENTER_REDIRECT.REDIRECTION_START + CheckinAppConstants.WEB_CENTER_REDIRECT.MARKET_QUERY + $rootScope.appMarket + CheckinAppConstants.WEB_CENTER_REDIRECT.LANGUAGE_QUERY + $rootScope.appLang + CheckinAppConstants.WEB_CENTER_REDIRECT.QUADRIGAM_QUERY + CheckinAppConstants.WEB_CENTER_REDIRECT.SEARCH_MORE_INFO, CheckinAppConstants.WEB_CENTER_REDIRECT.BLANK);
        }

        function goToIberAgencias () {
            $window.location.href = 'https://www.iberiagencias.com';
        }

        /**
         * @function
         * @name openGenericModal
         * @desc opens a modal in the current view
         */
        function openGenericModal (size, tpl, anim) {
            ModalService.openGenericModal(size, tpl, anim, { idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.CHECKIN_ONLINE_MORE_INFO }).result.then(angular.noop, angular.noop);
        }

        /**
         * @function
         * @name isWaiting
         * @desc opens a modal in the current view
         */
        function isValidateForm (event) {
            if (!vm.formIberiaPlus.$valid) {
                event.preventDefault();
            }
        }

        function submitForm () {
            vm.formIberiaPlus.$submitted = true;
            if (vm.formIberiaPlus.$valid) {
                ModalService.isWaiting();
            }
        }

        function initBooking (pnr, surname) {
            IbSessionConfigService.initStorage();
            localStorageService.set('confirmationPNR', false);
            IbSessionConfigService.setPNR(pnr);
            localStorageService.set('checkinSurname', IbUtilsService.cleanSpaces(surname));
            SearchFlightsPassengersService.searchFlighsPassengersByLocatorAndSurname(surname, IbUtilsService.cleanSpaces(pnr), false);
        }

        function callViewEvent () {
            /* INIT DELETE GA4 MIGRATION*/
            CkiDatalayerUtilsService.sendDatalayerEvent(CkiDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
            /* FINISH DELETE GA4 MIGRATION*/
            CkiDatalayerUtilsService.updateDatalayerViewEvent();
        }

        function updateDatalayerByQuadrigam (quadrigam) {
            CkiDatalayerUtilsService.updateDatalayerInfo(quadrigam, null, IbSessionConfigService.isUserLogged());
            MonetateUtilsService.updateMonetateWithQuadrigam(MonetateConstants.MONETATE_INFO.SETPAGETYPE, quadrigam);
            CkiDataLayerService.setProcessAndStep(quadrigam);
            $timeout(() => {
                $rootScope.$broadcast('updateDatalayer');
                $rootScope.$broadcast('sendUpdateToMonetate');
            });
        }

        function initModel () {
            callViewEvent();
            vm.model.loginParameters = {
                language: CheckinAppConstants.lang,
                market: CheckinAppConstants.market,
                returnURL: $location.absUrl(),
                loginURL: $filter('LinksFilter')('IBERIA_NEW_LOGIN')
            };
            vm.model.containsAd = false;
            vm.model.showAds = true;
        }
    }
})();
