import { CommonsGetLoginInfoService } from "../../ib-login/services/ib-commons-get-login-info";
import { DatalayerUtilsService } from "../../ib-datalayer/services/ib-datalayer-utils-service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";
import { CommonsComponentUtils } from "../../utils/ib-commons-component-utils";
import { CommonsModalService } from "../../ib-modal/services/ib-modal-service";
import { CommonsUserUtilsService } from "../../utils/ib-commons-user-utils.service";
import { getSalesforceUrl, getSFClientId } from "ib-web-commons/utils";

@Component(
  "ib-ui-login-iframe",
  "ibUiLoginIframe",
  {
    bindings: {
      onLogged: "<",
      afterLogin: "<",
      onError: "<",
    },
    controllerAs: "ibUiLoginIframeCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-login-iframe-view.html`;
      },
    ],
  },
  [
    "$document",
    "$rootScope",
    "$timeout",
    "CommonsModalService",
    "CommonsGetLoginInfoService",
    "$scope",
    "$window",
    "localStorageService",
    "CommonsComponentUtils",
    "CommonsHttpServicesConstants",
    "DatalayerUtilsService",
    "CommonsUserUtilsService",
  ],
  [],
)
export class IbUiLoginIframeController implements ng.IController {
  public isLoading: boolean;
  public isIframeError: boolean = false;
  public onLogged: typeof Function;
  public afterLogin: typeof Function;
  public onError: (data?: any) => void;
  private iframeElement: HTMLIFrameElement;
  constructor(
    private $document: ng.IDocumentService,
    private $rootScope: CommonsRootScope,
    private $timeout: ng.ITimeoutService,
    private CommonsModalService: CommonsModalService,
    private CommonsGetLoginInfoService: CommonsGetLoginInfoService,
    private $scope: ng.IScope,
    private $window: ng.IWindowService,
    private localStorageService: angular.local.storage.ILocalStorageService,
    private CommonsComponentUtils: CommonsComponentUtils,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private DatalayerUtilsService: DatalayerUtilsService,
    private CommonsUserUtilsService: CommonsUserUtilsService,
  ) {
    this.$window.addEventListener("IDENTITY_LOGIN_SUCCESS", this.loginSuccess);
    this.$window.addEventListener("IDENTITY_LOGIN_FAILURE", this.loginFailure);
    this.$window.addEventListener("message", this.iframeSendLocalInfo);
    this.$scope.$on("$destroy", () => {
      this.$window.removeEventListener(
        "IDENTITY_LOGIN_SUCCESS",
        this.loginSuccess,
      );
      this.$window.removeEventListener(
        "IDENTITY_LOGIN_FAILURE",
        this.loginFailure,
      );
      this.$window.removeEventListener("message", this.iframeSendLocalInfo);
    });
  }
  $onInit = () => {
    this.loadIframe();
  };
  public iframeLoad = () => {
    this.$timeout(() => {
      this.$document[0]
        .getElementById("iframelogin")
        ?.appendChild(this.iframeElement);
    });
  };
  private loginIframeLoaded = () => {
    this.isLoading = false;
    this.CommonsComponentUtils.equalHeight(
      this.$document[0].getElementById("check_in_boxes"),
      false,
    );
  };
  private loginIframeError = () => {
    this.$rootScope.$broadcast("iframeLoginFailed");
  };
  private loginSuccess = () => {
    this.localStorageService.remove("customerData");
    const getUserLoggedProfile = () => {
      this.$scope.$emit("closeCollapseHeader");
      this.localStorageService.set(
        "recentLoggedUrl",
        this.$window.location.hash,
      );
      this.afterLogin(this.localStorageService.get("customerData"));
      this.CommonsUserUtilsService.removeSoftUser();
    };
    const manageGetInfoError = (error: any) => {
      this.onError(error);
    };
    this.CommonsGetLoginInfoService.checkCustomerStatus().then(
      getUserLoggedProfile,
      manageGetInfoError,
    );
  };

  private loginFailure = (evt: Event) => {
    const event = evt as CustomEvent<CommonsLoginNamespace.LoginFailureWCSData>;
    let modalBody: string = "REST_SERVICE_ERROR_GENERAL";
    if (event?.detail?.payload === "parental-control") {
      modalBody = "PARENTAL_LOGIN_ERROR";
    }

    this.onError();
    this.isIframeError = true;
    this.$timeout(() => {
      this.isIframeError = false;
    });

    const modalObject: CommonsErrorsModel.CommonsErrorsDataGeneral = {
      message: modalBody,
      needsTranslate: true,
    };

    this.CommonsModalService.showGenericError(
      modalObject,
      true,
      null,
    ).result.then(
      () => {
        this.loadIframe();
      },
      () => {
        this.loadIframe();
      },
    );
  };

  private loadIframe = () => {
    if (this.iframeElement) {
      this.iframeElement.remove();
    }

    this.iframeElement = this.$document[0].createElement("iframe");
    const iframeUri =
      getSalesforceUrl() +
      this.CommonsHttpServicesConstants.SALESFORCE_TOKEN.iframeURI;
    const iframeClientId = getSFClientId();

    this.isLoading = true;
    //RE SETEAR SRC
    this.iframeElement.src =
      iframeUri +
      "expid_2" +
      this.$rootScope.appMarket +
      this.$rootScope.appLang +
      "?response_type=code&prompt=login&client_id=" +
      iframeClientId +
      "&redirect_uri=" +
      this.$window.location.origin +
      "/integration/ibplus/login/";
    this.iframeElement.onload = this.loginIframeLoaded;
    this.iframeElement.onerror = this.loginIframeError;
    this.iframeElement.width = "100%";
    this.iframeElement.id = "iframeloginId";
    if (this.$document[0].getElementById("iframeReusableLogin")) {
      this.$timeout(() => {
        this.$document[0]
          .getElementById("iframelogin")
          .appendChild(this.iframeElement);
      }, 3000);
    } else {
      this.iframeLoad();
    }
  };

    private iframeSendLocalInfo = (event) => {
        if (
            (event.origin === this.CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PREE.replace('/IbIdentity', '') ||
            event.origin === this.CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PREB.replace('/IbIdentity', '') ||
            event.origin === this.CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.INT_AWS.replace('/IbIdentity', '') ||
            event.origin === this.CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PRE_AWS.replace('/IbIdentity', '') ||
            event.origin === this.CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PRO_AWS ||
            event.origin === this.CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PRO) &&
            typeof event.data === 'string'
        ) {
            if (event.data.split('_')[0] === 'ibLoginHeaderIframeHeight') {
                const iframeHeaderLogin = this.$document[0].getElementById('iframeloginId') as HTMLIFrameElement;
                if (iframeHeaderLogin) {
                    iframeHeaderLogin.style.height = event.data.split('_')[1] === '8px' ? '299px' : event.data.split('_')[1];
                    this.CommonsComponentUtils.equalHeight(this.$document[0].getElementById('check_in_boxes'), false);
                }
            } else if (event.data === 'ibLoginIframe2') {
                this.onLogged();
            }

      if (event.data === "loginOnRRSS") {
        localStorage.setItem(
          "returnURL",
          window.location.origin +
            window.location.pathname +
            window.location.search +
            "#!/loading",
        );
      }
    }
  };
}
