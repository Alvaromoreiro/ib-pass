import { CommonsGenericSFProxy } from "../../proxies/ib-commons-SF-generic-proxy";
import { CommonsUtilService } from "../../utils/ib-commons-utils-service";
import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsGenericSFProxy",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
  "localStorageService",
  "CommonsUtilService",
])
export class IBCAssociatesZeroService {
  private counterAttemps = 0;
  private memberID: string;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericSFProxy: CommonsGenericSFProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private localStorageService: ng.local.storage.ILocalStorageService,
    private CommonsUtilService: CommonsUtilService,
  ) {}

  /**
   * @function getRetrieveAssociateZero
   *
   * This operation is used to retrieve the list of a Travel companion or Friends & Family member
   *
   * @return {Object} Return the promise with the response data
   */
  getRetrieveAssociateZero = (
    promise?: angular.IDeferred<
      CommonsServiceTypes.CommonsProxyResponse<CommonsHttpModels.ResponseGetCompanionsData>
    >,
  ): angular.IPromise<
    CommonsServiceTypes.CommonsProxyResponse<CommonsHttpModels.ResponseGetCompanionsData>
  > => {
    let defer: angular.IDeferred<
      CommonsServiceTypes.CommonsProxyResponse<CommonsHttpModels.ResponseGetCompanionsData>
    > = promise ?? this.$q.defer();
    const getRetrieveAssociateZeroSuccess = (associateData): void => {
      defer.resolve(associateData);
      defer = null;
      this.counterAttemps = 0;
    };
    const getRetrieveAssociateZeroError = (error): void => {
      this.CommonsHttpUtilsErrorService.controlError(
        error,
        this.counterAttemps,
        getRetrieveAssociateZeroCallback,
        defer,
        true,
      );
    };
    const getRetrieveAssociateZeroCallback = (defer?): void => {
      this.counterAttemps++;
      this.getRetrieveAssociateZero(defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
        .RETRIEVE_IB_ZERO_ASSOCIATES;
    this.CommonsGenericSFProxy.getGeneric(endpoint).then(
      getRetrieveAssociateZeroSuccess,
      getRetrieveAssociateZeroError,
    );

    return defer.promise;
  };

  getRetrieveAssociateDetail = (
    request: string,
    promise?: angular.IDeferred<
      CommonsServiceTypes.CommonsProxyResponse<CommonsHttpModels.GetCompanionsData>
    >,
  ): angular.IPromise<any> => {
    let defer: angular.IDeferred<
      CommonsServiceTypes.CommonsProxyResponse<CommonsHttpModels.GetCompanionsData>
    > = promise ?? this.$q.defer();
    this.memberID = this.CommonsUtilService.getFFUser();
    const getRetrieveAssociateZeroDetailSuccess = (associateData): void => {
      defer.resolve(associateData);
      defer = null;
      this.counterAttemps = 0;
    };
    const getRetrieveAssociateZeroDetailError = (error): void => {
      this.CommonsHttpUtilsErrorService.controlError(
        error,
        this.counterAttemps,
        getRetrieveAssociateZeroDetailCallback,
        defer,
        true,
      );
    };
    const getRetrieveAssociateZeroDetailCallback = (defer?): void => {
      this.counterAttemps++;
      this.getRetrieveAssociateDetail(request, defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.RETRIEVE_IB_ZERO_ASSOCIATE.replace(
        "{{memberIdentifier}}",
        this.memberID,
      )
        .replace("{{associate-identifier}}", request)
        .replace("{{programme-identifier}}", "IBP");
    this.CommonsGenericSFProxy.getGeneric(endpoint).then(
      getRetrieveAssociateZeroDetailSuccess,
      getRetrieveAssociateZeroDetailError,
    );
    return defer.promise;
  };

  /**
   * @function addAssociateZero
   *
   * This operation is used to add the details of a Travel companion or Friends & Family member
   *
   * @param {*} request
   * @return {Object} Return the promise with the response data
   */
  addAssociateZero = (request, promise?: angular.IDeferred<any>) => {
    let defer = promise ?? this.$q.defer();

    const addAssociateZeroSuccess = (data) => {
      defer.resolve(data);
      defer = null;
      this.counterAttemps = 0;
    };
    const addAssociateZeroError = (error): void => {
      this.CommonsHttpUtilsErrorService.controlError(
        error,
        this.counterAttemps,
        addAssociateZeroCallback,
        defer,
        true,
      );
    };
    const addAssociateZeroCallback = (defer?): void => {
      this.counterAttemps++;
      this.addAssociateZero(request, defer);
    };
    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
        .ADD_IB_ZERO_ASSOCIATE;

    this.CommonsGenericSFProxy.postGeneric(endpoint, request).then(
      addAssociateZeroSuccess,
      addAssociateZeroError,
    );
    return defer.promise;
  };

  /**
   * @function updateAssociateZero
   *
   * This operation is used to update the details of a Travel companion or Friends & Family member
   *
   * @param {*} request
   * @return {Object} Return the promise with the response data
   */
  updateAssociateZero = (
    request,
    beneficiaryNumber,
    promise?: angular.IDeferred<any>,
  ) => {
    let defer = promise ?? this.$q.defer();

    const updateAssociateZeroSuccess = (data) => {
      defer.resolve(data);
      defer = null;
      this.counterAttemps = 0;
    };
    const updateAssociateZeroError = (error): void => {
      this.CommonsHttpUtilsErrorService.controlError(
        error,
        this.counterAttemps,
        updateAssociateZeroCallback,
        defer,
        true,
      );
    };
    const updateAssociateZeroCallback = (defer?): void => {
      this.counterAttemps++;
      this.updateAssociateZero(request, beneficiaryNumber, defer);
    };
    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.UPDATE_IB_ZERO_ASSOCIATE.replace(
        "{{associate-identifier}}",
        beneficiaryNumber,
      );

    this.CommonsGenericSFProxy.putGeneric(endpoint, request).then(
      updateAssociateZeroSuccess,
      updateAssociateZeroError,
    );
    return defer.promise;
  };
  /**
   * @function deleteAssociateZero
   *
   * This operation is used to delete the details of a Travel companion or Friends & Family member
   *
   * @param {*} request
   * @return {Object} Return the promise with the response data
   */
  deleteAssociateZero = (request, promise?: angular.IDeferred<any>) => {
    let defer = promise ?? this.$q.defer();

    const deleteAssociateZeroSuccess = (data) => {
      defer.resolve(data);
      defer = null;
      this.counterAttemps = 0;
    };
    const deleteAssociateZeroError = (error): void => {
      this.CommonsHttpUtilsErrorService.controlError(
        error,
        this.counterAttemps,
        deleteAssociateZeroCallback,
        defer,
        true,
      );
    };
    const deleteAssociateZeroCallback = (defer?): void => {
      this.counterAttemps++;
      this.deleteAssociateZero(request, defer);
    };
    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.DELETE_IB_ZERO_ASSOCIATES.replace(
        "{{associate-identifier}}",
        request,
      );

    this.CommonsGenericSFProxy.deleteGeneric(endpoint).then(
      deleteAssociateZeroSuccess,
      deleteAssociateZeroError,
    );
    return defer.promise;
  };
}
