import { TestBed } from '@angular/core/testing';
import { IbCheckinApisDigitalDataService } from './ib-checkin-apis-digital-data.service';
import {
  AJSDigitalDataServiceType,
  AJSDigitalDataService
} from '@src/app/shared/services/ib-datalayer/services/ib-cki-digital-data-service-bridge.service';
import {
  AJSDatalayerUtilsService,
  AJSDatalayerUtilsServiceType
} from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service-bridge.service';
import {
  AJSDatalayerService,
  AJSDatalayerServiceType
} from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-service-bridge.service';

describe('IbCheckinApisDigitalDataService', () => {
  let service: IbCheckinApisDigitalDataService;
  let DigitalDataServiceMock: jasmine.SpyObj<AJSDigitalDataServiceType>;
  let DatalayerUtilsServiceMock: jasmine.SpyObj<AJSDatalayerUtilsServiceType>;
  let DatalayerServiceMock: jasmine.SpyObj<AJSDatalayerServiceType>;

  beforeEach(() => {
    // Configuración del test
    DigitalDataServiceMock = jasmine.createSpyObj('AJSDigitalDataServiceType', [
      'addDigitalDataInfo',
      'getDigitalData'
    ]);
    DatalayerUtilsServiceMock = jasmine.createSpyObj('AJSDatalayerUtilsServiceType', [
      'addDataLayerInfo',
      'addDigitalDataInfo',
      'updateDatalayerEvent',
      'setTrackingCode'
    ]);
    DatalayerServiceMock = jasmine.createSpyObj('AJSDatalayerServiceType', ['setProcessAndStep']);

    TestBed.configureTestingModule({
      providers: [
        IbCheckinApisDigitalDataService,
        { provide: AJSDigitalDataService, useValue: DigitalDataServiceMock },
        { provide: AJSDatalayerUtilsService, useValue: DatalayerUtilsServiceMock },
        { provide: AJSDatalayerService, useValue: DatalayerServiceMock }
      ]
    });

    service = TestBed.inject(IbCheckinApisDigitalDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addDigitalDataInfo', () => {
    it('should call DigitalDataService.addDigitalDataInfo with the correct parameter', () => {
      const digitalDataMock = { key: 'value' };
      service.addDigitalDataInfo(digitalDataMock);
      expect(DigitalDataServiceMock.addDigitalDataInfo).toHaveBeenCalledWith(digitalDataMock);
    });
  });

  describe('updateApisDigitalData', () => {
    it('should update the Datalayer and emit an event', () => {
      const extendedDataLayer = { APIScumplimentados: 'SI' };
      const extendedDigitalDataInfo = { ApisCompleted: 'SI' };
      const event = {
        eventCategory: 'formulario de apis',
        eventAction: 'formulario completado',
        eventLabel: 'acceso a ocr',
        eventName: 'interaccion'
      };

      service.updateApisDigitalData();

      expect(DatalayerUtilsServiceMock.addDataLayerInfo).toHaveBeenCalledWith(extendedDataLayer);
      expect(DatalayerUtilsServiceMock.addDigitalDataInfo).toHaveBeenCalledWith(extendedDigitalDataInfo);
      expect(DatalayerUtilsServiceMock.updateDatalayerEvent).toHaveBeenCalledWith(
        event.eventCategory,
        event.eventAction,
        event.eventLabel,
        event.eventName
      );
    });
  });

  describe('getDigitalDataProcess', () => {
    it('should return undefined if the digital data is null', () => {
      DigitalDataServiceMock.getDigitalData.and.returnValue(null);

      const result = service.getDigitalDataProcess();

      expect(result).toBeUndefined();
    });
  });
});
