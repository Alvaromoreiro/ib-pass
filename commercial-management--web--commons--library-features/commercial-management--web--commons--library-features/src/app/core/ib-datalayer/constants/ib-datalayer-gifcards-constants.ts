import * as angular from "angular";

const DatalayerGiftCardsConstants = {
  GIFTCARDCAMPAIGN: "GiftCardCampaign",
  USERSTATUS: "UserStatus",
  TRACKINGCODE: "TrackingCode",
  LANGUAGE: "Language",
  MARKET: "Market",
  MODEWEB: "ModeWeb",
  QUADRIGAM: "Quadrigam",
  VERSIONWEB: "VersionWeb",
};

angular
  .module("ib-datalayer-module")
  .constant("DatalayerGiftCardsConstants", DatalayerGiftCardsConstants);
export type DatalayerGiftCardsConstants = typeof DatalayerGiftCardsConstants;
export { DatalayerGiftCardsConstants };
