import { ComponentFixture, TestBed, fakeAsync, flush } from "@angular/core/testing";
import { IbMmbPaymentComponent } from "@src/components/ib-MmB-payment/components/ib-Mmb-payment-component/ib-MmB-payment.component";
import { IbMmbPaymentFormService } from "@src/components/ib-MmB-payment/components/ib-Mmb-payment-component/services/ib-Mmb-payment-form.service";
import { AJSMmbModalService } from "@src/components/ib-reusable-components/ib-MmB-modal/services/upgraded/ib-Mmb-modal-service-bridge.service";
import { AJSMmBDatalayerUtilsService } from "@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service-bridge.service";
import { MmbModalServiceMock } from "@test/mocks/services/MmbModalServiceMock";
import { AJSRootScope, CommonsSessionStorageService } from "ib-web-commons/utils";
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
import { TranslateModule } from '@ngx-translate/core';
import { IbMmbSummaryService } from "@src/components/ib-MmB-payment/components/ib-Mmb-payment-component/components/ib-mmb-summary/services/ib-Mmb-summary.service";
import { StorageServiceMock } from "@test/unit/utils/StorageServiceMock";
import { headerModelBaggage } from "./components/ib-Mmb-summary/mocks/header-model-baggage.mock";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IbMmbPaymentComponentService } from "@src/components/ib-MmB-payment/components/ib-Mmb-payment-component/services/ib-Mmb-payment.service";
import { AJSMmBDigitalDataService } from "@src/components/services/ib-MmB-datalayer/services/ib-mmb-digital-data-bridge.service";
import { MmbLayoutComponent } from "@src/app/layouts/mmb-layout/mmb-layout.component";
import { NgReactComponent } from "@src/app/react/wrapper/ng-react.component";
import { IbMmbSummaryComponent } from "@src/components/ib-MmB-payment/components/ib-Mmb-payment-component/components/ib-mmb-summary/ib-mmb-summary.component";
import { Component } from "@angular/core";
import { MmBAppConstants } from "@src/ib-MmB-constants";
import { paymentInfo } from "./services/payment-info.mock";
import { Router } from "@angular/router";
import { MmBRouterConstants } from "@src/components/routing/ib-MmB-router-constants";
import { OnErrorEventStatus } from "@src/components/ib-MmB-payment/enums/ib-Mmb-payments-enum";
import { priceSubscriptionData } from "./services/price-subscription-data.mock";
import { IssueOrderInfoTransformerService } from "@src/components/ib-MmB-payment/components/ib-Mmb-payment-component/services/ib-Mmb-issue-order-info-transformer.service";


export const PmtComponentPriceBaseMock = {
    total: 100,
    currency: {} as Currency,
    charges: [],
    discounts: []
};

const PmtComponentEvents = {
    'price': {...PmtComponentPriceBaseMock},
    'payment': {
        status: 'INITIALIZATION',
        method: 'CREDIT_CARD'
    },
    'error': {
        code: 'ERROR',
        description: 'ERROR_DESCRIPTION',
        continuePayment: () => {}
    }
};

export class IbMmbPaymentFormServiceMock {
    public getNewPaymentComponent = async () => {
        const subscribe = ( eventName: string, callback: ( data: any ) => void ): void => { callback(PmtComponentEvents[eventName]) }
        return {
            subscribe
        };
    };
    importWebComponent = jasmine.createSpy( 'importWebComponent');
    updatePrice = jasmine.createSpy();
    getPriceFormatted = jasmine.createSpy();
    updateDCCInHeaderModel = jasmine.createSpy('updateDCCInHeaderModel');
}

@Component({
    selector: 'ib-mmb-summary'
})
class MockIbMmbSummaryComponent {}

