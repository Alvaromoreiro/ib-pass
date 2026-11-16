import { GetCommunityListByCountryService } from "../../../http-services/rdu-loc/ib-get-communities-list-service";

@Service("ib-ui-province-module", ["$q", "GetCommunityListByCountryService"])
export class ibUiProvinceService {
  public defer = this.$q.defer();
  constructor(
    private $q: ng.IQService,
    private GetCommunityListByCountryService: GetCommunityListByCountryService,
  ) {}

  initProvinceList = (promise?: any): ng.IPromise<any> => {
    this.defer = this.$q.defer();

    const initProvinceListError = (error): void => {
      this.defer.reject(error);
    };

    const initProvinceListSuccess = (states): void => {
      this.defer.resolve(states);
    };
    this.GetCommunityListByCountryService.getCommunityListByCountry("ES").then(
      initProvinceListSuccess,
      initProvinceListError,
    );

    return this.defer.promise;
  };
}
