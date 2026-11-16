export const modelMock = {
    "modelRibbon" : {},
    "selectedSlide" : [
        {
            "date" : {
                "serviceDate" : "2019-06-12"
            }
        },
        {
            "date" : {
                "serviceDate" : "2019-07-12"
            }
        }
    ],
    "originDestinations" : [
        {
            "originCity": {
                "description": "test1"
            },
            "destinationCity" : {
                "description": "test2"
            }
        },{
            "originCity": {
                "description": "test3"
            },
            "destinationCity" : {
                "description": "test4"
            }
    }],
    "selectedSlice": [
        {
            "date": {
                "serviceDate": "2019-09-04",
                "slidePosition": 5,
                "date": {
                    "dateTime": "",
                    "weekDay": "WEEKDAY_WEDNESDAY",
                    "day": 4,
                    "monthNumber": 9,
                    "month": "MONTH_SEPTEMBER",
                    "year": 2019,
                    "originalDate": "2019-09-04T00:00:00+02:00",
                    "formatedDate": "04/09/2019"
                },
                "state": "AVAILABLE"
            },
            "index": "OD1"
        }
    ],
    "responseId": "test",
    "relatedContent": [{
        "key": "NEGATIVE_PRICE_NOT_SHOW"
    }],
    "penalty": {
        "oubound": true,
        "return": false
    }
}

export const originDestinationsMock1 = [
    {
        originCity: {
            description: 'test1'
        },
        destinationCity : {
            description: 'test2'
        },
        loadingAvailability: false
    },
    {
        originCity: {
            description: 'test1'
        },
        destinationCity : {
            description: 'test2'
        },
        loadingAvailability: false
    }
];

export const originDestinationsMock2 = [
    {
        originCity: {
            description: 'test1'
        },
        destinationCity : {
            description: 'test2'
        }
    },{
        originCity: {
            description: 'test3'
        },
        destinationCity : {
            description: 'test4'
        }
}];

export const selectedSliceMock1 = [
    {
        'date': {
            'serviceDate': '2019-09-04',
            'slidePosition': 5,
            'date': {
                'dateTime': '',
                'weekDay': 'WEEKDAY_WEDNESDAY',
                'day': 4,
                'monthNumber': 9,
                'month': 'MONTH_SEPTEMBER',
                'year': 2019,
                'originalDate': '2019-09-04T00:00:00+02:00',
                'formatedDate': '04/09/2019'
            },
            'state': 'AVAILABLE'
        },
        'index': 'OD1'
    },
    {
        'date': {
            'serviceDate': '2019-09-04',
            'slidePosition': 5,
            'date': {
                'dateTime': '',
                'weekDay': 'WEEKDAY_WEDNESDAY',
                'day': 4,
                'monthNumber': 9,
                'month': 'MONTH_SEPTEMBER',
                'year': 2019,
                'originalDate': '2019-09-04T00:00:00+02:00',
                'formatedDate': '04/09/2019'
            },
            'state': 'AVAILABLE'
        },
        'index': 'OD1'
    },
];

export const selectedSliceMock2 = [
    {
        'date': {
            'serviceDate': '2019-09-04',
            'slidePosition': 5,
            'date': {
                'dateTime': '',
                'weekDay': 'WEEKDAY_WEDNESDAY',
                'day': 4,
                'monthNumber': 9,
                'month': 'MONTH_SEPTEMBER',
                'year': 2019,
                'originalDate': '2019-09-04T00:00:00+02:00',
                'formatedDate': '04/09/2019'
            },
            'state': 'AVAILABLE'
        },
        'index': 'OD1'
    }
];

export const selectedSliceMock3 = [
    {
        'date': {
            'serviceDate': '2019-09-04',
            'slidePosition': 5,
            'date': {
                'dateTime': '',
                'weekDay': 'WEEKDAY_WEDNESDAY',
                'day': 4,
                'monthNumber': 9,
                'month': 'MONTH_SEPTEMBER',
                'year': 2019,
                'originalDate': '2019-09-04T00:00:00+02:00',
                'formatedDate': '04/09/2019'
            },
            'state': 'AVAILABLE'
        },
        'index': 'OD1'
    },
    {
        'date': {
            'serviceDate': '2019-09-04',
            'slidePosition': 5,
            'date': {
                'dateTime': '',
                'weekDay': 'WEEKDAY_WEDNESDAY',
                'day': 4,
                'monthNumber': 9,
                'month': 'MONTH_SEPTEMBER',
                'year': 2019,
                'originalDate': '2019-09-04T00:00:00+02:00',
                'formatedDate': '04/09/2019'
            },
            'state': 'AVAILABLE'
        },
        'index': 'OD1'
    },
];

