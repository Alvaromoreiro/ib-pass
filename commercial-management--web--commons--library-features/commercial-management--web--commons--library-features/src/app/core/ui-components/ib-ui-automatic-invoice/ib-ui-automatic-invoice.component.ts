import { Component, OnInit } from "@angular/core";
import {
  downgradeToAJSComponent,
  CommonsSessionStorageService,
} from "ib-web-commons/utils";
import {
  InvoiceCodeOK,
  IssueOrderResponse,
  InvoiceCodeKO,
  Warning,
} from "ib-web-commons/models";
import { IbUiAutomaticInvoiceConstants } from "ib-web-commons/constants";
@Component({
  selector: "ib-ui-automatic-invoice-component",
  templateUrl: "./ib-ui-automatic-invoice.component.html",
  styleUrls: ["./ib-ui-automatic-invoice.component.scss"],
})
export class IbUiAutomaticInvoiceComponent implements OnInit {
  issueOrderResponse: IssueOrderResponse;
  invoiceCodeOK: typeof InvoiceCodeOK;
  invoiceCodeKO: typeof InvoiceCodeKO;

  constructor(
    private commonsSessionStorageService: CommonsSessionStorageService,
  ) {
    this.issueOrderResponse =
      IbUiAutomaticInvoiceConstants.EMPTY_ISSUE_ORDER_RESPONSE;
    this.invoiceCodeOK = InvoiceCodeOK;
    this.invoiceCodeKO = InvoiceCodeKO;
  }
  ngOnInit(): void {
    this.getCodeInvoices();
  }
  getCodeInvoices = (): void => {
    const issueOrderInfo =
      this.commonsSessionStorageService.get<IssueOrderResponse>(
        "issueOrderInfo",
      );
    this.issueOrderResponse = issueOrderInfo!;
  };

  trackByFn = (index: number) => {
    return index; // or item.id
  };
}
downgradeToAJSComponent(
  "ibUiAutomaticInvoiceComponent",
  { component: IbUiAutomaticInvoiceComponent, inputs: [] },
  "ib-commons-ui-components-module",
);
