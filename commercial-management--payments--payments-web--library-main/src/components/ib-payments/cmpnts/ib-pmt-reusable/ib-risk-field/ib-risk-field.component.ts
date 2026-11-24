import { Component, Inject, Input, OnInit } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
import angular from 'angular';
import { AJSRootScope } from 'ib-web-commons/utils';


@Component({
    selector:'ib-pmt-riskfied',
    template:''
})

export class IbPmtRiskfiedComponent implements OnInit{

    @Input()
    private sessionId: string;

    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope
    ){

    }
    ngOnInit (): void {

        const store_domain = 'iberia.com';
        const prefix = 'IBERIA';
        let fingerPrintId = this.sessionId;
        if (fingerPrintId.startsWith(prefix)) {
            fingerPrintId = fingerPrintId.slice(prefix.length);
        }
        const url = 'https://beacon.riskified.com?shop=' + store_domain + '&sid=' + fingerPrintId;
        const riskified = document.createElement('script');
        riskified.type = 'text/javascript';
        riskified.async = true;
        riskified.src = url;
        const scriptsZone = document.getElementsByTagName('script')[0];
        scriptsZone.parentNode.insertBefore(riskified, scriptsZone);
    }
}


try{
    angular.module('ib-reusable-module').directive('ibPmtRiskfied', downgradeComponent({
        component:IbPmtRiskfiedComponent,
        inputs:[
            'sessionId'
        ]
    }));
}catch{
    angular.module('ib-reusable-module', []).directive('ibPmtRiskfied', downgradeComponent({
        component:IbPmtRiskfiedComponent,
        inputs:[
            'sessionId'
        ]
    }));
}
