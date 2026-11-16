import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingHeaderBasketUpgradingComponent } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-upgrading/ib-booking-header-basket-upgrading.component';

class basketFunctionsMock {
    isLoading = jasmine.createSpy( 'isLoading' );
    calculateAllBasket = jasmine.createSpy( 'calculateAllBasket' );
    saveHeaderModel = jasmine.createSpy( 'saveHeaderModel' );
    isNotLoading = jasmine.createSpy( 'isNotLoading' );
    deleteAncillariesService = {
        deleteAncillarie: jasmine.createSpy( 'deleteAncillarie' ).and.callFake( () => Promise.resolve() )
    };
}
let fakeBasketFunctionsMock;
describe('IbBookingHeaderBasketUpgradingComponent', () => {
    let component: IbBookingHeaderBasketUpgradingComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketUpgradingComponent>;
    fakeBasketFunctionsMock = new basketFunctionsMock();

    beforeEach(async () => {
        await TestBed.configureTestingModule( {
            declarations: [ IbBookingHeaderBasketUpgradingComponent ],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]

        } ).compileComponents();

        fixture = TestBed.createComponent(
            IbBookingHeaderBasketUpgradingComponent
        );
        component = fixture.componentInstance;
        component.model = {
            hasUpgrading: false
        };
        component.basketFunctions = fakeBasketFunctionsMock;
        fixture.detectChanges();
    });

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
});
