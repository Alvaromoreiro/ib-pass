
import type { PmtPageController } from '../ib-pmt-controller';

export function updateAviosCalculatedImpl(ctrl: PmtPageController) {
        const pointsData = ctrl.localStorageService.get('CalculatedPoints');
        ctrl.aviosToEarn = pointsData ? pointsData.Avios : 0;
        ctrl.elitePointsToEarn = pointsData ? pointsData.Elite : 0;
}

export function aviosCalculatedErrorImpl(ctrl: PmtPageController) {
        ctrl.aviosToEarn =  0;
        ctrl.elitePointsToEarn =  0;
}

export function $onDestroyImpl(ctrl: PmtPageController) {
        ctrl.clearIberiaPayIframeLoadTimeout();
        ctrl.nemuruAvailableObserver.unsubscribe();
        ctrl.dccDataObersever.unsubscribe();
}
