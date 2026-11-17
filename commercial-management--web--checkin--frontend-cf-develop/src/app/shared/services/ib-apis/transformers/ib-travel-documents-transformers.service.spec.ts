import { TestBed } from '@angular/core/testing';
import { DocumentModel } from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';
import {
    IbTravelDocumentsTransformerService,
    CountryItem
} from './ib-travel-documents-transformers.service';
import { DocumentObject, FormDataApis, ModelApisForm, TypesOCR } from 'commercial-management--digital--web-components-design--library';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { currentFormModelInfantMock, currentFormModelMock } from '@test/unit/app/shared/services/ib-apis/mocks/models-mocks';

// ---------- Helpers ----------
const makeModel = (isInfant?: boolean): ModelApisForm => ({
    documentationRequired: { mandatory: [], other: [] },
    personalData: {
        name: { value: '', required: false },
        surname: { value: '', required: false },
        birthDate: { value: '', required: false },
        gender: { value: '', required: false },
        nationality: { value: '', required: false },
        country: { value: '', required: false }
    },
    id: 0,
    typePassenger: 'ADULT',
    contactData: {
        additionalInfo: {
            email: { value: '', required: false, disabled: false },
            phone: { value: '', required: false, disabled: false },
            number: { value: '', required: false, disabled: false },
            checkInfoAll: false
        },
        emergencyInfo: {
            phone: { value: '', required: false, disabled: false },
            number: { value: '', required: false, disabled: false },
            name: { value: '', required: false, disabled: false },
            checkEmergencyAll: false
        }
    },
    bookingInfoPassenger: {
        id: '',
        name: '',
        surname: '',
        infant: { name: '', surname: '' },
        isPrivacyStatement: false
    },
    infant: isInfant && {
        typePassenger: 'INFANT',
        personalData: {
            name: { value: '', required: false },
            surname: { value: '', required: false },
            birthDate: { value: '', required: false },
            gender: { value: '', required: false },
            nationality: { value: '', required: false },
            country: { value: '', required: false }
        },
        documentationRequired: { mandatory: [], other: [] }
    }
});

type DocPartial = Partial<DocumentModel> & Pick<DocumentModel, 'typeCode'> | {};
const makeDoc = (overrides: DocPartial): DocumentModel => ({
    id: '',
    typeCode: '02',
    typeDescription: '',
    countryCode: '',
    number: '',
    isExpired: false,
    issues: [],
    iconFlag: '',
    ...overrides
});

const baseDniDoc = (overrides: DocPartial = {}) =>
    makeDoc({
        id: '1',
        typeCode: '02', // 02 - DNI
        typeDescription: 'DNI',
        countryCode: 'ES',
        number: '11122233L',
        isExpired: false,
        issues: [],
        iconFlag: '',
        expiryDate: '2030-07-20',
        ...overrides
    });

const baseVisaDoc = (overrides: DocPartial = {}) =>
    makeDoc({
        id: '3',
        typeCode: '99', // 99 - VISA
        typeDescription: 'VISA',
        countryCode: 'US',
        number: '11122233L',
        isExpired: false,
        issues: [],
        iconFlag: '',
        expiryDate: '2030-07-20',
        ...overrides
    });

const modelWithMandatory = (code: string, ocr?: TypesOCR, isInfant?: boolean) => {
    const m = makeModel(isInfant);
    const entry = { type: { code, description: '' } } as unknown as DocumentObject;
    if (ocr) entry.ocr = ocr;
    m.documentationRequired!.mandatory!.push(entry);
    if (isInfant) m.infant.documentationRequired!.mandatory!.push(entry);
    return m;
};

