import { StorageServiceMock } from '../../../../mocks/Services/StorageServiceMock';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
// TODO - Recover tests
describe('BookingPassengerInfoService Test', function () {

    var bookingPassengerInfoService, rootScope, $q, testWindow, timeout;
    var mockResponse = { data: 'Ok' };
        const PARTNERRESPONSE = {
            partners: [
                {
                    partnerIdentifier: 'SAN',
                    partnerName: 'SANTANDER',
                    type: 'Product and registration (cobrand) assignment',
                    partnerProduct: {
                        identifier: '68',
                        productName: 'SANTANDER SME ELITE',
                        percentDiscount: 10,
                        productDescription: 'Plan Santander IberiaPlus',
                        productTier: 'ELITE',
                        startDate: '2021-04-20T11:37:21.000Z',
                        priority: '9',
                        userMustFly: true
                    }
                },
                {
                    partnerIdentifier: 'IBCARDS',
                    partnerName: 'Iberia Cards',
                    type: 'Collection Partner assigment',
                    partnerProduct: {
                        identifier: '0',
                        productName: 'Iberia Cards',
                        productDescription: 'Iberia Cards',
                        productTier: '',
                        percentDiscount: 5,
                        startDate: '2021-04-20T11:37:21.000Z',
                        priority: '0',
                        userMustFly: false
                    }
                }
            ]
        };
    var fakeBookingPassengerInfoProxy = {
        createOrder: jasmine.createSpy(),
        getSecurityInfo: jasmine.createSpy()
    };
    var mockFareData = {
        'data': {
            'offers': [{
                'specialDiscountsApplied': [{
                    'type': 'CORPORATE',
                    'discountType': 'PRUEBA'
                }],
                'priceSpecialDiscount': {
                    'totalDiscount': '100€'
                }
            }]
        }
    };
    let mockBookingMetaSearch = {
            data:{
                offers:[
                    {
                        specialDiscountsApplied:[
                            {
                                type:'CORPORATE',
                                discountType: '',
                                priceSpecialDiscount: {
                                    totalDiscount: 11
                                }
                            }
                        ]
                    },
                    {}
                ]
            }
    }
    const fakeBookingAppConstants = require('../../../../mocks/constants/BookingAppConstants-mock.json');
    const fakeUrlParamsResLF = require('../../../../mocks/storage/BookingUrlParams-MAD-PMI-resident-largeFamily-mock.json');
    const fakeOriginDestinationMadPmi = require('../../../../mocks/storage/BookingOriginDestination-MAD-PMI-mock.json');
    const fakeAncillariesInfoMock = require('../../../../mocks/storage/AncillariesInfo-mock.json')

    var fakeBookingFareService = {
        getBookingFare: jasmine.createSpy('getBookingFare').and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve(mockFareData);
            return deferred.promise;
        })
    }
    var fakeCallBookingMetaSearchService = {
        getBookingMetaSearch: jasmine.createSpy('getBookingMetaSearch').and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve(mockFareData);
            return deferred.promise;
        })
    }
    var fakeBookingPassengerInfoTransformer = {
        transformUpdatePassengerInfoData: jasmine.createSpy(),
        transformSecurityInfoPassengerData: jasmine.createSpy(),
        arePassengersBirthDatesValid: jasmine.createSpy(),
        cleanErrorResidents: jasmine.createSpy(),
        transformContactData: jasmine.createSpy(),
        getAssociatesTransformed: jasmine.createSpy(),
        generateMetaUrl: jasmine.createSpy(),
        transformProfileRemindError: jasmine.createSpy(),
        genCalcAviosFlightReq: jasmine.createSpy(),
        TransCalcPointsData: jasmine.createSpy(),
        generateContactDataReq: jasmine.createSpy(),
        generateTravPrefReq: jasmine.createSpy(),
        generatePersonalDataReq: jasmine.createSpy()
    };
    var fakeBookingGetPrefixesService = {
        getPrefixes: jasmine.createSpy(),
    }
    var fakeBookingGetCountriesListService = {
        getCountriesList: jasmine.createSpy(),
    }
    var fakeBookingGetCompaniesService = {
        getCompanies: jasmine.createSpy(),
    }
    var fakeBookingUtilsErrorService = {
        processGeneralError: jasmine.createSpy(),
        unauthorizedError: jasmine.createSpy(),
        timeOutError: jasmine.createSpy(),
        processGeneralErrorWithProperties: jasmine.createSpy()
    };
    var fakeBookingUtilService = {
        getCommercialsellingDataByMarket: jasmine.createSpy(),
        getURLFirstParameterByName: jasmine.createSpy(),
        getEndpoint: jasmine.createSpy(),
        getDeviceType: jasmine.createSpy(),
        getBackGroundURL: jasmine.createSpy(),
        getPassengersId: jasmine.createSpy(),
        getNumberTypePas: jasmine.createSpy(),
        isUserLogged: jasmine.createSpy('isUserLogged').and.callFake(function () {
            return false;
        })
    };
    var fakeDatalayerUtilsService = {
        'generateConfirmationDatalayerObject': jasmine.createSpy(),
        'setAncillariesAction': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'generateDatalayerAncillaries': jasmine.createSpy()
    };
    var fakeGdprService = {
        getGdprInfo: jasmine.createSpy()
    };
    var fakeLoggedService = {
        checkCustomerStatus: jasmine.createSpy('checkCustomerStatus').and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve(true);
            return deferred.promise;
        }),
        checkLoginStatus: jasmine.createSpy('checkLoginStatus').and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve(true);
            return deferred.promise;
        })
    };
    var fakeDatalayerConstants = {
        'DATALAYER_EVENT_TYPES': {
            'VIEW': 'VIEW'
        }
    };

    var fakeCalculatePointsService = {
        getCalculatePoints: jasmine.createSpy('checkCustomerStatus').and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve(true);
            return deferred.promise;
        }),
    };
    let fakeBookingPromiseProxy = {
        getGeneric: jasmine.createSpy(),
        postGeneric: jasmine.createSpy(),
    };
    let fakeBookingPromiseSalesforceProxy = {
        get: jasmine.createSpy().and.callFake(function () {
            return Promise.resolve({});
        })
    };
    let fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy()
    };
    let fakeGetPhoneCodesService = {
        getPhoneCodesList: jasmine.createSpy()
    };
    let fakeGetCountriesListService = {
        getCountriesList: jasmine.createSpy()
    };
    let fakeIbBookingCalculatePointsService = {
        getCalculateFlightsAvios: jasmine.createSpy()
    };
    let fakeIBCTravelPreferencesService = {
        getTravelPreferences: jasmine.createSpy(),
        updateTravelPreferences: jasmine.createSpy(),
    };
    let fakeIBCContactDataService = {
        getContactData: jasmine.createSpy(),
        updateContactData: jasmine.createSpy(),
    };
    let fakeIBCAssociatesService = {
        getRetrieveAssociate: jasmine.createSpy()
    };
    let fakeCommonsUserUtilsService = {
        isIbZero: jasmine.createSpy(),
        isSoftUser: jasmine.createSpy(),
        isIbPlus: jasmine.createSpy(),
    };
    let fakeIBCContactDetailsZeroService = {
        updateContactDetailsData: jasmine.createSpy(),
        getContactDetailsData: jasmine.createSpy()
    };
    let fakeIBCPersonalDataZeroService = {
        getPersonalData: jasmine.createSpy(),
        updatePersonalData: jasmine.createSpy()
    };
    let fakeIBCPersonalDataService = {
        getPersonalData: jasmine.createSpy(),
        updatePersonalData: jasmine.createSpy()
    };
    let fakeIBCAssociatesZeroService = {
        getRetrieveAssociateZero: jasmine.createSpy()
    };
    let fakeIbSetPartnersSelectionUtilsService = {
        setPartnersModal: jasmine.createSpy()
    };
    let fakeBookingIgnoreOrderService = {
        ignoreOrder: jasmine.createSpy()
    };
    let fakeIbCheckPartnersDiscountsService = {
        getSelectedPartner: jasmine.createSpy(),
        getPartnersDiscountsApplicationFlag: jasmine.createSpy(),
        getCurrentUserStoredPreference: jasmine.createSpy(),
        getPartnersResponse: jasmine.createSpy(),
        setSelectedPartnerDiscount: jasmine.createSpy(),
    };
    let fakeRedirectionService = {
        externalRedirect: jasmine.createSpy()
    };
    let fakeSessionStorage = new StorageServiceMock();
    let fakeBookingLocalDiscountsService = {
        isResidentAvailable: jasmine.createSpy().and.callFake(function () {
            return true;
        })
    };
    let fakeCurrencyService = {
        getCurrencyObject: jasmine.createSpy('getCurrencyObject').and.returnValue({})
    }
    let fakeCallAncillariesService = {
        getAncillaries: jasmine.createSpy('getAncillaries').and.callFake(() => Promise.reject())
    }
    let fake$cookies = {
        get: jasmine.createSpy('get').and.returnValue('')
    }

    let fakeIbBookingPassengerInfoUtilsService = {
        deleteTemporalPNR : jasmine.createSpy()
    }
    
    let fakePassengerControlOrderService = {
        controlOrder: jasmine.createSpy('controlOrder').and.callFake(() => Promise.resolve())
    }

    const fakeIbTravelDocumentsService = {
        getTravelDocuments : jasmine.createSpy('getTravelDocuments').and.returnValue(Promise.resolve({}))
    }

    const fakeBookingPassengerInfoConstants = {
        'CORPORATE': 'CORPORATE',
        SHOW_GENDER_TYPES: ['TITLE', 'GENDER'],
     }


    beforeEach(function () {
        testWindow = { location: { href: '' , hash: ''} };
        fakeSessionStorage = new StorageServiceMock();
        angular.mock.module('ib-booking-passenger-info-module', function ($provide) {
            $provide.value('BookingAppConstants', { 'DEFAULT_ENDPOINTS': { 'createOrderServiceURI': 'createOrderServiceURI', recoverUserName: '/agl/v2/programmes/{{programme-identifier}}/security-profile/profile-reminder' } });
            $provide.value('BookingPassengerInfoProxy', fakeBookingPassengerInfoProxy);
            $provide.value('BookingPassengerInfoTransformer', fakeBookingPassengerInfoTransformer);
            $provide.value('BookingGetPrefixesService', fakeBookingGetPrefixesService);
            $provide.value('BookingGetCountriesListService', fakeBookingGetCountriesListService);
            $provide.value('BookingGetCompaniesService', fakeBookingGetCompaniesService);
            $provide.value('BookingUtilsErrorService', fakeBookingUtilsErrorService);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('BookingFareService', fakeBookingFareService);
            $provide.value('GdprService', fakeGdprService);
            $provide.value('LoggedService', fakeLoggedService);
            $provide.value('BookingPassengerInfoConstants', fakeBookingPassengerInfoConstants);
            $provide.value('DatalayerConstants', fakeDatalayerConstants);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('CallBookingMetaSearchService', fakeCallBookingMetaSearchService);
            $provide.value('CalculatePointsService', fakeCalculatePointsService);
            $provide.value('CommonsSessionStorageService', fakeSessionStorage);
            $provide.value('BookingPromiseProxy', fakeBookingPromiseProxy);
            $provide.value('BookingPromiseSalesforceProxy', fakeBookingPromiseSalesforceProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('GetPhoneCodesService', fakeGetPhoneCodesService);
            $provide.value('GetCountriesListService', fakeGetCountriesListService);
            $provide.value('IbBookingCalculatePointsService', fakeIbBookingCalculatePointsService);
            $provide.value('IBCTravelPreferencesService', fakeIBCTravelPreferencesService);
            $provide.value('IBCContactDataService', fakeIBCContactDataService);
            $provide.value('IBCAssociatesService', fakeIBCAssociatesService);
            $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
            $provide.value('IBCContactDetailsZeroService', fakeIBCContactDetailsZeroService);
            $provide.value('IBCPersonalDataZeroService', fakeIBCPersonalDataZeroService);
            $provide.value('IBCPersonalDataService', fakeIBCPersonalDataService);
            $provide.value('IBCAssociatesZeroService', fakeIBCAssociatesZeroService);
            $provide.value('IbCheckPartnersDiscountsService', fakeIbCheckPartnersDiscountsService);
            $provide.value('IbSetPartnersSelectionUtilsService', fakeIbSetPartnersSelectionUtilsService);
            $provide.value('BookingIgnoreOrderService', fakeBookingIgnoreOrderService);
            $provide.value('BookingRedirectionService', fakeRedirectionService);
            $provide.value('BookingLocalDiscountsService', fakeBookingLocalDiscountsService);
            $provide.value('$window', testWindow);
            $provide.value('HttpServicesConstants', HttpServicesConstants);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('CallAncillariesService', fakeCallAncillariesService);
            $provide.value('$cookies', fake$cookies);
            $provide.value('IbBookingPassengerInfoUtilsService', fakeIbBookingPassengerInfoUtilsService);
            $provide.value('IbTravelDocumentsService', fakeIbTravelDocumentsService);
            $provide.value('PassengerControlOrderService', fakePassengerControlOrderService);
        });
        inject(function (_$q_, $timeout, _BookingPassengerInfoService_, $rootScope) {
            bookingPassengerInfoService = _BookingPassengerInfoService_;
            rootScope = $rootScope;
            rootScope.timeSession = {};
            $q = _$q_;
            timeout = $timeout;
        });
        fakeIbCheckPartnersDiscountsService.getPartnersDiscountsApplicationFlag.and.returnValue(false);
        fakeCommonsNewHttpUtilsErrorService.controlError.and.callFake((error, reject) => {
            if (typeof reject === 'function') {
                reject(error);
            }
        });
        fakeBookingPromiseProxy.get = jasmine.createSpy('get')
    });

    it('bookingPassengerInfoService debe existir y ser accesible', function () {
        expect(bookingPassengerInfoService).toBeDefined();
    });

    
    describe('When checkAncillaries is called', function () {
        beforeEach(function () {
            fakeSessionStorage.clear();
            fakeCallAncillariesService.getAncillaries.calls.reset();
        });

        it('should resolve with true if ancillaries are available', function (done) {
            spyOn(bookingPassengerInfoService, 'findAvailableAncillary').and.returnValue(true);
            spyOn(bookingPassengerInfoService, 'actionsInSpecialAncillaries').and.callThrough();
            fakeCallAncillariesService.getAncillaries.and.callFake(() => Promise.resolve(fakeAncillariesInfoMock));
            fakeCurrencyService.getCurrencyObject.and.returnValue({ code: 'EUR' });
            bookingPassengerInfoService.checkAncillaries().then(function (result) {
                
                expect(result).toBe(true);
                expect(bookingPassengerInfoService.findAvailableAncillary).toHaveBeenCalledWith(fakeAncillariesInfoMock);
                expect(bookingPassengerInfoService.actionsInSpecialAncillaries).toHaveBeenCalledWith(fakeAncillariesInfoMock);
                done();
            }).catch(done.fail);
        });
        it('should resolve with false if ancillaries are not available', function (done) {
            spyOn(bookingPassengerInfoService, 'findAvailableAncillary').and.returnValue(false);
            spyOn(bookingPassengerInfoService, 'actionsInSpecialAncillaries').and.callThrough();
            fakeCallAncillariesService.getAncillaries.and.callFake(() => Promise.resolve(fakeAncillariesInfoMock));
            bookingPassengerInfoService.checkAncillaries().then(function (result) {
                expect(result).toBe(false);
                expect(bookingPassengerInfoService.findAvailableAncillary).toHaveBeenCalledWith(fakeAncillariesInfoMock);
                expect(bookingPassengerInfoService.actionsInSpecialAncillaries).toHaveBeenCalledWith(fakeAncillariesInfoMock);
                done();
            }).catch(done.fail);
        });

        it('should reject if getAncillaries fails', function (done) {
            const errorMock = { message: 'error' };
            fakeCallAncillariesService.getAncillaries.and.callFake(() => Promise.reject(errorMock));
            bookingPassengerInfoService.checkAncillaries().then(
                () => done.fail('Expected promise to be rejected'),
                (error) => {
                    expect(error).toBe(errorMock);
                    done();
                }
            );
        });
    });

















    describe('when BookingPassengerInfo Proxy resolves the promise', function () {
        var createOrderResponse = { 'data': { 'order': { 'slices': [] }, 'passengers': [] } };
        beforeEach(inject(function ($q) {
            fakeBookingPassengerInfoProxy.createOrder = jasmine.createSpy('createOrder').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(createOrderResponse);
                return deferred.promise;
            });
            fakeBookingPassengerInfoTransformer.transformUpdatePassengerInfoData = jasmine.createSpy('transformUpdatePassengerInfoData').and.callFake(function () {
                return mockResponse;
            });
            fakeBookingPromiseSalesforceProxy.post = jasmine.createSpy('post').and.callFake(function () {
                return Promise.resolve({data:{order:{orderId:"OK"}}});
            });
            
            fakeBookingPromiseProxy.get = jasmine.createSpy('get').and.callFake(function () {
                return Promise.resolve({data:{order:{orderId:"OK"}}});
            });
        }));
        xit('return the service response when arePassengersBirthDatesValid equal true', function (done) {
            fakeBookingPassengerInfoTransformer.arePassengersBirthDatesValid = jasmine.createSpy('arePassengersBirthDatesValid').and.callFake(function () {
                return [];
            });
            bookingPassengerInfoService.createBookingOrder().then(function (responseData) {
                expect(responseData).toEqual({order:{orderId:"OK"}});
                done();
            }, angular.noop);

        });
        xit('return the service response when arePassengersBirthDatesValid equal false', function (done) {
            fakeBookingPassengerInfoTransformer.arePassengersBirthDatesValid = jasmine.createSpy('arePassengersBirthDatesValid').and.callFake(function () {
                return [{}];
            });
            bookingPassengerInfoService.createBookingOrder().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('IBAIRP_BIRTH_DATE_ERROR');
                expect(responseError.needsTranslate).toEqual(true);
                done();
            });
            // timeout.flush();
            // timeout.verifyNoPendingTasks();
            // rootScope.$digest();
        });
    });

    xdescribe('when BookingPassengerInfo Proxy rejects the promise with non 400, 401 or 408 errorCode', function () {
        var mockError, processedResponse;
        beforeEach(inject(function ($q) {
            mockError = {
                'errorCode': 412,
                'data': {
                    'errors': [{ 'reason': 'error' }]
                }
            };
            processedResponse = {
                errorCode: 412,
                message: 'error',
                needsTranslate: false,
                internalErrorCode: 'internal_error'
            };
            fakeBookingPassengerInfoProxy.createOrder = jasmine.createSpy('createOrder').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
            fakeBookingUtilsErrorService.processGeneralError = jasmine.createSpy('processGeneralError').and.callFake(function () {
                return processedResponse;
            })
            fakeBookingPromiseSalesforceProxy.post = jasmine.createSpy('post').and.callFake(function () {
                return Promise.reject();
            });
        }));
        xit('should return an object with processed error struture', function (done) {
            bookingPassengerInfoService.createBookingOrder().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('IBAIRP_BIRTH_DATE_ERROR');
                expect(responseError.needsTranslate).toEqual(true);
                done();
            });
            // timeout.flush();
            // timeout.verifyNoPendingTasks();
            // rootScope.$digest();
        });
    })

    describe('when BookingPassengerInfo Proxy rejects the promise with 401 errorCode', function () {
        var mockError, processedResponse;
        beforeEach(inject(function ($q) {
            mockError = {
                'errorCode': 401,
                'data': {
                    'errors': [{ 'reason': 'error' }]
                }
            };
            processedResponse = {
                errorCode: 401,
                message: 'error',
                needsTranslate: false,
                internalErrorCode: 'internal_error'
            };
            fakeBookingPassengerInfoProxy.createOrder = jasmine.createSpy('createOrder').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
            fakeBookingUtilsErrorService.unauthorizedError = jasmine.createSpy('unauthorizedError').and.callFake(function () {
                return processedResponse;
            })
            fakeBookingPromiseSalesforceProxy.post = jasmine.createSpy('post').and.callFake(function () {
                return Promise.reject();
            });
        }));
        xit('should return an object with processed error struture', function (done) {
            bookingPassengerInfoService.createBookingOrder().then(angular.noop, function (responseError) {
                expect(responseError).toEqual('error');
                expect(responseError).toEqual(false);
                done();
            });
        });
    })

    xdescribe('when BookingPassengerInfo Proxy rejects the promise with 408 errorCode', function () {
        var mockError, processedResponse;
        beforeEach(inject(function ($q) {
            mockError = {
                'errorCode': 408,
                'data': {
                    'errors': [{ 'reason': 'error' }]
                }
            };
            processedResponse = {
                errorCode: 408,
                message: 'error',
                needsTranslate: false,
                internalErrorCode: 'internal_error'
            };
            fakeBookingPassengerInfoProxy.createOrder = jasmine.createSpy('createOrder').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
            fakeBookingUtilsErrorService.timeOutError = jasmine.createSpy('timeOutError').and.callFake(function () {
                return processedResponse;
            })
            fakeBookingPromiseSalesforceProxy.post = jasmine.createSpy('post').and.callFake(function () {
                return Promise.reject();
            });
        }));
        xit('should return an object with processed error struture', function (done) {
            bookingPassengerInfoService.createBookingOrder().then(()=>{done.fail()}, (responseError)=> {
                expect(responseError.message).toEqual('error');
                expect(responseError.needsTranslate).toEqual(false);
                done();
            });

        });
    })

    xdescribe('when BookingPassengerInfo Proxy rejects the promise with 400 errorCode', function () {
        var mockError, processedResponse;
        beforeEach(inject(function ($q) {
            mockError = {
                'errorCode': 400,
                'data': {
                    'errors': [{ 'reason': 'error' }]
                }
            };
            processedResponse = {
                errorCode: 400,
                message: 'error',
                needsTranslate: false,
                internalErrorCode: 'internal_error'
            };
            fakeBookingPassengerInfoProxy.createOrder = jasmine.createSpy('createOrder').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
            fakeBookingUtilsErrorService.processGeneralErrorWithProperties = jasmine.createSpy('processGeneralErrorWithProperties').and.callFake(function () {
                return processedResponse;
            })
            fakeBookingPromiseSalesforceProxy.post = jasmine.createSpy('post').and.callFake(function () {
                return Promise.reject();
            });
        }));
        xit('should return an object with processed error struture', function (done) {
            bookingPassengerInfoService.createBookingOrder().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');
                expect(responseError.needsTranslate).toEqual(false);
                done();
            });

        });
    });

    xdescribe('when BookingPassengerInfo Proxy rejects the promise with 409 errorCode', function () {
        var mockError, processedResponse;
        beforeEach(inject(function ($q) {
            mockError = {
                'errorCode': 409,
                'data': {
                    'errors': [{ 'reason': 'error' }]
                }
            };
            processedResponse = {
                errorCode: 409,
                message: 'error',
                needsTranslate: false,
                internalErrorCode: 'internal_error'
            };
            fakeBookingPassengerInfoProxy.createOrder = jasmine.createSpy('createOrder').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
            fakeBookingUtilsErrorService.processUnavailabilityError = jasmine.createSpy('processUnavailabilityError').and.callFake(function () {
                return processedResponse;
            })
        }));

        xit('should return an object with processed error struture', function (done) {
            bookingPassengerInfoService.createBookingOrder().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');
                expect(responseError.needsTranslate).toEqual(false);
                done();
            });

        });
    });

    describe('when getPassengerInfo function is called', function () {
        beforeEach(function () {
            fakeSessionStorage.clear();
            fakeSessionStorage.set('fareData', {
                'responseId': '1',
                'passengers': []
            });
            fakeSessionStorage.set('originDestination', fakeOriginDestinationMadPmi);
            fakeSessionStorage.set('bookingUrlParams', fakeUrlParamsResLF);
            fakeSessionStorage.set('recentLoggedUrl', '');
            fakeSessionStorage.set('searchFlightType', 'metasearchFlight');
            fakeBookingGetPrefixesService.getPrefixes = jasmine.createSpy('getPrefixes').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
            fakeSessionStorage.set('customerData', {});
            fakeSessionStorage.set('requestFareInfo', {partnerDiscount:''});
            fakeSessionStorage.set('userLogged', false);
            fakeSessionStorage.set('activateTravelDocsService', true);
            fakeIbCheckPartnersDiscountsService.getPartnersResponse = jasmine.createSpy('getPartnersResponse').and.returnValue([]);
            fakeBookingPromiseProxy.get = jasmine.createSpy('get').and.callFake(function () {
                return Promise.resolve({ data: 'OK' });
            })
            fakeCommonsUserUtilsService.isIbPlus = jasmine.createSpy('isIbPlus').and.callFake(function () {
                return false;
            })
            fakeCommonsUserUtilsService.isSoftUser = jasmine.createSpy('isSoftUser').and.callFake(function () {
                return false;
            })
            fakeIbCheckPartnersDiscountsService.getCurrentUserStoredPreference = jasmine.createSpy('getCurrentUserStoredPreference').and.callFake(function () {
                return {selectedPartnerId:'FDJADF', dontAskPartner:true};
            })
            fakeIbCheckPartnersDiscountsService.getSelectedPartner = jasmine.createSpy('getSelectedPartner').and.callFake(function () {
                return {partnerIdentifier:'FDJADF'};
            })
            fakeBookingFareService.getBookingFare = jasmine.createSpy('getSelectedPartner').and.callFake(function () {
                return Promise.resolve(mockBookingMetaSearch);
            })

            fakeSessionStorage.set('loginAccessPassengerInfo', true);
            fakeBookingGetCountriesListService.getCountriesList = jasmine.createSpy('getCountriesList').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve('countriesList');
                return deferred.promise;
            });
            fakeGetCountriesListService.getCountriesList = jasmine.createSpy('getCountriesList').and.callFake(function () {
                return Promise.resolve('OK');
            });
            fakeBookingGetCompaniesService.getCompanies = jasmine.createSpy('getCompanies').and.callFake(function () {
                return Promise.resolve('companiesList');
            });
            fakeBookingPassengerInfoProxy.getSecurityInfo = jasmine.createSpy('getSecurityInfo').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve('securityInfoServiceData');
                return deferred.promise;
            });
            fakeBookingPassengerInfoTransformer.transformSecurityInfoPassengerData = jasmine.createSpy('transformSecurityInfoPassengerData').and.callFake(function () {
                return {transformedSecurityInfoPassengerData:{frequentlyPassengers:[]}};
            });
            fakeGetPhoneCodesService.getPhoneCodesList = jasmine.createSpy('getPhoneCodesList').and.callFake(function () {
                return Promise.resolve('OK');
            });
            fakeGdprService.getGdprInfo = jasmine.createSpy('getGdprInfo').and.callFake(function () {
                return Promise.resolve({ 'gdprDataMock': true });
            })
            fakeCallBookingMetaSearchService.getBookingMetaSearch= jasmine.createSpy('getBookingMetaSearch').and.callFake(function () {
                return Promise.resolve(mockBookingMetaSearch);
            });
            fakeBookingPromiseProxy.get = jasmine.createSpy('get').and.callFake(function (endpopint) {
                return Promise.resolve({ data: 'OK' });
            })
            fakeIBCContactDataService.getContactData = jasmine.createSpy('getContactData').and.callFake(function () {
                return Promise.resolve({data: {}});
            })
            fakeIBCContactDetailsZeroService.getContactDetailsData = jasmine.createSpy('getContactDetailsData').and.callFake(function () {
                return Promise.resolve({data: {}});
            })
            fakeIBCPersonalDataService.getPersonalData = jasmine.createSpy('getPersonalData').and.callFake(function () {
                return Promise.resolve({data: {}});
            })
            fakeIBCPersonalDataZeroService.getPersonalData = jasmine.createSpy('getPersonalData').and.callFake(function () {
                return Promise.resolve({data: {}});
            })
            fakeIBCTravelPreferencesService.getTravelPreferences = jasmine.createSpy('getTravelPreferences').and.callFake(function () {
                return Promise.resolve({data: {}});
            })
            fakeIBCAssociatesService.getRetrieveAssociate = jasmine.createSpy('getRetrieveAssociate').and.callFake(function () {
                return Promise.resolve({data: {}});
            })
            fakeCommonsUserUtilsService.isIbZero = jasmine.createSpy('isIbZero').and.callFake(function () {
                return false;
            });
            fakeIBCAssociatesZeroService.getRetrieveAssociateZero = jasmine.createSpy('getRetrieveAssociateZero').and.callFake(function () {
                return Promise.resolve({ data: {} });
            });

        });
        xit('All required services success (phone codes, countries, companies, gdpr, security) and its annonymous', function (done) {
            fakeBookingPromiseProxy.get = jasmine.createSpy('get').and.callFake(function () {
                return Promise.resolve({ data: 'OK' });
            })
            bookingPassengerInfoService.getPassengerInfo().then(function (data) {
                expect(fakeIBCTravelPreferencesService.getTravelPreferences).not.toHaveBeenCalled();
                expect(fakeIBCAssociatesService.getRetrieveAssociate).not.toHaveBeenCalled();
                expect(fakeIBCContactDataService.getContactData).not.toHaveBeenCalled();

                done();
            }, done.fail);
        });
        xit('All required services and is logged as IBPLUS and is not soft', function (done) {
            fakeBookingPromiseProxy.get = jasmine.createSpy('get').and.callFake(function () {
                return Promise.resolve({ data: 'OK' });
            })
            fakeSessionStorage.set('userLogged', true);
            bookingPassengerInfoService.getPassengerInfo().then(function (data) {
                expect(fakeIBCTravelPreferencesService.getTravelPreferences).toHaveBeenCalled();
                expect(fakeIBCAssociatesService.getRetrieveAssociate).toHaveBeenCalled();
                expect(fakeIBCContactDataService.getContactData).toHaveBeenCalled();
                done();
            }, done.fail);
        });
        xit('All required services and is logged as IBPLUS and is not soft and contactDetail exists', function (done) {
            fakeBookingPromiseProxy.get = jasmine.createSpy('get').and.callFake(function () {
                return Promise.resolve({ data: 'OK' });
            })
            fakeBookingPassengerInfoTransformer.transformContactData.calls.reset()
            fakeSessionStorage.set('userLogged', true);
            fakeSessionStorage.set('contactDetails', 'test')
            bookingPassengerInfoService.getPassengerInfo().then(function (data) {
                expect(fakeIBCTravelPreferencesService.getTravelPreferences).toHaveBeenCalled();
                expect(fakeIBCAssociatesService.getRetrieveAssociate).toHaveBeenCalled();
                expect(fakeBookingPassengerInfoTransformer.transformContactData).toHaveBeenCalledWith('test')
                done();
            }, done.fail);
        });
        xit('All required services and is logged as IBPLUS and is soft', function (done) {
            fakeBookingPromiseProxy.get = jasmine.createSpy('get').and.callFake(function () {
                return Promise.resolve({ data: 'OK' });
            })
            fakeSessionStorage.set('userLogged', true);

             fakeCommonsUserUtilsService.isSoftUser = jasmine.createSpy('isSoftUser').and.callFake(function () {
                return true;
            })
            bookingPassengerInfoService.getPassengerInfo().then(function (data) {
                expect(fakeIBCTravelPreferencesService.getTravelPreferences).not.toHaveBeenCalled();
                expect(fakeIBCAssociatesService.getRetrieveAssociate).not.toHaveBeenCalled();
                expect(fakeIBCContactDataService.getContactData).not.toHaveBeenCalled();
                done();
            }, done.fail);
        });
        xit('All required services and is logged as IBZERO', function (done) {
            fakeBookingPromiseProxy.get = jasmine.createSpy('get').and.callFake(function () {
                return Promise.resolve({ data: 'OK' });
            })
            fakeSessionStorage.set('userLogged', true);
             fakeCommonsUserUtilsService.isSoftUser = jasmine.createSpy('isSoftUser').and.callFake(function () {
                return false;
             })
            fakeCommonsUserUtilsService.isIbZero = jasmine.createSpy('isIbZero').and.callFake(function () {
                return true;
            });
             fakeIBCAssociatesZeroService.getRetrieveAssociateZero = jasmine.createSpy('getRetrieveAssociateZero').and.callFake(function () {
                return Promise.resolve({data: {}});
            })

            bookingPassengerInfoService.getPassengerInfo().then(function (data) {
                expect(fakeIBCTravelPreferencesService.getTravelPreferences).toHaveBeenCalled();
                expect(fakeIBCAssociatesZeroService.getRetrieveAssociateZero).toHaveBeenCalled();
                expect(fakeIBCContactDetailsZeroService.getContactDetailsData).toHaveBeenCalled();
                done();
            }, done.fail);
        });




        xit('getPrefixes failed with non 400,401 or 408 errorCode', function (done) {
            var processedResponse = {
                errorCode: 412,
                message: 'error',
                needsTranslate: false,
                internalErrorCode: 'internal_error'
            };
            fakeGetPhoneCodesService.getPhoneCodesList = jasmine.createSpy('getPhoneCodesList').and.callFake(function () {
                return Promise.reject(processedResponse);
            });
            fakeBookingUtilsErrorService.processGeneralError = jasmine.createSpy('processGeneralError').and.callFake(function () {
                return processedResponse;
            })
            fakeBookingPromiseProxy.get = jasmine.createSpy('get').and.callFake(function () {
                return Promise.resolve({data:{order:{orderId:"OK"}}});
            });
            bookingPassengerInfoService.getPassengerInfo().then(() => {}, function (responseError) {
                expect(responseError.message).toEqual('error');
                expect(responseError.needsTranslate).toEqual(false);
                done();
            }, done.fail);

        });
    });

    describe('When cleanErrorResidents is called', function () {
        beforeEach(inject(function () {
            fakeBookingPassengerInfoTransformer.cleanErrorResidents = jasmine.createSpy('cleanErrorResidents').and.callFake(function () {

            });
        }));
        xit('BookingPassengerInfoTransformer.cleanErrorResidents has been called', function (done) {
            bookingPassengerInfoService.cleanErrorResidents();
            expect(fakeBookingPassengerInfoTransformer.cleanErrorResidents).toHaveBeenCalled();
            done();
        });
    })
    describe('When goToRecoveryFlow is called', function () {
        beforeEach(inject(function () {
            fakeSessionStorage.set('createOrderData',{order:{orderId:'1738839'}})
            fakeBookingIgnoreOrderService.ignoreOrder = jasmine.createSpy('ignoreOrder').and.callFake(function () {
                return Promise.resolve();
            });
            fakeBookingPassengerInfoTransformer.generateMetaUrl = jasmine.createSpy('generateMetaUrl').and.callFake(function () {
                return {recoveryLink:'www.ejemplo.com'};
            });
        }));
        xit('', function (done) {
            bookingPassengerInfoService.goToRecoveryFlow().then( (responseData) => {
                expect(fakeRedirectionService.externalRedirect).toHaveBeenCalled();
                expect(responseData).toEqual(null);
                // done();
            },()=> done.fail());
            done();
        });
    })
    describe('When recoverUserName is called', function () {
        beforeEach(inject(function () {
        }));
        xit('and promise is resolved', function (done) {
            fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake(function () {
                return Promise.resolve('OK');
            });
            bookingPassengerInfoService.recoverUserName('ejemplo@gmail.com').then( (responseData) => {
                expect(responseData).toEqual('OK');
                // done();
            },()=> done.fail());
            done();
        });
        xit('and promise is rejected', function (done) {
            fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake(function () {
                return Promise.reject({message:'error'});
            });
            // fakeBookingPassengerInfoTransformer.transformProfileRemindError = jasmine.createSpy('transformProfileRemindError').and.callFake(function () {
            //     return {message:'error'};
            // });
            bookingPassengerInfoService.recoverUserName('ejemplo@gmail.com').then(()=> done.fail(), (error) => {
                expect(fakeBookingPassengerInfoTransformer.transformProfileRemindError).toHaveBeenCalled();
                // done();
            });
            done();
        });
    })
    describe('When getCalculatedPoints is called', function () {
        beforeEach(inject(function () {
            fakeSessionStorage.set('CalculatedPoints', {})
            fakeBookingPassengerInfoTransformer.TransCalcPointsData = jasmine.createSpy('postGeneric').and.callFake(function () {
                return 87;
            });
        }));
        xit('and promise is resolved', function (done) {
            fakeIbBookingCalculatePointsService.getCalculateFlightsAvios = jasmine.createSpy('getCalculateFlightsAvios').and.callFake(function () {
                return Promise.resolve('OK');
            });
            bookingPassengerInfoService.getCalculatedPoints({}).then( (responseData) => {
                expect(responseData).toEqual(87);
                // done();
            },()=> done.fail());
            done();
        });
        xit('and promise is rejected', function (done) {
            fakeIbBookingCalculatePointsService.getCalculateFlightsAvios = jasmine.createSpy('getCalculateFlightsAvios').and.callFake(function () {
                return Promise.reject({message:'error'});
            });
            bookingPassengerInfoService.getCalculatedPoints('ejemplo@gmail.com').then(()=> done.fail(), (error) => {
                expect(error.message).toEqual('error');
                // done();
            });
            done();
        });
    })
    describe('When updateCalculatedPoints is called', function () {
        beforeEach(inject(function () {
            fakeSessionStorage.set('CalculatedPoints', {})
            fakeBookingPassengerInfoTransformer.TransCalcPointsData = jasmine.createSpy('postGeneric').and.callFake(function () {
                return 87;
            });
        }));
        xit('and promise is resolved', function (done) {
            fakeIbBookingCalculatePointsService.getCalculateFlightsAvios = jasmine.createSpy('getCalculateFlightsAvios').and.callFake(function () {
                return Promise.resolve('OK');
            });
            bookingPassengerInfoService.updateCalculatedPoints({}).then( (responseData) => {
                expect(responseData).toEqual(87);
                // done();
            },()=> done.fail());
            done();
        });
        xit('and promise is rejected', function (done) {
            fakeIbBookingCalculatePointsService.getCalculateFlightsAvios = jasmine.createSpy('getCalculateFlightsAvios').and.callFake(function () {
                return Promise.reject({message:'error'});
            });
            bookingPassengerInfoService.updateCalculatedPoints('ejemplo@gmail.com').then(()=> done.fail(), (error) => {
                expect(error.message).toEqual('error');
                // done();
            });
            done();
        });
    })

    describe('When updatePersonalData is called', function () {
        beforeEach(inject(function () {
        }));
        xit('it is not ibZero and promise is resolved', function (done) {
            fakeCommonsUserUtilsService.isIbZero = jasmine.createSpy('isIbZero').and.callFake(function () {
                return false;
            });
            fakeIBCPersonalDataService.updatePersonalData = jasmine.createSpy('updatePersonalData').and.callFake(function () {
                return Promise.resolve('OK');
            });
            bookingPassengerInfoService.updatePersonalData({}).then( (responseData) => {
                expect(responseData).toEqual('OK');
            },()=> done.fail());
            done();
        });
        xit('it is not ibZero and promise is rejected', function (done) {
            fakeCommonsUserUtilsService.isIbZero = jasmine.createSpy('isIbZero').and.callFake(function () {
                return false;
            });
            fakeIBCPersonalDataService.updatePersonalData = jasmine.createSpy('updatePersonalData').and.callFake(function () {
                return Promise.reject({message:'error'});
            });
            bookingPassengerInfoService.updatePersonalData({}).then(()=> done.fail(), (error) => {
                expect(error.message).toEqual('error');
            });
            done();
        });
        xit('it is ibZero and promise is resolved', function (done) {
            fakeCommonsUserUtilsService.isIbZero = jasmine.createSpy('isIbZero').and.callFake(function () {
                return true;
            });
            fakeIBCPersonalDataZeroService.updatePersonalData = jasmine.createSpy('updatePersonalData').and.callFake(function () {
                return Promise.resolve('OK');
            });
            bookingPassengerInfoService.updatePersonalData({}).then( (responseData) => {
                expect(responseData).toEqual('OK');
            },()=> done.fail());
            done();
        });
        xit('it is ibZero and promise is rejected', function (done) {
            fakeCommonsUserUtilsService.isIbZero = jasmine.createSpy('isIbZero').and.callFake(function () {
                return true;
            });
            fakeIBCPersonalDataZeroService.updatePersonalData = jasmine.createSpy('updatePersonalData').and.callFake(function () {
                return Promise.reject({message:'error'});
            });
            bookingPassengerInfoService.updatePersonalData({}).then(()=> done.fail(), (error) => {
                expect(error.message).toEqual('error');
            });
            done();
        });
    })

    describe('When updateTravPreferences is called', function () {
        beforeEach(inject(function () {
        }));
        xit('and promise is resolved', function (done) {
            fakeIBCTravelPreferencesService.updateTravelPreferences = jasmine.createSpy('updateTravelPreferences').and.callFake(function () {
                return Promise.resolve('OK');
            });
            bookingPassengerInfoService.updateTravPreferences({}).then( (responseData) => {
                expect(responseData).toEqual('OK');
                // done();
            },()=> done.fail());
            done();
        });
        xit('and promise is rejected', function (done) {
            fakeIBCTravelPreferencesService.updateTravelPreferences = jasmine.createSpy('updateTravelPreferences').and.callFake(function () {
                return Promise.reject({message:'error'});
            });
            bookingPassengerInfoService.updateTravPreferences('ejemplo@gmail.com').then(()=> done.fail(), (error) => {
                expect(error.message).toEqual('error');
                // done();
            });
            done();
        });
    })
    describe('When checkEmailConsent is called', function () {
        beforeEach(inject(function () {
        }));
        xit('and promise is resolved', function (done) {
            fakeBookingPromiseSalesforceProxy.post = jasmine.createSpy('post').and.callFake(function () {
                return Promise.resolve('OK');
            });
            bookingPassengerInfoService.checkEmailConsent({}).then( (responseData) => {
                expect(responseData).toEqual('OK');
                // done();
            },()=> done.fail());
            done();
        });
        xit('and promise is rejected', function (done) {
            fakeBookingPromiseSalesforceProxy.post = jasmine.createSpy('post').and.callFake(function () {
                return Promise.reject({message:'error'});
            });
            bookingPassengerInfoService.checkEmailConsent('ejemplo@gmail.com').then(()=> done.fail(), (error) => {
                expect(error.message).toEqual('error');
                // done();
            });
            done();
        });
    })
    describe('When insertEmailConsent is called', function () {
        beforeEach(inject(function () {
        }));
        xit('and promise is resolved', function (done) {
            fakeBookingPromiseSalesforceProxy.post = jasmine.createSpy('post').and.callFake(function () {
                return Promise.resolve('OK');
            });
            bookingPassengerInfoService.insertEmailConsent({}).then((responseData) => {
                expect(responseData).toEqual('OK');
                // done();
            }, () => done.fail());
            done();
        });
        xit('and promise is rejected', function (done) {
            fakeBookingPromiseSalesforceProxy.post = jasmine.createSpy('post').and.callFake(function () {
                return Promise.reject({ message: 'error' });
            });
            bookingPassengerInfoService.insertEmailConsent('ejemplo@gmail.com').then(() => done.fail(), (error) => {
                expect(error.message).toEqual('error');
                // done();
            });
            done();
        });
    });
   describe('When checkFareUpdated is called', () => {
        beforeEach(
            () => {
                testWindow = { location: { href: '' , hash: ''} };
                fakeSessionStorage.remove('recentLoggedUrl');
                fakeSessionStorage.set('searchFlightType', 'availability');
                fakeSessionStorage.set('loginAccessPassengerInfo', true);
                fakeSessionStorage.set('requestFareInfo', {});
                fakeCommonsUserUtilsService.isIbPlus = jasmine.createSpy('isIbPlus').and.returnValue(true);
                fakeBookingFareService.getBookingFare = jasmine.createSpy('getBookingFare').and.returnValue(Promise.resolve({}));


            }
        );
        xit('Is not recently logged in', (done) => {
            bookingPassengerInfoService.checkFareUpdated().then((response) => {
                done();
            }, done.fail);
        });
        xit('Is recently logged (IBPLUS), in availability flow and does not apply partner discount and fare data is recall', (done) => {
            fakeSessionStorage.set('searchFlightType', '');
            fakeSessionStorage.set('recentLoggedUrl', '');
            fakeIbCheckPartnersDiscountsService.getPartnersDiscountsApplicationFlag = jasmine.createSpy('getPartnersDiscountsApplicationFlag').and.returnValue(false)
            bookingPassengerInfoService.checkFareUpdated().then(() => {
                const loginAccessPassengerInfo = fakeSessionStorage.get('loginAccessPassengerInfo');
                const oBDiscountInfo = fakeSessionStorage.get('oBDiscountInfo');
                expect(loginAccessPassengerInfo).toBe(false);
                expect(oBDiscountInfo).toEqual([]);
                done();
            }, done.fail);
        });
        xit('Is recently logged but not ibplus, in availability flow and does not apply partner discount and fare data is recall', (done) => {
            fakeSessionStorage.set('searchFlightType', '');
            fakeSessionStorage.set('recentLoggedUrl', '');
            fakeCommonsUserUtilsService.isIbPlus = jasmine.createSpy('isIbPlus').and.returnValue(false);
            fakeIbCheckPartnersDiscountsService.getPartnersDiscountsApplicationFlag = jasmine.createSpy('getPartnersDiscountsApplicationFlag').and.returnValue(false)
            bookingPassengerInfoService.checkFareUpdated().then(() => {
                const loginAccessPassengerInfo = fakeSessionStorage.get('loginAccessPassengerInfo');
                const oBDiscountInfo = fakeSessionStorage.get('oBDiscountInfo');
                expect(loginAccessPassengerInfo).toBe(false);
                expect(oBDiscountInfo).toEqual([]);
                done();
            }, done.fail);
        });
       xit('Is recently logged, in availability flow and does not apply partner discount and fare data is recall, and offer has discount', (done) => {
            fakeSessionStorage.set('searchFlightType', '');
           fakeSessionStorage.set('recentLoggedUrl', '');
           fakeBookingFareService.getBookingFare = jasmine.createSpy('getBookingFare').and.returnValue(Promise.resolve({
               data: {
                   offers: [{
                       specialDiscountsApplied: [
                           {
                               type: 'CORPORATE',
                               discountType: 'ODM',
                           }],
                      priceSpecialDiscount: {totalDiscount:10}
                   }]
               }
           }));
            fakeIbCheckPartnersDiscountsService.getPartnersDiscountsApplicationFlag = jasmine.createSpy('getPartnersDiscountsApplicationFlag').and.returnValue(false)
            bookingPassengerInfoService.checkFareUpdated().then(() => {
                const loginAccessPassengerInfo = fakeSessionStorage.get('loginAccessPassengerInfo');
                const oBDiscountInfo = fakeSessionStorage.get('oBDiscountInfo');
                expect(loginAccessPassengerInfo).toBe(false);
                expect(oBDiscountInfo).toEqual([{corporateDiscountType: 'ODM',discount: 10}]);
                done();
            }, done.fail);
       });
       xit('Is recently logged, in availability flow and does not apply partner discount and fare data is recall but failed', (done) => {
            fakeSessionStorage.set('searchFlightType', '');
            fakeSessionStorage.set('recentLoggedUrl', '');
            fakeBookingFareService.getBookingFare = jasmine.createSpy('getBookingFare').and.returnValue(Promise.reject({}));
            fakeIbCheckPartnersDiscountsService.getPartnersDiscountsApplicationFlag = jasmine.createSpy('getPartnersDiscountsApplicationFlag').and.returnValue(false)
            bookingPassengerInfoService.checkFareUpdated().then(() => {
                done.fail();
            }, () => { done ()});
       });
       xit('Is recently logged (IBPLUS), in availability flow and does not apply partner discount and fare data is recall and has partner', (done) => {
            fakeSessionStorage.set('searchFlightType', '');
            fakeSessionStorage.set('recentLoggedUrl', '');
           fakeIbCheckPartnersDiscountsService.getSelectedPartner = jasmine.createSpy('getSelectedPartner').and.returnValue({ partnerIdentifier: 'SAN' });
           fakeIbCheckPartnersDiscountsService.getCurrentUserStoredPreference = jasmine.createSpy('getCurrentUserStoredPreference').and.returnValue({ selectedPartnerId: 'SAN' ,dontAskPartner:false});
            fakeIbCheckPartnersDiscountsService.getPartnersDiscountsApplicationFlag = jasmine.createSpy('getPartnersDiscountsApplicationFlag').and.returnValue(true)
           fakeIbCheckPartnersDiscountsService.getPartnersResponse = jasmine.createSpy('getPartnersResponse').and.returnValue(PARTNERRESPONSE.partners);
           fakeIbSetPartnersSelectionUtilsService.setPartnersModal = jasmine.createSpy('setPartnersModal').and.callFake((callback)=> callback());
           bookingPassengerInfoService.checkFareUpdated().then(() => {
                const loginAccessPassengerInfo = fakeSessionStorage.get('loginAccessPassengerInfo');
                const oBDiscountInfo = fakeSessionStorage.get('oBDiscountInfo');
                expect(loginAccessPassengerInfo).toBe(false);
                expect(oBDiscountInfo).toEqual([]);
                done();
            }, done.fail);
       });
       xit('Is recently logged (IBPLUS), in availability flow and does not apply partner discount and fare data is recall and selected partner but has no partner response', (done) => {
            fakeSessionStorage.set('searchFlightType', '');
            fakeSessionStorage.set('recentLoggedUrl', '');
           fakeIbCheckPartnersDiscountsService.getSelectedPartner = jasmine.createSpy('getSelectedPartner').and.returnValue({ partnerIdentifier: 'SAN' });
           fakeIbCheckPartnersDiscountsService.getCurrentUserStoredPreference = jasmine.createSpy('getCurrentUserStoredPreference').and.returnValue({ selectedPartnerId: 'SAN' ,dontAskPartner:false});
            fakeIbCheckPartnersDiscountsService.getPartnersDiscountsApplicationFlag = jasmine.createSpy('getPartnersDiscountsApplicationFlag').and.returnValue(true)
           fakeIbCheckPartnersDiscountsService.getPartnersResponse = jasmine.createSpy('getPartnersResponse').and.returnValue([]);
           fakeIbSetPartnersSelectionUtilsService.setPartnersModal = jasmine.createSpy('setPartnersModal').and.callFake((callback)=> callback());
           bookingPassengerInfoService.checkFareUpdated().then(() => {
                const loginAccessPassengerInfo = fakeSessionStorage.get('loginAccessPassengerInfo');
                const oBDiscountInfo = fakeSessionStorage.get('oBDiscountInfo');
                expect(loginAccessPassengerInfo).toBe(false);
                expect(oBDiscountInfo).toEqual([]);
                done();
           }, () => { done.fail()});
       });
       xit('Is recently logged (IBPLUS), in availability flow and does not apply partner discount and fare data is recall and user has selected no partner discount and dont ask again', (done) => {
            fakeSessionStorage.set('searchFlightType', '');
            fakeSessionStorage.set('recentLoggedUrl', '');
           fakeIbCheckPartnersDiscountsService.getSelectedPartner = jasmine.createSpy('getSelectedPartner').and.returnValue({ partnerIdentifier: 'SAN' });
           fakeIbCheckPartnersDiscountsService.getCurrentUserStoredPreference = jasmine.createSpy('getCurrentUserStoredPreference').and.returnValue({ selectedPartnerId: 'SAN' ,dontAskPartner: true});
            fakeIbCheckPartnersDiscountsService.getPartnersDiscountsApplicationFlag = jasmine.createSpy('getPartnersDiscountsApplicationFlag').and.returnValue(true)
           fakeIbCheckPartnersDiscountsService.getPartnersResponse = jasmine.createSpy('getPartnersResponse').and.returnValue(PARTNERRESPONSE.partners);
           fakeIbSetPartnersSelectionUtilsService.setPartnersModal = jasmine.createSpy('setPartnersModal').and.callFake((callback)=> callback());
           bookingPassengerInfoService.checkFareUpdated().then(() => {
                const loginAccessPassengerInfo = fakeSessionStorage.get('loginAccessPassengerInfo');
                const oBDiscountInfo = fakeSessionStorage.get('oBDiscountInfo');
                expect(loginAccessPassengerInfo).toBe(false);
                expect(oBDiscountInfo).toEqual([]);
                done();
           }, () => { done.fail()});
       });
       xit('Is metasearch and reload extended direct', (done) => {
           fakeSessionStorage.set('searchFlightType', 'metasearchFlight');
           fakeSessionStorage.set('recentLoggedUrl', '');
           fakeCallBookingMetaSearchService.getBookingMetaSearch = jasmine.createSpy('getBookingMetaSearch').and.returnValue(Promise.resolve({}));
           bookingPassengerInfoService.checkFareUpdated().then((response) => {
                const loginAccessPassengerInfo = fakeSessionStorage.get('loginAccessPassengerInfo');
                const oBDiscountInfo = fakeSessionStorage.get('oBDiscountInfo');
                expect(loginAccessPassengerInfo).toBe(false);
                expect(oBDiscountInfo).toEqual([]);
                done();
            }, done.fail);
        });
    });

    describe('When showGender', ()=> {
        xit('should return true if required field contains TITLE', ()=> {
            const requiredFields = {TITLE: 'TITLE'}
            expect(bookingPassengerInfoService.showGender(requiredFields)).toEqual(true);
        });
        xit('should return true if required field contains GENDER', ()=> {
            const requiredFields = {GENDER: 'GENDER'}
            expect(bookingPassengerInfoService.showGender(requiredFields)).toEqual(true);
        });
        xit('should return false if required field does not contain GENDER or TITLE', ()=> {
            const requiredFields = {TEST: 'TEST '}
            expect(bookingPassengerInfoService.showGender(requiredFields)).toEqual(false);
        });

    });

    it('must return false in findAvailableAncillary if the type is in ancillariesToExclude', function () {
       
        const excludedAncillary = {
            ancillaries: [
                {
                    "status": {
                    "code": "AVAILABLE",
                    "reason": null
                    },
                    "externalUrl": null,
                    "type": "WINE_CLUB" 
                },
                {
                    "status": {
                    "code": "NOT_AVAILABLE",
                    "reason": null
                    },
                    "externalUrl": null,
                    "type": "BOB"
                },
            ]
        }
        
        const allowedAncillary = {
            ancillaries: [
                {
                    "status": {
                    "code": "AVAILABLE",
                    "reason": null
                    },
                    "externalUrl": null,
                    "type": "BOB"
                },
                {
                    "status": {
                    "code": "AVAILABLE",
                    "reason": null
                    },
                    "externalUrl": null,
                    "type": "WINE_CLUB" 
                }   
            ]
        };

        const resultExcluded = bookingPassengerInfoService.findAvailableAncillary(excludedAncillary);
        const resultAllowed = bookingPassengerInfoService.findAvailableAncillary(allowedAncillary);

        expect(resultExcluded).toBe(false);
        expect(resultAllowed).not.toBe(false);
    });

    
    describe('Phone prefix fallback resolution', () => {
        
        it('should return original prefixes when phoneCodesHasError is false', () => {
            const prefixes = [{ code: '+34' }];

            const result = bookingPassengerInfoService.applyPhonePrefixFallback(
                prefixes,
                false
            );

            expect(result.prefixes).toBe(prefixes);
            expect(result.isFallback).toBe(false);
        });


        it('should apply fallback prefixes when phoneCodesHasError is true', () => {
            fakeSessionStorage.set('commercialData', {
                market: { code: 'ES' },
                defaultValues: { defaultPhonePrefix: { code: '34' } }
            });

            const result = bookingPassengerInfoService.applyPhonePrefixFallback(
                [],
                true
            );

            expect(result.isFallback).toBe(true);
            expect(result.prefixes).toEqual([
                { code: '+34', countryCode: 'ES', isDefault: true }
            ]);
        });



        it('should build fallback prefixes from market data', () => {
            fakeSessionStorage.set('commercialData', {
                market: { code: 'FR' },
                defaultValues: { defaultPhonePrefix: { code: '33' } }
            });

            const result = bookingPassengerInfoService.buildFallbackPrefixesFromMarket();

            expect(result).toEqual([
                { code: '+33', countryCode: 'FR', isDefault: true }
            ]);
        });

        it('should return empty array when market has no phone prefix', () => {
            fakeSessionStorage.set('commercialData', {
                market: { code: 'FR' },
                defaultValues: {}
            });

            const result = bookingPassengerInfoService.buildFallbackPrefixesFromMarket();

            expect(result).toEqual([]);
        });
    });


});
