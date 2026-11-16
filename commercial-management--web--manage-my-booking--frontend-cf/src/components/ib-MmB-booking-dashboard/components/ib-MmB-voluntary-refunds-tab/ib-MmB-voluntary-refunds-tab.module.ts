import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ibMmbVoluntaryRefundsTabComponent } from './ib-MmB-voluntary-refunds-tab.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IbCModalModule } from 'ib-web-commons/ib-modal';
import { SharedModule } from '@src/app/shared/shared.module';
// angular.module('ib-MmB-voluntary-refunds-tab-module', []);

const downgradedComponents = [
    ibMmbVoluntaryRefundsTabComponent
];

@NgModule({
    imports:[
        BrowserModule,
        TranslateModule,
        IbCModalModule,
        SharedModule,
    ],
    declarations:[
        ...downgradedComponents,
    ],
    providers: [
        NgbModal
    ]
})

export class IbMmbVoluntaryRefundsTabModule { }
