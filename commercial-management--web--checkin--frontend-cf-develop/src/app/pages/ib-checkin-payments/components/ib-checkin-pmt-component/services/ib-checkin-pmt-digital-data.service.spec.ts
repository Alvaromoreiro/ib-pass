import { DigitaDataValues, DigitalDataConstants, DigitalDataQuadrigam } from '@src/app/core/constants/ib-digital-data-constants';
import { OnPaymentSuccessEvent, SuccessEventMethodTypes } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-model';
import { VoucherDiscountOrder } from '@src/app/core/models/ib-checkin-payments/ib-checkin-summary-model';
import { AJSDatalayerServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-service-bridge.service';
import { AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service-bridge.service';
import { AJSDigitalDataServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-digital-data-service-bridge.service';
import { IbCheckinPmtDigitalDataService } from './ib-checkin-pmt-digital-data.service';

describe('IbCheckinPmtDigitalDataService', () => {
    let service: IbCheckinPmtDigitalDataService;
    let digitalDataService: jasmine.SpyObj<AJSDigitalDataServiceType>;
    let datalayerUtilsService: jasmine.SpyObj<AJSDatalayerUtilsServiceType>;
    let datalayerService: jasmine.SpyObj<AJSDatalayerServiceType>;

    beforeEach(() => {
        digitalDataService = jasmine.createSpyObj<AJSDigitalDataServiceType>('DigitalDataService', [
            'emitViewEvent', 'addDigitalDataInfo', 'getDigitalData'
        ]);
        datalayerUtilsService = jasmine.createSpyObj<AJSDatalayerUtilsServiceType>('DatalayerUtilsService', [
            'setTrackingCode', 'setAncillariesDatalayer'
        ]);
        datalayerService = {} as jasmine.SpyObj<AJSDatalayerServiceType>;
        service = new IbCheckinPmtDigitalDataService(digitalDataService, datalayerUtilsService, datalayerService);
    });

    it('should delegate digital data view and update operations', () => {
        const data = { [DigitalDataConstants.PROCESS]: 'payment' };

        service.emitViewEvent();
        service.addDigitalDataInfo(data);

        expect(digitalDataService.emitViewEvent).toHaveBeenCalledTimes(1);
        expect(digitalDataService.addDigitalDataInfo).toHaveBeenCalledOnceWith(data);
    });

    it('should return the current process or undefined when digital data is unavailable', () => {
        digitalDataService.getDigitalData.and.returnValues(
            { [DigitalDataConstants.PROCESS]: 'payment' },
            null
        );

        expect(service.getDigitalDataProcess()).toBe('payment');
        expect(service.getDigitalDataProcess()).toBeUndefined();
    });

    it('should set payment page tracking data and emit the ancillary datalayer', () => {
        const digitalData = {};
        digitalDataService.getDigitalData.and.returnValue(digitalData);

        service.setPaymentsDigitalData();

        expect(digitalData[DigitalDataConstants.VOUCHER_SHOWN]).toBe(DigitaDataValues.YES);
        expect(digitalDataService.addDigitalDataInfo).toHaveBeenCalledOnceWith(digitalData);
        expect(datalayerUtilsService.setTrackingCode).toHaveBeenCalledOnceWith(DigitalDataQuadrigam.PAYMENT_DECOUPLING);
        expect(datalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalledTimes(1);
    });

    it('should add voucher information when a voucher is present', () => {
        const voucher = { amount: 25, voucherId: 'VOUCHER-25' } as VoucherDiscountOrder;

        service.manageDigitalDataVoucher(voucher);

        expect(digitalDataService.addDigitalDataInfo).toHaveBeenCalledOnceWith({
            [DigitalDataConstants.VOUCHER_AMOUNT]: voucher.amount,
            [DigitalDataConstants.VOUCHER_CODE]: voucher.voucherId,
            [DigitalDataConstants.VOUCHER_USED]: DigitaDataValues.YES
        });
    });

    it('should clear voucher information and mark it unused when no voucher is present', () => {
        const digitalData = {
            [DigitalDataConstants.VOUCHER_AMOUNT]: 25,
            [DigitalDataConstants.VOUCHER_CODE]: 'VOUCHER-25'
        };
        digitalDataService.getDigitalData.and.returnValue(digitalData);

        service.manageDigitalDataVoucher(undefined);

        expect(digitalData[DigitalDataConstants.VOUCHER_AMOUNT]).toBeUndefined();
        expect(digitalData[DigitalDataConstants.VOUCHER_CODE]).toBeUndefined();
        expect(digitalData[DigitalDataConstants.VOUCHER_USED]).toBe(DigitaDataValues.NO);
        expect(digitalDataService.addDigitalDataInfo).toHaveBeenCalledOnceWith(digitalData);
    });

    it('should set voucher visibility and skip updates when digital data is unavailable', () => {
        const digitalData = {};
        digitalDataService.getDigitalData.and.returnValues(digitalData, digitalData, null);

        service.setDigitalDataVoucherShown();
        service.setDigitalDataVoucherShown(true);
        service.setDigitalDataVoucherShown(false);

        expect(digitalData[DigitalDataConstants.VOUCHER_SHOWN]).toBe(DigitaDataValues.YES);
        expect(digitalDataService.addDigitalDataInfo).toHaveBeenCalledTimes(2);
        expect(digitalDataService.addDigitalDataInfo).toHaveBeenCalledWith(digitalData);
    });

    it('should store the credit card type as the payment method', () => {
        const digitalData = {};
        const event = {
            methodType: SuccessEventMethodTypes.CREDIT_CARD,
            details: { creditCardType: 'VI' }
        } as OnPaymentSuccessEvent;
        digitalDataService.getDigitalData.and.returnValue(digitalData);

        service.setDigitalDataPmtType(event);

        expect(digitalData[DigitalDataConstants.PAYMENT_METHOD]).toBe('VI');
        expect(digitalDataService.addDigitalDataInfo).toHaveBeenCalledOnceWith(digitalData);
    });

    it('should store the payment method when it is not a credit card and skip unavailable data', () => {
        const digitalData = {};
        const event = { methodType: SuccessEventMethodTypes.PAYPAL } as OnPaymentSuccessEvent;
        digitalDataService.getDigitalData.and.returnValues(digitalData, null);

        service.setDigitalDataPmtType(event);
        service.setDigitalDataPmtType(event);

        expect(digitalData[DigitalDataConstants.PAYMENT_METHOD]).toBe(SuccessEventMethodTypes.PAYPAL);
        expect(digitalDataService.addDigitalDataInfo).toHaveBeenCalledOnceWith(digitalData);
    });

    it('should delegate ancillary datalayer updates', () => {
        service.setAncillariesDatalayer();

        expect(datalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalledTimes(1);
    });
});