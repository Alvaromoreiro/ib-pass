import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
import angular from 'angular';
import { ibPmtMercadoPagoService } from './ib-pmt-mercado-pago.service';
import { PmtConstants } from '../../../core/ib-pmt-constants';
import { AJSRootScope, CommonsRootScope } from 'ib-web-commons/utils';
import { Router, RouterEvent } from '@angular/router';

declare global {
    interface Window {
        MercadoPago: (publicKey: string, options?: MercadoPagoOptions) => void;
        checkoutButton: {
            unmount(): void;
        }
    }
}

interface MercadoPagoOptions {
    locale?: string;
    advancedFraudPrevention?: boolean;
    trackingDisabled?: boolean;
    frontEndStack?: string;
    siteId?: string;
}

@Component({
    selector:'ib-pmt-mercado-pago-afop',
    templateUrl:'./ib-pmt-mercado-pago-view.component.html'
})

export class IbPmtMercadoPagoComponent implements OnInit, OnDestroy{

    @Input() preferenceId: string = '';
    private mercadopago: any;
    private mercadoPagoContainerId :string = 'mercado-pago-checkout';

    constructor (@Inject(AJSRootScope) private $rootScope: CommonsRootScope, private ibPmtMercadoPagoService : ibPmtMercadoPagoService) {}

    async ngOnInit (): Promise<void> {
        const locale = `${this.$rootScope.appLang}-${this.$rootScope.appMarket}` as MercadoPagoOptions['locale'];
        if (window.MercadoPago) {
            const mercadoPagoIds = this.$rootScope.production ? PmtConstants.AFOP_MERCADO_PAGO_ID.production : PmtConstants.AFOP_MERCADO_PAGO_ID.test;
            this.mercadopago = new window.MercadoPago(mercadoPagoIds[this.$rootScope.appMarket], {
                locale:  locale
            });
            const bricksBuilder = this.mercadopago.bricks();
            await this.renderComponent(bricksBuilder);
        }
    }
    async renderComponent (bricksBuilder: any) {
        if (window.checkoutButton) window.checkoutButton.unmount();
        window.checkoutButton = await bricksBuilder.create(
            'wallet',
            this.mercadoPagoContainerId,
            {
                initialization: {
                    preferenceId: this.preferenceId,
                    redirectMode: 'self'
                },
                callbacks: {
                    onReady: () => {
                        const observer = new MutationObserver(() => {
                            const button: HTMLButtonElement = document.querySelector(`#${this.mercadoPagoContainerId} button`);
                            button.click();
                            observer.disconnect();
                            window.checkoutButton.unmount();
                            this.ibPmtMercadoPagoService.setMercadoPagoAvailable(false);
                        });
                        observer.observe(document.getElementById(this.mercadoPagoContainerId), { childList: true, subtree: true });
                    }
                }
            }
        );
    }

    ngOnDestroy (): void {
        if (window.checkoutButton) {
            window.checkoutButton.unmount();
        }
    }
}

try{
    angular.module('ib-pmt-mercado-pago-afop').directive('ibPmtMercadoPagoAfop', downgradeComponent({
        component: IbPmtMercadoPagoComponent,
        inputs:[
            'preferenceId'
        ]
    }));
}catch{
    angular.module('ib-pmt-mercado-pago-afop', []).directive('ibPmtMercadoPagoAfop', downgradeComponent({
        component: IbPmtMercadoPagoComponent,
        inputs:[
            'preferenceId'
        ]
    }));
}
