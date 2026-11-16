import { PassengersFormData, SecurityInfo } from '@src/app/core/models/ib-booking-pasenger-form/ib-booking-passenger-form.model';
import { BookingPassengersInfoController } from '@src/app/pages/ib-booking-passenger-info/ib-booking-passenger-info-controller';
import angular from 'angular';

xdescribe('BookingPassengersInfoController test', function () {
    let controller: BookingPassengersInfoController;
    let $rootScope: any;
    
    // Mock dependencies
    const mockDependencies = {
        '$scope': null,
        '$timeout': {
            cancel: jasmine.createSpy('cancel'),
            flush: jasmine.createSpy('flush')
        },
        'BookingModalService': {
            finishWaiting: jasmine.createSpy('finishWaiting'),
            showWaitingmodal: jasmine.createSpy('showWaitingModal'),
            showGenericError: jasmine.createSpy('showGenericError'),
            showGenericModal: jasmine.createSpy('showGenericModal').and.returnValue({
                result: { then: jasmine.createSpy('then') }
            })
        },
        'BookingPassengerInfoService': {
            getPassengerInfo: jasmine.createSpy('getPassengerInfo').and.returnValue(Promise.resolve({})),
            createBookingOrder: jasmine.createSpy('createBookingOrder').and.returnValue(Promise.resolve({})),
            checkFareUpdated: jasmine.createSpy('checkFareUpdated').and.returnValue(Promise.resolve({})),
            cleanErrorResidents: jasmine.createSpy('cleanErrorResidents'),
            checkCodePrefix: jasmine.createSpy('checkCodePrefix'),
            generateBookingInfoModel: jasmine.createSpy('generateBookingInfoModel'),
            checkAncillaries: jasmine.createSpy('checkAncillaries').and.returnValue(Promise.resolve(false)),
            updateCalculatedPoints: jasmine.createSpy('updateCalculatedPoints').and.returnValue(Promise.resolve({})),
            getCalculatedPoints: jasmine.createSpy('getCalculatedPoints').and.returnValue(Promise.resolve({}))
        },
        'BookingPassengerInfoConstants': {
            BIRTH_DATE_ERROR_CODE: 'BIRTH_DATE_ERROR_CODE',
            MODAL_TITLE_ERROR: 'MODAL_TITLE_ERROR'
        },
        '$location': {
            path: jasmine.createSpy('path')
        },
        'DatalayerUtilsService': {
            addDataLayerInfo: jasmine.createSpy('addDataLayerInfo'),
            addDigitalDataInfo: jasmine.createSpy('addDigitalDataInfo'),
            setAncillariesAction: jasmine.createSpy('setAncillariesAction'),
            updateDatalayerActionForAncillaries: jasmine.createSpy('updateDatalayerActionForAncillaries'),
            updateDatalayerEvent: jasmine.createSpy('updateDatalayerEvent')
        },
        'BookingUtilService': {
            isUserLogged: jasmine.createSpy('isUserLogged').and.returnValue(false),
            getURLFirstParameterByName: jasmine.createSpy('getURLFirstParameterByName'),
            checkUserMustFlyFromFare: jasmine.createSpy('checkUserMustFlyFromFare').and.returnValue(false)
        },
        'BookingAppConstants': {
            templatesRoute: '/templates/',
            LOGIN_ONB: 'LOGIN_ONB',
            LINK_TARGETS: { BLANK: '_blank' },
            DISCOUNT_TYPES: { PARTNER: 'PARTNER' },
            bookingPatterns: {
                ERROR_RESIDENT_PATTERN: /test/,
                ERROR_CONGRESSMAN_PATTERN: /test/,
                ERROR_FIRST_SURNAME: /test/,
                ERROR_FREQ_FLYER: /test/,
                ERROR_LARGE_FAMILY_DISCOUNT_PATTERN: /test/
            }
        },
        '$window': {
            scrollTo: jasmine.createSpy('scrollTo'),
            addEventListener: jasmine.createSpy('addEventListener'),
            removeEventListener: jasmine.createSpy('removeEventListener')
        },
        'CommonsSessionStorageService': {
            get: jasmine.createSpy('get'),
            set: jasmine.createSpy('set'),
            remove: jasmine.createSpy('remove')
        },
        '$filter': jasmine.createSpy('$filter').and.returnValue(jasmine.createSpy()),
        '$rootScope': null,
        'MonetateUtilsService': {
            addFlightReviewMonetate: jasmine.createSpy('addFlightReviewMonetate')
        },
        'NewMainHeaderFacade': {
            checkAdaptativeMobileFlow: jasmine.createSpy('checkAdaptativeMobileFlow').and.returnValue(false),
            updateTrips: jasmine.createSpy('updateTrips'),
            updateHeaderModel: jasmine.createSpy('updateHeaderModel'),
            updateSteps: jasmine.createSpy('updateSteps'),
            showLogin: jasmine.createSpy('showLogin'),
            setLogin: jasmine.createSpy('setLogin'),
            updateBasketDiscountsNew: jasmine.createSpy('updateBasketDiscountsNew'),
            updateTripsFromOrder: jasmine.createSpy('updateTripsFromOrder'),
            deleteDiscountFromBasket: jasmine.createSpy('deleteDiscountFromBasket'),
            addDiscountToBasket: jasmine.createSpy('addDiscountToBasket')
        },
        'CommonsUtilService': {
            getSegmentsInfo: jasmine.createSpy('getSegmentsInfo').and.returnValue([])
        },
        'CurrencyService': {
            getCurrencyObject: jasmine.createSpy('getCurrencyObject').and.returnValue({}),
            formatPrice: jasmine.createSpy('formatPrice').and.returnValue('')
        },
        'CommonsBrowserStorageService': {
            get: jasmine.createSpy('get').and.returnValue(null),
            set: jasmine.createSpy('set'),
            remove: jasmine.createSpy('remove')
        },
        '$document': {},
        'CommonsUserUtilsService': {
            isSoftUser: jasmine.createSpy('isSoftUser').and.returnValue(false),
            isIbPlus: jasmine.createSpy('isIbPlus').and.returnValue(false)
        },
        'IbCheckPartnersDiscountsService': jasmine.createSpy('IbCheckPartnersDiscountsService'),
        'DatalayerBKIService': {
            updateITravelDigitalData: jasmine.createSpy('updateITravelDigitalData')
        },
        'BookingPassengerInfoErrorManager': {
            processError: jasmine.createSpy('processError')
        },
        'BookingPageUtilsService': {
            setPageTitle: jasmine.createSpy('setPageTitle')
        },
        'IbBookingPassengerInfoUtilsService': {
            createTemporalPNRKey: jasmine.createSpy('createTemporalPNRKey'),
            generateMetasearchUrl: jasmine.createSpy('generateMetasearchUrl').and.returnValue(''),
            checkLoginOnb: jasmine.createSpy('checkLoginOnb').and.returnValue(false),
            checkPartnerDiscountFromFare: jasmine.createSpy('checkPartnerDiscountFromFare').and.returnValue(false),
            checkNewOffer: jasmine.createSpy('checkNewOffer'),
            setBasketOthers: jasmine.createSpy('setBasketOthers'),
            checkLoadPassengerHolaMadrid: jasmine.createSpy('checkLoadPassengerHolaMadrid').and.returnValue(true),
            checkShuttleOnPassengerInfo: jasmine.createSpy('checkShuttleOnPassengerInfo').and.returnValue({}),
            loadPassengerDigitalDataAndMonetate: jasmine.createSpy('loadPassengerDigitalDataAndMonetate'),
            checkToShowSoftLoginModal: jasmine.createSpy('checkToShowSoftLoginModal'),
            checkGoToPayment: jasmine.createSpy('checkGoToPayment').and.returnValue(false),
            getPassengerInfoError: jasmine.createSpy('getPassengerInfoError'),
            callNotAllowedModal: jasmine.createSpy('callNotAllowedModal'),
            restoreHeaderModel: jasmine.createSpy('restoreHeaderModel'),
            saveNewsletterSubscription: jasmine.createSpy('saveNewsletterSubscription')
        },
        'IbCModalService': jasmine.createSpy('IbCModalService'),
        'IbShortRegisterService': {
            shortRegisterComplete: jasmine.createSpy('shortRegisterComplete').and.returnValue(Promise.resolve({}))
        },
        'IbBookingRegisterTransformerService': {
            transformFormRegister: jasmine.createSpy('transformFormRegister').and.returnValue({})
        },
        'IbBookingRegisterFormDataService': {
            getPassword: jasmine.createSpy('getPassword').and.returnValue(''),
            getCheck: jasmine.createSpy('getCheck').and.returnValue(false)
        },
        'IbBookingContactFormDataService': jasmine.createSpy('IbBookingContactFormDataService'),
        'BookingUserActivityService': {
            initKeepAliveTimer: jasmine.createSpy('initKeepAliveTimer'),
            setOrderTimeoutTimer: jasmine.createSpy('setOrderTimeoutTimer')
        },
        'PassengeInfoUtilsService': {
            checkSelectedFlex: jasmine.createSpy('checkSelectedFlex').and.returnValue(''),
            checkRedemptionsAndShuttleFLows: jasmine.createSpy('checkRedemptionsAndShuttleFLows'),
            setShowbasketByFlowType: jasmine.createSpy('setShowbasketByFlowType'),
            transformPassengersToSave: jasmine.createSpy('transformPassengersToSave').and.returnValue({})
        },
        'StepsNavigationService': {
            checkButtonsActivation: jasmine.createSpy('checkButtonsActivation').and.returnValue(true)
        },
        'IbBookingPriceDetailModalService': {
            initPriceModalData: jasmine.createSpy('initPriceModalData')
        }
    };

    beforeEach(function () {
        angular.mock.module('ib-booking-passenger-info-module');
        
        inject(function ( _$rootScope_: any, _$componentController_: any) {
            $rootScope = _$rootScope_;
            mockDependencies.$scope = $rootScope.$new();
            mockDependencies.$rootScope = $rootScope;
            
            mockDependencies.CommonsSessionStorageService.get.and.callFake((key: string) => {
                const mockData: { [key: string]: any } = {
                    'oBDiscountType': null,
                    'pointsChecked': false,
                    'fareData': {},
                    'flowApp': 'BBKI',
                    'headerModel': {
                        headerModel: {
                            shoppingBasket: {
                                showBasket: false,
                                discountsModel: { discounts: {}, total: 0, hasDiscounts: false },
                                segmentsInfo: [],
                                total: { totalPrice: 0 }
                            }
                        },
                        greyBarModel: { show: false }
                    },
                    'actualStepFlow': 1,
                    'customerData': {}
                };
                return mockData[key] || null;
            });
            controller = _$componentController_('ibBookingPassengersInfoComponent', mockDependencies, {});

        });
    });

    describe('when BookingPassengersInfoController is initialized', function () {
   

        it('should create controller instance', function () {
            expect(controller).toBeDefined();
        });

        it('should initialize model with passengersFormData', function () {
            expect(controller.model).toBeDefined();
            expect(controller.model.passengersFormData).toBeNull();
        });

        it('should set initial properties from constructor', function () {
            expect(controller.LOGIN_ONB).toBe('LOGIN_ONB');
            expect(controller.isUserLogged).toBe(false);
            expect(controller.checkSavePassengersData).toBe(false);
            expect(controller.userWantsRegister).toBe(false);
            expect(controller.showLostShoppingCartLightbox).toBe(false);
            expect(controller.showPartnerFreeOnHold).toBe(false);
            expect(controller.userSuitableForPartnerDiscount).toBe(false);
            expect(controller.showIbPlusUserDataWarning).toBe(false);
            expect(controller.registerFormValid).toBe(true);
            expect(controller.contactFormValid).toBe(true);
            expect(controller.passengerFormValid).toBe(true);
            expect(controller.birthDateFormValid).toBe(false);
            expect(controller.setPassengersDataToLocalStorage).toBe(false);
            expect(controller.fillResidentChecked).toBe(false);
            expect(controller.fillLargeFamilyChecked).toBe(false);
        });

        it('should initialize oBDiscountType and pointsChecked from session storage', function () {
            expect(mockDependencies.CommonsSessionStorageService.get).toHaveBeenCalledWith('oBDiscountType');
            expect(mockDependencies.CommonsSessionStorageService.get).toHaveBeenCalledWith('pointsChecked');
        });

        it('should remove specific session storage items', function () {
            expect(mockDependencies.CommonsSessionStorageService.remove).toHaveBeenCalledWith('isRegisterSuccesfull');
            expect(mockDependencies.CommonsSessionStorageService.remove).toHaveBeenCalledWith('isRegister');
        });

        it('should initialize lostShoppingCartLightbox configuration', function () {
            expect(controller.lostShoppingCartLightbox).toBeDefined();
            expect(controller.lostShoppingCartLightbox.type).toBe('generic-lightbox');
            expect(controller.lostShoppingCartLightbox.title).toBe('NOTICE_CONSENT_TITLE');
            expect(controller.lostShoppingCartLightbox.text).toBe('NOTICE_CONSENT_TEXT');
        });

        it('should check adaptative mobile flow', function () {
            expect(mockDependencies.NewMainHeaderFacade.checkAdaptativeMobileFlow).toHaveBeenCalled();
        });

        it('should set up event listeners', function () {
            expect(mockDependencies.$window.addEventListener).toHaveBeenCalledWith('nextStepFlowLegacy', jasmine.any(Function));
        });
    });

    describe('deletePartnerDiscount', function () {
        const currency = { code: 'EUR' };
        const discount = { totalDiscount: 50 };
        const fareData = { offers: [{ price: { total: 200 } }] };

        beforeEach(function () {
            mockDependencies.CommonsSessionStorageService.get.and.callFake((key: string) => {
                if (key === 'fareData') return fareData;
                return null;
            });
            mockDependencies.CurrencyService.formatPrice.and.returnValue('250 EUR');
            mockDependencies.NewMainHeaderFacade.deleteDiscountFromBasket.calls.reset();
            controller.model = { passengersFormData: { securityInfo: { totalPrice: null } as SecurityInfo } as PassengersFormData };
        });

        it('should call addDigitalDataInfo with EligibleVoucher NO', function () {
            controller.deletePartnerDiscount(discount, currency);
            expect(mockDependencies.DatalayerUtilsService.addDigitalDataInfo).toHaveBeenCalledWith({ EligibleVoucher: 'NO' });
        });

        it('should call deleteDiscountFromBasket with PARTNER type', function () {
            controller.deletePartnerDiscount(discount, currency);
            expect(mockDependencies.NewMainHeaderFacade.deleteDiscountFromBasket).toHaveBeenCalledWith(mockDependencies.BookingAppConstants.DISCOUNT_TYPES.PARTNER);
        });

        it('should update totalPrice adding discount to fare total', function () {
            controller.deletePartnerDiscount(discount, currency);
            expect(mockDependencies.CurrencyService.formatPrice).toHaveBeenCalledWith(currency, 250, true);
            expect(controller.model.passengersFormData.securityInfo.totalPrice).toBe('250 EUR');
        });
    });

    describe('addPartnerDiscount', function () {
        const currency = { code: 'EUR' };
        const totalPriceWithDiscount = '150 EUR';

        beforeEach(function () {
            mockDependencies.CurrencyService.formatPrice.and.returnValue('40 EUR');
            mockDependencies.NewMainHeaderFacade.addDiscountToBasket.calls.reset();
            controller.model = {
                passengersFormData: {
                    securityInfo: {
                        totalPrice: null,
                        totalPriceWithDiscount
                    } as SecurityInfo
                } as PassengersFormData
            };
        });

        it('should use discount.discount when it is truthy', function () {
            mockDependencies.CurrencyService.formatPrice.calls.reset();
            const discount = { discount: '40 EUR', totalDiscount: 40, voucherId: 'V1', description: 'desc' };
            controller.addPartnerDiscount(discount, currency);
            expect(mockDependencies.CurrencyService.formatPrice).not.toHaveBeenCalled();
        });

        it('should calculate discount via CurrencyService when discount.discount is falsy', function () {
            const discount = { discount: null, totalDiscount: 40, voucherId: 'V1', description: 'desc' };
            controller.addPartnerDiscount(discount, currency);
            expect(mockDependencies.CurrencyService.formatPrice).toHaveBeenCalledWith(currency, 40, true);
        });

        it('should call addDiscountToBasket with the built discount model', function () {
            const discount = { discount: '40 EUR', totalDiscount: 40, voucherId: 'V1', description: 'My desc' };
            controller.addPartnerDiscount(discount, currency);
            expect(mockDependencies.NewMainHeaderFacade.addDiscountToBasket).toHaveBeenCalledWith(jasmine.objectContaining({
                type: 'PARTNER',
                voucherId: 'V1',
                description: 'My desc',
                totalDiscount: 40
            }));
        });

        it('should set totalPrice to totalPriceWithDiscount', function () {
            const discount = { discount: '40 EUR', totalDiscount: 40, voucherId: 'V1', description: 'desc' };
            controller.addPartnerDiscount(discount, currency);
            expect(controller.model.passengersFormData.securityInfo.totalPrice).toBe(totalPriceWithDiscount);
        });
    });

    describe('savePassengersData', function () {
        const mockPassengerData = { contactData: { name: 'John' } };

        beforeEach(function () {
            mockDependencies.PassengeInfoUtilsService.transformPassengersToSave.and.returnValue(mockPassengerData);
            mockDependencies.CommonsBrowserStorageService.set.calls.reset();
            mockDependencies.CommonsBrowserStorageService.remove.calls.reset();
            mockDependencies.CommonsSessionStorageService.set.calls.reset();
            controller.model = { passengersFormData: { securityInfo: {} } } as any;
        });

        it('should store data in browserStorage and return early when user is not logged and persist is true', function () {
            controller.isUserLogged = false;
            controller.savePassengersData(true);
            expect(mockDependencies.CommonsBrowserStorageService.set).toHaveBeenCalledWith('passengersDataByCheck', mockPassengerData);
            expect(mockDependencies.CommonsSessionStorageService.set).not.toHaveBeenCalledWith('passengersFormData', jasmine.anything());
        });

        it('should store data in sessionStorage and remove from browserStorage when user is logged', function () {
            controller.isUserLogged = true;
            controller.savePassengersData(true);
            expect(mockDependencies.CommonsSessionStorageService.set).toHaveBeenCalledWith('passengersFormData', mockPassengerData);
            expect(mockDependencies.CommonsBrowserStorageService.remove).toHaveBeenCalledWith('passengersDataByCheck');
        });

        it('should store data in sessionStorage when persist is false (regardless of login)', function () {
            controller.isUserLogged = false;
            controller.savePassengersData(false);
            expect(mockDependencies.CommonsSessionStorageService.set).toHaveBeenCalledWith('passengersFormData', mockPassengerData);
            expect(mockDependencies.CommonsBrowserStorageService.remove).toHaveBeenCalledWith('passengersDataByCheck');
        });
    });

    describe('checkIfExistsPassengersDataToLocalStorage', function () {
        beforeEach(function () {
            mockDependencies.CommonsBrowserStorageService.get.calls.reset();
            mockDependencies.CommonsBrowserStorageService.get.and.returnValue(null);
            controller.model = { passengersFormData: { securityInfo: { contactData: null, isResident: false } } } as any;
            (controller as any).setContactInfo = jasmine.createSpy('setContactInfo');
            (controller as any).checkEmailsConsent = jasmine.createSpy('checkEmailsConsent');
            (controller as any).checkPassengersStorage = jasmine.createSpy('checkPassengersStorage');
        });

        it('should return early when user is logged and no sessionStorage data exists', function () {
            controller.isUserLogged = true;
            mockDependencies.CommonsSessionStorageService.get.and.returnValue(null);
            controller.checkIfExistsPassengersDataToLocalStorage();
            expect((controller as any).setContactInfo).not.toHaveBeenCalled();
        });

        it('should do nothing when previousPassengersData is empty', function () {
            controller.isUserLogged = false;
            mockDependencies.CommonsSessionStorageService.get.and.returnValue(null);
            controller.checkIfExistsPassengersDataToLocalStorage();
            expect((controller as any).setContactInfo).not.toHaveBeenCalled();
            expect(controller.setPassengersDataToLocalStorage).toBe(false);
        });

        const storageLoadCases = [
            {
                desc: 'should load data from browserStorage when available',
                browserData: { contactData: { contactEmail: 'test@test.com' }, passengers: [] } as any,
                sessionData: null as any,
                expectedCheckSave: true,
                emailConsentExpected: true,
                emailConsentArg: 'test@test.com'
            },
            {
                desc: 'should load data from sessionStorage when browserStorage is empty',
                browserData: null as any,
                sessionData: { contactData: { contactEmail: null }, passengers: [] } as any,
                expectedCheckSave: false,
                emailConsentExpected: false,
                emailConsentArg: null
            }
        ];

        storageLoadCases.forEach(({ desc, browserData, sessionData, expectedCheckSave, emailConsentExpected, emailConsentArg }) => {
            it(desc, function () {
                controller.isUserLogged = false;
                (mockDependencies.CommonsBrowserStorageService as any).get.and.returnValue(browserData);
                mockDependencies.CommonsSessionStorageService.get.and.returnValue(sessionData);
                controller.checkIfExistsPassengersDataToLocalStorage();
                expect(controller.checkSavePassengersData).toBe(expectedCheckSave);
                expect((controller as any).setContactInfo).toHaveBeenCalled();
                if (emailConsentExpected) {
                    expect((controller as any).checkEmailsConsent).toHaveBeenCalledWith(emailConsentArg, browserData);
                } else {
                    expect((controller as any).checkEmailsConsent).not.toHaveBeenCalled();
                }
                expect((controller as any).checkPassengersStorage).toHaveBeenCalled();
                expect(controller.setPassengersDataToLocalStorage).toBe(true);
            });
        });
    });

    describe('setMandatoryDocsStorage', function () {
        const noOpCases = [
            { desc: 'when existMandatoryDoc is false', existMandatoryDoc: false, oldDocs: [{ code: 'MR' }] },
            { desc: 'when oldDataPassenger.mandatoryDocs is empty', existMandatoryDoc: true, oldDocs: [] }
        ];

        noOpCases.forEach(({ desc, existMandatoryDoc, oldDocs }) => {
            it(`should do nothing ${desc}`, function () {
                const oldData = { mandatoryDocs: oldDocs, data: { mandatoryDoc: { code: 'MR' }, birthDate: '1990-01-01' } };
                const newData = { mandatoryDocs: [{ code: 'MR' }], data: { mandatoryDoc: { code: '' }, birthDate: '' } };
                controller.setMandatoryDocsStorage(existMandatoryDoc, oldData, newData);
                expect(newData.data.mandatoryDoc.code).toBe('');
            });
        });

        const matchCases = [
            { desc: 'should copy mandatoryDoc and birthDate when matching code is MR', docCode: 'MR', initialBirthDate: '', expectedBirthDate: '1990-01-01' },
            { desc: 'should copy mandatoryDoc but not birthDate when matching code is not MR', docCode: 'PP', initialBirthDate: 'unchanged', expectedBirthDate: 'unchanged' }
        ];

        matchCases.forEach(({ desc, docCode, initialBirthDate, expectedBirthDate }) => {
            it(desc, function () {
                const oldMandatoryDoc = { code: docCode };
                const oldData = { mandatoryDocs: [oldMandatoryDoc], data: { mandatoryDoc: oldMandatoryDoc, birthDate: '1990-01-01' } };
                const newData = { mandatoryDocs: [{ code: docCode }], data: { mandatoryDoc: { code: '' }, birthDate: initialBirthDate } };
                controller.setMandatoryDocsStorage(true, oldData, newData);
                expect(newData.data.mandatoryDoc).toBe(oldMandatoryDoc);
                expect(newData.data.birthDate).toBe(expectedBirthDate);
            });
        });

        it('should not copy mandatoryDoc when no code matches', function () {
            const oldMandatoryDoc = { code: 'PP' };
            const oldData = { mandatoryDocs: [oldMandatoryDoc], data: { mandatoryDoc: oldMandatoryDoc, birthDate: '1990-01-01' } };
            const newData = { mandatoryDocs: [{ code: 'ID' }], data: { mandatoryDoc: { code: '' }, birthDate: '' } };
            controller.setMandatoryDocsStorage(true, oldData, newData);
            expect(newData.data.mandatoryDoc.code).toBe('');
        });
    });

    describe('passengersCompleted', function () {
        let mockSecurityInfo: any;
        let mockHeaderModel: any;
        let mockCreateOrderData: any;

        beforeEach(function () {
            mockSecurityInfo = {
                warningMessages: { checkAdvises: [] },
                contactData: { contactPrefix: { countryCode: 'ES' } },
                isResident: false
            };
            mockHeaderModel = {
                headerModel: {
                    shoppingBasket: {
                        segmentsInfo: [],
                        total: { totalPrice: 100 },
                        discountsModel: {}
                    }
                },
                greyBarModel: {}
            };
            mockCreateOrderData = {
                order: {
                    primaryContactInfo: { hashEID: 'hash123' },
                    price: { total: 100 },
                    bookingReferences: []
                },
                warnings: []
            };

            controller.passInfoForm = { $submitted: false };
            controller.model = {
                passengersFormData: {
                    securityInfo: mockSecurityInfo,
                    prefixesList: [],
                    phonePrefixFallback: false,
                    companiesList: [],
                    businessCodeType: [],
                    countriesList: [],
                    frequentlyPassengers: []
                }
            };
            controller.passengerFormValid = true;
            controller.registerFormValid = true;
            controller.contactFormValid = true;
            controller.birthDateFormValid = true;
            controller.checkSavePassengersData = false;
            controller.isUserLogged = false;

            controller.checkScrollToError = jasmine.createSpy('checkScrollToError');
            controller.showWaitingModal = jasmine.createSpy('showWaitingModal');
            controller.savePassengersData = jasmine.createSpy('savePassengersData');
            controller.formCompletedSuccess = jasmine.createSpy('formCompletedSuccess');
            controller.formCompletedError = jasmine.createSpy('formCompletedError');
            controller.registerUser = jasmine.createSpy('registerUser');

            mockDependencies.CommonsSessionStorageService.set.calls.reset();
            mockDependencies.CommonsSessionStorageService.remove.calls.reset();
            mockDependencies.CommonsSessionStorageService.get.and.callFake((key: string) => {
                if (key === 'headerModel') return mockHeaderModel;
                return null;
            });
            mockDependencies.BookingPassengerInfoService.createBookingOrder.and.returnValue(Promise.resolve(mockCreateOrderData));
            mockDependencies.BookingPassengerInfoService.generateBookingInfoModel.and.returnValue({
                order: { bookingReferences: [], price: { total: 100 } }
            });
            mockDependencies.IbBookingRegisterFormDataService.getPassword.and.returnValue('');
            mockDependencies.IbBookingRegisterFormDataService.getCheck.and.returnValue(false);
        });

        it('should always set loadingNextFlow = 3 in sessionStorage', function () {
            controller.passengersCompleted(false);
            expect(mockDependencies.CommonsSessionStorageService.set).toHaveBeenCalledWith('loadingNextFlow', 3);
        });

        it('should always remove passengersFlowInit from sessionStorage', function () {
            controller.passengersCompleted(false);
            expect(mockDependencies.CommonsSessionStorageService.remove).toHaveBeenCalledWith('passengersFlowInit');
        });

        it('should set passInfoForm.$submitted to true', function () {
            controller.passengersCompleted(false);
            expect(controller.passInfoForm.$submitted).toBe(true);
        });

        it('should always call checkScrollToError', function () {
            controller.passengersCompleted(false);
            expect((controller as any).checkScrollToError).toHaveBeenCalled();
        });

        it('should not call createBookingOrder when forms are invalid', function () {
            controller.passengerFormValid = false;
            controller.passengersCompleted(false);
            expect(mockDependencies.BookingPassengerInfoService.createBookingOrder).not.toHaveBeenCalled();
        });

        it('should not call createBookingOrder when warning messages have errors', function () {
            mockSecurityInfo.warningMessages.checkAdvises = [{ checkBox: true, checkBoxConditions: false }];
            controller.passengersCompleted(false);
            expect(mockDependencies.BookingPassengerInfoService.createBookingOrder).not.toHaveBeenCalled();
        });

        it('should call showWaitingModal when forms and warnings are valid', function () {
            controller.passengersCompleted(false);
            expect(controller.showWaitingModal).toHaveBeenCalled();
        });

        it('should set showLostShoppingCartLightbox to false when forms are valid', function () {
            controller.showLostShoppingCartLightbox = true;
            controller.passengersCompleted(false);
            expect(controller.showLostShoppingCartLightbox).toBe(false);
        });

        it('should call savePassengersData with checkSavePassengersData', function () {
            controller.checkSavePassengersData = true;
            controller.passengersCompleted(false);
            expect(controller.savePassengersData).toHaveBeenCalledWith(true);
        });

        it('should call createBookingOrder with securityInfo and the onHold parameter', function () {
            controller.passengersCompleted(true);
            expect(mockDependencies.BookingPassengerInfoService.createBookingOrder).toHaveBeenCalledWith(mockSecurityInfo, true);
        });

        it('should call checkCodePrefix when contactPrefix countryCode is empty', function () {
            mockSecurityInfo.contactData.contactPrefix.countryCode = '';
            mockDependencies.BookingPassengerInfoService.checkCodePrefix.and.returnValue('ES');
            controller.passengersCompleted(false);
            expect(mockDependencies.BookingPassengerInfoService.checkCodePrefix).toHaveBeenCalled();
        });

        it('should not call checkCodePrefix when contactPrefix countryCode is already set', function () {
            mockSecurityInfo.contactData.contactPrefix.countryCode = 'ES';
            mockDependencies.BookingPassengerInfoService.checkCodePrefix.calls.reset();
            controller.passengersCompleted(false);
            expect(mockDependencies.BookingPassengerInfoService.checkCodePrefix).not.toHaveBeenCalled();
        });

        describe('on createBookingOrder success', function () {
            it('should invoke all downstream services', function (done) {
                controller.passengersCompleted(false);
                Promise.resolve().then(() => {
                    expect(mockDependencies.BookingUserActivityService.initKeepAliveTimer).toHaveBeenCalled();
                    expect(mockDependencies.BookingUserActivityService.setOrderTimeoutTimer).toHaveBeenCalled();
                    expect(mockDependencies.DatalayerUtilsService.addDigitalDataInfo).toHaveBeenCalledWith(
                        jasmine.objectContaining({ HashEBKI: 'hash123' })
                    );
                    expect(mockDependencies.BookingPassengerInfoService.generateBookingInfoModel).toHaveBeenCalledWith(mockCreateOrderData);
                    expect(mockDependencies.NewMainHeaderFacade.updateHeaderModel).toHaveBeenCalled();
                    expect(mockDependencies.NewMainHeaderFacade.updateTripsFromOrder).toHaveBeenCalledWith(mockCreateOrderData);
                    expect(mockDependencies.IbBookingPassengerInfoUtilsService.createTemporalPNRKey).toHaveBeenCalledWith(mockCreateOrderData);
                    done();
                });
            });

            it('should call formCompletedSuccess with createOrderData, onHold and userWantsRegister', function (done) {
                controller.passengersCompleted(true);
                Promise.resolve().then(() => {
                    expect((controller as any).formCompletedSuccess).toHaveBeenCalledWith(
                        mockCreateOrderData, true, jasmine.any(Boolean)
                    );
                    done();
                });
            });

            const registerUserCases = [
                { desc: 'call registerUser when not logged and wants to register', isLogged: false, password: 'password123', check: true, expectCall: true },
                { desc: 'not call registerUser when user is logged', isLogged: true, password: 'password123', check: true, expectCall: false },
                { desc: 'not call registerUser when userWantsRegister is false', isLogged: false, password: '', check: false, expectCall: false }
            ];

            registerUserCases.forEach(({ desc, isLogged, password, check, expectCall }) => {
                it(`should ${desc}`, function (done) {
                    controller.isUserLogged = isLogged;
                    mockDependencies.IbBookingRegisterFormDataService.getPassword.and.returnValue(password);
                    mockDependencies.IbBookingRegisterFormDataService.getCheck.and.returnValue(check);
                    controller.passengersCompleted(false);
                    Promise.resolve().then(() => {
                        const registerSpy = (controller as any).registerUser;
                        expectCall ? expect(registerSpy).toHaveBeenCalled() : expect(registerSpy).not.toHaveBeenCalled();
                        done();
                    });
                });
            });
        });

        describe('on createBookingOrder failure', function () {
            beforeEach(function () {
                mockDependencies.BookingPassengerInfoService.createBookingOrder.and.returnValue(
                    Promise.reject({ errorCode: 'SOME_ERROR' })
                );
            });

            it('should call formCompletedError', function (done) {
                controller.passengersCompleted(false);
                Promise.resolve().then(() => Promise.resolve()).then(() => {
                    expect((controller as any).formCompletedError).toHaveBeenCalled();
                    done();
                });
            });
        });
    });
});
