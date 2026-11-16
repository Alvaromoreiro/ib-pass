import { Component, Input, Inject } from '@angular/core';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-booking-header-basket-transfers-globick',
    templateUrl: './ib-booking-header-basket-transfers-globick.component.html',
    styleUrls: ['./ib-booking-header-basket-transfers-globick.component.scss']
})
export class IbBookingHeaderBasketTransfersGlobickComponent {
    @Input() model: any;
    @Input() basketFunctions: any;
    @Input() deleteFlag: any;
    @Input() loadingVoucher: any;

    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        @Inject( AJSDatalayerUtilsService) private DatalayerUtilsService: AJSDatalayerUtilsServiceType

    ) {}
    /**
     * Remove transfers globick from basket.
     */
    removeTransfersGlobick () {
        setTimeout(() => {
            this.rootScope.$broadcast('deleteGlobickTransfers');
            const transferGlobick = this.CommonsSessionStorageService.get('removeGlobickTransfers');
            this.basketFunctions.isLoading();
            this.basketFunctions.deleteAncillariesService.deleteAncillarie(transferGlobick).then(() => {
                this.deleteTransfersGlobickSucess();
                this.rootScope.$broadcast('basketUpdateCommonHeader');
            }, ( error ) => {
                this.basketFunctions.deleteAncillarie( false );
                this.basketFunctions.isNotLoading();
                this.basketFunctions.modalService.setErrorMessage(error.message);
                this.basketFunctions.modalService.setErrorCode(error.internalErrorCode);
                this.basketFunctions.modalService.isError(error);
                this.basketFunctions.collapseHeader.closeCollapse();
            });
            this.rootScope.$broadcast('clearViewOnBasketUpdate', true);
            this.CommonsSessionStorageService.remove('removeGlobickTransfers');
        });
    }

    deleteTransfersGlobickSucess ( actualPage? ) {
        this.model.info = null;
        this.model.hasTransfersGlobick = false;
        this.basketFunctions.calculateAllBasket(actualPage);
        this.basketFunctions.deleteAncillarie( true );
        this.basketFunctions.saveHeaderModel();
        this.basketFunctions.isNotLoading();
        this.DatalayerUtilsService.setAncillariesDatalayer();


    }
}
