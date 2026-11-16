export type NewPaymentAvailiabilityResponse = {
  available: boolean;
};

export enum FlowAppEnum {
  BBKI = "BBKI",
  MMB = "MMB",
  MMBOH = "MMBOH",
  MMBANC = "MMBANC",
  MMBVC = "MMBVC",
  MMBBID = "MMBBID",
  BBKIOH = "BBKIOH",
  CKI = "CKI",
  PAOB = "PAOB",
  PAOBONB = "PAOBONB",
  PARE = "PARE",
  PAREONB = "PAREONB",
  GIFTCARDS = "GIFTCARDS",
  SUBSCRIPTIONMODELS = "SUBSCRIPTIONMODELS",
}

export enum RealmEnum {
  BOOKING = "Booking",
  CHECKIN = "Checkin",
  GIFTCARD = "GIFTCARD",
  MANAGEMYBOOKING = "ManageMyBooking",
  REDEMPTION = "REDEMPTION",
  SUBSCRIPTION = "SUBSCRIPTION",
}

export type RealmType = RealmEnum | undefined;

export enum SubrealmEnum {
  ANCILLARIES_PURCHASE = "ANCILLARIES_PURCHASE",
  DISRUPTION_UNIFIED = "Booking",
  FLIGHT_CHANGE = "FLIGHT_CHANGE",
  ONHOLD_CONFIRMATION = "ONHOLD_CONFIRMATION",
  SHUTTLE = "SHUTTLE",
  UPGRADING_BID = "UPGRADING_BID",
}

export type SubrealmType = SubrealmEnum | undefined;

export type FlowAppTypes = keyof typeof FlowAppEnum;

export type RealmTypesItemModel = {
  realm: RealmType;
  subrealm?: SubrealmType;
};

export type RealmTypesModel = {
  [K in FlowAppTypes]?: RealmTypesItemModel;
};
