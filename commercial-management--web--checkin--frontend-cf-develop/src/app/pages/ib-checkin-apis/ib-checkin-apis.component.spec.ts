import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbCheckinApisComponent } from './ib-checkin-apis.component';
import { IbCheckinApisService } from '@src/app/pages/ib-checkin-apis/services/ib-checkin-apis.service';
import { IbCheckinApisDigitalDataService } from '@src/app/pages/ib-checkin-apis/services/ib-checkin-apis-digital-data.service';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { AcceptService } from '@src/app/pages/ib-checkin-apis/services/ib-call-accept.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import {
  AJSModalService,
  AJSModalServiceType
} from '@src/app/shared/services/ib-modal/ib-modal-service-bridge.service';
import { ApisPassengerState, ApisRequiredFields } from '@src/app/core/constants/ib-checkin-apis-constants';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { TranslateServiceMock } from 'test/mocks/Services/TranslateServiceAngularMock';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { ApisFormModel, ApisPassenger, EmitPassengerStatus, IFilterTypesDocsSecurity, TravelDocumentModel } from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import { TravelDocumentType } from '@src/app/core/models/travel-documents/travel-documents-model';
import { DocumentModel } from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';
import { IbTravelDocumentService } from '@src/app/pages/ib-checkin-apis/services/ib-travel-document.service';
import { FormDataApis, FormRefType, PassengerCheckInUnavailableModalProps } from 'commercial-management--digital--web-components-design--library';
import { IbSessionConfigService } from '@src/app/core/services/ib-session-config.service';
import { IbCheckinApisUtilsService } from '@src/app/pages/ib-checkin-apis/utils/ib-checkin-apis-utils-services';

