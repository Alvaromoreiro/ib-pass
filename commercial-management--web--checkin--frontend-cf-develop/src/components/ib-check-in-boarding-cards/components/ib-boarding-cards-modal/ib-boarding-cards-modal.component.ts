import { Component, OnInit } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import { IbBoardingCardsModalService } from './services/ib-boarding-cards-modal.service';

@Component({
    selector: 'ib-boarding-cards-modal',
    templateUrl: './ib-boarding-cards-modal.component.html',
    styleUrls: ['./ib-boarding-cards-modal.component.scss']
})
export class IbBoardingCardsModalComponent implements OnInit {
    public model: CkiBoardingCardModal.BoardingCardsModalModel;
    public segmentsMap: CkiBoardingCardModal.BoardingCardsModalMap[];

    constructor (
        private IbBoardingCardsModalService: IbBoardingCardsModalService
    ) {}

    ngOnInit (): void {
        this.segmentsMap = this.IbBoardingCardsModalService.mapSegmentsInformation(this.model.segments);
    }

    closeModal () {
        this.IbBoardingCardsModalService.closeGoogleWalletModal('dismiss');
    }
}

downgradeToAJSComponent(
    'ibBoardingCardsModal',
    {
        component: IbBoardingCardsModalComponent
    },
    'ib-boarding-cards-modal-module'
);

