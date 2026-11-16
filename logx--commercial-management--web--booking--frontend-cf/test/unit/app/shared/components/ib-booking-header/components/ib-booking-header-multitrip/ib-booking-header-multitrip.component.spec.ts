import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbBookingHeaderMultitripComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-multitrip/ib-booking-header-multitrip.component';

xdescribe('IbBookingHeaderMultitripComponent', () => {
    let component: IbBookingHeaderMultitripComponent;
    let fixture: ComponentFixture<IbBookingHeaderMultitripComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingHeaderMultitripComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingHeaderMultitripComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
