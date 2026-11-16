import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbMmBVoluntaryRefundsConfirmationModalComponent } from "../ib-MmB-voluntary-refunds-confirmation-modal/ib-MmB-voluntary-refunds-confirmation-modal.component";
import { IbMmbVoluntaryRefundsService } from "../../services/ib-MmB-voluntary-refunds.service";
import { VoluntaryRefundsTransformerModel } from "@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-refunds-tab/models/ib-voluntary-refunds-tab-transformer-model";
import { TranslateService } from "@ngx-translate/core";
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { MmBAppConstants } from "@src/ib-MmB-constants";
import { IbMmBVoluntaryRefundsCloseModalComponent } from "../ib-MmB-voluntary-refunds-close-modal/ib-MmB-voluntary-refunds-close-modal.component";
import { VoluntaryRefundsConfirmationModel } from "@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-refunds-tab/models/ib-voluntary-refunds-confirmation-model";

@Component({
  selector: 'ib-mmb-voluntary-refunds-summary',
  templateUrl: './ib-MmB-voluntary-refunds-summary-view.component.html',
  styleUrls: ['./ib-mmb-voluntary-refunds-summary-styles.component.scss']
})

export class IbMmBVoluntaryRefundsSummaryComponent implements OnInit {
    @Input() currentStep: number;
    @Input() steps: string[];
    @Output() getNewCurrentStep = new EventEmitter<number>();
    @Output() getConfirmationData = new EventEmitter<VoluntaryRefundsConfirmationModel>();

    _dataModelSummary: VoluntaryRefundsTransformerModel;

    get dataModelSummary(): VoluntaryRefundsTransformerModel {
        return this._dataModelSummary;
    }

    @Input() set dataModelSummary(value: VoluntaryRefundsTransformerModel) {
        this._dataModelSummary = value;
        this.translateSummaryTitleTables();
        this.translatePassengerTypes();
    }

    showAlert:boolean = true;
    showPenalty:boolean = true;

    //    Only one activate
    showAviosAndMoney: boolean = false;
    showCashAndAvios: boolean = false;
    showOnlyAvios: boolean = false;
    //END Only one activate

    tableTitleAncillarieSeat: string = '';
    tableTitleAncillarieBaggage: string = '';
    tableTitleAncillarieSpecialEquipment: string = '';
    tableTitleAncillariePriorityBoarding: string = '';
    passengerTypeAdultSingular: string = '';
    passengerTypeInfantSingular: string = '';
    passengerTypeChildSingular: string = '';
    passengerTypeAdultPlural: string = '';
    passengerTypeInfantPlural: string = '';
    passengerTypeChildPlural: string = '';

