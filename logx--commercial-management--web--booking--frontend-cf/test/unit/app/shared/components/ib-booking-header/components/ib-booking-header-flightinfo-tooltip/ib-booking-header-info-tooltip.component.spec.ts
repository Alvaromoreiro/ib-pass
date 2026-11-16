import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingHeaderInfoTooltipComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-flightinfo-tooltip/ib-booking-header-info-tooltip.component';

describe('IbBookingHeaderInfoTooltipComponent', () => {
    let component: IbBookingHeaderInfoTooltipComponent;
    let fixture: ComponentFixture<IbBookingHeaderInfoTooltipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingHeaderInfoTooltipComponent],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(
            IbBookingHeaderInfoTooltipComponent
        );
        component = fixture.componentInstance;
        component.trips = require( '../../mocks/HeaderModelRT.json' ).headerModel.trips;
        component.advancedSearch = true;
        component.isMultiFlight = false;
        component.flightType = 'availabilityFlight';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    } );

    describe( 'When backToMultiFlightSearch', () => {
        it( 'it should emit backToMulti', () => {
            spyOn( component.backToMulti, 'emit' );
            component.backToMultiFlightSearch( true );
            fixture.detectChanges();
            expect(component.backToMulti.emit).toHaveBeenCalled();
        } );
    } );
    describe( 'When openAdvancedSearch', () => {
        it( 'it should emit openSearch', () => {
            spyOn( component.openSearch, 'emit' );
            component.openAdvancedSearch();
            fixture.detectChanges();
            expect(component.openSearch.emit).toHaveBeenCalled();
        } );
    } );
});
