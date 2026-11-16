
import { Directive, ElementRef, Inject, Injector, Input } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';
import { AJSRootScope } from 'ib-web-commons/utils';

@Directive({selector: 'ib-main-footer-legacy'})
export class IbMmbMainFooterDirective extends UpgradeComponent {
    //Legacy bindings
    @Input() footerModel: {phoneInfo : {prefix : string, phoneNumber: string, text: string }};
    @Input() isFullWidth: boolean;
    @Input() isFixed: boolean;
    constructor (elementRef: ElementRef, _injector: Injector, @Inject(AJSRootScope) private $rootScope: CommonsRootScope) {
        // We must pass the name of the directive as used by AngularJS to the super
        const scope = $rootScope.$new();
        const injector = Injector.create(
        {
            providers: [
                {
                    provide: '$scope',
                    useValue: scope
                }
            ],
            parent: _injector
        });
        super('ibMmbMainFooter', elementRef, injector);
    }
}
