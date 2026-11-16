import { downgradeToAJSService } from "ib-web-commons/utils";
import { Injectable, TemplateRef, Type } from "@angular/core";
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import {
  GenericErrorModalViewModel,
  GenericModalViewModel,
  IbModalConfig,
  IbModalRef,
} from "../models/ib-commons-modal.model";
import { IbCGenericModalComponent } from "../components/generic-modal/ib-commons-generic-modal.component";
import { IbCGenericErrorModalComponent } from "../components/generic-error-modal/ib-commons-generic-error-modal.component";

/**
 * @description The service to show modals. Based in bootstrap library.
 * @see https://ng-bootstrap.github.io/#/components/modal/api
 */
@Injectable({
  providedIn: "root",
})
export class IbCModalService {
  private readonly defaultModalConfig: IbModalConfig = {
    animation: false,
    modalBlocked: false,
    showBackdrop: true,
    verticallyCentered: false,
    scrollable: false,
    windowClass: "ib-modals",
  };

  constructor(protected modalService: NgbModal) {}

  /**
   * @description Returns if an angular modal is still opened
   * @see https://ng-bootstrap.github.io/#/components/modal/api
   */
  hasOpenModals(): boolean {
    return this.modalService.hasOpenModals();
  }

  /**
   * @description Close all angular open modals
   * @param reason
   * @see https://ng-bootstrap.github.io/#/components/modal/api
   */
  closeAllModals(reason?: unknown) {
    this.modalService.dismissAll(reason);
  }

  /**
   * @description Show the generic error modal of Iberia, normally it is used when the service fails to retrieve the
   * information. If the error passes as first parameter is http error the information is transformed to be human readable.
   * If not a general error is shown, with the second parameter additional information or messages can be passed that overrides
   * the first argument.
   * @param error The error thrown in the application.
   * @param viewModel The model to show in the view. Defaults to what the error information has.
   * @param options options Modal options. See IbModalConfig type for more info
   * @author Iván Peña Huguet
   * @see https://ng-bootstrap.github.io/#/components/modal/api
   */
  showGenericError(
    error?: unknown,
    viewModel?: GenericErrorModalViewModel,
    options?: IbModalConfig,
  ) {
    const modalRef = this.showGenericComponentModal(
      IbCGenericErrorModalComponent,
      {
        ...options,
        windowClass: options?.windowClass
          ? `ib-modals ${options.windowClass}`
          : "ib-modals ib-modals--md",
      },
    );
    modalRef.componentInstance.model = viewModel ?? {};
    modalRef.componentInstance.error = error;
    return modalRef;
  }

  /**
   * @description A generic modal, very configurable, almost suitable for any kind of modal and the default to use for
   * commons cases.
   * @param viewModel A configurable model to show in the modal view, see GenericModalViewModel type for more info
   * @param options Modal options. See IbModalConfig type for more info
   * @author Iván Peña Huguet
   * @see https://ng-bootstrap.github.io/#/components/modal/api
   */
  showGenericModal(viewModel?: GenericModalViewModel, options?: IbModalConfig) {
    const modalRef = this.showGenericComponentModal(IbCGenericModalComponent, {
      ...options,
      windowClass: options?.windowClass
        ? `ib-modals ${options.windowClass}`
        : "ib-modals ib-modals--md ib-modals--padding-big",
    });
    modalRef.componentInstance.model = viewModel ?? {};
    return modalRef;
  }

  /**
   * @description Show a generic component modal in angular, pass a component or a template reference
   * @param component Component or template reference to show in the modal
   * @param options Modal options. See IbModalConfig type for more info
   * @author Iván Peña Huguet
   * @see https://ng-bootstrap.github.io/#/components/modal/api
   */
  showGenericComponentModal(
    component: TemplateRef<unknown>,
    inputOptions?: IbModalConfig,
  ): IbModalRef<undefined>;
  showGenericComponentModal<T = unknown>(
    component: Type<T>,
    inputOptions?: IbModalConfig,
  ): IbModalRef<T>;
  showGenericComponentModal<T = unknown>(
    component: Type<T> | TemplateRef<unknown>,
    inputOptions?: IbModalConfig,
  ): IbModalRef<T> {
    const options = { ...this.defaultModalConfig, ...inputOptions };

    const modalConfig: NgbModalOptions = {
      animation: options.animation,
      ariaDescribedBy: options.ariaDescribedBy,
      ariaLabelledBy: options.ariaLabelledBy,
      backdrop:
        options.modalBlocked && options.showBackdrop
          ? "static"
          : options.showBackdrop,
      backdropClass: options.backdropClass
        ? `ib-modals__backdrop ${options.backdropClass}`
        : "ib-modals__backdrop",
      fullscreen: options.fullscreen,
      size: options.size,
      keyboard: !options.modalBlocked,
      centered: options.verticallyCentered,
      scrollable: options.scrollable,
      windowClass:
        options.windowClass ?? "ib-modals ib-modals--md ib-modals--padding-big",
    };

    return this.modalService.open(component, modalConfig);
  }
}

downgradeToAJSService(
  "IbCModalService",
  IbCModalService,
  "ib-commons-modal-service-module",
);
