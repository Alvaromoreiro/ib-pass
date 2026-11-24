import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { IbCkiConfirmationFooterComponent } from './ib-cki-confirmation-footer.component';
import { IbBiometricBoardingBoxUpgradeComponentDirective } from '../ib-biometric-boarding-box/component/ib-biometric-boarding-box.component';

const downgradedComponents = [
    IbCkiConfirmationFooterComponent
];

@NgModule({
    declarations: [
        IbCkiConfirmationFooterComponent,
        IbBiometricBoardingBoxUpgradeComponentDirective
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [],
    providers: []
})
export class IbCkiConfirmationFooterModule {
    static components = [...downgradedComponents];
}