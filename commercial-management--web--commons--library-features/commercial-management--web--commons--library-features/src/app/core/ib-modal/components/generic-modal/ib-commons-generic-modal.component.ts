import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { GenericModalViewModel } from "../../models/ib-commons-modal.model";

@Component({
  selector: "ib-modal-generic",
  templateUrl: "./ib-commons-generic-modal.component.html",
  styleUrls: ["./ib-commons-generic-modal.component.scss"],
})
export class IbCGenericModalComponent implements OnInit {
  @Input() model: GenericModalViewModel = {};
  public showCloseButton = true;
  public showCancelButton = false;
  public showHeader = true;
  public dismissOnCancel = true;
  public titleTranslateParams: Record<string, string> = {};
  public modalTitle = "MODAL_ERROR_TITLE";
  public body: string[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.showCloseButton = this.model.showCloseButton ?? true;
    this.showHeader = this.model.showHeader ?? true;
    this.showCancelButton =
      this.model.showCancelButton === true || Boolean(this.model.cancel);
    this.dismissOnCancel = this.model.dismissOnCancel ?? true;
    this.titleTranslateParams = this.model.titleTranslateParams ?? {};
    this.modalTitle = this.model.title ?? "MODAL_ERROR_TITLE";
    this.body =
      typeof this.model.body === "string"
        ? [this.model.body]
        : this.model.body ?? [];
    this.model.onModalOpen?.();
  }

  close = (): void => {
    this.model.onClose?.();
    this.activeModal.dismiss("CLOSE");
  };

  accept = () => {
    this.model.onAcceptClick?.();
    this.activeModal.close("ACCEPT");
  };

  cancel = () => {
    this.model.onCancelClick?.();
    this.dismissOnCancel
      ? this.activeModal.dismiss("CANCEL")
      : this.activeModal.close("CANCEL");
  };
}
