import { Component, Input, OnInit } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import { IbCLinkPipe } from 'ib-web-commons/pipes';

@Component({
    selector: 'ib-button',
    templateUrl: './ib-alert-banner.component.html',
    styleUrls: ['./ib-alert-banner.component.scss']
})
export class IbAlertBannerComponent implements OnInit {
    @Input() variant?: 'info' | 'danger' | 'success' | 'warning' = 'info';
    @Input() linkLiteral?: string;
    @Input() linkText?: string = 'ALERT_BANNER_MORE_INFO';
    @Input() linkAccessibleText?: string;
    @Input() heading: string;
    @Input() body: string;
    @Input() variantStyle?: 'filled' | 'flat' = 'filled';
    @Input() className?: string = '';
    @Input() icon?: string;

    link?: string;

    private icons: { [key: string]: string } = {
        info: 'icon-informacion',
        danger: 'icon-mdi_alert',
        success: 'icon-validar',
        warning: 'icon-alertas'
    };

    constructor (private linkPipe: IbCLinkPipe) { }

    ngOnInit () {
        if (this.linkLiteral) {
            this.link = this.linkPipe.transform(this.linkLiteral);
        }
    }

    getIconName () {
        if (this.icon) return this.icon;

        return this.icons[this.variant || 'info'];
    }
}

downgradeToAJSComponent(
    'ibAlertBanner',
    {
        component: IbAlertBannerComponent
    },
    'ib-shared-components-module'
);