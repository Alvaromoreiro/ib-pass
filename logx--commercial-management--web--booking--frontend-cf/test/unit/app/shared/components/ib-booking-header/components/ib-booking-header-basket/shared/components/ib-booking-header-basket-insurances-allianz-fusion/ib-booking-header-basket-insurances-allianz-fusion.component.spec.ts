import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flushMicrotasks, resetFakeAsyncZone, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IbBookingHeaderBasketInsurancesAllianzFusionComponent } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-insurances-allianz-fusion/ib-booking-header-basket-insurances-allianz-fusion.component';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { BasketFunctionsMock } from '../../../mocks/BasketFunctions-mock';
import AllianzModel from './mocks/AllianzModel.json';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
let fakeCommonsSessionStorageService: StorageServiceMock;
let fakeRootScope: RootScopeMock;
let fakeBasketFunctionsMock: BasketFunctionsMock;
let fakeDatalayerUtilsService: jasmine.SpyObj<any>;
describe('IbBookingHeaderBasketInsurancesAllianzFusionComponent', () => {
    let component: IbBookingHeaderBasketInsurancesAllianzFusionComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketInsurancesAllianzFusionComponent>;
    beforeEach( () => {
        fakeCommonsSessionStorageService = new StorageServiceMock();
        fakeRootScope = new RootScopeMock();
        fakeBasketFunctionsMock = new BasketFunctionsMock();
        fakeDatalayerUtilsService = jasmine.createSpyObj('DatalayerUtilsService', ['setAncillariesDatalayer']);
        TestBed.configureTestingModule({
            declarations: [IbBookingHeaderBasketInsurancesAllianzFusionComponent],
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
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService},
                { provide: AJSDatalayerUtilsService, useValue: fakeDatalayerUtilsService }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(IbBookingHeaderBasketInsurancesAllianzFusionComponent);
        component = fixture.componentInstance;
        component.model = AllianzModel;
        component.basketFunctions = fakeBasketFunctionsMock;
        component.deleteFlag = true;
        component.loadingVoucher = false;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    } );
    describe( 'When removeAllianzFusion is called', () => {
        it( 'It should remove the insurance allianz item', fakeAsync( () => {
            spyOn( component, 'deleteAllianzFusionSucess' ).and.callThrough();
            component.removeAllianzFusion ();
            flushMicrotasks();
            tick();
            expect( component.deleteAllianzFusionSucess ).toHaveBeenCalled();
        } ) );
        it( 'It should call provider and go reject', fakeAsync( () => {
            fakeBasketFunctionsMock.deleteAncillariesService.deleteAncillarie = jasmine.createSpy( 'deleteAncillariesService.deleteAncillarie' ).and.callFake( () => Promise.reject( { internalErrorCode: '', message: '' } ) );
            component.removeAllianzFusion();
            flushMicrotasks();
            tick();
            expect(component.basketFunctions.modalService.setErrorCode).toHaveBeenCalled();
        } ) );
    } );
    it('It should call setAncillariesDatalayer', () => {
    const actualPage = 'testPage';
    component.deleteAllianzFusionSucess(actualPage);
    expect(fakeDatalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalled();
});
    afterEach( () => {
        fakeCommonsSessionStorageService.clear();
        resetFakeAsyncZone();
        TestBed.resetTestingModule();
    } );
});