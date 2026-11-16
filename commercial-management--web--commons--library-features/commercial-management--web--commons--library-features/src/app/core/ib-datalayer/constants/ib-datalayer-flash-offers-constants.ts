import * as angular from "angular";

const DatalayerFlashOffersConstants = {
  PROCESS: "Process",
  ENTRY_POINT: "EntryPoint",
  OFFERDEST: "OfferDest",
  OFFERDESTNAME: "OfferDestName",
  TRIP_TYPE: "FlightType",
  SEARCH_CITY: "SearchCity",
  SEARCH_DEST_NAME: "SearchDestName",
  SEARCH_DEST: "SearchDest",
  SEARCH_COUNTRY: "SearchCountry",
  STEP: "Step",
};

angular
  .module("ib-datalayer-module")
  .constant("DatalayerFlashOffersConstants", DatalayerFlashOffersConstants);
export type DatalayerFlashOffersConstantsType =
  typeof DatalayerFlashOffersConstants;
export { DatalayerFlashOffersConstants };
