describe('Test of PmtPageController', ()=>{


    //Elements of test
    let pmtPageController, rootScope, $timeout;

    let fakeIsActiveVoucherMmb = true;
    let fakeIsActiveAviosMmb = true;
    let fakeFlowApp = '';
    //Fakes and Spyes
    let fakeCommonsGenericProxy ={};
    let fake$Window: { location: { search: string; reload: jasmine.Spy }; IBDC?: unknown } = {
        location: { search: '', reload: jasmine.createSpy('reload') }
    };
    let fake$document = {
        on: jasmine.createSpy('on'),
        off: jasmine.createSpy('off'),
        find: jasmine.createSpy('find').and.returnValue({ length: 0 })
    };
    let fake$filter = {};
    let fakeLocalStorageService = {
        get: jasmine.createSpy().and.callFake((key: string) => {
            if (key === 'isActiveVoucherMmb') {
                return fakeIsActiveVoucherMmb;
            }
            if (key === 'isActiveAviosMmb') {
                return fakeIsActiveAviosMmb;
            }
            if (key === 'flowApp') {
                return fakeFlowApp;
            }
        }),
        set:jasmine.createSpy().and.callFake(()=>{return null;})
    };
    let fakePmtDatalayerUtilsService = {
        resetDatalayer: jasmine.createSpy('resetDatalayer')
    };
    let fakePmtUtilsService = {'getOrderId': jasmine.createSpy('getOrderId'),
        'getLanguagePaypal': jasmine.createSpy('getLanguagePaypal'),
        'getPaymentRelatedContent': jasmine.createSpy('getPaymentRelatedContent'),
        'checkAvailableDonation': jasmine.createSpy('checkAvailableDonation'),
        'isUserLogged': jasmine.createSpy('isUserLogged'),
        'getURLFirstParameterByName': jasmine.createSpy('getURLFirstParameterByName'),
        'initStorage': jasmine.createSpy('initStorage')}; 
    
    let fakPmtTransformer = {'getPaymentsModel': jasmine.createSpy('getPaymentsModel'),
        'noPaymentModel': jasmine.createSpy('noPaymentModel')};                              
    
    let fakeCommonsUserUtilsService = {'isIbZero': jasmine.createSpy('isIbZero'),
        'isSoftUser': jasmine.createSpy('isSoftUser')};                              
    
    let fakeNewMainHeaderFacade = {'updateBasketOthers': jasmine.createSpy('updateBasketOthers'),
        'updateBasketDiscounts': jasmine.createSpy('updateBasketDiscounts'),
        'updateSteps': jasmine.createSpy('updateSteps'),
        'showLogin': jasmine.createSpy('showLogin')
    };
    let fakePmtService = {'getScripts': jasmine.createSpy('getScripts'),
        'checkFullAvios': jasmine.createSpy('checkFullAvios'),
        'submitFullAvios': jasmine.createSpy('submitFullAvios'),
        'submitPayment': jasmine.createSpy('submitPayment'),
        'getSummaryInfoQuota': jasmine.createSpy('getSummaryInfoQuota'),
        'getPaymenMethodsInfo': jasmine.createSpy().and.callFake( () => {
            return new Promise( (resolve, reject)=> {
                resolve(data);
            });
        })
    };
    let data = {
        summaryInfo: 'summaryInfo'
    };
    let fakePmtModalService = {
        'showWaitingModal': jasmine.createSpy('showWaitingModal'),
        'finishWaiting': jasmine.createSpy('finishWaiting'),
        'showGenericError': jasmine.createSpy('showGenericError').and.returnValue({
            result: Promise.resolve()
        })
    };
    const fakePmtConstants = {
        QUADRIGAMS: {
            PAYMENTS_PCC: 'IBPCC',
            PAYMENTS_REJECTED: 'IBREJC',
            PAYMENTS_DENIED: 'IBCCDN',
            PAYMENTS_CANCELLED: 'IBCNCL',
            FLIGHT_CONFIRMATION: 'TCFREV',
            SEARCH: 'CHKTRP',
            LOGGED_SEARCH: 'MYTRPS',
            TRIP_DETAILS: 'IBMTDT',
            CHANGE_FLIGHT: 'TCADVS',
            CHANGE_FLIGHT_DISPO: 'TCFLPA',
            ORDER_TICKETS: 'IBENIT',
            SPECIAL_NEEDS: 'MOPMR',
            SPECIAL_NEEDS_CONFIRMED: 'MOPMRCF',
            PASSENGER_INFO: 'MOINFO',
            ON_HOLD_CONF: 'OHMTDT',
            ON_HOLD_CONF_ON_BUSINESS: 'CIPOHMTDT',
            ON_HOLD_CONF_RESIDENTS: 'OHSARA',
            ON_HOLD_CONF_LOGIN: 'OHLOIN',
            ON_HOLD_CONF_PAYMENT: 'OHINFO',
            ON_HOLD_CONF_PAYMENT_ON_BUSINESS: 'CIPOHINFO',
            ON_HOLD_CONF_PAYMENT_WAIT: 'OHWAIT',
            ON_HOLD_CONF_PAYMENT_FRAUD: 'OHPCC',
            ON_HOLD_CONF_CONFIRMATION: 'RTBKCF',
            ON_HOLD_CONF_CONFIRMATION_ON_BUSINESS: 'CIPRTBKCF',
            ON_HOLD_CONF_CANCEL_ORDER_MODAL: 'CNCLOH',
            ON_HOLD_CONF_CANCEL_ORDER_MODAL_ON_BUSINESS: 'CIPCNCLOH',
            ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION: 'CNCLIT',
            ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION_ON_BUSINESS: 'CIPCNCLIT',
            BKI_REDENTION_PAYMENT: 'IPPURC',
            BKI_REDENTION_CONFIRMATION: 'IPBKCF',
            BKI_ONB_REDENTION_PAYMENT: 'CIPIPPURC',
            BKI_ONB_REDENTION_CONFIRMATION: 'CIPIPBKCF',
            BKI_PAYMENT: 'IBPURC',
            BKI_CONFIRMATION: 'IBBKCF',
            MMB_ANCILLARIES_PAYMENT: 'MOPURC',
            MMB_ANCILLARIES_SEATS_PAYMENT: 'STPURC',
            MMB_ANCILLARIES_BAGGAGES_PAYMENT: 'MOPBAG',
            MMB_ANCILLARIES_UPG_PAYMENT: 'SUPURC',
            MMB_ANCILLARIES_MEALS_PAYMENT: 'MEALPURC',
            MMB_ANCILLARIES_CONFIRMATION: 'MOBKCF',
            MMB_ANCILLARIES_SEATS_CONFIRMATION: 'STBKCF',
            MMB_ANCILLARIES_BAGGAGES_CONFIRMATION: 'MOCBAG',
            MMB_ANCILLARIES_UPG_CONFIRMATION: 'SUCONF',
            MMB_ANCILLARIES_MEALS_CONFIRMATION: 'MEALCF',
            MMB_ANCILLARIES_DEEPLINK_PAYMENT: 'STPURCJBR',
            MMB_ANCILLARIES_DEEPLINK_CONFIRMATION: 'STBKCFJBR',
            BKIOH_PAYMENT: 'ONHOLD',
            BKIOH_CONFIRMATION: 'OHBKCF',
            CKI_CONFIRMATION: 'IBCKICF',
            CKI_PAYMENT: 'IBCKIPURC',
            HMAD_PAYMENTS: 'HMPURC',
            HMAD_BK_ERROR: 'HMUNKN',
            HMAD_PAYMENTS_PCC: 'HMPCC',
            HMAD_CONFIRMATION_COMMUNICATION_LOST: 'HMBKER',
            HMAD_PAYMENTS_DENIED: 'HMCCDN',
            HMAD_PAYMENTS_REJECTED: 'HMREJC',
            HMAD_CONFIRMATION: 'HMBKCF',
            MULTI_PAYMENTS: 'MTPURC',
            MULTI_BK_ERROR: 'MTUNKN',
            MULTI_PAYMENTS_PCC: 'MTPCC',
            MULTI_CONFIRMATION_COMMUNICATION_LOST: 'MTBKER',
            MULTI_PAYMENTS_DENIED: 'MTCCDN',
            MULTI_PAYMENTS_REJECTED: 'MTREJC',
            MULTI_CONFIRMATION: 'MTBKCF',
            PA_PAOB_PAYMENTS: 'PAPURC',
            PA_PAOB_PAYMENTS_CONFIRMATION: 'PABKCF',
            PA_PAOB_PAYMENTS_ERROR: 'PAPCC',
            PA_PARE_PAYMENTS_ERROR: 'RPAPCC',
            PA_PARE_PAYMENTS_CONFIRMATION: 'RPABKCF',
            PA_PARE_PAYMENTS: 'RPAPURC',
            PA_PAREONB_PAYMENTS: 'CIPRPAPURC',
            PA_PAREONB_PAYMENTS_CONFIRMATION: 'CIPPABKCF',
            PA_PAREONB_PAYMENTS_ERROR: 'CIPRPAPCC',
            PA_PAOBONB_PAYMENTS: 'CIPPAPURC',
            PA_PAOBONB_PAYMENTS_CONFIRMATION: 'CIPPABKCF',
            PA_PAOBONB_PAYMENTS_ERROR: 'CIPPAPCC',
            MMB_VOLUNTARY_CHANGE_PAYMENT: 'ATCPURC',
            MMB_VOLUNTARY_CHANGE_CONFIRMATION: 'ATCBKCF',
            MMB_VOLUNTARY_CHANGE_COMMUNICATION_LOST: 'ATCBKER',
            COMUNICATION_SEAT: 'STBKER',
            COMUNICATION_BAGGAGE: 'BGBKER',
            COMUNICATION_INSURANCE: 'INBKER ',
            COMUNICATION_ANCILLARIES: 'MOBKER',
            CREDITCARD_DENIED: 'MOCCDN',
            CREDITCARD_REJECT: 'MOREJC',
            BKI_COMMUNICATION_LOST: 'IBBKER',
            MMBOH_COMMUNICATION_LOST: 'IBBKER',
            GIFTCARDS_PAYMENT: 'REPURC',
            GIFTCARDS_CONFIRMATION: 'REBKCF',
            SUBSCRIPTIONMODELS_PAYMENT: 'PLPURC',
            MMB_YOUR_DOCUMENTS: 'MODDOC',
            SUBSCRIPTION_MODELS_CONFIRMATION: 'PLBKCF'
        },
        MODALS: {
            GENERIC_ERROR_MODAL_PAYMENT: 'pmt-generic-error-payment-modal'
        },
        PAYMENT_TYPES: {
            IBERIA_PAY: 'IBERIA_PAY',
            ONHOLD_IBERIA_PAY: 'ONHOLD_IBERIA_PAY'
        }
    };
    let fakeDatalayerUtilsService = {'updateDatalayerWithQuadrigam': jasmine.createSpy('updateDatalayerWithQuadrigam'),
        'sendDatalayerEvent': jasmine.createSpy('sendDatalayerEvent'),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(function (quadriam, quadrigam) { })};
    let fakeibPmtNemuruService = {
        'nemuruIsAvailableObser': { 'subscribe' : jasmine.createSpy().and.callFake( () => {
            return new Promise( (resolve, reject)=> {
                resolve('data');
            });
        })}};
    let fakeibPmtMercadoPagoService = {
        'mercadoPagoIsAvailableObserver': { 'subscribe' : jasmine.createSpy().and.callFake( () => {
            return new Promise( (resolve, reject)=> {
                resolve('data');
            });
        })}};
    let fakeDatalayerEcommerceUtilsService = {'setAddPaymentInfo': jasmine.createSpy('setAddPaymentInfo'),
        'updateDatalayerWithAncillaries': jasmine.createSpy('updateDatalayerWithAncillaries'),
        'updateDatalayerVoluntaryChanges': jasmine.createSpy('updateDatalayerVoluntaryChanges')};
    let fakeDigitalDataService = {'emitViewEvent': jasmine.createSpy('emitViewEvent')};
    let fakeMonetateUtilsService = {'updateMonetateWithQuadrigam': jasmine.createSpy('updateMonetateWithQuadrigam'),
        'addFlightReviewMonetate': jasmine.createSpy('addFlightReviewMonetate'),
        'trackAncillariesProductsAdded': jasmine.createSpy('trackAncillariesProductsAdded')};
    let fakePMTCheckPartnerDiscountsService = {
        'deletePartnerDiscount':  jasmine.createSpy('deletePartnerDiscount')
    };
    let fakeCommonsUtilService = { setTitlePage: jasmine.createSpy('setTitlePage') };
    let fakeDccService = {
        'dccDataObservable': { 'subscribe' : jasmine.createSpy().and.callFake( () => {
            return new Promise( (resolve, reject)=> {
                resolve('data');
            });
        })},
        'setDccData': () => {}
    };

    let fakePmtAssFassAncillariesService = {
        deleteAssistCard: jasmine.createSpy('deleteAssistCard').and.returnValue(Promise.resolve({}))
    };

    let fakeDatalayerConstants = {
        DATALAYER_INFO: {
            STEP: 'test'
        }
    };

    let fakePmtDatalayerConstants = {
        DATALAYER_VALUES : {
            DISRUPTED: 'disruptado',
            FLEXIBLE: 'flexibilizado',
            NON_FLEXIBLE: 'no_flexibilizado'
        },
        DATALAYER_EVENT_TYPES: {
            VIEW: 'view'
        }
    };

    beforeEach(()=>{
        angular.mock.module('ib-pmt-module', ($provide)=>{
            $provide.value('PmtConstants', fakePmtConstants);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('$filter', fake$filter);
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('PmtModalService', fakePmtModalService);
            $provide.value('PmtTransformer', fakPmtTransformer);
            $provide.value('PmtService', fakePmtService);
            $provide.value('$location', {});
            $provide.value('$sce', {});
            $provide.value('$document', fake$document);
            $provide.value('$compile', {});
            $provide.value('PmtUtilsService', {});
            $provide.value('CurrencyService', {});
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('PmtDatalayerConstants', {});
            $provide.value('DatalayerEcommerceUtilsService', fakeDatalayerEcommerceUtilsService);
            $provide.value('PmtMethodsTransformer', {});
            $provide.value('DataLayerService', {});
            $provide.value('PmtUtilsTransformers', {});
            $provide.value('MonetateUtilsService', fakeMonetateUtilsService);
            $provide.value('CommonsAncillariesService', {});
            $provide.value('PmtBreakDownUtilsService', {});
            $provide.value('PmtDatalayerUtilsService', {});
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            $provide.value('PmtAssFassAncillariesService', fakePmtAssFassAncillariesService);
            $provide.value('CheckVoucherCodeService', {});
            $provide.value('pmtConditionsGiftCardsService', {});
            $provide.value('MonetateConstants', {});
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
            $provide.value('GetDestinationsService', {});
            $provide.value('CommonsKeepAliveUtilsService', {});
            $provide.value('DigitalDataService', fakeDigitalDataService);
            $provide.value('QuantumService', {});
            $provide.value('DatalayerConstants', fakeDatalayerConstants);
            $provide.value('DatalayerGeneralConstants', {});
            $provide.value('ibPmtNemuruService', fakeibPmtNemuruService);
            $provide.value('ibPmtMercadoPagoService', fakeibPmtMercadoPagoService);
            $provide.value('$window', fake$Window);
            $provide.value('IbUiAviosSummaryService', {});
            $provide.value('PmtUtilsService', fakePmtUtilsService);
            $provide.value('updateDatalayerWithQuadrigam ', {});
            $provide.value('PMTCheckPartnerDiscountsService', fakePMTCheckPartnerDiscountsService);
            $provide.value('DccService', fakeDccService);
            $provide.value('PmtDatalayerUtilsService', fakePmtDatalayerUtilsService);
        });

        inject(($controller, $rootScope:CommonsRootScope, _$timeout_)=>{
            rootScope = $rootScope.$new();
            rootScope.production = 'false';

            $timeout = _$timeout_;
            //$controller(controllerName, locals, [bindings], [ident]);
            pmtPageController = $controller('PmtPageController', {
                $scope:rootScope.$new(),
                $rootScope :rootScope
            }, {});
            $rootScope.$apply();
        });
    });

    describe('the PmtPageController is initizalice', ()=>{
        it('should be defined', (done)=>{
            
            expect(pmtPageController).toBeDefined();
            done();
        });
    });

    describe('the checkVoucherMmbvc function', () => {
        it('should fakeIsActiveVoucherMmb be true', (done) => {
            fakeIsActiveVoucherMmb = true;
            expect(pmtPageController.checkVoucherMmbvc()).toEqual(true);
            done();
        });
        it('should fakeIsActiveVoucherMmb be false and flowApp MMBVC return false', (done) => {
            fakeIsActiveVoucherMmb = false;
            fakeFlowApp = 'MMBVC';
            expect(pmtPageController.checkVoucherMmbvc()).toEqual(false);
            done();
        });
        it('should fakeIsActiveVoucherMmb false and flowApp MMB return true', (done) => {
            fakeIsActiveVoucherMmb = false;
            fakeFlowApp = 'MMB';
            expect(pmtPageController.checkVoucherMmbvc()).toEqual(true);
            done();
        });
    });

    describe('the checkAviosMmbvc function', () => {
        it('should fakeIsActiveAviosMmb be true', (done) => {
            fakeIsActiveAviosMmb = true;
            fakeFlowApp = 'MMB';
            expect(pmtPageController.checkAviosMmbvc()).toEqual(true);
            done();
        });
        it('should fakeIsActiveAviosMmb be false and flowApp MMBVC return false', (done) => {
            fakeIsActiveAviosMmb = false;
            fakeFlowApp = 'MMBVC';
            expect(pmtPageController.checkAviosMmbvc()).toEqual(false);
            done();
        });
        it('should fakeIsActiveAviosMmb false and flowApp MMB return true', (done) => {
            fakeIsActiveAviosMmb = false;
            fakeFlowApp = 'MMB';
            expect(pmtPageController.checkAviosMmbvc()).toEqual(true);
            done();
        });
        
    });
    describe('the determinePNRType function', () => {
        it('should return DISRUPTED when isDisrupted is true', (done) => {
            expect(pmtPageController.determinePNRType(true, false)).toEqual(fakePmtDatalayerConstants.DATALAYER_VALUES.DISRUPTED);
            done();
        });

        it('should return FLEXIBLE when only isFlexible is true', (done) => {
            expect(pmtPageController.determinePNRType(false, true)).toEqual(fakePmtDatalayerConstants.DATALAYER_VALUES.FLEXIBLE);
            done();
        });

        it('should return NON_FLEXIBLE when both are false', (done) => {
            expect(pmtPageController.determinePNRType(false, false)).toEqual(fakePmtDatalayerConstants.DATALAYER_VALUES.NON_FLEXIBLE);
            done();
        });
    });

    describe('the getPNR function', () => {
        it('should return PNR from localStorage when PNR exists', (done) => {
            fakeLocalStorageService.get.and.callFake((key: string) => {
                if (key === 'PNR') return 'ABC123';
                if (key === 'bookingInfo') return { order: { clientLocator: 'ZZZ999' } };
                if (key === 'isActiveVoucherMmb') return fakeIsActiveVoucherMmb;
                if (key === 'isActiveAviosMmb') return fakeIsActiveAviosMmb;
                if (key === 'flowApp') return fakeFlowApp;
            });

            expect(pmtPageController.getPNR()).toEqual('ABC123');
            done();
        });

        it('should return bookingInfo.order.clientLocator when PNR does not exist', (done) => {
            fakeLocalStorageService.get.and.callFake((key: string) => {
                if (key === 'PNR') return undefined;
                if (key === 'bookingInfo') return { order: { clientLocator: 'ZZZ999' } };
                if (key === 'isActiveVoucherMmb') return fakeIsActiveVoucherMmb;
                if (key === 'isActiveAviosMmb') return fakeIsActiveAviosMmb;
                if (key === 'flowApp') return fakeFlowApp;
            });

            expect(pmtPageController.getPNR()).toEqual('ZZZ999');
            done();
        });

        it('should return empty string when neither PNR nor bookingInfo clientLocator exist', (done) => {
            fakeLocalStorageService.get.and.callFake((key: string) => {
                if (key === 'PNR') return undefined;
                if (key === 'bookingInfo') return undefined;
                if (key === 'isActiveVoucherMmb') return fakeIsActiveVoucherMmb;
                if (key === 'isActiveAviosMmb') return fakeIsActiveAviosMmb;
                if (key === 'flowApp') return fakeFlowApp;
            });

            expect(pmtPageController.getPNR()).toEqual('');
            done();
        });
    });

    describe('checkAssistCardAncillary', () => {

        beforeEach(() => {
            fakePmtModalService.showGenericError.calls.reset();
            fakePmtAssFassAncillariesService.deleteAssistCard.calls.reset();
        });

        it('should delete assist card, update basket and show modal when assistCardPurchased is true', (done) => {
            spyOn(pmtPageController, 'checkBasket');
            spyOn(pmtPageController, 'updateBasketWithoutAC');

            fakeLocalStorageService.get.and.callFake((key: string) => {
                if (key === 'assistCardPurchased') return true;
                if (key === 'isActiveVoucherMmb') return fakeIsActiveVoucherMmb;
                if (key === 'isActiveAviosMmb') return fakeIsActiveAviosMmb;
                if (key === 'flowApp') return fakeFlowApp;
            });

            pmtPageController.checkAssistCardAncillary();

            setTimeout(() => {
                expect(fakePmtAssFassAncillariesService.deleteAssistCard).toHaveBeenCalled();
                expect(pmtPageController.checkBasket).toHaveBeenCalled();
                expect(pmtPageController.updateBasketWithoutAC).toHaveBeenCalled();
                expect(fakePmtModalService.showGenericError).toHaveBeenCalled();
                done();
            });
        });

        it('should not call deleteAssistCard nor showGenericError when assistCardPurchased is false', (done) => {
            fakeLocalStorageService.get.and.callFake((key: string) => {
                if (key === 'assistCardPurchased') return false;
                if (key === 'isActiveVoucherMmb') return fakeIsActiveVoucherMmb;
                if (key === 'isActiveAviosMmb') return fakeIsActiveAviosMmb;
                if (key === 'flowApp') return fakeFlowApp;
            });

            pmtPageController.checkAssistCardAncillary();

            setTimeout(() => {
                expect(fakePmtAssFassAncillariesService.deleteAssistCard).not.toHaveBeenCalled();
                expect(fakePmtModalService.showGenericError).not.toHaveBeenCalled();
                done();
            });
        });
    });

    describe('updateDatalayerWithQuadrigam - PNR enrich', () => {
        it('should set Reference and PNRType in both datalayer and digitalData for MMB payment quadrigam', (done) => {
            // Arrange: this method touches many constants; provide only the minimum structure it reads.
            pmtPageController.PmtConstants.APP_TYPES = {
                MANAGEMYBOOKING_ANCILLARIES: 'MMB_ANC'
            };
            pmtPageController.PmtConstants.QUADRIGAMS = {
                MMB_ANCILLARIES_PAYMENT: 'MOPURC',
                MMB_ANCILLARIES_CONFIRMATION: 'MOBKCF'
            };

            // constants used in earlier branches in updateDatalayerWithQuadrigam
            pmtPageController.DatalayerConstants = {
                DATALAYER_INFO: { PROCESS: 'PROCESS', STEP: 'STEP' },
                DATALAYER_VIEWS: { ANCILLARIES: 'ANCILLARIES', PAYMENTS: 'PAYMENTS' }
            };
            pmtPageController.DatalayerGeneralConstants = { PROCESS: 'PROCESS', STEP: 'STEP' };

            // service used in earlier branches
            pmtPageController.DatalayerUtilsService = {
                ...fakeDatalayerUtilsService,
                getStepFromQuadrigam: jasmine.createSpy('getStepFromQuadrigam').and.returnValue('STEP_FROM_QUADRIGAM')
            };
            pmtPageController.CommonsUtilService = {
                getProcess: jasmine.createSpy('getProcess').and.returnValue('PROC')
            };

            // ensure the controller flow matches the condition inside updateDatalayerWithQuadrigam
            pmtPageController.flowApp = pmtPageController.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES;

            // ensure determinePNRType returns a stable value
            pmtPageController.PmtDatalayerConstants = fakePmtDatalayerConstants;

            // Force getPNR and getPNRType return values (we only want to test the IF enrichment)
            spyOn(pmtPageController, 'getPNR' as any).and.returnValue('ABC123');
            spyOn(pmtPageController, 'getPNRType' as any).and.returnValue('flexibilizado');

            // confirmationDigitalInfo storage should exist
            fakeLocalStorageService.get.and.callFake((key: string) => {
                if (key === 'confirmationDigitalInfo') return {};
                if (key === 'isActiveVoucherMmb') return fakeIsActiveVoucherMmb;
                if (key === 'isActiveAviosMmb') return fakeIsActiveAviosMmb;
                if (key === 'flowApp') return fakeFlowApp;
            });

            // Act
            pmtPageController.updateDatalayerWithQuadrigam('MOPURC', {}, true);

            // Assert: verify Datalayer call received enriched object
            const datalayerArgs = fakeDatalayerUtilsService.updateDatalayerWithQuadrigam.calls.mostRecent().args;
            const digitalArgs = fakeDatalayerUtilsService.updateDigitalDataWithQuadrigam.calls.mostRecent().args;

            expect(datalayerArgs[0]).toBe('MOPURC');
            expect(datalayerArgs[1].Reference).toBe('ABC123');
            expect(datalayerArgs[1].PNRType).toBe('flexibilizado');

            expect(digitalArgs[0]).toBe('MOPURC');
            expect(digitalArgs[1].Reference).toBe('ABC123');
            expect(digitalArgs[1].PNRType).toBe('flexibilizado');

            done();
        });
    });

    describe('Iberia Pay init safeguards', () => {
        beforeEach(() => {
            fakePmtModalService.showGenericError.calls.reset();
            fakePmtModalService.showGenericError.and.returnValue({
                result: {
                    then: jasmine.createSpy('then'),
                    catch: jasmine.createSpy('catch')
                }
            });
            fake$Window.location.reload.calls.reset();
            delete fake$Window.IBDC;
            pmtPageController.model = {
                selectedData: { selectedTab: 0 },
                paymentInfo: {
                    iberiaPayLoadingIframe: false,
                    paymentMethods: [{ type: 'IBERIA_PAY' }, { type: 'BIZUM' }],
                    selectedPaymentInfo: {},
                    price: { totalPrice: 100, formattedTotalPrice: '100' },
                    currency: 'EUR'
                },
                summaryInfo: { orderFees: [] },
                showOptions: { showRegularButton: true }
            };
            pmtPageController.iframeReadyCount = 0;
            pmtPageController.paymentInitReloadModalShown = false;
        });

        it('validateIberiaPayAfterInit should wait for IBDC before showing reload modal', () => {
            pmtPageController.validateIberiaPayAfterInit();

            expect(fakePmtModalService.showGenericError).not.toHaveBeenCalled();

            $timeout.flush(3000);

            expect(fakePmtModalService.showGenericError).toHaveBeenCalled();
            expect(fakePmtModalService.showGenericError.calls.mostRecent().args[0].title).toBe('IBERIA_PAY_ERROR_GENERAL_TITLE');
        });

        it('validateIberiaPayAfterInit should not show reload modal if IBDC arrives during wait', () => {
            pmtPageController.validateIberiaPayAfterInit();

            fake$Window.IBDC = { tokenizeCreditCard: jasmine.createSpy('tokenizeCreditCard') };
            $timeout.flush(3000);

            expect(fakePmtModalService.showGenericError).not.toHaveBeenCalled();
        });

        it('should show reload modal after iframe load timeout', () => {
            pmtPageController.model.paymentInfo.iberiaPayLoadingIframe = true;
            pmtPageController.updateIberiaPayLoadingIframeStatus(null, true);

            $timeout.flush(30000);

            expect(fakePmtModalService.showGenericError).toHaveBeenCalled();
            expect(pmtPageController.model.paymentInfo.iberiaPayLoadingIframe).toBe(false);
        });

        it('should not show reload modal when iframe finishes loading before timeout', () => {
            pmtPageController.updateIberiaPayLoadingIframeStatus(null, true);
            pmtPageController.updateIberiaPayLoadingIframeStatus(null, false);

            $timeout.flush(30000);

            expect(fakePmtModalService.showGenericError).not.toHaveBeenCalled();
        });

        it('should not show reload modal on timeout after leaving Iberia Pay tab', () => {
            pmtPageController.updateIberiaPayLoadingIframeStatus(null, true);
            pmtPageController.changeSelectedTab(null, 1, 0);

            expect(pmtPageController.model.paymentInfo.iberiaPayLoadingIframe).toBe(false);
            expect(pmtPageController.model.selectedData.selectedTab).toBe(1);

            $timeout.flush(30000);

            expect(fakePmtModalService.showGenericError).not.toHaveBeenCalled();
        });

        it('should not show reload modal on timeout if selected method is no longer Iberia Pay', () => {
            pmtPageController.updateIberiaPayLoadingIframeStatus(null, true);
            pmtPageController.model.selectedData.selectedTab = 1;

            $timeout.flush(30000);

            expect(fakePmtModalService.showGenericError).not.toHaveBeenCalled();
            expect(pmtPageController.model.paymentInfo.iberiaPayLoadingIframe).toBe(false);
        });

        it('onIbdcScriptLoadError should show reload modal', () => {
            pmtPageController.onIbdcScriptLoadError();

            expect(fakePmtModalService.showGenericError).toHaveBeenCalled();
            expect(fakePmtModalService.showGenericError.calls.mostRecent().args[0].title).toBe('IBERIA_PAY_ERROR_GENERAL_TITLE');
        });

        it('onIbdcScriptLoadError should not show reload modal when Iberia Pay is not selected', () => {
            pmtPageController.model.selectedData.selectedTab = 1;

            pmtPageController.onIbdcScriptLoadError();

            expect(fakePmtModalService.showGenericError).not.toHaveBeenCalled();
        });
    });
});
