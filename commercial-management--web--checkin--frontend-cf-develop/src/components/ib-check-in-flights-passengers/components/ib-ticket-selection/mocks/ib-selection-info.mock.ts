import dayjs from 'dayjs';

const mockSelectionInfo: CkiSegmentsSelected.Segment = {
    'generalType': 'REGULAR',
    'isSelected': false,
    'segmentStatus': 'NOT_AVAILABLE',
    'segmentStatusReason': 'No estás efectuando todos tus vuelos con Iberia. Podrás obtener las tarjetas de embarque de los vuelos de Iberia un día antes de la fecha de los mismos. O si lo deseas, factura en el aeropuerto el día de tu viaje.',
    'segmentStatusReasonCode': 'DEPARTURE_EARLY_NOT_ALLOWED',
    'passengersStatus': [
        {
            'id': 1,
            'status': 'UNCHECKABLE',
            'reasonCode': 'DEPARTURE_EARLY_NOT_ALLOWED',
            'isSelected': true,
            'name': 'FEDERICO',
            'surname': 'GARCIA',
            'airCheckDocumentationRequired': false,
            'items': [],
            'inhibitBoardingCard': {
                'reason': []
            },
            'flyNow': false
        },
        {
            'id': 2,
            'status': 'UNCHECKABLE',
            'reasonCode': 'DEPARTURE_EARLY_NOT_ALLOWED',
            'isSelected': true,
            'name': 'JUAN',
            'surname': 'LOPEZ',
            'airCheckDocumentationRequired': false,
            'items': [],
            'inhibitBoardingCard': {
                'reason': []
            },
            'flyNow': false
        }
    ],
    'airCheck': {
        'status': false,
        'url': 'https://int.iberia.com/es/gestion-de-reservas/#!/chktrp?pnr=87ZXW5&surname=garcia&quadrigam=MODDOC'
    },
    'checkInStatusTime': null,
    'id': 3,
    'departure': {
        'cityDescription': 'ES',
        'cityCode': 'ES',
        'airportDescription': 'Madrid',
        'airportCode': 'MAD',
        'terminal': '',
        'originalDate': '2026-09-09 21:00',
        'date': {
            'weekDay': 'WEEKDAY_WEDNESDAY',
            'monthDay': 9,
            'monthNumber': 9,
            'month': 'MONTH_SEPTEMBER',
            'year': 2026,
            'dateTime': ''
        },
        'hour': '21:00'
    },
    'arrival': {
        'cityDescription': 'GB',
        'cityCode': 'GB',
        'airportDescription': 'Londres-Heathrow',
        'airportCode': 'LHR',
        'terminal': '',
        'originalDate': '2026-09-09 22:15',
        'date': {
            'weekDay': 'WEEKDAY_WEDNESDAY',
            'monthDay': 9,
            'monthNumber': 9,
            'month': 'MONTH_SEPTEMBER',
            'year': 2026,
            'dateTime': ''
        },
        'hour': '22:15'
    },
    'cabinClass': {
        'code': 'Y',
        'type': null,
        'description': null,
        'fareFamily': null,
        'mainClass': null
    },
    'type': 'FLIGHT',
    'flown': false,
    'airlineName': 'BRITISH AIRWAYS',
    'airlineLogo': '/iberia-web-content/iconos/aerolineas/logo_pos_BA.svg',
    'flightCode': 'BA',
    'flightNumber': 'IB3650',
    'operatedBy': 'BRITISH AIRWAYS',
    'deepLinkInformation': null
};

export const getMockSelectionInfo = (overrides?: Partial<CkiSegmentsSelected.Segment>) => ({
    ...mockSelectionInfo,
    ...overrides
});

export const createDeepLinkInformation = () => {
    return {
        externalCompany: {
            code: 'AA',
            description: 'American Airlines'
        }
    };
};

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

export const createCheckInStatusTime = (openDate: dayjs.Dayjs, window: string) => {
    return {
        window: window || 'OPEN',
        openDateTime: openDate.format(DATE_FORMAT)
    };
};