    constructor(
        private IbCModalService: IbCModalService,
        private IbMmbVoluntaryRefundsService: IbMmbVoluntaryRefundsService,
        private translate: TranslateService
    ) {
        this.IbMmbVoluntaryRefundsService.updateWorkflowDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_STEP.REFVRE, MmBAppConstants.QUADRIGAM.VOL_REFUND_SUMMARY);
    }

    ngOnInit = (): void => {

    };

    translateSummaryTitleTables = (): void => {
        this.translate.get([
            'ADULT',
            'INFANT',
            'CHILD',
            'ADULTS',
            'INFANTS',
            'CHILDS'
        ]).subscribe(translations => {
            this.passengerTypeAdultSingular = translations['ADULT'];
            this.passengerTypeInfantSingular = translations['INFANT'];
            this.passengerTypeChildSingular = translations['CHILD'];
            this.passengerTypeAdultPlural = translations['ADULTS'];
            this.passengerTypeInfantPlural = translations['INFANTS'];
            this.passengerTypeChildPlural = translations['CHILDS'];
        });
    }

    translatePassengerTypes = (): void => {
        this.translate.get([
            'MMB_BOOKING_SEATS_TITLE',
            'MMB_BOOKING_BAGGAGE_TITLE',
            'MMB_VOLUNTARY_CHANGE_REASON_INFO_KEEP_CONDITION_3',
            'PRIORITY_BOARDING_TITLE'
        ]).subscribe(translations => {
            this.tableTitleAncillarieSeat = translations['MMB_BOOKING_SEATS_TITLE'];
            this.tableTitleAncillarieBaggage = translations['MMB_BOOKING_BAGGAGE_TITLE'];
            this.tableTitleAncillarieSpecialEquipment = translations['MMB_VOLUNTARY_CHANGE_REASON_INFO_KEEP_CONDITION_3'];
            this.tableTitleAncillariePriorityBoarding = translations['PRIORITY_BOARDING_TITLE'];
        });
    }

    goConfirmModal = (viewModel) => {
        const options = {
            windowClass: 'ib-modals ib-modals--md',
            modalBlocked: true
        };
        const modalRef = this.IbCModalService.showGenericComponentModal(IbMmBVoluntaryRefundsConfirmationModalComponent, {...options});
        modalRef.componentInstance.currentStep = viewModel.currentStep ?? {};
        modalRef.componentInstance.getNewCurrentStep = this.getNewCurrentStep;
        modalRef.componentInstance.confirmationData = this.getConfirmationData;
        modalRef.componentInstance.refundType = this._dataModelSummary.refundType;

        return modalRef;
    }

    setSummaryTableTitleByAncillarieType = (serviceType: string): string => {
        let tableTitleAncillarie: string = '';
        switch (serviceType) {
            case 'seat':
                tableTitleAncillarie = this.tableTitleAncillarieSeat;
                break;
            case 'baggage':
                tableTitleAncillarie = this.tableTitleAncillarieBaggage;
                break;
            case 'specialEquipment':
                tableTitleAncillarie = this.tableTitleAncillarieSpecialEquipment;
                break;
            case 'priorityBoarding':
                tableTitleAncillarie = this.tableTitleAncillariePriorityBoarding;
                break;
            default:
                break;
        }
        return tableTitleAncillarie;
    }

    setQuantityPassengerType = (quantityPassenger: number, passengerType: string): string => {
        let passengerTypeTranslated: string = '';
        quantityPassenger <= 1 ? passengerTypeTranslated = this.selectPassengerTypeSingular(passengerType) : passengerTypeTranslated = this.selectPassengerTypePlural(`${passengerType}S`);
        return passengerTypeTranslated;
    }

    selectPassengerTypeSingular = (passengerType: string): string => {
        let passengerTypeSingular: string = '';
        switch (passengerType) {
            case 'ADULT':
                passengerTypeSingular = this.passengerTypeAdultSingular;
                break;
            case 'INFANT':
                passengerTypeSingular = this.passengerTypeInfantSingular;
                break;
            case 'CHILD':
                passengerTypeSingular = this.passengerTypeChildSingular;
                break;
            default:
                break;
        }
        return passengerTypeSingular;
    }

    selectPassengerTypePlural = (passengerType: string): string => {
        let passengerTypePlural: string = '';
        switch (passengerType) {
            case 'ADULTS':
                passengerTypePlural = this.passengerTypeAdultPlural;
                break;
            case 'INFANTS':
                passengerTypePlural = this.passengerTypeInfantPlural;
                break;
            case 'CHILDS':
                passengerTypePlural = this.passengerTypeChildPlural;
                break;
            default:
                break;
        }
        return passengerTypePlural;
    }

    showModalAndClose = (tpl = IbMmBVoluntaryRefundsCloseModalComponent) => {
        const optionsModal = {
            windowClass: 'ib-modals ib-modals--md',
            modalBlocked: true
        };
        const modalRef = this.IbCModalService.showGenericComponentModal(tpl, optionsModal);
        modalRef.componentInstance.currentStep = this.currentStep;
        modalRef.componentInstance.steps = this.steps;
    }
}
