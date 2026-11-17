export interface VoucherDiscountOrder {
    accountableAmount?:                     number;
    amount?:                                number;
    currency?:                              string;
    voucherId?:                             string;
    type?:                                  string;
    totalBookingAmountWithDiscountApplied?: number;
    campaignCommercialCode?:                string;
    totalAccountable?:                      number;
    totalMarketing?:                        number;
    voucherFopType?:                        string;
    voucherDateRegistration?:               string;
    remainingAmount?:                       number;
    marketingAmount?:                       number;
    expenses?:                              string;
    voucherEmail?:                          string;

}

export interface VoucherDiscountRealAmount {
    totalRealAmount:                 number;
    perPassengerDiscounts:           PerPassengerDiscount[];
    perPassengerEstimatedRealAmount: number;
}

export interface PerPassengerDiscount {
    passengerType: string;
    realAmount:    number;
}
