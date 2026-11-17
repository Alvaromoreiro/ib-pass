import { IAcceptData } from '@src/app/core/models/storage/cki-accept-info-model';

export const getAcceptedSegmentsMock = (): IAcceptData => {
    return {
        'locator': null,
        'acceptedSegments': [
            {
                'id': 4,
                'passengers': [
                    {
                        'id': 1,
                        'status': 'CHECKED',
                        'seat': {
                            'row': '29',
                            'column': 'D'
                        },
                        'purchaseSeatRequired': false,
                        'messageStatus': null,
                        'extraSeat': null
                    }
                ],
                'cabinClass': {
                    'code': 'H',
                    'type': 'ECONOMY',
                    'description': 'Turista'
                },
                'checkInStatusTime': null
            },
            {
                'id': 5,
                'passengers': [
                    {
                        'id': 1,
                        'status': 'CHECKED',
                        'seat': {
                            'row': '29',
                            'column': 'F'
                        },
                        'purchaseSeatRequired': false,
                        'messageStatus': null,
                        'extraSeat': null
                    }
                ],
                'cabinClass': {
                    'code': 'H',
                    'type': 'ECONOMY',
                    'description': 'Turista'
                },
                'checkInStatusTime': null
            }
        ],
        'upgrading': null,
        'noShowPassengers': []
    };
};
