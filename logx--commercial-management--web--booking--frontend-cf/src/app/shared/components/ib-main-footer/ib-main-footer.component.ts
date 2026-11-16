import { Component, OnInit, Input } from '@angular/core';
import { CommonsSessionStorageService, downgradeToAJSComponent } from 'ib-web-commons/utils';
import { FooterIconsRequest, MainFooterService } from './ib-main-footer.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { RootStore } from '../../../core/store/ib-booking-root.store';

const FOOTER_CONSTANTS ={
    AVAILABLE_METHODS_PRIORITY: {
        'AX': 1,
        'DC': 2,
        'JCB': 3,
        'PAYPAL': 4,
        'VI': 5,
        'CA': 6,
        'GOOGLE-PAY': 7,
        'APPLE-PAY': 8,
        'SOFORT': 9,
        'IDEAL': 10,
        'EL': 11,
        'TP': 12,
        'BIZUM': 13,
        'UP': 14,
        'MERCADO_PAGO': 15
    },
    AVAILABLE_SECURES_PRIORITY: {
        'AX': 2,
        'CA': 1,
        'VI': 3
    }
};

@Component({
    selector:'ib-main-footer',
    templateUrl:'./ib-main-footer.component.html',
    styleUrls: ['./ib-main-footer.component.scss']
})

export class MainFooterComponent implements OnInit {

    @Input() footerModel;
    @Input() isFullWidth;
    @Input() isFixed;
    @Input() hashChangeControl;
    @Input() extraClass;
    
    private _year: number;
    private _paymentMethods: string[];
    private _secureMethods: string[];
    private flowName: string;
    private onPayments: boolean;
    constructor (public rootStore: RootStore,  private CommonsSessionStorageService: CommonsSessionStorageService, private MainFooterService: MainFooterService ) {
    }

    get paymentMethods () {
        return this._paymentMethods;
    }

    get secureMethods () {
        return this._secureMethods;
    }

    get year (): number {
        return this._year;
    }


    ngOnInit (): void {
        this._year = new Date().getFullYear();
        this.initFooterIcons();
        if(this.hashChangeControl) {
            this.rootStore.getOriginalRootScope().$on('$routeChangeSuccess', () => {
                this.initFooterIcons();
            });
        }
    }

    initFooterIcons () {
        this._paymentMethods = [];
        this._secureMethods = [];
        this.flowName = this.CommonsSessionStorageService.get('flowApp');
        const hash = window.location.hash.split('/');
        const quadrigam = hash[hash.length -1];
        this.onPayments = quadrigam? BookingAppConstants.QUADRIGAMS.PAYMENTS === quadrigam.toLowerCase() : false;
        
        const request: FooterIconsRequest = {
            market: this.rootStore.get('appMarket'),
            applicationId: 1
        };
    
        const paymentMethodsInfo:any = this.CommonsSessionStorageService.get('paymentMethodsInfo');
        if (!this.onPayments) {
            if(paymentMethodsInfo?.flowName === this.flowName && paymentMethodsInfo.market === this.rootStore.get('appMarket')) {
                this.fillData (paymentMethodsInfo.paymentMethods);
            } else {
                this.MainFooterService.getIcons(request).subscribe((res) => {
                    this.CommonsSessionStorageService.set('paymentMethodsInfo', { paymentMethods: res, flowName: this.flowName, market: this.rootStore.get('appMarket') });
                    this.fillData(res);
                });
            }
        }
    }

    fillData (paymentMethodsInfo) {
        const methodsList: Set<string> = new Set();
        const secureList: Set<string> = new Set();
        if(paymentMethodsInfo.paymentMethods) {
            paymentMethodsInfo.paymentMethods.forEach(method => {
                if (method.creditCardTypes)
                    method.creditCardTypes.forEach(type => {
                        if (FOOTER_CONSTANTS.AVAILABLE_METHODS_PRIORITY[type.cardTypeCode]){ 
                            methodsList.add(type.cardTypeCode);
                            if(['VI', 'CA', 'AX'].includes(type.cardTypeCode)) secureList.add(type.cardTypeCode);
                        }
                    });  
                else if (method.provider && FOOTER_CONSTANTS.AVAILABLE_METHODS_PRIORITY[method.provider]){ 
                    methodsList.add(method.provider);  
                }
            });
            this._paymentMethods = Array.from(methodsList).sort((a, b) => FOOTER_CONSTANTS.AVAILABLE_METHODS_PRIORITY[a] - FOOTER_CONSTANTS.AVAILABLE_METHODS_PRIORITY[b]);
            this._secureMethods = Array.from(secureList).sort((a, b) => FOOTER_CONSTANTS.AVAILABLE_SECURES_PRIORITY[a] - FOOTER_CONSTANTS.AVAILABLE_SECURES_PRIORITY[b]);
        }
    }
}

downgradeToAJSComponent('ibMainFooter', {
    component: MainFooterComponent
}, 'ib-main-footer-module');
