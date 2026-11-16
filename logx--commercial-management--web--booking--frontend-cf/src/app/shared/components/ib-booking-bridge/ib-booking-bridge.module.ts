import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IbBookingBridgeComponent } from './ib-booking-bridge.component';

const downgradedComponents = [
    IbBookingBridgeComponent
];
@NgModule({
    declarations: [
        ...downgradedComponents
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ...downgradedComponents
    ]
})
export class IbBookingBridgeModule { }
export class IbBookingBridgeModuleModule{
    static components = [...downgradedComponents];
}
