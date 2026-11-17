import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { downgradeToAJSComponent, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbCheckinApisDigitalDataService } from './services/ib-checkin-apis-digital-data.service';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { AJSModalService } from '@shared/services/ib-modal/ib-modal-service-bridge.service';
import {
    AlertAutoCheck,
    Button,
    ButtonProps,
    FormDataApis,
    ModalTravelRequirements,
    ModalTravelRequirementsProps,
    PassengerCheckInUnavailableModal,
    PassengerCheckInUnavailableModalProps,
    PassengerDataCheckModal,
    PassengerDataCheckModalProps,
    StatusOverlayProps,
    PassengerDataIncompleteModal,
    PassengerDataIncompleteModalProps,
    TravelDocumentsModal,
    TravelDocumentModalProps,
    TravelDocumentsModalSave,
    TravelDocumentModalSaveProps
} from 'commercial-management--digital--web-components-design--library';
import { TranslateService } from '@ngx-translate/core';
import { IbCheckinApisService } from './services/ib-checkin-apis.service';
import { IbTravelDocumentService } from './services/ib-travel-document.service';
import { ApisFormModel, ApisPassenger, EmitPassengerStatus, EventPassengerStatusChange, PassengersNOAPIS, TravelDocumentModel, UpdateApisInfoModel, ScrollToPassenger, IHandleTravelDocumentsModal, ShowTravelDocumentsLinkType, GetPassengerStatusType, ShowModalCheckinNotAvailableType, CallUpdateApisInfoType, ApisFormErrorsType } from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import { ApisPassengerState, ApisRequiredFields } from '@src/app/core/constants/ib-checkin-apis-constants';
import { ElementType } from 'react';

import { AcceptService } from './services/ib-call-accept.service';
import { TravelDocumentType } from '@src/app/core/models/travel-documents/travel-documents-model';
import { IbCheckinFormApisComponent } from './components/ib-checkin-form-apis/ib-checkin-form-apis.component';
import { toTravel } from '@src/app/shared/utils/map-travel-documents';
import { DocumentModel } from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';
import { IbCheckinApisUtilsService } from './utils/ib-checkin-apis-utils-services';
import { DigitalDataQuadrigam } from '@src/app/core/constants/ib-digital-data-constants';

@Component({
    selector: 'ib-checkin-apis',
    templateUrl: './ib-checkin-apis.component.html',
    styleUrls: ['./ib-checkin-apis.component.scss']
})
export class IbCheckinApisComponent implements OnInit {
    // Constants
    protected readonly ButtonContinue: ElementType = Button;
    protected readonly AlertAutoCheck: ElementType = AlertAutoCheck;
    protected readonly ModalTravelRequirements: ElementType = ModalTravelRequirements;

    // Modal Components
    protected readonly passengerCheckInUnavailableModal: ElementType = PassengerCheckInUnavailableModal;
    protected readonly passengerDataCheckModal: ElementType = PassengerDataCheckModal;
    protected readonly passengerDataIncompleteModal: ElementType = PassengerDataIncompleteModal;
    protected readonly TravelDocumentsModal: ElementType = TravelDocumentsModal;
    protected readonly TravelDocumentsModalSave: ElementType = TravelDocumentsModalSave;

    // State Properties
    passengers: ApisPassenger[] = [];
    passengersNOAPIS: PassengersNOAPIS[] = [];
    openAccordionIndex = 0;
    showAlertInfo = false;
    passengersIdCompleted: number[] = [];
    requiredFields: ApisRequiredFields[] = [];
    openModal = false;
    showModalTravelRequirements = false;
    countPassengers = { all: 0, isSingle: false, isMulti: false };
    isUnavailableModalOpen = false;
    isUnavailableModalGlobal = false;
    isMultiPassengers: boolean;
    apisFormModel: ApisFormModel[] = [];
    apisFormModelPromise: Promise<ApisFormModel[]>;
    isGlobalSubmit = false;
    submitPromises = new Map<string, { resolve: () => void, reject: (error: any) => void }>();
    passengersWithError: string[] = [];
    availablePassengers: ApisFormModel[] = [];
    apisFormErrors: ApisFormErrorsType[];
    emitPassengerStatus: EmitPassengerStatus[] = [];
    showModalBlockContinueFlow = false;
    updateModel: UpdateApisInfoModel[] = [];
    isFirstShowModalTravelDocuments: boolean = false;

    travelDocument: TravelDocumentModel = {
        documentsUserLogged: [],
        validTypesDocsSecurity: [],
        loggedPassengerId: null,
        documentSelected: [],
        isInfant: false,
        documentsUpdate: []
    };
    showTravelDocumentsLink: ShowTravelDocumentsLinkType = {
        showVisa: false,
        showBasicInfo: false
    };

