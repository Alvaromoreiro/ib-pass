import { TestBed } from '@angular/core/testing';
import { OrderData } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { IbBookingPassengerInfoUtilsService } from '@src/app/shared/services/ib-booking-passenger-info/ib-booking-passenger-info-utils.service';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { IbBookingFlowDetectionService } from '@src/app/core/services/ib-booking-flow-detection.service';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { CommonsBrowserStorageService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';


describe('IbBookingPassengerInfoUtilsService', () => {
  let service: IbBookingPassengerInfoUtilsService;

  const fakeCommonsSessionStorageService = new StorageServiceMock()
  const fakeCommonsBrowserStorageService = new StorageServiceMock()
  const fakeFlowDetectionService = {
    detectFlow: jasmine.createSpy().and.returnValue({
      flow: 'BOOKING',
      isRedemption: false
    })
  }
  const fakeDigitalDataService = {
    emitEvent:jasmine.createSpy()
  }
  const mockPrice = {
        currency: 'EUR',
        fare: 5,
        tax:1,
        ticketingFee: 0,
        total:6
    }
  const mockSlices = [{
        arrivalDateTime: '2024-10-12 16:55',
        departureDateTime: '2024-10-12 15:50',
        segments:[{
            arrival:{
                code: "BIO",name: "Bilbao",terminal: null, city:{}
            },
            departure:{
                code: "MAD",name: "Madrid",terminal: '4', city:{}
            }
        }]
    }]
    const mockMandatoryDocs =[{
        code:'DN',
        number: '63729041C',
        description: 'DNI',
        showFields: {}
    }]

    const mockTravelDocumets = {
        documents:[
            {
                document_type: "DNI",
                document_number: "13179408V",
                expiry_date: "2500-07-21",
                country: "US",
                id: "PIU5ilTtv8TcwyPRvG"
            }
        ],
        meta:{
            timestamp: new Date(),
            additional_info: ''
        }
    }
    const mockCurrency = {
        code: 'EUR',
        description: 'Euro',
        symbol: '€',
        alignment: 'R',
        groupingSeparator: '.',
        decimalSeparator: ',',
        decimals: 2,
        recommendedDisplay: 'symbol'
    }
    const mockLanguage = [{
        code:'es',
        description:'Español',
        dateFormat:''
    }]

    const mockMarket = {
        code:'ES',
        description: 'España'
    }

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            { provide: CommonsBrowserStorageService, useValue: fakeCommonsBrowserStorageService },
            { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
          { provide: IbBookingFlowDetectionService, useValue: fakeFlowDetectionService },
            { provide: DigitalDataService, useValue: fakeDigitalDataService },
        ]
    });
    fakeCommonsBrowserStorageService.clear();
    fakeCommonsSessionStorageService.clear();
    fakeDigitalDataService.emitEvent.calls.reset();
    fakeFlowDetectionService.detectFlow.calls.reset();
    service = TestBed.inject(IbBookingPassengerInfoUtilsService);
   
  });

  describe('when createTemporalPNRKey is called',()=>{
    beforeEach(()=>{
        fakeCommonsSessionStorageService.set('generalLinksList',{
            'MANAGE_MY_BOOKING_LOGGED_LINK':
            {
                uri: '/manage-my-booking'
            }
        })
        fakeCommonsSessionStorageService.set(BkiStorageConstants.COMMERCIAL_DATA,{
            languages:[{
                code:'es',
                description:'Español',
                dateFormat:''
            }],
            market:{
                code:'ES',
                description: 'España'
            }
        })
    })
        it('it will create an object and it will be set to localStorage',()=>{
            fakeFlowDetectionService.detectFlow.and.returnValue({
              flow: 'BOOKING',
              isRedemption: false
            });

            service.createTemporalPNRKey({
                locSurEncrypt: 'pnrEncrypted',
                order: {
                    timeLimit: 'fecha' as unknown as Date,
                    slices: mockSlices,
                    price: mockPrice
                },
                passengers: [{
                    passengerType: 'ADT'
                },
                {
                    passengerType: 'ADT'
                },
                {
                    passengerType: 'CHD'
                }],
                contextMetadata: {
                    currencies: [{
                        code: 'EUR',
                        description: 'Euro',
                        symbol: '€',
                        alignment: 'R',
                        groupingSeparator: '.',
                        decimalSeparator: ',',
                        decimals: 2,
                        recommendedDisplay: 'symbol'
                    }]
                }
            } as unknown as OrderData)

            const response = {
                flightId: 'pnrEncrypted',
                timeLimitUTC: 'fecha',
                slices: mockSlices,
                retrieveBkiURL: '/manage-my-booking#!/chktrp?flightId=pnrEncrypted',
                price: mockPrice,
                currency: mockCurrency,
                languages: mockLanguage,
                market: mockMarket,
                passengers: [{
                    type: 'ADT',
                    number: 2
                },
                {
                    type: 'CHD',
                    number: 1
                }]
            }
            const stored = fakeCommonsBrowserStorageService.get<any>('temporalPNR')
            expect(stored.flightId).toEqual(response.flightId);
            expect(stored.timeLimitUTC).toEqual(response.timeLimitUTC);
            expect(stored.slices).toEqual(response.slices);
            expect(stored.retrieveBkiURL.includes(response.retrieveBkiURL)).toBeTruthy();
            expect(stored.price).toEqual(response.price);
            expect(stored.currency).toEqual(response.currency);
            expect(stored.languages).toEqual(response.languages);
            expect(stored.market).toEqual(response.market);
            expect(stored.passengers[0]).toEqual(response.passengers[0]);
            expect(stored.passengers[1]).toEqual(response.passengers[1]);
        })

          it('it will not create temporalPNR for redemption flow',()=>{
            fakeFlowDetectionService.detectFlow.and.returnValue({
              flow: 'BOOKING',
              isRedemption: true
            });

            service.createTemporalPNRKey({
              locSurEncrypt: 'pnrEncrypted',
              order: {
                timeLimit: 'fecha' as unknown as Date,
                slices: mockSlices,
                price: mockPrice
              },
              passengers: [{
                passengerType: 'ADT'
              }],
              contextMetadata: {
                currencies: [mockCurrency]
              }
            } as unknown as OrderData)

            const stored = fakeCommonsBrowserStorageService.get<any>('temporalPNR')
            expect(stored).toBeNull();
            expect(fakeDigitalDataService.emitEvent).not.toHaveBeenCalledWith('create_temporalPNR');
          })
  })
  describe('when deleteTemporalPNR is called',()=>{
    it('it will create an object and it will be set to localStorage',()=>{
        // spyOn(fakeDigitalDataService, 'emitEvent')
        service.deleteTemporalPNR();
        expect(fakeDigitalDataService.emitEvent).toHaveBeenCalledWith('remove_temporalPNR')
    })
  })

  describe('when addTravelDocs is called',()=>{
    it('it will update mandatory documents numbers with travel-documents response',()=>{
        service.addTravelDocs(mockMandatoryDocs, mockTravelDocumets);
        expect(mockMandatoryDocs[0].number).toEqual('13179408V')
    })
  })
  describe('when resetStoragedMandatoryDocs is called',()=>{
    it('it will reset mandatory documents numbers',()=>{
        service.resetStoragedMandatoryDocs(mockMandatoryDocs);
        expect(mockMandatoryDocs[0].number).toEqual('')
    })
  })

  describe('setMandatoryDocData', () => {
    const createMockForm = (code: string, description: string) => ({
      get: jasmine.createSpy('get').and.returnValue({
        get: jasmine.createSpy('get').and.callFake((field) => ({
          value: field === 'code' ? code : description
        })),
        value: { code, description }
      })
    }) as any;

    it('should return doc data when code and description exist', () => {
      const mockForm = createMockForm('NI', 'DNI');
      const result = service.setMandatoryDocData(mockForm, 0);
      expect(result).toEqual({ code: 'NI', description: 'DNI' });
    });

    it('should return null when data is missing', () => {
      const mockForm = createMockForm('', '');
      const result = service.setMandatoryDocData(mockForm, 0);
      expect(result).toBeNull();
    });
  })

  describe('setLargeFamilyDiscountData', () => {
    const createLargeFamilyForm = (hasData: boolean) => ({
      get: jasmine.createSpy('get').and.callFake((path: string) => {
        if (path === `communityCode_0`) {
          return { value: hasData ? { code: 'COM01' } : null };
        }
        if (path === `largeFamilyNumber_0.code`) {
          return { value: hasData ? 'CERT123' : '' };
        }
        if (path === `largeFamilyNumber_0.communityCodePattern`) {
          return { value: hasData ? 'PATTERN' : '' };
        }
        return null;
      })
    }) as any;

    it('should return family discount data when all required fields exist', () => {
      const mockForm = createLargeFamilyForm(true);
      const result = service.setLargeFamilyDiscountData(mockForm, 0);
      expect(result).toEqual({
        communityCode: { code: 'COM01' },
        largeFamilyCertificateNumber: 'CERT123',
        communityCodePattern: 'PATTERN'
      });
    });

    it('should return null when required data is missing', () => {
      const mockForm = createLargeFamilyForm(false);
      const result = service.setLargeFamilyDiscountData(mockForm, 0);
      expect(result).toBeNull();
    });
  })

  describe('Optional Documents Management', () => {
    describe('setOptionalDocumentsData', () => {
      const createMockForm = (hasValidData: boolean) => ({
        get: jasmine.createSpy('get').and.callFake((path: string) => {
          if (path === `optionalDocuments_0`) {
            return {
              get: jasmine.createSpy('get').and.callFake((field: string) => ({
                value: hasValidData ? 
                  (field === 'selectedDoc' ? { code: 'NI', description: 'DNI' } : '12345') : 
                  null
              }))
            };
          }
          return null;
        })
      }) as any;

      it('should handle valid and invalid cases', () => {
        const validForm = createMockForm(true);
        const invalidForm = createMockForm(false);

        expect(service.setOptionalDocumentsData(validForm, 0)).toEqual({
          code: 'NI',
          description: 'DNI',
          number: '12345'
        });
        expect(service.setOptionalDocumentsData(invalidForm, 0)).toBeNull();
      });
    });

    describe('setOptionalDocumentsStorage', () => {
      interface TestData {
        data: {
          optionalDoc?: { code: string }
        };
        optionalDocs?: {
          [key: string]: { code: string }
        };
      }

      const mockData: {
        validCase: { oldData: TestData; newData: TestData };
        invalidCase: { oldData: TestData; newData: TestData };
      } = {
        validCase: {
          oldData: { data: { optionalDoc: { code: 'TEST' } } },
          newData: { data: { }, optionalDocs: { doc1: { code: 'TEST' } } }
        },
        invalidCase: {
          oldData: { data: { optionalDoc: { code: 'TEST' } } },
          newData: { data: { }, optionalDocs: { doc1: { code: 'OTHER' } } }
        }
      };

      it('should handle document storage correctly', () => {
        const { validCase, invalidCase } = mockData;

        service.setOptionalDocumentsStorage(true, validCase.oldData, validCase.newData);
        expect(validCase.newData.data.optionalDoc).toEqual(validCase.oldData.data.optionalDoc);

        service.setOptionalDocumentsStorage(false, invalidCase.oldData, invalidCase.newData);
        expect(invalidCase.newData.data.optionalDoc).toBeUndefined();
      });
    });
  });

  describe('setFrequentFlyerData', () => {
    const createFrequentFlyerForm = (hasValidData: boolean) => ({
      get: jasmine.createSpy('get').and.callFake((path: string) => {
        if (path === `company_0`) {
          return { value: hasValidData ? { iataCompanyCode: 'IB' } : {} };
        }
        if (path === `number_card_0`) {
          return { value: hasValidData ? '123456789' : '' };
        }
        return null;
      })
    }) as any;

    it('should return frequent flyer data when all required fields exist', () => {
      const mockForm = createFrequentFlyerForm(true);
      const result = service.setFrequentFlyerData(mockForm, 0);
      expect(result).toEqual({
        company: { iataCompanyCode: 'IB' },
        number: '123456789'
      });
    });

    it('should return null when required data is missing', () => {
      const mockForm = createFrequentFlyerForm(false);
      const result = service.setFrequentFlyerData(mockForm, 0);
      expect(result).toBeNull();
    });
  });
});
