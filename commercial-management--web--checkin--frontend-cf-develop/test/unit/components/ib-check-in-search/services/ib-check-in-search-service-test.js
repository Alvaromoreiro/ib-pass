describe('CheckinSearchService', function () {
    'use strict';

    let CheckinSearchService = null;
    let $q = null;
    let $rootScope = null;

    let sessionData = {};
    let params = {};
    let locationSearch = {};

    let CommonsCheckLoginWCSService = null;
    let GetFrequentFlyersService = null;
    let ModalService = null;
    let CommonsModalService = null;
    let $cookies = null;
    let $location = null;
    let CommonsSessionStorageService = null;
    let SearchFlightsPassengersService = null;
    let CkiDatalayerUtilsService = null;
    let UpdateFlightsPassengerInfoService = null;
    let GetCKICachedInformationService = null;
    let EndpointsService = null;
    let CkiCommonsGetLoginInfoService = null;
    let CommonsUserUtilsService = null;
    let CommonsLoginUtilsService = null;
    let FlightsPassengersService = null;
    let NewMainHeaderFacade = null;
    let IbSessionConfigService = null;
    let IbAncillariesPaymentUtilsService = null;
    let IbUtilsService = null;

    const CkiDatalayerConstants = {
        DATALAYER_MODAL_ID: {
            PRIVATE_BROWSER_ERROR: 'private_browser_error'
        },

        DATALAYER_VALUES: {
            INIT_IB_PLUS: 'ib_plus',
            INIT_LOCATOR: 'locator'
        }
    };

    const CheckinAppConstants = {
        URL_PARAMS: {
            PNR: 'pnr',
            SURNAME: 'surname',
            MARKET: 'market',
            LANGUAGE: 'language',
            CHANNEL: 'channel',
            DEVICE: 'device',
            ERROR_CODE: 'codeError',
            CODE: 'code',
            PAYMENT_STATUS: 'paymentStatus',
            COMPONENT_TYPE: 'componentType',
            TRAVEL_AGENT: 'travelAgent',
            CKI_AAVV: 'ckiAavv',
            UNDOCKI: 'undoCki'
        },
        UNDOCHECKIN: {
            CKI_AAVV: 'ckiAavv',
            UNDOCKI: 'undoCki',
            TRAVEL_AGENT: 'travelAgent'
        },

        SHUTTLE_NEXT_STEPS: {
            BOARDING_CARDS: 'BOARDING_CARDS'
        },

        COOKIES: {
            DYNAMIC_PRICING: 'dynamicPricing'
        },

        HASH_PAGES: {
            CHECKIN: '#/checkin',
            UNDOCHECKIN: '#/undocheckin'
        },

        QUADRIGAM: {
            UN_SEARCH: 'unsearch'
        },

        USER_PARAMS: {
            SURNAME: 'surname',
            PNR: 'pnr'
        },

        FLIGHTTYPE: 'CHECKIN'
    };

    function initializeStorageData() {
        sessionData = {};
        params = {};
        locationSearch = {};
    }

    function initializeLoginServices() {
        CommonsCheckLoginWCSService = {
            generateSSOInfo: jasmine.createSpy('generateSSOInfo')
                .and.returnValue({ isLogged: false })
        };

        GetFrequentFlyersService = {
            getFrequentFlyers: jasmine.createSpy('getFrequentFlyers')
        };

        CkiCommonsGetLoginInfoService = {
            checkCustomerStatus: jasmine.createSpy('checkCustomerStatus')
        };

        CommonsUserUtilsService = {
            isSoftUser: jasmine.createSpy('isSoftUser').and.returnValue(false),
            isUserLoggedONB: jasmine.createSpy('isUserLoggedONB')
                .and.returnValue(false)
        };

        CommonsLoginUtilsService = {
            updateStateToAnonymous: jasmine.createSpy('updateStateToAnonymous')
        };
    }

    function initializeModalServices() {
        ModalService = {
            isWaiting: jasmine.createSpy('isWaiting'),
            isNotWaiting: jasmine.createSpy('isNotWaiting'),
            openGenericModal: jasmine.createSpy('openGenericModal'),
            setErrorMessage: jasmine.createSpy('setErrorMessage'),
            setErrorCode: jasmine.createSpy('setErrorCode'),
            isError: jasmine.createSpy('isError')
        };

        CommonsModalService = {
            showWaitingModal: jasmine.createSpy('showWaitingModal'),
            finishWaiting: jasmine.createSpy('finishWaiting'),
            showGenericDynamicModal: jasmine.createSpy('showGenericDynamicModal')
        };
    }

    function initializeBrowserServices() {
        $cookies = {
            get: jasmine.createSpy('get')
        };

        $location = {
            path: jasmine.createSpy('path'),
            replace: jasmine.createSpy('replace'),
            search(value) {
                if (arguments.length) {
                    locationSearch = value;
                    return $location;
                }

                return locationSearch;
            }
        };

        CommonsSessionStorageService = {
            isSupported: true,

            get: jasmine.createSpy('get').and.callFake(function (key) {
                return sessionData[key];
            }),

            set: jasmine.createSpy('set').and.callFake(function (key, value) {
                sessionData[key] = value;
            }),

            remove: jasmine.createSpy('remove').and.callFake(function (key) {
                delete sessionData[key];
            })
        };
    }

    function initializeSearchServices() {
        SearchFlightsPassengersService = {
            searchFlighsPassengersByLocatorAndSurname:
                jasmine.createSpy('searchFlighsPassengersByLocatorAndSurname'),

            searchFlighsPassengersDeepLink:
                jasmine.createSpy('searchFlighsPassengersDeepLink')
        };

        FlightsPassengersService = {
            searchFlightsAndPassengers:
                jasmine.createSpy('searchFlightsAndPassengers')
        };

        UpdateFlightsPassengerInfoService = {
            updateFlightsPassengerInfo:
                jasmine.createSpy('updateFlightsPassengerInfo')
        };

        GetCKICachedInformationService = {
            getCachedInformation: jasmine.createSpy('getCachedInformation')
        };
    }

    function initializeUtilityServices() {
        CkiDatalayerUtilsService = {
            updateDatalayerInitType:
                jasmine.createSpy('updateDatalayerInitType')
        };

        EndpointsService = {
            getEndpoints: jasmine.createSpy('getEndpoints')
        };

        NewMainHeaderFacade = {
            initHeader: jasmine.createSpy('initHeader')
        };

        IbSessionConfigService = {
            initStorage: jasmine.createSpy('initStorage'),
            saveEndpoints: jasmine.createSpy('saveEndpoints'),
            setPNR: jasmine.createSpy('setPNR')
        };

        IbAncillariesPaymentUtilsService = {
            getInfoHeader: jasmine.createSpy('getInfoHeader')
        };

        IbUtilsService = {
            getParameterByName: jasmine.createSpy('getParameterByName')
                .and.callFake(function ({ name }) {
                    return Object.prototype.hasOwnProperty.call(params, name)
                        ? params[name]
                        : null;
                }),
            getTravelAgencies: jasmine.createSpy('getTravelAgencies')
                .and.returnValue(false),
            generateBuildNumberQueryString:
                jasmine.createSpy('generateBuildNumberQueryString')
                    .and.returnValue('build=123')
        };
    }

    beforeEach(function () {
        initializeStorageData();
        initializeLoginServices();
        initializeModalServices();
        initializeBrowserServices();
        initializeSearchServices();
        initializeUtilityServices();
    });

    beforeEach(angular.mock.module('ib-check-in-search', function ($provide) {
        $provide.value('CommonsCheckLoginWCSService', CommonsCheckLoginWCSService);
        $provide.value('GetFrequentFlyersService', GetFrequentFlyersService);
        $provide.value('ModalService', ModalService);
        $provide.value('CommonsModalService', CommonsModalService);
        $provide.value('$cookies', $cookies);
        $provide.value('$location', $location);
        $provide.value('CommonsSessionStorageService', CommonsSessionStorageService);
        $provide.value('SearchFlightsPassengersService', SearchFlightsPassengersService);
        $provide.value('CkiDatalayerUtilsService', CkiDatalayerUtilsService);
        $provide.value('UpdateFlightsPassengerInfoService', UpdateFlightsPassengerInfoService);
        $provide.value('GetCKICachedInformationService', GetCKICachedInformationService);
        $provide.value('EndpointsService', EndpointsService);
        $provide.value('CkiCommonsGetLoginInfoService', CkiCommonsGetLoginInfoService);
        $provide.value('CommonsUserUtilsService', CommonsUserUtilsService);
        $provide.value('CommonsLoginUtilsService', CommonsLoginUtilsService);
        $provide.value('FlightsPassengersService', FlightsPassengersService);
        $provide.value('NewMainHeaderFacade', NewMainHeaderFacade);
        $provide.value('IbSessionConfigService', IbSessionConfigService);
        $provide.value('IbAncillariesPaymentUtilsService', IbAncillariesPaymentUtilsService);
        $provide.value('IbUtilsService', IbUtilsService);

        $provide.constant('CkiDatalayerConstants', CkiDatalayerConstants);
        $provide.constant('CheckinAppConstants', CheckinAppConstants);
    }));

    beforeEach(inject(function (
        _CheckinSearchService_,
        _$q_,
        _$rootScope_
    ) {
        CheckinSearchService = _CheckinSearchService_;
        $q = _$q_;
        $rootScope = _$rootScope_;

        GetFrequentFlyersService.getFrequentFlyers.and.returnValue($q.when({}));

        EndpointsService.getEndpoints.and.returnValue($q.when({
            data: {
                endpoints: {
                    api: 'https://api.test'
                }
            }
        }));

        CkiCommonsGetLoginInfoService.checkCustomerStatus.and.returnValue(
            $q.when(true)
        );

        GetCKICachedInformationService.getCachedInformation.and.returnValue(
            $q.when({})
        );

        FlightsPassengersService.searchFlightsAndPassengers.and.returnValue(
            $q.when({
                flightsPassengersInfo: {
                    segments: [],
                    passengers: []
                }
            })
        );
    }));

    describe('getDinamicPricingCookieParameter', function () {
        it('should return true when the dynamic pricing cookie exists', function () {
            $cookies.get.and.returnValue('true');

            const result = CheckinSearchService.getDinamicPricingCookieParameter();

            expect($cookies.get).toHaveBeenCalledWith('dynamicPricing');
            expect(result).toBe(true);
        });

        it('should return false when the dynamic pricing cookie does not exist', function () {
            $cookies.get.and.returnValue(undefined);

            const result = CheckinSearchService.getDinamicPricingCookieParameter();

            expect(result).toBe(false);
        });
    });

    describe('initCheckin', function () {
        it('should open the private browser modal when sessionStorage is not supported', function () {
            CommonsSessionStorageService.isSupported = false;

            CheckinSearchService.initCheckin();

            expect(ModalService.isNotWaiting).toHaveBeenCalled();

            expect(ModalService.openGenericModal).toHaveBeenCalledWith(
                'md',
                'ibcose.vista-modal-private-browser-mode',
                true,
                {
                    idModal: 'private_browser_error'
                }
            );

            expect(EndpointsService.getEndpoints).not.toHaveBeenCalled();
        });

        it('should initialize common check-in data', function () {
            CheckinSearchService.initCheckin();
            $rootScope.$digest();

            expect(CommonsSessionStorageService.set).toHaveBeenCalledWith(
                'buildNumber',
                'build=123'
            );

            expect(CommonsSessionStorageService.set).toHaveBeenCalledWith(
                'channel',
                ''
            );

            expect(CommonsCheckLoginWCSService.generateSSOInfo)
                .toHaveBeenCalledWith(true);

            expect(IbSessionConfigService.initStorage).toHaveBeenCalled();

            expect(CommonsLoginUtilsService.updateStateToAnonymous)
                .toHaveBeenCalled();
        });

        it('should start an anonymous locator and surname search', function () {
            params.pnr = 'ABC123';
            params.surname = 'GARCIA';

            CheckinSearchService.initCheckin();
            $rootScope.$digest();

            expect(ModalService.isWaiting).toHaveBeenCalled();
            expect(EndpointsService.getEndpoints).toHaveBeenCalled();

            expect(IbSessionConfigService.saveEndpoints).toHaveBeenCalledWith({
                api: 'https://api.test'
            });

            expect(GetFrequentFlyersService.getFrequentFlyers).toHaveBeenCalled();

            expect(IbSessionConfigService.setPNR)
                .toHaveBeenCalledWith('ABC123');

            expect(CommonsSessionStorageService.set)
                .toHaveBeenCalledWith('checkinSurname', 'GARCIA');

            expect(
                SearchFlightsPassengersService.searchFlighsPassengersByLocatorAndSurname
            ).toHaveBeenCalledWith('GARCIA', 'ABC123', false);
        });

        it('should start an anonymous deep link search', function () {
            params.code = 'DEEP_LINK_CODE';

            CheckinSearchService.initCheckin();
            $rootScope.$digest();

            expect(ModalService.isWaiting).toHaveBeenCalled();

            expect(CommonsSessionStorageService.set)
                .toHaveBeenCalledWith('confirmationPNR', false);

            expect(
                SearchFlightsPassengersService.searchFlighsPassengersDeepLink
            ).toHaveBeenCalledWith('DEEP_LINK_CODE');
        });

        it('should use the logged user flow when the user is logged in', function () {
            params.code = 'LOGGED_DEEP_LINK';

            CommonsCheckLoginWCSService.generateSSOInfo.and.returnValue({
                isLogged: true
            });

            CheckinSearchService.initCheckin();
            $rootScope.$digest();

            expect(ModalService.isWaiting).toHaveBeenCalled();

            expect(CkiCommonsGetLoginInfoService.checkCustomerStatus)
                .toHaveBeenCalledWith(true);

            expect(CkiDatalayerUtilsService.updateDatalayerInitType)
                .toHaveBeenCalledWith('ib_plus');

            expect(
                SearchFlightsPassengersService.searchFlighsPassengersDeepLink
            ).toHaveBeenCalledWith('LOGGED_DEEP_LINK');
        });

        it('should redirect to the GDR error next step when GDR error information exists', function () {
            sessionData.IBERIACOM_GDR_PA_ERROR = JSON.stringify({
                nextStep: '/gdr-error'
            });

            CheckinSearchService.initCheckin();
            $rootScope.$digest();

            expect(CommonsSessionStorageService.remove)
                .toHaveBeenCalledWith('IBERIACOM_GDR_PA_ERROR');

            expect($location.path).toHaveBeenCalledWith('/gdr-error');
        });

        it('should remove invalid GDR information from sessionStorage', function () {
            sessionData.IBERIACOM_GDR_PA_ACCESS = '{invalid-json';

            CheckinSearchService.initCheckin();
            $rootScope.$digest();

            expect(CommonsSessionStorageService.remove)
                .toHaveBeenCalledWith('IBERIACOM_GDR_PA_ACCESS');
        });

        it('should show an error and continue as anonymous when logged access fails', function () {
            const error = {
                message: 'Login error',
                internalErrorCode: 'LOGIN_001'
            };

            CommonsCheckLoginWCSService.generateSSOInfo.and.returnValue({
                isLogged: true
            });

            CkiCommonsGetLoginInfoService.checkCustomerStatus.and.returnValue(
                $q.reject(error)
            );

            CheckinSearchService.initCheckin();
            $rootScope.$digest();

            expect(ModalService.isNotWaiting).toHaveBeenCalled();
            expect(ModalService.setErrorMessage).toHaveBeenCalledWith('Login error');
            expect(ModalService.setErrorCode).toHaveBeenCalledWith('LOGIN_001');
            expect(ModalService.isError).toHaveBeenCalledWith(error);

            expect(CommonsLoginUtilsService.updateStateToAnonymous)
                .toHaveBeenCalled();
        });

        it('should process the GDR check-in flow', function () {
            sessionData.IBERIACOM_GDR_PA_ACCESS = JSON.stringify({
                checkinId: 'CHECKIN-1',
                nextStep: 'BOARDING_CARDS',
                selectedPassenger: ['PAX-1', 'PAX-2'],
                selectedSegment: [{
                    id: 'SEG-1'
                }]
            });

            GetCKICachedInformationService.getCachedInformation.and.returnValue(
                $q.when({
                    gdsLocator: 'GDS-LOCATOR'
                })
            );

            FlightsPassengersService.searchFlightsAndPassengers.and.returnValue(
                $q.when({
                    flightsPassengersInfo: {
                        segments: [{
                            id: 'SEG-1',
                            origin: 'MAD',
                            destination: 'BCN'
                        }],
                        passengers: []
                    }
                })
            );

            IbAncillariesPaymentUtilsService.getInfoHeader.and.returnValue({
                origin: 'MAD',
                destination: 'BCN'
            });

            CheckinSearchService.initCheckin();
            $rootScope.$digest();

            expect(CommonsSessionStorageService.remove)
                .toHaveBeenCalledWith('IBERIACOM_GDR_PA_ACCESS');

            expect(CommonsSessionStorageService.set)
                .toHaveBeenCalledWith('checkinPa', true);

            expect(CommonsSessionStorageService.set)
                .toHaveBeenCalledWith('flowId', 'CHECKIN-1');

            expect(CommonsSessionStorageService.set)
                .toHaveBeenCalledWith('bookingInfo', {
                    gdsLocator: 'GDS-LOCATOR'
                });

            expect(IbSessionConfigService.setPNR)
                .toHaveBeenCalledWith('GDS-LOCATOR');

            expect(FlightsPassengersService.searchFlightsAndPassengers)
                .toHaveBeenCalled();

            expect(UpdateFlightsPassengerInfoService.updateFlightsPassengerInfo)
                .toHaveBeenCalledWith(
                    [{ id: 'PAX-1' }, { id: 'PAX-2' }],
                    [{
                        id: 'SEG-1',
                        origin: 'MAD',
                        destination: 'BCN'
                    }],
                    true,
                    [],
                    jasmine.objectContaining({
                        id: 'SEG-1',
                        pasajerosSelected: [{ id: 'PAX-1' }, { id: 'PAX-2' }]
                    })
                );
        });
    });
});
