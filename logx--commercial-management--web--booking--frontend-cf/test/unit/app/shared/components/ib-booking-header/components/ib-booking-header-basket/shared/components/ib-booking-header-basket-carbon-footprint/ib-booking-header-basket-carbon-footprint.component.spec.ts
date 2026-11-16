import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ShoppingBasketCarbonFootprint } from '@src/app/core/models/ib-booking-availability/header-model';

import { IbBookingHeaderBasketCarbonFootprintComponent } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-carbon-footprint/ib-booking-header-basket-carbon-footprint.component';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { BasketFunctionsMock } from '../../../mocks/BasketFunctions-mock';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
let fakeCommonsSessionStorageService;
let fakeRootScope;
let fakeBasketFunctionsMock;
let carbonModel: ShoppingBasketCarbonFootprint;
describe('IbBookingHeaderBasketCarbonFootprintComponent', () => {
    let component: IbBookingHeaderBasketCarbonFootprintComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketCarbonFootprintComponent>;
    fakeCommonsSessionStorageService = new StorageServiceMock();
    fakeRootScope = new RootScopeMock();
    fakeBasketFunctionsMock = new BasketFunctionsMock();
    beforeEach(async () => {
        await TestBed.configureTestingModule( {
            declarations: [ IbBookingHeaderBasketCarbonFootprintComponent ],
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
                { provide: AJSRootScope, useValue: fakeRootScope}
            ]
        } ).compileComponents();

        carbonModel = {
            hasCarbonFootprint: true,
            info: [],
            total: {
                total: 14,
                totalFormatted: '14€'
            }
        };
        fixture = TestBed.createComponent(IbBookingHeaderBasketCarbonFootprintComponent);
        component = fixture.componentInstance;
        component.model = carbonModel;
        component.basketFunctions = fakeBasketFunctionsMock;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe( 'When removeCarbonFootprint is called', () => {
        it( 'should delete ancillarie from actual ancillaries page', fakeAsync( () => {
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibcmtv' );
            component.removeCarbonFootprint();
            fixture.detectChanges();
            flushMicrotasks();
            tick(1000);
            expect( component.model.hasCarbonFootprint ).toBe( false );
            expect( component.model.info ).toEqual( null );
        } ) );
        it( 'should delete ancillarie throw resolve', fakeAsync( () => {
            fakeBasketFunctionsMock.deleteAncillariesService.deleteAncillarie = jasmine.createSpy( 'deleteAncillarie' ).and.callFake( () => Promise.resolve( {} ) );
            component.removeCarbonFootprint();
            fixture.detectChanges();
            flushMicrotasks();
            tick(1000);
            expect( component.model.hasCarbonFootprint ).toBe( false );
            expect( component.model.info ).toEqual( null );
        } ) );
        it( 'should delete ancillarie throw reject', fakeAsync( () => {
            fakeBasketFunctionsMock.deleteAncillariesService.deleteAncillarie = jasmine.createSpy( 'deleteAncillarie' ).and.callFake( () => Promise.reject( { message: '' } ) );
            component.removeCarbonFootprint();
            fixture.detectChanges();
            flushMicrotasks();
            tick(1000);
            expect( component.model.hasCarbonFootprint ).toBe( true );
            expect( component.model.info ).toEqual( [] );
        } ) );
    } );
    afterEach( () => {
        fakeCommonsSessionStorageService.clear();
        TestBed.resetTestingModule();
    } );
});
