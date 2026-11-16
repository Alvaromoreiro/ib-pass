import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BookingRedirectionService } from '@shared/services/ib-utils/ib-booking-redirection.service';
import { downgradeToAJSComponent, AJSRootScope, CommonsRootScope} from 'ib-web-commons/utils';

@Component({
    selector: 'ib-partners-accordion',
    templateUrl: './ib-partners-accordion.component.html',
    styleUrls: ['./ib-partners-accordion.component.scss']
})
export class IbPartnersAccordionComponent implements OnInit {


    public model;
    public partnerConditions;
    public opened = false;
 

    constructor (@Inject(AJSRootScope) private rootScope: CommonsRootScope,
        private BookingRedirectionService: BookingRedirectionService) { }

    ngOnInit (): void {
        this.model = {
            title: 'SAN_IB_PLUS_TITLE',
            subtitle:'SAN_IB_PLUS_SUBTITLE',
            openAccordion: 'IBPURC_BANNER_MORE_INFO',
            closeAccordion: 'SAN_IB_PLUS_CLOSE',
            accordionTitleDeployed: 'SAN_IB_PLUS_TITLE_DEPLOYED',
            listTitle: 'PARTNERS_SELECTION_EASY',
            itemListOne: 'SAN_IB_PLUS_ITEM_ONE',
            itemListTwo: 'SAN_IB_PLUS_ITEM_TWO',
            itemListThree: 'SAN_IB_PLUS_ITEM_THREE',
            link: 'SAN_IB_PLUS_LINK',
            button: 'ANCILLARIES_BOB_MODAL_SECTION_SUMMARY_INFO_BUTTON',
            imageCardSrc: '/iberia-web-content/imagenes/partners/partners-card-san-module.png'
        };
        this.partnerConditions = '/es/'+ this.rootScope.appLang +'/iberiaplus/santander/';
    }

    redirectToConditions = ():void => {
        this.BookingRedirectionService.newNavigation(this.partnerConditions, '_blank');
    };

    collapseAccordion = ():void =>{
        this.opened = false;
    };
    toggleOpened = () => {
        this.opened = !this.opened;
    };
}
downgradeToAJSComponent('ibPartnersAccordion', { component: IbPartnersAccordionComponent, inputs: [] }, 'ib-booking-partners-module');