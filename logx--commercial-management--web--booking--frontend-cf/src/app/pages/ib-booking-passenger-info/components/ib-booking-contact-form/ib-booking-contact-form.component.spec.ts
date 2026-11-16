import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { AJSRootScope, CommonsSessionStorageService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { BehaviorSubject, Subject } from 'rxjs';
import { ibSubscriptionPermissionService } from '@src/app/shared/services/ib-utils/ib-subscriptions-permission.service';
import { IbBookingContactFormDataService } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-contact-form/services/ib-booking-contact-form-data.service';
import { IbBookingRegisterFormDataService } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-register-form/services/ib-booking-register-form-data.service';
import { IbBookingContactFormComponent } from '@pages/ib-booking-passenger-info/components/ib-booking-contact-form/ib-booking-contact-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { IbBookingPetsFlowServiceMock } from 'test/mocks/Services/IbBookingPetsFlowServiceMock';
import { IbBookingPetsFlowService } from '@src/app/shared/services/ib-utils/ib-bookig-pets-flow.service';

class RootScopeMock {
    public isLogged = false;
    private handlers: { [name: string]: (...args: any[]) => void } = {};
    $on (name: string, cb: (...args: any[]) => void) { this.handlers[name] = cb; }
    $emit (name: string, ...args: any[]) { this.handlers[name]?.(...args); }
}

class ContactFormDataServiceMock {
    email$ = new BehaviorSubject<string>('');
    denyNews$ = new BehaviorSubject<boolean>(false);
    setEmail (v: string) { }
    setDenyNews (v: boolean) { }
    setPrefix (v: any) { } 
    resetData = jasmine.createSpy('resetData');
}

class RegisterFormDataServiceMock { setEmail (_: string) { } }

class SubPermissionServiceMock {
    getMarketingPermissions = jasmine
        .createSpy('getMarketingPermissions')
        .and.resolveTo({ data: [] });
}

class UserUtilsServiceMock { 
    isIbPlus () { return false; }
    isIbZero () { return false; }

}

describe('IbBookingContactFormComponent', () => {

    let component: IbBookingContactFormComponent;
    let fixture: ComponentFixture<IbBookingContactFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingContactFormComponent],
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: AJSRootScope, useClass: RootScopeMock },
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
                { provide: ibSubscriptionPermissionService, useClass: SubPermissionServiceMock },
                { provide: IbBookingContactFormDataService, useClass: ContactFormDataServiceMock },
                { provide: IbBookingRegisterFormDataService, useClass: RegisterFormDataServiceMock },
                { provide: IbCUserUtilsService, useClass: UserUtilsServiceMock },
                { provide: IbBookingPetsFlowService, useClass: IbBookingPetsFlowServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingContactFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnChanges', () => {

        it('should sanitise GDPR text when gdprInfo changes', () => {
            const sanitizer = TestBed.inject(DomSanitizer);
            const sanitizeSpy = spyOn(sanitizer, 'bypassSecurityTrustHtml')
                .and.callThrough();

            const gdpr = { text: '<p>GDPR</p>' };
            component.gdprInfo = gdpr;

            component.ngOnChanges({
                gdprInfo: {
                    previousValue: null,
                    currentValue: gdpr,
                    firstChange: true,
                    isFirstChange: () => true
                }
            } as any);

            expect(sanitizeSpy).toHaveBeenCalledWith(gdpr.text);
            expect(component.safeGDPR).toBeDefined();
        });

    });

    describe('ngOnDestroy', () => {

        it('should reset data service and complete destroy$', () => {
            const dataService = TestBed.inject(IbBookingContactFormDataService);
            const destroy$ = component['destroy$'] as Subject<void>;

            const nextSpy = spyOn(destroy$, 'next').and.callThrough();
            const completeSpy = spyOn(destroy$, 'complete').and.callThrough();

            component.ngOnDestroy();

            expect((dataService as any).resetData).toHaveBeenCalled();
            expect(nextSpy).toHaveBeenCalled();
            expect(completeSpy).toHaveBeenCalled();
        });
    });

    describe('setRegisterEmail', () => {

        let registerService: RegisterFormDataServiceMock;
        let sessionStorage: StorageServiceMock;

        beforeEach(() => {
            registerService = TestBed.inject(IbBookingRegisterFormDataService) as any;
            sessionStorage = TestBed.inject(CommonsSessionStorageService) as any;
        });

        it('should forward the e-mail when user is NOT logged and #register_module_email exists', () => {

            sessionStorage.set('userLogged', undefined);
            document.body.innerHTML += '<input id="register_module_email">';

            const setEmailSpy = spyOn(registerService, 'setEmail');

            component.contactForm.get('email')?.setValue('john@doe.com');
            component.setRegisterEmail();

            expect(setEmailSpy).toHaveBeenCalledWith('john@doe.com');

            document.getElementById('register_module_email')?.remove();
        });

        describe('checkInput', () => {

            it('should emit "showMarketingPerm"', () => {
                const rootScope = TestBed.inject(AJSRootScope) as RootScopeMock;
                const emitSpy = spyOn(rootScope, '$emit');

                component.marketingPermResponse = [{ dummy: true }];

                component.checkInput(true);

                expect(emitSpy)
                    .toHaveBeenCalledWith('showMarketingPerm', true, component.marketingPermResponse);
            });
        });



        describe('isEmailValid', () => {

            it('should return true for correct e-mail', () => {
                component.contactForm.get('email')?.setValue('foo@bar.com');
                expect(component['isEmailValid']()).toBeTrue();
            });

            it('should return false if e-mail is empty or wrong', () => {
                component.contactForm.get('email')?.setValue('wrong-mail');
                expect(component['isEmailValid']()).toBeFalse();
            });
        });

        describe('e-mail', () => {

            it('emailValidToCheck should store mail and emit checkEmailConsent', () => {
                const emitSpy = spyOn(component.checkEmailConsent, 'emit');

                component.contactForm.get('email')?.setValue('valid@mail.com');
                component['emailValidToCheck']();

                expect(component.mailEmitted).toBe('valid@mail.com');
                expect(emitSpy).toHaveBeenCalledWith('valid@mail.com');
            });

            it('emailInvalid should clear mailEmitted and emit emailsInvalid', () => {
                const emitSpy = spyOn(component.emailsInvalid, 'emit');

                component.mailEmitted = 'whatever';
                component['emailInvalid']();

                expect(component.mailEmitted).toBe('');
                expect(emitSpy).toHaveBeenCalled();
            });
        });

        describe('callEmailConsent', () => {

            it('should emailValidToCheck when e-mail is valid and new', () => {
                component.contactForm.get('email')?.setValue('new@mail.com');
                component.mailEmitted = '';

                const validSpy = spyOn(component as any, 'emailValidToCheck');
                const invalidSpy = spyOn(component as any, 'emailInvalid');

                component.callEmailConsent();

                expect(validSpy).toHaveBeenCalled();
                expect(invalidSpy).not.toHaveBeenCalled();
            });

            it('should emailInvalid when e-mail is invalid', () => {
                component.contactForm.get('email')?.setValue('bad-mail');
                const invalidSpy = spyOn(component as any, 'emailInvalid');

                component.callEmailConsent();

                expect(invalidSpy).toHaveBeenCalled();
            });

            it('should do nothing when isPetsFlow is true', () => {
                const petsFlowService = TestBed.inject(IbBookingPetsFlowService) as IbBookingPetsFlowServiceMock;
                petsFlowService.isPetsFlow = true;
                const validSpy = spyOn(component as any, 'emailValidToCheck');
                const invalidSpy = spyOn(component as any, 'emailInvalid');
                component.callEmailConsent();
                expect(validSpy).not.toHaveBeenCalled();
                expect(invalidSpy).not.toHaveBeenCalled();
            });
        });
    });

    describe('isMarketingPermNeeded', () => {

        let userUtils: UserUtilsServiceMock;
        let permSrv: SubPermissionServiceMock;

        beforeEach(() => {
            userUtils = TestBed.inject(IbCUserUtilsService) as any;
            permSrv = TestBed.inject(ibSubscriptionPermissionService) as any;
        });

        it('should showMarketingPerm false when NOT IbPlus', fakeAsync(() => {
            spyOn(userUtils, 'isIbPlus').and.returnValue(false);

            component['areCommunicationPermsNeeded']();
            tick();

            expect(component.showMarketingPerm).toBeFalsy();
            expect(permSrv.getMarketingPermissions).not.toHaveBeenCalled();
        }));

        it('should set showMarketingPerm to true when no IbPlus and COMMERCIAL_CAMPAIGN', fakeAsync(() => {
            spyOn(userUtils, 'isIbPlus').and.returnValue(true);

            const apiResp = {
                data: [
                    { permissionType: 'COMMERCIAL_CAMPAIGN', permissionGranted: false }
                ]
            };
            permSrv.getMarketingPermissions.and.resolveTo(apiResp);

            component['areCommunicationPermsNeeded']();
            tick();

            expect(component.showMarketingPerm).toBeTrue();
            expect(component.marketingPermResponse).toEqual(apiResp.data);
        }));

        it('should set showMarketingPerm to false when API call fails', fakeAsync(() => {
            spyOn(userUtils, 'isIbPlus').and.returnValue(true);

            permSrv.getMarketingPermissions.and.rejectWith('error');

            component['areCommunicationPermsNeeded']();
            tick();

            expect(component.showMarketingPerm).toBeFalse();
        }));


        it('should set showMarketingPerms to true when IbZero and no MAGAZINE', fakeAsync(() => {
            spyOn(userUtils, 'isIbZero').and.returnValue(true);

            const apiResp = {
                data: [
                    { permissionType: 'MAGAZINE', permissionGranted: false }
                ]
            };
            permSrv.getMarketingPermissions.and.resolveTo(apiResp);

            component['areCommunicationPermsNeeded']();
            tick();

            expect(component.showMarketingPerm).toBeTrue();
            expect(component.marketingPermResponse).toEqual(apiResp.data);
        }));

    });
    describe('Call toogleVisibility', () => {
        it('should toggle visibility if dropdown is closed', fakeAsync(() => {
            const event = new Event('click');
            component.isCollapsableOpen = false;
            component.toggleVisibility(event);
            tick(400);
            expect(component.isCollapsableOpen).toBeTrue();
        }));
        it('should toggle visibility if dropdown is opened', fakeAsync(() => {
            const event = new Event('click');
            component.isCollapsableOpen = true;
            component.toggleVisibility(event);
            tick(300);
            expect(component.isCollapsableOpen).toBeFalse();
        }));
    });
    describe('Update form validity', () => {
        it('should update form validity to true', () => {
            expect(component.isPhoneFormValid).toBeFalse();
            component.updatePhoneFormValidity(true);
            expect(component.isPhoneFormValid).toBeTrue();
        });
    });

    describe('formValidity', () => {
        it('checks with true', fakeAsync(() => {
            const emitSpy = spyOn(component.formValidity, 'emit');

            component.contactForm.get('email')?.setValue('test@test.com');
            component.contactForm.get('contactPrefix')?.setValue({ code: '+34' });

            component.updatePhoneFormValidity(true);
            tick(101);

            expect(emitSpy).toHaveBeenCalledWith(true);
        }));
    });
});