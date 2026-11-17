describe('BoardingCardsController', function () {
    'use strict';

    let controller;
    let $rootScope;
    let $scope;
    let $q;
    let $timeout;
    let $location;
    let $window;
    let localStorageService;
    let $controller;

    const controllerDependencies = {};

    const fake = {
        BoardingCardsService: {},
        ModalService: {},
        CkiDatalayerUtilsService: {},
        CkiDatalayerConstants: {},
        CheckinAppConstants: {},
        DigitalBoardingService: {},
        CommonsUtilService: {},
        BoardingsCardsModel: {},
        BoardingCardsConstants: {},
        CkiDataLayerService: {},
        deviceDetector: {},
        DatalayerEcommerceUtilsService: {},
        CommonsBrowserStorageService: {},
        IbSessionConfigService: {},
        CheckinFlowService: {},
        BoardingCardsTransformer: {}
    };

    const mock = {
        TimeSession: {
            startTime: null,
        },
        BoardingCardsService: {
            formatsList: ['PDF', 'QR'],
            showEmail: false,
            showPhone: false,
        },
        Print: {
            download: false,
            inhibitBoardingCard: null,
        },
        DigitalBoardingService: {
            digitalBoardings: {
                segments: [{ segmentId: '1' }],
            },
        },
        bookingInfo: {
            passengers: [
                { id: 'P1', name: 'John', surname: 'Doe', gender: 'MALE' },
                { id: 'P2', name: 'Jane', surname: 'Smith', gender: 'FEMALE' },
            ],
        },
        segmentsSelected: [
            {
                airCheck: { status: false },
                passengersStatus: [
                    { isSelected: true, items: ['AVIH', 'PETC'] },
                    { isSelected: true, items: [] },
                ],
            },
        ],
        acceptInfoSegments: {
            acceptedSegments: [
                {
                    id: 1,
                    passengers: [
                        { id: 'P1', messageStatus: 'SEE_AGENT_FOR_BP', status: 'CONFIRMED' },
                        { id: 'P2', messageStatus: 'OK', status: 'STANDBY' },
                    ],
                },
            ],
        },
        printBoardingCards: [
            {
                format: 'PDF',
                documents: [
                    {
                        base64Bytes: 'JVBERi0xLjQKJeLjz9MK',
                        fileName: 'boarding-pass.pdf',
                    },
                ],
            },
        ],
    };

    function resolvedPromise(value) {
        const d = $q.defer();
        d.resolve(value);
        return d.promise;
    }

    function rejectedPromise(error) {
        const d = $q.defer();
        d.reject(error);
        return d.promise;
    }

    function safeFlush() {
        try {
            $timeout.flush();
        } catch (e) { }
    }

    function digest() {
        $scope.$digest();
    }

    function initController() {
        controller = $controller('BoardingCardsController', controllerDependencies);
        safeFlush();
        digest();
        return controller;
    }

    function setSearchInfoSuccess(response = mock.BoardingCardsService) {
        fake.BoardingCardsService.searchBoardingCardsInformation.and.callFake(() => resolvedPromise(response));
    }

    function setSearchInfoError(error) {
        fake.BoardingCardsService.searchBoardingCardsInformation.and.callFake(() => rejectedPromise(error));
    }

    function setAskCardsSuccess(response = mock.Print) {
        fake.BoardingCardsService.askForBoardingCards.and.callFake(() => resolvedPromise(response));
    }

    function setAskCardsError(error = {}) {
        fake.BoardingCardsService.askForBoardingCards.and.callFake(() => rejectedPromise(error));
    }

    function setValidForm() {
        controller.passInfoForm = { $submitted: false, $valid: true };
    }

    function setInvalidForm() {
        controller.passInfoForm = { $submitted: false, $valid: false };
    }

    function runAskFlow({ flushTimeout = false } = {}) {
        controller.askForBoardingCards();
        digest();
        if (flushTimeout) $timeout.flush();
    }

    function preventDefaultEvent() {
        return { preventDefault: jasmine.createSpy('preventDefault') };
    }

    function buildSpies() {
        fake.BoardingCardsService = jasmine.createSpyObj('BoardingCardsService', [
            'searchBoardingCardsInformation',
            'askForBoardingCards',
            'checkBiometricFlow',
            'openGoogleWalletModal'
        ]);

        fake.BoardingCardsTransformer = jasmine.createSpyObj('BoardingCardsTransformer', [
            'transformInfoInhibitCards'
        ]);

        fake.DigitalBoardingService = jasmine.createSpyObj('DigitalBoardingService', [
            'getDigitalBoardingAvailability',
        ]);

        fake.BoardingCardsTransformer = jasmine.createSpyObj('BoardingCardsTransformer', [
            'transformInfoInhibitCards'
        ]);

        fake.ModalService = jasmine.createSpyObj('ModalService', [
            'isNotWaiting',
            'isError',
            'openGenericModal',
            'closeAllCurrentModals',
        ]);

        fake.IbSessionConfigService = jasmine.createSpyObj('IbSessionConfigService', [
            'isUserLogged',
        ]);
        fake.CheckinFlowService = jasmine.createSpyObj('CheckinFlowService', [
            'warnUserOnBackPressed',
            'checkConfirmationPNR',
            'priorityInhibit',
            'showPriorityAlertInhibit'
        ]);
        
        fake.IbUtilsService = jasmine.createSpyObj('IbUtilsService', [
            'Base64Decode',
            'setTitlePage'
        ]);

        fake.CkiDatalayerUtilsService = jasmine.createSpyObj('CkiDatalayerUtilsService', [
            'updateDatalayerWithQuadrigam',
            'sendDatalayerEvent',
            'updateDigitalDataWithQuadrigam',
            'updateDatalayerViewEvent',
            'updateMonetate'
        ]);

        fake.CkiDataLayerService = jasmine.createSpyObj('CkiDataLayerService', ['setProcessAndStep']);
        fake.DatalayerEcommerceUtilsService = jasmine.createSpyObj('DatalayerEcommerceUtilsService', [
            'setAddPurchase',
        ]);

        fake.BoardingsCardsModel = {
            initializeModel: jasmine.createSpy('initializeModel'),
            boardingInfo: null,
            inhibitBoardingCard: null,
        };

        fake.CommonsBrowserStorageService = jasmine.createSpyObj('CommonsBrowserStorageService', [
            'get',
        ]);
    }

    function buildConstants() {
        fake.CheckinAppConstants = {
            TITLE_PAGE: { BOARDING_CARDS: 'Boarding Cards' },
            QUADRIGAM: { BOARDING_CARDS: 'IBECBP' },
            ERROR_CODE: {
                BOARDING_DOCUMENT: {
                    INHIBIT_AIRCHECK: 'AIRCHECK',
                    INHIBIT_OTHER_CASE: 'OTHER',
                    INHIBIT_SEE_AGENT: 'SEE_AGENT',
                },
            },
            INHIBIT_ALERTS: {
                AVIH: {
                    IBECBP: {
                        TITLE: 'AVIH Title',
                        SUBTITLE_OK: 'AVIH OK',
                        SUBTITLE_KO: 'AVIH KO',
                        ICON: 'icon-avih',
                    },
                },
                PETC: {
                    IBECBP: {
                        TITLE: 'PETC Title',
                        SUBTITLE_OK: 'PETC OK',
                        SUBTITLE_KO: 'PETC KO',
                        ICON: 'icon-petc',
                    },
                },
            },
            ITEMS_TYPES: {
                AVIH: 'AVIH',
                PETC: 'PETC',
                RESI: 'RESI',
                UMNR: 'UMNR',
                COUR: 'COUR',
                SEE_AGENT: 'SEE_AGENT',
            },
            FLIGHT_PASSENGERS_STATUS: {
                STANDBY: 'STANDBY',
            },
            STORAGE_KEYS: {
                BOOKING_INFO: 'BOOKING_INFO'
            }
        };

        fake.BoardingCardsConstants = {
            CHANNELS_NAMES: {
                EMAIL: 'EMAIL',
                SMS: 'SMS',
            },
            FORMATS: {
                GOOGLE_WALLET: {
                    baseURL: 'https://pay.google.com/gp/v/save/',
                },
            },
        };

        fake.CkiDatalayerConstants = {
            DATALAYER_EVENT_TYPES: { VIEW: 'view' },
            DATALAYER_MODAL_ID: {
                BOARDING_CARD_AT_LEAST_ONE_FORMAT_WARNING: 'modal-warning',
            },
        };

        fake.deviceDetector = {
            raw: {
                browser: { safari: false },
                device: { iphone: false, ipad: false, ipod: false },
            },
        };

        fake.CommonsUtilService = {};
    }

    function setDefaultSpyReturns() {
        fake.CheckinFlowService.checkConfirmationPNR.and.returnValue(false);
        fake.IbSessionConfigService.isUserLogged.and.returnValue(true);
        fake.IbUtilsService.Base64Decode.and.returnValue('decoded-string');
        fake.CheckinFlowService.priorityInhibit.and.returnValue('AVIH');
        fake.CheckinFlowService.showPriorityAlertInhibit.and.returnValue({
            showAlert: true,
            showBox: false,
            status: true,
            code: 'AVIH',
        });

        setSearchInfoSuccess(mock.BoardingCardsService);
        setAskCardsSuccess(mock.Print);

        fake.BoardingCardsService.checkBiometricFlow.and.callFake(() => resolvedPromise({}));

        fake.DigitalBoardingService.getDigitalBoardingAvailability.and.callFake(() =>
            resolvedPromise(mock.DigitalBoardingService)
        );
    }

    function provideAll($provide) {
        $provide.value('BoardingCardsService', fake.BoardingCardsService);
        $provide.value('ModalService', fake.ModalService);
        $provide.value('CkiDatalayerUtilsService', fake.CkiDatalayerUtilsService);
        $provide.value('CkiDatalayerConstants', fake.CkiDatalayerConstants);
        $provide.value('IbUtilsService', fake.IbUtilsService);
        $provide.value('CheckinAppConstants', fake.CheckinAppConstants);
        $provide.value('DigitalBoardingService', fake.DigitalBoardingService);
        $provide.value('CommonsUtilService', fake.CommonsUtilService);
        $provide.value('BoardingsCardsModel', fake.BoardingsCardsModel);
        $provide.value('BoardingCardsConstants', fake.BoardingCardsConstants);
        $provide.value('CkiDataLayerService', fake.CkiDataLayerService);
        $provide.value('deviceDetector', fake.deviceDetector);
        $provide.value('DatalayerEcommerceUtilsService', fake.DatalayerEcommerceUtilsService);
        $provide.value('CommonsBrowserStorageService', fake.CommonsBrowserStorageService);
        $provide.value('IbSessionConfigService', fake.IbSessionConfigService);
        $provide.value('IbUtilsService', fake.IbUtilsService);
        $provide.value('CheckinFlowService', fake.CheckinFlowService);
        $provide.value('BoardingCardsTransformer', fake.BoardingCardsTransformer);
    }

    function setLocalStorageDefaults() {
        localStorageService.set('PNR', 'ABC123');
        localStorageService.set('bookingInfo', mock.bookingInfo);
        localStorageService.set('biometricBoardingAssociation', false);
        localStorageService.set('confirmationPNR', false);
        localStorageService.set('passengersSelected', [{ id: 'P1' }, { id: 'P2' }]);
        localStorageService.set('segmentsSelected', mock.segmentsSelected);
        localStorageService.set('acceptInfoSegments', mock.acceptInfoSegments);
        localStorageService.set('printBoardingCards', mock.printBoardingCards);
    }

    function wireDependencies() {
        controllerDependencies.$rootScope = $rootScope;
        controllerDependencies.$scope = $scope;
        controllerDependencies.$rootScope.headerModel = {};
        controllerDependencies.$rootScope.timeSession = mock.TimeSession;
        controllerDependencies.localStorageService = localStorageService;
        controllerDependencies.$timeout = $timeout;
        controllerDependencies.$location = $location;
        controllerDependencies.$window = $window;
    }

    beforeEach(() => {
        buildSpies();
        buildConstants();

        angular.mock.module(
            'LocalStorageModule',
            'ib-boarding-cards-module',
            'ib-monetate-module',
            'ib-datalayer-module',
            ($provide) => provideAll($provide)
        );

        inject((_$rootScope_, _$controller_, _$location_, _localStorageService_, _$q_, _$timeout_, _$window_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $controller = _$controller_;
            $q = _$q_;
            $timeout = _$timeout_;
            $location = _$location_;
            $window = _$window_;
            localStorageService = _localStorageService_;

            setDefaultSpyReturns();
            setLocalStorageDefaults();
            wireDependencies();

            initController();
        });
    });

    describe('Initialization', function () {
        it('should initialize controller', function () {
            expect(controller).toBeDefined();
            expect(controller.model).toBe(fake.BoardingsCardsModel);
        });

        it('should initialize viewmodel properties', function () {
            expect(controller.showOkMessage).toBe(false);
            expect(controller.showContinueButton).toBe(false);
            expect(controller.showErrorAlert).toBe(false);
            expect(controller.sending).toBe(false);
            expect(controller.sendingOk).toBe(false);
            expect(controller.sendingError).toBe(false);
            expect(controller.onlyPdf).toBe(false);
        });

        it('should initialize showInhibitInfo', function () {
            expect(controller.showInhibitInfo).toEqual({
                showAlert: true,
                showBox: undefined,
                status: true,
                subtitleOK: '',
                subtitleKO: '',
                code: 'AVIH',
                icon: '',
            });
        });

        it('should initialize showAlertSBY', function () {
            expect(controller.showAlertSBY.status).toBeDefined();
            expect(controller.showAlertSBY.openModal).toBe(false);
            expect(controller.showAlertSBY.passengers).toBeDefined();
        });
    });

    describe('activate()', function () {
        it('should call searchBoardingCardsInformation', function () {
            expect(fake.BoardingCardsService.searchBoardingCardsInformation).toHaveBeenCalledWith(true);
        });

        it('should set page title', function () {
            expect(fake.IbUtilsService.setTitlePage).toHaveBeenCalled();
        });

        it('should update datalayer', function () {
            expect(fake.CkiDataLayerService.setProcessAndStep).toHaveBeenCalled();
        });

        it('should set device detector', function () {
            expect(controller.device).toBe(fake.deviceDetector);
        });

        it('should save noShowMessageBockBack in localStorage', function () {
            expect(localStorageService.get('noShowMessageBockBack')).toBe(true);
        });
    });

    describe('searchBoardingCardsInformationSuccess()', function () {
        it('should initialize model with received data', function () {
            expect(fake.BoardingsCardsModel.initializeModel).toHaveBeenCalled();
            expect(controller.model.boardingInfo).toEqual(mock.BoardingCardsService);
        });

        it('should set onlyPdf to false with multiple formats', function () {
            expect(controller.onlyPdf).toBe(false);
        });

        it('should save biometricStatusPassengers', function () {
            expect(localStorageService.get('biometricStatusPassengers')).toEqual(mock.BoardingCardsService);
        });

        it('should call getDigitalBoardingAvailability', function () {
            expect(fake.DigitalBoardingService.getDigitalBoardingAvailability).toHaveBeenCalled();
        });

        it('should call ModalService.isNotWaiting', function () {
            expect(fake.ModalService.isNotWaiting).toHaveBeenCalled();
        });
    });

    describe('searchBoardingCardsInformationError()', function () {
        it('should handle AIRCHECK inhibition error', function () {
            const error = {
                inhibitBoardingCard: { status: true },
                internalErrorCode: 'AIRCHECK',
            };

            setSearchInfoError(error);
            initController();

            expect(localStorageService.get('inhibitBoardingCard')).toEqual(error);
            expect(fake.ModalService.isError).toHaveBeenCalledWith(error, 'modal-boarding-card-inhibition.html', true);
        });

        it('should handle OTHER_CASE inhibition error', function () {
            const error = {
                inhibitBoardingCard: { status: true },
                internalErrorCode: 'OTHER',
            };

            setSearchInfoError(error);
            initController();

            expect(controller.model.inhibitBoardingCard).toEqual(error.inhibitBoardingCard);
        });
    });

    describe('showInputs()', function () {
        beforeEach(function () {
            controller.model.boardingInfo = {
                showEmail: false,
                showPhone: false,
            };
        });

        it('should show email input', function () {
            controller.showInputs(null, true, 'EMAIL');
            expect(controller.model.boardingInfo.showEmail).toBe(true);
        });

        it('should hide email input', function () {
            controller.showInputs(null, false, 'EMAIL');
            expect(controller.model.boardingInfo.showEmail).toBe(false);
        });

        it('should show phone input', function () {
            controller.showInputs(null, true, 'SMS');
            expect(controller.model.boardingInfo.showPhone).toBe(true);
        });

        it('should hide phone input', function () {
            controller.showInputs(null, false, 'SMS');
            expect(controller.model.boardingInfo.showPhone).toBe(false);
        });

        it('should respond to showInputsEvent for EMAIL', function () {
            $scope.$broadcast('showInputsEvent', true, 'EMAIL');
            expect(controller.model.boardingInfo.showEmail).toBe(true);
        });

        it('should respond to showInputsEvent for SMS', function () {
            $scope.$broadcast('showInputsEvent', true, 'SMS');
            expect(controller.model.boardingInfo.showPhone).toBe(true);
        });
    });

    describe('askForBoardingCards()', function () {
        beforeEach(function () {
            setValidForm();
            controller.everyAVIH = false;
            setAskCardsSuccess(mock.Print);
        });

        it('should set sending to true', function () {
            controller.askForBoardingCards();
            expect(controller.sending).toBe(true);
        });

        it('should call service when form is valid', function () {
            controller.askForBoardingCards();
            expect(fake.BoardingCardsService.askForBoardingCards).toHaveBeenCalled();
        });

        it('should mark form as submitted if invalid', function () {
            setInvalidForm();
            controller.askForBoardingCards();

            expect(controller.passInfoForm.$submitted).toBe(true);
            expect(fake.BoardingCardsService.askForBoardingCards).not.toHaveBeenCalled();
        });

        it('should allow request if everyAVIH is true', function () {
            controller.everyAVIH = true;
            controller.passInfoForm = null;

            controller.askForBoardingCards();
            expect(fake.BoardingCardsService.askForBoardingCards).toHaveBeenCalled();
        });

        it('should open google wallet modal if is carrier connect and google wallet option', () => {
            const bookingInfoMock = structuredClone(mock.bookingInfo);
            bookingInfoMock['carrierConnectEnabled'] = true;
            let modelMock = structuredClone(controller.model.boardingInfo);
            modelMock = {
              ...modelMock,
              downloadFormatSelected: [{ type: "GOOGLE_WALLET" }],
            };
            controller.model.boardingInfo = modelMock;

            localStorageService.set(fake.CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO, bookingInfoMock);

            controller.askForBoardingCards();

            expect(fake.BoardingCardsService.openGoogleWalletModal).toHaveBeenCalled();
        });
    });

    describe('sendOrDownloadCardsSuccess()', function () {
        beforeEach(function () {
            setValidForm();
            controller.everyAVIH = false;
            setAskCardsSuccess(mock.Print);
        });

        it('should set sendingOk to true', function () {
            runAskFlow();
            expect(controller.sending).toBe(false);
            expect(controller.sendingOk).toBe(true);
        });

        it('should show success message after timeout', function () {
            runAskFlow({ flushTimeout: true });

            expect(controller.showOkMessage).toBe(true);
            expect(controller.showContinueButton).toBe(true);
            expect(controller.showErrorAlert).toBe(false);
        });

        it('should save inhibitBoardingCard if present', function () {
            const response = {
                inhibitBoardingCard: { status: true },
                download: false,
            };

            setAskCardsSuccess(response);
            runAskFlow();

            expect(localStorageService.get('inhibitBoardingCard')).toEqual(response);
        });

        it('should check biometric flow if enabled', function () {
            localStorageService.set('biometricBoardingAssociation', true);

            runAskFlow({ flushTimeout: true });

            expect(fake.BoardingCardsService.checkBiometricFlow).toHaveBeenCalled();
        });
    });

    describe('sendOrDownloadCardsError()', function () {
        beforeEach(function () {
            setAskCardsError({});
            setValidForm();
            controller.everyAVIH = false;
        });

        it('should set sendingError to true', function () {
            runAskFlow();

            expect(controller.sending).toBe(false);
            expect(controller.sendingError).toBe(true);
        });

        it('should show error alert after timeout', function () {
            runAskFlow({ flushTimeout: true });

            expect(controller.showErrorAlert).toBe(true);
            expect(controller.showOkMessage).toBe(false);
        });
    });

    describe('Events', function () {
        it('should respond to atLeastOneItemEvent', function () {
            $scope.$broadcast('atLeastOneItemEvent');
            expect(fake.ModalService.openGenericModal).toHaveBeenCalled();
        });

        it('should respond to biometricNotActivated', function () {
            spyOn($location, 'path');
            $rootScope.$broadcast('biometricNotActivated');

            expect(localStorageService.get('nextStepAllowed')).toBe(false);
            expect($location.path).toHaveBeenCalledWith('/ibcocf-and-ibeccf');
        });
    });

    describe('handleModalSBY()', function () {
        it('should prevent default event', function () {
            const ev = preventDefaultEvent();
            controller.handleModalSBY(ev);
            expect(ev.preventDefault).toHaveBeenCalled();
        });

        it('should set openModal to true', function () {
            const ev = preventDefaultEvent();
            controller.handleModalSBY(ev);
            expect(controller.showAlertSBY.openModal).toBe(true);
        });
    });

    describe('downloadAttachedFile()', function () {
        beforeEach(function () {
            spyOn(window, 'Blob').and.returnValue(new Blob());
            spyOn(URL, 'createObjectURL').and.returnValue('blob:url');
            $window.open = jasmine.createSpy('open');
        });

        it('should open window on Apple devices', function () {
            controller.device.raw.device.iphone = true;

            controller.downloadAttachedFile();
            expect($window.open).toHaveBeenCalledWith('blob:url', '_blank');
        });

        it('should handle GOOGLE_WALLET format', function () {
            localStorageService.set('printBoardingCards', [
                {
                    format: 'GOOGLE_WALLET',
                    documents: [
                        {
                            base64Bytes: 'encoded-data',
                            fileName: 'wallet.pkpass',
                        },
                    ],
                },
            ]);

            fake.IbUtilsService.Base64Decode.and.returnValue('decoded-wallet-data');
            controller.downloadAttachedFile();

            expect($window.open).toHaveBeenCalledWith('https://pay.google.com/gp/v/save/decoded-wallet-data');
        });

        it('should handle multiple documents', function () {
            localStorageService.set('printBoardingCards', [
                {
                    format: 'PDF',
                    documents: [
                        { base64Bytes: 'doc1', fileName: 'file1.pdf' },
                        { base64Bytes: 'doc2', fileName: 'file2.pdf' },
                    ],
                },
            ]);

            controller.device.raw.device.iphone = false;
            controller.device.raw.browser.safari = false;

            controller.downloadAttachedFile();
            expect(window.Blob).toHaveBeenCalled();
        });
    });

    describe('Integration flow', function () {
        it('should complete successful request flow', function () {
            setValidForm();
            controller.everyAVIH = false;
            setAskCardsSuccess(mock.Print);

            controller.askForBoardingCards();
            expect(controller.sending).toBe(true);

            digest();
            expect(controller.sendingOk).toBe(true);

            $timeout.flush();
            expect(controller.showOkMessage).toBe(true);
            expect(controller.showContinueButton).toBe(true);
        });

        it('should handle error flow', function () {
            setAskCardsError({});
            setValidForm();

            controller.askForBoardingCards();
            expect(controller.sending).toBe(true);

            digest();
            expect(controller.sendingError).toBe(true);

            $timeout.flush();
            expect(controller.showErrorAlert).toBe(true);
            expect(controller.showOkMessage).toBe(false);
        });
    });
});
