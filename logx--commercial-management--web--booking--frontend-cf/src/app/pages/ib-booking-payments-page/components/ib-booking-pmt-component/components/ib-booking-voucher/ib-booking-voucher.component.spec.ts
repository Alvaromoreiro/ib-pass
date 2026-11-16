import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IbBookingVoucherComponent } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-component/components/ib-booking-voucher/ib-booking-voucher.component';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbBookingCheckVoucherCodeService } from '@src/app/shared/http-services/sse-orm/ib-booking-check-voucher-code.service';
import { IbBookingOrderModifyPartnerDiscount } from '@src/app/shared/http-services/sse-orm/ib-booking-order-modify-partner-discount.service';
import { IbPmtVoucherOtpModalService } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-component/components/ib-pmt-voucher-otp-modal/ib-pmt-voucher-otp-modal.service';
import { IbBookingPmtService } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-component/services/ib-booking-pmt.service';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { AJSCurrencyService } from 'ib-web-commons/utils';
import { CurrencyServiceMock } from '@test-mocks/Services/CurrencyServiceMocks';
import { TranslateServiceMock } from '@test-mocks/Services/TranslateServiceAngularMock';
import { IbCModalServiceMock } from '@test-mocks/class/IbCModalServiceMock';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { Currency } from 'ib-web-commons/models';

class IbBookingCheckVoucherCodeServiceMock {
    public deleteVoucherCode = jasmine.createSpy('deleteVoucherCode');
    public checkVoucherCode = jasmine.createSpy('checkVoucherCode');
    public validateVoucherCodeOtp = jasmine.createSpy('validateVoucherCodeOtp');
}

class IbBookingOrderModifyPartnerDiscountMock {
    public deletePartnerDiscount = jasmine.createSpy('deletePartnerDiscount');
}

class IbPmtVoucherOtpModalServiceMock {
    public showOTPModal = jasmine.createSpy('showOTPModal');
}

class IbBookingPmtServiceMock {
    public setLoadingBasketState = jasmine.createSpy('setLoadingBasketState');
}

class IbCLinkPipeMock {
    public transform = jasmine.createSpy('transform').and.returnValue('terms-link');
}

class ElementRefMock extends ElementRef {
    constructor () {
        super(document.createElement('div'));
    }
}

// @ts-ignore
interface TestComponent extends IbBookingVoucherComponent {
    orderId: string;
    currency: Currency;
    currentVoucher: any;
    IbBookingCheckVoucherCodeService: IbBookingCheckVoucherCodeServiceMock;
    IbBookingOrderModifyPartnerDiscount: IbBookingOrderModifyPartnerDiscountMock;
    IbBookingPmtService: IbBookingPmtServiceMock;
    IbPmtVoucherOtpModalService: IbPmtVoucherOtpModalServiceMock;
    IbCModalService: IbCModalServiceMock;
    TranslateService: TranslateServiceMock;
    CurrencyService: CurrencyServiceMock;
    root: { render: jasmine.Spy; unmount: jasmine.Spy; };
    ngZone: NgZone;
    getVoucherValue: (voucherDiscount: any) => any;
    renderComponent: (value: any) => void;
    callActionCallbackManager: (input: string, removeDiscount: boolean) => Promise<any>;
    removeVoucherPromise: () => Promise<any>;
    removePartnerDiscount: () => Promise<{ data: any; code: number; }>;
    removeVoucher: () => Promise<any>;
    addVoucher: (code: string) => Promise<any>;
    showOtpErrorModal: (error: any) => boolean;
}

