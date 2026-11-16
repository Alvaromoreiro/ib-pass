import { Component, Inject, OnInit } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbBookingPaymentsPageService } from './services/ib-booking-payments-page.service';
import { PaymentViewType, PaymentViewTypeValues } from '@src/app/core/enums/ib-booking-paymments/ib-booking-payments-enum';
import { AJSBookingModalService, BookingModalServiceType } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { BookingHeaderConstants } from '@src/app/shared/components/ib-booking-header/ib-booking-header-constants';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
@Component({
    selector: 'ib-booking-payments-page',
    templateUrl: 'ib-booking-payments-page.component.html',
    providers: [
        IbBookingPaymentsPageService
    ]
})
export class IbBookingPaymentsPageComponent implements OnInit {
    //Asign EMPTY to no render any component
    public readonly PaymentViewType = PaymentViewType;
    public componentType: PaymentViewTypeValues = this.PaymentViewType.EMPTY;
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbBookingPaymentsPageService : IbBookingPaymentsPageService,
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService
    ){}


    ngOnInit () {
        const isOnHoldOrder = this.CommonsSessionStorageService.get<boolean>( BkiStorageConstants.ONHOLD_ORDER ) ?? false;
        this.BookingModalService.showWaitingModal( 'ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true );
        this.NewMainHeaderFacade.updateStepsModel('ibpurc', null, isOnHoldOrder ? BookingHeaderConstants.BOOK_ONHOLD_STEPS : null);
        setTimeout( async () => {
            const storedPaymentType =  this.CommonsSessionStorageService.get<keyof typeof PaymentViewType>(BkiStorageConstants.PAYMENTS_VIEWTYPE);
            const pmtType = storedPaymentType ?? await this.IbBookingPaymentsPageService.checkPaymentsViewType();
            this.CommonsSessionStorageService.set(BkiStorageConstants.PAYMENTS_VIEWTYPE, pmtType);
            this.componentType = pmtType;
        } );
    }

    public forceOld (){
        this.CommonsSessionStorageService.set(BkiStorageConstants.PAYMENTS_VIEWTYPE, this.PaymentViewType.OLD);
        this.componentType = PaymentViewType.OLD;
    }

}
