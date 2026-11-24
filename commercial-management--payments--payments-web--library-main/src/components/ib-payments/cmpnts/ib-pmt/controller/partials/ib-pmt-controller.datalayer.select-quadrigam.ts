import type { PmtPageController } from '../ib-pmt-controller';

const FLOW_APP_QUADRIGAMS: Record<string, (ctrl: PmtPageController) => string> = {
    PAOB: (ctrl) => ctrl.PmtConstants.QUADRIGAMS.PA_PASSENGERS,
    PAOBONB: (ctrl) => ctrl.PmtConstants.QUADRIGAMS.PA_PASSENGERS_ONB,
    PARE: (ctrl) => ctrl.PmtConstants.QUADRIGAMS.PA_PASSENGERS_REDENTION,
    PAREONB: (ctrl) => ctrl.PmtConstants.QUADRIGAMS.PA_PASSENGERS_ONB_REDENTION,
    BBKI: (ctrl) => ctrl.PmtConstants.QUADRIGAMS.BKI_PAYMENT
};

function resolveMultiCityQuadrigam(ctrl: PmtPageController): string {
    if (ctrl.localStorageService.get('isHMAD')) {
        return ctrl.PmtConstants.QUADRIGAMS.HMAD_PASSENGERS_INFO;
    }
    return ctrl.PmtConstants.QUADRIGAMS.MULTI_PASSENGERS_INFO;
}

function resolveRedemptionQuadrigam(ctrl: PmtPageController): string {
    if (ctrl.$rootScope.isPointsOBFlow) {
        return ctrl.PmtConstants.QUADRIGAMS.PA_PASSENGERS_ONB_REDENTION;
    }
    return ctrl.PmtConstants.QUADRIGAMS.PA_PASSENGERS_REDENTION;
}

function resolveFlowAppQuadrigam(ctrl: PmtPageController): string | undefined {
    const resolver = FLOW_APP_QUADRIGAMS[ctrl.localStorageService.get('flowApp')];
    return resolver ? resolver(ctrl) : undefined;
}

export function selectQuadrigamImpl(ctrl: PmtPageController) {
    if (ctrl.localStorageService.get('multiCitySearch')) {
        return resolveMultiCityQuadrigam(ctrl);
    }
    if (ctrl.$rootScope.isRedemptionFlow) {
        return resolveRedemptionQuadrigam(ctrl);
    }
    return resolveFlowAppQuadrigam(ctrl);
}
