import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { downgradeInjectable } from '@angular/upgrade/static';
import * as angular from 'angular';
import { AJSRootScope, CommonsRootScope } from 'ib-web-commons/utils';

@Injectable({
    providedIn :'root'
})

export class ibPmtMercadoPagoService {
    private mercadoPagoIsAvailable : BehaviorSubject<boolean>;
    public readonly mercadoPagoIsAvailableObserver : Observable<boolean>;
    constructor (@Inject(AJSRootScope) private $rootScope: CommonsRootScope) {
        this.mercadoPagoIsAvailable = new BehaviorSubject(false);
        this.mercadoPagoIsAvailableObserver = this.mercadoPagoIsAvailable.asObservable();
    }
    setMercadoPagoAvailable = (isMercadoPagoAvailable: boolean)=> {
        this.mercadoPagoIsAvailable.next(isMercadoPagoAvailable);
    };
    submitPayment = ()=> {
        this.$rootScope.$broadcast('submitedPaymentEvent', 'iberiaPayAfop');
    };
}


try {
    angular
        .module('ib-pmt-mercado-pago-afop')
        .service('ibPmtMercadoPagoService', downgradeInjectable(ibPmtMercadoPagoService));
} catch {
    angular
        .module('ib-pmt-mercado-pago-afop', [])
        .service('ibPmtMercadoPagoService', downgradeInjectable(ibPmtMercadoPagoService));
}

