import { Component, Inject, Input } from '@angular/core';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { DatalayerBasketService } from '../../services/ib-booking-header-basket-datalayer.service';
import { DatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service';
import { BookingHeaderConstants } from '@shared/components/ib-booking-header/ib-booking-header-constants';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';

@Component({
    selector: 'ib-booking-header-basket-speqs',
    templateUrl: './ib-booking-header-basket-speqs.component.html',
    styleUrls: ['./ib-booking-header-basket-speqs.component.scss']
})
export class IbBookingHeaderBasketSpeqsComponent {
    @Input() public model;
    @Input() public basketFunctions;
    @Input() public deleteFlag: boolean;
    @Input() public loadingVoucher: boolean;

    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        @Inject( AJSDatalayerUtilsService ) private DatalayerUtilsService: AJSDatalayerUtilsServiceType,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private DatalayerBasketService: DatalayerBasketService
    ) { }


    /**
     *  Delete speqs on service and emit event to delete speq on ancillaries page
     * @param {Object} segment Segment information where speq be deleted
     * @param {String} speqTypeSelected Type of speq deleted
     */
    public deleteSpeq ( segment, speqTypeSelected ): void {
        let actualPage: string = `/${ this.CommonsSessionStorageService.get( 'actualStepFlow' ) }`,
            trips,
            trip,
            segmentSpeqs;

        const deleteSegmentSpeqSuccess = () => {
            let i: number, j: number, speqSelected;
            for ( i = 0; i < this.model.segments.length; i++ ) {
                if ( this.model.segments[ i ].segmentId === segment.segmentId ) {
                    for ( j = 0; j < this.model.segments[ i ].speqs.length; j++ ) {
                        if ( this.model.segments[ i ].speqs[ j ].type === speqTypeSelected ) {
                            segment.total -= this.model.segments[ i ].speqs[ j ].total;
                            speqSelected = j;
                        }
                    }
                    this.model.segments[ i ].speqs.splice( speqSelected, 1 );
                }
            }
            segmentSpeqs = this.model.segments.filter( ( segment ) => {
                return ( segment.total > 0 );
            } );
            this.model.segments = segmentSpeqs;
            if ( this.model.segments.length === 0 ) {
                this.model.hasSpeqs = false;
            }
            const ancInfo: any = this.CommonsSessionStorageService.get( 'ancillariesInfo' );
            if ( ancInfo.bundles ) {
                let passengersNum = 1;
                let maxSpeqs = 3;
                for ( let i = 0; i < ancInfo.ancillaries.length; i++ ) {
                    if ( ancInfo.ancillaries[ i ].type === 'SPECIAL_EQUIPMENT' ) {
                        passengersNum = ancInfo.ancillaries[ i ].slices[ 0 ].passengers.length;
                        maxSpeqs = ancInfo.ancillaries[ i ].slices[ 0 ].passengers[ 0 ].maxAdditionalPieces;
                    }
                }
                let maxSpeqsPerSegment = maxSpeqs * passengersNum;
                let messageHasToBeShown = false;
                for ( let i = 0; i < this.model.segments.length; i++ ) {
                    let speqsInSegment = 0;
                    for ( let j = 0; j < this.model.segments[ i ].speqs.length; j++ ) {
                        speqsInSegment += this.model.segments[ i ].speqs[ j ].quanty;
                    }
                    if ( speqsInSegment === maxSpeqsPerSegment ) {
                        messageHasToBeShown = true;
                    }
                }
                if ( messageHasToBeShown ) {
                    this.CommonsSessionStorageService.set( 'bundleHaveSpeqs', true );
                } else {
                    this.CommonsSessionStorageService.set( 'bundleHaveSpeqs', false );
                }
            }
        };
        this.DatalayerBasketService.deleteSpeqs( segment, speqTypeSelected );
        this.basketFunctions.isLoading();
        if ( actualPage === BookingHeaderConstants.ANCILLARIES_PAGES_HASH.BOOKING ) {
            deleteSegmentSpeqSuccess();
            this.rootScope.$broadcast( 'deleteSpeqs', segment.segmentId, speqTypeSelected );
            this.basketFunctions.calculateAllBasket( actualPage );
            this.basketFunctions.saveHeaderModel();
            this.basketFunctions.isNotLoading();
        } else {
            trips = { type: 'SPECIAL_EQUIPMENT', slices: [] }; trip = { id: segment.segmentId, passengers: [] };
            segment.speqs.forEach( ( speq ) => {
                if ( speq.type === speqTypeSelected ) {
                    speq.passengers.forEach( ( pas ) => {
                        trip.passengers.push( { id: pas, subtypes: [ speq.type ] } );
                    });
                    trips.slices.push( trip );
                }
            });

            this.basketFunctions.deleteAncillariesService.deleteAncillarie( [ trips ] ).then( () => {
                deleteSegmentSpeqSuccess();
                this.rootScope.$broadcast( 'deleteSpeqs', segment.segmentId, speqTypeSelected );
                this.rootScope.$broadcast( 'basketUpdateCommonHeader' );
                this.basketFunctions.calculateAllBasket( actualPage );
                this.basketFunctions.deleteAncillarie( true );
                this.basketFunctions.saveHeaderModel();
                this.basketFunctions.isNotLoading();
                this.DatalayerUtilsService.setAncillariesDatalayer();
            }, ( error ) => {
                this.basketFunctions.deleteAncillarie( false );
                this.basketFunctions.isNotLoading();
                this.basketFunctions.modalService.setErrorMessage( error.message );
                this.basketFunctions.modalService.setErrorCode( error.internalErrorCode );
                this.basketFunctions.modalService.isError( error );
                this.basketFunctions.collapseHeader.closeCollapse();
            });
        }
    }
}
