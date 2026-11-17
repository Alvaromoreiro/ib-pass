import { TestBed } from '@angular/core/testing';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service-bridge.service';
import { IbTravelDocumentsTransformerService } from '@shared/services/ib-apis/transformers/ib-travel-documents-transformers.service';
import { AJSRootScope } from 'ib-web-commons/utils';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import {
    GetApisFormProps,
    FormDataChecksAllPassengers,
    ApisPassenger
} from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import {
    ApisFormProps
} from 'commercial-management--digital--web-components-design--library';
import { DocumentModel } from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';
import { IbCheckinApisFormService } from './ib-checkin-apis-form.service';
import { IbCheckinApisModelTransformerService } from '@src/app/pages/ib-checkin-apis/transformers/ib-checkin-apis-model-transformer.service';
import { ModelApisForm } from 'commercial-management--digital--web-components-design--library';
import { ApisPassengerState } from '@src/app/core/constants/ib-checkin-apis-constants';
import { currentFormModelMock } from 'test/unit/app/shared/services/ib-apis/mocks/models-mocks';
import { AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service-bridge.service';

type TestWindow = Window & { env?: { licenseDevSDKRegula?: string } };
type ApisItemList = NonNullable<ApisFormProps['listNationalities']>[number];

interface RootScopeMock {
    appMarket: string;
}

describe('IbCheckinApisFormService', () => {
    let service: IbCheckinApisFormService;
    let mockRootScope: RootScopeMock;
    let mockApisModelTransformer: jasmine.SpyObj<IbCheckinApisModelTransformerService>;
    let mockSessionStorage: jasmine.SpyObj<CommonsSessionStorageService>;
    let mockDatalayerUtils: jasmine.SpyObj<AJSDatalayerUtilsServiceType>;
    let mockTravelDocumentsTransformer: jasmine.SpyObj<IbTravelDocumentsTransformerService>;

    beforeEach(() => {
        mockRootScope = { appMarket: 'ES' };
        mockApisModelTransformer = jasmine.createSpyObj('IbCheckinApisModelTransformerService', [
            'setApisFormModel'
        ]);
        mockSessionStorage = jasmine.createSpyObj('CommonsSessionStorageService', ['get']);
        mockDatalayerUtils = jasmine.createSpyObj<AJSDatalayerUtilsServiceType>('AJSDatalayerUtilsService', ['updateDatalayerEvent']);
        mockTravelDocumentsTransformer = jasmine.createSpyObj('IbTravelDocumentsTransformerService', [
            'updateTravelDocumentTransform'
        ]);

        TestBed.configureTestingModule({
            providers: [
                IbCheckinApisFormService,
                { provide: AJSRootScope, useValue: mockRootScope },
                { provide: IbCheckinApisModelTransformerService, useValue: mockApisModelTransformer },
                { provide: CommonsSessionStorageService, useValue: mockSessionStorage },
                { provide: AJSDatalayerUtilsService, useValue: mockDatalayerUtils },
                { provide: IbTravelDocumentsTransformerService, useValue: mockTravelDocumentsTransformer }
            ]
        });

        service = TestBed.inject(IbCheckinApisFormService);
    });

    afterEach(() => {
        (window as TestWindow).env = undefined;
    });

    describe('Service Initialization', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });
    });

    describe('getApisFormProps()', () => {
        let mockApisInfo: ReturnType<typeof createMockApisInfo>;
        let mockEnv: NonNullable<TestWindow['env']>;
        let mockModel: ModelApisForm;

        beforeEach(() => {
            mockApisInfo = createMockApisInfo();
            mockModel = createMockApisFormModel();
            mockEnv = { licenseDevSDKRegula: 'test-license-key' };

            (window as TestWindow).env = mockEnv;
            mockSessionStorage.get.and.returnValue(mockApisInfo);
            mockApisModelTransformer.setApisFormModel.and.returnValue(mockModel);
        });

        it('should return ApisFormProps with correct structure', () => {
            const props: GetApisFormProps = createMockGetApisFormProps();
            const result: ApisFormProps = service.getApisFormProps(props);

            expect(result).toBeDefined();
            expect(result.id).toBe('1');
            expect(result.listNationalities).toEqual(mockApisInfo.countries);
            expect(result.listCountries).toEqual(mockApisInfo.countries);
            expect(result.countryCodes).toEqual(mockApisInfo.prefixList);
            expect(result.listStates).toEqual(mockApisInfo.states);
        });

        it('should retrieve APIS info from session storage', () => {
            const props: GetApisFormProps = createMockGetApisFormProps();
            service.getApisFormProps(props);

            expect(mockSessionStorage.get).toHaveBeenCalledWith(
                CheckinAppConstants.STORAGE_KEYS.APIS_INFO
            );
        });

        it('should set market from $rootScope', () => {
            const props: GetApisFormProps = createMockGetApisFormProps();
            const result: ApisFormProps = service.getApisFormProps(props);

            expect(result.market).toBe('ES');
        });

        it('should transform passenger model using ApisModelTransformerService', () => {
            const props: GetApisFormProps = createMockGetApisFormProps();
            const result: ApisFormProps = service.getApisFormProps(props);

            expect(mockApisModelTransformer.setApisFormModel).toHaveBeenCalledWith(props.passenger);
            expect(result.model).toEqual(mockModel);
        });

        it('should pass callbacks correctly', () => {
            const props: GetApisFormProps = createMockGetApisFormProps();
            const result: ApisFormProps = service.getApisFormProps(props);

            expect(result.onSubmit).toBe(props.onSubmitApisForm);
            expect(result.onFormReady).toBe(props.onFormReady);
            expect(result.onSubmitError).toBe(props.onSubmitError);
            expect(result.openTravelDocumentsModal).toBe(props.openTravelDocumentsModal);
        });

        it('should set isMultiPassengers flag', () => {
            const props: GetApisFormProps = createMockGetApisFormProps();
            props.isMultiPassengers = true;
            const result: ApisFormProps = service.getApisFormProps(props);

            expect(result.isMultiPassengers).toBe(true);
        });

        it('should set OCR license from environment', () => {
            const props: GetApisFormProps = createMockGetApisFormProps();
            const result: ApisFormProps = service.getApisFormProps(props);

            expect(result.ocrLicense).toBe('test-license-key');
        });

        it('should set OCR license as undefined when not in environment', () => {
            (window as TestWindow).env = {};
            const props: GetApisFormProps = createMockGetApisFormProps();
            const result: ApisFormProps = service.getApisFormProps(props);

            expect(result.ocrLicense).toBeUndefined();
        });

        it('should set toggleOcrEnable from constants', () => {
            const props: GetApisFormProps = createMockGetApisFormProps();
            const result: ApisFormProps = service.getApisFormProps(props);

            expect(result.toggleOcrEnable).toBe(CheckinAppConstants.TOGGLE.ocrEnable);
        });

        it('should handle missing APIS info gracefully', () => {
            mockSessionStorage.get.and.returnValue(null);
            const props: GetApisFormProps = createMockGetApisFormProps();
            const result: ApisFormProps = service.getApisFormProps(props);

            expect(result.listNationalities).toEqual([]);
            expect(result.listCountries).toEqual([]);
            expect(result.countryCodes).toEqual([]);
            expect(result.listStates).toEqual([]);
        });

        it('should pass datalayer service correctly', () => {
            const props: GetApisFormProps = createMockGetApisFormProps();
            const result: ApisFormProps = service.getApisFormProps(props);

            expect(result.updateDatalayerEvent).toBe(mockDatalayerUtils.updateDatalayerEvent);
        });
    });

    describe('transformerCheckAllPassengers()', () => {
        let mockProps: ApisFormProps;
        let mockFormData: FormDataChecksAllPassengers;

        beforeEach(() => {
            mockFormData = createMockFormData();
            mockProps = {
                id: '1',
                model: createMockApisFormModel()
            } as ApisFormProps;
        });

        it('should return props unchanged when model is undefined', () => {
            const propsWithoutModel: ApisFormProps = { id: '1' } as ApisFormProps;
            const result: ApisFormProps = service.transformerCheckAllPassengers(mockFormData, propsWithoutModel);

            expect(result).toEqual(propsWithoutModel);
        });

        it('should return props unchanged when model is null', () => {
            const propsWithNullModel: ApisFormProps = { id: '1', model: null } as ApisFormProps;
            const result: ApisFormProps = service.transformerCheckAllPassengers(mockFormData, propsWithNullModel);

            expect(result).toEqual(propsWithNullModel);
        });

        it('should update contact data with additional info', () => {
            const result: ApisFormProps = service.transformerCheckAllPassengers(mockFormData, mockProps);

            expect(result.model.contactData.additionalInfo.checkInfoAll).toBe(true);
            expect(result.model.contactData.additionalInfo.email.value).toBe('test@test.com');
            expect(result.model.contactData.additionalInfo.phone.value).toBe('+34123456789');
            expect(result.model.contactData.additionalInfo.number.value).toBe('123456789');
        });

        it('should update contact data with emergency info', () => {
            const result: ApisFormProps = service.transformerCheckAllPassengers(mockFormData, mockProps);

            expect(result.model.contactData.emergencyInfo.checkEmergencyAll).toBe(true);
            expect(result.model.contactData.emergencyInfo.name.value).toBe('Emergency Contact');
            expect(result.model.contactData.emergencyInfo.phone.value).toBe('+34987654321');
            expect(result.model.contactData.emergencyInfo.number.value).toBe('987654321');
        });

        it('should update passenger address', () => {
            const result: ApisFormProps = service.transformerCheckAllPassengers(mockFormData, mockProps);

            expect(result.model.passengerAddress.checkAddressForAll).toBe(true);
            expect(result.model.passengerAddress.address.value).toBe('Test Street 123');
            expect(result.model.passengerAddress.zipCode.value).toBe('28001');
            expect(result.model.passengerAddress.city.value).toBe('Madrid');
            expect(result.model.passengerAddress.state.value).toBe('MD');
        });

        const contactDataCases = [
            {
                title: 'should not update additional info when not provided', obj: { ...mockFormData, additionalInfo: undefined }, expectKey: ['additionalInfo', 'checkInfoAll']
            },
            {
                title: 'should not update emergency info when not provided', obj: { ...mockFormData, emergencyInfo: undefined }, expectKey: ['emergencyInfo', 'checkEmergencyAll']
            }
        ];

        contactDataCases.forEach(({ title, obj, expectKey }) => {
            it(title, () => {
                const result: ApisFormProps = service.transformerCheckAllPassengers(obj, mockProps);

                expect(result.model.contactData[expectKey[0]][expectKey[1]]).toBe(false);
            });
        });

        it('should not update passenger address when not provided', () => {
            const formDataWithoutAddress: FormDataChecksAllPassengers = {
                ...mockFormData,
                passengerAddress: undefined
            };
            const originalAddress = { ...mockProps.model.passengerAddress };
            const result: ApisFormProps = service.transformerCheckAllPassengers(
                formDataWithoutAddress,
                mockProps
            );

            expect(result.model.passengerAddress).toEqual(originalAddress);
        });

        it('should handle partial form data updates', () => {
            const partialFormData: FormDataChecksAllPassengers = {
                additionalInfo: mockFormData.additionalInfo,
                emergencyInfo: undefined,
                passengerAddress: undefined
            };
            const result: ApisFormProps = service.transformerCheckAllPassengers(partialFormData, mockProps);

            expect(result.model.contactData.additionalInfo.checkInfoAll).toBe(true);
            expect(result.model.contactData.emergencyInfo.checkEmergencyAll).toBe(false);
            expect(result.model.passengerAddress.checkAddressForAll).toBe(false);
        });
    });

    describe('updateTravelDocument()', () => {
        let mockModel: ModelApisForm;
        let mockDocuments: DocumentModel[];
        let mockUpdatedModel: ModelApisForm;
        beforeEach(() => {
            mockModel = createMockApisFormModel();
            mockDocuments = [
                {
                    documentType: 'PASSPORT',
                    documentNumber: 'AB123456'
                } as unknown as DocumentModel
            ];
            mockUpdatedModel = { ...mockModel };

            mockTravelDocumentsTransformer.updateTravelDocumentTransform.and.returnValue(mockUpdatedModel);
        });

        [
            { title: 'should call transformer service with correct parameters', isInfant: false },
            { title: 'should handle infant flag correctly', isInfant: true }
        ].forEach(({ title, isInfant }) => {
            it(title, () => {
                service.updateTravelDocument(mockModel, mockDocuments, isInfant, currentFormModelMock);

                expect(mockTravelDocumentsTransformer.updateTravelDocumentTransform).toHaveBeenCalledWith(
                    mockModel,
                    mockDocuments,
                    isInfant,
                    currentFormModelMock
                );
            });
        });

        it('should return updated model from transformer', () => {
            const result: ModelApisForm | null = service.updateTravelDocument(
                mockModel,
                mockDocuments,
                false,
                currentFormModelMock
            );

            expect(result).toEqual(mockUpdatedModel);
        });

        it('should handle empty documents array', () => {
            const emptyDocuments: DocumentModel[] = [];
            const result: ModelApisForm | null = service.updateTravelDocument(
                mockModel,
                emptyDocuments,
                false,
                currentFormModelMock
            );

            expect(mockTravelDocumentsTransformer.updateTravelDocumentTransform).toHaveBeenCalledWith(
                mockModel,
                emptyDocuments,
                false,
                currentFormModelMock
            );
            expect(result).toEqual(mockUpdatedModel);
        });

        it('should handle multiple documents', () => {
            const multipleDocuments: DocumentModel[] = [
                { documentType: 'PASSPORT', documentNumber: 'AB123456' } as unknown as DocumentModel,
                { documentType: 'ID_CARD', documentNumber: 'CD789012' } as unknown as DocumentModel
            ];

            service.updateTravelDocument(mockModel, multipleDocuments, false, currentFormModelMock);

            expect(mockTravelDocumentsTransformer.updateTravelDocumentTransform).toHaveBeenCalledWith(
                mockModel,
                multipleDocuments,
                false,
                currentFormModelMock
            );
        });

        it('should return null when transformer returns null', () => {
            mockTravelDocumentsTransformer.updateTravelDocumentTransform.and.returnValue(null);

            const result: ModelApisForm | null = service.updateTravelDocument(
                mockModel,
                mockDocuments,
                false,
                currentFormModelMock
            );

            expect(result).toBeNull();
        });
    });

    describe('Error Handling', () => {
        it('should handle window.env being undefined', () => {
            (window as TestWindow).env = undefined;
            mockSessionStorage.get.and.returnValue(createMockApisInfo());
            mockApisModelTransformer.setApisFormModel.and.returnValue(createMockApisFormModel());

            const props: GetApisFormProps = createMockGetApisFormProps();
            const result: ApisFormProps = service.getApisFormProps(props);

            expect(result.ocrLicense).toBeUndefined();
        });

        it('should handle passenger with id 0', () => {
            const passenger = createMockPassenger(0);
            const props: GetApisFormProps = {
                ...createMockGetApisFormProps(),
                passenger
            };

            mockSessionStorage.get.and.returnValue(createMockApisInfo());
            mockApisModelTransformer.setApisFormModel.and.returnValue(createMockApisFormModel());

            const result: ApisFormProps = service.getApisFormProps(props);

            expect(result.id).toBe('0');
        });

        it('should handle large passenger id numbers', () => {
            const passenger = createMockPassenger(999999999);
            const props: GetApisFormProps = {
                ...createMockGetApisFormProps(),
                passenger
            };

            mockSessionStorage.get.and.returnValue(createMockApisInfo());
            mockApisModelTransformer.setApisFormModel.and.returnValue(createMockApisFormModel());

            const result: ApisFormProps = service.getApisFormProps(props);

            expect(result.id).toBe('999999999');
        });
    });
});

