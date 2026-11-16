import { ComponentFixture, fakeAsync, flushMicrotasks, resetFakeAsyncZone, TestBed, tick } from '@angular/core/testing';

import { IbBookingHeaderBasketSpeqsComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-speqs/ib-booking-header-basket-speqs.component';
import { DatalayerBasketServiceMock } from 'test/mocks/class/DatalayerBasketServiceMock';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { BasketFunctionsMock } from '../../../mocks/BasketFunctions-mock';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DatalayerBasketService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-datalayer.service';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { DatalayerUtilsServiceMock } from 'test/mocks/class/DatalayerUtilsServiceMock';
import SpeqsModel from './mocks/SpeqsModel.json';
import DeleteSegment from './mocks/DeleteParams.json';
import AncillariesInfo from './mocks/AncillariesInfo.json';
import { DatalayerConstants } from '@src/app/shared/services/ib-datalayer/constants/ib-datalayer-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import OnlyOneSpeq from './mocks/OneSpeqInModel.json';
const golf = {
    'type': 'GOLF_EQUIPMENT',
    'quanty': 1,
    'description': 'Equipo de golf',
    'passengers': [
        'ADULT_01'
    ],
    'total': 40,
    'totalFormatted': '$40.00'
};
const SpeqType = 'BICYCLE';
let fakeCommonsSessionStorageService: StorageServiceMock;
let fakeRootScope: RootScopeMock;
let fakeDatalayerBasketService: DatalayerBasketServiceMock;
let fakeBasketFunctionsMock: BasketFunctionsMock;
let fakeAJSDatalayerUtilsService: DatalayerUtilsServiceMock;
describe('IbBookingHeaderBasketSpeqsComponent', () => {
    let component: IbBookingHeaderBasketSpeqsComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketSpeqsComponent>;

    beforeEach( () => {
        fakeCommonsSessionStorageService = new StorageServiceMock();
        fakeRootScope = new RootScopeMock();
        fakeBasketFunctionsMock = new BasketFunctionsMock();
        fakeDatalayerBasketService = new DatalayerBasketServiceMock();
        fakeAJSDatalayerUtilsService = new DatalayerUtilsServiceMock();
        fakeBasketFunctionsMock = new BasketFunctionsMock();
        TestBed.configureTestingModule({
            declarations: [IbBookingHeaderBasketSpeqsComponent],
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

        fixture = TestBed.createComponent(IbBookingHeaderBasketSpeqsComponent);
        component = fixture.componentInstance;
        component.model = SpeqsModel;
        component.basketFunctions = fakeBasketFunctionsMock;
        component.deleteFlag = true;
        component.loadingVoucher = false;
        fakeCommonsSessionStorageService.set( BkiStorageConstants.ACTUAL_STEP_FLOW, DatalayerConstants.FLOWS.ANCILLARIES );
        fakeCommonsSessionStorageService.set( 'ancillariesInfo', AncillariesInfo );
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    } );
    describe( 'When deleteSpeq is called', () => {
        it( 'it should delete the selected speq type', fakeAsync( () => {
            component.deleteSpeq( DeleteSegment, SpeqType );
            expect( component.model.segments[ 0 ].speqs.length ).toBe( 2 );
        } ) );
    } );
    xdescribe( 'When deleteSpeq is called and bundles have speqs', () => {
        it( 'it should set bundleHaveSpeqs on storage', fakeAsync( () => {
            component.model.segments[ 0 ].speqs.push( golf );
            component.deleteSpeq( DeleteSegment, SpeqType );
            flushMicrotasks();
            tick( 100 );
            const bundles = fakeCommonsSessionStorageService.get( 'bundleHaveSpeqs' );
            expect( component.model.segments[ 0 ].speqs.length ).toBe( 3 );
            expect( bundles ).toEqual( true );
        } ) );
    } );
    describe( 'When deleteSpeqs is called and only one speq seleceted', () => {
        it( 'it should set hasSpeqs to false', fakeAsync( () => {
            component.model = OnlyOneSpeq;
            component.model.segments = [];
            component.deleteSpeq( DeleteSegment, SpeqType );
            flushMicrotasks();
            tick( 100 );
            expect( component.model.hasSpeqs ).toBe( false );
        } ) );
    } );
    describe( 'When deleteSpeqs is called with actualPage !== BOOKING ', () => {
        beforeEach( () => {
            fakeCommonsSessionStorageService.set( BkiStorageConstants.ACTUAL_STEP_FLOW, DatalayerConstants.FLOWS.CONFIRMATION );
        } );
        it( 'it should call provider and go success', fakeAsync( () => {
            component.model = OnlyOneSpeq;
            component.deleteSpeq( DeleteSegment, SpeqType );
            expect(component.basketFunctions.deleteAncillariesService.deleteAncillarie).toHaveBeenCalled();
        } ) );
        it( 'it should call provider and go reject', fakeAsync( () => {
            fakeBasketFunctionsMock.deleteAncillariesService.deleteAncillarie = jasmine.createSpy( 'deleteAncillariesService.deleteAncillarie' ).and.callFake( () => Promise.reject( { internalErrorCode: '', message: '' } ) );
            component.model = OnlyOneSpeq;
            component.deleteSpeq( DeleteSegment, SpeqType );
            expect(component.basketFunctions.deleteAncillariesService.deleteAncillarie).toHaveBeenCalled();
        } ) );
    } );
    afterEach( () => {
        fakeCommonsSessionStorageService.clear();
        resetFakeAsyncZone();
        TestBed.resetTestingModule();
    } );
});
