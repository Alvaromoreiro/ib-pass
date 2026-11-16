import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbBookingMobileTotalPriceComponent } from './ib-booking-mobile-total-price.component';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { AJSBookingModalService } from '@shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IbBookingPriceDetailModalService } from '@src/app/shared/services/ib-booking-price-detail-modal/ib-booking-price-detail-modal.service';

export class FakeWindowMock {
    dispatchEvent = jasmine.createSpy( 'dispatchEvent' )
}
export class FakeBookingModalServiceMock {
    showGenericModal = jasmine.createSpy( 'showGenericModal' );
}

class FakeIbBookingPriceDetailModalServiceMock {
    checkShouldShowCTA = jasmine.createSpy('checkShouldShowCTA').and.returnValue(true);
};


let fakeBookingModalService;
let fakeWindow;
let fakeCommonsSessionStorageService;
let fakeIbBookingPriceDetailModalService;
describe('IbBookingMobileTotalPriceComponent', () => {
    let component: IbBookingMobileTotalPriceComponent;
    let fixture: ComponentFixture<IbBookingMobileTotalPriceComponent>;
    fakeBookingModalService = new FakeBookingModalServiceMock();
    fakeWindow = new FakeWindowMock();
    fakeCommonsSessionStorageService = new StorageServiceMock();
    fakeIbBookingPriceDetailModalService = new FakeIbBookingPriceDetailModalServiceMock();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ IbBookingMobileTotalPriceComponent ],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule
            ],
            providers: [
                { provide: AJSBookingModalService, useValue: fakeBookingModalService},
                { provide: WINDOW_TOKEN, useValue: fakeWindow},
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService},
                { provide: IbBookingPriceDetailModalService, useValue: fakeIbBookingPriceDetailModalService }

]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingMobileTotalPriceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect( component ).toBeTruthy();
    });
    describe( 'When onContinueEvent', () => {
        it( 'it should emit continueEvent', () => {
            spyOn( component.continueEvent, 'emit' );
            component.onContinueEvent();
            fixture.detectChanges();
            expect( component.continueEvent.emit ).toHaveBeenCalled();
        } );
    } );
    describe( 'When ngOnChanges is called', () => {
        it( 'it should set continueText', () => {
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'availability' );
            component.customContinueText = undefined;
            component.ngOnChanges();
            fixture.detectChanges();
            expect( component.continueText ).toBe( 'TOTAL_PRICE_CONTINUE_FLOW_AVAILABILITY' );
        } );
    } );
    describe( 'When openModalLinks', () => {
        it( 'it should call showGenericModal and return ok', () => {
            fakeBookingModalService.showGenericModal = jasmine.createSpy( 'showGenericModal' ).and.callFake( () => {
                return { result: Promise.resolve( 'ok' ) };
            } );
            component.openModalLinks();
            fixture.detectChanges();
            expect( fakeBookingModalService.showGenericModal ).toHaveBeenCalled();
        } );
        it( 'it should call showGenericModal and return ko', () => {
            fakeBookingModalService.showGenericModal = jasmine.createSpy( 'showGenericModal' ).and.callFake( () => {
                return { result: Promise.reject( 'ko' ) };
            } );
            component.openModalLinks();
            fixture.detectChanges();
            expect( fakeBookingModalService.showGenericModal ).toHaveBeenCalled();
        } );
    } );
    describe( 'When checkStepMap', () => {
        it( 'it should return continueText for availability', () => {
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'availability' );
            const continueText = component.checkStepMap();
            fixture.detectChanges();
            expect( continueText ).toBe( 'TOTAL_PRICE_CONTINUE_FLOW_AVAILABILITY' );
        } );
        it( 'it should return continueText for default', () => {
            fakeCommonsSessionStorageService.set( 'actualStepFlow', '' );
            const continueText = component.checkStepMap();
            fixture.detectChanges();
            expect( continueText ).toBe( 'AVAILABILITY_BUTTON' );
        } );
    } );
});
