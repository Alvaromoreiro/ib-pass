import {Injectable} from '@angular/core';
import * as angular from 'angular';
import {downgradeInjectable} from '@angular/upgrade/static';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn :'root'
})

export class DccService {
    private dccDataBehaviorSubject : BehaviorSubject<DccModel.DccResponse>;
    public readonly dccDataObservable : Observable<DccModel.DccResponse>;
    
    constructor () {
        this.dccDataBehaviorSubject = new BehaviorSubject(undefined);
        this.dccDataObservable = this.dccDataBehaviorSubject.asObservable();
    }

    setDccData (value?: DccModel.DccResponse) {
        this.dccDataBehaviorSubject.next(value);
    }
}

try {
    angular
        .module('ib-pmt-dcc-module')
        .service('DccService', downgradeInjectable(DccService));
} catch {
    angular
        .module('ib-pmt-dcc-module', [])
        .service('DccService', downgradeInjectable(DccService));
}