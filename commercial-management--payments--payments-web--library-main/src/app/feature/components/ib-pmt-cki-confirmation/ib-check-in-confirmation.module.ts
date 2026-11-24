import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbBiometricBoardingSummaryComponent } from './cmpnts/ib-biometric-boarding-summary/ib-biometric-boarding-summary.component';
import { IbBiometricBoardingLinkAppMobileComponent } from './cmpnts/ib-biometric-boarding-link-app-mobile/ib-biometric-boarding-link-app-mobile.component';
import { IbCPipeModule } from 'ib-web-commons/pipes';
import './cmpnts/ib-seatboost-banner/ib-seatboost-banner.downgrade';

@NgModule({
    declarations: [
        IbBiometricBoardingSummaryComponent,
        IbBiometricBoardingLinkAppMobileComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IbCPipeModule
    ],
    providers: []
})

export class IbCkiConfirmationModule { }

export { IbBiometricBoardingSummaryComponent } from './cmpnts/ib-biometric-boarding-summary/ib-biometric-boarding-summary.component';
export { IbBiometricBoardingLinkAppMobileComponent } from './cmpnts/ib-biometric-boarding-link-app-mobile/ib-biometric-boarding-link-app-mobile.component';
