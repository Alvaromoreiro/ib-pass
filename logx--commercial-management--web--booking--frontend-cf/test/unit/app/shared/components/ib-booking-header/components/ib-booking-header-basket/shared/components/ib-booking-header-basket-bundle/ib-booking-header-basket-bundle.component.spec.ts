import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingHeaderBasketBundleComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-bundle/ib-booking-header-basket-bundle.component';
import { ShoppingBasketBundle } from '@src/app/core/models/ib-booking-availability/header-model';
import { DatalayerBasketService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-datalayer.service';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { DatalayerBasketServiceMock } from 'test/mocks/class/DatalayerBasketServiceMock';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
import { BasketFunctionsMock } from '../../../mocks/BasketFunctions-mock';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';

let fakeCommonsSessionStorageService;
let fakeRootScope;
let fakeDatalayerBasketService;
let fakeBasketFunctionsMock;
let bundleModel: ShoppingBasketBundle;
describe('IbBookingHeaderBasketBundleComponent', () => {
    let component: IbBookingHeaderBasketBundleComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketBundleComponent>;
    fakeCommonsSessionStorageService = new StorageServiceMock();
    fakeRootScope = new RootScopeMock();
    fakeBasketFunctionsMock = new BasketFunctionsMock();
    fakeDatalayerBasketService = new DatalayerBasketServiceMock();
    beforeEach(async () => {
        await TestBed.configureTestingModule( {
            declarations: [ IbBookingHeaderBasketBundleComponent ],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule,
                IbBookingSharedModule
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: DatalayerBasketService, useValue: fakeDatalayerBasketService }
            ]
        } ).compileComponents();

        fixture = TestBed.createComponent(IbBookingHeaderBasketBundleComponent);
        bundleModel = {
            hasBundle: true,
            info: {
                items: [{
                    type: 'FLEXIBILITY_ON_DEMAND',
                    text: ''
                },{
                    type: 'PRIORITY_BOARDING',
                    text: ''
                },{
                    type: '',
                    text: ''
                }],
                totalPassengers: 1
            },
            total: {
                total: 14,
                totalFormatted: '14€'
            }
        };
        component = fixture.componentInstance;
        component.basketFunctions = fakeBasketFunctionsMock;
        component.model = bundleModel;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe( 'When deleteBundle is called', () => {
        it( 'should delete ancillarie from actual ancillaries page', fakeAsync( () => {
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibcmtv' );
            component.deleteBundle( bundleModel );
            fixture.detectChanges();
            flushMicrotasks();
            tick(1000);
            expect( component.model.hasBundle ).toBe( false );
            expect( component.model.info ).toEqual( null );
        } ) );
        it( 'should delete ancillarie throw resolve', fakeAsync( () => {
            fakeBasketFunctionsMock.deleteAncillariesService.deleteBundleService = jasmine.createSpy( 'deleteBundleService' ).and.callFake( () => Promise.resolve( {} ) );
            component.deleteBundle( bundleModel );
            fixture.detectChanges();
            flushMicrotasks();
            tick(1000);
            expect( component.model.hasBundle ).toBe( false );
            expect( component.model.info ).toEqual( null );
        } ) );
        it( 'should delete ancillarie throw reject', fakeAsync( () => {
            fakeBasketFunctionsMock.deleteAncillariesService.deleteBundleService = jasmine.createSpy( 'deleteBundleService' ).and.callFake( () => Promise.reject( { message: '' } ) );
            component.deleteBundle( bundleModel );
            fixture.detectChanges();
            flushMicrotasks();
            tick(1000);
            expect( component.model.hasBundle ).toBe( true );
            expect( component.model.info ).toEqual( bundleModel.info );
        } ) );
    } );
    afterEach( () => {
        fakeCommonsSessionStorageService.clear();
        TestBed.resetTestingModule();
    } );
});
