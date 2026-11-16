import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingHeaderMobileComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-mobile/ib-booking-header-mobile.component';

describe("IbBookingHeaderMobileComponent", () => {
    let component: IbBookingHeaderMobileComponent;
    let fixture: ComponentFixture<IbBookingHeaderMobileComponent>;
    let headerModelRT = require( '../../mocks/HeaderModelRT.json' );
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingHeaderMobileComponent],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(IbBookingHeaderMobileComponent);
        component = fixture.componentInstance;
        component.model = headerModelRT.headerModel;
        component.login = headerModelRT.greyBarModel;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
    describe( 'When ngOnInit', () => {
        it( 'it should set isMobile to true', () => {
            component.ngOnInit();
            fixture.detectChanges();
            expect(component.isMobile).toBe( true );
        } );
    } );
    describe( 'When toggleSeeker', () => {
        it( 'it should emit seekerToggle', () => {
            spyOn( component.seekerToggle, 'emit' );
            component.toggleSeeker();
            fixture.detectChanges();
            expect( component.seekerToggle.emit ).toHaveBeenCalled();
        } );
    } );
    describe( 'When multiCityBack', () => {
        it( 'it should emit backToMulti', () => {
            spyOn( component.backToMulti, 'emit' );
            component.multiCityBack( {} );
            fixture.detectChanges();
            expect( component.backToMulti.emit ).toHaveBeenCalled();
        } );
    } );
    describe( 'When returnToMain', () => {
        it( 'it should emit mainReturn', () => {
            spyOn( component.mainReturn, 'emit' );
            component.returnToMain( {} );
            fixture.detectChanges();
            expect( component.mainReturn.emit ).toHaveBeenCalled();
        } );
    } );
    
    describe( 'When editable', () => {
        it( 'it should show change-search button', () => {
            component.model.hideFlightSearch = true;
            component.model.currentStep = 'availability';
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect( compiled.querySelector( '.change-search' ) ).toBeDefined();
        } );
          it( 'it shouldnt show change-search button', () => {
            component.model.hideFlightSearch = false;
            component.model.currentStep = 'availability';
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect( compiled.querySelector( '.change-search' ) ).toBeNull();
        } );
    } );
});