describe('IbBookingVoucherComponent', () => {
    let component: IbBookingVoucherComponent;
    let fixture: ComponentFixture<IbBookingVoucherComponent>;
    let testComponent: TestComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingVoucherComponent],
            providers: [
                { provide: IbBookingCheckVoucherCodeService, useClass: IbBookingCheckVoucherCodeServiceMock },
                { provide: IbBookingOrderModifyPartnerDiscount, useClass: IbBookingOrderModifyPartnerDiscountMock },
                { provide: IbPmtVoucherOtpModalService, useClass: IbPmtVoucherOtpModalServiceMock },
                { provide: IbBookingPmtService, useClass: IbBookingPmtServiceMock },
                { provide: IbCLinkPipe, useClass: IbCLinkPipeMock },
                { provide: TranslateService, useValue: new TranslateServiceMock() },
                { provide: IbCModalService, useClass: IbCModalServiceMock },
                { provide: AJSCurrencyService, useClass: CurrencyServiceMock },
                { provide: ElementRef, useClass: ElementRefMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingVoucherComponent);
        component = fixture.componentInstance;
        testComponent = component as unknown as TestComponent;

        component.orderId = 'ORDER-1';
        component.currency = { code: 'EUR' } as Currency;
        component.currentVoucher = {
            type: BookingAppConstants.DISCOUNT_TYPES.VOUCHER,
            voucherId: 'VOUCHER-ID',
            partnerId: 'PARTNER-ID',
            description: 'IBERIA_PARTNER_PLAN',
            voucherDiscountRealAmount: { totalRealAmount: 10 },
            remainingAmount: null
        } as any;

        spyOn(testComponent.ngZone, 'runOutsideAngular').and.callFake(<T>(fn: (...args: any[]) => T): T => fn());
    });

    it('gets empty voucher value when voucher is null', () => {
        const value = testComponent.getVoucherValue(null);

        expect(value).toEqual({ status: false });
    });

    it('gets voucher value with remaining amount and partner flag', () => {
        const voucher = {
            type: BookingAppConstants.DISCOUNT_TYPES.PARTNER,
            voucherDiscountRealAmount: { totalRealAmount: 25 },
            remainingAmount: 10
        };

        const value = testComponent.getVoucherValue(voucher);

        expect(testComponent.CurrencyService.formatPrice).toHaveBeenCalledTimes(2);
        expect(testComponent.CurrencyService.formatPrice.calls.argsFor(0)).toEqual([undefined, 25, true, false]);
        expect(testComponent.CurrencyService.formatPrice.calls.argsFor(1)).toEqual([undefined, 10, true, false]);
        expect(value).toEqual({
            status: true,
            discount: '25€',
            remainingAmount: '10€',
            isRemainingAmountZero: null,
            isPartner: true
        });
    });

    it('gets voucher value with zero remaining amount', () => {
        const voucher = {
            type: BookingAppConstants.DISCOUNT_TYPES.VOUCHER,
            voucherDiscountRealAmount: { totalRealAmount: 25 },
            remainingAmount: 0
        };

        const value = testComponent.getVoucherValue(voucher);

        expect(value.isRemainingAmountZero).toBeTrue();
        expect(value.remainingAmount).toBe('0€');
        expect(value.isPartner).toBeFalse();
    });

    it('renders component on init with voucher value', () => {
        const renderSpy = spyOn(testComponent, 'renderComponent').and.stub();

        component.ngOnInit();

        expect(testComponent.CurrencyService.getCurrencyObject).toHaveBeenCalledWith(component.currency);
        expect(renderSpy).toHaveBeenCalled();
    });

    it('unmounts root on destroy', () => {
        testComponent.root = {
            render: jasmine.createSpy('render'),
            unmount: jasmine.createSpy('unmount')
        } as any;

        component.ngOnDestroy();

        expect(testComponent.ngZone.runOutsideAngular).toHaveBeenCalled();
        expect(testComponent.root.unmount).toHaveBeenCalled();
    });

    it('renders root inside runOutsideAngular', () => {
        testComponent.root = {
            render: jasmine.createSpy('render'),
            unmount: jasmine.createSpy('unmount')
        } as any;

        testComponent.renderComponent({ status: false } as any);

        expect(testComponent.ngZone.runOutsideAngular).toHaveBeenCalled();
        expect(testComponent.root.render).toHaveBeenCalled();
    });

    it('calls addVoucher with input code when removeDiscount is false', async () => {
        const addVoucherSpy = spyOn(testComponent, 'addVoucher').and.resolveTo({ status: true } as any);

        await testComponent.callActionCallbackManager('MY-CODE', false);

        expect(addVoucherSpy).toHaveBeenCalledWith('MY-CODE');
    });

    it('calls addVoucher with current voucher id when input is empty', async () => {
        const addVoucherSpy = spyOn(testComponent, 'addVoucher').and.resolveTo({ status: true } as any);

        await testComponent.callActionCallbackManager('', false);

        expect(addVoucherSpy).toHaveBeenCalledWith('VOUCHER-ID');
    });

    it('calls removeVoucher when removeDiscount is true', async () => {
        const removeVoucherSpy = spyOn(testComponent, 'removeVoucher').and.resolveTo(null);

        await testComponent.callActionCallbackManager('', true);

        expect(removeVoucherSpy).toHaveBeenCalled();
    });

    it('resolves removeVoucherPromise with partner flow', async () => {
        const response = { data: { order: {} }, code: 200 };
        component.currentVoucher.type = BookingAppConstants.DISCOUNT_TYPES.PARTNER;
        const removePartnerDiscountSpy = spyOn(testComponent, 'removePartnerDiscount').and.resolveTo(response as any);

        const result = await testComponent.removeVoucherPromise();

        expect(removePartnerDiscountSpy).toHaveBeenCalled();
        expect(result).toEqual(response);
    });

    it('resolves removeVoucherPromise with voucher delete flow', async () => {
        const response = { data: { order: {} }, code: 200 };
        component.currentVoucher.type = BookingAppConstants.DISCOUNT_TYPES.VOUCHER;
        testComponent.IbBookingCheckVoucherCodeService.deleteVoucherCode.and.resolveTo(response as any);

        const result = await testComponent.removeVoucherPromise();

        expect(testComponent.IbBookingCheckVoucherCodeService.deleteVoucherCode).toHaveBeenCalledWith('VOUCHER-ID', 'ORDER-1');
        expect(result).toEqual(response);
    });

    it('removes voucher and emits updated order', async () => {
        const sendEventSpy = spyOn(component, 'sendEvent');
        const order = { id: 'ORDER-UPDATED' };
        const response = { data: { order }, code: 200 };
        spyOn(testComponent, 'removeVoucherPromise').and.resolveTo(response as any);

        const result = await testComponent.removeVoucher();

        expect(testComponent.IbBookingPmtService.setLoadingBasketState).toHaveBeenCalledWith(true);
        expect(sendEventSpy).toHaveBeenCalledWith(order);
        expect(result).toBeNull();
    });

    it('removes partner discount after confirmation modal', async () => {
        const response = { data: { order: {} }, code: 200 } as any;
        const translateInstantSpy = spyOn(testComponent.TranslateService, 'instant').and.callFake((
            key: string,
            params?: { partnerPlan?: string; }
        ) => {
            if (params?.partnerPlan != null) {
                return `${key}:${params.partnerPlan}`;
            }
            return key;
        });
        component.currentVoucher.type = BookingAppConstants.DISCOUNT_TYPES.PARTNER;
        testComponent.IbBookingOrderModifyPartnerDiscount.deletePartnerDiscount.and.resolveTo(response);

        const result = await testComponent.removePartnerDiscount();

        expect(testComponent.IbCModalService.showGenericModal).toHaveBeenCalled();
        expect(translateInstantSpy as jasmine.Spy).toHaveBeenCalledWith(
            'PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BODY_PARTNER',
            { partnerPlan: 'IBERIA_PARTNER_PLAN' }
        );
        expect(testComponent.IbBookingOrderModifyPartnerDiscount.deletePartnerDiscount)
            .toHaveBeenCalledWith('PARTNER-ID', 'ORDER-1');
        expect(result).toEqual(response);
    });

    it('uses empty partner title when description is undefined', async () => {
        component.currentVoucher.type = BookingAppConstants.DISCOUNT_TYPES.PARTNER;
        component.currentVoucher.description = undefined;
        testComponent.IbBookingOrderModifyPartnerDiscount.deletePartnerDiscount.and.resolveTo({ data: {}, code: 200 } as any);
        const translateInstantSpy = spyOn(testComponent.TranslateService, 'instant').and.callThrough();

        await testComponent.removePartnerDiscount();

        expect(translateInstantSpy).toHaveBeenCalledWith('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BODY_PARTNER', { partnerPlan: '' });
    });

    it('throws when voucher delete fails', async () => {
        const error = { message: 'delete-error' };
        testComponent.IbBookingCheckVoucherCodeService.deleteVoucherCode.and.rejectWith(error);

        await expectAsync(testComponent.removeVoucher()).toBeRejectedWith(error);
        expect(testComponent.IbBookingPmtService.setLoadingBasketState).toHaveBeenCalledWith(true);
    });

    it('adds voucher successfully when status code is not 202', async () => {
        const order = {
            voucherDiscount: {
                type: BookingAppConstants.DISCOUNT_TYPES.VOUCHER,
                voucherDiscountRealAmount: { totalRealAmount: 35 },
                remainingAmount: null
            }
        };
        testComponent.IbBookingCheckVoucherCodeService.checkVoucherCode.and.resolveTo({ data: { order }, code: 200 } as any);
        const sendEventSpy = spyOn(component, 'sendEvent');

        const result = await testComponent.addVoucher('VOUCHER-CODE');

        expect(testComponent.IbBookingCheckVoucherCodeService.checkVoucherCode).toHaveBeenCalledWith('VOUCHER-CODE', 'ORDER-1');
        expect(sendEventSpy).toHaveBeenCalledWith(order);
        expect(result).toEqual({
            status: true,
            discount: '35€',
            remainingAmount: null,
            isRemainingAmountZero: null,
            isPartner: false
        });
    });

    it('adds voucher successfully with OTP validation flow', async () => {
        const order = {
            voucherDiscount: {
                type: BookingAppConstants.DISCOUNT_TYPES.PARTNER,
                voucherDiscountRealAmount: { totalRealAmount: 40 },
                remainingAmount: 0
            }
        };
        const otpValidation = {
            otpSessionId: 'OTP-SESSION',
            otpSessionExpired: '2026-03-06T10:00:00Z',
            otpSessionRequested: '2026-03-06T09:00:00Z',
            otpEmail: 'mail@test.com'
        };
        testComponent.IbBookingCheckVoucherCodeService.checkVoucherCode.and.resolveTo({ data: { otpValidation }, code: 202 } as any);
        const otpState = { sessionId: 'OTP-STATE-SESSION' };
        testComponent.IbPmtVoucherOtpModalService.showOTPModal.and.resolveTo(otpState as any);
        testComponent.IbBookingCheckVoucherCodeService.validateVoucherCodeOtp.and.resolveTo({ data: { order } } as any);

        const result = await testComponent.addVoucher('OTP-CODE');

        expect(testComponent.IbPmtVoucherOtpModalService.showOTPModal).toHaveBeenCalledWith({
            voucherCode: 'OTP-CODE',
            flowId: 'ORDER-1',
            sessionId: 'OTP-SESSION',
            sessionExpiration: '2026-03-06T10:00:00Z',
            sessionRequested: '2026-03-06T09:00:00Z',
            email: 'mail@test.com'
        });
        expect(testComponent.IbBookingCheckVoucherCodeService.validateVoucherCodeOtp)
            .toHaveBeenCalledWith('ORDER-1', 'OTP-CODE', 'OTP-STATE-SESSION');
        expect(result).toEqual({
            status: true,
            discount: '40€',
            remainingAmount: '0€',
            isRemainingAmountZero: true,
            isPartner: true
        });
    });

    it('shows OTP error modal and rejects with message when addVoucher fails', async () => {
        const error = { message: 'voucher-error', internalErrorCode: 'OTHER', state: 'OPEN' };
        testComponent.IbBookingCheckVoucherCodeService.checkVoucherCode.and.rejectWith(error);

        await expectAsync(testComponent.addVoucher('VOUCHER-CODE')).toBeRejectedWith('voucher-error');
        expect(testComponent.IbCModalService.showGenericComponentModal).toHaveBeenCalled();
        expect(testComponent.IbBookingPmtService.setLoadingBasketState).toHaveBeenCalledWith(true);
    });

    it('does not show OTP error modal when VCH_VCH_11001 and modal closed', async () => {
        const error = { message: 'voucher-error', internalErrorCode: 'VCH_VCH_11001', state: 'CLOSED' };
        testComponent.IbBookingCheckVoucherCodeService.checkVoucherCode.and.rejectWith(error);

        await expectAsync(testComponent.addVoucher('VOUCHER-CODE')).toBeRejectedWith('voucher-error');
        expect(testComponent.IbCModalService.showGenericComponentModal).not.toHaveBeenCalled();
    });

    it('returns true for OTP error modal when error is not ignored', () => {
        expect(testComponent.showOtpErrorModal({ internalErrorCode: 'OTHER', state: 'OPEN' })).toBeTrue();
    });

    it('emits voucherValidated event with order payload', () => {
        const emitSpy = spyOn(component.voucherValidated, 'emit');
        const order = { id: 'ORDER-2' } as any;

        component.sendEvent(order);

        expect(emitSpy).toHaveBeenCalledWith({ order } as any);
    });
});
