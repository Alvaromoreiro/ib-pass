describe('MmbInvoiceTabController test', function () {
    var $controller, $rootScope, $scope, controller, localStorageService, $window, $translate, $q;

    var fakeAncillariesSlices = [
        {
          "id": "MADBCN20230812070000",
          "segmentIds": [
            "IB300220230812"
          ]
        },
        {
          "id": "BCNMAD20230915070000",
          "segmentIds": [
            "IB300320230915"
          ]
        }
    ];

    var fakeBookingInfo = {
        "flowId": "TWFuYWdlTXlCb29raW5nQElCNzhjMjE4MjRjMDYyNGMwYWJjMDk3YWZkN2I4MGZkYTU=",
        "order": {
            "orderId": "Qm9va2luZ0BJQmQyY2E0OGQ5YmIyNjRhMmI5ZGM0YjkzMDY5ZmY3M2VjT1A=",
            "status": "ISSUED",
            "clientLocator": "M4BPV",
            "bookingReferences": [
                {
                    "provider": "IB",
                    "reference": "M4BPV"
                }
            ],
            "orderItems": [
                {
                    "type": "flight",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_01",
                    "bookingReferences": [
                        {
                            "provider": "IB",
                            "reference": "M4BPV"
                        }
                    ],
                    "price": {
                        "fare": 216,
                        "tax": 91.89,
                        "total": 307.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceIds": [
                        "MADBIO20231023155500",
                        "BIOMAD20231029213500"
                    ],
                    "passengerPrices": [
                        {
                            "fareCalculation": "MAD IB BIO36.00IB MAD36.00EUR72.00END",
                            "passengerId": "ADULT_01",
                            "price": {
                                "fare": 72,
                                "tax": 30.63,
                                "total": 102.63,
                                "currency": "EUR",
                                "ticketingFee": 0
                            },
                            "segmentPrices": [
                                {
                                    "price": null,
                                    "fareCode": "OWNNB4",
                                    "segmentsIds": [
                                        "IB043820231023"
                                    ],
                                    "ticketDesignator": "",
                                    "penalties": [],
                                    "penaltyFlags": null
                                },
                                {
                                    "price": null,
                                    "fareCode": "OWNNB4",
                                    "segmentsIds": [
                                        "IB042520231029"
                                    ],
                                    "ticketDesignator": "",
                                    "penalties": [],
                                    "penaltyFlags": null
                                }
                            ],
                            "taxes": [
                                {
                                    "code": "QV",
                                    "amount": 3.6,
                                    "currency": "EUR",
                                    "description": "Seguridad",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "OG",
                                    "amount": 0.69,
                                    "currency": "EUR",
                                    "description": "Tasa de seguridad",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "JD",
                                    "amount": 15.93,
                                    "currency": "EUR",
                                    "description": "Cargo por salida",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "JD",
                                    "amount": 6.12,
                                    "currency": "EUR",
                                    "description": "Cargo por salida",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "OG",
                                    "amount": 0.69,
                                    "currency": "EUR",
                                    "description": "Tasa de seguridad",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "QV",
                                    "amount": 3.6,
                                    "currency": "EUR",
                                    "description": "Seguridad",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                }
                            ],
                            "orderItemPaymentInfos": []
                        },
                        {
                            "fareCalculation": "MAD IB BIO36.00IB MAD36.00EUR72.00END",
                            "passengerId": "ADULT_02",
                            "price": {
                                "fare": 72,
                                "tax": 30.63,
                                "total": 102.63,
                                "currency": "EUR",
                                "ticketingFee": 0
                            },
                            "segmentPrices": [
                                {
                                    "price": null,
                                    "fareCode": "OWNNB4",
                                    "segmentsIds": [
                                        "IB043820231023"
                                    ],
                                    "ticketDesignator": "",
                                    "penalties": [],
                                    "penaltyFlags": null
                                },
                                {
                                    "price": null,
                                    "fareCode": "OWNNB4",
                                    "segmentsIds": [
                                        "IB042520231029"
                                    ],
                                    "ticketDesignator": "",
                                    "penalties": [],
                                    "penaltyFlags": null
                                }
                            ],
                            "taxes": [
                                {
                                    "code": "QV",
                                    "amount": 3.6,
                                    "currency": "EUR",
                                    "description": "Seguridad",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "OG",
                                    "amount": 0.69,
                                    "currency": "EUR",
                                    "description": "Tasa de seguridad",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "JD",
                                    "amount": 15.93,
                                    "currency": "EUR",
                                    "description": "Cargo por salida",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "JD",
                                    "amount": 6.12,
                                    "currency": "EUR",
                                    "description": "Cargo por salida",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "OG",
                                    "amount": 0.69,
                                    "currency": "EUR",
                                    "description": "Tasa de seguridad",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "QV",
                                    "amount": 3.6,
                                    "currency": "EUR",
                                    "description": "Seguridad",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                }
                            ],
                            "orderItemPaymentInfos": []
                        },
                        {
                            "fareCalculation": "MAD IB BIO36.00IB MAD36.00EUR72.00END",
                            "passengerId": "ADULT_03",
                            "price": {
                                "fare": 72,
                                "tax": 30.63,
                                "total": 102.63,
                                "currency": "EUR",
                                "ticketingFee": 0
                            },
                            "segmentPrices": [
                                {
                                    "price": null,
                                    "fareCode": "OWNNB4",
                                    "segmentsIds": [
                                        "IB043820231023"
                                    ],
                                    "ticketDesignator": "",
                                    "penalties": [],
                                    "penaltyFlags": null
                                },
                                {
                                    "price": null,
                                    "fareCode": "OWNNB4",
                                    "segmentsIds": [
                                        "IB042520231029"
                                    ],
                                    "ticketDesignator": "",
                                    "penalties": [],
                                    "penaltyFlags": null
                                }
                            ],
                            "taxes": [
                                {
                                    "code": "QV",
                                    "amount": 3.6,
                                    "currency": "EUR",
                                    "description": "Seguridad",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "OG",
                                    "amount": 0.69,
                                    "currency": "EUR",
                                    "description": "Tasa de seguridad",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "JD",
                                    "amount": 15.93,
                                    "currency": "EUR",
                                    "description": "Cargo por salida",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "JD",
                                    "amount": 6.12,
                                    "currency": "EUR",
                                    "description": "Cargo por salida",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "OG",
                                    "amount": 0.69,
                                    "currency": "EUR",
                                    "description": "Tasa de seguridad",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "QV",
                                    "amount": 3.6,
                                    "currency": "EUR",
                                    "description": "Seguridad",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                }
                            ],
                            "orderItemPaymentInfos": []
                        }
                    ]
                },
                {
                    "type": "seat",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_02",
                    "price": {
                        "fare": 12,
                        "tax": 0,
                        "total": 12,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "row": "9",
                    "column": "C",
                    "segmentId": "IB043820231023",
                    "passengerId": "ADULT_01",
                    "emd": "0755578274921",
                    "selected": true,
                    "orderItemPaymentInfos": [],
                    "features": [
                        "NON_RECLINING",
                        "EXTRA_SIZE"
                    ],
                    "code": null
                },
                {
                    "type": "seat",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_03",
                    "price": {
                        "fare": 14,
                        "tax": 0,
                        "total": 14,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "row": "10",
                    "column": "A",
                    "segmentId": "IB043820231023",
                    "passengerId": "ADULT_02",
                    "emd": "0755578274916",
                    "selected": true,
                    "orderItemPaymentInfos": [],
                    "features": [
                        "WINDOW",
                        "EXTRA_SIZE",
                        "EMERGENCY_EXIT"
                    ],
                    "code": null
                },
                {
                    "type": "seat",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_04",
                    "price": {
                        "fare": 8,
                        "tax": 0,
                        "total": 8,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "row": "12",
                    "column": "C",
                    "segmentId": "IB043820231023",
                    "passengerId": "ADULT_03",
                    "emd": "0755578274917",
                    "selected": true,
                    "orderItemPaymentInfos": [],
                    "features": [
                        "UPFRONT"
                    ],
                    "code": null
                },
                {
                    "type": "seat",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_64",
                    "price": {
                        "fare": 8,
                        "tax": 0,
                        "total": 8,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "row": "64",
                    "column": "C",
                    "segmentId": "IB043820231023",
                    "passengerId": "ADULT_03",
                    "emd": "075557827491764",
                    "selected": true,
                    "orderItemPaymentInfos": [],
                    "features": [
                        "WING"
                    ],
                    "code": null
                },
                {
                    "type": "seat",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_65",
                    "price": {
                        "fare": 8,
                        "tax": 0,
                        "total": 8,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "row": "65",
                    "column": "C",
                    "segmentId": "IB043820231023",
                    "passengerId": "ADULT_03",
                    "emd": "075557827491765",
                    "selected": true,
                    "orderItemPaymentInfos": [],
                    "features": [
                        "SCREEN"
                    ],
                    "code": null
                },
                {
                    "type": "seat",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_66",
                    "price": {
                        "fare": 8,
                        "tax": 0,
                        "total": 8,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "row": "66",
                    "column": "C",
                    "segmentId": "IB043820231023",
                    "passengerId": "ADULT_03",
                    "emd": "075557827491766",
                    "selected": true,
                    "orderItemPaymentInfos": [],
                    "features": [
                        "INFANT"
                    ],
                    "code": null
                },
                {
                    "type": "seat",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_67",
                    "price": {
                        "fare": 8,
                        "tax": 0,
                        "total": 8,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "row": "67",
                    "column": "C",
                    "segmentId": "IB043820231023",
                    "passengerId": "ADULT_03",
                    "emd": "075557827491767",
                    "selected": true,
                    "orderItemPaymentInfos": [],
                    "features": [
                        "MOBILITY"
                    ],
                    "code": null
                },
                {
                    "type": "seat",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_68",
                    "price": {
                        "fare": 8,
                        "tax": 0,
                        "total": 8,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "row": "68",
                    "column": "C",
                    "segmentId": "IB043820231023",
                    "passengerId": "ADULT_03",
                    "emd": "075557827491768",
                    "selected": true,
                    "orderItemPaymentInfos": [],
                    "features": [
                        "WC"
                    ],
                    "code": null
                },
                {
                    "type": "seat",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_69",
                    "price": {
                        "fare": 8,
                        "tax": 0,
                        "total": 8,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "row": "69",
                    "column": "C",
                    "segmentId": "IB043820231023",
                    "passengerId": "ADULT_03",
                    "emd": "075557827491769",
                    "selected": true,
                    "orderItemPaymentInfos": [],
                    "features": [
                        "GALLEY"
                    ],
                    "code": null
                },
                {
                    "type": "seat",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_70",
                    "price": {
                        "fare": 8,
                        "tax": 0,
                        "total": 8,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "row": "70",
                    "column": "C",
                    "segmentId": "IB043820231023",
                    "passengerId": "ADULT_03",
                    "emd": "07555782749170",
                    "selected": true,
                    "orderItemPaymentInfos": [],
                    "features": [
                        "AISLE"
                    ],
                    "code": null
                },
                {
                    "type": "seat",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_05",
                    "price": {
                        "fare": 5,
                        "tax": 0,
                        "total": 5,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "row": "15",
                    "column": "C",
                    "segmentId": "IB042520231029",
                    "passengerId": "ADULT_01",
                    "emd": "0755578274918",
                    "selected": true,
                    "orderItemPaymentInfos": [],
                    "features": [],
                    "code": null
                },
                {
                    "type": "seat",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_06",
                    "price": {
                        "fare": 3,
                        "tax": 0,
                        "total": 3,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "row": "21",
                    "column": "C",
                    "segmentId": "IB042520231029",
                    "passengerId": "ADULT_02",
                    "emd": "0755578274919",
                    "selected": true,
                    "orderItemPaymentInfos": [],
                    "features": [
                        "PROMO"
                    ],
                    "code": null
                },
                {
                    "type": "seat",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_07",
                    "price": {
                        "fare": 12,
                        "tax": 0,
                        "total": 12,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "row": "6",
                    "column": "C",
                    "segmentId": "IB042520231029",
                    "passengerId": "ADULT_03",
                    "emd": "0755578274920",
                    "selected": true,
                    "orderItemPaymentInfos": [],
                    "features": [
                        "EXTRA_SIZE"
                    ],
                    "code": null
                },
                {
                    "type": "baggage",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_08",
                    "price": {
                        "fare": 13,
                        "tax": 0,
                        "total": 13,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "BIOMAD20231029213500",
                    "passengerId": "ADULT_01",
                    "amount": 1,
                    "emd": "0755578274903",
                    "orderItemPaymentInfos": [],
                    "subtype": "BAGGAGE_15",
                    "code": null
                },
                {
                    "type": "baggage",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_09",
                    "price": {
                        "fare": 18,
                        "tax": 0,
                        "total": 18,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "BIOMAD20231029213500",
                    "passengerId": "ADULT_02",
                    "amount": 1,
                    "emd": "0755578274906",
                    "orderItemPaymentInfos": [],
                    "subtype": "BAGGAGE_23",
                    "code": null
                },
                {
                    "type": "baggage",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_10",
                    "price": {
                        "fare": 35,
                        "tax": 0,
                        "total": 35,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "BIOMAD20231029213500",
                    "passengerId": "ADULT_03",
                    "amount": 1,
                    "emd": "0755578274902",
                    "orderItemPaymentInfos": [],
                    "subtype": "BAGGAGE_32",
                    "code": null
                },
                {
                    "type": "baggage",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_11",
                    "price": {
                        "fare": 13,
                        "tax": 0,
                        "total": 13,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "MADBIO20231023155500",
                    "passengerId": "ADULT_01",
                    "amount": 1,
                    "emd": "0755578274904",
                    "orderItemPaymentInfos": [],
                    "subtype": "BAGGAGE_15",
                    "code": null
                },
                {
                    "type": "baggage",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_12",
                    "price": {
                        "fare": 18,
                        "tax": 0,
                        "total": 18,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "MADBIO20231023155500",
                    "passengerId": "ADULT_02",
                    "amount": 1,
                    "emd": "0755578274901",
                    "orderItemPaymentInfos": [],
                    "subtype": "BAGGAGE_23",
                    "code": null
                },
                {
                    "type": "baggage",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_13",
                    "price": {
                        "fare": 35,
                        "tax": 0,
                        "total": 35,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "MADBIO20231023155500",
                    "passengerId": "ADULT_03",
                    "amount": 1,
                    "emd": "0755578274905",
                    "orderItemPaymentInfos": [],
                    "subtype": "BAGGAGE_32",
                    "code": null
                },
                {
                    "type": "specialEquipment",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_14",
                    "price": {
                        "fare": 40,
                        "tax": 0,
                        "total": 40,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "BIOMAD20231029213500",
                    "passengerId": "ADULT_01",
                    "amount": 1,
                    "emd": "0755578274897",
                    "orderItemPaymentInfos": [],
                    "subtype": "BICYCLE",
                    "code": null
                },
                {
                    "type": "specialEquipment",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_15",
                    "price": {
                        "fare": 35,
                        "tax": 0,
                        "total": 35,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "BIOMAD20231029213500",
                    "passengerId": "ADULT_02",
                    "amount": 1,
                    "emd": "0755578274900",
                    "orderItemPaymentInfos": [],
                    "subtype": "GOLF_EQUIPMENT",
                    "code": null
                },
                {
                    "type": "specialEquipment",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_16",
                    "price": {
                        "fare": 35,
                        "tax": 0,
                        "total": 35,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "BIOMAD20231029213500",
                    "passengerId": "ADULT_03",
                    "amount": 1,
                    "emd": "0755578274896",
                    "orderItemPaymentInfos": [],
                    "subtype": "SKI_SNOW",
                    "code": null
                },
                {
                    "type": "specialEquipment",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_17",
                    "price": {
                        "fare": 40,
                        "tax": 0,
                        "total": 40,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "MADBIO20231023155500",
                    "passengerId": "ADULT_01",
                    "amount": 1,
                    "emd": "0755578274899",
                    "orderItemPaymentInfos": [],
                    "subtype": "BICYCLE",
                    "code": null
                },
                {
                    "type": "specialEquipment",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_18",
                    "price": {
                        "fare": 35,
                        "tax": 0,
                        "total": 35,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "MADBIO20231023155500",
                    "passengerId": "ADULT_02",
                    "amount": 1,
                    "emd": "0755578274895",
                    "orderItemPaymentInfos": [],
                    "subtype": "GOLF_EQUIPMENT",
                    "code": null
                },
                {
                    "type": "specialEquipment",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_19",
                    "price": {
                        "fare": 35,
                        "tax": 0,
                        "total": 35,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "MADBIO20231023155500",
                    "passengerId": "ADULT_03",
                    "amount": 1,
                    "emd": "0755578274898",
                    "orderItemPaymentInfos": [],
                    "subtype": "SKI_SNOW",
                    "code": null
                },
                {
                    "type": "specialEquipment",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_71",
                    "price": {
                        "fare": 35,
                        "tax": 0,
                        "total": 35,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "MADBIO20231023155500",
                    "passengerId": "ADULT_03",
                    "amount": 1,
                    "emd": "075557827489871",
                    "orderItemPaymentInfos": [],
                    "subtype": "FISHING_EQUIPMENT",
                    "code": null
                },
                {
                    "type": "specialEquipment",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_72",
                    "price": {
                        "fare": 35,
                        "tax": 0,
                        "total": 35,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "MADBIO20231023155500",
                    "passengerId": "ADULT_03",
                    "amount": 1,
                    "emd": "075557827489872",
                    "orderItemPaymentInfos": [],
                    "subtype": "SCUBA_DIVING",
                    "code": null
                },
                {
                    "type": "specialEquipment",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_73",
                    "price": {
                        "fare": 35,
                        "tax": 0,
                        "total": 35,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "MADBIO20231023155500",
                    "passengerId": "ADULT_03",
                    "amount": 1,
                    "emd": "075557827489873",
                    "orderItemPaymentInfos": [],
                    "subtype": "GOLF_EQUIPMENT",
                    "code": null
                },
                {
                    "type": "specialEquipment",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_74",
                    "price": {
                        "fare": 35,
                        "tax": 0,
                        "total": 35,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "MADBIO20231023155500",
                    "passengerId": "ADULT_03",
                    "amount": 1,
                    "emd": "075557827489874",
                    "orderItemPaymentInfos": [],
                    "subtype": "SURFBOARD",
                    "code": null
                },
                {
                    "type": "specialEquipment",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_75",
                    "price": {
                        "fare": 35,
                        "tax": 0,
                        "total": 35,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "sliceId": "MADBIO20231023155500",
                    "passengerId": "ADULT_03",
                    "amount": 1,
                    "emd": "075557827489875",
                    "orderItemPaymentInfos": [],
                    "subtype": "SPORTING_FIREARMS",
                    "code": null
                },
                {
                    "type": "flexibilityOnDemand",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_20",
                    "price": {
                        "fare": 41,
                        "tax": 0,
                        "total": 41,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerId": "ADULT_01",
                    "emd": "0755578274907",
                    "status": "AVAILABLE",
                    "percentage": 80,
                    "segments": [
                        {
                            "segmentId": "IB043820231023",
                            "status": "AVAILABLE"
                        },
                        {
                            "segmentId": "IB042520231029",
                            "status": "AVAILABLE"
                        }
                    ],
                    "subtype": "FLEXIBILITY_PACK"
                },
                {
                    "type": "flexibilityOnDemand",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_21",
                    "price": {
                        "fare": 41,
                        "tax": 0,
                        "total": 41,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerId": "ADULT_02",
                    "emd": "0755578274909",
                    "status": "AVAILABLE",
                    "percentage": 80,
                    "segments": [
                        {
                            "segmentId": "IB043820231023",
                            "status": "AVAILABLE"
                        },
                        {
                            "segmentId": "IB042520231029",
                            "status": "AVAILABLE"
                        }
                    ],
                    "subtype": "FLEXIBILITY_PACK"
                },
                {
                    "type": "flexibilityOnDemand",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_22",
                    "price": {
                        "fare": 41,
                        "tax": 0,
                        "total": 41,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerId": "ADULT_03",
                    "emd": "0755578274908",
                    "status": "AVAILABLE",
                    "percentage": 80,
                    "segments": [
                        {
                            "segmentId": "IB043820231023",
                            "status": "AVAILABLE"
                        },
                        {
                            "segmentId": "IB042520231029",
                            "status": "AVAILABLE"
                        }
                    ],
                    "subtype": "FLEXIBILITY_PACK"
                },
                {
                    "type": "priorityBoarding",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_23",
                    "price": {
                        "fare": 6,
                        "tax": 0,
                        "total": 6,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerId": "ADULT_01",
                    "segmentId": "IB043820231023",
                    "emd": "0755578274910",
                    "orderItemPaymentInfos": []
                },
                {
                    "type": "priorityBoarding",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_24",
                    "price": {
                        "fare": 6,
                        "tax": 0,
                        "total": 6,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerId": "ADULT_02",
                    "segmentId": "IB043820231023",
                    "emd": "0755578274914",
                    "orderItemPaymentInfos": []
                },
                {
                    "type": "priorityBoarding",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_25",
                    "price": {
                        "fare": 6,
                        "tax": 0,
                        "total": 6,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerId": "ADULT_03",
                    "segmentId": "IB043820231023",
                    "emd": "0755578274911",
                    "orderItemPaymentInfos": []
                },
                {
                    "type": "priorityBoarding",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_26",
                    "price": {
                        "fare": 6,
                        "tax": 0,
                        "total": 6,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerId": "ADULT_01",
                    "segmentId": "IB042520231029",
                    "emd": "0755578274912",
                    "orderItemPaymentInfos": []
                },
                {
                    "type": "priorityBoarding",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_27",
                    "price": {
                        "fare": 6,
                        "tax": 0,
                        "total": 6,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerId": "ADULT_02",
                    "segmentId": "IB042520231029",
                    "emd": "0755578274915",
                    "orderItemPaymentInfos": []
                },
                {
                    "type": "priorityBoarding",
                    "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_28",
                    "price": {
                        "fare": 6,
                        "tax": 0,
                        "total": 6,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerId": "ADULT_03",
                    "segmentId": "IB042520231029",
                    "emd": "0755578274913",
                    "orderItemPaymentInfos": []
                }
            ],
            "slices": [
                {
                    "sliceId": "MADBIO20231023155500",
                    "type": "REGULAR",
                    "departureDateTime": "2023-10-23 15:55",
                    "arrivalDateTime": "2023-10-23 17:00",
                    "duration": 65,
                    "stopsNumber": 0,
                    "detailedPrices": [
                        {
                            "fare": 0,
                            "currency": null,
                            "passengerIds": [
                                "ADULT_01",
                                "ADULT_02",
                                "ADULT_03"
                            ],
                            "segmentPrices": []
                        }
                    ],
                    "segments": [
                        {
                            "type": "CONFIRMED",
                            "mmbAllowed": true,
                            "ckiStatus": {
                                "code": "CHECKABLE",
                                "message": null
                            },
                            "noShow": false,
                            "flyNow": false,
                            "flown": false,
                            "departure": {
                                "code": "MAD",
                                "name": "BARAJAS",
                                "terminal": "4",
                                "city": {
                                    "code": "MAD",
                                    "description": "Madrid",
                                    "countryCode": "ES",
                                    "country": {
                                        "code": "ES",
                                        "description": "España"
                                    }
                                }
                            },
                            "arrival": {
                                "code": "BIO",
                                "name": "AIRPORT",
                                "terminal": null,
                                "city": {
                                    "code": "BIO",
                                    "description": "Bilbao",
                                    "countryCode": "ES",
                                    "country": {
                                        "code": "ES",
                                        "description": "España"
                                    }
                                }
                            },
                            "departureCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "arrivalCity": {
                                "code": "BIO",
                                "description": "Bilbao",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "flight": {
                                "marketingCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "operationalCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "marketingFlightNumber": "0438",
                                "operationalFlightNumber": "0438",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                    "code": "319",
                                    "description": "Airbus A319"
                                }
                            },
                            "cabin": {
                                "rbd": "O",
                                "description": "",
                                "remainingSeats": 0,
                                "fareFamily": "TBAESEU",
                                "code": "R",
                                "type": "ECONOMY",
                                "bookingClass": "ECONOMY"
                            },
                            "overnight": false,
                            "id": "IB043820231023",
                            "duration": 65,
                            "waitingTime": 0,
                            "operatorLocator": null,
                            "stop": null,
                            "departureDateTime": "2023-10-23 15:55",
                            "departureUtcDateTime": "2023-10-23T13:55:00.000",
                            "arrivalDateTime": "2023-10-23 17:00",
                            "arrivalUtcDateTime": "2023-10-23T15:00:00.000",
                            "status": {
                                "code": "HK",
                                "description": "Confirmado"
                            }
                        }
                    ],
                    "overnight": false,
                    "passengerFlags": [
                        {
                            "passengerId": "ADULT_01",
                            "flags": [
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": true
                                }
                            ]
                        },
                        {
                            "passengerId": "ADULT_02",
                            "flags": [
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": true
                                }
                            ]
                        },
                        {
                            "passengerId": "ADULT_03",
                            "flags": [
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "sliceId": "BIOMAD20231029213500",
                    "type": "REGULAR",
                    "departureDateTime": "2023-10-29 21:35",
                    "arrivalDateTime": "2023-10-29 22:45",
                    "duration": 70,
                    "stopsNumber": 0,
                    "detailedPrices": [
                        {
                            "fare": 0,
                            "currency": null,
                            "passengerIds": [
                                "ADULT_01",
                                "ADULT_02",
                                "ADULT_03"
                            ],
                            "segmentPrices": []
                        }
                    ],
                    "segments": [
                        {
                            "type": "CONFIRMED",
                            "mmbAllowed": true,
                            "ckiStatus": {
                                "code": "CHECKABLE",
                                "message": null
                            },
                            "noShow": false,
                            "flyNow": false,
                            "flown": false,
                            "departure": {
                                "code": "BIO",
                                "name": "AIRPORT",
                                "terminal": null,
                                "city": {
                                    "code": "BIO",
                                    "description": "Bilbao",
                                    "countryCode": "ES",
                                    "country": {
                                        "code": "ES",
                                        "description": "España"
                                    }
                                }
                            },
                            "arrival": {
                                "code": "MAD",
                                "name": "BARAJAS",
                                "terminal": "4",
                                "city": {
                                    "code": "MAD",
                                    "description": "Madrid",
                                    "countryCode": "ES",
                                    "country": {
                                        "code": "ES",
                                        "description": "España"
                                    }
                                }
                            },
                            "departureCity": {
                                "code": "BIO",
                                "description": "Bilbao",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "arrivalCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "flight": {
                                "marketingCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "operationalCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "marketingFlightNumber": "0425",
                                "operationalFlightNumber": "0425",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                    "code": "319",
                                    "description": "Airbus A319"
                                }
                            },
                            "cabin": {
                                "rbd": "O",
                                "description": "",
                                "remainingSeats": 0,
                                "fareFamily": "TBAESEU",
                                "code": "R",
                                "type": "ECONOMY",
                                "bookingClass": "ECONOMY"
                            },
                            "overnight": false,
                            "id": "IB042520231029",
                            "duration": 70,
                            "waitingTime": 0,
                            "operatorLocator": null,
                            "stop": null,
                            "departureDateTime": "2023-10-29 21:35",
                            "departureUtcDateTime": "2023-10-29T20:35:00.000",
                            "arrivalDateTime": "2023-10-29 22:45",
                            "arrivalUtcDateTime": "2023-10-29T21:45:00.000",
                            "status": {
                                "code": "HK",
                                "description": "Confirmado"
                            }
                        }
                    ],
                    "overnight": false,
                    "passengerFlags": [
                        {
                            "passengerId": "ADULT_01",
                            "flags": [
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": true
                                }
                            ]
                        },
                        {
                            "passengerId": "ADULT_02",
                            "flags": [
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": true
                                }
                            ]
                        },
                        {
                            "passengerId": "ADULT_03",
                            "flags": [
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": true
                                }
                            ]
                        }
                    ]
                }
            ],
            "price": {
                "fare": 781,
                "tax": 91.89,
                "total": 872.89,
                "currency": "EUR",
                "ticketingFee": 0
            },
            "primaryContactInfo": {
                "phone": "34625001001",
                "phoneDetails": {
                    "number": "625001001",
                    "countryCode": "34"
                },
                "email": "NTT.JPUEYO@IBERIA.ES",
                "phoneType": "MOBILE",
                "confirmationMailOption": null,
                "refundEmail": "NTT.JPUEYO@IBERIA.ES",
                "language": null
            },
            "optionalInformation": [],
            "cashAviosPossibilities": [],
            "specialDiscounts": [],
            "checkedBagAllowances": [
                {
                    "type": "PIECE",
                    "segmentIds": [
                        "IB043820231023",
                        "IB042520231029"
                    ],
                    "totalQuantity": 0
                }
            ],
            "accrualQuote": null,
            "bookingCreationDates": [
                {
                    "creationDate": "2023-09-06",
                    "provider": "IB"
                }
            ],
            "sender": null,
            "officeIata": "7849644",
            "availableForCheckin": false,
            "earlyCheckinDone": false,
            "aviosRedeemed": null,
            "pointsRedeemed": null
        },
        "passengers": [
            {
                "passengerType": "ADULT",
                "personalInfo": {
                    "name": "ADULTODOS",
                    "surname": "TEST",
                    "birthDate": null
                },
                "passengerId": "ADULT_01",
                "relatedPassengerId": "",
                "ckiStatus": null,
                "optionalInformation": [],
                "residenceAccreditationStatus": null,
                "resiberPassengerId": "1",
                "securityInformation": {
                    "relatedContent": null
                },
                "externalPersonalInfo": {
                    "name": "Adulto Dos",
                    "firstSurname": "Test",
                    "lastSurname": ""
                }
            },
            {
                "passengerType": "ADULT",
                "personalInfo": {
                    "name": "ADULTOTRES",
                    "surname": "TEST",
                    "birthDate": null
                },
                "passengerId": "ADULT_02",
                "relatedPassengerId": "",
                "ckiStatus": null,
                "optionalInformation": [],
                "residenceAccreditationStatus": null,
                "resiberPassengerId": "2",
                "securityInformation": {
                    "relatedContent": null
                },
                "externalPersonalInfo": {
                    "name": "Adulto Tres",
                    "firstSurname": "Test",
                    "lastSurname": ""
                }
            },
            {
                "passengerType": "ADULT",
                "personalInfo": {
                    "name": "ADULTOUNO",
                    "surname": "TEST",
                    "birthDate": null
                },
                "passengerId": "ADULT_03",
                "contactInfo": {
                    "phone": "34625001001",
                    "phoneDetails": {
                        "number": "625001001",
                        "countryCode": "34"
                    },
                    "email": "ntt.jpueyo@iberia.es",
                    "phoneType": "MOBILE",
                    "confirmationMailOption": null,
                    "refundEmail": null,
                    "language": "es"
                },
                "relatedPassengerId": "",
                "ckiStatus": null,
                "optionalInformation": [],
                "residenceAccreditationStatus": null,
                "resiberPassengerId": "3",
                "securityInformation": {
                    "relatedContent": null
                },
                "externalPersonalInfo": {
                    "name": "Adulto Uno",
                    "firstSurname": "Test",
                    "lastSurname": ""
                }
            }
        ],
        "tickets": [
            {
                "ticketNumbers": [
                    "0751419185786"
                ],
                "type": "ET",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_01",
                "passengerId": "ADULT_01",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": "MAD IB BIO36.00IB MAD36.00EUR72.00END",
                "taxes": [
                    {
                        "code": "QV",
                        "amount": 3.6,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "OG",
                        "amount": 0.69,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "JD",
                        "amount": 15.93,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "JD",
                        "amount": 6.12,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "OG",
                        "amount": 0.69,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "QV",
                        "amount": 3.6,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    }
                ],
                "coupons": [
                    {
                        "arrival": "BIO",
                        "departure": "MAD",
                        "departureDate": "2023-10-23T15:55:00.000",
                        "status": "OPEN FOR USE",
                        "fareBasis": "OWNNB4",
                        "carrier": "IB",
                        "flightNumber": "0438",
                        "flightStatus": "OK",
                        "operatingCarrier": null,
                        "bookingCode": "O",
                        "designator": "",
                        "couponNumber": "1",
                        "remark": null,
                        "baggageDetail": {
                            "freeAllowance": 0,
                            "quantityCode": "PC",
                            "unitQualifier": "PC"
                        },
                        "disruptedRefundable": false
                    },
                    {
                        "arrival": "MAD",
                        "departure": "BIO",
                        "departureDate": "2023-10-29T21:35:00.000",
                        "status": "OPEN FOR USE",
                        "fareBasis": "OWNNB4",
                        "carrier": "IB",
                        "flightNumber": "0425",
                        "flightStatus": "OK",
                        "operatingCarrier": null,
                        "bookingCode": "O",
                        "designator": "",
                        "couponNumber": "2",
                        "remark": null,
                        "baggageDetail": {
                            "freeAllowance": 0,
                            "quantityCode": "PC",
                            "unitQualifier": "PC"
                        },
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": "78496445",
                "issueCity": "MAD",
                "passengerType": "ADULT",
                "paymentInfo": {
                    "type": "CREDIT_CARD",
                    "amount": 102.63
                },
                "emdsList": [
                    {
                        "emdNumber": "0755578274921",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "CHARACTERISTICS/ A L",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185786",
                                "serviceCode": "A0B5",
                                "serviceDescription": "SEAT ASSIGNMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 12,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 12,
                            "tax": 0,
                            "total": 12,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274910",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "IB0438-23OCT-MADBIO",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185786",
                                "serviceCode": "E0G6",
                                "serviceDescription": "PRIORITY BOARDING",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 6,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 6,
                            "tax": 0,
                            "total": 6,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274904",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185786",
                                "serviceCode": "C0LM",
                                "serviceDescription": "BAG UP TO 15KGS",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 13,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 13,
                            "tax": 0,
                            "total": 13,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274899",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185786",
                                "serviceCode": "C0EC",
                                "serviceDescription": "BIKE-BICYCLE",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 40,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 40,
                            "tax": 0,
                            "total": 40,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274918",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "CHARACTERISTICS/ A",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "2",
                                "documentNumber": "0751419185786",
                                "serviceCode": "A0B5",
                                "serviceDescription": "SEAT ASSIGNMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-29T21:35:00.000",
                                "value": {
                                    "fare": 5,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 5,
                            "tax": 0,
                            "total": 5,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274912",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "IB0425-29OCT-BIOMAD",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "2",
                                "documentNumber": "0751419185786",
                                "serviceCode": "E0G6",
                                "serviceDescription": "PRIORITY BOARDING",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-29T21:35:00.000",
                                "value": {
                                    "fare": 6,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 6,
                            "tax": 0,
                            "total": 6,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274903",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "2",
                                "documentNumber": "0751419185786",
                                "serviceCode": "C0LM",
                                "serviceDescription": "BAG UP TO 15KGS",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-29T21:35:00.000",
                                "value": {
                                    "fare": 13,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 13,
                            "tax": 0,
                            "total": 13,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274897",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "2",
                                "documentNumber": "0751419185786",
                                "serviceCode": "C0EC",
                                "serviceDescription": "BIKE-BICYCLE",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-29T21:35:00.000",
                                "value": {
                                    "fare": 40,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 40,
                            "tax": 0,
                            "total": 40,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274907",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "",
                        "emdDefinition": "EMD-S (Standalone)",
                        "mumberOfBooklets": "1",
                        "code": "Y",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185786",
                                "serviceCode": "D0A3",
                                "serviceDescription": "FLEX REISSUE AND REFUND",
                                "associated": true,
                                "status": "USED",
                                "dateOfService": "2023-09-06T20:24:00.000",
                                "value": {
                                    "fare": 41,
                                    "tax": 0,
                                    "total": 41,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": null
                    }
                ],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": {
                    "fare": 72,
                    "tax": 30.63,
                    "total": 102.63,
                    "currency": "EUR",
                    "ticketingFee": 0
                }
            },
            {
                "ticketNumbers": [
                    "0751419185787"
                ],
                "type": "ET",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_01",
                "passengerId": "ADULT_02",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": "MAD IB BIO36.00IB MAD36.00EUR72.00END",
                "taxes": [
                    {
                        "code": "QV",
                        "amount": 3.6,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "OG",
                        "amount": 0.69,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "JD",
                        "amount": 15.93,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "JD",
                        "amount": 6.12,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "OG",
                        "amount": 0.69,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "QV",
                        "amount": 3.6,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    }
                ],
                "coupons": [
                    {
                        "arrival": "BIO",
                        "departure": "MAD",
                        "departureDate": "2023-10-23T15:55:00.000",
                        "status": "OPEN FOR USE",
                        "fareBasis": "OWNNB4",
                        "carrier": "IB",
                        "flightNumber": "0438",
                        "flightStatus": "OK",
                        "operatingCarrier": null,
                        "bookingCode": "O",
                        "designator": "",
                        "couponNumber": "1",
                        "remark": null,
                        "baggageDetail": {
                            "freeAllowance": 0,
                            "quantityCode": "PC",
                            "unitQualifier": "PC"
                        },
                        "disruptedRefundable": false
                    },
                    {
                        "arrival": "MAD",
                        "departure": "BIO",
                        "departureDate": "2023-10-29T21:35:00.000",
                        "status": "OPEN FOR USE",
                        "fareBasis": "OWNNB4",
                        "carrier": "IB",
                        "flightNumber": "0425",
                        "flightStatus": "OK",
                        "operatingCarrier": null,
                        "bookingCode": "O",
                        "designator": "",
                        "couponNumber": "2",
                        "remark": null,
                        "baggageDetail": {
                            "freeAllowance": 0,
                            "quantityCode": "PC",
                            "unitQualifier": "PC"
                        },
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": "78496445",
                "issueCity": "MAD",
                "passengerType": "ADULT",
                "paymentInfo": {
                    "type": "CREDIT_CARD",
                    "amount": 102.63
                },
                "emdsList": [
                    {
                        "emdNumber": "0755578274916",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "CHARACTERISTICS/ E W L",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185787",
                                "serviceCode": "A0B5",
                                "serviceDescription": "SEAT ASSIGNMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 14,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 14,
                            "tax": 0,
                            "total": 14,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274914",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "IB0438-23OCT-MADBIO",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185787",
                                "serviceCode": "E0G6",
                                "serviceDescription": "PRIORITY BOARDING",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 6,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 6,
                            "tax": 0,
                            "total": 6,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274901",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185787",
                                "serviceCode": "C0GO",
                                "serviceDescription": "EXTRA PIECE",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 18,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 18,
                            "tax": 0,
                            "total": 18,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274895",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185787",
                                "serviceCode": "C0D4",
                                "serviceDescription": "GOLF-GOLF EQUIPMENT UP TO 15KG",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 35,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 35,
                            "tax": 0,
                            "total": 35,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274919",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "CHARACTERISTICS/ A F",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "2",
                                "documentNumber": "0751419185787",
                                "serviceCode": "A0B5",
                                "serviceDescription": "SEAT ASSIGNMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-29T21:35:00.000",
                                "value": {
                                    "fare": 3,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 3,
                            "tax": 0,
                            "total": 3,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274915",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "IB0425-29OCT-BIOMAD",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "2",
                                "documentNumber": "0751419185787",
                                "serviceCode": "E0G6",
                                "serviceDescription": "PRIORITY BOARDING",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-29T21:35:00.000",
                                "value": {
                                    "fare": 6,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 6,
                            "tax": 0,
                            "total": 6,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274906",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "2",
                                "documentNumber": "0751419185787",
                                "serviceCode": "C0GO",
                                "serviceDescription": "EXTRA PIECE",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-29T21:35:00.000",
                                "value": {
                                    "fare": 18,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 18,
                            "tax": 0,
                            "total": 18,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274900",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "2",
                                "documentNumber": "0751419185787",
                                "serviceCode": "C0D4",
                                "serviceDescription": "GOLF-GOLF EQUIPMENT UP TO 15KG",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-29T21:35:00.000",
                                "value": {
                                    "fare": 35,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 35,
                            "tax": 0,
                            "total": 35,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274909",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "",
                        "emdDefinition": "EMD-S (Standalone)",
                        "mumberOfBooklets": "1",
                        "code": "Y",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185787",
                                "serviceCode": "D0A3",
                                "serviceDescription": "FLEX REISSUE AND REFUND",
                                "associated": true,
                                "status": "USED",
                                "dateOfService": "2023-09-06T20:24:00.000",
                                "value": {
                                    "fare": 41,
                                    "tax": 0,
                                    "total": 41,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": null
                    }
                ],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": {
                    "fare": 72,
                    "tax": 30.63,
                    "total": 102.63,
                    "currency": "EUR",
                    "ticketingFee": 0
                }
            },
            {
                "ticketNumbers": [
                    "0751419185785"
                ],
                "type": "ET",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_01",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": "MAD IB BIO36.00IB MAD36.00EUR72.00END",
                "taxes": [
                    {
                        "code": "QV",
                        "amount": 3.6,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "OG",
                        "amount": 0.69,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "JD",
                        "amount": 15.93,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "JD",
                        "amount": 6.12,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "OG",
                        "amount": 0.69,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    },
                    {
                        "code": "QV",
                        "amount": 3.6,
                        "currency": "EUR",
                        "description": "",
                        "subcode": null,
                        "country": null,
                        "carrier": null
                    }
                ],
                "coupons": [
                    {
                        "arrival": "BIO",
                        "departure": "MAD",
                        "departureDate": "2023-10-23T15:55:00.000",
                        "status": "OPEN FOR USE",
                        "fareBasis": "OWNNB4",
                        "carrier": "IB",
                        "flightNumber": "0438",
                        "flightStatus": "OK",
                        "operatingCarrier": null,
                        "bookingCode": "O",
                        "designator": "",
                        "couponNumber": "1",
                        "remark": null,
                        "baggageDetail": {
                            "freeAllowance": 0,
                            "quantityCode": "PC",
                            "unitQualifier": "PC"
                        },
                        "disruptedRefundable": false
                    },
                    {
                        "arrival": "MAD",
                        "departure": "BIO",
                        "departureDate": "2023-10-29T21:35:00.000",
                        "status": "OPEN FOR USE",
                        "fareBasis": "OWNNB4",
                        "carrier": "IB",
                        "flightNumber": "0425",
                        "flightStatus": "OK",
                        "operatingCarrier": null,
                        "bookingCode": "O",
                        "designator": "",
                        "couponNumber": "2",
                        "remark": null,
                        "baggageDetail": {
                            "freeAllowance": 0,
                            "quantityCode": "PC",
                            "unitQualifier": "PC"
                        },
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": "78496445",
                "issueCity": "MAD",
                "passengerType": "ADULT",
                "paymentInfo": {
                    "type": "CREDIT_CARD",
                    "amount": 102.63
                },
                "emdsList": [
                    {
                        "emdNumber": "0755578274917",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "CHARACTERISTICS/ Q A",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "A0B5",
                                "serviceDescription": "SEAT ASSIGNMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 8,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 8,
                            "tax": 0,
                            "total": 8,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "075557827491764",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "CHARACTERISTICS/ Q A",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "A0B5",
                                "serviceDescription": "SEAT ASSIGNMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 8,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 8,
                            "tax": 0,
                            "total": 8,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "075557827491765",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "CHARACTERISTICS/ Q A",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "A0B5",
                                "serviceDescription": "SEAT ASSIGNMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 8,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 8,
                            "tax": 0,
                            "total": 8,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "075557827491766",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "CHARACTERISTICS/ Q A",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "A0B5",
                                "serviceDescription": "SEAT ASSIGNMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 8,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 8,
                            "tax": 0,
                            "total": 8,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "075557827491767",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "CHARACTERISTICS/ Q A",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "A0B5",
                                "serviceDescription": "SEAT ASSIGNMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 8,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 8,
                            "tax": 0,
                            "total": 8,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "075557827491768",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "CHARACTERISTICS/ Q A",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "A0B5",
                                "serviceDescription": "SEAT ASSIGNMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 8,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 8,
                            "tax": 0,
                            "total": 8,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "075557827491769",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "CHARACTERISTICS/ Q A",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "A0B5",
                                "serviceDescription": "SEAT ASSIGNMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 8,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 8,
                            "tax": 0,
                            "total": 8,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "075557827491770",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "CHARACTERISTICS/ Q A",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "A0B5",
                                "serviceDescription": "SEAT ASSIGNMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 8,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 8,
                            "tax": 0,
                            "total": 8,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274911",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "IB0438-23OCT-MADBIO",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "E0G6",
                                "serviceDescription": "PRIORITY BOARDING",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 6,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 6,
                            "tax": 0,
                            "total": 6,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274905",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "C0FM",
                                "serviceDescription": "BAGGAGE UP TO 32KGS",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 35,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 35,
                            "tax": 0,
                            "total": 35,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274898",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "C0DD",
                                "serviceDescription": "SKII-SKI EQUIPMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 35,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 35,
                            "tax": 0,
                            "total": 35,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "075557827489871",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "C0DD",
                                "serviceDescription": "SKII-SKI EQUIPMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 35,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 35,
                            "tax": 0,
                            "total": 35,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "075557827489872",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "C0DD",
                                "serviceDescription": "SKII-SKI EQUIPMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 35,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 35,
                            "tax": 0,
                            "total": 35,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "075557827489873",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "C0DD",
                                "serviceDescription": "SKII-SKI EQUIPMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 35,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 35,
                            "tax": 0,
                            "total": 35,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "075557827489874",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "C0DD",
                                "serviceDescription": "SKII-SKI EQUIPMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 35,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 35,
                            "tax": 0,
                            "total": 35,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "075557827489875",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "C0DD",
                                "serviceDescription": "SKII-SKI EQUIPMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-23T15:55:00.000",
                                "value": {
                                    "fare": 35,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 35,
                            "tax": 0,
                            "total": 35,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274920",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "CHARACTERISTICS/ A L",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "2",
                                "documentNumber": "0751419185785",
                                "serviceCode": "A0B5",
                                "serviceDescription": "SEAT ASSIGNMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-29T21:35:00.000",
                                "value": {
                                    "fare": 12,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 12,
                            "tax": 0,
                            "total": 12,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274913",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "IB0425-29OCT-BIOMAD",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "2",
                                "documentNumber": "0751419185785",
                                "serviceCode": "E0G6",
                                "serviceDescription": "PRIORITY BOARDING",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-29T21:35:00.000",
                                "value": {
                                    "fare": 6,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 6,
                            "tax": 0,
                            "total": 6,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274902",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "2",
                                "documentNumber": "0751419185785",
                                "serviceCode": "C0FM",
                                "serviceDescription": "BAGGAGE UP TO 32KGS",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-29T21:35:00.000",
                                "value": {
                                    "fare": 35,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 35,
                            "tax": 0,
                            "total": 35,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274896",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "1PC",
                        "emdDefinition": "EMD-A (Associated)",
                        "mumberOfBooklets": "1",
                        "code": "J",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "2",
                                "documentNumber": "0751419185785",
                                "serviceCode": "C0DD",
                                "serviceDescription": "SKII-SKI EQUIPMENT",
                                "associated": true,
                                "status": "OPEN FOR USE",
                                "dateOfService": "2023-10-29T21:35:00.000",
                                "value": {
                                    "fare": 35,
                                    "tax": null,
                                    "total": null,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": {
                            "fare": 35,
                            "tax": 0,
                            "total": 35,
                            "currency": "EUR",
                            "ticketingFee": 0
                        }
                    },
                    {
                        "emdNumber": "0755578274908",
                        "issueDateTime": "2023-09-06T20:24:00.000",
                        "description": "",
                        "emdDefinition": "EMD-S (Standalone)",
                        "mumberOfBooklets": "1",
                        "code": "Y",
                        "tableName": "1001 (Document/ Message Name, coded)",
                        "couponsInfoEMDsWebResponse": [
                            {
                                "couponNumberEMD": "1",
                                "couponNumberTKT": "1",
                                "documentNumber": "0751419185785",
                                "serviceCode": "D0A3",
                                "serviceDescription": "FLEX REISSUE AND REFUND",
                                "associated": true,
                                "status": "USED",
                                "dateOfService": "2023-09-06T20:24:00.000",
                                "value": {
                                    "fare": 41,
                                    "tax": 0,
                                    "total": 41,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "price": null
                    }
                ],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": {
                    "fare": 72,
                    "tax": 30.63,
                    "total": 102.63,
                    "currency": "EUR",
                    "ticketingFee": 0
                }
            },
            {
                "ticketNumbers": [
                    "0755578274921"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_02",
                "passengerId": "ADULT_01",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274916"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_03",
                "passengerId": "ADULT_02",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274917"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_04",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "075557827491764"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_64",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "075557827491765"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_65",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "075557827491766"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_66",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "075557827491767"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_67",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "075557827491768"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_68",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "075557827491769"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_69",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "075557827491770"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_70",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274918"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_05",
                "passengerId": "ADULT_01",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274919"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_06",
                "passengerId": "ADULT_02",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274920"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_07",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274903"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_08",
                "passengerId": "ADULT_01",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274906"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_09",
                "passengerId": "ADULT_02",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274902"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_10",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274904"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_11",
                "passengerId": "ADULT_01",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274901"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_12",
                "passengerId": "ADULT_02",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274905"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_13",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274897"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_14",
                "passengerId": "ADULT_01",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274900"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_15",
                "passengerId": "ADULT_02",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274896"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_16",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274899"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_17",
                "passengerId": "ADULT_01",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274895"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_18",
                "passengerId": "ADULT_02",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274898"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_19",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "075557827489871"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_71",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "075557827489872"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_72",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "075557827489873"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_73",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "075557827489874"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_74",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "075557827489875"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_75",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274907"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_20",
                "passengerId": "ADULT_01",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274909"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_21",
                "passengerId": "ADULT_02",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274908"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_22",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274910"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_23",
                "passengerId": "ADULT_01",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274914"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_24",
                "passengerId": "ADULT_02",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274911"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_25",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274912"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_26",
                "passengerId": "ADULT_01",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274915"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_27",
                "passengerId": "ADULT_02",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            },
            {
                "ticketNumbers": [
                    "0755578274913"
                ],
                "type": "EMD",
                "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_28",
                "passengerId": "ADULT_03",
                "issueDateTime": "2023-09-06 20:24",
                "fareCalculation": null,
                "taxes": [],
                "coupons": [
                    {
                        "arrival": null,
                        "departure": null,
                        "departureDate": null,
                        "status": "OPEN FOR USE",
                        "fareBasis": null,
                        "carrier": null,
                        "flightNumber": null,
                        "flightStatus": null,
                        "operatingCarrier": null,
                        "bookingCode": null,
                        "designator": null,
                        "couponNumber": null,
                        "remark": null,
                        "baggageDetail": null,
                        "disruptedRefundable": false
                    }
                ],
                "iataCode": null,
                "issueCity": null,
                "passengerType": null,
                "paymentInfo": null,
                "emdsList": [],
                "creditCardFeePrice": null,
                "conjunctionTickets": null,
                "reissueHistory": [],
                "taxedPrice": null
            }
        ],
        "paymentItems": [
            {
                "type": "IBERIA_PAY",
                "tokenizedCardNumber": null,
                "maskedCardNumber": null,
                "authorization": "J2YME9",
                "subtotal": 307.89,
                "totalFee": 0,
                "total": 307.89,
                "unityFee": 0,
                "currency": "EUR",
                "cofInclusion": false,
                "dccApplied": null
            }
        ],
        "contextMetadata": {
            "language": "es",
            "country": "ES",
            "currencies": [
                {
                    "code": "EUR",
                    "description": "Euro",
                    "symbol": "€",
                    "alignment": "R",
                    "groupingSeparator": ".",
                    "decimalSeparator": ",",
                    "decimals": 2,
                    "recommendedDisplay": "symbol"
                }
            ]
        },
        "fareFamilyConditions": [
            {
                "cabinType": "E",
                "cabinDescription": "Turista",
                "commercialCode": "TBAESEU",
                "commercialName": "Básica",
                "commercialNameES": "Básica",
                "priority": 0,
                "conditions": [
                    {
                        "code": "EQMANO",
                        "name": "Equipaje de mano",
                        "text": "Incluida 1 pieza hasta 10 kg (56x40x25cm).",
                        "units": 1,
                        "extendedInfo": {
                            "title": "Equipaje de mano: 1 pieza",
                            "message": "Incluida 1 pieza hasta 10 kg (56x40x25cm) y 1 accesorio personal, en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo.",
                            "code": "CA_EQP_MANO_10KG",
                            "conditionStatus": true
                        }
                    },
                    {
                        "code": "EQBODEGA",
                        "name": "Equipaje en bodega",
                        "text": "Con coste.",
                        "units": null,
                        "extendedInfo": {
                            "title": "Equipaje facturable no incluido",
                            "message": "Con coste.",
                            "code": "CA_1_PIEZAS_PAGO",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "COMIDA",
                        "name": "Comida",
                        "text": "Con coste.",
                        "units": null,
                        "extendedInfo": {
                            "title": "Comida no incluida",
                            "message": "Con coste.",
                            "code": "Comida_no_incluida",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "ASIENTO",
                        "name": "Selección de asiento",
                        "text": "Con coste.",
                        "units": null,
                        "extendedInfo": {
                            "title": "Selección de asiento con coste",
                            "message": "Con coste.",
                            "code": "CA_Asiento_Pago",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "CAMBIO",
                        "name": "Cambios",
                        "text": "Permitido con coste, no permitido en caso de no-show.",
                        "units": 65,
                        "extendedInfo": {
                            "title": "Cambio de vuelo con coste",
                            "message": "Permitido con penalización de 65 EUR. No permitido en caso de no presentarse al vuelo (no-show).",
                            "code": "CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "REEMBOLSO",
                        "name": "Reembolso (por sentido)",
                        "text": "No permitido.",
                        "units": null,
                        "extendedInfo": {
                            "title": "No permitido",
                            "message": "No permitido.",
                            "code": "CA_REEMBOLSO NO PERMITIDO",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "ASIENTOXL",
                        "name": "Asiento espacio extra",
                        "text": "Con coste.",
                        "units": null,
                        "extendedInfo": {
                            "title": "Asiento espacio extra con coste",
                            "message": "Con coste.",
                            "code": "CA_Asiento_XL_Pago",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "EMBARQUE",
                        "name": "Prioridad de Embarque",
                        "text": "No incluido.",
                        "units": null,
                        "extendedInfo": {
                            "title": "Embarque prioritario no incluido",
                            "message": "No incluido.",
                            "code": "CA_Embarque_NO_Prioritario",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "AVIO",
                        "name": "AVIOS",
                        "text": "Incluido.",
                        "units": null,
                        "extendedInfo": {
                            "title": "Obtén Avios con tu compra",
                            "message": "Incluido.",
                            "code": "AVIOS incluido",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "SALAVIP",
                        "name": "Acceso a salas VIP",
                        "text": "Acceso no incluido.",
                        "units": null,
                        "extendedInfo": {
                            "title": "Acceso a Sala Vip no incluido",
                            "message": "Acceso no incluido.",
                            "code": "Acceso a salas VIP No permitido",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "CABINA",
                        "name": "Cabina",
                        "text": "Turista.",
                        "units": null,
                        "extendedInfo": {
                            "title": "Cabina Turista",
                            "message": "Turista.",
                            "code": "CA_Cabina_Turista",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "WIFI",
                        "name": "WiFi",
                        "text": "Disponible con coste, según el tipo de avión.",
                        "units": null,
                        "extendedInfo": {
                            "title": "Wifi con coste",
                            "message": "Disponible con coste, según el tipo de avión.",
                            "code": "Wifi pago",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "CHECKINDESK",
                        "name": "Mostrador check-in exclusivo",
                        "text": "No incluido.",
                        "units": null,
                        "extendedInfo": {
                            "title": "Mostrador Check-in exclusivo no incluido",
                            "message": "No incluido.",
                            "code": "Chek-in_desk_ NO",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "ASIENTODELANTERO",
                        "name": "Asiento delantero",
                        "text": "Con coste.",
                        "units": null,
                        "extendedInfo": {
                            "title": "Asiento delantero con coste",
                            "message": "Con coste.",
                            "code": "CA_Asiento_Delantero_pago",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "ASIENTOPREFERENTE",
                        "name": "Asiento preferente",
                        "text": "No aplica.",
                        "units": null,
                        "extendedInfo": {
                            "title": "Asiento preferente no aplica",
                            "message": "No aplica.",
                            "code": "CA_Asiento_Preferente_NO_aplica",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "FASTTRACK",
                        "name": "Fast Track",
                        "text": "No incluido.",
                        "units": null,
                        "extendedInfo": {
                            "title": "Fast Track no incluido",
                            "message": "No incluido.",
                            "code": "Fast Track NO",
                            "conditionStatus": false
                        }
                    },
                    {
                        "code": "EQPPRIOR",
                        "name": "Entrega prioritaria equipaje",
                        "text": "Con coste.",
                        "units": null,
                        "extendedInfo": {
                            "title": "No incluye entrega rápida de equipaje",
                            "message": "Con coste.",
                            "code": "Entrega_prioritaria_equipaje_ NO",
                            "conditionStatus": false
                        }
                    }
                ],
                "conditionsPriority": [
                    "EQMANO",
                    "EQBODEGA",
                    "COMIDA",
                    "ASIENTO",
                    "CAMBIO",
                    "REEMBOLSO"
                ]
            }
        ],
        "channel": "IBCOM",
        "onHoldInformation": null,
        "relatedContent": [],
        "qualifiers": [],
        "reportingWeb": {
            "device": "DMRC",
            "idColective": "",
            "officeIata": "MADIB08AB",
            "iata": "I",
            "product": "1"
        },
        "flexibilizationCapabilitiesInformation": null,
        "genericDisruptionCapabilitiesInformation": null,
        "upgInformation": {
            "url": null,
            "flightsInformation": null,
            "bidable": false
        },
        "orderFlags": [
            {
                "type": "PRINT_ITINERARY",
                "enabled": true
            },
            {
                "type": "ON_BUSINESS_MODIFICATION",
                "enabled": true
            },
            {
                "type": "ALLOWED_INVOICE_MANAGEMENT",
                "enabled": true
            },
            {
                "type": "VOUCHER_REFUND",
                "enabled": false
            },
            {
                "type": "CASH_REFUND",
                "enabled": false
            },
            {
                "type": "ALLOWED_REFUND_CASH",
                "enabled": false
            },
            {
                "type": "ALLOWED_REFUND_VOUCHER",
                "enabled": false
            },
            {
                "type": "ALLOWED_INVOLUNTARY_FLIGHT_CHANGE",
                "enabled": false
            },
            {
                "type": "ALLOWED_ACCEPT_CHANGES",
                "enabled": false
            },
            {
                "type": "VOUCHER_REFUND_ON_DEMAND",
                "enabled": true
            },
            {
                "type": "VOUCHER_REFUND_RESTRICTION",
                "enabled": false
            },
            {
                "type": "ALLOWED_VOUCHER_COMPENSATION",
                "enabled": true
            }
        ],
        "isAirShuttle": false,
        "isOnHold": false
    };

    var fakeInvoiceList = [
        {
            "ticket": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "ticketNumber": "0751419185786",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOTRES",
                "surname": "TEST",
                "ticketNumber": "0751419185787",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "0751419185785",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "ticketNumber": "0755578274921",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOTRES",
                "surname": "TEST",
                "ticketNumber": "0755578274916",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "0755578274917",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "075557827491764",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "075557827491765",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "075557827491766",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "075557827491767",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "075557827491768",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "075557827491769",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "075557827491770",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "ticketNumber": "0755578274918",
                "date": "2023-09-07",
                "iata": 78496445,
                "office": "IBERIA.COM MAD175 NDC MADRID ES",
                "route": "BILBAO-MADRID"
            },
            "shippingData": {
                "language": "ES",
                "email": "ntt.jpueyo@iberia.es"
            },
            "billingData": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "identityInformation": "92311006T",
                "address": "Sinai 33",
                "postalCode": "41007",
                "city": "Sevilla",
                "province": "Sevilla",
                "country": "España"
            },
            "invoicesPriceDetailDataWebList": [
                {
                    "concept": "EMISION",
                    "number": "5446692",
                    "date": "2023-09-07",
                    "numDuplicates": 0,
                    "currency": "EUR",
                    "subjectTaxationPrice": 4.55,
                    "noSubjectTaxationPrice": 0,
                    "vatTaxType": 10,
                    "vatTaxAmount": 0.45,
                    "totalFare": 5,
                    "totalRates": 0,
                    "totalAmount": 5
                }
            ]
        },
        {
            "ticket": {
                "name": "ADULTOTRES",
                "surname": "TEST",
                "ticketNumber": "0755578274919",
                "date": "2023-09-06",
                "iata": 78496445,
                "office": "IBERIA.COM MAD175 NDC MADRID ES",
                "route": "BILBAO-MADRID"
            },
            "shippingData": {
                "language": "ES",
                "email": "ntt.jpueyo@iberia.es"
            },
            "billingData": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "identityInformation": "92311006T",
                "address": "Sinaí 66",
                "postalCode": "41007",
                "city": "Sevilla",
                "province": "Sevilla",
                "country": "España"
            },
            "invoicesPriceDetailDataWebList": [
                {
                    "concept": "EMISION",
                    "number": "5446670",
                    "date": "2023-09-06",
                    "numDuplicates": 0,
                    "currency": "EUR",
                    "subjectTaxationPrice": 2.73,
                    "noSubjectTaxationPrice": 0,
                    "vatTaxType": 10,
                    "vatTaxAmount": 0.27,
                    "totalFare": 3,
                    "totalRates": 0,
                    "totalAmount": 3
                }
            ]
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "0755578274920",
                "date": "2023-09-07",
                "iata": 78496445,
                "office": "IBERIA.COM MAD175 NDC MADRID ES",
                "route": "BILBAO-MADRID"
            },
            "shippingData": {
                "language": "ES",
                "email": "ntt.jpueyo@iberia.es"
            },
            "billingData": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "identityInformation": "92311006T",
                "address": "Sinai 33",
                "postalCode": "41007",
                "city": "Sevilla",
                "province": "Sevilla",
                "country": "España"
            },
            "invoicesPriceDetailDataWebList": [
                {
                    "concept": "EMISION",
                    "number": "5446693",
                    "date": "2023-09-07",
                    "numDuplicates": 0,
                    "currency": "EUR",
                    "subjectTaxationPrice": 10.91,
                    "noSubjectTaxationPrice": 0,
                    "vatTaxType": 10,
                    "vatTaxAmount": 1.09,
                    "totalFare": 12,
                    "totalRates": 0,
                    "totalAmount": 12
                }
            ]
        },
        {
            "ticket": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "ticketNumber": "0755578274903",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOTRES",
                "surname": "TEST",
                "ticketNumber": "0755578274906",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "0755578274902",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "ticketNumber": "0755578274904",
                "date": "2023-09-06",
                "iata": 78496445,
                "office": "IBERIA.COM MAD175 NDC MADRID ES",
                "route": "MADRID-BILBAO"
            },
            "shippingData": {
                "language": "ES",
                "email": "ntt.jpueyo@iberia.es"
            },
            "billingData": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "identityInformation": "92311006T",
                "address": "Sinaí 66",
                "postalCode": "41007",
                "city": "Sevilla",
                "province": "Sevilla",
                "country": "España"
            },
            "invoicesPriceDetailDataWebList": [
                {
                    "concept": "EMISION",
                    "number": "5446671",
                    "date": "2023-09-06",
                    "numDuplicates": 0,
                    "currency": "EUR",
                    "subjectTaxationPrice": 11.82,
                    "noSubjectTaxationPrice": 0,
                    "vatTaxType": 10,
                    "vatTaxAmount": 1.18,
                    "totalFare": 13,
                    "totalRates": 0,
                    "totalAmount": 13
                }
            ]
        },
        {
            "ticket": {
                "name": "ADULTOTRES",
                "surname": "TEST",
                "ticketNumber": "0755578274901",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "0755578274905",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "ticketNumber": "0755578274897",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOTRES",
                "surname": "TEST",
                "ticketNumber": "0755578274900",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "0755578274896",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "ticketNumber": "0755578274899",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOTRES",
                "surname": "TEST",
                "ticketNumber": "0755578274895",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "0755578274898",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "075557827489871",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "075557827489872",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "075557827489873",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "075557827489874",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "075557827489875",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "ticketNumber": "0755578274907",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOTRES",
                "surname": "TEST",
                "ticketNumber": "0755578274909",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "0755578274908",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "ticketNumber": "0755578274910",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOTRES",
                "surname": "TEST",
                "ticketNumber": "0755578274914",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "0755578274911",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "ticketNumber": "0755578274912",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "ticket": {
                "name": "ADULTOTRES",
                "surname": "TEST",
                "ticketNumber": "0755578274915",
                "date": "2023-09-08",
                "iata": 78496445,
                "office": "IBERIA.COM MAD175 NDC MADRID ES",
                "route": "BILBAO-MADRID"
            },
            "shippingData": {
                "language": "ES",
                "email": "aa@aa.com"
            },
            "billingData": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "identityInformation": "48200156E",
                "address": "dsad 3f",
                "postalCode": "28033",
                "city": "madsads",
                "province": "A Coruña",
                "country": "España"
            },
            "invoicesPriceDetailDataWebList": [
                {
                    "concept": "EMISION",
                    "number": "5446717",
                    "date": "2023-09-08",
                    "numDuplicates": 0,
                    "currency": "EUR",
                    "subjectTaxationPrice": 5.45,
                    "noSubjectTaxationPrice": 0,
                    "vatTaxType": 10,
                    "vatTaxAmount": 0.55,
                    "totalFare": 6,
                    "totalRates": 0,
                    "totalAmount": 6
                }
            ]
        },
        {
            "ticket": {
                "name": "ADULTOUNO",
                "surname": "TEST",
                "ticketNumber": "0755578274913",
                "date": "2023-09-08",
                "iata": 78496445,
                "office": "IBERIA.COM MAD175 NDC MADRID ES",
                "route": "BILBAO-MADRID"
            },
            "shippingData": {
                "language": "ES",
                "email": "aa@aa.com"
            },
            "billingData": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "identityInformation": "48200156E",
                "address": "dsad 3f",
                "postalCode": "28033",
                "city": "madsads",
                "province": "A Coruña",
                "country": "España"
            },
            "invoicesPriceDetailDataWebList": [
                {
                    "concept": "EMISION",
                    "number": "5446716",
                    "date": "2023-09-08",
                    "numDuplicates": 0,
                    "currency": "EUR",
                    "subjectTaxationPrice": 5.45,
                    "noSubjectTaxationPrice": 0,
                    "vatTaxType": 10,
                    "vatTaxAmount": 0.55,
                    "totalFare": 6,
                    "totalRates": 0,
                    "totalAmount": 6
                }
            ]
        }
    ];

    var fakePassengers = [{
        "passengerType": "ADULT",
        "personalInfo": {
          "name": "TEST",
          "surname": "TESTTEST",
          "birthDate": null
        },
        "passengerId": "ADULT_01",
        "contactInfo": {
          "phone": "34654334124",
          "phoneDetails": {
            "number": "654334124",
            "countryCode": "34"
          },
          "email": "sheila.moro.herrero@gmail.com",
          "phoneType": "MOBILE",
          "confirmationMailOption": null,
          "refundEmail": null,
          "language": "es"
        },
        "relatedPassengerId": "",
        "ckiStatus": null,
        "optionalInformation": {
          "contactData": false,
          "emergency": false,
          "ffInfo": false,
          "specialNeed": false
        },
        "residenceAccreditationStatus": null,
        "resiberPassengerId": "1",
        "securityInformation": {
          "relatedContent": null
        }
    }];

    var fakeMmBAppConstants = {
        INVOICE_DATA_TYPE: {
            PARTICULAR: 'PARTICULAR',
            COMPANY: 'COMPANY'
        },
        INVOICE_STATES: {
            ISSUED: 'ISSUED',
            REQUESTED: 'REQUESTED',
            NOT_AVAILABLE: 'NOT_AVAILABLE'
        },
        COUNTRIES_FOR_STATES_LITERAL: ['US', 'CA', 'AR', 'BR'],
        SEAT_FEATURE: {
            EMERGENCY_EXIT: 'EMERGENCY_EXIT',
            EXTRA_SIZE: 'EXTRA_SIZE',
            WINDOW: 'WINDOW',
            WING: 'WING',
            SCREEN: 'SCREEN',
            NON_RECLINING: 'NON_RECLINING',
            INFANT: 'INFANT',
            MOBILITY: 'MOBILITY',
            WC: 'WC',
            GALLEY: 'GALLEY',
            PROMO: 'PROMO',
            UPFRONT: 'UPFRONT',
            AISLE: 'AISLE'
        },
        ANCILLARIES_LITERALS_INVOICES: {
            PRIORITY_BOARDING: 'PRIORITY_BOARDING_TITLE',
            FLEXIBILITY_ON_DEMAND: 'ANCILLARIES_FLEXIBILITY_SUBTITLE_MODAL',
            BAGGAGE_15: 'ANCILLARIES_BAGGAGE_TITLE_15',//?
            BAGGAGE_23: 'ANCILLARIES_BAGGAGE_TITLE_23',//?
            BAGGAGE_32: 'ANCILLARIES_BAGGAGE_TITLE_32',//?
            SEAT: 'SEAT_TEXT',//
            VOUCHER_REFUND: 'ANCILLARIES_FLEXIBILITY_VOUCHER_REFUND_CHANGE_TITLE',//no esta
            FLIGHT_CHANGE: 'ANCILLARIES_FLEXIBILITY_FLIGHT_CHANGE_TITLE',
            FLEXIBILITY_PACK: 'ANCILLARIES_FLEXIBILITY_PACK_FLEXIBILITY',
            INSURANCE: 'ANCILLARIES_INSURANCE_TITLE',
            BOB: 'ANCILLARIES_BOB_MODAL_TITLE',
            CO2_FOOTPRINT: 'ANCILLARIES_CO2_FOOTPRINT_MODAL_TITLE'
        },
        SPEQ_TYPE: {
            SKI_SNOW: 'SKI_SNOW',
            GOLF_EQUIPMENT: 'GOLF_EQUIPMENT',
            FISHING_EQUIPMENT: 'FISHING_EQUIPMENT',
            SCUBA_DIVING: 'SCUBA_DIVING',
            SURFBOARD: 'SURFBOARD',
            BICYCLE: 'BICYCLE',
            SPORTING_FIREARMS: 'SPORTING_FIREARMS'
        }
    };

    var fakeCommercialInfo = {
        "currency": {
          "code": "EUR",
          "description": "Euro",
          "symbol": "€",
          "alignment": "R",
          "groupingSeparator": ".",
          "decimalSeparator": ",",
          "decimals": 2,
          "recommendedDisplay": "symbol"
        },
        "languages": [
          {
            "dateFormat": {
              "long": "d' / 'MMMM' / 'yyyy",
              "medium": "dd/MM/yyyy",
              "short": "dd/MM/yyyy"
            },
            "code": "ca",
            "description": "Català"
          },
          {
            "dateFormat": {
              "long": "MMMM d, yyyy",
              "medium": "MMM d, yyyy",
              "short": "dd/MM/yyyy"
            },
            "code": "en",
            "description": "English"
          },
          {
            "dateFormat": {
              "long": "d' de 'MMMM' de 'yyyy",
              "medium": "dd-MMM-yyyy",
              "short": "dd/MM/yyyy"
            },
            "code": "es",
            "description": "Español"
          }
        ],
        "market": {
          "code": "ES",
          "description": "España"
        },
        "marketFlags": {
          "allowedNameCorrection": true,
          "allowedAncillaries": true,
          "allowedFlightChange": true,
          "allowedRefund": true,
          "allowedCashAndAviosWithVoucher": true
        },
        "sessionTimeLifeInMinutes": 15,
        "maxSearchTime": 360,
        "minSearchTime": 0,
        "passengerTypes": [
          {
            "passengerType": "ADULT",
            "description": "Adulto"
          },
          {
            "passengerType": "CHILD",
            "description": "Niño"
          },
          {
            "passengerType": "INFANT",
            "description": "Bebé"
          }
        ],
        "discounts": [
          {
            "code": "GENERAL",
            "description": "LGF.description.general",
            "countries": [
              "ES"
            ],
            "cities": [],
            "relatedField": "GENERAL",
            "type": "LGF"
          },
          {
            "code": "SPECIAL",
            "description": "LGF.description.special",
            "countries": [
              "ES"
            ],
            "cities": [],
            "relatedField": "SPECIAL",
            "type": "LGF"
          },
          {
            "code": "BALEARES",
            "description": "Residente en Baleares",
            "countries": [
              "ES"
            ],
            "cities": [
              {
                "code": "IBZ",
                "description": "Ibiza",
                "countryCode": "ES",
                "countryDescription": null,
                "timezone": "Europe/Madrid",
                "gaCode": 6,
                "arCode": 1,
                "saCode": 5,
                "latitude": 38.866666,
                "longitude": 1.366666
              },
              {
                "code": "MAH",
                "description": "Menorca",
                "countryCode": "ES",
                "countryDescription": null,
                "timezone": "Europe/Madrid",
                "gaCode": 6,
                "arCode": 1,
                "saCode": 5,
                "latitude": 39.866666,
                "longitude": 4.216666
              },
              {
                "code": "PMI",
                "description": "Palma de Mallorca",
                "countryCode": "ES",
                "countryDescription": null,
                "timezone": "Europe/Madrid",
                "gaCode": 6,
                "arCode": 1,
                "saCode": 6,
                "latitude": 39.55,
                "longitude": 2.733333
              }
            ],
            "relatedField": "balearicIslandsResident",
            "type": "RES"
          },
          {
            "code": "CANARIAS",
            "description": "Residente en Canarias",
            "countries": [
              "ES"
            ],
            "cities": [
              {
                "code": "ACE",
                "description": "Lanzarote",
                "countryCode": "ES",
                "countryDescription": null,
                "timezone": "Atlantic/Canary",
                "gaCode": 6,
                "arCode": 1,
                "saCode": 10,
                "latitude": 28.95,
                "longitude": -13.6
              },
              {
                "code": "FUE",
                "description": "Fuerteventura",
                "countryCode": "ES",
                "countryDescription": null,
                "timezone": "Atlantic/Canary",
                "gaCode": 6,
                "arCode": 1,
                "saCode": 10,
                "latitude": 28.45,
                "longitude": -13.866666
              },
              {
                "code": "GMZ",
                "description": "San Sebastián de la Gomera",
                "countryCode": "ES",
                "countryDescription": null,
                "timezone": "Atlantic/Canary",
                "gaCode": 6,
                "arCode": 1,
                "saCode": 12,
                "latitude": 28.0937998,
                "longitude": -17.1098582
              },
              {
                "code": "LPA",
                "description": "Gran Canaria Las Palmas",
                "countryCode": "ES",
                "countryDescription": null,
                "timezone": "Atlantic/Canary",
                "gaCode": 6,
                "arCode": 1,
                "saCode": 12,
                "latitude": 27.933333,
                "longitude": -15.383333
              },
              {
                "code": "SPC",
                "description": "Santa Cruz de La Palma",
                "countryCode": "ES",
                "countryDescription": null,
                "timezone": "Europe/Madrid",
                "gaCode": 6,
                "arCode": 1,
                "saCode": 10,
                "latitude": 28.683333,
                "longitude": -17.75
              },
              {
                "code": "TCI",
                "description": "Tenerife",
                "countryCode": "ES",
                "countryDescription": null,
                "timezone": "Atlantic/Canary",
                "gaCode": 6,
                "arCode": 1,
                "saCode": 11,
                "latitude": 28.316666,
                "longitude": -16.566666
              },
              {
                "code": "VDE",
                "description": "Valverde",
                "countryCode": "ES",
                "countryDescription": null,
                "timezone": "Atlantic/Canary",
                "gaCode": 6,
                "arCode": 1,
                "saCode": 12,
                "latitude": 27.793241,
                "longitude": -17.9413323
              }
            ],
            "relatedField": "canaryIslandsResident",
            "type": "RES"
          },
          {
            "code": "CEUTA",
            "description": "Soy residente en Ceuta",
            "countries": [
              "ES"
            ],
            "cities": [
              {
                "code": "AGP",
                "description": "Málaga",
                "countryCode": "ES",
                "countryDescription": null,
                "timezone": "Europe/Madrid",
                "gaCode": 6,
                "arCode": 1,
                "saCode": 1,
                "latitude": 36.666666,
                "longitude": -4.5
              },
              {
                "code": "SVQ",
                "description": "Sevilla",
                "countryCode": "ES",
                "countryDescription": null,
                "timezone": "Europe/Madrid",
                "gaCode": 6,
                "arCode": 1,
                "saCode": 1,
                "latitude": 37.433333,
                "longitude": -5.9
              },
              {
                "code": "XRY",
                "description": "Jerez de la Frontera",
                "countryCode": "ES",
                "countryDescription": null,
                "timezone": "Europe/Madrid",
                "gaCode": 6,
                "arCode": 1,
                "saCode": 1,
                "latitude": 36.75,
                "longitude": -6.066666
              }
            ],
            "relatedField": "ceutaResident",
            "type": "RES"
          },
          {
            "code": "MELILLA",
            "description": "Soy residente en Melilla",
            "countries": [
              "ES"
            ],
            "cities": [
              {
                "code": "MLN",
                "description": "Melilla",
                "countryCode": "ES",
                "countryDescription": null,
                "timezone": "Europe/Madrid",
                "gaCode": 6,
                "arCode": 1,
                "saCode": 2,
                "latitude": 35.283333,
                "longitude": -2.95
              }
            ],
            "relatedField": "melillaResident",
            "type": "RES"
          }
        ],
        "defaultValues": {
          "defaultPaxType": "ADULT",
          "defaultPaxTypeNumbers": [
            {
              "passengerType": "ADULT",
              "number": 1
            },
            {
              "passengerType": "CHILD",
              "number": 0
            },
            {
              "passengerType": "INFANT",
              "number": 0
            }
          ],
          "maxPaxNumber": 9,
          "defaultPhonePrefix": {
            "code": "34",
            "description": "España / +34",
            "countryCode": "ES"
          }
        },
        "roundingPolicy": "HALF_ROUND_DOWN",
        "availabilityPriceShowPolicy": "ADULT_PRICE_WITH_TAXES_AND_EMISSION",
        "mainCities": {
          "normal": {
            "code": "MAD",
            "description": "Madrid",
            "timezone": "Europe/Madrid",
            "country": {
              "code": "ES",
              "description": null
            }
          },
          "redemption": {
            "code": "MAD",
            "description": "Madrid",
            "timezone": "Europe/Madrid",
            "country": {
              "code": "ES",
              "description": null
            }
          }
        }
    };

    var $fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function () {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return label;
                } as any;
                break;
            default:
                break;
        }

        return filterFunc;
    });

    var faketranslate = {

        'onReady': jasmine.createSpy().and.returnValue(new Promise(resolve => resolve(true))),
        'storageKey': jasmine.createSpy('storageKey').and.callFake(function () { }),
        'storage': jasmine.createSpy('storage').and.callFake(function () { }),
        'preferredLanguage': jasmine.createSpy('preferredLanguage').and.callFake(function () { }),
        'use': jasmine.createSpy('use').and.callFake(function () { })
    };

    var fakeNewRequestInvoices = [
        '0755578274906'
    ];

    var fakeNewRequestInvoicesFailure = [
        '0755578274902'
    ];

    var fakeListInvoices = [
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_01",
            "checked": false,
            "route": "MAD-BIO-MAD",
            "concept": "Vuelos - Adulto Dos Test ",
            "price": "102.63 €",
            "ticketNumber": "0751419185786",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_01",
            "checked": false,
            "route": "MAD-BIO-MAD",
            "concept": "Vuelos - Adulto Tres Test ",
            "price": "102.63 €",
            "ticketNumber": "0751419185787",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_01",
            "checked": false,
            "route": "MAD-BIO-MAD",
            "concept": "Vuelos - Adulto Uno Test ",
            "price": "102.63 €",
            "ticketNumber": "0751419185785",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_02",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Selección de asiento No reclinable, XL",
            "price": "12  €",
            "ticketNumber": "0755578274921",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_03",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Selección de asiento Ventanilla, XL, Salida de emergencia",
            "price": "14  €",
            "ticketNumber": "0755578274916",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_04",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Selección de asiento En las primeras filas",
            "price": "8  €",
            "ticketNumber": "0755578274917",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_64",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Selección de asiento En las primeras filas",
            "price": "8  €",
            "ticketNumber": "075557827491764",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_65",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Selección de asiento En las primeras filas",
            "price": "8  €",
            "ticketNumber": "075557827491765",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_66",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Selección de asiento En las primeras filas",
            "price": "8  €",
            "ticketNumber": "075557827491766",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_67",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Selección de asiento En las primeras filas",
            "price": "8  €",
            "ticketNumber": "075557827491767",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_68",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Selección de asiento En las primeras filas",
            "price": "8  €",
            "ticketNumber": "075557827491768",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_69",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Selección de asiento En las primeras filas",
            "price": "8  €",
            "ticketNumber": "075557827491769",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_70",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Selección de asiento En las primeras filas",
            "price": "8  €",
            "ticketNumber": "075557827491770",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_05",
            "checked": false,
            "route": "BIO-MAD",
            "concept": "Selección de asiento ",
            "price": "5  €",
            "ticketNumber": "0755578274918",
            "state": "Emitida",
            "billingData": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "identityInformation": "92311006T",
                "address": "Sinai 33",
                "postalCode": "41007",
                "city": "Sevilla",
                "province": "Sevilla",
                "country": "España"
            },
            "shippingData": {
                "language": "ES",
                "email": "ntt.jpueyo@iberia.es"
            },
            "stateRequested": "ISSUED"
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_06",
            "checked": false,
            "route": "BIO-MAD",
            "concept": "Selección de asiento Posterior",
            "price": "3  €",
            "ticketNumber": "0755578274919",
            "state": "Emitida",
            "billingData": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "identityInformation": "92311006T",
                "address": "Sinaí 66",
                "postalCode": "41007",
                "city": "Sevilla",
                "province": "Sevilla",
                "country": "España"
            },
            "shippingData": {
                "language": "ES",
                "email": "ntt.jpueyo@iberia.es"
            },
            "stateRequested": "ISSUED"
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_07",
            "checked": false,
            "route": "BIO-MAD",
            "concept": "Selección de asiento XL",
            "price": "12  €",
            "ticketNumber": "0755578274920",
            "state": "Emitida",
            "billingData": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "identityInformation": "92311006T",
                "address": "Sinai 33",
                "postalCode": "41007",
                "city": "Sevilla",
                "province": "Sevilla",
                "country": "España"
            },
            "shippingData": {
                "language": "ES",
                "email": "ntt.jpueyo@iberia.es"
            },
            "stateRequested": "ISSUED"
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_08",
            "checked": false,
            "route": "BIO-MAD",
            "concept": "Equipaje extra, 15 Kg.",
            "price": "13  €",
            "ticketNumber": "0755578274903",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_09",
            "checked": false,
            "route": "BIO-MAD",
            "concept": "Equipaje extra, 23 Kg.",
            "price": "18  €",
            "ticketNumber": "0755578274906",
            "state": 'Solicitada',
            "billingData": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "identityInformation": "92311006T",
                "address": "Sinai 33",
                "postalCode": "41007",
                "city": "Sevilla",
                "province": "Sevilla",
                "country": "España"
            },
            "shippingData": {
                "language": "ES",
                "email": "ntt.jpueyo@iberia.es"
            },
            "stateRequested": "REQUESTED"
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_10",
            "checked": false,
            "route": "BIO-MAD",
            "concept": "Equipaje extra, 32 Kg.",
            "price": "35  €",
            "ticketNumber": "0755578274902",
            "state": 'No disponible',
            "billingData": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "identityInformation": "92311006T",
                "address": "Sinai 33",
                "postalCode": "41007",
                "city": "Sevilla",
                "province": "Sevilla",
                "country": "España"
            },
            "shippingData": {
                "language": "ES",
                "email": "ntt.jpueyo@iberia.es"
            },
            "stateRequested": "NOT_AVAILABLE"
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_11",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Equipaje extra, 15 Kg.",
            "price": "13  €",
            "ticketNumber": "0755578274904",
            "state": "Emitida",
            "billingData": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "identityInformation": "92311006T",
                "address": "Sinaí 66",
                "postalCode": "41007",
                "city": "Sevilla",
                "province": "Sevilla",
                "country": "España"
            },
            "shippingData": {
                "language": "ES",
                "email": "ntt.jpueyo@iberia.es"
            },
            "stateRequested": "ISSUED"
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_12",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Equipaje extra, 23 Kg.",
            "price": "18  €",
            "ticketNumber": "0755578274901",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_13",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Equipaje extra, 32 Kg.",
            "price": "35  €",
            "ticketNumber": "0755578274905",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_14",
            "checked": false,
            "route": "BIO-MAD",
            "concept": "Equipaje especial, Bicicletas",
            "price": "40  €",
            "ticketNumber": "0755578274897",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_15",
            "checked": false,
            "route": "BIO-MAD",
            "concept": "Equipaje especial, Equipo de golf",
            "price": "35  €",
            "ticketNumber": "0755578274900",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_16",
            "checked": false,
            "route": "BIO-MAD",
            "concept": "Equipaje especial, Equipaje de esquí",
            "price": "35  €",
            "ticketNumber": "0755578274896",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_17",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Equipaje especial, Bicicletas",
            "price": "40  €",
            "ticketNumber": "0755578274899",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_18",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Equipaje especial, Equipo de golf",
            "price": "35  €",
            "ticketNumber": "0755578274895",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_19",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Equipaje especial, Equipaje de esquí",
            "price": "35  €",
            "ticketNumber": "0755578274898",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_71",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Equipaje especial, Equipaje de esquí",
            "price": "35  €",
            "ticketNumber": "075557827489871",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_72",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Equipaje especial, Equipaje de esquí",
            "price": "35  €",
            "ticketNumber": "075557827489872",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_73",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Equipaje especial, Equipaje de esquí",
            "price": "35  €",
            "ticketNumber": "075557827489873",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_74",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Equipaje especial, Equipaje de esquí",
            "price": "35  €",
            "ticketNumber": "075557827489874",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_75",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Equipaje especial, Equipaje de esquí",
            "price": "35  €",
            "ticketNumber": "075557827489875",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_20",
            "checked": false,
            "route": "MAD-BIO-MAD",
            "concept": "Flexibilidad - Adulto Dos Test ",
            "price": "41  €",
            "ticketNumber": "0755578274907",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_21",
            "checked": false,
            "route": "MAD-BIO-MAD",
            "concept": "Flexibilidad - Adulto Tres Test ",
            "price": "41  €",
            "ticketNumber": "0755578274909",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_22",
            "checked": false,
            "route": "MAD-BIO-MAD",
            "concept": "Flexibilidad - Adulto Uno Test ",
            "price": "41  €",
            "ticketNumber": "0755578274908",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_23",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Prioridad de embarque - Adulto Dos Test ",
            "price": "6  €",
            "ticketNumber": "0755578274910",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_24",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Prioridad de embarque - Adulto Tres Test ",
            "price": "6  €",
            "ticketNumber": "0755578274914",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_25",
            "checked": false,
            "route": "MAD-BIO",
            "concept": "Prioridad de embarque - Adulto Uno Test ",
            "price": "6  €",
            "ticketNumber": "0755578274911",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_26",
            "checked": false,
            "route": "BIO-MAD",
            "concept": "Prioridad de embarque - Adulto Dos Test ",
            "price": "6  €",
            "ticketNumber": "0755578274912",
            "state": null,
            "billingData": null,
            "shippingData": null,
            "stateRequested": ""
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_27",
            "checked": false,
            "route": "BIO-MAD",
            "concept": "Prioridad de embarque - Adulto Tres Test ",
            "price": "6  €",
            "ticketNumber": "0755578274915",
            "state": "Emitida",
            "billingData": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "identityInformation": "48200156E",
                "address": "dsad 3f",
                "postalCode": "28033",
                "city": "madsads",
                "province": "A Coruña",
                "country": "España"
            },
            "shippingData": {
                "language": "ES",
                "email": "aa@aa.com"
            },
            "stateRequested": "ISSUED"
        },
        {
            "id": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_28",
            "checked": false,
            "route": "BIO-MAD",
            "concept": "Prioridad de embarque - Adulto Uno Test ",
            "price": "6  €",
            "ticketNumber": "0755578274913",
            "state": "Emitida",
            "billingData": {
                "name": "ADULTODOS",
                "surname": "TEST",
                "identityInformation": "48200156E",
                "address": "dsad 3f",
                "postalCode": "28033",
                "city": "madsads",
                "province": "A Coruña",
                "country": "España"
            },
            "shippingData": {
                "language": "ES",
                "email": "aa@aa.com"
            },
            "stateRequested": "ISSUED"
        }
    ];

    var fakeSpeqsInfo = {
        "SpeqsInfo": [
            {
                "departureCity": {
                    "code": "MAD",
                    "name": "BARAJAS",
                    "terminal": "4",
                    "city": {
                        "code": "MAD",
                        "description": "Madrid",
                        "countryCode": "ES",
                        "country": {
                            "code": "ES",
                            "description": "España"
                        }
                    }
                },
                "arrivalCity": {
                    "code": "BIO",
                    "name": "AIRPORT",
                    "terminal": null,
                    "city": {
                        "code": "BIO",
                        "description": "Bilbao",
                        "countryCode": "ES",
                        "country": {
                            "code": "ES",
                            "description": "España"
                        }
                    }
                },
                "departureCountry": "ES",
                "arrivalCountry": "ES",
                "segments": [
                    {
                        "departureCity": {
                            "code": "MAD",
                            "name": "BARAJAS",
                            "terminal": "4",
                            "city": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "country": {
                                    "code": "ES",
                                    "description": "España"
                                }
                            }
                        },
                        "arrivalCity": {
                            "code": "BIO",
                            "name": "AIRPORT",
                            "terminal": null,
                            "city": {
                                "code": "BIO",
                                "description": "Bilbao",
                                "countryCode": "ES",
                                "country": {
                                    "code": "ES",
                                    "description": "España"
                                }
                            }
                        },
                        "departureDateParsed": {
                            "dateTime": "15:55",
                            "weekDay": "WEEKDAY_MONDAY",
                            "day": 23,
                            "monthNumber": 10,
                            "month": "MONTH_OCTOBER",
                            "year": 2023,
                            "originalDate": "2023-10-23T15:55:00+02:00",
                            "formatedDate": "23/10/2023"
                        },
                        "arrivalDateParsed": {
                            "dateTime": "17:00",
                            "weekDay": "WEEKDAY_MONDAY",
                            "day": 23,
                            "monthNumber": 10,
                            "month": "MONTH_OCTOBER",
                            "year": 2023,
                            "originalDate": "2023-10-23T17:00:00+02:00",
                            "formatedDate": "23/10/2023"
                        },
                        "companyURL": "/aerolineas/logo_pos_IB.svg",
                        "overnight": false,
                        "departureDateTimeParsed": "15:55",
                        "arrivalDateTimeParsed": "17:00",
                        "departure": {
                            "code": "MAD",
                            "name": "BARAJAS",
                            "terminal": "4",
                            "city": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "country": {
                                    "code": "ES",
                                    "description": "España"
                                }
                            }
                        },
                        "arrival": {
                            "code": "BIO",
                            "name": "AIRPORT",
                            "terminal": null,
                            "city": {
                                "code": "BIO",
                                "description": "Bilbao",
                                "countryCode": "ES",
                                "country": {
                                    "code": "ES",
                                    "description": "España"
                                }
                            }
                        },
                        "flight": {
                            "marketingCarrier": {
                                "code": "IB",
                                "name": "Iberia"
                            },
                            "operationalCarrier": {
                                "code": "IB",
                                "name": "Iberia"
                            },
                            "marketingFlightNumber": "0438",
                            "operationalFlightNumber": "0438",
                            "operationalDisclosure": "IB",
                            "aircraft": {
                                "code": "319",
                                "description": "Airbus A319"
                            }
                        },
                        "durationParsed": "01h 5min.",
                        "fareFamilyConditions": [
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "EQMANO",
                                "name": "Equipaje de mano",
                                "title": "Equipaje de mano: 1 pieza",
                                "message": "Incluida 1 pieza hasta 10 kg (56x40x25cm) y 1 accesorio personal, en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo.",
                                "units": 1
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "EQBODEGA",
                                "name": "Equipaje en bodega",
                                "title": "Equipaje facturable no incluido",
                                "message": "Con coste.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "COMIDA",
                                "name": "Comida",
                                "title": "Comida no incluida",
                                "message": "Con coste.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "ASIENTO",
                                "name": "Selección de asiento",
                                "title": "Selección de asiento con coste",
                                "message": "Con coste.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "CAMBIO",
                                "name": "Cambios",
                                "title": "Cambio de vuelo con coste",
                                "message": "Permitido con penalización de 65 EUR. No permitido en caso de no presentarse al vuelo (no-show).",
                                "units": 65
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "REEMBOLSO",
                                "name": "Reembolso (por sentido)",
                                "title": "No permitido",
                                "message": "No permitido.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "ASIENTOXL",
                                "name": "Asiento espacio extra",
                                "title": "Asiento espacio extra con coste",
                                "message": "Con coste.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "EMBARQUE",
                                "name": "Prioridad de Embarque",
                                "title": "Embarque prioritario no incluido",
                                "message": "No incluido.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "AVIO",
                                "name": "AVIOS",
                                "title": "Obtén Avios con tu compra",
                                "message": "Incluido.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "SALAVIP",
                                "name": "Acceso a salas VIP",
                                "title": "Acceso a Sala Vip no incluido",
                                "message": "Acceso no incluido.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "CABINA",
                                "name": "Cabina",
                                "title": "Cabina Turista",
                                "message": "Turista.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "WIFI",
                                "name": "WiFi",
                                "title": "Wifi con coste",
                                "message": "Disponible con coste, según el tipo de avión.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "CHECKINDESK",
                                "name": "Mostrador check-in exclusivo",
                                "title": "Mostrador Check-in exclusivo no incluido",
                                "message": "No incluido.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "ASIENTODELANTERO",
                                "name": "Asiento delantero",
                                "title": "Asiento delantero con coste",
                                "message": "Con coste.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "ASIENTOPREFERENTE",
                                "name": "Asiento preferente",
                                "title": "Asiento preferente no aplica",
                                "message": "No aplica.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "FASTTRACK",
                                "name": "Fast Track",
                                "title": "Fast Track no incluido",
                                "message": "No incluido.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "EQPPRIOR",
                                "name": "Entrega prioritaria equipaje",
                                "title": "No incluye entrega rápida de equipaje",
                                "message": "Con coste.",
                                "units": null
                            }
                        ],
                        "segmentId": "IB043820231023",
                        "sliceId": "MADBIO20231023155500",
                        "status": {
                            "code": "HK",
                            "description": "Confirmado"
                        },
                        "cabin": {
                            "rbd": "O",
                            "description": "",
                            "remainingSeats": 0,
                            "fareFamily": "TBAESEU",
                            "code": "R",
                            "type": "ECONOMY",
                            "bookingClass": "ECONOMY"
                        },
                        "flown": false,
                        "warnings": {},
                        "operatorLocator": null,
                        "stop": null,
                        "seats": [
                            {
                                "id": "ADULT_01",
                                "code": "9C",
                                "userName": "Adulto Dos",
                                "userSurname": "Test ",
                                "extraInfo": null,
                                "selected": true
                            },
                            {
                                "id": "ADULT_02",
                                "code": "10A",
                                "userName": "Adulto Tres",
                                "userSurname": "Test ",
                                "extraInfo": null,
                                "selected": true
                            },
                            {
                                "id": "ADULT_03",
                                "code": "12C",
                                "userName": "Adulto Uno",
                                "userSurname": "Test ",
                                "extraInfo": null,
                                "selected": true
                            }
                        ],
                        "sliceBaggage": {
                            "passBaggages": [
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Dos",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_01",
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "1",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Dos",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "cabin": {
                                        "units": 1,
                                        "title": " (56x40x25cm)"
                                    },
                                    "baggageData": [
                                        {
                                            "passengerId": "ADULT_01",
                                            "subtype": "BAGGAGE_15",
                                            "description": "15Kg",
                                            "purchasedPieces": 1
                                        }
                                    ],
                                    "extraHold": 1,
                                    "totalHold": 1
                                },
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Tres",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_02",
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "2",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Tres",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "cabin": {
                                        "units": 1,
                                        "title": " (56x40x25cm)"
                                    },
                                    "baggageData": [
                                        {
                                            "passengerId": "ADULT_02",
                                            "subtype": "BAGGAGE_23",
                                            "description": "23Kg",
                                            "purchasedPieces": 1
                                        }
                                    ],
                                    "extraHold": 1,
                                    "totalHold": 1
                                },
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Uno",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_03",
                                    "contactInfo": {
                                        "phone": "34625001001",
                                        "phoneDetails": {
                                            "number": "625001001",
                                            "countryCode": "34"
                                        },
                                        "email": "ntt.jpueyo@iberia.es",
                                        "phoneType": "MOBILE",
                                        "confirmationMailOption": null,
                                        "refundEmail": null,
                                        "language": "es",
                                        "countryCode": "34"
                                    },
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "3",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Uno",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "cabin": {
                                        "units": 1,
                                        "title": " (56x40x25cm)"
                                    },
                                    "baggageData": [
                                        {
                                            "passengerId": "ADULT_03",
                                            "subtype": "BAGGAGE_32",
                                            "description": "32Kg",
                                            "purchasedPieces": 1
                                        }
                                    ],
                                    "extraHold": 1,
                                    "totalHold": 1
                                }
                            ],
                            "cabin": {
                                "name": "Equipaje de mano",
                                "totalUnits": 1
                            },
                            "hold": {
                                "name": "Equipaje en bodega",
                                "totalUnits": 3,
                                "totalglobal": 3
                            }
                        },
                        "sliceSpeqs": {
                            "passBaggages": [
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Dos",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_01",
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "1",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Dos",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "hold": {
                                        "units": 6,
                                        "titleHold": "Equipaje especial"
                                    },
                                    "Speqs": [
                                        {
                                            "type": "specialEquipment",
                                            "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_17",
                                            "price": {
                                                "fare": 40,
                                                "tax": 0,
                                                "total": 40,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "sliceId": "MADBIO20231023155500",
                                            "passengerId": "ADULT_01",
                                            "amount": 1,
                                            "emd": "0755578274899",
                                            "orderItemPaymentInfos": [],
                                            "subtype": "SPEQS_BICYCLE",
                                            "code": null
                                        }
                                    ]
                                },
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Tres",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_02",
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "2",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Tres",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "hold": {
                                        "units": 6,
                                        "titleHold": "Equipaje especial"
                                    },
                                    "Speqs": [
                                        {
                                            "type": "specialEquipment",
                                            "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_18",
                                            "price": {
                                                "fare": 35,
                                                "tax": 0,
                                                "total": 35,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "sliceId": "MADBIO20231023155500",
                                            "passengerId": "ADULT_02",
                                            "amount": 1,
                                            "emd": "0755578274895",
                                            "orderItemPaymentInfos": [],
                                            "subtype": "SPEQS_GOLF_EQUIPMENT",
                                            "code": null
                                        }
                                    ]
                                },
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Uno",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_03",
                                    "contactInfo": {
                                        "phone": "34625001001",
                                        "phoneDetails": {
                                            "number": "625001001",
                                            "countryCode": "34"
                                        },
                                        "email": "ntt.jpueyo@iberia.es",
                                        "phoneType": "MOBILE",
                                        "confirmationMailOption": null,
                                        "refundEmail": null,
                                        "language": "es",
                                        "countryCode": "34"
                                    },
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "3",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Uno",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "hold": {
                                        "units": 6,
                                        "titleHold": "Equipaje especial"
                                    },
                                    "Speqs": [
                                        {
                                            "type": "specialEquipment",
                                            "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_19",
                                            "price": {
                                                "fare": 35,
                                                "tax": 0,
                                                "total": 35,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "sliceId": "MADBIO20231023155500",
                                            "passengerId": "ADULT_03",
                                            "amount": 1,
                                            "emd": "0755578274898",
                                            "orderItemPaymentInfos": [],
                                            "subtype": "SPEQS_SKI_SNOW",
                                            "code": null
                                        }
                                    ]
                                },
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Uno",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_03",
                                    "contactInfo": {
                                        "phone": "34625001001",
                                        "phoneDetails": {
                                            "number": "625001001",
                                            "countryCode": "34"
                                        },
                                        "email": "ntt.jpueyo@iberia.es",
                                        "phoneType": "MOBILE",
                                        "confirmationMailOption": null,
                                        "refundEmail": null,
                                        "language": "es",
                                        "countryCode": "34"
                                    },
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "3",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Uno",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "hold": {
                                        "units": 6,
                                        "titleHold": "Equipaje especial"
                                    },
                                    "Speqs": [
                                        {
                                            "type": "specialEquipment",
                                            "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_71",
                                            "price": {
                                                "fare": 35,
                                                "tax": 0,
                                                "total": 35,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "sliceId": "MADBIO20231023155500",
                                            "passengerId": "ADULT_03",
                                            "amount": 1,
                                            "emd": "075557827489871",
                                            "orderItemPaymentInfos": [],
                                            "subtype": "SPEQS_FISHING_EQUIPMENT",
                                            "code": null
                                        }
                                    ]
                                },
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Uno",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_03",
                                    "contactInfo": {
                                        "phone": "34625001001",
                                        "phoneDetails": {
                                            "number": "625001001",
                                            "countryCode": "34"
                                        },
                                        "email": "ntt.jpueyo@iberia.es",
                                        "phoneType": "MOBILE",
                                        "confirmationMailOption": null,
                                        "refundEmail": null,
                                        "language": "es",
                                        "countryCode": "34"
                                    },
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "3",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Uno",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "hold": {
                                        "units": 6,
                                        "titleHold": "Equipaje especial"
                                    },
                                    "Speqs": [
                                        {
                                            "type": "specialEquipment",
                                            "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_72",
                                            "price": {
                                                "fare": 35,
                                                "tax": 0,
                                                "total": 35,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "sliceId": "MADBIO20231023155500",
                                            "passengerId": "ADULT_03",
                                            "amount": 1,
                                            "emd": "075557827489872",
                                            "orderItemPaymentInfos": [],
                                            "subtype": "SPEQS_SCUBA_DIVING",
                                            "code": null
                                        }
                                    ]
                                },
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Uno",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_03",
                                    "contactInfo": {
                                        "phone": "34625001001",
                                        "phoneDetails": {
                                            "number": "625001001",
                                            "countryCode": "34"
                                        },
                                        "email": "ntt.jpueyo@iberia.es",
                                        "phoneType": "MOBILE",
                                        "confirmationMailOption": null,
                                        "refundEmail": null,
                                        "language": "es",
                                        "countryCode": "34"
                                    },
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "3",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Uno",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "hold": {
                                        "units": 6,
                                        "titleHold": "Equipaje especial"
                                    },
                                    "Speqs": [
                                        {
                                            "type": "specialEquipment",
                                            "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_73",
                                            "price": {
                                                "fare": 35,
                                                "tax": 0,
                                                "total": 35,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "sliceId": "MADBIO20231023155500",
                                            "passengerId": "ADULT_03",
                                            "amount": 1,
                                            "emd": "075557827489873",
                                            "orderItemPaymentInfos": [],
                                            "subtype": "SPEQS_GOLF_EQUIPMENT",
                                            "code": null
                                        }
                                    ]
                                },
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Uno",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_03",
                                    "contactInfo": {
                                        "phone": "34625001001",
                                        "phoneDetails": {
                                            "number": "625001001",
                                            "countryCode": "34"
                                        },
                                        "email": "ntt.jpueyo@iberia.es",
                                        "phoneType": "MOBILE",
                                        "confirmationMailOption": null,
                                        "refundEmail": null,
                                        "language": "es",
                                        "countryCode": "34"
                                    },
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "3",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Uno",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "hold": {
                                        "units": 6,
                                        "titleHold": "Equipaje especial"
                                    },
                                    "Speqs": [
                                        {
                                            "type": "specialEquipment",
                                            "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_74",
                                            "price": {
                                                "fare": 35,
                                                "tax": 0,
                                                "total": 35,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "sliceId": "MADBIO20231023155500",
                                            "passengerId": "ADULT_03",
                                            "amount": 1,
                                            "emd": "075557827489874",
                                            "orderItemPaymentInfos": [],
                                            "subtype": "SPEQS_SURFBOARD",
                                            "code": null
                                        }
                                    ]
                                },
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Uno",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_03",
                                    "contactInfo": {
                                        "phone": "34625001001",
                                        "phoneDetails": {
                                            "number": "625001001",
                                            "countryCode": "34"
                                        },
                                        "email": "ntt.jpueyo@iberia.es",
                                        "phoneType": "MOBILE",
                                        "confirmationMailOption": null,
                                        "refundEmail": null,
                                        "language": "es",
                                        "countryCode": "34"
                                    },
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "3",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Uno",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "hold": {
                                        "units": 6,
                                        "titleHold": "Equipaje especial"
                                    },
                                    "Speqs": [
                                        {
                                            "type": "specialEquipment",
                                            "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_75",
                                            "price": {
                                                "fare": 35,
                                                "tax": 0,
                                                "total": 35,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "sliceId": "MADBIO20231023155500",
                                            "passengerId": "ADULT_03",
                                            "amount": 1,
                                            "emd": "075557827489875",
                                            "orderItemPaymentInfos": [],
                                            "subtype": "SPEQS_SPORTING_FIREARMS",
                                            "code": null
                                        }
                                    ]
                                }
                            ],
                            "hold": {
                                "name": "Equipaje especial",
                                "totalUnits": 6,
                                "totalglobal": 6,
                                "speqs": []
                            }
                        }
                    }
                ],
                "departureDateParsed": {
                    "dateTime": "15:55",
                    "weekDay": "WEEKDAY_MONDAY",
                    "day": 23,
                    "monthNumber": 10,
                    "month": "MONTH_OCTOBER",
                    "year": 2023,
                    "originalDate": "2023-10-23T15:55:00+02:00",
                    "formatedDate": "23/10/2023"
                },
                "arrivalDateParsed": {
                    "dateTime": "17:00",
                    "weekDay": "WEEKDAY_MONDAY",
                    "day": 23,
                    "monthNumber": 10,
                    "month": "MONTH_OCTOBER",
                    "year": 2023,
                    "originalDate": "2023-10-23T17:00:00+02:00",
                    "formatedDate": "23/10/2023"
                },
                "durationParsed": "01h 5min.",
                "stopsNumber": 0,
                "daysToGo": null,
                "qualifierIBV": false
            },
            {
                "departureCity": {
                    "code": "BIO",
                    "name": "AIRPORT",
                    "terminal": null,
                    "city": {
                        "code": "BIO",
                        "description": "Bilbao",
                        "countryCode": "ES",
                        "country": {
                            "code": "ES",
                            "description": "España"
                        }
                    }
                },
                "arrivalCity": {
                    "code": "MAD",
                    "name": "BARAJAS",
                    "terminal": "4",
                    "city": {
                        "code": "MAD",
                        "description": "Madrid",
                        "countryCode": "ES",
                        "country": {
                            "code": "ES",
                            "description": "España"
                        }
                    }
                },
                "departureCountry": "ES",
                "arrivalCountry": "ES",
                "segments": [
                    {
                        "departureCity": {
                            "code": "BIO",
                            "name": "AIRPORT",
                            "terminal": null,
                            "city": {
                                "code": "BIO",
                                "description": "Bilbao",
                                "countryCode": "ES",
                                "country": {
                                    "code": "ES",
                                    "description": "España"
                                }
                            }
                        },
                        "arrivalCity": {
                            "code": "MAD",
                            "name": "BARAJAS",
                            "terminal": "4",
                            "city": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "country": {
                                    "code": "ES",
                                    "description": "España"
                                }
                            }
                        },
                        "departureDateParsed": {
                            "dateTime": "21:35",
                            "weekDay": "WEEKDAY_SUNDAY",
                            "day": 29,
                            "monthNumber": 10,
                            "month": "MONTH_OCTOBER",
                            "year": 2023,
                            "originalDate": "2023-10-29T21:35:00+01:00",
                            "formatedDate": "29/10/2023"
                        },
                        "arrivalDateParsed": {
                            "dateTime": "22:45",
                            "weekDay": "WEEKDAY_SUNDAY",
                            "day": 29,
                            "monthNumber": 10,
                            "month": "MONTH_OCTOBER",
                            "year": 2023,
                            "originalDate": "2023-10-29T22:45:00+01:00",
                            "formatedDate": "29/10/2023"
                        },
                        "companyURL": "/aerolineas/logo_pos_IB.svg",
                        "overnight": false,
                        "departureDateTimeParsed": "21:35",
                        "arrivalDateTimeParsed": "22:45",
                        "departure": {
                            "code": "BIO",
                            "name": "AIRPORT",
                            "terminal": null,
                            "city": {
                                "code": "BIO",
                                "description": "Bilbao",
                                "countryCode": "ES",
                                "country": {
                                    "code": "ES",
                                    "description": "España"
                                }
                            }
                        },
                        "arrival": {
                            "code": "MAD",
                            "name": "BARAJAS",
                            "terminal": "4",
                            "city": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "country": {
                                    "code": "ES",
                                    "description": "España"
                                }
                            }
                        },
                        "flight": {
                            "marketingCarrier": {
                                "code": "IB",
                                "name": "Iberia"
                            },
                            "operationalCarrier": {
                                "code": "IB",
                                "name": "Iberia"
                            },
                            "marketingFlightNumber": "0425",
                            "operationalFlightNumber": "0425",
                            "operationalDisclosure": "IB",
                            "aircraft": {
                                "code": "319",
                                "description": "Airbus A319"
                            }
                        },
                        "durationParsed": "01h 10min.",
                        "fareFamilyConditions": [
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "EQMANO",
                                "name": "Equipaje de mano",
                                "title": "Equipaje de mano: 1 pieza",
                                "message": "Incluida 1 pieza hasta 10 kg (56x40x25cm) y 1 accesorio personal, en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo.",
                                "units": 1
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "EQBODEGA",
                                "name": "Equipaje en bodega",
                                "title": "Equipaje facturable no incluido",
                                "message": "Con coste.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "COMIDA",
                                "name": "Comida",
                                "title": "Comida no incluida",
                                "message": "Con coste.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "ASIENTO",
                                "name": "Selección de asiento",
                                "title": "Selección de asiento con coste",
                                "message": "Con coste.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "CAMBIO",
                                "name": "Cambios",
                                "title": "Cambio de vuelo con coste",
                                "message": "Permitido con penalización de 65 EUR. No permitido en caso de no presentarse al vuelo (no-show).",
                                "units": 65
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "REEMBOLSO",
                                "name": "Reembolso (por sentido)",
                                "title": "No permitido",
                                "message": "No permitido.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "ASIENTOXL",
                                "name": "Asiento espacio extra",
                                "title": "Asiento espacio extra con coste",
                                "message": "Con coste.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "EMBARQUE",
                                "name": "Prioridad de Embarque",
                                "title": "Embarque prioritario no incluido",
                                "message": "No incluido.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "AVIO",
                                "name": "AVIOS",
                                "title": "Obtén Avios con tu compra",
                                "message": "Incluido.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "SALAVIP",
                                "name": "Acceso a salas VIP",
                                "title": "Acceso a Sala Vip no incluido",
                                "message": "Acceso no incluido.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "CABINA",
                                "name": "Cabina",
                                "title": "Cabina Turista",
                                "message": "Turista.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "WIFI",
                                "name": "WiFi",
                                "title": "Wifi con coste",
                                "message": "Disponible con coste, según el tipo de avión.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "CHECKINDESK",
                                "name": "Mostrador check-in exclusivo",
                                "title": "Mostrador Check-in exclusivo no incluido",
                                "message": "No incluido.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "ASIENTODELANTERO",
                                "name": "Asiento delantero",
                                "title": "Asiento delantero con coste",
                                "message": "Con coste.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "ASIENTOPREFERENTE",
                                "name": "Asiento preferente",
                                "title": "Asiento preferente no aplica",
                                "message": "No aplica.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "FASTTRACK",
                                "name": "Fast Track",
                                "title": "Fast Track no incluido",
                                "message": "No incluido.",
                                "units": null
                            },
                            {
                                "cabin": "Básica",
                                "cabinType": "E",
                                "code": "EQPPRIOR",
                                "name": "Entrega prioritaria equipaje",
                                "title": "No incluye entrega rápida de equipaje",
                                "message": "Con coste.",
                                "units": null
                            }
                        ],
                        "segmentId": "IB042520231029",
                        "sliceId": "BIOMAD20231029213500",
                        "status": {
                            "code": "HK",
                            "description": "Confirmado"
                        },
                        "cabin": {
                            "rbd": "O",
                            "description": "",
                            "remainingSeats": 0,
                            "fareFamily": "TBAESEU",
                            "code": "R",
                            "type": "ECONOMY",
                            "bookingClass": "ECONOMY"
                        },
                        "flown": false,
                        "warnings": {},
                        "operatorLocator": null,
                        "stop": null,
                        "seats": [
                            {
                                "id": "ADULT_01",
                                "code": "15C",
                                "userName": "Adulto Dos",
                                "userSurname": "Test ",
                                "extraInfo": null,
                                "selected": true
                            },
                            {
                                "id": "ADULT_02",
                                "code": "21C",
                                "userName": "Adulto Tres",
                                "userSurname": "Test ",
                                "extraInfo": null,
                                "selected": true
                            },
                            {
                                "id": "ADULT_03",
                                "code": "6C",
                                "userName": "Adulto Uno",
                                "userSurname": "Test ",
                                "extraInfo": null,
                                "selected": true
                            }
                        ],
                        "sliceBaggage": {
                            "passBaggages": [
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Dos",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_01",
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "1",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Dos",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "cabin": {
                                        "units": 1,
                                        "title": " (56x40x25cm)"
                                    },
                                    "baggageData": [
                                        {
                                            "passengerId": "ADULT_01",
                                            "subtype": "BAGGAGE_15",
                                            "description": "15Kg",
                                            "purchasedPieces": 1
                                        }
                                    ],
                                    "extraHold": 1,
                                    "totalHold": 1
                                },
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Tres",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_02",
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "2",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Tres",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "cabin": {
                                        "units": 1,
                                        "title": " (56x40x25cm)"
                                    },
                                    "baggageData": [
                                        {
                                            "passengerId": "ADULT_02",
                                            "subtype": "BAGGAGE_23",
                                            "description": "23Kg",
                                            "purchasedPieces": 1
                                        }
                                    ],
                                    "extraHold": 1,
                                    "totalHold": 1
                                },
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Uno",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_03",
                                    "contactInfo": {
                                        "phone": "34625001001",
                                        "phoneDetails": {
                                            "number": "625001001",
                                            "countryCode": "34"
                                        },
                                        "email": "ntt.jpueyo@iberia.es",
                                        "phoneType": "MOBILE",
                                        "confirmationMailOption": null,
                                        "refundEmail": null,
                                        "language": "es",
                                        "countryCode": "34"
                                    },
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "3",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Uno",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "cabin": {
                                        "units": 1,
                                        "title": " (56x40x25cm)"
                                    },
                                    "baggageData": [
                                        {
                                            "passengerId": "ADULT_03",
                                            "subtype": "BAGGAGE_32",
                                            "description": "32Kg",
                                            "purchasedPieces": 1
                                        }
                                    ],
                                    "extraHold": 1,
                                    "totalHold": 1
                                }
                            ],
                            "cabin": {
                                "name": "Equipaje de mano",
                                "totalUnits": 1
                            },
                            "hold": {
                                "name": "Equipaje en bodega",
                                "totalUnits": 3,
                                "totalglobal": 3
                            }
                        },
                        "sliceSpeqs": {
                            "passBaggages": [
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Dos",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_01",
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "1",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Dos",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "hold": {
                                        "units": 6,
                                        "titleHold": "Equipaje especial"
                                    },
                                    "Speqs": [
                                        {
                                            "type": "specialEquipment",
                                            "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_14",
                                            "price": {
                                                "fare": 40,
                                                "tax": 0,
                                                "total": 40,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "sliceId": "BIOMAD20231029213500",
                                            "passengerId": "ADULT_01",
                                            "amount": 1,
                                            "emd": "0755578274897",
                                            "orderItemPaymentInfos": [],
                                            "subtype": "SPEQS_BICYCLE",
                                            "code": null
                                        }
                                    ]
                                },
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Tres",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_02",
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "2",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Tres",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "hold": {
                                        "units": 6,
                                        "titleHold": "Equipaje especial"
                                    },
                                    "Speqs": [
                                        {
                                            "type": "specialEquipment",
                                            "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_15",
                                            "price": {
                                                "fare": 35,
                                                "tax": 0,
                                                "total": 35,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "sliceId": "BIOMAD20231029213500",
                                            "passengerId": "ADULT_02",
                                            "amount": 1,
                                            "emd": "0755578274900",
                                            "orderItemPaymentInfos": [],
                                            "subtype": "SPEQS_GOLF_EQUIPMENT",
                                            "code": null
                                        }
                                    ]
                                },
                                {
                                    "passengerType": "ADULT",
                                    "personalInfo": {
                                        "name": "Adulto Uno",
                                        "surname": "Test ",
                                        "birthDate": null
                                    },
                                    "passengerId": "ADULT_03",
                                    "contactInfo": {
                                        "phone": "34625001001",
                                        "phoneDetails": {
                                            "number": "625001001",
                                            "countryCode": "34"
                                        },
                                        "email": "ntt.jpueyo@iberia.es",
                                        "phoneType": "MOBILE",
                                        "confirmationMailOption": null,
                                        "refundEmail": null,
                                        "language": "es",
                                        "countryCode": "34"
                                    },
                                    "relatedPassengerId": "",
                                    "ckiStatus": null,
                                    "optionalInformation": [],
                                    "residenceAccreditationStatus": null,
                                    "resiberPassengerId": "3",
                                    "securityInformation": {
                                        "relatedContent": null
                                    },
                                    "externalPersonalInfo": {
                                        "name": "Adulto Uno",
                                        "firstSurname": "Test",
                                        "lastSurname": ""
                                    },
                                    "hold": {
                                        "units": 6,
                                        "titleHold": "Equipaje especial"
                                    },
                                    "Speqs": [
                                        {
                                            "type": "specialEquipment",
                                            "orderItemId": "IBd2ca48d9bb264a2b9dc4b93069ff73ecOP_16",
                                            "price": {
                                                "fare": 35,
                                                "tax": 0,
                                                "total": 35,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "sliceId": "BIOMAD20231029213500",
                                            "passengerId": "ADULT_03",
                                            "amount": 1,
                                            "emd": "0755578274896",
                                            "orderItemPaymentInfos": [],
                                            "subtype": "SPEQS_SKI_SNOW",
                                            "code": null
                                        }
                                    ]
                                }
                            ],
                            "hold": {
                                "name": "Equipaje especial",
                                "totalUnits": 6,
                                "totalglobal": 6,
                                "speqs": []
                            }
                        }
                    }
                ],
                "departureDateParsed": {
                    "dateTime": "21:35",
                    "weekDay": "WEEKDAY_SUNDAY",
                    "day": 29,
                    "monthNumber": 10,
                    "month": "MONTH_OCTOBER",
                    "year": 2023,
                    "originalDate": "2023-10-29T21:35:00+01:00",
                    "formatedDate": "29/10/2023"
                },
                "arrivalDateParsed": {
                    "dateTime": "22:45",
                    "weekDay": "WEEKDAY_SUNDAY",
                    "day": 29,
                    "monthNumber": 10,
                    "month": "MONTH_OCTOBER",
                    "year": 2023,
                    "originalDate": "2023-10-29T22:45:00+01:00",
                    "formatedDate": "29/10/2023"
                },
                "durationParsed": "01h 10min.",
                "stopsNumber": 0,
                "daysToGo": null,
                "qualifierIBV": false
            }
        ]
    };

    var fakeSegmentsInfo = [
        {
            "id": "IB043820231023",
            "origin": {
                "description": "Madrid",
                "code": "MAD"
            },
            "destination": {
                "description": "Bilbao",
                "code": "BIO"
            }
        },
        {
            "id": "IB042520231029",
            "origin": {
                "description": "Bilbao",
                "code": "BIO"
            },
            "destination": {
                "description": "Madrid",
                "code": "MAD"
            }
        }
    ];

    var fakeMmBCurrencyService = {
        formatPrice: jasmine.createSpy(),
        getCurrencyObject: jasmine.createSpy()
    }

    const fakeInvoiceListService = {
        getInvoiceList: jasmine.createSpy('getInvoiceList').and.callFake(function () {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
         })
    }

    beforeEach(function () {
        angular.mock.module('ib-MmB-invoice-tab-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('$filter',$fakeFilter);
            $provide.value('$translate', faketranslate);
            $provide.value('MmBCurrencyService', fakeMmBCurrencyService);
            $provide.value('InvoiceListService', fakeInvoiceListService);
        });
        inject(function (_$componentController_, _$rootScope_, _localStorageService_, _$window_, _$translate_, _$q_) {
            $rootScope = _$rootScope_;
            $controller = _$componentController_;
            $window = _$window_;
            $q = _$q_;

            $scope = $rootScope.$new();
            controller = $controller('ibMmbInvoiceTab', { $scope: $scope, $translate: faketranslate });
            localStorageService = _localStorageService_;
            $rootScope.isMobile = {
                general: false,
                header: false
            }

            localStorageService.set('bookingInfo', fakeBookingInfo);
            localStorageService.set('invoiceList', fakeInvoiceList);
            localStorageService.set('ancillariesSlices', fakeAncillariesSlices);
            localStorageService.set('passengers', fakePassengers);
            localStorageService.set('commercialInfo', fakeCommercialInfo);
            localStorageService.set('listInvoices', fakeListInvoices);
            localStorageService.set('SpeqsInfo', fakeSpeqsInfo);
            localStorageService.get('segmentsInfo', fakeSegmentsInfo);

            $rootScope.appMarket = 'es';
            $rootScope.appLang = 'ES';
        });
    });

    describe('when activate() function is called', () => {
        it('should list getInvoiceData', (done) => {
            let listInvoices = localStorageService.get('listInvoices');
            controller.model = {};
            controller.$onInit();

            expect(listInvoices[13].stateRequested).toEqual('ISSUED');
            done();
        });

        it('case newRequestInvoices', (done) => {
            let listInvoices = localStorageService.get('listInvoices');
            localStorageService.set('newRequestInvoices', fakeNewRequestInvoices);
            controller.model = {};
            controller.$onInit();
            expect(listInvoices[17].stateRequested).toEqual('REQUESTED');
            done();
        });
        it('case newRequestInvoicesFailure', (done) => {
            let listInvoices = localStorageService.get('listInvoices');
            controller.model = {};
            localStorageService.set('newRequestInvoicesFailure', fakeNewRequestInvoicesFailure);
            controller.$onInit();

            expect(listInvoices[18].stateRequested).toEqual('NOT_AVAILABLE');
            done();
        });
    });

    describe('when moreInfo() function is called', () => {
        it('case es', (done) => {
            let language = $rootScope.appLang.toLowerCase();
            controller.moreInfo();

            expect(language).toEqual('es');
            done();
        });
        it('case ca', (done) => {
            $rootScope.appLang = 'ca';
            let language = $rootScope.appLang.toLowerCase();
            controller.moreInfo();

            expect(language).toEqual('ca');
            done();
        });
        it('case en', (done) => {
            $rootScope.appLang = 'en';
            let language = $rootScope.appLang.toLowerCase();
            controller.moreInfo();

            expect(language).toEqual('en');
            done();
        });
        it('case pt', (done) => {
            $rootScope.appLang = 'pt';
            let language = $rootScope.appLang.toLowerCase();
            controller.moreInfo();

            expect(language).toEqual('pt');
            done();
        });
        it('case fr', (done) => {
            $rootScope.appLang = 'fr';
            let language = $rootScope.appLang.toLowerCase();
            controller.moreInfo();

            expect(language).toEqual('fr');
            done();
        });
        it('case it', (done) => {
            $rootScope.appLang = 'it';
            let language = $rootScope.appLang.toLowerCase();
            controller.moreInfo();

            expect(language).toEqual('it');
            done();
        });
        it('case nl', (done) => {
            $rootScope.appLang = 'nl';
            let language = $rootScope.appLang.toLowerCase();
            controller.moreInfo();

            expect(language).toEqual('nl');
            done();
        });
        it('case de', (done) => {
            $rootScope.appLang = 'de';
            let language = $rootScope.appLang.toLowerCase();
            controller.moreInfo();

            expect(language).toEqual('de');
            done();
        });
        it('case default', (done) => {
            $rootScope.appLang = 'ja';
            let language = $rootScope.appLang.toLowerCase();
            controller.moreInfo();

            expect(language).toEqual('ja');
            done();
        });

    });

    describe('when informationIsMobile() function is called', () => {
        it('case isMobile and checkRequestInvoice && showInvoiceData is true', (done) => {
            $rootScope.isMobile.general = true;
            controller.checkRequestInvoice = true;
            controller.showInvoiceData = true;
            controller.informationIsMobile();

            expect(controller.visibleForm).toEqual(true);
            done();
        });

        it('case isMobile and checkRequestInvoice && showInvoiceData is false', (done) => {
            $rootScope.isMobile.general = true;
            controller.checkRequestInvoice = false;
            controller.showInvoiceData = false;
            controller.informationIsMobile();

            expect(controller.visibleForm).toEqual(false);
            done();
        });

        it('case not isMobile and checkRequestInvoice is true', (done) => {
            controller.checkRequestInvoice = true;
            controller.informationIsMobile();

            expect(controller.visibleForm).toEqual(true);
            done();
        });

        it('case not isMobile and checkRequestInvoice is false', (done) => {
            controller.checkRequestInvoice = false;
            controller.informationIsMobile();

            expect(controller.visibleForm).toEqual(false);
            done();
        });

        // it('resize', (done) => {
        //     const onEvent = $rootScope.$on('resize',(event, data) =>{
        //         // expect(data).toEqual(controller.linkId );
        //         done();
        //     });
        // });
    });
});
