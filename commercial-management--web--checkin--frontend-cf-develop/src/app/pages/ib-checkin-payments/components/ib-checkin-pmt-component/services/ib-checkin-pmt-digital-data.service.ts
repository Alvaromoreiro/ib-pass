import { Inject, Injectable } from '@angular/core';
import { DigitaDataValues, DigitalDataConstants, DigitalDataQuadrigam, DigitalDataSteps } from '@src/app/core/constants/ib-digital-data-constants';
import { OnPaymentSuccessEvent, SuccessEventMethodTypes } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-model';
import { VoucherDiscountOrder } from '@src/app/core/models/ib-checkin-payments/ib-checkin-summary-model';
import { AJSDatalayerService, AJSDatalayerServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-service-bridge.service';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service-bridge.service';
import { AJSDigitalDataService, AJSDigitalDataServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-digital-data-service-bridge.service';

@Injectable({providedIn: 'root'})
export class IbCheckinPmtDigitalDataService {
    constructor (
        @Inject(AJSDigitalDataService) private DigitalDataService: AJSDigitalDataServiceType,
        @Inject(AJSDatalayerUtilsService) private DatalayerUtilsService: AJSDatalayerUtilsServiceType,
        @Inject(AJSDatalayerService) private DatalayerService: AJSDatalayerServiceType
    ) { }

    public emitViewEvent = (): void => {
        this.DigitalDataService.emitViewEvent();
    };

    public addDigitalDataInfo = ( digital_data ): void => {
        this.DigitalDataService.addDigitalDataInfo( digital_data );
    };

    public getDigitalDataProcess = (): string => {
        const digital_data = this.DigitalDataService.getDigitalData();
        if ( digital_data == null ) return;
        return digital_data[ DigitalDataConstants.PROCESS ];
    };

    public setPaymentsDigitalData = (): void => {
        this.setDigitalDataVoucherShown(true);
        this.DatalayerUtilsService.setTrackingCode(DigitalDataQuadrigam.PAYMENT_DECOUPLING);
        this.setAncillariesDatalayer();
    };

    public manageDigitalDataVoucher = ( voucherInfo: VoucherDiscountOrder | undefined ): void => {
        let digital_data = {};
        if ( !voucherInfo ) {
            digital_data = this.DigitalDataService.getDigitalData();
            delete digital_data[ DigitalDataConstants.VOUCHER_AMOUNT ];
            delete digital_data[ DigitalDataConstants.VOUCHER_CODE ];
            digital_data[ DigitalDataConstants.VOUCHER_USED ] = DigitaDataValues.NO;
            this.DigitalDataService.addDigitalDataInfo( digital_data );
            return;
        }
        digital_data[ DigitalDataConstants.VOUCHER_AMOUNT ] = voucherInfo.amount;
        digital_data[ DigitalDataConstants.VOUCHER_CODE ] = voucherInfo.voucherId;
        digital_data[ DigitalDataConstants.VOUCHER_USED ] = DigitaDataValues.YES;
        this.DigitalDataService.addDigitalDataInfo( digital_data );
    };

    public setDigitalDataVoucherShown = (hasVoucher: boolean = false) => {
        const digital_data = this.DigitalDataService.getDigitalData();
        if (digital_data == null) return;
        digital_data[DigitalDataConstants.VOUCHER_SHOWN] = hasVoucher ? DigitaDataValues.YES : DigitaDataValues.NO;
        this.DigitalDataService.addDigitalDataInfo( digital_data );
    };

    public setDigitalDataPmtType = ( event: OnPaymentSuccessEvent ) => {
        const { methodType, details } = event;
        const digital_data = this.DigitalDataService.getDigitalData();
        if ( digital_data == null ) return;
        digital_data[ DigitalDataConstants.PAYMENT_METHOD ] = ( ( details != null ) && ( methodType === SuccessEventMethodTypes.CREDIT_CARD ) ) ? details.creditCardType : methodType;
        this.DigitalDataService.addDigitalDataInfo( digital_data );
    };

    public setAncillariesDatalayer = () => {
        this.DatalayerUtilsService.setAncillariesDatalayer();
    };
}
