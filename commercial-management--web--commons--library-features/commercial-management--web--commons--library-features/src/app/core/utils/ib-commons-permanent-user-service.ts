import * as angular from "angular";
import { CommonsUtilService } from "./ib-commons-utils-service";
import { CommonsLoginUtilsService } from "../ib-login/services/ib-commons-login-access-utils-service";
import { CommonsModalService } from "../ib-modal/services/ib-modal-service";
import { RedirectionService } from "./ib-commons-redirection.service";
import { CommonsUserUtilsService } from "./ib-commons-user-utils.service";
import { IbCreditCardExistsService } from "../http-services/cust-cust/ib-credit-card-exists";

export class IbCPermanentUserService {
  private isUpgradingBids;
  private isCheckin;
  private isUpgradingAvios;
  private isUpgradingBidsAvios;

  constructor(
    private CommonsUserUtilsService: CommonsUserUtilsService,
    private RedirectionService: RedirectionService,
    private CommonsModalService: CommonsModalService,
    private IbCreditCardExistsService: IbCreditCardExistsService,
    private $window: ng.IWindowService,
    private $location: ng.ILocationService,
    private $filter: angular.IFilterFunction,
    private CommonsLoginUtilsService: CommonsLoginUtilsService,
    private CommonsUtilService: CommonsUtilService,
    private localStorageService: ng.local.storage.ILocalStorageService,
  ) {
    this.isUpgradingBids = false;
    this.isCheckin = false;
    this.isUpgradingAvios = false;
    this.isUpgradingBidsAvios = false;
  }

