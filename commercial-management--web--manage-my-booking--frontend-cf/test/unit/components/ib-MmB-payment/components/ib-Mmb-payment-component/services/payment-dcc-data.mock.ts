import { PriceSubscriptionModel, CurrencyConversion, CurrencyDisplayFormat } from '@src/components/ib-MmB-payment/models/ib-Mmb-payments-component-model';
import { HeaderModelLocalstorage, Total } from '@src/app/core/models/header-model/header.model';

export const mockEURCurrencyDisplayFormat: CurrencyDisplayFormat = {
    symbol: {
        value: '€',
        alignment: 'R'
    },
    decimalDigits: {
        value: 2,
        rounding: 'UP'
    },
    separator: {
        decimal: '.',
        grouping: ','
    }
};

export const mockGBPCurrencyDisplayFormat: CurrencyDisplayFormat = {
    symbol: {
        value: '£',
        alignment: 'L'
    },
    decimalDigits: {
        value: 2,
        rounding: 'UP'
    },
    separator: {
        decimal: '.',
        grouping: ','
    }
};

export const mockUSDCurrencyDisplayFormat: CurrencyDisplayFormat = {
    symbol: {
        value: '$',
        alignment: 'R'
    },
    decimalDigits: {
        value: 2,
        rounding: 'UP'
    },
    separator: {
        decimal: '.',
        grouping: ','
    }
};

export const mockCurrencyConversionReal: CurrencyConversion = {
    total: 60.98,
    currency: 'USD'
};

export const mockCurrencyConversionTest: CurrencyConversion = {
    total: 91.58,
    currency: 'USD'
};

export const mockInvalidCurrencyConversionTotal: CurrencyConversion = {
    total: null as any,
    currency: 'USD'
};

export const mockInvalidCurrencyConversionCurrency: CurrencyConversion = {
    total: 91.58,
    currency: null as any
};

export const mockPriceSubscriptionModelWithoutDCC: PriceSubscriptionModel = {
    total: 81,
    charges: [],
    discounts: [],
    currencyConversion: undefined,
    currency: {
        code: 'EUR',
        format: mockEURCurrencyDisplayFormat
    }
};

export const mockPriceSubscriptionModelWithDCC: PriceSubscriptionModel = {
    total: 54,
    charges: [],
    discounts: [],
    currencyConversion: mockCurrencyConversionReal,
    currency: {
        code: 'EUR',
        format: mockEURCurrencyDisplayFormat
    }
};

export const mockPriceSubscriptionModelWithInvalidDCC: PriceSubscriptionModel = {
    total: 54,
    charges: [],
    discounts: [],
    currencyConversion: mockInvalidCurrencyConversionTotal,
    currency: {
        code: 'EUR',
        format: mockEURCurrencyDisplayFormat
    }
};

