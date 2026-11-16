import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbBookingHeaderTripComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-trip/ib-booking-header-trip.component';

xdescribe('IbBookingHeaderTripComponent', () => {
    let component: IbBookingHeaderTripComponent;
    let fixture: ComponentFixture<IbBookingHeaderTripComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingHeaderTripComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingHeaderTripComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
