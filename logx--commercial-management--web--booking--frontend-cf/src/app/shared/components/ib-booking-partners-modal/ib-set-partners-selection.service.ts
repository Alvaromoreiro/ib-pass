import { IbCheckPartnersDiscountsService } from '@shared/services/ib-check-partners-discount/ib-check-partners-discount.service';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { ibSelectPartnerModalComponent } from './ib-booking-partners-modal.component';
import { Injectable } from '@angular/core';
import { downgradeToAJSService } from 'ib-web-commons/utils';
@Injectable({providedIn: 'root'})
export class IbSetPartnersSelectionUtilsService {
    constructor (
        private IbCheckPartnersDiscountsService: IbCheckPartnersDiscountsService,
        private IbCModalService: IbCModalService
    ) { }

    private setPartnersModal = (): Promise<void> => {
        const partnersList = this.IbCheckPartnersDiscountsService.getPartnersResponse();
        return new Promise((resolve) => {
            if ( partnersList?.length > 1 && this.IbCheckPartnersDiscountsService.checkPartnersDiscount() ) {
                this.IbCModalService.showGenericComponentModal(ibSelectPartnerModalComponent, {}).result.then(() => {
                    resolve();
                }, () => {
                    resolve();
                } );
            } else {
                resolve();
            }
        });
    };

    /**
     * @description Check if partner  discount is available lauch partner selection modal and return selected partner
     * @returns null or string that belongs to selected partner
     */
    public checkPartnerDiscountSelection = async (): Promise<partnerDiscountInfoBKI> => {

        const currentlySelectedPartner = this.IbCheckPartnersDiscountsService.getSelectedPartner();
        const partnerResponse = this.IbCheckPartnersDiscountsService.getPartnersResponse()?? [];
        const continueWithoutCheck = currentlySelectedPartner !== null || partnerResponse.length === 0;
        if (continueWithoutCheck) { return currentlySelectedPartner; }
        const storedPartnerPreference = this.checkStoredPartnerPreference();
        if (storedPartnerPreference) {
            return this.IbCheckPartnersDiscountsService.setSelectedPartnerDiscount(storedPartnerPreference);
        }
        return await this.askPartnerSelection();
    };
    
    
    /**
         * 
         * @returns partnerCode string in case of having a permantent selection and empty string otherwise
         */
    private checkStoredPartnerPreference = (): string => {
        const userPartnerInfo = this.IbCheckPartnersDiscountsService.getCurrentUserStoredPreference();
        let userPartnerCode = userPartnerInfo?.selectedPartnerId ?? '';
        const dontAskPartners = userPartnerInfo?.dontAskPartner ?? false;
        const continueWithoutAsking = dontAskPartners === true && userPartnerCode?.length > 0;
    
        return continueWithoutAsking ? userPartnerCode: ''  ;
        
       
    };
    
    private askPartnerSelection = (): Promise<partnerDiscountInfoBKI> => {
        // Using promise to convert callbak into promise
        return this.setPartnersModal().then(()=> this.IbCheckPartnersDiscountsService.getSelectedPartner());
    };
    
}
downgradeToAJSService('IbSetPartnersSelectionUtilsService', IbSetPartnersSelectionUtilsService, 'ib-set-partners-selection-module');