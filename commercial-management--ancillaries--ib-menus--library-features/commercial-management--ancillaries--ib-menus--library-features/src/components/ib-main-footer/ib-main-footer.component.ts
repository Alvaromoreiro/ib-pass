import { Component, OnInit, Input, Inject } from '@angular/core';
import { AJSRootScope, CommonsRootScope, CommonsSessionStorageService, downgradeToAJSComponent } from 'ib-web-commons/utils';
import { MainFooterService } from './ib-main-footer.service';
import { MenusConstants } from '../ib-menus-constants';

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
    constructor (@Inject(AJSRootScope) private _$rootScope: CommonsRootScope,  private CommonsSessionStorageService: CommonsSessionStorageService, private MainFooterService: MainFooterService ) {}

    get paymentMethods () {
        return this._paymentMethods;
    }

    get secureMethods () {
        return this._secureMethods;
    }

    get year (): number {
        return this._year;
    }

    get $rootScope (): CommonsRootScope {
        return this._$rootScope;
    }
    ngOnInit (): void {
        this._year = new Date().getFullYear();
        this.initFooterIcons();
        if(this.hashChangeControl) {
            this.$rootScope.$on('$routeChangeSuccess', () => {
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
        this.onPayments = quadrigam? MenusConstants.PAYMENT_QUADRIGAMS[quadrigam.toLowerCase()] !== undefined: false;
        
        const request: MenusModel.footerIconsRequestModel = {
            market: this.$rootScope.appMarket,
            applicationId: 1
        };
    
        const paymentMethodsInfo:any = this.CommonsSessionStorageService.get('paymentMethodsInfo');
        if (!this.onPayments) {
            if(paymentMethodsInfo?.flowName === this.flowName && paymentMethodsInfo.market === this.$rootScope.appMarket) {
                this.fillData (paymentMethodsInfo.paymentMethods);
            } else {
                this.MainFooterService.getIcons(request).subscribe((res) => {
                    this.CommonsSessionStorageService.set('paymentMethodsInfo', { paymentMethods: res, flowName: this.flowName, market: this.$rootScope.appMarket });
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
                        if (MenusConstants.AVAILABLE_METHODS_PRIORITY[type.cardTypeCode]){ 
                            methodsList.add(type.cardTypeCode);
                            if(type.cardTypeCode === 'VI' || type.cardTypeCode === 'CA' || type.cardTypeCode === 'AX') secureList.add(type.cardTypeCode);
                        }
                    });  
                else if (method.provider) {
                    if (MenusConstants.AVAILABLE_METHODS_PRIORITY[method.provider]) methodsList.add(method.provider);  
                }
            });
            this._paymentMethods = Array.from(methodsList).sort((a, b) => MenusConstants.AVAILABLE_METHODS_PRIORITY[a] - MenusConstants.AVAILABLE_METHODS_PRIORITY[b]);
            this._secureMethods = Array.from(secureList).sort((a, b) => MenusConstants.AVAILABLE_SECURES_PRIORITY[a] - MenusConstants.AVAILABLE_SECURES_PRIORITY[b]);
        }
    }
}

downgradeToAJSComponent('ibMainFooter', {
    component: MainFooterComponent
}, 'ib-main-footer-module');