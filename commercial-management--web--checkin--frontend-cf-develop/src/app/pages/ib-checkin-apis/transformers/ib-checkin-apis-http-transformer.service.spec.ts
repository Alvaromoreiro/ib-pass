import { TestBed } from '@angular/core/testing';
import { IbCheckinApisHttpTransformerService } from './ib-checkin-apis-http-transformer.service';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';

import { AdditonalInfoBody } from '@src/app/core/models/ib-checkin-apis/services/additional-info-model';
import { SecurityRequest } from '@src/app/core/models/ib-checkin-apis/services/security-model';
import { TravelDocument, TravelDocumentType, UpdateTravelDocument } from '@src/app/core/models/travel-documents/travel-documents-model';
import { ApisPassenger, IGetUniqueDocumentTypes, UpdateApisInfoModel } from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import { ApisPassengerState, ApisRequiredFields } from '@src/app/core/constants/ib-checkin-apis-constants';

import { RootScopeMock } from 'test/class/RootScopeMock';
import {
  baseDataMock,
  formDataBulletinMock,
  formDataSecurityMock
} from 'test/mocks/transformers/ib-checkin-apis-http-transformer.service.mock';
import { DocumentModel } from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';

describe('IbCheckinApisHttpTransformerService', () => {
  let service: IbCheckinApisHttpTransformerService;
  let sessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
  let rootscope: RootScopeMock;

  const setup = (sessionGetReturn?: unknown) => {
    const spy = jasmine.createSpyObj<CommonsSessionStorageService>(
      'CommonsSessionStorageService',
      ['get']
    );
    if (sessionGetReturn !== undefined) spy.get.and.returnValue(sessionGetReturn);

    TestBed.configureTestingModule({
      providers: [
        IbCheckinApisHttpTransformerService,
        { provide: AJSRootScope, useValue: rootscope },
        { provide: CommonsSessionStorageService, useValue: spy }
      ]
    });

    service = TestBed.inject(IbCheckinApisHttpTransformerService);
    sessionStorageService = TestBed.inject(
      CommonsSessionStorageService
    ) as jasmine.SpyObj<CommonsSessionStorageService>;
  };

  const setSession = (value: unknown) => sessionStorageService.get.and.returnValue(value);

  const buildModel = (
    formData: UpdateApisInfoModel['formData'],
    id = '1234'
  ): UpdateApisInfoModel[] => [{ formData, id }];

  const mkDoc = (p: Partial<TravelDocument>): TravelDocument =>
  ({
    id: '',
    documentType: '',
    expiryDate: '',
    documentNumber: '',
    country: '',
    // name/surnames pueden venir undefined y el SUT los normaliza
    ...p
  } as TravelDocument);

  const mkDocCC = (p: Partial<DocumentModel>): DocumentModel =>
  ({
    id: '1',
    typeCode: '05',//05 - PSPT
    typeDescription: 'PASSPORT',
    countryCode: 'ES',
    number: '11122233L',
    isExpired: false,
    issues: [],
    iconFlag: '',
    ...p
  } as DocumentModel);

  const mkPassenger = (mandatoryCodes: string[], optionalCodes?: string[]): ApisPassenger => ({
    requiredFields: [],
    mandatoryDocuments: mandatoryCodes.map((code) => ({
      documents: [
        {
          type: { code, description: '' },
          issuerCountry: '',
          expiryDate: '',
          number: '',
          requiredFields: [],
          requiredFieldsOptions: []
        }
      ]
    })),
    optionalDocuments: optionalCodes?.map((code) => ({
      type: { code, description: '' },
      issuerCountry: '',
      expiryDate: '',
      number: '',
      requiredFields: [],
      requiredFieldsOptions: []
    })),
    additionalInfo: undefined,
    formStatus: ApisPassengerState.COMPLETED,
    passengerBookingInfo: undefined,
    id: '',
    name: '',
    surname: '',
    gender: '',
    birthDate: '',
    inTransit: false,
    emergencyContact: undefined,
    nationality: '',
    documents: []
  });

  beforeEach(() => {
    rootscope = new RootScopeMock();
    setup();
  });

  it('should create the additional information request', () => {
    setSession({ Language: 'es' });

    const modelMock = buildModel(baseDataMock, '1234');
    const result: AdditonalInfoBody = service.generateAdditionalInfoRequest(modelMock);

    expect(result).toEqual([
      {
        id: '1234',
        disruptionContact: {
          language: 'es',
          email: 'test@example.com',
          phone: { countryCode: '34', number: '987654321' }
        }
      }
    ]);
  });

  it('should generate the security request', () => {
    const modelMock = buildModel(formDataSecurityMock, '1234');
    const result: SecurityRequest = service.generateSecurityRequest(modelMock, Object.values(ApisRequiredFields));

    expect(result).toBeDefined();
    expect(result[0]).toEqual(
      jasmine.objectContaining({
        id: '1234',
        emergencyContact: jasmine.objectContaining({ name: 'Emergency Name' })
      })
    );
  });

  it('should generate the bulletin information', () => {
    setSession({
      outwardSegments: [
        {
          departure: { airport: { code: 'MAD' } },
          arrival: { airport: { code: 'BCN' } }
        }
      ],
      returnSegments: []
    });

    const initialModelMock = buildModel(formDataBulletinMock, '1');
    const result = service.generateNewsLetterInfo(initialModelMock);

    expect(result[0]).toEqual(
      jasmine.objectContaining({
        email: 'newsletter@example.com',
        unsubscribe: true,
        departureCity: 'MAD',
        destinationCity: 'BCN'
      })
    );
  });

  describe('transformTravelDocumentsToInfo', () => {
    interface Case {
      title: string;
      input: DocumentModel[];
      expected: jasmine.ObjectContaining<Partial<DocumentModel>>[];
    }

    const cases: Case[] = [
      {
        title: 'transforms when all fields are present',
        input: [mkDocCC({
          id: '2',
          typeCode: '05',//05 - PSPT
          typeDescription: 'PASSPORT',
          countryCode: 'ES',
          number: '11122233L',
          isExpired: false,
          issues: [],
          iconFlag: '',
          expiryDate: '2030-07-20'
        })],
        expected: [
          jasmine.objectContaining<Partial<DocumentModel>>({
          id: '2',
          typeCode: '05',//05 - PSPT
          typeDescription: 'PASSPORT',
          countryCode: 'ES',
          number: '11122233L',
          isExpired: false,
          issues: [],
          iconFlag: '/iberia-web-content/iconos/circle_flags/es.svg',
          expiryDate: '2030-07-20'
      })
        ]
      },
      {
        title: 'defaults empty strings when name/surnames are undefined',
        input: [mkDocCC({
          id: '3',
          typeCode: '99',//99 - VISA
          typeDescription: 'VISA',
          countryCode: 'ES',
          number: '11122233L',
          isExpired: false,
          issues: [],
          iconFlag: '',
          expiryDate: '2030-07-20'
        })],
        expected: [
          jasmine.objectContaining<Partial<DocumentModel>>({
            id: '3',
            typeCode: '99',//99 - VISA
            typeDescription: 'VISA',
            countryCode: 'ES',
            number: '11122233L',
            isExpired: false,
            issues: [],
            iconFlag: '/iberia-web-content/iconos/circle_flags/es.svg',
            expiryDate: '2030-07-20'
          })
        ]
      },
      {
        title: 'handles multiple documents',
        input: [
          mkDocCC({
            id: '2',
            typeCode: '05',//05 - PSPT
            typeDescription: 'PASSPORT',
            countryCode: 'ES',
            number: '11122233L',
            isExpired: false,
            issues: [],
            iconFlag: '',
            expiryDate: '2030-07-20'
          }),
          mkDocCC({
            id: '3',
            typeCode: '99',//99 - VISA
            typeDescription: 'VISA',
            countryCode: 'ES',
            number: '11122233L',
            isExpired: false,
            issues: [],
            iconFlag: '',
            expiryDate: '2030-07-20'
          })
        ],
        expected: [
          jasmine.objectContaining<Partial<DocumentModel>>({
            id: '2',
            typeCode: '05',//05 - PSPT
            typeDescription: 'PASSPORT',
            countryCode: 'ES',
            number: '11122233L',
            isExpired: false,
            issues: [],
            iconFlag: '/iberia-web-content/iconos/circle_flags/es.svg',
            expiryDate: '2030-07-20'
          }),
          jasmine.objectContaining<Partial<DocumentModel>>({
            id: '3',
            typeCode: '99',//99 - VISA
            typeDescription: 'VISA',
            countryCode: 'ES',
            number: '11122233L',
            isExpired: false,
            issues: [],
            iconFlag: '/iberia-web-content/iconos/circle_flags/es.svg',
            expiryDate: '2030-07-20'
          })
        ]
      }
    ];

    cases.forEach(({ title, input, expected }) => {
      it(title, () => {
        const result = service.transformTravelDocumentsToInfo(input);
        expect(result).toEqual(expected);
      });
    });

    it('returns empty array for empty input', () => {
      expect(service.transformTravelDocumentsToInfo([])).toEqual([]);
    });

    it('should return an empty array if the docs does not a valid type', () => {
      const mockDocs = [mkDocCC({
        typeCode: '05'
      })];

      const result = service.transformTravelDocumentsToInfo(mockDocs, ['DNI']);

      expect(result.length).toBe(0);
    });
  });

  describe('getUniqueDocumentTypes', () => {
    const cases = [
      {
        name: 'returns unique codes from mandatory and optional',
        mandatory: ['DNI'],
        optional: ['VISA'],
        expected: {
          validTypesDocs: ['DNI', 'VISA'],
          showTravelDocumentsLink: { showVisa: true, showBasicInfo: true }
        }
      },
      {
        name: 'removes duplicates between mandatory and optional',
        mandatory: ['DNI'],
        optional: ['DNI'],
        expected: {
          validTypesDocs: ['DNI'],
          showTravelDocumentsLink: { showVisa: false, showBasicInfo: true }
        }
      },
      {
        name: 'returns only mandatory when optional is undefined',
        mandatory: ['DNI'],
        optional: undefined, // use undefined intentionally if that is the scenario
        expected: {
          validTypesDocs: ['DNI'],
          showTravelDocumentsLink: { showVisa: false, showBasicInfo: true }
        }
      },
      {
        name: 'returns empty array when both are empty',
        mandatory: [],
        optional: [],
        expected: {
          validTypesDocs: [],
          showTravelDocumentsLink: { showVisa: false, showBasicInfo: false }
        }
      }
    ];

    cases.forEach(({ name, mandatory, optional, expected }) => {
      it(name, () => {
        const passenger = mkPassenger(mandatory, optional);
        expect(service.getUniqueDocumentTypes(passenger)).toEqual(expected as IGetUniqueDocumentTypes);
      });
    });
  });

  describe('getDocumentsValid', () => {
    it('filters by valid types and keeps PASSPORT (PSPT alias)', () => {
      const documentsUserLogged: TravelDocument[] = [
        mkDoc({
          documentType: 'PASSPORT',
          documentNumber: 'A1234567',
          expiryDate: '2030-01-01',
          id: '1',
          country: 'ES'
        }),
        mkDoc({
          documentType: 'DNI',
          documentNumber: 'B7654321',
          expiryDate: '2028-05-10',
          id: '2',
          country: 'ES'
        }),
        mkDoc({
          documentType: 'VISA',
          documentNumber: 'C1111111',
          expiryDate: '2025-12-31',
          id: '3',
          country: 'US'
        })
      ];
      const validTypesDocsSecurity = ['PASSPORT', 'DNI', 'VISA'];

      const result = service.getDocumentsValid(
        documentsUserLogged,
        validTypesDocsSecurity
      );

      const mock: {
        documents: TravelDocument[];
        documentsTypesValid: TravelDocumentType[];
      } = {
        documents: [
          {
            documentType: 'PASSPORT',
            documentNumber: 'A1234567',
            expiryDate: '2030-01-01',
            id: '1',
            country: 'ES'
          },
          {
            documentType: 'DNI',
            documentNumber: 'B7654321',
            expiryDate: '2028-05-10',
            id: '2',
            country: 'ES'
          },
          {
            documentType: 'VISA',
            documentNumber: 'C1111111',
            expiryDate: '2025-12-31',
            id: '3',
            country: 'US'
          }
        ],
        documentsTypesValid: ['PASSPORT', 'DNI', 'VISA']
      };
      expect(result).toEqual(mock);
    });

    it('returns empty when no documents match', () => {
      const result = service.getDocumentsValid(
        [
          mkDoc({
            documentType: 'VISA',
            id: '3',
            documentNumber: 'C1111111',
            expiryDate: '2025-12-31',
            country: 'US'
          })
        ],
        ['PSPT', 'DNI']
      );
      const mock: {
        documents: TravelDocument[];
        documentsTypesValid: TravelDocumentType[];
      } = {
        documents: [],
        documentsTypesValid: ['VISA']
      };
      expect(result).toEqual(mock);
    });

    // it('handles empty inputs', () => {
    //   expect(service.getDocumentsValid([], ['PSPT', 'DNI'])).toEqual([]);
    //   expect(service.getDocumentsValid([mkDoc({ documentType: 'PASSPORT', id: '1' })], [])).toEqual([]);
    // });

    it('does not transform non-PASSPORT types', () => {
      const result = service.getDocumentsValid(
        [
          mkDoc({
            documentType: 'DNI',
            documentNumber: 'B7654321',
            expiryDate: '2028-05-10',
            id: '2',
            country: 'ES'
          })
        ],
        ['DNI']
      );
      expect(result.documents.length).toBe(1);
      expect(result.documents[0].documentType as unknown).toBe('DNI');
    });
  });


  describe('transformTravelDocumentsUpdate', () => {
    let baseInput: UpdateTravelDocument;

    beforeEach(() => {
      baseInput = {
        documentType: 'PASSPORT',
        documentNumber: '00055500011',
        expiryDate: '2030-07-20',
        country: 'FR',
        name: 'Brutus',
        surnames: 'Fortex',
        gender: 'WOMAN',
        birthdate: '1982-07-21',
        nationality: 'ES',
        ocrUsed: false
      };
    });

    const createInput = (overrides: Partial<UpdateTravelDocument> = {}): UpdateTravelDocument => ({
      ...baseInput,
      ...overrides
    });

    it('should return dataTransformed without id and documentId when id is present', () => {
      const input = createInput({ id: 'a0OUE000001XJxl2AG' });

      const result = service.transformTravelDocumentsUpdate(input);

      expect(result.dataTransformed).toEqual(baseInput);
      expect(result.documentId).toBe('a0OUE000001XJxl2AG');
    });

    it('should return undefined documentId when id is empty string', () => {
      const input = createInput({ id: '' });

      const result = service.transformTravelDocumentsUpdate(input);

      expect(result.documentId).toBeUndefined();
    });

    it('should return undefined documentId when id is null', () => {
      const input = createInput({ id: null });

      const result = service.transformTravelDocumentsUpdate(input);

      expect(result.documentId).toBeUndefined();
    });

    it('should return undefined documentId when id is undefined', () => {
      const input = createInput();

      const result = service.transformTravelDocumentsUpdate(input);

      expect(result.documentId).toBeUndefined();
    });

    it('should not mutate the original input object', () => {
      const input = createInput({ id: 'a0OUE000001XJxl2AG' });
      const inputCopy = { ...input };

      service.transformTravelDocumentsUpdate(input);

      expect(input).toEqual(inputCopy);
    });
  });

  describe('iconsCandidates', () => {
    it('should return the default path', () => {
      const expectedResult = '/iberia-web-content/iconos/circle_flags/unknown.svg';

      const result = service.iconsCandidates();

      expect(result).toBe(expectedResult);
    });
  });

});
