import { Component, Inject, Input, OnInit } from "@angular/core";
import { AJSRootScope, CommonsSessionStorageService, downgradeToAJSComponent } from "ib-web-commons/utils";
import { IbCModalService, IbModalRef } from "ib-web-commons/ib-modal";
import { IbMmBVoluntaryRefundsComponent } from "@src/components/ib-MmB-voluntary-refunds/ib-MmB-voluntary-refunds.component";
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { MMBDatalayerConstants } from '@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';
import { AJSMmBDatalayerUtilsService, AJSMmBDatalayerUtilsServiceType } from "@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service-bridge.service";
import { Penalty, VoluntaryRefundsTransformerModel } from "./models/ib-voluntary-refunds-tab-transformer-model";
import { VoluntaryRefundsTabService } from './services/ib-MmB-voluntary-refunds-tab.service';
import { MmBHttpResponse } from "@src/app/core/models/generic-models";
import { VoluntaryRefundsModel, listTaxedRefundInfo } from "./models/ib-voluntary-refunds-model";
import { VoluntaryRefundsTabTransformer } from "./transformers/ib-MmB-voluntary-refunds-tab.transformer";
import { UpdateItems } from './models/ib-voluntary-refunds-model';
import { BookingDashboardModel } from "../../view-model/ib-MmB-booking-dashboard-model";
import { TranslateService } from "@ngx-translate/core";
import { LiteralFormatterPipe } from '@src/app/shared/pipes/literalFormatter.pipe';
import { VoluntaryRefundsParcialModel } from "./models/ib-voluntary-refunds-parcial-model";

enum bookingRefundType {
    GETTING_BOOKING = 'GETTING_BOOKING',    //CASO RESERVA OBTENCIÓN
    GETTING_CASH_AVIOS_BOOKING = 'GETTING_CASH_AVIOS_BOOKING',      //CASO RESERVA OBTENCIÓN CASH&AVIOS
    EXEMPTION_AVIOS_BOOKING = 'EXEMPTION_AVIOS_BOOKING',    //CASO RESERVA REDENCIÓN AVIOS
    EXEMPTION_AVIOS_MONEY_BOOKING = 'EXEMPTION_AVIOS_MONEY_BOOKING',    //CASO RESERVA REDENCIÓN AVIOS&MONEY
    MULTI_COIN_BOOKING = 'MULTI_COIN_BOOKING',      //CASO RESERVA MULTIMONEDA
    GETTING_QUALITY_BOOKING = 'GETTING_QUALITY_BOOKING',    //CASO OBTENCIÓN CALIDAD
    EXEMPTION_QUALITY_BOOKING = 'EXEMPTION_QUALITY_BOOKING',    //CASO REDENCIÓN CALIDAD
    EXEMPTION_PAY_WIP = 'EXEMPTION_PAY_WIP'     //CASO REDENCIÓN PAGO WIP (FUERA MVP)
}

@Component({
    selector: "ib-MmB-voluntary-refunds-tab",
    templateUrl: "./ib-MmB-voluntary-refunds-tab-view.component.html",
    styleUrls: ["./ib-MmB-voluntary-refunds-tab.component.scss"],
    providers: [
        VoluntaryRefundsTabService
    ]
})
export class ibMmbVoluntaryRefundsTabComponent implements OnInit {
    @Input() model: BookingDashboardModel;
    isvoluntaryRefundSuccess: boolean = false;
    voluntaryRefundNotAllowed: boolean = false;
    showErrorCalculateRefundService: boolean = false;
    dataModel: VoluntaryRefundsTransformerModel;
    refundBookingType: string = null;
    voluntaryRefundNotAvailableBody: string = '';
    voluntaryRefundNotAvailableBodyCallCenter: string = '';
    voluntaryRefundNotAvailableBodyOther: string = '';
    refundItemsContracted: UpdateItems[] = [];
    notRefundItemsContracted: UpdateItems[] = [];
    notRefundOnlineItemsContracted: UpdateItems[] = [];
    notFlownFlights: VoluntaryRefundsParcialModel[] = [];
    showFightsNotFlown: boolean = false
    linkMoreInfo: string = '';
    showNoRefundValue: boolean = false;
    allSlicesRefundable: boolean = false;
    allSlicesNotRefundable: boolean = false;
    partialSlicesRefundable: boolean = false;
    slicesRefundable: VoluntaryRefundsParcialModel[] = [];
    slicesNotRefundable: VoluntaryRefundsParcialModel[] = [];
    allYQRefundable: boolean = false;
    allYQNotRefundable: boolean = false;
    partialYQRefundable: boolean = false;
    longCurrencyLgView: boolean = false;
    longCurrencyXlView: boolean = false;