export const mockHeaderModelComplete: HeaderModelLocalstorage = {
    headerModel: {
        flightType: "",
        redemption: "",
        trips: [],
        isMultiflight: false,
        passengers: null,
        shoppingBasket: {
            baggages: {
                segments: [
                    {
                        segmentId: "MADBIO20250611194500",
                        baggages: [
                            {
                                type: "BAGGAGE_32",
                                quanty: 2,
                                description: "32kg",
                                passengers: ["ADULT_01"],
                                total: 54,
                                totalFormatted: "54.00€"
                            }
                        ],
                        total: 54,
                        origin: {
                            code: "MAD",
                            description: "Madrid",
                            countryCode: "ES",
                            country: {
                                code: "ES",
                                description: "Spain"
                            }
                        },
                        destination: {
                            code: "BIO",
                            description: "Bilbao",
                            countryCode: "ES",
                            country: {
                                code: "ES",
                                description: "Spain"
                            }
                        }
                    }
                ],
                hasBaggage: true,
                total: {
                    total: 54,
                    totalFormatted: "54.00€"
                }
            },
            bundle: {
                info: [],
                hasBundle: false
            },
            seats: {
                segments: [],
                hasSeats: false
            },
            insurance: {
                info: null,
                hasInsurance: false
            },
            insuranceAllianzFusionInfo: {
                info: null,
                hasInsuranceAllianzFusion: false,
                total: {
                    total: 0,
                    totalFormatted: "0€"
                }
            },
            flexibilization: {
                info: null,
                hasFlexibilization: false
            },
            upgrading: {
                segments: [],
                hasUpgrading: false
            },
            speqs: {
                segments: [],
                hasSpeqs: false
            },
            priorityBoarding: {
                info: null,
                hasPriorityBoarding: false
            },
            carbonFootprint: {
                info: null,
                hasCarbonFootprint: false
            },
            globickTransfers: {
                info: null,
                hasTransfersGlobick: false,
                total: {
                    total: 0,
                    totalFormatted: "0€"
                }
            },
            globickActivities: {
                info: null,
                hasActivitiesGlobick: false,
                total: {
                    total: 0,
                    totalFormatted: "0€"
                }
            },
            discountsModel: {
                hasDiscounts: false,
                discounts: [],
                total: 0
            },
            othersModel: {
                hasElements: false,
                others: [],
                total: {
                    total: 0,
                    totalFormatted: "0€"
                }
            },
            segmentsInfo: [],
            showBasket: true,
            currency: {
                suffixSymbol: true,
                decimalSeparator: ".",
                numberDecimals: 2,
                groupingSeparator: ",",
                currencySymbol: "€",
                description: "Euro",
            },
            total: {
                totalPrice: 0,
                original: 54,
                formatted: "54.00€",
                totalDcc: "60.98USD"
            }
        },
        advancedSearch: false,
        showModalBackHome: true,
        currency: {
            suffixSymbol: true,
            decimalSeparator: ".",
            numberDecimals: 2,
            groupingSeparator: ",",
            currencySymbol: "€",
            description: "Euro",
        }
    },
    greyBarModel: {
        login: {},
        loggedData: {},
        userLogged: false,
        isONB: false,
        isLogged: false,
        show: false
    },
    shoppingBasket: {
        baggages: {
            segments: [
                {
                    segmentId: "MADBIO20250611194500",
                    baggages: [
                        {
                            type: "BAGGAGE_32",
                            quanty: 2,
                            description: "32kg",
                            passengers: ["ADULT_01"],
                            total: 54,
                            totalFormatted: "54.00€"
                        }
                    ],
                    total: 54,
                    origin: {
                        code: "MAD",
                        description: "Madrid",
                        countryCode: "ES",
                        country: {
                            code: "ES",
                            description: "Spain"
                        }
                    },
                    destination: {
                        code: "BIO",
                        description: "Bilbao",
                        countryCode: "ES",
                        country: {
                            code: "ES",
                            description: "Spain"
                        }
                    }
                }
            ],
            hasBaggage: true,
            total: {
                total: 54,
                totalFormatted: "54.00€"
            }
        },
        bundle: {
            info: [],
            hasBundle: false
        },
        seats: {
            segments: [],
            hasSeats: false
        },
        insurance: {
            info: null,
            hasInsurance: false
        },
        insuranceAllianzFusionInfo: {
            info: null,
            hasInsuranceAllianzFusion: false,
            total: {
                total: 0,
                totalFormatted: "0€"
            }
        },
        flexibilization: {
            info: null,
            hasFlexibilization: false
        },
        upgrading: {
            segments: [],
            hasUpgrading: false
        },
        speqs: {
            segments: [],
            hasSpeqs: false
        },
        priorityBoarding: {
            info: null,
            hasPriorityBoarding: false
        },
        carbonFootprint: {
            info: null,
            hasCarbonFootprint: false
        },
        globickTransfers: {
            info: null,
            hasTransfersGlobick: false,
            total: {
                total: 0,
                totalFormatted: "0€"
            }
        },
        globickActivities: {
            info: null,
            hasActivitiesGlobick: false,
            total: {
                total: 0,
                totalFormatted: "0€"
            }
        },
        discountsModel: {
            hasDiscounts: false,
            discounts: [],
            total: 0
        },
        othersModel: {
            hasElements: false,
            others: [],
            total: {
                total: 0,
                totalFormatted: "0€"
            }
        },
        segmentsInfo: [],
        showBasket: true,
        currency: {
            suffixSymbol: true,
            decimalSeparator: ".",
            numberDecimals: 2,
            groupingSeparator: ",",
            currencySymbol: "€",
            description: "Euro",
        },
        total: {
            totalPrice: 0,
            original: 54,
            formatted: "54.00€",
            totalDcc: "60.98USD"
        }
    }
};

export const mockHeaderModelIncomplete = {
    headerModel: {
        shoppingBasket: {}
    }
};

export const mockBasketTotalWithDCC: Total = {
    totalPrice: 0,
    original: 54,
    formatted: "54.00€",
    totalDcc: "60.98USD"
};

export const mockBasketTotalWithoutDCC: Total = {
    totalPrice: 54,
    original: 54,
    formatted: "54.00€"
};

export const mockBasketTotalWithTestDCC: Total = {
    totalPrice: 69.42,
    original: 69.42,
    formatted: "£69.42",
    totalDcc: "$91.58"
};

export const expectedFormattedResults = {
    realDccPriceUSD: "60.98USD",
    realDccPriceUSDRight: "60.98$", 
    testDccPriceUSD: "$91.58",
    testDccPriceUSDRight: "91.58$",
    eurPrice: "54.00€",
    gbpPrice: "£69.42",
    leftAlignmentPrice: "$60.98",
    rightAlignmentPrice: "60.98$"
};