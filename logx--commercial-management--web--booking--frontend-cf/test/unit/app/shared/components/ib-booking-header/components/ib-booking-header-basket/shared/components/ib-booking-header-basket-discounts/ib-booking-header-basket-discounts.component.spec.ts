import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingHeaderBasketDiscountsComponent } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-discounts/ib-booking-header-basket-discounts.component';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';

describe('IbBookingHeaderBasketDiscountsComponent', () => {
    let component: IbBookingHeaderBasketDiscountsComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketDiscountsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingHeaderBasketDiscountsComponent],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule,
                IbBookingSharedModule
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]


        }).compileComponents();

        fixture = TestBed.createComponent(
            IbBookingHeaderBasketDiscountsComponent
        );
        component = fixture.componentInstance;
        component.model = {
            "hasDiscounts": true,
            "total": 65.19,
            "discounts": {
                "RES": {
                    "type": "RES",
                    "discountType": "CANARIAS",
                    "description": "Dto. Residente",
                    "percentDiscount": 75,
                    "totalDiscount": 61.12,
                    "discountCode": "RC",
                    "discountFormatted": "61,12€"
                },
                "LGF": {
                    "type": "LGF",
                    "discountType": "GENERAL",
                    "description": "Dto. Fam. numerosa",
                    "percentDiscount": 5,
                    "totalDiscount": 4.07,
                    "discountFormatted": "4,07€"
                }
            },
            "totalFormated": "-65,19€"
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
