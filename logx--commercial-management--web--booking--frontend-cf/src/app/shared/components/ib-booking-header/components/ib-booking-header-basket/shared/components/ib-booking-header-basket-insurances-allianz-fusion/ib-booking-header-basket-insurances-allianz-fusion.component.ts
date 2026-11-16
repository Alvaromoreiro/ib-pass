import { Component, Input, Inject, OnDestroy } from '@angular/core';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import angular from 'angular';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-booking-header-basket-insurances-allianz-fusion',
    templateUrl: './ib-booking-header-basket-insurances-allianz-fusion.component.html',
    styleUrls: ['./ib-booking-header-basket-insurances-allianz-fusion.component.scss']
})
export class IbBookingHeaderBasketInsurancesAllianzFusionComponent implements OnDestroy {
    @Input() model: any;
    @Input() basketFunctions: any;
    @Input() deleteFlag: any;
    @Input() loadingVoucher: any;
    private rootScopeListenerRemoveAllianzFusion: () => void;
    
    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        @Inject( AJSDatalayerUtilsService ) private DatalayerUtilsService: AJSDatalayerUtilsServiceType
    ) {
        this.rootScopeListenerRemoveAllianzFusion = this.rootScope.$on('removeAllianzFusion', this.removeAllianzFusion.bind(this));
    }
    
    
    ngOnDestroy (): void {
        if (this.rootScopeListenerRemoveAllianzFusion) {
            this.rootScopeListenerRemoveAllianzFusion();
        }
    }   
 

    removeAllianzFusion () {
        setTimeout(() => {
            const insurance = [{ type: 'ALLIANZ_FUSION' }];
            this.CommonsSessionStorageService.set('selectInsurance', false);
            this.basketFunctions.isLoading();

            this.basketFunctions.deleteAncillariesService.deleteAncillarie(insurance).then(() => {
                this.deleteAllianzFusionSucess();
            }, (error) => {
                this.basketFunctions.isNotLoading();
                this.basketFunctions.modalService.setErrorMessage(error.message);
                this.basketFunctions.modalService.setErrorCode(error.internalErrorCode);
                this.basketFunctions.modalService.isError(error);
                this.basketFunctions.collapseHeader.closeCollapse();
            });

        });
    }

    deleteAllianzFusionSucess ( actualPage? ) {
        this.model.info = null;
        this.model.hasInsuranceAllianzFusion = false;
        this.basketFunctions.calculateAllBasket(actualPage);
        this.basketFunctions.deleteAncillarie( true );
        this.basketFunctions.saveHeaderModel();
        this.basketFunctions.isNotLoading();
        this.rootScope.$broadcast('updateInsuranceSelectedStatus', false);
        this.rootScope.$broadcast('basketUpdateCommonHeader');
        angular.element('ib-insurance-allianz-fusion').find('.ib-radio__input:checked').prop('checked', false);
        this.DatalayerUtilsService.setAncillariesDatalayer();
       
    }
}
