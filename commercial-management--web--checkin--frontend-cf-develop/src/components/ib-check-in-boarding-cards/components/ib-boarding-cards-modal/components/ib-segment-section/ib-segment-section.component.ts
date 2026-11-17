import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { IbBoardingCardsModalService } from '../../services/ib-boarding-cards-modal.service';

@Component({
    selector: 'ib-segment-section',
    templateUrl: './ib-segment-section.component.html',
    styleUrls: ['./ib-segment-section.component.scss']
})
export class IbSegmentSectionComponent implements OnInit {
    @Input() segmentInfo: CkiBoardingCardModal.BoardingCardsModalMap;

    public arriveTitle: string = '';
    public departureTitle: string = '';
    public segmentDate: string = '';

    constructor (private IbBoardingCardsModalService: IbBoardingCardsModalService) {}

    ngOnInit (): void {
        this.setSegmentTitle();
        this.segmentDate = dayjs(this.segmentInfo.departure.date ?? dayjs()).format('DD/MM/YYYY - HH:mm');
    }

    setSegmentTitle () {
        const { arrival, departure } = this.segmentInfo;

        this.departureTitle = `${departure.airport.description} (${departure.airport.code})`;
        this.arriveTitle = `${arrival.airport.description} (${arrival.airport.code})`;
    }

    downloadGW ({ passengerId }: CkiBoardingCardModal.DownloadGWEvent) {
        const result: CkiBoardingCardModal.PrintResultModel = { passengerId, segmentId: this.segmentInfo.id };

        this.IbBoardingCardsModalService.closeGoogleWalletModal('close', result);
    }
}

