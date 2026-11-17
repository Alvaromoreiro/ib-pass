import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LoadingOverlay, LoadingOverlayProps } from 'commercial-management--digital--web-components-design--library';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'ib-checkin-overlay',
    template: '<ng-react [component]="LoadingModal" [props]="props"></ng-react>'
})
export class IbCheckinOverlayComponent implements OnChanges {
    protected readonly LoadingModal = LoadingOverlay;
    public props?: LoadingOverlayProps;

    @Input() public title?: LoadingOverlayProps['title'];
    @Input() public subtitles?: LoadingOverlayProps['subtitles'];
    @Input() public textTransition?: LoadingOverlayProps['textTransition'];
    @Input() public isOpen?: LoadingOverlayProps['isOpen'] = false;

    constructor (private translateService: TranslateService) {}

    ngOnChanges (changes: SimpleChanges) {
        this.props = {
            title: this.title || this.translateService.instant('WAITING_LOADING_PAYMENTS_CARDS_TEXT'),
            subtitles: this.subtitles,
            textTransition: this.textTransition,
            isOpen: this.isOpen
        };
    }
}
