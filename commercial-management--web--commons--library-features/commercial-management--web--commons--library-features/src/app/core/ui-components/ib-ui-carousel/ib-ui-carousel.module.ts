import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbUiBannerModule } from '../ib-ui-banners/ib-ui-banner.module';
import { IbUiCarouselComponent } from './ib-ui-carousel.component';
import { NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        IbUiCarouselComponent
    ],
    exports: [
        IbUiCarouselComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        NgbModule,
        IbUiBannerModule,
        NgbCarouselModule
    ]
})
export class IbUiCarouselModule {}
export { IbUiCarouselComponent } from "./ib-ui-carousel.component";
