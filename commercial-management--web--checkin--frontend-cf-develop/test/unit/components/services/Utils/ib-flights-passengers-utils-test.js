describe('FlightsPassengersUtils test', function () {
    var filter, flightsPassengersUtils, returnPassengerInfo;

    var fakeModalService = {
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(function () {
            return { result: { then: angular.noop } };
        }),
    };

    var fakeCheckinFlowService = {
        updateApiEsta: jasmine.createSpy('updateApiEsta').and.returnValue({ showTextEsta: true })
    };

    var fakeIbUtilsService = {
        getAirlineLogos: jasmine.createSpy('getAirlineLogos').and.callFake(function () {
            return { companyDisabledURL: 'companyDisabledURL', companyURL: 'companyURL' };
        }),
    };

    var mockWhatToDoStatus = {
        hasSeat: true,
        mmbAvailable: true,
        noShow: false,
    };
    var mockStatus = 'SHUTTLE';
    var mockAdditionalInfo = [{ id: 1 }];
    const mockGeneralPassenger = [
        {
            id: 5,
            name: 'JAVIER',
            surname: 'RUIZ',
            title: null,
            gender: null,
            type: 'ADULT',
            frequentFlyer: null,
            resident: false,
            requiredInformation: [],
            optionalInformation: ['CONTACT_DATA', 'EMERGENCY_DATA', 'FREQUENT_FLYER'],
            status: { code: 'ALLOWED', reason: null },
            infant: null,
            pendingPayment: false,
        },
    ];
    var fakeBookingInfo = {
        airShuttleSegments: [{ id: 1, type: 'OPEN' }],
        returnSegments: [{ id: 2 }],
        outwardSegments: [{ id: 3 }],
        passengers: [
            {
                id: 1,
                seat: null,
                altLocator: null,
                noShow: false,
                flyNow: false,
                status: {
                    code: 'UNCHECKABLE',
                    message:
                        'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.',
                },
                mmbAvailable: false,
                ticket: {
                    number: '0752374598047',
                    coupon: '2',
                    issueDate: null,
                    expiryDate: null,
                    status: null,
                },
                infantTicket: null,
                farebasis: 'AIBWB4K',
                items: [],
            },
            {
                id: 2,
                seat: null,
                altLocator: null,
                noShow: false,
                flyNow: false,
                status: {
                    code: 'UNCHECKABLE',
                    message:
                        'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.',
                },
                mmbAvailable: false,
                ticket: {
                    number: '0752374598046',
                    coupon: '2',
                    issueDate: null,
                    expiryDate: null,
                    status: null,
                },
                infantTicket: null,
                farebasis: 'AIBWB4K/CH',
                items: [],
            },
            {
                id: 3,
                seat: null,
                altLocator: null,
                noShow: false,
                flyNow: false,
                status: {
                    code: 'UNCHECKABLE',
                    message:
                        'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.',
                },
                mmbAvailable: false,
                ticket: {
                    number: '0752374598045',
                    coupon: '2',
                    issueDate: null,
                    expiryDate: null,
                    status: null,
                },
                infantTicket: null,
                farebasis: 'AIBWB4K',
                items: [],
            },
        ],
    };
    var mockBookingInfo = {
        returnSegments: [2],
        outwardSegments: [3],
        passengers: [
            {
                id: 1,
                seat: null,
                altLocator: null,
                noShow: false,
                flyNow: false,
                status: {
                    code: 'UNCHECKABLE',
                    message:
                        'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.',
                },
                mmbAvailable: false,
                ticket: {
                    number: '0752374598047',
                    coupon: '2',
                    issueDate: null,
                    expiryDate: null,
                    status: null,
                },
                infantTicket: null,
                farebasis: 'AIBWB4K',
                items: [],
            },
            {
                id: 2,
                seat: null,
                altLocator: null,
                noShow: false,
                flyNow: false,
                status: {
                    code: 'UNCHECKABLE',
                    message:
                        'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.',
                },
                mmbAvailable: false,
                ticket: {
                    number: '0752374598046',
                    coupon: '2',
                    issueDate: null,
                    expiryDate: null,
                    status: null,
                },
                infantTicket: null,
                farebasis: 'AIBWB4K/CH',
                items: [],
            },
            {
                id: 3,
                seat: null,
                altLocator: null,
                noShow: false,
                flyNow: false,
                status: {
                    code: 'UNCHECKABLE',
                    message:
                        'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.',
                },
                mmbAvailable: false,
                ticket: {
                    number: '0752374598045',
                    coupon: '2',
                    issueDate: null,
                    expiryDate: null,
                    status: null,
                },
                infantTicket: null,
                farebasis: 'AIBWB4K',
                items: [],
            },
        ],
    };
    var fakeConfig = {
        FLIGHT_PASSENGERS_STATUS_LIST: {
            CHECKED: ['CHECKED', 'STANDBY', 'REISSUE'],
            AVAILABLE: ['CHECKABLE', 'PENDING_AQQ', 'PENDING_EVUS'],
            NOT_AVAILABLE: ['UNCHECKABLE'],
            SHUTTLE: ['OPEN', 'CONFIRMED'],
        },
        GENERAL_PASSENGERS_STATUS: {
            ALLOWED: 'ALLOWED',
            NOT_ALLOWED: 'NOT_ALLOWED',
        },
        SHUTTLE_SEGMENTS_TYPES: {
            OPEN: 'OPEN',
            CONFIRMED: 'CONFIRMED',
        },
        FLIGHT_PASSENGERS_STATUS: {
            CHECKED: 'CHECKED',
            AVAILABLE: 'AVAILABLE',
            NOT_AVAILABLE: 'NOT_AVAILABLE',
            SELECTABLE: 'SELECTABLE',
        },
        FLIGHT_TYPES: {
            REGULAR: 'REGULAR',
            SHUTTLE: 'SHUTTLE',
        },
        PASSENGER_DATA_OPTIONS: {
            GENDER: 'GENDER',
            API: 'API',
            CONTACT_DATA: 'CONTACT_DATA',
            EMERGENCY: 'EMERGENCY',
            EMERGENCY_DATA: 'EMERGENCY_DATA',
            FREQUENT_FLYER: 'FREQUENT_FLYER',
            FF: 'FF',
        },
        SHUTTLE_WHAT_TO_DO_BLOCKS: {
            SEAT: 'SEAT',
            CHECK_IN: 'CHECK_IN',
            BOARDING_CARD: 'BOARDING_CARD',
            MODIFY_SEGMENT: 'MODIFY_SEGMENT',
        },
        SHUTTLE_NEXT_STEPS: {
            SEATS_MAP: 'seatsMap',
            BOARDING_CARDS: 'boardingCards',
            FLY_NOW: 'flyNow',
            FLIGHT_PASSENGER: 'flightPas',
            GDR: 'gdr',
        },
        INHIBIT_BOARDING_CARD_TYPES: {
            SEE_AGENT_REASON: 'SEE_AGENT_REASON',
            AIRCHECK_REASON: 'AIRCHECK_REASON',
            BOKO_AIRCHECK_REASON: 'BOKO_AIRCHECK_REASON',
            INHIBIT_REASON: 'INHIBIT_REASON',
            UMNR_REASON: 'UMNR_REASON',
            RESI_REASON: 'RESI_REASON',
            AVIH_REASON: 'AVIH_REASON',
            PETC_REASON: 'PETC_REASON',
            COUR_REASON: 'COUR_REASON'
        },
		ITEMS_TYPES: {
			RESI: 'RESI',
			SEE_AGENT: 'SEE_AGENT'
		},
		market: 'ES',
		QUADRIGAM: {
			MMB_YOUR_DOCUMENTS: 'MMB_YOUR_DOCUMENTS',
            MMB: 'chktrp'
		}
    };

    var mockSegmentInfo = {
        id: 5,
        departure: {
            date: '2018-05-31 18:50',
            utcDate: '2018-05-31 17:50',
            airport: {
                code: 'VCE',
                description: 'Venecia',
                country: 'IT',
            },
            terminal: null,
        },
        arrival: {
            date: '2018-05-31 21:25',
            utcDate: '2018-05-31 20:25',
            airport: {
                code: 'MAD',
                description: 'Madrid',
                country: 'ES',
            },
            terminal: null,
        },
        boarding: null,
        passengers: [
            {
                id: 1,
                seat: null,
                altLocator: null,
                noShow: false,
                flyNow: false,
                status: {
                    code: 'UNCHECKABLE',
                    message:
                        'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.',
                },
                mmbAvailable: false,
                ticket: {
                    number: '0752374598047',
                    coupon: '2',
                    issueDate: null,
                    expiryDate: null,
                    status: null,
                },
                infantTicket: null,
                farebasis: 'AIBWB4K',
                items: [],
                inhibitBoardingCard: {
                    reason: ['AVIH_REASON'],
                    isAircheckReason: false,
                    isAVIHReason: true,
                    isInhibitReason: false,
                },
            },
            {
                id: 2,
                seat: null,
                altLocator: null,
                noShow: false,
                flyNow: false,
                status: {
                    code: 'UNCHECKABLE',
                    message:
                        'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.',
                },
                mmbAvailable: false,
                ticket: {
                    number: '0752374598046',
                    coupon: '2',
                    issueDate: null,
                    expiryDate: null,
                    status: null,
                },
                infantTicket: null,
                farebasis: 'AIBWB4K/CH',
                items: [],
                inhibitBoardingCard: {
                    reason: [],
                    isAircheckReason: false,
                    isAVIHReason: false,
                    isInhibitReason: false,
                },
            },
            {
                id: 3,
                seat: null,
                altLocator: null,
                noShow: false,
                flyNow: false,
                status: {
                    code: 'UNCHECKABLE',
                    message:
                        'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.',
                },
                mmbAvailable: false,
                ticket: {
                    number: '0752374598045',
                    coupon: '2',
                    issueDate: null,
                    expiryDate: null,
                    status: null,
                },
                infantTicket: null,
                farebasis: 'AIBWB4K',
                items: [],
                inhibitBoardingCard: {
                    reason: [],
                    isAircheckReason: false,
                    isAVIHReason: false,
                    isInhibitReason: false,
                },
            },
        ],
        operatingFlightNumber: {
            company: {
                code: 'IB',
                description: 'Iberia',
            },
            number: '3245',
        },
        marketingFlightNumber: null,
        cabinClass: {
            code: 'A',
            type: 'ECONOMY',
            description: 'Turista',
            fareFamily: null,
            mainClass: 'Y',
        },
        estimatedFlightTime: '02:35:00',
        typeOfTransport: 'FLIGHT',
        flown: false,
    };

    var mockPassenger = {
        id: 1,
        name: 'RAFAEL',
        surname: 'ANDRESMARTIN',
        title: null,
        gender: 'MALE',
        type: 'ADULT',
        frequentFlyer: {
            iataCompanyCode: 'IB',
            number: '24422800',
            topTier: 'RUBY',
            level: '3',
        },
        resident: false,
        requiredInformation: [],
        optionalInformation: ['GENDER', 'CONTACT_DATA', 'EMERGENCY_DATA', 'FREQUENT_FLYER'],
        status: {
            code: 'NOT_ALLOWED',
            reason: {
                code: 'SEGMENT_IN_CHECKINTIME_NOT_FOUND',
                message:
                    'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.',
            },
        },
        infant: null,
        pendingPayment: false,
    };

    var mockPassengerArray = [
        {
            id: 1,
            name: 'RAFAEL',
            surname: 'ANDRESMARTIN',
            title: null,
            gender: 'MALE',
            type: 'ADULT',
            frequentFlyer: {
                iataCompanyCode: 'IB',
                number: '24422800',
                topTier: 'RUBY',
                level: '3',
            },
            resident: false,
            requiredInformation: [],
            optionalInformation: ['GENDER', 'CONTACT_DATA', 'EMERGENCY_DATA', 'FREQUENT_FLYER'],
            status: {
                code: 'NOT_ALLOWED',
                reason: {
                    code: 'SEGMENT_IN_CHECKINTIME_NOT_FOUND',
                    message:
                        'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.',
                },
            },
            infant: null,
            pendingPayment: false,
        },
        {
            id: 2,
            name: 'RAFA',
            surname: 'ANDRESMARTIN',
            title: null,
            gender: 'MALE',
            type: 'ADULT',
            frequentFlyer: {
                iataCompanyCode: 'IB',
                number: '24422800',
                topTier: 'RUBY',
                level: '3',
            },
            resident: false,
            requiredInformation: [],
            optionalInformation: ['GENDER', 'CONTACT_DATA', 'EMERGENCY_DATA', 'FREQUENT_FLYER'],
            status: {
                code: 'NOT_ALLOWED',
                reason: {
                    code: 'SEGMENT_IN_CHECKINTIME_NOT_FOUND',
                    message:
                        'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.',
                },
            },
            infant: null,
            pendingPayment: false,
        },
    ];

	const mockLocalStorageService = {
		get: jasmine.createSpy('mockLocalStorageService-get').and.callFake((key) => key),
		set: jasmine.createSpy('mockLocalStorageService-set')
	};

    var mockLiteralFormatterFilter = function () {
        return '';
    };

    var mocktranslateFilter = function () {
        return '';
    };

    beforeEach(function () {
        angular.mock.module('ib-checkin-services-module', 'ib-filter-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CheckinFlowService', fakeCheckinFlowService);
            $provide.value('CheckinAppConstants', fakeConfig);
            $provide.value('ModalService', fakeModalService);
            $provide.value('literalFormatterFilter', mockLiteralFormatterFilter);
            $provide.value('translateFilter', mocktranslateFilter);
            $provide.value('localStorageService', mockLocalStorageService);
            $provide.value('IbUtilsService', fakeIbUtilsService);
        });
        inject(function (_FlightsPassengersUtils_, $filter) {
            flightsPassengersUtils = _FlightsPassengersUtils_;
            filter = $filter;
        });
    });

    describe('When getGeneralSegmentInfo is called', () => {
		const mockSegmentInfo = {
			id: 6,
			departure: {
				date: '2025-06-30 07:25',
				utcDate: '2025-06-30 05:25',
				airport: { code: 'MAD', description: 'Madrid', country: 'ES' },
				terminal: '4',
			},
			arrival: {
				date: '2025-06-30 08:30',
				utcDate: '2025-06-30 06:30',
				airport: { code: 'BIO', description: 'Bilbao', country: 'ES' },
				terminal: null,
			},
			boarding: null,
			passengers: [
				{
					id: 5,
					seat: { row: '33', column: 'F' },
					extraSeat: null,
					altLocator: null,
					noShow: false,
					flyNow: false,
					status: { code: 'CHECKED', message: null },
					mmbAvailable: false,
					ticket: { number: '0751437130954', coupon: '1', issueDate: null, expiryDate: null, status: null },
					infantTicket: null,
					farebasis: 'YD',
					items: [],
					inhibitBoardingCard: [],
					sequenceNumber: null,
					airCheckDocumentationRequired: false,
				},
			],
			operatingFlightNumber: { company: { code: 'IB', description: 'IBERIA AEROLINEAS' }, number: '0429' },
			marketingFlightNumber: null,
			cabinClass: { code: 'Y', type: 'ECONOMY', description: 'Turista', fareFamily: null, mainClass: 'Y' },
			estimatedFlightTime: '01:05:00',
			typeOfTransport: 'FLIGHT',
			flown: false,
			aircraft: { model: '321', cabins: ['BUSINESS', 'ECONOMY'] },
			airCheckURL: null,
			checkInStatusTime: null,
			airCheck: false,
		};

		it('and the segment is checked', function (done) {
			var returnedInfo = flightsPassengersUtils.getGeneralSegmentInfo(mockGeneralPassenger, mockSegmentInfo, 'REGULAR');
			expect(returnedInfo.segmentStatus).toEqual('CHECKED');
			done();
		});

		it('should set segmentStatus to NOT_AVAILABLE if the passengers is UNCHECKABLE and is not flyNow', (done) => {
			const mockSegmentInfoClone = structuredClone(mockSegmentInfo);
			mockSegmentInfoClone.passengers[0].status.code = 'UNCHECKABLE';
			mockSegmentInfoClone.passengers[0].mmbAvailable = true;

			var returnedInfo = flightsPassengersUtils.getGeneralSegmentInfo(mockGeneralPassenger, mockSegmentInfoClone, 'SHUTTLE');
			expect(returnedInfo.segmentStatus).toEqual('NOT_AVAILABLE');
			done();
		});

		it('should set segmentStatus to SELECTALE if the passengers is UNCHECKABLE and is flyNow', (done) => {
			const mockSegmentInfoClone = structuredClone(mockSegmentInfo);
			mockSegmentInfoClone.passengers[0].status.code = 'UNCHECKABLE';
			mockSegmentInfoClone.passengers[0].flyNow = true;

			var returnedInfo = flightsPassengersUtils.getGeneralSegmentInfo(mockGeneralPassenger, mockSegmentInfoClone, 'SHUTTLE');
			expect(returnedInfo.segmentStatus).toEqual('SELECTABLE');
			done();
		});

		it('should set segmentStatus to AVAILABLE if the passengers is AVAILABLE and the fly type OPEN', (done) => {
			const mockSegmentInfoClone = structuredClone(mockSegmentInfo);
			mockSegmentInfoClone.passengers[0].status.code = 'AVAILABLE';
			mockSegmentInfoClone.type = 'OPEN';

			var returnedInfo = flightsPassengersUtils.getGeneralSegmentInfo(mockGeneralPassenger, mockSegmentInfoClone, 'SHUTTLE');
			expect(returnedInfo.segmentStatus).toEqual('AVAILABLE');
			done();
		});

		it('should set segmentStatus to AVAILABLE if the passengers is CHECKABLE', (done) => {
			const mockSegmentInfoClone = structuredClone(mockSegmentInfo);
			mockSegmentInfoClone.passengers[0].status.code = 'CHECKABLE';

			var returnedInfo = flightsPassengersUtils.getGeneralSegmentInfo(mockGeneralPassenger, mockSegmentInfoClone, 'REGULAR');
			expect(returnedInfo.segmentStatus).toEqual('AVAILABLE');
			done();
		});

		it('should set airCheck status and url if exists airCheck', (done) => {
			const mockSegmentInfoClone = structuredClone(mockSegmentInfo);
			mockSegmentInfoClone.airCheck = true;

			var returnedInfo = flightsPassengersUtils.getGeneralSegmentInfo(mockGeneralPassenger, mockSegmentInfoClone, 'REGULAR');
			expect(returnedInfo.airCheck.status).toBe(true);
			expect(returnedInfo.airCheck.url).toBe('/MANAGE_MY_BOOKING_LINK#!/chktrp?pnr=PNR&surname=checkinSurname&quadrigam=MMB_YOUR_DOCUMENTS');
			done();
		});

		it('should set the newReason item when has inhibitCard', (done) => {
			const reasonItem = 'RESI_REASON';
			const expectedItem = 'RESI';

			const mockSegmentInfoClone = structuredClone(mockSegmentInfo);
			mockSegmentInfoClone.passengers[0].items = [reasonItem];
			mockSegmentInfoClone.passengers[0].inhibitBoardingCard = [reasonItem];

			var returnedInfo = flightsPassengersUtils.getGeneralSegmentInfo(mockGeneralPassenger, mockSegmentInfoClone, 'REGULAR');
			expect(returnedInfo.passengersStatus[0].items).toContain(expectedItem);

			done();
		});
    });

    it('When getDetailedSegmentInfo() is called', function (done) {
        var returnSegmentInfo = flightsPassengersUtils.getDetailedSegmentInfo(mockSegmentInfo, 'NOT_AVAILABLE');
        expect(returnSegmentInfo.departure.airportCode).toEqual('VCE');
        done();
    });

    it('When getPassengerInfo() is called', function (done) {
		mockLocalStorageService.get.withArgs('bookingInfo').and.returnValue(fakeBookingInfo);
        returnPassengerInfo = flightsPassengersUtils.getPassengerInfo(mockPassenger, mockAdditionalInfo, [], [], 34, null);
        expect(returnPassengerInfo.pasStatus.available).toBe(false);
        expect(mockLocalStorageService.get).toHaveBeenCalledWith('bookingInfo');
        done();
    });

    it('When getPassengerAdditionalInfo() is called', function (done) {
        var returnPassengerInfo = flightsPassengersUtils.getPassengerAdditionalInfo({ passengers: mockPassengerArray });
        expect(returnPassengerInfo).toBe(returnPassengerInfo);
        done();
    });

    it('When getPassengerEmergencyInfo() is called', function (done) {
        var returnPassengerInfo = flightsPassengersUtils.getPassengerEmergencyInfo({ passengers: mockPassengerArray });
        expect(returnPassengerInfo).toBe(returnPassengerInfo);
        done();
    });

    it('When generateWhatToDoShuttleBlocks() is called', function (done) {
        const mockResult = {
            active: true,
            options: [
                {
                    id: 'MODIFY_SEGMENT',
                    description: 'IBCOAC_PA_WHAT_TO_DO_MODIFY',
                    nextStep: 'gdr',
                    icon: 'icon-cambios_y_reembolsos',
                },
            ],
            selectedBlock: {
                id: 'MODIFY_SEGMENT',
                description: 'IBCOAC_PA_WHAT_TO_DO_MODIFY',
                nextStep: 'gdr',
                icon: 'icon-cambios_y_reembolsos',
            },
        };

        const returnData = flightsPassengersUtils.generateWhatToDoShuttleBlocks(
            mockWhatToDoStatus,
            mockSegmentInfo,
            mockStatus
        );
        expect(returnData).toEqual(mockResult);
        done();
    });

    it('When checkExistAPIsUsTracing() is called', function (done) {
        var ckeckApisUsTracing = {
            show: false,
            CHECK_US_PRIVACY_ACT_STATEMENT: 'CHECK_US_PRIVACY_ACT_STATEMENT',
            checkPrivacyText: '',
        };
        var returnCheckExistAPIsUsTracing = flightsPassengersUtils.checkExistAPIsUsTracing(ckeckApisUsTracing, true);
        expect(returnCheckExistAPIsUsTracing).toEqual({
            show: true,
            CHECK_US_PRIVACY_ACT_STATEMENT: 'CHECK_US_PRIVACY_ACT_STATEMENT',
            checkPrivacyText: '',
        });
        done();
    });

    it('When getAcceptUpdateInformation() is called', function (done) {
        const mockSelectedSegmentsID = [2];
        const mockPassengersID = [1];
        mockBookingInfo.checkinSegmentsInGroup = [2, 3];
        mockLocalStorageService.get.withArgs('bookingInfo').and.returnValue(mockBookingInfo);
        mockLocalStorageService.get.withArgs('segmentsSelected').and.returnValue([]);
        const returnData = flightsPassengersUtils.getAcceptUpdateInformation(mockSelectedSegmentsID, mockPassengersID);
        expect(returnData).toEqual({
            dangerousItemsInfoAccepted: true,
            segments: [
                { id: 2, passengers: [1] },
                { id: 3, passengers: [1] },
            ],
        });
        expect(mockLocalStorageService.get).toHaveBeenCalledWith('bookingInfo');
		expect(mockLocalStorageService.set).toHaveBeenCalledWith('availableSegments', [2, 3]);
		expect(mockLocalStorageService.set).toHaveBeenCalledWith('segmentsSelected', []);
        done();
    });

    it('When getPassengersUpdateInformation() is called', function (done) {
        //passengersInfo, MockUseForAllInfo, mockSelectedShuttleSegmentInfo
        const mockPassengersInfo = [{ "id": 5, "type": "ADULT", "pasStatus": { "available": true, "isChecked": true, "reason": null, "isApiEsta": false }, "requiresApis": false, "fieldStatus": { "contactData": { "available": true, "show": true, "mandatory": false }, "emergencyData": { "available": true, "show": true, "mandatory": false }, "gender": { "show": false, "mandatory": false }, "frequentFlyer": { "show": true, "mandatory": false, "isOpenPA": false } }, "requiredInformation": [], "isSelected": true, "name": "JAVIER", "surname": "RUIZ", "gender": "MALE", "infant": null, "contactData": { "denyNewsLetter": false, "phone": { "countryCode": "34", "number": "123456789" }, "emergency": { "phone": { "countryCode": "34" } }, "email": "TEST@TEST.COM", "available": true }, "initialData": { "contact": { "gender": "MALE", "phone": { "countryCode": "34", "number": "123456789" }, "email": "TEST@TEST.COM", "frequentFlyer": { "info": { "number": "", "iataCompanyCode": "" }, "enabled": true } }, "emergency": { "phone": { "countryCode": "34" } } }, "inhibitBoardingCard": { "status": false, "reason": [], "url": "" }, "frequentFlyer": { "info": { "number": "", "iataCompanyCode": "" }, "enabled": true }, "language": "ES", "items": [], "$$hashKey": "object:187" }];
        const MockUseForAllInfo = { "additionalInfoUseForAllCheck": { "showId": "", "status": false, "show": false }, "emergencyDataUseForAllCheck": { "showId": "", "status": false, "show": false }, "showContactData": true };
        const mockSelectedShuttleSegmentInfo = null;
        const mockReturnData = { "regularPassengersIds": [5], "passengersApisIds": [], "passengersSelected": [5], "newsLetterInfo": { "info": [{ "name": "JAVIER", "firstSurname": "RUIZ", "email": "TEST@TEST.COM" }] }, "additionalInfo": { "needsUpdate": false, "info": [], "isMandatory": false }, "emergencyInfo": { "needsUpdate": false, "info": [{ "id": 5, "emergencyContact": { "refused": true, "name": "REFUSED", "phone": { "countryCode": "REFUSED", "number": "REFUSED" } } }], "isMandatory": false } };
        const returnData = flightsPassengersUtils.getPassengersUpdateInformation(mockPassengersInfo, MockUseForAllInfo, mockSelectedShuttleSegmentInfo);
        expect(returnData).toEqual(mockReturnData);
        done();
    });

	describe('When getReasonNoItemInhibition() is called', () => {
		const cases = [
			{ reason: fakeConfig.INHIBIT_BOARDING_CARD_TYPES.RESI_REASON, expectedItem: fakeConfig.ITEMS_TYPES.RESI },
			{ reason: fakeConfig.INHIBIT_BOARDING_CARD_TYPES.SEE_AGENT_REASON, expectedItem: fakeConfig.ITEMS_TYPES.SEE_AGENT }
		];

		cases.forEach(({ expectedItem, reason }) => {
			it(`should return ${expectedItem} item when reason include ${reason}`, (done) => {
				const reasonMock = [reason];

				const item = flightsPassengersUtils.getReasonNoItemInhibition(reasonMock);

				expect(item).toBe(expectedItem);
				done();
			});
		});
	});
});