@Pipe({
  name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
  public name: string = 'translate';

  public transform(query: string, ...args: unknown[]): string {
    return query;
  }
}
const mockGetApisInfo = require('test/mocks/responses/get-apis-info.json');
const mockBookingInfo = require('test/mocks/localStorage/booking-info-apis-usa-travel-document.json');
const travelDocument: TravelDocumentModel = {
  documentsUserLogged: [{
    id: '1',
    typeCode: '02', //02 - DNI
    typeDescription: 'DNI',
    countryCode: 'ES',
    number: '11122233L',
    isExpired: false,
    issues: [],
    iconFlag: '',
    expiryDate: '2030-07-20'
  }],
  validTypesDocsSecurity: ['DNI'],
  loggedPassengerId: '3739828',
  documentSelected: [{
    id: '1',
    typeCode: '02', //02 - DNI
    typeDescription: 'DNI',
    countryCode: 'ES',
    number: '11122233L',
    isExpired: false,
    issues: [],
    iconFlag: '',
    expiryDate: '2030-07-20'
  }],
  isInfant: false,
  documentsUpdate: []
};

const filterTypesDocsSecurityMock: IFilterTypesDocsSecurity = {
  loggedPassengerId: '',
  validTypesDocs: [],
  showTravelDocumentsLink: {
    showVisa: false,
    showBasicInfo: false
  }
};

const getTravelDocumentsMock: { documents: DocumentModel[], documentsTypesValid: TravelDocumentType[] } = {
  documents: [{
    id: '1',
    typeCode: '02',//02 - DNI
    typeDescription: 'DNI',
    countryCode: 'ES',
    number: '11122233L',
    isExpired: false,
    issues: [],
    iconFlag: '',
    expiryDate: '2030-07-20'
  }],
  documentsTypesValid: ['DNI']
};

const requiredFields: ApisRequiredFields[] = Object.values(ApisRequiredFields);

const passengers: ApisPassenger[] = [
  {
    requiredFields: requiredFields,
    mandatoryDocuments: [{
      documents: [{
        type: {
          code: 'PSPT',
          description: ''
        },
        issuerCountry: '',
        expiryDate: '',
        number: '',
        requiredFields: [],
        requiredFieldsOptions: []
      }]
    }],
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
  },
  {
    requiredFields: requiredFields,
    mandatoryDocuments: [{
      documents: [{
        type: {
          code: 'PSPT',
          description: ''
        },
        issuerCountry: '',
        expiryDate: '',
        number: '',
        requiredFields: [],
        requiredFieldsOptions: []
      }]
    }],
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
  }
];

describe('IbCheckinApisComponent', () => {
  let component: IbCheckinApisComponent;
  let fixture: ComponentFixture<IbCheckinApisComponent>;
  let mockModalService: jasmine.SpyObj<AJSModalServiceType>;
  let mockApisService: jasmine.SpyObj<IbCheckinApisService>;
  let mockDigitalDataService: jasmine.SpyObj<IbCheckinApisDigitalDataService>;
  //let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockAcceptService: jasmine.SpyObj<AcceptService>;
  //let mockSessionStorage: jasmine.SpyObj<CommonsSessionStorageService>;
  let fakeCommonsSessionStorageService = new StorageServiceMock();
  let mockTranslateService: TranslateServiceMock;
  let mockIbTravelDocumentService: jasmine.SpyObj<IbTravelDocumentService>;
  let mockIbSessionConfigService: jasmine.SpyObj<IbSessionConfigService>;
  let mockIbUtilsService: jasmine.SpyObj<IbUtilsService>;
  let mockIbCheckinApisUtilsService: jasmine.SpyObj<IbCheckinApisUtilsService>;

  beforeEach(async () => {
    fakeCommonsSessionStorageService.clear();
    mockModalService = jasmine.createSpyObj('AJSModalService', ['isWaiting', 'finishWaiting', 'isNotWaiting']);
    mockApisService = jasmine.createSpyObj('IbCheckinApisService', ['getApisInfo', 'redirectToCheckin', 'getFormDataApisModel', 'createFormDataApisModelHash', 'setApisFormError', 'setBlockForm', 'updateApisInfo', 'getInfoTravelDocuments', 'filterTypesDocsSecurity', 'getTravelDocumentsModalProps', 'searchPassengerFF', 'existCheckAllPassengersData']);
    mockDigitalDataService = jasmine.createSpyObj('IbCheckinApisDigitalDataService', [
      'setApisProcessAndStep',
      'updateApisDigitalData',
      'handleEventsTravelDocuemnts',
      'initApisDatalayer'
    ]);
    mockIbUtilsService = jasmine.createSpyObj('IbUtilsService', [
      'setTitlePage',
      'isResolutionToMobile'
    ]);
    mockIbCheckinApisUtilsService = jasmine.createSpyObj('IbCheckinApisUtilsService', [
      'updatePassengersSelected',
      'isErrorRelatedToConstraints',
      'checkUpdateTravelDocuments'
    ]);
    mockAcceptService = jasmine.createSpyObj('AcceptService', ['callAccept']);
    mockIbTravelDocumentService = jasmine.createSpyObj('IbTravelDocumentService', ['getTravelDocuments']);
    mockIbSessionConfigService = jasmine.createSpyObj('IbSessionConfigService', ['isUserLogged']);
    mockTranslateService = new TranslateServiceMock();
    mockIbSessionConfigService.isUserLogged.and.returnValue(false);
    mockIbCheckinApisUtilsService.checkUpdateTravelDocuments.and.returnValue([]);
    mockIbCheckinApisUtilsService.isErrorRelatedToConstraints.and.callFake((error: unknown) => {
      if (typeof error !== 'object' || error === null) return false;
      const constraintError = error as {
        isEstaConstraints?: boolean;
        isEesConstraints?: boolean;
        isEtiasConstraints?: boolean;
        isSeeAgent?: boolean;
      };
      return Boolean(
        constraintError.isEstaConstraints ||
        constraintError.isEesConstraints ||
        constraintError.isEtiasConstraints ||
        constraintError.isSeeAgent
      );
    });

    await TestBed.configureTestingModule({
      declarations: [IbCheckinApisComponent, TranslatePipeMock],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AJSModalService, useValue: mockModalService },
        { provide: IbCheckinApisService, useValue: mockApisService },
        { provide: IbCheckinApisDigitalDataService, useValue: mockDigitalDataService },
        { provide: IbUtilsService, useValue: mockIbUtilsService },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: AcceptService, useValue: mockAcceptService },
        { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
        { provide: IbTravelDocumentService, useValue: mockIbTravelDocumentService },
        { provide: IbUtilsService, useValue: mockIbUtilsService },
        { provide: IbCheckinApisUtilsService, useValue: mockIbCheckinApisUtilsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IbCheckinApisComponent);
    component = fixture.componentInstance;
    component.travelDocument = travelDocument;

    component.passengersIdCompleted = [1, 2];
    component.countPassengers = { all: 0, isSingle: false, isMulti: false };
    fakeCommonsSessionStorageService.set(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO, mockBookingInfo);
    fakeCommonsSessionStorageService.set(CheckinAppConstants.STORAGE_KEYS.USER_LOGGED, true);
    mockApisService.getApisInfo.and.returnValue(Promise.resolve(mockGetApisInfo));
    mockIbSessionConfigService.isUserLogged.and.returnValue(true);
    mockApisService.filterTypesDocsSecurity.and.returnValue(filterTypesDocsSecurityMock);
    mockIbTravelDocumentService.getTravelDocuments.and.returnValue(Promise.resolve(getTravelDocumentsMock));

    fixture.detectChanges();
    //await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    component.ngOnInit();
  });

  it('should keep showModalTravelRequirements=true when filter returns no validTypesDocs', async () => {
    mockIbSessionConfigService.isUserLogged.and.returnValue(true);
    mockApisService.filterTypesDocsSecurity.and.returnValue(filterTypesDocsSecurityMock);
    mockIbTravelDocumentService.getTravelDocuments.and.returnValue(Promise.resolve(getTravelDocumentsMock));

    await component.getTravelDocuments();
    expect(component.travelDocument.validTypesDocsSecurity).toEqual([]);
    expect(component.travelDocument.loggedPassengerId).toBe('');
    expect(mockIbTravelDocumentService.getTravelDocuments).not.toHaveBeenCalled();
    expect(component.showModalTravelRequirements).toBeTrue();
  });

  it('should open openTravelDocumentModal', () => {
    component.openTravelDocumentModal(['DNI']);
  });

  it('should open selectedTravelDocuments', () => {
    const doc: DocumentModel[] = [{
      id: '1',
      typeCode: '02',//02 - DNI
      typeDescription: 'DNI',
      countryCode: 'ES',
      number: '11122233L',
      isExpired: false,
      issues: [],
      iconFlag: '',
      expiryDate: '2030-07-20'
    }];
    const docSelected: DocumentModel[] = [{
      id: '1',
      typeCode: '02',//02 - DNI
      typeDescription: 'DNI',
      countryCode: 'ES',
      number: '11122233L',
      isExpired: false,
      issues: [],
      iconFlag: '',
      expiryDate: '2030-07-20'
    }]
    component.selectedTravelDocuments(doc, false);
    expect(component.travelDocument.documentSelected).toEqual(docSelected);
  });

  it('should format name and surname correctly', () => {
    expect(component.formatName('John', 'Doe')).toBe('John Doe');
    expect(component.formatName(undefined, 'Doe')).toBe('');
    expect(component.formatName('John', undefined)).toBe('');
  });

  it('should get full name with infant for mobile', () => {
    mockIbUtilsService.isResolutionToMobile.and.returnValue(true);
    const result = component.getFullNameInfant('John Doe', 'Baby Doe');
    expect(result).toBe('John Doe Baby Doe');
  });

  it('should get full name with infant for desktop', () => {
    mockIbUtilsService.isResolutionToMobile.and.returnValue(false);
    const result = component.getFullNameInfant('John Doe', 'Baby Doe');
    expect(result).toBe('John Doe + Baby Doe');
  });

  it('should get full name from passenger', () => {
    const passenger = {
      passengerBookingInfo: {
        name: 'John',
        surname: 'Doe',
        infant: { name: 'Baby', surname: 'Doe' },
        isUserLogged: true
      }
    } as unknown as ApisPassenger;
    mockIbUtilsService.isResolutionToMobile.and.returnValue(false);
    expect(component.getFullName(passenger)).toBe('john doe + baby doe');
  });

  it('should toggle accordion index', () => {
    component.openAccordionIndex = 1;
    component.toggleAccordion(1);
    expect(component.openAccordionIndex).toBe(-1);
    component.toggleAccordion(2);
    expect(component.openAccordionIndex).toBe(2);
  });

  it('should update overlay status for PENDING', () => {
    component.updateOverlayStatus(ApisPassengerState.PENDING);
    expect(component.overlayProps.isOpen).toBeTrue();
    expect(component.overlayProps.status).toBe('loading');
    expect(component.overlayProps.messageKey).toBe('DATA_BEING_VALIDATED');
  });

  it('should update overlay status for COMPLETED', () => {
    component.updateOverlayStatus(ApisPassengerState.COMPLETED);
    expect(component.overlayProps.isOpen).toBeTrue();
    expect(component.overlayProps.status).toBe('success');
    expect(component.overlayProps.messageKey).toBe('DATA_VALIDATED_AND_SAVED');
  });

  it('should update overlay status for CLOSE after timeout', (done) => {
    component.overlayProps.isOpen = true;
    component.updateOverlayStatus(ApisPassengerState.CLOSE);
    setTimeout(() => {
      expect(component.overlayProps.isOpen).toBeFalse();
      done();
    }, 1100);
  });

  it('should extract required fields from passengers', () => {
    component.extractRequiredFieldsFromPassengers(passengers);
    expect(component.requiredFields).toContain(ApisRequiredFields.HOME_COUNTRY);
    expect(component.requiredFields).toContain(ApisRequiredFields.PRIVACY_STATEMENT);
    expect(component.requiredFields).toContain(ApisRequiredFields.NATIONALITY);
    expect(component.requiredFields).toContain(ApisRequiredFields.NAME);
    expect(component.requiredFields).toContain(ApisRequiredFields.SURNAME);
    expect(component.requiredFields).toContain(ApisRequiredFields.DESTINATION_ADDRESS);
    expect(component.requiredFields).toContain(ApisRequiredFields.CONTACT_DATA);
    expect(component.requiredFields).toContain(ApisRequiredFields.EMERGENCY_DATA);
    expect(component.isMultiPassengers).toBeTrue();
  });

  it('should close unavailable modal', () => {
    component.isUnavailableModalOpen = true;
    component.passengerCheckInUnavailableModalProps.open = true;
    component['closeUnavailableModal']();
    expect(component.isUnavailableModalOpen).toBeFalse();
    expect(component.passengerCheckInUnavailableModalProps.open).toBeFalse();
  });

  it('should call redirectToCheckin', () => {
    component['redirectToCheckin']('/test');
    expect(mockApisService.redirectToCheckin).toHaveBeenCalledWith('/test');
  });

  it('should call continueFlow', () => {
    component.passengersIdCompleted = [1, 2];
    mockIbCheckinApisUtilsService.updatePassengersSelected.and.returnValue([1, 2]);
    component['continueFlow']();
    expect(mockModalService.isWaiting).toHaveBeenCalled();
    expect(mockAcceptService.callAccept).toHaveBeenCalledWith([1, 2], false, null, null);
  });

  it('should create the apisFormModel', async () => {

    const mockFormDataApisModel: ApisFormModel[] = [
      {
        formRef: {} as FormRefType,
        hashEnd: '',
        hashInit: '',
        passengerId: '1',
        state: 'pending'
      }
    ];

    component.passengers = [];

    mockApisService.getFormDataApisModel.and.returnValue(Promise.resolve(mockFormDataApisModel));
    await component.createFormModel();

    expect(component.apisFormModel.length).toBe(mockFormDataApisModel.length);
    expect(component.apisFormModel).toEqual(mockFormDataApisModel);
  });

  it('should change the model state when react form submit', () => {
    const passengerId = '1';
    const mockApisForm: FormDataApis = {
      personalData: {
        name: 'test'
      }
    } as FormDataApis;
    const mockFormDataApisModel: ApisFormModel[] = [
      {
        formRef: {} as FormRefType,
        hashEnd: '',
        hashInit: '',
        passengerId: '1',
        state: 'validated'
      }
    ];

    const mockResolve = jasmine.createSpy();
    const mockReject = jasmine.createSpy();

    component.passengersWithError = [passengerId];
    component.apisFormModel = mockFormDataApisModel;
    component.submitPromises.set(passengerId, { resolve: mockResolve, reject: mockReject });

    component.notifySubmitComplete(passengerId, mockApisForm);

    const model = component.apisFormModel.find(pass => pass.passengerId === passengerId);
    expect(model.state).toBe('validated');
    expect(model.model).toEqual(mockApisForm);
  });

  it('should include the passengerId in the array of passengersWithError', () => {
    const passengerId = '1';

    component.submitPromises = new Map();
    component.passengersWithError = [];

    component.getPassengerSubmitError(passengerId);

    expect(component.passengersWithError.includes(passengerId)).toBe(true);
  });

  it('should called the reject function if the passengerId exists in the submitPromises', () => {
    const passengerId = '1';
    const mockResolve = jasmine.createSpy();
    const mockReject = jasmine.createSpy();

    component.submitPromises.set(passengerId, { reject: mockReject, resolve: mockResolve });
    component.passengersWithError = [];

    component.getPassengerSubmitError(passengerId);

    expect(mockReject).toHaveBeenCalled();
  });

  it('should update the state to pending', () => {
    const passengerId = '1';
    const mockResolve = jasmine.createSpy();
    const mockReject = jasmine.createSpy();
    const mockFormDataApisModel: ApisFormModel[] = [
      {
        formRef: {} as FormRefType,
        hashEnd: '',
        hashInit: '',
        passengerId: '1',
        state: 'validated'
      }
    ];

    component.submitPromises.set(passengerId, { reject: mockReject, resolve: mockResolve });
    component.passengersWithError = [];
    component.apisFormModel = mockFormDataApisModel;

    component.getPassengerSubmitError(passengerId);

    expect(mockReject).toHaveBeenCalled();
  });

  it('should reject the passengerId and don\'t add it in the passengersWithError array', () => {
    const passengerId = '1';
    const mockResolve = jasmine.createSpy();
    const mockReject = jasmine.createSpy();
    component.passengersWithError = [passengerId];
    component.submitPromises.set(passengerId, { reject: mockReject, resolve: mockResolve });
    spyOn(component.submitPromises, 'has').and.callThrough();
    spyOn(component.submitPromises, 'get').and.callThrough();

    component.getPassengerSubmitError(passengerId);

    expect(component.submitPromises.has).toHaveBeenCalled();
    expect(component.submitPromises.get).toHaveBeenCalled();
    expect(component.passengersWithError.filter(id => id === passengerId).length).toBe(1);
  });


  describe('updatePassengerStatusForConstraints', () => {
    it('should have the documentation state', () => {
      const errorMock = {
        isEstaConstraints: true,
        isEesConstraints: false,
        isEtiasConstraints: false,
        isSeeAgent: false
      };
      const emitPassengerStatusMock: EmitPassengerStatus = {
        fullName: 'test',
        id: 1,
        index: 0,
        status: ApisPassengerState.PENDING
      };

      component.updatePassengerStatusForConstraints(errorMock, emitPassengerStatusMock);

      expect(emitPassengerStatusMock.status).toBe(ApisPassengerState.DOCUMENTATION);
      expect(emitPassengerStatusMock.showMessage).toBe(undefined);
      expect(emitPassengerStatusMock.message).toBe(undefined);
    });

    it('should have message and showMessage true', () => {
      const errorMock = {
        isEstaConstraints: false,
        isEesConstraints: true,
        isEtiasConstraints: false,
        isSeeAgent: false,
        message: 'test'
      };
      const emitPassengerStatusMock: EmitPassengerStatus = {
        fullName: 'test',
        id: 1,
        index: 0,
        status: ApisPassengerState.PENDING
      };

      component.updatePassengerStatusForConstraints(errorMock, emitPassengerStatusMock);

      expect(emitPassengerStatusMock.status).toBe(ApisPassengerState.DOCUMENTATION);
      expect(emitPassengerStatusMock.showMessage).toBe(true);
      expect(emitPassengerStatusMock.message).toBe('test');
    });
  });

  describe('handleError', () => {
    let mockEmitPassengerStatus: EmitPassengerStatus[];
    let mockFormDataApisModel: ApisFormModel[];

    beforeEach(() => {
      mockEmitPassengerStatus = [{
        fullName: 'test',
        id: 1,
        index: 0,
        status: ApisPassengerState.COMPLETED
      }];

      mockFormDataApisModel = [
        {
          formRef: {} as FormRefType,
          hashEnd: '',
          hashInit: '',
          passengerId: '1',
          state: 'pending'
        }
      ];
    });

    it('should change the passenger status to pending if the error is not an array', () => {
      const mockError = {}

      component.handleError(mockError, mockEmitPassengerStatus);

      expect(mockEmitPassengerStatus[0].status).toBe(ApisPassengerState.PENDING);
    });

    it('should change the passenger status to pending if the error is not an array', () => {
      const mockError: { id: number, errors: { code: string, description: string }[] }[] = [
        {
          "id": 1,
          "errors": [
            {
              "code": "API_DOCUMENT_EXPIRY_DATE",
              "description": "Requerido fecha de expiración de documento"
            }
          ]
        }
      ];
      component.apisFormModel = mockFormDataApisModel;

      component.handleError(mockError, mockEmitPassengerStatus);

      expect(mockEmitPassengerStatus[0].status).toBe(ApisPassengerState.PENDING);
      expect(mockFormDataApisModel[0].state).toBe('pending');
      expect(mockApisService.setApisFormError).toHaveBeenCalledWith(mockError[0].id.toLocaleString(), mockError[0].errors);
    });

    it('should change the passenger status to DOCUMENTATION if the error is related to constraints', () => {
      const mockError = [
        {
          "id": 1,
          "errors": {
            "isEstaConstraints": true,
            "isEesConstraints": false,
            "isEtiasConstraints": false,
            "message": "",
            "isSeeAgent": false
          }
        }
      ];
      component.apisFormModel = mockFormDataApisModel;

      component.handleError(mockError, mockEmitPassengerStatus);

      expect(mockEmitPassengerStatus[0].status).toBe(ApisPassengerState.DOCUMENTATION);
      expect(mockApisService.setApisFormError).toHaveBeenCalledWith(mockError[0].id.toLocaleString(), mockError[0].errors);
    });
  });

  describe('handleUnavailableGlobalCheckin', () => {
    beforeEach(() => {
      component.isGlobalSubmit = true;
      component.passengersIdCompleted = [];
      component.apisFormModel = [];
      component.emitPassengerStatus = [{
        fullName: 'test',
        id: 1,
        index: 0,
        status: ApisPassengerState.DOCUMENTATION
      }];
    });

    it('should update the openAccordionIndex if the passenger state is PENDING', () => {
      component.emitPassengerStatus[0].status = ApisPassengerState.PENDING;
      component.handleUnavailableGlobalCheckin();

      expect(component.openAccordionIndex).toBe(0);
      expect(component.isUnavailableModalOpen).toBe(false);
    });

    it('should continueFlow if some passengers has COMPLETED state', () => {
      component.emitPassengerStatus[0].status = ApisPassengerState.COMPLETED;

      component.handleUnavailableGlobalCheckin();

      expect(component.isGlobalSubmit).toBe(false);
      expect(component.dataCheckModalProps.open).toBe(false);
      expect(mockAcceptService.callAccept).toHaveBeenCalled();
    });

    it('should continueFlow if there are complete passengers', () => {
      component.passengersIdCompleted = [2];

      component.handleUnavailableGlobalCheckin();

      expect(component.isGlobalSubmit).toBe(false);
      expect(component.dataCheckModalProps.open).toBe(false);
      expect(mockAcceptService.callAccept).toHaveBeenCalled();
    });

    it('should close the modal if there are multiple passengers', () => {
      component.apisFormModel = [
        {
          passengerId: 1
        } as ApisFormModel,
        {
          passengerId: 2
        } as ApisFormModel
      ];

      component.handleUnavailableGlobalCheckin();

      expect(component.isUnavailableModalOpen).toBe(false);
      expect(component.passengerCheckInUnavailableModalProps.open).toBe(false);
      expect(component.isGlobalSubmit).toBe(false);
    });

    it('should redirect to /ibcoac if all the passengers have status DOCUMENTATION', () => {
      component.apisFormModel = [
        {
          passengerId: 1
        } as ApisFormModel
      ];

      component.handleUnavailableGlobalCheckin();

      expect(component.isGlobalSubmit).toBe(false);
      expect(mockApisService.redirectToCheckin).toHaveBeenCalledWith('/ibcoac');
    });
  });

  describe('finalizeSubmit', () => {
    let mockEmitPassengerStatus: EmitPassengerStatus[];
    beforeEach(() => {
      mockEmitPassengerStatus = [
        {
          fullName: 'test',
          id: 1,
          index: 0,
          status: ApisPassengerState.COMPLETED
        }
      ];

      component.passengers = [
        {
          id: '1',
          formStatus: ApisPassengerState.PENDING
        } as ApisPassenger
      ];
    });

    it('should continueFlow if exists completed passengers and don\'t exists passengers with state PENDING or DOCUMENTATION', () => {
      component.passengersIdCompleted = [1];
      spyOn(component, 'updateOverlayStatus');

      component.finalizeSubmit(mockEmitPassengerStatus);

      expect(mockApisService.setBlockForm).toHaveBeenCalledWith(mockEmitPassengerStatus[0].id.toLocaleString(), true);
      expect(component.emitPassengerStatus).toBe(mockEmitPassengerStatus);
      expect(component.updateOverlayStatus).toHaveBeenCalledWith(ApisPassengerState.CLOSE);
      expect(component.isGlobalSubmit).toBe(false);
      expect(mockAcceptService.callAccept).toHaveBeenCalled();
    });

    it('should open the accordion of the passenger with the first error is the state is PENDING', () => {
      component.openAccordionIndex = 1;
      mockEmitPassengerStatus[0].status = ApisPassengerState.PENDING;

      component.finalizeSubmit(mockEmitPassengerStatus);

      expect(component.openAccordionIndex).toBe(0);
    });

    it('should open the accordion of the passenger with the first error is the state is PENDING', () => {
      mockEmitPassengerStatus[0].status = ApisPassengerState.DOCUMENTATION;
      spyOn(component, 'showModalCheckinNotAvailable')
      const mockProps = { passenger: mockEmitPassengerStatus[0], isGlobalSubmit: true };

      component.finalizeSubmit(mockEmitPassengerStatus);

      expect(component.showModalCheckinNotAvailable).toHaveBeenCalledWith(mockProps);
    });
  });


  describe('onClickButtonContinue', () => {
    const mockFormRef = document.createElement('form');
    const mockGetData = jasmine.createSpy().and.returnValue({ personalData: { name: 'test', surname: 'test' } } as FormDataApis);
    const mockApisFormModel: ApisFormModel[] = [
      {
        passengerId: '1',
        hashEnd: '',
        hashInit: '',
        state: 'pending',
        formRef: {
          getData: mockGetData,
          ref: mockFormRef
        }
      } as ApisFormModel
    ];
    const mockPassengers: ApisPassenger[] = [
      {
        id: '1',
        formStatus: ApisPassengerState.PENDING
      } as ApisPassenger
    ];

    const setupCommonState = () => {
      component.apisFormModel = mockApisFormModel;
      component.openAccordionIndex = -1;
      spyOn(mockApisFormModel[0].formRef.ref, 'dispatchEvent').and.returnValue(true);
    };

    const setupDispatchEventResolve = () => {
      (mockApisFormModel[0].formRef.ref.dispatchEvent as jasmine.Spy).and.callFake(() => {
        setTimeout(() => {
          const resolveFunction = component['submitPromises'].get('1')?.resolve;
          if (resolveFunction) resolveFunction();
          mockApisFormModel[0].state = 'validated';
          mockApisFormModel[0].model = mockApisFormModel[0].formRef.getData();
        }, 0);
        return true;
      });
    };

    const setupDispatchEventReject = () => {
      (mockApisFormModel[0].formRef.ref.dispatchEvent as jasmine.Spy).and.callFake(() => {
        setTimeout(() => {
          const model = mockApisFormModel[0];
          const rejectFunction = component['submitPromises'].get('1')?.reject;
          if (rejectFunction) rejectFunction(model.passengerId);
          model.state = 'validated';
          model.model = model.formRef.getData();
        }, 0);
        return true;
      });
    };

    const expectCommonState = () => {
      expect(component.openAccordionIndex).toBe(0);
      expect(component.overlayProps.isOpen).toBe(true);
    };

    const sleep0 = () => new Promise<void>(r => setTimeout(r, 0));

    beforeEach(() => {
      component.passengersIdCompleted = [];
      component.countPassengers.all = 2;
      component.passengers = mockPassengers;
      mockApisService.getFormDataApisModel.and.returnValue(Promise.resolve(mockApisFormModel));
      spyOn(component, 'handleError');
      spyOn(component, 'finalizeSubmit');
    });

    it('should continue the flow', async () => {
      component.countPassengers.isMulti = true;
      component.countPassengers.all = 0;

      await component.onClickButtonContinue();
      await sleep0();

      expect(component.isGlobalSubmit).toBe(true);
      expect(mockAcceptService.callAccept).toHaveBeenCalled();
    });

    it('should don\'t do anything if don\'t have submit changes', async () => {
      component.passengers = mockPassengers;

      mockApisService.createFormDataApisModelHash.and.returnValue(Promise.resolve(''));

      await component.onClickButtonContinue();
      await sleep0();
    });

    it('should continue the flow if don\'t exists available passengers', async () => {
      component.apisFormModel = mockApisFormModel;
      component.passengers = mockPassengers;
      component.passengersIdCompleted = [1];

      mockApisService.createFormDataApisModelHash.and.returnValue(Promise.resolve('test'));

      await component.onClickButtonContinue();
      await sleep0();

      expect(component.apisFormModel[0].hashEnd).toBe(component.apisFormModel[0].hashInit);
      expect(mockAcceptService.callAccept).toHaveBeenCalled();
    });

    type Outcome = 'resolve' | 'reject';

    const execFlow = async (dispatchOutcome: Outcome, updateOutcome: Outcome) => {
      setupCommonState();

      if (dispatchOutcome === 'resolve') {
        setupDispatchEventResolve();
      } else {
        setupDispatchEventReject();
      }

      if (dispatchOutcome === 'reject') {
        mockApisService.updateApisInfo.and.stub();
      } else if (updateOutcome === 'resolve') {
        mockApisService.updateApisInfo.and.returnValue(Promise.resolve());
        mockApisService.existCheckAllPassengersData.and.returnValue(false);
      } else {
        mockApisService.updateApisInfo.and.callFake(() => {
          const p = Promise.reject(new Error('API ERROR'));
          p.catch(() => { });
          return p;
        });
      }

      try {
        await component.onClickButtonContinue();
      } catch (_e) {
        // no-op: los asserts lo validan
      }
      await sleep0();
    };

    interface CaseDef {
      title: string;
      dispatch: Outcome;
      update: Outcome;
      check: () => void;
    }

    const cases: CaseDef[] = [
      {
        title: 'execute the submits and call the processApiUpdate if all is correct',
        dispatch: 'resolve',
        update: 'resolve',
        check: () => {
          expect(component.finalizeSubmit).toHaveBeenCalled();
          expect(component.handleError).not.toHaveBeenCalled();

          expectCommonState();
          expect(component.overlayProps.status).toBe('success');
        }
      },
      // {
      //   title: 'execute the handleError if exists any error in processApiUpdate',
      //   dispatch: 'resolve',
      //   update: 'reject',
      //   check: () => {
      //     expect(component.finalizeSubmit).toHaveBeenCalled();
      //     expect(component.handleError).toHaveBeenCalled();

      //     expectCommonState();
      //     expect(component.overlayProps.status).not.toBe('success');
      //   },
      // },
      {
        title: 'open the partial modal if some passengers state is `validated`',
        dispatch: 'reject',
        update: 'reject',
        check: () => {
          expect(component.finalizeSubmit).not.toHaveBeenCalled();
          expect(component.handleError).not.toHaveBeenCalled();

          expect(mockModalService.isNotWaiting).toHaveBeenCalled();
          expect(component.dataCheckModalProps.open).toBe(true);
        }
      }
    ];

    cases.forEach(({ title, dispatch, update, check }) => {
      it(`should ${title}`, async () => {
        await execFlow(dispatch, update);
        check();
      });
    });
  });

  describe('dataCheckModalProps', () => {
    it('should reset global submit when use close method', () => {
      component.isGlobalSubmit = true;

      component.dataCheckModalProps.onClose();

      expect(component.isGlobalSubmit).toBe(false);
      expect(component.dataCheckModalProps.open).toBe(false);
    });

    it('should close the modal and call processApiUpdate if use primary button', () => {
      spyOn(component, 'callUpdateApisInfo');

      component.dataCheckModalProps.onPrimaryAction();

      expect(component.dataCheckModalProps.open).toBe(false);
      expect(component.callUpdateApisInfo).toHaveBeenCalled();
    });
  });

  describe('passengerDataIncompleteModalProps', () => {
    it('should close the modal when use the primary action', () => {
      component.passengerDataIncompleteModalProps.onPrimaryAction();

      expect(component.passengerDataIncompleteModalProps.open).toBe(false);
    });
  });

  describe('passengerCheckInUnavailableModalProps', () => {
    it('should handle unavailable checkin if is not global submit', () => {
      component.passengers[0].formStatus = ApisPassengerState.DOCUMENTATION;
      component.countPassengers.all = 1;

      component.isUnavailableModalGlobal = false;
      component.passengerCheckInUnavailableModalProps.onPrimaryAction();

      expect(mockApisService.redirectToCheckin).toHaveBeenCalledWith('/ibcoac');
    });

    it('should close modal if exists docs and is not global submit', () => {
      component.passengers[0].formStatus = ApisPassengerState.DOCUMENTATION;

      component.isUnavailableModalGlobal = false;
      component.passengerCheckInUnavailableModalProps.onPrimaryAction();

      expect(component.isUnavailableModalGlobal).toBe(false);
      expect(component.passengerCheckInUnavailableModalProps.open).toBe(false);
    });

    it('should handle unavailable checkin if is global submit', () => {
      component.isUnavailableModalGlobal = true;
      component.passengerCheckInUnavailableModalProps.onPrimaryAction();

      expect(component.isGlobalSubmit).toBe(false);
    });
  });

  describe('passengerStatusChange', () => {
    it('should continueFlow if is completed and single', () => {
      const context = {id: 1, index: 0, status: ApisPassengerState.COMPLETED};

      component.countPassengers.isMulti = false;
      spyOn(component, 'checkUserLogged').and.returnValue(false);

      component.passengerStatusChange(context);

      expect(component.dataCheckModalProps.open).toBe(false);
      expect(mockAcceptService.callAccept).toHaveBeenCalled();
    });
  });

  describe('travelDocumentsModalSaveProps', () => {
    it('should continueFlow when use secondaryAction', () => {
      component.travelDocumentsModalSaveProps.open = true;

      component.travelDocumentsModalSaveProps.onSecondaryAction();

      expect(mockModalService.isNotWaiting).toHaveBeenCalled();
      expect(component.travelDocumentsModalSaveProps.open).toBe(false);
    });
  });

  describe('showModalCheckinNotAvailable', () => {
    it('should do not do anything if status is not documentation', () => {
      const mockPassenger: EmitPassengerStatus = {
        fullName: 'test',
        id: 0,
        index: 0,
        status: ApisPassengerState.PENDING
      };
      const context = { isGlobalSubmit: false, passenger: mockPassenger };

      spyOn(fakeCommonsSessionStorageService, 'set');

      component.showModalCheckinNotAvailable(context);

      expect(component.isUnavailableModalOpen).toBe(false);
      expect(fakeCommonsSessionStorageService.set).not.toHaveBeenCalled();
    });

    it('should set apidocs in sessionStorage if status is documentation', () => {
      const mockPassenger: EmitPassengerStatus = {
        fullName: 'test',
        id: 0,
        index: 0,
        status: ApisPassengerState.DOCUMENTATION
      };
      const context = { isGlobalSubmit: false, passenger: mockPassenger };

      spyOn(fakeCommonsSessionStorageService, 'set');

      component.showModalCheckinNotAvailable(context);

      expect(component.isUnavailableModalOpen).toBe(true);
      expect(fakeCommonsSessionStorageService.set).toHaveBeenCalled();
      expect(component.isUnavailableModalGlobal).toBe(context.isGlobalSubmit);
    });

    [
      { isMulti: true },
      { isMulti: false }
    ].forEach(({ isMulti }) => {
      it('should set passenger unavailable modal status', () => {
        const mockPassenger: EmitPassengerStatus = {
          fullName: 'test',
          id: 0,
          index: 0,
          status: ApisPassengerState.DOCUMENTATION
        };
        const context = { isGlobalSubmit: false, passenger: mockPassenger };
        const expectedModalObj: PassengerCheckInUnavailableModalProps = {
          ...component.passengerCheckInUnavailableModalProps,
          open: true,
          buttonText: isMulti ? 'multiple' : 'single',
          fullName: mockPassenger.fullName,
          showMessage: false,
          message: ''
        };

        component.countPassengers.isMulti = isMulti;
        component.passengers[0].formStatus = ApisPassengerState.DOCUMENTATION;

        component.showModalCheckinNotAvailable(context);

        expect(component.passengerCheckInUnavailableModalProps).toEqual(expectedModalObj);
      });
    });
  });
});