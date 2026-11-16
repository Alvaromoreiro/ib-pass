import { Component, ElementRef, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ReactComponentData } from '@src/app/core/models/generic-models/generic-models';
import { CheckVoucherOtpValidateResponse, CheckVoucherResponse, VoucherValidatedEvent } from '@src/app/core/models/ib-booking-payments/ib-booking-voucher-models';
import { VoucherProps, Voucher, VoucherValue } from 'commercial-management--digital--web-components-design--library';
import { IbBookingCheckVoucherCodeService } from '@src/app/shared/http-services/sse-orm/ib-booking-check-voucher-code.service';
import { VoucherDiscountOrder } from '@src/app/core/models/ib-booking-payments/ib-booking-summary-model';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { AJSCurrencyService } from 'ib-web-commons/utils';
import { IbPmtVoucherOtpModalService } from '../ib-pmt-voucher-otp-modal/ib-pmt-voucher-otp-modal.service';
import { IbBookingPmtService } from '../../services/ib-booking-pmt.service';
import { Currency } from 'ib-web-commons/models';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbCOtpErrorModalComponent } from '../ib-pmt-voucher-otp-modal/otp-error-modal/ib-otp-error-modal.component';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbBookingOrderModifyPartnerDiscount } from '@src/app/shared/http-services/sse-orm/ib-booking-order-modify-partner-discount.service';
import { TranslateService } from '@ngx-translate/core';



@Component({
    selector: 'ib-booking-voucher',
    template: ''
})
export class IbBookingVoucherComponent implements OnInit, OnDestroy {
    @Input() public orderId: string;
    @Input() public currency: Currency;
    @Input() public currentVoucher: VoucherDiscountOrder;
    @Output() public voucherValidated = new EventEmitter<VoucherValidatedEvent>;
    private currencyObject;
    private root: ReturnType<typeof createRoot>;
    constructor (
        private ngZone: NgZone,
        private ElementRef: ElementRef,
        private IbBookingCheckVoucherCodeService: IbBookingCheckVoucherCodeService,
        private IbCLinkPipe: IbCLinkPipe,
        private IbPmtVoucherOtpModalService: IbPmtVoucherOtpModalService,
        private IbBookingPmtService: IbBookingPmtService, 
        private IbCModalService: IbCModalService,
        private IbBookingOrderModifyPartnerDiscount: IbBookingOrderModifyPartnerDiscount,
        private TranslateService: TranslateService,
        @Inject(AJSCurrencyService) private CurrencyService: CurrencyService
    ) {
        this.root = createRoot(this.ElementRef.nativeElement);
    }

    private getVoucherValue = ( voucherDiscount: VoucherDiscountOrder ): VoucherValue => {
        if ( voucherDiscount == null ) {
            return { status: false };
        }
        return {
            status: true,
            discount: this.CurrencyService.formatPrice(this.currencyObject, voucherDiscount.voucherDiscountRealAmount.totalRealAmount, true, false),
            remainingAmount: voucherDiscount.remainingAmount != null? this.CurrencyService.formatPrice(this.currencyObject, voucherDiscount.remainingAmount, true, false):null,
            isRemainingAmountZero:  voucherDiscount.remainingAmount === 0? true: null,
            isPartner : voucherDiscount.type === BookingAppConstants.DISCOUNT_TYPES.PARTNER
        };
    };


    public reactComponent: ReactComponentData<VoucherProps> = {
        component: Voucher,
        props: {
            handleClick: this.callActionCallbackManager.bind( this ),
            urlLink: this.IbCLinkPipe.transform( 'TERMS_CONDITIONS_LINK' ),
            id: 'voucher-module',
            defaultCollapsable:true
        }
    };

    ngOnInit () {
        this.currencyObject = this.CurrencyService.getCurrencyObject(this.currency);
        const value = this.getVoucherValue( this.currentVoucher );
        this.renderComponent( value );
    }


    ngOnDestroy () {
        this.ngZone.runOutsideAngular(()=> {
            this.root.unmount();
        });
    }

