import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonTranslationKeys, OverlayStatus, StatusOverlay, StatusOverlayProps } from 'commercial-management--digital--web-components-design--library';

@Component({
    selector: 'ib-overlay',
    templateUrl: './ib-overlay.component.html',
    styleUrls: ['./ib-overlay.component.scss']
})
export class IbOverlayComponent implements OnChanges {
    @Input() isOpen = true;
    @Input() status: OverlayStatus;
    @Input() messageKey: CommonTranslationKeys;

    protected readonly overlay = StatusOverlay;
    overlayProps: StatusOverlayProps;

    constructor () {
        this.updateOverlayProps();
    }

    ngOnChanges (changes: SimpleChanges): void {
        this.updateOverlayProps();
    }

    private updateOverlayProps (): void {
        this.overlayProps = {
            status: this.status,
            messageKey: this.messageKey,
            isOpen: this.isOpen
        };
        const element = document.getElementById('overlay');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
}
