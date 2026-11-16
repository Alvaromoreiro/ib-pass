// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
import { CommonsConstants } from 'ib-web-commons/constants';
import * as angular from 'angular';
@Component({
    selector: "ib-ui-banner-component",
    templateUrl: "./ib-ui-banner.component.html",
    styleUrls: ["./ib-ui-banner.component.scss"],
    })
export class IbUiBannerComponent implements OnInit {
    @Input() type;
    @Input() image: {
        url: string;
        title: string;
    };
    @Input() icon;
    @Input() titleTxt;
    @Input() subtitle;
    @Input() text;
    @Input() text2;
    @Input() city;
    @Input() since;
    @Input() price;
    @Input() currency;
    @Input() link;
    @Input() timeText;
    @Input() time;
    @Input() periodText;
    @Input() datesText;
    @Input() daterangeDeparture: string | number;
    @Input() daterangeDepartureTo: string | number;
    @Input() daterangeDepartureReturn: string | number;
    @Input() availability;
    @Input() number;
    @Input() textParam;
    @Input() modifier;
    @Input() feature1;
    @Input() feature2;
    @Input() feature3;
    @Input() feature4;
    @Input() isNext;
    @Input() offer;
    @Input() action: (...args: unknown[]) => unknown;
    @Input() modifierContent;

    selectDestination = (offer): void => {
        if (this.action) {
            this.action(offer, CommonsConstants.ORIGIN_COMPONENT.IB_UI_BANNER);
        }
    };
    returnBannerImage = (event, isCarousel: boolean) => {
        if (isCarousel) {
            this.image.url =
        window.location.origin +
        CommonsConstants.BANNERS_IMAGES.FLASH_DEFAULT_CAROUSEL_URL;
        } else {
            this.image.url =
        window.location.origin +
        CommonsConstants.BANNERS_IMAGES.FLASH_DEFAULT_BANNER_URL;
        }
    };
    returnDateRange = () => {
        if (
            this.daterangeDeparture &&
      this.daterangeDepartureTo &&
      this.daterangeDepartureReturn
        ) {
            this.daterangeDeparture = `${this.daterangeDeparture} - ${this.daterangeDepartureReturn}`;
        } else if (
            this.daterangeDeparture &&
      this.daterangeDepartureTo &&
      this.daterangeDeparture !== this.daterangeDepartureTo
        ) {
            this.daterangeDeparture = `${this.daterangeDeparture} - ${this.daterangeDepartureTo}`;
        }
    };
    ngOnInit (): void {
        this.returnDateRange();
    }
}
try {
    angular.module('ib-ui-banners-module').directive(
        'ibUiBannerComponent',
        downgradeComponent({
            component: IbUiBannerComponent,
            inputs: [
                'type',
                'image',
                'icon',
                'titleTxt',
                'subtitle',
                'text',
                'text2',
                'city',
                'since',
                'price',
                'currency',
                'link',
                'timeText',
                'time',
                'daterangeDeparture',
                'daterangeDepartureTo',
                'availability',
                'number',
                'textParam',
                'modifier',
                'feature1',
                'feature2',
                'feature3',
                'feature4',
                'isNext',
                'offer',
                'action',
                'modifierContent',
                'periodText',
                'datesText'
            ]
        }) as angular.IDirectiveFactory
    );
} catch {
    angular.module('ib-ui-banners-module', []).directive(
        'ibUiBannerComponent',
        downgradeComponent({
            component: IbUiBannerComponent,
            inputs: [
                'type',
                'image',
                'icon',
                'titleTxt',
                'subtitle',
                'text',
                'text2',
                'city',
                'since',
                'price',
                'currency',
                'link',
                'timeText',
                'time',
                'daterangeDeparture',
                'daterangeDepartureTo',
                'availability',
                'number',
                'textParam',
                'modifier',
                'feature1',
                'feature2',
                'feature3',
                'feature4',
                'isNext',
                'offer',
                'action',
                'modifierContent',
                'periodText',
                'datesText'
            ]
        }) as angular.IDirectiveFactory
    );
}
