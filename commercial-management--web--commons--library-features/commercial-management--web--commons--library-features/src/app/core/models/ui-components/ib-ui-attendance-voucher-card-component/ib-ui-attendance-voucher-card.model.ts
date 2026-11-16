export type AttendanceVoucherConditions = {
  textCondition: string;
  typeCondition: string;
};
export type AttendanceVoucherActions = {
  textAction: string;
  typeAction: string;
};

export type AttendanceVoucher = {
  titleVoucher: string;
  typeVoucher: string;
  conditionsVoucher: AttendanceVoucherConditions[];
  actionsVoucher: AttendanceVoucherActions[];
  linkName: string;
  linkUrl: string;

  infoTitle: string;
  infoTextPayments: string;
  infoTextMMB: string;
};

export const DEFAULT_ATTENDANCE_VOUCHER_CONDITIONS: AttendanceVoucherConditions =
  {
    textCondition: "",
    typeCondition: "",
  };
export const DEFAULT_ATTENDANCE_VOUCHER_ACTIONS: AttendanceVoucherActions = {
  textAction: "",
  typeAction: "",
};

export const DEFAULT_ATTENDNACE_VOUCHER_LIST = [] as AttendanceVoucher[];

export const DEFAULT_ATTENDNACE_VOUCHER: AttendanceVoucher = {
  titleVoucher: "",
  typeVoucher: "",
  conditionsVoucher: [DEFAULT_ATTENDANCE_VOUCHER_CONDITIONS],
  actionsVoucher: [DEFAULT_ATTENDANCE_VOUCHER_ACTIONS],
  linkName: "",
  linkUrl: "",
  infoTitle: "",
  infoTextMMB: "",
  infoTextPayments: "",
};
