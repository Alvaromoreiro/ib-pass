import { Component, Input, Inject } from '@angular/core';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingHeaderConstants } from '@shared/components/ib-booking-header/ib-booking-header-constants';

@Component({
    selector: 'ib-booking-header-basket-carbon-footprint',
    templateUrl: './ib-booking-header-basket-carbon-footprint.component.html',
    styleUrls: ['./ib-booking-header-basket-carbon-footprint.component.scss']
})
export class IbBookingHeaderBasketCarbonFootprintComponent {
    @Input() public model;
    @Input() public basketFunctions;
    @Input() public deleteFlag: boolean;
    @Input() public loadingVoucher: boolean;

    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) { }

    /**
     * Remove carbon footprint from basket.
     * If the user is in the ancillaries page emits event for uncheck
     * carbon footprint module
     */
    public removeCarbonFootprint () {
        const actualPage = '/' + this.CommonsSessionStorageService.get('actualStepFlow'), carbonFootprint = [{ type: 'CO2_FOOTPRINT' }];
        this.basketFunctions.isLoading();
        if ( actualPage === BookingHeaderConstants.ANCILLARIES_PAGES_HASH.BOOKING ) {
            this.deleteCarbonFootprintSuccess( actualPage );
            this.rootScope.$broadcast( 'deleteCarbonFootprintAncillary' );
        } else {
            this.basketFunctions.deleteAncillariesService.deleteAncillarie( carbonFootprint ).then( () => {
                this.deleteCarbonFootprintSuccess();
                this.rootScope.$broadcast( 'basketUpdateCommonHeader' );
                this.rootScope.$broadcast( 'cleanCarbonFootprintAncillary' );
            }, ( error ) => {
                this.basketFunctions.deleteAncillarie( false );
                this.basketFunctions.isNotLoading();
                this.basketFunctions.modalService.setErrorMessage( error.message );
                this.basketFunctions.modalService.setErrorCode( error.internalErrorCode );
                this.basketFunctions.modalService.isError( error );
                this.basketFunctions.collapseHeader.closeCollapse();
            });
        }
        this.rootScope.$broadcast( 'clearViewOnBasketUpdate', true );
    }

    private deleteCarbonFootprintSuccess ( actualPage:string = '' ) {
        this.model.info = null;
        this.model.hasCarbonFootprint = false;
        this.basketFunctions.calculateAllBasket( actualPage );
        this.basketFunctions.deleteAncillarie( true );
        this.basketFunctions.saveHeaderModel();
        this.basketFunctions.isNotLoading();
    }
}
