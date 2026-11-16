
import { Directive, ElementRef, Input, HostListener, Inject, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { IbBookingContentParserUtilsService } from '../services/ib-booking-content-parser/ib-booking-content-parser-utils.service';
import { AJSBookingModalService, BookingModalServiceType } from '../components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';


@Directive({
    selector: '[ibBookingLinkContentParser]'
})

export class IbBookingLinkContentParserDirective implements OnInit {
    @Input() contentInfo?: string;
    @Input() contentId?: string;
    
    constructor (
        private sessionStorageService: CommonsSessionStorageService,
        private contentParserUtils: IbBookingContentParserUtilsService,
        private element: ElementRef,
        @Inject( AJSBookingModalService ) private ModalService: BookingModalServiceType,      
        private viewportScroller: ViewportScroller
    ) { }
    private el = this.element.nativeElement;
    private attributes = this.element.nativeElement.attributes;

    ngOnInit () {
        this.handleLinks();
    }

    private handleLinks = () => {
        if(this.contentParserUtils.isExternalLink(this.attributes)) {
            this.handleExternal();
        } else if (this.contentParserUtils.isModalLink(this.attributes)) {
            this.handleModal();
        }
    };

    private handleExternal = () => {
        this.el.setAttribute('target', '_blank');
      
    };

    private handleModal = () => {
        this.el.setAttribute('href', 'javascript:void(0)');
    };

    @HostListener('click', ['$event']) onclick (event: MouseEvent) {
        if(!this.contentParserUtils.isExternalLink(this.attributes) && this.contentParserUtils.isInternalLink(this.attributes)) {
            event.preventDefault();
            let id = this.attributes.href.value.split('#')[1];
            this.viewportScroller.scrollToAnchor(id);
        } else if (this.contentParserUtils.isModalWithHref(this.attributes)) {
            let info = this.sessionStorageService.get(this.attributes.contentInfo.nodeValue) as any;
            let newInfo = info.modals;
            this.ModalService.showGenericModal(false, 'ib-generic-external-modal.html', { info: this.contentParserUtils.searchModalContent(newInfo, this.attributes.contentId.value) });
        }
    }
}
