import { Component } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import { PmtConstants } from '../../../../../../app/core/ib-pmt-constants';

@Component({
    selector: 'ib-biometric-boarding-link-app-mobile',
    templateUrl: './ib-biometric-boarding-link-app-mobile.component.html'
})

export class IbBiometricBoardingLinkAppMobileComponent {
    baseImagePath = PmtConstants.ROUTES.images;

    constructor () { }
}

downgradeToAJSComponent('ibBiometricBoardingLinkAppMobile', { 
    component: IbBiometricBoardingLinkAppMobileComponent, 
    inputs: []
}, 'ib-check-in-confirmation-module');