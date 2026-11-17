import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IbBoardingCardsLoadingComponent } from './ib-boarding-cards-loading.component';

@NgModule({
    declarations: [
        IbBoardingCardsLoadingComponent
    ],
    imports: [
        TranslateModule,
        CommonModule
    ]

})
export class IbBoardingCardsLoadingModule {
}
