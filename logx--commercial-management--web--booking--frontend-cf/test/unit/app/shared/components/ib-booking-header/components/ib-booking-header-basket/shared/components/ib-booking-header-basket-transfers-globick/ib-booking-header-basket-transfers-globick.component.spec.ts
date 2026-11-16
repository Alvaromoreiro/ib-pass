import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingHeaderBasketTransfersGlobickComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-transfers-globick/ib-booking-header-basket-transfers-globick.component';
import { ShoppingBasketGlobickTransfers } from '@src/app/core/models/ib-booking-availability/header-model';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
import { BasketFunctionsMock } from '../../../mocks/BasketFunctions-mock';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';

let fakeCommonsSessionStorageService;
let fakeRootScope;
let fakeBasketFunctionsMock;
let globickModel: ShoppingBasketGlobickTransfers;
let fakeDatalayerUtilsService: jasmine.SpyObj<any>;
describe('IbBookingHeaderBasketTransfersGlobickComponent', () => {
    let component: IbBookingHeaderBasketTransfersGlobickComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketTransfersGlobickComponent>;
    fakeCommonsSessionStorageService = new StorageServiceMock();
    fakeRootScope = new RootScopeMock();
    fakeBasketFunctionsMock = new BasketFunctionsMock();
    fakeDatalayerUtilsService = jasmine.createSpyObj('DatalayerUtilsService', ['setAncillariesDatalayer']);
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingHeaderBasketTransfersGlobickComponent],
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
                { provide: AJSRootScope, useValue: fakeRootScope},
                { provide: AJSDatalayerUtilsService, useValue: fakeDatalayerUtilsService }

            ]
        }).compileComponents();

        fixture = TestBed.createComponent(
            IbBookingHeaderBasketTransfersGlobickComponent
        );
        globickModel = {
            hasTransfersGlobick: true,
            info: null,
            total: {
                total: 14,
                totalFormatted: '14€'
            }
        };
        component = fixture.componentInstance;
        component.basketFunctions = fakeBasketFunctionsMock;
        component.model = globickModel;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe( 'When removeTransfersGlobick is called', () => {
        it( 'should delete ancillarie throw resolve', fakeAsync( () => {
            fakeBasketFunctionsMock.deleteAncillariesService.deleteAncillarie = jasmine.createSpy( 'deleteAncillarie' ).and.callFake( () => Promise.resolve( {} ) );
            component.removeTransfersGlobick();
            fixture.detectChanges();
            flushMicrotasks();
            tick(1000);
            expect( component.model.hasTransfersGlobick ).toBe( false );
            expect( component.model.info ).toEqual( null );
        } ) );
        it( 'should delete ancillarie throw reject', fakeAsync( () => {
            fakeBasketFunctionsMock.deleteAncillariesService.deleteAncillarie = jasmine.createSpy( 'deleteAncillarie' ).and.callFake( () => Promise.reject( { message: '' } ) );
            component.removeTransfersGlobick();
            fixture.detectChanges();
            flushMicrotasks();
            tick(1000);
            expect( component.model.hasTransfersGlobick ).toBe( true );
            expect( component.model.info ).toEqual( null );
        } ) );

        it('It should call setAncillariesDatalayer', () => {
            const actualPage = 'testPage';
            component.deleteTransfersGlobickSucess(actualPage);
            expect(fakeDatalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalled();
        });
    } );
    afterEach( () => {
        fakeCommonsSessionStorageService.clear();
        TestBed.resetTestingModule();
    } );
});
