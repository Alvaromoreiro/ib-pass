import { ibUiProvinceService } from "./ib-ui-province-service";

@Component(
  "ib-ui-province-module",
  "ibUiProvince",
  {
    bindings: {
      containerForm: "<",
      provinceSelected: "=",
      editionMode: "<",
      isRequired: "<?",
      serviceError: "=",
    },
    controllerAs: "ibUiProvinceCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope) => {
        return `${$rootScope.routes.templates}ib-ui-province-view.html`;
      },
    ],
  },
  ["ibUiProvinceService"],
  [],
)
export class ibUiProvince implements ng.IController {
  public serviceError: boolean;
  public provinceList = [];
  public provinceSelected: any;
  constructor(private ibUiProvinceService: ibUiProvinceService) {
    this.provinceList = [];
  }

  ////////////////

  initProvinceList = (): void => {
    this.ibUiProvinceService.initProvinceList().then(
      (response) => {
        this.provinceList = response;
        this.provinceSelected = this.provinceList.filter(
          (item) => item.description === this.provinceSelected.description,
        )[0];
        this.serviceError = false;
      },
      () => {
        this.serviceError = true;
      },
    );
  };

  $onInit() {
    this.initProvinceList();
  }
}
