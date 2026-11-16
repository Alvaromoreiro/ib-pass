import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ShoppingBasketOthers } from '@src/app/core/models/ib-booking-availability/header-model';

import { IbBookingHeaderBasketOtherFeesComponent } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-other-fees/ib-booking-header-basket-other-fees.component';
import { OthersFeesViewModelService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-other-fees-view-model.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';

let fakeCommonsSessionStorageService;
let fakeOthersFeesViewModelService;
let othersModel: ShoppingBasketOthers = {
    hasElements: true,
    others: [],
    total: {
        total: 14,
        totalFormatted: '14€'
    }
};
class OthersFeesViewModelServiceMock {
    getOthersViewModel = jasmine.createSpy( 'getOthersViewModel' ).and.callFake( () => othersModel );
}
describe('IbBookingHeaderBasketOtherFeesComponent', () => {
    let component: IbBookingHeaderBasketOtherFeesComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketOtherFeesComponent>;

    fakeCommonsSessionStorageService = new StorageServiceMock();
    fakeOthersFeesViewModelService = new OthersFeesViewModelServiceMock();
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingHeaderBasketOtherFeesComponent],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            providers: [
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService},
                { provide: OthersFeesViewModelService, useValue: fakeOthersFeesViewModelService}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(
            IbBookingHeaderBasketOtherFeesComponent
        );
        component = fixture.componentInstance;
        component.model = othersModel;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    } );
    describe( 'When ngOnChanges is called', () => {
        it( 'should call activate', () => {
            spyOn( component, 'activate' );
            const changes = { model: othersModel };
            component.ngOnChanges( changes );
            expect( component[ 'activate' ] ).toHaveBeenCalled();
        });
    });
    describe( 'When activate is called', () => {
        it( 'should set the model with commercialData undefined', () => {
            component.activate();
            expect( component.model ).toEqual( othersModel );
        });
        it( 'should set the model with commercialData defined', () => {
            fakeCommonsSessionStorageService.set( 'commercialData', { currency: {} } );
            component.activate();
            expect( component.model ).toEqual( othersModel );
        });
    });
});
