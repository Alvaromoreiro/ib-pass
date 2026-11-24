import { TestBed } from '@angular/core/testing';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbCoupletPmtVoucherOtpModalService } from 'src/app/feature/components/ib-pmt-voucher-otp-modal/ib-pmt-voucher-otp-modal.service';

class IbCModalServiceMock {
    public showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.callFake(()=> {
        return {componentInstance : {}};
    });
}

describe('Test ib-pmt-voucher-otp', ()=> {
    let service:IbCoupletPmtVoucherOtpModalService;
    const fakeModalService = new(IbCModalServiceMock);
    beforeEach( () => {
        TestBed.configureTestingModule( {
            imports: [  ],
            providers: [
                IbCoupletPmtVoucherOtpModalService,
                {provide:IbCModalService, useValue: fakeModalService}
            ]
        } );
        service = TestBed.inject( IbCoupletPmtVoucherOtpModalService );
    } );

    it('Test showOTPModal', ()=> {
        service.showOrmOTPModal({});
        expect(fakeModalService.showGenericComponentModal).toHaveBeenCalled();
    });
});