    constructor(
        private IbCModalService: IbCModalService,
        @Inject(AJSMmBDatalayerUtilsService) private MmBDatalayerUtilsService: AJSMmBDatalayerUtilsServiceType,
        private VoluntaryRefundsTabService: VoluntaryRefundsTabService,
        private VoluntaryRefundsTabTransformer: VoluntaryRefundsTabTransformer,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private translate: TranslateService,
        private LiteralFormatterPipe: LiteralFormatterPipe,
        @Inject(AJSRootScope) private $rootScope: any,
    ) {
        this.refundBookingType = bookingRefundType.GETTING_BOOKING;
    }

    ngOnInit(): void {
        if (!this.model.flags.allowedVoluntaryRefundCash && !this.model.flags.allowedVoluntaryPartialRefundCash) {
            this.translateVoluntaryRefundNotAvailableBody();
            this.voluntaryRefundNotAllowed = true;
        } else {
            this.voluntaryRefundNotAllowed = false;
            this.requestVoluntaryRefunds();
            this.linkMoreInfo = this.generateMoreInfoUrl();
        }
    }

    private translateVoluntaryRefundNotAvailableBody = (): void => {
        this.translate.get([
            'MMB_VOLUNTARY_REFUNDS_REFUND_NOT_AVAILABLE_BODY',
            'MMB_VOLUNTARY_REFUNDS_REFUND_NOT_AVAILABLE_BODY_NO_CC'
        ]).subscribe(translations => {
            this.voluntaryRefundNotAvailableBodyCallCenter = translations['MMB_VOLUNTARY_REFUNDS_REFUND_NOT_AVAILABLE_BODY'];
            this.voluntaryRefundNotAvailableBodyOther = translations['MMB_VOLUNTARY_REFUNDS_REFUND_NOT_AVAILABLE_BODY_NO_CC'];
            this.checkPnrChannel();
        });
    }

    private checkPnrChannel = (): void => {
        const channel: string = this.CommonsSessionStorageService.get<string>('pnrChannel');
        if (channel === MmBAppConstants.PNR_EMITION_CHANNEL.FLEX_FLIGHT_DIRECT[0] || channel === MmBAppConstants.PNR_EMITION_CHANNEL.FLEX_FLIGHT_DIRECT[1]) {
            this.voluntaryRefundNotAvailableBody = this.voluntaryRefundNotAvailableBodyCallCenter;
        } else {
            this.voluntaryRefundNotAvailableBody = this.voluntaryRefundNotAvailableBodyOther;
        }
    }

    private requestVoluntaryRefunds = () => {
        this.model.showSpinner = true;
        let flowId: string = this.CommonsSessionStorageService.get<string>('flowId');
        this.VoluntaryRefundsTabService.voluntaryRefundsItinRefundPromised(flowId)
            .then((res) => this.voluntaryRefundsSuccess(res), (err) => this.voluntaryRefundsError(err));
    };

    private voluntaryRefundsSuccess = (res: MmBHttpResponse<VoluntaryRefundsModel>) => {
        this.model.showSpinner = false;
        this.isvoluntaryRefundSuccess = true;
        this.showErrorCalculateRefundService = false;
        this.dataModel = this.VoluntaryRefundsTabTransformer.voluntaryRefundsTransfomedInfo(res.data);
        // this.verifyFigureLength(this.dataModel);
        this.toggleRefundBookingType(this.dataModel.less24Hours);
        this.MmBDatalayerUtilsService.updateDatalayerInfo(this.addProcessDigitalData(this.dataModel.less24Hours, this.dataModel.penalty), MMBDatalayerConstants.DIGITAL_DATA_STEP.REFVDB, MmBAppConstants.QUADRIGAM.VOL_REFUND_DASHBOARD);
        this.checkNotFlownFlights(this.dataModel.less24Hours);
        this.refundItemsContracted = this.updateItems(this.dataModel.refundItems);
        this.notRefundItemsContracted = this.updateItems(this.dataModel.notRefundItems);
        this.notRefundOnlineItemsContracted = this.updateItems(this.dataModel.notRefundOnlineItems);
        this.checkNoRefundValue(this.dataModel);
        this.longCurrencyLgView = this.dataModel.longCurrencyLgView;
        this.longCurrencyXlView = this.dataModel.longCurrencyXlView;
    };

