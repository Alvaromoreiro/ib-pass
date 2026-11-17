import { TestBed } from '@angular/core/testing';
import {
    DocumentModel,
    TypeCodeCanonicalValid
} from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';
import { UpdateApisInfoModel } from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import { IUpdateTravelDocumentsBulk } from '@src/app/core/models/travel-documents/travel-documents-model';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { IbCheckinApisUtilsService } from './ib-checkin-apis-utils-services';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { PassengerStorageKey } from '@src/app/core/constants/ib-storage-keys.constants';

describe('IbCheckinApisUtilsService', () => {
    let service: IbCheckinApisUtilsService;
    let sessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;

    const createDocumentModel = (overrides: Partial<DocumentModel> = {}): DocumentModel => ({
        id: '05|ABC123|US',
        typeCode: '05' as TypeCodeCanonicalValid,
        typeDescription: 'Passport',
        countryCode: 'US',
        number: 'ABC123',
        expiryDate: '2035-12-31',
        isExpired: false,
        issues: [],
        iconFlag: 'https://example.com/flags/us.svg',
        ...overrides
    });

    type UpdateApisInfoFormDataFixture = Pick<UpdateApisInfoModel['formData'], 'documentationRequired'> & {
        infant?: Pick<NonNullable<UpdateApisInfoModel['formData']['infant']>, 'documentationRequired'>;
    };
    type UpdateApisInfoOverrides = Omit<Partial<UpdateApisInfoModel>, 'formData'> & {
        formData?: UpdateApisInfoFormDataFixture;
    };

    const createUpdateApisInfoModel = (overrides: UpdateApisInfoOverrides = {}): UpdateApisInfoModel => ({
        formData: {
            documentationRequired: {
                mandatory: {
                    type: { value: 'PSPT', label: 'Passport' },
                    issuerCountry: { value: 'US', label: 'United States' },
                    number: 'ABC123',
                    expiryDate: '2035-12-31'
                }
            }
        },
        ...overrides
    } as UpdateApisInfoModel);

    const createBulkUpdateResult = (status: boolean): IUpdateTravelDocumentsBulk => ({
        status,
        message: status ? 'Success' : 'Failed'
    } as IUpdateTravelDocumentsBulk);

    const getStandardUserDocument = (): DocumentModel =>
        createDocumentModel({ id: '05|ABC123|US' });

    const getModifiedUserDocument = (): DocumentModel =>
        createDocumentModel({
            id: '05|ABC123|US',
            expiryDate: '2024-12-31'
        });

    const getSecondaryDocument = (): UpdateApisInfoModel =>
        createUpdateApisInfoModel({
            formData: {
                documentationRequired: {
                    mandatory: {
                        type: { value: 'PSPT', label: 'Passport' },
                        issuerCountry: { value: 'GB', label: 'United Kingdom' },
                        number: 'XYZ789',
                        expiryDate: '2036-06-30'
                    }
                }
            }
        });

    const getSpanishIdDocument = (): UpdateApisInfoModel =>
        createUpdateApisInfoModel({
            formData: {
                documentationRequired: {
                    mandatory: {
                        type: { value: 'DNI', label: 'DNI' },
                        issuerCountry: { value: 'ES', label: 'España' },
                        number: '25125485H',
                        expiryDate: '2027-03-15'
                    }
                }
            }
        });

    const expectDocumentUpdate = (
        result: DocumentModel[],
        expectedLength: number,
        shouldContainPost: boolean
    ): void => {
        expect(result.length).toBe(expectedLength);
        if (expectedLength > 0) {
            if (shouldContainPost) {
                expect(result[0].id).toContain('POST-');
            } else {
                expect(result[0].id).not.toContain('POST-');
            }
        }
    };

    const expectDocumentArrayLength = (
        result: DocumentModel[],
        comparison: 'greaterThan' | 'lessThanOrEqual' | 'equal',
        value: number
    ): void => {
        switch (comparison) {
            case 'greaterThan':
                expect(result.length).toBeGreaterThan(value);
                break;
            case 'lessThanOrEqual':
                expect(result.length).toBeLessThanOrEqual(value);
                break;
            case 'equal':
                expect(result.length).toBe(value);
                break;
        }
    };

    const executeCheckUpdateTest = (
        modelData: UpdateApisInfoModel[],
        userDocuments: DocumentModel[]
    ): DocumentModel[] => {
        return service.checkUpdateTravelDocuments(modelData, userDocuments);
    };

    const executeDocumentMappingTest = (
        docs: DocumentModel[],
        documentsSave: DocumentModel[]
    ): DocumentModel[] => {
        return service.toDocumentModelsData(docs, documentsSave);
    };

    beforeEach(() => {
        sessionStorageService = jasmine.createSpyObj<CommonsSessionStorageService>(
            'CommonsSessionStorageService',
            ['get', 'set']
        );
        TestBed.configureTestingModule({
            providers: [
                IbCheckinApisUtilsService,
                { provide: CommonsSessionStorageService, useValue: sessionStorageService }
            ]
        });
        service = TestBed.inject(IbCheckinApisUtilsService);
    });

    describe('Service Initialization', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should be a singleton instance', () => {
            const service2 = TestBed.inject(IbCheckinApisUtilsService);
            expect(service).toBe(service2);
        });
    });

    describe('checkUpdateTravelDocuments', () => {
        it('should return POST documents when user has no matching documents', () => {
            const result = executeCheckUpdateTest(
                [createUpdateApisInfoModel()],
                []
            );

            expectDocumentUpdate(result, 1, true);
        });

        it('should return PUT documents when user has matching but different documents', () => {
            const result = executeCheckUpdateTest(
                [createUpdateApisInfoModel()],
                [getModifiedUserDocument()]
            );

            expectDocumentUpdate(result, 1, false);
            expect(result[0].id).toBe('05|ABC123|US');
        });

        it('should return empty array when documents are equivalent', () => {
            const result = executeCheckUpdateTest(
                [createUpdateApisInfoModel()],
                [getStandardUserDocument()]
            );

            expectDocumentUpdate(result, 0, false);
        });

        it('should handle multiple documents correctly', () => {
            const result = executeCheckUpdateTest(
                [createUpdateApisInfoModel(), getSecondaryDocument()],
                [getStandardUserDocument()]
            );

            expectDocumentArrayLength(result, 'greaterThan', 0);
        });

        it('should filter out null values correctly', () => {
            const result = executeCheckUpdateTest(
                [createUpdateApisInfoModel(), createUpdateApisInfoModel()],
                [getStandardUserDocument()]
            );

            expect(result.every(doc => doc !== null)).toBe(true);
        });
    });

    describe('getDocumentsForModel', () => {
        it('should convert UpdateApisInfoModel to DocumentModel array', () => {
            const result = service.getDocumentsForModel([createUpdateApisInfoModel()]);

            expect(result.length).toBe(1);
            expect(result[0]).toEqual({
                'id': '05|ABC123|US',
                'typeCode': '05',
                'typeDescription': 'PASSPORT',
                'countryCode': 'US',
                'number': 'ABC123',
                'expiryDate': '2035-12-31',
                'isExpired': false,
                'issues': [],
                'iconFlag': '/iberia-web-content/iconos/circle_flags/us.svg'
            });
        });

        it('should filter out expired documents', () => {
            const expiredModel = createUpdateApisInfoModel({
                formData: {
                    documentationRequired: {
                        mandatory: {
                            type: { value: 'PSPT', label: 'Passport' },
                            issuerCountry: { value: 'US', label: 'United States' },
                            number: 'EXPIRED123',
                            expiryDate: '2020-01-01'
                        }
                    }
                }
            });

            const result = service.getDocumentsForModel([expiredModel]);

            expect(result.every(doc => !doc.isExpired)).toBe(true);
        });

        it('should handle multiple documents with different types', () => {
            const result = service.getDocumentsForModel([
                createUpdateApisInfoModel(),
                getSpanishIdDocument()
            ]);

            expectDocumentArrayLength(result, 'greaterThan', 0);
        });

        it('should generate correct document IDs', () => {
            const result = service.getDocumentsForModel([createUpdateApisInfoModel()]);

            expect(result[0].id).toMatch(/^[0-9]+\|[A-Z0-9]+\|[A-Z]{2}$/);
        });

        it('should set iconFlag correctly', () => {
            const result = service.getDocumentsForModel([createUpdateApisInfoModel()]);

            expect(result[0].iconFlag).toContain('us.svg');
        });

        it('should save the infant document', () => {
            const infantModel: UpdateApisInfoModel = {
                id: '1',
                formData: {
                    personalData: {
                        name: '',
                        surname: '',
                        birthDate: '',
                        nationality: { value: 'US', label: 'United States' },
                        country: { value: 'US', label: 'United States' },
                        gender: ''
                    },
                    contactData: {
                        additionalInfo: {
                            email: '', phone: { value: '', label: '' }, number: '', checkInfoAll: false
                        },
                        emergencyInfo: {
                            phone: { value: '', label: '' }, number: '', name: '', checkEmergencyAll: false
                        }
                    },
                    checkbox: {
                        notSendNewsletter: false,
                        usPrivacyEmergencyData: false,
                        confirmEmergencyData: false
                    },
                    documentationRequired: {
                        mandatory: {
                            type: { value: 'PSPT', label: 'Passport' },
                            issuerCountry: { value: 'US', label: 'United States' },
                            number: 'ABC123',
                            expiryDate: '2035-12-31'
                        }
                    },
                    infant: {
                        personalData: {
                            name: '',
                            surname: '',
                            birthDate: '',
                            nationality: { value: 'US', label: 'United States' },
                            country: { value: 'US', label: 'United States' },
                            gender: ''
                        },
                        documentationRequired: {
                            mandatory: {
                                type: { value: 'PSPT', label: 'Passport' },
                                issuerCountry: { value: 'US', label: 'United States' },
                                number: 'infant',
                                expiryDate: '2035-12-31'
                            }
                        }
                    }
                }
            };

            const result = service.getDocumentsForModel([infantModel]);

            expect(result.length).toBe(2);
            expect(result[0].number).toContain('infant');
        });
    });

    describe('toDocumentModelsData', () => {
        const createDocumentPair = () => ({
            docs: [
                createDocumentModel({ id: '0' }),
                createDocumentModel({ id: '05|XYZ789|US', number: 'XYZ789' })
            ],
            documentsSave: [
                createDocumentModel(),
                createDocumentModel({ number: 'XYZ789' })
            ]
        });

        it('should map documents correctly when keys match', () => {
            const { docs, documentsSave } = createDocumentPair();
            const result = executeDocumentMappingTest(docs, documentsSave);

            expectDocumentArrayLength(result, 'equal', 0);
        });

        it('should filter out non-matching documents', () => {
            const docs = [createDocumentModel({ id: '0' })];
            const documentsSave = [
                createDocumentModel(),
                createDocumentModel({ number: 'NOMATCH' })
            ];

            const result = executeDocumentMappingTest(docs, documentsSave);

            expectDocumentArrayLength(result, 'lessThanOrEqual', documentsSave.length);
        });

        it('should return empty array when no documents match', () => {
            const result = executeDocumentMappingTest([], [createDocumentModel()]);

            expectDocumentArrayLength(result, 'equal', 0);
        });

        it('should handle empty input arrays', () => {
            const result = executeDocumentMappingTest([], []);

            expect(result).toEqual([]);
        });
    });

    describe('normalizeNameflags', () => {
        const testCases: Array<{ input: string | undefined | null; expected: string; description: string }> = [
            { input: 'US', expected: 'us', description: 'uppercase ISO-2' },
            { input: 'GB', expected: 'gb', description: 'uppercase ISO-2' },
            { input: 'fr', expected: 'fr', description: 'lowercase ISO-2' },
            { input: 'USA', expected: '', description: 'ISO-3 code' },
            { input: 'U', expected: '', description: 'too short' },
            { input: '', expected: '', description: 'empty string' },
            { input: undefined, expected: '', description: 'undefined' },
            { input: null, expected: '', description: 'null' },
            { input: ' US ', expected: 'us', description: 'with whitespace' },
            { input: '  GB  ', expected: 'gb', description: 'with multiple spaces' },
            { input: 'U$', expected: 'u$', description: 'special characters (2 chars)' },
            { input: 'U-S', expected: '', description: 'special characters (3 chars)' }
        ];

        testCases.forEach(({ input, expected, description }) => {
            it(`should handle ${description}`, () => {
                expect(service.normalizeNameflags(input)).toBe(expected);
            });
        });
    });

    describe('iconsCandidates', () => {
        const baseUrl = CheckinAppConstants.iconsFlags;

        const iconTestCases: Array<{ input: string | undefined; expectedSuffix: string; description: string }> = [
            { input: 'US', expectedSuffix: 'us.svg', description: 'valid uppercase code' },
            { input: 'INVALID', expectedSuffix: 'unknown.svg', description: 'invalid code' },
            { input: undefined, expectedSuffix: 'unknown.svg', description: 'undefined' },
            { input: '', expectedSuffix: 'unknown.svg', description: 'empty string' },
            { input: 'gb', expectedSuffix: 'gb.svg', description: 'lowercase code' },
            { input: 'Fr', expectedSuffix: 'fr.svg', description: 'mixed case code' }
        ];

        iconTestCases.forEach(({ input, expectedSuffix, description }) => {
            it(`should return correct icon for ${description}`, () => {
                const result = service.iconsCandidates(input);
                expect(result).toBe(`${baseUrl}/${expectedSuffix}`);
            });
        });
    });

    describe('evaluateStatus', () => {
        const statusTestCases: Array<{
            input: IUpdateTravelDocumentsBulk | IUpdateTravelDocumentsBulk[] | undefined | null;
            expected: boolean;
            description: string;
        }> = [
            { input: createBulkUpdateResult(true), expected: true, description: 'single true status' },
            { input: createBulkUpdateResult(false), expected: false, description: 'single false status' },
            {
                input: [createBulkUpdateResult(false), createBulkUpdateResult(true), createBulkUpdateResult(false)],
                expected: true,
                description: 'array with at least one true'
            },
            {
                input: [createBulkUpdateResult(false), createBulkUpdateResult(false)],
                expected: false,
                description: 'array with only false'
            },
            { input: [], expected: false, description: 'empty array' },
            { input: undefined, expected: false, description: 'undefined' },
            { input: null, expected: false, description: 'null' }
        ];

        statusTestCases.forEach(({ input, expected, description }) => {
            it(`should return ${expected} for ${description}`, () => {
                expect(service.evaluateStatus(input as Parameters<typeof service.evaluateStatus>[0])).toBe(expected);
            });
        });
    });

    describe('toComparableDocument', () => {
        it('should extract only comparable fields from DocumentModel', () => {
            const result = service.toComparableDocument(createDocumentModel());

            expect(result).toEqual({
                typeCode: '05',
                countryCode: 'US',
                number: 'ABC123',
                expiryDate: '2035-12-31'
            });
        });

        it('should handle undefined optional fields', () => {
            const document = createDocumentModel({
                countryCode: undefined,
                expiryDate: undefined
            });

            const result = service.toComparableDocument(document);

            expect(result.countryCode).toBeUndefined();
            expect(result.expiryDate).toBeUndefined();
        });

        it('should preserve all required comparable fields', () => {
            const document = createDocumentModel({
                typeCode: '05' as TypeCodeCanonicalValid,
                number: 'TEST123',
                countryCode: 'FR',
                expiryDate: '2030-01-01'
            });

            const result = service.toComparableDocument(document);

            expect(result).toEqual({
                typeCode: '05',
                number: 'TEST123',
                countryCode: 'FR',
                expiryDate: '2030-01-01'
            });
        });
    });

    describe('Integration Tests', () => {
        it('should handle complete workflow: model to documents to comparison', () => {
            const modelData = [createUpdateApisInfoModel()];
            const documents = service.getDocumentsForModel(modelData);
            const updates = executeCheckUpdateTest(modelData, []);

            expect(documents.length).toBeGreaterThan(0);
            expectDocumentUpdate(updates, 1, true);
        });

        it('should correctly identify documents needing updates', () => {
            const updates = executeCheckUpdateTest(
                [createUpdateApisInfoModel()],
                [getModifiedUserDocument()]
            );

            expectDocumentUpdate(updates, 1, false);
        });

        it('should handle bulk status evaluation correctly', () => {
            const successResults = [createBulkUpdateResult(true), createBulkUpdateResult(true)];
            const mixedResults = [createBulkUpdateResult(false), createBulkUpdateResult(true)];

            expect(service.evaluateStatus(successResults)).toBe(true);
            expect(service.evaluateStatus(mixedResults)).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        it('should handle documents with special characters in numbers', () => {
            const comparable = service.toComparableDocument(
                createDocumentModel({ number: 'ABC-123/456' })
            );

            expect(comparable.number).toBe('ABC-123/456');
        });

        it('should handle very long document numbers', () => {
            const longNumber = 'A'.repeat(100);
            const comparable = service.toComparableDocument(
                createDocumentModel({ number: longNumber })
            );

            expect(comparable.number).toBe(longNumber);
        });

        it('should handle country codes with numbers (edge case)', () => {
            expect(service.normalizeNameflags('U2')).toBe('u2');
        });

        it('should handle empty model array gracefully', () => {
            expect(service.getDocumentsForModel([])).toEqual([]);
        });

        it('should handle documents with missing optional fields', () => {
            const iconFlag = service.iconsCandidates(
                createDocumentModel({ countryCode: undefined }).countryCode
            );

            expect(iconFlag).toContain('unknown.svg');
        });
    });

    describe('isErrorRelatedToConstraints', () => {
        it('should return undefined if error is an array', () => {
            const errorMock = [];

            expect(service.isErrorRelatedToConstraints(errorMock)).toBe(undefined);
        });

        it('should return false if all the constraints is false', () => {
            const errorMock = {
                isEstaConstraints: false,
                isEesConstraints: false,
                isEtiasConstraints: false,
                isSeeAgent: false
            };

            expect(service.isErrorRelatedToConstraints(errorMock)).toBe(false);
        });

        it('should return true if any of the constraints is true', () => {
            const errorMock = {
                isEstaConstraints: true,
                isEesConstraints: false,
                isEtiasConstraints: false,
                isSeeAgent: false
            };

            expect(service.isErrorRelatedToConstraints(errorMock)).toBe(true);
        });
    });


    describe('updatePassengersSelected', () => {
            it('should merge NOAPIS and selected passengers without duplicates', () => {
                sessionStorageService.get
                    .withArgs(PassengerStorageKey.passengersNOAPIS)
                    .and.returnValue([1, 2]);

                const result = service.updatePassengersSelected([2, 3, 4]);

                expect(result).toEqual([1, 2, 3, 4]);
                expect(sessionStorageService.set).toHaveBeenCalledWith(
                    PassengerStorageKey.passengersSelected,
                    [1, 2, 3, 4]
                );
            });

            it('should use an empty array when no selected passengers are provided', () => {
                sessionStorageService.get
                    .withArgs(PassengerStorageKey.passengersNOAPIS)
                    .and.returnValue([10]);

                const result = service.updatePassengersSelected();

                expect(result).toEqual([10]);
                expect(sessionStorageService.set).toHaveBeenCalledWith(
                    PassengerStorageKey.passengersSelected,
                    [10]
                );
            });
        });

        describe('getPassegersNOAPIS', () => {
            it('should return the stored passengers without APIS', () => {
                sessionStorageService.get
                    .withArgs(PassengerStorageKey.passengersNOAPIS)
                    .and.returnValue([1, 5]);

                expect(service.getPassegersNOAPIS()).toEqual([1, 5]);
            });

            it('should return an empty array when no passengers are stored', () => {
                sessionStorageService.get
                    .withArgs(PassengerStorageKey.passengersNOAPIS)
                    .and.returnValue(null);

                expect(service.getPassegersNOAPIS()).toEqual([]);
            });
        });


});