import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { Component, EventEmitter, OnInit, Output, Input, Inject } from '@angular/core';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { VoucherProps, Voucher }from 'commercial-management--digital--web-components-design--library';
import { IbMmbPaymentFormService } from '../../services/ib-Mmb-payment-form.service';
import { IbMmbVoucherService } from './services/ib-mmb-voucher.service';
import { PriceSubscriptionModel } from '@src/components/ib-MmB-payment/models/ib-Mmb-payments-component-model';
import { AviosDiscountOrder, VoucherDiscountOrder } from '@src/components/ib-MmB-payment/models/ib-Mmb-payments-summary-model';
import { MMBDatalayerConstants } from '@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';
import { AJSMmBDatalayerUtilsService, AJSMmBDatalayerUtilsServiceType } from '@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service-bridge.service';

@Component({
    selector: 'ib-mmb-voucher',
    template: '<ng-react [component]="Voucher" [props]="props"></ng-react>'
})
export class IbMmbVoucherComponent implements OnInit {
    protected readonly Voucher = Voucher;
    @Input() public flowId: string;
    @Output() public voucherValidated = new EventEmitter<any>;

    constructor (
        private IbCLinkPipe: IbCLinkPipe,
        private IbMmbPaymentFormService: IbMmbPaymentFormService,
        private IbMmBCheckVoucherCodeService: IbMmbVoucherService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        @Inject(AJSMmBDatalayerUtilsService) private MmBDatalayerUtilsService: AJSMmBDatalayerUtilsServiceType
    ) {}

    public voucherDiscount: VoucherDiscountOrder = undefined;
    public aviosDiscount: AviosDiscountOrder = undefined;

    public props: VoucherProps = {
        handleClick: this.handleVoucherClick.bind(this),
        urlLink: this.IbCLinkPipe.transform('TERMS_CONDITIONS_LINK'),
        id: 'voucher-module'
    };

    async handleVoucherClick (input: Parameters<VoucherProps['handleClick']>[0], removeDiscount: Parameters<VoucherProps['handleClick']>[1]): Promise<VoucherProps['value']> {
        return removeDiscount ? this.removeVoucher(this.voucherDiscount.voucherId) : this.addVoucher(input);
    };

    ngOnInit () {
        let voucherShown:string = MMBDatalayerConstants.DIGITAL_DATA_VALUES.YES;
        const digital_data = {};
        digital_data[ MMBDatalayerConstants.DatalayerGeneralConstants.VOUCHER_SHOWN ] = voucherShown;
        this.MmBDatalayerUtilsService.addDigitalDataInfo( digital_data );
        this.IbMmbPaymentFormService.priceUpdateEmitter.subscribe((data: PriceSubscriptionModel) => {
            if (data.discounts.length === 0) {
                this.CommonsSessionStorageService.remove('mmbVoucher');
            }
            if (data.discounts.length > 0) {
                const [discount] = data.discounts;
                const isAvios = discount.rewardCode === 'AVIOS';
                const discountType = isAvios ? this.aviosDiscount : this.voucherDiscount;

                if (isAvios) {
                    this.aviosDiscount = {
                        amount: discount.total,
                        remainingAmount: data?.total || null,
                    };
                    this.props = { ...this.props, value: null };
                } else {
                    this.voucherDiscount = this.CommonsSessionStorageService.get<VoucherDiscountOrder>('mmbVoucher');
                    this.props = { ...this.props, value: this.generatePropsValue(discountType) };
                };


            }
        });
    }

    private removeVoucher = (code: string): Promise<VoucherProps['value']> => {
        return new Promise(async (resolve) => {
            await this.IbMmBCheckVoucherCodeService.deleteVoucherCode(code, this.flowId)
                .then((response) => {
                    this.CommonsSessionStorageService.remove('mmbVoucher');
                    this.voucherValidated.emit({ order: response.data, voucherInfo: this.voucherDiscount });
                    resolve(null);
                }).catch((error) => {
                    if (this.voucherDiscount) {
                        resolve(this.generatePropsValue(this.voucherDiscount));
                    } else {
                        resolve({
                            status: false,
                            message: error.message
                        });
                    }
                });

        });
    };

    private addVoucher = (code: string): Promise<VoucherProps['value']> => {
        return new Promise(async (resolve) => {
            await this.IbMmBCheckVoucherCodeService.checkVoucherCode(code, this.flowId)
                .then((response) => {
                    this.voucherDiscount = response.data.voucherDiscount;
                    this.CommonsSessionStorageService.set('mmbVoucher', response.data.voucherDiscount);
                    this.voucherValidated.emit({ order: response.data, voucherInfo: this.voucherDiscount });
                    resolve(this.generatePropsValue(this.voucherDiscount));
                }).catch((error) => {
                    resolve({
                        status: false,
                        message: error.data.errors[0].reason
                    });

                });

        });
    };

    private generatePropsValue = (discountType): VoucherProps['value'] => {
        if (!discountType) {
            return null;
        }
        return {
            status: true,
            discount: this.IbMmbPaymentFormService.getPriceFormatted(discountType.amount),
            remainingAmount: discountType.remainingAmount != null ? this.IbMmbPaymentFormService.getPriceFormatted(discountType.remainingAmount) : null,
            isRemainingAmountZero: discountType.remainingAmount === 0 ? true : null
        };
    };
}