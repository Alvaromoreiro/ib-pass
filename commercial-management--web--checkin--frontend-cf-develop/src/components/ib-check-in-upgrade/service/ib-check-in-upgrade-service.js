(function () {
    'use strict';

    angular
        .module('ib-check-in-upgrade-module')
        .factory('UpgradeService', UpgradeService);

    UpgradeService.$inject = ['$rootScope', '$q', 'localStorageService', 'GetCKICachedInformationService', '$location', 'UpgradeTransformer', 'ModalService', 'CheckPaymentsService', 'CheckAncillariesService', 'CommonsAncillariesService', '$sce', 'CheckinAppConstants', 'NewMainHeaderFacade', 'IbAncillariesPaymentUtilsService'];
    function UpgradeService ($rootScope, $q, localStorageService, GetCKICachedInformationService, $location, UpgradeTransformer, ModalService, CheckPaymentsService, CheckAncillariesService, CommonsAncillariesService, $sce, CheckinAppConstants, NewMainHeaderFacade, IbAncillariesPaymentUtilsService) {

        return {
            generateUpgradeModel: generateUpgradeModel,
            updateUpgradeInformation: updateUpgradeInformation,
            initRenacen3dScript: initRenacen3dScript
        };

        ////////////////

        function generateUpgradeModel () {
            const deferred = $q.defer();
            const upgradeInfo = localStorageService.get('upgradeInfo');
            let cachedInfo;
            if (upgradeInfo !== null) {
                cachedInfo = localStorageService.get('bookingInfo');
                if (cachedInfo !== null) {
                    cachedInformationSuccess(cachedInfo);
                } else {
                    GetCKICachedInformationService.getCachedInformation().then(cachedInformationSuccess, cachedInformationError);
                }
            } else {
                goToAncillaries();
                deferred.reject();
            }
            return deferred.promise;

            function cachedInformationSuccess (cachedInfo) {
                const transformedUpgradeInfo = UpgradeTransformer.generateUpgradeModel(upgradeInfo, cachedInfo);
                ModalService.isNotWaiting();
                deferred.resolve(transformedUpgradeInfo);
            }

            function cachedInformationError (error) {
                deferred.reject(error);
                goToAncillaries();
            }
        }

        function updateUpgradeInformation (upgradeInformation, offerCabinLayout) {
            const upgradeInfo = { offer: upgradeInformation, cabins: offerCabinLayout };
            const upgradeResponse = { acceptedSegments: [] };
            ModalService.isWaiting();
            const ancillaryRequest = [{ type: 'UPGRADING', offer: upgradeInformation.offer, upgradingAccepted: upgradeInformation.upgradingAccepted }];
            CommonsAncillariesService.updateAncillaries(ancillaryRequest).then(updateUpgradeSuccess, updateUpgradeError);


            function updateUpgradeSuccess (response) {
                const pnr = localStorageService.get('PNR');
                upgradeResponse.acceptedSegments = response?.[0]?.segments ?? [];
                CommonsAncillariesService.getAncillarieSummary(undefined, null, pnr).then(CommonsAncillariesServiceSucess, updateUpgradeError);
            }

            function CommonsAncillariesServiceSucess (ancillariesSummary) {
                let cachedInfo, headerModel;
                const seats = {};
                if (upgradeInformation && upgradeInformation.upgradingAccepted) {
                    cachedInfo = localStorageService.get('bookingInfo');
                    localStorageService.set('bookingInfo', UpgradeTransformer.modifiedCachedInfo(upgradeResponse, offerCabinLayout ? offerCabinLayout : '', cachedInfo));
                    localStorageService.set('pendingPayments', true);
                    headerModel = localStorageService.get('headerModel');
                    if (headerModel.headerModel && headerModel.headerModel.shoppingBasket) {
                        headerModel.headerModel.shoppingBasket.seats = seats.segments = [], seats.hasSeats = false;
                        NewMainHeaderFacade.updateHeaderModel(headerModel);
                    }
                    $rootScope.$broadcast('updateHeaderUpgrading', IbAncillariesPaymentUtilsService.getHeaderUpgradingInfo(ancillariesSummary.pendingPaymentItems));
                    localStorageService.set('upgradinfInfoAccepted', upgradeInfo);
                }
                IbAncillariesPaymentUtilsService.setAncillariesCurrency(ancillariesSummary.currencies, ancillariesSummary.context.issueCurrency);
                goToAncillaries();
            }


            function updateUpgradeError (error) {
                ModalService.isNotWaiting();
                ModalService.setErrorMessage(error.message);
                ModalService.setErrorCode(error.internalErrorCode);
                ModalService.isError(error);
            }
        }

        function goToAncillaries () {
            const pendingPayments = localStorageService.get('pendingPayments');
            localStorageService.set('nextStepAllowed', false);
            CheckAncillariesService.checkAncillaries().then(goToAncillariesSucess, goToAncillariesError);

            function goToAncillariesSucess (data) {
                ModalService.isNotWaiting();
                if (localStorageService.get('ancillariesInfo')) {
                    $location.path('/ckianc');
                } else {
                    CheckPaymentsService.checkPayments();
                }
            }
            function goToAncillariesError () {
                if (pendingPayments) {
                    CheckPaymentsService.checkPayments();
                    ModalService.isNotWaiting();
                } else {
                    ModalService.isNotWaiting();
                    $location.path('/ibecbp');
                }
            }
        }

        function initRenacen3dScript () {
            const envCopy = {};
            (Object).assign(envCopy, window.env);
            let renacen3dFeaturesCss = '';
            let renacen3dFeaturesJs = '';

            if (envCopy.production) {
                renacen3dFeaturesCss = $sce.trustAsResourceUrl(CheckinAppConstants.DEFAULT_ENDPOINTS.renacen3dFeaturesCssPRO);
                renacen3dFeaturesJs = $sce.trustAsResourceUrl(CheckinAppConstants.DEFAULT_ENDPOINTS.renacen3dFeaturesJsPRO);
            } else {
                renacen3dFeaturesCss = $sce.trustAsResourceUrl(CheckinAppConstants.DEFAULT_ENDPOINTS.renacen3dFeaturesCssPRO);
                renacen3dFeaturesJs = $sce.trustAsResourceUrl(CheckinAppConstants.DEFAULT_ENDPOINTS.renacen3dFeaturesJsPRO);
            }

            const script = document.createElement('script');
            script.src = renacen3dFeaturesJs;
            document.querySelector('body').prepend(script);
            const link = document.createElement('link');
            link.href = renacen3dFeaturesCss;
            link.type = 'text/css';
            link.rel = 'stylesheet';
            document.querySelector('body').prepend(link);
        }
    }
})();
