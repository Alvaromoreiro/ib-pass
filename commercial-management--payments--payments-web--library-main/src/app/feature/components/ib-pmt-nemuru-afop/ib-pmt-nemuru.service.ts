import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { downgradeInjectable } from '@angular/upgrade/static';
import * as angular from 'angular';
import { AJSRootScope, CommonsRootScope } from 'ib-web-commons/utils';


@Injectable({
    providedIn :'root'
})


export class ibPmtNemuruService{

    private nemuruIsAvailable : BehaviorSubject<boolean>;
    public readonly nemuruIsAvailableObser : Observable<boolean>;



    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope
    ){
        this.nemuruIsAvailable = new BehaviorSubject(false);
        this.nemuruIsAvailableObser = this.nemuruIsAvailable.asObservable();
    }



    setNemuruAvailable = (isNemuruAvailable: boolean)=>{

        this.nemuruIsAvailable.next(isNemuruAvailable);
        
    };
    

    submitPayment = ()=>{
        this.$rootScope.$broadcast('submitedPaymentEvent', 'iberiaPayAfop');
    };


}


try {
    angular
        .module('ib-pmt-nemuru-afop')
        .service('ibPmtNemuruService', downgradeInjectable(ibPmtNemuruService));
} catch {
    angular
        .module('ib-pmt-nemuru-afop', [])
        .service('ibPmtNemuruService', downgradeInjectable(ibPmtNemuruService));
}

