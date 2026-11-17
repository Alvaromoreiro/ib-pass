import { NgModule } from '@angular/core';
import { NgReactModule } from '@src/app/react/wrapper/ng-react.module';
import { IbModalSbyComponent } from './ib-modal-sby.component';
import { CommonModule } from '@angular/common';

const downgradedComponents = [
    IbModalSbyComponent
];

@NgModule({
    declarations: [
        IbModalSbyComponent
    ],
    imports: [
        CommonModule,
        NgReactModule
    ],
    exports: [
        IbModalSbyComponent
    ],
    providers: [
    ]
})
export class IbModalSBYModule {
    static components = [...downgradedComponents];
}