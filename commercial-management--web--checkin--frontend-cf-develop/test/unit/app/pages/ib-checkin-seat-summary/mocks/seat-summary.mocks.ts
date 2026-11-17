import { IAcceptData } from "@src/app/core/models/storage/cki-accept-info-model";
import { ancillariesInfo } from "ib-web-ancillaries/app/core/models/ancillaries-info";

export const mockSegmentInfo: CkiSeatSummary.ISegment = {
    'id': 2,
    'arrival': {
        'airport': {
            'code': 'BIO',
            'description': 'Bilbao',
            'country': 'ES'
        },
        'date': '2026-03-18',
        'hour': '23:15',
        'terminal': null
    },
    'departure': {
        'airport': {
            'code': 'MAD',
            'description': 'Madrid',
            'country': 'ES'
        },
        'date': '2026-03-18',
        'hour': '22:10',
        'terminal': '4'
    },
    'operatingFlightNumber': {
        'company': {
            'code': 'IB',
            'description': 'IBERIA AEROLINEAS'
        },
        'number': '0441',
        'brand': {
            'companyURL': '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
            'companyDisabledURL': '/iberia-web-content/iconos/aerolineas/logo_desact_IB.svg'
        }
    },
    'cabinClass': {
        'description': 'Turista'
    },
    'changeSeatAvailable': true,
    'passengers': [
        {
            'id': 1,
            'gender': 'MALE',
            'name': 'FEDERICO',
            'surname': 'GARCIA',
            'type': 'ADULT',
            'seat': {
                'row': '23',
                'column': 'C'
            }
        }
    ]
};

export const mockPassengerInfo: CkiSeatSummary.IPassenger = {
    'id': 1,
    'gender': 'MALE',
    'name': 'FEDERICO',
    'surname': 'GARCIA',
    'type': 'ADULT',
    'seat': {
        'row': '23',
        'column': 'C'
    }
};

export const createAcceptResponse = (): IAcceptData => ({
    "locator": null,
    "acceptedSegments": [
        {
            "id": 3,
            "passengers": [
                {
                    "id": 1,
                    "status": "CHECKED",
                    "seat": {
                        "row": "36",
                        "column": "F"
                    },
                    "extraSeat": null,
                    "purchaseSeatRequired": false,
                    "messageStatus": null
                },
                {
                    "id": 2,
                    "status": "CHECKED",
                    "seat": {
                        "row": "36",
                        "column": "E"
                    },
                    "extraSeat": null,
                    "purchaseSeatRequired": false,
                    "messageStatus": null
                }
            ],
            "cabinClass": {
                "code": "Y",
                "type": "ECONOMY",
                "description": "Economy"
            },
            "checkInStatusTime": null
        }
    ],
    "upgrading": null,
    "noShowPassengers": []
});

export const createSegmentsInformationMock = (): CkiSeatSummary.ISegment[] => ([
    {
        "id": 3,
        "arrival": {
            "airport": {
                "code": "BIO",
                "description": "AIRPORT",
                "country": "ES"
            },
            "date": "2023-06-09",
            "hour": "12:50",
            "terminal": null
        },
        "departure": {
            "airport": {
                "code": "MAD",
                "description": "BARAJAS",
                "country": "ES"
            },
            "date": "2023-06-09",
            "hour": "11:45",
            "terminal": "4"
        },
        "operatingFlightNumber": {
            "company": {
                "code": "IB",
                "description": "IBERIA AEROLINEAS"
            },
            "number": "0426",
            "brand": {
                "companyDisabledURL": "disabled",
                "companyURL": "url"
            }
        },
        "cabinClass": {
            "description": "Turista"
        },
        "changeSeatAvailable": false,
        "passengers": [
            {
                "id": 1,
                "gender": "MALE",
                "name": "john",
                "surname": "smith",
                "type": "ADULT",
                "seat": {
                    "row": "36",
                    "column": "F"
                }
            },
            {
                "id": 2,
                "gender": "FEMALE",
                "name": "elisa",
                "surname": "smith",
                "type": "ADULT",
                "seat": {
                    "row": "36",
                    "column": "E"
                }
            }
        ]
    }
]);

export const createAncillariesInfo = (seatAvailable: boolean = false, existSeat: boolean = true): ancillariesInfo => ({
    currencies: null,
    slices: null,
    ancillaries: [
        existSeat && {
            "status": {
                "code": seatAvailable ? "AVAILABLE" : "NOT_AVAILABLE",
                "reason": null
            },
            "currency": "EUR",
            "segments": [
                {
                    "id": "IB044120260319",
                    "passengers": [
                        {
                            "id": "ADULT_01",
                            "priceFrom": 0
                        }
                    ],
                    "pricesProvider": "DYNAMIC",
                    "status": {
                        "code": "AVAILABLE",
                        "reason": null
                    }
                },
                {
                    "id": "IB043420260320",
                    "passengers": [
                        {
                            "id": "ADULT_01",
                            "priceFrom": 0
                        }
                    ],
                    "pricesProvider": "DYNAMIC",
                    "status": {
                        "code": "AVAILABLE",
                        "reason": null
                    }
                }
            ],
            "reasonForIssuance": {
                "code": "A",
                "subcode": "0B5"
            },
            "onHold": {
                "enabled": false,
                "utcTimeLimit": null
            },
            "type": "SEAT"
        }
    ]
} as ancillariesInfo);