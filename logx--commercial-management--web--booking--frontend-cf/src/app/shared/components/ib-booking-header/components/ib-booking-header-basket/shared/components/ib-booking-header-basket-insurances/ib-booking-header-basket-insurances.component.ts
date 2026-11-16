import { Component, Input, Inject } from '@angular/core';
import { BookingHeaderConstants } from '@shared/components/ib-booking-header/ib-booking-header-constants';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { DatalayerBasketService } from '../../services/ib-booking-header-basket-datalayer.service';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { DatalayerUtilsService } from '../../../../../../../services/ib-datalayer/services/ib-datalayer-utils-service';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';

@Component({
    selector: 'ib-booking-header-basket-insurances',
    templateUrl: './ib-booking-header-basket-insurances.component.html',
    styleUrls: ['./ib-booking-header-basket-insurances.component.scss']
})
export class IbBookingHeaderBasketInsurancesComponent {
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

    public deleteInsurance () {
        const actualPage = '/' + this.CommonsSessionStorageService.get( 'actualStepFlow' ),
            insurance = [ { type: 'INSURANCE' } ];
        this.CommonsSessionStorageService.set( 'selectInsurance', false );
        this.rootScope.$broadcast( 'updateInsuranceSelectedStatus' );
        this.basketFunctions.isLoading();
        this.DatalayerBasketService.deleteInsurance();
        if ( actualPage === BookingHeaderConstants.ANCILLARIES_PAGES_HASH.BOOKING ) {
            this.model.info = null;
            this.model.hasInsurance = false;
            this.CommonsSessionStorageService.set( 'selectInsurance', false );
            this.CommonsSessionStorageService.set( 'hasSelectedInsurance', false );
            this.CommonsSessionStorageService.remove( 'insuranceSelected' );
            this.basketFunctions.calculateAllBasket( '/' + this.CommonsSessionStorageService.get( 'actualStepFlow' ) );
            this.basketFunctions.saveHeaderModel();
            this.basketFunctions.isNotLoading();
            this.rootScope.$broadcast( 'deleteInsurance' );

        } else {
            this.basketFunctions.deleteAncillariesService.deleteAncillarie( insurance ).then( () => {
                this.CommonsSessionStorageService.set( 'selectInsurance', false );
                this.CommonsSessionStorageService.set( 'hasSelectedInsurance', false );
                this.CommonsSessionStorageService.remove( 'insuranceSelected' );
                this.rootScope.$broadcast( 'basketUpdateCommonHeader' );
                this.model.info = null;
                this.model.hasInsurance = false;
                this.basketFunctions.calculateAllBasket( '/' + this.CommonsSessionStorageService.get( 'actualStepFlow' ) );
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
