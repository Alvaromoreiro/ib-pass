import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbBookingPassengerWarningMessageComponent } from '@pages/ib-booking-passenger-info/components/ib-booking-passenger-warning-message/ib-booking-passenger-warning-message.component';

describe('IbBookingPassengerWarningMessageUpgradedComponent', () => {
    let component: IbBookingPassengerWarningMessageComponent;
    let fixture: ComponentFixture<IbBookingPassengerWarningMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ IbBookingPassengerWarningMessageComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IbBookingPassengerWarningMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
