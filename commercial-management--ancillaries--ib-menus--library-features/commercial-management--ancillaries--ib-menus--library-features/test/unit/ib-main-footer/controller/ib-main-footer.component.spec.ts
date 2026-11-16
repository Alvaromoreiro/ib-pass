import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainFooterComponent } from 'src/components/ib-main-footer/ib-main-footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/services/StorageServiceMock';
import { HttpClientModule } from '@angular/common/http';
import { LinkPipeMock, TranslatePipeMock } from 'test/mocks/pipe-mock.pipe';

const fakePaymentMethodsInfo = {'paymentMethods': {
    'currency': null,
    'paymentMethods': [
        {
            'total': 1,
            'appliedDiscounts': [],
            'description': 'Tarjeta bancaria',
            'creditCardTypes': [
                {
                    'cardTypeId': '43',
                    'cardTypeCode': 'UP',
                    'description': 'UnionPay',
                    'cardSubtype': null
                },
                {
                    'cardTypeId': '111',
                    'cardTypeCode': 'VI',
                    'description': 'Visa',
                    'cardSubtype': null
                },
                {
                    'cardTypeId': '101',
                    'cardTypeCode': 'VI',
                    'description': 'Visa',
                    'cardSubtype': null
                },
                {
                    'cardTypeId': '112',
                    'cardTypeCode': 'CA',
                    'description': 'Mastercard',
                    'cardSubtype': null
                },
                {
                    'cardTypeId': '105',
                    'cardTypeCode': 'CA',
                    'description': 'Mastercard',
                    'cardSubtype': null
                },
                {
                    'cardTypeId': '113',
                    'cardTypeCode': 'AX',
                    'description': 'American Express',
                    'cardSubtype': null
                },
                {
                    'cardTypeId': '123',
                    'cardTypeCode': 'AX',
                    'description': 'American Express',
                    'cardSubtype': null
                },
                {
                    'cardTypeId': '4',
                    'cardTypeCode': 'DC',
                    'description': 'Diners Club',
                    'cardSubtype': null
                },
                {
                    'cardTypeId': '3',
                    'cardTypeCode': 'TP',
                    'description': 'UATP/Airplus',
                    'cardSubtype': null
                },
                {
                    'cardTypeId': '2',
                    'cardTypeCode': 'AX',
                    'description': 'American Express',
                    'cardSubtype': null
                },
                {
                    'cardTypeId': '5',
                    'cardTypeCode': 'CA',
                    'description': 'Mastercard',
                    'cardSubtype': null
                },
                {
                    'cardTypeId': '1',
                    'cardTypeCode': 'VI',
                    'description': 'Visa',
                    'cardSubtype': null
                }
            ],
            'requiredFields': [
                'billTo_country'
            ],
            'requiredAdditionalFields': false,
            'vault': {
                'id': '0001DJ6D',
                'urlIframeNumber': 'https://www.test.indra-netplus.com/iberiapay/iframes/v2/iframeNumber.html?urlsCss=https://pree.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css',
                'urlIframeCvv': 'https://www.test.indra-netplus.com/iberiapay/iframes/v2/iframeCvv.html?urlsCss=https://pree.iberia.es/iberia-web-content/ib-web-styles/ib-style-integration.min.css'
            },
            'psd2Warning': true,
            'ndcThreeDSConfig': null,
            'installments': null,
            'dccAvailable': true,
            'type': 'IBERIA_PAY'
        },
        {
            'total': 1,
            'description': 'Bizum',
            'provider': 'BIZUM',
            'unityFee': 0,
            'totalFee': 0,
            'totalToPay': 1,
            'fee': null,
            'appliedDiscounts': [],
            'requiredAdditionalFields': false,
            'type': 'IBERIA_PAY_AFOP'
        },
        {
            'total': 1,
            'description': 'PayPal',
            'provider': 'PAYPAL',
            'unityFee': 0,
            'totalFee': 0,
            'totalToPay': 1,
            'fee': null,
            'appliedDiscounts': [],
            'requiredAdditionalFields': false,
            'type': 'IBERIA_PAY_AFOP'
        },
        {
            'total': 1,
            'description': 'Transferencia',
            'provider': 'SOFORT',
            'unityFee': 0,
            'totalFee': 0,
            'totalToPay': 1,
            'fee': null,
            'appliedDiscounts': [],
            'requiredAdditionalFields': false,
            'type': 'IBERIA_PAY_AFOP'
        },
        {
            'total': 1,
            'description': 'Pago en cuotas',
            'provider': 'NEMURU',
            'unityFee': 0,
            'totalFee': 0,
            'totalToPay': 1,
            'fee': null,
            'appliedDiscounts': [],
            'requiredAdditionalFields': false,
            'clientId': '494cfa22-8a95-4318-91e2-9d67870ea542',
            'product': 'instalments',
            'type': 'IBERIA_PAY_AFOP'
        }
    ],
    'availableDiscounts': []
},
'flowName': 'BBKI',
'market': 'ES'
};

describe('IbMainFooterComponent', () => {
    let component: MainFooterComponent;
    let fixture: ComponentFixture<MainFooterComponent>;
    const fakeRootScope = {
        appMarket: 'ES',
        routes: {
            icons: ''
        }
    };

    let fakeCommonsSessionStorageService;

    beforeEach(() => {
        fakeCommonsSessionStorageService = new StorageServiceMock();
        TestBed.configureTestingModule({
            providers:[
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService }
            ],
            imports: [TranslateModule, FormsModule, HttpClientModule],
            declarations: [MainFooterComponent, TranslatePipeMock, LinkPipeMock]
        });


        fixture = TestBed.createComponent(MainFooterComponent);
        component = fixture.componentInstance;
        fakeCommonsSessionStorageService.set('paymentMethodsInfo', fakePaymentMethodsInfo);
        fakeCommonsSessionStorageService.set('flowApp', 'BBKI');
        fixture.detectChanges();        

    });

    it('should initialize correctly', () => {
        expect(component).toBeDefined();
    });

    it('should fill payment and secure methods', () => {
        const expectedPayments = ['AX', 'DC', 'PAYPAL', 'VI', 'CA', 'SOFORT', 'TP', 'BIZUM', 'UP'];
        const expectedSecures = ['CA', 'AX', 'VI'];
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.paymentMethods).toEqual(expectedPayments);
        expect(component.secureMethods).toEqual(expectedSecures);
        expect(document.getElementsByName('payment-icon').length).toEqual(expectedPayments.length);
        expect(document.getElementsByName('secure-icon').length).toEqual(expectedSecures.length);
    });


    it('should be actual year', (done) => {
        const dateTimeYear =new Date().getFullYear();
        jasmine.clock().mockDate(new Date());
        expect(component.year).toEqual(dateTimeYear);
        done();
    });

        
});