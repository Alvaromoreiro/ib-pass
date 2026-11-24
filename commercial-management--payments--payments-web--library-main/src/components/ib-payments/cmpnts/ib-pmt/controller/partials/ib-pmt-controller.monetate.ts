import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';

export function checkAssistCardAncillaryImpl(ctrl: PmtPageController) {
        const assistCardPurchased = ctrl.localStorageService.get('assistCardPurchased');
        const modalObject = {
            title: 'ANCILLARIES_ASSIST_CARD_INFO_MODAL_TITLE',
            message: 'ANCILLARIES_ASSIST_CARD_INFO_MODAL_MESSAGE',
            needsTranslate: false,
            showbuttons: {
                accept: {
                    status: true,
                    text: 'MODAL_ACCEPT_BUTTON',
                    accessibleText: 'MODAL_ACCEPT_BUTTON'
                }
            }
        };
        if (assistCardPurchased) {
            ctrl.PmtAssFassAncillariesService.deleteAssistCard().then((data) => {
                ctrl.checkBasket(null);
                ctrl.PmtModalService.showGenericError(modalObject, false, ctrl.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(angular.noop, angular.noop);
                ctrl.updateBasketWithoutAC ();            
            }, angular.noop);
        }
}

export function updateBasketWithoutACImpl(ctrl: PmtPageController) {
        let headerModelData = ctrl.localStorageService.get('headerModel');
        ctrl.localStorageService.remove('assistCardPurchased');
        if (headerModelData.headerModel.shoppingBasket?.assistCard) {
            headerModelData.headerModel.shoppingBasket.total.totalPrice = headerModelData.headerModel.shoppingBasket.total.totalPrice - headerModelData.headerModel.shoppingBasket.assistCard.total.total;
            headerModelData.headerModel.shoppingBasket.total.formatted = ctrl.CurrencyService.formatPrice(ctrl.model.paymentInfo.currency, headerModelData.headerModel.shoppingBasket.total.totalPrice, true);
            headerModelData.headerModel.shoppingBasket.assistCard.hasAssistCard = false;
            headerModelData.headerModel.shoppingBasket.assistCard.name = '';
            headerModelData.headerModel.shoppingBasket.assistCard.total = 0;
        }
        ctrl.NewMainHeaderFacade.updateHeaderModel(headerModelData);
}

export function trackInfoToMonetateImpl(ctrl: PmtPageController) {
        const bookingUrlParams = ctrl.localStorageService.get('bookingUrlParams');
        ctrl.trackShoppingBasketInMonetate(ctrl.model.summaryInfo.ancillaries);
        ctrl.trackPassengersFlightInMonetate(bookingUrlParams);
        ctrl.trackFlightCabinInMonetate(ctrl.localStorageService.get('fareData'), ctrl.localStorageService.get('bookingUrlParams'));
        ctrl.trackTripTypeInMonetate(bookingUrlParams.originDestinations);
        ctrl.trackFareTypeSelectedInMonetate(ctrl.localStorageService.get('fareFamilyConditionsInfo'));
        ctrl.trackFlightDestinationInMonetate(ctrl.localStorageService.get('destinationAreasCitiesList'), bookingUrlParams.originDestinations);
        ctrl.$rootScope.$broadcast('sendUpdateToMonetate');
}

export function trackShoppingBasketInMonetateImpl(ctrl: PmtPageController, ancillaries) {
        if (ancillaries) {
            ctrl.MonetateUtilsService.trackAncillariesProductsAdded(ancillaries, ctrl.MonetateConstants.TRACK_PLACE.CART);
        }
}

export function trackPassengersFlightInMonetateImpl(ctrl: PmtPageController, passengersInfo) {
        if (passengersInfo) {
            ctrl.MonetateUtilsService.trackFlightPassengers(passengersInfo);
        }
}

export function trackFlightCabinInMonetateImpl(ctrl: PmtPageController, selectedTripInfo, bookingUrlParams) {
        if (selectedTripInfo && selectedTripInfo.fareFamilyConditions && selectedTripInfo.fareFamilyConditions.length > 0 && bookingUrlParams && bookingUrlParams.preferredCabin) {
            ctrl.MonetateUtilsService.trackFlightCabin(selectedTripInfo.fareFamilyConditions, bookingUrlParams.preferredCabin);
        }
}

export function trackTripTypeInMonetateImpl(ctrl: PmtPageController, originDestinationInfo) {
        if (originDestinationInfo && originDestinationInfo.length > 1) {
            ctrl.MonetateUtilsService.trackTripType(originDestinationInfo);
        }
}

export function trackFareTypeSelectedInMonetateImpl(ctrl: PmtPageController, fareFamilyConditionsInfo) {
        if (fareFamilyConditionsInfo) {
            ctrl.MonetateUtilsService.trackFareTypeSelected(fareFamilyConditionsInfo);
        }
}

export function trackFlightDestinationInMonetateImpl(ctrl: PmtPageController, destinationAreasCitiesList, destinationCountry) {
        if (!destinationAreasCitiesList) {
            ctrl.GetDestinationsService.getDestinationAreasCitiesList().then(data => destinationAreasCitiesList = data.data);
        }
        if (destinationAreasCitiesList && destinationCountry) {
            ctrl.MonetateUtilsService.trackFlightDestination(destinationAreasCitiesList, destinationCountry);
        }
}