    private renderComponent = ( value: VoucherValue ) => {
        
        let props = { ...this.reactComponent.props, value };

        this.ngZone.runOutsideAngular(()=> {
            this.root.render( createElement( this.reactComponent.component, {...props} ) );
        }); 
    };

    private callActionCallbackManager (input, removeDiscount) : Promise<VoucherValue> {
        const  code = input.length>0? input: this.currentVoucher.voucherId;
        if(!removeDiscount){
            return this.addVoucher(code);
        }
        return this.removeVoucher();  
    }

    private removeVoucherPromise = () => {
        if(this.currentVoucher?.type === BookingAppConstants.DISCOUNT_TYPES.PARTNER){
            return this.removePartnerDiscount();
        }
        return this.IbBookingCheckVoucherCodeService.deleteVoucherCode(this.currentVoucher.voucherId, this.orderId);
    };


    private removePartnerDiscount = async (): Promise<{ data: CheckVoucherResponse; code: number;}> => {
        const partnerTitle = this.currentVoucher.description ?? '';
        await this.IbCModalService.showGenericModal({
            title: 'PAYMENTS_DISCOUNTS_VOUCHER_MODAL_TITLE',
            body: this.TranslateService.instant('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BODY_PARTNER', { partnerPlan: partnerTitle}),
            showCloseButton: true,
            accept: this.TranslateService.instant('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_1'),
            cancel: this.TranslateService.instant('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_2_PART_1') +
                                    this.TranslateService.instant(partnerTitle) +
                                    this.TranslateService.instant('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_2_PART_2')
        }, {modalBlocked: true, showBackdrop: true}).result;
        return this.IbBookingOrderModifyPartnerDiscount.deletePartnerDiscount(this.currentVoucher.partnerId, this.orderId);

        
    };



    private removeVoucher = async (): Promise<VoucherValue>  => {
        this.IbBookingPmtService.setLoadingBasketState( true );        
        const promise = this.removeVoucherPromise();
        const {data} = await promise;
        const newOrder = data.order;
        this.sendEvent(newOrder);
        return null;
        
    };

   


    private showOtpErrorModal (error) {
        return error.internalErrorCode !== 'VCH_VCH_11001' && error.state !== 'CLOSED';
    }

    private addVoucher = ( voucherCode: string ): Promise<VoucherValue> => {
        this.IbBookingPmtService.setLoadingBasketState( true );
        const checkVoucherSuccess = (order) => {
            const newOrder = order;
            this.currentVoucher = newOrder.voucherDiscount;
            this.sendEvent( newOrder );
            return this.getVoucherValue( newOrder.voucherDiscount );

        };
        return this.IbBookingCheckVoucherCodeService.checkVoucherCode(voucherCode, this.orderId)
            .then(({data, code: statusCode}) => {
                if (statusCode === 202) {
                    const { otpSessionId, otpSessionExpired, otpSessionRequested, otpEmail} = (data as CheckVoucherOtpValidateResponse ).otpValidation;
                    const viewModel = {
                        voucherCode: voucherCode,
                        flowId:this.orderId,
                        sessionId: otpSessionId,
                        sessionExpiration: otpSessionExpired,
                        sessionRequested: otpSessionRequested,
                        email: otpEmail
                    };
                    return this.IbPmtVoucherOtpModalService.showOTPModal(viewModel).then((state) => {
                        return this.IbBookingCheckVoucherCodeService.validateVoucherCodeOtp(this.orderId, voucherCode, state.sessionId)
                            .then(resp => resp.data);
                    });

                } else {
                    return (data);
                }

            }).then((data ) => checkVoucherSuccess((data as CheckVoucherResponse)?.order))
            .catch((error)=> {
                if(this.showOtpErrorModal(error)) this.IbCModalService.showGenericComponentModal(IbCOtpErrorModalComponent);
                throw error.message;
            });


    };

    public sendEvent = (order) => {
        this.voucherValidated.emit({ order });
    };


}

