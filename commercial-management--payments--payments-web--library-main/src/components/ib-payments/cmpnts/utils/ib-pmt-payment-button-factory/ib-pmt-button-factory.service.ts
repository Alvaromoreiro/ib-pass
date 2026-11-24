import { Injectable } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import { image, PaymentButton } from './ib-payment-button';
import * as angular from 'angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})

export class ButtonFactoryService{

    constructor ( private translateService :TranslateService){

    }

    generateBizumButton = ():PaymentButton=>{
        const imagen : image ={
            src:'/payment/ico-bizum.png', class :'ib-button--bizum-icon'
        };
        let button =new PaymentButton('pmt-total-price-bizum-btn', 'ib-button ib-button--block ib-button--bizum', this.translateService.instant('IBPURC_PAYMENTS_AFOP_BIZUM_TOTAL_PRICE_BTN')
        );
        button.setImage(imagen);
        return  button;
    };

    generateMercadoPagoButton = ():PaymentButton=>{

        let button =new PaymentButton('pmt-total-price-pay-btn', 'ib-button ib-button--block ib-button--mercado-pago', this.translateService.instant('MERCADO_PAGO_BUTTON')
        );

        return  button;
    };

    generateNemuruButton = ():PaymentButton=>{
        return  new PaymentButton('pmt-total-price-pay-btn', 'ib-button ib-button--block', this.translateService.instant('PAYMENT_BUTTON_NEMURU'));
    };

    generateDefaultButton = (onHoldInfo, somethingToPay, isMobile):PaymentButton=> {
        let label='';
        let stepMapMobile = 'TOTAL_PRICE_COMPONENT_PAY_BUTTON_MOBILE';

        if(onHoldInfo){
            label='TOTAL_PRICE_COMPONENT_HOLD_BUTTON';
        } else if(isMobile){
            label = somethingToPay ? stepMapMobile : 'TOTAL_PRICE_COMPONENT_CONTINUE_BUTTON';

        } else{
            label= somethingToPay? 'TOTAL_PRICE_COMPONENT_PAY_BUTTON':'TOTAL_PRICE_COMPONENT_CONTINUE_BUTTON';
        }

        return  new PaymentButton('pmt-total-price-pay-btn', 'ib-button ib-button--block', this.translateService.instant(label));
    };


}

try {
    angular
        .module('ib-pmt-utils-module')
        .service('ButtonFactoryService', downgradeInjectable(ButtonFactoryService));
} catch {
    angular
        .module('ib-pmt-utils-module', [
            'ib-dates-module',
            'ib-pmt-tabs-module',
            'ib-pmt-datalayer-module',
            'ib-datalayer-ecommerce-module'
        ])
        .service('ButtonFactoryService', downgradeInjectable(ButtonFactoryService));
}

