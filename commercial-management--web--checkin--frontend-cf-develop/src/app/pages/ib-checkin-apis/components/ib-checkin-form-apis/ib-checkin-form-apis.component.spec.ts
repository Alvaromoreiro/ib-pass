import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

import { IbCheckinFormApisComponent } from './ib-checkin-form-apis.component';
import { IbCheckinApisService } from '@src/app/pages/ib-checkin-apis/services/ib-checkin-apis.service';
import { IbCheckinApisFormService } from '@src/app/pages/ib-checkin-apis/components/ib-checkin-form-apis/services/ib-checkin-apis-form.service';
import { ApisPassenger, EmitPassengerStatus, FormDataChecksAllPassengers, GetApisFormProps, IHandleTravelDocumentsModal, PassengerStatusChangeType, ScrollToPassenger, ShowModalCheckinNotAvailableType, ShowTravelDocumentsLinkType } from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import { ApisPassengerState } from '@src/app/core/constants/ib-checkin-apis-constants';
import { DocumentModel } from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';
import { IbCheckinApisUtilsService } from '@src/app/pages/ib-checkin-apis/utils/ib-checkin-apis-utils-services';
import { FormDataApis, ApisFormProps, FormRefType, ModelApisForm } from 'commercial-management--digital--web-components-design--library';
import { TypesDocumentsAccepted } from '@src/app/core/models/travel-documents/travel-documents-model';

class MockRouter {
    public events = new Subject<NavigationEnd>();
    navigate = jasmine.createSpy('navigate');
}

const sampleFormApis: FormDataApis = {
    personalData: {
        name: '',
        surname: '',
        birthDate: '',
        nationality: {
            value: '',
            label: ''
        },
        country: {
            value: '',
            label: ''
        },
        gender: ''
    },
    contactData: {
        additionalInfo: {
            email: '',
            phone: {
                value: '',
                label: ''
            },
            number: '',
            checkInfoAll: false
        },
        emergencyInfo: {
            phone: {
                value: '',
                label: ''
            },
            number: '',
            name: '',
            checkEmergencyAll: false
        }
    },
    documentationRequired: {
        mandatory: {
            type: '',
            number: '',
            expiryDate: '',
            issuerCountry: '',
            requiredField: [],
            mrzText: '',
            ocrVerified: false
        },
        visa: {
            type: '',
            number: '',
            expiryDate: '',
            issuerCountry: '',
            requiredField: [],
            mrzText: '',
            ocrVerified: false
        },
        other: {
            type: '',
            number: '',
            expiryDate: '',
            issuerCountry: '',
            requiredField: [],
            mrzText: '',
            ocrVerified: false
        }
    },
    checkbox: {
        notSendNewsletter: false,
        usPrivacyEmergencyData: false,
        confirmEmergencyData: false
    }
};

