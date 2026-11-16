import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IbCUserUtilsService } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-booking-marketing-check',
    templateUrl: './ib-booking-marketing-check.component.html',
    styleUrls: ['./ib-booking-marketing-check.component.scss']
})
export class IbBookingMarketingCheckComponent implements OnInit {
    protected showDenyNewsletter: boolean; // true if anon or zero, false if ibPlus
    @Input() parentForm: FormGroup;
    @Input() showMarketingPerm: boolean;
    @Output() marketingClick = new EventEmitter<boolean>();

    constructor (
        private CommonsUserUtilsService: IbCUserUtilsService
    ) {}

    ngOnInit (): void {
        this.showDenyNewsletter = this.checkDenyNewsletter();
    }
  


    onMarketingClick = () => {
        const value = this.parentForm.get('isMarketingAccepted')?.value;
        this.marketingClick.emit(value);
    };

    checkDenyNewsletter = (): boolean => {
        const isSoft = this.CommonsUserUtilsService.isSoftUser();
        const isIbPlus = this.CommonsUserUtilsService.isIbPlus();

        if(isIbPlus && !isSoft) return false;

        return true;
    };
}