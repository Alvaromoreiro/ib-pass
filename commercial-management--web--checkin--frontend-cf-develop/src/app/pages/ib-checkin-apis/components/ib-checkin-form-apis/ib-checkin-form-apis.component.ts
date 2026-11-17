import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { IbCheckinApisService } from '../../services/ib-checkin-apis.service';
import { ApisForm, ApisFormProps, FormDataApis, OnFormReadyType, FormRefType } from 'commercial-management--digital--web-components-design--library';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { IbCheckinApisFormService } from './services/ib-checkin-apis-form.service';
import { ApisPassengerState, ApisRequiredFields } from '@src/app/core/constants/ib-checkin-apis-constants';
import { ApisPassenger, EmitPassengerStatus, FormDataChecksAllPassengers, ShowTravelDocumentsLinkType, ScrollToPassenger, UpdateApisInfoModel, IHandleTravelDocumentsModal, ShowModalCheckinNotAvailableType, PassengerStatusChangeType } from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import { cloneDeep } from 'lodash-es';
import { NavigationEnd, Router } from '@angular/router';
import { TypesDocumentsAccepted } from '@src/app/core/models/travel-documents/travel-documents-model';
import { DocumentModel } from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';
import { IbCheckinApisUtilsService } from '../../utils/ib-checkin-apis-utils-services';

@Component({
    selector: 'ib-checkin-form-apis',
    template: `
        <div id="react-components">
            <ng-react [component]="ApisForm" [props]="props"></ng-react>
        </div>
    `
})
export class IbCheckinFormApisComponent implements OnInit, OnDestroy, OnChanges {
    private subscriptionCheckAllPassengers: Subscription | undefined;
    private routerSubscription: Subscription;
    private destroy$ = new Subject<void>();
    protected ApisForm = ApisForm;
    private formRef: FormRefType;
    props: ApisFormProps;

    @Input() passenger: ApisPassenger;
    @Input() isMultiPassengers: boolean;
    @Input() index: number;
    @Input() isGlobalSubmit: boolean;
    @Input() showTravelDocumentsLink?: ShowTravelDocumentsLinkType;
    @Input() requiredFields: ApisRequiredFields[] = [];
    @Input() onSubmitComplete: (passengerId: string, model: FormDataApis) => void;

    @Output() passengerStatusChange = new EventEmitter<PassengerStatusChangeType>();
    @Output() updateOverlayStatus = new EventEmitter<ApisPassengerState>();
    @Output() showModalCheckinNotAvailable = new EventEmitter<ShowModalCheckinNotAvailableType>();
    @Output() submitError = new EventEmitter<string>();
    @Output() removePassengerFromApisFormModel = new EventEmitter<string>();
    @Output() scrollToPassenger = new EventEmitter<ScrollToPassenger>();
    @Output() handleTravelDocumentsModalEvent = new EventEmitter<IHandleTravelDocumentsModal>();
    @Output() updateDocumentsModel = new EventEmitter<UpdateApisInfoModel[]>();
    @Output() updatePassengerHash = new EventEmitter<string[]>();

    constructor (private IbCheckinApisService: IbCheckinApisService, private IbCheckinApisFormService: IbCheckinApisFormService, private router: Router, private IbCheckinApisUtilsService: IbCheckinApisUtilsService) { }
    
    ngOnChanges (changes: SimpleChanges): void {
        if (this.showTravelDocumentsLink && changes['showTravelDocumentsLink']) {
            this.props = { ...this.props, showTravelDocumentsLink: this.showTravelDocumentsLink};
        }
    }

    async ngOnInit () {
        this.props = this.IbCheckinApisFormService.getApisFormProps({
            passenger: this.passenger,
            isMultiPassengers: this.isMultiPassengers,
            onSubmitApisForm: this.onSubmitApisForm,
            onFormReady: this.onFormReady,
            onSubmitError: this.onSubmitError,
            openTravelDocumentsModal: (passengerId, validTypesDocs, isInfant) => this.handleTravelDocumentsModal(passengerId, validTypesDocs, isInfant)
        });

        this.initSubscriptions();
    }

    initSubscriptions () {
        this.routerSubscription?.unsubscribe();

        const getData = (formData: FormDataChecksAllPassengers) => {
            const data = this.IbCheckinApisFormService.transformerCheckAllPassengers(formData, this.props);
            this.props = cloneDeep(data);
        };
        const getRouterEvent = (event) => {
            if (event instanceof NavigationEnd) {
                this.unsubscribe();
                this.initSubscriptions();
            }
        };

        this.subscriptionCheckAllPassengers = this.IbCheckinApisService.checkAllPassengers$.subscribe(getData);
        this.routerSubscription = this.router.events.subscribe(getRouterEvent);

        this.IbCheckinApisService.getApisFormErrors(this.passenger.id.toLocaleString())
            .pipe(takeUntil(this.destroy$))
            .subscribe(error => {
                this.props = {
                    ...this.props,
                    apisFormErrors: error
                };
            });

        this.IbCheckinApisService.resetBlockForm();
        this.IbCheckinApisService.getBlockForm(this.passenger.id.toLocaleString())
            .pipe(takeUntil(this.destroy$))
            .subscribe(isBlockForm => {
                this.props = {
                    ...this.props,
                    isBlockForm: isBlockForm
                };
            });
    }

