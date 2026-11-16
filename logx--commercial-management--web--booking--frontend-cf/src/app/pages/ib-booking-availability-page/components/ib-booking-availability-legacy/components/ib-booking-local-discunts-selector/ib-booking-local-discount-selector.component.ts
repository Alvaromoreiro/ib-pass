import { Directive, ElementRef, EventEmitter, Inject, Injector, Input, Output } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';
import { CommonsRootScope, AJSRootScope } from 'ib-web-commons/utils';


@Directive({selector: 'ib-booking-local-discount-selector-legacy'})
export class IbBookingLocalDiscountSelectorDirective extends UpgradeComponent {
    @Input() showTooltip: boolean = true;
    @Input() originCity: string = '';
    @Input() destinationCity: string = '';
    @Input() residentCodeSelected: string = '';
    @Input() familyCodeSelected: string = '';
    @Output() discountChange = new EventEmitter<AvailabilityModels.DomesticDiscountChangeEvent>();

    constructor (
        elementRef: ElementRef,
        injector: Injector,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope
    ) {
        // We must pass the name of the directive as used by AngularJS to the super
        super('ibBookingLocalDiscountSelector', elementRef, injector);
        this.setupCompatibilityListener();
    }

    private setupCompatibilityListener = () =>  {
        this.$rootScope.$on('discountChange', (event: any, data: AvailabilityModels.DomesticDiscountChangeEvent) => {
            this.discountChange.emit(data);
        });
    };

}