    // private verifyFigureLength = (infoTransformer: VoluntaryRefundsTransformerModel) => {
    //     if(infoTransformer.totalBookingPrice.length > 12  || infoTransformer.totalBookingPrice.length > 12  || infoTransformer.totalBookingPrice.length > 12 || infoTransformer.totalBookingPrice.length > 12 ){
    //         this.cssClassName = "ib-box-prices__price--long-lg"
    //     } 
    //     if (infoTransformer.totalBookingPrice.length > 7  || infoTransformer.totalBookingPrice.length > 7  || infoTransformer.totalBookingPrice.length > 7 || infoTransformer.totalBookingPrice.length > 7 ) {
    //         this.cssClassName = "ib-box-prices__price--long"
    //     }
    // }

    private voluntaryRefundsError = (error) => {
        this.model.showSpinner = false;
        this.isvoluntaryRefundSuccess = false;
        this.showErrorCalculateRefundService = true;
        this.MmBDatalayerUtilsService.updateDatalayerInfo(this.processByPaymentItem(), MMBDatalayerConstants.DIGITAL_DATA_STEP.REFVKO, MmBAppConstants.QUADRIGAM.VOL_REFUND_ERROR_LOAD_PAGE);
    };

    private addProcessDigitalData = (less24Hours: boolean, penalty: Penalty): string => {
        return this.processByPaymentItem() + ' ' + this.processByType(less24Hours, penalty);
    }

    private processByPaymentItem = (): string => {
        let process: string = MMBDatalayerConstants.DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING;
        const bookingInfo = this.CommonsSessionStorageService.get<any>('bookingInfo');
        bookingInfo.paymentItems?.map((paymentItem) => {
            if (paymentItem.type === 'VOUCHER') process = MMBDatalayerConstants.DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND;
            else if (paymentItem.type === 'AVIOS') process = MMBDatalayerConstants.DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS;
            else if (paymentItem.type === 'AVIOS_REDEMPTION') process = MMBDatalayerConstants.DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION;
        });
        return process;
    }

    private processByType = (less24Hours: boolean, penalty: Penalty): string => {
        let process: string;
        if (less24Hours) process = MMBDatalayerConstants.DIGITAL_DATA_REFUND_PROCESS_BY_TYPE.QUALITY_COMMITMENT;
        else if (penalty.avios > 0 || penalty.cash > 0) process = MMBDatalayerConstants.DIGITAL_DATA_REFUND_PROCESS_BY_TYPE.PENALTY;
        else process = MMBDatalayerConstants.DIGITAL_DATA_REFUND_PROCESS_BY_TYPE.WITHOUT_PENALTY;
        return process;
    }

    private toggleRefundBookingType = (less24Hours: boolean): void => {
        if (less24Hours) this.refundBookingType = bookingRefundType.GETTING_QUALITY_BOOKING;
        const bookingInfo = this.CommonsSessionStorageService.get<any>('bookingInfo');
        bookingInfo.paymentItems?.map((paymentItem) => {
            if (paymentItem.type === 'VOUCHER') this.refundBookingType = bookingRefundType.GETTING_BOOKING;
            else if (paymentItem.type === 'AVIOS') this.refundBookingType = bookingRefundType.GETTING_CASH_AVIOS_BOOKING;
            else if (paymentItem.type === 'AVIOS_REDEMPTION' && !less24Hours) this.refundBookingType = bookingRefundType.EXEMPTION_AVIOS_BOOKING;
            else if (paymentItem.type === 'AVIOS_REDEMPTION' && less24Hours) this.refundBookingType = bookingRefundType.EXEMPTION_QUALITY_BOOKING;
        });
    }

