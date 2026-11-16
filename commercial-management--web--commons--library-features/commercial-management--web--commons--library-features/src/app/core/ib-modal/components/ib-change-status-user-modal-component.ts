import { IbCCustomerDataService } from "../../http-services/cust-cust/ib-customer-data-service";
import { CommonsLoginUtilsService } from "../../ib-login/services/ib-commons-login-access-utils-service";

@Component(
  "ib-commons-modal-service-module",
  "ibChangeStatusUserModalComponent",
  {
    bindings: {
      resolve: "<",
      modalInstance: "<",
    },
    controllerAs: "modalCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-modal-change-status-user-modal.html`;
      },
    ],
  },
  ["IbCCustomerDataService", "CommonsLoginUtilsService", "localStorageService"],
  [],
)
export class ibChangeStatusUserModalComponent {
  public modalInstance;
  public isLoading: boolean;
  private model;

  constructor(
    private IbCCustomerDataService: IbCCustomerDataService,
    private CommonsLoginUtilsService: CommonsLoginUtilsService,
    private localStorageService: ng.local.storage.ILocalStorageService,
  ) {}

    $onInit () {
        this.isLoading = false;
        this.model = {
            title: 'OH_LOGIN_ADVICE_MODAL_TITLE',
            body: 'OH_LOGIN_ADVICE_MODAL_BODY',
            accept: 'OH_LOGIN_ADVICE_MODAL_BUTTON'
        };
    }

  continue = () => {
    this.isLoading = true;
    this.IbCCustomerDataService.getCustomerData().then(
      () => {
        this.isLoading = false;
        this.modalInstance.close();
      },
      () => {
        this.localStorageService.set("reloadCustomerComplete", false);
        this.CommonsLoginUtilsService.updateStateToAnonymous();
        this.isLoading = false;
        this.modalInstance.close();
      },
    );
  };
}
