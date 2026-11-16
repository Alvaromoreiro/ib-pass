import { TestBed } from '@angular/core/testing';
import { IbBookingCheckVoucherCodeService } from '@src/app/shared/http-services/sse-orm/ib-booking-check-voucher-code.service';
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { of, throwError } from 'rxjs';
import { cloneDeep } from 'lodash-es';

class BookingRxProxyMock {
    public getResponse = {};
    public postResponse = {};
    public deleteResponse = {};
    public get = jasmine.createSpy('get').and.callFake(() => of(cloneDeep(this.getResponse)));
    public post = jasmine.createSpy('post').and.callFake(() => of(cloneDeep(this.postResponse)));
    public delete = jasmine.createSpy('delete').and.callFake(() => of(cloneDeep(this.deleteResponse)));
}

class IbBookingErrorHandlerServiceMock {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(() => (source) => source);
}

// @ts-ignore
interface TestService extends IbBookingCheckVoucherCodeService {
    BookingRxProxy: BookingRxProxyMock;
    IbBookingErrorHandlerService: IbBookingErrorHandlerServiceMock;
}

describe('Test ib-booking-check-voucher-code.service.spec.ts', () => {
    let service: TestService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IbBookingCheckVoucherCodeService,
                { provide: BookingRxProxy, useClass: BookingRxProxyMock },
                { provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock }
            ]
        });
        service = TestBed.inject(IbBookingCheckVoucherCodeService) as any;
    });

    it('should return the data from checkVoucherCode', async () => {
        service.BookingRxProxy.getResponse = { data: 'voucher data' };
        const response = await service.checkVoucherCode('voucherCode', 'orderId');
        expect(response.data).toEqual('voucher data' as any);
    });

    it('should handle error in checkVoucherCode', async () => {
        service.BookingRxProxy.get = jasmine.createSpy('get').and.callFake(() => throwError('error'));
        try {
            await service.checkVoucherCode('voucherCode', 'orderId');
        } catch (error) {
            expect(error).toEqual('error');
        }
    });

    it('should return the data from deleteVoucherCode', async () => {
        service.BookingRxProxy.deleteResponse = { data: 'deleted voucher' };
        const response = await service.deleteVoucherCode('voucherCode', 'orderId');
        expect(response.data).toEqual('deleted voucher' as any);
    });

    it('should handle error in deleteVoucherCode', async () => {
        service.BookingRxProxy.delete = jasmine.createSpy('delete').and.callFake(() => throwError('error'));
        try {
            await service.deleteVoucherCode('voucherCode', 'orderId');
        } catch (error) {
            expect(error).toEqual('error');
        }
    });

    it('should return the data from validateVoucherCodeOtp', async () => {
        service.BookingRxProxy.postResponse = { data: 'validated otp' };
        const response = await service.validateVoucherCodeOtp('orderId', 'voucherId', 'otpSessionId');
        expect(response.data).toEqual('validated otp' as any);
    });

    it('should handle error in validateVoucherCodeOtp', async () => {
        service.BookingRxProxy.post = jasmine.createSpy('post').and.callFake(() => throwError('error'));
        try {
            await service.validateVoucherCodeOtp('orderId', 'voucherId', 'otpSessionId');
        } catch (error) {
            expect(error).toEqual('error');
        }
    });
});
