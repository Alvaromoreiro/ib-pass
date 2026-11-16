import { NgModule } from "@angular/core";
import { IbMmbPaymentComponent } from "./components/ib-Mmb-payment-component/ib-MmB-payment.component";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { NgReactModule } from "@src/app/react/wrapper/ng-react.module";
import { IbMmbPaymentPageComponent } from "./ib-Mmb-payment-page.component";
import { IbPmtComponentLegacyDirective } from "./components/ib-Mmb-payments-legacy/ib-pmt-legacy.component";
import { AJSCommonsHttpUtilServiceProvider } from "../services/Utils/ib-Mmb-http-utils.service";
import { AJSCommonsGenericProxyProvider } from "../services/http/commons-proxy-bridge.service";
import { IbMmbVoucherComponent } from "./components/ib-Mmb-payment-component/components/ib-mmb-voucher/ib-mmb-voucher.component";
import { IbMmbSummaryComponent } from "./components/ib-Mmb-payment-component/components/ib-mmb-summary/ib-mmb-summary.component";
import { SharedModule } from "./../../app/shared/shared.module";
import { IbPmtInjectableComponentLegacyDirective } from './components/ib-Mmb-payments-legacy/ib-pmt-injectable-legacy.component';
import { IssueOrderInfoTransformerService } from './components/ib-Mmb-payment-component/services/ib-Mmb-issue-order-info-transformer.service';

const downgradedComponents = [
    IbMmbPaymentPageComponent
];

@NgModule({
    declarations: [
		...downgradedComponents,
		IbPmtComponentLegacyDirective,
		IbPmtInjectableComponentLegacyDirective,
		IbMmbPaymentComponent,
        IbMmbVoucherComponent,
		IbMmbSummaryComponent
	],
	imports: [
		CommonModule,
		TranslateModule,
        NgReactModule,
        SharedModule
	],
	providers: [
		AJSCommonsHttpUtilServiceProvider,
		AJSCommonsGenericProxyProvider,
		IssueOrderInfoTransformerService
	],
    exports: []
})

export class IbMmbPaymentModule {
	static components = [...downgradedComponents];
}
