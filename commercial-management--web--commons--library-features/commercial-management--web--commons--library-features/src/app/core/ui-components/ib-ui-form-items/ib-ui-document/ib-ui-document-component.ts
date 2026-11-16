import { CommonsConstantsType } from "../../../constants/ib-commons-constants";

@Component(
  "ib-ui-document-module",
  "ibUiDocument",
  {
    bindings: {
      containerForm: "=",
      documentSelected: "=",
      required: "=",
      editionMode: "<",
    },
    controllerAs: "ibUiDocumentCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope) => {
        return `${$rootScope.routes.templates}ib-ui-document-view.html`;
      },
    ],
  },
  ["CommonsConstants"],
  [],
)
class ibUiDocument implements ng.IController {
  public documentTypeList = [];
  constructor(private CommonsConstants: CommonsConstantsType) {
    this.documentTypeList = this.CommonsConstants.TYPE_DOCUMENT;
  }

  ////////////////

  $onInit() {}
}
