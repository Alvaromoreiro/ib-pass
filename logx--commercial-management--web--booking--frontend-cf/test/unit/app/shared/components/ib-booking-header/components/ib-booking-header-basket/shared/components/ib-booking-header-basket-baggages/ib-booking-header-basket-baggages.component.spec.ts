import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingHeaderBasketBaggagesComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-baggages/ib-booking-header-basket-baggages.component';
import { ShoppingBasketBaggages } from '@src/app/core/models/ib-booking-availability/header-model';
import { DatalayerBasketService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-datalayer.service';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { ShoppingBasketTripBaggagesSegment } from '../../../../../../../../../../../src/app/core/models/ib-booking-availability/header-model';
import { BasketFunctionsMock } from '../../../mocks/BasketFunctions-mock';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
import { DatalayerUtilsServiceMock } from 'test/mocks/class/DatalayerUtilsServiceMock';
import { DatalayerBasketServiceMock } from 'test/mocks/class/DatalayerBasketServiceMock';
let fakeRootScope;
let fakeAJSDatalayerUtilsService;
let fakeCommonsSessionStorageService;
let fakeDatalayerBasketService;
let fakeBasketFunctionsMock;

let segment: ShoppingBasketTripBaggagesSegment;
let model: ShoppingBasketBaggages;
let ancillariesInfo;
describe('IbBookingHeaderBasketBaggagesComponent', () => {
    let component: IbBookingHeaderBasketBaggagesComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketBaggagesComponent>;
    fakeCommonsSessionStorageService = new StorageServiceMock();
    fakeRootScope = new RootScopeMock();
    fakeAJSDatalayerUtilsService = new DatalayerUtilsServiceMock();
    fakeDatalayerBasketService = new DatalayerBasketServiceMock();
    fakeBasketFunctionsMock = new BasketFunctionsMock();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ IbBookingHeaderBasketBaggagesComponent ],
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

        fixture = TestBed.createComponent(IbBookingHeaderBasketBaggagesComponent);
        component = fixture.componentInstance;
        segment = {
            segmentId: '0',
            total: 14,
            baggages: [{
                type: '',
                description: '',
                passengers: [''],
                quanty: 1,
                total: 14,
                totalFormatted: '14€'
            }],
            destination: {
                code: '',
                country: {
                    code: '',
                    description: ''
                },
                countryCode: '',
                description: ''
            },
            origin: {
                code: '',
                country: {
                    code: '',
                    description: ''
                },
                countryCode: '',
                description: ''
            }
        };
        model = {
            hasBaggage: false,
            segments: [],
            total: {
                total: 14,
                totalFormatted: '14€'
            }
        };
        ancillariesInfo = {
            ancillaries: [ {
                type: 'BAGGAGE',
                slices: [ {
                    passengers: [ {
                        maxAdditionalPieces: 2
                    } ]
                } ]
            } ],
            bundles: true
        };
        component.model = model;
        component.basketFunctions = fakeBasketFunctionsMock;
        fakeCommonsSessionStorageService.set( 'ancillariesInfo', ancillariesInfo );
        fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibcmtv' );
        fixture.detectChanges();
    });

    it('should create', () => {
        expect( component ).toBeTruthy();
    } );
    describe( 'When deleteBaggage is called', () => {
        it( 'should do the magic when segment length === 0', () => {
            component.deleteBaggage( segment, '' );
            expect( component.model.segments.length ).toBe( 0 );
        } );
        it( 'should do the magic when segment length > 0', () => {
            component.model.segments.push( segment );
            fixture.detectChanges();
            component.deleteBaggage( segment, '' );
            expect( component.model.segments.length ).toBe( 0 );
        } );
        it( 'should do the magic when segment length > 0 and not in ibcmtv step and delete resolves', () => {
            let segment2 = { ...segment };
            segment2.segmentId = '1';
            segment2.baggages[ 0 ].quanty = 2;
            fakeBasketFunctionsMock.deleteAncillariesService.deleteAncillarie = jasmine.createSpy( 'deleteAncillarie' ).and.callFake( () => Promise.resolve() );
            component.model.segments.push( segment );
            component.model.segments.push( segment2 );
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibpurc' );
            fixture.detectChanges();
            component.deleteBaggage( segment, '' );
            expect( component.model.segments.length ).toBe( 2 );
        } );
        it( 'should do the magic when segment length > 0 and not in ibcmtv step and delete rejects', () => {
            fakeBasketFunctionsMock.deleteAncillariesService.deleteAncillarie = jasmine.createSpy( 'deleteAncillarie' ).and.callFake( () => Promise.reject( { message: '' } ) );
            component.model.segments.push( segment );
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibpurc' );
            fixture.detectChanges();
            component.deleteBaggage( segment, '' );
            expect( component.model.segments.length ).toBe( 1 );
        } );
    });
    afterEach( () => {
        localStorage.clear();
        sessionStorage.clear();
        TestBed.resetTestingModule();
    } );
});
