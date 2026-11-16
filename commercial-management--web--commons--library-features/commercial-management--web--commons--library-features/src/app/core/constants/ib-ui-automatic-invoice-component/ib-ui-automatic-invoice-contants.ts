import * as angular from "angular";

const IbUiAutomaticInvoiceConstants = {
  EMPTY_ISSUE_ORDER_RESPONSE: {
    data: {
      order: {
        orderId: "",
        bookingReferences: [
          {
            provider: "",
            reference: "",
          },
        ],
        orderItems: [
          {
            type: "",
            orderItemId: "",
            bookingReferences: [
              {
                provider: "",
                reference: "",
              },
            ],
            price: {
              fare: 0,
              tax: 0,
              total: 0,
              currency: "EUR",
              ticketingFee: 0,
            },
            sliceIds: ["", ""],
            passengerPrices: [
              {
                fareCalculation: "MAD IB BIO181.00 IB MAD96.00EUR277.00END",
                passengerId: "ADULT_01",
                price: {
                  fare: 277,
                  tax: 30.63,
                  total: 307.63,
                  currency: "EUR",
                  ticketingFee: 0,
                },
                segmentPrices: [
                  {
                    price: {
                      fare: 96,
                      currency: "EUR",
                    },
                    fareCode: "SDNNB4",
                    segmentsIds: ["IB042320221021"],
                    ticketDesignator: null,
                    penalties: [
                      {
                        type: "Change",
                        application: "BEFORE-DEPARTURE",
                        minPrice: {
                          amount: 65,
                          currency: "EUR",
                        },
                        maxPrice: {
                          amount: 65,
                          currency: "EUR",
                        },
                        nonrefundable: true,
                        cancelFeeInd: false,
                        changeFeeInd: false,
                        isRefundable: false,
                        isChangeable: false,
                      },
                    ],
                    penaltyFlags: null,
                  },
                ],
                taxes: [
                  {
                    code: "JD",
                    amount: 15.93,
                    currency: "EUR",
                    description: "Cargo por salida",
                    subcode: null,
                    country: null,
                    carrier: null,
                  },
                ],
                orderItemPaymentInfos: [],
              },
            ],
            sliceBaggage: [
              {
                sliceId: "MADBIO20221020221000",
                passengersBaggage: [
                  {
                    passengersId: ["ADULT_01"],
                    handBaggageAllowances: [
                      {
                        baggageConcept: "PIECE",
                        totalQuantity: 2,
                      },
                    ],
                    baggageInHoldAllowances: [],
                  },
                ],
              },
            ],
          },
        ],
        slices: [
          {
            sliceId: "",
            departureDateTime: "",
            arrivalDateTime: "",
            duration: 0,
            stopsNumber: 0,
            price: {
              fare: 0,
              currency: "EUR",
            },
            detailedPrices: [
              {
                fare: 0,
                currency: "EUR",
                passengerIds: ["ADULT_01"],
                segmentPrices: [
                  {
                    price: {
                      fare: 0,
                      currency: "EUR",
                    },
                    fareCode: "",
                    segmentsIds: [""],
                    ticketDesignator: null,
                    penalties: [],
                    penaltyFlags: null,
                  },
                ],
              },
            ],
            segments: [
              {
                departure: {
                  code: "",
                  name: "",
                  terminal: "",
                  city: {
                    code: "",
                    description: "",
                    countryCode: "",
                    country: {
                      code: "",
                      description: "",
                    },
                  },
                },
                arrival: {
                  code: "",
                  name: "",
                  terminal: "",
                  city: {
                    code: "",
                    description: "",
                    countryCode: "",
                    country: {
                      code: "",
                      description: "",
                    },
                  },
                },
                flight: {
                  marketingCarrier: {
                    code: "",
                    name: "",
                  },
                  operationalCarrier: {
                    code: "",
                    name: "",
                  },
                  marketingFlightNumber: "",
                  operationalFlightNumber: "",
                  operationalDisclosure: "",
                  aircraft: {
                    code: "",
                    description: "",
                  },
                },
                cabin: {
                  rbd: "",
                  bookingCode: "",
                  bookingClass: "",
                  remainingSeats: 1,
                  fareFamily: "",
                  seatDisplays: null,
                  brandCode: null,
                  cabinDescription: "",
                },
                overnight: false,
                id: "",
                duration: 0,
                waitingTime: 0,
                providerId: null,
                ticketDesignator: "",
                secureFlightInformed: false,
                secureFlight: false,
                departureDateTime: "",
                arrivalDateTime: "",
              },
            ],
            overnight: false,
            origin: "",
            destination: "",
            originDestinationKey: null,
          },
        ],
        price: {
          fare: 0,
          tax: 0,
          total: 0,
          currency: "EUR",
          ticketingFee: 0,
        },
        primaryContactInfo: {
          phone: "",
          email: "",
          phoneType: "",
          confirmationMailOption: null,
          refundEmail: null,
        },
        privateFareImformations: [],
        commissions: [],
        apisRequired: false,
        voucherCompensation: null,
        specialDiscounts: [],
        sender: null,
        checkedBagAllowances: [
          {
            baggageAllowanceId: "",
            totalQuantity: 0,
            pieceAllowances: [],
            segmentIds: [""],
          },
        ],
        carryOnBaggageAllowances: [
          {
            baggageAllowanceId: "",
            totalQuantity: 1,
            segmentIds: ["", ""],
          },
        ],
        brandedFares: null,
      },
      passengers: [
        {
          passengerType: "",
          personalInfo: {
            firstName: "",
            firstSurname: "",
            lastSurname: "",
            birthDate: null,
            surnameSuffix: null,
          },
          passengerId: "ADULT_01",
          idInfo: null,
          contactInfo: null,
          residenceAccreditationStatus: null,
          documentInfos: null,
          redressInfo: null,
          externalPersonalInfo: {
            name: "",
            firstSurname: "",
            lastSurname: "",
          },
          emergencyContactInfoWeb: null,
        },
      ],
      tickets: [
        {
          ticketNumbers: [""],
          type: "",
          orderItemId: "",
          passengerId: "ADULT_01",
          issueDateTime: "",
          fareCalculation: null,
          taxes: [],
          coupons: [],
          iataCode: null,
          issueCity: null,
          passengerType: "",
          paymentInfo: null,
          emdsList: [],
          creditCardFeePrice: null,
          conjunctionTickets: null,
          reissueHistory: [],
          taxedPrice: null,
        },
      ],
      warnings: [
        {
          code: "",
          description: "",
        },
      ],
      paymentMethod: {
        type: "",
        cardTypeId: "1",
        profileCardId: null,
        maskedCreditCard: "",
        payer: {
          personalInfo: {
            name: "",
            surname: "",
          },
          contactInfo: {
            phone: "",
            email: "",
            phoneType: "null",
            confirmationMailOption: null,
            refundEmail: null,
          },
          idInfo: null,
          address: {
            street: null,
            streetNumber: null,
            city: null,
            state: null,
            country: "US",
            zip: null,
          },
        },
        associatedDiscounts: [],
      },
      paymentItems: [
        {
          type: "",
          tokenizedCardNumber: "",
          maskedCardNumber: "",
          authorization: "",
          subtotal: 0,
          totalFee: 0,
          total: 0,
          unityFee: 0,
          currency: "EUR",
          cofInclusion: false,
        },
      ],
      contextMetadata: {
        language: "es",
        country: "ES",
        currencies: [
          {
            code: "EUR",
            description: "Euro",
            symbol: "€",
            alignment: "R",
            groupingSeparator: ".",
            decimalSeparator: ",",
            decimals: 2,
            recommendedDisplay: "symbol",
          },
        ],
      },
      relatedContent: [
        {
          key: "",
          value: "",
        },
      ],
      channel: null,
      flowType: "",
    },
    code: 200,
  },
};
try {
  const mod = angular.module("ib-commons-ui-components-module");

  mod.constant("IbUiAutomaticInvoiceConstants", IbUiAutomaticInvoiceConstants);
} catch (error) {
  const mod = angular.module("ib-commons-ui-components-module", []);
  mod.constant("IbUiAutomaticInvoiceConstants", IbUiAutomaticInvoiceConstants);
}

// angular.module('ib-commons-ui-components-module', []);
// angular.module('ib-commons-ui-components-module').constant('IbUiAutomaticInvoiceConstants', IbUiAutomaticInvoiceConstants);
export type IbUiAutomaticInvoiceConstantsType =
  typeof IbUiAutomaticInvoiceConstants;
export { IbUiAutomaticInvoiceConstants };
