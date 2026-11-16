import { Component, Inject, Input, OnInit } from '@angular/core';
import { downgradeToAJSComponent, CommonsSessionStorageService, AJSRootScope } from 'ib-web-commons/utils';
import {FormatedOnHold} from '@src/app/core/models/ib-booking-on-hold-now/ib-booking-on-hold-now-model';

@Component({
    selector: 'ib-booking-on-hold-now',
    templateUrl: './ib-booking-on-hold-now.component.html',
    styleUrls: ['./ib-booking-on-hold-now.component.scss']
})
export class IbBookingOnHoldNowComponent implements OnInit {
    @Input() public onHoldInfo: FormatedOnHold;
    @Input() public showButton: boolean;
    @Input() public onHoldIfLoggedInfo: FormatedOnHold;
    public isUserLogged:boolean;

    constructor (private CommonsSessionStorageService: CommonsSessionStorageService,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope) {

    }

    ngOnInit ():void {
        this.isUserLogged = this.CommonsSessionStorageService.get('userLogged');
    }

    holdOrder = ():void => {
        this.CommonsSessionStorageService.set('flowApp', 'BBKIOH');
        this.$rootScope.$emit('holdOrderEvent', true);
    };
}
downgradeToAJSComponent('ibBookingOnHoldNow', {
    component: IbBookingOnHoldNowComponent,
    inputs: ['onHoldInfo', 'showButton', 'onHoldIfLoggedInfo'] },
'ib-booking-passenger-info-module');
