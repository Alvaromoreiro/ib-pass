import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbBookingHeaderCompleteComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-complete/ib-booking-header-complete.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AJSRootScope } from 'ib-web-commons/utils';
import { TranslateModule } from '@ngx-translate/core';

class FakeRootScopeMock {
    public isMobile = {
        general: false,
        header: false
    };
}

let fakeRootScope;

describe( 'IbBookingHeaderCompleteComponent', () => {
    let component: IbBookingHeaderCompleteComponent;
    let fixture: ComponentFixture<IbBookingHeaderCompleteComponent>;

    fakeRootScope = new FakeRootScopeMock();
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ IbBookingHeaderCompleteComponent ],
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

        fixture = TestBed.createComponent(IbBookingHeaderCompleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe( 'When ngOnChanges', () => {
        it( 'it should set isShuttleFlow and call onResize', () => {
            fakeRootScope.isMobile.general = false;
            spyOn( component, 'onResize' );
            component.ngOnChanges();
            fixture.detectChanges();
            expect(component.isShuttleFlow).toBe( false );
            expect(component.onResize).toHaveBeenCalled();
        } );
    } );
    describe( 'When backToMain', () => {
        it( 'it should emit mainReturn', () => {
            spyOn( component.mainReturn, 'emit' );
            component.backToMain( true );
            fixture.detectChanges();
            expect(component.mainReturn.emit).toHaveBeenCalled();
        } );
    } );
    describe( 'When backToMultiFlight', () => {
        it( 'it should emit multicityReturn', () => {
            spyOn( component.multicityReturn, 'emit' );
            component.backToMultiFlight( true );
            fixture.detectChanges();
            expect(component.multicityReturn.emit).toHaveBeenCalled();
        } );
    } );
    describe( 'When activeAdvancedSearch', () => {
        it( 'it should emit activeSeeker', () => {
            spyOn( component.activeSeeker, 'emit' );
            component.activeAdvancedSearch();
            fixture.detectChanges();
            expect(component.activeSeeker.emit).toHaveBeenCalled();
        } );
    } );
    describe( 'When onResize', () => {
        it( 'it should set isMobile to false', () => {
            fakeRootScope.isMobile.general = false;
            component.onResize( );
            fixture.detectChanges();
            expect( component.isMobile ).toBe( false );
        } );
        it( 'it should set isMobile to true', () => {
            fakeRootScope.isMobile.general = true;
            component.onResize( );
            fixture.detectChanges();
            expect(component.isMobile).toBe( true );
        } );
    } );
});
