import { Component, Inject, OnInit } from '@angular/core';
import { CommonsSessionStorageService, downgradeToAJSComponent, CommonsBrowserStorageService } from 'ib-web-commons/utils';
import { IbMmbPaymentsPageService } from './services/ib-Mmb-payments-page.service';
import { PaymentViewType } from './enums/ib-Mmb-payments-enum';
import { AJSMmbModalService, MmbModalServiceType } from '@src/components/ib-reusable-components/ib-MmB-modal/services/upgraded/ib-Mmb-modal-service-bridge.service';
import { MmBAppConstants } from '@src/ib-MmB-constants';
@Component({
    selector: 'ib-mmb-payment-page',
    templateUrl: 'ib-Mmb-payment-page.component.html',
    providers: [
        IbMmbPaymentsPageService
    ]
})
export class IbMmbPaymentPageComponent implements OnInit {
    //Asign EMPTY to no render any component
    public readonly PaymentViewType = PaymentViewType;
    public componentType: string = PaymentViewType.EMPTY;
    public flowApp = this.CommonsSessionStorageService.get<string>('flowApp') || 'MMB';
    private readonly envCopy = (window as any).env || {};
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private CommonsBrowserStorageService: CommonsBrowserStorageService,
        private IbMmbPaymentsPageService : IbMmbPaymentsPageService,
        @Inject(AJSMmbModalService) private MmbModalService: MmbModalServiceType
    ){}


    async ngOnInit () {
        const forcePaymentType =  this.CommonsBrowserStorageService.get<string>('ib-MmB-app.forcePaymentType');

         // TEST: HIDE TO PRO
        if (forcePaymentType === 'CHECK') {
            this.componentType = await this.IbMmbPaymentsPageService.checkPaymentsViewType(this.flowApp);
        } else if (forcePaymentType === 'NEW') {
            this.componentType = PaymentViewType.NEW;
        } else {
            this.componentType = this.flowApp === MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE ? PaymentViewType.OLDVC : PaymentViewType.OLD;
        }

        this.CommonsSessionStorageService.set('actualStepFlow', 'ohinfo');

        if (this.flowApp !== MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE) {
            this.CommonsSessionStorageService.set('actualStepFlow', 'ohinfo');
        } else {
            if (!this.flagEnvMmbvc()) this.forceOld();
        }

        //  // HIDE TO PREE
        // this.componentType = await this.IbMmbPaymentsPageService.checkPaymentsViewType();
    }

    forceOld = (): void => {
        const oldType = this.flowApp === MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE ? PaymentViewType.OLDVC : PaymentViewType.OLD;
        this.CommonsSessionStorageService.set(MmBAppConstants.STORAGE_KEYS.PAYMENTS_VIEWTYPE, oldType);
        this.componentType = oldType;
    }

    flagEnvMmbvc = (): boolean => {
        return this.envCopy.toggle?.decoupleCVV;
    }


}
downgradeToAJSComponent(
    'ibMmbPaymentPage',
    {
        component: IbMmbPaymentPageComponent,
        inputs: [],
        outputs: []
    },
    'ib-mmb-payment-page-module',
    []
);
