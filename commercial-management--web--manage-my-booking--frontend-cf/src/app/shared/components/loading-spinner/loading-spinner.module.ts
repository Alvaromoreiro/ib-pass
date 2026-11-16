import { NgModule } from "@angular/core";
import { LoadingSpinnerComponent } from "./loading-spinner.component";
import { CommonModule } from "@angular/common";
import { NgReactModule } from "@src/app/react/wrapper/ng-react.module";

const downgradedComponents = [
    LoadingSpinnerComponent
];

@NgModule({
    declarations: [
        ...downgradedComponents,
    ],
    imports: [
        CommonModule,
        NgReactModule
    ],
    exports: [],
})
export class LoadingSpinnerModule { 
    static components = [...downgradedComponents];
}