export const selectedSliceMock4 = [
    {
        'date': {
            'serviceDate': '2019-09-04',
            'slidePosition': 5,
            'date': {
                'dateTime': '',
                'weekDay': 'WEEKDAY_WEDNESDAY',
                'day': 4,
                'monthNumber': 9,
                'month': 'MONTH_SEPTEMBER',
                'year': 2019,
                'originalDate': '2019-09-04T00:00:00+02:00',
                'formatedDate': '04/09/2019'
            },
            'state': 'AVAILABLE'
        },
        'index': 'OD1'
    },
    {
        'date': {
            'serviceDate': '2019-09-04',
            'slidePosition': 5,
            'date': {
                'dateTime': '',
                'weekDay': 'WEEKDAY_WEDNESDAY',
                'day': 4,
                'monthNumber': 9,
                'month': 'MONTH_SEPTEMBER',
                'year': 2019,
                'originalDate': '2019-09-04T00:00:00+02:00',
                'formatedDate': '04/09/2019'
            },
            'state': 'AVAILABLE'
        },
        'index': 'OD1'
    },
];

export const flightsOutwardMock0 = {
    cabins: [
        {
            fareFamilies: [
                {
                    offers:[
                        {
                            price: {
                                total: 1
                            }

                        }
                    ]
                }
            ]
        }
    ]
};

export const flightsOutwardMock1 = [
    {
        cabins: [
            {
                fareFamilies : [
                    {
                        priceShown : '1�',
                        offers : [
                            {
                                price: {
                                    total: 1
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

export const flightsOutwardMock2 = [
    {
        cabins: [
            {fareFamilies : [{
                priceShown : '1�',
                offers : [{
                    price : {
                        total : 1
                    }
                }]
            }
            ]}
        ]
    }
];

export const flightsOutwardMock3 = [
    {cabins: [
        {fareFamilies : [{
            priceShown : '1�',
            offers : [{
                offerId : '1',
                offerItems : [{offerItemId: '1'}],
                price : {
                    total : 1
                },
                originDestinations :   [
                    {originDestinationId : 'OD1', applicableSlices : [{sliceId: 1}]},
                    {originDestinationId : 'OD2', applicableSlices : [{sliceId: 1}]}
                ]
            }]
        }
        ]}
    ],
    slideId : '1'}
];

export const flightsReturnsMock0 = {
    cabins: [
        {
            fareFamilies: [
                {
                    offers:[
                        {
                            price: {
                                total: 1
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

export const flightsReturnsMock1 = [
    {cabins: [
        {fareFamilies : [{
            priceShown : '1�',
            offers : [{
                offerId : '1',
                offerItems : [{offerItemId: '1'}],
                price : {
                    total : 1
                },
                originDestinations :   [
                    {originDestinationId : 'OD1', applicableSlices : [{sliceId: 1}]},
                    {originDestinationId : 'OD2', applicableSlices : [{sliceId: 1}]}
                ]
            }]
        }
        ]}
    ],
    slideId : '1'}
];

export const flightsReturnsMock2 = [
    {cabins: [
        {fareFamilies : [{
            priceShown : '1�',
            offers : [
                {
                    price: {
                        total: 1
                    }
                }
            ]
        }
        ]}
    ]}
];

export const sisterInfoMock1 = [
    {
        origin: 'test',
        destination: 'test'
    },
    {
        origin: 'test',
        destination: 'test'
    }
];

export const outboundFlightSelectedInfoMock1 = {
    cabins: [
        {fareFamilies : [{
            priceShown : '1�',
            offers : [{
                price : {
                    total : 1
                }
            }]
        }
        ]}
    ]
};