import { Component, EventEmitter, Output } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-duplicate-buttons',
    templateUrl: './ib-duplicate-buttons.component.html',
    styleUrls: ['./ib-duplicate-buttons.component.scss']
})
export class IbDuplicateButtonsComponent {
    @Output() callback = new EventEmitter<boolean>();

    goTo (quadrigam: CkiSeatSummary.GoToPageType) {
        const printSelected = quadrigam === 'ibecbp';

        this.callback.emit(printSelected);
    }
}

downgradeToAJSComponent(
    'ibDuplicateButtons',
    {
        component: IbDuplicateButtonsComponent
    },
    'ib-checkin-duplicate-buttons'
);