describe('IbCheckinFormApisComponent', () => {
    let component: IbCheckinFormApisComponent;
    let fixture: ComponentFixture<IbCheckinFormApisComponent>;
    let mockApisService: jasmine.SpyObj<IbCheckinApisService>;
    let mockIbCheckinApisFormService: jasmine.SpyObj<IbCheckinApisFormService>;
    let router: MockRouter;
    let mockIbCheckinApisUtilsService: jasmine.SpyObj<IbCheckinApisUtilsService>;
    let checkAllPassengers$: Subject<FormDataChecksAllPassengers>;

    const basePassenger = { id: 123, fullName: 'John Doe' } as unknown as ApisPassenger;

    beforeEach(async () => {
        mockApisService = jasmine.createSpyObj<IbCheckinApisService>(
            'IbCheckinApisService',
            [
                'setApisFormError',
                'resetBlockForm',
                'getBlockForm',
                'resetCheckAllPassengersData',
                'updateApisInfo',
                'setFormDataApisModel'
            ],
            {}
        );

        mockIbCheckinApisFormService = jasmine.createSpyObj<IbCheckinApisFormService>(
            'IbCheckinApisFormService',
            ['getApisFormProps', 'transformerCheckAllPassengers', 'updateTravelDocument']
        );

        mockIbCheckinApisUtilsService = jasmine.createSpyObj<IbCheckinApisUtilsService>(
            'IbCheckinApisUtilsService',
            ['isErrorRelatedToConstraints']
        );

        // Provide the Subjects/Observables the component wires up to
        checkAllPassengers$ = new Subject<FormDataChecksAllPassengers>();
        const errors$ = new Subject<unknown>();
        const blockForm$ = new BehaviorSubject<boolean>(false);

        // @ts-ignore (define property on spy for stream)
        mockApisService.checkAllPassengers$ = checkAllPassengers$.asObservable();
        mockApisService.getBlockForm.and.callFake(() => blockForm$.asObservable());
        mockApisService.updateApisInfo.and.returnValue(Promise.resolve());
        mockApisService.getApisFormErrors = jasmine
            .createSpy('getApisFormErrors')
            .and.callFake(() => errors$.asObservable());

        mockIbCheckinApisFormService.getApisFormProps.and.callFake(
            (args: GetApisFormProps): ApisFormProps => ({
                listNationalities: [],
                listCountries: [],
                listStates: [],
                countryCodes: [],
                market: 'ES',
                model: { id: args.passenger.id.toString(), personalData: {} } as unknown as ModelApisForm,
                onSubmit: args.onSubmitApisForm,
                isMultiPassengers: args.isMultiPassengers,
                id: args.passenger.id.toString(),
                ocrLicense: undefined,
                updateDatalayerEvent: () => { },
                onFormReady: args.onFormReady,
                onSubmitError: args.onSubmitError,
                openTravelDocumentsModal: args.openTravelDocumentsModal,
                showTravelDocumentsLink: args.showTravelDocumentsLink
            })
        );

        await TestBed.configureTestingModule({
            declarations: [IbCheckinFormApisComponent],
            providers: [
                { provide: Router, useClass: MockRouter },
                { provide: IbCheckinApisService, useValue: mockApisService },
                { provide: IbCheckinApisFormService, useValue: mockIbCheckinApisFormService },
                { provide: IbCheckinApisUtilsService, useValue: mockIbCheckinApisUtilsService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(IbCheckinFormApisComponent);
        component = fixture.componentInstance;

        router = TestBed.inject(Router) as unknown as MockRouter;

        // Inputs
        component.passenger = basePassenger;
        component.isMultiPassengers = false;
        component.index = 0;
        component.isGlobalSubmit = false;
        component.onSubmitComplete = jasmine.createSpy('onSubmitComplete');

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit should build props via ApisFormService and set up subscriptions', fakeAsync(() => {
        component.ngOnInit();
        tick();
        expect(mockIbCheckinApisFormService.getApisFormProps).toHaveBeenCalled();
        expect(component.props).toBeDefined();
        expect(component.props.id).toBe('123');
        tick();
        expect(component.props.isBlockForm).toBeFalsy();
    }));

    it('ngOnChanges should merge showTravelDocumentsLink into props', () => {
        const showTravelDocumentsLink: ShowTravelDocumentsLinkType = { showVisa: true, showBasicInfo: false };
        component.props = { id: '1', model: { id: '1' } } as unknown as ApisFormProps;
        component.showTravelDocumentsLink = showTravelDocumentsLink;

        component.ngOnChanges({
            showTravelDocumentsLink: {
                currentValue: showTravelDocumentsLink,
                previousValue: { showVisa: false, showBasicInfo: false },
                isFirstChange: () => false,
                firstChange: false
            }
        });

        expect(component.props.showTravelDocumentsLink).toEqual(showTravelDocumentsLink);
    });

    it('unsubscribe should unsubscribe from checkAllPassengers and reset service data', fakeAsync(() => {
        component.ngOnInit();
        tick();

        // ensure there is a subscription to tear down
        expect(component['subscriptionCheckAllPassengers']).toBeDefined();

        component.unsubscribe();
        tick();

        expect(mockApisService.resetCheckAllPassengersData).toHaveBeenCalled();
    }));

    it('onFormReady should store model in service with passenger id', () => {
        const formRef = { dummy: true } as unknown as FormRefType;
        const model = sampleFormApis;

        component.onFormReady(formRef, model);

        expect(mockApisService.setFormDataApisModel).toHaveBeenCalledWith(model, formRef, basePassenger.id);
    });

    it('onSubmitError should emit submitError with passenger id', () => {
        const emitted: string[] = [];
        component.submitError.subscribe(v => emitted.push(v));

        component.onSubmitError();

        expect(emitted).toEqual([basePassenger.id.toLocaleString()]);
    });

    describe('onSubmitApisForm', () => {
        it('(error w/ constraints) should set DOCUMENTATION, remove from model, show modal, close overlay', fakeAsync(async () => {
            component.isGlobalSubmit = false;
            component.ngOnInit();
            tick();

            // Force a rejection from the service shaped like the catch path expects
            const constraintError = [{ errors: { isEesConstraints: true, message: 'EES constraint' } }];
            (mockApisService.updateApisInfo as jasmine.Spy).and.returnValue(Promise.reject(constraintError));
            mockIbCheckinApisUtilsService.isErrorRelatedToConstraints.and.returnValue(true);

            const removeCalls: string[] = [];
            const passengerStatus: PassengerStatusChangeType[] = [];
            const showModalPayloads: ShowModalCheckinNotAvailableType[] = [];
            const overlayEvents: ApisPassengerState[] = [];

            component.removePassengerFromApisFormModel.subscribe(v => removeCalls.push(v));
            component.passengerStatusChange.subscribe(v => passengerStatus.push(v));
            component.showModalCheckinNotAvailable.subscribe(v => showModalPayloads.push(v));
            //component.updateOverlayStatus.subscribe(v => overlayEvents.push(v));

            // Call and ignore the rejection to let 'finally' run; we need to catch to avoid unhandled promise
            await component.onSubmitApisForm(sampleFormApis);

            tick(); // settle microtasks

            // Status becomes DOCUMENTATION
            expect(passengerStatus[0].status).toBe(ApisPassengerState.DOCUMENTATION);

            // Removal emitted with string id
            expect(removeCalls).toEqual(['123']);

            // Modal emitted with isGlobalSubmit false
            expect(showModalPayloads.length).toBe(1);
            expect(showModalPayloads[0].isGlobalSubmit).toBeFalse();
            expect(showModalPayloads[0].passenger.status).toBe(ApisPassengerState.DOCUMENTATION);

            // Block form for DOCUMENTATION
            expect(component.props.isBlockForm).toBeTrue();
        }));

        it('should call onSubmitComplete function if is globalSubmit', () => {
            component.isGlobalSubmit = true;
            component.passenger.id = '1';

            component.onSubmitApisForm(sampleFormApis);

            expect(component.onSubmitComplete).toHaveBeenCalledWith('1', sampleFormApis);
        });
    });

    it('handleTravelDocumentsModal should emit handleTravelDocumentsModalEvent with stringified id', () => {
        const events: IHandleTravelDocumentsModal[] = [];
        component.handleTravelDocumentsModalEvent.subscribe(v => events.push(v));

        component.handleTravelDocumentsModal(999, ['PSPT'], true);

        expect(events.length).toBe(1);
        expect(events[0]).toEqual({
            passengerId: '999',
            validTypesDocs: ['PSPT'],
            isInfant: true
        });
    });

    it('ngOnDestroy should unsubscribe router events if present', fakeAsync(() => {
        component.ngOnInit();
        tick();

        const spy = spyOn(component['routerSubscription'], 'unsubscribe').and.callThrough();
        component.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
    }));

    describe('updateTravelDocumentsToPassenger', () => {
        it('should do not nothing if documents is empty', () => {
            component.updateTravelDocumentsToPassenger([], false);

            expect(mockIbCheckinApisFormService.updateTravelDocument).not.toHaveBeenCalled();
        });

        it('should update model if contains documents and scroll to passenger', () => {
            const expectedEmit: ScrollToPassenger = { id: 1, section: 'basic-info' };
            const mockDocuments: DocumentModel[] = [{
                id: '1',
                number: '31648646W'
            } as DocumentModel];
            const expectedModel: ModelApisForm = { id: parseInt(mockDocuments[0].id) } as ModelApisForm;

            mockIbCheckinApisFormService.updateTravelDocument.and.returnValue(expectedModel);
            component['formRef'] = { getData: jasmine.createSpy('formRef-getData'), ref: null } as unknown as FormRefType;
            spyOn(component.scrollToPassenger, 'emit');

            component.updateTravelDocumentsToPassenger(mockDocuments, false);

            expect(mockIbCheckinApisFormService.updateTravelDocument).toHaveBeenCalled();
            expect(component.scrollToPassenger.emit).toHaveBeenCalledWith(expectedEmit);
            expect(component.props.model).toEqual(expectedModel);
        });
    });

    it('should call handleTravelDocumentsModal when use openTravelDocumentsModal prop', () => {
        const passengerId = 1;
        const validTypesDocs: TypesDocumentsAccepted[] = ['PSPT'];
        const isInfant = false;

        spyOn(component, 'handleTravelDocumentsModal');

        component.props.openTravelDocumentsModal(passengerId, validTypesDocs, isInfant);

        expect(component.handleTravelDocumentsModal).toHaveBeenCalledWith(passengerId, validTypesDocs, isInfant);
    });

    describe('handleError', () => {
        const mockEmitPassengerStatus: EmitPassengerStatus = {
            id: 1,
            fullName: 'test',
            index: 0,
            status: ApisPassengerState.PENDING
        };

        it('should throw the error if is generic', () => {
            const mockErrors = ['error'];

            expect(() => component.handleError(mockErrors, mockEmitPassengerStatus)).toThrow();
        });

        it('should do not do anything if the error is not array', () => {
            const mockErrors = 'error';

            expect(() => component.handleError(mockErrors, mockEmitPassengerStatus)).not.toThrow();
        });

        it('should call updatePassengerStatusForConstraints if error is related to constraints', () => {
            const mockErrors = 'error';

            mockIbCheckinApisUtilsService.isErrorRelatedToConstraints.and.returnValue(true);
            spyOn(component, 'updatePassengerStatusForConstraints');

            component.handleError(mockErrors, mockEmitPassengerStatus);

            expect(component.updatePassengerStatusForConstraints).toHaveBeenCalledWith(mockErrors, mockEmitPassengerStatus);
        });
    });

    describe('processApiUpdate', () => {
        it('should call updateOverlayStatus.emit when the apis process is OK', fakeAsync(() => {
            spyOn(component.updateOverlayStatus, 'emit');
            mockApisService.updateApisInfo.and.returnValue(Promise.resolve());

            component.processApiUpdate(sampleFormApis);
            tick();

            expect(component.updateOverlayStatus.emit).toHaveBeenCalledWith(ApisPassengerState.PENDING);
            expect(component.updateOverlayStatus.emit).toHaveBeenCalledWith(ApisPassengerState.COMPLETED);
        }));
    });

    describe('initSubscriptions', () => {
        it('should subscribe and update props when checkAllPassengers$ emits', () => {
            const formData = { passenger: 'John' } as FormDataChecksAllPassengers;
            const transformedData = { market: 'es' } as ApisFormProps;

            mockIbCheckinApisFormService.transformerCheckAllPassengers.and.returnValue(transformedData);

            component.initSubscriptions();

            checkAllPassengers$.next(formData);

            expect(mockIbCheckinApisFormService.transformerCheckAllPassengers).toHaveBeenCalledWith(formData, component.props);

            expect(component.props).toEqual(structuredClone(transformedData));
        });

        it('should unsubscribe and re-init subscriptions on NavigationEnd', () => {
            const navEnd = new NavigationEnd(1, '/old', '/new');

            spyOn(component, 'unsubscribe');
            spyOn(component, 'initSubscriptions').and.callThrough();

            component.initSubscriptions();

            router.events.next(navEnd);

            expect(component.unsubscribe).toHaveBeenCalled();
            expect(component.initSubscriptions).toHaveBeenCalledTimes(2);
        });

        it('should update props apisFormErrors with subscriptions', () => {
            const mockError = ['test'];

            spyOn(mockApisService, 'getApisFormErrors').and.returnValue(of(mockError));

            component.initSubscriptions();

            expect(component.props.apisFormErrors).toEqual(mockError);
        });
    });

    describe('updatePassengerStatusForConstraints', () => {
        [
            { errorCase: 'isEtiasConstraints' },
            { errorCase: 'isEesConstraints' }
        ].forEach(({ errorCase }) => {
            it(`should show message if is ${errorCase}`, () => {
                const mockError = { message: 'error', [errorCase]: true };
                const mockEmitPassengerStatus: EmitPassengerStatus = {
                    fullName: 'test',
                    id: 1,
                    index: 0,
                    status: ApisPassengerState.PENDING
                };

                component.updatePassengerStatusForConstraints(mockError, mockEmitPassengerStatus);

                expect(mockEmitPassengerStatus.showMessage).toBe(true);
                expect(mockEmitPassengerStatus.message).toBe(mockError.message);
                expect(mockEmitPassengerStatus.status).toBe(ApisPassengerState.DOCUMENTATION);
            });
        });
    });
});
