import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flushMicrotasks, resetFakeAsyncZone, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingHeaderBasketSectionComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-section/ib-booking-header-basket-section.component';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { BasketFunctionsMock } from '../../../mocks/BasketFunctions-mock';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { WindowMock } from 'test/mocks/class/WindowMock';
import { DatalayerBasketServiceMock } from 'test/mocks/class/DatalayerBasketServiceMock';
import { DatalayerBasketService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-datalayer.service';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { DatalayerUtilsServiceMock } from 'test/mocks/class/DatalayerUtilsServiceMock';
import { NewMainHeaderFacadeTokenMock } from 'test/mocks/class/NewMainHeaderFacadeMock';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import StorageHeader from '../../../../../mocks/HeaderModelRT.json';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
let fakeCommonsSessionStorageService: StorageServiceMock;
let fakeRootScope: RootScopeMock;
let fakeWindow: WindowMock;
let fakeDatalayerBasketService: DatalayerBasketServiceMock;
let fakeBasketFunctionsMock: BasketFunctionsMock;
let fakeAJSDatalayerUtilsService: DatalayerUtilsServiceMock;
let fakeNewMainHeaderFacade: NewMainHeaderFacadeTokenMock;
describe('IbBookingHeaderBasketSectionComponent', () => {
    let component: IbBookingHeaderBasketSectionComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketSectionComponent>;

    fakeCommonsSessionStorageService = new StorageServiceMock();
    fakeRootScope = new RootScopeMock();
    fakeBasketFunctionsMock = new BasketFunctionsMock();
    fakeWindow = new WindowMock(); 
    fakeDatalayerBasketService = new DatalayerBasketServiceMock();
    fakeAJSDatalayerUtilsService = new DatalayerUtilsServiceMock();
    fakeNewMainHeaderFacade = new NewMainHeaderFacadeTokenMock();
    beforeEach( () => {
        TestBed.configureTestingModule({
            declarations: [ IbBookingHeaderBasketSectionComponent ],
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
                { provide: WINDOW_TOKEN, useValue: fakeWindow},
                { provide: DatalayerBasketService, useValue: fakeDatalayerBasketService},
                { provide: AJSDatalayerUtilsService, useValue: fakeAJSDatalayerUtilsService },
                { provide: IbBookingHeaderFacadeService, useValue: fakeNewMainHeaderFacade }
            ]
        }).compileComponents();
        const sectionModel = {
            info: {
                category: 'icon-seguros'
            },
            hasFlexibilization: false
        };
        fixture = TestBed.createComponent(IbBookingHeaderBasketSectionComponent);
        component = fixture.componentInstance;
        component.model = sectionModel;
        component.basketFunctions = fakeBasketFunctionsMock;
        component.deleteFlag = true;
        component.loadingVoucher = false;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect( component ).toBeTruthy();
    } );
    describe( 'When deleteAncillarie is called on not availability and not ibairp step', () => {
        beforeEach( () => {
            fakeCommonsSessionStorageService.set( BkiStorageConstants.ACTUAL_STEP_FLOW, 'ibpurc' );
            fakeCommonsSessionStorageService.set( 'selectedFlex', true );
        } );
        it( 'it should delete ancillarie item', fakeAsync( () => {
            component.deleteAncillarie( {} );
            flushMicrotasks();
            tick( 100 );
            expect( fakeBasketFunctionsMock.deleteAncillariesService.deleteAncillarie ).toHaveBeenCalled();
            
        } ) );
        it( 'it should call provider and go through reject', fakeAsync( () => {
            fakeBasketFunctionsMock.deleteAncillariesService.deleteAncillarie = jasmine.createSpy().and.callFake( () => Promise.reject() );
            component.deleteAncillarie( {} );
            flushMicrotasks();
            tick( 100 );
            expect( fakeBasketFunctionsMock.modalService.showGenericError ).toHaveBeenCalled();
        } ) );
    } );
    describe( 'When deleteAncillaries is called on availability', () => {
        it( 'it should call several providers', fakeAsync( () => {
            var divElement = document.createElement('div');
            divElement.className = 'ib-radio-boxed--simple';
            var inputElement = document.createElement('input');
            inputElement.type = 'radio';
            inputElement.name = 'example';
            divElement.appendChild( inputElement );
            document.body.appendChild( divElement );
            
            fakeCommonsSessionStorageService.set( BkiStorageConstants.ACTUAL_STEP_FLOW, 'availability' );
            fakeCommonsSessionStorageService.set( BkiStorageConstants.HEADER_MODEL, StorageHeader );
            fakeCommonsSessionStorageService.set( 'availabilityRelatedContent', [{value:0}] );
            component.deleteAncillarie( {} );
            flushMicrotasks();
            tick( 1500 );
            expect( fakeRootScope.$broadcast ).toHaveBeenCalledWith( 'emptyFlex' );
            expect( fakeNewMainHeaderFacade.updateBasketFlexibilization ).toHaveBeenCalled();
            divElement.remove();
        } ) );
    } );
    afterEach( () => {
        fakeCommonsSessionStorageService.clear();
        resetFakeAsyncZone();
        TestBed.resetTestingModule();
    } );
});
