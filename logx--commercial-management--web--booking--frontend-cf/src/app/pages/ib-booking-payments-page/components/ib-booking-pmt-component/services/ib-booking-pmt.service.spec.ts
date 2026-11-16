import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IbBookingPmtService } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-component/services/ib-booking-pmt.service';
import { IbSummaryTransformerService } from '@src/app/pages/ib-booking-payments-page/services/ib-summary-transformer.service';
import { AJSCurrencyService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { CurrencyServiceMock } from '@test-mocks/Services/CurrencyServiceMocks';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { TranslateServiceMock } from '@test-mocks/Services/TranslateServiceAngularMock';
import { IbCModalServiceMock } from '@test-mocks/class/IbCModalServiceMock';
import { NewMainHeaderFacadeTokenMock } from '@test-mocks/class/NewMainHeaderFacadeMock';
import { Taxes } from '@core/models/ib-booking-payments/ib-booking-summary-model';
import { commercialStoredData } from '@test-mocks/unit/app/services/ib-booking-availability/utils/ib-booking-commercial-selling-data-utils-mocks';
import StorageOrder from '@test-mocks/storage/CreateOrderDataRT-simple-mock.json';
import BookingInfo from '@test-mocks/storage/BookingInfo-mock.json';
import { SummaryTransformerServiceMock } from '@test-mocks/unit/app/pages/ib-booking-payments-page/SummaryTransformerServiceMock';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import fullHeaderModel from '@test/unit/app/shared/components/ib-booking-header/mocks/HeaderModelRT.json';
import { IbPmtTaxesModalComponent } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-taxes-modal/ib-booking-pmt-taxes-modal.component';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { PmtComponentPriceMock, PmtComponentPriceBaseMock, PmtComponentPriceHasAviosAndVoucher } from '@test-mocks/unit/app/pages/ib-booking-payments-page/IbBookingPmtFormServiceMock';
import { IbBookingPmtDigitalDataServiceMock } from '@test-mocks/class/PmtDigitalDataService';
import { IbBookingPmtDigitalDataService } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-component/services/ib-booking-pmt-digital-data.service';
import { CurrencyConversionModel, CurrencyDisplayFormat, OnPaymentSuccessEvent, PmtRedirectionInfo, SuccessEventUnpaidItems } from '@src/app/core/models/ib-booking-payments/ib-booking-payments-model';
import * as SingleFreeOnHoldOption from '@test-mocks/unit/app/pages/ib-booking-payments-page/ib-booking-pmt/SingleOnHoldOptionFree.json';
import { FareOnHoldOptions } from '@src/app/core/models/generic-models/fare-models';
import { OnHoldInfoProps, OnHoldOption } from 'commercial-management--digital--web-components-design--library';
import fareDataMock from '@test-mocks/unit/app/pages/ib-booking-payments-page/ib-booking-pmt/FareDataWithOnHoldOptions.json';
import { GetContextResponse } from '@src/app/shared/http-services/sse-orm/ib-payment-context.service';
import { ShoppingBasketItemTotal } from '@src/app/core/models/ib-booking-availability/header-model';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { PaymentViewType } from '@src/app/core/enums/ib-booking-paymments/ib-booking-payments-enum';
import { DigitalDataProcess } from '@src/app/core/constants/ib-digital-data-constants';

let OnHoldOptionsMock = fareDataMock.offers[ 0 ].onHoldOptions;

// @ts-ignore
interface TestService extends IbBookingPmtService {
    CommonsSessionStorageService: StorageServiceMock;
    NewMainHeaderFacade: NewMainHeaderFacadeTokenMock;
}


describe('IbBookingPmtService Test', () => {
    let service: TestService;
    let fakeIbCModalService: IbCModalServiceMock = new IbCModalServiceMock();
    let fakeIbBookingPmtDigitalDataService: IbBookingPmtDigitalDataServiceMock = new IbBookingPmtDigitalDataServiceMock();
    beforeEach(async () => {
        TestBed.configureTestingModule( {
            declarations: [
                IbPmtTaxesModalComponent
            ],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                IbBookingPmtService,
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
                { provide: TranslateService, useValue: new TranslateServiceMock() },
                { provide: IbSummaryTransformerService, useClass: SummaryTransformerServiceMock },
                { provide: AJSCurrencyService, useClass: CurrencyServiceMock },
                { provide: IbBookingHeaderFacadeService, useClass: NewMainHeaderFacadeTokenMock },
                { provide: IbCModalService, useValue: fakeIbCModalService },
                { provide: IbBookingPmtDigitalDataService, useValue: fakeIbBookingPmtDigitalDataService }
            ]
        } );
        service = TestBed.inject(IbBookingPmtService) as unknown as TestService;


        service.CommonsSessionStorageService.set( BkiStorageConstants.COMMERCIAL_DATA, commercialStoredData );
        service.CommonsSessionStorageService.set( BkiStorageConstants.HEADER_MODEL, fullHeaderModel );
        service.CommonsSessionStorageService.set( BkiStorageConstants.BKI_INFO, BookingInfo );
        
    } );

    describe( 'When checkOnHoldForTitle is called', () => {
        it( 'it should return PAYMENTS_PAGE_TITLE', () => {
            const title = service.checkOnHoldForTitle();
            expect( title ).toEqual( 'PAYMENTS_PAGE_TITLE' );
        });
        it( 'it should return free onHoldSubString', () => {
            const params = { isFree: true, hours: 24 };
            const title = service.checkOnHoldForTitle( params );
            expect( title.includes( 'ON_HOLD_FREE_TITLE' ) ).toBe( true );
        } );
        it( 'it should return non free onHoldSubString', () => {
            const params = { isFree: false, hours: 48 };
            const title = service.checkOnHoldForTitle( params );
            expect( title.includes( 'ON_HOLD_FREE_TITLE' ) ).toBe( false );
        } );
    } );

    describe( 'When setSummaryOthers is called', () => {
        it('adds rewards and voucher', () => {
            const spyCheckResetBasket = spyOn<any>(service, 'checkResetBasketOthers');
            const spyTranslate = spyOn(service['TranslateService'], 'instant');

            const paramsWithAvios = PmtComponentPriceHasAviosAndVoucher;
            service.setSummaryOthers(paramsWithAvios);

            expect(spyCheckResetBasket).toHaveBeenCalled();
            expect(spyTranslate).toHaveBeenCalledWith('REWARDS');
            expect(spyTranslate).toHaveBeenCalledWith('BONUS_CARD_GIFT_TEXT');
        });
    });

    describe('When resetDiscounts is called', () => {
        it('should remove all discount types from basket', () => {
            const { NewMainHeaderFacade } = service;

            service.resetDiscounts();

            expect(NewMainHeaderFacade.deleteDiscountFromBasket).toHaveBeenCalledTimes(3);
            expect(NewMainHeaderFacade.deleteDiscountFromBasket).toHaveBeenCalledWith('PARTNER');
            expect(NewMainHeaderFacade.deleteDiscountFromBasket).toHaveBeenCalledWith('VOUCHER');
            expect(NewMainHeaderFacade.deleteDiscountFromBasket).toHaveBeenCalledWith('REWARDS');
        });
    });


    describe( 'When addBasketDiscounts is called', () => {
        it( 'it should set discounts and call NewMainHeaderFacade.addSimpleDiscount with', () => {
            const {NewMainHeaderFacade} = service;
            const discounts = [...PmtComponentPriceMock.discounts];
            service[ 'addBasketDiscounts' ]( discounts, 6 );
            expect( NewMainHeaderFacade.addSimpleDiscount ).toHaveBeenCalled();
        });
    });
    describe( 'When addBasketOther is called', () => {
        it( 'it should set others on basket and call NewMainHeaderFacade.updateBasketOthers with', () => {
            const {NewMainHeaderFacade} = service;
            const other = { ...PmtComponentPriceMock.charges[0] } ;
            service[ 'addBasketOther' ]( other );
            expect( NewMainHeaderFacade.updateBasketOthers ).toHaveBeenCalled();
        });
    });
    describe( 'When checkResetBasketOthers is called', () => {
        it( 'it should set others on basket and call NewMainHeaderFacade.updateBasketOthers with', () => {
            const spyAddBasketOther = spyOn<any>(service, 'addBasketOther');
            const others = [ ...PmtComponentPriceMock.charges ];
            service[ 'checkResetBasketOthers' ]( others );
            expect( spyAddBasketOther ).toHaveBeenCalled();
        });
        it( 'it should remove others on basket and call NewMainHeaderFacade.updateBasketOthers', () => {
            const {NewMainHeaderFacade} = service;
            const others = [ ...PmtComponentPriceBaseMock.charges ];
            service[ 'checkResetBasketOthers' ]( others );
            expect( NewMainHeaderFacade.updateBasketOthers ).toHaveBeenCalled();
        });
    });
    describe( 'When showTaxesModal  is called', () => {
        it( 'it should set others on basket and call IbCModalService.showGenericComponentModal', () => {
            fakeIbCModalService.showGenericComponentModal = jasmine.createSpy( 'showGenericComponentModal' ).and.callFake( () => { return { componentInstance: { model: [] as Taxes[] } }; } );
            const taxes = StorageOrder.order.orderItems[ 0 ].passengerPrices[ 0 ].taxes;
            const mappedTaxes: Taxes[] = taxes.map( ( tax: Taxes ) => {
                return {
                    description: tax.description,
                    amount: 3
                };
            } );
            const modal = service.showTaxesModal( mappedTaxes );
            expect( modal.componentInstance.model.length ).toBe( 3 );
            expect( fakeIbCModalService.showGenericComponentModal ).toHaveBeenCalled();
        });
    });
    describe( 'When getSummaryInfo  is called', () => {
        it( 'it should return formed summary', () => {
            const summary = service.getSummaryInfo( {showPassegenerTaxesModal: ()=>{}} );
            const summaryTransformer = service[ 'IbSummaryTransformerService' ] as unknown as SummaryTransformerServiceMock;
            expect( summary.total ).toEqual(0);
            expect( summaryTransformer.setTrips ).toHaveBeenCalledWith( BookingInfo.order.slices, BookingInfo.fareFamilyConditions );
        } );
        it( 'it should set OnHold properties', () => {
            spyOn( service, 'getPriceFormatted' );
            const onHold = SingleFreeOnHoldOption as FareOnHoldOptions;
            const summary = service.getSummaryInfo( { showPassegenerTaxesModal: () => { }, selectedOnHold: onHold } );
            expect( summary.onholdPrice ).toEqual( '0€' );
        });
    });

    describe('When setSummaryDCCInfo is called', () => {
        let currencyFormat: CurrencyDisplayFormat;
        beforeEach(() => {
            currencyFormat = {
                symbol: {alignment: 'R', value: '$'},
                decimalDigits: { rounding: 'DOWN', value: 2},
                separator: {decimal: ',', grouping: '.'}
            };
        });


        it('When CurrencyConversion is null or undefined', () => {
            const {NewMainHeaderFacade} = service;
            service.setSummaryDCCInfo(null, null);
            expect(NewMainHeaderFacade.setTotalDCC).toHaveBeenCalledWith('');
        });
        it('When CurrencyConversion is applied and decimalDigits rounded down', () => {
            const {NewMainHeaderFacade} = service;
            const currency: CurrencyConversionModel = {currency: '$', total: 1000.156};
            service.setSummaryDCCInfo(currency, currencyFormat);
            expect(NewMainHeaderFacade.setTotalDCC).toHaveBeenCalledWith('1.000,15$');
        });
        it('When CurrencyConversion is applied and decimalDigits rounded up', () => {
            const {NewMainHeaderFacade} = service;
            const currency: CurrencyConversionModel = {currency: '$', total: 1000.156};
            currencyFormat.decimalDigits.rounding = 'UP'; 
            service.setSummaryDCCInfo(currency, currencyFormat);
            expect(NewMainHeaderFacade.setTotalDCC).toHaveBeenCalledWith('1.000,16$');
        });
        it('When CurrencyConversion is applied and alignment left', () => {
            const {NewMainHeaderFacade} = service;
            const currency: CurrencyConversionModel = {currency: '$', total: 1000.156};
            currencyFormat.symbol.alignment = 'L'; 
            service.setSummaryDCCInfo(currency, currencyFormat);
            expect(NewMainHeaderFacade.setTotalDCC).toHaveBeenCalledWith('$1.000,15');
        });
    } );
    describe( 'When setTimeOnHoldProps is called', () => {
        it( 'it should return the timeProps object properly', () => {
            const props: OnHoldInfoProps = service.setTimeOnHoldProps( SingleFreeOnHoldOption );
            expect( props.type ).toEqual( 'time' );
        } );
    } );
    describe( 'When getMultipleOnHoldOptions is called', () => {
        it( 'it should return an OnHoldOption[]', () => {
            const options: OnHoldOption[] = service.getMultipleOnHoldOptions( OnHoldOptionsMock );
            expect( options.length ).toEqual( 2 );
            expect( options[0].hours ).toEqual( 24 );
            expect( options[1].hours ).toEqual( 72 );
        } );
    } );
    describe( 'When redirectedPaymentTypeAction is called', () => {
        it( 'it should set session storage items', () => {
            const {CommonsSessionStorageService} = service;
            const contextData: GetContextResponse = { contextId: 'ABCDEFG', warnings: [] };
            CommonsSessionStorageService.set( BkiStorageConstants.CONFIRM_DATALAYER_INFO, {} );
            CommonsSessionStorageService.set( BkiStorageConstants.CONFIRM_DIGITALDATA_INFO, {} );
            service.redirectedPaymentTypeAction( contextData );
            const dd_callback = CommonsSessionStorageService.get( BkiStorageConstants.CONFIRM_DIGITALDATA_CALLBACK );
            const context:PmtRedirectionInfo = CommonsSessionStorageService.get<PmtRedirectionInfo>( BkiStorageConstants.PMT_REDIRECTION_CONTEXT );
            expect( dd_callback ).toEqual( {} );
            expect( context.contextResponse ).toEqual( contextData );
            expect( context.paymentCompleted ).toEqual( false );
        });
    } );
    describe( 'When deleteUnpaidItemsFromBasket is called', () => {
        it( 'it should delete the unpaid item from header facade and update datalayer', () => {
            const {NewMainHeaderFacade} = service;
            const paymentEvent = <OnPaymentSuccessEvent> { unpaidItemList: [
                { type: SuccessEventUnpaidItems.INSURANCE },
                { type: SuccessEventUnpaidItems.DONATION },
                { type: SuccessEventUnpaidItems.GLOBICK },
                { type: SuccessEventUnpaidItems.ASSISTCARD }
            ]
            };
            service.deleteUnpaidItemsFromBasket( paymentEvent );
            expect( NewMainHeaderFacade.deleteInsuranceFromBasket ).toHaveBeenCalled();
            expect( NewMainHeaderFacade.updateBasketOthers ).toHaveBeenCalled();
            expect( NewMainHeaderFacade.deleteGlobickTransfersFromBasket ).toHaveBeenCalled();
            expect( NewMainHeaderFacade.deleteAssistCardFromBasket ).toHaveBeenCalled();
            expect( fakeIbBookingPmtDigitalDataService.setAncillariesDatalayer ).toHaveBeenCalled();
        } );
    } );
    describe( 'When setLoadingBasketState is called', () => {
        it( 'it should call header facade with the status', () => {
            const {NewMainHeaderFacade} = service;
            service.setLoadingBasketState( true );
            expect( NewMainHeaderFacade.setLoadingBasket ).toHaveBeenCalled();
        } );
    } );
    describe( 'When setIssueOrderInfo is called', () => {
        it( 'it should set the data on sessionStorage', () => {
            const {CommonsSessionStorageService} = service;
            service.setIssueOrderInfo( {} );
            const data = CommonsSessionStorageService.get( BkiStorageConstants.ISSUE_ORDER_INFO );
            expect( data ).toEqual( {} );
        } );
    } );
    describe( 'When checkAndUpdateOrderTotalPrice is called', () => {
        it( 'it should check the price and update', () => {
            const {CommonsSessionStorageService} = service;
            const order = { order: { price: { total: 100 } } };
            const shoppingTotal = <ShoppingBasketItemTotal> { total: 50 };
            service.checkAndUpdateOrderTotalPrice( order, shoppingTotal );
            const storage = CommonsSessionStorageService.get<any>( BkiStorageConstants.CREATE_ORDER_DATA );
            expect( storage ).toEqual( order );
            
        } );
    } );
    
   describe('When getConfirmationPageQuadrigam is called', () => {
    const cases = [
        {
            description: 'should return BKI_CONFIRMATION_NEW when isOnHold is false and process is not ONHOLD_CONFIRMATION',
            paymentType: undefined,
            isOnHold: false,
            process: DigitalDataProcess.BOOKING_SLICED,
            expected: BookingAppConstants.QUADRIGAMS.BKI_CONFIRMATION_NEW
        },
        {
            description: 'should return BKI_CONFIRMATION_COH_NEW when payment type is NEW and process is ONHOLD_CONFIRMATION',
            paymentType: PaymentViewType.NEW,
            isOnHold: false,
            process: DigitalDataProcess.ONHOLD_CONFIRMATION,
            expected: BookingAppConstants.QUADRIGAMS.BKI_CONFIRMATION_COH_NEW
        },
        {
            description: 'should return BKIOH_CONFIRMATION_NEW when isOnHold is true, payment type is NEW and process is not ONHOLD_CONFIRMATION',
            paymentType: PaymentViewType.NEW,
            isOnHold: true,
            process: DigitalDataProcess.BOOKING_SLICED,
            expected: BookingAppConstants.QUADRIGAMS.BKIOH_CONFIRMATION_NEW
        },
        {
            description: 'should return BKIOH_CONFIRMATION when isOnHold is true and payment type is not NEW',
            paymentType: PaymentViewType.OLD,
            isOnHold: true,
            process: DigitalDataProcess.BOOKING_SLICED,
            expected: BookingAppConstants.QUADRIGAMS.BKIOH_CONFIRMATION
        }
    ];

    cases.forEach(({ description, paymentType, isOnHold, process, expected }) => {
        it(description, () => {
            if (paymentType !== undefined) {
                service.CommonsSessionStorageService.set(
                    BkiStorageConstants.PAYMENTS_VIEWTYPE,
                    paymentType
                );
            }

            const quadrigam = service.getConfirmationPageQuadrigam(isOnHold, process);

            expect(quadrigam).toEqual(expected);
        });
    });
});
});
