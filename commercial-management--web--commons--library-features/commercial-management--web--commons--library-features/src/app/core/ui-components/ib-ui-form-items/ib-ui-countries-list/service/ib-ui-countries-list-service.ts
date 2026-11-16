import { GetCountriesListService } from "../../../../http-services/rdu-loc/ib-get-countries-list-service";

@Service("ib-ui-countries-list-module", [
  "$q",
  "GetCountriesListService",
  "ibUiCountriesListTransformer",
])
export class ibUiCountriesListService {
  public defer = this.$q.defer();
  constructor(
    private $q: ng.IQService,
    private GetCountriesListService: GetCountriesListService,
    private ibUiCountriesListTransformer: ibUiCountriesListTransformer,
  ) {}

  initializeCountriesList = (promise?: any): angular.IPromise<any> => {
    this.defer = this.$q.defer();

    const initializeCountriesListError = (error): void => {
      this.defer.reject(error);
    };

    const initializeCountriesListSuccess = (countriesData): void => {
      this.defer.resolve(
        this.ibUiCountriesListTransformer.transformCountriesList(countriesData),
      );
    };

    this.GetCountriesListService.getCountriesList().then(
      initializeCountriesListSuccess,
      initializeCountriesListError,
    );
    return this.defer.promise;
  };
}
