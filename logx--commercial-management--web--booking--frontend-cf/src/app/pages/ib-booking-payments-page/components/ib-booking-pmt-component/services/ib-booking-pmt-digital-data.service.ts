import { Inject, Injectable } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { DigitalDataValues, DigitalDataConstants, DigitalDataEcommerceEvents, DigitalDataSteps, DigitalDataProcess } from '@src/app/core/constants/ib-digital-data-constants';
import { OnPaymentSuccessEvent } from '@src/app/core/models/ib-booking-payments/ib-booking-payments-model';
import { VoucherDiscountOrder } from '@src/app/core/models/ib-booking-payments/ib-booking-summary-model';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';


@Injectable({providedIn: 'root'})
export class IbBookingPmtDigitalDataService {
    constructor (
        private DigitalDataService: DigitalDataService,
        @Inject(AJSDatalayerUtilsService) private DatalayerUtilsService: AJSDatalayerUtilsServiceType,
        private DigitalDataUtilsService: DigitalDataUtilsService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) { }

    public emitViewEvent = (): void => {
        this.DigitalDataService.emitViewEvent();
    };

    public addDigitalDataInfo = ( digital_data ): void => {
        this.DigitalDataService.addDigitalDataInfo( digital_data );
    };

    public getDigitalData = (): object => {
        return this.DigitalDataService.getDigitalData();
    };

    public getDigitalDataProcess = (): string => {
        const digital_data = this.getDigitalData();
        if ( digital_data == null ) return;
        return digital_data[ DigitalDataConstants.PROCESS ];
    };

    public getDigitalDataQuadrigam = (): string => {
        const digital_data = this.getDigitalData();
        if ( digital_data == null ) return;
        return digital_data[ DigitalDataConstants.QUADRIGAM ];
    };

    public getPaymentPageQuadrigam = (): string => {
        const process = this.getDigitalDataProcess();
        return process === DigitalDataProcess.ONHOLD_CONFIRMATION
            ? BookingAppConstants.QUADRIGAMS.BKI_PAYMENTS_COH_NEW
            : BookingAppConstants.QUADRIGAMS.BKI_PAYMENTS_NEW;
    };
    

    public setPaymentsDigitalData = (): void => {
        const quadrigam = this.getPaymentPageQuadrigam();
        this.setDigitalDataVoucherShown( true );
        this.DatalayerUtilsService.setProcessAndStep( this.getDigitalDataProcess(), DigitalDataSteps.PAYMENTS, quadrigam );
        this.updateDigitalDataWithQuadrigam( quadrigam);
    };

    public setOnHoldDigitalData = (): void => {
        this.setDigitalDataVoucherShown();
        this.DatalayerUtilsService.setProcessAndStep( this.getDigitalDataProcess(), DigitalDataSteps.ONHOLD_PAYMENT, BookingAppConstants.QUADRIGAMS.BKIOH_PAYMENTS_NEW );
        this.updateDigitalDataWithQuadrigam( BookingAppConstants.QUADRIGAMS.BKIOH_PAYMENTS_NEW );
    };

    public manageDigitalDataVoucher = ( voucherInfo: VoucherDiscountOrder | undefined ): void => {
        let digital_data = {};
        if ( !voucherInfo ) {
            digital_data = this.getDigitalData();
            delete digital_data[ DigitalDataConstants.VOUCHER_AMOUNT ];
            delete digital_data[ DigitalDataConstants.VOUCHER_CODE ];
            digital_data[ DigitalDataConstants.VOUCHER_USED ] = DigitalDataValues.NO;
            this.DigitalDataService.addDigitalDataInfo( digital_data );
            return;
        }
        digital_data[ DigitalDataConstants.VOUCHER_AMOUNT ] = voucherInfo.amount;
        digital_data[ DigitalDataConstants.VOUCHER_CODE ] = voucherInfo.voucherId;
        digital_data[ DigitalDataConstants.VOUCHER_USED ] = DigitalDataValues.YES;
        this.DigitalDataService.addDigitalDataInfo( digital_data );
    };

    public setDigitalDataVoucherShown = ( hasVoucher: boolean = false ) => {
        const digital_data = this.getDigitalData();
        if ( digital_data == null ) return;
        digital_data[ DigitalDataConstants.VOUCHER_SHOWN ] = hasVoucher ? DigitalDataValues.YES : DigitalDataValues.NO;
        this.DigitalDataService.addDigitalDataInfo( digital_data );
    };

    public setDigitalDataPmtType = ( { methodType, details }: OnPaymentSuccessEvent ) => {
        const digital_data = this.getDigitalData();
        if ( digital_data == null ) return;
        digital_data[ DigitalDataConstants.PAYMENT_METHOD ] = ( ( details != null ) && ( methodType === 'CREDIT_CARD' ) ) ? details.creditCardType : methodType;
        this.DigitalDataService.addDigitalDataInfo( digital_data );
    };

    public setAncillariesDatalayer = () => {
        this.DatalayerUtilsService.setAncillariesDatalayer();
    };

    public setConfirmationInfo = () => {
        this.DatalayerUtilsService.setProcessAndStep( this.getDigitalDataProcess(), DigitalDataSteps.CONFIRMATION, this.getDigitalDataQuadrigam() );
        this.CommonsSessionStorageService.set( BkiStorageConstants.CONFIRM_DIGITALDATA_INFO, this.getDigitalData() );
    };

    public addEcommerceEvent = (  ) => {
        const addToCart: any = this.CommonsSessionStorageService.get( 'addToCart' );
        this.DigitalDataService.addDigitalDataEcommerceEvent( addToCart.ecommerce, DigitalDataEcommerceEvents.ADD_PMT_INFO );
    };

    public updateDigitalDataWithQuadrigam = ( quadrigam: string ) => {
        this.DigitalDataUtilsService.updateDigitalDataWithQuadrigam( quadrigam, null );
    };
}
