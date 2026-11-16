import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import angular from 'angular';
import { AJSCurrencyService, AJSRootScope, CommonsCookiesService, CommonsSessionStorageService, IbCUserUtilsService, downgradeToAJSComponent } from 'ib-web-commons/utils';
import { MmbConfirmationTransformer } from './services/ib-mmb-confirmation-transformer';
import { AJSMmBDatalayerUtilsService, AJSMmBDatalayerUtilsServiceType } from '../services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service-bridge.service';
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { AJSMmbUtilService } from '../services/Utils/ib-mmb-utils-bridge.service';
import { MmBUtilService } from '../services/Utils/ib-MmB-utils';
import { TranslateService } from '@ngx-translate/core';
import { AJSMmBDigitalDataService } from '../services/ib-MmB-datalayer/services/ib-mmb-digital-data-bridge.service';
import { MmBDigitalDataService } from '../services/ib-MmB-datalayer/services/ib-MmB-digital-data-service';
import { MmBAppConstants } from "@src/ib-MmB-constants";
import { AJSMmbModalService, MmbModalServiceType } from '../ib-reusable-components/ib-MmB-modal/services/upgraded/ib-Mmb-modal-service-bridge.service';
import { DatalayerEcommerceService } from '../services/ib-MmB-datalayer/services/ib-mmb-datalayer-ecommerce.service';
import { MarketingPermissionService } from './services/ib-marketing-permission-service';

@Component({
    selector: 'ib-mmb-confirmation-page',
    templateUrl: './ib-mmb-confirmation-page.component.html',
    styleUrls: ['./ib-mmb-confirmation-page.component.scss'],
    providers: []
})
export class IbMmbConfirmationComponent implements OnInit, OnDestroy {

    @Input() model;
    @Input() asComponent;

    summaryPayment: any = this.localStorageService.get('mmbAncillariesPaymentSummaryModel') || {};
    pointsData: any = this.localStorageService.get('CalculatedPoints');
    flowApp = this.localStorageService.get('flowApp');
    issueOrderInfo: any = this.localStorageService.get('issueOrderInfo');
    ibPayTrace = this.localStorageService.get('ibPayTrace');
    aviosToEarn = this.pointsData && this.pointsData?.Avios !== 0 ? this.pointsData.Avios : undefined;
    elitePointsToEarn = this.pointsData && this.pointsData?.Elite !== 0 ? this.pointsData.Elite : undefined;
    deepLinkData;
    currency;
    total;
    email;
    firstPassengerName;
    co2InfoBannerModel;
    showCarbonFootprintBanner;
    totalDcc: string;


