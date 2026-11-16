import { Inject, Injectable } from "@angular/core";
import { AJSMmBDatalayerUtilsService, AJSMmBDatalayerUtilsServiceType } from "@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service-bridge.service";

@Injectable({
    providedIn: 'root'
})
export class IbMmbVoluntaryRefundsService {
    URL_SERVICE: any = 'refund-confirmation';

    constructor(
        @Inject(AJSMmBDatalayerUtilsService) private MmBDatalayerUtilsService: AJSMmBDatalayerUtilsServiceType
    ) {}

    updateWorkflowDatalayerInfo = (step: string, quadrigam: string): void => {
        this.MmBDatalayerUtilsService.updateDatalayerInfo(window['digital_data'].Process, step, quadrigam);
    }
}
