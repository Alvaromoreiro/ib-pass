import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingCrossedPricesComponent } from '@src/app/shared/components/ib-booking-crossed-prices/ib-booking-crossed-prices.component';

describe('IbBookingCrossedPricesComponent', () => {
    let component: IbBookingCrossedPricesComponent;
    let fixture: ComponentFixture<IbBookingCrossedPricesComponent>;
    

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ IbBookingCrossedPricesComponent ],
            imports: [TranslateModule.forRoot()]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IbBookingCrossedPricesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
