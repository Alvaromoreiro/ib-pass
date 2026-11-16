import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsHttpServicesConstants",
  "CommonsHttpUtilsErrorService",
  "CommonsGenericProxy",
])
export class CommonsOriginDestinationCitiesListService {
  public NUM_ATTEMPS: number;
  constructor(
    private $q: ng.IQService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private HttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsGenericProxy: CommonsGenericProxy,
  ) {
    this.NUM_ATTEMPS = 0;
  }

  getOriginOrDestinationCitiesByTypeAndAreas = (
    place: string,
    type: string = undefined,
    areas: string = undefined,
  ): angular.IPromise<any> => {
    let defer = this.$q.defer();
    const getDestinationCitiesByTypeAndAreasSuccess = (
      destinationCities: any,
    ): void => {
      defer.resolve(destinationCities.data);
      defer = null;
      this.NUM_ATTEMPS = 0;
    };

    const getDestinationCitiesByTypeAndAreasCallback = () => {
      this.NUM_ATTEMPS++;
      this.getOriginOrDestinationCitiesByTypeAndAreas(place, type, areas);
    };

    const getDestinationCitiesByTypeAndAreasError = (
      error: CommonsErrorsModel.ErrorDataGeneral,
    ): void => {
      this.HttpUtilsErrorService.controlError(
        error,
        this.NUM_ATTEMPS,
        getDestinationCitiesByTypeAndAreasCallback,
        defer,
        true,
      );
    };

    const endpoint =
      this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS[place] +
      (type ? "?type=" + type : "") +
      (areas ? "&areas=" + areas : "");
    this.CommonsGenericProxy.getGeneric(endpoint).then(
      getDestinationCitiesByTypeAndAreasSuccess,
      getDestinationCitiesByTypeAndAreasError,
    );
    return defer.promise;
  };
}
