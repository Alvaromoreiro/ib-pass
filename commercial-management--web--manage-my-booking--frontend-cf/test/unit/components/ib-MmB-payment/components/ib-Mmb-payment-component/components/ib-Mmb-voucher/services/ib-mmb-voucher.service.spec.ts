import { TestBed, fakeAsync } from "@angular/core/testing";
import { IbMmbVoucherService } from "@src/components/ib-MmB-payment/components/ib-Mmb-payment-component/components/ib-mmb-voucher/services/ib-mmb-voucher.service";
import { AJSCommonsGenericProxyService } from '../../../../../../../../../src/components/services/http/commons-proxy-bridge.service';
import { MmBAppConstants } from '@src/ib-MmB-constants';

class CommonsGenericProxyServiceMock {
    postGeneric = (uri, redirectionObject) => {
        if (this) {
            return Promise.resolve(this);
        } else {
            return Promise.reject();
        }
    };
    deleteGeneric = (uri, redirectionObject) => {
        if (this) {
            return Promise.resolve(this);
        } else {
            return Promise.reject();
        }
    };
}

describe('Test IbMmbVoucherService', () => {
    let service: IbMmbVoucherService;
    let fakeCommonsGenericProxyService: CommonsGenericProxyServiceMock = new CommonsGenericProxyServiceMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IbMmbVoucherService,
                { provide: AJSCommonsGenericProxyService, useValue: fakeCommonsGenericProxyService }
            ]
        });
        service = TestBed.inject(IbMmbVoucherService);
    });


    describe('Test Voucher service check and delete functions', () => {
        it('Should service be created', () => {
            expect(service).toBeTruthy();
        });


        it('Should checkVuucherCode', fakeAsync((done) => {
            const flowId = 'TWFuYWdlTXlCb29raW5nQElCNzE2YjQ5YWZhYmYxNGNiMTg4YzJjNDk0ZjJhNmExODY=';
            const voucherCode = 'CODE123';
            const checkVoucherCode = service.checkVoucherCode(voucherCode, flowId);

            expect(checkVoucherCode instanceof Promise).toBe(true);
        }));

        it('Should deleteVoucherCode', fakeAsync((done) => {
            const flowId = 'TWFuYWdlTXlCb29raW5nQElCNzE2YjQ5YWZhYmYxNGNiMTg4YzJjNDk0ZjJhNmExODY=';
            const voucherCode = 'CODE123';

            const deleteVoucherCode = service.deleteVoucherCode(voucherCode, flowId);
            expect(deleteVoucherCode instanceof Promise).toBe(true);

        }));
    });

});
