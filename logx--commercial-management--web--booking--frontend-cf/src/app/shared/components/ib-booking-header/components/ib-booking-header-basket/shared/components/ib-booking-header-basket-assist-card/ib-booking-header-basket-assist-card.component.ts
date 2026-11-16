import { Component, Inject, Input } from '@angular/core';
import { type ShoppingBasketAssistCard } from '@src/app/core/models/ib-booking-availability/header-model';
import { IbCModalService } from 'ib-web-commons/ib-modal/';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbAssistCardBasketService as IbAncAssistCardBasketService } from 'ib-web-ancillaries';

@Component({
    selector: 'ib-booking-header-basket-assist-card',
    templateUrl: './ib-booking-header-basket-assist-card.component.html',
    styleUrls: ['./ib-booking-header-basket-assist-card.component.scss']
})
export class IbBookingHeaderBasketAssistCardComponent {
    @Input() public model: ShoppingBasketAssistCard;
    @Input() public basketFunctions;
    @Input() public deleteFlag: boolean;
    @Input() public loadingVoucher: boolean;

    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        private ibAncAssistCardBasketService: IbAncAssistCardBasketService,
        private CommonsModalService : IbCModalService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) { }

    public deleteAssistCard (): void {
        this.basketFunctions.isLoading();
        //this.DatalayerBasketService.removeAssistCardItemFromBasket(type);
        this.ibAncAssistCardBasketService.deleteAssistCardFromBasket().subscribe({
            next: () => {
                this.rootScope.$broadcast('basketUpdateCommonHeader');
                this.rootScope.$broadcast('setAssistCardModifyButton', false);
                //this.rootScope.$broadcast('deleteAssistCardAvios', type);
                this.basketFunctions.calculateAllBasket('/' + this.CommonsSessionStorageService.get('actualStepFlow'));
                this.basketFunctions.saveHeaderModel();
                this.basketFunctions.deleteAncillarie(true);
                this.basketFunctions.isNotLoading();
            },
            error: (error) => {
                this.basketFunctions.deleteAncillarie(false);
                this.basketFunctions.isNotLoading();
                this.showErrorModal();
                this.basketFunctions?.collapseHeader?.closeCollapse();
            }
        });
    }

    private showErrorModal (): void {
        const modalErrorObject = {
            title: 'MODAL_ERROR_TITLE',
            body: 'REST_SERVICE_ERROR_GENERAL'
        };
        this.CommonsModalService.showGenericError(null, modalErrorObject);
    }
}