// ---------- Suite ----------
describe('IbTravelDocumentsTransformerService', () => {
    let service: IbTravelDocumentsTransformerService;
    let storageSpy: jasmine.SpyObj<CommonsSessionStorageService>;

    const mockCountries = (items: CountryItem[] | null) =>
        storageSpy.get.and.returnValue(items);

    const runUpdate = ({
        model,
        docs,
        isInfant,
        opts,
        currentFormModel = currentFormModelMock
    }: {
        model: ModelApisForm,
        docs: DocumentModel[] | undefined,
        isInfant: boolean,
        opts?: { mutate?: boolean },
        currentFormModel?: FormDataApis
    }) => {
        return service.updateTravelDocumentTransform(model, docs as unknown as DocumentModel[], isInfant, currentFormModel, opts ?? {})
    };

    beforeEach(() => {
        storageSpy = jasmine.createSpyObj<CommonsSessionStorageService>('CommonsSessionStorageService', ['get']);

        TestBed.configureTestingModule({
            providers: [
                IbTravelDocumentsTransformerService,
                { provide: CommonsSessionStorageService, useValue: storageSpy }
            ]
        });

        service = TestBed.inject(IbTravelDocumentsTransformerService);
    });

    describe('Empty guards and cases', () => {
        it('should return null when documents is empty or undefined', () => {
            const model = makeModel();

            const r1 = runUpdate({model, docs: [], isInfant: false, opts: {}});
            expect(r1).toBeNull();

            const r2 = runUpdate({ model, docs: undefined, isInfant: false, opts: {} });
            expect(r2).toBeNull();
        });
    });

    describe('populated with documents and personal data', () => {
        it('mandatory copy of document and filled in personal data (without mutating)', () => {
            const model = modelWithMandatory('DNI');
            const doc = baseDniDoc();

            mockCountries([{ code: 'ES', description: 'Spain', isoCode: 'ESP' }]);

            const out = runUpdate({ model, docs: [doc], isInfant: false, opts: { mutate: false } }) as ModelApisForm;

            expect(out).not.toBe(model);
            const mand = out.documentationRequired!.mandatory![0];
            expect(mand.number).toBe('11122233L');
            expect(mand.expiryDate).toBe('2030-07-20');
            expect(mand.ocrVerified).toBeFalsy();
            expect(mand.country).toEqual({ value: 'ES', label: 'Spain' });

            // no mutación
            expect(model.documentationRequired!.mandatory![0].number).toBeUndefined();
        });

        it('mutates the model when options.mutate === true', () => {
            const model = modelWithMandatory('DNI');
            const doc = baseDniDoc({ number: 'XYZ789', expiryDate: undefined, countryCode: '' });

            mockCountries(null);

            const out = runUpdate({ model, docs: [doc], isInfant: false, opts: { mutate: true } }) as ModelApisForm;
            expect(out).toBe(model);

            const mand = model.documentationRequired!.mandatory![0];
            expect(mand.number).toBe('XYZ789');
            expect(mand.expiryDate).toBeUndefined();
            expect(mand.ocrVerified).toBeFalse();
            expect(mand.country).toEqual({ value: '', label: '' });
        });
    });

    describe('documents OTHER (VISA)', () => {
        it('copies VISA to all OTHER slots with code "VISA"', () => {
            const model = makeModel();
            model.documentationRequired!.other!.push({ type: { code: 'VISA', description: '' } });

            const visaDoc = baseVisaDoc();

            mockCountries([{ code: 'US', description: 'United States', isoCode: 'USA' }]);

            const out = runUpdate({ model, docs: [visaDoc], isInfant: false, opts: { mutate: false } }) as ModelApisForm;

            const others = out.documentationRequired!.other!;
            expect(others[0].number).toBe('11122233L');
            expect(others[0].country).toEqual({ value: 'US', label: 'United States' });
        });
    });

    describe('toMandatoryCode', () => {
        it('mapped PASSPORT -> PSPT and copy number', () => {
            const model = modelWithMandatory('PSPT');

            const passport = makeDoc({
                id: '2',
                typeCode: '05', // 05 - PSPT
                typeDescription: 'PASSPORT',
                countryCode: 'ES',
                number: '123456789',
                isExpired: false,
                issues: [],
                iconFlag: '',
                expiryDate: '2030-07-20'
            });

            mockCountries(null);

            const out = runUpdate({ model, docs: [passport], isInfant: false, opts: {} }) as ModelApisForm;
            expect(out.documentationRequired!.mandatory![0].number).toBe('123456789');
        });
    });

    describe('deepClone branch', () => {
        it('uses StructuredClone when available', () => {
            const originalStructuredClone = globalThis.structuredClone;
            const structuredCloneSpy = jasmine
                .createSpy<(value: unknown) => unknown>('structuredClone')
                .and.callFake(<T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T);
            spyOn(globalThis, 'structuredClone').and.callFake(structuredCloneSpy);

            try {
                const model = modelWithMandatory('DNI');
                const doc = baseDniDoc();

                mockCountries(null);

                runUpdate({ model, docs: [doc], isInfant: false, opts: { mutate: false } }) as ModelApisForm;
                expect(structuredCloneSpy).toHaveBeenCalled();
            } finally {
                globalThis.structuredClone = originalStructuredClone;
            }
        });
    });

    describe('updateOcrMandatoryToOptional', () => {
        it('should update the adult ocr type to optional', () => {
            const model = modelWithMandatory('DNI', 'MANDATORY' as TypesOCR);
            const doc = baseDniDoc();

            const r1 = runUpdate({ model, docs: [doc], isInfant: false, opts: {} });

            expect(r1.documentationRequired.mandatory[0].ocr).toBe('OPTIONAL');
        });
    });

    describe('update infant document', () => {
        it('should update infant document model', () => {
            const model = modelWithMandatory('PSPT', 'OPTIONAL' as TypesOCR, true);
            const doc = makeDoc({ number: 'AV000000', typeCode: '05' });

            const out = runUpdate({ model, docs: [doc], isInfant: true, currentFormModel: currentFormModelInfantMock });

            expect(out).not.toBe(model);
            expect(out.infant.documentationRequired.mandatory[0].number).toBe(doc.number);
        });
    });

    describe('updateModel', () => {
        const emptyDocs = makeDoc({});

        describe('updateOthersDocuments', () => {
            it('should update others documents', () => {
                const model = makeModel();
                model.documentationRequired!.other!.push({ type: { code: 'Other Documents', description: '' } });
                const currentFormModelClone = structuredClone(currentFormModelMock);
                currentFormModelClone.documentationRequired.other.number = '11122233L';

                const out = runUpdate({ model, docs: [emptyDocs], isInfant: false, opts: { mutate: false }, currentFormModel: currentFormModelClone }) as ModelApisForm;

                const others = out.documentationRequired!.other!;
                expect(others[0].number).toBe('11122233L');
            });
        });

        describe('updateMandatoryDocs', () => {
            it('should update the current mandatory doc', () => {
                const model = modelWithMandatory('PSPT');
                const currentFormModelClone = structuredClone(currentFormModelMock);
                currentFormModelClone.documentationRequired.mandatory.number = 'AV000000';

                const out = runUpdate({ model, docs: [emptyDocs], isInfant: false, currentFormModel: currentFormModelClone });

                expect(out.documentationRequired.mandatory[0].number).toBe('AV000000');
            });

            it('should not update the secondary mandatory doc', () => {
                const model = modelWithMandatory('PSPT');
                model.documentationRequired.mandatory.push({ type: { code: 'DNI', description: 'DNI' } } as DocumentObject);
                const currentFormModelClone = structuredClone(currentFormModelMock);
                currentFormModelClone.documentationRequired.mandatory = {
                    ...currentFormModelClone.documentationRequired.mandatory,
                    type: { label: 'DNI', value: 'DNI' },
                    number: 'AV000000'
                };

                const out = runUpdate({ model, docs: [emptyDocs], isInfant: false, currentFormModel: currentFormModelClone });

                expect(out.documentationRequired.mandatory[0].number).not.toBe('AV000000');
            });
        });

        describe('updatePassengerAddress', () => {
            it('should update the passengerAddress if exists', () => {
                const model = makeModel();
                Object.assign(model, { passengerAddress: { city: { value: 'Madrid' } } });
                const currentFormModelClone = structuredClone(currentFormModelMock);
                Object.assign(currentFormModelClone, { passengerAddress: { city: 'Madrid' } });

                const out = runUpdate({ model, docs: [emptyDocs], isInfant: false, currentFormModel: currentFormModelClone });

                expect(out.passengerAddress.city.value).toBe('Madrid');
            });

            it('should set null passengerAddress is not exists', () => {
                const model = makeModel();

                const out = runUpdate({ model, docs: [emptyDocs], isInfant: false });

                expect(out.passengerAddress).toBeUndefined();
            });
        });

        describe('updateInfantModel', () => {
            it('should update infant model if exists', () => {
                const model = modelWithMandatory('PSPT', 'OPTIONAL' as TypesOCR, true);
                const currentFormModelClone = structuredClone(currentFormModelInfantMock);
                currentFormModelClone.infant.personalData.name = 'BABY';
                currentFormModelClone.infant.documentationRequired.mandatory.number = 'A00000000';

                const out = runUpdate({ model, docs: [emptyDocs], isInfant: true, currentFormModel: currentFormModelClone });

                expect(out.infant).toBeDefined();
                expect(out.infant.personalData.name.value).toBe('BABY');
                expect(out.infant.documentationRequired.mandatory[0].number).toBe('A00000000');
            });
        });
    });
});
