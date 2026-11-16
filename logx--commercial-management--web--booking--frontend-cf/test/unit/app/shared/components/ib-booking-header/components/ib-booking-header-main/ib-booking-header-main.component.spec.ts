import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbBookingHeaderMainComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-main/ib-booking-header-main.component';
@Component( {
    selector: 'ib-booking-header-simple',
    template: '<h2></h2>'
})

@Component( {
    selector: 'ib-booking-header-complete',
    template: '<h2></h2>'
})
export class IbBookingHeaderCompleteComponentMock {
    @Input() public model;
    @Input() public showPassengersInfo;
    @Input() public numberTrips;
    @Input() public login;
};
describe('IbBookingHeaderMainComponent', () => {
    let component: IbBookingHeaderMainComponent;
    let fixture: ComponentFixture<IbBookingHeaderMainComponent>;
    const { headerModel, greyBarModel, stepsModel } = require( '../../mocks/HeaderModelRT.json' );

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                IbBookingHeaderMainComponent,
                IbBookingHeaderCompleteComponentMock
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingHeaderMainComponent);
        component = fixture.componentInstance;
        component.model = headerModel;
        component.login = greyBarModel.login;
        component.advancedSearch = false;
        component.numberTrips = 3;

        fixture.detectChanges();
    });

    it( 'should create', () => {
        expect(component).toBeTruthy();
    } );
    describe( 'When toggleSeeker is called', () => {
        it( 'it should emit seekerToggle output', () => {
            spyOn( component.seekerToggle, 'emit' );
            component.toggleSeeker();
            fixture.detectChanges();
            expect( component.seekerToggle.emit ).toHaveBeenCalled();
        });
    });
    describe( 'When multiCityBack is called', () => {
        it( 'it should emit backToMulti output', () => {
            spyOn( component.backToMulti, 'emit' );
            const event = new Event('');
            component.multiCityBack( event );
            fixture.detectChanges();
            expect( component.backToMulti.emit ).toHaveBeenCalled();
        });
    });
    describe( 'When returnToMain is called', () => {
        it( 'it should emit mainReturn output', () => {
            spyOn( component.mainReturn, 'emit' );
            const event = new Event('');
            component.returnToMain( event );
            fixture.detectChanges();
            expect( component.mainReturn.emit ).toHaveBeenCalled();
        });
    });
});
