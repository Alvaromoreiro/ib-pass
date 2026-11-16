import { Component } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

export enum ConfirmationViewType {
    NEW = 'new',
    OLD = 'old',
}

@Component({
    selector: 'ib-mmb-confirmation-selector',
    template: `
        <ng-container [ngSwitch]="componentType">
            <ng-container *ngSwitchCase="ConfirmationViewType.NEW">
                <ib-mmb-confirmation-page></ib-mmb-confirmation-page>
            </ng-container>
            <ng-container *ngSwitchDefault>
                <ib-mmb-confirmation-component-legacy [asComponent]="true"></ib-mmb-confirmation-component-legacy>
            </ng-container>
        </ng-container>
    `
})
export class IbMmbConfirmationSelectorComponent {
    public ConfirmationViewType = ConfirmationViewType;
    public componentType: ConfirmationViewType = ConfirmationViewType.OLD;
}

downgradeToAJSComponent(
    'ibMmbConfirmationSelector',
    {
        component: IbMmbConfirmationSelectorComponent,
        inputs: [],
        outputs: []
    },
    'ib-mmb-confirmation-page-module',
    []
);
