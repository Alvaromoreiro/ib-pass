import { Component, Inject, Input } from '@angular/core';
import { type ShoppingBasketPetc, type ShoppingBasketPetcSegment } from '@src/app/core/models/ib-booking-availability/header-model';
import { IbPetcBasketService as IbAncPetcBasketService, type PetSummaryBox } from 'ib-web-ancillaries';
import { IbCModalService } from 'ib-web-commons/ib-modal/';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { AncillariesStorageConstants } from '../../../../../../../../core/constants/ib-booking-storage-constants';
import { DatalayerBasketService } from '../../services/ib-booking-header-basket-datalayer.service';

@Component({
    selector: 'ib-booking-header-basket-petc',
    templateUrl: './ib-booking-header-basket-petc.component.html',
    styleUrls: ['./ib-booking-header-basket-petc.component.scss']
})
export class IbBookingHeaderBasketPetcComponent {
    @Input() public model: ShoppingBasketPetc;
    @Input() public basketFunctions;
    @Input() public deleteFlag: boolean;
    @Input() public loadingVoucher: boolean;

    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        private ibAncPetcBasketService: IbAncPetcBasketService,
        private CommonsModalService : IbCModalService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private DatalayerBasketService: DatalayerBasketService
    ) { }


    /**
     *  Delete pets on service and emit event to delete pets on ancillaries page
     * @param {Object} trip
     * 
     */
    public deletePet ( trip : ShoppingBasketPetcSegment ): void {

        this.basketFunctions.isLoading();
        this.DatalayerBasketService.removePetItemFromBasket(trip);
        this.ibAncPetcBasketService.deletePetFromBasket(trip).subscribe({
            next: () => {
                this.rootScope.$broadcast('basketUpdateCommonHeader');
                this.rootScope.$broadcast('setPetcModifyButton', (this.CommonsSessionStorageService.get(AncillariesStorageConstants.PET_SUMMARY) as PetSummaryBox[])?.length > 0);
                this.rootScope.$broadcast('deletePetcAvios', trip.sliceId);

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
