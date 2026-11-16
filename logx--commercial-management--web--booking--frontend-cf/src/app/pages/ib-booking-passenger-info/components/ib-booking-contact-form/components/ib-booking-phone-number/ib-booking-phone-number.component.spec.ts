import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IbBookingPhoneNumberComponent } from '@pages/ib-booking-passenger-info/components/ib-booking-contact-form/components/ib-booking-phone-number/ib-booking-phone-number.component';
import { IbBookingContactFormDataService } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-contact-form/services/ib-booking-contact-form-data.service';
import { BehaviorSubject } from 'rxjs';

class ContactFormDataServiceStub {
    prefix$ = new BehaviorSubject<any>({ code: '+00', description: 'init' });
    phone$  = new BehaviorSubject<string>('');
    setPrefix = jasmine.createSpy('setPrefix');
    setPhone  = jasmine.createSpy('setPhone');
}


describe('IbBookingPhoneNumberComponent', () => {
    let component: IbBookingPhoneNumberComponent;
    let fixture: ComponentFixture<IbBookingPhoneNumberComponent>;
    let dataStub: ContactFormDataServiceStub;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ReactiveFormsModule
            ],
            declarations: [ IbBookingPhoneNumberComponent ],
            providers: [
                { provide: IbBookingContactFormDataService, useClass: ContactFormDataServiceStub }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).overrideComponent(IbBookingPhoneNumberComponent, { set: { template: '' } })
            .compileComponents();

        fixture = TestBed.createComponent(IbBookingPhoneNumberComponent);
        component = fixture.componentInstance;
        dataStub  = TestBed.inject(IbBookingContactFormDataService) as any;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('updatePrefixValues / removeDuplicateCountry', () => {

        beforeEach(() => {
            component.prefixList = [
                { code: '34', description: 'Spain',  countryCode: 'ES' },
                { code: '34', description: 'España', countryCode: 'ES' },
                { code: '1',  description: 'USA',    countryCode: 'US' }
            ];
        });
    
        it('adds "+" to all codes, removes duplicates and set filteredPrefix', () => {
            component['updatePrefixValues']();
    
            expect(component.prefixList.length).toBe(2);
            expect(component.prefixList.every(p => p.code.startsWith('+'))).toBeTrue();
            expect(component.filteredPrefix.length).toBe(2);
        });
    
        it('removeDuplicateCountry deletes copies', () => {
            component['removeDuplicateCountry']();
            expect(component.prefixList.length).toBe(2);
            expect(component.prefixList.filter(p => p.code === '34').length).toBe(1);
        });
    });
    
    describe('ngOnChanges', () => {
        it('should call updatePrefixValues when prefixList changes', () => {
            const spy = spyOn<any>(component, 'updatePrefixValues').and.callThrough();
    
            const newList = [
                { code: '49', description: 'Germany', countryCode: 'DE' }
            ];

            component.prefixList = newList;

            component.ngOnChanges({
                prefixList: {
                    previousValue: [],
                    currentValue : newList,
                    firstChange  : false,
                    isFirstChange: () => false
                }
            });
    
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('onFocus / onShow / onHide', () => {

        it('onFocus should call AutoComplete.show()', () => {
            const showSpy = jasmine.createSpy('show');
            component.autoComplete = { show: showSpy } as any;
    
            component.onFocus();
            expect(showSpy).toHaveBeenCalled();
        });

        it('onShow adds "rotate" class', () => {
            const icon = document.createElement('div');
            component['dropdownIcon'] = icon;
      
            const addSpy = spyOn(component['renderer'], 'addClass').and.callThrough();

            component.onShow();
            expect(addSpy).toHaveBeenCalledWith(icon, 'rotate');
        });
      
        it('onHide removes "rotate" class', () => {
            const icon = document.createElement('div');
            component['dropdownIcon'] = icon;
      
            const removeSpy = spyOn(component['renderer'], 'removeClass').and.callThrough();

            component.onHide();
            expect(removeSpy).toHaveBeenCalledWith(icon, 'rotate');
        });

        describe('onBlur', () => {

            it('restore previous prefix when current is empty', () => {
                const previous = '+34';
                component.previousPrefix = previous;
                component.phoneForm.get('prefix')?.setValue('');
        
                component.onBlur();
        
                expect(component.phoneForm.get('prefix')?.value).toEqual(previous);
            });
        
            it('store current value as previousPrefix when not empty', () => {
                const current = '+44';
                component.phoneForm.get('prefix')?.setValue(current);
        
                component.onBlur();
        
                expect(component.previousPrefix).toEqual(current);
            });
        });
    });
}); 