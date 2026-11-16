import { Component, Inject, Input, OnInit } from "@angular/core";
import {
  AJSRootScope,
  CommonsSessionStorageService,
} from "ib-web-commons/utils";
import { IbMmbVoluntaryRefundsService } from "../../services/ib-MmB-voluntary-refunds.service";
import { VoluntaryRefundsTransformerModel } from "@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-refunds-tab/models/ib-voluntary-refunds-tab-transformer-model";
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { MmBAppConstants } from "@src/ib-MmB-constants";
import { VoluntaryRefundsConfirmationModel } from "@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-refunds-tab/models/ib-voluntary-refunds-confirmation-model";

@Component({
  selector: "ib-mmb-voluntary-refunds-confirmation",
  templateUrl: "./ib-MmB-voluntary-refunds-confirmation-view.component.html",
  styleUrls: ["./ib-MmB-voluntary-refunds-confirmation.component.scss"],
})
export class IbMmBVoluntaryRefundsConfirmationComponent implements OnInit {

  private static readonly IBERIA_BASE_URL = "https://www.iberia.com";
  private static readonly DEFAULT_TRACKING_ROUTE = '/seguimiento-reembolsos/#/REFUNDS';
  private static readonly CASE_NUMBER_QUERY_PARAM = "caseNumber";

  @Input() currentStep;
  @Input() dataModelConfirmation: VoluntaryRefundsTransformerModel;
  @Input() confirmationData: VoluntaryRefundsConfirmationModel;

  constructor(
    private IbMmbVoluntaryRefundsService: IbMmbVoluntaryRefundsService,
    @Inject(AJSRootScope) private $rootScope: any,
    private CommonsSessionStorageService: CommonsSessionStorageService,
  ) {
    this.IbMmbVoluntaryRefundsService.updateWorkflowDatalayerInfo(
      MMBDatalayerConstants.DIGITAL_DATA_STEP.REFVBK,
      MmBAppConstants.QUADRIGAM.VOL_REFUND_PAGE_CONFIRMATION,
    );
  }

  ngOnInit = (): void => {
    this.currentStep = this.currentStep + 1;
  };

  // TODO: Remove this line if the service always returns a caseNumber
  get hasCaseNumber(): boolean {
    return !!this.confirmationData?.caseNumber;
  }


  generateTrackingRefundUrl = (): string => {
    const locale = this.resolveLocale();
    const endPath = this.resolveTrackingEndPath(locale.language);
    const endPathWithCaseNumber = this.addCaseNumberToEndPath(endPath);

    return this.buildTrackingUrl(locale, endPathWithCaseNumber);
  };

  private resolveTrackingEndPath(language: string): string {
    const routes = MmBAppConstants?.VOLUNTARY_REFUNDS_TRACKING_ROUTES ?? {};

    return (
      routes[language] ??
      routes.ES ??
      IbMmBVoluntaryRefundsConfirmationComponent.DEFAULT_TRACKING_ROUTE
    );
  }

  private addCaseNumberToEndPath(endPath: string): string {
    const caseNumber = this.confirmationData?.caseNumber;

    if (!caseNumber) {
      return endPath;
    }

    const queryParam = this.buildCaseNumberQueryParam(caseNumber);

    return this.insertQueryParamBeforeHash(endPath, queryParam);
  }

  private buildCaseNumberQueryParam(caseNumber: string | number): string {
    return `${IbMmBVoluntaryRefundsConfirmationComponent.CASE_NUMBER_QUERY_PARAM}=${encodeURIComponent(
      String(caseNumber),
    )}`;
  }

  private insertQueryParamBeforeHash(endPath: string, queryParam: string): string {
    const hashIndex = endPath.indexOf("#");
    const separator = this.getQueryParamSeparator(endPath);

    if (hashIndex === -1) {
      return `${endPath}${separator}${queryParam}`;
    }

    return `${endPath.slice(0, hashIndex)}${separator}${queryParam}${endPath.slice(
      hashIndex,
    )}`;
  }

  private getQueryParamSeparator(endPath: string): "?" | "&" {
    return endPath.includes("?") ? "&" : "?";
  }

  private buildTrackingUrl(
    locale: { market: string; language: string },
    endPath: string,
  ): string {
    const specialLocale = IbMmBVoluntaryRefundsConfirmationComponent.SPECIAL_LANGUAGE_MARKETS[locale.language];

    if (specialLocale) {
      return `${IbMmBVoluntaryRefundsConfirmationComponent.IBERIA_BASE_URL}/${specialLocale.market}/${specialLocale.language}${endPath}`;
    }

    return `${IbMmBVoluntaryRefundsConfirmationComponent.IBERIA_BASE_URL}/${locale.market.toLowerCase()}${endPath}`;
  }


  private resolveLocale(): { market: string; language: string } {
    const { market, language } = this.getRawLocale();

    return {
      market: String(market).toUpperCase(),
      language: String(language).toUpperCase(),
    };
  }

  private getRawLocale(): { market: string; language: string } {
    const market = this.$rootScope?.appMarket;
    const language = this.$rootScope?.appLang;

    if (market && language) {
      return { market, language };
    }

    return this.getLocaleFromStorage();
  }

  private getLocaleFromStorage(): { market: string; language: string } {
    const context =
      this.CommonsSessionStorageService.get<any>("bookingInfo")
        ?.contextMetadata ?? {};
    return {
      market: context.country ?? "ES",
      language: context.language ?? "es",
    };
  }

  private static readonly SPECIAL_LANGUAGE_MARKETS: Record<
    string,
    { market: string; language: string }
  > = {
      ZH: { market: "cn", language: "zh" },
      JA: { market: "jp", language: "ja" },
    };
}
