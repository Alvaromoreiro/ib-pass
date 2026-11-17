/* global angular, describe, beforeEach, inject, it, expect, jasmine, spyOn */

describe('UpgradeService', function () {
    'use strict';

    let UpgradeService;
    let $q;
    let $rootScope;
    let storage;
    let location;
    let transformer;
    let modalService;
    let paymentsService;
    let ancillariesService;
    let commonsAncillariesService;
    let headerFacade;
    let paymentService;
    let sce;
    let cachedInformationService;
    let constants;
    let storedValues;

    function resolve (value) {
        return $q.when(value);
    }

    function reject (value) {
        return $q.reject(value);
    }

    function flushPromises () {
        $rootScope.$digest();
    }

    function configureModule () {
        angular.mock.module('ib-check-in-upgrade-module', function ($provide) {
            $provide.value('localStorageService', storage);
            $provide.value('GetCKICachedInformationService', cachedInformationService);
            $provide.value('$location', location);
            $provide.value('UpgradeTransformer', transformer);
            $provide.value('ModalService', modalService);
            $provide.value('CheckPaymentsService', paymentsService);
            $provide.value('CheckAncillariesService', ancillariesService);
            $provide.value('CommonsAncillariesService', commonsAncillariesService);
            $provide.value('$sce', sce);
            $provide.value('CheckinAppConstants', constants);
            $provide.value('NewMainHeaderFacade', headerFacade);
            $provide.value('IbAncillariesPaymentUtilsService', paymentService);
        });
    }

    function createStorageDependencies () {
        storedValues = {
            headerModel: {
                headerModel: {
                    shoppingBasket: {}
                }
            }
        };

        storage = {
            get: jasmine.createSpy('get').and.callFake(function (key) {
                return Object.prototype.hasOwnProperty.call(storedValues, key) ? storedValues[key] : null;
            }),
            set: jasmine.createSpy('set').and.callFake(function (key, value) {
                storedValues[key] = value;
            })
        };
    }

    function createCoreServiceMocks () {
        location = {
            path: jasmine.createSpy('path')
        };

        transformer = {
            generateUpgradeModel: jasmine.createSpy('generateUpgradeModel'),
            modifiedCachedInfo: jasmine.createSpy('modifiedCachedInfo')
        };

        modalService = {
            isWaiting: jasmine.createSpy('isWaiting'),
            isNotWaiting: jasmine.createSpy('isNotWaiting'),
            setErrorMessage: jasmine.createSpy('setErrorMessage'),
            setErrorCode: jasmine.createSpy('setErrorCode'),
            isError: jasmine.createSpy('isError')
        };

        paymentsService = {
            checkPayments: jasmine.createSpy('checkPayments')
        };
    }

    function createAncillaryServiceMocks () {
        ancillariesService = {
            checkAncillaries: jasmine.createSpy('checkAncillaries').and.callFake(function () {
                return resolve({});
            })
        };

        commonsAncillariesService = {
            updateAncillaries: jasmine.createSpy('updateAncillaries').and.callFake(function () {
                return resolve([{ segments: [] }]);
            }),
            getAncillarieSummary: jasmine.createSpy('getAncillarieSummary').and.callFake(function () {
                return resolve({
                    currencies: ['EUR'],
                    context: { issueCurrency: 'EUR' },
                    pendingPaymentItems: []
                });
            })
        };
    }

    function createIntegrationMocks () {
        headerFacade = {
            updateHeaderModel: jasmine.createSpy('updateHeaderModel')
        };

        paymentService = {
            getHeaderUpgradingInfo: jasmine.createSpy('getHeaderUpgradingInfo').and.returnValue({ amount: 100 }),
            setAncillariesCurrency: jasmine.createSpy('setAncillariesCurrency')
        };

        sce = {
            trustAsResourceUrl: jasmine.createSpy('trustAsResourceUrl').and.callFake(function (url) {
                return url;
            })
        };

        cachedInformationService = {
            getCachedInformation: jasmine.createSpy('getCachedInformation')
        };

        constants = {
            DEFAULT_ENDPOINTS: {
                renacen3dFeaturesCssPRO: 'https://example.com/features.css',
                renacen3dFeaturesJsPRO: 'https://example.com/features.js'
            }
        };
    }

    function createDependencies () {
        createStorageDependencies();
        createCoreServiceMocks();
        createAncillaryServiceMocks();
        createIntegrationMocks();
    }

    function expectUpgradeErrorHandled (error) {
        expect(modalService.isNotWaiting).toHaveBeenCalled();
        expect(modalService.setErrorMessage).toHaveBeenCalledWith(error.message);
        expect(modalService.setErrorCode).toHaveBeenCalledWith(error.internalErrorCode);
        expect(modalService.isError).toHaveBeenCalledWith(error);
    }

    beforeEach(function () {
        createDependencies();
        configureModule();
    });

    beforeEach(inject(function (_$q_, _$rootScope_, _UpgradeService_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        UpgradeService = _UpgradeService_;
        spyOn($rootScope, '$broadcast');
    }));

    describe('generateUpgradeModel', function () {
        it('should resolve the transformed model using cached booking information', function () {
            const upgradeInfo = { offer: 'upgrade-offer' };
            const bookingInfo = { locator: 'ABC123' };
            const transformedModel = { cabin: 'Business' };
            let result;

            storedValues.upgradeInfo = upgradeInfo;
            storedValues.bookingInfo = bookingInfo;
            transformer.generateUpgradeModel.and.returnValue(transformedModel);

            UpgradeService.generateUpgradeModel().then(function (model) {
                result = model;
            });

            flushPromises();

            expect(transformer.generateUpgradeModel).toHaveBeenCalledWith(upgradeInfo, bookingInfo);
            expect(cachedInformationService.getCachedInformation).not.toHaveBeenCalled();
            expect(modalService.isNotWaiting).toHaveBeenCalled();
            expect(result).toBe(transformedModel);
        });

        it('should retrieve booking information when it is not stored locally', function () {
            const upgradeInfo = { offer: 'upgrade-offer' };
            const bookingInfo = { locator: 'DEF456' };
            const transformedModel = { cabin: 'Premium Economy' };
            let result;

            storedValues.upgradeInfo = upgradeInfo;
            cachedInformationService.getCachedInformation.and.returnValue(resolve(bookingInfo));
            transformer.generateUpgradeModel.and.returnValue(transformedModel);

            UpgradeService.generateUpgradeModel().then(function (model) {
                result = model;
            });

            flushPromises();

            expect(cachedInformationService.getCachedInformation).toHaveBeenCalled();
            expect(transformer.generateUpgradeModel).toHaveBeenCalledWith(upgradeInfo, bookingInfo);
            expect(result).toBe(transformedModel);
        });

        it('should reject and validate payments when upgrade information is missing', function () {
            let rejected = false;

            UpgradeService.generateUpgradeModel().catch(function () {
                rejected = true;
            });

            flushPromises();

            expect(rejected).toBe(true);
            expect(storage.set).toHaveBeenCalledWith('nextStepAllowed', false);
            expect(paymentsService.checkPayments).toHaveBeenCalled();
        });

        it('should reject and redirect to the payment flow when cached information fails', function () {
            const error = { message: 'Unable to retrieve booking information' };
            let receivedError;

            storedValues.upgradeInfo = { offer: 'upgrade-offer' };
            storedValues.pendingPayments = true;
            cachedInformationService.getCachedInformation.and.returnValue(reject(error));
            ancillariesService.checkAncillaries.and.returnValue(reject());

            UpgradeService.generateUpgradeModel().catch(function (response) {
                receivedError = response;
            });

            flushPromises();

            expect(receivedError).toBe(error);
            expect(paymentsService.checkPayments).toHaveBeenCalled();
            expect(modalService.isNotWaiting).toHaveBeenCalled();
        });
    });

    describe('updateUpgradeInformation', function () {
        it('should update accepted upgrade information and refresh the header', function () {
            const upgradeInformation = {
                offer: 'offer-id',
                upgradingAccepted: true
            };
            const cabinLayout = 'business-cabin';
            const response = [{ segments: ['segment-1'] }];
            const summary = {
                currencies: ['EUR'],
                context: { issueCurrency: 'EUR' },
                pendingPaymentItems: [{ type: 'UPGRADING' }]
            };

            storedValues.PNR = 'PNR123';
            storedValues.bookingInfo = { locator: 'PNR123' };
            commonsAncillariesService.updateAncillaries.and.returnValue(resolve(response));
            commonsAncillariesService.getAncillarieSummary.and.returnValue(resolve(summary));

            UpgradeService.updateUpgradeInformation(upgradeInformation, cabinLayout);
            flushPromises();

            expect(modalService.isWaiting).toHaveBeenCalled();
            expect(commonsAncillariesService.updateAncillaries).toHaveBeenCalledWith([{
                type: 'UPGRADING',
                offer: 'offer-id',
                upgradingAccepted: true
            }]);
            expect(transformer.modifiedCachedInfo).toHaveBeenCalledWith({
                acceptedSegments: ['segment-1']
            }, cabinLayout, { locator: 'PNR123' });
            expect(storage.set).toHaveBeenCalledWith('pendingPayments', true);
            expect(headerFacade.updateHeaderModel).toHaveBeenCalled();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('updateHeaderUpgrading', { amount: 100 });
            expect(storage.set).toHaveBeenCalledWith('upgradinfInfoAccepted', {
                offer: upgradeInformation,
                cabins: cabinLayout
            });
            expect(paymentService.setAncillariesCurrency).toHaveBeenCalledWith(['EUR'], 'EUR');
        });

        it('should refresh ancillary currency without storing upgrade data when it is not accepted', function () {
            const upgradeInformation = {
                offer: 'offer-id',
                upgradingAccepted: false
            };

            UpgradeService.updateUpgradeInformation(upgradeInformation);
            flushPromises();

            expect(transformer.modifiedCachedInfo).not.toHaveBeenCalled();
            expect(headerFacade.updateHeaderModel).not.toHaveBeenCalled();
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
            expect(paymentService.setAncillariesCurrency).toHaveBeenCalledWith(['EUR'], 'EUR');
        });

        it('should display an error when the upgrade update fails', function () {
            const error = {
                message: 'Upgrade failed',
                internalErrorCode: 'UPGRADE_ERROR'
            };

            commonsAncillariesService.updateAncillaries.and.returnValue(reject(error));

            UpgradeService.updateUpgradeInformation({ offer: 'offer-id', upgradingAccepted: true });
            flushPromises();

            expectUpgradeErrorHandled(error);
        });

        it('should display an error when the ancillary summary retrieval fails', function () {
            const error = {
                message: 'Summary failed',
                internalErrorCode: 'SUMMARY_ERROR'
            };

            commonsAncillariesService.getAncillarieSummary.and.returnValue(reject(error));

            UpgradeService.updateUpgradeInformation({ offer: 'offer-id', upgradingAccepted: true });
            flushPromises();

            expectUpgradeErrorHandled(error);
        });
    });

    describe('initRenacen3dScript', function () {
        it('should prepend the Renacen 3D stylesheet and script resources', function () {
            const body = document.querySelector('body');
            const prependedElements = [];

            window.env = { production: true };
            spyOn(body, 'prepend').and.callFake(function (element) {
                prependedElements.push(element);
            });

            UpgradeService.initRenacen3dScript();

            expect(sce.trustAsResourceUrl).toHaveBeenCalledWith(constants.DEFAULT_ENDPOINTS.renacen3dFeaturesCssPRO);
            expect(sce.trustAsResourceUrl).toHaveBeenCalledWith(constants.DEFAULT_ENDPOINTS.renacen3dFeaturesJsPRO);

            expect(prependedElements[0].tagName).toBe('SCRIPT');
            expect(prependedElements[0].src).toContain('features.js');

            expect(prependedElements[1].tagName).toBe('LINK');
            expect(prependedElements[1].href).toContain('features.css');
        });
    });
});