    unsubscribe () {
        if (this.subscriptionCheckAllPassengers) {
            this.subscriptionCheckAllPassengers.unsubscribe();
            this.IbCheckinApisService.resetCheckAllPassengersData();
        }
    }

    isBlockForm (status: ApisPassengerState) {
        const validStatusBlockForm = [ApisPassengerState.COMPLETED, ApisPassengerState.DOCUMENTATION];
        const isBlockForm = validStatusBlockForm.includes(status);
        this.props = {
            ...this.props,
            isBlockForm: isBlockForm
        };
    }

    initializePassengerStatus (fullName: string): EmitPassengerStatus {
        return {
            status: ApisPassengerState.COMPLETED,
            id: Number(this.props.id),
            index: this.index,
            fullName: fullName
        };
    }

    async processApiUpdate (formApis: FormDataApis) {
        this.updateOverlayStatus.emit(ApisPassengerState.PENDING);
        const model: UpdateApisInfoModel[] = [{
            formData: formApis,
            id: this.props.id
        }];
        this.updateDocumentsModel.emit(model);

        await this.IbCheckinApisService.updateApisInfo(model, true, this.requiredFields);
        this.updateOverlayStatus.emit(ApisPassengerState.COMPLETED);
    }

    handleError (error: any, emitPassengerStatus: EmitPassengerStatus) {
        emitPassengerStatus.status = ApisPassengerState.PENDING;

        if (this.IbCheckinApisUtilsService.isErrorRelatedToConstraints(error)) {
            this.updatePassengerStatusForConstraints(error, emitPassengerStatus);
        }

        if (!Array.isArray(error)) return;

        throw error;
    }

    updatePassengerStatusForConstraints (error: any, emitPassengerStatus: EmitPassengerStatus) {
        if (error.isEesConstraints || error.isEtiasConstraints) {
            emitPassengerStatus.showMessage = true;
            emitPassengerStatus.message = error.message;
        }
        emitPassengerStatus.status = ApisPassengerState.DOCUMENTATION;
        this.removePassengerFromApisFormModel.emit(emitPassengerStatus.id.toLocaleString());
    }

    finalizeSubmit (emitPassengerStatus: EmitPassengerStatus) {
        this.isBlockForm(emitPassengerStatus.status);
        this.passengerStatusChange.emit(emitPassengerStatus);

        if (emitPassengerStatus.status === ApisPassengerState.DOCUMENTATION) {
            this.showModalCheckinNotAvailable.emit({ passenger: emitPassengerStatus, isGlobalSubmit: false });
        }

        this.updateOverlayStatus.emit(ApisPassengerState.CLOSE);
    }

    onSubmitApisForm = async (formApis: FormDataApis) => {
        const fullName = `${formApis.personalData.name} ${formApis.personalData.surname}`.trim();
        const emitPassengerStatus: EmitPassengerStatus = this.initializePassengerStatus(fullName);

        if (this.isGlobalSubmit) {
            this.onSubmitComplete(this.passenger.id.toLocaleString(), formApis);
            return;
        }

        this.updatePassengerHash.emit([this.passenger.id.toLocaleString()]);

        try {
            await this.processApiUpdate(formApis);
        } catch (error: any) {
            this.handleError(error[0]?.errors, emitPassengerStatus);
        } finally {
            this.finalizeSubmit(emitPassengerStatus);
        }
    };

    onFormReady: OnFormReadyType = (formRef: FormRefType, model: FormDataApis) => {
        this.formRef = formRef;
        this.IbCheckinApisService.setFormDataApisModel(model, formRef, this.passenger.id);
    };

    onSubmitError = () => {
        this.submitError.emit(this.passenger.id.toLocaleString());
    };

    ngOnDestroy () {
        if (this.routerSubscription) this.routerSubscription.unsubscribe();
    }

    updateTravelDocumentsToPassenger (documents: DocumentModel[], isInfant): void {
        if (documents.length > 0) {
            const updateModel = this.IbCheckinApisFormService.updateTravelDocument(this.props.model, documents, isInfant, this.formRef.getData());
            if (updateModel) {
                this.props = { ...this.props, model: updateModel };
                this.scrollToPassenger.emit({ id: updateModel.id, section: 'basic-info' });
            }
        }
    }

    handleTravelDocumentsModal (passengerId: number, validTypesDocs: TypesDocumentsAccepted[], isInfant: boolean) {
        this.handleTravelDocumentsModalEvent.emit({ passengerId: passengerId.toString(), validTypesDocs, isInfant });
    }
}
