import { Component, Inject, Input } from '@angular/core';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { HeaderDataHeaderModel, HeaderDataType } from '@src/app/core/models/ib-booking-availability/header-model';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { DatalayerBasketService } from '../../services/ib-booking-header-basket-datalayer.service';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

@Component({
    selector: 'ib-booking-header-basket-section',
    templateUrl: './ib-booking-header-basket-section.component.html',
    styleUrls: ['./ib-booking-header-basket-section.component.scss']
})
export class IbBookingHeaderBasketSectionComponent {
    @Input() public model;
    @Input() public basketFunctions;
    @Input() public deleteFlag: boolean;
    @Input() public loadingVoucher: boolean;
    public ancOffersTotal;
    private mnttLog2GTM = this.window[ 'mnttLog2GTM' ] ?? ( () => { } );
    private iconsMap = {
        insurance: 'icon-seguros',
        menu: 'icon-c_restaurante',
        seats: 'icon-asiento',
        baggages: 'icon-e_equipaje',
        speq: 'icon-e_trolley',
        flexibility: 'icon-cambios_y_reembolsos',
        priority: 'icon-priority-boarding'
    };

    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        @Inject( WINDOW_TOKEN ) private window: Window,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        @Inject( AJSDatalayerUtilsService ) private DatalayerUtilsService: AJSDatalayerUtilsServiceType,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private DatalayerBasketService: DatalayerBasketService
    ) { }


    public deleteAncillarie (deleteInfo): void {
        this.DatalayerBasketService.deleteAncillaries( this.model.info.category );
        if ( this.CommonsSessionStorageService.get( 'actualStepFlow' ) !== 'availability' && this.CommonsSessionStorageService.get( 'actualStepFlow' ) !== 'ibairp' ) {
            this.basketFunctions.isLoading();
            this.basketFunctions.deleteAncillariesService.deleteAncillarie( deleteInfo ).then( () => {
                this.model.info = null;
                this.model.hasFlexibilization = false;
                if ( this.CommonsSessionStorageService.get( 'selectedFlex' ) ) {
                    setTimeout( () => {
                        this.mnttLog2GTM && this.mnttLog2GTM( 'ATQ-7625: Adelantar compra de flexibilidad a la dispo', 'Elimina flex del carrito' );
                    } );
                }
                this.CommonsSessionStorageService.remove('selectedFlex');
                this.rootScope.$broadcast('basketUpdateCommonHeader');
                this.rootScope.$broadcast('cleanFlexibilization');
                this.basketFunctions.calculateAllBasket('/' + this.CommonsSessionStorageService.get('actualStepFlow'));
                this.basketFunctions.deleteAncillarie( true );
                this.basketFunctions.saveHeaderModel();
                this.basketFunctions.isNotLoading();
                this.DatalayerUtilsService.setAncillariesDatalayer();
            }, ( error ) => {
                this.basketFunctions.deleteAncillarie( false );
                this.basketFunctions.isNotLoading();
                this.basketFunctions.modalService.showGenericError( error ).result.then( () => {}, () => {} );
                this.basketFunctions.collapseHeader.closeCollapse();
            });
        }else {
            this.basketFunctions.isLoading();
            setTimeout( () => {
                const headerModel: HeaderDataType = this.CommonsSessionStorageService.get( 'headerModel' );
                const header: HeaderDataHeaderModel = headerModel.headerModel;
                this.NewMainHeaderFacade.updateBasketFlexibilization( '' );
                this.CommonsSessionStorageService.remove( 'selectedFlex' );
                this.rootScope.$broadcast( 'emptyFlex' );
                this.rootScope.$broadcast( 'updatePrice', header.shoppingBasket.total.formatted );
                this.ancOffersTotal = this.CommonsSessionStorageService.get( 'availabilityRelatedContent' )[ 0 ].value;
                this.rootScope.$broadcast( 'changeOffersTotal', this.ancOffersTotal );
                this.basketFunctions.isNotLoading();

                this.mnttLog2GTM && this.mnttLog2GTM( 'ATQ-7625: Adelantar compra de flexibilidad a la dispo', 'Elimina flex del carrito' );
                if ( this.CommonsSessionStorageService.get( 'actualStepFlow' ) === 'availability' ) {
                    const event = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    document.querySelectorAll( '.ib-radio-boxed--simple input' )[0].dispatchEvent( event );
                }
            }, 1500);
        }
    }

    public setIcon ( category:string ):string {
        return this.iconsMap[ category ];
    }
}
