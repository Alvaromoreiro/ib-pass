import { Component, Input, Output, EventEmitter } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-button',
    templateUrl: './ib-button.component.html',
    styleUrls: ['./ib-button.component.scss']
})
export class IbButtonComponent {
    @Input() variant?: 'primary' | 'secondary' = 'primary';
    @Input() icon?: string;
    @Input() size?: 'small' | 'big' = 'small';
    @Input() type?: 'button' | 'submit' | 'reset' = 'button';
    @Output() clicked = new EventEmitter<void>();

    handleClick () {
        this.clicked.emit();
    }
}

downgradeToAJSComponent(
    'ibButton',
    {
        component: IbButtonComponent
    },
    'ib-shared-components-module'
);