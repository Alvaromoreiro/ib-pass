import { Inject, Injectable, InjectionToken } from '@angular/core';
import { AJSRootScope, CommonsSessionStorageService, downgradeToAJSService, upgradeAJSServiceProvider } from 'ib-web-commons/utils';
import * as angular from 'angular';

import { AJSWindow } from '@src/app/core/config/ib-checkin-app-tokens';
import { IPhonesList, IRootScopeExt } from '@src/app/core/models/generic-models/generic-models';
import { AJSModalService, AJSModalServiceType } from '@src/app/shared/services/ib-modal/ib-modal-service-bridge.service';
import { IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';

export interface CkiBackWarningOptions {
    closeModals?: () => void;
}

export interface CloseSessionServiceType {
    closeSession: () => void;
}

export interface InhibitReasonType {
    SEE_AGENT: boolean;
    AIRCHECK: boolean;
    BOKO: boolean;
    INHIBIT: boolean;
    RESI: boolean;
    UMNR: boolean;
    AVIH: boolean;
    PETC: boolean;
    COUR: boolean;
}

export interface InhibitAlertItem {
    code: string;
    status: boolean;
    showBox?: boolean;
}

interface ApiEstaConstraint {
    showTextEsta: boolean;
    text: string;
}

export const AJSCloseSessionService = new InjectionToken<CloseSessionServiceType>('CloseSessionService');
export const AJSCloseSessionServiceProvider = upgradeAJSServiceProvider('CloseSessionService', AJSCloseSessionService);

interface BackNavigationState {
    blockBack: boolean | null | undefined;
    contNextStep: number | string | null | undefined;
    noShowMessageBockBack: boolean | null | undefined;
    errorCarrierConnect: boolean | null | undefined;
    softUserAfterLogin: string | null | undefined;
    inhibitionBC: unknown;
}

@Injectable({
    providedIn: 'root'
})
export class CheckinFlowService {
    private estaConstraint: ApiEstaConstraint = {
        showTextEsta: false,
        text: ''
    };

    constructor (
        @Inject(AJSWindow) private readonly window: Window,
        @Inject(AJSModalService) private readonly modalService: AJSModalServiceType,
        @Inject(AJSCloseSessionService) private readonly closeSessionService: CloseSessionServiceType,
        @Inject(AJSRootScope) private readonly rootScope: IRootScopeExt,
        private readonly sessionStorageService: CommonsSessionStorageService,
        private readonly redirectionService: IbCheckinRedirectionUtilsService
    ) { }

    backToMain (goToHome: boolean): void {
        this.modalService.isWaiting();
        this.closeSessionService.closeSession();

        if (goToHome) {
            this.sessionStorageService.clearAll();
            this.window.location.href = this.window.location.origin;
        }
    }

    checkConfirmationPNR (): string | null | undefined {
        const confirmationPNR = this.sessionStorageService.get<string | null | undefined>('confirmationPNR');
        if (confirmationPNR) {
            this.redirectionService.path(this.sessionStorageService.get('userLogged') ? '/ibcose2' : '/ibcose');
        }
        return confirmationPNR;
    }

    showPriorityAlertInhibit (items: InhibitAlertItem[]): InhibitAlertItem | undefined {
        const prioritiesReason: Record<string, number> = CheckinAppConstants.INHIBIT_BOARDING_CARD_PRIORITIES;
        let highestRestriction = -1;

        items.forEach((item) => {
            if (prioritiesReason[item.code] > highestRestriction && item.status) {
                highestRestriction = prioritiesReason[item.code];
            }
        });

        const propertyName = Object.keys(prioritiesReason).find((key) => prioritiesReason[key] === highestRestriction);
        const priorityItem = items.find((item) => item.code === propertyName);

        if (priorityItem) {
            priorityItem.status = true;
            priorityItem.showBox = priorityItem.code === CheckinAppConstants.ITEMS_TYPES.UMNR;
        }

        return priorityItem;
    }

    checkInhibitReason (reasons: string[]): InhibitReasonType {
        const inhibitReason: InhibitReasonType = {
            SEE_AGENT: false,
            AIRCHECK: false,
            BOKO: false,
            INHIBIT: false,
            RESI: false,
            UMNR: false,
            AVIH: false,
            PETC: false,
            COUR: false
        };

        const reasonProperties: Record<string, keyof InhibitReasonType> = {
            [CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.SEE_AGENT_REASON]: 'SEE_AGENT',
            [CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.INHIBIT_REASON]: 'INHIBIT',
            [CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.AIRCHECK_REASON]: 'AIRCHECK',
            [CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.RESI_REASON]: 'RESI',
            [CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.UMNR_REASON]: 'UMNR',
            [CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.AVIH_REASON]: 'AVIH',
            [CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.PETC_REASON]: 'PETC',
            [CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.COUR_REASON]: 'COUR'
        };

        reasons.forEach((reason) => {
            const property = reasonProperties[reason];
            if (property) {
                inhibitReason[property] = true;
            }
        });

        return inhibitReason;
    }

    priorityInhibit (reasons: string[]): string | undefined {
        const codeRestrictions: Record<string, number> = CheckinAppConstants.INHIBIT_BOARDING_CARD_PRIORITIES;
        let highestRestriction = -1;

        reasons.forEach((reason) => {
            const item = reason.replace('_REASON', '');
            if (codeRestrictions[item] > highestRestriction) {
                highestRestriction = codeRestrictions[item];
            }
        });

        return Object.keys(codeRestrictions).find((key) => codeRestrictions[key] === highestRestriction);
    }

    updateApiEsta ({ showTextEsta, text }: Partial<ApiEstaConstraint>): void {
        if (showTextEsta) {
            this.estaConstraint.showTextEsta = showTextEsta;
        }

        if (text) {
            this.estaConstraint.text = text;
        }
    }

    checkApisEsta (): ApiEstaConstraint {
        return this.estaConstraint;
    }

    iniPhonesList (): IPhonesList {
        const phonesList: IPhonesList = {
            RESERVAS: {
                prefix: '',
                telephone: '',
                text: '',
                prefixAlt: '',
                telephoneAlt: '',
                textAlt: '',
                timeText: ''
            }
        };

        this.updateFooterModel(phonesList);
        return phonesList;
    }

    updatePhonesList (): void {
        const phonesList = this.sessionStorageService.get<IPhonesList>('phonesList');
        if (phonesList) {
            this.updateFooterModel(phonesList);
        }
    }

    warnUserOnBackPressed (options: CkiBackWarningOptions = {}): void {
        const closeModals = options.closeModals ?? (() => this.modalService.closeAllCurrentModals());
        this.window.history.pushState(null, '', this.window.location.href);
        this.window.onpopstate = () => this.handlePopState(closeModals);
    }

    private getEndpointFromUrl (): string {
        const href = this.window.location.href;
        const splitted = href.split('/');

        return splitted[splitted.length - 1];
    }

    private handlePopState (closeModals: () => void): void {
        const endpoint = this.getEndpointFromUrl();
        const state = this.getBackNavigationState();
        this.sessionStorageService.set('invokeEarlyCheckinFunction', endpoint === 'ckianc');

        if (this.shouldRedirectHome(endpoint, state)) {
            closeModals();
            this.window.location.href = this.window.location.origin;
            return;
        }

        if (state.softUserAfterLogin === 'true') {
            this.sessionStorageService.remove('softUserAfterLogin');
            return;
        }

        if (this.resetSuppressedWarning(state)) {
            return;
        }

        if (state.blockBack) {
            this.showNavigationError(closeModals);
        }
    }

    private getBackNavigationState (): BackNavigationState {
        return {
            blockBack: this.sessionStorageService.get('nextStepAllowed'),
            contNextStep: this.sessionStorageService.get('contNextStep'),
            noShowMessageBockBack: this.sessionStorageService.get('noShowMessageBockBack'),
            errorCarrierConnect: this.sessionStorageService.get('errorCarrierConnect'),
            softUserAfterLogin: this.sessionStorageService.get('softUserAfterLogin'),
            inhibitionBC: this.sessionStorageService.get('inhibitionBC')
        };
    }

    private shouldRedirectHome (endpoint: string, state: BackNavigationState): boolean {
        return endpoint === 'ibcose' && state.blockBack === false && Number(state.contNextStep) > 1;
    }

    private resetSuppressedWarning (state: BackNavigationState): boolean {
        const isMessageSuppressed = state.noShowMessageBockBack === true;
        const isCarrierErrorSuppressed = state.noShowMessageBockBack === false && state.errorCarrierConnect === true;
        if (!isMessageSuppressed && !isCarrierErrorSuppressed) {
            return false;
        }

        if (state.inhibitionBC === null || !state.inhibitionBC) {
            this.sessionStorageService.set('noShowMessageBockBack', false);
            this.sessionStorageService.set('nextStepAllowed', true);
            this.sessionStorageService.set('errorCarrierConnect', false);
        }
        return true;
    }

    private showNavigationError (closeModals: () => void): void {
        closeModals();
        const modalObject = {
            title: {
                message: 'CKIANCPURC_MODAL_TARJ_TITLE',
                needsTranslate: true
            },
            needsTranslate: true,
            message: 'NOT_ALLOWED_FLOW_STEP_TEXT_CKI'
        };
        this.modalService.openNavigationErrorModal(modalObject, true).result.then(
            () => this.window.history.pushState(null, '', this.window.location.href),
            angular.noop
        );
    }

    private updateFooterModel (phonesList: IPhonesList): void {
        const reservas = phonesList.RESERVAS;
        this.rootScope.footerModel = {
            phoneInfo: {
                prefix: reservas?.prefix || '',
                phoneNumber: reservas?.telephone || '',
                text: reservas?.text || ''
            }
        };
    }
}

downgradeToAJSService('CheckinFlowService', CheckinFlowService, 'ib-shared-services-module');