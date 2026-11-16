import { emptySpecialNeeds, enableSpecialNeedsCheck, filledSpecialNeeds, phoneList } from '@test-mocks/unit/app/pages/ib-booking-passenger-info/ib-booking-passenger-special-needs/SpecialNeedsMock';
import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { IbBookingPassengerSpecialNeedsComponent } from '@pages/ib-booking-passenger-info/components/ib-booking-passenger-special-needs/ib-booking-passenger-special-needs.component';
import { OverlayPanel } from 'primeng/overlaypanel';



describe('IbBookingPassengerSpecialNeedsComponent', () => {

    let component: IbBookingPassengerSpecialNeedsComponent;
    let fixture: ComponentFixture<IbBookingPassengerSpecialNeedsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingPassengerSpecialNeedsComponent],
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
                FormBuilder
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingPassengerSpecialNeedsComponent);
        component = fixture.componentInstance;
        component.index = 0;
        component.passengersFormData = emptySpecialNeeds;
        component.phonesList = phoneList;
        component.ngOnChanges({
            index: new SimpleChange(null, 0, true),
            passengersFormData: new SimpleChange(null, emptySpecialNeeds, true)
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        component.passengersFormData = emptySpecialNeeds;
        expect(component).toBeTruthy();
        expect(component.specialNeedsForm.get([`check_enable_${component.index}`]).value).toBeFalsy();
        expect(component.specialNeedsForm.get([`check_vision_${component.index}`]).value).toBeFalsy();
        expect(component.specialNeedsForm.get([`check_hearing_${component.index}`]).value).toBeFalsy();
        expect(component.specialNeedsForm.get([`check_intellDisability_${component.index}`]).value).toBeFalsy();
        expect(component.specialNeedsForm.get([`check_guide_dog_${component.index}`]).value).toBeFalsy();
        expect(component.specialNeedsForm.get([`check_chair_${component.index}`]).value).toBeFalsy();
        expect(component.specialNeedsForm.get('specialWheelchair').value).toBeFalsy();
        expect(component.specialNeedsForm.get('specialWheelchairValue').value).toBeFalsy();
    });
    
    it('should create form with stored values', fakeAsync(()=>{
        component.passengersFormData = filledSpecialNeeds;
        component.phonesList = null;
        component.ngOnChanges({
            index: new SimpleChange(null, 0, true),
            passengersFormData: new SimpleChange(null, filledSpecialNeeds, true)
        });
        tick();
        expect(component.specialNeedsForm.get([`check_enable_${component.index}`]).value).toBeTruthy();
        expect(component.specialNeedsForm.get([`check_vision_${component.index}`]).value).toBeTruthy();
        expect(component.specialNeedsForm.get([`check_hearing_${component.index}`]).value).toBeTruthy();
        expect(component.specialNeedsForm.get([`check_intellDisability_${component.index}`]).value).toBeTruthy();
        expect(component.specialNeedsForm.get([`check_guide_dog_${component.index}`]).value).toBeTruthy();
        expect(component.specialNeedsForm.get([`check_chair_${component.index}`]).value).toBeTruthy();
        expect(component.specialNeedsForm.get('specialWheelchair').value).toBeTruthy();
        expect(component.phone).toEqual('901 111 500');
    }));

    it('should emit validaton error if no specialneed is check and enable special needs is checked', ()=>{
        component.passengersFormData = enableSpecialNeedsCheck;
        component.ngOnChanges({
            index: new SimpleChange(null, 0, true),
            passengersFormData: new SimpleChange(null, enableSpecialNeedsCheck, true)
        });
        expect(component.specialNeedsForm.errors).toEqual({specialNeedRequired: true});
    });

    describe('When openPopover is called', () => {
        beforeEach(() => {
         
        });
        it('should open special needs popover with defined text', () => {
            const overlayPanelMock = { toggle: jasmine.createSpy('toggle') } as any as OverlayPanel;
            const eventMock = { preventDefault: jasmine.createSpy('preventDefault') } as any as Event;

            component.relatedContent = { popoverText: 'text' };
            component.openPopover(eventMock, overlayPanelMock);

            expect(component.popoverText).toBe('text');
            expect(overlayPanelMock.toggle).toHaveBeenCalledWith(eventMock);
            expect(eventMock.preventDefault).toHaveBeenCalled();
        });
        it('should open special needs popover with default text', () => {
            const overlayPanelMock = { toggle: jasmine.createSpy('toggle') } as any as OverlayPanel;
            const eventMock = { preventDefault: jasmine.createSpy('preventDefault') } as any as Event;

            component.relatedContent = undefined;
            component.openPopover(eventMock, overlayPanelMock);

            expect(component.popoverText).toBe('IB_PASSENGER_SPE_NEEDS_POPOVER_CONTENT');
        });
    });
    describe('When closePopover is called', () => {
        it('should close special needs popover', () => {
            const overlayPanelMock = { hide: jasmine.createSpy('hide') } as any as OverlayPanel;
            component.closePopover(overlayPanelMock);
            expect(overlayPanelMock.hide).toHaveBeenCalled();
        });
    });

    describe('When form values changes', () => {
        it('should emit values to specialNeedsChange', fakeAsync(() => {
            spyOn(component.specialNeedsChange, 'emit');
            component.specialNeedsForm.get([`check_vision_${component.index}`]).setValue(true);
            tick(100);
            expect(component.specialNeedsChange.emit).toHaveBeenCalledWith({
                values: { 
                    check_enable_0: false,
                    check_vision_0: true,
                    check_hearing_0: false,
                    check_intellDisability_0: false,
                    check_guide_dog_0: false,
                    check_chair_0: false,
                    specialWheelchair: false,
                    specialWheelchairValue: ''
                },
                isValid: component.specialNeedsForm.valid
            });
        }));
    });

    describe('When isEnabledSpecialNeed is called', () => {
        beforeEach(() => {
         
        });
        it('should return if one specialNeed is available to show it', () => {
            let returnValue = component.isEnabledSpecialNeed('BLND');
            expect(returnValue).toBeTrue();
        });
    });
});