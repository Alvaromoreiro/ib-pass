describe('Test MmBAncillariesService', () => {
    let MmBAncillariesService, rootScope, $q, testLocation, localStorageService;

    let PromiseDataCustomerData = {
        otherStatuses: {
            isRedemptionEnabled: true,
        },
    };
    let fakeCommonsGetLoginInfoService = {
        'checkCustomerStatus': jasmine.createSpy('checkCustomerStatus').and.callFake(() => {
            var deferred = $q.defer();
            deferred.resolve(PromiseDataCustomerData);
            return deferred.promise;
        })
    }
    let fakeCommonsLoginUtilsService = {
        'updateStateToAnonymous': jasmine.createSpy('updateStateToAnonymous').and.callFake(function () {
            return true;
        })
    };

    let getAncillarieSummary = {
        issuedItems: [{
            type: 'PREORDER'
        }],
        currencies: ['EUR']
    }

    let fakeAncGetCachedInformationService = {
        getCachedInformation: jasmine.createSpy('getCachedInformation').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        })
    };
    let fakeAncillariesTransformer = {
        transformInfoSendToConfirmation: jasmine.createSpy('transformInfoSendToConfirmation'),
        passengerTransformData: jasmine.createSpy('passengerTransformData'),
        generateInfoCommon: jasmine.createSpy('generateInfoCommon').and.returnValue({seatsQuanty: ''}),
        countSeatsTotal: jasmine.createSpy('countSeatsTotal').and.returnValue({}),
        transformAncillariesView: jasmine.createSpy('transformAncillariesView'),
        transformFromLocalStorage: jasmine.createSpy('transformFromLocalStorage'),
        buildAncillariesRequest: jasmine.createSpy('buildAncillariesRequest').and.returnValue([{}]),
        deleteAncillaryByType: jasmine.createSpy(),
        deleteAncillaryBySubType: jasmine.createSpy(),
        genCalAviosFligthReq: jasmine.createSpy(),
        generateModelPayMethods: jasmine.createSpy(),
        getUpdateSeatInfo: jasmine.createSpy(),
        updateSeatInformation: jasmine.createSpy(),
        genAviosFlexOnDemandReq: jasmine.createSpy(),
        genAviosAncillariesReq: jasmine.createSpy(),
        genAviosAncillariesSummaryReq: jasmine.createSpy(),
        genAviosSpeqReq: jasmine.createSpy(),
        genReqAviosAncillariesBaggages: jasmine.createSpy(),
        genAviosPriorityReq: jasmine.createSpy(),
        genStructureForAncillaries: jasmine.createSpy(),
        transformDeleteResponse: jasmine.createSpy().and.returnValue({error:{}}),
        calculateTotalBaggages: jasmine.createSpy(),
        calculateTotalSpeqs: jasmine.createSpy(),
        countBaggageTotal: jasmine.createSpy(),
        countSpeqsTotal: jasmine.createSpy(),
        calculateTotalSeats : jasmine.createSpy(),
    };
    let fakeAncillariesCallPaymentsService = {
        getPayments: jasmine.createSpy('getPayments').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        })
    };
    let fakeCommonsAncillariesService = {
        getAncillarieSummary: jasmine.createSpy('getAncillarieSummary').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve(getAncillarieSummary);
            return deferred.promise;
        }),
        deleteAncillarie: jasmine.createSpy('deleteAncillarie').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({failedToDelete: [{error: {description: 'test', code: 'test'}}]});
            return deferred.promise;
        }),
        updateAncillaries: jasmine.createSpy('updateAncillaries').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        }),
        getAncillaries: jasmine.createSpy('getAncillaries').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        }),
        deleteAllAncillaries: jasmine.createSpy('deleteAllAncillaries').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        })
    };
    let fakeCurrencyService = {
        'getCurrencyObject': jasmine.createSpy('getCurrencyObject'),
        'formatPrice': jasmine.createSpy('formatPrice').and.callFake(() => { return '/^\s+|\s+$/gm' }),
        'formatAvios': jasmine.createSpy('formatAvios'),
        'getCurrenciesAsMap': () => {
            return {};
        }
    };
    let fakeModalServiceAncillaries = {
        isWaiting: jasmine.createSpy(),
        isNotWaiting: jasmine.createSpy(),
        setErrorMessage: jasmine.createSpy(),
        setErrorCode: jasmine.createSpy(),
        isError: jasmine.createSpy(),
        openAncillariesErrorModal: jasmine.createSpy('openAncillariesErrorModal').and.callFake(() => {
            return {
                result: $q.when({})
            };
        }),
        openAviosAccumulatedModal:jasmine.createSpy('openAviosAccumulatedModal').and.callFake(() => {
            return {
                result: $q.when({})
            };
        }),
        showWaitingModal: jasmine.createSpy(),
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(() => {
            return {
                result: $q.when(angular.noop, angular.noop)
            };
        }),
    };
    let fakeAncillariesMMBConstants = {
        PAGES_ROUTES: {
            PAYMENTS: 'PAYMENTS',
            PAYMENTS_MMB_ON_HOLD: 'test',
            BOARDING_CARDS: 'boardingCards'
        },
        APPLICATION_FLOW: {
            MMB: 'MMB',
            MMBOH: 'MMBOH',
            CHECKIN: 'CKI',
            BOOKING: 'BKI',
            BBOOKING: 'BBKI'
        },
        TYPE_ANCILLARIE: {
            BAGGAGE: 'BAGGAGE',
            INSURANCE: 'INSURANCE',
            SEAT: 'SEAT',
            VEHICLE_RENTAL: 'VEHICLE_RENTAL',
            INTEGRATED_BOB: 'INTEGRATED_BOB',
            SPEQS: 'SPECIAL_EQUIPMENT',
            UPGRADING: 'UPGRADING',
            SPECIAL_MEALS: 'SPECIAL_MEALS',
            UPGRADING_BID: 'UPGRADING_BID',
            UPGRADING_AVIOS: 'UPGRADING_AVIOS',
            FLEXIBILITY: 'FLEXIBILITY_ON_DEMAND',
            PREORDER: 'PREORDER',
            PRIORITY_BOARDING: 'PRIORITY_BOARDING',
            THIRD_PARTY_COMPANIES: 'THIRD_PARTY_COMPANIES',
            CO2_FOOTPRINT: 'CO2_FOOTPRINT',
            UPGRADING_WAITING_LIST: 'UPGRADING_WAITING_LIST'
        },

    };
    let fakePmtMethodsUpgradingBidsService = {
        getPaymentMethodsUpgradingBids: jasmine.createSpy('getPaymentMethodsUpgradingBids').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        })
    };
    let fakeGetCountriesListService = {
        getCountriesList: jasmine.createSpy('getCountriesList').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        })
    };
    let fakePmtUpgBidsCreditCardsService = {
        getCreditCardsImgs:  jasmine.createSpy('getCreditCardsImgs').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        })
    };
    let fakeCommonsModalService = {
        finishWaiting: jasmine.createSpy(),
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(() => {
            return {
                result: $q.when({})
            };
        }),
        closeAllCurrentModals: jasmine.createSpy(),
    };
    let fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy(),
        sendDatalayerEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        setAncillariesAction: jasmine.createSpy(),
        setAncillariesDatalayer: jasmine.createSpy(),
    };
    let fakeIbCPermanentUserService = {
        'isAfterLoginPermanentUser': jasmine.createSpy('isAfterLoginPermanentUser').and.returnValue(true),
        'removeParamsAfterLogin': jasmine.createSpy('removeParamsAfterLogin'),
        'checkPermanentUserFlow': jasmine.createSpy('checkPermanentUserFlow').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        'isAfterLoginBidsPermanentUser': jasmine.createSpy('isAfterLoginBidsPermanentUser').and.callFake(() => {
            return false;
        })
    };
    let fakeNewMainHeaderFacade = {
        headerModel: {},

        /**
         * ✅ CRITICAL FIX
         * cleanSessionAncillaries() sets headerModel = null internally
         * before calling updateHeaderModel().
         * This mock guarantees headerModel is always valid.
         */
        updateHeaderModel: jasmine.createSpy('updateHeaderModel').and.callFake(() => {
            if (!fakeNewMainHeaderFacade.headerModel) {
                fakeNewMainHeaderFacade.headerModel = {};
            }
        }),
    };
    let fakeDatalayerMenusService = {
        updateDataLayer: jasmine.createSpy('updateDataLayer')
    };
    let fakeCallBundleService = {
        putBundle: jasmine.createSpy('putBundle').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        })
    };

    let fakeBookingInfo = {}
    let fakeAncillariesInfo = {};

    let fakeAncillariesTransformedInfo = {

    }

    beforeEach(() => {
        angular.mock.module('ib-MmB-services-module', 'ib-MmB-filters-module', 'LocalStorageModule', ($provide) => {
            $provide.value('AncGetCachedInformationService', fakeAncGetCachedInformationService);
            $provide.value('AncillariesTransformer', fakeAncillariesTransformer);
            $provide.value('AncillariesCallPaymentsService', fakeAncillariesCallPaymentsService);
            $provide.value('CommonsAncillariesService', fakeCommonsAncillariesService);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('ModalServiceAncillaries', fakeModalServiceAncillaries);
            $provide.value('AncillariesMMBConstants', fakeAncillariesMMBConstants);
            $provide.value('PmtMethodsUpgradingBidsService', fakePmtMethodsUpgradingBidsService);
            $provide.value('GetCountriesListService', fakeGetCountriesListService);
            $provide.value('PmtUpgBidsCreditCardsService', fakePmtUpgBidsCreditCardsService);
            $provide.value('CommonsModalService', fakeCommonsModalService);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('IbCPermanentUserService', fakeIbCPermanentUserService);
            $provide.value('CommonsLoginUtilsService', fakeCommonsLoginUtilsService);
            $provide.value('CommonsGetLoginInfoService', fakeCommonsGetLoginInfoService);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            $provide.value('DatalayerMenusService', fakeDatalayerMenusService);
            $provide.value('CallBundleService', fakeCallBundleService);
        });
        inject((_MmBAncillariesService_, $rootScope, _$location_, _$q_, _localStorageService_) => {
            MmBAncillariesService = _MmBAncillariesService_;
            rootScope = $rootScope;
            testLocation = _$location_;
            $q = _$q_;
            localStorageService = _localStorageService_;
            spyOn(testLocation, 'path');
            spyOn(MmBAncillariesService, 'redirectToPayments');
            spyOn(MmBAncillariesService, 'showPaymentError');
            spyOn(fakeModalServiceAncillaries, 'isNotWaiting');
            spyOn(fakeModalServiceAncillaries,'isError');
            spyOn(fakeCommonsModalService,'showGenericError');
            spyOn(fakeAncillariesTransformer, 'buildAncillariesRequest');
        });
    });
    afterEach(inject(() => {
        localStorageService.set('flowApp', 'MMB');
    }));

    describe('1. When searchAncillariesInfo() is called', () => {
        beforeEach(inject(() => {
            fakeAncGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });
        }));
        it('1.1 should searchAncillariesInfo be called default', (done) => {
            MmBAncillariesService.searchAncillariesInfo();
            rootScope.$digest();
            // expect(MmBAncillariesService.redirectToPayments).toHaveBeenCalled();
            done();
        });

        it('1.2 should searchAncillariesInfo be called localstorage data', (done) => {
            localStorageService.set('bookingInfo', fakeBookingInfo);
            localStorageService.set('ancillariesInfo', fakeAncillariesInfo);
            fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getAncillarieSummary').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve(getAncillarieSummary);
                return deferred.promise;
            });
            MmBAncillariesService.searchAncillariesInfo();
            rootScope.$digest();
            expect(MmBAncillariesService.ModalServiceAncillaries.isNotWaiting).toHaveBeenCalled();
            done();
        });
        it('1.3 should searchAncillariesInfo be called and getAncillarieSummary reject', (done) => {
            localStorageService.set('bookingInfo', fakeBookingInfo);
            localStorageService.set('ancillariesInfo', fakeAncillariesInfo);
            fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getAncillarieSummary').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject(getAncillarieSummary);
                return deferred.promise;
            });
            rootScope.$digest();
            MmBAncillariesService.searchAncillariesInfo();
            rootScope.$digest();
            expect(MmBAncillariesService.ModalServiceAncillaries.isError).toHaveBeenCalled();
            done();
        });
        it('1.4 should searchAncillariesInfo be called and getAncillarieSummary reject in BBKI', (done) => {
            localStorageService.set('flowApp', 'BBKI');
            localStorageService.set('bookingInfo', fakeBookingInfo);
            localStorageService.set('ancillariesInfo', fakeAncillariesInfo);
            fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getAncillarieSummary').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject(getAncillarieSummary);
                return deferred.promise;
            });
            rootScope.$digest();
            MmBAncillariesService.searchAncillariesInfo();
            rootScope.$digest();
            expect(MmBAncillariesService.CommonsModalService.showGenericError).toHaveBeenCalled();
            done();
        });

        it('1.5 should searchAncillariesInfo be called with ancillarieInfo only', (done) => {
            localStorageService.set('bookingInfo', null);
            localStorageService.set('ancillariesInfo', fakeAncillariesInfo);
            localStorageService.set('ancillariesTransformedInfo', fakeAncillariesTransformedInfo);
            MmBAncillariesService.searchAncillariesInfo();
            rootScope.$digest();
            expect(MmBAncillariesService.ModalServiceAncillaries.isNotWaiting).toHaveBeenCalled();
            done();
        });
    });

    xdescribe('2. When searchAncillariesInfo() is called and getCachedInformation reject', () => {
        beforeEach(inject(() => {
            fakeAncGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject({error:403});
                return deferred.promise;
            });
        }));

        it('2.1 should searchAncillariesInfo be called and getCached reject', (done) => {
            localStorageService.set('bookingInfo', null);
            localStorageService.set('ancillariesInfo', fakeAncillariesInfo);
            MmBAncillariesService.searchAncillariesInfo();
            rootScope.$digest();
            done();
        });
    });

    describe('3. When generateRequestAncillaries() is called', () => {
        it('3.1 should deleteAncillarie resolve empty', (done) => {
            localStorageService.set('hasSelectedInsurance', true);
            fakeCommonsAncillariesService.deleteAncillarie = jasmine.createSpy('deleteAncillarie').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });
            rootScope.$digest();
            MmBAncillariesService.generateRequestAncillaries([{}],[{}], null);
            rootScope.$digest();
            // expect(localStorageService.set).toHaveBeenCalledWith('selectedAncillariesInfo');
            done();
        });
        it('3.2 should deleteAncillarie resolve', (done) => {
            localStorageService.set('hasSelectedInsurance', true);
            localStorageService.set('selectedBundle', {id: '1', items: [{type: 'test', subtype: 'test', quantity: 1}]});
            fakeCommonsAncillariesService.deleteAncillarie = jasmine.createSpy('deleteAncillarie').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve({failedToDelete: [{error: {description: 'test', code: 'test'}}]});
                return deferred.promise;
            });
            rootScope.$digest();
            MmBAncillariesService.generateRequestAncillaries([{}],[{}], null);
            rootScope.$digest();
            done();
        });

        it('3.3 should hasSelectedInsurance is false and updateAncillarie', (done) => {
            localStorageService.set('hasSelectedInsurance', false);
            localStorageService.set('flowApp', 'CKI');
            MmBAncillariesService.generateRequestAncillaries([{}],[{}], null);
            rootScope.$digest();
            // expect(localStorageService.set).toHaveBeenCalledWith('selectedAncillariesInfo');
            done();
        });

        xit('3.4 should deleteAncillarie reject', (done) => {
            localStorageService.set('hasSelectedInsurance', true);
            localStorageService.set('flowApp', 'BBKI');
            fakeCommonsAncillariesService.deleteAncillarie = jasmine.createSpy('deleteAncillarie').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject({});
                return deferred.promise;
            });
            rootScope.$digest();
            MmBAncillariesService.generateRequestAncillaries([{}],[{}], null);
            rootScope.$digest();
            expect(MmBAncillariesService.ModalServiceAncillaries.isError).toHaveBeenCalled();
            done();
        });

        xit('3.5 should hasSelectedInsurance is true and reject updateAncillaries', (done) => {
            localStorageService.set('hasSelectedInsurance', true);
            fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy('updateAncillaries').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject({data:{errors: [{code: 'test'}]}, errorCode: 412});
                return deferred.promise;
            });
            MmBAncillariesService.generateRequestAncillaries([],[{}], null);
            rootScope.$digest();
            // expect(localStorageService.set).toHaveBeenCalledWith('selectedAncillariesInfo');
            done();
        });
        xit('3.6 should hasSelectedInsurance is true and reject updateAncillaries and showPaymentError', (done) => {
            localStorageService.set('hasSelectedInsurance', true);
            fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy('updateAncillaries').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject({});
                return deferred.promise;
            });
            MmBAncillariesService.generateRequestAncillaries([],[{}], null);
            rootScope.$digest();
            // expect(MmBAncillariesService.showPaymentError).toHaveBeenCalled();
            done();
        });
        xit('3.7 should hasSelectedInsurance is true and reject updateAncillaries and showPaymentError', (done) => {
            localStorageService.set('hasSelectedInsurance', true);
            fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy('updateAncillaries').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject({});
                return deferred.promise;
            });
            MmBAncillariesService.generateRequestAncillaries([],[], true);
            rootScope.$digest();
            // expect(MmBAncillariesService.showPaymentError).toHaveBeenCalled();
            done();
        });
    });
    describe('4. When redirectAfterLoginSoftUser() is called', () => {
        it('4.1 should redirectAfterLoginSoftUser be called', (done) => {
            localStorageService.set('flowApp', 'CKI');
            MmBAncillariesService.redirectAfterLoginSoftUser();
            rootScope.$digest();
            expect(fakeCommonsModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
        it('4.2 should redirectAfterLoginSoftUser be called and checkcustomerStatus reject', (done) => {
            localStorageService.set('flowApp', 'CKI');
            fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine.createSpy('checkCustomerStatus').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject();
                return deferred.promise;
            });
            rootScope.$digest();
            MmBAncillariesService.redirectAfterLoginSoftUser();
            rootScope.$digest();
            expect(fakeIbCPermanentUserService.removeParamsAfterLogin).toHaveBeenCalled();
            done();
        });
    });
    describe('5. When cancelBidOffer() is called', () => {
        it('5.1 should cancelBidOffer be called', (done) => {
            MmBAncillariesService.cancelBidOffer({id: 'test'}, {});
            rootScope.$digest();
            // expect(fakeMmBModalService.showGenericError).toHaveBeenCalled();
            done();
        });
    });
    describe('6. When transformInfoSendToConfirmation() is called', () => {
        it('6.1 should transformInfoSendToConfirmation be called', (done) => {
            MmBAncillariesService.transformInfoSendToConfirmation();
            rootScope.$digest();
            expect(MmBAncillariesService.AncillariesTransformer.transformInfoSendToConfirmation).toHaveBeenCalled();
            done();
        });
    });

    describe('7. When modifiedSeats() is called', () => {
        it('7.1 should transformInfoSendToConfirmation be called', (done) => {
            MmBAncillariesService.modifiedSeats({}, {}, {});
            rootScope.$digest();
            // expect(localStorageService.set).toHaveBeenCalledWith('seatMapSegment');
            done();
        });
    });

    describe('8. When deleteAviosAncillaries() is called', () => {
        it('8.1 should deleteAviosAncillaries be called and type', (done) => {
            spyOn(fakeAncillariesTransformer,'deleteAncillaryByType');
            localStorageService.set('flightAviosInfo', {passengers: [{id: '1', ancillaries: [{type: 'typetest'}]}]})
            MmBAncillariesService.deleteAviosAncillaries('1', 'typetest');
            rootScope.$digest();
            expect(fakeAncillariesTransformer.deleteAncillaryByType).toHaveBeenCalled();
            done();
        });
        it('8.1 should deleteAviosAncillaries be called and subtype', (done) => {
            spyOn(fakeAncillariesTransformer,'deleteAncillaryBySubType');
            localStorageService.set('flightAviosInfo', {passengers: 'subtype'})
            MmBAncillariesService.deleteAviosAncillaries('1', '', 'subtype');
            rootScope.$digest();
            expect(fakeAncillariesTransformer.deleteAncillaryBySubType).toHaveBeenCalled();
            done();
        });
    });

    describe('9. When getPaymentMethodsUpgradingBids() is called', () => {
        it('9.1 should getPaymentMethodsUpgradingBids be called', (done) => {
            spyOn(fakeAncillariesTransformer,'generateModelPayMethods');
            MmBAncillariesService.getPaymentMethodsUpgradingBids({},{},{});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.generateModelPayMethods).toHaveBeenCalled();
            done();
        });
    });

    describe('10. When getUpdateSeatInfo() is called', () => {
        it('10.1 should getUpdateSeatInfo be called', (done) => {
            spyOn(fakeAncillariesTransformer,'getUpdateSeatInfo');
            MmBAncillariesService.getUpdateSeatInfo({});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.getUpdateSeatInfo).toHaveBeenCalled();
            done();
        });
    });

    describe('11. When updateSeatInformation() is called', () => {
        it('11.1 should updateSeatInformation be called', (done) => {
            spyOn(fakeAncillariesTransformer,'updateSeatInformation')
            MmBAncillariesService.updateSeatInformation({},{});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.updateSeatInformation).toHaveBeenCalled();
            done();
        });
    });

    describe('12. When manageAviosModal() is called', () => {
        it('12.1 should manageAviosModal be called', (done) => {
            spyOn(fakeModalServiceAncillaries,'openAviosAccumulatedModal')
            MmBAncillariesService.manageAviosModal(50);
            rootScope.$digest();
            expect(fakeModalServiceAncillaries.openAviosAccumulatedModal).toHaveBeenCalled();
            done();
        });
    });

    describe('13. When getAviosAncillariesFlex() is called', () => {
        it('13.1 should getAviosAncillariesFlex be called', (done) => {
            spyOn(fakeAncillariesTransformer,'genAviosFlexOnDemandReq')
            MmBAncillariesService.getAviosAncillariesFlex({});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.genAviosFlexOnDemandReq).toHaveBeenCalled();
            done();
        });
    });

    describe('14. When getAviosAncillariesSummaryReq() is called', () => {
        it('14.1 should getAviosAncillariesSummaryReq be called', (done) => {
            spyOn(fakeAncillariesTransformer,'genAviosAncillariesSummaryReq')
            MmBAncillariesService.getAviosAncillariesSummaryReq({},{});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.genAviosAncillariesSummaryReq).toHaveBeenCalled();
            done();
        });
    });

    describe('15. When getReqAviosAncillariesSpeq() is called', () => {
        it('15.1 should getReqAviosAncillariesSpeq be called', (done) => {
            spyOn(fakeAncillariesTransformer,'genAviosSpeqReq')
            MmBAncillariesService.getReqAviosAncillariesSpeq({});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.genAviosSpeqReq).toHaveBeenCalled();
            done();
        });
    });

    describe('16. When getReqAviosAncillariesBaggages() is called', () => {
        it('16.1 should getReqAviosAncillariesBaggages be called', (done) => {
            spyOn(fakeAncillariesTransformer,'genReqAviosAncillariesBaggages')
            MmBAncillariesService.getReqAviosAncillariesBaggages({});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.genReqAviosAncillariesBaggages).toHaveBeenCalled();
            done();
        });
    });

    describe('17. When getReqAviosAncillariesPriorityBoarding() is called', () => {
        it('17.1 should getReqAviosAncillariesPriorityBoarding be called', (done) => {
            spyOn(fakeAncillariesTransformer,'genAviosPriorityReq')
            MmBAncillariesService.getReqAviosAncillariesPriorityBoarding({});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.genAviosPriorityReq).toHaveBeenCalled();
            done();
        });
    });

    describe('18. When genTripsAncillaries() is called', () => {
        it('18.1 should genTripsAncillaries be called', (done) => {
            spyOn(fakeAncillariesTransformer,'genStructureForAncillaries')
            MmBAncillariesService.genTripsAncillaries({});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.genStructureForAncillaries).toHaveBeenCalled();
            done();
        });
    });

    describe('19. When cancelSeat() is called', () => {
        it('19.1 should cancelSeat be called', (done) => {
            spyOn(fakeModalServiceAncillaries,'isWaiting');
            MmBAncillariesService.cancelSeat({}, {});
            rootScope.$digest();
            expect(fakeModalServiceAncillaries.isWaiting).toHaveBeenCalled();
            done();
        });
    });

    describe('20. When getPriceOfferInsurance() is called', () => {
        it('20.1 should getPriceOfferInsurance be called', (done) => {
            spyOn(fakeCurrencyService,'formatPrice');
            MmBAncillariesService.getPriceOfferInsurance('€', {premium:true});
            rootScope.$digest();
            expect(fakeCurrencyService.formatPrice).toHaveBeenCalled();
            done();
        });
    });

    describe('21. When calculateTotalBaggages() is called', () => {
        it('21.1 should calculateTotalBaggages be called', (done) => {
            spyOn(fakeAncillariesTransformer,'calculateTotalBaggages');
            MmBAncillariesService.calculateTotalBaggages({});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.calculateTotalBaggages).toHaveBeenCalled();
            done();
        });
    });

    describe('22. When calculateTotalSpeqs() is called', () => {
        it('22.1 should calculateTotalSpeqs be called', (done) => {
            spyOn(fakeAncillariesTransformer,'calculateTotalSpeqs');
            MmBAncillariesService.calculateTotalSpeqs({});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.calculateTotalSpeqs).toHaveBeenCalled();
            done();
        });
    });

    describe('22. When countBaggageTotal() is called', () => {
        it('22.1 should countBaggageTotal be called', (done) => {
            spyOn(fakeAncillariesTransformer,'countBaggageTotal');
            MmBAncillariesService.countBaggageTotal({});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.countBaggageTotal).toHaveBeenCalled();
            done();
        });
    });

    describe('23. When countSpeqsTotal() is called', () => {
        it('23.1 should countSpeqsTotal be called', (done) => {
            spyOn(fakeAncillariesTransformer,'countSpeqsTotal');
            MmBAncillariesService.countSpeqsTotal({});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.countSpeqsTotal).toHaveBeenCalled();
            done();
        });
    });

    describe('24. When countSeatsTotal() is called', () => {
        it('24.1 should countSeatsTotal be called', (done) => {
            spyOn(fakeAncillariesTransformer,'countSeatsTotal');
            MmBAncillariesService.countSeatsTotal({});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.countSeatsTotal).toHaveBeenCalled();
            done();
        });
    });

    describe('25. When calculateTotalSeats () is called', () => {
        it('25.1 should calculateTotalSeats be called', (done) => {
            spyOn(fakeAncillariesTransformer,'calculateTotalSeats');
            MmBAncillariesService.calculateTotalSeats({});
            rootScope.$digest();
            expect(fakeAncillariesTransformer.calculateTotalSeats).toHaveBeenCalled();
            done();
        });
    });

    xdescribe('26. When deleteAncillaryUpgBids () is called', () => {
        it('26.1 should deleteAncillaryUpgBids be called', (done) => {
            // spyOn(fakeAncillariesTransformer,'calculateTotalSeats');
            MmBAncillariesService.deleteAncillaryUpgBids({});
            rootScope.$digest();
            // expect(fakeAncillariesTransformer.calculateTotalSeats).toHaveBeenCalled();
            done();
        });
    });

    describe('27. When addCarbonFootprintToBasket () is called', () => {
        it('27.1 should addCarbonFootprintToBasket be called', (done) => {
            // spyOn(fakeAncillariesTransformer,'calculateTotalSeats');
            MmBAncillariesService.addCarbonFootprintToBasket('', 25, 50);
            rootScope.$digest();
            // expect(fakeAncillariesTransformer.calculateTotalSeats).toHaveBeenCalled();
            done();
        });
    });

    describe('28. When updateCarbonFootprint () is called', () => {
        it('28.1 should updateCarbonFootprint be called', (done) => {
            MmBAncillariesService.updateCarbonFootprint(25, 50);
            rootScope.$digest();
            done();
        });
    });

    describe('29. When cleanSessionAncillaries() is called', () => {
        it('29.1 should clean ancillaries session data', (done) => {
            localStorageService.set('ancillariesInfo', {
                shoppingBasket: {}
            });
            localStorageService.set('headerModel', {
                headerModel: {
                    shoppingBasket: {
                        baggages: {},
                        seats : {},
                        insurance : {},
                        flexibilization : {},
                        upgrading : {},
                        speqs: {},
                        priorityBoarding: {}
                    }
                }
            });
            localStorageService.set('addToCart', {
                ecommerce: {
                    items: [
                        {
                            item_name: 'baggage',
                        },
                        {
                            item_name: 'seat',
                        },
                        {
                            item_name: 'insurance',
                        },
                        {
                            item_name: 'flexibilization',
                        },
                        {
                            item_name: 'special baggage',
                        },
                        {
                            item_name: 'priority boarding',
                        }
                    ]
                }
            });

            MmBAncillariesService.cleanSessionAncillaries();
            rootScope.$digest();

            done();
        });
    });

});
