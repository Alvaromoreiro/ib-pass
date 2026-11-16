import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs';
import objectFormat from 'dayjs/plugin/toObject';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { DiscountsEntries, OnPaymentSuccessEvent, PmtPageTitleInfo, PriceEntries, PriceEntriesTypes, PriceSubscriptionModel, SetSummaryInfoProps, SuccessEventUnpaidItems, PmtRedirectionInfo, CurrencyConversionModel, CurrencyDisplayFormat } from '@src/app/core/models/ib-booking-payments/ib-booking-payments-model';
import { IbSummaryTransformerService } from '../../../services/ib-summary-transformer.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { OnHoldInfoProps, SummaryProps, OnHoldOption, TransformedTimeDateLimit } from 'commercial-management--digital--web-components-design--library';
import { HeaderDataType, ShoppingBasketDiscountObjectType, ShoppingBasketItemTotal } from '@src/app/core/models/ib-booking-availability/header-model';
import { BkiPmtConstants, DiscountsToReset, SummaryDefaultModel } from '@src/app/core/constants/ib-booking-payments-constants';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbPmtTaxesModalComponent } from '../../ib-booking-pmt-taxes-modal/ib-booking-pmt-taxes-modal.component';
import { Taxes } from '@src/app/core/models/ib-booking-payments/ib-booking-summary-model';
import { FareOnHoldOptions } from '@src/app/core/models/generic-models/fare-models';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { IbBookingPmtDigitalDataService } from './ib-booking-pmt-digital-data.service';
import { GetContextResponse } from '@src/app/shared/http-services/sse-orm/ib-payment-context.service';
import { IbBookingCurrencyUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-currency-utils.service';
import { RouterPathsConstants } from '@src/app/core/constants/ib-booking-router-paths-constants';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { OrderData } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
import { PaymentViewType } from '@src/app/core/enums/ib-booking-paymments/ib-booking-payments-enum';
import { DigitalDataProcess } from '@src/app/core/constants/ib-digital-data-constants';

dayjs.extend( localizedFormat );
dayjs.extend( objectFormat );

@Injectable({providedIn: 'root'})
export class IbBookingPmtService {
    constructor (
        private TranslateService: TranslateService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbSummaryTransformerService: IbSummaryTransformerService,
        private IbBookingCurrencyUtilsService: IbBookingCurrencyUtilsService,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        private IbCModalService: IbCModalService,
        private IbBookingPmtDigitalDataService: IbBookingPmtDigitalDataService
    ) {}

    public checkOnHoldForTitle = ( info: PmtPageTitleInfo | undefined = undefined ) => {
        if ( !info ) return this.TranslateService.instant( 'PAYMENTS_PAGE_TITLE' );
        const { isFree, hours } = info;
        const onHoldSubString = `${this.TranslateService.instant( 'ON_HOLD_TITLE' )} ${ hours } ${ this.TranslateService.instant( 'ON_HOLD_ONE_OPTION_HOURS' ) } ${ isFree ? this.TranslateService.instant( 'ON_HOLD_FREE_TITLE' ) : '' }`;
        return onHoldSubString;
    };
    public checkMultiTripViewConditions = (): boolean => {
        const isOpenJaw =  !!this.CommonsSessionStorageService.get('openJaw');
        const isMultiTrip = !!this.CommonsSessionStorageService.get('multiCitySearch');
        return isOpenJaw||isMultiTrip;
    };

    public getSummaryInfo = ( { showPassegenerTaxesModal, selectedOnHold = undefined, priceModalClick }: SetSummaryInfoProps ): SummaryProps => {
        const summary: SummaryProps = SummaryDefaultModel;
        const bookingInfo: any = this.CommonsSessionStorageService.get( BkiStorageConstants.BKI_INFO );
        const headerModel: HeaderDataType = this.CommonsSessionStorageService.get( BkiStorageConstants.HEADER_MODEL );
        summary.trips = this.IbSummaryTransformerService.setTrips( bookingInfo.order.slices, bookingInfo.fareFamilyConditions);
        summary.total = headerModel.headerModel.shoppingBasket.total.original;
        summary.totalPrice = headerModel.headerModel.shoppingBasket.total.formatted;
        summary.totalDcc = headerModel.headerModel.shoppingBasket.total.totalDcc;
        summary.otherItems = this.IbSummaryTransformerService.setOtherItemsFromBasket( headerModel.headerModel.shoppingBasket );
        summary.isMultiTrip = this.checkMultiTripViewConditions();
        summary.passengers.types = this.IbSummaryTransformerService.setPassengers( headerModel.headerModel.shoppingBasket.trips.trips[0].passengers );
        summary.passengers.total = headerModel.headerModel.shoppingBasket.trips.total.formatted;
        summary.passengers.onClick = showPassegenerTaxesModal;
        summary.priceModalClick = priceModalClick;
        summary.lang = BookingAppConstants.lang;
        if ( selectedOnHold != null ) {
            const flightOrderItemPrice = bookingInfo.order.orderItems.find( ( item ) => item.type === 'flight' )?.price;
            if ( flightOrderItemPrice?.total) {
                summary.total = flightOrderItemPrice.total;
                summary.totalPrice = this.getPriceFormatted( flightOrderItemPrice.total );
            }
            summary.onholdPrice = headerModel.headerModel.shoppingBasket.total.formatted;
            return summary;
        }
        summary.ancillaries = this.IbSummaryTransformerService.getAncillaries( headerModel.headerModel );
        return summary;
    };

    public setSummaryOthers = ( data: PriceSubscriptionModel ): void => {
        const { discounts, charges, total } = data;

        this.resetDiscounts( );
        this.addBasketDiscounts( discounts, total );
        this.checkResetBasketOthers( charges );
    };
    
    public resetDiscounts = ( ): void => {
        DiscountsToReset.forEach(type => {
            this.NewMainHeaderFacade.deleteDiscountFromBasket( type );
        });
    };


    private getDescriptionForDiscount = ( discount: DiscountsEntries ): string => {
        if (discount.type === BookingAppConstants.DISCOUNT_TYPES.VOUCHER) {
            const order = this.CommonsSessionStorageService.get<OrderData>(BkiStorageConstants.CREATE_ORDER_DATA)?.order;
            const voucherDescription = order?.voucherDiscount?.description;
            return voucherDescription ?? this.TranslateService.instant( 'BONUS_CARD_GIFT_TEXT' );
        }
        return this.TranslateService.instant( discount.type );
    };


    private addBasketDiscounts = ( discounts: DiscountsEntries[], totalPrice: number ) => {
        discounts.forEach( (discount: DiscountsEntries) => {

            const { total, type } = discount;
            const isPartner = discount.partner?.id?.length > 0;
            const newDiscountType = isPartner ? BookingAppConstants.DISCOUNT_TYPES.PARTNER : type;

            const discountItem = <ShoppingBasketDiscountObjectType> {
                type: newDiscountType,
                description: this.getDescriptionForDiscount( discount ),
                discount: total,
                totalDiscount: total,
                discountFormatted: this.getPriceFormatted( total )
            };

            this.NewMainHeaderFacade.addSimpleDiscount( discountItem );
        } );
    };

    private addBasketOther = ( charge: PriceEntries ) => {
        const { id, name, total } = charge;
        const type = id === BkiPmtConstants.COMPONENT.CHARGES.DONATION ? BkiPmtConstants.BASKET.OTHERS.DONATION : BkiPmtConstants.BASKET.OTHERS.FEE;
        this.NewMainHeaderFacade.updateBasketOthers( type, { description: name, total: total, totalFormatted: this.getPriceFormatted( total ) } );
    };

    private checkResetBasketOthers = ( charges: PriceEntries[] ) => {
        const totalFee = charges.find( ( charge ) => charge.type === PriceEntriesTypes.FEE );
        const totalDonation = charges.find( ( charge ) => charge.type === PriceEntriesTypes.DONATION );
        totalFee == null ? this.NewMainHeaderFacade.updateBasketOthers( BkiPmtConstants.BASKET.OTHERS.FEE, null ) : this.addBasketOther( totalFee );
        totalDonation == null ? this.NewMainHeaderFacade.updateBasketOthers( BkiPmtConstants.BASKET.OTHERS.DONATION, null ) : this.addBasketOther( totalDonation );
    };

    public getPriceFormatted = ( price: number ) => {
        return this.IbBookingCurrencyUtilsService.getPriceFormatted( price );
    };

    public showTaxesModal = ( viewModel: Taxes[] ) => {
        const modalOptions = {
            modalBlocked: true,
            windowClass: 'ib-modals bki-dialog'
        };
        const modalRef = this.IbCModalService.showGenericComponentModal( IbPmtTaxesModalComponent, modalOptions);
        const componentInstance = modalRef.componentInstance as { model: Taxes[] | undefined; };
        componentInstance.model = viewModel;
        return modalRef;
    };

    public setTimeOnHoldProps = ( onHoldItem: FareOnHoldOptions ): OnHoldInfoProps => {
        const onHoldTime = dayjs( onHoldItem.referenceTimeLimit ).toObject();
        const onHoldMonth = dayjs( onHoldItem.referenceTimeLimit ).format( 'MMMM' );
        const { date, years, hours, minutes } = onHoldTime;
        const timeProps: OnHoldInfoProps = <OnHoldInfoProps> <unknown> {
            type: 'time',
            hours: onHoldItem.hours,
            day: date.toString(),
            month: this.IbSummaryTransformerService.titleCasePipe( onHoldMonth ),
            year: years.toString(),
            hour: hours < 10 ? `0${ hours }` : hours.toString(),
            minutes: minutes < 10 ? `0${ minutes }` : minutes.toString(),
            description: onHoldItem.referenceCity.description
        };
        return timeProps;
    };


    public getMultipleOnHoldOptions = ( options: FareOnHoldOptions[] ): OnHoldOption[] => {
        const newOptions = <OnHoldOption[]> [];
        options.forEach( ( option ) => {
            const { hours, referenceTimeLimit, referenceCity, price, onHoldOptionId } = option;
            const onHoldTime = dayjs( referenceTimeLimit ).toObject();
            const onHoldMonth = dayjs( referenceTimeLimit ).format( 'MMMM' );
            const transformedTime: TransformedTimeDateLimit = <TransformedTimeDateLimit> {
                hour: onHoldTime.hours < 10 ? `0${ onHoldTime.hours }` : onHoldTime.hours.toString(),
                minutes: onHoldTime.minutes < 10 ? `0${ onHoldTime.minutes }` : onHoldTime.minutes.toString(),
                day: onHoldTime.date,
                year: onHoldTime.years,
                month: this.IbSummaryTransformerService.titleCasePipe( onHoldMonth )
            };
            const newOption = <OnHoldOption> {
                hours,
                onHoldOptionId,
                cityDescription: referenceCity.description,
                total: price.total,
                totalFormatted: this.getPriceFormatted( price.total ),
                transformedTimeDateLimit: transformedTime
            };
            newOptions.push( newOption );
        } );
        return newOptions;
    };

    public redirectedPaymentTypeAction = (context: GetContextResponse) => {
        const confirmationDatalayerInfoCallback = this.CommonsSessionStorageService.get( BkiStorageConstants.CONFIRM_DATALAYER_INFO );
        const confirmationDigitalDataCallback = this.CommonsSessionStorageService.get( BkiStorageConstants.CONFIRM_DIGITALDATA_INFO );
        this.CommonsSessionStorageService.set( BkiStorageConstants.CONFIRM_DATALAYER_CALLBACK, confirmationDatalayerInfoCallback );
        this.CommonsSessionStorageService.set( BkiStorageConstants.CONFIRM_DIGITALDATA_CALLBACK, confirmationDigitalDataCallback );
        this.CommonsSessionStorageService.set( BkiStorageConstants.PMT_REDIRECTION_CONTEXT, {contextResponse: context, paymentCompleted: false}as PmtRedirectionInfo );
    };

    public deleteUnpaidItemsFromBasket = ( { unpaidItemList = undefined }: OnPaymentSuccessEvent ): void => {
        const unpaidItemDeleteActionMap = {
            [SuccessEventUnpaidItems.INSURANCE]: () => this.NewMainHeaderFacade.deleteInsuranceFromBasket(),
            [SuccessEventUnpaidItems.DONATION]: () => this.NewMainHeaderFacade.updateBasketOthers( BkiPmtConstants.BASKET.OTHERS.DONATION, null ),
            [SuccessEventUnpaidItems.GLOBICK]: () => this.NewMainHeaderFacade.deleteGlobickTransfersFromBasket(),
            [SuccessEventUnpaidItems.ASSISTCARD]: ()=> {this.NewMainHeaderFacade.deleteAssistCardFromBasket();}
        }; 

        if ( unpaidItemList === undefined ) return;
        unpaidItemList.forEach( ( item ) => {
            const { type } = item;
            unpaidItemDeleteActionMap[ type ]?.();

        } );
        this.IbBookingPmtDigitalDataService.setAncillariesDatalayer();
    };

    public setLoadingBasketState = ( isLoading: boolean ): void => {
        this.NewMainHeaderFacade.setLoadingBasket( isLoading );
    };

    public setIssueOrderInfo = ( data ) => {
        this.CommonsSessionStorageService.set( BkiStorageConstants.ISSUE_ORDER_INFO, data );
    };

    public checkAndUpdateOrderTotalPrice = ( createOrder, totalPrice: ShoppingBasketItemTotal ) => {
        if ( createOrder.order.price.total !== totalPrice.total ) {
            createOrder.order.price.total = totalPrice.total;
            this.CommonsSessionStorageService.set( BkiStorageConstants.CREATE_ORDER_DATA, createOrder );
        }
        return createOrder;
    };
    public formatPrice = ( price: number, format: CurrencyDisplayFormat) : string => {
        const formatDecimals = (price: number, format: CurrencyDisplayFormat['decimalDigits']): number => {
            const factor = Math.pow(10, format.value);
            return format.rounding === 'UP'
                ? Math.ceil(price * factor) / factor
                : Math.floor(price * factor) / factor;

        };
        const formatGrouping = (price: string, format: CurrencyDisplayFormat['separator']): string => {

            return price.toString().replace('.', format.decimal).replace(/\B(?=(\d{3})+(?!\d))/g, format.grouping);
        };
        const formatCurrency = (price: string, format: CurrencyDisplayFormat['symbol']): string => {
            return format.alignment === 'L' ? `${format.value}${price}` : `${price}${format.value}`;
        };
        const formattedPrice = formatDecimals(price, format.decimalDigits);
        return formatCurrency(formatGrouping(formattedPrice.toString(), format.separator), format.symbol);
    };



    public setSummaryDCCInfo = ( currencyConversion: CurrencyConversionModel, currencyDisplayFormat: CurrencyDisplayFormat) => {
        if (!currencyConversion) {
            this.NewMainHeaderFacade.setTotalDCC( '' );
            return;
        }
        const currencyFormat = structuredClone(  currencyDisplayFormat  );
        currencyFormat.symbol.value = currencyConversion.currency;
        this.NewMainHeaderFacade.setTotalDCC( this.formatPrice(currencyConversion.total, currencyFormat) );
    };
    //TODO: delete when old payments will be deprecated
    public updateStepsStorage = () => {
        const route = RouterPathsConstants.ibpurc;
        const previousStep = this.CommonsSessionStorageService.get(BkiStorageConstants.ACTUAL_STEP_FLOW) ?? route;
        this.CommonsSessionStorageService.set(BkiStorageConstants.ACTUAL_STEP_FLOW, route);
        // Avoid change previous step if it is the same as the current one
        if (previousStep !== route) {
            this.CommonsSessionStorageService.set(BkiStorageConstants.PREVIOUS_STEP_FLOW, previousStep);
        }
    };

    private isNewPaymentFlow = (): boolean => {
        const storedPaymentType = this.CommonsSessionStorageService.get<keyof typeof PaymentViewType>(
            BkiStorageConstants.PAYMENTS_VIEWTYPE
        );

        return storedPaymentType === PaymentViewType.NEW;
    };

    private isRecoveredOnHoldConfirmation = (isNewPaymentFlow: boolean, process?: string): boolean => {
        return isNewPaymentFlow && process === DigitalDataProcess.ONHOLD_CONFIRMATION;
    };

    public getConfirmationPageQuadrigam = (isOnHold: boolean = false, process?: string): string => {
        const isNewPaymentFlow = this.isNewPaymentFlow();
        const isRecoveredOnHoldConfirmation = this.isRecoveredOnHoldConfirmation(isNewPaymentFlow, process);

        if (isRecoveredOnHoldConfirmation) {
            return BookingAppConstants.QUADRIGAMS.BKI_CONFIRMATION_COH_NEW;
        }

        if (isOnHold) {
            return isNewPaymentFlow
                ? BookingAppConstants.QUADRIGAMS.BKIOH_CONFIRMATION_NEW
                : BookingAppConstants.QUADRIGAMS.BKIOH_CONFIRMATION;
        }
        return BookingAppConstants.QUADRIGAMS.BKI_CONFIRMATION_NEW;
    };
}

