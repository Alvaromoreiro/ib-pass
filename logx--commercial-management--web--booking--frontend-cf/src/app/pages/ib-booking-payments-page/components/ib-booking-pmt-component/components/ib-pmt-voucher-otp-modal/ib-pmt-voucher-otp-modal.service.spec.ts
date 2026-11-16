import { TestBed } from '@angular/core/testing';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbPmtVoucherOtpModalService } from '@pages/ib-booking-payments-page/components/ib-booking-pmt-component/components/ib-pmt-voucher-otp-modal/ib-pmt-voucher-otp-modal.service';

class IbCModalServiceMock {
    public showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.callFake(()=> {
        return {componentInstance : {}};
    });
}

describe('Test ib-pmt-voucher-otp', ()=> {
    let service:IbPmtVoucherOtpModalService;
    const fakeModalService = new(IbCModalServiceMock);
    beforeEach( () => {
        TestBed.configureTestingModule( {
            imports: [  ],
            providers: [
                IbPmtVoucherOtpModalService,
                {provide:IbCModalService, useValue: fakeModalService}
            ]
        } );
        service = TestBed.inject( IbPmtVoucherOtpModalService );
    } );

    it('Test showOTPModal', ()=> {
        service.showOTPModal({});
        expect(fakeModalService.showGenericComponentModal).toHaveBeenCalled();
    });
});