    buttonContinueProps: ButtonProps;
    modalTravelRequirementsProps: ModalTravelRequirementsProps = {
        requiredFields: [],
        isPrivacyStatement: false
    };
    dataCheckModalProps: PassengerDataCheckModalProps = {
        open: false,
        onClose: () => { 
            this.openPassengerDataCheckModal();
            this.resetGlobalSubmit();
        },
        onPrimaryAction: async () => {
            this.openPassengerDataCheckModal();
            await this.processApiUpdate();
        }
    };
    passengerDataIncompleteModalProps: PassengerDataIncompleteModalProps = {
        open: false,
        onPrimaryAction: () => this.openPassengerDataIncompleteModal()
    };
    passengerCheckInUnavailableModalProps: PassengerCheckInUnavailableModalProps = {
        open: this.isUnavailableModalOpen,
        onPrimaryAction: () => {
            this.isUnavailableModalGlobal ? this.handleUnavailableGlobalCheckin() : this.handleUnavailableCheckin();
        },
        buttonText: 'single'
    };
    overlayProps: StatusOverlayProps = {
        status: 'loading',
        messageKey: 'DATA_BEING_VALIDATED',
        isOpen: false
    };

    travelDocumentsModalProps: TravelDocumentModalProps = {
        open: false,
        documents: [],
        onPrimaryAction: (docs: DocumentModel[], notUseSavedDocuments: boolean): void => {
            this.selectedTravelDocuments(docs, notUseSavedDocuments);
        }
    };

    travelDocumentsModalSaveProps: TravelDocumentModalSaveProps = {
        open: false,
        documents: [],
        onPrimaryAction: (docs: DocumentModel[]): void => {
            this.handleUpdateTravelDocuments(docs);
        },
        onSecondaryAction: () => this.nextFlow()
    };

    trackById = (_: number, p: ApisPassenger) => p.id;
    @ViewChildren(IbCheckinFormApisComponent) private formApisCmps!: QueryList<IbCheckinFormApisComponent>;

    constructor (
        @Inject(AJSModalService) private CheckinModalService,
        private IbCheckinApisService: IbCheckinApisService,
        private IbCheckinApisDigitalDataService: IbCheckinApisDigitalDataService,
        private IbUtilsService: IbUtilsService,
        private TranslateService: TranslateService,
        private AcceptService: AcceptService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbTravelDocumentService: IbTravelDocumentService,
        private IbCheckinApisUtilsService: IbCheckinApisUtilsService
    ) { }

    async ngOnInit (): Promise<void> {
        try {
            this.CheckinModalService.isWaiting();
            this.IbUtilsService.setTitlePage(CheckinAppConstants.TITLE_PAGE.APIS_PASSENGERS, 1400);
            this.IbCheckinApisDigitalDataService.initApisDatalayer();
            await this.getDataPassengers();
            this.apisFormModelPromise = this.createFormModel();
            this.getButtonContinueProps(this.passengersIdCompleted.length > 0);
            this.showAlertInfo = this.countPassengers.isMulti;
            this.extractRequiredFieldsFromPassengers(this.passengers);
            const isPrivacyStatement = this.passengers.some((passenger) => passenger?.passengerBookingInfo?.isPrivacyStatement);
            this.modalTravelRequirementsProps = { ...this.modalTravelRequirementsProps, requiredFields: this.requiredFields, isPrivacyStatement: isPrivacyStatement };
            await this.getTravelDocuments();
        } catch (error) {
            window.console.log(error);
        } finally {
            this.updateLinksTravelDocuments();
            this.CheckinModalService.isNotWaiting();
        }
    }

    async getDataPassengers () {
        this.passengers = await this.IbCheckinApisService.getApisInfo();
        this.passengersNOAPIS = this.getPassengersNOAPI();
        this.countPassengers.all = this.passengers.length + this.passengersNOAPIS.length;
        this.countPassengers.isSingle = this.countPassengers.all === 1;
        this.countPassengers.isMulti = this.countPassengers.all > 1;
    }

    getButtonContinueProps (continueAllowed: boolean = false) {
        const isMobile = window.innerWidth <= 767;
        this.buttonContinueProps = {
            variant: 'primary',
            bordered: !continueAllowed,
            full: isMobile,
            children: this.TranslateService.instant('CONTINUE_CKI_BUTTON'),
            onClick: () => this.onClickButtonContinue()
        };
    }

