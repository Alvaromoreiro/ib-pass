@Component(
  "ib-ui-countries-list-module",
  "ibUiCountriesList",
  {
    bindings: {
      countrySelected: "=",
      updateCountry: "=",
      required: "<",
      error: "<",
    },
    controllerAs: "ibUiCountriesCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope) => {
        return `${$rootScope.routes.templates}ib-ui-countries-list-view.html`;
      },
    ],
  },
  ["ibUiCountriesListService"],
  [],
)
class ibUiCountries implements ng.IController {
  public countriesList;
  public countrySelected;
  public updateCountry: typeof Function;
  constructor(private ibUiCountriesListService) {}

  ////////////////

  $onInit() {
    this.ibUiCountriesListService.initializeCountriesList().then(
      (response) => {
        this.countriesList = response;
        this.countrySelected = this.countriesList.find(
          (item) => item.id === this.countrySelected.id,
        );
      },
      () => {},
    );
  }

  changeCountry = () => {
    this.updateCountry();
  };
}
