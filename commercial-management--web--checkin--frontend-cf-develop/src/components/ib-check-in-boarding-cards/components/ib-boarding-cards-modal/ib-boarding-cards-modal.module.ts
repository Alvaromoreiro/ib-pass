import { NgModule } from '@angular/core';
import { NgReactModule } from '@src/app/react/wrapper/ng-react.module';
import { CommonModule } from '@angular/common';
import { IbBoardingCardsModalComponent } from './ib-boarding-cards-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { IbPassengerRowComponent } from './components/ib-passenger-row/ib-passenger-row.component';
import { IbSegmentSectionComponent } from './components/ib-segment-section/ib-segment-section.component';
import { IbButtonModule } from '@src/app/shared/components/ib-button/ib-button.module';

const downgradedComponents = [
    IbBoardingCardsModalComponent
];

@NgModule({
    declarations: [
        IbBoardingCardsModalComponent,
        IbPassengerRowComponent,
        IbSegmentSectionComponent
    ],
    imports: [
        CommonModule,
        NgReactModule,
        TranslateModule,
        IbButtonModule
    ],
    exports: [
        IbBoardingCardsModalComponent
    ],
    providers: []
})
export class IbBoardingCardsModalModule {
    static components = [...downgradedComponents];
}
