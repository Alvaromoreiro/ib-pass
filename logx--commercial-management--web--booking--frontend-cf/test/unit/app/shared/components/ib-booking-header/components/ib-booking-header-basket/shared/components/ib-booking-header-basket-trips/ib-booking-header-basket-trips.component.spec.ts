import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingHeaderBasketTripsComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-trips/ib-booking-header-basket-trips.component';
import { AJSRootScope } from 'ib-web-commons/utils';

class FakeRootScopeMock {
    public isPointsOBFlow = true;
}

let fakeRootScope;
describe('IbBookingHeaderBasketTripsComponent', () => {
    let component: IbBookingHeaderBasketTripsComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketTripsComponent>;

    fakeRootScope = new FakeRootScopeMock();
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingHeaderBasketTripsComponent],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope},
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingHeaderBasketTripsComponent);
        component = fixture.componentInstance;
        component.model = require( '../../../mocks/BasketTrips-mock.json' );
        component.totalTrips = {
            "totalPrice": 86.16,
            "formatted": "86,16€",
            "original": 86.16
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe( 'When ngOnInit', () => {
        it( 'it should set isONB to true', () => {
            fakeRootScope.isPointsOBFlow = true;
            component.ngOnInit();
            fixture.detectChanges();
            expect(component.isONB).toBe( true );
        } );
        it( 'it should set isONB to false', () => {
            fakeRootScope.isPointsOBFlow = false;
            component.ngOnInit();
            fixture.detectChanges();
            expect(component.isONB).toBe( false );
        } );
    } );
});
