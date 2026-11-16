import * as angular from "angular";
import { ibCCalculatePointsService } from "../../../http-services/prlm-pc/ib-calculate-points-service";
import { IbUiAviosSummaryTransformer } from "./ib-ui-avios-summary-transformer";

export class IbUiAviosSummaryService {
  flowApp: string;

  constructor(
    private ibCCalculatePointsService: ibCCalculatePointsService,
    private IbUiAviosSummaryTransformer: IbUiAviosSummaryTransformer,
    private localStorageService: ng.local.storage.ILocalStorageService,
    private $rootScope: CommonsRootScope,
  ) {
    this.flowApp = this.localStorageService.get("flowApp");
  }

  getCalculateAviosSummary = (request) => {
    if (
      this.flowApp === "MMB" ||
      this.flowApp === "MMBANC" ||
      this.flowApp === "CKI"
    ) {
      return new Promise((resolve, reject) => {
        this.ibCCalculatePointsService
          .getCalculateAviosAncillaries(
            this.IbUiAviosSummaryTransformer.generateReqAviosSummaryModel(
              request,
            ),
          )
          .then(
            (response) => {
              let aviosSummary =
                this.IbUiAviosSummaryTransformer.generateResAviosSummaryModel(
                  response,
                  this.flowApp,
                );
              this.localStorageService.set("CalculatedPoints", {
                Avios: aviosSummary.totalAvios,
                Elite: aviosSummary.totalPoints,
              });
              this.$rootScope.$broadcast("updateAvios");
              resolve(aviosSummary);
            },
            (error) => {
              reject(error);
            },
          );
      });
    } else {
      return new Promise((resolve, reject) => {
        this.ibCCalculatePointsService
          .getCalculateAviosSummary(
            this.IbUiAviosSummaryTransformer.generateReqAviosSummaryModel(
              request,
            ),
          )
          .then(
            (response) => {
              let aviosSummary =
                this.IbUiAviosSummaryTransformer.generateResAviosSummaryModel(
                  response,
                  this.flowApp,
                );
              this.localStorageService.set("CalculatedPoints", {
                Avios: aviosSummary.totalAvios,
                Elite: aviosSummary.totalPoints,
              });
              this.$rootScope.$broadcast("updateAvios");
              resolve(aviosSummary);
            },
            (error) => {
              reject(error);
            },
          );
      });
    }
  };
}
IbUiAviosSummaryService.$inject = [
  "ibCCalculatePointsService",
  "IbUiAviosSummaryTransformer",
  "localStorageService",
  "$rootScope",
];
try {
  const mod = angular.module("ib-ui-avios-summary-module");
  mod.service("IbUiAviosSummaryService", IbUiAviosSummaryService);
} catch (error) {
  const mod = angular.module("ib-ui-avios-summary-module", []);
  mod.service("IbUiAviosSummaryService", IbUiAviosSummaryService);
}
