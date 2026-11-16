import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { IbCUserStoreRepositoryService } from "ib-web-commons/services";
import { filter, take } from "rxjs";

@Component({
  selector: "ib-modal-change-status-user",
  templateUrl: "./ib-commons-change-status-user-modal.component.html",
  styleUrls: ["./ib-commons-change-status-user-modal.component.scss"],
})
export class IbCChangeStatusUserModalComponent {

    public isLoading = false;
    public model = {
        title: 'OH_LOGIN_ADVICE_MODAL_TITLE',
        body: 'OH_LOGIN_ADVICE_MODAL_BODY',
        accept: 'OH_LOGIN_ADVICE_MODAL_BUTTON'
    };

  constructor(
    public activeModal: NgbActiveModal,
    private userStore: IbCUserStoreRepositoryService,
  ) {}

  continue() {
    this.isLoading = true;
    this.userStore.updateFromServer();
    this.userStore
      .getUserState()
      .pipe(
        filter((res) => !res.isLoading),
        take(1),
      )
      .subscribe(() => {
        this.activeModal.close("ACCEPT");
      });
  }
}
