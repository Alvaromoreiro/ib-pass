import { CheckinAncillariesConstants } from '@core/constants/ib-ancillaries-constants';
import { ModalServiceAncillaries } from './ib-modal-ancillaries-service';

interface IModalConfiguration {
    animation?: boolean;
    templateUrl?: string;
    backdrop?: string;
    keyboard?: boolean;
    controller?: string;
    windowClass?: string;
    windowTemplateUrl?: string;
    size?: string;
    resolve: Record<string, () => unknown>;
}

describe('ModalServiceAncillaries', () => {
    let service: ModalServiceAncillaries;
    let openModal: jasmine.Spy;
    let dismissAll: jasmine.Spy;
    let dismiss: jasmine.Spy;
    let modalInstance: { id: string };

    const expectModalConfiguration = (expected: Partial<IModalConfiguration>): IModalConfiguration => {
        const configuration = openModal.calls.mostRecent().args[0] as IModalConfiguration;
        expect(configuration).toEqual(jasmine.objectContaining(expected));
        return configuration;
    };

    beforeEach(() => {
        modalInstance = { id: 'modal-instance' };
        openModal = jasmine.createSpy('open').and.returnValue(modalInstance);
        dismissAll = jasmine.createSpy('dismissAll');
        dismiss = jasmine.createSpy('dismiss');

        service = new ModalServiceAncillaries(
            { routes: { templates: '/templates/' } } as CommonsRootScope,
            { open: openModal } as unknown as ng.ui.bootstrap.IModalService,
            { dismissAll, dismiss } as unknown as ng.ui.bootstrap.IModalStackService
        );
    });

    it('opens a generic error modal with a default template and blocked interaction', () => {
        const error = { message: 'Request failed' };

        const result = service.showGenericError(error, true, null);
        const configuration = expectModalConfiguration({
            templateUrl: '/templates/anc-generic-error-modal.html',
            backdrop: 'static',
            keyboard: false
        });

        expect(configuration.resolve.ErrorModel()).toBe(error);
        expect(result).toBe(modalInstance);
    });

    it('opens a custom generic error modal without blocking interaction', () => {
        const error = { message: 'Payment unavailable' };

        service.showGenericError(error, false, 'payment-error.html');
        const configuration = expectModalConfiguration({
            templateUrl: '/templates/payment-error.html'
        });

        expect(configuration.resolve.ErrorModel()).toBe(error);
        expect(configuration.backdrop).toBeUndefined();
        expect(configuration.keyboard).toBeUndefined();
    });

    it('opens a generic modal with a custom template and model', () => {
        const model = { title: 'Information' };

        service.showGenericModal(model, false, 'custom-info');
        const configuration = expectModalConfiguration({
            templateUrl: '/templates/custom-info.html',
            controller: 'GenericModalAncillariesController'
        });

        expect(configuration.resolve.object()).toBe(model);
        expect(configuration.backdrop).toBeUndefined();
    });

    it('opens the waiting modal only once and keeps its instance', () => {
        const model = { message: 'Loading' };

        service.showWaitingModal('custom-wait', 'custom-class', true, model);
        service.showWaitingModal(null, null, false, null);

        const configuration = expectModalConfiguration({
            templateUrl: '/templates/custom-wait.html',
            windowClass: 'custom-class',
            windowTemplateUrl: '/templates/ib-modal-background.html',
            backdrop: 'static',
            keyboard: false
        });
        expect(configuration.resolve.object()).toBe(model);
        expect(openModal).toHaveBeenCalledTimes(1);
        expect(service.waitingModalInstance).toBe(modalInstance);
    });

    it('dismisses and clears the waiting modal instance', () => {
        service.waitingModalInstance = modalInstance;

        service.closeWaitingModal();

        expect(dismiss).toHaveBeenCalledWith(modalInstance);
        expect(service.waitingModalInstance).toBeNull();
    });

    it('dismisses all modals and clears the waiting instance', () => {
        service.waitingModalInstance = modalInstance;

        service.isNotWaiting();

        expect(dismissAll).toHaveBeenCalled();
        expect(service.waitingModalInstance).toBeNull();
    });

    it('opens an error modal as static when the error code requires it', () => {
        const error = { code: 'IB_00002' };
        service.setErrorCode('IB_00002');

        service.isError(error, null, false);
        const configuration = expectModalConfiguration({
            templateUrl: '/templates/ib-modal-mensaje-error.html',
            backdrop: 'static',
            keyboard: false
        });

        expect(configuration.resolve.ErrorModel()).toBe(error);
        expect(service.error).toBe(true);
    });

    it('uses an empty error model and blocks the modal when requested', () => {
        service.isError(null, 'custom-error', true);
        const configuration = expectModalConfiguration({
            templateUrl: '/templates/custom-error',
            backdrop: 'static',
            keyboard: false
        });

        expect(configuration.resolve.ErrorModel()).toEqual({});
    });

    it('opens a waiting-list modal with a custom template and blocked interaction', () => {
        const model = { position: 2 };

        service.showWaitingListInfoModal(model, true, 'custom-waiting-list');
        const configuration = expectModalConfiguration({
            templateUrl: '/templates/custom-waiting-list.html',
            backdrop: 'static',
            keyboard: false
        });

        expect(configuration.resolve.object()).toBe(model);
    });

    it('opens transfer and insurance modal variants with their models', () => {
        const model = { bookingReference: 'ABC123' };

        service.openTransfersModifyModal();
        expectModalConfiguration({
            templateUrl: '/templates/ib-modal-globick-transfers-modify.html',
            backdrop: 'static',
            keyboard: false
        });

        service.openTransfersModal(model);
        expect(expectModalConfiguration({
            templateUrl: '/templates/ib-modal-globick-transfers.html'
        }).resolve.object()).toBe(model);

        service.openInsuranceModal(model, 'custom-insurance.html');
        expect(expectModalConfiguration({
            templateUrl: '/templates/custom-insurance.html',
            controller: 'InsuranceAncModalController'
        }).resolve.object()).toBe(model);

        service.openInsuranceInfoModal(undefined);
        expectModalConfiguration({ templateUrl: '/templates/ib-insurance-info-modal.html' });

        service.openInsuranceInfoCubaModal(model);
        expect(expectModalConfiguration({
            templateUrl: '/templates/ib-modal-insurance-cuba.html',
            controller: 'InsuranceCubaModalController'
        }).resolve.object()).toBe(model);
    });

    it('opens seat and ancillary modals with blocking behavior and resolved data', () => {
        const model = { passengerId: 'passenger-1' };

        service.isWaiting();
        expect(openModal.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
            templateUrl: '/templates/anc-modal-mensaje-wait.html',
            backdrop: 'static',
            keyboard: false
        }));

        service.openSeatNewMapModal(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-seat-map.html' }).resolve.object()).toBe(model);

        service.openSeatMapErrorUpdateModal(model, 'md', 'seat-error', false);
        expect(expectModalConfiguration({
            templateUrl: '/templates/seat-error.html',
            animation: false
        }).resolve.ErrorModel()).toBe(model);

        service.openFeatureModal('seat-feature.html', true, 'Seat details', 'seat-feature');
        const featureConfiguration = expectModalConfiguration({
            templateUrl: '/templates/seat-feature.html',
            backdrop: 'static',
            keyboard: false
        });
        expect(featureConfiguration.resolve.modalMessage()).toBe('Seat details');

        service.openBaggagesModal(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-baggage-modal-view.html' }).resolve.object()).toBe(model);

        const dynamicModel = { model: { modal: { template: 'flexibility-info', classes: 'flex-modal' } } };
        service.openFlexibilizationModal(dynamicModel);
        expect(expectModalConfiguration({
            templateUrl: '/templates/flexibility-info',
            windowClass: 'flex-modal'
        }).resolve.object()).toBe(dynamicModel);

        service.openSpeqsModal(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-speqs-modal-view.html' }).resolve.object()).toBe(model);

        service.openSpecialMealsModal(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-special-meals-modal-view.html' }).resolve.object()).toBe(model);

        service.openBobModal(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-bob-modal-view.html' }).resolve.object()).toBe(model);
    });

    it('opens bid, priority, avios, and ancillary information modals', () => {
        const model = { offerId: 'offer-1' };

        service.openBidsModal(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-bids-modal-view.html' }).resolve.object()).toBe(model);

        service.openPaymentsBid(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-bids-payment-modal-view.html' }).resolve.object()).toBe(model);

        service.openUpgradingKnowMore(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-modal-bids-upgrading-know-more.html' }).resolve.object()).toBe(model);

        service.goToUpgradingBidsConfirmation(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-bids-pmt-con-upg-view.html' }).resolve.object()).toBe(model);

        service.openCancelOfferUpgradingBids(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-upg-bids-cancel-offer-modal.html' }).resolve.object()).toBe(model);

        const priorityModel = { model: { modal: { template: 'priority-info', classes: 'priority-modal' } } };
        service.openPriorityBoardingModal(priorityModel);
        expect(expectModalConfiguration({
            templateUrl: '/templates/priority-info',
            windowClass: 'priority-modal'
        }).resolve.object()).toBe(priorityModel);

        service.openAviosAccumulatedModal(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-modal-avios-accumulated.html' }).resolve.object()).toEqual({ modelObject: model });

        service.openCarbonFootprintModal(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-carbon-footprint-modal-view.html' }).resolve.object()).toBe(model);

        service.openAncillariesErrorModal(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-ancillaries-error-modal.html' }).resolve.object()).toEqual({ modelObject: model });

        service.openBundelingMoreInfoModal(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-modal-bundle-more-info.html' }).resolve.object()).toBe(model);

        service.showMoreInfoPerBundleModal(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-modal-bundle-more-info.html' }).resolve.object()).toBe(model);

        service.openUpgradingBidHowItWorksModal(model);
        expect(expectModalConfiguration({ templateUrl: '/templates/ib-modal-bid-how-it-works.html' }).resolve.object()).toBe(model);

        service.closeAllCurrentModals();
        expect(dismissAll).toHaveBeenCalled();
    });

    it('selects the information template for each special-equipment subtype', () => {
        const templateBySubtype = [
            [CheckinAncillariesConstants.SPEQ_TYPE.GOLF_EQUIPMENT, 'ib-modal-golf-know-more.html'],
            [CheckinAncillariesConstants.SPEQ_TYPE.SKI_SNOW, 'ib-modal-ski-know-more.html'],
            [CheckinAncillariesConstants.SPEQ_TYPE.SURFBOARD, 'ib-modal-ski-know-more.html'],
            [CheckinAncillariesConstants.SPEQ_TYPE.BICYCLE, 'ib-modal-bike-know-more.html'],
            [CheckinAncillariesConstants.SPEQ_TYPE.FISHING_EQUIPMENT, 'ib-modal-ski-know-more.html'],
            [CheckinAncillariesConstants.SPEQ_TYPE.SCUBA_DIVING, 'ib-modal-ski-know-more.html'],
            [CheckinAncillariesConstants.SPEQ_TYPE.SPORTING_FIREARMS, 'ib-modal-ski-know-more.html']
        ];

        templateBySubtype.forEach(([subtype, template]) => {
            service.openSpeqInformation({ subtype });

            expect(openModal.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
                templateUrl: `/templates/${template}`,
                controller: 'SpeqKnowMoreModalController',
                backdrop: 'static',
                keyboard: false
            }));
        });

        service.openSpeqInformation({ subtype: 'UNKNOWN' });
        expect(openModal.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ templateUrl: '/templates/' }));
    });

    it('opens dynamic help modals and the child warning modal', () => {
        const model = { template: 'flex-info', title: 'Flexibility' };

        service.openFlexInformation(model);
        expect(openModal.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
            templateUrl: '/templates/flex-info.html',
            controller: 'FlexibilityKnowMoreModalController',
            backdrop: 'static',
            keyboard: false
        }));

        service.openModalPriorityKnowMoreInformation(model);
        expect(openModal.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
            templateUrl: '/templates/ib-modal-priority-boarding-know-more.html',
            controller: 'PriorityKnowMoreModalController'
        }));

        service.openWarningChildInfoModal(model);
        expect(openModal.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
            templateUrl: '/templates/ib-modal-priority-boarding-children.html',
            controller: 'PriorityWarningChildController'
        }));
    });

    it('stores and returns modal error state', () => {
        const message = { text: 'Unavailable' };
        const passengerSeats = [{ passengerId: 1 }];

        service.setErrorMessage(message);
        service.setErrorCode('ERR_01');
        service.setErrorGetOut(true);
        service.setErrorPassengerSeatsMap(passengerSeats);

        expect(service.getErrorMessage()).toBe(message);
        expect(service.getErrorCode()).toBe('ERR_01');
        expect(service.getErrorGetOut()).toBe(true);
        expect(service.errorPassengerSeatsMap).toBe(passengerSeats);
    });
});