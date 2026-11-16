enum flowApp {
  BBKI = "BBKI",
  MMB = "MMB",
  CKI = "CKI",
}

export const mock = {
  inputs: {
    flowApp: flowApp,
    getCalculateAviosSummary: {
      currency: {
        code: "EUR",
      },
      passengers: [
        {
          id: "ADULT_01",
          memberIdentifier: null,
          flight: {
            slices: [
              {
                id: "MADBIO20221026074000",
                fare: 143,
                totalFare: 143,
              },
            ],
          },
        },
      ],
      flight: {
        discounts: [],
        yq: 0,
        slices: [
          {
            id: "MADBIO20221026074000",
            segments: [
              {
                id: "IB044820221026",
                operatingCarrier: {
                  code: "IB",
                },
                marketingCarrier: {
                  code: "IB",
                },
                schedule: {
                  departureAirportCode: "MAD",
                  arrivalAirportCode: "BIO",
                  departureDate: "2022-10-26",
                },
                bookingClass: {
                  code: "V",
                },
                bookingCabin: {
                  code: "E",
                },
              },
            ],
          },
        ],
      },
    },
  },
  outputs: {
    generateResAviosSummaryModel: {
      passengers: [
        {
          name: "test",
          surnames: "test",
          id: "ADULT_01",
          memberIdentifier: null,
          items: [
            {
              title: "ANCILLARIES_BAGGAGE_TITLE_15",
              aviosAmount: 130,
              pointsAmount: 0,
            },
            {
              title: "ANCILLARIES_BAGGAGE_TITLE_23",
              aviosAmount: 90,
              pointsAmount: 0,
            },
          ],
          totalAviosPassenger: 1710,
          totalPointsPassenger: 50,
          flights: {
            aviosAmount: 1490,
            pointsAmount: 50,
          },
        },
      ],
      totalAvios: 1710,
      totalPoints: 50,
    },
  },
  localStorage: {},
  providers: {
    fakeLocalStorageService: {
      get: (param: string): any => {},
      set: (param: string): any => {},
      remove: () => {},
      clear: () => {},
    },
    fakeRootScope: {
      $digest: () => {},
      $broadcast: () => {},
    },
    fakeIbUiAviosSummaryTransformer: {
      generateReqAviosSummaryModel: () => {},
      generateResAviosSummaryModel: () => {
        return { totalAvios: 10, totalPoints: 20 };
      },
    },
    fakeibCCalculatePointsService: { getCalculateAviosSummary: () => {} },
  },
};
