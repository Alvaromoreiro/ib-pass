import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive( {
    selector: 'ib-ui-login-iframe-component'
} )
export class IbUiLoginIframeComponentDirective extends UpgradeComponent {
    @Input() onLogged;
    @Input() afterLogin;
    @Input() onError;
    constructor (elementRef: ElementRef, injector: Injector) {
        // We must pass the name of the directive as used by AngularJS to the super
        super('ibUiLoginIframe', elementRef, injector);
    }
}
