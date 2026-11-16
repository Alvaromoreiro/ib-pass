import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbBookingHeaderMultitripTooltipComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-multitrip-tooltip/ib-booking-header-multitrip-tooltip.component';

xdescribe('IbBookingHeaderMultitripTooltipComponent', () => {
    let component: IbBookingHeaderMultitripTooltipComponent;
    let fixture: ComponentFixture<IbBookingHeaderMultitripTooltipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingHeaderMultitripTooltipComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(
            IbBookingHeaderMultitripTooltipComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