  /**
   * @returns {Promise<void>} Resolve to continue the flow normally in soft login, and reject to stop the flow
   */
  checkPermanentUserFlow = (flow?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      /* const permanentFlowChecks = () => {
                const isPassengerPage = this.$window.location.hash;
                switch (isPassengerPage) {
                        case 'MMB/CKI': this.checkPermanentUserPaymentFlow().then(res => resolve(), err => reject(err));
                            break;
                        default: resolve();
                }
            }; */
      const isPermanentUser = this.CommonsUserUtilsService.isSoftUser();
      this.isUpgradingBids = flow === "upgradingBids";
      this.isCheckin = flow === "CKI";
      this.isUpgradingAvios = flow === "upgradingAvios";
      this.isUpgradingBidsAvios = flow === "upgradingBidsAvios";
      if (isPermanentUser) {
        this.checkPermanentUserPaymentFlow().then(
          (res) => resolve(),
          (err) => reject(err),
        );
      } else {
        resolve();
      }
    });
  };

  private checkPermanentUserPaymentFlow = (): Promise<void> => {
    const showPaymentsModal = (resolve, reject) => {
      this.scrollToTop();
      if (this.isUpgradingAvios) {
        this.CommonsModalService.showGenericComponentModal(
          this.getPaymentAviosModal(),
          true,
        ).result.then(
          () => {
            this.redirectToLogin();
            reject();
          },
          () => {},
        );
      } else if (this.isUpgradingBidsAvios) {
        this.CommonsModalService.showGenericComponentModal(
          this.getPaymentAviosAndBidsModal(),
          true,
        ).result.then(
          () => {
            this.redirectToLogin();
            reject();
          },
          () => {
            resolve();
          },
        );
      } else {
        this.CommonsModalService.showGenericComponentModal(
          this.getPaymentModal(),
          true,
        ).result.then(
          () => {
            this.redirectToLogin();
            reject();
          },
          () => {
            resolve();
          },
        );
      }
    };

    return new Promise((resolve, reject) => {
      const isIbUser = this.CommonsUserUtilsService.isIbZero();
      if (isIbUser) {
        this.IbCreditCardExistsService.getCreditCardsNumber().then(
          (data: IbCreditCardExistsServiceModel.IbCreditCardExistsData) => {
            if (data.exists) {
              showPaymentsModal(resolve, reject);
            } else {
              resolve();
            }
          },
          resolve,
        );
      } else {
        showPaymentsModal(resolve, reject);
      }
    });
  };

  private getPaymentModal =
    (): CommonsModalsModels.GenericComponentModalModel => {
      const isIbUser = this.CommonsUserUtilsService.isIbZero();

      return {
        title: isIbUser
          ? "MODAL_PERMANENT_USER_IBERIA_TITLE"
          : "MODAL_PERMANENT_USER_IBERIA_PLUS_TITLE",
        body: isIbUser
          ? "MODAL_PERMANENT_USER_IBERIA_BODY"
          : "MODAL_PERMANENT_USER_IBERIA_PLUS_BODY_ONLY_CARDS",
        accept: "MODAL_PERMANENT_USER_IBERIA_PRIMARY_BUTTON",
        cancel: "MODAL_PERMANENT_USER_IBERIA_SECONDARY_BUTTON_CONTINUE",
        showCancelButton: true,
        showCloseButton: false,
      };
    };
  private getPaymentAviosModal =
    (): CommonsModalsModels.GenericComponentModalModel => {
      return {
        title: "MODAL_PERMANENT_USER_IBERIA_PLUS_TITLE",
        body: "MODAL_PERMANENT_USER_IBERIA_PLUS_BODY_ONLY_AVIOS",
        accept: "MODAL_PERMANENT_USER_IBERIA_PRIMARY_BUTTON",
        cancel: "MODAL_PERMANENT_USER_IBERIA_SECONDARY_BUTTON_CANCEL",
        showCancelButton: true,
        showCloseButton: false,
      };
    };

  private getPaymentAviosAndBidsModal =
    (): CommonsModalsModels.GenericComponentModalModel => {
      return {
        title: "MODAL_PERMANENT_USER_IBERIA_PLUS_TITLE",
        body: "MODAL_PERMANENT_USER_IBERIA_PLUS_BODY",
        accept: "MODAL_PERMANENT_USER_IBERIA_PRIMARY_BUTTON",
        cancel: "MODAL_PERMANENT_USER_IBERIA_SECONDARY_BUTTON_CONTINUE",
        showCancelButton: true,
        showCloseButton: false,
      };
    };

  private scrollToTop = () => {
    this.$window.scrollTo(0, 0);
  };

  private redirectToUpgrade = () => {
    this.RedirectionService.externalRedirect(
      this.$filter("LinksFilter")("UPGRADE_IBERIA_ZERO"),
    );
  };

  private redirectToLogin = () => {
    if (this.isCheckin) {
      this.localStorageService.set("softUserAfterLogin", "true");
    }
    this.RedirectionService.redirectToLoginPage(this.$location.absUrl());
  };

  private createUrlCallback = (): string => {
    let urlCallback =
      this.$window.location.origin +
      this.$window.location.pathname +
      this.$window.location.search;
    if (
      this.isUpgradingBids ||
      this.isUpgradingAvios ||
      this.isUpgradingBidsAvios
    ) {
      urlCallback +=
        "&softUser=false&upgradingBids=true" + this.$window.location.hash;
    } else {
      urlCallback += "&softUser=false" + this.$window.location.hash;
    }
    return urlCallback;
  };

  public isAfterLoginPermanentUser = () => {
    const isAfterLogin =
      this.CommonsUtilService.getURLFirstParameterByName(["softUser"]) ===
      "false";
    if (isAfterLogin) {
      this.CommonsUserUtilsService.setUserLogged(true);
    }
    return isAfterLogin;
  };

  public isAfterLoginBidsPermanentUser = () => {
    return (
      this.isAfterLoginPermanentUser &&
      this.CommonsUtilService.getURLFirstParameterByName(["upgradingBids"]) ===
        "true"
    );
  };

  public removeParamsAfterLogin = () => {
    if (this.isAfterLoginPermanentUser()) {
      this.$window.location.search = "";
      this.$location.url(this.$location.path());
    }
  };
}
IbCPermanentUserService.$inject = [
  "CommonsUserUtilsService",
  "RedirectionService",
  "CommonsModalService",
  "IbCreditCardExistsService",
  "$window",
  "$location",
  "$filter",
  "CommonsLoginUtilsService",
  "CommonsUtilService",
  "localStorageService",
];
try {
  const mod = angular.module("ib-commons-utils-module");
  mod.service("IbCPermanentUserService", IbCPermanentUserService);
} catch (error) {
  const mod = angular.module("ib-commons-utils-module", []);
  mod.service("IbCPermanentUserService", IbCPermanentUserService);
}
