import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { IbMmbConfirmationComponent } from "./ib-mmb-confirmation.component";
import { AJSCurrencyServiceProvider } from "ib-web-commons/utils";
import { AJSMmBDigitalDataServiceProvider } from "../services/ib-MmB-datalayer/services/ib-mmb-digital-data-bridge.service";
import { SharedModule } from "@src/app/shared/shared.module";
import { IbCPipeModule } from "ib-web-commons/pipes";
import { MmbConfirmationTransformer } from "./services/ib-mmb-confirmation-transformer";
import { DatalayerEcommerceService } from "../services/ib-MmB-datalayer/services/ib-mmb-datalayer-ecommerce.service";
import { MarketingPermissionService } from "./services/ib-marketing-permission-service";
import { AJSCommonsGenericProxyProvider, AJSCommonsNewHttpUtilsErrorProvider } from "../services/http/commons-proxy-bridge.service";
import { IbMmBSummaryGlobickTransfersComponent } from "./components/ib-MmB-summary-globick-transfers/ib-MmB-summary-globick-transfers.component";
import { IbMmBSummaryGlobickActivitiesComponent } from "./components/ib-MmB-summary-globick-activities/ib-MmB-summary-globick-activities.component";
import { IbMmBSummaryInsuranceAllianzFusionComponent } from "./components/ib-MmB-summary-insurance-allianz-fusion/ib-MmB-summary-insurance-allianz-fusion.component";
import { IbMmbConfirmationLegacyDirective } from "./legacy/ib-pmt-confirmation-legacy.component";
import { IbMmbConfirmationSelectorComponent } from "./ib-Mmb-confirmation-selector.component";

const downgradedComponents = [
    IbMmbConfirmationSelectorComponent
];

@NgModule({
    declarations: [
    IbMmbConfirmationComponent,
    IbMmbConfirmationLegacyDirective,
    IbMmbConfirmationSelectorComponent,
        IbMmBSummaryGlobickTransfersComponent,
        IbMmBSummaryGlobickActivitiesComponent,
        IbMmBSummaryInsuranceAllianzFusionComponent
	],
	imports: [
		CommonModule,
		TranslateModule,
        SharedModule,
        IbCPipeModule
    ],
	providers: [
        AJSCurrencyServiceProvider,
        AJSMmBDigitalDataServiceProvider,
        MmbConfirmationTransformer,
        DatalayerEcommerceService,
        MarketingPermissionService,
        AJSCommonsGenericProxyProvider,
        AJSCommonsNewHttpUtilsErrorProvider
	],
    exports: [
        IbMmbConfirmationSelectorComponent,
        IbMmBSummaryGlobickTransfersComponent,
        IbMmBSummaryGlobickActivitiesComponent,
        IbMmBSummaryInsuranceAllianzFusionComponent
    ]
})

export class IbMmbConfirmationModule {
	static components = [...downgradedComponents];
}
