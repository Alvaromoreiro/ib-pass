describe('CheckInIbPlusController', function () {
	var controllerService;
	var rootScope;
	var q;
	var timeout;
	var scope;
	var dependencies;

	beforeEach(angular.mock.module('ib-checkin-ib-plus'));

	beforeEach(inject(function ($controller, $rootScope, $q, $timeout, CheckinIbPlusModel) {
		rootScope = $rootScope;
		q = $q;
		timeout = $timeout;
		scope = rootScope.$new();

		dependencies = {
			$rootScope: rootScope,
			ModalService: {
				isWaiting: jasmine.createSpy('isWaiting'),
				finishWaiting: jasmine.createSpy('finishWaiting'),
				closeAllCurrentModals: jasmine.createSpy('closeAllCurrentModals'),
				openGenericModal: jasmine.createSpy('openGenericModal').and.returnValue({ result: q.when() })
			},
			CheckInIbPlusService: {
				searchUserLoggedBookings: jasmine.createSpy('searchUserLoggedBookings').and.returnValue(q.when({ data: [], isError: false }))
			},
			CheckinIbPlusModel: CheckinIbPlusModel,
			CkiDatalayerUtilsService: {
				resetDatalayer: jasmine.createSpy('resetDatalayer'),
				updateLoggedDatalayer: jasmine.createSpy('updateLoggedDatalayer'),
				sendDatalayerEvent: jasmine.createSpy('sendDatalayerEvent'),
				updateDatalayerInfo: jasmine.createSpy('updateDatalayerInfo'),
				updateLoggedDigitalData: jasmine.createSpy('updateLoggedDigitalData'),
				updateDatalayerInitType: jasmine.createSpy('updateDatalayerInitType'),
				updateDatalayerViewEvent: jasmine.createSpy('updateDatalayerViewEvent')
			},
			CkiDatalayerConstants: {
				DATALAYER_EVENT_TYPES: { VIEW: 'view' },
				DATALAYER_VALUES: { INIT_IB_PLUS: 'ib-plus' },
				DATALAYER_MODAL_ID: { CHECKIN_ONLINE_MORE_INFO: 'more-info' }
			},
			SearchFlightsPassengersService: {
				searchFlighsPassengersByLocatorAndSurname: jasmine.createSpy('searchFlighsPassengersByLocatorAndSurname')
			},
			$location: { path: jasmine.createSpy('path') },
			$timeout: timeout,
			localStorageService: {
				set: jasmine.createSpy('set'),
				get: jasmine.createSpy('get').and.returnValue({ generalInfo: { customer: 'data' } })
			},
			IbUtilsService: {
				cleanSpaces: jasmine.createSpy('cleanSpaces').and.callFake(function (value) {
					return value.replace(/\s/g, '');
				}),
				setTitlePage: jasmine.createSpy('setTitlePage')
			},
			CheckinAppConstants: {
				TITLE_PAGE: { LOGGED_SEARCH: 'logged-search' },
				QUADRIGAM: { LOGGED_SEARCH: 'logged-search' }
			},
			$scope: scope,
			MonetateUtilsService: { updateMonetateWithQuadrigam: jasmine.createSpy('updateMonetateWithQuadrigam') },
			MonetateConstants: { MONETATE_INFO: { SETPAGETYPE: 'setPageType' } },
			CkiCommonsGetLoginInfoService: {
				checkCustomerStatus: jasmine.createSpy('checkCustomerStatus').and.returnValue(q.when(null))
			},
			CommonsUserUtilsService: {
				isSoftUser: jasmine.createSpy('isSoftUser').and.returnValue(false),
				isIbZero: jasmine.createSpy('isIbZero').and.returnValue(false)
			},
			CkiDataLayerService: { setProcessAndStep: jasmine.createSpy('setProcessAndStep') },
			IbSessionConfigService: {
				initStorage: jasmine.createSpy('initStorage'),
				setPNR: jasmine.createSpy('setPNR')
			},
		};

		controllerService = $controller;
	}));

	function createController() {
		var controller = controllerService('CheckInIbPlusController', dependencies);
		rootScope.$digest();
		return controller;
	}

	it('should initialize the page and redirect when the customer is not logged in', function () {
		createController();

		expect(dependencies.IbUtilsService.setTitlePage).toHaveBeenCalledOnceWith('logged-search', 2100);
		expect(dependencies.ModalService.isWaiting).toHaveBeenCalledTimes(1);
		expect(dependencies.CkiDatalayerUtilsService.resetDatalayer).toHaveBeenCalledTimes(1);
		expect(dependencies.ModalService.finishWaiting).toHaveBeenCalledTimes(1);
		expect(dependencies.$location.path).toHaveBeenCalledOnceWith('/ibcose');
	});

	it('should store cleaned booking values and start the booking search', function () {
		var controller = createController();

		controller.searchBooking('DOE SMITH', 'AB C123');

		expect(dependencies.localStorageService.set).toHaveBeenCalledWith('confirmationPNR', false);
		expect(dependencies.IbSessionConfigService.setPNR).toHaveBeenCalledWith('ABC123');
		expect(dependencies.localStorageService.set).toHaveBeenCalledWith('checkinSurname', 'DOESMITH');
		expect(dependencies.SearchFlightsPassengersService.searchFlighsPassengersByLocatorAndSurname)
			.toHaveBeenCalledOnceWith('DOESMITH', 'ABC123', false);
	});

	it('should handle anonymous booking submissions from the scope', function () {
		var controller = createController();

		scope.$broadcast('anonymousSubmit', { surname: 'DOE', pnr: 'ABC123' });

		expect(dependencies.SearchFlightsPassengersService.searchFlighsPassengersByLocatorAndSurname)
			.toHaveBeenCalledOnceWith('DOE', 'ABC123', false);
		expect(controller).toBeDefined();
	});

	it('should open the requested generic modal from the scope event', function () {
		createController();

		scope.$broadcast('openGenericModal', 'large', 'more-info-template', true);
		rootScope.$digest();

		expect(dependencies.ModalService.openGenericModal).toHaveBeenCalledOnceWith(
			'large',
			'more-info-template',
			true,
			{ idModal: 'more-info' }
		);
	});

	it('should populate the model after loading bookings for a logged-in customer', function () {
		var bookings = [{ locator: 'ABC123' }];
		dependencies.CkiCommonsGetLoginInfoService.checkCustomerStatus.and.returnValue(q.when({ loggedIn: true }));
		dependencies.CheckInIbPlusService.searchUserLoggedBookings.and.returnValue(q.when({ data: bookings, isError: true }));

		var controller = createController();

		expect(controller.model.userBookings).toBe(bookings);
		expect(controller.model.finishProcess).toBe(true);
		expect(controller.model.isError).toBe(true);
		expect(dependencies.IbSessionConfigService.initStorage).toHaveBeenCalledTimes(1);
		expect(dependencies.ModalService.finishWaiting).toHaveBeenCalledTimes(1);
	});
});
