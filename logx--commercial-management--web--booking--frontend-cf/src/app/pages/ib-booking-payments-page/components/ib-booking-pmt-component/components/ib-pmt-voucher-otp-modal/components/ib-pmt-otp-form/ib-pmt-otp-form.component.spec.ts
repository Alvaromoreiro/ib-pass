
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { OtpFormStatesEnum, OtpFormStatesEnumValues, OtpInputChangeEvent } from 'src/app/core/models/ib-pmt-voucher-otp-models';
import { IbPmtOtpFormComponent } from '@pages/ib-booking-payments-page/components/ib-booking-pmt-component/components/ib-pmt-voucher-otp-modal/components/ib-pmt-otp-form/ib-pmt-otp-form.component';
import { OtpValidationService } from '@shared/http-services/otp-cloud/ib-otp-validation.service';
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
        // Reset spy before each test to avoid contamination
        fakeOtpValidation.validate.calls.reset();
        
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
        component.inputs = {reset: jasmine.createSpy('reset'), setEnabled: jasmine.createSpy('setEnabled')} as any;
    });

    it('Test writing state incomplete', (done)=> {
        const sub = component.otpFormState.pipe(takeUntil(unsubscribe$)).subscribe(({state})=> {
            expect(state).toBe(OtpFormStatesEnum.INCOMPLETE);
            if(state === OtpFormStatesEnum.INCOMPLETE) {
                expect(component.inputs.setEnabled).toHaveBeenCalledWith(true);
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
                expect(state).toBe(OtpFormStatesEnum.SUCCESS);
                expect(fakeOtpValidation.validate).toHaveBeenCalledWith({otpCode: '123456', sessionToken: 'asdfasdfsf'});
                sub.unsubscribe();
                done();
            } else if (errorStates.has(state))  {
                sub.unsubscribe();
                done.fail(`Expected SUCCESS but got ${state}`);
            }
            // Ignore LOADING and other intermediate states
        });
        inputSubject$.next({value: '123456'});
    });

    const otpValidationScenarios: Array<{
        description: string;
        otpCode: string;
        expectedState: OtpFormStatesEnumValues;
        forbiddenStates: OtpFormStatesEnumValues[];
        shouldResetInputs?: boolean;
    }> = [
        {
            description: 'Test when code is invalid',
            otpCode: '000008',
            expectedState: OtpFormStatesEnum.INVALID_CODE,
            forbiddenStates: [OtpFormStatesEnum.ERROR, OtpFormStatesEnum.SUCCESS, OtpFormStatesEnum.INVALID_SESSION, OtpFormStatesEnum.TIMEOUT],
            shouldResetInputs: true
        },
        {
            description: 'Test when session fails OTP005',
            otpCode: '000005',
            expectedState: OtpFormStatesEnum.INVALID_SESSION,
            forbiddenStates: [OtpFormStatesEnum.ERROR, OtpFormStatesEnum.SUCCESS, OtpFormStatesEnum.INVALID_CODE, OtpFormStatesEnum.TIMEOUT]
        },
        {
            description: 'Test when session fails OTP006',
            otpCode: '000006',
            expectedState: OtpFormStatesEnum.INVALID_SESSION,
            forbiddenStates: [OtpFormStatesEnum.ERROR, OtpFormStatesEnum.SUCCESS, OtpFormStatesEnum.INVALID_CODE, OtpFormStatesEnum.TIMEOUT]
        },
        {
            description: 'Test when session fails OTP007',
            otpCode: '000007',
            expectedState: OtpFormStatesEnum.INVALID_SESSION,
            forbiddenStates: [OtpFormStatesEnum.ERROR, OtpFormStatesEnum.SUCCESS, OtpFormStatesEnum.INVALID_CODE, OtpFormStatesEnum.TIMEOUT]
        },
        {
            description: 'Test when session fails with generic error',
            otpCode: '000000',
            expectedState: OtpFormStatesEnum.ERROR,
            forbiddenStates: [OtpFormStatesEnum.INVALID_SESSION, OtpFormStatesEnum.SUCCESS, OtpFormStatesEnum.INVALID_CODE, OtpFormStatesEnum.TIMEOUT]
        }
    ];

    otpValidationScenarios.forEach(({description, otpCode, expectedState, forbiddenStates, shouldResetInputs}) => {
        it(description, (done)=> {
            const errorStates = new Set<OtpFormStatesEnumValues>(forbiddenStates);
            const sub = component.otpFormState.pipe(takeUntil(unsubscribe$)).subscribe(({state})=> {
                if(state === expectedState) {
                    expect(state).toBe(expectedState);
                    expect(fakeOtpValidation.validate).toHaveBeenCalledWith({otpCode, sessionToken: 'asdfasdfsf'});

                    if(shouldResetInputs) {
                        expect(component.inputs?.reset).toHaveBeenCalled();
                        expect(component.inputs.setEnabled).toHaveBeenCalledWith(true);
                    }

                    sub.unsubscribe();
                    done();
                } else if (errorStates.has(state))  {
                    sub.unsubscribe();
                    done.fail(`Expected ${expectedState} but got ${state}`);
                }
            });
            inputSubject$.next({value: otpCode});
        });
    });

    it('Test timeout Error', fakeAsync(()=> {
        component.otpTimeStart = new Date().toISOString();
        component.otpTimeLimit = new Date(new Date().getTime() + 10).toISOString();
        let reachedTimeout =  false;
        const errorStates = new Set<OtpFormStatesEnumValues>([OtpFormStatesEnum.INVALID_SESSION, OtpFormStatesEnum.SUCCESS, OtpFormStatesEnum.INVALID_CODE, OtpFormStatesEnum.ERROR]);
        const sub = component.otpFormState.pipe(takeUntil(unsubscribe$)).subscribe(({state})=> {
            if(state === OtpFormStatesEnum.TIMEOUT) {
                sub.unsubscribe();
                reachedTimeout = true;
            } else if (errorStates.has(state))  {
                sub.unsubscribe();
            }
        });
       
        component.ngOnChanges();
        tick((component['SECOND_MILISECONDS'] / 4 ) + 10 );
        expect(reachedTimeout).toBe(true);

    }));
    
}); 
