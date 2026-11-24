import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { downgradeInjectable } from '@angular/upgrade/static';
import * as angular from 'angular';
import { AJSRootScope, CommonsRootScope } from 'ib-web-commons/utils';


@Injectable({
    providedIn :'root'
})


export class IbPmtTelephoneService{

    private submittedForm : BehaviorSubject<boolean>;
    public readonly $submittedFormObser : Observable<boolean>;



    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope
    ){
        this.submittedForm = new BehaviorSubject(false);
        this.$submittedFormObser = this.submittedForm.asObservable();
    }



    submitForm = (submmittedState: boolean)=>{

        this.submittedForm.next(submmittedState);
        
    };
    

}


try {
    angular
        .module('ib-pmt-telephone-module')
        .service('ibPmtTelephoneService', downgradeInjectable(IbPmtTelephoneService));
} catch {
    angular
        .module('ib-pmt-telephone-module', [])
        .service('ibPmtTelephoneService', downgradeInjectable(IbPmtTelephoneService));
}

