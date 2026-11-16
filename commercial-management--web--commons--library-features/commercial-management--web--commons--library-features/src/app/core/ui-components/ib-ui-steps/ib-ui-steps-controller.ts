@Component(
  "ib-ui-steps-module",
  "ibUiSteps",
  {
    bindings: {
      steps: "<",
      showNumbers: "<",
    },
    controllerAs: "ibUiStepsCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-steps-view.html`;
      },
    ],
  },
  [],
  [],
)
class IbUiStepsController implements ng.IController {
  public steps: UiComponentsModel.StepInfoUiComponent[];
  public showNumbers: boolean;
  constructor() {}

  $onInit() {
    if (!this.steps || this.steps.length === 0) {
      this.steps = [
        {
          name: "Step 1",
          isActive: true,
        },
        {
          name: "Step 2",
          isActive: false,
        },
        {
          name: "Step 3",
          isActive: false,
        },
      ];
    }
    if (angular.isUndefined(this.showNumbers)) {
      this.showNumbers === true;
    }
  }
}