    private checkNotFlownFlights = (less24Hours: boolean): void => {
        const bookingInfo = this.CommonsSessionStorageService.get<any>('bookingInfo');
        let showNotSliceFlown: boolean = false;
        bookingInfo.order.slices.forEach((slice, idx) => {
            showNotSliceFlown = false;
            if (this.checkSliceNoShow(slice.sliceId)) {
                this.showFightsNotFlown = true;
                showNotSliceFlown = true;
            }
            else {
                slice.segments.forEach(segment => {
                    if (!this.flownOrFlyNow(segment)) {
                        this.showFightsNotFlown = true;
                        showNotSliceFlown = true;
                    }
                });
            }

            if (showNotSliceFlown) {
                this.notFlownFlights.push({
                    departureCity: `${slice.segments[0].departureCity.description}`,
                    arrivalCity: `${slice.segments[slice.segments.length - 1].arrivalCity.description}`,
                    departureDateTime: this.formatDate(slice.segments[0].departureDateTime.split(' ')[0].split('-')), departureHourTime: `${slice.segments[0].departureDateTime.split(' ')[1]} h.`,
                    fareName: this.getFareName(slice.segments[0].cabin.fareFamily),
                    icon: bookingInfo.order.slices.length > 2 ? MmBAppConstants.TRIP_TYPES.MULTITRIP : idx === 0 ? MmBAppConstants.TRIP_TYPES.DEPARTURE : MmBAppConstants.TRIP_TYPES.ARRIVAL,
                    sliceId: slice.sliceId,
                    departureCityCode: slice.segments[0].departureCity.code,
                    arrivalCityCode: slice.segments[slice.segments.length - 1].arrivalCity.code,
                    refundable: this.checkFlightsRefundable(slice.sliceId),
                    refundableNoShow: this.checkFlightsRefundableNoShow(slice.sliceId),
                    noShow: this.checkSliceNoShow(slice.sliceId),
                    refundableText: this.addLiteralRefundable(slice.sliceId)
                });
            }
        });

        if (less24Hours) {
            this.allSlicesRefundable = true;
        } else if (this.notFlownFlights.length > 0) {

            // ALL SLICES REFUNDABLE
            if (this.notFlownFlights.every(flight => (!flight.noShow && flight.refundable) || (flight.noShow && flight.refundableNoShow))) {
                this.allSlicesRefundable = true;
                // ALL SLICES NOT REFUNDABLE
            } else if (this.notFlownFlights.every(flight => (!flight.noShow && !flight.refundable) || (flight.noShow && !flight.refundableNoShow))) {
                this.allSlicesNotRefundable = true;
            } else {
                this.partialSlicesRefundable = true;
                this.slicesRefundable = this.notFlownFlights.filter(flight => (!flight.noShow && flight.refundable) || (flight.noShow && flight.refundableNoShow));
                this.slicesNotRefundable = this.notFlownFlights.filter(flight => (!flight.noShow && !flight.refundable) || (flight.noShow && !flight.refundableNoShow));
            }
        }

        this.checkCarrierChargeAmount(less24Hours);
    };

    private flownOrFlyNow = (segment): boolean => {
        return segment.flown || segment.flyNow;
    }

    private checkCarrierChargeAmount = (less24Hours: boolean): void => {
        if (less24Hours) {
            this.dataModel.taxes.listTaxedRefundInfo.filter((tax) => tax.type === "YQ").map(() => this.allYQRefundable = true);
        } else {
            this.dataModel.taxes.listTaxedRefundInfo.filter((tax) => tax.type === "YQ").map((item) => {
                this.dataModel.refundType === 'PARTIAL' ? this.checkCarrierChargeAmountPartial() : this.checkCarrierChargeAmountTotal(item);
            });
        }
    }

    private checkCarrierChargeAmountPartial = (): void => {
        const bookingInfo = this.CommonsSessionStorageService.get<any>('bookingInfo');
        if (bookingInfo.order.slices.length === 2) {
            if (this.dataModel.listFareBasisRefundInfo.every(slice => slice.refundable)) {
                this.allYQRefundable = true;
            } else if (this.dataModel.listFareBasisRefundInfo.every(slice => !slice.refundable)) {
                this.allYQNotRefundable = true;
            } else if (!this.dataModel.listFareBasisRefundInfo.every(slice => slice.refundable)) {
                this.notFlownFlights[0].refundable ? this.allYQRefundable = true : this.allYQNotRefundable = true;
            }
        } else {
            if (this.notFlownFlights.every(flight => flight.refundable)) {
                this.allYQRefundable = true;
            } else if (this.notFlownFlights.every(flight => !flight.refundable)) {
                this.allYQNotRefundable = true;
            } else if (!this.notFlownFlights.every(flight => flight.refundable)) {
                this.partialYQRefundable = true;
                this.slicesRefundable = [...this.notFlownFlights.filter(flight => flight.refundable)];
                this.slicesNotRefundable = [...this.notFlownFlights.filter(flight => !flight.refundable)];
            }
        }
    }