    private updateAccordionIndex (index: number) {
        const checkOpenNextAccordion = (index: number) => {
            return this.countPassengers.isMulti && index < this.passengers.length;
        };

        if (checkOpenNextAccordion(index)) {
            const nextPassengerId = this.apisFormModel[0]?.passengerId;
            this.openAccordionIndex = this.passengers.findIndex(pass => pass.id === nextPassengerId);
        }
    }

    passengerStatusChange ({ status, id, index }: EventPassengerStatusChange) {
        this.passengers.map((passenger) => {
            if (passenger.id === id.toString()) passenger.formStatus = status;
        });

        if (status === ApisPassengerState.DOCUMENTATION) {
            this.updateAccordionIndex(index);
        } else if (status === ApisPassengerState.COMPLETED) {
            this.passengersIdCompleted.push(id);
            this.removePassengerFromApisFormModel(id.toLocaleString());
            this.IbCheckinApisDigitalDataService.updateApisDigitalData();
            this.updateAccordionIndex(index);

            if (this.countPassengers.isMulti) {
                this.CheckinModalService.isNotWaiting();
                this.getButtonContinueProps(true);
            } else {
                this.continueFlow();
            }
        }
    }

    toggleAccordion (index: number) {
        this.openAccordionIndex = this.openAccordionIndex === index ? -1 : index;
    }

    formatName = (name?: string, surname?: string) => (name && surname ? `${name} ${surname}` : '');

    getFullNameInfant (fullName: string, infantFullName: string) {
        return this.IbUtilsService.isResolutionToMobile() ? `${fullName} ${infantFullName}` : `${fullName} + ${infantFullName}`;
    }

    getFullName (passenger: ApisPassenger) {
        const { name, surname, infant } = passenger.passengerBookingInfo;
        const fullName = this.formatName(name, surname);
        const infantFullName = infant ? this.formatName(infant.name, infant.surname) : '';
        const resultFullName = infantFullName ? this.getFullNameInfant(fullName, infantFullName) : fullName;
        return resultFullName.toLowerCase();
    }

    async onClickButtonContinue (): Promise<void> {
        await this.apisFormModelPromise;

        this.isGlobalSubmit = true;

        if (this.shouldContinueFlow()) return;

        const notCompletedPassengersId = this.getNotCompletedPassengersId();

        await this.updatePassengersHash(notCompletedPassengersId);

        const { hasSubmitChanges, availablePassengers } = await this.hasSubmitChanges(notCompletedPassengersId);

        if (!hasSubmitChanges) return;

        if (availablePassengers.length <= 0) {
            this.continueFlow();
            return;
        }

        this.availablePassengers = availablePassengers;

        try {
            await this.executeAndWaitSubmits(availablePassengers);
        } catch (error) {
            this.handleSubmitError(error);
            return;
        }

        await this.processApiUpdate();
    }

    private handleSubmitError (error: any): void {
        this.scrollToPassenger({ id: error[0] });

        if (this.availablePassengers.some(pass => pass.state === 'validated')) {
            this.availablePassengers
                .filter(pass => error.includes(pass.passengerId))
                .forEach(pass => pass.state = 'validatedWithErrors');
            this.CheckinModalService.isNotWaiting();
            this.openPassengerDataCheckModal(true);
        } else {
            this.resetGlobalSubmit();
        }
    }

    private openPassengerDataCheckModal (isOpen: boolean = false): void {
        this.dataCheckModalProps = {
            ...this.dataCheckModalProps,
            open: isOpen
        };
    }

    handleUnavailableCheckin (): void {
        const { allDocs, someDocs } = this.getPassengerStatus();
        const isSingleOrMulti = this.countPassengers.isSingle || this.countPassengers.isMulti;

        if (someDocs) {
            this.closeUnavailableModal();
        } else if (allDocs && isSingleOrMulti) {
            this.redirectToCheckin('/ibcoac');
        }
    }

    private getDocumentedPassengers (): ApisPassenger[] {
        return this.passengers.filter((p) => p.formStatus === ApisPassengerState.DOCUMENTATION) || [];
    }

    private getPassengerStatus (): GetPassengerStatusType {
        const docsPassengers = this.getDocumentedPassengers();
        const allDocs = docsPassengers.length === this.countPassengers.all;
        const someDocs = docsPassengers.length > 0 && !allDocs;
        return { allDocs, someDocs };
    }

    private closeUnavailableModal (): void {
        this.isUnavailableModalOpen = false;
        this.showPassengerCheckInUnavailableModal({ open: false });
    }

    private redirectToCheckin (path: string): void {
        this.IbCheckinApisService.redirectToCheckin(path);
    }