// ========================================
// Functions mocks
// ========================================

const createMockPassenger = (id: number = 1): ApisPassenger => ({
    id,
    name: 'John Doe',
    surname: 'Doe',
    additionalInfo: undefined,
    formStatus: ApisPassengerState.COMPLETED,
    passengerBookingInfo: undefined,
    gender: '',
    birthDate: '',
    inTransit: false,
    emergencyContact: undefined,
    nationality: '',
    documents: []
});

const createMockApisInfo = () => ({
    countries: [{ code: 'ES', description: 'Spain' } as ApisItemList],
    prefixList: [{ code: '+34', description: 'Spain' } as ApisItemList, { code: '+1', description: 'United States' } as ApisItemList],
    states: [{ code: 'MD', description: 'Madrid' } as ApisItemList]
});

const createMockApisFormModel = (): ModelApisForm => ({
    contactData: {
        additionalInfo: {
            checkInfoAll: false,
            email: { value: '', error: '' },
            phone: { value: '', error: '' },
            number: { value: '', error: '' }
        },
        emergencyInfo: {
            checkEmergencyAll: false,
            name: { value: '', error: '' },
            phone: { value: '', error: '' },
            number: { value: '', error: '' }
        }
    },
    passengerAddress: {
        checkAddressForAll: false,
        address: { value: '', error: '' },
        zipCode: { value: '', error: '' },
        city: { value: '', error: '' },
        state: { value: '', error: '' }
    }
} as unknown as ModelApisForm);

const createMockFormData = (): FormDataChecksAllPassengers => ({
    additionalInfo: {
        email: 'test@test.com',
        phone: {
            value: '+34123456789',
            label: ''
        },
        number: '123456789',
        checkInfoAll: false
    },
    emergencyInfo: {
        name: 'Emergency Contact',
        phone: {
            value: '+34987654321',
            label: ''
        },
        number: '987654321',
        checkEmergencyAll: false
    },
    passengerAddress: {
        address: 'Test Street 123',
        zipCode: '28001',
        city: 'Madrid',
        state: {
            value: 'MD',
            label: ''
        }
    }
});

const createMockGetApisFormProps = (): GetApisFormProps => ({
    passenger: createMockPassenger(),
    onSubmitApisForm: jasmine.createSpy('onSubmitApisForm'),
    isMultiPassengers: false,
    onFormReady: jasmine.createSpy('onFormReady'),
    onSubmitError: jasmine.createSpy('onSubmitError'),
    openTravelDocumentsModal: jasmine.createSpy('openTravelDocumentsModal')
});