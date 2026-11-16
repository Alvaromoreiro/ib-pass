import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbBookingHeaderPassengersComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-passengers/ib-booking-header-passengers.component';

xdescribe('IbBookingHeaderPassengersComponent', () => {
    let component: IbBookingHeaderPassengersComponent;
    let fixture: ComponentFixture<IbBookingHeaderPassengersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingHeaderPassengersComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingHeaderPassengersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
