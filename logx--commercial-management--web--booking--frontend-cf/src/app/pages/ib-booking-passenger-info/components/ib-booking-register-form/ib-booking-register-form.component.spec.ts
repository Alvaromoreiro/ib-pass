import { IbBookingRegisterFormComponent } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-register-form/ib-booking-register-form.component';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { IbBookingRegisterFormDataService } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-register-form/services/ib-booking-register-form-data.service';
import { IbBookingPassengerFormUtilsService } from '@src/app/shared/services/ib-booking-passenger-form/ib-booking-passenger-form-utils.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';

const fakeIbBookingRegisterFormDataService = {
    setName: jasmine.createSpy('setName'),
    setLastName: jasmine.createSpy('setLastName'),
    setEmail: jasmine.createSpy('setEmail'),
    setPassword: jasmine.createSpy('setPassword'),
    setCheck: jasmine.createSpy('setCheck'),
    setMarketingCheck: jasmine.createSpy('setMarketingCheck'),
    resetData: jasmine.createSpy('resetData'),
    name$: of(''),
    lastName$: of(''),
    email$: of(''),
    marketingCheck$: of(false)
};

const fakeIbBookingPassengerFormUtilsService = {
    cleanEdgeChars: jasmine.createSpy('cleanEdgeChars').and.callFake((value: string) => {
        if (!value) return value;
        return value.replace(/^[\s'-]+|[\s'-]+$/g, '');
    })
};

const mockGeneralLinksList = {
    'IBERIA_REGISTER_CONDITIONS': {
        uri: '/condiciones-registro/'
    },
    'DATA_PROTECTION_POLICY_LINK': {
        uri: '/informacion-sobre-privacidad/'
    }
};

describe('IbBookingRegisterFormComponent', () => {
    let component: IbBookingRegisterFormComponent;
    let fixture: ComponentFixture<IbBookingRegisterFormComponent>;
    const fakeSessionStorage = new StorageServiceMock();

    beforeEach(async () => {
        // Limpiamos los spies entre tests para que toHaveBeenCalledWith no arrastre llamadas previas
        fakeIbBookingRegisterFormDataService.setName.calls.reset();
        fakeIbBookingRegisterFormDataService.setLastName.calls.reset();
        fakeIbBookingRegisterFormDataService.setEmail.calls.reset();
        fakeIbBookingRegisterFormDataService.setPassword.calls.reset();
        fakeIbBookingRegisterFormDataService.setCheck.calls.reset();
        fakeIbBookingRegisterFormDataService.setMarketingCheck.calls.reset();
        fakeIbBookingPassengerFormUtilsService.cleanEdgeChars.calls.reset();

        await TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ReactiveFormsModule
            ],
            declarations: [IbBookingRegisterFormComponent],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            providers: [
                { provide: CommonsSessionStorageService, useValue: fakeSessionStorage },
                { provide: IbBookingRegisterFormDataService, useValue: fakeIbBookingRegisterFormDataService },
                { provide: IbBookingPassengerFormUtilsService, useValue: fakeIbBookingPassengerFormUtilsService },
                FormBuilder
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IbBookingRegisterFormComponent);
        component = fixture.componentInstance;
        fakeSessionStorage.set('generalLinksList', mockGeneralLinksList);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Listen valueChanges', () => {
        it('in name input', () => {
            const nameControl = component.registerForm.get('name');
            nameControl?.setValue('John');
            expect(fakeIbBookingRegisterFormDataService.setName).toHaveBeenCalledWith('John');
        });
        it('in password input', fakeAsync(() => {
            const passwordControl = component.registerForm.get('password');
            passwordControl?.setValue('TestPassword');
            fixture.detectChanges();
            tick(300);
            expect(fakeIbBookingRegisterFormDataService.setPassword).toHaveBeenCalledWith('TestPassword');
            discardPeriodicTasks();
        }));
        it('in check input', fakeAsync(() => {
            const checkControl = component.registerForm.get('check_register');
            checkControl?.setValue(true);
            fixture.detectChanges();
            tick(300);
            expect(fakeIbBookingRegisterFormDataService.setCheck).toHaveBeenCalledWith(true);
            discardPeriodicTasks();
        }));
        it('in marketing_check input', fakeAsync(() => {
            const marketingControl = component.registerForm.get('marketing_check');
            marketingControl?.setValue(true);
            fixture.detectChanges();
            tick(300);
            expect(fakeIbBookingRegisterFormDataService.setMarketingCheck).toHaveBeenCalledWith(true);
            discardPeriodicTasks();
        }));
    });

    describe('onRegisterNameBlur', () => {
        it('should clean edge chars and update the control', () => {
            const nameControl = component.registerForm.get('name');
            nameControl?.setValue('-Álvaro ');

            component.onRegisterNameBlur('name');

            expect(fakeIbBookingPassengerFormUtilsService.cleanEdgeChars).toHaveBeenCalledWith('-Álvaro ');
            expect(nameControl?.value).toBe('Álvaro');
        });

        it('should not update the control if value is already clean', () => {
            const nameControl = component.registerForm.get('name');
            nameControl?.setValue('Álvaro');
            const setValueSpy = spyOn(nameControl!, 'setValue').and.callThrough();

            component.onRegisterNameBlur('name');

            expect(setValueSpy).not.toHaveBeenCalled();
        });

        it('should do nothing if control does not exist', () => {
            expect(() => component.onRegisterNameBlur('nonExistentControl')).not.toThrow();
        });
    });

    describe('Call toogleVisibility', () => {
        it('should toggle visibility if dropdown is closed', () => {
            const event = new Event('click');
            spyOn(event, 'preventDefault');
            component.openCollapsable = false;
            component.toogleVisibility(event);
            expect(component.openCollapsable).toBeTrue();
        });
        it('should toggle visibility if dropdown is opened', () => {
            const event = new Event('click');
            spyOn(event, 'preventDefault');
            component.openCollapsable = true;
            component.toogleVisibility(event);
            expect(component.openCollapsable).toBeFalse();
        });
    });

    describe('Call toogleShowPass', () => {
        let event: Event;
        let input: HTMLInputElement;

        beforeEach(() => {
            event = new Event('click');
            spyOn(event, 'preventDefault');
            input = document.getElementById('register_module_password') as HTMLInputElement;
        });

        it('should toggle password visibility if text type is password', () => {
            input.type = 'password';
            component.toogleShowPass(event);
            expect(input.type).toBe('text');
            expect(component.showPass).toBe(true);
        });

        it('should toggle password visibility if text type is text', () => {
            input.type = 'text';
            component.showPass = true;
            component.toogleShowPass(event);
            expect(input.type).toBe('password');
            expect(component.showPass).toBe(false);
        });
    });

    it('should clean up observables on destroy', () => {
        const destroySpy = spyOn(component['destroy$'], 'next');
        const completeSpy = spyOn(component['destroy$'], 'complete');

        component.ngOnDestroy();

        expect(destroySpy).toHaveBeenCalled();
        expect(completeSpy).toHaveBeenCalled();
    });

    it('should handle changes in submitState', () => {
        component.ngOnInit();
        const changes: SimpleChanges = {
            submitState: new SimpleChange(false, true, false)
        };

        component.registerForm.get('password')?.markAsTouched();
        component.registerForm.get('check_register')?.markAsTouched();
        spyOn(component, 'toogleVisibility');

        component.ngOnChanges(changes);

        expect(component.toogleVisibility).toHaveBeenCalled();
    });
});