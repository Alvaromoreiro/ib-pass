import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { IbBookingSlicedUpsellingComponent } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/components/ib-booking-sliced-upselling/ib-booking-sliced-upselling-fare.component';
import { IbBookingUpsellingUtilsService } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/components/ib-booking-sliced-upselling/services/ib-booking-upselling-utils.service';
import { AJSCurrencyService } from 'ib-web-commons/utils';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IbBookingUpsellingUtilsServiceMock } from './mocks/ib-booking-sliced-upselling-fare-class.mocks';
import { IbCPipeModule } from 'ib-web-commons/pipes';
const fakeChanges = require( './mocks/ib-booking-sliced-upselling-fare-changes.mocks.json' );
const selectedSliceMock = require( './mocks/ib-booking-sliced-upselling-fare-selectedSlice.mock.json' );
const { currencies, selectedFareFamily, model } = require( './mocks/ib-booking-sliced-upselling-fare.mocks.json' );
class CurrencyServiceMock {
    getCurrencyObject = jasmine.createSpy('getCurrencyObject')
    formatPrice = jasmine.createSpy( 'formatPrice' ).and.callFake( () => '' );
};
let fakeAJSCurrencyService: CurrencyServiceMock;
let fakeIbBookingUpsellingUtilsService: IbBookingUpsellingUtilsServiceMock;
describe('IbBookingSlicedUpsellingComponent', () => {
    let component: IbBookingSlicedUpsellingComponent;
    let fixture: ComponentFixture<IbBookingSlicedUpsellingComponent>;
    beforeEach(async () => {
        fakeAJSCurrencyService = new CurrencyServiceMock();
        fakeIbBookingUpsellingUtilsService = new IbBookingUpsellingUtilsServiceMock();
        await TestBed.configureTestingModule({
            declarations: [IbBookingSlicedUpsellingComponent],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule,
                IbCPipeModule
            ],
            schemas: [],
            providers: [
                { provide: AJSCurrencyService, useValue: fakeAJSCurrencyService },
            ],
        }).overrideComponent(
            IbBookingSlicedUpsellingComponent,
            {
                set: {
                    providers: [
                        { provide: IbBookingUpsellingUtilsService, useValue: fakeIbBookingUpsellingUtilsService }
                    ]
                }
            }
        ).compileComponents();
        fixture = TestBed.createComponent(IbBookingSlicedUpsellingComponent);
        component = fixture.componentInstance;
        component.selectedSlice = selectedSliceMock;
        component.selectedFareFamily = selectedFareFamily;
        component.currencies = currencies;
        fixture.detectChanges();
    });
    it( 'should create', fakeAsync(() => {
        component.ngOnChanges( fakeChanges );
        flushMicrotasks();
        tick( 100 );
        expect(component).toBeTruthy();
        expect( component.styleImgBackground ).toEqual( `background-image: url(${ model.imgToshow })` );
    }));
    it( 'should call selectUpsellFare when change ', fakeAsync( () => {
        spyOn(component.selectUpselling, 'emit');
        component.selectUpsellFare();
        expect(component.selectUpselling.emit).toHaveBeenCalled();
    }));
});
