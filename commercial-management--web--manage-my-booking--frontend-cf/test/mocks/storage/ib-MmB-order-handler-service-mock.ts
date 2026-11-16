export const orderHandlerMock = {
    "order": {
        "clientLocator": "PF7EP",
        "status": "ISSUED",
        "flexibleDisruptedStatus": "NONE",
        "type": "REGULAR",
        "channel": "IBCOM",
        "bookingReferences": [
            {
                "provider": "IB",
                "reference": "PF7EP"
            }
        ],
        "slices": [
            {
                "sliceId": "BCNMAD20250817070000",
                "type": "REGULAR",
                "departureDateTime": "2025-08-17 07:00",
                "arrivalDateTime": "2025-08-17 08:25",
                "duration": 85,
                "stopsNumber": 0,
                "segments": [
                    {
                        "type": "CONFIRMED",
                        "ckiStatus": {
                            "code": "CHECKABLE"
                        },
                        "flown": false,
                        "departure": {
                            "code": "BCN",
                            "name": "BARCELONA",
                            "terminal": "",
                            "gate": "",
                            "baggageClaim": "",
                            "city": {
                                "code": "BCN",
                                "description": "Barcelona",
                                "country": {
                                    "code": "ES",
                                    "description": "ESPAÑA"
                                },
                                "timeZone": "Europe/Madrid"
                            },
                            "dateTime": "2025-08-17 07:00",
                            "utcDateTime": "2025-08-17T05:00:00.000"
                        },
                        "arrival": {
                            "code": "MAD",
                            "name": "BARAJAS",
                            "terminal": "",
                            "gate": "",
                            "baggageClaim": "",
                            "city": {
                                "code": "MAD",
                                "description": "Madrid",
                                "country": {
                                    "code": "ES",
                                    "description": "ESPAÑA"
                                },
                                "timeZone": "Europe/Madrid"
                            },
                            "dateTime": "2025-08-17 08:25",
                            "utcDateTime": "2025-08-17T06:25:00.000"
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
                            "marketingFlightNumber": "0426",
                            "operationalFlightNumber": "0426",
                            "operationalDisclosure": "IB",
                            "aircraft": {
                                "code": "320"
                            }
                        },
                        "overnight": false,
                        "segmentId": "IB042620250817",
                        "duration": 85,
                        "waitingTime": 0,
                        "status": {
                            "code": "HK",
                            "description": "Confirmado"
                        }
                    }
                ]
            }
            ,{
                "sliceId": "MADBCN20250621074500",
                "type": "REGULAR",
                "departureDateTime": "2025-06-21 07:45",
                "arrivalDateTime": "2025-06-21 09:00",
                "duration": 75,
                "stopsNumber": 0,
                "segments": [
                    {
                        "type": "CONFIRMED",
                        "ckiStatus": {
                            "code": "CHECKED"
                        },
                        "flown": true,
                        "departure": {
                            "code": "MAD",
                            "name": "BARAJAS",
                            "terminal": "",
                            "gate": "",
                            "baggageClaim": "",
                            "city": {
                                "code": "MAD",
                                "description": "Madrid",
                                "country": {
                                    "code": "ES",
                                    "description": "ESPAÑA"
                                },
                                "timeZone": "Europe/Madrid"
                            },
                            "dateTime": "2025-06-21 07:45",
                            "utcDateTime": "2025-06-21T05:45:00.000"
                        },
                        "arrival": {
                            "code": "BCN",
                            "name": "BARCELONA",
                            "terminal": "",
                            "gate": "",
                            "baggageClaim": "",
                            "city": {
                                "code": "BCN",
                                "description": "Barcelona",
                                "country": {
                                    "code": "ES",
                                    "description": "ESPAÑA"
                                },
                                "timeZone": "Europe/Madrid"
                            },
                            "dateTime": "2025-06-21 09:00",
                            "utcDateTime": "2025-06-21T07:00:00.000"
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
                            "marketingFlightNumber": "0405",
                            "operationalFlightNumber": "0405",
                            "operationalDisclosure": "IB",
                            "aircraft": {
                                "code": "32A"
                            }
                        },
                        "overnight": false,
                        "segmentId": "IB040520250621",
                        "duration": 75,
                        "waitingTime": 0,
                        "status": {
                            "code": "HK",
                            "description": "Confirmado"
                        }
                    }
                ]
            },
            {
                "sliceId": "BCNMAD20250817070000",
                "type": "REGULAR",
                "departureDateTime": "2025-08-17 07:00",
                "arrivalDateTime": "2025-08-17 08:25",
                "duration": 85,
                "stopsNumber": 0,
                "segments": [
                    {
                        "type": "CONFIRMED",
                        "ckiStatus": {
                            "code": "CHECKABLE"
                        },
                        "flown": false,
                        "departure": {
                            "code": "BCN",
                            "name": "BARCELONA",
                            "terminal": "",
                            "gate": "",
                            "baggageClaim": "",
                            "city": {
                                "code": "BCN",
                                "description": "Barcelona",
                                "country": {
                                    "code": "ES",
                                    "description": "ESPAÑA"
                                },
                                "timeZone": "Europe/Madrid"
                            },
                            "dateTime": "2025-08-17 07:00",
                            "utcDateTime": "2025-08-17T05:00:00.000"
                        },
                        "arrival": {
                            "code": "MAD",
                            "name": "BARAJAS",
                            "terminal": "",
                            "gate": "",
                            "baggageClaim": "",
                            "city": {
                                "code": "MAD",
                                "description": "Madrid",
                                "country": {
                                    "code": "ES",
                                    "description": "ESPAÑA"
                                },
                                "timeZone": "Europe/Madrid"
                            },
                            "dateTime": "2025-08-17 08:25",
                            "utcDateTime": "2025-08-17T06:25:00.000"
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
                            "marketingFlightNumber": "0426",
                            "operationalFlightNumber": "0426",
                            "operationalDisclosure": "IB",
                            "aircraft": {
                                "code": "320"
                            }
                        },
                        "overnight": false,
                        "segmentId": "IB042620250817",
                        "duration": 85,
                        "waitingTime": 0,
                        "status": {
                            "code": "HK",
                            "description": "Confirmado"
                        }
                    }
                ]
            }
        ]
    },
    "passengers": [
        {
            "passengerId": "ADULT_01",
            "passengerType": "ADULT",
            "personalInfo": {
                "name": "TESTNAME",
                "surname": "TEST"
            }
        }
    ]
}