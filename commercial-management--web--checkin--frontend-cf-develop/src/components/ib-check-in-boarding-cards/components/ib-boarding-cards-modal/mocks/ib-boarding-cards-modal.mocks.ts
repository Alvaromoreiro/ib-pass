export const mockDocumentsSegments: CkiBoardingCardModal.ModalSegmentInfo[] = [
    {
        'id': '3',
        'formats': [
            'PASSBOOK',
            'PDF',
            'GOOGLE_WALLET',
            'QR',
            'NATIVE'
        ],
        'departure': {
            'date': '2026-07-17 12:45',
            'terminal': '4',
            'airport': {
                'code': 'MAD',
                'description': 'Madrid',
                'country': 'ES'
            }
        },
        'arrival': {
            'date': '2026-07-17 16:55',
            'terminal': null,
            'airport': {
                'code': 'BIO',
                'description': 'Bilbao',
                'country': 'ES'
            }
        },
        'operatingFlightNumber': {
            'company': {
                'code': 'IB',
                'description': 'IBERIA AEROLINEAS'
            },
            'number': '0435'
        },
        'marketingFlightNumber': null,
        'passengers': [
            {
                'id': '1',
                'type': 'ADULT',
                'name': 'FEDERICO',
                'surname': 'GARCIA',
                'biometricBoardingStatus': 'NOT_AVAILABLE',
                'email': 'TEST@TEST.COM',
                'phone': '123456789'
            },
            {
                'id': '2',
                'type': 'ADULT',
                'name': 'JUAN',
                'surname': 'LOPEZ',
                'biometricBoardingStatus': 'NOT_AVAILABLE',
                'email': 'TEST@TEST.COM',
                'phone': '123456789'
            }
        ]
    },
    {
        'id': '4',
        'formats': [
            'PASSBOOK',
            'PDF',
            'GOOGLE_WALLET',
            'QR',
            'NATIVE'
        ],
        'departure': {
            'date': '2026-07-21 17:35',
            'terminal': null,
            'airport': {
                'code': 'BIO',
                'description': 'Bilbao',
                'country': 'ES'
            }
        },
        'arrival': {
            'date': '2026-07-21 18:45',
            'terminal': '4',
            'airport': {
                'code': 'MAD',
                'description': 'Madrid',
                'country': 'ES'
            }
        },
        'operatingFlightNumber': {
            'company': {
                'code': 'IB',
                'description': 'IBERIA AEROLINEAS'
            },
            'number': '0436'
        },
        'marketingFlightNumber': null,
        'passengers': [
            {
                'id': '1',
                'type': 'ADULT',
                'name': 'FEDERICO',
                'surname': 'GARCIA',
                'biometricBoardingStatus': 'NOT_AVAILABLE'
            },
            {
                'id': '2',
                'type': 'ADULT',
                'name': 'JUAN',
                'surname': 'LOPEZ',
                'biometricBoardingStatus': 'NOT_AVAILABLE'
            }
        ]
    }
];

export const mockBoardingCardsModelMap: CkiBoardingCardModal.BoardingCardsModalMap[] = [
    {
        'id': '3',
        'arrival': {
            'airport': {
                'code': 'BIO',
                'description': 'Bilbao',
                'country': 'ES'
            }
        },
        'departure': {
            'airport': {
                'code': 'MAD',
                'description': 'Madrid',
                'country': 'ES'
            },
            'date': '2026-07-17 12:45'
        },
        'passengers': [
            {
                'id': '1',
                'name': 'FEDERICO',
                'surname': 'GARCIA',
                'gender': 'MALE'
            },
            {
                'id': '2',
                'name': 'JUAN',
                'surname': 'LOPEZ',
                'gender': 'MALE'
            }
        ]
    },
    {
        'id': '4',
        'arrival': {
            'airport': {
                'code': 'MAD',
                'description': 'Madrid',
                'country': 'ES'
            }
        },
        'departure': {
            'airport': {
                'code': 'BIO',
                'description': 'Bilbao',
                'country': 'ES'
            },
            'date': '2026-07-21 17:35'
        },
        'passengers': [
            {
                'id': '1',
                'name': 'FEDERICO',
                'surname': 'GARCIA',
                'gender': 'MALE'
            },
            {
                'id': '2',
                'name': 'JUAN',
                'surname': 'LOPEZ',
                'gender': 'MALE'
            }
        ]
    }
];