    constructor(
        @Inject(AJSRootScope) public $rootScope: CommonsRootScope,
        @Inject(AJSMmBDatalayerUtilsService) private MmBDatalayerUtilsService: AJSMmBDatalayerUtilsServiceType,
        @Inject(AJSMmbUtilService) private MmBUtilService: MmBUtilService,
        @Inject(AJSCurrencyService) private CurrencyService: CurrencyService,
        @Inject(AJSMmBDigitalDataService) private DigitalDataService: MmBDigitalDataService,
        @Inject(AJSMmbModalService) private MmBModalService: MmbModalServiceType,
        private DatalayerEcommerceService: DatalayerEcommerceService,
        private localStorageService: CommonsSessionStorageService,
        // private PmtDatalayerUtilsService,
        private MmbConfirmationTransformer: MmbConfirmationTransformer,
        private translateService: TranslateService,
        private MarketingPermissionService: MarketingPermissionService,
        private CommonsUserUtilsService: IbCUserUtilsService,
        private CommonsCookiesService: CommonsCookiesService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {
        this.$rootScope.showMainHeader = true;
        this.model = {
            seats: this.MmbConfirmationTransformer.transformInfoConfirmation(),
            co2Info: this.MmbConfirmationTransformer.transformCO2InfoConfirmation()
        };
    };

    ngOnInit(): void {
        const bookingInfo: any = this.localStorageService.get('bookingInfo')
        const paymentInfo: any = this.localStorageService.get('paymentsInfo');
        const headerModel: any = this.localStorageService.get('headerModel');
        const quadrigam = MmBAppConstants.QUADRIGAM.MMB_NEW_ANCILLARIES_CONFIRMATION;

        window.document.title = this.translateService.instant('MMB_TITLE_PAGE_CONFIRMATION_ANC');
        this.checkMarketingPermission();
        this.$rootScope.$broadcast('clearBasket', {});
        this.clearBreakdownInfo();
        if (this.localStorageService.get('deepLinkData')) {
            this.deepLinkData = this.localStorageService.get('deepLinkData');
        }

        // WHEN issueOrderInfo.data is NEW PAYMENT MMB
        this.issueOrderInfo = this.issueOrderInfo.data ? this.issueOrderInfo.data : this.issueOrderInfo;
        this.currency = this.issueOrderInfo.currencies[0];
        this.total = this.CurrencyService.formatPrice(this.currency, this.issueOrderInfo.total, true);

        if(headerModel?.headerModel?.shoppingBasket) {
            this.summaryPayment.shoppingBasket = headerModel.headerModel.shoppingBasket;
        }
        this.summaryPayment.discount = null;
        this.applyDiscountIfNeeded(paymentInfo);

        this.fillEmailInfo(bookingInfo);
        this.fillPassengerName(bookingInfo);
        this.displayCarbonFootprintBanner(bookingInfo);
        this.updateDatalayerInfo(quadrigam, bookingInfo);
        this.getTotalDcc(headerModel);
    } 

    printSummary = () => {
        window.print();
    };

    ngOnDestroy(): void {
        if (this.localStorageService.get('flowApp') === MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || this.localStorageService.get('flowApp') === MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
            this.resetDatalayer();
        }
    };

    private applyDiscountIfNeeded(paymentInfo): void {
        const voucherInfo: any = this.localStorageService.get('voucherInfo');

        if (!voucherInfo?.amount) {
            return;
        }

        if (this.isAppliedDiscountVoucher(paymentInfo)) {
            this.summaryPayment.discount = {
                id: voucherInfo.voucherId,
                amount: this.CurrencyService.formatPrice(this.currency, voucherInfo.amount, true)
            };
            this.total = this.CurrencyService.formatPrice(
                this.currency,
                this.issueOrderInfo.total - voucherInfo.amount,
                true
            );
        }

        else if (this.isAppliedDiscountAvios(paymentInfo)) {
            this.summaryPayment.discount = {
                id: voucherInfo.voucherId,
                amount: this.CurrencyService.formatPrice(this.currency, voucherInfo.amount, true),
                rewardCode: voucherInfo.rewardCode
            };
            this.total = this.CurrencyService.formatPrice(
                this.currency,
                this.issueOrderInfo.total - voucherInfo.amount,
                true
            );
        }
    }

    private isAppliedDiscountVoucher = (paymentInfo) => {
        return paymentInfo?.appliedDiscounts?.status && paymentInfo?.appliedDiscounts?.types?.VOUCHER;
    };

    private isAppliedDiscountAvios = (paymentInfo) => {
        return paymentInfo?.appliedDiscounts?.status && paymentInfo?.appliedDiscounts?.types?.AVIOS;
    };

    private clearBreakdownInfo = (): void => {
        const breakdownInfo: any = this.localStorageService.get('breakdownInfo');
        if(breakdownInfo.pendingPaymentItems) breakdownInfo.pendingPaymentItems = [];
        this.localStorageService.set('breakdownInfo', breakdownInfo);
        this.localStorageService.set('RechargeBookingInfo', true);
    };

    private updateDatalayerInformation = (): void => {
        const confirmationDatalayerInfo: any = {};
        const selectedCardType = this.localStorageService.get('typeCardIberiaPay');
        if (selectedCardType) {
            confirmationDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.CREDITCARD_TYPE] = selectedCardType;
        }
        this.MmBDatalayerUtilsService.addDataLayerInfo(confirmationDatalayerInfo);
    };

    private setOrderInfoDatalayer = (bookingInfo): void => {
        const flowApp = this.localStorageService.get('flowApp');
        const orderInfo = { OrderId: bookingInfo.order.orderId };
        if (orderInfo?.OrderId && flowApp === MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE) {
            this.MmBDatalayerUtilsService.addDataLayerInfo(orderInfo);
        }
    };

    private setPaymentMethod = (): void => {
        const cardSelectedLogged: any = this.localStorageService.get('selectedLoggedCard');
        const cardTypeSelected = this.localStorageService.get('typeCardIberiaPay');
        const digitalDataObject = {};
        cardSelectedLogged ?
            digitalDataObject[MMBDatalayerConstants.DatalayerGeneralConstants.PAYMENT_METHOD] = cardSelectedLogged.cardTypeCode:
            cardTypeSelected ? digitalDataObject[MMBDatalayerConstants.DatalayerGeneralConstants.PAYMENT_METHOD] = cardTypeSelected : angular.noop;
        this.MmBDatalayerUtilsService.addDigitalDataInfo( digitalDataObject );
    };

    private getOrderId = (order): void => {
        const digitalDataObject = {};
        order.orderId ? digitalDataObject[MMBDatalayerConstants.DatalayerGeneralConstants.ORDER_ID] = order.orderId : angular.noop;
        this.MmBDatalayerUtilsService.addDigitalDataInfo( digitalDataObject );
    };

    private displayCarbonFootprintBanner = (bookingInfo: any): void => {
        this.co2InfoBannerModel = {
            name: this.firstPassengerName,
            kilosCo2eFormatted: this.model.co2Info?.kilosCo2EquivalentFormatted,
            priceFormatted: this.model.co2Info?.priceFormatted,
            flight: {
                numPax: bookingInfo?.passengers?.length || 0,
                segments: this.calculateSegmentsCarbonFootPrint(bookingInfo)
            }
        };
        this.showCarbonFootprintBanner = this.isShowCarbonFootprintBanner(bookingInfo);
    };

