import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbPmtDccComponent } from 'src/components/ib-payments/cmpnts/ib-pmt/cmpnts/ib-pmt-dcc/ib-pmt-dcc.component';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TranslateMockPipe } from '../ib-pmt-summary/cmpnts/ib-pmt-summary-carbon-footprint/ib-pmt-summary-carbon-footprint.spec';



const mockDccDataVISA: DccModel.CurrentDccData = {
    'id': 'dcc-12345',
    'rate': 1.4845,
    'marginPercentage': '3.00',
    'commissionPercentage': 1,
    'sourceTimestamp': '2016-01-29 10:59:05.0',
    'DCCPrice': {
        'value': 41029,
        'currencyCode': 'USD2'
    },
    'basePrice': {
        'currency': {
            'suffixSymbol': true,
            'decimalSeparator': ',',
            'numberDecimals': 2,
            'groupingSeparator': '.',
            'currencySymbol': '€',
            'description': 'Euro',
            'code': 'EUR'
        }
    },
    'creditCardType': 'VI',
    'formattedBasePrice': {
        'totalPrice': '276,38€',
        'currencyCode': 'EUR'
    },
    'formattedSourceTimestamp': '29/01/2016',
    'totalPrice': '410,29',
    'currencyCode': 'USD',
    'selectedValue': undefined
};

const mockDccDataMC: DccModel.CurrentDccData = {
    'id': 'dcc-67890',
    'rate': 1.4845,
    'marginPercentage': '3.00',
    'commissionPercentage': 3.00,
    'sourceTimestamp': '2016-01-29 10:59:05.0',
    'DCCPrice': {
        'value': 41029,
        'currencyCode': 'USD2'
    },
    'basePrice': {
        'currency': {
            'suffixSymbol': true,
            'decimalSeparator': ',',
            'numberDecimals': 2,
            'groupingSeparator': '.',
            'currencySymbol': '€',
            'description': 'Euro',
            'code': 'EUR'
        }
    },
    'creditCardType': 'CA',
    'formattedBasePrice': {
        'totalPrice': '276,38€',
        'currencyCode': 'EUR'
    },
    'formattedSourceTimestamp': '29/01/2016',
    'totalPrice': '410,29',
    'currencyCode': 'USD',
    'selectedValue': 'DCC_ENABLED'
};


describe('IbPmtDccComponent', () => {
    let component: IbPmtDccComponent;
    let fixture: ComponentFixture<IbPmtDccComponent>;
    let expectedObj1, expectedObj2, buttonEnable, buttonDisable;


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule, FormsModule, TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })],
            declarations: [IbPmtDccComponent, TranslateMockPipe]
        });


        fixture = TestBed.createComponent(IbPmtDccComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });

    it('should initialize correctly', () => {
        expect(component).toBeDefined();
    });

    describe('when user inputs visa card and have dcc', () => {

        beforeEach(() => {
            component.currentDccData = mockDccDataVISA;
            expectedObj1 = {'dccPriceTotalPrice':component.currentDccData.totalPrice, 'dccPriceCurrencyCode':component.currentDccData.currencyCode};
            expectedObj2 = { 'sourceTimestamp': component.currentDccData.formattedSourceTimestamp, 'basePriceCurrencyCode': component.currentDccData.basePrice.currency.code, 'rate': component.currentDccData.rate, 'dccPriceCurrencyCode': component.currentDccData.currencyCode, 'marginPercentage': component.currentDccData.marginPercentage };
            fixture.detectChanges();
            buttonEnable = document.querySelector<HTMLInputElement>('#dccRadio1');
            buttonDisable = document.querySelector<HTMLInputElement>('#dccRadio2');
        });

        it('should update the view of the component', () => {
            expect(document.querySelector<HTMLInputElement>('#DCC_RATE_TEXT_1').innerHTML).toContain(JSON.stringify(expectedObj1));
            expect(document.querySelector<HTMLInputElement>('#DCC_RATE_TEXT_2').innerHTML).toContain(JSON.stringify(expectedObj2));
            expect(buttonEnable.checked).toBeFalse();
            expect(buttonDisable.checked).toBeFalse();

        });

        it('should enable dcc when first button is clicked', () => {
            buttonEnable.click();
            expect(buttonEnable.checked).toBeTrue();
            expect(buttonDisable.checked).toBeFalse();

        });

        it('should disable dcc when second button is clicked', () => {
            buttonDisable.click();
            expect(buttonEnable.checked).toBeFalse();
            expect(buttonDisable.checked).toBeTrue();

        });
    });

    describe('when user inputs mastercard card and have dcc', () => {

        beforeEach(() => {
            component.currentDccData = mockDccDataMC;
            expectedObj1 = {'dccPriceTotalPrice':component.currentDccData.totalPrice, 'dccPriceCurrencyCode':component.currentDccData.currencyCode};
            expectedObj2 = { 'sourceTimestamp': component.currentDccData.formattedSourceTimestamp, 'basePriceCurrencyCode': component.currentDccData.basePrice.currency.code, 'rate': component.currentDccData.rate, 'dccPriceCurrencyCode': component.currentDccData.currencyCode, 'marginPercentage': component.currentDccData.marginPercentage };
            fixture.detectChanges();
            buttonEnable = document.querySelector<HTMLInputElement>('#dccRadio1');
            buttonDisable = document.querySelector<HTMLInputElement>('#dccRadio2');

        });

        it('should update the view of the component', () => {
            expect(document.querySelector<HTMLInputElement>('#DCC_RATE_TEXT_1').innerHTML).toContain(JSON.stringify(expectedObj1));
            expect(document.querySelector<HTMLInputElement>('#DCC_RATE_TEXT_2').innerHTML).toContain(JSON.stringify(expectedObj2));
            buttonEnable.click();
            expect(buttonEnable.checked).toBeTrue();
            expect(buttonDisable.checked).toBeFalse();

        });

    });

    describe('when user have dcc and check donation', () => {

        beforeEach(() => {
            component.currentDccData = mockDccDataVISA;
            component.donationEnabled = true;
            fixture.detectChanges();

        });

        it('should not show dcc offer', () => {
            const dccSection = document.querySelector<HTMLInputElement>('#section-dcc');
            expect(dccSection).toBeNull();

        });

    });

    describe('when user doesnt have dcc', () => {

        it('should not show dcc offer', () => {
            const dccSection = document.querySelector<HTMLInputElement>('#section-dcc');
            expect(dccSection).toBeNull();

        });

    });
});
