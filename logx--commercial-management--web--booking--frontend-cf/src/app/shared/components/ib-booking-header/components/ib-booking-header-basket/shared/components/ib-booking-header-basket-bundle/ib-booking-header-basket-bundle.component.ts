import { Component, Inject, Input } from '@angular/core';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { DatalayerBasketService } from '../../services/ib-booking-header-basket-datalayer.service';
import { BookingHeaderConstants } from '@shared/components/ib-booking-header/ib-booking-header-constants';

@Component({
    selector: 'ib-booking-header-basket-bundle',
    templateUrl: './ib-booking-header-basket-bundle.component.html',
    styleUrls: ['./ib-booking-header-basket-bundle.component.scss']
})
export class IbBookingHeaderBasketBundleComponent {
    @Input() public model;
    @Input() public basketFunctions;
    @Input() public deleteFlag: boolean;
    @Input() public loadingVoucher: boolean;

    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private DatalayerBasketService: DatalayerBasketService
    ) { }
    /**
     * Delete bundle on service  and emit event to delete bundle on ancillaries page
     */
    public deleteBundle ( infoBundle ) {
        const items = infoBundle.info.items;
        const actualPage = '/' + this.CommonsSessionStorageService.get( 'actualStepFlow' );
        const passengerBaggagesTrips = this.CommonsSessionStorageService.get( 'passengerBaggagesTrips' );
        const deleteSegmentBundleSuccess = () => {
            this.DatalayerBasketService.deleteBundle( this.CommonsSessionStorageService.get( 'selectedBundle' ) );
            this.CommonsSessionStorageService.remove( 'selectedBundle' );
            this.CommonsSessionStorageService.remove( 'bundleItems' );
            this.model.hasBundle = false;
            this.model.info = null;
        };
        const updateBundleState = ( actualPage, infoBundle, passengerBaggagesTrips, items ) => {
            deleteSegmentBundleSuccess();
            this.rootScope.$broadcast( 'deleteBundles', infoBundle );
            this.rootScope.$broadcast( 'unlockItemsFromBundle' );
            this.rootScope.$broadcast( 'updateHeaderBaggages', passengerBaggagesTrips );
            this.basketFunctions.calculateAllBasket( actualPage );
            this.basketFunctions.deleteAncillarie( true );
            this.basketFunctions.saveHeaderModel();
            this.basketFunctions.isNotLoading();
            items.forEach( item => {
                switch ( item.type ) {
                        case 'FLEXIBILITY_ON_DEMAND':
                            this.rootScope.$broadcast( 'cleanFlexibilization' );
                            break;
                        case 'PRIORITY_BOARDING':
                            this.rootScope.$broadcast( 'cleanPriorityBoarding' );
                            break;
                        default:
                            break;
                }
            } );
        };

        if ( actualPage === BookingHeaderConstants.ANCILLARIES_PAGES_HASH.BOOKING ) {
            updateBundleState( actualPage, infoBundle, passengerBaggagesTrips, items );
        } else {
            this.basketFunctions.deleteAncillariesService.deleteBundleService().then( () => {
                updateBundleState( actualPage, infoBundle, passengerBaggagesTrips, items );
                this.rootScope.$broadcast( 'basketUpdateCommonHeader' );
            }, ( error ) => {
                this.basketFunctions.isNotLoading();
                this.basketFunctions.deleteAncillarie( false );
                this.basketFunctions.modalService.setErrorMessage( error.message );
                this.basketFunctions.modalService.setErrorCode( error.internalErrorCode );
                this.basketFunctions.modalService.isError( error );
                this.basketFunctions.collapseHeader.closeCollapse();
            });
        }
    }
}