    private continueFlow (): void {
        // close modal
        this.openPassengerDataCheckModal();
        // check if open TravelDocumentsModalSave
        if (this.checkUserLogged()) 
            this.checkUpdateTravelDocuments();
        else 
            this.nextFlow();
    }

    private nextFlow () {
        if (this.travelDocumentsModalSaveProps.open) 
            this.updateTravelDocumentsModalSaveProps({open: false});
        this.CheckinModalService.isWaiting();
        const passengersSelected = this.IbCheckinApisUtilsService.updatePassengersSelected(this.passengersIdCompleted);
        this.AcceptService.callAccept(passengersSelected, false, null, null);
    }

    updateOverlayStatus (passengerStatus: ApisPassengerState) {
        const overlayState = {
            [ApisPassengerState.PENDING]: { isOpen: true, status: 'loading', messageKey: 'DATA_BEING_VALIDATED' },
            [ApisPassengerState.COMPLETED]: { isOpen: true, status: 'success', messageKey: 'DATA_VALIDATED_AND_SAVED' },
            [ApisPassengerState.CLOSE]: { isOpen: false }
        };

        const newStatus = overlayState[passengerStatus] || { isOpen: false };

        if (passengerStatus === ApisPassengerState.CLOSE) {
            setTimeout(() => {
                this.overlayProps.isOpen = newStatus.isOpen;
            }, 1000);
        } else {
            if (newStatus.isOpen) {
                this.overlayProps.status = newStatus.status;
                this.overlayProps.messageKey = newStatus.messageKey;
            }
            this.overlayProps.isOpen = newStatus.isOpen;
        }
    }

    extractRequiredFieldsFromPassengers (passengers: ApisPassenger[]) {
        const requiredFields = passengers?.flatMap((passenger) => {
            const passengerFields = passenger.requiredFields || [];
            const documentCodes = passenger.mandatoryDocuments?.flatMap((mandatoryDocument) => mandatoryDocument.documents.flatMap((document) => document.type?.code || [])) || [];
            return [...passengerFields, ...documentCodes];
        });
        this.isMultiPassengers = passengers.length > 1;
        this.requiredFields = Array.from(new Set(requiredFields));

        this.modalTravelRequirementsProps = { ...this.modalTravelRequirementsProps, requiredFields: this.requiredFields };
    }

    showModalCheckinNotAvailable ({ passenger, isGlobalSubmit }: ShowModalCheckinNotAvailableType) {
        if (passenger.status === ApisPassengerState.DOCUMENTATION && this.countPassengers.all > 0) {
            const { someDocs } = this.getPassengerStatus();
            let buttonText: 'single' | 'multiple' = 'single';
            this.isUnavailableModalOpen = true;

            if (this.countPassengers.isMulti && someDocs) {
                buttonText = 'multiple';
            }

            this.updateApisPassengersDocumentation(passenger.id);

            this.isUnavailableModalGlobal = isGlobalSubmit;

            this.showPassengerCheckInUnavailableModal({
                open: this.isUnavailableModalOpen,
                buttonText: buttonText,
                fullName: passenger.fullName,
                showMessage: passenger.showMessage || false,
                message: passenger.message || ''
            });
        }
    }

    private showPassengerCheckInUnavailableModal (props: Partial<PassengerCheckInUnavailableModalProps>) {
        this.passengerCheckInUnavailableModalProps = {
            ...this.passengerCheckInUnavailableModalProps,
            ...props
        };
    }

