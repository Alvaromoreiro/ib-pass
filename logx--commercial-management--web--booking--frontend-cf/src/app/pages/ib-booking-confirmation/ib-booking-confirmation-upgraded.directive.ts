import { Directive, ElementRef, Injector, Component, OnInit } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

const selectorBase = 'ib-pmt-confirmation';
const dirSelector = selectorBase+'-legacy';
const compSelector = selectorBase+'-upgraded';
@Directive({selector: dirSelector})
export class IbBookingPmtConfirmationLegacyDirective extends UpgradeComponent {

    constructor (elementRef: ElementRef, injector: Injector) {
        // We must pass the name of the directive as used by AngularJS to the super

        super('ibPmtConfirmation', elementRef, injector);
    }
}


@Component({
    selector: compSelector,
    template: `<${dirSelector}/>`
})
export class IbBookingPmtConfirmationComponent implements OnInit {
    
    constructor (
        private NewMainHeaderFacade: IbBookingHeaderFacadeService
    ){}
    
    ngOnInit () {
        this.NewMainHeaderFacade.updateSteps('confirmation');
    }
    
}
