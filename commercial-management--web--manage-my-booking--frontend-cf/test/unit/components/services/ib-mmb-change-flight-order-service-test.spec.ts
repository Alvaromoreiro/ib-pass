
describe('MmBChangeFlightOrderService', () => {
    let service: any;
    let localStorageService: any;
    let $rootScope: any;
    let $q: any;

    const fakeMmBAppConstants = {
        DEFAULT_ENDPOINTS: {
            orderChangeURI: '/sse-orm/rs/v2/order/orderchange'
        }
    };

    const fakeCommonsGenericProxy = {
        postGeneric: jasmine.createSpy('postGeneric')
    };

    const fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError')
    };

    const fakeMmBModalService = {
        showGenericError: jasmine.createSpy('showGenericError').and.returnValue({
            result: Promise.resolve()
        })
    };

    const createMockBookingInfo = (overrides = {}) => {
        return {
            order: {
                orderId: 'ORD-12345',
                orderItems: [
                    {
                        orderItemId: 'ITEM-OLD-001'
                    }
                ]
            },
            flowId: 'FLOW-ABC-123',
            ...overrides
        };
    };

    const createMockFareData = (overrides = {}) => {
        return {
            offers: [
                {
                    offerId: 'OFFER-NEW-001'
                }
            ],
            ...overrides
        };
    };

    const createSuccessResponse = (overrides = {}) => {
        return {
            data: {
                orderId: 'ORD-12345',
                flowId: 'FLOW-ABC-123',
                status: 'CONFIRMED',
                ...overrides
            }
        };
    };

    const testInvalidRequestRejection = (setupFn: () => void, done: DoneFn) => {
        setupFn();

        service.changeFlightOrderNothingToPay().catch((error) => {
            expect(error).toEqual({ error: 'INVALID_REQUEST_DATA' });
            expect(fakeCommonsGenericProxy.postGeneric).not.toHaveBeenCalled();
            done();
        });

        $rootScope.$digest();
    };

    const testErrorDoesNotRemoveNoPaymentFlag = (mockError: any, done: DoneFn) => {
        setupValidStorageData();

        fakeCommonsGenericProxy.postGeneric.and.callFake(() => {
            return $q.reject(mockError);
        });

        if (mockError.errorCode !== 417) {
            fakeCommonsNewHttpUtilsErrorService.controlError.and.callFake((error, reject) => {
                reject(error);
            });
        }

        expect(localStorageService.get('noPaymentVCFlow')).toBe(true);

        service.changeFlightOrderNothingToPay().catch(() => {
            expect(localStorageService.get('noPaymentVCFlow')).toBe(true);
            done();
        });

        $rootScope.$digest();
    };

    const setupValidStorageData = () => {
        localStorageService.set('bookingInfo', createMockBookingInfo());
        localStorageService.set('fareData', createMockFareData());
        localStorageService.set('noPaymentVCFlow', true);
        localStorageService.set('userLogged', true);
    };

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', ($provide) => {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('MmBModalService', fakeMmBModalService);
        });

        inject((_MmBChangeFlightOrderService_, _localStorageService_, _$rootScope_, _$q_) => {
            service = _MmBChangeFlightOrderService_;
            localStorageService = _localStorageService_;
            $rootScope = _$rootScope_;
            $q = _$q_;
        });

        fakeCommonsGenericProxy.postGeneric.calls.reset();
        fakeCommonsNewHttpUtilsErrorService.controlError.calls.reset();
        fakeMmBModalService.showGenericError.calls.reset();
    });

    afterEach(() => {
        localStorageService.clearAll();
    });

    describe('changeFlightOrderNothingToPay()', () => {

        describe('when request is valid and POST succeeds', () => {

            let mockBookingInfo: any;
            let mockFareData: any;
            let mockSuccessResponse: any;

            beforeEach(() => {
                mockBookingInfo = createMockBookingInfo();
                mockFareData = createMockFareData();
                mockSuccessResponse = createSuccessResponse();

                localStorageService.set('bookingInfo', mockBookingInfo);
                localStorageService.set('fareData', mockFareData);
                localStorageService.set('noPaymentVCFlow', true);

                fakeCommonsGenericProxy.postGeneric.and.callFake(() => {
                    const deferred = $q.defer();
                    deferred.resolve(mockSuccessResponse);
                    return deferred.promise;
                });
            });

            it('should build correct request payload', (done) => {
                service.changeFlightOrderNothingToPay().then(() => {
                    expect(fakeCommonsGenericProxy.postGeneric).toHaveBeenCalled();

                    const callArgs = fakeCommonsGenericProxy.postGeneric.calls.mostRecent().args;
                    const endpoint = callArgs[0];
                    const requestData = callArgs[1];

                    expect(endpoint).toBe('/sse-orm/rs/v2/order/orderchange');

                    expect(requestData).toEqual({
                        orderId: 'ORD-12345',
                        flowId: 'FLOW-ABC-123',
                        oldOrderItem: {
                            id: 'ITEM-OLD-001',
                            actionType: 'Delete'
                        },
                        newOrderItem: {
                            id: 'OFFER-NEW-001',
                            actionType: 'Create'
                        }
                    });

                    done();
                });

                $rootScope.$digest();
            });

            const authenticationScenarios = [
                {
                    description: 'should include Salesforce token in headers when userLogged is true',
                    setup: () => {
                        localStorageService.set('loginSF', 'SF-TOKEN-12345');
                        localStorageService.set('userLogged', true);
                    },
                    expectations: (configObject: any) => {
                        expect(configObject).toEqual({
                            headers: {
                                'X-Salesforce-Token': 'SF-TOKEN-12345'
                            }
                        });
                    }
                },
                {
                    description: 'should use fallback token when loginSF is not present',
                    setup: () => {
                        localStorageService.set('SF_LOGGED_TOKEN', 'SF-FALLBACK-TOKEN-999');
                        localStorageService.set('userLogged', true);
                    },
                    expectations: (configObject: any) => {
                        expect(configObject.headers['X-Salesforce-Token']).toBe('SF-FALLBACK-TOKEN-999');
                    }
                },
                {
                    description: 'should NOT include auth config when userLogged is not true',
                    setup: () => {
                        localStorageService.set('loginSF', 'SF-TOKEN-12345');
                        localStorageService.set('userLogged', false);
                    },
                    expectations: (configObject: any) => {
                        expect(configObject).toBeNull();
                    }
                }
            ];

            authenticationScenarios.forEach(scenario => {
                it(scenario.description, (done) => {
                    scenario.setup();

                    service.changeFlightOrderNothingToPay().then(() => {
                        const callArgs = fakeCommonsGenericProxy.postGeneric.calls.mostRecent().args;
                        const configObject = callArgs[2];

                        scenario.expectations(configObject);

                        done();
                    });

                    $rootScope.$digest();
                });
            });


            it('should save issueOrderInfo to localStorage', (done) => {
                service.changeFlightOrderNothingToPay().then(() => {
                    const savedInfo = localStorageService.get('issueOrderInfo');

                    expect(savedInfo).toEqual(mockSuccessResponse);

                    done();
                });

                $rootScope.$digest();
            });

            it('should remove noPaymentVCFlow flag from localStorage', (done) => {
                expect(localStorageService.get('noPaymentVCFlow')).toBe(true);

                service.changeFlightOrderNothingToPay().then(() => {

                    expect(localStorageService.get('noPaymentVCFlow')).toBeNull();

                    done();
                });

                $rootScope.$digest();
            });

            it('should resolve promise with response data', (done) => {
                service.changeFlightOrderNothingToPay().then((responseData) => {
                    expect(responseData).toEqual(mockSuccessResponse);

                    done();
                });

                $rootScope.$digest();
            });
        });

        describe('when request data is invalid', () => {

            const invalidDataScenarios = [
                {
                    description: 'bookingInfo is missing',
                    setup: () => {
                        localStorageService.set('fareData', createMockFareData());
                    }
                },
                {
                    description: 'fareData is missing',
                    setup: () => {
                        localStorageService.set('bookingInfo', createMockBookingInfo());
                    }
                },
                {
                    description: 'both bookingInfo and fareData are null',
                    setup: () => {
                        localStorageService.set('bookingInfo', null);
                        localStorageService.set('fareData', null);
                    }
                },
                {
                    description: 'orderId is missing',
                    setup: () => {
                        const invalidBookingInfo = createMockBookingInfo({
                            order: {
                                orderItems: [{ orderItemId: 'ITEM-001' }]
                            }
                        });
                        localStorageService.set('bookingInfo', invalidBookingInfo);
                        localStorageService.set('fareData', createMockFareData());
                    }
                },
                {
                    description: 'flowId is missing',
                    setup: () => {
                        const invalidBookingInfo = createMockBookingInfo();
                        delete invalidBookingInfo.flowId;
                        localStorageService.set('bookingInfo', invalidBookingInfo);
                        localStorageService.set('fareData', createMockFareData());
                    }
                },
                {
                    description: 'oldOrderItemId is missing',
                    setup: () => {
                        const invalidBookingInfo = createMockBookingInfo({
                            order: {
                                orderId: 'ORD-123',
                                orderItems: []
                            }
                        });
                        localStorageService.set('bookingInfo', invalidBookingInfo);
                        localStorageService.set('fareData', createMockFareData());
                    }
                },
                {
                    description: 'newOrderItemId (offerId) is missing',
                    setup: () => {
                        const invalidFareData = createMockFareData({
                            offers: []
                        });
                        localStorageService.set('bookingInfo', createMockBookingInfo());
                        localStorageService.set('fareData', invalidFareData);
                    }
                },
                {
                    description: 'bookingInfo.order is undefined',
                    setup: () => {
                        const invalidBookingInfo = {
                            flowId: 'FLOW-123'
                        };
                        localStorageService.set('bookingInfo', invalidBookingInfo);
                        localStorageService.set('fareData', createMockFareData());
                    }
                }
            ];

            invalidDataScenarios.forEach(scenario => {
                it(`should reject if ${scenario.description}`, (done) => {
                    testInvalidRequestRejection(scenario.setup, done);
                });
            });
        });

        describe('when POST request fails', () => {

            beforeEach(() => {
                setupValidStorageData();
            });

            it('should handle error 417 specifically and save issueOrderInfo', (done) => {
                const mockError417 = {
                    errorCode: 417,
                    data: {
                        orderId: 'ORD-12345',
                        status: 'EXPECTATION_FAILED'
                    }
                };

                fakeCommonsGenericProxy.postGeneric.and.callFake(() => {
                    return $q.reject(mockError417);
                });

                service.changeFlightOrderNothingToPay().catch((error) => {
                    expect(localStorageService.get('issueOrderInfo')).toEqual(mockError417.data);
                    expect(error).toEqual({
                        code: 417
                    });
                    expect(fakeCommonsNewHttpUtilsErrorService.controlError).not.toHaveBeenCalled();
                    done();
                });

                $rootScope.$digest();
            });

            it('should NOT remove noPaymentVCFlow flag on error 417', (done) => {
                const mockError417 = {
                    errorCode: 417,
                    data: { orderId: 'ORD-12345' }
                };
                testErrorDoesNotRemoveNoPaymentFlag(mockError417, done);
            });

            const errorDelegationScenarios = [
                {
                    description: 'should delegate other errors to CommonsNewHttpUtilsErrorService.controlError',
                    mockError: {
                        errorCode: 400,
                        data: { message: 'Bad Request' }
                    },
                    expectations: (mockError: any) => {
                        expect(fakeCommonsNewHttpUtilsErrorService.controlError).toHaveBeenCalledWith(
                            mockError,
                            jasmine.any(Function)
                        );
                    }
                },
                {
                    description: 'should handle error 500 via CommonsNewHttpUtilsErrorService',
                    mockError: {
                        errorCode: 500,
                        data: null
                    },
                    expectations: () => {
                        expect(fakeCommonsNewHttpUtilsErrorService.controlError).toHaveBeenCalled();
                    }
                }
            ];

            errorDelegationScenarios.forEach(scenario => {
                it(scenario.description, (done) => {
                    fakeCommonsGenericProxy.postGeneric.and.callFake(() => {
                        return $q.reject(scenario.mockError);
                    });

                    fakeCommonsNewHttpUtilsErrorService.controlError.and.callFake((error, reject) => {
                        reject(error);
                    });

                    service.changeFlightOrderNothingToPay().catch(() => {
                        scenario.expectations(scenario.mockError);
                        done();
                    });

                    $rootScope.$digest();
                });
            });

            it('should NOT remove noPaymentVCFlow flag on generic errors', (done) => {
                const mockError = {
                    errorCode: 400,
                    data: {}
                };
                testErrorDoesNotRemoveNoPaymentFlag(mockError, done);
            });
        });



        describe('edge cases', () => {

            const edgeCaseInvalidDataScenarios = [
                {
                    description: 'bookingInfo with empty orderItems array',
                    setup: () => {
                        const bookingInfoWithEmptyItems = createMockBookingInfo({
                            order: {
                                orderId: 'ORD-123',
                                orderItems: []
                            }
                        });
                        localStorageService.set('bookingInfo', bookingInfoWithEmptyItems);
                        localStorageService.set('fareData', createMockFareData());
                    }
                },
                {
                    description: 'fareData with empty offers array',
                    setup: () => {
                        const fareDataWithEmptyOffers = createMockFareData({
                            offers: []
                        });
                        localStorageService.set('bookingInfo', createMockBookingInfo());
                        localStorageService.set('fareData', fareDataWithEmptyOffers);
                    }
                }
            ];

            edgeCaseInvalidDataScenarios.forEach(scenario => {
                it(`should handle ${scenario.description}`, (done) => {
                    testInvalidRequestRejection(scenario.setup, done);
                });
            });

            it('should handle null token gracefully when userLogged is true', (done) => {
                const mockSuccessResponse = createSuccessResponse();

                localStorageService.set('bookingInfo', createMockBookingInfo());
                localStorageService.set('fareData', createMockFareData());
                localStorageService.set('userLogged', true);

                fakeCommonsGenericProxy.postGeneric.and.callFake(() => {
                    return $q.resolve(mockSuccessResponse);
                });

                service.changeFlightOrderNothingToPay().then(() => {
                    const callArgs = fakeCommonsGenericProxy.postGeneric.calls.mostRecent().args;
                    const configObject = callArgs[2];
                    
                    expect(configObject).toBeDefined();
                    expect(configObject.headers['X-Salesforce-Token']).toBeNull();

                    done();
                });

                $rootScope.$digest();
            });

            it('should prioritize loginSF over SF_LOGGED_TOKEN when userLogged is true', (done) => {
                const primaryToken = 'PRIMARY-TOKEN';
                const fallbackToken = 'FALLBACK-TOKEN';
                const mockSuccessResponse = createSuccessResponse();

                localStorageService.set('loginSF', primaryToken);
                localStorageService.set('SF_LOGGED_TOKEN', fallbackToken);
                localStorageService.set('bookingInfo', createMockBookingInfo());
                localStorageService.set('fareData', createMockFareData());
                localStorageService.set('userLogged', true);

                fakeCommonsGenericProxy.postGeneric.and.callFake(() => {
                    return $q.resolve(mockSuccessResponse);
                });

                service.changeFlightOrderNothingToPay().then(() => {
                    const callArgs = fakeCommonsGenericProxy.postGeneric.calls.mostRecent().args;
                    const configObject = callArgs[2];

                    expect(configObject.headers['X-Salesforce-Token']).toBe(primaryToken);

                    done();
                });

                $rootScope.$digest();
            });

            it('should handle IDs with special characters', (done) => {
                const bookingWithSpecialChars = createMockBookingInfo({
                    order: {
                        orderId: 'ORD-2024_ABC-123',
                        orderItems: [{
                            orderItemId: 'ITEM_OLD-001-ñ'
                        }]
                    },
                    flowId: 'FLOW_2024-11-10_ABC'
                });

                const fareWithSpecialChars = createMockFareData({
                    offers: [{
                        offerId: 'OFFER-NEW_001-€'
                    }]
                });

                const mockSuccessResponse = createSuccessResponse();

                localStorageService.set('bookingInfo', bookingWithSpecialChars);
                localStorageService.set('fareData', fareWithSpecialChars);
                localStorageService.set('userLogged', true);

                fakeCommonsGenericProxy.postGeneric.and.callFake(() => {
                    return $q.resolve(mockSuccessResponse);
                });

                service.changeFlightOrderNothingToPay().then(() => {
                    const callArgs = fakeCommonsGenericProxy.postGeneric.calls.mostRecent().args;
                    const requestData = callArgs[1];
                    expect(requestData.orderId).toBe('ORD-2024_ABC-123');
                    expect(requestData.oldOrderItem.id).toBe('ITEM_OLD-001-ñ');
                    expect(requestData.newOrderItem.id).toBe('OFFER-NEW_001-€');

                    done();
                });

                $rootScope.$digest();
            });
        });
    });
});