    private updateApisPassengersDocumentation (passengerId: number) {
        const passengersDoc: number[] = this.CommonsSessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.PASSENGERS_APIS_DOCS) || [];
        const newPassengersDoc: number[] = [passengerId];
        const allPassengersDoc = Array.from(new Set([...passengersDoc, ...newPassengersDoc]));
        this.CommonsSessionStorageService.set(CheckinAppConstants.STORAGE_KEYS.PASSENGERS_APIS_DOCS, allPassengersDoc);
    }

    private getPassengersNOAPI (): PassengersNOAPIS[] {
        const passengersNOAPIS: any[] = this.CommonsSessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.PASSENGERS_NOAPIS) || [];
        const bookingInfo: any = this.CommonsSessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO);
        const result: PassengersNOAPIS[] = [];

        passengersNOAPIS.forEach((passengerId) => {
            const passengerData = bookingInfo?.passengers.find((passenger) => passenger.id === passengerId);
            if (passengerData) {
                result.push({
                    id: passengerData.id,
                    status: ApisPassengerState.COMPLETED,
                    fullName: this.formatName(passengerData.name, passengerData.surname),
                    isNOAPI: true
                });
                // init passengers completed
                this.passengersIdCompleted.push(passengerId);
            }
        });

        return result;
    }

    async createFormModel (): Promise<ApisFormModel[]> {
        const formDataApisModel = await this.IbCheckinApisService.getFormDataApisModel(this.passengers.length);
        this.apisFormModel = formDataApisModel;
        return this.apisFormModel;
    }

    notifySubmitComplete = (passengerId: string, apisForm: FormDataApis): void => {
        const promiseHandlers = this.submitPromises.get(passengerId);
        if (promiseHandlers) {
            const model = this.apisFormModel.find(pass => pass.passengerId.toLocaleString() === passengerId);
            model.state = 'validated';
            model.model = apisForm;
            const passengerModelIndex = this.passengersWithError.findIndex(pass => pass === passengerId);
            if (passengerModelIndex >= 0) this.passengersWithError.splice(passengerModelIndex, 1);
            this.submitPromises.delete(passengerId);
            promiseHandlers.resolve();
        }
    };

    async updatePassengersHash (passengersIds: string[]) {
        await Promise.all(
            passengersIds.map(async id => {
                const passenger = this.apisFormModel.find(model => model.passengerId === id);

                if (passenger) {
                    const existCheckAllPassengersData = this.IbCheckinApisService.existCheckAllPassengersData();
                    const newModel = passenger.formRef.getData();

                    if (existCheckAllPassengersData) {
                        newModel.contactData = passenger.initialCheckModel.contactData;
                        newModel.passengerAddress = passenger.initialCheckModel.passengerAddress;
                    }

                    const newHash = await this.IbCheckinApisService.createFormDataApisModelHash(newModel);

                    if (passenger.hashEnd !== newHash) {
                        passenger.state = 'candidate';
                        passenger.hashEnd = newHash;
                    } else if (passenger.state === 'validatedWithErrors') {
                        passenger.state = 'pending';
                    } 
                }
            })
        );
    }

    private async executeAndWaitSubmits (passengersIds: ApisFormModel[]) {
        this.submitPromises.clear();

        const submitPromises = passengersIds.map(pass => {
            return new Promise<void>((resolve, reject) => {
                this.submitPromises.set(pass.passengerId.toLocaleString(), { resolve, reject });
            });
        });

        passengersIds.forEach(pass => {
            const submitEvent = new Event('submit', {
                bubbles: true,
                cancelable: true
            });
            pass.formRef.ref.dispatchEvent(submitEvent);
        });

        const results = await Promise.allSettled(submitPromises);

        const allCorrect = results.every(result => result.status === 'fulfilled');

        if (!allCorrect) {
            const errorIds = results
                .filter(result => result.status === 'rejected')
                .map(result => (result as PromiseRejectedResult).reason);
            throw errorIds;
        }
    }

    private async hasSubmitChanges (notCompletedPassengersId: string[]) {
        const availablePassengers = this.apisFormModel.filter(passenger =>
            notCompletedPassengersId.includes(passenger.passengerId.toLocaleString()) &&
            passenger.hashInit !== passenger.hashEnd &&
            passenger.state !== 'pending'
        );

        if (availablePassengers.length <= 0 && this.passengersIdCompleted.length <= 0) {
            this.openPassengerDataIncompleteModal(true);
            this.resetGlobalSubmit();
            return { hasSubmitChanges: false, availablePassengers };
        }

        return { hasSubmitChanges: true, availablePassengers };
    }

    private shouldContinueFlow () {
        const areAllPassengersCompleted = this.passengersIdCompleted.length === this.countPassengers.all;
        const isMultiAllCompleted = this.countPassengers.isMulti && areAllPassengersCompleted;
        const isSingleAllCompleted = this.countPassengers.isSingle && areAllPassengersCompleted;

        if (isMultiAllCompleted || isSingleAllCompleted) {
            this.continueFlow();
            return true;
        }

        return false;
    }

    private getNotCompletedPassengersId () {
        const allPassengersId = this.apisFormModel.map(model => model.passengerId);
        const completedPassengersIdSet = new Set(this.passengersIdCompleted.map(String));
        return allPassengersId.map(String).filter(id => {
            const pax = this.passengers.find(pax => pax.id.toLocaleString() === id);
            return !completedPassengersIdSet.has(id) && pax.formStatus === ApisPassengerState.PENDING;
        });
    }

    getPassengerSubmitError (passengerId: string) {
        if (this.submitPromises.has(passengerId)) {
            const passengerModel = this.apisFormModel.find(pass => pass.passengerId === passengerId);
            if (passengerModel) passengerModel.state = 'pending';
            const passengerPromise = this.submitPromises.get(passengerId);
            passengerPromise.reject(passengerId);
        }

        if (!this.passengersWithError.includes(passengerId)) this.passengersWithError.push(passengerId);
    }

    async callUpdateApisInfo ({model, isUpdateAll = false}: CallUpdateApisInfoType) {
        this.updateOverlayStatus(ApisPassengerState.PENDING);
        this.updateDocumentsModel(model);
        await this.IbCheckinApisService.updateApisInfo(model, isUpdateAll, this.requiredFields);
        this.updateOverlayStatus(ApisPassengerState.COMPLETED);
    }

    private async processApiUpdate () {
        const validPassengers = this.availablePassengers.filter(pass => pass.state === 'validated' && pass);

        const emitPassengerStatus: EmitPassengerStatus[] = validPassengers.map((passenger, index) => {
            const { model } = passenger;

            const fullName = `${model.personalData.name} ${model.personalData.surname}`.trim();

            return {
                status: ApisPassengerState.COMPLETED,
                id: Number(passenger.passengerId),
                fullName,
                index
            };
        });

        try {
            if (this.openAccordionIndex < 0) this.scrollToPassenger({ id: emitPassengerStatus[0].id });

            const model: UpdateApisInfoModel[] = validPassengers.map(passenger => (
                {
                    formData: passenger.model,
                    id: passenger.passengerId.toLocaleString()
                }
            ));

            await this.callUpdateApisInfo({model});
        } catch (error) {
            this.handleError(error, emitPassengerStatus);
        } finally {
            this.finalizeSubmit(emitPassengerStatus);
        }
    }

    handleError (error: any, emitPassengerStatus: EmitPassengerStatus[]) {
        if (!Array.isArray(error)) {
            emitPassengerStatus.forEach(pass => pass.status = ApisPassengerState.PENDING);
            return;
        }

        const passengersIdWithErrors: number[] = error.map(({ id }) => id);
        emitPassengerStatus.forEach(passenger => {
            if (passengersIdWithErrors.includes(passenger.id)) {
                passenger.status = ApisPassengerState.PENDING;
            }
        });

        this.apisFormModel.forEach(passenger => {
            if (passengersIdWithErrors.includes(Number(passenger.passengerId))) {
                passenger.state = 'pending';
            }
        });

        error.forEach(({ id, errors }) => {
            if (this.IbCheckinApisUtilsService.isErrorRelatedToConstraints(errors)) {
                const passengerStatus = emitPassengerStatus.find(pass => pass.id.toLocaleString() === String(id));
                this.updatePassengerStatusForConstraints(errors, passengerStatus);
            }

            this.IbCheckinApisService.setApisFormError((id as number).toLocaleString(), errors);
        });

        this.apisFormErrors = error;
    }

    updatePassengerStatusForConstraints (error: any, emitPassengerStatus: EmitPassengerStatus) {
        if (error.isEesConstraints || error.isEtiasConstraints) {
            emitPassengerStatus.showMessage = true;
            emitPassengerStatus.message = error.message;
        }
        emitPassengerStatus.status = ApisPassengerState.DOCUMENTATION;

        this.removePassengerFromApisFormModel(emitPassengerStatus.id.toLocaleString());
        this.updateApisPassengersDocumentation(emitPassengerStatus.id);
    }

    finalizeSubmit (emitPassengerStatus: EmitPassengerStatus[]) {
        const validStatusBlockForm = [ApisPassengerState.COMPLETED, ApisPassengerState.DOCUMENTATION];

        emitPassengerStatus.forEach(pass => {
            this.passengerStatusChange(pass);

            this.IbCheckinApisService.setBlockForm(pass.id.toLocaleString(), validStatusBlockForm.includes(pass.status));
        });

        const firstPassengerPending = emitPassengerStatus.find(pass => pass.status === ApisPassengerState.PENDING);

        if (firstPassengerPending) {
            this.scrollToPassenger({ id: firstPassengerPending.id });
        }

        this.emitPassengerStatus = emitPassengerStatus;

        const firstDocumentationPassenger = emitPassengerStatus.find(pass => pass.status === ApisPassengerState.DOCUMENTATION);

        if (firstDocumentationPassenger) {
            this.showModalCheckinNotAvailable({ passenger: firstDocumentationPassenger, isGlobalSubmit: true });
        }

        this.updateOverlayStatus(ApisPassengerState.CLOSE);

        const hasNotCompletedPassengers = emitPassengerStatus.some(pass => pass.status === ApisPassengerState.PENDING || pass.status === ApisPassengerState.DOCUMENTATION);

        if (
            !hasNotCompletedPassengers &&
            this.passengersIdCompleted.length > 0
        ) {
            this.continueFlow();
            this.resetGlobalSubmit();
        }

        this.resetGlobalSubmit();
    }

    scrollToPassenger ({ id, section }: ScrollToPassenger) {
        const container = document.getElementById(`passenger${id}`);
        if (!container) return;

        const index = this.passengers.findIndex(p => p.id === String(id));
        if (index >= 0) this.openAccordionIndex = index;
        setTimeout(() => {
            const target = section
                ? document.getElementById(`${section}${id}`) || container
                : container;

            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
    }

    handleUnavailableGlobalCheckin () {
        this.closeUnavailableModal();

        const pendingPassenger = this.emitPassengerStatus.find(
            pass => pass.status === ApisPassengerState.PENDING
        );

        const hasCompletedPassengers =
            this.emitPassengerStatus.some(pass => pass.status === ApisPassengerState.COMPLETED) ||
            this.passengersIdCompleted.length > 0;

        const hasIncompletePassengers =
            this.emitPassengerStatus.length !== this.apisFormModel.length &&
            this.apisFormModel.length > 0;

        if (pendingPassenger) {
            this.openAccordionIndex = pendingPassenger.index;
        } else if (hasCompletedPassengers) {
            this.continueFlow();
        } else if (!hasIncompletePassengers) {
            this.redirectToCheckin('/ibcoac');
        }

        this.resetGlobalSubmit();
    }

    private resetGlobalSubmit () {
        this.isGlobalSubmit = false;
    }

    private openPassengerDataIncompleteModal (isOpen: boolean = false): void {
        this.passengerDataIncompleteModalProps = {
            ...this.passengerDataIncompleteModalProps,
            open: isOpen
        };
    }

    removePassengerFromApisFormModel (passengerId: string) {
        const index = this.apisFormModel.findIndex(model => model.passengerId === passengerId);
        if (index >= 0) {
            this.apisFormModel.splice(index, 1);
        }
    }

    async getTravelDocuments (notOpenTravelDocumentModal: boolean = false) {
        const userLogged = this.checkUserLogged();
        let showModalTravelRequirements = true;

        // Search docs valid APIS (getSecurity)
        const dataFilter = this.IbCheckinApisService.filterTypesDocsSecurity(userLogged, this.passengers);
        this.travelDocument.validTypesDocsSecurity = dataFilter.validTypesDocs || [];
        this.travelDocument.loggedPassengerId = dataFilter.loggedPassengerId;

        if (this.travelDocument.validTypesDocsSecurity.length > 0) {
            const travelDocuments = await this.IbTravelDocumentService.getTravelDocuments(this.travelDocument.validTypesDocsSecurity);

            if (travelDocuments.documents?.length > 0) {
                this.showTravelDocumentsLink = {
                    showBasicInfo: dataFilter.showTravelDocumentsLink.showBasicInfo,
                    showVisa: dataFilter.showTravelDocumentsLink.showVisa && travelDocuments.documentsTypesValid.includes('VISA')
                };
                this.travelDocument.documentsUserLogged = travelDocuments.documents;

                if (!notOpenTravelDocumentModal) {
                    this.isFirstShowModalTravelDocuments = true;
                    this.openTravelDocumentModal();
                }
                showModalTravelRequirements = false;
            }
        }

        this.showModalTravelRequirements = showModalTravelRequirements;
    }

    openTravelDocumentModal (validTypesDocs?: TravelDocumentType[]) {
        const validTypes = (validTypesDocs?.length > 0) ? validTypesDocs : undefined;
        const props = this.IbCheckinApisService.getTravelDocumentsModalProps(this.travelDocument.documentsUserLogged, validTypes);

        // send proces, step and event
        this.IbCheckinApisDigitalDataService.setApisProcessAndStep(DigitalDataQuadrigam.CKIDOC);
        if (!this.isFirstShowModalTravelDocuments) this.IbCheckinApisDigitalDataService.handleEventsTravelDocuemnts({validTypesDocs});

        this.isFirstShowModalTravelDocuments = false;
        this.travelDocumentsModalProps = {...this.travelDocumentsModalProps, ...props};
    }

    selectedTravelDocuments (docs: DocumentModel[], notUseSavedDocuments: boolean) {
        this.travelDocumentsModalProps = {...this.travelDocumentsModalProps, open: false};

        // send event
        this.IbCheckinApisDigitalDataService.handleEventsTravelDocuemnts({docs, notUseSavedDocuments});
        // set proces and step page
        this.IbCheckinApisDigitalDataService.setApisProcessAndStep();
        
        if (docs?.length === 0) return;
        
        const travelDocumentsSelected = [];
        docs.forEach((d) => {
            const dataTravelDocument = this.travelDocument.documentsUserLogged.find((d2) => d2.id === d.id);
            if (dataTravelDocument) travelDocumentsSelected.push(dataTravelDocument);
        });

        if (travelDocumentsSelected.length > 0) {
            this.travelDocument.documentSelected = travelDocumentsSelected;
            // Send selected documents to passenger
            this.updateTravelDocumentsToPassenger();
        }
    }

    private checkUpdateTravelDocument () {
        return !this.formApisCmps || this.formApisCmps.length === 0 || !this.travelDocument?.loggedPassengerId || this.travelDocument?.documentSelected?.length === 0;
    }

    updateTravelDocumentsToPassenger () {
        if (this.checkUpdateTravelDocument()) return;
        const passengerId = this.travelDocument?.otherPassengerId ?? this.travelDocument.loggedPassengerId;

        const target = this.formApisCmps
            .toArray()
            .find(c => c.passenger?.id === passengerId);

        if (!target) {
            return;
        }

        if (this.travelDocument.documentSelected.length > 0) {
            this.travelDocument.otherPassengerId = undefined;
            target.updateTravelDocumentsToPassenger(this.travelDocument.documentSelected, this.travelDocument.isInfant);
        }
    }

    handleTravelDocumentsModalEvent ({ passengerId, validTypesDocs, isInfant }: IHandleTravelDocumentsModal) {
        const mapValidTypesDocs = toTravel(validTypesDocs);
        this.travelDocument.otherPassengerId = passengerId ?? undefined;
        this.travelDocument.isInfant = isInfant;
        this.openTravelDocumentModal(mapValidTypesDocs);
    }

    updateLinksTravelDocuments () {
        const showBasicInfoChanged = this.travelDocument?.showTravelDocumentsLink?.showBasicInfo !== this.showTravelDocumentsLink.showBasicInfo;
        const showVisaChanged =  this.travelDocument?.showTravelDocumentsLink?.showVisa !== this.showTravelDocumentsLink.showVisa;

        if (showBasicInfoChanged || showVisaChanged) {
            this.travelDocument.showTravelDocumentsLink = this.showTravelDocumentsLink;
        }
    }

    // Update Travel Documents
    checkUpdateTravelDocuments () {
        const completedUserDocuments: UpdateApisInfoModel[] = this.updateModel.filter(model => this.passengersIdCompleted.map(String).includes(model.id));
        this.travelDocument.documentsUpdate = this.IbCheckinApisUtilsService.checkUpdateTravelDocuments(completedUserDocuments, this.travelDocument.documentsUserLogged);
        
        if (this.travelDocument.documentsUpdate.length > 0) {
            // Open Modal Save
            this.updateTravelDocumentsModalSaveProps({open: true, documents: this.travelDocument.documentsUpdate});
        } else {
            this.nextFlow();
        }
    }

    async updateTravelDocuments (data: DocumentModel[]) {
        this.CheckinModalService.isWaiting();

        try {
            await this.IbTravelDocumentService.updateTravelDocumentsBulk(data);
            // const callGetTravel: boolean = this.IbCheckinApisUtilsService.evaluateStatus(response);
            // if (callGetTravel) {
            //     await this.getTravelDocuments(true);
            // }
        } catch (error) {
            window.console.error(`[updateTravelDocuments] CATCH:`, error);
        } finally {
            this.nextFlow();
        }
    }

    handleUpdateTravelDocuments (updateDocuments: DocumentModel[]) {
        this.updateTravelDocumentsModalSaveProps({open: false}); // close modal
        this.updateTravelDocuments(updateDocuments);
    }

    updateTravelDocumentsModalSaveProps (partial: Partial<TravelDocumentModalSaveProps>) {
        this.CheckinModalService.isNotWaiting();
        this.travelDocumentsModalSaveProps = {...this.travelDocumentsModalSaveProps, ...partial};
    }

    checkUserLogged (): boolean {
        const userLogged = this.CommonsSessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.USER_LOGGED) as boolean ?? false;
        if (!userLogged) {
            this.travelDocument = {
                documentsUserLogged: [],
                validTypesDocsSecurity: [],
                loggedPassengerId: null,
                documentSelected: [],
                isInfant: false,
                documentsUpdate: []
            };
        }
        return userLogged;
    }

    updateDocumentsModel (model: UpdateApisInfoModel[]) {
        const modelsMap = new Map();

        for (let item of [...this.updateModel, ...model]) {
            modelsMap.set(item.id, item);
        }

        this.updateModel = [...modelsMap.values()];
    }
}

downgradeToAJSComponent(
    'ibCheckinApis',
    {
        component: IbCheckinApisComponent
    },
    'ib-check-in-apis-module',
    []
);
