import {
  Component,
  OnInit,
  Input,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
} from "@angular/core";
import { downgradeToAJSComponent } from "ib-web-commons/utils";
import { TranslateService } from "@ngx-translate/core";
import { IbUiQuotasNemuruService } from "./ib-ui-quotas-nemuru.service";
import { CalculateConditionsResponse } from "./ib-ui-quotas-nemuru-models";

@Component({
  selector: "ib-ui-quotas-nemuru-component",
  templateUrl: "./ib-ui-quotas-nemuru.component.html",
  styleUrls: ["./ib-ui-quotas-nemuru.component.scss"],
})
export class IbUiQuotasNemuruComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() quotas: CalculateConditionsResponse[] = [];
  @Input() amount = 0;
  @Input() modifierClass = "";
  public bannerTextBody1 = "";
  public bannerTextBody2 = "";
  public bannerTextBody3 = "";
  public quotasData: CalculateConditionsResponse[] = [];
  public oneIdentificator = `nemuru${Date.now()}${Math.floor(
    Math.random() * 100,
  )}`;
  public indexSelectedTerm = 0;
  public selectedTerm: number | string = "";
  public selectedTermAmount = "";
  public unfolded = false;
  public showComponent = false;
  private initialized = false;
  constructor(
    private translateService: TranslateService,
    private ibUiQuotasNemuruService: IbUiQuotasNemuruService,
  ) {}

  private formatLiterals = () => {
    this.translateService
      .get("BANNER_QUOTAS_NEMURU_TEXT_2")
      .subscribe((value: string) => {
        const splitBannerTextBody: string[] = value.split("#XX#");
        this.bannerTextBody1 = splitBannerTextBody[0] || "";
        this.bannerTextBody2 = splitBannerTextBody[1] || "";
        this.bannerTextBody3 = splitBannerTextBody[2] || "";
      });
  };

  private clickDropDown = (event: Event) => {
    event.stopPropagation();
    this.unfolded = !this.unfolded;
  };

  private bindEvents = () => {
    if (!this.initialized || this.quotasData.length === 0) return;
    const $dropDownHandle: HTMLElement | null = document.querySelector(
      `#${this.oneIdentificator}`,
    );
    if (!$dropDownHandle) return;
    $dropDownHandle.removeEventListener("click", this.clickDropDown);
    $dropDownHandle.addEventListener("click", this.clickDropDown);
  };

  private getQuotasFromScript = () => {
    this.ibUiQuotasNemuruService
      .getQuotasData(this.amount)
      .then((data) => {
        this.updateDataQuotas(data as CalculateConditionsResponse[]);
      })
      .catch(() => {
        this.updateDataQuotas([]);
      });
  };

  private updateDataQuotas = (data: CalculateConditionsResponse[] = []) => {
    this.quotasData = data;
    this.showComponent = data.length > 0;
    this.updateIndexSelectedTerm(this.quotasData?.length - 1 || 0);
    this.bindEvents();
  };

  private fecthQuotas = () => {
    if (this.quotas && this.quotas.length > 0) {
      this.updateDataQuotas(this.quotas);
    } else {
      this.getQuotasFromScript();
    }
  };

  public updateIndexSelectedTerm = (index: number) => {
    this.indexSelectedTerm = index;
    this.selectedTerm = this.quotasData[this.indexSelectedTerm]?.term || "";
    this.selectedTermAmount =
      this.quotasData[
        this.indexSelectedTerm
      ]?.instalmentTotalAmount?.string.replace(/ /g, "") || "";
  };

  ngOnInit() {
    this.formatLiterals();
    window.addEventListener("click", () => {
      this.unfolded = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.quotas || changes?.amount) {
      this.fecthQuotas();
    }
  }

  ngAfterViewInit() {
    this.initialized = true;
    this.bindEvents();
  }
}

downgradeToAJSComponent(
  "ibUiQuotasNemuruComponent",
  {
    component: IbUiQuotasNemuruComponent,
    inputs: ["quotas", "amount", "modifierClass"],
  },
  "ib-commons-ui-components-module",
);
