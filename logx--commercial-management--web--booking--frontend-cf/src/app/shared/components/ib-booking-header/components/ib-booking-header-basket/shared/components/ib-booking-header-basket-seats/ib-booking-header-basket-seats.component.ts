import { Component, Inject, Input } from '@angular/core';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { DatalayerBasketService } from '../../services/ib-booking-header-basket-datalayer.service';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { deleteAncillariesResponse } from 'ib-web-ancillaries/dist/app/core/models/ancillaries-info';

@Component({
    selector: 'ib-booking-header-basket-seats',
    templateUrl: './ib-booking-header-basket-seats.component.html',
    styleUrls: ['./ib-booking-header-basket-seats.component.scss']
})
export class IbBookingHeaderBasketSeatsComponent {
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

    public deleteSeat ( segmentId, seat ): void {
        this.basketFunctions.isLoading();
        this.DatalayerBasketService.deleteSeats( segmentId, seat );
        const context = this.buildDeleteSegments( segmentId, seat );

        this.basketFunctions.deleteNewAncillariesService.deleteAncillaries( [ context.segments ] ).subscribe({
            next: ( response: deleteAncillariesResponse ) => this.onDeleteSeatsSuccess( response, context ),
            error: ( error ) => this.onDeleteSeatsError( error )
        });
    }

    private buildDeleteSegments ( segmentId, seat ): { segmentId: any, seat: any, segments: any, counterSeats: number } {
        const segments = { type: 'SEAT', segments: [] };
        const trip = { id: null, passengers: [] };
        let counterSeats = 0;

        this.model.segments.forEach( ( segment ) => {
            if ( segment.segmentId === segmentId ) {
                trip.id = segmentId;
                segment.seats.forEach( ( segmentSeat ) => {
                    if ( segmentSeat.type === seat.type ) {
                        seat.passengers.forEach( ( pas ) => {
                            if ( pas.amount > 0 ) {
                                trip.passengers.push( pas.id );
                            }
                            counterSeats += 1;
                        });
                    }
                });
                segments.segments.push( trip );
            }
        });

        return { segmentId, seat, segments, counterSeats };
    }

    private onDeleteSeatsSuccess ( response: deleteAncillariesResponse, { segmentId, seat, segments, counterSeats } ): void {
        this.updateModelAfterDelete( segmentId, seat );
        const deleteResponseInfo = response.ancillaries.length > 0 ? response.ancillaries : [ segments ];
        this.rootScope.$broadcast( 'deleteSeats', { amount: counterSeats, seats: deleteResponseInfo } );
        this.rootScope.$broadcast( 'basketUpdateCommonHeader' );
        this.broadcastDonationIfNeeded();
        this.basketFunctions.calculateAllBasket( '/' + this.CommonsSessionStorageService.get( 'actualStepFlow' ) );
        this.basketFunctions.deleteAncillarie( true );
        this.basketFunctions.saveHeaderModel();
        this.basketFunctions.isNotLoading();
        this.DatalayerUtilsService.setAncillariesDatalayer();
    }

    private onDeleteSeatsError ( error ): void {
        this.basketFunctions.deleteAncillarie( false );
        this.basketFunctions.isNotLoading();
        this.basketFunctions.modalService.setErrorMessage( error.message );
        this.basketFunctions.modalService.setErrorCode( error.internalErrorCode );
        this.basketFunctions.modalService.isError( error );
        this.basketFunctions.collapseHeader.closeCollapse();
    }

    private updateModelAfterDelete ( segmentId, seat ): void {
        for ( let i = 0; i < this.model.segments.length; i++ ) {
            if ( this.model.segments[ i ].segmentId === segmentId ) {
                this.updateSegmentSeat( this.model.segments[ i ], seat );
                this.model.segments = this.checkSegmentSeats();
                this.model.hasSeats = this.model.segments.some( ( segment ) => segment.seats.length > 0 );
            }
        }
    }

    private updateSegmentSeat ( segment, seat ): void {
        let k = 0;
        let isFound = false;
        const paidPassengerCount = seat.passengers.filter( ( pas ) => pas.amount > 0 ).length;
        while ( k < segment.seats.length && !isFound ) {
            if ( segment.seats[ k ].type === seat.type ) {
                segment.total = segment.total - seat.amount;
                segment.totalFormatted = this.basketFunctions.CurrencyService.formatPrice( this.model.currency, segment.total, true );
                segment.quanty = this.calculateQuanty( segment ) - paidPassengerCount;
                segment.seats[ k ].paymentPassenger = [];
                segment.seats[ k ].passengers = segment.seats[ k ].freePassenger;
                segment.seats[ k ].totalAmountPaymentPassenger = 0;
                isFound = true;
            }
            k++;
        }
    }

    private broadcastDonationIfNeeded (): void {
        const donationData: any = this.CommonsSessionStorageService.get( 'donation' );
        if ( donationData ) {
            this.rootScope.$broadcast(
                'checkDonation',
                true,
                donationData.option,
                donationData.donationInfo,
                donationData.form ? donationData.form.acceptDonationData : null,
                donationData.form ? donationData.form : null
            );
        }
    }

    private calculateQuanty ( segment ) {
        let quanty = 0;
        segment.seats.forEach( ( seat ) => {
            quanty += seat.freePassenger.length + seat.paymentPassenger.length;
        });
        return quanty;
    }

    private checkSegmentSeats () {
        const segments = [];
        if ( this.model.segments.length > 0 ) {
            this.model.segments.forEach( ( segment ) => {
                if ( segment.quanty > 0 ) {
                    segments.push( segment );
                }
            });
        }
        return segments;
    }

}
