import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { EventEmitter } from '@angular/core';
import { PriceSubscriptionModel } from './../../../../../../../../src/components/ib-MmB-payment/models/ib-Mmb-payments-component-model';
import { IbMmbVoucherComponent } from './../../../../../../../../src/components/ib-MmB-payment/components/ib-Mmb-payment-component/components/ib-mmb-voucher/ib-mmb-voucher.component';
import { IbMmbVoucherService } from './../../../../../../../../src/components/ib-MmB-payment/components/ib-Mmb-payment-component/components/ib-mmb-voucher/services/ib-mmb-voucher.service';
import { IbMmbPaymentFormService } from './../../../../../../../../src/components/ib-MmB-payment/components/ib-Mmb-payment-component/services/ib-Mmb-payment-form.service';
import { NgReactComponent } from '@src/app/react/wrapper/ng-react.component';
import { AJSMmBDatalayerUtilsService } from '@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service-bridge.service';

describe('IbMmbVoucherComponent', () => {
    let component: IbMmbVoucherComponent;
    let fixture: ComponentFixture<IbMmbVoucherComponent>;
    let mockPmtFormService: jasmine.SpyObj<IbMmbPaymentFormService>;
    let mockVoucherService: jasmine.SpyObj<IbMmbVoucherService>;
    let mockLinkPipe: jasmine.SpyObj<IbCLinkPipe>;
    let mockSessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
    let fakeMmBDatalayerUtilsService = {
        addDigitalDataInfo: jasmine.createSpy()
    };

    beforeEach(async () => {
        mockPmtFormService = jasmine.createSpyObj('IbMmbPaymentFormService', ['priceUpdateEmitter', 'getPriceFormatted']);
        mockVoucherService = jasmine.createSpyObj('IbMmbVoucherService', ['checkVoucherCode', 'deleteVoucherCode']);
        mockLinkPipe = jasmine.createSpyObj('IbCLinkPipe', ['transform']);
        mockSessionStorageService = jasmine.createSpyObj('CommonsSessionStorageService', ['get', 'set', 'remove']);
        mockPmtFormService.priceUpdateEmitter = new EventEmitter<PriceSubscriptionModel>();
        mockLinkPipe.transform.and.returnValue('http://terms-conditions-link');

        await TestBed.configureTestingModule({
            declarations: [IbMmbVoucherComponent, NgReactComponent],
            providers: [
                { provide: IbCLinkPipe, useValue: mockLinkPipe },
                { provide: IbMmbPaymentFormService, useValue: mockPmtFormService },
                { provide: IbMmbVoucherService, useValue: mockVoucherService },
                { provide: CommonsSessionStorageService, useValue: mockSessionStorageService },
                { provide: AJSMmBDatalayerUtilsService, useValue: fakeMmBDatalayerUtilsService },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbMmbVoucherComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize props on creation', () => {
        expect(component.props).toEqual({
            handleClick: jasmine.any(Function),
            urlLink: 'http://terms-conditions-link',
            id: 'voucher-module'
        });
    });

    it('should subscribe to priceUpdateEmitter on ngOnInit with no discounts', () => {
        // spyOn(component, 'handleVoucherUpdate');
        component.ngOnInit();
        const mockPriceSubscriptionModel: PriceSubscriptionModel = {
            total: 0,
            currency: { code: 'USD', format: {} },
            charges: [],
            discounts: [],
            currencyConversion: { currency: 'USD', total: 0 }
        };
        mockPmtFormService.priceUpdateEmitter.emit(mockPriceSubscriptionModel);
        expect(mockSessionStorageService.remove).toHaveBeenCalledWith('mmbVoucher');
    });

    it('should subscribe to priceUpdateEmitter on ngOnInit  with discounts', () => {
        const mockVoucherDiscount = { voucherId: '123' };
        mockSessionStorageService.get.and.returnValue(mockVoucherDiscount);
        component.ngOnInit();
        const mockPriceSubscriptionModel: PriceSubscriptionModel = {
            total: 0,
            currency: { code: 'USD', format: {} },
            charges: [],
            discounts: [{
                id: '123',
                total: 50,
                type: 'DISCOUNTS'
            }],
            currencyConversion: { currency: 'USD', total: 0 }
        };
        mockPmtFormService.priceUpdateEmitter.emit(mockPriceSubscriptionModel);
        expect(mockSessionStorageService.get).toHaveBeenCalledWith('mmbVoucher');
        expect(component.voucherDiscount).toEqual(mockVoucherDiscount);
    });

    it('should handle voucher click to add voucher resolve promise response', async () => {
        const mockResponse = {
            data: {
                voucherDiscount: {
                    amount: 50,
                    voucherId: '123',
                    remainingAmount: 50
                }
            }
        };
        mockVoucherService.checkVoucherCode.and.returnValue(Promise.resolve(mockResponse));
        mockPmtFormService.getPriceFormatted.and.returnValue('$50');
        component.ngOnInit();
        const result = await component.handleVoucherClick('CODE123', false);
        expect(mockVoucherService.checkVoucherCode).toHaveBeenCalledWith('CODE123', component.flowId);
        expect(mockSessionStorageService.set).toHaveBeenCalledWith('mmbVoucher', mockResponse.data.voucherDiscount);
        expect(result).toEqual({
            status: true,
            discount: '$50',
            remainingAmount: '$50',
            isRemainingAmountZero: null
        });
    });

    it('should handle voucher click to add voucher reject promise response', async () => {
        const mockError = {
            data: {
                errors: [{
                    reason: 'porque si'
                }]
            }
        };
        mockVoucherService.checkVoucherCode.and.returnValue(Promise.reject(mockError));
        mockPmtFormService.getPriceFormatted.and.returnValue('$50');
        component.ngOnInit();
        const result = await component.handleVoucherClick('CODE123', false);
        expect(result).toEqual({
            status: false,
            message: 'porque si'
        });
    });

    it('should handle voucher click to remove voucher resolve promise', async () => {
        const mockResponse = { data: {} };
        component.voucherDiscount = { voucherId: '123' };
        mockVoucherService.deleteVoucherCode.and.returnValue(Promise.resolve(mockResponse));
        component.ngOnInit();
        const result = await component.handleVoucherClick('CODE123', true);
        expect(mockVoucherService.deleteVoucherCode).toHaveBeenCalledWith('123', component.flowId);
        expect(mockSessionStorageService.remove).toHaveBeenCalledWith('mmbVoucher');
        expect(result).toBeNull();
    });

    it('should handle voucher click to remove voucher reject promise response with discount', async () => {
        const mockError = { data: {} };
        component.voucherDiscount = { voucherId: '123' };
        mockPmtFormService.getPriceFormatted.and.returnValue('$50');
        mockVoucherService.deleteVoucherCode.and.returnValue(Promise.reject(mockError));
        component.ngOnInit();
        const result = await component.handleVoucherClick('CODE123', true);
        expect(mockVoucherService.deleteVoucherCode).toHaveBeenCalledWith('123', component.flowId);
        expect(result).toEqual({
            status: true,
            discount: '$50',
            remainingAmount: null,
            isRemainingAmountZero: null
        });
    });

    xit('should handle voucher click to remove voucher reject promise response without discount', async () => {
        const mockError = { message: 'otra vez' };
        component.voucherDiscount = { voucherId: '123' };
        mockVoucherService.deleteVoucherCode.and.returnValue(Promise.reject(mockError));
        component.ngOnInit();
        const result = await component.handleVoucherClick('CODE123', true);
        expect(result).toEqual({
            status: false,
            message: 'otra vez'
        });
    });
    it('should set aviosDiscount and use it as discountType when rewardCode is AVIOS', () => {
        component.ngOnInit();

        mockPmtFormService.getPriceFormatted.and.returnValue('50€');

        const mockPriceSubscriptionModel: PriceSubscriptionModel = {
            total: null,
            currency: { code: 'EUR', format: {} },
            charges: [],
            discounts: [{
                id: 'AV1',
                total: 50,
                rewardCode: 'AVIOS',
                type: 'DISCOUNTS'
            }],
            currencyConversion: { currency: 'EUR', total: 100 }
        };

        mockPmtFormService.priceUpdateEmitter.emit(mockPriceSubscriptionModel);

        expect(component.aviosDiscount).toEqual({
            amount: 50,
            remainingAmount: null
        });
    });
});
