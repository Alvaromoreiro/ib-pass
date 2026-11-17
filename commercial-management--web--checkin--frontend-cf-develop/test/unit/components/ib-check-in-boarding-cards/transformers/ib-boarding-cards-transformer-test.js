describe('BoardingCardsTransformer test', function () {
    var BoardingCardsTransformer, localStorageService;

    var mockBoardingInfo = {
        documents: [
            {
                type: 'BOARDING_CARD',
                segments: [
                    {
                        id: '1',
                        formats: ['QR', 'PASSBOOK', 'PDF', 'NATIVE'],
                        departure: {
                            terminal: null,
                            date: '2016-02-26 11:35',
                            airport: {
                                code: 'PMI',
                                description: 'PALMA DE MALLORCA',
                                country: 'ES',
                            },
                        },
                        arrival: {
                            terminal: null,
                            date: '2016-02-26 15:05',
                            airport: {
                                code: 'MAD',
                                description: 'MADRID',
                                country: 'ES',
                            },
                        },
                        operatingFlightNumber: {
                            company: {
                                code: 'IB',
                                description: 'IBERIA AEROLINEAS',
                            },
                            number: '0440',
                        },
                        marketingFlightNumber: null,
                        passengers: [
                            {
                                id: '1',
                                type: 'ADULT',
                                name: 'PATO',
                                surname: 'DONALD',
                            },
                            {
                                id: '2',
                                type: 'ADULT',
                                name: 'MORENO',
                                surname: 'DONALD',
                            },
                            {
                                id: '1_1',
                                type: 'INFANT',
                                name: 'PATITO',
                                surname: 'DONALD',
                            },
                        ],
                    },
                ],
                contactDataRequired: true,
            },
            {
                type: 'HOME_PRINTED_BAG_TAG',
            },
        ],
        channels: ['DOWNLOAD', 'SMS', 'EMAIL'],
    };

    var mockPassengersContactData = [];

    var mockPrefixList = [
        {
            code: '34',
            description: 'Espana / +34',
        },
        {
            code: '93',
            description: 'Afganistán / +93',
        },
        {
            code: '355',
            description: 'Albania / +355',
        },
    ];

    var fakeFormatsList = [
        { type: 'PDF', class: 'icon-documento_pdf', description: 'IBECBP_PDF', isSelected: true, priority: 0 },
        { type: 'QR', class: 'icon-codigo_qr', description: 'IBECBP_QR', isSelected: false, priority: 1 },
        { type: 'PASSBOOK', class: 'icon-tarjeta_de_embarque_movil', description: 'IBECBP_PASS', isSelected: false, priority: 2 },
    ];

    var fakeChannelsList = [
        { type: 'EMAIL', class: 'icon-mensajes', description: 'IBECBP_EMAIL', isSelected: false, priority: 0 },
        { type: 'SMS', class: 'icon-posicion_correcta', description: 'IBECBP_SMS', isSelected: false, priority: 1 },
        { type: 'DOWNLOAD', class: 'icon-descargar', description: 'IBECBP_DESCARGAR', isSelected: true, priority: 2 },
    ];

    var fakePassengersList = [
        {
            id: '1',
            type: 'ADULT',
            name: 'PATO',
            surname: 'DONALD',
            phone: {
                countryCode: '34',
            },
            infant: {
                id: '1_1',
                type: 'INFANT',
                name: 'PATITO',
                surname: 'DONALD',
            },
        },
        {
            id: '2',
            type: 'ADULT',
            name: 'MORENO',
            surname: 'DONALD',
            phone: {
                countryCode: '34',
            },
        },
    ];

    var fakeSegmentsList = ['1'];

    var mockBoardingModel = {
        formatsList: [
            {
                type: 'PDF',
                class: 'icon-documento_pdf',
                description: 'IBECBP_PDF',
                isSelected: true,
                priority: 0,
            },
            {
                type: 'QR',
                class: 'icon-codigo_qr',
                description: 'IBECBP_QR',
                isSelected: false,
                priority: 1,
            },
            {
                type: 'PASSBOOK',
                class: 'icon-tarjeta_de_embarque_movil',
                description: 'IBECBP_PASS',
                isSelected: false,
                priority: 2,
            },
        ],
        channelsList: [
            {
                type: 'EMAIL',
                class: 'icon-mensajes',
                description: 'IBECBP_EMAIL',
                isSelected: true,
                priority: 0,
            },
            {
                type: 'SMS',
                class: 'icon-posicion_correcta',
                description: 'IBECBP_SMS',
                isSelected: false,
                priority: 1,
            },
            {
                type: 'DOWNLOAD',
                class: 'icon-descargar',
                description: 'IBECBP_DESCARGAR',
                isSelected: false,
                priority: 2,
            },
        ],
        passengersList: [
            {
                id: '1',
                type: 'ADULT',
                name: 'PATO',
                surname: 'DONALD',
                phone: {
                    countryCode: {
                        code: '34',
                        description: 'Espana / +34',
                    },
                },
                infant: {
                    id: '1_1',
                    type: 'INFANT',
                    name: 'PATITO',
                    surname: 'DONALD',
                },
                email: 'ma@ma.com',
            },
            {
                id: '2',
                type: 'ADULT',
                name: 'MORENO',
                surname: 'DONALD',
                phone: {
                    countryCode: {
                        code: '34',
                        description: 'Espana / +34',
                    },
                },
            },
        ],
        segmentsList: ['1'],
        indexPassengerSelected: 0,
        showEmail: true,
        showPhone: false,
        selectedTab: 0,
    };

    var transformedCreateAskForBoardingCardsRequest = [
        {
            format: 'PDF',
            sharings: [
                {
                    channel: 'EMAIL',
                    segments: [
                        {
                            id: '1',
                            passengers: ['1', '1_1', '2'],
                        },
                    ],
                    email: 'ma@ma.com',
                },
            ],
        },
        {
            format: 'NATIVE',
            sharings: [
                {
                    channel: 'EMAIL',
                    segments: [
                        {
                            id: '1',
                            passengers: ['1', '1_1', '2'],
                        },
                    ],
                    email: 'ma@ma.com',
                },
            ],
        },
    ];

    var FakeAskForBoarding = {
        prefixList: [
            {
                code: '716',
                description: 'Zimbabue / +716',
                countryCode: 'ZW',
            },
        ],
        formatsList: [
            {
                type: 'PDF',
                class: 'icon-documento_pdf',
                description: 'IBECBP_PDF',
                isSelected: true,
                priority: 0,
            },
            {
                type: 'QR',
                class: 'icon-codigo_qr',
                description: 'IBECBP_QR',
                isSelected: false,
                priority: 1,
            },
            {
                type: 'PASSBOOK',
                class: 'icon-tarjeta_de_embarque_movil',
                description: 'IBECBP_PASS',
                isSelected: false,
                priority: 2,
            },
        ],
        channelsList: [
            {
                type: 'EMAIL',
                class: 'icon-mensajes',
                description: 'IBECBP_EMAIL',
                isSelected: false,
                priority: 0,
            },
            {
                type: 'DOWNLOAD',
                class: 'icon-descargar',
                description: 'IBECBP_DESCARGAR',
                isSelected: true,
                priority: 2,
            },
        ],
        passengersList: [
            {
                id: '1',
                type: 'ADULT',
                name: 'ASDASD',
                surname: 'ASD',
                biometricBoardingStatus: 'NOT_AVAILABLE',
                email: 'QWE@QWSDA.ASD',
                phone: '1231231232',
            },
            {
                id: '2',
                type: 'ADULT',
                name: 'DESARROLLO',
                surname: 'TEST',
                biometricBoardingStatus: 'NOT_AVAILABLE',
                email: 'QWE@QWSDA.ASD',
                phone: '1231231232',
            },
        ],
        segmentsList: ['3'],
        indexPassengerSelected: 0,
        showEmail: false,
        showPhone: false,
        showBiometric: false,
        selectedTab: 1,
        passengersStatusBySegment: [
            {
                segment: '3',
                status: 'NOT_AVAILABLE',
                id: '1',
                type: 'ADULT',
            },
            {
                segment: '3',
                status: 'NOT_AVAILABLE',
                id: '2',
                type: 'ADULT',
            },
        ],
        downloadFormatSelected: [
            {
                type: 'PDF',
                isSelected: true,
            },
        ],
    };

    var fakeCheckinFlowService = {
        checkInhibitReason: jasmine.createSpy(),
        priorityInhibit: jasmine.createSpy(),
    };
    
    var fakeIbUtilsService = {
        getDeviceType: jasmine.createSpy(),

    };

    var fakeBoardingCards = {
        locator: '23RCRY',
        sideLocator: 'WERTY',
        boardingCards: [
            {
                id: '1',
                companyType: 'LOCAL',
                typeOfTransport: 'FLIGHT',
                estimatedFlightTime: '1 hora 5 minutos',
                maxWeightBaggage: {
                    amount: 23,
                    measurementType: 'KG',
                },
                departure: {
                    date: '2015-12-10 21:45',
                    terminal: 'MAD-TERMINAL  4',
                    airport: {
                        code: 'MAD',
                        description: 'Madrid',
                        country: 'ES',
                    },
                },
                arrival: {
                    date: '2015-12-10 22:50',
                    terminal: null,
                    airport: {
                        code: 'BIO',
                        description: 'Bilbao',
                        country: 'ES',
                    },
                },
                boarding: {
                    gate: 'HJK',
                    date: '2015-12-10 21:25',
                    limitDate: '2015-12-10 21:30',
                },
                flightNumber: {
                    company: {
                        code: 'IB',
                        description: 'IBERIA LINEAS AEREAS',
                    },
                    number: '8396',
                    operatedBy: 'AIR NOSTRUM',
                    marketing: 'SOLD AS BA 7050',
                },
                weatherForecast: null,
                passengers: [
                    {
                        id: '1',
                        name: 'PATO',
                        surname: 'DONALD',
                        group: 'PRIORITY',
                        ticketNumber: 'ETKT 075 2362753232',
                        barcode: null,
                        boardingNumber: '012',
                        cabinClass: {
                            code: 'A',
                            type: 'ECONOMY',
                            description: 'Turista',
                        },
                        observations: ['RESI', 'VISA', 'FAST TRACK', 'VIP'],
                        boardingBaggage: {
                            franchise: 1,
                        },
                        frequentFlyer: {
                            iataCompanyCode: 'IB',
                            number: '4204186',
                            topTier: 'RUBY-PLATA',
                        },
                        seat: {
                            row: '14',
                            column: 'A',
                        },
                        extraSeat: null,
                        bagTags: {
                            firstNumber: '075 2362753234',
                            quantity: 2,
                        },
                        fastTrack: false,
                        vip: false,
                        standby: false,
                        type: 'ADULT',
                        contentType: 'PLAIN',
                    },
                    {
                        id: '1_INF',
                        name: 'JORGITO',
                        surname: 'DONALD',
                        group: null,
                        ticketNumber: 'ETKT 075 2362753233',
                        barcode: null,
                        boardingNumber: '012',
                        cabinClass: {
                            code: 'A',
                            type: 'ECONOMY',
                            description: 'Turista',
                        },
                        observations: ['INFANT'],
                        boardingBaggage: {
                            franchise: 1,
                        },
                        fastTrack: false,
                        vip: false,
                        type: 'INFANT',
                        contentType: 'PLAIN',
                    },
                ],
            },
            {
                id: '2',
                companyType: 'EXTERNAL',
                typeOfTransport: 'TRAIN',
                estimatedFlightTime: '1 hora 5 minutos',
                maxWeightBaggage: {
                    amount: 23,
                    measurementType: 'KG',
                },
                departure: {
                    date: '2015-12-10 21:45',
                    terminal: 'MAD-TERMINAL  4',
                    airport: {
                        code: 'MAD',
                        description: 'Madrid',
                        country: 'ES',
                    },
                },
                arrival: {
                    date: '2015-12-10 22:50',
                    terminal: null,
                    airport: {
                        code: 'BIO',
                        description: 'Bilbao',
                        country: 'ES',
                    },
                },
                boarding: {
                    gate: 'HJK',
                    date: '2015-12-10 21:25',
                    limitDate: '2015-12-10 21:30',
                },
                flightNumber: {
                    company: {
                        code: 'IB',
                        description: 'IBERIA LINEAS AEREAS',
                    },
                    number: '8396',
                    operatedBy: 'AIR NOSTRUM',
                    marketing: 'SOLD AS BA 7050',
                },
                weatherForecast: null,
                passengers: [
                    {
                        id: '1',
                        name: 'PATO',
                        surname: 'DONALD',
                        contentType: 'BINARY',
                    },
                ],
            },
        ],
        printed: [
            {
                format: 'PDF',
                documents: [
                    {
                        fileName: '23RCRY_IB8396_10DIC_DONALD_PATO.pdf',
                        base64Bytes: 'ZmlsZS1jb250ZW50cw==',
                    },
                    {
                        fileName: 'IBERIA_23RCRY.pdf',
                        base64Bytes: 'ZmlsZS1jb250ZW50cw==',
                    },
                ],
            },
        ],
    };

    var fakeDatalayerUtilsService = {
        addDataLayerInfo: jasmine.createSpy(),
        addDigitalDataInfo: jasmine.createSpy(),
    };

    let fakeIbBoardingCardsPrintTransformer = {
        getPrintedInformation: jasmine.createSpy('getPrintedInformation')
    }

    var fakeCkiDatalayerConstants = require('test/constants/datalayer-cki-constants.json');

    var fakeBoardingCardsConstants = { CHANNELS_NAMES: { EMAIL: 'EMAIL', SMS: 'SMS', DOWNLOAD: 'DOWNLOAD' } };
    var fakeChannels = [{ channel: 'EMAIL' }, { channel: 'SMS' }, { channel: 'DOWNLOAD' }];

    var fakeSegmentsSelected = [
        {
            generalType: 'REGULAR',
            isSelected: true,
            segmentStatus: 'CHECKED',
            segmentStatusReason: '',
            passengersStatus: [
                {
                    id: 1,
                    status: 'CHECKED',
                    isSelected: true,
                    name: 'PASAJERO',
                    surname: 'DOS',
                    airCheckDocumentationRequired: false,
                    items: [],
                    inhibitBoardingCard: [],
                    flyNow: false,
                },
                {
                    id: 2,
                    status: 'CHECKED',
                    isSelected: true,
                    name: 'PASAJERO',
                    surname: 'UNO',
                    airCheckDocumentationRequired: false,
                    items: [],
                    inhibitBoardingCard: [],
                    flyNow: false,
                },
            ],
            airCheck: {
                status: false,
                url: 'https://contacto.iberia.com/IBDigitalboarding/R5_VFP_DigitalizacionEmbarque_IB?flight=IB3445&date=28092021&origin_country=FR&destination_country=ES&origin_airport=ORY&destination_airport=MAD&language=es',
            },
            id: 3,
            departure: {
                cityDescription: '',
                cityCode: '',
                airportDescription: 'ORLY',
                airportCode: 'ORY',
                terminal: '3',
                originalDate: '2021-09-28 19:15',
                date: { weekDay: 'WEEKDAY_TUESDAY', monthDay: 28, monthNumber: 9, month: 'MONTH_SEPTEMBER', year: 2021 },
                hour: '19:15',
            },
            arrival: {
                cityDescription: '',
                cityCode: '',
                airportDescription: 'BARAJAS',
                airportCode: 'MAD',
                terminal: '4',
                originalDate: '2021-09-28 21:20',
                date: { weekDay: 'WEEKDAY_TUESDAY', monthDay: 28, monthNumber: 9, month: 'MONTH_SEPTEMBER', year: 2021 },
                hour: '21:20',
            },
            cabinClass: { code: 'M', type: 'BUSINESS', description: 'Turista', fareFamily: null, mainClass: 'Y' },
            type: 'FLIGHT',
            flown: false,
            airlineName: 'Iberia',
            airlineLogo: '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
            flightCode: 'IB',
            flightNumber: 'IB3445',
            operatedBy: 'Iberia',
        },
    ];

    var fakeAcceptInfoSegments = {
        locator: null,
        acceptedSegments: [
            {
                id: 3,
                passengers: [
                    { id: 1, status: 'CHECKED', seat: { row: '18', column: 'D' }, purchaseSeatRequired: false, messageStatus: null },
                    { id: 2, status: 'CHECKED', seat: { row: '15', column: 'C' }, purchaseSeatRequired: false, messageStatus: null },
                ],
                cabinClass: { code: 'M', type: 'ECONOMY', description: 'Turista' },
            },
        ],
        upgrading: null,
        noShowPassengers: [],
    };

    var mockTranslateFilter = function (input) {
        return input;
    };

    var mockLinksFilter = function () {
        return '';
    };

    var mockLiteralFormatterFilter = function () {
        return '';
    };
    var fakeCheckinAppConstants = require('test/constants/ib-check-in-constants.json');

    var fakeBookingInfo = {
        checkinId: 'Q2hlY2tpbkBJTlRFUk5FVF9XRUJfSUJFUklBX2liZXJpYV93ZWJfUDEzMTk3MV8yMDIxMDkyNyAxNjowMzo0N18yMzE4X0lCQ09NMDQxbldFQjAzXzkwOTBfdjM%3D',
        resiberLocator: 'H7YN0',
        gdsLocator: 'H7YN0',
        checkinFlowMode: 'REGULAR',
        passengers: [
            {
                id: 1,
                name: 'PASAJERO',
                surname: 'DOS',
                title: null,
                gender: 'MALE',
                type: 'ADULT',
                frequentFlyer: null,
                resident: false,
                requiredInformation: [],
                optionalInformation: ['CONTACT_DATA', 'EMERGENCY_DATA'],
                status: { code: 'ALLOWED', reason: null },
                infant: null,
                pendingPayment: false,
            },
            {
                id: 2,
                name: 'PASAJERO',
                surname: 'UNO',
                title: null,
                gender: 'MALE',
                type: 'ADULT',
                frequentFlyer: null,
                resident: false,
                requiredInformation: [],
                optionalInformation: ['CONTACT_DATA', 'EMERGENCY_DATA'],
                status: { code: 'ALLOWED', reason: null },
                infant: null,
                pendingPayment: false,
            },
        ],
        checkinSegmentsInGroup: [],
        outwardSegments: [
            {
                id: 3,
                departure: { date: '2021-09-28 19:15', utcDate: '2021-09-28 17:15', airport: { code: 'ORY', description: 'ORLY', country: 'FR' }, terminal: '3' },
                arrival: { date: '2021-09-28 21:20', utcDate: '2021-09-28 19:20', airport: { code: 'MAD', description: 'BARAJAS', country: 'ES' }, terminal: '4' },
                boarding: { date: '2021-09-28 18:45', utcDate: '2021-09-28 16:45', airport: { code: 'ORY', description: 'ORLY', country: 'FR' }, terminal: '3', gate: '????' },
                passengers: [
                    {
                        id: 1,
                        seat: { row: '22', column: 'D' },
                        altLocator: null,
                        noShow: false,
                        flyNow: false,
                        status: { code: 'CHECKED', message: null },
                        mmbAvailable: false,
                        ticket: { number: '0752395649454', coupon: '1', issueDate: null, expiryDate: null, status: null },
                        infantTicket: null,
                        farebasis: 'MDNNAOB4',
                        items: [],
                        inhibitBoardingCard: [],
                        airCheckDocumentationRequired: false,
                    },
                    {
                        id: 2,
                        seat: { row: '23', column: 'D' },
                        altLocator: null,
                        noShow: false,
                        flyNow: false,
                        status: { code: 'CHECKED', message: null },
                        mmbAvailable: false,
                        ticket: { number: '0752395649453', coupon: '1', issueDate: null, expiryDate: null, status: null },
                        infantTicket: null,
                        farebasis: 'MDNNAOB4',
                        items: [],
                        inhibitBoardingCard: [],
                        airCheckDocumentationRequired: false,
                    },
                ],
                operatingFlightNumber: { company: { code: 'IB', description: 'Iberia' }, number: '3445' },
                marketingFlightNumber: null,
                cabinClass: { code: 'M', type: 'ECONOMY', description: 'Turista' },
                estimatedFlightTime: '02:05:00',
                typeOfTransport: 'FLIGHT',
                flown: false,
                aircraft: { model: '321', cabins: ['BUSINESS', 'ECONOMY'] },
                airCheckURL:
                    'https://contacto.iberia.com/IBDigitalboarding/R5_VFP_DigitalizacionEmbarque_IB?flight=IB3445&date=28092021&origin_country=FR&destination_country=ES&origin_airport=ORY&destination_airport=MAD&language=es',
                airCheck: false,
            },
        ],
        returnSegments: [],
        airShuttleSegments: [],
        deepLinkInformation: null,
        carrierConnectEnabled: false,
        relatedContent: [],
    };
    var fakeSeatInfoConfirmation = {
        segments: [
            {
                arrival: { code: 'MAD', description: 'BARAJAS', country: 'ES' },
                departure: { code: 'ORY', description: 'ORLY', country: 'FR' },
                passengers: [
                    {
                        id: 1,
                        name: 'PASAJERO DOS',
                        type: 'ADULT',
                        infant: null,
                        initialSeat: { row: '18', column: 'D', cabinIndex: 1, rowIndex: 13, columnIndex: 5, seatTypeDescription: '', seatType: '' },
                        currentSeat: { row: '22', column: 'D', cabinIndex: 1, rowIndex: 13, columnIndex: 5, seatTypeDescription: '', seatType: '' },
                        seatPrice: 11,
                        isInitialSeat: false,
                        seatPriceFormatted: '11€',
                    },
                    {
                        id: 2,
                        name: 'PASAJERO UNO',
                        type: 'ADULT',
                        infant: null,
                        initialSeat: { row: '15', column: 'C', cabinIndex: 1, rowIndex: 10, columnIndex: 2, seatTypeDescription: 'XL', seatType: 'EXTRA_SIZE' },
                        currentSeat: { row: '23', column: 'D', cabinIndex: 1, rowIndex: 10, columnIndex: 2, seatTypeDescription: '', seatType: '' },
                        seatPrice: 11,
                        isInitialSeat: false,
                        seatPriceFormatted: '11€',
                    },
                ],
                id: 3,
                isOut: true,
            },
        ],
        totalPrice: 22,
        totalPriceFormatted: '22,00€',
    };
    const fakeNotInhibit = {
        inhibitBoardingCard: {
            status: false,
            isAircheckReason: false,
            isInhibitReason: false,
            reason: [],
            segment: [],
            priority: null,
            isHomogeneous: false,
        },
        airCheck: { status: false, airCheckDocumentationRequired: false, url: '' },
        segments: [],
        LITERALS: {},
        modal: {
            title: { needsTranslate: true, message: 'MODAL_INHIBIT_MIX_BOARDING_CARD_TITLE', subtitle: { status: false, message: '', needsTranslate: false } },
            message: 'MODAL_INHIBIT_MIX_BOARDING_CARD_BODY',
            needsTranslate: true,
            btn: { accept: 'MODAL_INHIBIT_MIX_BOARDING_CARD_BTN_ACCEPT', cancel: 'MODAL_INHIBIT_MIX_BOARDING_CARD_BTN_CANCEL' },
        },
    };
    const fakeDatalayerCKIConstants = require('test/constants/datalayer-cki-constants.json');

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-boarding-cards-module', function ($provide) {
            $provide.value('CheckinFlowService', fakeCheckinFlowService);
            $provide.value('CkiDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('CkiDatalayerConstants', fakeCkiDatalayerConstants);
            $provide.value('BoardingCardsConstants', fakeBoardingCardsConstants);
            $provide.value('translateFilter', mockTranslateFilter);
            $provide.value('LinksFilterFilter', mockLinksFilter);
            $provide.value('literalFormatterFilter', mockLiteralFormatterFilter);
            $provide.value('CheckinAppConstants', fakeCheckinAppConstants);
            $provide.value('CkiDatalayerConstants', fakeDatalayerCKIConstants);
            $provide.value('IbUtilsService', fakeIbUtilsService);
            $provide.value('IbBoardingCardsPrintTransformer', fakeIbBoardingCardsPrintTransformer);
        });
        inject(function (_BoardingCardsTransformer_, _localStorageService_) {
            BoardingCardsTransformer = _BoardingCardsTransformer_;
            localStorageService = _localStorageService_;
        });
    });

    describe('BoardingCardsTransformer function', function () {
        it('correctly BoardingCardsView transform', function () {
            var returnedtransformBoardingCardsView = BoardingCardsTransformer.transformBoardingCardsView(mockBoardingInfo, mockPassengersContactData, mockPrefixList);
            expect(returnedtransformBoardingCardsView.formatsList).toEqual(fakeFormatsList);
            expect(returnedtransformBoardingCardsView.channelsList).toEqual(fakeChannelsList);
            expect(returnedtransformBoardingCardsView.passengersList).toEqual(fakePassengersList);
            expect(returnedtransformBoardingCardsView.segmentsList).toEqual(fakeSegmentsList);
        });

        it('should set biometricBoardingAssociation in storage if is biometric flow', () => {
            const mockBoardingInfoClone = structuredClone(mockBoardingInfo);
            mockBoardingInfoClone.documents[0].segments[0].passengers[0].biometricBoardingStatus = 'AVAILABLE';

            spyOn(localStorageService, 'set');

            BoardingCardsTransformer.transformBoardingCardsView(mockBoardingInfoClone, mockPassengersContactData, mockPrefixList);

            expect(localStorageService.set).toHaveBeenCalledWith('biometricBoardingAssociation', true);
        });

        it('should set biometricSomeComplete in storage if is biometric flow and complete', () => {
            const mockBoardingInfoClone = structuredClone(mockBoardingInfo);
            mockBoardingInfoClone.documents[0].segments[0].passengers[0].biometricBoardingStatus = 'COMPLETE';

            spyOn(localStorageService, 'set');

            BoardingCardsTransformer.transformBoardingCardsView(mockBoardingInfoClone, mockPassengersContactData, mockPrefixList);

            expect(localStorageService.set).toHaveBeenCalledWith('biometricSomeComplete', true);
        });

        it('should fill email and phone if passenger exists in passengersContactData', () => {
            let mockPassengersContactDataClone = structuredClone(mockPassengersContactData);
            mockPassengersContactDataClone = [{ id: '1', email: 'test@test.com', phone: '123456789' }];

            spyOn(localStorageService, 'set');

            const result = BoardingCardsTransformer.transformBoardingCardsView(mockBoardingInfo, mockPassengersContactDataClone, mockPrefixList);

            const paxWithData = result.passengersList.find(pax => pax.email !== '');
            expect(paxWithData.email).toBe('test@test.com');
            expect(paxWithData.phone).toBe('123456789');
        });

        it('should set channelsList isSelected true if channel is different to download', () => {
            const mockBoardingInfoClone = structuredClone(mockBoardingInfo);
            mockBoardingInfoClone.channels = ['SMS', 'EMAIL'];

            const result = BoardingCardsTransformer.transformBoardingCardsView(mockBoardingInfoClone, mockPassengersContactData, mockPrefixList);

            expect(result.channelsList[0].isSelected).toBe(true);
            expect(result.showEmail).toBe(true);
            expect(result.showPhone).toBe(false);
        });

        it('should set showPhone true if channel is SMS', () => {
            const mockBoardingInfoClone = structuredClone(mockBoardingInfo);
            mockBoardingInfoClone.channels = ['SMS'];

            const result = BoardingCardsTransformer.transformBoardingCardsView(mockBoardingInfoClone, mockPassengersContactData, mockPrefixList);

            expect(result.showPhone).toBe(true);
            expect(result.showEmail).toBe(false);
        });
    });

    describe('When transformPrintedBoardingCards() is called', function () {
        it('and not have same format,should return info', function (done) {
            var returnedCardsInfo = BoardingCardsTransformer.transformPrintedBoardingCards(fakeBoardingCards, []);
            expect(returnedCardsInfo[0].format).toEqual('PDF');
            done();
        });

        it('and  have same format,should return info', function (done) {
            var returnedCardsInfo = BoardingCardsTransformer.transformPrintedBoardingCards(fakeBoardingCards, [{ format: 'PDF' }]);
            expect(returnedCardsInfo[0].format).toEqual('PDF');
            expect(localStorageService.get('printBoardingCards')).toEqual(returnedCardsInfo);
            done();
        });

        it('should set confirmationInfo with the info that return the print transformer', (done) => {
            fakeIbBoardingCardsPrintTransformer.getPrintedInformation.and.returnValue('getPrintedInformation');

            BoardingCardsTransformer.transformPrintedBoardingCards(fakeBoardingCards, [{ format: 'PDF' }]);

            expect(fakeIbBoardingCardsPrintTransformer.getPrintedInformation).toHaveBeenCalled();
            expect(localStorageService.get('confirmationInfo')).toBe('getPrintedInformation');
            done();
        });
    });

    it('When getSelectedChannels() is called and contain all values,should return data with all channel on TRUE', function (done) {
        var returnedSelectedChannel = BoardingCardsTransformer.getSelectedChannels(fakeChannels);
        expect(returnedSelectedChannel.email).toBe(true);
        expect(returnedSelectedChannel.sms).toBe(true);
        expect(returnedSelectedChannel.download).toBe(true);
        done();
    });

    it('When createAskForBoardingCardsRequest() is called', function (done) {
        var returnedRequest = BoardingCardsTransformer.createAskForBoardingCardsRequest(FakeAskForBoarding);
        expect(returnedRequest[0].format).toEqual('PDF');
        done();
    });

    describe('createAskForBoardingCardsRequest', () => {
        it('should update model with overrides if not null', () => {
            const mockModel = structuredClone(FakeAskForBoarding);
            const mockOverrides = { passengerId: '1', segmentId: '1' };

            const result = BoardingCardsTransformer.createAskForBoardingCardsRequest(mockModel, mockOverrides);

            const segmentsResult = result[0].sharings[0].segments;
            expect(segmentsResult.length).toBeGreaterThan(0);
            expect(segmentsResult[0].id).toBe(mockOverrides.segmentId);
            expect(segmentsResult[0].passengers[0].includes(mockOverrides.passengerId)).toBe(true);
        });
    });

    describe('When transformInfoInhibitCards() is called', function () {
        beforeEach(() => {
            localStorageService.set('bookingInfo', fakeBookingInfo);
            localStorageService.set('segmentsSelected', fakeSegmentsSelected);
            localStorageService.set('acceptInfoSegments', fakeAcceptInfoSegments);
            localStorageService.set('seatInfoConfirmation', fakeSeatInfoConfirmation);
        });

        it('and not inhibition card boarding', function (done) {
            var returnedInfoInhibitCards = null;
            returnedInfoInhibitCards = BoardingCardsTransformer.transformInfoInhibitCards();
            expect(returnedInfoInhibitCards).toEqual(fakeNotInhibit);
            done();
        });

        it('should set status true if is airCheck', (done) => {
            const fakeSegmentsSelectedClone = structuredClone(fakeSegmentsSelected);
            fakeSegmentsSelectedClone[0].airCheck.status = true;

            localStorageService.set('segmentsSelected', fakeSegmentsSelectedClone);

            const returnedInfoInhibitCards = BoardingCardsTransformer.transformInfoInhibitCards();

            expect(returnedInfoInhibitCards.airCheck.status).toBe(true);

            done();
        });

        it('should set airCheck information if is documentation required', (done) => {
            const fakeSegmentsSelectedClone = structuredClone(fakeSegmentsSelected);
            fakeSegmentsSelectedClone[0].passengersStatus[0].inhibitBoardingCard = {reason: ['AVIH_REASON']};
            fakeSegmentsSelectedClone[0].passengersStatus[0].airCheckDocumentationRequired = true;

            localStorageService.set('segmentsSelected', fakeSegmentsSelectedClone);

            const returnedInfoInhibitCards = BoardingCardsTransformer.transformInfoInhibitCards();

            expect(returnedInfoInhibitCards.airCheck.airCheckDocumentationRequired).toBe(true);
            expect(returnedInfoInhibitCards.inhibitBoardingCard.segment.length).toBeGreaterThan(0);
            done();
        });

        it('should set inhibitBoardingCard information if existSeeAgent', (done) => {
            const fakeAcceptInfoSegmentsClone = structuredClone(fakeAcceptInfoSegments);
            fakeAcceptInfoSegmentsClone.acceptedSegments[0].passengers.at(-1).messageStatus = 'SEE_AGENT_FOR_BP';

            localStorageService.set('acceptInfoSegments', fakeAcceptInfoSegmentsClone);

            const returnedInfoInhibitCards = BoardingCardsTransformer.transformInfoInhibitCards();

            expect(returnedInfoInhibitCards.inhibitBoardingCard.status).toBe(true);
            expect(returnedInfoInhibitCards.inhibitBoardingCard.reason.length).toBeGreaterThan(0);
            done();
        });

        it('should set inhibitBoardingCard information if internalErrorCode is seeAgent', (done) => {
            const returnedInfoInhibitCards = BoardingCardsTransformer.transformInfoInhibitCards({
                internalErrorCode: 'PAC_BPM_9025'
            });

            expect(returnedInfoInhibitCards.inhibitBoardingCard.status).toBe(true);
            expect(returnedInfoInhibitCards.inhibitBoardingCard.reason.length).toBeGreaterThan(0);
            done();
        });

        it('should set inhibitBoardingCard and modal information if exists priorityReason', (done) => {
            fakeCheckinFlowService.priorityInhibit.and.returnValue(true);
            fakeCheckinFlowService.checkInhibitReason.and.returnValue({
                INHIBIT: false,
                AIRCHECK: true
            });

            const returnedInfoInhibitCards = BoardingCardsTransformer.transformInfoInhibitCards({
                internalErrorCode: 'PAC_BPM_9025'
            });

            expect(returnedInfoInhibitCards.modal.title.message).toBe('MODAL_INHIBIT_BOARDING_CARD_TITLE');
            expect(returnedInfoInhibitCards.modal.title.subtitle).toEqual({
                status: true,
                message: "MODAL_INHIBIT_MIX_BOARDING_CARD_SUBTITLE",
                needsTranslate: true,
            });
            expect(returnedInfoInhibitCards.inhibitBoardingCard.status).toBe(true);
            expect(returnedInfoInhibitCards.inhibitBoardingCard.priority).toBe(true);
            expect(returnedInfoInhibitCards.inhibitBoardingCard.isInhibitReason).toBe(false);
            expect(returnedInfoInhibitCards.inhibitBoardingCard.isAircheckReason).toBe(true);
            expect(returnedInfoInhibitCards.segments).toBeDefined();
            done();
        });

        it('should set modal message to inhibit info instead of aircheck', (done) => {
            fakeCheckinFlowService.priorityInhibit.and.returnValue(true);
            fakeCheckinFlowService.checkInhibitReason.and.returnValue({
                INHIBIT: true,
                AIRCHECK: false
            });

            const returnedInfoInhibitCards = BoardingCardsTransformer.transformInfoInhibitCards({
                internalErrorCode: 'PAC_BPM_9025'
            });

            expect(returnedInfoInhibitCards.modal.message).toBe('MODAL_INHIBIT_MIX_BOARDING_CARD_BODY_PREVENT');
            expect(returnedInfoInhibitCards.inhibitBoardingCard.isInhibitReason).toBe(true);
            expect(returnedInfoInhibitCards.inhibitBoardingCard.isAircheckReason).toBe(false);
            done();
        });

        it('should set cabin class name to business if is business type', (done) => {
            const fakeAcceptInfoSegmentsClone = structuredClone(fakeAcceptInfoSegments);
            fakeAcceptInfoSegmentsClone.acceptedSegments[0].cabinClass.type = 'BUSINESS';

            localStorageService.set('acceptInfoSegments', fakeAcceptInfoSegmentsClone);
            fakeCheckinFlowService.priorityInhibit.and.returnValue(true);
            fakeCheckinFlowService.checkInhibitReason.and.returnValue({
                INHIBIT: true,
                AIRCHECK: false
            });

            const returnedInfoInhibitCards = BoardingCardsTransformer.transformInfoInhibitCards({
                internalErrorCode: 'PAC_BPM_9025'
            });

            expect(returnedInfoInhibitCards.segments[0].cabinClass.literal).toBe('CKIANCPURC_CABINA_BUSINESS');

            done();
        });

        it('should set cabin class name to premium tourist if is premiumtourist type', (done) => {
            const fakeAcceptInfoSegmentsClone = structuredClone(fakeAcceptInfoSegments);
            fakeAcceptInfoSegmentsClone.acceptedSegments[0].cabinClass.type = 'PREMIUMTOURIST';

            localStorageService.set('acceptInfoSegments', fakeAcceptInfoSegmentsClone);
            fakeCheckinFlowService.priorityInhibit.and.returnValue(true);
            fakeCheckinFlowService.checkInhibitReason.and.returnValue({
                INHIBIT: true,
                AIRCHECK: false
            });

            const returnedInfoInhibitCards = BoardingCardsTransformer.transformInfoInhibitCards({
                internalErrorCode: 'PAC_BPM_9025'
            });

            expect(returnedInfoInhibitCards.segments[0].cabinClass.literal).toBe('CABINA_GENERAL CABINA_PREMIUM_TURIST');

            done();
        });
    });
});
