import { mock } from "./ib-ui-avios-summary-transformer-testMock";
import * as angular from "angular";

describe("ib-ui-avios-summary-transformer test", () => {
  let IbUiAviosSummaryTransformer;
  let localStorageService = mock.providers.fakeLocalStorageService;

  beforeEach(() => {
    angular.mock.module("ib-ui-avios-summary-module", ($provide) => {
      $provide.value(
        "CommonsAviosConstants",
        mock.providers.fakeCommonsAviosConstants,
      );
      $provide.value("$rootScope", mock.providers.fakeRootScope);
      $provide.value(
        "localStorageService",
        mock.providers.fakeLocalStorageService,
      );
    });
    angular.mock.inject((_IbUiAviosSummaryTransformer_) => {
      IbUiAviosSummaryTransformer = _IbUiAviosSummaryTransformer_;
    });
  });

    describe('generateResAviosSummaryModel test', () => {
        xit('generateResAviosSummaryModel test', () => {
            spyOn(IbUiAviosSummaryTransformer, 'getNameAndSurnamesByFlow').and.returnValue(mock.outputs.getNameAndSurnamesByFlow);

      expect(
        IbUiAviosSummaryTransformer.generateResAviosSummaryModel(
          mock.inputs.generateResAviosSummaryModel,
          mock.inputs.flowApp.BBKI,
        ),
      ).toEqual(mock.outputs.generateResAviosSummaryModel);
    });
  });


  describe("getNameAndSurnamesByFlow test", () => {
    it("getNameAndSurnamesByFlow BBKI test", () => {
      spyOn(localStorageService, "get").and.returnValue(
        mock.localStorage.bookingInfoBKI,
      );

      expect(
        IbUiAviosSummaryTransformer.getNameAndSurnamesByFlow(
          mock.inputs.flowApp.BBKI,
          mock.inputs.passenger_getNameAndSurnamesByFlow,
        ),
      ).toEqual(mock.outputs.getNameAndSurnamesByFlowBKI);
    });

    it("getNameAndSurnamesByFlow MMB test", () => {
      spyOn(localStorageService, "get").and.returnValue(
        mock.localStorage.breakdownInfoMMB,
      );

      expect(
        IbUiAviosSummaryTransformer.getNameAndSurnamesByFlow(
          mock.inputs.flowApp.MMB,
          mock.inputs.passenger_getNameAndSurnamesByFlow,
        ),
      ).toEqual(mock.outputs.getNameAndSurnamesByFlow);
    });

    it("getNameAndSurnamesByFlow CKI test", () => {
      spyOn(localStorageService, "get").and.returnValue(
        mock.localStorage.bookingInfoCKI,
      );

      expect(
        IbUiAviosSummaryTransformer.getNameAndSurnamesByFlow(
          mock.inputs.flowApp.CKI,
          mock.inputs.passenger_getNameAndSurnamesByFlow,
        ),
      ).toEqual(mock.outputs.getNameAndSurnamesByFlow);
    });
  });

  describe("generateReqAviosSummaryModel test", () => {
    it("generateReqAviosSummaryModel test", () => {
      expect(
        IbUiAviosSummaryTransformer.generateReqAviosSummaryModel(
          mock.inputs.generateReqAviosSummaryModel,
        ),
      ).toEqual(mock.outputs.generateReqAviosSummaryModel);
    });
  });
});
