import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notice } from '@src/app/core/models/ib-booking-notice/ib-booking-notice-model';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-booking-notice',
    templateUrl: './ib-booking-notice.component.html'
})
export class IbBookingNoticeComponent {
    @Input() type?: string;
    @Input() icon?: string;
    @Input() model?: Notice;
    @Output() toggleGenBox = new EventEmitter<string>();
    @Output() closeOnHoldBox = new EventEmitter<boolean>();
    @Output() acceptBuy = new EventEmitter();
    public showLightbox = false;
    public viewNoticeHidden = false;

    constructor () {}


    toggleGenericLightBox (launcher: string): void {
        this.viewNoticeHidden = !this.viewNoticeHidden;
        if (launcher && launcher.length > 0) {
            this.toggleGenBox.emit(launcher);

        }
    }

    action (launcher: string): void {
        if (launcher && launcher.length > 0) {
            this.toggleGenBox.emit(launcher);
        }
    }

    close (): void {
        this.closeOnHoldBox.emit(false);
    }

    acceptBuyOnhold (): void {
        this.acceptBuy.emit();
        this.close();
    }
}
downgradeToAJSComponent('ibBookingNotice', {
    component: IbBookingNoticeComponent,
    inputs: ['type', 'icon', 'model'],
    outputs: ['toggleGenBox', 'closeOnHoldBox', 'acceptBuy'] },
'ib-notice-module'
);
