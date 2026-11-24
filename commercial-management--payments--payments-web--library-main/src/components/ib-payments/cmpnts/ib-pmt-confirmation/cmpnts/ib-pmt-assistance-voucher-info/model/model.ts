//Response of attendance voucher service
export type AttendanceVoucherResponse = {
    locator: string;
    surname: string;
    flight: AttendanceVoucherFlightModel;
    voucher: AttendanceVoucherModel[]
};
export type AttendanceVoucherFlightModel = {
    operationalCompany: string,
    number : string,
    departureTime: string
};
export type AttendanceVoucherModel = {
    id: string,
    voucherType: string,
    actions: AttendanceVoucherActionsModel[],
    additionalInfo: AttendanceVoucherInformationModel[],
    url: string;
};
export type AttendanceVoucherActionsModel = {
    actionType: string;
};
export type AttendanceVoucherInformationModel = {
    infoType: string;
};
///////////////////////////////////////////////////


//transformed attednace vocuher to set model in localStorage
export class AttendanceVoucherHead {
    attendanceVoucher: AttendanceVoucher[];
    locator: string;
    surname: string;
}
export class AttendanceVoucher {
    titleVoucher: string;
    typeVoucher: string;
    conditionsVoucher: AttendanceVoucherConditions[];
    actionsVoucher: AttendanceVoucherActions[];
    linkName: string;
    linkUrl: string;

    infoTitle: string;
    infoText: string;
}

export class AttendanceVoucherConditions {
    textCondition: string;
    typeCondition: string;
}
export class AttendanceVoucherActions {
    textAction: string;
    typeAction: string;
}

export const DEFAULT_ATTENDANCE_VOUCHER_CONDITIONS : AttendanceVoucherConditions = {
    textCondition: '',
    typeCondition: ''
};
export const DEFAULT_ATTENDANCE_VOUCHER_ACTIONS : AttendanceVoucherActions = {
    textAction: '',
    typeAction: ''
};

export const DEFAULT_ATTENDANCE_VOUCHER_ACTIONS_LIST  = [] as AttendanceVoucherActions[];
export const DEFAULT_ATTENDANCE_VOUCHER_CONDITIONS_LIST  = [] as AttendanceVoucherConditions[];
export const DEFAULT_ATTENDANCE_VOUCHER_LIST  = [] as AttendanceVoucher[];

export const DEFAULT_ATTENDANCE_VOUCHER : AttendanceVoucher = {
    titleVoucher: '',
    typeVoucher: '',
    conditionsVoucher: [DEFAULT_ATTENDANCE_VOUCHER_CONDITIONS],
    actionsVoucher: [DEFAULT_ATTENDANCE_VOUCHER_ACTIONS],
    linkName: '',
    linkUrl: '',
    infoTitle: '',
    infoText: ''
};

export const DEFAULT_ATTENDANCE_VOUCHER_HEAD : AttendanceVoucherHead = {
    locator: '',
    surname: '',
    attendanceVoucher: DEFAULT_ATTENDANCE_VOUCHER_LIST
};
/////////////////////////////////////////////////////////////////////

//Voucher