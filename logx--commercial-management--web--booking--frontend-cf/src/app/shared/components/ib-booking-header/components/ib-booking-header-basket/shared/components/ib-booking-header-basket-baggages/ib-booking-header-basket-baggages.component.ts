import { Component, Inject, Input } from '@angular/core';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingHeaderConstants } from '@shared/components/ib-booking-header/ib-booking-header-constants';
import { DatalayerBasketService } from '../../services/ib-booking-header-basket-datalayer.service';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';

@Component({
    selector: 'ib-booking-header-basket-baggages',
    templateUrl: './ib-booking-header-basket-baggages.component.html',
    styleUrls: ['./ib-booking-header-basket-baggages.component.scss']
})
export class IbBookingHeaderBasketBaggagesComponent {
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


    public deleteBaggage ( segment, baggageTypeSelected ) {

        let actualPage = `/${ this.CommonsSessionStorageService.get( 'actualStepFlow' ) }`,
            segmentsBaggages,
            trips,
            trip;

        const deleteSegmentBaggageSuccess = () => {
            let i, j, baggageSelected;
            for ( i = 0; i < this.model.segments.length; i++ ) {
                if ( this.model.segments[ i ].segmentId === segment.segmentId ) {
                    for ( j = 0; j < this.model.segments[ i ].baggages.length; j++ ) {
                        if ( this.model.segments[ i ].baggages[ j ].type === baggageTypeSelected ) {
                            segment.total -= this.model.segments[ i ].baggages[ j ].total;
                            baggageSelected = j;
                        }
                    }
                    this.model.segments[ i ].baggages.splice( baggageSelected, 1 );
                }
            }
            segmentsBaggages = this.model.segments.filter( ( segment ) => {
                return ( segment.total > 0 );
            } );
            this.model.segments = segmentsBaggages;

            if ( this.model.segments.length === 0 ) {
                this.model.hasBaggage = false;
            }
            const ancInfo: any = this.CommonsSessionStorageService.get( 'ancillariesInfo' );
            if ( ancInfo.bundles ) {
                let passengersNum = 1;
                let maxBaggs = 9;
                for ( let i = 0; i < ancInfo.ancillaries.length; i++ ) {
                    if ( ancInfo.ancillaries[ i ].type === 'BAGGAGE' ) {
                        passengersNum = ancInfo.ancillaries[ i ].slices[ 0 ].passengers.length;
                        maxBaggs = ancInfo.ancillaries[ i ].slices[ 0 ].passengers[ 0 ].maxAdditionalPieces;
                    }
                }
                let maxBaggsPerSegment = maxBaggs * passengersNum;
                let messageHasToBeShown = false;
                for ( let i = 0; i < this.model.segments.length; i++ ) {
                    let baggsInSegment = 0;
                    for ( let j = 0; j < this.model.segments[ i ].baggages.length; j++ ) {
                        baggsInSegment += this.model.segments[ i ].baggages[ j ].quanty;
                    }
                    if ( baggsInSegment === maxBaggsPerSegment ) {
                        messageHasToBeShown = true;
                    }
                }
                if ( messageHasToBeShown ) {
                    this.CommonsSessionStorageService.set( 'bundleHaveBaggs', true );
                } else {
                    this.CommonsSessionStorageService.set( 'bundleHaveBaggs', false );
                }
            }
        };

        this.basketFunctions.isLoading();
        this.DatalayerBasketService.deleteBaggages(segment, baggageTypeSelected);
        if ( actualPage === BookingHeaderConstants.ANCILLARIES_PAGES_HASH.BOOKING ) {
            deleteSegmentBaggageSuccess();
            this.rootScope.$broadcast('deleteBaggages', segment.segmentId, baggageTypeSelected);
            this.basketFunctions.calculateAllBasket(actualPage);
            this.basketFunctions.saveHeaderModel();
            this.basketFunctions.isNotLoading();
        } else {
            trips = { type: 'BAGGAGE', slices: [] }, trip = { id: segment.segmentId, passengers: [] };

            segment.baggages.forEach( ( baggage ) => {
                if ( baggage.type === baggageTypeSelected ) {
                    baggage.passengers.forEach( ( pas ) => {
                        trip.passengers.push( { id: pas, subtypes: [ baggage.type ] } );
                    });
                    trips.slices.push( trip );
                }
            });


            this.basketFunctions.deleteAncillariesService.deleteAncillarie( [ trips ] ).then( () => {
                deleteSegmentBaggageSuccess();
                this.rootScope.$broadcast( 'deleteBaggages', segment.segmentId, baggageTypeSelected );
                this.rootScope.$broadcast( 'basketUpdateCommonHeader' );
                this.basketFunctions.calculateAllBasket( actualPage );
                this.basketFunctions.deleteAncillarie( true );
                this.basketFunctions.saveHeaderModel();
                this.basketFunctions.isNotLoading();
                this.DatalayerUtilsService.setAncillariesDatalayer();
            }, (error) => {
                this.basketFunctions.isNotLoading();
                this.basketFunctions.modalService.setErrorMessage( error.message );
                this.basketFunctions.modalService.setErrorCode( error.internalErrorCode );
                this.basketFunctions.deleteAncillarie( false );
                this.basketFunctions.modalService.isError( error );
                this.basketFunctions.collapseHeader.closeCollapse();
            });
        }

    }
}
