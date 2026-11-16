import { TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AJSRootScope } from 'ib-web-commons/utils';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { OtpFormStatesEnum } from 'src/app/core/models/ib-pmt-voucher-otp-models';
import { IbPmtVoucherOtpModalComponent } from '@pages/ib-booking-payments-page/components/ib-booking-pmt-component/components/ib-pmt-voucher-otp-modal/ib-pmt-voucher-otp-modal.component';
import { IbBookingCheckVoucherCodeService } from '@shared/http-services/sse-orm/ib-booking-check-voucher-code.service';
import { LiteralFormatterPipe } from 'src/app/shared/pipes/literalFormatter.pipe';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';

class NgbActiveModalMock {
    close = jasmine.createSpy('close').and.callFake(()=>{});
    dismiss = jasmine.createSpy('dismiss').and.callFake(()=>{});
}

class LiteralFormatterPipeMock {
    transform = jasmine.createSpy('transform').and.callFake(()=> '');
}
class IbCLinkPipeMock {
    transform = jasmine.createSpy('transform').and.callFake(()=> '');
}
class TranslateServiceMock {
    instant = jasmine.createSpy('instant').and.callFake(()=> '');
}
class IbCheckVoucherCodeServiceMock {
    response =  Promise.resolve({data:  {otpValidation:{ otpSessionId: '', otpSessionExpired:'', otpSessionRequested:'', otpEmail:'test@test.com'} }});
    checkVoucherCode = jasmine.createSpy('checkVoucherCode').and.callFake(()=> this.response);
}
@Pipe({
    name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
    public name: string = 'translate';

    public transform (query: string, ...args: any[]): any {
        return query;
    }
}



describe('Test OTP Modal component', ()=> {
    let fixture;
    let component: IbPmtVoucherOtpModalComponent;
    const fakeNgbActiveModal = new NgbActiveModalMock();
    const fakeLiteralFormatterPipe = new LiteralFormatterPipeMock();
    const fakeTranslateService = new TranslateServiceMock();
    const fakeIbCLinkPipeMock = new IbCLinkPipeMock();
    const fakeCheckVoucherService = new IbCheckVoucherCodeServiceMock();
    const rootscope = {serviceURI:''};
 
    beforeEach(()=>{
        const expiration = () => {
            const expected = new Date().getTime() + 240000;
            const date = new Date( expected );
            return date.toISOString();
        };
        const viewModel = {
            sessionId: 'asdfasdfsf',
            sessionExpiration: expiration(),
            sessionRequested: new Date().toISOString(),
            voucherCode: '',
            flowId: '',
            email: ''
         
        };
        TestBed.configureTestingModule( {
            declarations: [ IbPmtVoucherOtpModalComponent, TranslatePipeMock],
            providers: [
                {provide: NgbActiveModal, useValue: fakeNgbActiveModal},
                {provide: LiteralFormatterPipe, useValue: fakeLiteralFormatterPipe},
                {provide: TranslateService, useValue: fakeTranslateService},
                {provide: IbCLinkPipe, useValue: fakeIbCLinkPipeMock},
                {provide: IbBookingCheckVoucherCodeService, useValue: fakeCheckVoucherService},
                {provide: AJSRootScope, useValue: rootscope}

            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        } );
        fixture = TestBed.createComponent( IbPmtVoucherOtpModalComponent );
        component = fixture.componentInstance;
        component.model = viewModel;
        fixture.detectChanges();
  
    });
    it('Test loading state', ()=> {
        component.onOtpStatesUpdate({state: OtpFormStatesEnum.LOADING});
        expect(component.showLoading).toBe(true);
    });
    it('Test Success state', ()=> {
        component.onOtpStatesUpdate({state: OtpFormStatesEnum.SUCCESS});
        expect(fakeNgbActiveModal.close).toHaveBeenCalled();
    });
    it('Test Error', ()=> {
        component.onOtpStatesUpdate({state: OtpFormStatesEnum.ERROR});
        expect(fakeNgbActiveModal.dismiss).toHaveBeenCalled();
    });
    it('Test enable ask new code', ()=> {
        expect(component.sendNewDisabled).toBe(true);
        component.onOtpStatesUpdate({state: OtpFormStatesEnum.ALLOWED_RESEND_TIME});
        expect(component.sendNewDisabled).toBe(false);
        component.onOtpStatesUpdate({state: OtpFormStatesEnum.PRISTINE});
        expect(component.sendNewDisabled).toBe(true);
    });

    describe('Test resendCode', ()=> {
        let storedResponse  = null;
        beforeEach(()=> {
            storedResponse ??= fakeCheckVoucherService.response;
            fakeCheckVoucherService.response = storedResponse;
        });
        it('When response is ok', (done) => {
            component.resendCode().then(()=> {
                expect(component.model).toEqual( 
                    {
                        voucherCode: '',
                        flowId: '',
                        sessionId: '',
                        sessionExpiration: '',
                        sessionRequested: '',
                        email: 'test@test.com'
                    });
                done();
            }, (err)=> {done.fail(err);});
        });
        it('When response is KO', (done) => {
            fakeCheckVoucherService.response = Promise.reject();
            component.resendCode().then( ()=> {expect(fakeNgbActiveModal.dismiss).toHaveBeenCalled();done();},
                ()=> {done.fail();});
        });
    });
});