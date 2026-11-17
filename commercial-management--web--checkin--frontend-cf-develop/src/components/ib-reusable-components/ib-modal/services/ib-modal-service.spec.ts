import * as angular from 'angular';

interface ModalServiceInstance {
    showGenericModal(model: unknown, blocked: boolean, template?: string): unknown;
    showGenericError(model: unknown, blocked: boolean, template?: string): unknown;
    isError(model: unknown, template?: string, blocked?: boolean): unknown;
    setErrorMessage(message: unknown): void;
    getErrorMessage(): unknown;
    setErrorCode(code: unknown): void;
    getErrorCode(): unknown;
    setErrorPassengerSeatsMap(passenger: unknown): void;
    getErrorPassenger(): unknown;
    isWaiting(): void;
    isNotWaiting(): void;
    openSplitModal(size: string, template: string, animation: boolean, newPnr: unknown): unknown;
    openDangerousObjectsModal(model: unknown): unknown;
}

describe('ModalService', () => {
    let service: ModalServiceInstance;
    let openModal: jasmine.Spy;
    let dismissAll: jasmine.Spy;
    let modalInstance: { close: jasmine.Spy };

    beforeEach(() => {
        modalInstance = { close: jasmine.createSpy('close') };
        openModal = jasmine.createSpy('open').and.returnValue(modalInstance);
        dismissAll = jasmine.createSpy('dismissAll');

        angular.mock.module('ib-cki-modal-module', ($provide: ng.auto.IProvideService) => {
            $provide.value('CheckinRouterConstants', { templatesRoute: 'templates/' });
            $provide.value('$uibModal', { open: openModal });
            $provide.value('$uibModalStack', { dismissAll });
        });

        angular.mock.inject((_ModalService_: ModalServiceInstance) => {
            service = _ModalService_;
        });
    });

    it('opens a blocked generic modal and resolves its model', () => {
        const model = { message: 'information' };

        const result = service.showGenericModal(model, true, 'custom-info');
        const options = openModal.calls.mostRecent().args[0];

        expect(result).toBe(modalInstance);
        expect(options).toEqual(jasmine.objectContaining({
            animation: false,
            templateUrl: 'templates/custom-info.html',
            controller: 'CKIGenericModalController',
            controllerAs: 'modalCtrl',
            backdrop: 'static',
            keyboard: false
        }));
        expect(options.resolve.object()).toBe(model);
    });

    it('opens a generic error modal using its default template and resolves the error', () => {
        const error = { message: 'failed' };

        service.showGenericError(error, false);
        const options = openModal.calls.mostRecent().args[0];

        expect(options.templateUrl).toBe('templates/generic-error-modal.html');
        expect(options.controller).toBe('CheckinGenericErrorModalController');
        expect(options.resolve.ErrorModel()).toBe(error);
        expect(options.backdrop).toBeUndefined();
    });

    it('blocks error modals when explicitly requested or when the error code requires it', () => {
        service.isError({}, undefined, true);
        expect(openModal.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
            backdrop: 'static',
            keyboard: false
        }));

        service.setErrorCode('IB_00002');
        service.isError({});
        expect(openModal.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
            backdrop: 'static',
            keyboard: false
        }));
    });

    it('stores and retrieves error details', () => {
        const message = { text: 'error' };
        const passenger = { id: 'passenger-1' };

        service.setErrorMessage(message);
        service.setErrorPassengerSeatsMap(passenger);
        service.setErrorCode('IB_00002');

        expect(service.getErrorMessage()).toBe(message);
        expect(service.getErrorPassenger()).toBe(passenger);
        expect(service.getErrorCode()).toBe('IB_00002');
    });

    it('closes the waiting modal and dismisses all modals', () => {
        service.isWaiting();
        expect(openModal.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
            templateUrl: 'templates/modal-mensaje-wait.html',
            backdrop: 'static',
            keyboard: false
        }));

        service.isNotWaiting();

        expect(modalInstance.close).toHaveBeenCalled();
        expect(dismissAll).toHaveBeenCalled();
    });

    it('opens a blocked split modal and resolves its new booking reference', () => {
        const newPnr = { locator: 'ABC123' };

        service.openSplitModal('md', 'split-modal', true, newPnr);
        const options = openModal.calls.mostRecent().args[0];

        expect(options).toEqual(jasmine.objectContaining({
            templateUrl: 'templates/split-modal.html',
            controller: 'AcceptSplitModalController',
            backdrop: 'static',
            keyboard: false
        }));
        expect(options.resolve.newPnr()).toBe(newPnr);
    });

    it('opens the dangerous-objects modal with its model and a static backdrop', () => {
        const model = { item: 'battery' };

        service.openDangerousObjectsModal(model);
        const options = openModal.calls.mostRecent().args[0];

        expect(options).toEqual(jasmine.objectContaining({
            templateUrl: 'templates/ib-modal-dangerous-objects.html',
            controller: 'DangerousObjectsModalController',
            backdrop: 'static',
            keyboard: false
        }));
        expect(options.resolve.object()).toBe(model);
    });
});
