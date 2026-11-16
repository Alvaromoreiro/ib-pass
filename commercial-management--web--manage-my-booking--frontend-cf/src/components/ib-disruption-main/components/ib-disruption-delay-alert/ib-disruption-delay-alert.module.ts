import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { IbDisruptionDelayAlertComponent } from './ib-disruption-delay-alert.component';

const downgradedComponents = [
    IbDisruptionDelayAlertComponent
];

@NgModule({
    imports: [
        BrowserModule,
        TranslateModule
    ],
    declarations: [
        ...downgradedComponents
    ]
})
export class IbDisruptionDelayAlertModule { }
