import { TestBed } from '@angular/core/testing';
import { IbCheckinApisModelTransformerService } from './ib-checkin-apis-model-transformer.service';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { ApisPassenger } from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import { ModelApisForm } from 'commercial-management--digital--web-components-design--library';
import { ApisPassengerState } from '@src/app/core/constants/ib-checkin-apis-constants';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
const mockBookingInfo = require('@test-mocks/localStorage/booking-info-apis-usa.json');

describe('IbCheckinApisModelTransformerService', () => {
  let service: IbCheckinApisModelTransformerService;
  let ibUtilsService: jasmine.SpyObj<IbUtilsService>;
  let commonsSessionStorageService = new StorageServiceMock();

  beforeEach(() => {
    commonsSessionStorageService.clear();
    ibUtilsService = jasmine.createSpyObj('IbUtilsService', ['getPassengerType']);

    TestBed.configureTestingModule({
      providers: [
        IbCheckinApisModelTransformerService,
        { provide: IbUtilsService, useValue: ibUtilsService },
        { provide: CommonsSessionStorageService, useValue: commonsSessionStorageService }
      ]
    });

    service = TestBed.inject(IbCheckinApisModelTransformerService);
    commonsSessionStorageService.set(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO, mockBookingInfo);
  });

  it('should transform the passenger form template correctly', () => {
    const passenger: ApisPassenger = {
      id: '1',
      additionalInfo: {
        disruptionContact: {
          email: 'test@example.com',
          phone: {
            countryCode: { code: 'ES', description: '' },
            number: '666666666'
          },
          language: ''
        },
        id: ''
      },
      emergencyContact: {
        phone: {
          countryCode: { code: 'ES', description: '' },
          number: '666666666'
        },
        name: 'Emergency Contact',
        refused: false
      },
      documents: [],
      mandatoryDocuments: [],
      optionalDocuments: [],
      gender: 'M',
      birthDate: '1990-01-01',
      name: 'Juan',
      surname: 'Pérez',
      nationality: { code: 'ES', description: '' },
      homeAddress: {
        country: { code: 'ES', description: '' }
      },
      requiredFields: [],
      passengerBookingInfo: {
        name: '',
        surname: ''
      },
      infantPassengerSecurityInformation: null,
      destinationAddress: {
        address: 'Calle Falsa',
        zipCode: '28080',
        city: 'Madrid',
        state: 'Madrid'
      },
      formStatus: ApisPassengerState.COMPLETED,
      inTransit: false
    };

    ibUtilsService.getPassengerType.and.returnValue('ADULT');

    const result: ModelApisForm = service.setApisFormModel(passenger);

    expect(result).toBeDefined();
    expect(result.typePassenger).toBe('ADULT');
    expect(result.personalData.name.value).toBe('Juan');
    expect(result.contactData.additionalInfo.email.value).toBe('test@example.com');
    expect(result.isPrivacyStatement).toBe(true);
  });
});
