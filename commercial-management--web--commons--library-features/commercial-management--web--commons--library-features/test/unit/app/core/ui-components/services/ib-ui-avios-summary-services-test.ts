import { mock } from "./ib-ui-avios-summary-services-testMock";
import * as angular from "angular";

describe("IbUiAviosSummaryService test", () => {
  let IbUiAviosSummaryService, rootScope;

  beforeEach(() => {
    angular.mock.module("ib-ui-avios-summary-module", ($provide) => {
      $provide.value("$rootScope", mock.providers.fakeRootScope);
      $provide.value(
        "localStorageService",
        mock.providers.fakeLocalStorageService,
      );
      $provide.value(
        "ibCCalculatePointsService",
        mock.providers.fakeibCCalculatePointsService,
      );
      $provide.value(
        "IbUiAviosSummaryTransformer",
        mock.providers.fakeIbUiAviosSummaryTransformer,
      );
    });
    angular.mock.inject((_IbUiAviosSummaryService_, $rootScope) => {
      IbUiAviosSummaryService = _IbUiAviosSummaryService_;
      rootScope = $rootScope;
    });
  });

  describe("getCalculateAviosSummary promise test", () => {
    it(" and resolve promise", (done: DoneFn) => {
      angular.mock.inject(() => {
        mock.providers.fakeibCCalculatePointsService.getCalculateAviosSummary =
          jasmine.createSpy("getCalculateAviosSummary").and.callFake(() => {
            return Promise.resolve({ totalAvios: 10, totalPoints: 20 });
          });
      });

      IbUiAviosSummaryService.getCalculateAviosSummary(
        mock.inputs.getCalculateAviosSummary,
      )
        .then((data) => {
          expect(data).toEqual({ totalAvios: 10, totalPoints: 20 });
          done();
        })
        .catch(() => {
          done.fail();
        });

      rootScope.$digest();
    });

    it("and reject promise", (done) => {
      angular.mock.inject(() => {
        mock.providers.fakeibCCalculatePointsService.getCalculateAviosSummary =
          jasmine.createSpy("getCalculateAviosSummary").and.callFake(() => {
            return Promise.reject("err");
          });
      });

      IbUiAviosSummaryService.getCalculateAviosSummary(
        mock.inputs.getCalculateAviosSummary,
      )
        .then(() => {
          done.fail();
        })
        .catch((err) => {
          expect(err).toEqual("err");
          done();
        });

      rootScope.$digest();
    });
  });
});
