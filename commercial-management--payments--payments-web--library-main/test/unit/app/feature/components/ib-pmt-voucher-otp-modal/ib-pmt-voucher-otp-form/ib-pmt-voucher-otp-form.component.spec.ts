
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed} from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { OtpFormStatesEnum, OtpFormStatesEnumValues, OtpInputChangeEvent } from 'src/app/core/models/ib-pmt-voucher-otp-models';
import { IbPmtOtpFormComponent } from 'src/app/feature/components/ib-pmt-voucher-otp-modal/components/ib-pmt-otp-form/ib-pmt-otp-form.component';
import { OtpValidationService } from 'src/app/shared/http-services/otp/ib-otp-validation.service';

class OtpValidationServiceMock {
    validate = jasmine.createSpy('createSpy').and.callFake(({otpCode})=> {
        if(otpCode ==='123456'){
            return Promise.resolve();
        } 
        if(otpCode === '000008'){
            return Promise.reject({code: 'OTP008'});
        }
        if(otpCode === '000005'){
            return Promise.reject({code: 'OTP005'});
        }
        if(otpCode === '000006'){
            return Promise.reject({code: 'OTP006'});
        }
        if(otpCode === '000007'){
            return Promise.reject({code: 'OTP007'});
        }
        return Promise.reject({code: ''});
    });
}

