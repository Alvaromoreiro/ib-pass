import { AttendanceVoucher,
    AttendanceVoucherResponse,
    AttendanceVoucherConditions,
    AttendanceVoucherHead,
    AttendanceVoucherActions
} from '@src/app/core/models/attendance-voucher-model/attendance-voucher-model';
import { MmBAppConstants } from '../../ib-MmB-constants';

@Service('ib-MmB-transformers-module', ['$filter'], [])
export class AttendanceVoucherTransformer {
    attendanceVoucherHeadList:  AttendanceVoucherHead[] = [];
    constructor (private $filter) {

    }

    transformAttendanceVoucher(attendanceVoucher: AttendanceVoucherResponse) {
        let transformedVoucher = new AttendanceVoucherHead();
        transformedVoucher.locator = attendanceVoucher.locator;
        transformedVoucher.surname = attendanceVoucher.surname;
        transformedVoucher.attendanceVoucher = [];
        attendanceVoucher.voucher.forEach(voucher => {
            let voucherAssistance = new AttendanceVoucher();
            voucherAssistance.typeVoucher =  voucher.voucherType;
            voucherAssistance.titleVoucher = this.getTitleVoucher(voucher.voucherType);
            voucherAssistance.linkName = this.getLinkNameVoucher(voucher.voucherType);
            voucherAssistance.linkUrl = this.getUrlVoucher(voucher.voucherType);
            voucherAssistance.infoTitle = this.getTitleVoucher(voucher.voucherType);
            voucherAssistance.infoTextPayments = this.getInfoVoucherPayments(voucher.voucherType);
            voucherAssistance.infoTextMMB = this.getInfoVoucherMMB(voucher.voucherType);
            voucherAssistance.actionsVoucher = [];
            voucherAssistance.conditionsVoucher = [];

            voucher.actions.forEach(action =>{
                let actionVoucher = new AttendanceVoucherActions();
                actionVoucher.typeAction = action.actionType;
                actionVoucher.textAction = this.getActionNameVoucher(action.actionType);
                voucherAssistance.actionsVoucher.push(actionVoucher);
            })
            voucher.additionalInfo.forEach(condition =>{
                let conditionsVoucher = new AttendanceVoucherConditions();
                conditionsVoucher.typeCondition = condition.infoType;
                conditionsVoucher.textCondition = this.getConditionNameVoucher(condition.infoType);
                voucherAssistance.conditionsVoucher.push(conditionsVoucher);
            })
            transformedVoucher.attendanceVoucher.push(voucherAssistance);
        });
        return transformedVoucher;
    }

    private getTitleVoucher (typeVoucher) : string {
        switch (typeVoucher) {
            case MmBAppConstants.VOUCHER_TYPES.RESTAURANT:
                return this.$filter('translate')('ATTENDANCE_VOUCHER_RESTAURANT_VOUCHER_TYPE');
            case MmBAppConstants.VOUCHER_TYPES.ACCOMODATION:
                return this.$filter('translate')('ATTENDANCE_VOUCHER_ACCOMODATION_VOUCHER_TYPE');
        }
    }
    private getLinkNameVoucher (typeVoucher) : string {
        switch (typeVoucher) {
            case MmBAppConstants.VOUCHER_TYPES.RESTAURANT:
                return this.$filter('translate')('ATTENDANCE_VOUCHER_RESTAURANT_LINK');
            case MmBAppConstants.VOUCHER_TYPES.ACCOMODATION:
                return this.$filter('translate')('ATTENDANCE_VOUCHER_ACCOMODATION_LINK');
        }
    }
    private getUrlVoucher (typeVoucher) : string {
        switch (typeVoucher) {
            case MmBAppConstants.VOUCHER_TYPES.RESTAURANT:
                return  MmBAppConstants.VOUCHER_LINKS.RESTAURANT
            case MmBAppConstants.VOUCHER_TYPES.ACCOMODATION:
                return MmBAppConstants.VOUCHER_LINKS.ACCOMODATION
        }
    }

    private getInfoVoucherPayments (typeVoucher) : string {
        switch (typeVoucher) {
            case MmBAppConstants.VOUCHER_TYPES.RESTAURANT:
                return this.$filter('translate')('ATTENDANCE_VOUCHER_RESTAURANT_PAY_INFO');
            case MmBAppConstants.VOUCHER_TYPES.ACCOMODATION:
                return this.$filter('translate')('ATTENDANCE_VOUCHER_ACCOMODATION_PAY_INFO');
        }
    }
    private getInfoVoucherMMB (typeVoucher) : string {
        switch (typeVoucher) {
            case MmBAppConstants.VOUCHER_TYPES.RESTAURANT:
                return this.$filter('translate')('ATTENDANCE_VOUCHER_RESTAURANT_MMB_INFO');
            case MmBAppConstants.VOUCHER_TYPES.ACCOMODATION:
                return this.$filter('translate')('ATTENDANCE_VOUCHER_ACCOMODATION_MMB_INFO');
        }
    }

    private getActionNameVoucher (typeVoucher) : string {
        switch (typeVoucher) {
            case MmBAppConstants.VOUCHER_ACTION_TYPES.DOWNLOAD:
                return this.$filter('translate')('ATTENDANCE_VOUCHER_ACCOMODATION_ACTION_DOWNLOAD');
            case MmBAppConstants.VOUCHER_ACTION_TYPES.EMAIL:
                return this.$filter('translate')('ATTENDANCE_VOUCHER_ACCOMODATION_ACTION_EMAIL');
        }
    }
    private getConditionNameVoucher (typeVoucher) : string {
        switch (typeVoucher) {
            case MmBAppConstants.VOUCHER_CONDITION_TYPES.BOARDING:
                return this.$filter('translate')('ATTENDANCE_VOUCHER_RESTAURANT_ADDITIONAL_INFO_1');
        }
    }
}
