import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs';
import { AJSRootScope, downgradeToAJSComponent } from 'ib-web-commons/utils';

import { ICheckinStatusTime, IDeeplink } from '@src/app/core/models/ib-check-in-flights-passengers/ib-ticket-selection.model';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { AJSWindow } from '@src/app/core/config/ib-checkin-app-tokens';
import { AJSCommonsUtilService } from '@src/app/shared/services/bridges/ib-commons-util-bridge.service';
import { AJSCheckForDeepLink, ICheckForDeepLink } from '@src/app/shared/services/bridges/ib-check-for-deeplink-bridge.service';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';

@Component({
    selector: 'ib-ticket-selection',
    templateUrl: './ib-ticket-selection.component.html',
    styleUrls: ['./ib-ticket-selection.component.scss']
})
export class IbTicketSelectionComponent {
    @Input() selectionInfo: CkiSegmentsSelected.Segment;
    @Input() index: number;
    @Input() isShuttleSelected: boolean;

    showAircheckMessage: boolean;
    deeplink: IDeeplink = {
        show: false,
        companyDescription: ''
    };
    checkInStatusTime: ICheckinStatusTime = {
        show: false,
        message: ''
    };
    iconPaSrc: string = '';
    private SEGMENT_LITERALS = {
        OPEN: 'IBCOAC_TICKET_OPEN_TEXT',
        AVAILABLE: 'IBCOAC_CK_PASS_ABIERTO',
        SELECTABLE: 'IBCOAC_CK_TICKET_GDR',
        CHECKED: 'IBCOAC_TICKET_CHECKED_TEXT',
        CHECKED_AIRCHECK: 'IBCOAC_TICKET_CHECKED_TEXT_AIRCHECK',
        NOT_AVAILABLE: 'IBCOAC_PA_SEGMENT_FOOTER_UNCHECKABLE',
        BP_SUBSCRIPTION_AVAILABLE: 'IBCOAC_CK_PASS_ABIERTO_BP_SUBSCRIPTION',
        BP_SUBSCRIPTION_CHECKED: 'IBCOAC_TICKET_CHECKED_TEXT_BP_SUBSCRIPTION'
    };
    isSelected: boolean = false;
    @ViewChild('checkbox') checkbox!: ElementRef<HTMLInputElement>;
    isBpSubscriptionMode: boolean = false;
    isContentHidden: boolean = false;

    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        private translateService: TranslateService,
        @Inject(AJSWindow) private $window: ng.IWindowService,
        @Inject(AJSCommonsUtilService) private CommonsUtilService: CommonsUtilService,
        @Inject(AJSCheckForDeepLink) private CheckForDeepLink: ICheckForDeepLink,
        private IbUtilsService: IbUtilsService
    ) {
        this.iconPaSrc = `${$rootScope.routes.icons}/puente_aereo/logo_pte_aero_short_es.png`;
        this.isBpSubscriptionMode = this.IbUtilsService.getBpSubscriptionMode();
        this.isContentHidden = this.isBpSubscriptionMode || this.IbUtilsService.isCC();
    }

    getTitle () {
        const titles: Record<CkiSegmentsSelected.TSegmentStatus, string> = {
            'AVAILABLE': 'IBCOAC_CK_VUE_ABIERTO',
            'SELECTABLE': 'IBCOAC_CK_VUE_ABIERTO',
            'NOT_AVAILABLE': 'IBCOAC_CK_NO_DISPONIBLE',
            'CHECKED': 'IBCOAC_PA_SEGMENT_FOOTER_CHECKED'
        };

        return titles[this.selectionInfo.segmentStatus] ?? '';
    }

    infoSegment () {
        const isOpenType = this.selectionInfo?.detailedType === 'OPEN';

        this.showAircheckMessage = this.shouldShowAircheckMessage();

        const literal = isOpenType
            ? this.SEGMENT_LITERALS.OPEN
            : this.getLiteralByStatus(this.showAircheckReason());

        return this.translateService.instant(literal);
    }

    goToUrlCompany () {
        const deepLinkInformation = this.selectionInfo.deepLinkInformation;
        const device = this.IbUtilsService.getDeviceType();
        const url = device === 'mobile' ? deepLinkInformation.externalMobileUrl : deepLinkInformation.externalUrl;
        this.$window.location.href = url;
    }

    showCheckInStatusTime () {
        const checkInStatusTime = this.selectionInfo.checkInStatusTime;
        const isNotAvailableStatus = this.selectionInfo.segmentStatus === CheckinAppConstants.GENERAL_STATUS.NOT_AVAILABLE;

        if (!this.shouldShowCheckInStatusTime(isNotAvailableStatus, checkInStatusTime)) {
            return this.checkInStatusTime.show = false;
        }

        const isNotAllowStatus = this.isNotAllowedReason(this.selectionInfo.segmentStatusReasonCode);
        const literal = this.getLiteralNotAvailableStatus(isNotAllowStatus);
        const openDate = dayjs(checkInStatusTime.openDateTime, 'YYYY-MM-DDTHH:mm:ss.SSS');

        this.checkInStatusTime.message = this.buildCheckInStatusMessage(literal, openDate);
        this.checkInStatusTime.show = true;

        return this.checkInStatusTime.show;
    }

    selectShuttleSegment () {
        this.$rootScope.$broadcast('selectShuttleSegmentEvent', this.selectionInfo);
    }

    openSegmentInfo () {
        if (this.deeplink.show) {
            this.openModalDeeplink();
        } else {
            this.$rootScope.$broadcast('openSegmentInfoEvent', this.selectionInfo.segmentStatusReason);
        }
    }

    checkSelectedSegments () {
        this.$rootScope.$broadcast('checkSelectedSegmentsEvent', this.index);

        this.checkbox.nativeElement.checked = this.selectionInfo.isSelected;
    }

    getTitleClasses () {
        const isCheckedBpSubscription = this.selectionInfo.segmentStatus === 'CHECKED' && this.isBpSubscriptionMode;

        return [
            this.getIconTitle(),
            isCheckedBpSubscription ? 'success-title' : '',
            this.isBpSubscriptionMode ? 'show section-title' : ''
        ];
    }

    private getIconTitle () {
        if (this.isBpSubscriptionMode) return 'icon-despegue';

        if (this.selectionInfo.segmentStatus === 'CHECKED') return 'icon-confirmacion';

        return 'icon-despegue';
    }

    private openModalDeeplink () {
        this.CheckForDeepLink.checkDeepLink(this.selectionInfo.deepLinkInformation);
    }

    private shouldShowAircheckMessage () {
        return this.selectionInfo?.segmentStatus !== CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.NOT_AVAILABLE && this.hasAircheck();
    }

    private getLiteralByStatus (showAircheck: boolean) {
        const { AVAILABLE, SELECTABLE, CHECKED, NOT_AVAILABLE } = CheckinAppConstants.FLIGHT_PASSENGERS_STATUS;
        const statusMap = {
            [AVAILABLE]: this.isBpSubscriptionMode
                ? this.SEGMENT_LITERALS.BP_SUBSCRIPTION_AVAILABLE
                : this.SEGMENT_LITERALS.AVAILABLE,
            [SELECTABLE]: this.SEGMENT_LITERALS.SELECTABLE,
            [CHECKED]:
                showAircheck ? this.SEGMENT_LITERALS.CHECKED_AIRCHECK :
                    this.isBpSubscriptionMode ? this.SEGMENT_LITERALS.BP_SUBSCRIPTION_CHECKED : this.SEGMENT_LITERALS.CHECKED,
            [NOT_AVAILABLE]: this.getLiteralByStatusNotAvailable(this.selectionInfo.deepLinkInformation)
        };

        return statusMap[this.selectionInfo.segmentStatus] || '';
    }

    private getLiteralByStatusNotAvailable (deepLinkInformation: CkiSegmentsSelected.IDeepLink) {
        const existDeepLinkInformation = typeof deepLinkInformation?.externalCompany?.code === 'string';
        let literal = this.SEGMENT_LITERALS.NOT_AVAILABLE;

        if (existDeepLinkInformation) {
            literal = 'IBCOAC_TICKET_DEEPLINK_TEXT';
            this.deeplink.show = true;
            this.deeplink.companyDescription = deepLinkInformation.externalCompany?.description || 'IBCOAC_PA_SEGMENT_FOOTER_UNCHECKABLE_MORE';
        }

        return literal;
    }

    private showAircheckReason () {
        const firstPassenger = this.selectionInfo.passengersStatus[0];
        const REASONS = CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES;
        return this.selectionInfo.passengersStatus?.length > 0 &&
            Array.isArray(firstPassenger.inhibitBoardingCard.reason) &&
            firstPassenger.inhibitBoardingCard.reason.some(item =>
                item === REASONS.AIRCHECK_REASON ||
                item === REASONS.BOKO_AIRCHECK_REASON
            );
    }

    private hasAircheck () {
        return this.selectionInfo?.airCheck?.status && this.selectionInfo.airCheck.url?.length > 0;
    }

    private shouldShowCheckInStatusTime (isNotAvailableStatus: boolean, checkInStatusTime: CkiBookingInfo.CheckInStatusTime) {
        const statusWindow = ['OPEN', 'CLOSE'];

        return Boolean(
            isNotAvailableStatus &&
            checkInStatusTime &&
            statusWindow.includes(checkInStatusTime.window) &&
            checkInStatusTime.openDateTime
        );
    }

    private isNotAllowedReason (reasonCode: string) {
        const notAllowedReasons = [
            'DEPARTURE_EARLY_NOT_ALLOWED',
            'ARRIVAL_EARLY_NOT_ALLOWED'
        ];

        return notAllowedReasons.includes(reasonCode);
    }

    private getLiteralNotAvailableStatus (isNotAllowStatus: boolean) {
        const DEFAULT_LITERAL = 'IBCOAC_TICKET_CHECKIN_STATUS_TIME_OPEN_MORE_THAN_24h';
        const LESS_THAN_24H_LITERAL = 'IBCOAC_TICKET_CHECKIN_STATUS_TIME_OPEN_LESS_THAN_24h';

        if (!isNotAllowStatus) {
            return DEFAULT_LITERAL;
        }

        const isWithin24h = this.checkDateAgainstNow(this.selectionInfo.checkInStatusTime.openDateTime);

        return isWithin24h
            ? LESS_THAN_24H_LITERAL
            : DEFAULT_LITERAL;
    }

    private checkDateAgainstNow (date: string) {
        const target = dayjs(date);
        const now = dayjs();

        const diffHours = target.diff(now, 'hour', true);

        return diffHours >= 0 && diffHours <= 24;
    }

    private buildCheckInStatusMessage (literal: string, date: dayjs.Dayjs) {
        const textToReplaceList = ['#dd#', '#mm#', '#hh#'];
        const variableList = [
            date.format('DD'),
            date.format('MM'),
            date.format('HH:mm')
        ];

        return this.CommonsUtilService.translateTextAndAddVariablesArray(
            literal,
            variableList,
            textToReplaceList
        );
    }
}

downgradeToAJSComponent(
    'ibTicketSelection',
    {
        component: IbTicketSelectionComponent
    },
    'ib-ticket-selection-module'
);
