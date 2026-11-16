import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { NgReactModule } from "@src/app/react/wrapper/ng-react.module";
import { IbMmbTripListComponent } from "./ib-Mmb-trip-list.component";
import { SharedModule } from "../../app/shared/shared.module";
import { AJSCommonsCheckLoginWCSServiceProvider } from "../services/upgraded/ib-commons-check-login-wcs-bridge.service";

const downgradedComponents = [
    IbMmbTripListComponent
];

@NgModule({
    declarations: [
		...downgradedComponents,
	],
	imports: [
		CommonModule,
		TranslateModule,
        NgReactModule,
        SharedModule
	],
	providers: [
        AJSCommonsCheckLoginWCSServiceProvider
	],
    exports: [],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class IbMmbTripListModule {
	static components = [...downgradedComponents];
}
