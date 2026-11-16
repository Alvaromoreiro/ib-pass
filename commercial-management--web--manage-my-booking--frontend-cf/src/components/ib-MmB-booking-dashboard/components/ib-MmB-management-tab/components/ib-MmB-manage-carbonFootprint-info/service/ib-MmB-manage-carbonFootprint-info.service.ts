import { BehaviorSubject, Observable } from 'rxjs';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class IbMmbManageCarbonFootprintInfoService {

    public openTab: BehaviorSubject<boolean>;
    public readonly $openTabObser: Observable<boolean>;

    constructor() {
        this.openTab = new BehaviorSubject(false);
        this.$openTabObser = this.openTab.asObservable();
    }

    submitOpenTab(submmittedState: boolean) {
        this.openTab.next(submmittedState);
        this.openTab.next(false);
    };
}

downgradeToAJSService('IbMmbManageCarbonFootprintInfoService', IbMmbManageCarbonFootprintInfoService, 'ib-MmB-manage-carbonFootprint-info-module')