    private checkCarrierChargeAmountTotal = (taxedRefundInfo: listTaxedRefundInfo): void => {
        if (taxedRefundInfo.refundable && !taxedRefundInfo.parcial) {
            this.allYQRefundable = true;
        } else if (!taxedRefundInfo.refundable) {
            this.allYQNotRefundable = true;
        } else if (taxedRefundInfo.refundable && taxedRefundInfo.parcial) {
            this.partialYQRefundable = true;
        }
    }

    private addLiteralRefundable = (orderSliceId): string => {
        if ((!this.checkSliceNoShow(orderSliceId) && this.checkFlightsRefundable(orderSliceId)) || this.checkSliceNoShow(orderSliceId) && this.checkFlightsRefundableNoShow(orderSliceId)) {
            return this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_REFUND');
        }

        return this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_NOT_REFUND');
    }

    private checkFlightsRefundable = (orderSliceId): boolean => {
        let refundable = this.dataModel.listFareBasisRefundInfo.find(list => list.sliceId && list.sliceId === orderSliceId)?.refundable;

        return refundable !== undefined ? refundable : false; //Default
    };

    private checkFlightsRefundableNoShow = (orderSliceId): boolean => {
        let refundableNoShow = this.dataModel.listFareBasisRefundInfo.find(list => list.sliceId && list.sliceId === orderSliceId)?.refundableNoShow;

        return refundableNoShow !== undefined ? refundableNoShow : false; //Default
    };

    private formatDate = (date): string => {
        let formatedDate = '';
        formatedDate = `${date[2]}/${date[1]}/${date[0]}`;
        return formatedDate;
    }

    private getFareName = (fareFamily): string => {
        const bookingInfo = this.CommonsSessionStorageService.get<any>('bookingInfo');
        const fareFamilyConditionsBookingInfo: CommonsFareFamilyConditionsInfo.FareFamilyConditionsInfo = bookingInfo.fareFamilyConditions;
        let fareName: string = '';
        const language = bookingInfo.contextMetadata.language;
        const fareFamilyConditions = this.CommonsSessionStorageService.get<CommonsFareFamilyConditionsInfo.FareFamilyConditionsInfo>('fareFamilyConditions') ?? fareFamilyConditionsBookingInfo ? fareFamilyConditionsBookingInfo : [];
        if (fareFamilyConditions) {
            Object.entries(fareFamilyConditions).forEach(([key, value]) => {
                if (value.commercialCode === fareFamily) {
                    fareName = language === 'es' ? value.commercialNameES : value.commercialName;
                }
            });
        };
        return fareName;
    }

    private checkNoRefundValue = (dataModel: VoluntaryRefundsTransformerModel): void => {
        let noRefundValue = dataModel.less24Hours ?
            Math.round((dataModel.price.totalCash * 100) / 100) - Math.round((dataModel.price.totalRefundPrice * 100) / 100) :
            Math.round((dataModel.price.totalCash * 100) / 100) - Math.round((dataModel.penalty.cash * 100) / 100) - Math.round((dataModel.price.totalRefundPrice * 100) / 100);
        noRefundValue === 0 ? this.showNoRefundValue = false : this.showNoRefundValue = true;
    }

    private openFullScreenModal = () => {
        const options = {
            windowClass: "ib-modals-full",
        };
        const modalRef: IbModalRef<IbMmBVoluntaryRefundsComponent> = this.IbCModalService.showGenericComponentModal(
            IbMmBVoluntaryRefundsComponent,
            options
        );
        modalRef.componentInstance.dataModelRefund = this.dataModel;
    };

    requestRefund = () => {
        this.openFullScreenModal();
    }

