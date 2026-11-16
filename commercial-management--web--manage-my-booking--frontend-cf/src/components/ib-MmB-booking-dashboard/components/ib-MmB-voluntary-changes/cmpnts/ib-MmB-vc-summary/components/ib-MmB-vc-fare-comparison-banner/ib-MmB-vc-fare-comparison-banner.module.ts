import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IbMmbVcFareComparisonBannerComponent } from './ib-MmB-vc-fare-comparison-banner.component';
import { IbMmbVcFareComparisonModalComponent } from './components/ib-MmB-vc-fare-comparison-modal/ib-MmB-vc-fare-comparison-modal.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        TranslateModule,
        NgbModule
    ],
    declarations: [
        IbMmbVcFareComparisonBannerComponent,
        IbMmbVcFareComparisonModalComponent
    ],
    exports: [
        IbMmbVcFareComparisonBannerComponent,
        IbMmbVcFareComparisonModalComponent
    ]
})
export class IbMmbVcFareComparisonBannerModule {}
export { IbMmbVcFareComparisonBannerComponent } from './ib-MmB-vc-fare-comparison-banner.component';
