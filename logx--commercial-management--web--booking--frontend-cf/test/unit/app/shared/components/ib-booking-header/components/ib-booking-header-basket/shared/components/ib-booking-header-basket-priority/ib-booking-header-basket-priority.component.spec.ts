import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';

import { IbBookingHeaderBasketPriorityComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-priority/ib-booking-header-basket-priority.component';
import PriorityDelete from './mocks/PriorityDeleteInfo.json';
import HeaderModel from './mocks/HeaderModelPriorityBoarding.json';
import { BasketFunctionsMock } from '../../../mocks/BasketFunctions-mock';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { DatalayerBasketService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-datalayer.service';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
import { DatalayerBasketServiceMock } from 'test/mocks/class/DatalayerBasketServiceMock';
import StoredSelectedPriority from './mocks/StoredSelectedPriority.json';
import PiorityNoTrip from './mocks/PriorityNoTrips.json';

let fakeCommonsSessionStorageService: StorageServiceMock;
let fakeRootScope: RootScopeMock;
let fakeDatalayerBasketService: DatalayerBasketServiceMock;
let fakeBasketFunctionsMock: BasketFunctionsMock;
describe('IbBookingHeaderBasketPriorityComponent', () => {
    let component: IbBookingHeaderBasketPriorityComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketPriorityComponent>;
    
    beforeEach(() => {
        fakeCommonsSessionStorageService = new StorageServiceMock();
        fakeRootScope = new RootScopeMock();
        fakeBasketFunctionsMock = new BasketFunctionsMock();
        fakeDatalayerBasketService = new DatalayerBasketServiceMock();
        TestBed.configureTestingModule({
            declarations: [ IbBookingHeaderBasketPriorityComponent ],
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
                { provide: DatalayerBasketService, useValue: fakeDatalayerBasketService}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(
            IbBookingHeaderBasketPriorityComponent
        );
        component = fixture.componentInstance;
        component.model = HeaderModel.headerModel.shoppingBasket.priorityBoarding;
        component.basketFunctions = fakeBasketFunctionsMock;
        component.deleteFlag = true;
        component.loadingVoucher = false;
        fakeCommonsSessionStorageService.set( 'selectedPriorityBoarding', StoredSelectedPriority );
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    } );
    describe( 'When deletePriority is called', () => {
        it( 'should set sessionStorage and call deleteAncillarieService', fakeAsync(() => {
            spyOn( component, 'basketFunctions' ).and.callThrough();
            component.deletePriority( PriorityDelete );
            const deleteInfo = fakeCommonsSessionStorageService.get( 'deletePriority' );
            flushMicrotasks();
            tick(100);
            expect( component.basketFunctions.deleteAncillariesService.deleteAncillarie ).toHaveBeenCalled();
            expect( deleteInfo ).not.toEqual( undefined );
        } ) );
        it( 'it should go throw error on delete basket function', fakeAsync(() => {
            fakeBasketFunctionsMock.deleteAncillariesService.deleteAncillarie = jasmine.createSpy( 'deleteAncillariesService.deleteAncillarie' ).and.callFake( () => Promise.reject( { internalErrorCode: '', message: '' } ) );
            spyOn( component, 'basketFunctions' ).and.callThrough();
            component.deletePriority( PriorityDelete );
            flushMicrotasks();
            tick( 100 );
            expect( component.basketFunctions.modalService.setErrorMessage ).toHaveBeenCalled();
            expect( component.basketFunctions.deleteAncillarie ).toHaveBeenCalledWith( false );
        } ) );
    } );
    describe( 'When deletePriority is called with no stored selectedPriorityBoarding and no trips on model', () => {
        it( 'it should go success and sets hasPiorityBoarding model to false', fakeAsync(() => {
            fakeCommonsSessionStorageService.remove( 'selectedPriorityBoarding' );
            component.model = PiorityNoTrip;
            component.deletePriority( PriorityDelete );
            flushMicrotasks();
            tick( 100 );
            expect( component.model.hasPriorityBoarding ).toEqual( false );
        } ) );
    } );
});