    private updateItems = (refundItemsType: string[]): UpdateItems[] => {
        let refundItems: UpdateItems[] = [];
        for (let item of refundItemsType) {
            refundItems.push(this.updateItemsText(item));
        }

        return refundItems;
    }

    private updateItemsText = (serviceType: string): UpdateItems => {
        const bookingInfo: any = this.CommonsSessionStorageService.get('bookingInfo') ?? {};
        const tagsInfo = {
            link: {
                tag: 'a',
                href: '#',
                target: '_blank',
                title: '',
                class: 'ib-link ib-link--underline ib-box-included__item-link'
            }
        };
        let contextMetadata = bookingInfo.contextMetadata;
        let serviceRefundItems: UpdateItems = {
            serviceType: serviceType,
            serviceText: '',
            serviceDescription: ''
        };
        let mainUrl, endPath, url, endMarketLanguage;
        let market = contextMetadata.country.toLowerCase();
        let language = contextMetadata.language.toLowerCase();
        mainUrl = 'https://www.iberia.com/';
        switch (serviceType) {
            // REFUNDS ITEMS
            case 'seat':
                serviceRefundItems.serviceText = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_INCLUDES_SEAT');
                serviceRefundItems.serviceDescription = '';
                break;
            case 'baggage':
                serviceRefundItems.serviceText = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_INCLUDES_BAGGAGE');
                serviceRefundItems.serviceDescription = '';
                break;
            case 'priorityBoarding':
                serviceRefundItems.serviceText = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_INCLUDES_PRIORITY');
                serviceRefundItems.serviceDescription = '';
                break;
            // END REFUNDS ITEMS

            // NOT REFUNDS ITEMS
            case 'specialEquipment':
                serviceRefundItems.serviceText = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_INCLUDES_SPECIAL_BAGGAGE');
                // serviceRefundItems.serviceDescription = 'https://iberia.allianz-assistance.com/';
                break;
            case 'insurance':
            case 'InsuranceOrderItemWebResponse':
                tagsInfo.link.href = 'https://iberia.allianz-assistance.com/';
                serviceRefundItems.serviceText = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_INSURANCE');
                serviceRefundItems.serviceDescription = this.LiteralFormatterPipe.transform(this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_CONTACT_INSURANCE'), tagsInfo);
                break;
            case 'creditCardFee':
                serviceRefundItems.serviceText = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_CREDITCARD');
                // serviceRefundItems.serviceDescription = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_NOT_REFUNDS');
                break;
            case 'preOrder':
                tagsInfo.link.href = 'https://pre-order.iberia.com/landing/';
                serviceRefundItems.serviceText = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_PREORDER');
                serviceRefundItems.serviceDescription = this.LiteralFormatterPipe.transform(this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_CONTACT_PREORDER'), tagsInfo);
                break;
            case 'globickV2':
                endPath = language === 'es' ? 'experiencias/actividades/' : 'experiences/activities/';
                url = mainUrl + 'es/' + endPath;
                tagsInfo.link.href = url;
                serviceRefundItems.serviceText = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_GLOBICK');
                serviceRefundItems.serviceDescription = this.LiteralFormatterPipe.transform(this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_CONTACT_GLOBICK'), tagsInfo);
                break;
            case 'TRANS':
                endPath = language === 'es' ? 'experiencias/actividades/' : 'experiences/activities/';
                url = mainUrl + 'es/' + endPath;
                tagsInfo.link.href = url;
                serviceRefundItems.serviceText = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_TRAS');
                serviceRefundItems.serviceDescription = this.LiteralFormatterPipe.transform(this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_CONTACT_GLOBICK'), tagsInfo);
                break;
            case 'EXP':
                endPath = language === 'es' ? 'experiencias/actividades/' : 'experiences/activities/';
                url = mainUrl + 'es/' + endPath;
                tagsInfo.link.href = url;
                serviceRefundItems.serviceText = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_EXP');
                serviceRefundItems.serviceDescription = this.LiteralFormatterPipe.transform(this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_CONTACT_GLOBICK'), tagsInfo);
                break;
            case 'bob':
                endPath = language === 'es' ? 'facturar-equipaje/' : language === 'ca' ? 'facturar-equipatge/' : 'check-in-luggage/';
                url = mainUrl + 'es/' + endPath;
                tagsInfo.link.href = url;
                serviceRefundItems.serviceText = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_BOB');
                serviceRefundItems.serviceDescription = this.LiteralFormatterPipe.transform(this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_CONTACT_BOB'), tagsInfo);
                break;
            case 'wineClub':
                endPath = language === 'es' || language === 'ca' || language === 'de' || language === 'zh' || language === 'ja' || language === 'ru' ? 'club-del-vino/' : 'wine-club/';
                endMarketLanguage = market === 'cn' || market === 'ja' || market === 'ru' ? 'es/en/' : `${market}/${language}/`;
                url = mainUrl + endMarketLanguage + endPath;
                tagsInfo.link.href = url;
                serviceRefundItems.serviceText = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_WINE');
                serviceRefundItems.serviceDescription = this.LiteralFormatterPipe.transform(this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_CONTACT_WINE'), tagsInfo);
                break;
            case 'stopover':
                endPath = `${market}/${language}/stopover-in-madrid/`;
                url = mainUrl + endPath;
                tagsInfo.link.href = url;
                serviceRefundItems.serviceText = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_STOPOVER');
                serviceRefundItems.serviceDescription = this.LiteralFormatterPipe.transform(this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_CONTACT_STOPOVER'), tagsInfo);
                break;
            // END NOT REFUNDS ITEMS
            case 'TAXES':
                serviceRefundItems.serviceText = this.translate.instant('MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_INCLUDES_AIRPORT_TAX_AMOUNT');
                serviceRefundItems.serviceDescription = '';
                break;
        }
        return serviceRefundItems;
    }

    private checkSliceNoShow = (sliceId): boolean => {
        let noShow = false;
        this.dataModel.listFareBasisRefundInfo.filter((slice) => {
            if (slice.sliceId === sliceId) noShow = slice.noShow;
        })
        return noShow;
    }

    private generateMoreInfoUrl = () => {
        let mainUrl, endPath, url;
        let market = this.$rootScope.appMarket.toLowerCase();
        let language = this.$rootScope.appLang.toLowerCase();
        mainUrl = `https://www.iberia.com/${market}/`;
        endPath = this.getEndPath(language);
        url = mainUrl + endPath;
        return url;
    }

    private getEndPath = (language) => {
        let endPath;
        switch (language) {
            case 'es':
                endPath = MmBAppConstants.VOLUNTARY_REFUNDS_NOT_REFUNDS_ITEMS_ROUTES.ES;
                break;
            case 'pt':
                endPath = MmBAppConstants.VOLUNTARY_REFUNDS_NOT_REFUNDS_ITEMS_ROUTES.PT;
                break;
            case 'ca':
                endPath = MmBAppConstants.VOLUNTARY_REFUNDS_NOT_REFUNDS_ITEMS_ROUTES.CA;
                break;
            case 'en':
                endPath = MmBAppConstants.VOLUNTARY_REFUNDS_NOT_REFUNDS_ITEMS_ROUTES.EN;
                break;
            case 'fr':
                endPath = MmBAppConstants.VOLUNTARY_REFUNDS_NOT_REFUNDS_ITEMS_ROUTES.FR;
                break;
            case 'it':
                endPath = MmBAppConstants.VOLUNTARY_REFUNDS_NOT_REFUNDS_ITEMS_ROUTES.IT;
                break;
            case 'nl':
                endPath = MmBAppConstants.VOLUNTARY_REFUNDS_NOT_REFUNDS_ITEMS_ROUTES.NL;
                break;
            case 'de':
                endPath = MmBAppConstants.VOLUNTARY_REFUNDS_NOT_REFUNDS_ITEMS_ROUTES.DE;
                break;
            case 'ru':
                endPath = MmBAppConstants.VOLUNTARY_REFUNDS_NOT_REFUNDS_ITEMS_ROUTES.RU;
                break;
            default:
                endPath = MmBAppConstants.VOLUNTARY_REFUNDS_NOT_REFUNDS_ITEMS_ROUTES.EN;
                break;
        }
        return endPath;
    };
}
downgradeToAJSComponent(
    "ibMmbVoluntaryRefundsTab",
    {
        component: ibMmbVoluntaryRefundsTabComponent,
        inputs: [],
    },
    "ib-MmB-voluntary-refunds-tab-module"
);
