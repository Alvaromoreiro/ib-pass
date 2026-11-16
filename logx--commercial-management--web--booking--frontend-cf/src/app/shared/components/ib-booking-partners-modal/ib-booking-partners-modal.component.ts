import {IbCheckPartnersDiscountsService} from '@shared/services/ib-check-partners-discount/ib-check-partners-discount.service';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IbCDatalayerUtilsService } from 'ib-web-commons/ib-datalayer';
@Component({
    selector: 'ib-booking-select-partner-modal',
    templateUrl: './ib-booking-partners-modal.component.html',
    styleUrls: ['./ib-booking-partners-modal.component.scss']
})
export class ibSelectPartnerModalComponent {
    private eventCategory: string = 'Programa Partner';
    private eventName: string = 'Programa Partner Modal Event';
    @Input()
    public model: any = {
            idModal: 'ib-partners-selection-modal',
            title: 'PARTNERS_SELECTION_MODAL_TITLE_SELECTION',
            howToSelect: {
                title: 'PARTNERS_SELECTION_EASY',
                steps: [
                    'PARTNERS_SELECTION_HOW_TO_1',
                    'PARTNERS_SELECTION_HOW_TO_2',
                    'PARTNERS_SELECTION_HOW_TO_3'
                ]
            },
            partners: [],
            partnerSelected: '',
            dontAskAgain : false
        };
    constructor (
        private NgbActiveModal: NgbActiveModal,
        private IbCheckPartnersDiscountsService: IbCheckPartnersDiscountsService,
        private IbCDatalayerUtilsService: IbCDatalayerUtilsService
    ) {
        const userPreference: IbCheckPartnersDiscountModel.userPartnerPreference = this.IbCheckPartnersDiscountsService.getCurrentUserStoredPreference();
        this.model.partnerSelected = userPreference !== null? userPreference.selectedPartnerId : '';
        this.model.dontAskAgain = userPreference !== null ? userPreference.dontAskPartner : false;
        this.model.partners = this.IbCheckPartnersDiscountsService.getPartnersResponse() ??[];
    }
    changeDontAskAgain = () => {
        this.model.dontAskAgain = !this.model.dontAskAgain;
        this.IbCDatalayerUtilsService.sendInteractionEvent({eventCategory: this.eventCategory, eventAction: 'Click', eventLabel: 'Guardar', eventName:this.eventName});
    };

    changePartnerSelected = ( selected ) => {
        this.model.partnerSelected = selected;
        this.IbCDatalayerUtilsService.sendInteractionEvent({eventCategory: this.eventCategory, eventAction: 'Select', eventLabel: selected, eventName:this.eventName});
    };
    saveStoragePartner = ( value ) => {
        if (value === false) {
            this.IbCheckPartnersDiscountsService.setPartnersDiscountsApplicationFlag(false);
            this.model.dontAskAgain = false;
            this.IbCDatalayerUtilsService.sendInteractionEvent({eventCategory: this.eventCategory, eventAction: 'Submit', eventLabel: '', eventName:this.eventName});
        } else {
            this.IbCDatalayerUtilsService.sendInteractionEvent({eventCategory: this.eventCategory, eventAction: 'Submit', eventLabel: this.model.partnerSelected, eventName:this.eventName});
        }
        this.IbCheckPartnersDiscountsService.setSelectedPartnerDiscount( this.model.partnerSelected );
        this.IbCheckPartnersDiscountsService.setCurrentUserStoredPreference(this.model.dontAskAgain, value? this.model.partnerSelected: '');
        this.NgbActiveModal.close();

    };

}

