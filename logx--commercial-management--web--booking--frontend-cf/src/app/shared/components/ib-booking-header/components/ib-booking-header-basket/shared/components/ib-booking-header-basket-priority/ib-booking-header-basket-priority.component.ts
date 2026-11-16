import { Component, Inject, Input } from '@angular/core';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { DatalayerBasketService } from '../../services/ib-booking-header-basket-datalayer.service';

@Component({
    selector: 'ib-booking-header-basket-priority',
    templateUrl: './ib-booking-header-basket-priority.component.html',
    styleUrls: ['./ib-booking-header-basket-priority.component.scss']
})
export class IbBookingHeaderBasketPriorityComponent {
    @Input() public model;
    @Input() public basketFunctions;
    @Input() public deleteFlag: boolean;
    @Input() public loadingVoucher: boolean;

    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private DatalayerBasketService: DatalayerBasketService
    ) { }

    public deletePriority ( deleteInfo ) {
        let deletePriorityInfo,
            deletePriority = [];
        this.basketFunctions.isLoading();
        deletePriorityInfo = this.createDeleteInfo( deleteInfo );
        deletePriority.push( deletePriorityInfo );
        this.DatalayerBasketService.deletePriorityBoarding( deleteInfo );
        this.CommonsSessionStorageService.set( 'deletePriority', deletePriority );
        this.basketFunctions.deleteAncillariesService.deleteAncillarie( deletePriority ).then( () => {
            this.deletePrioritySuccess();
            this.rootScope.$broadcast( 'updatedPriorityInfoModel', deletePriority );
            this.CommonsSessionStorageService.remove( 'deletePriority' );
            this.rootScope.$broadcast( 'basketUpdateCommonHeader' );
            this.basketFunctions.calculateAllBasket( '/' + this.CommonsSessionStorageService.get( 'actualStepFlow' ) );
            this.basketFunctions.deleteAncillarie( true );
            this.basketFunctions.saveHeaderModel();
            this.basketFunctions.isNotLoading();
            //updateAncillariesDataLayer();
        }, ( error ) => {
            this.basketFunctions.deleteAncillarie( false );
            this.basketFunctions.isNotLoading();
            this.basketFunctions.modalService.setErrorMessage( error.message );
            this.basketFunctions.modalService.setErrorCode( error.internalErrorCode );
            this.basketFunctions.modalService.isError( error );
            this.basketFunctions.collapseHeader.closeCollapse();
        });

    }

    private createDeleteInfo ( deleteInfo ) {
        let i: number,
            j: number;
        const selectedPriorityBoarding:any = this.CommonsSessionStorageService.get( 'selectedPriorityBoarding' ) || {};
        const deleteStructure = {
            type: 'PRIORITY_BOARDING',
            segments: [{
                id: deleteInfo.id,
                passengerIds: []
            }]
        };
        for ( i = 0; i < selectedPriorityBoarding?.length; i++ ) {
            for ( j = 0; j < selectedPriorityBoarding[ i ].trips.length; j++ ) {
                if ( selectedPriorityBoarding[ i ].trips[ j ].id === deleteInfo.id ) {
                    if ( selectedPriorityBoarding[ i ].trips[ j ].checkedTrip ) {
                        deleteStructure.segments[ 0 ].passengerIds.push( selectedPriorityBoarding[ i ].id );
                    }
                }
            }
        }
        return deleteStructure;
    }

    private deletePrioritySuccess () {
        let i: number;
        const deletePriority = this.CommonsSessionStorageService.get( 'deletePriority' );
        for ( i = 0; i < this.model.info.trips.length; i++ ) {
            if ( this.model.info.trips[ i ].id === deletePriority[ 0 ].segments[ 0 ].id ) {
                this.model.info.amount -= this.model.info.trips[ i ].amount;
                this.model.info.trips.splice( i, 1 );
            }
        }
        if ( this.model.info.trips.length == 0 ) {
            this.model.hasPriorityBoarding = false;
            this.rootScope.$broadcast( 'cleanPriorityBoarding' );
        }
    }
}
