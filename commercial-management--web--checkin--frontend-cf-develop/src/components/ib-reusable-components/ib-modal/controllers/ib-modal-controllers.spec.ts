import * as angular from 'angular';

interface ModalInstanceMock {
    result: { then: jasmine.Spy };
    close: jasmine.Spy;
    dismiss: jasmine.Spy;
}

interface UpgradeKnowMoreController {
    model: unknown;
    close(): void;
    openSeatdModal(currentCabin: unknown, segmentInfo: unknown, indexSelected: number): void;
}

interface UnavailableModalController {
    continueStep(): void;
}

interface NavigationErrorModalController {
    model: unknown;
    continueStep(): void;
    close(): void;
}

interface GenericModalController {
    model: Record<string, unknown>;
    needsTranslate: boolean;
    eventEmit(eventName: string): void;
}

interface GenericErrorModalController {
    titleModal(): string;
    accept(): void;
}

interface CheckinGroupModalController {
    checkinSegmentsGroup: unknown;
    close(): void;
}

describe('Modal controllers', () => {
    let controllerService: ng.IControllerService;
    let rootScope: ng.IRootScopeService;
    let location: ng.ILocationService;
    let modalInstance: ModalInstanceMock;
    let modalService: {
        getErrorMessage: jasmine.Spy;
        getErrorCode: jasmine.Spy;
        getErrorPassenger: jasmine.Spy;
        setErrorCode: jasmine.Spy;
        isNotWaiting: jasmine.Spy;
        showGenericModal: jasmine.Spy;
    };
    let datalayerService: {
        sendDatalayerModalEvent: jasmine.Spy;
        sendDatalayerErrorEvent: jasmine.Spy;
        sendDigitalDataErrorEvent: jasmine.Spy;
        removeDatalayerModalAttrs: jasmine.Spy;
        removeDatalayerErrorAttrs: jasmine.Spy;
    };
    let localStorageService: {
        get: jasmine.Spy;
        set: jasmine.Spy;
    };
    let closeSessionService: { closeSession: jasmine.Spy };
    let sessionConfigService: { initStorage: jasmine.Spy };
    let ibUtilsService: { removeParameterURL: jasmine.Spy };
    let route: { reload: jasmine.Spy };
    let cookies: {
        get: jasmine.Spy;
        put: jasmine.Spy;
        remove: jasmine.Spy;
    };
    let cachedInformationService: { getCachedInformation: jasmine.Spy };
    let windowMock: { location: { href: string; origin: string; pathname: string; search: string } };

    function initializeModalMocks(): void {
        modalInstance = {
            result: { then: jasmine.createSpy('then') },
            close: jasmine.createSpy('close'),
            dismiss: jasmine.createSpy('dismiss')
        };
        modalService = {
            getErrorMessage: jasmine.createSpy('getErrorMessage').and.returnValue('error'),
            getErrorCode: jasmine.createSpy('getErrorCode').and.returnValue('OTHER'),
            getErrorPassenger: jasmine.createSpy('getErrorPassenger').and.returnValue(null),
            setErrorCode: jasmine.createSpy('setErrorCode'),
            isNotWaiting: jasmine.createSpy('isNotWaiting'),
            showGenericModal: jasmine.createSpy('showGenericModal')
        };
        datalayerService = {
            sendDatalayerModalEvent: jasmine.createSpy('sendDatalayerModalEvent'),
            sendDatalayerErrorEvent: jasmine.createSpy('sendDatalayerErrorEvent'),
            sendDigitalDataErrorEvent: jasmine.createSpy('sendDigitalDataErrorEvent'),
            removeDatalayerModalAttrs: jasmine.createSpy('removeDatalayerModalAttrs'),
            removeDatalayerErrorAttrs: jasmine.createSpy('removeDatalayerErrorAttrs')
        };
        localStorageService = {
            get: jasmine.createSpy('get').and.returnValue(null),
            set: jasmine.createSpy('set')
        };
    }

    function initializeSessionMocks(): void {
        closeSessionService = { closeSession: jasmine.createSpy('closeSession') };
        sessionConfigService = { initStorage: jasmine.createSpy('initStorage') };
    }

    function initializeNavigationMocks(): void {
        ibUtilsService = {
            removeParameterURL: jasmine.createSpy('removeParameterURL').and.returnValue('?cleaned')
        };
        route = { reload: jasmine.createSpy('reload') };
        cookies = {
            get: jasmine.createSpy('get').and.returnValue(undefined),
            put: jasmine.createSpy('put'),
            remove: jasmine.createSpy('remove')
        };
        cachedInformationService = { getCachedInformation: jasmine.createSpy('getCachedInformation') };
        windowMock = {
            location: {
                href: '',
                origin: 'https://checkin.test',
                pathname: '/checkin',
                search: '?paymentStatus=OK'
            }
        };
    }

    function configureModalModule(): void {
        const translate = jasmine.createSpy('translate').and.callFake((value: string) => `translated:${value}`);
        const filter = jasmine.createSpy('$filter').and.callFake((name: string) => name === 'translate' ? translate : jasmine.createSpy(name));
        const appConstants = {
            ERROR_CODE: {
                CARRIER_CONNECT: {
                    PRINT_9019: 'PRINT_9019',
                    PRINT_9017: 'PRINT_9017'
                }
            }
        };

        angular.mock.module('ib-cki-modal-module', ($provide: ng.auto.IProvideService) => {
            $provide.value('$uibModalInstance', modalInstance);
            $provide.value('ModalService', modalService);
            $provide.value('CkiDatalayerUtilsService', datalayerService);
            $provide.value('localStorageService', localStorageService);
            $provide.value('CloseSessionService', closeSessionService);
            $provide.value('IbSessionConfigService', sessionConfigService);
            $provide.value('IbUtilsService', ibUtilsService);
            $provide.value('$route', route);
            $provide.value('$filter', filter);
            $provide.value('$cookies', cookies);
            $provide.value('GetCKICachedInformationService', cachedInformationService);
            $provide.value('CheckinAppConstants', appConstants);
            $provide.value('CkiDatalayerConstants', {
                DATALAYER_MODAL_ID: {
                    SEGMENT_IN_GROUP_WARNING: 'segment-in-group',
                    BOOKING_SPLIT: 'booking-split'
                }
            });
        });
    }

    function injectModalDependencies(): void {
        angular.mock.inject((
            _$controller_: ng.IControllerService,
            _$rootScope_: ng.IRootScopeService,
            _$location_: ng.ILocationService
        ) => {
            controllerService = _$controller_;
            rootScope = _$rootScope_;
            location = _$location_;
            spyOn(rootScope, '$broadcast');
            spyOn(rootScope, '$emit');
            spyOn(location, 'path').and.callThrough();
        });
    }

    beforeEach(() => {
        initializeModalMocks();
        initializeSessionMocks();
        initializeNavigationMocks();
        configureModalModule();
        injectModalDependencies();
    });

    it('initializes the upgrade information modal and broadcasts the selected seat map', () => {
        const model = { cabin: 'business' };
        const controller = controllerService('UpgradeCkiKnowMoreController', {
            object: model,
            $scope: rootScope.$new()
        }) as UpgradeKnowMoreController;

        expect(controller.model).toBe(model);
        expect(datalayerService.sendDatalayerModalEvent).toHaveBeenCalledWith(model);
        controller.openSeatdModal('business', { id: 'segment-1' }, 2);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('openSeat3dModal', {
            currentCabin: 'business',
            segmentInfo: { id: 'segment-1' },
            offerSelected: 2
        });

        controller.close();
        expect(modalInstance.dismiss).toHaveBeenCalledWith('dismiss');
    });

    it('redirects from the unavailable modal and dismisses it', () => {
        const controller = controllerService('UnavailableModalController') as UnavailableModalController;

        expect(datalayerService.sendDigitalDataErrorEvent).toHaveBeenCalledWith({
            message: '',
            errorCode: '',
            internalErrorCode: 'NO_SEGMENTS_AVAILABLE'
        });
        controller.continueStep();

        expect(location.path).toHaveBeenCalledWith('/ibcose');
        expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });

    it('closes navigation error modals and notifies early check-in when requested', () => {
        localStorageService.get.and.returnValue(true);
        const controller = controllerService('NavigationErrorModalController', {
            object: { reason: 'navigation' },
            $window: windowMock
        }) as NavigationErrorModalController;

        controller.close();

        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('checkEarlyCheckinModal');
    });

    it('continues from a navigation error by closing the session and cleaning the return URL', () => {
        const controller = controllerService('NavigationErrorModalController', {
            object: { reason: 'navigation' },
            $window: windowMock
        }) as NavigationErrorModalController;

        controller.continueStep();

        expect(closeSessionService.closeSession).toHaveBeenCalled();
        expect(ibUtilsService.removeParameterURL).toHaveBeenCalledWith('?paymentStatus=OK');
        expect(windowMock.location.href).toBe('https://checkin.test/checkin?cleaned');
        expect(sessionConfigService.initStorage).toHaveBeenCalled();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('initializes generic information and emits events before closing', () => {
        const model = { message: { needsTranslate: false }, needsTranslate: false };
        const controller = controllerService('CKIGenericModalController', {
            object: model
        }) as GenericModalController;

        expect(controller.model).toBe(model);
        expect(controller.model.needsTranslate).toBeFalse();
        expect(datalayerService.sendDatalayerModalEvent).toHaveBeenCalledWith(model);

        controller.eventEmit('refresh-content');

        expect(rootScope.$broadcast).toHaveBeenCalledWith('refresh-content');
        expect(modalService.setErrorCode).toHaveBeenCalledWith('');
        expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });

    it('uses a literal error title and redirects when accepting the session error', () => {
        const controller = controllerService('CheckinGenericErrorModalController', {
            ErrorModel: { title: 'literal title' }
        }) as GenericErrorModalController;

        expect(controller.titleModal()).toBe('literal title');

        modalService.getErrorCode.and.returnValue('IB_00002');
        controller.accept();

        expect(location.path).toHaveBeenCalledWith('/ibcose');
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('initializes group-warning information and dismisses it on close', () => {
        const segments = [{ id: 'segment-1' }];
        const controller = controllerService('checkInGroupModalController', {
            object: { allSegmentsInfo: segments }
        }) as CheckinGroupModalController;

        expect(controller.checkinSegmentsGroup).toBe(segments);
        expect(datalayerService.sendDatalayerModalEvent).toHaveBeenCalledWith({
            idModal: 'segment-in-group'
        });
        controller.close();
        expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });
});
