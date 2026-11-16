import { Component, Input, OnInit } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { CashAviosModel } from '@core/models/ib-booking-on-hold-confirmation/ib-cash-avios-info-component-model';

@Component({
    selector: 'ib-cash-avios-info',
    templateUrl: './ib-cash-avios-info.component.html',
    styleUrls: ['./ib-cash-avios-info.component.scss']
})

export class IbCashAviosInfoComponent implements OnInit{
    @Input() cashAviosModel: CashAviosModel;
    @Input() isUserLogged: boolean;

    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService

    ) {}
    ngOnInit (): void {
        this.isUserLogged = this.CommonsSessionStorageService.get('userLogged');
    }

}
