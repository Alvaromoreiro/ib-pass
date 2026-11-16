import type { FareDataModel } from '@core/models/generic-models/fare-models';
import { ComponentFixture, TestBed, fakeAsync, flush, flushMicrotasks } from '@angular/core/testing';
import { IbBookingPmtComponent } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-component/ib-booking-pmt.component';
import { AJSBookingModalService } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { BookingPageUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-page-utils.service';
import { AJSRootScope, CommonsCookiesService, CommonsSessionStorageService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { BookingModalServiceMock } from '@test-mocks/Services/BookingModalServiceMock';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { NewMainHeaderFacadeTokenMock } from '@test-mocks/class/NewMainHeaderFacadeMock';
import { RootScopeMock } from '@test-mocks/class/RootScopeMock';
import * as fullHeaderModel from 'test/unit/app/shared/components/ib-booking-header/mocks/HeaderModelRT.json';
import * as StorageOrder from '@test-mocks/storage/CreateOrderDataRT-simple-mock.json';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { IbBookingPmtServiceMock } from '@test-mocks/unit/app/pages/ib-booking-payments-page/IbBookingPmtServiceMock';
import { VoucherValidatedEvent } from '@src/app/core/models/ib-booking-payments/ib-booking-voucher-models';
import { Price, VoucherDiscountOrder } from '@src/app/core/models/ib-booking-payments/ib-booking-summary-model';
import { SummaryDefaultMock } from '@test-mocks/unit/app/pages/ib-booking-payments-page/SummaryComponentPropsMock';
import { IbBookingPmtService } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-component/services/ib-booking-pmt.service';
import { IbBookingPmtFormServiceMock } from '@test-mocks/unit/app/pages/ib-booking-payments-page/IbBookingPmtFormServiceMock';
import { IbBookingPmtFormService } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-component/services/ib-booking-pmt-form.service';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { IbPaymentOnholdOrderService } from '@src/app/shared/http-services/sse-orm/ib-payment-onhold-order.service';
import { IbBookingPmtDigitalDataService } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-component/services/ib-booking-pmt-digital-data.service';
import { TranslateService } from '@ngx-translate/core';
import { IbBookingPmtErrorsService } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-component/services/ib-booking-pmt-errors.service';
import { BookingRedirectionServiceMock } from '@test-mocks/class/BookingRedirectionServiceMock';
import { TranslateServiceMock } from '@test-mocks/Services/TranslateServiceAngularMock';
import { IbBookingPmtDigitalDataServiceMock } from '@test-mocks/class/PmtDigitalDataService';
import { IbBookingPmtErrorsServiceMock } from '@test-mocks/class/IbBookingPmtErrorsServiceMock';
import { Currency, CurrencyConversionModel, PmtRedirectionInfo, PriceSubscriptionModel } from '@src/app/core/models/ib-booking-payments/ib-booking-payments-model';
import { FareOnHoldOptions, ReferenceCity, TransformedTimeDateLimit } from '@src/app/core/models/generic-models/fare-models';
import { GetContextResponse } from '@src/app/shared/http-services/sse-orm/ib-payment-context.service';
import { MonetateUtilsServiceMock } from '@test-mocks/class/MonetateUtilsServiceMock';
import { AJSMonetateUtilsService } from '@src/app/shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';
import * as fareData from '@test-mocks/unit/app/pages/ib-booking-payments-page/ib-booking-pmt/FareDataWithOnHoldOptions.json';
import * as OnHoldCreateOrder from '@test-mocks/unit/app/pages/ib-booking-payments-page/ib-booking-pmt/OnHoldCreateOrder.json';
import * as PaymentFreeOnHoldResponse from '@test-mocks/unit/app/pages/ib-booking-payments-page/ib-booking-pmt/FreeOnHoldResponse.json';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { IbCUserUtilsServiceMock } from '@test-mocks/Services/IBCUserUtilsServiceMock';
import { IbBookingPmtSuccessEventService } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-component/services/ib-booking-pmt-success-event.service';
import { IbBookingPmtSuccessEventServiceMock } from '@test-mocks/unit/app/pages/ib-booking-payments-page/IbBookingPmtSuccessEventServiceMock';
import { NavigationManagerService } from '@src/app/core/services/navigation/ib-booking-navigation-manager.service';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
import { BkiPmtConstants } from '@src/app/core/constants/ib-booking-payments-constants';
import { DigitalDataConstants, DigitalDataProcess } from '@src/app/core/constants/ib-digital-data-constants';


class NavigationManagerServiceMock { 
    public init = jasmine.createSpy('init');
    public disableNavigation = jasmine.createSpy('disableNavigation');
}
class BookingPageUtilsServiceMock {
    public getFooterModel = jasmine.createSpy('getFooterModel');
}

class CommonsCookiesServiceMock {
    public get = jasmine.createSpy('get');
}

class IbPaymentOnholdOrderServiceMock {
    freeOnHoldOrder = jasmine.createSpy( 'freeOnHoldOrder' ).and.callFake( () => Promise.resolve( PaymentFreeOnHoldResponse ) );
}


class BookingUtilServiceMock {
    getURLFirstParameterByName = jasmine.createSpy( 'getURLFirstParameterByName' );
}


class AJSDatalayerUtilsServiceMock {
    updateDatalayerEvent = jasmine.createSpy('updateDatalayerEvent');
    updateDiscountData = jasmine.createSpy('updateDiscountData');
}

class IbCModalServiceMock {
    showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.callFake(() => {
        return { 
            componentInstance: {},
            result: Promise.resolve()
        }; 
    });
}

@Component({
    selector: 'ng-react',
    template: '<p></p>'
})
export class NgReactDummyComponent {
    @Input() props: any;
    @Input() component: any;
}
@Component({
    selector: 'ib-booking-total-onhold-free',
    template: '<p></p>'
})
export class FreeOnHoldTotalPriceDummy {
    @Input() totalPrice: string;
    @Input() conditionsText: string;
    @Input() onHoldPrice: string;
    @Output() freeOnHoldContinue = new EventEmitter<string>();
}
@Component({
    selector: 'ib-booking-voucher',
    template: '<p></p>'
})
export class VoucherDummy {
    @Input() public orderId: string;
    @Input() public currency: Currency;
    @Input() public currentVoucher: VoucherDiscountOrder;
    @Output() public voucherValidated = new EventEmitter<VoucherValidatedEvent>;
}

let fakeBookingModalService: BookingModalServiceMock;
let fakeAJSNewMainHeaderFacadeToken: NewMainHeaderFacadeTokenMock;
let fakeBookingPageUtilsService: BookingPageUtilsServiceMock;
let fakeCommonsCookiesService: CommonsCookiesServiceMock;
let fakeIbPaymentOnholdOrderService: IbPaymentOnholdOrderServiceMock;

let newPrice = <PriceSubscriptionModel> {
    total: 600,
    currency: <Currency> {},
    charges: [],
    discounts: [],
    currencyConversion: <CurrencyConversionModel> {}
};
let selectedOHOptions = <FareOnHoldOptions> {
    onHoldOptionId: '',
    hours: 48,
    securityMargin: 4,
    timeLimits: '',
    referenceTimeLimit: '',
    referenceCity: <ReferenceCity>{},
    price: <Price>{ total: 60 },
    transformedTimeDateLimit: <TransformedTimeDateLimit>{},
    onHoldPricePerPassenger: 5
};
let relatedContentMock = [{ key: 'TOTAL_PRICE', value: 'Total price, includes air fare, <a href=\"http://pree.iberia.es/es/taxes-and-government-fees/\" target=\"_blank\">taxes</a> (except those charged at certain airports at the time of check-in), handling fees, operator charges and selected options. Click <a href=\"http://pree.iberia.es/es/service-fees/\" target=\"_blank\">here</a> to check for any management fees for changes and refunds.' }];
describe('IbBookingPmtComponent', () => {
    let component: IbBookingPmtComponent;
    let fixture: ComponentFixture<IbBookingPmtComponent>;
    let rootscope = new RootScopeMock();
    let fakeIbBookingPmtService = new IbBookingPmtServiceMock();
    let fakeIbBookingPmtFormService = new IbBookingPmtFormServiceMock();
    let fakeSessionStorageService = new StorageServiceMock();
    let fakeBookingRedirectionService = new BookingRedirectionServiceMock();
    let fakeIbBookingPmtDigitalDataService = new IbBookingPmtDigitalDataServiceMock();
    let fakeTranslateService = new TranslateServiceMock();
    let fakeIbBookingPmtErrorsService = new IbBookingPmtErrorsServiceMock();
    let fakeAJSMonetateUtilsService = new MonetateUtilsServiceMock();
    let fakeAJSDatalayerUtilsService= new AJSDatalayerUtilsServiceMock();
    let fakeIbCModalService = new IbCModalServiceMock();
    let fakeNavigationManagerService = new NavigationManagerServiceMock();
    beforeEach( () => {
        fakeIbPaymentOnholdOrderService = new IbPaymentOnholdOrderServiceMock();
        fakeAJSNewMainHeaderFacadeToken = new NewMainHeaderFacadeTokenMock();
        fakeBookingModalService = new BookingModalServiceMock();
        fakeBookingPageUtilsService = new BookingPageUtilsServiceMock();
        fakeCommonsCookiesService = new CommonsCookiesServiceMock();
        fakeSessionStorageService.set( BkiStorageConstants.HEADER_MODEL, fullHeaderModel );
        fakeSessionStorageService.set( BkiStorageConstants.CREATE_ORDER_DATA, StorageOrder );
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [IbBookingPmtComponent, FreeOnHoldTotalPriceDummy, NgReactDummyComponent, VoucherDummy],
            imports: [

            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: AJSBookingModalService, useValue: fakeBookingModalService },
                { provide: AJSRootScope, useValue: rootscope },
                { provide: IbBookingHeaderFacadeService, useValue: fakeAJSNewMainHeaderFacadeToken },
                { provide: AJSMonetateUtilsService, useValue: fakeAJSMonetateUtilsService },
                { provide: CommonsCookiesService, useValue: fakeCommonsCookiesService },
                { provide: IbBookingPmtService, useValue: fakeIbBookingPmtService },
                { provide: CommonsSessionStorageService, useValue: fakeSessionStorageService },
                { provide: BookingPageUtilsService, useValue: fakeBookingPageUtilsService },
                { provide: IbBookingPmtFormService, useValue: fakeIbBookingPmtFormService },
                { provide: BookingRedirectionService, useValue: fakeBookingRedirectionService },
                { provide: IbPaymentOnholdOrderService, useValue: fakeIbPaymentOnholdOrderService },
                { provide: IbBookingPmtDigitalDataService, useValue: fakeIbBookingPmtDigitalDataService },
                { provide: TranslateService, useValue: fakeTranslateService },
                { provide: IbBookingPmtErrorsService, useValue: fakeIbBookingPmtErrorsService },
                { provide: AJSDatalayerUtilsService, useValue: fakeAJSDatalayerUtilsService },
                { provide: IbCModalService, useValue: fakeIbCModalService },
                { provide: AJSBookingUtilsService, useClass: BookingUtilServiceMock },
                { provide: IbCUserUtilsService, useClass: IbCUserUtilsServiceMock},
                { provide: IbBookingPmtSuccessEventService, useClass: IbBookingPmtSuccessEventServiceMock },
                { provide: NavigationManagerService, useValue: fakeNavigationManagerService }
            ]
        } ).overrideComponent(
            IbBookingPmtComponent,
            {
                set: {
                    providers: [
                        { provide: IbBookingPmtErrorsService, useValue: fakeIbBookingPmtErrorsService }

                    ]
                }
            }
        ).compileComponents();
        fixture = TestBed.createComponent(IbBookingPmtComponent);
        component = fixture.componentInstance;
        component['pmtContext'] = {contextId: 'contextId', contextType: 'PAYMENT', warnings: []} as GetContextResponse;
        component.renderPmtComponent = true;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    } );
    describe( 'when ngOnInit', () => {
        it( 'must call BookingModalService.finishWaiting', fakeAsync(() => {
            component.ngOnInit();
            flush();
            expect( fakeIbBookingPmtService.checkOnHoldForTitle ).toHaveBeenCalled();
            expect( component.summaryComponent.props ).toEqual( SummaryDefaultMock );
            expect( component.pageTitle ).toEqual( 'PAYMENTS_PAGE_TITLE' );
        }));
    });
    describe( 'when init fails', () => {
        it( 'should emit returnToOld', fakeAsync(() => {
            fakeIbBookingPmtFormService.getPaymentContext = jasmine.createSpy( 'getPaymentContextId' ).and.returnValue( Promise.reject( {} ) );
            component.ngOnInit();
            flush();
            expect( fakeIbBookingPmtErrorsService.handleContextError ).toHaveBeenCalled();
        }));
    });
    describe( 'when onVoucherValidated is called', () => {
        it( 'should set voucherDiscount', fakeAsync( () => {
            const order = { ...StorageOrder };
            order.order.voucherDiscount = <VoucherDiscountOrder>{};
            const voucher: VoucherValidatedEvent = <VoucherValidatedEvent> <unknown> { ...order };
            component['onVoucherValidated'](voucher);
            flush();
            expect( component.voucherDiscount ).toEqual( order.order.voucherDiscount );
        }));
    });
    describe( 'when showPassegenerTaxesModal is called', () => {
        it( 'should set summaryComponent props', fakeAsync( () => {
            component.ngOnInit();
            flush();
            component[ 'showPassegenerTaxesModal' ]( 'ADULT' );
            expect( fakeIbBookingPmtService.getPriceFormatted ).toHaveBeenCalled();
            expect( fakeIbBookingPmtService.showTaxesModal ).toHaveBeenCalled();
        } ) );
    } );
     describe( 'when checkPriceUpdate is called', () => {
        beforeEach( () => {
            fakeIbBookingPmtDigitalDataService.addDigitalDataInfo.calls.reset();
            fakeAJSNewMainHeaderFacadeToken.updateBasketOthers.calls.reset();
        } );

        it( 'is not an OnHold order', () => {
            component.onHoldOrder = false;
            component.currentOrder = {
                ...component.currentOrder,
                price: {
                    ...component.currentOrder.price,
                    total: 100,
                    tax: 33
                }
            } as any;

            const priceUpdate = {
                ...newPrice,
                total: 60
            };

            component[ 'checkPriceUpdate' ]( priceUpdate );

            expect( component.totalPrice.total ).toBe( 60 );
            expect( fakeIbBookingPmtDigitalDataService.addDigitalDataInfo ).toHaveBeenCalledWith(
                jasmine.objectContaining({[ DigitalDataConstants.TOTAL_PRICE ]: 60,[ DigitalDataConstants.TOTAL_PRICE_WITHOUT_TAXES ]: 27})
            );
        });

        it( 'it is an OnHold order', () => {
            component.onHoldOrder = true;
            component.onHoldOptions = <FareOnHoldOptions[]>[ {} ];
            component.currentOrder = {
                ...component.currentOrder,
                price: {
                    ...component.currentOrder.price,
                    total: 100,
                    tax: 33
                }
            } as any;

            const priceUpdate = {
                ...newPrice,
                total: 7
            };

            component[ 'checkPriceUpdate' ]( priceUpdate );

            expect( fakeAJSNewMainHeaderFacadeToken.updateBasketOthers ).toHaveBeenCalledWith(
                BkiPmtConstants.PAYMENT_TYPES.ONHOLD,jasmine.objectContaining({description: 'PRICE_BREAKDOWN_ON_HOLD',total: -7})
            );

            expect( component.totalPrice.total ).toBe( 100 );
            expect( fakeIbBookingPmtDigitalDataService.addDigitalDataInfo ).toHaveBeenCalledWith(
                jasmine.objectContaining({[ DigitalDataConstants.TOTAL_PRICE ]: 100,[ DigitalDataConstants.TOTAL_PRICE_WITHOUT_TAXES ]: 67})
            );
        });
    });
    describe( 'when getInitialSummary is called ', () => {
        it( 'and is an OnHold order', () => {
            component.selectedOnHoldOption = selectedOHOptions;
            component[ 'getInitialSummary' ]();
            expect( fakeIbBookingPmtService.getSummaryInfo ).toHaveBeenCalled();
        });
    } );
    describe( 'the view is resized', () => {
        it( 'it should trigger onResizeAction', () => {
            component[ 'onResizeAction' ]();
            expect( fakeAJSNewMainHeaderFacadeToken.checkAdaptativeMobileFlow ).toHaveBeenCalled();
        });
    });
    describe( 'when checkPaymentUpdate is called show overlay and', () => {
        beforeEach( () => {
            fakeIbBookingPmtService.redirectedPaymentTypeAction.calls.reset();
        } );
        it( 'it should redirect', () => {
            const data = { status: 'REDIRECTION'};
            component[ 'pmtContext' ] = <GetContextResponse> {};
            component[ 'checkPaymentUpdate' ]( data );
            expect( fakeNavigationManagerService.disableNavigation ).toHaveBeenCalledWith(true);
            expect( fakeAJSNewMainHeaderFacadeToken.blockNavigation ).toHaveBeenCalledWith(true);
            expect( fakeIbBookingPmtService.redirectedPaymentTypeAction ).toHaveBeenCalled();
        } );
        it( 'should hide overlay for error case', () => {
            spyOn<any>( component, 'toggleLoadingOverlay' ).and.callThrough();
            const data = { status: 'ERROR' };
            component[ 'checkPaymentUpdate' ]( data );
            expect( fakeNavigationManagerService.disableNavigation ).toHaveBeenCalledWith(true);
            expect( fakeAJSNewMainHeaderFacadeToken.blockNavigation ).toHaveBeenCalledWith(true);
            expect( fakeIbBookingPmtService.redirectedPaymentTypeAction ).not.toHaveBeenCalled();
            expect( component[ 'toggleLoadingOverlay' ] ).toHaveBeenCalled();
        });
    } );
    describe( 'when checkContextCall is called', () => {
        beforeEach( () => {
            fakeIbBookingPmtService.redirectedPaymentTypeAction.calls.reset();
        } );
        it( 'should check free OnHold order', fakeAsync(() => {
            let onHoldOption = {...selectedOHOptions};
            onHoldOption.price.total = 0;
            component.onHoldOrder = true;
            component.selectedOnHoldOption = onHoldOption;
            fakeSessionStorageService.set( BkiStorageConstants.AVAILABILITY_RELATED_CONTENT, relatedContentMock );
            const context = component[ 'checkContextCall' ]();
            flushMicrotasks();
            context.then( (context) => {
                expect( context ).toEqual( null );
            } );

        } ) );
        it( 'check redirectionPmtContext', fakeAsync( () => {
            spyOn<any>( component, 'toggleLoadingOverlay' ).and.callThrough();
            fakeSessionStorageService.set( BkiStorageConstants.PMT_REDIRECTION_CONTEXT, <PmtRedirectionInfo> {contextResponse: <GetContextResponse>{contextId: 'context', warnings: [{code: 'PMT_CTX_RESIDENT_NOT_VERIFIED', description: ''}]}, paymentCompleted: true} );
            const context = component[ 'checkContextCall' ]();
            flushMicrotasks();
            context.then(()=>{
                expect( component[ 'toggleLoadingOverlay' ] ).toHaveBeenCalled();
            });
        } ) );
    } );
    describe( 'when payment fails', () => {
        it( 'it should check status case UNAUTHORIZED', fakeAsync( () => {
            spyOn<any>( component, 'initPaymentForm' ).and.callThrough();
            component[ 'onPaymentFailure' ]( { status: 'UNAUTHORIZED' } ).then( () => {
                expect( fakeNavigationManagerService.disableNavigation ).toHaveBeenCalledWith(false);
                expect( fakeAJSNewMainHeaderFacadeToken.blockNavigation ).toHaveBeenCalledWith(false);
                expect( component[ 'initPaymentForm' ] ).toHaveBeenCalled();
            });
        } ) );
        it( 'it should check status case UNKNOWN', fakeAsync( () => {
            spyOn<any>( component, 'redirectToOld' ).and.callThrough();
            component[ 'onPaymentFailure' ]( { status: 'UNKNOWN' } ).then( () => {
                expect( fakeNavigationManagerService.disableNavigation ).toHaveBeenCalledWith(false);
                expect( fakeAJSNewMainHeaderFacadeToken.blockNavigation ).toHaveBeenCalledWith(false);
                expect( component[ 'redirectToOld' ] ).toHaveBeenCalled();
            });
        } ) );
        it( 'it should check status case DENIED_FRAUD', fakeAsync( () => {
            component[ 'onPaymentFailure' ]( { status: 'DENIED_FRAUD' } ).then( () => {
                expect( fakeNavigationManagerService.disableNavigation ).toHaveBeenCalledWith(false);
                expect( fakeAJSNewMainHeaderFacadeToken.blockNavigation ).toHaveBeenCalledWith(false);
                expect( rootscope.$broadcast ).toHaveBeenCalled();
            });
        } ) );
        it( 'it should check status case default', fakeAsync( () => {
            component[ 'onPaymentFailure' ]( { status: '' } as any ).then( () => {
                expect( fakeNavigationManagerService.disableNavigation ).toHaveBeenCalledWith(false);
                expect( fakeAJSNewMainHeaderFacadeToken.blockNavigation ).toHaveBeenCalledWith(false);
                expect( fakeIbBookingPmtErrorsService.displayGenericError ).toHaveBeenCalled();
            });
        } ) );
    } );
    describe( 'when onPaymentSuccess is called', () => {
        it( 'it should check data from event and redirect to confirmation view', fakeAsync( () => {
            spyOn<any>( component, 'confirmationRedirect' ).and.callThrough();
            component[ 'onPaymentSuccess' ]( { status: 'COMPLETED', methodType: 'CREDIT_CARD', details: { creditCardType: 'VI' }, unpaidItemList: [] } ).then( () => {
                expect( fakeNavigationManagerService.disableNavigation ).toHaveBeenCalledWith(false);
                expect( fakeAJSNewMainHeaderFacadeToken.blockNavigation ).toHaveBeenCalledWith(false);
                expect( component[ 'confirmationRedirect' ] ).toHaveBeenCalled();
            } );
        } ) );
        it('should persist unpaid items before redirecting to confirmation', fakeAsync(() => {
            spyOn<any>(component, 'confirmationRedirect').and.callThrough();

            component['onPaymentSuccess']({
                status: 'COMPLETED',
                methodType: 'CREDIT_CARD',
                details: { creditCardType: 'VI' },
                unpaidItemList: { type: 'INSURANCE' }
            } as any);

            flush();

            const storedUnpaidItems = fakeSessionStorageService.get(BkiStorageConstants.PMT_UNPAID_ITEM_LIST);

            expect(storedUnpaidItems).toEqual([{ type: 'INSURANCE' }]);
            expect(component['confirmationRedirect']).toHaveBeenCalled();
        }));

    } );
    describe( 'when is OnHold Free Reservation Flow', () => {
        beforeEach( () => {
            fakeSessionStorageService.set( BkiStorageConstants.ONHOLD_ORDER, true );
            fakeSessionStorageService.set( BkiStorageConstants.FARE, fareData );
            fakeSessionStorageService.set( BkiStorageConstants.CREATE_ORDER_DATA, OnHoldCreateOrder );
            const ohOption = fakeSessionStorageService.get<FareDataModel>( BkiStorageConstants.FARE ).offers[ 0 ].onHoldOptions[ 0 ];
            component['fareData'] = fakeSessionStorageService.get( BkiStorageConstants.FARE );
            component.onHoldOrder = fakeSessionStorageService.get( BkiStorageConstants.ONHOLD_ORDER );
            component.onHoldOptions = fakeSessionStorageService.get<FareDataModel>( BkiStorageConstants.FARE ).offers[ 0 ].onHoldOptions;
            component.selectedOnHoldOption = ohOption;
        } );
        it( 'it should check if OnHold Free and initialize', fakeAsync( () => {
            component.ngOnInit();
            flushMicrotasks();
            expect( component.selectedOnHoldOption.price.total ).toEqual( 0 );
        } ) );
        it( 'should change the selected option', fakeAsync( () => {
            component.onHoldOptions = component[ 'fareData' ].offers[ 0 ]?.onHoldOptions;
            component[ 'changeSelectedOnHoldOption' ]( 'IB01552b9105b24faeba8e902a1a266ef7OP_01' );
            flushMicrotasks();
            expect( component.selectedOnHoldOption.onHoldOptionId ).toEqual( 'IB01552b9105b24faeba8e902a1a266ef7OP_01' );
        } ) );
        it( 'it should pay and continue', fakeAsync( () => {
            component.ngOnInit();
            flushMicrotasks();
            component.onFreeOnHoldContinue().then( () => {
                expect( component.selectedOnHoldOption.onHoldOptionId ).toEqual( 'IB01552b9105b24faeba8e902a1a266ef7OP_01' );
            } );
        } ) );
        it( 'it should check single onHoldOption and initialize', fakeAsync( () => {
            const ohSingleOption: FareOnHoldOptions[] = [];
            ohSingleOption.push( fakeSessionStorageService.get<FareDataModel>( BkiStorageConstants.FARE ).offers[ 0 ].onHoldOptions[ 1 ] );
            component.onHoldOptions = ohSingleOption;
            component[ 'initSingleOnHoldOptionMode' ]();
            expect( fakeIbBookingPmtService.setTimeOnHoldProps ).toHaveBeenCalled();
        } ) );
        it( 'should display error on freeOnHoldOrder call rejection', fakeAsync(() => {
            fakeIbPaymentOnholdOrderService.freeOnHoldOrder = jasmine.createSpy( 'freeOnHoldOrder' ).and.callFake( () => Promise.reject() );
            component.ngOnInit();
            flushMicrotasks();
            component.onFreeOnHoldContinue().catch( () => {
                expect( fakeIbBookingPmtErrorsService.displayGenericError ).toHaveBeenCalled();
            } );
        } ) );
        afterAll( () => {
            fakeSessionStorageService.remove( BkiStorageConstants.ONHOLD_ORDER );
            fakeSessionStorageService.remove( BkiStorageConstants.FARE );
        } );
    });
    describe('when window resize event is triggered', () => {
        it('should call onResizeAction', () => {
            spyOn(component, 'onResizeAction');
            
            const resizeEvent = new Event('resize');
            window.dispatchEvent(resizeEvent);
            
            expect(component.onResizeAction).toHaveBeenCalled();
        });
        
        it('should update showAdaptativeMobileFlow when onResizeAction is called', () => {
            fakeAJSNewMainHeaderFacadeToken.checkAdaptativeMobileFlow.and.returnValue(true);
            
            component.onResizeAction();
            
            expect(fakeAJSNewMainHeaderFacadeToken.checkAdaptativeMobileFlow).toHaveBeenCalled();
            expect(component.showAdaptativeMobileFlow).toBe(true);
        });
    });

    describe('When initAuthPaymentForm is called', () => {
        beforeEach(() => {
            const IbCUserUtilsService= component['IbCUserUtilsService'] as unknown as IbCUserUtilsServiceMock;
            IbCUserUtilsService.isSoftUser = jasmine.createSpy('isSoftUser').and.returnValue(true);
            fakeCommonsCookiesService.get = jasmine.createSpy('get').and.callFake((key) => key === 'IBERIACOM_SSO_ACCESS_SALESFORCE' ? 'dummySalesforceToken' : null);
        });
        it('should not return salesforce token for softUser', ()=> {
            const initAuthPaymentForm = component['initAuthPaymentForm'];
            const authData = initAuthPaymentForm();
            expect(authData.additionalTokens.length).toEqual(0);
        });
        it('should should not return salesforce token when is not token', ()=> {
            fakeCommonsCookiesService.get = jasmine.createSpy('get').and.callFake((key) => key ===  null);
            const initAuthPaymentForm = component['initAuthPaymentForm'];
            const authData = initAuthPaymentForm();
            expect(authData.additionalTokens.length).toEqual(0);
        });
        it('should return salesforce token when is not soft', ()=> {
            const IbCUserUtilsService= component['IbCUserUtilsService'] as unknown as IbCUserUtilsServiceMock;
            IbCUserUtilsService.isSoftUser = jasmine.createSpy('isSoftUser').and.returnValue(false);
            const initAuthPaymentForm = component['initAuthPaymentForm'];
            const authData = initAuthPaymentForm();
            expect(authData.additionalTokens[0].key).toEqual('X-Salesforce-Token');
        });

    });
    describe( 'when initPaymentForm is called', () => {
        let initAnalyticsSpy: jasmine.Spy;

        beforeEach( () => {
            initAnalyticsSpy = spyOn<any>( component, 'initAnalytics' );
        } );

        it( 'should call initAnalytics when initPaymentForm resolves', fakeAsync( () => {
            fakeIbBookingPmtFormService.getPaymentContext = jasmine.createSpy( 'getPaymentContext' ).and.returnValue( Promise.resolve({contextId:'context', warnings:[]}) );
            fakeIbBookingPmtFormService.getNewPaymentComponent = jasmine.createSpy( 'getNewPaymentComponent' ).and.returnValue(
                Promise.resolve( {
                    init: jasmine.createSpy( 'init' ).and.returnValue( Promise.resolve() ),
                    subscribe: jasmine.createSpy( 'subscribe' ),
                } )
            );
            component[ 'initPaymentForm' ]();
            flush();
            expect( initAnalyticsSpy ).toHaveBeenCalled();
        } ) );

        it( 'should not call initAnalytics when initPaymentForm rejects', fakeAsync( () => {
            fakeIbBookingPmtFormService.getNewPaymentComponent = jasmine.createSpy( 'getNewPaymentComponent' ).and.returnValue(
                Promise.reject( new Error( 'Payment component error' ) )
            );
            try{
                component[ 'initPaymentForm' ]();
                flush();
            }catch(e){
                expect( initAnalyticsSpy ).not.toHaveBeenCalled();
            }
        } ) );
    } );
    describe('when setConfirmationQuadrigam is called', () => {
        beforeEach(() => {
            fakeIbBookingPmtService.getConfirmationPageQuadrigam.calls.reset();
        });

        it('should set confirmation quadrigam using onHoldOrder and confirm digital data process', () => {
            component.onHoldOrder = true;

            fakeSessionStorageService.set(BkiStorageConstants.CONFIRM_DIGITALDATA_INFO, {
                [DigitalDataConstants.PROCESS]: DigitalDataProcess.ONHOLD_CONFIRMATION
            });

            fakeIbBookingPmtService.getConfirmationPageQuadrigam.and.returnValue('RTBKCD');

            component['setConfirmationQuadrigam']();

            expect(fakeIbBookingPmtService.getConfirmationPageQuadrigam)
                .toHaveBeenCalledWith(true, DigitalDataProcess.ONHOLD_CONFIRMATION);

            expect(component['pmtDDModelInfo'].quadrigams.confirmation).toEqual('RTBKCD');
        });

        it('should set confirmation quadrigam with undefined process when confirm digital data is empty', () => {
            component.onHoldOrder = true;

            fakeSessionStorageService.set(BkiStorageConstants.CONFIRM_DIGITALDATA_INFO, {});

            fakeIbBookingPmtService.getConfirmationPageQuadrigam.and.returnValue('OHBKCD');

            component['setConfirmationQuadrigam']();

            expect(fakeIbBookingPmtService.getConfirmationPageQuadrigam)
                .toHaveBeenCalledWith(true, undefined);

            expect(component['pmtDDModelInfo'].quadrigams.confirmation).toEqual('OHBKCD');
        });
    });
 describe('when unpaid items are handled for confirmation', () => {
    beforeEach(() => {
        fakeSessionStorageService.remove(BkiStorageConstants.PMT_UNPAID_ITEM_LIST);
    });

    it('should normalize unpaid item object into array', () => {
        const unpaidItem = { type: 'INSURANCE' };

        const normalizedUnpaidItems = component['normalizeUnpaidItems'](unpaidItem);

        expect(normalizedUnpaidItems).toEqual([{ type: 'INSURANCE' }]);
    });

    it('should keep unpaid item list when it is already an array', () => {
        const unpaidItemList = [
            { type: 'INSURANCE' },
            { type: 'GLOBICK' }
        ];

        const normalizedUnpaidItems = component['normalizeUnpaidItems'](unpaidItemList);

        expect(normalizedUnpaidItems).toEqual(unpaidItemList);
    });

    it('should return empty array when unpaid item list is empty', () => {
        const normalizedUnpaidItems = component['normalizeUnpaidItems'](null);

        expect(normalizedUnpaidItems).toEqual([]);
    });

    it('should persist normalized unpaid items in session storage', () => {
        component['persistUnpaidItemsForConfirmation']({ type: 'INSURANCE' });

        const storedUnpaidItems = fakeSessionStorageService.get(
            BkiStorageConstants.PMT_UNPAID_ITEM_LIST
        );

        expect(storedUnpaidItems).toEqual([{ type: 'INSURANCE' }]);
    });

    it('should not persist unpaid items when list is empty', () => {
        component['persistUnpaidItemsForConfirmation']([]);

        const storedUnpaidItems = fakeSessionStorageService.get(
            BkiStorageConstants.PMT_UNPAID_ITEM_LIST
        );

        expect(storedUnpaidItems).toBeNull();
    });

    it('should clear unpaid items from session storage', () => {
        fakeSessionStorageService.set(
            BkiStorageConstants.PMT_UNPAID_ITEM_LIST,
            [{ type: 'INSURANCE' }]
        );

        component['clearUnpaidItemsForConfirmation']();

        const storedUnpaidItems = fakeSessionStorageService.get(
            BkiStorageConstants.PMT_UNPAID_ITEM_LIST
        );

        expect(storedUnpaidItems).toBeNull();
    });
});
    
    afterEach( () => {
        TestBed.resetTestingModule();
    } );
} );
