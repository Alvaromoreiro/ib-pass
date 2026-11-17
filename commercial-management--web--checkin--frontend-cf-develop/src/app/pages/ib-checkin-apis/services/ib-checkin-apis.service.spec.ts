import { fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbCheckinApisHttpTransformerService } from '@src/app/pages/ib-checkin-apis/transformers/ib-checkin-apis-http-transformer.service';
import { IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { IbCheckinApisService } from './ib-checkin-apis.service';
import { AJSPassengerAdditionalInfoService, AJSPassengerAdditionalInfoServiceType } from '@src/app/shared/services/ib-apis/ib-passenger-additional-info-service-bridge.service';
import { AJSCallApisFormService, AJSCallApisFormServiceType } from '@src/app/shared/services/ib-apis/ib-call-apis-form-service-bridge.service';
import { AJSGetCKICachedInformationServiceToken, AJSGetCKICachedInformationServiceType } from '@src/app/shared/http-services/pac-prm/bridges/ib-get-cached-information-bridge.service';
import { AJSGetCountriesListService, AJSGetCountriesListServiceType } from '@src/app/shared/services/ib-apis/ib-get-countries-list-service-bridge.service';
import { AJSGetPhoneCodesService, AJSGetPhoneCodesServiceType } from '@src/app/shared/services/ib-apis/ib-get-phone-codes-service-bridge.service';
import { AJSGetStatesListService, AJSGetStatesListServiceType } from '@src/app/shared/services/ib-apis/ib-get-states-list-service-bridge.service';
import { AJSNewslettersService, AJSNewslettersServiceType } from '@src/app/shared/services/ib-apis/ib-newsletters-service-bridge.service';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service-bridge.service';
import { AJSModalService, AJSModalServiceType } from '@src/app/shared/services/ib-modal/ib-modal-service-bridge.service';
import { RootScopeMock } from 'test/class/RootScopeMock';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { FormRefType } from 'commercial-management--digital--web-components-design--library';
import { ApisFormDataModel, ApisFormModel, ApisPassenger, IFilterTypesDocsSecurity, IGetUniqueDocumentTypes } from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import { TravelDocument, TravelDocumentType } from '@src/app/core/models/travel-documents/travel-documents-model';
import { DocumentModel } from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';
import { ApisPassengerState, ApisRequiredFields } from '@src/app/core/constants/ib-checkin-apis-constants';
import { AJSTravelInfoService, AJSTravelInfoServiceType } from '@src/app/shared/services/ib-apis/ib-travel-info-service-bridge.service';
import { additionalInfoMock, getSecurityResponseMock } from '@test/unit/app/pages/ib-checkin-apis/mocks/ib-checkin-apis.mocks';

type Mocks = ReturnType<typeof createMocks>;

// utils/test-mocks.ts (o al inicio del spec)
const r = <T>(v: T) => jasmine.createSpy().and.resolveTo(v);        // helper: promise resuelta
const v = <T>(v: T) => jasmine.createSpy().and.returnValue(v);      // helper: valor directo

function buildModalServiceMock() {
  return jasmine.createSpyObj<AJSModalServiceType>('AJSModalService', [
    'showGenericError', 'setErrorMessage', 'setErrorCode', 'isError', 'isNotWaiting'
  ]);
}

function buildPassengerAdditionalInfoServiceMock(): Partial<AJSPassengerAdditionalInfoServiceType> {
  return {
    getAdditionalInfo: r([]),
    updateAdditionalInfo: r(undefined)
  };
}

function buildCallApisFormServiceMock(): Partial<AJSCallApisFormServiceType> {
  return {
    getApisInfo: r({ passengersSecurityInformation: [] }),
    updateApisInfo: r(undefined)
  };
}

function buildCountriesListServiceMock(): Partial<AJSGetCountriesListServiceType> {
  return { getCountriesList: r([]) };
}

function buildPhoneCodesServiceMock(): Partial<AJSGetPhoneCodesServiceType> {
  return { getPhoneCodesList: r([]) };
}

function buildStatesListServiceMock(): Partial<AJSGetStatesListServiceType> {
  return { getStatesList: r([]) };
}

function buildCachedInformationServiceMock(): Partial<AJSGetCKICachedInformationServiceType> {
  return { getCachedInformation: r({}) };
}

function buildNewslettersServiceMock(): Partial<AJSNewslettersServiceType> {
  return { putNewsletters: r(undefined) };
}

function buildDatalayerUtilsServiceMock(): Partial<AJSDatalayerUtilsServiceType> {
  return { updateDatalayerEvent: jasmine.createSpy() };
}

function buildSessionStorageMock(): Partial<CommonsSessionStorageService> {
  return {
    get: v(null),
    set: jasmine.createSpy('set'),
    remove: jasmine.createSpy('remove')
  };
}

function buildTransformerMock(): Partial<IbCheckinApisHttpTransformerService> {
  return {
    generateAdditionalInfoRequest: v({}),
    generateSecurityRequest: v({}),
    generateNewsLetterInfo: v({}),
    getDocumentsValid: jasmine.createSpy().and.callFake(
      (docs: TravelDocument[], valid: string[]) =>
        docs.filter(d => valid.includes(d.documentType === 'PASSPORT' ? 'PSPT' : d.documentType))
    ),
    transformTravelDocumentsToInfo: jasmine.createSpy().and.callFake(
      (docs: DocumentModel[]) => docs
    ),
    getUniqueDocumentTypes: jasmine.createSpy(),//v([]),
    transformTravelDocumentsUpdate: jasmine.createSpy(),
    keysToSnakeFlat: jasmine.createSpy(),
    keysToCamelFlat: jasmine.createSpy()
  };
}

function buildRedirectionServiceMock(): Partial<IbCheckinRedirectionUtilsService> {
  return { path: jasmine.createSpy('path') };
}

function buildTravelInfoServiceMock(): Partial<AJSTravelInfoServiceType> {
  return {
    getTravelInfo: jasmine.createSpy('getTravelInfo')
    // putTravelDocuments: jasmine.createSpy('putTravelDocuments'),
    // postTravelDocuments: jasmine.createSpy('postTravelDocuments'),
  };
}

// ← ESTA ya no es larga: solo compone.
function createMocks() {
  return {
    rootscope: new RootScopeMock(),
    modalServiceMock: buildModalServiceMock(),
    passengerAdditionalInfoServiceMock: buildPassengerAdditionalInfoServiceMock(),
    callApisFormServiceMock: buildCallApisFormServiceMock(),
    getCountriesListServiceMock: buildCountriesListServiceMock(),
    getPhoneCodesServiceMock: buildPhoneCodesServiceMock(),
    getStatesListServiceMock: buildStatesListServiceMock(),
    getCachedInformationServiceMock: buildCachedInformationServiceMock(),
    newslettersServiceMock: buildNewslettersServiceMock(),
    datalayerUtilsServiceMock: buildDatalayerUtilsServiceMock(),
    sessionStorageMock: buildSessionStorageMock(),
    httpTransformerServiceMock: buildTransformerMock(),
    redirectionServiceMock: buildRedirectionServiceMock(),
    travelInfoServiceMock: buildTravelInfoServiceMock()
  } as const;
}


function initTestBed(m: Mocks) {
  TestBed.configureTestingModule({
    providers: [
      IbCheckinApisService,
      { provide: AJSRootScope, useValue: m.rootscope },
      { provide: AJSModalService, useValue: m.modalServiceMock },
      { provide: AJSPassengerAdditionalInfoService, useValue: m.passengerAdditionalInfoServiceMock },
      { provide: AJSCallApisFormService, useValue: m.callApisFormServiceMock },
      { provide: AJSGetCountriesListService, useValue: m.getCountriesListServiceMock },
      { provide: AJSGetPhoneCodesService, useValue: m.getPhoneCodesServiceMock },
      { provide: AJSGetStatesListService, useValue: m.getStatesListServiceMock },
      { provide: AJSGetCKICachedInformationServiceToken, useValue: m.getCachedInformationServiceMock },
      { provide: AJSNewslettersService, useValue: m.newslettersServiceMock },
      { provide: AJSDatalayerUtilsService, useValue: m.datalayerUtilsServiceMock },
      { provide: CommonsSessionStorageService, useValue: m.sessionStorageMock },
      { provide: IbCheckinApisHttpTransformerService, useValue: m.httpTransformerServiceMock },
      { provide: IbCheckinRedirectionUtilsService, useValue: m.redirectionServiceMock },
      { provide: AJSTravelInfoService, useValue: m.travelInfoServiceMock }
    ]
  });
}

const formDataMock = {
  personalData: {
    name: '',
    surname: '',
    birthDate: '',
    nationality: { value: '', label: '' },
    country: { value: '', label: '' },
    gender: ''
  },
  contactData: {
    additionalInfo: {
      email: '',
      phone: { value: '', label: '' },
      number: '',
      checkInfoAll: false
    },
    emergencyInfo: {
      phone: { value: '', label: '' },
      number: '',
      name: '',
      checkEmergencyAll: false
    }
  },
  documentationRequired: {
    mandatory: { type: '', number: '', expiryDate: '', issuerCountry: '', requiredField: [], mrz: '', ocrVerified: false },
    visa: { type: '', number: '', expiryDate: '', issuerCountry: '', requiredField: [], mrz: '', ocrVerified: false },
    other: { type: '', number: '', expiryDate: '', issuerCountry: '', requiredField: [], mrz: '', ocrVerified: false }
  },
  checkbox: {
    notSendNewsletter: false,
    usPrivacyEmergencyData: false,
    confirmEmergencyData: false
  }
};

describe('IbCheckinApisService', () => {
  let service: IbCheckinApisService;
  let m: Mocks;

  const getUpdateApisInfoModelMock = (idMock: string) => [{ id: idMock, formData: formDataMock }];

  beforeEach(() => {
    m = createMocks();
    initTestBed(m);
    service = TestBed.inject(IbCheckinApisService);
  });

  it('should be created correctly', () => {
    expect(service).toBeTruthy();
  });

  it('should get information from the API and store the results in sessionStorage', async () => {
    const countriesMock = [{ code: 'US', name: 'United States' }];
    const prefixListMock = [{ code: '+1', countryCode: 'US' }];
    const statesMock = [{ name: 'California', code: 'CA' }];
    const passengersSecurityMock = [{ id: '1234', name: 'John', surname: 'Doe', additionalInfo: null }];
    const additionalInfoMock = [{ id: '1234', info: 'Additional Info' }];

    (m.sessionStorageMock.get as jasmine.Spy).and.returnValue(['1234']);
    (m.getCountriesListServiceMock.getCountriesList as jasmine.Spy).and.returnValue(Promise.resolve(countriesMock));
    (m.getPhoneCodesServiceMock.getPhoneCodesList as jasmine.Spy).and.returnValue(Promise.resolve(prefixListMock));
    (m.getStatesListServiceMock.getStatesList as jasmine.Spy).and.returnValue(Promise.resolve(statesMock));
    (m.callApisFormServiceMock.getApisInfo as jasmine.Spy).and.returnValue(
      Promise.resolve({ passengersSecurityInformation: passengersSecurityMock })
    );
    (m.passengerAdditionalInfoServiceMock.getAdditionalInfo as jasmine.Spy).and.returnValue(Promise.resolve(additionalInfoMock));

    await service.getApisInfo();

    expect(m.sessionStorageMock.remove).toHaveBeenCalledWith('countriesList');
    expect(m.sessionStorageMock.remove).toHaveBeenCalledWith('phoneCodeList');
    expect(m.sessionStorageMock.set).toHaveBeenCalledWith(CheckinAppConstants.STORAGE_KEYS.APIS_INFO, {
      countries: countriesMock,
      prefixList: prefixListMock,
      states: statesMock
    });
    // expect(modalServiceMock.isNotWaiting).toHaveBeenCalled();
  });

  it('should update the APIS information correctly', async () => {
    const cachedBookingInfoMock = { passengers: [{ id: '1234', status: { code: 'ALLOWED', reason: {} } }] };
    const passengerIdMock = '1234';
    const updateApisInfoModelMock = getUpdateApisInfoModelMock(passengerIdMock);

    spyOn(service, 'updateAdditionalInfo').and.returnValue(Promise.resolve());
    spyOn(service, 'updateSecurityInfo').and.returnValue(Promise.resolve());
    spyOn(service, 'getCachedInformation').and.returnValue(Promise.resolve(cachedBookingInfoMock));
    spyOn(service, 'updateModelForAllPassengers').and.callFake(() => { });
    spyOn(service, 'checkCasesConstraints').and.callFake(() => undefined);

    await service.updateApisInfo(updateApisInfoModelMock, true, Object.values(ApisRequiredFields));

    expect(service.updateAdditionalInfo).toHaveBeenCalledOnceWith(updateApisInfoModelMock);
    expect(service.updateSecurityInfo).toHaveBeenCalledOnceWith(updateApisInfoModelMock, Object.values(ApisRequiredFields));
    expect(service.getCachedInformation).toHaveBeenCalledTimes(1);
    expect(service.updateModelForAllPassengers).toHaveBeenCalledOnceWith(formDataMock);
    expect(service.checkCasesConstraints).toHaveBeenCalledOnceWith(cachedBookingInfoMock, passengerIdMock);
    expect(service['CommonsSessionStorageService'].set).toHaveBeenCalledOnceWith(
      CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO,
      cachedBookingInfoMock
    );
  });

  it('should handle errors correctly when a failure occurs in updateAdditionalInfo', async () => {
    const passengerIdMock = '1234';
    const errorMock = { status: 500, message: 'Additional information update failed' };
    const updateApisInfoModelMock = getUpdateApisInfoModelMock(passengerIdMock);

    spyOn(service, 'updateAdditionalInfo').and.returnValue(Promise.reject(errorMock));
    await expectAsync(service.updateApisInfo(updateApisInfoModelMock, false, Object.values(ApisRequiredFields)))
      .toBeRejectedWith(errorMock);

    expect(service.updateAdditionalInfo).toHaveBeenCalledOnceWith(updateApisInfoModelMock);
    expect(m.modalServiceMock.showGenericError).toHaveBeenCalledWith(
      { message: 'REST_SERVICE_ERROR_GENERAL', needsTranslate: true },
      true
    );
  });

  describe('setFormDataApisModel', () => {
    const mockFormRef: FormRefType = { getData: jasmine.createSpy(), ref: {} as HTMLFormElement };

    it('should initialize the formDataApisModelSubject with empty array', () => {
      const currentValue = service['formDataApisModelSubject'].getValue();
      expect(currentValue).toEqual([]);
      expect(currentValue).toHaveSize(0);
    });

    it('should update the state', () => {
      const mockResult: ApisFormDataModel[] = [{ id: '1', formRef: mockFormRef, model: formDataMock }];

      service.setFormDataApisModel(formDataMock, mockFormRef, '1');

      const currentValue = service['formDataApisModelSubject'].getValue();
      expect(currentValue).toEqual(mockResult);
      expect(currentValue).toHaveSize(1);
    });
  });

  describe('getFormDataApisModel', () => {
    const mockFormRef: FormRefType = { getData: jasmine.createSpy(), ref: {} as HTMLFormElement };

    const mockApisFormDataModel: ApisFormDataModel[] = [{ id: '1', formRef: mockFormRef, model: formDataMock }];

    const mockResult: ApisFormModel[] = [
      { formRef: mockFormRef, hashEnd: 'hash', hashInit: 'hash', passengerId: '1', state: 'pending', initialCheckModel: { contactData: formDataMock.contactData, passengerAddress: undefined } }
    ];

    beforeEach(() => {
      spyOn(service, 'createFormDataApisModelHash').and.resolveTo('hash');
      spyOn(service, 'resetFormDataApisModel').and.resolveTo();
    });

    it('should return the current value of formDataApisModel', async () => {
      service['formDataApisModelSubject'].next(mockApisFormDataModel);
      const result = await service.getFormDataApisModel(mockResult.length);

      expect(result).toEqual(mockResult);
      expect(result).toHaveSize(1);
    });
  });

  describe('createFormDataApisModelHash', () => {
    it('should return the hash string', async () => {
      const hash = await service.createFormDataApisModelHash(formDataMock);
      expect(hash).toBe('9c2354d5bf5a39790b29616bc60f61a026a632fe95a13e1c0a8b4bac6a754a9a');
    });
  });

  describe('apisFormError', () => {
    const getDefaultMock = () => {
      const mockUserId = '1';
      const mockError = { error: 'test' };
      const mockResult = new Map().set(mockUserId, mockError);
      return { mockUserId, mockError, mockResult };
    };

    describe('setApisFormError', () => {
      it('should set the new apisFormError', () => {
        const { mockError, mockResult, mockUserId } = getDefaultMock();

        service.setApisFormError(mockUserId, mockError);

        const result = service['apisFormErrorsSubject'].getValue();
        expect(result).toEqual(mockResult);
        expect(result).toHaveSize(mockResult.size);
      });
    });

    describe('getApisFormErrors', () => {
      it('should return the correct content', (done) => {
        const { mockResult, mockUserId } = getDefaultMock();

        service['apisFormErrorsSubject'].next(mockResult);

        service.getApisFormErrors(mockUserId).subscribe(value => {
          expect(value).toEqual(mockResult.get(mockUserId));
          done();
        });
      });
    });

    describe('clearApisFormErrors', () => {
      it('should delete the user information', () => {
        const { mockResult, mockUserId } = getDefaultMock();
        service['apisFormErrorsSubject'].next(mockResult);

        service.clearApisFormError(mockUserId);

        const currentErrors = service['apisFormErrorsSubject'].getValue();

        expect(currentErrors).toHaveSize(0);
        expect(currentErrors.get(mockUserId)).not.toBeDefined();
      });
    });
  });

  describe('blockForm', () => {
    const mockUserId = '1';

    describe('setBlockForm', () => {
      it('should add the user state', () => {
        const mockResult = new Map().set(mockUserId, true);

        service.setBlockForm(mockUserId, true);

        const result = service['blockFormSubject'].getValue();
        expect(result).toEqual(mockResult);
        expect(result).toHaveSize(1);
      });
    });

    describe('getBlockForm', () => {
      it('should return the user blockForm state', (done) => {
        const mockResult = new Map().set(mockUserId, true);
        service['blockFormSubject'].next(mockResult);

        service.getBlockForm(mockUserId).subscribe(value => {
          expect(value).toBe(true);
          done();
        });
      });
    });
  });


  describe('getInfoTravelDocuments', () => {
    it('must transform and return the information', () => {
      const docs: DocumentModel[] = [{
        id: 'd1', typeCode: '05', typeDescription: 'PASSPORT', countryCode: 'ES',
        number: '12345', isExpired: false, issues: [], iconFlag: ''
      }];
      const validTypes: TravelDocumentType[] = ['PASSPORT'];
      const info: DocumentModel[] = docs;

      (m.httpTransformerServiceMock.transformTravelDocumentsToInfo as jasmine.Spy).and.returnValue(info);

      const result = service.getInfoTravelDocuments(docs, validTypes);
      expect(result).toEqual(info);
    });

    it('must return [] if the transformer returns null/undefined', () => {
      (m.httpTransformerServiceMock.transformTravelDocumentsToInfo as jasmine.Spy)
        .and.returnValue(undefined as unknown as DocumentModel[]);

      const result = service.getInfoTravelDocuments([]);

      expect(result).toEqual([]);
    });
  });

  describe('filterTypesDocsSecurity', () => {
    it('must return the id of the logged-in passenger and the valid types', () => {
      const passengers: ApisPassenger[] = [
        {
          id: 1, passengerBookingInfo: {
            isUserLogged: false,
            name: '',
            surname: ''
          },
          additionalInfo: undefined,
          formStatus: ApisPassengerState.COMPLETED,
          name: '',
          surname: '',
          gender: '',
          birthDate: '',
          inTransit: false,
          emergencyContact: undefined,
          nationality: '',
          documents: []
        },
        {
          id: 202,
          passengerBookingInfo: {
            isUserLogged: true,
            name: '',
            surname: ''
          },
          additionalInfo: undefined,
          formStatus: ApisPassengerState.COMPLETED,
          name: '',
          surname: '',
          gender: '',
          birthDate: '',
          inTransit: false,
          emergencyContact: undefined,
          nationality: '',
          documents: []
        }
      ];

      const expectedTypes: TravelDocumentType[] = ['PASSPORT', 'DNI'];
      const returnGetUniqueDocumentTypes: IGetUniqueDocumentTypes = {
        validTypesDocs: expectedTypes,
        showTravelDocumentsLink: {
          showVisa: true,
          showBasicInfo: true
        }
      };
      (m.httpTransformerServiceMock.getUniqueDocumentTypes as jasmine.Spy).and.returnValue(returnGetUniqueDocumentTypes);

      const res: IFilterTypesDocsSecurity = service.filterTypesDocsSecurity(true, passengers);
      expect(res).toEqual({
        loggedPassengerId: '202', // toString()
        validTypesDocs: expectedTypes,
        showTravelDocumentsLink: {
          showVisa: true,
          showBasicInfo: true
        }
      });
    });

    it('must return null and [] if userLogged=false', () => {
      const expectedTypes: TravelDocumentType[] = [];
      const returnGetUniqueDocumentTypes: IGetUniqueDocumentTypes = {
        validTypesDocs: expectedTypes,
        showTravelDocumentsLink: {
          showVisa: false,
          showBasicInfo: false
        }
      };
      (m.httpTransformerServiceMock.getUniqueDocumentTypes as jasmine.Spy).and.returnValue(returnGetUniqueDocumentTypes);

      const res: IFilterTypesDocsSecurity = service.filterTypesDocsSecurity(false, []);
      expect(res).toEqual({
        loggedPassengerId: null,
        validTypesDocs: [],
        showTravelDocumentsLink: {
          showVisa: false,
          showBasicInfo: false
        }
      });
    });

    it('must return null and [] if there is no passenger marked as logged in', () => {
      const passengers: ApisPassenger[] = [{
        id: 1,
        passengerBookingInfo: {
          isUserLogged: false,
          name: '',
          surname: ''
        },
        additionalInfo: undefined,
        formStatus: ApisPassengerState.COMPLETED,
        name: '',
        surname: '',
        gender: '',
        birthDate: '',
        inTransit: false,
        emergencyContact: undefined,
        nationality: '',
        documents: []
      }];
      const expectedTypes: TravelDocumentType[] = [];
      const returnGetUniqueDocumentTypes: IGetUniqueDocumentTypes = {
        validTypesDocs: expectedTypes,
        showTravelDocumentsLink: {
          showVisa: false,
          showBasicInfo: false
        }
      };
      (m.httpTransformerServiceMock.getUniqueDocumentTypes as jasmine.Spy).and.returnValue(returnGetUniqueDocumentTypes);

      const res: IFilterTypesDocsSecurity = service.filterTypesDocsSecurity(true, passengers);
      expect(res).toEqual({
        loggedPassengerId: null,
        validTypesDocs: [],
        showTravelDocumentsLink: {
          showVisa: false,
          showBasicInfo: false
        }
      });
    });
  });


  describe('getTravelDocumentsModalProps', () => {
    it('You must build the modal props with transformed documents', () => {
      const validTypes: TravelDocumentType[] = ['PASSPORT'];

      const docsUser: DocumentModel[] = [{
        id: 'doc', typeCode: '02', typeDescription: 'DNI', countryCode: 'ES',
        number: '33333', isExpired: false, issues: [], iconFlag: ''
      }];
      const res = service.getTravelDocumentsModalProps(docsUser, validTypes);
      expect(res.open).toBeTrue();
      expect(res.documents).toEqual(docsUser);
      expect(res.onPrimaryAction).toBeUndefined();
    });
  });

    describe('updateApisInfo - Error', () => {
        const getUpdateApisInfoError = (fn: () => Promise<unknown>): unknown => {
          let error: unknown;
            fn().catch(e => error = e);
            tick();
            return error;
        };

        describe('checkDataErrors', () => {
            beforeEach(() => {
                (m.httpTransformerServiceMock.generateAdditionalInfoRequest as jasmine.Spy).and.returnValue(additionalInfoMock);
                (m.sessionStorageMock.get as jasmine.Spy).and.returnValue(additionalInfoMock);
            });

            it('should throw the correct data structure if error.data is not an array', fakeAsync(() => {
                const securityResponseMock = getSecurityResponseMock('usaPassport');

                (m.callApisFormServiceMock.updateApisInfo as jasmine.Spy).and.returnValue(Promise.reject(securityResponseMock));

                const error = getUpdateApisInfoError(() => service.updateApisInfo(getUpdateApisInfoModelMock('1'), false, []));

                expect(Array.isArray(error)).toBe(true);
                expect(error[0].id).toBe(securityResponseMock.data.errors[0].passengerId);
                expect(error[0].errors.length).toBeGreaterThan(0);
            }));

            it('should throw the correct data structure if error.data is an array', fakeAsync(() => {
                const securityResponseMock = getSecurityResponseMock('expiryDate');

                (m.callApisFormServiceMock.updateApisInfo as jasmine.Spy).and.returnValue(Promise.reject(securityResponseMock));

                const error = getUpdateApisInfoError(() => service.updateApisInfo(getUpdateApisInfoModelMock('1'), false, []));

                expect(Array.isArray(error)).toBe(true);
                expect(error[0].id).toBe(securityResponseMock.data[0].id);
                expect(error[0].errors.length).toBeGreaterThan(0);
            }));
        });

        describe('throwError', () => {
            it('should show the generic modal error with the correct message', fakeAsync(() => {
                const securityResponseMock = getSecurityResponseMock('general');

                (m.passengerAdditionalInfoServiceMock.updateAdditionalInfo as jasmine.Spy).and.returnValue(Promise.reject(securityResponseMock));

                const error = getUpdateApisInfoError(() => service.updateApisInfo(getUpdateApisInfoModelMock('1'), false, []));

                expect(m.modalServiceMock.showGenericError).toHaveBeenCalled();
            }));
        });

        describe('updateDisruptionContactApisStorage', () => {
            it('should update DisruptionContactApisStorage and save it to session storage', fakeAsync(() => {
                (m.httpTransformerServiceMock.generateAdditionalInfoRequest as jasmine.Spy).and.returnValue(additionalInfoMock);
                (m.sessionStorageMock.get as jasmine.Spy).withArgs('disruptionContactApis').and.returnValue(additionalInfoMock);

                service.updateApisInfo(getUpdateApisInfoModelMock('1'), false, []);

                flushMicrotasks();

                expect(m.sessionStorageMock.set).toHaveBeenCalledWith('disruptionContactApis', additionalInfoMock);
            }));
        });
    });

  // end
});