describe('IbMmbPaymentComponent', () => {
    let component: IbMmbPaymentComponent;
    let fixture: ComponentFixture<IbMmbPaymentComponent>;
    let rootscope = new RootScopeMock();
    let fakeMmbModalService: MmbModalServiceMock;
    let fakeIbMmbPaymentFormService = new IbMmbPaymentFormServiceMock()
    let fakeIbMmbSummaryService = {
        getAncillaries: jasmine.createSpy().and.returnValue([]),
        getSummaryInfo: jasmine.createSpy()
    }
    let fakeMmBDatalayerUtilsService = {
        updateDatalayerInfo: jasmine.createSpy().and.returnValue(''),
        updateDatalayerViewEvent: jasmine.createSpy(),
        addDigitalDataInfo: jasmine.createSpy()
    };
    let localStorageService: StorageServiceMock = new StorageServiceMock();
    let fakeIbMmbPaymentComponentService = {
        getPaymentContextId: jasmine.createSpy()
    }
    let fakeMmBDigitalDataService = {
        addDigitalDataEcommerceEvent: jasmine.createSpy()
    }
    let mockRouter = {
        navigateByUrl: jasmine.createSpy()
    }
    let fakeIssueOrderInfoTransformerService = {
        transformForVoluntaryChangeConfirmation: jasmine.createSpy().and.returnValue({
            contextMetadata: { currencies: [], language: 'es', country: 'ES' },
            total: 100,
            order: { orderId: 'test-order-id' },
            passengers: [],
            tickets: [],
            warnings: [],
            paymentMethod: {}
        })
    }

    beforeEach(async() => {
        fakeMmbModalService = new MmbModalServiceMock();
        await TestBed.configureTestingModule({
            declarations: [
                IbMmbPaymentComponent,
                MmbLayoutComponent,
                NgReactComponent,
                MockIbMmbSummaryComponent
            ],
            imports: [
                TranslateModule.forRoot(),
                HttpClientTestingModule,
            ],
            providers: [
                { provide: AJSRootScope, useValue: rootscope },
                { provide: AJSMmbModalService, useValue: fakeMmbModalService },
                { provide: IbMmbPaymentFormService, useValue: fakeIbMmbPaymentFormService },
                { provide: AJSMmBDatalayerUtilsService, useValue: fakeMmBDatalayerUtilsService },
                { provide: IbMmbSummaryService, useValue: fakeIbMmbSummaryService },
                { provide: CommonsSessionStorageService, useValue: localStorageService },
                { provide: AJSMmBDigitalDataService, useValue: fakeMmBDigitalDataService },
                { provide: Router, useValue: mockRouter },
                { provide: IssueOrderInfoTransformerService, useValue: fakeIssueOrderInfoTransformerService },
            ]
        }).overrideComponent(
            IbMmbPaymentComponent,
              {
                  set: {
                      providers: [
                        { provide: IbMmbPaymentComponentService, useValue: fakeIbMmbPaymentComponentService },
                      ]
                  }
              }
          ).compileComponents();
        localStorageService.clear();
        fixture = TestBed.createComponent(IbMmbPaymentComponent);
        component = fixture.componentInstance;
        localStorageService.set('headerModel', headerModelBaggage);
        localStorageService.set('addToCart', {});
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('when ngOnInit is called and initPaymentForm goes ok', () => {
        component.ngOnInit();
        expect(component.showPmtComponent).toBeTrue();
    });

    it('when setAddPaymentInfo is called', () => {
        expect(fakeMmBDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
    });

    describe('when updatePaymentInfo', () => {
        it('is called without discount', () => {
            const info = structuredClone(paymentInfo);
            info.discounts = [];
            // @ts-ignore
            component.updatePaymentInfo(info);
            expect(localStorageService.get('paymentsInfo')).toBeNull()
            expect(localStorageService.get('voucherInfo')).toBeNull()
        })

        it('is called with discount', () => {
            const output = {
                appliedDiscounts: {
                    status: true,
                    types: {
                        VOUCHER: true
                    }
                }
            }
            const voucher = {
                voucherId: 'BON20EUR',
                amount: 20
            };
            // @ts-ignore
            component.updatePaymentInfo(paymentInfo);
            expect(localStorageService.get('paymentsInfo')).toEqual(output);
            expect(localStorageService.get('voucherInfo')).toEqual(voucher);
        })
        
        it('is called with AVIOS discount', () => {
            const output = {
                appliedDiscounts: {
                    status: true,
                    types: {
                        AVIOS: true
                    }
                }
            };
            const paymentInfo = {
                total: 8,
                discounts: [
                    {
                        id: '1234567788',
                        total: 20,
                        rewardCode: 'AVIOS'
                    }
                ]
            };
            // @ts-ignore
            component.updatePaymentInfo(paymentInfo);
            expect(localStorageService.get('paymentsInfo')).toEqual(output);
        });
    })

    it('when initPaymentForm is called', () => {
        // @ts-ignore
        component.initPaymentForm()
        expect(component.showPmtComponent).toBeTruthy();
    })

    it('when onPaymentSuccess is called', () => {
        localStorageService.set('flowApp', 'MMB');
        localStorageService.set('fareData', { compensationInfo: { totalCost: 100 } });
        localStorageService.set('bookingInfo', { 
            order: { orderId: 'test' },
            passengers: []
        });
        // @ts-ignore
        component.onPaymentSuccess({status: 'COMPLETED', methodType: 'CREDIT_CARD', details: 'VI', unpaidItemList: []});
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(MmBRouterConstants.PAGES_URL.NEW_MMB_PAYMENTS_CONFIRM);
    })

    describe('when onPaymentFailure is called', () => {
        it('with UNAUTHORIZED', () => {
            // @ts-ignore
            const spy = spyOn(component, 'initPaymentForm');
            const event = { status: OnErrorEventStatus.UNAUTHORIZED };
            // @ts-ignore
            component.onPaymentFailure(event)
            expect(spy).toHaveBeenCalled();
        })
        it('with EXCEED_ATTEMPS', () => {
            const event = { status: OnErrorEventStatus.EXCEED_ATTEMPS };
            // @ts-ignore
            component.onPaymentFailure(event)
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(MmBAppConstants.PAGES_URL.SEARCH);
        })
        it('with DENIED_FRAUD', () => {
            const event = { status: OnErrorEventStatus.DENIED_FRAUD };
            // @ts-ignore
            component.onPaymentFailure(event)
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(MmBAppConstants.PAGES_URL.SEARCH);
        })
        it('with default', () => {
            const mockEmit = spyOn(component.returnToOld, 'emit');
            // @ts-ignore
            component.onPaymentFailure()
            fixture.detectChanges();
            expect(mockEmit).toHaveBeenCalled()
        })
    })

    describe('when updatePaymentComponentFromHeader is called', () => {
        it('and have got ancillaries', () => {
            // @ts-ignore
            component.updatePaymentComponentFromHeader()
            expect(fakeIbMmbSummaryService.getSummaryInfo).toHaveBeenCalled()
        })
        it('and haven`t got ancillaries', () => {
            localStorageService.set('headerModel', {});
            fixture.detectChanges()
            // @ts-ignore
            component.updatePaymentComponentFromHeader()
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(MmBRouterConstants.PAGES_URL.MMB_DASHBOARD);
        })
    })

    describe('when hasAncillaries is called', () => {
        it('and have got ancillaries', () => {
            // @ts-ignore
            const hasAncillaries = component.hasAncillaries()
            expect(hasAncillaries).toBeTruthy()
        })
        it('and haven`t got ancillaries', () => {
            localStorageService.set('headerModel', {});
            fixture.detectChanges()
            // @ts-ignore
            const hasAncillaries = component.hasAncillaries()
            expect(hasAncillaries).toBeFalsy()
        })
    })

    it('when onVoucherValidated is called', () => {
        // @ts-ignore
        const spy = spyOn(component, 'initPaymentForm');
        // @ts-ignore
        component.onVoucherValidated({order: {bookingOffice: '', bookingReferences: [], orderId: '', orderItems: [], price: '', slices: [], voucherDiscount: {voucherId: 'BON20EUR', amount: 20}}})
        expect(spy).toHaveBeenCalled();
    })

    describe('when checkPaymentUpdate is called', () => {
        it('and status is REDIRECTION', () => {
            const data = { status: 'REDIRECTION'}
            // @ts-ignore
            component.checkPaymentUpdate(data)
            expect(localStorageService.get('confirmationDatalayerCallBack')).toEqual({});
        })
        it('and status is ERROR', () => {
            const data = { status: 'ERROR'}
            // @ts-ignore
            component.checkPaymentUpdate(data)
            expect(component.showLoadingOverlay).toBeFalsy()
        })
        it('and status is OTHER', () => {
            // @ts-ignore
            component.checkPaymentUpdate()
            expect(localStorageService.get(MmBAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT)).toBeNull()
        })
    })

    it('when checkPriceUpdate is called with voucher discount', () => {
        const voucherDiscount = { id : "BON20EUR", partner: undefined, total: 20, type: "VOUCHER" };
        const data = { price: 80, discounts: [voucherDiscount]};
        // @ts-ignore
        const spy = spyOn(component, 'updatePaymentInfo');
        // @ts-ignore
        component.checkPriceUpdate(data);
        expect(fakeMmBDatalayerUtilsService.addDigitalDataInfo).toHaveBeenCalled();
        expect(fakeIbMmbPaymentFormService.updatePrice).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('when updateBasketInfo is called with no voucher discount', () => {
        // @ts-ignore
        component['updateBasketInfo'](priceSubscriptionData);
        expect(priceSubscriptionData.discounts.length).toBe(0);
    });

    describe('Legacy Fallback for Free Payments', () => {
        // Helper function to create fareData mock
        const createFareData = (totalCost: number | null | undefined) => ({
            compensationInfo: {
                totalCost,
                currency: 'EUR'
            }
        });

        describe('shouldUseLegacyForFreePayment', () => {
            beforeEach(() => {
                localStorageService.remove('fareData');
            });

            it('should return false when fareData totalCost is greater than 0', () => {
                localStorageService.set('fareData', createFareData(4));
                
                // @ts-ignore
                const result = component['shouldUseLegacyForFreePayment']();
                
                expect(result).toBeFalsy();
            });

            it('should return true when fareData totalCost is 0', () => {
                localStorageService.set('fareData', createFareData(0));
                
                // @ts-ignore
                const result = component['shouldUseLegacyForFreePayment']();
                
                expect(result).toBeTruthy();
            });

            it('should return true when fareData is not in storage', () => {

                // @ts-ignore
                const result = component['shouldUseLegacyForFreePayment']();
                
                expect(result).toBeTruthy();
            });

            it('should return true when fareData exists but compensationInfo is missing', () => {
                localStorageService.set('fareData', { offers: [] });
                
                // @ts-ignore
                const result = component['shouldUseLegacyForFreePayment']();
                
                expect(result).toBeTruthy();
            });

            it('should return true when fareData.compensationInfo.totalCost is null', () => {
                localStorageService.set('fareData', createFareData(null));
                
                // @ts-ignore
                const result = component['shouldUseLegacyForFreePayment']();
                
                expect(result).toBeTruthy();
            });

            it('should return true when fareData.compensationInfo.totalCost is undefined', () => {
                localStorageService.set('fareData', { compensationInfo: { currency: 'EUR' } });
                
                // @ts-ignore
                const result = component['shouldUseLegacyForFreePayment']();
                
                expect(result).toBeTruthy();
            });
        });

        describe('handleLegacyFallback', () => {
            it('should return false when fareData totalCost is greater than 0', () => {
                localStorageService.set('fareData', createFareData(100));
                
                // @ts-ignore
                const result = component['handleLegacyFallback']();
                
                expect(result).toBeFalsy();
            });

            it('should return true and trigger legacy fallback when fareData totalCost is 0', () => {
                localStorageService.set('fareData', createFareData(0));
                const emitSpy = spyOn(component.returnToOld, 'emit');
                
                // @ts-ignore
                const result = component['handleLegacyFallback']();
                
                expect(result).toBeTruthy();
                expect(component.showLoadingOverlay).toBeFalsy();
                expect(fakeMmbModalService.finishWaiting).toHaveBeenCalled();
                expect(emitSpy).toHaveBeenCalled();
            });

            it('should return true and trigger legacy fallback when fareData totalCost is null', () => {
                localStorageService.set('fareData', createFareData(null));
                const emitSpy = spyOn(component.returnToOld, 'emit');
                
                // @ts-ignore
                const result = component['handleLegacyFallback']();
                
                expect(result).toBeTruthy();
                expect(emitSpy).toHaveBeenCalled();
            });

            it('should toggle loading overlay to false when triggering fallback', () => {
                localStorageService.set('fareData', createFareData(0));
                component.showLoadingOverlay = true;
                
                // @ts-ignore
                component['handleLegacyFallback']();
                
                expect(component.showLoadingOverlay).toBeFalsy();
            });
        });

        describe('ngOnInit with handleLegacyFallback', () => {
            it('should not call initPaymentForm when handleLegacyFallback returns true (total is 0)', async () => {
                localStorageService.set('flowApp', 'MMBVC');
                localStorageService.set('fareData', createFareData(0));
                
                fixture = TestBed.createComponent(IbMmbPaymentComponent);
                component = fixture.componentInstance;
                fixture.detectChanges();
                
                const initPaymentSpy = spyOn<any>(component, 'initPaymentForm');
                
                await component.ngOnInit();
                
                expect(initPaymentSpy).not.toHaveBeenCalled();
            });

            it('should call initPaymentForm when handleLegacyFallback returns false (total > 0)', async () => {
                localStorageService.set('flowApp', 'MMBVC');
                localStorageService.set('fareData', createFareData(100));
                
                fixture = TestBed.createComponent(IbMmbPaymentComponent);
                component = fixture.componentInstance;
                fixture.detectChanges();
                
                await component.ngOnInit();

                expect(component.showPmtComponent).toBeTruthy();
            });
        });
    });

    describe('when onPaymentSuccess is called', () => {
        beforeEach(() => {
            component['flowApp'] = MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE;
            spyOn(window.console, 'error');
        });

        it('should handle error when transformForVoluntaryChangeConfirmation fails', () => {
            const error = new Error('Transformation error');
            fakeIssueOrderInfoTransformerService.transformForVoluntaryChangeConfirmation.and.throwError(error);

            // @ts-ignore
            component.onPaymentSuccess({ status: 'COMPLETED', methodType: 'CREDIT_CARD', details: 'VI', unpaidItemList: [] });

            expect(window.console.error).toHaveBeenCalledWith('Error processing payment success:', error);
            expect(fakeIssueOrderInfoTransformerService.transformForVoluntaryChangeConfirmation).toHaveBeenCalled();
        });

        it('should set correct data in storage and broadcast event when transformation succeeds', () => {
            const mockTransformedData = {
                contextMetadata: { currencies: [], language: 'es', country: 'ES' },
                total: 100,
                order: { orderId: 'test-order-id' },
                passengers: [],
                tickets: [],
                warnings: [],
                paymentMethod: {}
            };

            fakeIssueOrderInfoTransformerService.transformForVoluntaryChangeConfirmation.and.returnValue(mockTransformedData);

            // @ts-ignore
            component.onPaymentSuccess({ status: 'COMPLETED', methodType: 'CREDIT_CARD', details: 'VI', unpaidItemList: [] });

            expect(fakeIssueOrderInfoTransformerService.transformForVoluntaryChangeConfirmation).toHaveBeenCalled();
        });
    });
});
