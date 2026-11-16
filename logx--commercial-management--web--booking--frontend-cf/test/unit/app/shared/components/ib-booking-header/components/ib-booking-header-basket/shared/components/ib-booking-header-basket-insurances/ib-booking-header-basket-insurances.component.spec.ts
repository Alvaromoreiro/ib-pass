import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingHeaderBasketInsurancesComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-insurances/ib-booking-header-basket-insurances.component';
import { ShoppingBasketInsurances } from '@src/app/core/models/ib-booking-availability/header-model';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
import { BasketFunctionsMock } from '../../../mocks/BasketFunctions-mock';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { DatalayerBasketService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-datalayer.service';
import { DatalayerUtilsServiceMock } from 'test/mocks/class/DatalayerUtilsServiceMock';
import { DatalayerBasketServiceMock } from 'test/mocks/class/DatalayerBasketServiceMock';

let fakeCommonsSessionStorageService;
let fakeRootScope;
let fakeBasketFunctionsMock;
let fakeAJSDatalayerUtilsService;
let fakeDatalayerBasketService;
let insurancesModel: ShoppingBasketInsurances;
describe('IbBookingHeaderBasketInsurancesComponent', () => {
    let component: IbBookingHeaderBasketInsurancesComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketInsurancesComponent>;
    fakeCommonsSessionStorageService = new StorageServiceMock();
    fakeRootScope = new RootScopeMock();
    fakeBasketFunctionsMock = new BasketFunctionsMock();
    fakeAJSDatalayerUtilsService = new DatalayerUtilsServiceMock();
    fakeDatalayerBasketService = new DatalayerBasketServiceMock();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingHeaderBasketInsurancesComponent],
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
                { provide: AJSDatalayerUtilsService, useValue: fakeAJSDatalayerUtilsService},
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService},
                { provide: DatalayerBasketService, useValue: fakeDatalayerBasketService}
            ]
        }).compileComponents();
        insurancesModel = {
            hasInsurance: true,
            info: [],
            total: {
                total: 14,
                totalFormatted: '14€'
            }
        };
        fixture = TestBed.createComponent(
            IbBookingHeaderBasketInsurancesComponent
        );
        component = fixture.componentInstance;
        component.model = insurancesModel;
        component.basketFunctions = fakeBasketFunctionsMock;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe( 'When deleteInsurance is called', () => {
        it( 'should delete ancillarie from actual ancillaries page', fakeAsync( () => {
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibcmtv' );
            component.deleteInsurance();
            fixture.detectChanges();
            flushMicrotasks();
            tick(1000);
            expect( component.model.hasInsurance ).toBe( false );
            expect( component.model.info ).toEqual( null );
        } ) );
        it( 'should delete ancillarie throw resolve', fakeAsync( () => {
            fakeBasketFunctionsMock.deleteAncillariesService.deleteAncillarie = jasmine.createSpy( 'deleteAncillarie' ).and.callFake( () => Promise.resolve( {} ) );
            component.deleteInsurance();
            fixture.detectChanges();
            flushMicrotasks();
            tick(1000);
            expect( component.model.hasInsurance ).toBe( false );
            expect( component.model.info ).toEqual( null );
        } ) );
        it( 'should delete ancillarie throw reject', fakeAsync( () => {
            fakeBasketFunctionsMock.deleteAncillariesService.deleteAncillarie = jasmine.createSpy( 'deleteAncillarie' ).and.callFake( () => Promise.reject( { message: '' } ) );
            component.deleteInsurance();
            fixture.detectChanges();
            flushMicrotasks();
            tick(1000);
            expect( component.model.hasInsurance ).toBe( true );
            expect( component.model.info ).toEqual( [] );
        } ) );
    } );
    afterEach( () => {
        fakeCommonsSessionStorageService.clear();
        TestBed.resetTestingModule();
    } );
});
