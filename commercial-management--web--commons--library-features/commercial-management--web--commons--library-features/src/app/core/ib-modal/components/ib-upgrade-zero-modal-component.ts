import { RedirectionService } from "../../utils/ib-commons-redirection.service";

@Component(
  "ib-commons-modal-service-module",
  "upgradeZeroModalComponent",
  {
    bindings: {
      resolve: "<",
      modalInstance: "<",
    },
    controllerAs: "modalCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-modal-redemption-upgrade.html`;
      },
    ],
  },
  ["RedirectionService", "$filter"],
  [],
)
class UpgradeZeroModalComponent {
  public modalInstance;
  public resolve;
  constructor(
    private RedirectionService: RedirectionService,
    private $filter: ng.IFilterFunction,
  ) {}

  $onInit() {}

  close = (): void => {
    this.modalInstance.dismiss();
  };

  accept = () => {
    sessionStorage.setItem(
      "urlUpgradeRedirect",
      this.resolve.object.redirectionUrl,
    );
    this.RedirectionService.externalRedirect(
      this.$filter("LinksFilter")("UPGRADE_IBERIA_ZERO"),
    );
  };

  continue = (type: object) => {
    this.modalInstance.close(type);
  };
}
