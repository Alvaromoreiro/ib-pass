import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbPriceBreakdownOnHoldConfComponent } from '@pages/ib-booking-on-hold-confirmation/components/ib-trip-info-on-hold-conf/components/ib-price-breakdown-on-hold-conf/ib-price-breakdown-on-hold-conf.component';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { IbCPipeModule } from 'ib-web-commons/pipes';


class IbCModalServiceMock {
    showGenericComponentModal = jasmine
        .createSpy('showGenericComponentModal')
        .and.returnValue({
            result: Promise.resolve(),
            componentInstance: { model: {} }
        });
}


let mockPriceBreakdown = {
    originalPrice: '161,67$',
    paidDeposit: {
        priceFormat: '-10$',
        price: 10
    },
    price: {
        formatted: '166,67$',
        original: 166.67,
        perPassenger: '161.67$'
    },
    passengerPrices: {
        ADULT: {
            numberOfPassengers: 1,
            fare: 146,
            formattedFare: '146,00$',
            tax: 1,
            totalTax: 2,
            formattedInTax: '20,67$',
            formattedTotalTax: '0$',
            breakdownTaxes: [
                {
                    amount: '16,09$',
                    carrier: null,
                    code: 'JD',
                    country: 'ES',
                    currency: 'EUR',
                    description: 'Cargo por salida',
                    subcode: '003'
                },
                {
                    amount: '3,89$',
                    carrier: null,
                    code: 'QV',
                    country: 'ES',
                    currency: 'EUR',
                    description: 'Seguridad',
                    subcode: '003'
                },
                {
                    amount: '0,69$',
                    carrier: null,
                    code: 'OG',
                    country: 'ES',
                    currency: 'EUR',
                    description: 'Tasa de seguridad',
                    subcode: '001'
                }
            ]
        }
    },
    voucherDiscount: null
};

describe('IbPriceBreakdownOnHoldConfComponent', () => {
    let component: IbPriceBreakdownOnHoldConfComponent;
    let fixture: ComponentFixture<IbPriceBreakdownOnHoldConfComponent>;

    const fakeIbCModalService = new IbCModalServiceMock();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                IbPriceBreakdownOnHoldConfComponent
            ],
            providers: [
                { provide: IbCModalService, useValue: fakeIbCModalService }
            ],
            imports: [TranslateModule.forRoot(), IbBookingSharedModule, IbCPipeModule]
        }).compileComponents();

        fixture = TestBed.createComponent(IbPriceBreakdownOnHoldConfComponent);
        component = fixture.componentInstance;
        component.price = mockPriceBreakdown.price;
        component.passengerPrices = mockPriceBreakdown.passengerPrices;
        component.paidDeposit = mockPriceBreakdown.paidDeposit;
        component.originalPrice = mockPriceBreakdown.originalPrice;
        component.voucherDiscount = mockPriceBreakdown.voucherDiscount;
        fixture.detectChanges();
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Call openTaxBreakdownModal', () => {
        it('should open tax breakdown modal', () => {
            component.openTaxBreakdownModal(
                mockPriceBreakdown.passengerPrices.ADULT.breakdownTaxes
            );
            expect(
                fakeIbCModalService.showGenericComponentModal
            ).toHaveBeenCalled();
        });
    });
});
