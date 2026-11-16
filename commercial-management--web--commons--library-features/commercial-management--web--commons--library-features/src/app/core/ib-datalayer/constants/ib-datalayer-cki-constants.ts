import * as angular from "angular";

const DatalayerCKIConstants = {
  DOWNLOAD_FORMAT: "DownloadFormat",
  BP_TYPE: "BPType",
  CHECKIN_BY: "CheckinBy",
  APIS_COMPLETED: "ApisCompleted",
};

angular
  .module("ib-datalayer-module")
  .constant("DatalayerCKIConstants", DatalayerCKIConstants);
export type DatalayerCKIConstantsType = typeof DatalayerCKIConstants;
export { DatalayerCKIConstants };
