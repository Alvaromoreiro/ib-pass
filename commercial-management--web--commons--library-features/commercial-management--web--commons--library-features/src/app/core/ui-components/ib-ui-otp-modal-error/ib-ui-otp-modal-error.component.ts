import {
    Component,
    Output,
    EventEmitter
} from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
import * as angular from 'angular';

@Component({
    selector: 'ib-ui-otp-modal-error',
    templateUrl: './ib-ui-otp-modal-error.component.html',
    styleUrls: ['./ib-ui-otp-modal-error.component.scss'],
    })
export class IbUiOtpModalErrorComponent {

    @Output() closeModal = new EventEmitter<void>();

    close (): void {
        this.closeModal.emit();
    }

    accept (): void {
        this.closeModal.emit();
    }
}

try {
    angular.module('ib-ui-otp-modal-error-module').directive(
        'ibUiOtpModalError',
        downgradeComponent({
            component: IbUiOtpModalErrorComponent
        }) as angular.IDirectiveFactory
    );
} catch {
    angular.module('ib-ui-otp-modal-error-module', []).directive(
        'ibUiOtpModalError',
        downgradeComponent({
            component: IbUiOtpModalErrorComponent
        }) as angular.IDirectiveFactory
    );
}