import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { IbCheckInPmtFormService } from '../../services/ib-checkin-pmt-form.service';
import { IbCheckinVoucherService } from '../../../../../../shared/http-services/ass-fass/ib-checkin-voucher.service';
import { PriceSubscriptionModel } from '../../../../../../core/models/ib-checkin-payments/ib-checkin-payments-component.model';
import { VoucherDiscountOrder } from '@src/app/core/models/ib-checkin-payments/ib-checkin-summary-model';
import { VoucherProps, Voucher } from 'commercial-management--digital--web-components-design--library';
import { CheckVoucherOtpValidateResponse } from '@src/app/core/models/ib-checkin-payments/ib-checkin-voucher-model';
import { IbPmtVoucherOtpModalService } from '@src/app/pages/ib-checkin-payments/components/ib-pmt-voucher-otp-modal/ib-pmt-voucher-otp-modal.service';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbCOtpErrorModalComponent } from '../../../ib-pmt-voucher-otp-modal/otp-error-modal/ib-otp-error-modal.component';

@Component({
    selector: 'ib-checkin-voucher',
    template: '<ng-react [component]="Voucher" [props]="props"></ng-react>'
})
export class IbCheckinVoucherComponent implements OnInit {
    protected readonly Voucher = Voucher;

    @Input() public flowId: string;
    @Output() public voucherValidated = new EventEmitter<any>();

    public voucherDiscount: VoucherDiscountOrder;
    public props: VoucherProps;

    constructor (
        private linkPipe: IbCLinkPipe,
        private pmtFormService: IbCheckInPmtFormService,
        private voucherService: IbCheckinVoucherService,
        private IbPmtVoucherOtpModalService: IbPmtVoucherOtpModalService,
        private sessionStorageService: CommonsSessionStorageService, 
        private IbCModalService: IbCModalService
    ) {
        this.props = {
            handleClick: this.handleVoucherClick.bind(this),
            urlLink: this.linkPipe.transform('TERMS_CONDITIONS_LINK'),
            id: 'voucher-module'
        };
    }

    ngOnInit () {
        this.pmtFormService.priceUpdateEmitter.subscribe(this.handleVoucherUpdate.bind(this));
    }

    async handleVoucherClick (input: Parameters<VoucherProps['handleClick']>[0], removeDiscount: Parameters<VoucherProps['handleClick']>[1]): Promise<VoucherProps['value']> {
        return removeDiscount ? this.removeVoucher(this.voucherDiscount.voucherId) : this.addVoucher(input);
    }

    handleVoucherUpdate (data: PriceSubscriptionModel) {
        if (data.discounts.length === 0) {
            this.sessionStorageService.remove('checkinVoucherPmtForm');
        } else {
            this.voucherDiscount = this.sessionStorageService.get<VoucherDiscountOrder>('checkinVoucherPmtForm');
            this.props = { ...this.props, value: this.generateVoucherPropsValue() };
        }
    }

    private async removeVoucher (code: string): Promise<VoucherProps['value']> {
        try {
            const response = await this.voucherService.deleteVoucherCode(code, this.flowId);
            this.sessionStorageService.remove('checkinVoucherPmtForm');
            this.voucherValidated.emit({ order: response.data, voucherInfo: this.voucherDiscount });
            return null;
        } catch (error: any) {
            return this.voucherDiscount ? this.generateVoucherPropsValue() : { status: false, message: error.message };
        }
    }

    private getDisruptionContactData () {
        return this.sessionStorageService.get('disruptionContactApis');
    }
    
    private showOtpErrorModal (error) {
        return error.internalErrorCode !== 'VCH_VCH_11001' &&
                error.internalErrorCode !== 'ASS_FASS_9042' &&
                error.state !== 'CLOSED';
    }

    private addVoucher = ( voucherCode: string ): Promise<VoucherProps['value']> => {
        const checkVoucherSuccess = (response) => {
            this.voucherDiscount = response.voucherDiscount;
            this.sessionStorageService.set('checkinVoucherPmtForm', response.voucherDiscount);
            this.voucherValidated.emit({ order: response, voucherInfo: this.voucherDiscount });
            return this.generateVoucherPropsValue();
        };
        const contactData = this.getDisruptionContactData();

        return this.voucherService.checkVoucherCode(voucherCode, this.flowId, contactData)
            .then(({data, code: statusCode}) => {
                if (statusCode === 202) {
                    const { otpSessionId, otpSessionExpired, otpSessionRequested, otpEmail} = (data as CheckVoucherOtpValidateResponse );
                    const viewModel = {
                        voucherCode: voucherCode,
                        flowId:this.flowId,
                        sessionId: otpSessionId,
                        sessionExpiration: otpSessionExpired,
                        sessionRequested: otpSessionRequested,
                        email: otpEmail
                    };
                    return this.IbPmtVoucherOtpModalService.showOTPModal(viewModel).then((state) => {
                        const contactData = this.getDisruptionContactData();
                        return this.voucherService.validateVoucherCodeOtp(this.flowId, voucherCode, state.sessionId, contactData)
                            .then(resp => resp.data);
                    });
                } else {
                    return data;
                }
            }).then((data) => checkVoucherSuccess(data))
            .catch((error) => {
                if(this.showOtpErrorModal(error)) this.IbCModalService.showGenericComponentModal(IbCOtpErrorModalComponent);
                return {
                    status: false,
                    message: error.message
                };
            });
    };

    private generateVoucherPropsValue (): VoucherProps['value'] {
        return {
            status: true,
            discount: this.pmtFormService.getPriceFormatted(this.voucherDiscount.amount),
            remainingAmount: this.voucherDiscount.remainingAmount != null ? this.pmtFormService.getPriceFormatted(this.voucherDiscount.remainingAmount) : null,
            isRemainingAmountZero: this.voucherDiscount.remainingAmount === 0 ? true : null
        };
    }
}

