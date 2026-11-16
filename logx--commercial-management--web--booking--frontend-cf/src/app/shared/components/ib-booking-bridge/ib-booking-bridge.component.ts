
import { Component, Inject, OnInit, OnDestroy} from '@angular/core';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-pmt-booking-bridge',
    template: ``
})
export class IbBookingBridgeComponent implements OnInit, OnDestroy {
    private realMethods: { [key: string]: any } = {};
    private methodsToOverride: string[] = ['updateDigitalDataWithQuadrigam', 'generateConfirmationDigitalDataObject'];
    constructor (
        @Inject(AJSDatalayerUtilsService) private DatalayerUtilsService: AJSDatalayerUtilsServiceType,
        private DigitalDataUtilsService: DigitalDataUtilsService
    ) {
    }
    
    ngOnInit (): void {
        this.methodsToOverride.forEach(method => {
            this.realMethods[method] = this.DatalayerUtilsService[method];
            this.DatalayerUtilsService[method] = this.DigitalDataUtilsService[method];
        });
    }

    ngOnDestroy (): void {
        this.methodsToOverride.forEach(method => {
            this.DatalayerUtilsService[method] = this.realMethods[method];
        });
    }

}

downgradeToAJSComponent('ibPmtBookingBridge', { component: IbBookingBridgeComponent }, 'ib-booking-bridge-module');
