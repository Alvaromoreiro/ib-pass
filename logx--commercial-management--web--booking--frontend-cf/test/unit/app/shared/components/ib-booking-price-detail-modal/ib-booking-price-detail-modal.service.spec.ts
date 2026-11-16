import { TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { IbBookingCommonTotalPriceComponent } from '@src/app/shared/components/ib-booking-common-total-price/ib-booking-common-total-price.component';

import { IbBookingPriceDetailModalService } from '@src/app/shared/services/ib-booking-price-detail-modal/ib-booking-price-detail-modal.service'
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { IbBookingFlowUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-flow-utils.service';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { TranslatePipeMock } from 'test/mocks/pipes/TranslatePipeMock';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { TranslateServiceMock } from 'test/mocks/Services/TranslateServiceAngularMock';
import { AJSRootScope } from "ib-web-commons/utils";
import { RootScopeMock } from "test/mocks/class/RootScopeMock";
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';

class FakeAJSDatalayerUtilsService {
  updateDatalayerEvent = jasmine.createSpy('updateDatalayerEvent');
}

class IbCModalServiceMock {
  showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.callFake(() => {
    return {
      componentInstance: {},
      result: Promise.resolve()
    };
  });
}
class FakeIbBookingFlowUtilsServiceMock {
    checkAdaptativeMobileView = jasmine.createSpy( 'checkAdaptativeMobileView' ).and.callFake( () => true );
}

class FakeIbBookingUtilsServiceMock {
    checkAdaptativeMobileView = jasmine.createSpy( 'checkAdaptativeMobileView' ).and.callFake( () => true );
    getURLFirstParameterByName = jasmine.createSpy( 'getURLFirstParameterByName' ).and.returnValue('');
}

// Mock data with correct typing
const mockOfferItems: AvailabilityTransformerModel.OfferItem[] = [
  {
    offerItemId: '1',
    price: {
      fare: 80,
      tax: 20,
      total: 100,
      currency: 'EUR',
      ticketingFee: 0
    },
    passengerIds: ['ADT_1'],
    detailedTaxes: []
  }
];

const mockOfferItemsDiscounted: AvailabilityTransformerModel.OfferItem[] = [
  {
    offerItemId: '2',
    price: {
      fare: 90,
      tax: 10,
      total: 100,
      currency: 'EUR',
      ticketingFee: 0
    },
    passengerIds: ['ADT_1'],
    detailedTaxes: []
  }
];

describe('IbBookingPriceDetailModalService', () => {
  let service: IbBookingPriceDetailModalService;
  let fakeEvent: any;
  let translateServiceMock: TranslateServiceMock;
  let fakeIbCModalService: IbCModalServiceMock;
  let fakeCommonsSessionStorageService: StorageServiceMock;
  let fakeAJSDatalayerUtilsService: FakeAJSDatalayerUtilsService;
  let fakeIbBookingFlowUtilsService: FakeIbBookingFlowUtilsServiceMock;
  let fakeIbBookingUtilsService: FakeIbBookingUtilsServiceMock;
  let fakeRootScope: any;
  

  beforeEach(waitForAsync(() => {
    translateServiceMock = new TranslateServiceMock();
    fakeIbCModalService = new IbCModalServiceMock();
    fakeAJSDatalayerUtilsService = new FakeAJSDatalayerUtilsService();
    fakeCommonsSessionStorageService = new StorageServiceMock();
    fakeIbBookingFlowUtilsService = new FakeIbBookingFlowUtilsServiceMock();
    fakeIbBookingUtilsService = new FakeIbBookingUtilsServiceMock();
    fakeRootScope = {
      isRedemptionFlow: false,
      $on: jasmine.createSpy('$on'),
      $broadcast: jasmine.createSpy('$broadcast'),
      $emit: jasmine.createSpy('$emit')
    };


    TestBed.configureTestingModule({
      declarations: [IbBookingCommonTotalPriceComponent, TranslatePipeMock],
      imports: [],
      providers: [
        IbBookingPriceDetailModalService,
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: IbBookingFlowUtilsService, useValue: fakeIbBookingFlowUtilsService },
        { provide: IbCModalService, useValue: fakeIbCModalService },
        { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
        { provide: AJSDatalayerUtilsService, useValue: fakeAJSDatalayerUtilsService },
        { provide: AJSBookingUtilsService, useValue: fakeIbBookingUtilsService },
        { provide: AJSRootScope, useValue: fakeRootScope}
      ]
    })
      .compileComponents()
      .then(() => {
        service = TestBed.inject(IbBookingPriceDetailModalService);
      });

    fakeEvent = { preventDefault: jasmine.createSpy('preventDefault'), stopPropagation: jasmine.createSpy('stopPropagation')
     };
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('modal PriceDetails', () => {
    
    describe('should have data prepared correctly', () => {
      it('with normal fare items', () => {
        const mockFareData = {
          offers: [{
            discountsApplied: {
              originalOfferItems: mockOfferItems
            }
          }]
        };
        fakeCommonsSessionStorageService.set('fareData', mockFareData);
        
        const priceDetails = service.preparePriceDetails();
        expect(priceDetails).toEqual(jasmine.arrayContaining([
          jasmine.objectContaining({
            offerItemId: '1',
            price: jasmine.objectContaining({
              fare: 80,
              tax: 20,
              total: 100,
              currency: 'EUR'
            }),
            passengerIds: ['ADT_1']
          })
        ]));
      });

      it('with discounted fare items', () => {
        fakeCommonsSessionStorageService.set('fareData', {
          offers: [{ offerItems: mockOfferItemsDiscounted }]
        });
        const priceDetails = service.preparePriceDetails();
        expect(priceDetails).toEqual(jasmine.arrayContaining([
          jasmine.objectContaining({
            offerItemId: '2',
            price: jasmine.objectContaining({
              fare: 90,
              tax: 10,
              total: 100,
              currency: 'EUR'
            }),
            passengerIds: ['ADT_1']
          })
        ]));
      });
    });

    describe('should handle modal appropriately', () => {
      it('when opened', () => {
        fakeCommonsSessionStorageService.set('fareData', {
          offers: [{ discountsApplied: { originalOfferItems: { offer: 1 } } }]
        });
        service.openPriceDetailModal(fakeEvent);

        expect(fakeAJSDatalayerUtilsService.updateDatalayerEvent)
          .toHaveBeenCalledWith('modal resumen', 'clic', 'detalle', 'interaccion');
        expect(fakeIbCModalService.showGenericComponentModal).toHaveBeenCalled();
        expect(fakeEvent.preventDefault).toHaveBeenCalled(); // if your method calls it
      });
    });


    describe('checkShouldShowCTA method', () => {
        it('should return false if PRICE_DETAIL_MODAL_VIEW is false', () => {
            fakeCommonsSessionStorageService.set(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW, false);
            const result = service.checkShouldShowCTA();
            expect(result).toBeFalse();
        });

        it('should return false if flowStep is less than 2', () => {
            fakeCommonsSessionStorageService.set(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW, true);
            fakeCommonsSessionStorageService.set('loadingNextFlow', 1);
            const result = service.checkShouldShowCTA();
            expect(result).toBeFalse();
        });

        it('should return true if flowStep is less than 2 but flightType is ONHOLD_CONF', () => {
            fakeCommonsSessionStorageService.set(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW, true);
            fakeCommonsSessionStorageService.set('loadingNextFlow', 1);
            fakeCommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.ONHOLD_CONF);
            
            const result = service.checkShouldShowCTA();
            expect(result).toBeTruthy();
        });

        describe('when type is "header"', () => {
            beforeEach(() => {
                fakeCommonsSessionStorageService.set(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW, true);
                fakeCommonsSessionStorageService.set('loadingNextFlow', 2);
            });

            it('should return true if isAdaptativeFlow is true and isDEMarket is true', () => {
                const originalMarket = BookingAppConstants.market;
                BookingAppConstants.market = 'DE';
                fakeIbBookingFlowUtilsService.checkAdaptativeMobileView.and.returnValue(true);
                
                const result = service.checkShouldShowCTA('header');
                expect(result).toBeTruthy();
                
                // Restore original value
                BookingAppConstants.market = originalMarket;
            });

            it('should return false if isAdaptativeFlow is true and isDEMarket is false', () => {
                const originalMarket = BookingAppConstants.market;
                BookingAppConstants.market = 'ES';
                fakeIbBookingFlowUtilsService.checkAdaptativeMobileView.and.returnValue(true);
                
                const result = service.checkShouldShowCTA('header');
                expect(result).toBeFalsy();
                
                // Restore original value
                BookingAppConstants.market = originalMarket;
            });

            it('should return true if isAdaptativeFlow is false regardless of market', () => {
                const originalMarket = BookingAppConstants.market;
                BookingAppConstants.market = 'ES';
                fakeIbBookingFlowUtilsService.checkAdaptativeMobileView.and.returnValue(false);
                
                const result = service.checkShouldShowCTA('header');
                expect(result).toBeTruthy();
                
                // Restore original value
                BookingAppConstants.market = originalMarket;
            });
        });

        describe('when type is "mobile"', () => {
            beforeEach(() => {
                fakeCommonsSessionStorageService.set(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW, true);
                fakeCommonsSessionStorageService.set('loadingNextFlow', 2);
            });

            it('should return true if isDEMarket is true', () => {
                const originalMarket = BookingAppConstants.market;
                BookingAppConstants.market = 'DE';
                
                const result = service.checkShouldShowCTA('mobile');
                expect(result).toBeTruthy();
                
                // Restore original value
                BookingAppConstants.market = originalMarket;
            });

            it('should return false if isDEMarket is false', () => {
                const originalMarket = BookingAppConstants.market;
                BookingAppConstants.market = 'ES';
                
                const result = service.checkShouldShowCTA('mobile');
                expect(result).toBeFalsy();
                
                // Restore original value
                BookingAppConstants.market = originalMarket;
            });
        });

        describe('when type is undefined/default case', () => {
            beforeEach(() => {
                fakeCommonsSessionStorageService.set(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW, true);
                fakeCommonsSessionStorageService.set('loadingNextFlow', 2);
            });

            it('should return true for default case', () => {
                const result = service.checkShouldShowCTA();
                expect(result).toBeTruthy();
            });

            it('should return true for unknown type', () => {
                const result = service.checkShouldShowCTA('unknown');
                expect(result).toBeTruthy();
            });
        });

        describe('when flowStep conditions are met', () => {
            it('should return true when flowStep >= 2 and all other conditions are met', () => {
                fakeCommonsSessionStorageService.set(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW, true);
                fakeCommonsSessionStorageService.set('loadingNextFlow', 3);
                fakeCommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, 'availabilityFlight');
                
                const result = service.checkShouldShowCTA();
                expect(result).toBeTruthy();
            });

            it('should handle when loadingNextFlow is undefined (defaults to 0)', () => {
                fakeCommonsSessionStorageService.set(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW, true);
                fakeCommonsSessionStorageService.set('loadingNextFlow', undefined);
                fakeCommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, 'availabilityFlight');
                
                const result = service.checkShouldShowCTA();
                expect(result).toBeFalsy();
            });
        });
    });

    describe('initPriceModalData method', () => {
        beforeEach(() => {
            fakeIbBookingUtilsService.getURLFirstParameterByName.calls.reset();
            fakeRootScope.isRedemptionFlow = false;
        });

        it('should set PRICE_DETAIL_MODAL_VIEW to false when flight type is MULTITRIP', () => {
            fakeCommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP);
            
            service.initPriceModalData();
            
            expect(fakeCommonsSessionStorageService.get(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW)).toBeFalsy();
        });

        it('should set PRICE_DETAIL_MODAL_VIEW to false when flight type is METASEARCH', () => {
            fakeCommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH);
            
            service.initPriceModalData();
            
            expect(fakeCommonsSessionStorageService.get(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW)).toBeFalsy();
        });

        it('should set PRICE_DETAIL_MODAL_VIEW to false when isRedemptionFlow is true', () => {
            fakeCommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY);
            fakeRootScope.isRedemptionFlow = true;
            
            service.initPriceModalData();
            
            expect(fakeCommonsSessionStorageService.get(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW)).toBeFalsy();
        });

        it('should set PRICE_DETAIL_MODAL_VIEW to false when both flashOffer and flashOfferId are present', () => {
            fakeCommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY);
            fakeIbBookingUtilsService.getURLFirstParameterByName.and.callFake((param: string) => {
                if (param === 'flashOffer') return 'someOffer';
                if (param === 'flashOfferId') return 'someId';
                return '';
            });
            
            service.initPriceModalData();
            
            expect(fakeCommonsSessionStorageService.get(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW)).toBeFalsy();
            expect(fakeIbBookingUtilsService.getURLFirstParameterByName).toHaveBeenCalledWith('flashOffer');
            expect(fakeIbBookingUtilsService.getURLFirstParameterByName).toHaveBeenCalledWith('flashOfferId');
        });

        it('should set PRICE_DETAIL_MODAL_VIEW to true when only flashOffer is present (flashOfferId missing)', () => {
            fakeCommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY);
            fakeIbBookingUtilsService.getURLFirstParameterByName.and.callFake((param: string) => {
                if (param === 'flashOffer') return 'someOffer';
                if (param === 'flashOfferId') return '';
                return '';
            });
            
            service.initPriceModalData();
            
            expect(fakeCommonsSessionStorageService.get(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW)).toBeTruthy();
        });

        it('should set PRICE_DETAIL_MODAL_VIEW to true when only flashOfferId is present (flashOffer missing)', () => {
            fakeCommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY);
            fakeIbBookingUtilsService.getURLFirstParameterByName.and.callFake((param: string) => {
                if (param === 'flashOffer') return '';
                if (param === 'flashOfferId') return 'someId';
                return '';
            });
            
            service.initPriceModalData();
            
            expect(fakeCommonsSessionStorageService.get(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW)).toBeTruthy();
        });

        it('should set PRICE_DETAIL_MODAL_VIEW to true when no forbidden conditions are met', () => {
            fakeCommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY);
            fakeRootScope.isRedemptionFlow = false;
            fakeIbBookingUtilsService.getURLFirstParameterByName.and.returnValue('');
            
            service.initPriceModalData();
            
            expect(fakeCommonsSessionStorageService.get(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW)).toBeTruthy();
        });

        it('should set PRICE_DETAIL_MODAL_VIEW to false when multiple forbidden conditions are met', () => {
            fakeCommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP);
            fakeRootScope.isRedemptionFlow = true;
            fakeIbBookingUtilsService.getURLFirstParameterByName.and.callFake((param: string) => {
                if (param === 'flashOffer') return 'someOffer';
                if (param === 'flashOfferId') return 'someId';
                return '';
            });
            
            service.initPriceModalData();
            
            expect(fakeCommonsSessionStorageService.get(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW)).toBeFalsy();
        });

        it('should handle undefined flight type gracefully', () => {
            fakeCommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, undefined);
            fakeRootScope.isRedemptionFlow = false;
            fakeIbBookingUtilsService.getURLFirstParameterByName.and.returnValue('');
            
            service.initPriceModalData();
            
            expect(fakeCommonsSessionStorageService.get(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW)).toBeTruthy();
        });

        it('should handle null parameters from getURLFirstParameterByName', () => {
            fakeCommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY);
            fakeRootScope.isRedemptionFlow = false;
            fakeIbBookingUtilsService.getURLFirstParameterByName.and.returnValue(null);
            
            service.initPriceModalData();
            
            expect(fakeCommonsSessionStorageService.get(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW)).toBeTruthy();
        });
    });
  });
});
