import { TestBed } from '@angular/core/testing';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import * as angular from 'angular';

import { AJSWindow } from '@src/app/core/config/ib-checkin-app-tokens';
import { IRootScopeExt } from '@src/app/core/models/generic-models/generic-models';
import { AJSModalService, AJSModalServiceType } from '@src/app/shared/services/ib-modal/ib-modal-service-bridge.service';
import { IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { AJSCloseSessionService, CheckinFlowService, CloseSessionServiceType, InhibitAlertItem, InhibitReasonType } from './checkin-flow.service';

describe('CheckinFlowService', () => {
    let service: CheckinFlowService;
    let sessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
    let modalService: jasmine.SpyObj<AJSModalServiceType>;
    let closeSessionService: jasmine.SpyObj<CloseSessionServiceType>;
    let redirectionService: jasmine.SpyObj<IbCheckinRedirectionUtilsService>;
    let rootScope: IRootScopeExt;
    let mockWindow: Window;
    let modalResultThen: jasmine.Spy;

    beforeEach(() => {
        const mockLocation = { href: 'http://domain/path/other', origin: 'http://domain' } as Location;
        const mockHistory = jasmine.createSpyObj<History>('history', ['pushState']);
        mockWindow = { history: mockHistory, location: mockLocation } as unknown as Window;
        sessionStorageService = jasmine.createSpyObj<CommonsSessionStorageService>(
            'CommonsSessionStorageService',
            ['get', 'set', 'remove', 'clearAll']
        );
        modalService = jasmine.createSpyObj<AJSModalServiceType>('ModalService', [
            'closeAllCurrentModals',
            'openNavigationErrorModal',
            'isWaiting'
        ]);
        closeSessionService = jasmine.createSpyObj<CloseSessionServiceType>('CloseSessionService', ['closeSession']);
        redirectionService = jasmine.createSpyObj<IbCheckinRedirectionUtilsService>('IbCheckinRedirectionUtilsService', ['path']);
        rootScope = {} as IRootScopeExt;
        modalResultThen = jasmine.createSpy('then');
        modalService.openNavigationErrorModal.and.returnValue({ result: { then: modalResultThen } } as any);

        TestBed.configureTestingModule({
            providers: [
                CheckinFlowService,
                { provide: AJSWindow, useValue: mockWindow },
                { provide: AJSModalService, useValue: modalService },
                { provide: AJSCloseSessionService, useValue: closeSessionService },
                { provide: AJSRootScope, useValue: rootScope },
                { provide: CommonsSessionStorageService, useValue: sessionStorageService },
                { provide: IbCheckinRedirectionUtilsService, useValue: redirectionService }
            ]
        });

        service = TestBed.inject(CheckinFlowService);
    });

    function mockStorageValues (values: Record<string, unknown>): void {
        sessionStorageService.get.and.callFake(<T>(key: string): T => values[key] as T);
    }

    it('should always show the waiting modal and close the session when returning to main', () => {
        service.backToMain(false);

        expect(modalService.isWaiting).toHaveBeenCalled();
        expect(closeSessionService.closeSession).toHaveBeenCalled();
        expect(sessionStorageService.clearAll).not.toHaveBeenCalled();
    });

    it('should clear session storage and redirect home when requested', () => {
        service.backToMain(true);

        expect(sessionStorageService.clearAll).toHaveBeenCalled();
        expect(mockWindow.location.href).toBe('http://domain');
    });

    it('should redirect based on the user state when a confirmation PNR exists', () => {
        mockStorageValues({ confirmationPNR: 'ABC123', userLogged: true });

        expect(service.checkConfirmationPNR()).toBe('ABC123');
        expect(redirectionService.path).toHaveBeenCalledWith('/ibcose2');
    });

    it('should not redirect when there is no confirmation PNR', () => {
        expect(service.checkConfirmationPNR()).toBeUndefined();
        expect(redirectionService.path).not.toHaveBeenCalled();
    });

    it('should redirect to the guest route when the user is not logged in', () => {
        mockStorageValues({ confirmationPNR: 'ABC123', userLogged: false });

        service.checkConfirmationPNR();

        expect(redirectionService.path).toHaveBeenCalledWith('/ibcose');
    });

    it('should return undefined when no inhibit item is active', () => {
        expect(service.showPriorityAlertInhibit([{ code: 'AVIH', status: false }])).toBeUndefined();
    });

    it('should return the highest-priority active inhibit item', () => {
        const items = [
            { code: 'AVIH', status: true },
            { code: 'RESI', status: true }
        ];

        expect(service.showPriorityAlertInhibit(items)).toBe(items[1]);
        expect(items[1].status).toBeTrue();
    });

    it('should mark the UMNR inhibit item to show its box', () => {
        const item: InhibitAlertItem = { code: 'UMNR', status: true };

        service.showPriorityAlertInhibit([item]);

        expect(item.showBox).toBeTrue();
    });

    it('should set inhibit flags for recognized reasons', () => {
        const cases: Array<[string, keyof InhibitReasonType]> = [
            ['AIRCHECK_REASON', 'AIRCHECK'],
            ['INHIBIT_REASON', 'INHIBIT'],
            ['RESI_REASON', 'RESI'],
            ['UMNR_REASON', 'UMNR'],
            ['AVIH_REASON', 'AVIH'],
            ['PETC_REASON', 'PETC'],
            ['COUR_REASON', 'COUR'],
            ['SEE_AGENT_REASON', 'SEE_AGENT']
        ];

        cases.forEach(([reason, property]) => {
            expect(service.checkInhibitReason([reason])[property]).toBeTrue();
        });
        expect(service.checkInhibitReason([]).PETC).toBeFalse();
    });

    it('should return the most restrictive inhibit priority', () => {
        expect(service.priorityInhibit(['AVIH_REASON'])).toBe('AVIH');
        expect(service.priorityInhibit(['AVIH_REASON', 'RESI_REASON'])).toBe('RESI');
        expect(service.priorityInhibit(['PETC_REASON', 'UMNR_REASON', 'AVIH_REASON'])).toBe('UMNR');
        expect(service.priorityInhibit(['avih_REASON'])).toBeUndefined();
        expect(service.priorityInhibit([])).toBeUndefined();
    });

    it('should update ESTA constraints only with truthy values', () => {
        service.updateApiEsta({ showTextEsta: true, text: 'Alert' });
        service.updateApiEsta({ showTextEsta: false, text: '' });

        expect(service.checkApisEsta()).toEqual({ showTextEsta: true, text: 'Alert' });
    });

    it('should initialize phones and update the footer model', () => {
        const phonesList = service.iniPhonesList();

        expect(phonesList.RESERVAS?.telephone).toBe('');
        expect(rootScope.footerModel).toEqual({
            phoneInfo: { prefix: '', phoneNumber: '', text: '' }
        });
    });

    it('should update the footer model from stored phones', () => {
        mockStorageValues({ phonesList: { RESERVAS: { prefix: '321', telephone: '0987654', text: 'Support' } } });

        service.updatePhonesList();

        expect(rootScope.footerModel).toEqual({
            phoneInfo: { prefix: '321', phoneNumber: '0987654', text: 'Support' }
        });
    });

    it('should not update the footer model when no phones are stored', () => {
        service.updatePhonesList();

        expect(rootScope.footerModel).toBeUndefined();
    });

    it('should push the current URL and install the popstate handler', () => {
        service.warnUserOnBackPressed();

        expect(mockWindow.history.pushState).toHaveBeenCalledTimes(1);
        expect(mockWindow.history.pushState).toHaveBeenCalledWith(null, '', mockWindow.location.href);
        expect(mockWindow.onpopstate).toEqual(jasmine.any(Function));
    });

    it('should set invokeEarlyCheckinFunction based on the current endpoint', () => {
        mockWindow.location.href = 'http://domain/path/ckianc';
        service.warnUserOnBackPressed();

        mockWindow.onpopstate?.(new PopStateEvent('popstate'));

        expect(sessionStorageService.set).toHaveBeenCalledWith('invokeEarlyCheckinFunction', true);
    });

    it('should set invokeEarlyCheckinFunction to false for other endpoints', () => {
        service.warnUserOnBackPressed();

        mockWindow.onpopstate?.(new PopStateEvent('popstate'));

        expect(sessionStorageService.set).toHaveBeenCalledWith('invokeEarlyCheckinFunction', false);
    });

    it('should clear the soft user flag after login', () => {
        mockStorageValues({ softUserAfterLogin: 'true' });
        service.warnUserOnBackPressed();

        mockWindow.onpopstate?.(new PopStateEvent('popstate'));

        expect(sessionStorageService.remove).toHaveBeenCalledWith('softUserAfterLogin');
    });

    it('should reset back warning flags when the message is suppressed and no inhibition exists', () => {
        mockStorageValues({ noShowMessageBockBack: true });
        service.warnUserOnBackPressed();

        mockWindow.onpopstate?.(new PopStateEvent('popstate'));

        expect(sessionStorageService.set).toHaveBeenCalledWith('noShowMessageBockBack', false);
        expect(sessionStorageService.set).toHaveBeenCalledWith('nextStepAllowed', true);
        expect(sessionStorageService.set).toHaveBeenCalledWith('errorCarrierConnect', false);
    });

    it('should reset back warning flags when a carrier error suppresses the message', () => {
        mockStorageValues({ noShowMessageBockBack: false, errorCarrierConnect: true });
        service.warnUserOnBackPressed({ closeModals: jasmine.createSpy('closeModals') });

        mockWindow.onpopstate?.(new PopStateEvent('popstate'));

        expect(sessionStorageService.set).toHaveBeenCalledWith('nextStepAllowed', true);
        expect(sessionStorageService.set).toHaveBeenCalledWith('errorCarrierConnect', false);
    });

    it('should close modals and show the navigation error when back navigation is blocked', () => {
        mockStorageValues({ nextStepAllowed: true });
        service.warnUserOnBackPressed();

        mockWindow.onpopstate?.(new PopStateEvent('popstate'));

        expect(modalService.closeAllCurrentModals).toHaveBeenCalled();
        expect(modalService.openNavigationErrorModal).toHaveBeenCalledWith(jasmine.objectContaining({
            message: 'NOT_ALLOWED_FLOW_STEP_TEXT_CKI'
        }), true);
        expect(modalResultThen).toHaveBeenCalledWith(jasmine.any(Function), angular.noop);
        modalResultThen.calls.mostRecent().args[0]();
        expect(mockWindow.history.pushState).toHaveBeenCalledTimes(2);
    });

    it('should use an explicitly provided modal callback instead of the default', () => {
        const closeModals = jasmine.createSpy('closeModals');
        mockStorageValues({ nextStepAllowed: true });
        service.warnUserOnBackPressed({ closeModals });

        mockWindow.onpopstate?.(new PopStateEvent('popstate'));

        expect(closeModals).toHaveBeenCalled();
        expect(modalService.closeAllCurrentModals).not.toHaveBeenCalled();
    });

    it('should close modals and redirect home when returning from ibcose is allowed', () => {
        mockWindow.location.href = 'http://domain/ibcose';
        mockStorageValues({ nextStepAllowed: false, contNextStep: 2 });
        service.warnUserOnBackPressed();

        mockWindow.onpopstate?.(new PopStateEvent('popstate'));

        expect(modalService.closeAllCurrentModals).toHaveBeenCalled();
        expect(mockWindow.location.href).toBe('http://domain');
    });
});