    private checkMarketingPermission = (): void => {
        if(this.CommonsUserUtilsService.isIbPlus() && !this.CommonsCookiesService.getCookie(MmBAppConstants.COOKIES.NO_MARKETING_PERMISSION)) {
            this.CommonsCookiesService.setCookieTime(MmBAppConstants.COOKIES.NO_MARKETING_PERMISSION, true, this.selectCookieTime());
            this.MarketingPermissionService.getMarketingPermissions().then((response) => {
                const commercialCamp =  response.data.find((element) => element.permissionType === 'COMMERCIAL_CAMPAIGN')?.permissionGranted;
                if (!commercialCamp) {
                    this.MmBModalService.showGenericModal(true, 'ib-modal-marketing-permission.html', null, null).result.finally(()=>{});
                }
            });
        }
    };

    private selectCookieTime = (): number => {
        return this.CommonsSessionStorageService.get('showMarketingPermission') ? MmBAppConstants.COOKIES.MARKETING_PERMISSION_TEST_EXPIRY_TIME :
        MmBAppConstants.COOKIES.MARKETING_PERMISSION_EXPIRY_TIME;
    };

    private setDigitalDataInfo = (): void => {
        const points: any = this.localStorageService.get('CalculatedPoints') || { Avios: '0', Elite: '0' };
        const dataLayer = {
            AviosEarned: parseInt(points.Avios)
        };
        this.MmBDatalayerUtilsService.addDigitalDataInfo(dataLayer);
    };

    private updateDatalayerInfo = (quadrigam: string, bookingInfo: any): void => {
        if (quadrigam) {
            this.setPaymentMethod();
            this.setOrderInfoDatalayer(bookingInfo);
            this.getOrderId(bookingInfo.order);
            this.updateDatalayerInformation();
            this.setDigitalDataInfo();
            this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam], quadrigam);
            this.DatalayerEcommerceService.setAddPurchase(this.model.confirmationInfo);
        }
    };

    private resetDatalayer = () => {
        var elementsDataLayer = [];
        var dataLayerModelVC = this.localStorageService.get('cvDatalayer');

        Object.keys(dataLayerModelVC).forEach(function (element) {
            if (element.toString() !== MMBDatalayerConstants.DATALAYER_INFO.USER_STATE && element.toString() !== MMBDatalayerConstants.DATALAYER_INFO.TOTAL_PRICE_WITHOUT_FEE && element.toString() !== MMBDatalayerConstants.DATALAYER_INFO.TOTAL_PRICE) {
                elementsDataLayer.push(element.toString());
            }
        })
        this.MmBDatalayerUtilsService.removeDatalayerObjects(elementsDataLayer);
    };

    private fillEmailInfo = (bookingInfo: any): void => {
        if (bookingInfo?.order?.primaryContactInfo) {
            this.email = bookingInfo.order.primaryContactInfo.email;
        } else {
            this.email = '';
        }
    };

    private fillPassengerName = (bookingInfo: any): void => {
        if (bookingInfo?.passengers) {
            const firstPassenger = bookingInfo.passengers[0];
            if (firstPassenger?.externalPersonalInfo) {
                this.firstPassengerName = firstPassenger.externalPersonalInfo.name;
            } else if (firstPassenger?.personalInfo) {
                this.firstPassengerName = firstPassenger.personalInfo.name;
            }
        }
    };

    private isShowCarbonFootprintBanner = (bookingInfo) => {
        return Boolean(this.model.co2Info &&
            !this.summaryPayment.shoppingBasket.carbonFootprint?.hasCarbonFootprint &&
            !bookingInfo?.order?.orderItems?.some(item => item.type === MmBAppConstants.ORDER_ITEMS_TYPES.CO2_FOOTPRINT && item.orderId))
    };

    private calculateSegmentsCarbonFootPrint = (bookingInfo) => {
        bookingInfo?.order?.slices?.flatMap(slice => slice.segments.map(segment => {
            return {from: segment.departure.code, to: segment.arrival.code, cabin: segment.cabin.type};
        }))
    };

    // private isAppliedDiscountVoucher = (paymentInfo) => {
    //     return paymentInfo?.appliedDiscounts?.status && paymentInfo?.appliedDiscounts?.types?.VOUCHER;;
    // };

    // private isAppliedDiscountAvios = (paymentInfo) => {
    //     return paymentInfo?.appliedDiscounts?.status && paymentInfo?.appliedDiscounts?.types?.AVIOS;
    // };

    private getTotalDcc = (headerModel: any): void => {
        const totalDcc = headerModel?.headerModel?.shoppingBasket?.total?.totalDcc;
        if (totalDcc) {
            this.totalDcc = totalDcc;
        }
    }
}
downgradeToAJSComponent(
    'ibMmbConfirmationPage',
    {
        component: IbMmbConfirmationComponent,
        inputs: [],
        outputs: []
    },
    'ib-mmb-confirmation-page-module',
    []
);
