import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { AJSRootScope, CommonsRootScope, downgradeToAJSComponent } from 'ib-web-commons/utils';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';

@Component({
    selector: 'ib-download',
    templateUrl: './ib-download.component.html',
    styleUrls: ['./ib-download.component.scss']
})

export class IbDownloadComponent implements OnInit{

    @Input() model;
    @Input() channelsList;
    @Input() device;
    @Input() onlyPdf;
    @Output() askForCardsEvent = new EventEmitter<any>();

    appleWalletImg;
    googleWalletImg;
    showAppleButton = false;


    constructor (@Inject(AJSRootScope) protected rootScope: CommonsRootScope) {

    }

    ngOnInit (): void {
        this.setImagesRoutes();
        this.showAppleButton = (this.device.raw.os.mac || this.device.raw.os.ios);
    }

    setImagesRoutes () {
        const lang = this.rootScope.appLang;
        this.appleWalletImg = `${CheckinAppConstants.imagesRoute}/apple-wallet/${lang}_apple_wallet.svg`;
        this.googleWalletImg = `${CheckinAppConstants.imagesRoute}/google-wallet/${lang}_google_wallet.svg`;
    }

    downloadTickets (format: string): void {
        this.channelsList[0].isSelected = false;
        this.channelsList[1].isSelected = true;
        this.model.boardingInfo.downloadFormatSelected = [{type: format, isSelected: true}];
        this.askForCardsEvent.emit(this.model);
    }


}
IbDownloadComponent.$inject = ['$rootScope'];
downgradeToAJSComponent('ibDownload', { component: IbDownloadComponent }, 'ib-download-module');

