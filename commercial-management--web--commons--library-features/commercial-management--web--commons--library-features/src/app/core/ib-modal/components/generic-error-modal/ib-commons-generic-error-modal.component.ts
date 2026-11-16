import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { GenericErrorModalViewModel } from "../../models/ib-commons-modal.model";
import { IbCDatalayerUtilsService } from "ib-web-commons/ib-datalayer";
import { RedirectionService } from "ib-web-commons/utils";
import { HttpErrorResponse } from "@angular/common/http";
import { ProxyErrorResponse } from "ib-web-commons/proxies";
import { ProcessedHttpErrorInfo } from "ib-web-commons/models";
import { IbCHttpErrorHandlerService } from "ib-web-commons/http-services";
import { CommonsConstants } from "ib-web-commons/constants";

@Component({
  selector: "ib-modal-generic-error",
  templateUrl: "./ib-commons-generic-error-modal.component.html",
  styleUrls: ["./ib-commons-generic-error-modal.component.scss"],
})
export class IbCGenericErrorModalComponent implements OnInit {
  @Input() model: GenericErrorModalViewModel = {};
  @Input() error: unknown;
  public showCloseButton = true;
  public showCancelButton = false;
  public showHeader = true;
  public dismissOnCancel = true;
  public titleTranslateParams: Record<string, string> = {};
  public body: Omit<ProcessedHttpErrorInfo, "internalErrorCode">[] | undefined;
  public modalTitle = "MODAL_ERROR_TITLE";
  private readonly TIMEOUT_INTERNAL_ERROR_CODE = [
    "SSE_ORM_9999",
    "SSE_AVM_9008",
  ];
  private mainError: ProcessedHttpErrorInfo | undefined;

  constructor(
    public activeModal: NgbActiveModal,
    private redirectionService: RedirectionService,
    private errorHandlerService: IbCHttpErrorHandlerService,
    private dataLayerUtilsService: IbCDatalayerUtilsService,
  ) {}

  ngOnInit() {
    this.showCloseButton = this.model.showCloseButton ?? true;
    this.showHeader = this.model.showHeader ?? true;
    this.showCancelButton =
      this.model.showCancelButton === true || Boolean(this.model.cancel);
    this.dismissOnCancel = this.model.dismissOnCancel ?? true;
    this.titleTranslateParams = this.model.titleTranslateParams ?? {};
    this.modalTitle = this.model.title ?? "MODAL_ERROR_TITLE";
    const processedInfo = this.errorTreatment();
    this.body =
      typeof this.model.body === "string"
        ? [{ message: this.model.body, needsTranslate: true }]
        : this.model.body?.map((mess) => ({
            message: mess,
            needsTranslate: true,
          })) ?? processedInfo.errorInfo;
    this.model.onModalOpen?.();
  }

  errorTreatment() {
    const readableError = {
      errorCode: -1,
      requestURL: "",
      errorInfo: [
        {
          message: CommonsConstants.BOOKINGERRORSSERVICE.SERVICEGENERALERROR,
          needsTranslate: true,
        },
      ] as ProcessedHttpErrorInfo[],
    };
    if (this.error) {
      if ((this.error as ProxyErrorResponse).data) {
        const inferredTypeError = this.error as ProxyErrorResponse<unknown>;
        readableError.errorCode = inferredTypeError.errorCode;
        readableError.requestURL = "";
        readableError.errorInfo = this.errorHandlerService.getErrorMessage(
          inferredTypeError.data,
        );
      } else if (this.error instanceof HttpErrorResponse) {
        readableError.errorCode = this.error.status;
        readableError.requestURL = this.error.url ?? "";
        readableError.errorInfo = this.errorHandlerService.getErrorMessage(
          this.error.error as unknown,
        );
      }
      this.mainError = readableError.errorInfo[0];
      this.dataLayerUtilsService.sendErrorEvent({
        errorCode: readableError.errorCode,
        internalErrorCode: this.mainError.internalErrorCode ?? "",
        message: this.mainError.message,
      });
    }
    return readableError;
  }

  close = (): void => {
    this.model.onClose?.();
    if (this.error) {
      this.dataLayerUtilsService.removeErrorEventInfo();
    }
    if (this.checkTimeOutSession() || this.model?.redirect) {
      this.redirectionService.externalRedirect(
        this.model.redirect ?? window.location.origin,
      );
    }
    this.activeModal.dismiss("CLOSE");
  };

  accept = () => {
    this.model.onAcceptClick?.();
    if (this.error) {
      this.dataLayerUtilsService.removeErrorEventInfo();
    }
    if (this.checkTimeOutSession() || this.model?.redirect) {
      this.redirectionService.externalRedirect(
        this.model.redirect ?? window.location.origin,
      );
    }
    this.activeModal.close("ACCEPT");
  };

  cancel = () => {
    this.model.onCancelClick?.();
    if (this.error) {
      this.dataLayerUtilsService.removeErrorEventInfo();
    }
    if (this.checkTimeOutSession() || this.model?.redirect) {
      this.redirectionService.externalRedirect(
        this.model.redirect ?? window.location.origin,
      );
    }
    this.dismissOnCancel
      ? this.activeModal.dismiss("CANCEL")
      : this.activeModal.close("CANCEL");
  };

  private checkTimeOutSession = (): boolean => {
    return (
      typeof this.error === "object" &&
      this.TIMEOUT_INTERNAL_ERROR_CODE.includes(
        this.mainError?.internalErrorCode ?? "",
      )
    );
  };
}
