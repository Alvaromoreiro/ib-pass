import { CommonsConstantsType } from "../../../constants/ib-commons-constants";

@Component(
  "ib-ui-gender-module",
  "ibUiGender",
  {
    bindings: {
      containerForm: "=",
      genderSelected: "=",
      editionMode: "<",
    },
    controllerAs: "ibUiGenderCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope) => {
        return `${$rootScope.routes.templates}ib-ui-gender-view.html`;
      },
    ],
  },
  ["CommonsConstants"],
  [],
)
class ibUiGender implements ng.IController {
  public genderList = [];
  constructor(private CommonsConstants: CommonsConstantsType) {
    this.genderList = this.CommonsConstants.GENDER_ARRAY;
  }

  ////////////////

  $onInit() {}
}
