// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import * as angular from 'angular';

@Component({
    selector: "ib-ui-carousel-component",
    templateUrl: "./ib-ui-carousel.component.html",
    styleUrls: ["./ib-ui-carousel.component.scss"],
    providers: [NgbCarouselConfig],
    })
export class IbUiCarouselComponent implements OnInit {
    @Input() banners;
    @Input() action;
    settings;
    constructor (config: NgbCarouselConfig) {
        config.showNavigationArrows = true;
        config.showNavigationIndicators = false;
    }

    ngOnInit (): void {
        this.settings = {
            autoplaySpeed: 10000,
            showNavigationArrows: true,
            showNavigationIndicators: false
        };
    }
}

try {
    angular.module('ib-ui-carousel-module').directive(
        'ibUiCarouselComponent',
        downgradeComponent({
            component: IbUiCarouselComponent,
            inputs: ['banners', 'action']
        }) as angular.IDirectiveFactory
    );
} catch {
    angular.module('ib-ui-carousel-module', []).directive(
        'ibUiCarouselComponent',
        downgradeComponent({
            component: IbUiCarouselComponent,
            inputs: ['banners', 'action']
        }) as angular.IDirectiveFactory
    );
}
