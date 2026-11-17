import { NgModule } from '@angular/core';
import { NgReactModule } from '@src/app/react/wrapper/ng-react.module';
import { CommonModule } from '@angular/common';
import { IbButtonComponent } from './ib-button.component';

const downgradedComponents = [
    IbButtonComponent
];

@NgModule({
    declarations: [
        IbButtonComponent
    ],
    imports: [
        CommonModule,
        NgReactModule
    ],
    exports: [
        IbButtonComponent
    ],
    providers: [
    ]
})
export class IbButtonModule {
    static components = [...downgradedComponents];
}