import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';

export function updateBasketDiscountsFromOrder(ctrl: PmtPageController, createOrderData: any, previousAncillaries: any): void {
    const headerModelData = ctrl.localStorageService.get('headerModel');
    headerModelData.headerModel.shoppingBasket.discountsModel.total = createOrderData.order.discountsApplied.totalDiscount;
    headerModelData.headerModel.shoppingBasket.discountsModel.totalFormated = ctrl.CurrencyService.formatPrice(
        ctrl.model.paymentInfo.currency,
        createOrderData.order.discountsApplied.totalDiscount,
        true
    );
    headerModelData.headerModel.shoppingBasket.total.totalPrice = ctrl.model.paymentInfo.price.totalPrice;
    headerModelData.headerModel.shoppingBasket.total.totalPrice -= (previousAncillaries?.total ?? 0);
    headerModelData.headerModel.shoppingBasket.total.formatted = ctrl.model.paymentInfo.price.formattedTotalPrice;
    headerModelData.headerModel.shoppingBasket.discountsModel.discounts = ctrl.model.paymentInfo?.appliedDiscounts?.types ?? {};
    headerModelData.headerModel.shoppingBasket.discountsModel.hasDiscounts = Object.keys(headerModelData.headerModel.shoppingBasket.discountsModel.discounts).length > 0;
    ctrl.NewMainHeaderFacade.updateHeaderModel(headerModelData);
    ctrl.model.paymentInfo.appliedDiscounts.status = headerModelData.headerModel.shoppingBasket.discountsModel.hasDiscounts;
    ctrl.updateDisccountsTotal(false, ctrl.model.paymentInfo.appliedDiscounts.types);
}

export function syncModelAfterPaymentMethodsLoad(ctrl: PmtPageController, data: any): any {
    ctrl.model = data;
    ctrl.localStorageService.set('modelPaymentData', data);
    ctrl.model.selectedData.selectedTab = ctrl.getActivateSelectedTab(
        ctrl.localStorageService.get('selectedPaymentMethod'),
        ctrl.model.paymentInfo.paymentMethods
    );
    ctrl.$scope.$broadcast('updateSelectedTabEvent', ctrl.model.selectedData.selectedTab);
    angular.element(ctrl.$window).triggerHandler('resize');
    const headerModelData = ctrl.localStorageService.get('headerModel');
    ctrl.selectedData = ctrl.localStorageService.get('selectedPaymentData')
        ? ctrl.localStorageService.get('selectedPaymentData')
        : ctrl.selectedData
            ? ctrl.selectedData
            : {};
    return headerModelData;
}

export function syncBasketDiscountsFromOrder(
    ctrl: PmtPageController,
    createOrderData: any,
    previousAncillaries: any,
    hasBasketDiscounts: boolean
): void {
    if (!hasBasketDiscounts) {
        return;
    }
    ctrl.populateAppliedDiscountsFromCreateOrderData(createOrderData);
    updateBasketDiscountsFromOrder(ctrl, createOrderData, previousAncillaries);
}

export function syncDiscountDatalayer(ctrl: PmtPageController, createOrderData: any): void {
    if (!createOrderData?.order) {
        return;
    }
    ctrl.DatalayerUtilsService.updateDiscountData(createOrderData.order?.specialDiscounts ?? []);
}
