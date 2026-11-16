import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsGenericSFProxy } from "../../proxies/ib-commons-SF-generic-proxy";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsGenericSFProxy",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
])
export class IBCTripDocumentsService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericSFProxy: CommonsGenericSFProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
  ) {}

  getTripDocuments = (promise?: any): angular.IPromise<any> => {
    let defer = this.$q.defer();

    const getTripDocumentsSuccess = (TripDocumentsData): void => {
      defer.resolve(TripDocumentsData);
      defer = null;
      this.counterAttemps = 0;
    };
    const getTripDocumentsError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getTripDocumentsCallback,
              error,
              defer,
            ),
            { defer: defer },
          );
          break;
        case 401:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.unauthorizedError(
              this.counterAttemps,
              getTripDocumentsCallback,
              error,
              defer,
              true,
            ),
            { defer: defer },
          );
          break;
        default:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.processGeneralError(error),
            { defer: defer },
          );
      }
    };

    const getTripDocumentsCallback = (defer): void => {
      this.counterAttemps++;
      this.getTripDocuments(defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.TRAVEL_DOCUMENTS;
    this.CommonsGenericSFProxy.getGeneric(endpoint).then(
      getTripDocumentsSuccess,
      getTripDocumentsError,
    );
    return defer.promise;
  };

  addTripDocument = (tripDocument, promise?: any): angular.IPromise<any> => {
    let defer = this.$q.defer();

    const addTripDocumentSuccess = (TripDocumentsData): void => {
      defer.resolve(TripDocumentsData);
      defer = null;
      this.counterAttemps = 0;
    };
    const addTripDocumentError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              addTripDocumentCallback,
              error,
              defer,
            ),
            { defer: defer },
          );
          break;
        case 401:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.unauthorizedError(
              this.counterAttemps,
              addTripDocumentCallback,
              error,
              defer,
              true,
            ),
            { defer: defer },
          );
          break;
        default:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.processGeneralError(error),
            { defer: defer },
          );
      }
    };

    const addTripDocumentCallback = (defer): void => {
      this.counterAttemps++;
      this.addTripDocument(tripDocument, defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.TRAVEL_DOCUMENTS;
    this.CommonsGenericSFProxy.postGeneric(endpoint, tripDocument).then(
      addTripDocumentSuccess,
      addTripDocumentError /* updatePersonalDataError */,
    );

    return defer.promise;
  };

  modifyTripDocument = (
    tripDocument,
    id?,
    promise?: any,
  ): angular.IPromise<any> => {
    let defer = this.$q.defer();

    const modifyTripDocumentSuccess = (TripDocumentsData): void => {
      defer.resolve(TripDocumentsData);
      defer = null;
      this.counterAttemps = 0;
    };
    const modifyTripDocumentError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              modifyTripDocumentCallback,
              error,
              defer,
            ),
            { defer: defer },
          );
          break;
        case 401:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.unauthorizedError(
              this.counterAttemps,
              modifyTripDocumentCallback,
              error,
              defer,
              true,
            ),
            { defer: defer },
          );
          break;
        default:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.processGeneralError(error),
            { defer: defer },
          );
      }
    };

    const modifyTripDocumentCallback = (defer): void => {
      this.counterAttemps++;
      this.addTripDocument(tripDocument, defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.TRAVEL_DOCUMENTS +
      "/" +
      id;
    this.CommonsGenericSFProxy.putGeneric(endpoint, tripDocument).then(
      modifyTripDocumentSuccess,
      modifyTripDocumentError,
    );

    return defer.promise;
  };

  deleteTripDocument = (id?, promise?: any): angular.IPromise<any> => {
    let defer = this.$q.defer();

    const deleteTripDocumentSuccess = (TripDocumentsData): void => {
      defer.resolve(TripDocumentsData);
      defer = null;
      this.counterAttemps = 0;
    };
    const deleteTripDocumentError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              deleteTripDocumentCallback,
              error,
              defer,
            ),
            { defer: defer },
          );
          break;
        case 401:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.unauthorizedError(
              this.counterAttemps,
              deleteTripDocumentCallback,
              error,
              defer,
              true,
            ),
            { defer: defer },
          );
          break;
        default:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.processGeneralError(error),
            { defer: defer },
          );
      }
    };

    const deleteTripDocumentCallback = (defer): void => {
      this.counterAttemps++;
      this.addTripDocument(id, defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.TRAVEL_DOCUMENTS +
      "/" +
      id;
    this.CommonsGenericSFProxy.deleteGeneric(endpoint).then(
      deleteTripDocumentSuccess,
      deleteTripDocumentError,
    );

    return defer.promise;
  };
}

type TripResponse = {
  data: CommonsFormsModelsNamespace.ItripDocument[];
};
