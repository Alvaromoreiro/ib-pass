import angular from "angular";
import { IbItinerarySendService } from "@src/components/services/ib-itinerary-send-service";
import { MmBDatalayerUtilsService } from "@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service";
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

@Controller('ib-MmB-modal-module',
    ['$uibModalInstance', 'object', 'MmBDatalayerUtilsService', 'IbItinerarySendService', 'MmBModalService', 'MmBAppConstants', 'CommonsUtilService'],
    [])
export class MmBFlightReminderModalController{

    constructor(
        private $uibModalInstance,
        private object,
        private MmBDatalayerUtilsService: MmBDatalayerUtilsService,
        private IbItinerarySendService: IbItinerarySendService,
        private MmBModalService,
        private MmBAppConstants: MmBAppConstants,
        private CommonsUtilService: CommonsUtilService) {}

    model = this.object;
    arrEmails = [];
    info = {
        name: this.model.passengersModel.passengers[0].personalInfo.name,
        surname: this.model.passengersModel.passengers[0].personalInfo.surname,
        email: (this.model.passengersModel?.contactData?.primaryContactInfo?.email) ? this.model.passengersModel.contactData.primaryContactInfo.email.toLowerCase() : ''
    };
    allChecked: boolean = false;

    /**
     * Initialize modal controller
     */
    $onInit = () => {
        this.arrEmails = this.addOtherEmails();
        this.MmBDatalayerUtilsService.sendDatalayerModalEvent(this.model);
        this.$uibModalInstance.result.then(this.MmBDatalayerUtilsService.removeDatalayerModalAttrs, this.MmBDatalayerUtilsService.removeDatalayerModalAttrs);
        /* INIT DELETE GA4 MIGRATION*/
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.IBENIT, MMBDatalayerConstants.DIGITAL_DATA_STEP.IBENIT, this.MmBAppConstants.QUADRIGAM.ORDER_TICKETS);
    };

    /**
     * Closes the modal dismissing its instance
     */
    close = () => {
        this.$uibModalInstance.close();
    }

    /**
     * Send to service mails of the form
     */
    sendMails = () => {
        this.CommonsUtilService.setTitlePage('MMB_TITLE_ITINERARY_CONFIRMATION');
        this.MmBModalService.showWaitingModal();
        const dataMails = this.getDataMails();
        this.IbItinerarySendService.itinerarySendServiceInfo(dataMails, this.model.bookingGeneralInfo.flowId).then((data) => {
            this.MmBModalService.finishWaiting();
            this.$uibModalInstance.close();
        }, (error) => {
            this.MmBModalService.finishWaiting();
            this.MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
        });
        /* INIT DELETE GA4 MIGRATION*/
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.IBCENIT, MMBDatalayerConstants.DIGITAL_DATA_STEP.IBCENIT, this.MmBAppConstants.QUADRIGAM.ORDER_TICKETS_CONFIRMATION);
    };

    addOtherEmails = (): Array<any> => {
        const emails: Array<any> = [];
        this.model?.passengersModel?.passengers?.forEach(passenger => {
            if(this.isNotPrincipalPassenger(passenger) && this.isNotDuplicatedEmails(emails, passenger)) {
                const obj = {
                    email: passenger.contactInfo.email,
                    checked: false
                }
                emails.push(obj);
            }
        });
        return emails;
    }

    changeSelected = (): void => {
        this.allChecked = this.arrEmails.every(arr => arr.checked === true)
    }

    changeAllSelected = (): void => {
        this.arrEmails.forEach(obj => {
            obj.checked = this.allChecked;
        });
    }

    private isNotPrincipalPassenger = (passenger): boolean => {
        return passenger?.contactInfo?.email && passenger.contactInfo.email.toLowerCase()!== this.info.email.toLowerCase();
    }

    private isNotDuplicatedEmails = (emails, passenger): boolean => {
        let notDuplicated: boolean = true;
        for (let e of emails) {
            if (passenger?.contactInfo?.email.toLowerCase() === e.email.toLowerCase()) {
                notDuplicated = false;
                break;
            }
        }
        return notDuplicated;
    }

    private getDataMails = () => {
        let dataMails = {
            emails: this.getListMails()
        };
        return dataMails;
    }

    private getListMails = (): Array<string> => {
        const mails = [];
        if(this.info.email !== '') mails.push(this.info.email);
        this.arrEmails.forEach(obj => {
            if(obj?.checked) mails.push(obj.email);
        })
        return mails;
    }
}