describe('Test OTP form', ()=> {
    let fixture;
    let component: IbPmtOtpFormComponent;
    let fakeOtpValidation = new OtpValidationServiceMock();
    let inputSubject$ = new Subject<OtpInputChangeEvent>();
    let unsubscribe$  = new Subject<void>();
    
    afterAll(()=> {
        unsubscribe$.next();
        unsubscribe$.complete();
    });
    beforeEach(async ()=> {
        const expiration = () => {
            const expected = new Date().getTime() + 240000;
            const date = new Date( expected );
            return date.toISOString();
        };
        const viewModel = {
            sessionId: 'asdfasdfsf',
            sessionExpiration: expiration(),
            sessionRequested: new Date().toISOString()
         
        };
        await TestBed.configureTestingModule( {
            
            declarations: [ IbPmtOtpFormComponent ],
            providers: [TranslateService,
                {provide:  OtpValidationService, useValue: fakeOtpValidation}
                
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            imports: [TranslateModule, TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })]
        } );
        fixture = TestBed.createComponent( IbPmtOtpFormComponent);
        component = fixture.componentInstance;
        component.otpTimeLimit = viewModel.sessionExpiration;
        component.otpTimeStart = viewModel.sessionRequested;
        component.otpSessionId = viewModel.sessionId;
        inputSubject$.pipe(takeUntil(unsubscribe$)).subscribe((data)=> component.onOtpChange(data));
        fixture.detectChanges();
        component.inputs = {reset: jasmine.createSpy('reset'), setEnabled: jasmine.createSpy('reset')} as any;
    });

    it('Test writing state incomplete', (done)=> {
        const sub = component.otpFormState.pipe(takeUntil(unsubscribe$)).subscribe(({state})=> {
            if(state === OtpFormStatesEnum.INCOMPLETE) {
                sub.unsubscribe();
                done();
            } else if (state === OtpFormStatesEnum.PRISTINE)  {
                expect(component.inputs.setEnabled).toHaveBeenCalledWith(true);
            } else {
                sub.unsubscribe();
                done.fail();
            }
        });
        inputSubject$.next({value: '123'});
    });

    it('Test when code is entered successfully', (done)=> {
        const errorStates = new Set<OtpFormStatesEnumValues>([OtpFormStatesEnum.ERROR, OtpFormStatesEnum.INVALID_CODE, OtpFormStatesEnum.INVALID_SESSION, OtpFormStatesEnum.TIMEOUT]);
        const sub = component.otpFormState.pipe(takeUntil(unsubscribe$)).subscribe(({state})=> {
            if(state === OtpFormStatesEnum.SUCCESS) {
                sub.unsubscribe();
                done();
            } else if (errorStates.has(state))  {
                sub.unsubscribe();
                done.fail();
            }
        });
        inputSubject$.next({value: '123456'});
    });

    it('Test when code is invalid', (done)=> {
        const errorStates = new Set<OtpFormStatesEnumValues>([OtpFormStatesEnum.ERROR, OtpFormStatesEnum.SUCCESS, OtpFormStatesEnum.INVALID_SESSION, OtpFormStatesEnum.TIMEOUT]);
        const sub = component.otpFormState.pipe(takeUntil(unsubscribe$)).subscribe(({state})=> {
            if(state === OtpFormStatesEnum.INVALID_CODE) {
                sub.unsubscribe();
                expect(component.inputs?.reset).toHaveBeenCalled();
                expect(component.inputs.setEnabled).toHaveBeenCalledWith(true);
                done();
            } else if (errorStates.has(state))  {
                sub.unsubscribe();
                done.fail();
            }
        });
        inputSubject$.next({value: '000008'});
    });
    it('Test when session fails OTP005', (done)=> {
        const errorStates = new Set<OtpFormStatesEnumValues>([OtpFormStatesEnum.ERROR, OtpFormStatesEnum.SUCCESS, OtpFormStatesEnum.INVALID_CODE, OtpFormStatesEnum.TIMEOUT]);
        const sub = component.otpFormState.pipe(takeUntil(unsubscribe$)).subscribe(({state})=> {
            if(state === OtpFormStatesEnum.INVALID_SESSION) {
                sub.unsubscribe();
                done();
            } else if (errorStates.has(state))  {
                sub.unsubscribe();
                done.fail();
            }
        });
        inputSubject$.next({value: '000005'});
    });
    it('Test when session fails OTP006', (done)=> {
        const errorStates = new Set<OtpFormStatesEnumValues>([OtpFormStatesEnum.ERROR, OtpFormStatesEnum.SUCCESS, OtpFormStatesEnum.INVALID_CODE, OtpFormStatesEnum.TIMEOUT]);
        const sub = component.otpFormState.pipe(takeUntil(unsubscribe$)).subscribe(({state})=> {
            if(state === OtpFormStatesEnum.INVALID_SESSION) {
                sub.unsubscribe();
                done();
            } else if (errorStates.has(state))  {
                sub.unsubscribe();
                done.fail();
            }
        });
        inputSubject$.next({value: '000006'});
    });
    it('Test when session fails OTP007', (done)=> {
        const errorStates = new Set<OtpFormStatesEnumValues>([OtpFormStatesEnum.ERROR, OtpFormStatesEnum.SUCCESS, OtpFormStatesEnum.INVALID_CODE, OtpFormStatesEnum.TIMEOUT]);
        const sub = component.otpFormState.pipe(takeUntil(unsubscribe$)).subscribe(({state})=> {
            if(state === OtpFormStatesEnum.INVALID_SESSION) {
                sub.unsubscribe();
                done();
            } else if (errorStates.has(state))  {
                sub.unsubscribe();
                done.fail();
            }
        });
        inputSubject$.next({value: '000007'});
    });
    it('Test when session fails with generic error', (done)=> {
        const errorStates = new Set<OtpFormStatesEnumValues>([OtpFormStatesEnum.INVALID_SESSION, OtpFormStatesEnum.SUCCESS, OtpFormStatesEnum.INVALID_CODE, OtpFormStatesEnum.TIMEOUT]);
        const sub = component.otpFormState.pipe(takeUntil(unsubscribe$)).subscribe(({state})=> {
            if(state === OtpFormStatesEnum.ERROR) {
                sub.unsubscribe();
                done();
            } else if (errorStates.has(state))  {
                sub.unsubscribe();
                done.fail();
            }
        });
        inputSubject$.next({value: '000000'});
    });
    it('Test timeout Error', (done)=> {
        component.otpTimeLimit = new Date().toISOString();
        component.otpTimeStart = new Date().toISOString();
        component.ngOnChanges();
        const errorStates = new Set<OtpFormStatesEnumValues>([OtpFormStatesEnum.INVALID_SESSION, OtpFormStatesEnum.SUCCESS, OtpFormStatesEnum.INVALID_CODE, OtpFormStatesEnum.ERROR]);
        const sub = component.otpFormState.pipe(takeUntil(unsubscribe$)).subscribe(({state})=> {
            if(state === OtpFormStatesEnum.TIMEOUT) {
                sub.unsubscribe();
                expect(component.inputs.setEnabled).toHaveBeenCalledWith(false);
                done();
            } else if (errorStates.has(state))  {
                sub.unsubscribe();
                done.fail();
            }
        });
    });
    
}); 