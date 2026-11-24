import type { PmtConfirmationController } from '../ib-pmt-order-confirmation-controller';

export function bindDependencies (ctrl: PmtConfirmationController, injected: unknown[]) {
    [
        ctrl.$rootScope,
        ctrl.$scope,
        ctrl.PmtModalService,
        ctrl.$window,
        ctrl.$filter,
        ctrl.PmtOrderConfirmationService,
        ctrl.DatalayerUtilsService,
        ctrl.DatalayerEcommerceUtilsService,
        ctrl.PmtDatalayerConstants,
        ctrl.PmtUtilsService,
        ctrl.PmtConstants,
        ctrl.localStorageService,
        ctrl.$timeout,
        ctrl.MonetateUtilsService,
        ctrl.PmtDatalayerUtilsService,
        ctrl.NewMainHeaderFacade,
        ctrl.DatalayerEcommerceConstants,
        ctrl.CommonsUtilService,
        ctrl.$interval,
        ctrl.DigitalDataService,
        ctrl.DatalayerMMBConstants,
        ctrl.$compile,
        ctrl.$sce,
        ctrl.$document,
        ctrl.DatalayerGeneralConstants,
        ctrl.CommonsConstants,
        ctrl.DatalayerConstants,
        ctrl.CommonsSessionStorageService,
        ctrl.DatalayerBKIConstants,
        ctrl.CommonsBrowserStorageService,
        ctrl.CommonsUserUtilsService,
        ctrl.CommonsAncillariesService
    ] = injected as [
        typeof ctrl.$rootScope,
        typeof ctrl.$scope,
        typeof ctrl.PmtModalService,
        typeof ctrl.$window,
        typeof ctrl.$filter,
        typeof ctrl.PmtOrderConfirmationService,
        typeof ctrl.DatalayerUtilsService,
        typeof ctrl.DatalayerEcommerceUtilsService,
        typeof ctrl.PmtDatalayerConstants,
        typeof ctrl.PmtUtilsService,
        typeof ctrl.PmtConstants,
        typeof ctrl.localStorageService,
        typeof ctrl.$timeout,
        typeof ctrl.MonetateUtilsService,
        typeof ctrl.PmtDatalayerUtilsService,
        typeof ctrl.NewMainHeaderFacade,
        typeof ctrl.DatalayerEcommerceConstants,
        typeof ctrl.CommonsUtilService,
        typeof ctrl.$interval,
        typeof ctrl.DigitalDataService,
        typeof ctrl.DatalayerMMBConstants,
        typeof ctrl.$compile,
        typeof ctrl.$sce,
        typeof ctrl.$document,
        typeof ctrl.DatalayerGeneralConstants,
        typeof ctrl.CommonsConstants,
        typeof ctrl.DatalayerConstants,
        typeof ctrl.CommonsSessionStorageService,
        typeof ctrl.DatalayerBKIConstants,
        typeof ctrl.CommonsBrowserStorageService,
        typeof ctrl.CommonsUserUtilsService,
        typeof ctrl.CommonsAncillariesService
    ];
}

export function initFieldsBeforeActivate (ctrl: PmtConfirmationController) {
    ctrl.LOGIN_ONB = ctrl.PmtConstants.LOGIN_ONB;
    ctrl.APP_TYPES = ctrl.PmtConstants.APP_TYPES;
    ctrl.isRegister = ctrl.localStorageService.get('isRegister');
    ctrl.isRegisterSuccesfull = ctrl.localStorageService.get('isRegisterSuccesfull');
    ctrl.flightAviosInfo = ctrl.localStorageService.get('flightAviosInfo');
    ctrl.CalculatedPoints = ctrl.localStorageService.get('CalculatedPoints');
    ctrl.isEmptyBasket = ctrl.localStorageService.get('isEmptyBasket');
    ctrl.attendanceVouchers = ctrl.localStorageService.get('attendanceVoucher');
    ctrl.isGlobickActivities = ctrl.CommonsSessionStorageService.get('isGlobickActivities') ?? null;
}

export function initConfirmationState (ctrl: PmtConfirmationController) {
    ctrl.appLang = ctrl.$rootScope.appLang;
    ctrl.appMarket = ctrl.$rootScope.appMarket;
    ctrl.urlUpgrade = buildUpgradeUrl(ctrl);
    ctrl.localStorageService.set('actualStepFlow', 'confirmation');
    ctrl.isIbZero = ctrl.CommonsUserUtilsService.isIbZero();
    readHeaderBasket(ctrl);
    ctrl.isUMFlight = new URLSearchParams(window.location.search).has('isUMFlight');
    if (ctrl.isUMFlight) {
        ctrl.travelRequirementsUrl = ctrl.$filter('LinksFilter')('UMNR_DOCUMENTATION_LINK', ctrl.appLang);
    }
    ctrl.$scope.$on('openSummaryModalTaxesEvent', ctrl.openSummaryModalTaxes);
    ctrl.$scope.$on('openSummaryModalLinksEvent', ctrl.openSummaryModalLinks);
    ctrl.$scope.$on('redirectToMMB', ctrl.redirectToMMB);
    ctrl.$scope.$on('$destroy', () => resetDatalayerOnDestroy(ctrl));
    ctrl.localStorageService.get('changeFlightsCV');
    ctrl.flags = {
        'warningCheckOut': ctrl.CommonsUtilService?.checkWarningCheckOut() ?? false
    };
    ctrl.isErrorDeleteAll = ctrl.localStorageService.get('errorDeleteAllUPGAVIOS');
    ctrl.isPaymentWithAvios = resolveIsPaymentWithAvios(ctrl);
}

export function buildUpgradeUrl (ctrl: PmtConfirmationController) {
    return ctrl.$filter('LinksFilter')('UPGRADE')
        .split('/mi-iberia')[0]
        .concat('/' + ctrl.appMarket.toLocaleLowerCase())
        .concat('/' + ctrl.appLang + '/mi-iberia')
        .concat(ctrl.$filter('LinksFilter')('UPGRADE').split('/mi-iberia')[1]);
}

export function readHeaderBasket (ctrl: PmtConfirmationController) {
    const headerModel: any = ctrl.CommonsSessionStorageService.get('headerModel');
    if (!headerModel) {
        return;
    }
    applyHeaderBasket(ctrl, headerModel);
}

export function applyHeaderBasket (ctrl: PmtConfirmationController, headerModel: any) {
    const globickData = headerModel.headerModel.shoppingBasket.globickTransfers.hasTransfersGlobick;
    ctrl.isPetPurchased = headerModel.headerModel.shoppingBasket.petc?.hasPetc;
    ctrl.recoglobickTransferBki = globickData ? false : true;
}

export function resetDatalayerOnDestroy (ctrl: PmtConfirmationController) {
    if (isVoluntaryChangeApp(ctrl)) {
        ctrl.PmtDatalayerUtilsService.resetDatalayer();
    }
}

export function isVoluntaryChangeApp (ctrl: PmtConfirmationController) {
    if (ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE) {
        return true;
    }
    return ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED;
}

export function resolveIsPaymentWithAvios (ctrl: PmtConfirmationController) {
    const totalAviosAmount = ctrl.localStorageService.get('totalAviosAmount');
    if (totalAviosAmount) {
        return true;
    }
    if (totalAviosAmount === 0) {
        return true;
    }
    return !!ctrl.localStorageService.get('numberFreeUpgrade');
}
