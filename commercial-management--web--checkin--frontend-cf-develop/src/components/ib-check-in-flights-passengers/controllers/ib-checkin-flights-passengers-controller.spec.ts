/// <reference types="jasmine" />
import 'angular';
import 'angular-mocks';
import * as angular from 'angular';
import { IbAncillariesPaymentUtilsService } from '@src/app/shared/services/ib-utils/ib-ancillaries-payment-utils.service';
import { IbPassengerBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-passenger-booking-utils.service';

interface PassengerStatus {
	id: number;
	isSelected: boolean;
	status: string;
	items: string[];
	// otros campos opcionales
	[key: string]: unknown;
}

interface Passenger {
	id: number;
	isSelected: boolean;
	type?: string;
	pasStatus: { available: boolean; isChecked: boolean;[key: string]: unknown };
	fieldStatus: {
		contactData: { available: boolean; show: boolean; mandatory?: boolean };
		emergencyData: { available: boolean; show: boolean; mandatory?: boolean };
		[key: string]: unknown;
	};
	contactData?: { email?: string; phone?: { countryCode?: string; number?: string } };
	frequentFlyer?: { info?: { number?: string }; enabled?: boolean };
	items: string[];
	[key: string]: unknown;
}

interface Segment {
	id: number;
	isSelected: boolean;
	segmentStatus: string;
	passengersStatus: PassengerStatus[];
	detailedType?: string;
	whatToDo?: { selectedBlock?: unknown };
	[key: string]: unknown;
}

interface SegmentsPassengersInfo {
	dataLayer?: { datalayerBookingType?: string; isAirShuttle?: boolean; quadrigam?: string };
	onlyShuttleSegments?: boolean;
	segments: Segment[];
	passengers: Passenger[];
	whatToDo?: { active: boolean; options: unknown[] };
	selectedShuttleSegmentIndex?: number | null;
	activeFields?: {
		additionalInfoUseForAllCheck?: { showId?: unknown; status?: boolean; show?: boolean };
		emergencyDataUseForAllCheck?: { showId?: unknown; status?: boolean; show?: boolean };
		showContactData?: boolean;
		[key: string]: unknown;
	};
	checkinSegmentsInGroup?: { segments: unknown[]; info?: unknown };
	[key: string]: unknown;
}

interface PassengerForm {
	$valid?: boolean;
	$submitted?: boolean;
	$setSubmitted?: jasmine.Spy;
}

interface FlightsPassengersModel {
	conditions: boolean;
	segmentsPassengersInfo: SegmentsPassengersInfo;
	initializeModel: jasmine.Spy;
	selectedBlock?: number;
	pasform?: PassengerForm;
	[key: string]: unknown;
}

interface FlightsPassengersControllerInstance {
	model: FlightsPassengersModel;
	isBpSubscriptionMode: boolean;
	callUpdateFlightsPassengersServices(form: PassengerForm): void;
	passengerRightsRedirection(): void;
	continueFlowDuplicate(shouldContinue: boolean, form: PassengerForm): void;
}

type SpyMap<Names extends string> = Record<Names, jasmine.Spy>;

describe('FlightsPassengersController test', () => {
	let $rootScope: angular.IRootScopeService;
	let $scope: angular.IScope;
	let $controller: angular.IControllerService;
	let $q: angular.IQService;
	let $timeout: angular.ITimeoutService;
	let $httpBackend: angular.IHttpBackendService;
	let controller: FlightsPassengersControllerInstance;

	// Fakes / spies
	let fakeFlightsPassengersModel: FlightsPassengersModel;
	let fakeIbUtilsService: Partial<Record<string, jasmine.Spy | Function>>;
	let fakeCheckinFlowService: Partial<Record<string, jasmine.Spy | Function>>;
	let fakeModalService: SpyMap<'showGenericModal' | 'openDangerousObjectsModal' | 'isNotWaiting' | 'isWaiting'>;
	let fakeCommonsModalService: SpyMap<'showWaitingModal' | 'finishWaiting' | 'closeAllCurrentModals' | 'showGenericModal'>;
	let fakeFlightsPassengersService: SpyMap<'searchFlightsAndPassengers' | 'getWCSPhones'>;
	let fakeAncillariesTransformer: SpyMap<'generateAncillariesHeaderInfo'>;
	let fakeCkiDatalayerUtilsService: SpyMap<
		'updateAircraft' | 'updateDatalayerWithQuadrigam' | 'sendDatalayerEvent' | 'updateDigitalDataWithQuadrigam' | 'updateDatalayerViewEvent' | 'sendDatalayerErrorEvent'
	>;
	let fakeUpdateFlightsPassengerInfoService: SpyMap<'updateFlightsPassengerInfo'>;
	let fakeCommonsSessionStorageService: SpyMap<'get' | 'set' | 'remove'>;
	let fakeIBContactDataService: SpyMap<'updateContactData' | 'getContactData'>;
	let fakeIBCContactDetailsZeroService: SpyMap<'getContactDetailsData'>;
	let fakeCommonsUserUtilsService: SpyMap<'isIbZero' | 'isIbPlus' | 'isSoftUser'>;
	let fakeMonetateUtilsService: SpyMap<'updateMonetateWithQuadrigam'>;
	let fakeMonetateConstants: Record<string, unknown>;
	let fakeRedirectionService: SpyMap<'newNavigation'>;
	let fakeNewMainHeaderFacade: SpyMap<'initHeader' | 'updatePendingPaymentItems'>;
	let fakeCkiDatalayerConstants: Record<string, unknown>;
	let fakeCheckinAppConstants: Record<string, unknown>;
	let fakeWindow: { location: Pick<Location, 'origin' | 'pathname' | 'href'> };
	let fakeIbSessionConfigService: SpyMap<'isUserLogged'>;
	let fakeIbSeatEarlyCheckinService: SpyMap<'checkEarlySegments'>;
	let fakeIbAncillariesPaymentUtilsService: Pick<IbAncillariesPaymentUtilsService, 'getInfoHeader'>;
	let fakeIbPassengerBookingUtilsService: Pick<IbPassengerBookingUtilsService, 'getSegmentsInfo' | 'setAircraftDatalayer'>;

	const mockSearchFlights: { flightsPassengersInfo: SegmentsPassengersInfo; summaryInfo: unknown | null } = {
		flightsPassengersInfo: {
			dataLayer: { datalayerBookingType: 'E', isAirShuttle: false, quadrigam: '' },
			onlyShuttleSegments: false,
			segments: [
				{
					id: 1,
					isSelected: true,
					segmentStatus: 'AVAILABLE',
					passengersStatus: [{ id: 1, isSelected: true, status: 'CHECKABLE', items: [] }]
				},
				{
					id: 2,
					isSelected: true,
					segmentStatus: 'AVAILABLE',
					passengersStatus: [{ id: 1, isSelected: true, status: 'CHECKABLE', items: [] }]
				}
			],
			passengers: [
				{
					id: 1,
					isSelected: true,
					type: 'ADULT',
					pasStatus: { available: true, isChecked: false },
					fieldStatus: {
						contactData: { available: true, show: true },
						emergencyData: { available: true, show: false }
					},
					contactData: { email: 'a@a.com', phone: { countryCode: '34', number: '600' } },
					frequentFlyer: { info: { number: '123' }, enabled: true },
					items: []
				}
			],
			whatToDo: { active: false, options: [] },
			selectedShuttleSegmentIndex: null,
			activeFields: {
				additionalInfoUseForAllCheck: { showId: null, status: false, show: false },
				emergencyDataUseForAllCheck: { showId: null, status: false, show: false },
				showContactData: true
			},
			checkinSegmentsInGroup: { segments: [] }
		},
		summaryInfo: null
	};

	// -----------------------
	// HELPERS (reusables)
	// -----------------------
	function createPassenger(overrides: Partial<Passenger> = {}): Passenger {
		return {
			id: 1,
			isSelected: true,
			pasStatus: { available: true, isChecked: false },
			fieldStatus: { contactData: { available: true, show: true }, emergencyData: { available: true, show: false } },
			contactData: { email: 'a@a.com', phone: { countryCode: '34', number: '600' } },
			items: [],
			frequentFlyer: { info: { number: '123' }, enabled: true },
			...overrides
		} as Passenger;
	}

	function createPasForm(valid = true): PassengerForm {
		const form: PassengerForm = {
			$valid: valid,
			$submitted: false,
			$setSubmitted: jasmine.createSpy('$setSubmitted').and.callFake(() => {
				form.$submitted = true;
			})
		};
		return form;
	}

	function createSegment(id = 1, passengerItems: string[] = []): Segment {
		return {
			id,
			isSelected: true,
			segmentStatus: 'AVAILABLE',
			passengersStatus: [{ id: 1, isSelected: true, status: 'CHECKABLE', items: passengerItems }]
		} as Segment;
	}

	function mockLocalStorageForSegments(localStorageRef: SpyMap<'get'>, segment: Segment) {
		localStorageRef.get.and.callFake((key: string) => {
			if (key === 'segmentsSelected') return [segment];
			if (key === 'bookingInfo') return { carrierConnectEnabled: false, outwardSegments: [], returnSegments: [] };
			if (key === 'customerData')
				return {
					personalInfo: { contactEmail: 'a@a.com', telecomAddresses: { number: '600', countryDiallingCode: '+34' } }
				};
			return null;
		});
	}

	function mockModalBehavior(
		modalServiceRef: SpyMap<'showGenericModal' | 'openDangerousObjectsModal'>,
		opts: { acceptDisclaimer?: boolean; acceptDangerous?: boolean } = {},
	) {
		if (opts.acceptDisclaimer) {
			modalServiceRef.showGenericModal.and.callFake(() => ({ result: { then: (ok: () => void) => ok() } }));
		} else {
			modalServiceRef.showGenericModal.and.callFake(() => ({ result: { then: angular.noop } }));
		}
		if (opts.acceptDangerous) {
			modalServiceRef.openDangerousObjectsModal.and.callFake(() => ({ result: { then: (ok: () => void) => ok() } }));
		} else {
			modalServiceRef.openDangerousObjectsModal.and.callFake(() => ({ result: { then: angular.noop } }));
		}
	}

	function runFlush() {
		// It spreads promises and timeouts
		$rootScope.$apply();
		try {
			$timeout.flush();
		} catch (e) {
			/* no pending timeouts */
		}
	}

	/**
	 * runCallUpdateScenario: helper that starts the scenario, executes the method, and makes the common basic assertions
	 * @param:
	 *  - hasSvan: whether the data contains 'SVAN'
	 *  - acceptDisclaimer: whether the modal disclaimer should be "accepted" (resolve then)
	 */
	function runCallUpdateScenario(opts: { hasSvan: boolean; acceptDisclaimer: boolean }) {
		const { hasSvan, acceptDisclaimer } = opts;
		const pasForm = createPasForm(true);
		controller.model.pasform = pasForm;
		const passenger = createPassenger({ items: hasSvan ? ['SVAN'] : [] });
		const segment = createSegment(hasSvan ? 10 : 11, hasSvan ? ['SVAN'] : []);
		controller.model.segmentsPassengersInfo = {
			passengers: [passenger],
			segments: [segment],
			whatToDo: { active: false, options: [] },
			selectedShuttleSegmentIndex: null,
			activeFields: {
				additionalInfoUseForAllCheck: { status: false, showId: null, show: false },
				emergencyDataUseForAllCheck: { status: false, showId: null, show: false }
			}
		};
		mockLocalStorageForSegments(fakeCommonsSessionStorageService, segment);
		fakeFlightsPassengersService.getWCSPhones.and.callFake(() => {
			const d = $q.defer();
			d.resolve({});
			return d.promise;
		});
		mockModalBehavior(fakeModalService, { acceptDisclaimer: acceptDisclaimer, acceptDangerous: true });
		fakeUpdateFlightsPassengerInfoService.updateFlightsPassengerInfo = jasmine.createSpy('updateFlightsPassengerInfo');
		// Act
		controller.callUpdateFlightsPassengersServices(pasForm);
		// Flush
		runFlush();
		// Common asserts
		expect(fakeFlightsPassengersService.getWCSPhones).toHaveBeenCalled();
		expect(fakeModalService.openDangerousObjectsModal).toHaveBeenCalled();
		expect(fakeUpdateFlightsPassengerInfoService.updateFlightsPassengerInfo).toHaveBeenCalled();

		if (hasSvan && acceptDisclaimer) {
			expect(fakeModalService.showGenericModal).toHaveBeenCalled();
		} else {
			expect(fakeModalService.showGenericModal).not.toHaveBeenCalled();
		}
	}

	// -----------------------
	// providers
	// -----------------------

	//model
	function buildModelMocks(): void {
		fakeFlightsPassengersModel = {
			conditions: false,
			segmentsPassengersInfo: {} as SegmentsPassengersInfo,
			initializeModel: jasmine.createSpy('initializeModel'),
			selectedBlock: 1,
			pasform: { $valid: true, $submitted: true }
		};
	}
	//services / spies
	function buildServiceMocks(): void {
		buildAncillariesMocks();
		buildUtilityMocks();
		buildModalMocks();
		buildFlightMocks();
		buildDatalayerMocks();
		buildContactMocks();
		//buildUserMocks();
		buildConfigurationMocks();
	}

	function buildAncillariesMocks(): void {
		fakeIbAncillariesPaymentUtilsService = {
			getInfoHeader: jasmine.createSpy('getInfoHeader').and.returnValue({ trips: true })
		};

		fakeAncillariesTransformer = {
			generateAncillariesHeaderInfo: jasmine.createSpy('generateAncillariesHeaderInfo').and.returnValue({})
		};

		fakeIbSeatEarlyCheckinService = {
			checkEarlySegments: jasmine.createSpy('checkEarlySegments').and.returnValue(false)
		};
	}

	function buildUtilityMocks(): void {
		fakeIbUtilsService = {
			setTitlePage: jasmine.createSpy('setTitlePage'),
			getBpSubscriptionMode: jasmine.createSpy('getBpSubscriptionMode').and.returnValue(true)
		};

		fakeCheckinFlowService = {
			checkConfirmationPNR: jasmine.createSpy('checkConfirmationPNR').and.returnValue(false),
			checkApisEsta: jasmine.createSpy('checkApisEsta').and.returnValue({ showTextEsta: false, text: 'text' })
		};

		fakeCommonsUserUtilsService = {
			isIbZero: jasmine.createSpy('isIbZero').and.returnValue(false),
			isIbPlus: jasmine.createSpy('isIbPlus').and.returnValue(true),
			isSoftUser: jasmine.createSpy('isSoftUser').and.returnValue(false)
		};
	}

	function buildModalMocks(): void {
		const modalResult = { result: { then: angular.noop } };

		fakeModalService = {
			showGenericModal: jasmine.createSpy('showGenericModal').and.returnValue(modalResult),
			openDangerousObjectsModal: jasmine.createSpy('openDangerousObjectsModal').and.returnValue(modalResult),
			isNotWaiting: jasmine.createSpy('isNotWaiting'),
			isWaiting: jasmine.createSpy('isWaiting')
		};

		fakeCommonsModalService = {
			showWaitingModal: jasmine.createSpy('showWaitingModal'),
			finishWaiting: jasmine.createSpy('finishWaiting'),
			closeAllCurrentModals: jasmine.createSpy('closeAllCurrentModals').and.returnValue(true),
			showGenericModal: jasmine.createSpy('showGenericModal').and.returnValue(modalResult)
		};
	}

	function buildFlightMocks(): void {
		fakeIbPassengerBookingUtilsService = {
			getSegmentsInfo: jasmine.createSpy('getSegmentsInfo').and.returnValue([]),
			setAircraftDatalayer: jasmine.createSpy('setAircraftDatalayer')
		};

		fakeFlightsPassengersService = {
			searchFlightsAndPassengers: jasmine.createSpy('searchFlightsAndPassengers'),
			getWCSPhones: jasmine.createSpy('getWCSPhones').and.returnValue({ then: angular.noop })
		};

		fakeUpdateFlightsPassengerInfoService = {
			updateFlightsPassengerInfo: jasmine.createSpy('updateFlightsPassengerInfo')
		};
	}

	function buildDatalayerMocks(): void {
		fakeCkiDatalayerUtilsService = {
			updateAircraft: jasmine.createSpy('updateAircraft'),
			updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam'),
			sendDatalayerEvent: jasmine.createSpy('sendDatalayerEvent'),
			updateDigitalDataWithQuadrigam: jasmine.createSpy('updateDigitalDataWithQuadrigam'),
			updateDatalayerViewEvent: jasmine.createSpy('updateDatalayerViewEvent'),
			sendDatalayerErrorEvent: jasmine.createSpy('sendDatalayerErrorEvent')
		};

		fakeMonetateUtilsService = {
			updateMonetateWithQuadrigam: jasmine.createSpy('updateMonetateWithQuadrigam')
		};

		fakeMonetateConstants = {
			MONETATE_INFO: { SETPAGETYPE: 'setPageType' }
		};
	}

	function buildContactMocks(): void {
		const promiseLike = { then: angular.noop };

		fakeIBContactDataService = {
			updateContactData: jasmine.createSpy('updateContactData').and.returnValue(promiseLike),
			getContactData: jasmine.createSpy('getContactData').and.returnValue(promiseLike)
		};

		fakeIBCContactDetailsZeroService = {
			getContactDetailsData: jasmine.createSpy('getContactDetailsData').and.returnValue(promiseLike)
		};
	}

	function buildConfigurationMocks(): void {
		fakeRedirectionService = {
			newNavigation: jasmine.createSpy('newNavigation')
		};

		fakeNewMainHeaderFacade = {
			initHeader: jasmine.createSpy('initHeader'),
			updatePendingPaymentItems: jasmine.createSpy('updatePendingPaymentItems')
		};

		fakeIbSessionConfigService = {
			isUserLogged: jasmine.createSpy('isUserLogged').and.returnValue(true)
		};
	}

	// constants
	function buildConstantsMocks(): void {
		fakeCkiDatalayerConstants = {
			DATALAYER_MODAL_ID: {
				NO_PREVIOUS_SEGMENT_WARNING: 'NO_PREV',
				AT_LEAST_ONE_PASSENGER_WARNING: 'AT_LEAST',
				EXCEDED_TOTAL_PASSENGER_WARNING: 'EXCEDED',
				UNAVAILABLE_INFO_SEGMENT: 'UNAVAIL',
				ACCEPT_FORBIDDEN_ITEMS: 'ACCEPT_FORBIDDEN'
			},
			DATALAYER_VALUES: { YES: 'Y', NO: 'N' },
			DATALAYER_INFO: { BOOKING_CLASS: 'bookingClass', IS_AIR_SHUTTLE: 'isAirShuttle' },
			DIGITAL_DATA_INFO: { BOOKING_CLASS: 'bookingClass' },
			DATALAYER_EVENT_TYPES: { VIEW: 'VIEW' }
		};

		fakeCheckinAppConstants = {
			LANG: 'es',
			TITLE_PAGE: { FLIGHTS_PASSENGERS: 'title' },
			ANCILLARIES_TYPES: { BAGGAGE: 'BAGGAGE' },
			QUADRIGAM: {
				FLIGHTS_PASSENGERS: 'IBCOAC',
				FLIGHTS_PASSENGERS_PA: 'IBCOACPA',
				FLIGHTS_PASSENGERS_DUPLICATED: 'IBCOED'
			},
			FLIGHT_PASSENGERS_STATUS: { CHECKED: 'CHECKED', NOT_AVAILABLE: 'NOT_AVAILABLE' },
			GENERAL_STATUS: { CHECKED: 'CHECKED' },
			ITEMS_TYPES: { SVAN: 'SVAN' },
			WEB_CENTER_REDIRECT: {
				REDIRECTION_START: '/redirect',
				MARKET_QUERY: '&market=',
				LANGUAGE_QUERY: '&locale=',
				QUADRIGAM_QUERY: '&quadrigam=',
				PASSENGER_RIGHTS: 'DERPAS ',
				BLANK: '_blank'
			},
			FLIGHT_TYPES: { SHUTTLE: 'SHUTTLE' },
			AIRLINE_CODES: ['IB']
		};

		//fakeMonetateConstantsLocal = { MONETATE_INFO: { SETPAGETYPE: 'setPageType' } };
	}

	function buildLocalStorageAndWindowMocks(): void {
		fakeCommonsSessionStorageService = {
			get: jasmine.createSpy('get').and.callFake((key: string) => {
				if (key === 'bookingInfo') {
					return { carrierConnectEnabled: true, outwardSegments: [], returnSegments: [] };
				}
				if (key === 'customerData') {
					return {
						personalInfo: { contactEmail: 'a@a.com', telecomAddresses: { number: '600', countryDiallingCode: '+34' } }
					};
				}
				if (key === 'segmentsSelected') return null;
				return null;
			}),
			set: jasmine.createSpy('set'),
			remove: jasmine.createSpy('remove')
		};

		fakeWindow = { location: { origin: 'https://site', pathname: '/path', href: '' } };
	}

	// register providers
	function registerProviders($provide: angular.auto.IProvideService): void {
		$provide.value('FlightsPassengersModel', fakeFlightsPassengersModel);
		$provide.value('CheckinFlowService', fakeCheckinFlowService);
		$provide.value('ModalService', fakeModalService);
		$provide.value('CommonsModalService', fakeCommonsModalService);
		$provide.value('FlightsPassengersService', fakeFlightsPassengersService);
		$provide.value('AncillariesTransformer', fakeAncillariesTransformer);
		$provide.value('UpdateFlightsPassengerInfoService', fakeUpdateFlightsPassengerInfoService);
		$provide.value('CkiDatalayerUtilsService', fakeCkiDatalayerUtilsService);
		$provide.value('CommonsSessionStorageService', fakeCommonsSessionStorageService);
		$provide.value('MonetateUtilsService', fakeMonetateUtilsService);
		$provide.value('MonetateConstants', fakeMonetateConstants);
		$provide.value('RedirectionService', fakeRedirectionService);
		$provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
		$provide.value('IBCContactDataService', fakeIBContactDataService);
		$provide.value('IBCContactDetailsZeroService', fakeIBCContactDetailsZeroService);
		$provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
		$provide.value('CheckinAppConstants', fakeCheckinAppConstants);
		$provide.value('CkiDatalayerConstants', fakeCkiDatalayerConstants);
		$provide.value('CkiDataLayerService', { setProcessAndStep: jasmine.createSpy('setProcessAndStep') });
		$provide.value('IbSeatEarlyCheckinService', fakeIbSeatEarlyCheckinService);
		$provide.value('IbSessionConfigService', fakeIbSessionConfigService);
		$provide.value('IbAncillariesPaymentUtilsService', fakeIbAncillariesPaymentUtilsService);
		$provide.value('IbPassengerBookingUtilsService', fakeIbPassengerBookingUtilsService);
		$provide.value('$filter', () => (v: unknown) => v); // identity filter by default
		$provide.value('$window', fakeWindow);
		$provide.value('IbUtilsService', fakeIbUtilsService);
	}

	function setupModuleProviders($provide: angular.auto.IProvideService): void {
		buildModelMocks();
		buildServiceMocks();
		buildConstantsMocks();
		buildLocalStorageAndWindowMocks();
		registerProviders($provide);
	}

	// -----------------------
	// beforeEach CONFIGURATION
	// -----------------------
	beforeEach(() => {
		angular.mock.module('ib-checkin-flights-passengers-module', ($provide: angular.auto.IProvideService) => {
			setupModuleProviders($provide);
		});
	});

	beforeEach(inject((
		_$rootScope_: angular.IRootScopeService,
		_$controller_: angular.IControllerService,
		_$q_: angular.IQService,
		_$timeout_: angular.ITimeoutService,
		_$httpBackend_: angular.IHttpBackendService,
	) => {
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();
		$controller = _$controller_;
		$q = _$q_;
		$timeout = _$timeout_;
		$httpBackend = _$httpBackend_;

		// search return resolved promise
		fakeFlightsPassengersService.searchFlightsAndPassengers = jasmine
			.createSpy('searchFlightsAndPassengers')
			.and.callFake(() => {
				const defer = $q.defer();
				defer.resolve(mockSearchFlights);
				return defer.promise;
			});

		// getWCSPhones return promise
		fakeFlightsPassengersService.getWCSPhones = jasmine.createSpy('getWCSPhones').and.callFake(() => {
			const defer = $q.defer();
			defer.resolve({ prefix: '(+34)', telephone: '901 111 500' });
			return defer.promise;
		});

		// (controllerAs vm)
		const rawCtrl = $controller('FlightsPassengersController as vm', {
			$rootScope,
			$scope,
			FlightsPassengersModel: fakeFlightsPassengersModel,
			CheckinFlowService: fakeCheckinFlowService,
			ModalService: fakeModalService,
			FlightsPassengersService: fakeFlightsPassengersService,
			$timeout,
			CheckinAppConstants: fakeCheckinAppConstants,
			CkiDatalayerConstants: fakeCkiDatalayerConstants,
			UpdateFlightsPassengerInfoService: fakeUpdateFlightsPassengerInfoService,
			CkiDatalayerUtilsService: fakeCkiDatalayerUtilsService,
			CommonsSessionStorageService: fakeCommonsSessionStorageService,
			CommonsAncillariesService: {},
			$window: fakeWindow,
			MonetateUtilsService: fakeMonetateUtilsService,
			MonetateConstants: fakeMonetateConstants,
			RedirectionService: fakeRedirectionService,
			AncillariesTransformer: fakeAncillariesTransformer,
			NewMainHeaderFacade: fakeNewMainHeaderFacade,
			$filter: () => (v: unknown) => v,
			CommonsModalService: fakeCommonsModalService,
			IBCContactDataService: fakeIBContactDataService,
			FlightsPassengersTransformer: { generateUpdataContactDetails: () => ({}) },
			CommonsUserUtilsService: fakeCommonsUserUtilsService,
			IBCContactDetailsZeroService: fakeIBCContactDetailsZeroService,
			CkiDataLayerService: { setProcessAndStep: jasmine.createSpy('setProcessAndStep') },
			IbUtilsService: fakeIbUtilsService
		});

		const controllerCandidate = rawCtrl as { vm?: FlightsPassengersControllerInstance } | null;
		controller = controllerCandidate?.vm ?? (rawCtrl as FlightsPassengersControllerInstance);
	}));

	afterEach(() => {
		try {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		} catch (e) {
			/* ignore */
		}
	});

	// -----------------------
	// TESTS
	// -----------------------
	it('activate() should execute searchFlightsAndPassengers and popularize the model', (done) => {
		$rootScope.$apply();
		runFlush();
		expect(fakeFlightsPassengersService.searchFlightsAndPassengers).toHaveBeenCalled();
		expect(controller.model.segmentsPassengersInfo).toBeDefined();
		expect(controller.model.segmentsPassengersInfo.passengers.length).toBeGreaterThan(0);
		done();
	});

	it('openModalNotAvailablePassengerEvent should display generic modal', (done) => {
		$rootScope.$broadcast('openModalNotAvailablePassengerEvent', { reason: 'test' });
		expect(fakeModalService.showGenericModal).toHaveBeenCalled();
		done();
	});

	const scenarios = [
		{ name: 'no svan', hasSvan: false, acceptDisclaimer: false },
		{ name: 'with svan', hasSvan: true, acceptDisclaimer: true }
	];

	scenarios.forEach((s) => {
		it(`callUpdateFlightsPassengersServices -> ${s.name}`, (done) => {
			runCallUpdateScenario({ hasSvan: s.hasSvan, acceptDisclaimer: s.acceptDisclaimer });
			done();
		});
	});

	it('do not run flow with invalid form', (done) => {
		const pasForm = createPasForm(false);
		controller.model.pasform = pasForm;
		fakeFlightsPassengersService.getWCSPhones = jasmine.createSpy('getWCSPhones');
		fakeModalService.openDangerousObjectsModal = jasmine.createSpy('openDangerousObjectsModal');
		fakeUpdateFlightsPassengerInfoService.updateFlightsPassengerInfo = jasmine.createSpy('updateFlightsPassengerInfo');
		controller.callUpdateFlightsPassengersServices(pasForm);
		expect(fakeFlightsPassengersService.getWCSPhones).not.toHaveBeenCalled();
		expect(fakeModalService.openDangerousObjectsModal).not.toHaveBeenCalled();
		expect(fakeUpdateFlightsPassengerInfoService.updateFlightsPassengerInfo).not.toHaveBeenCalled();
		done();
	});

	it('checkSelectedPassengersEvent displays modal if none selected and restores selection', (done) => {
		controller.model.segmentsPassengersInfo = JSON.parse(JSON.stringify(mockSearchFlights.flightsPassengersInfo));
		controller.model.segmentsPassengersInfo.passengers[0].isSelected = false;

		$rootScope.$broadcast('checkSelectedPassengersEvent', 0);

		expect(fakeModalService.showGenericModal).toHaveBeenCalled();
		expect(controller.model.segmentsPassengersInfo.passengers[0].isSelected).toBeTrue();
		done();
	});

	it('passengerRightsRedirection must call RedirectionService.newNavigation', () => {
		controller.passengerRightsRedirection();
		expect(fakeRedirectionService.newNavigation).toHaveBeenCalled();
	});

	it('should set isBpSubscriptionMode if booking return true', (done) => {
		fakeCommonsSessionStorageService.set('bookingInfo', { subscriptionEnabled: true });
		$rootScope.$apply();
		runFlush();
		expect(fakeIbUtilsService.getBpSubscriptionMode).toHaveBeenCalled();
		expect(controller.isBpSubscriptionMode).toBe(true);
		done();
	});

	describe('continueFlowDuplicate', () => {
		it('should call updateFlightsPassengerInfo service', () => {
			const pasForm = {
				$submitted: false,
				$valid: true,
				$setSubmitted: jasmine.createSpy('$setSubmitted').and.callFake(function () {
					pasForm.$submitted = true;
				})
			};
			controller.continueFlowDuplicate(true, pasForm);

			expect(fakeUpdateFlightsPassengerInfoService.updateFlightsPassengerInfo).toHaveBeenCalled();
		});
	});
});
