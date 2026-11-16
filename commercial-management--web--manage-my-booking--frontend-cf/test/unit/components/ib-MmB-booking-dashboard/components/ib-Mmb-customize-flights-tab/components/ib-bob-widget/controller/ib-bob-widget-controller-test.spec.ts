describe('BobWidgetController test', function () {
    var controller, $scope, $rootScope, $controller, localStorage, DatalayerConstants, BoBWidget, window;

    var fakeAppConstants = {
        'market': 'ES',
        QUADRIGAM: { CUSTOMIZE_FLIGHTS: 'test' },
        ANCILLARIES_TYPES : {
            SEAT: 'SEAT'
        }
    };

    var fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy()
    };

    var fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy('isUserLogged').and.callFake(function () { })
    };

    var fakeMmBModalService = {
        showGenericModal: jasmine.createSpy()
    }

    var fakeRedirectionService = {
        externalRedirect: jasmine.createSpy()
    }
    var $filterFake = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function () {
            return '';
        };
        switch (filter) {
            case 'translate':
                filterFunc = function () {
                    return 'Translated Text';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    var fakeBookingDashboardConstants = {

    }
    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            'VIEW': 'TEST_4'
        },
        DIGITAL_DATA_PROCESS: {
            MODBOB: 'test'
        },
        DIGITAL_DATA_STEP: {
            MODBOB: 'test'
        }
    };
    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy('setTitlePage').and.callFake(function () {
            return 'TITULO'
        }),
    };

    var fakeBkiInfo = {
        deepLinkInformation: true,
        order: {
            slices: [
                {
                    type: 'SHUTTLE',
                    segments: [
                        {
                            test: 'test'
                        }
                    ]
                }
            ]
        }
    };
    var fakeMmBAppConstants = {
        QUADRIGAM: {
            MODAL_SELECT_BOB: 'test'
        }
    }

    var fakeBobInfo = {
        'slices': [
            {
                products: [
                    {
                        price: 200,
                    }
                ]
            }
        ]
    }

    var fakeBobOrder = {
        'test': 'test'
    }

    var fakeBookingInfo = {
        'tickets': [
            {
                'coupons': [
                    {
                        'departure': 'test',
                        'arrival': 'test',
                        'carrier': 'test',
                        'flightNumber': 'test',
                        'departureDate ': 'test',
                    }
                ]
            }
        ]
    }

    var fakePassengers = [
        {
            personalInfo: {
                name: 'test',
                surname: 'test'
            },
            contactInfo: {
                email: 'test@ab.com',
                phone: '123456789'
            }
        }
    ];

    var fakePayload = { name: 'name', surname: 'surname', email: 'email', phone: 'phone' };

    var $injector;

    beforeEach(function () {
        angular.mock.module('ib-bob-widget-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBAppConstants', fakeAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('RedirectionService', fakeRedirectionService);
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('$filter',$filterFake);
            $provide.value('CommonsUtilService',fakeCommonsUtilService);
        });
        inject(function (_$controller_, _$rootScope_, _$window_, _localStorageService_,_$document_,_$timeout_, _$injector_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorage = _localStorageService_;
            window = _$window_;
            $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                clone[key] = _$injector_[key];
                return clone
            } , {});
            DatalayerConstants = $injector.get('MMBDatalayerConstants');
            localStorage.set('bookingInfo', fakeBookingInfo);
            localStorage.set('bobInfo', fakeBobInfo);
            localStorage.set('bobOrder', fakeBobOrder);
            localStorage.set('passengers', fakePassengers);
            controller = $controller('BobWidgetController', {
                $scope: $scope,
                DatalayerConstants: DatalayerConstants
            });
        });
        window.BoBWidget = {
            sendFlightList: jasmine.createSpy(),
            setBookerPersonalInfo: jasmine.createSpy(),
            show: jasmine.createSpy()

        };
    });

    describe('When functions is called', function () {
        it('and call $onInit', function(done) {
            controller.$onInit();
            expect(controller.quanty).toEqual(1);
            expect(controller.specialUser).toBeFalse();
            done();
        });
        it('and call $onInit with order empty', function(done) {
            localStorage.set('bobOrder', '');
            controller.$onInit();
            expect(controller.quanty).toEqual(0);
            expect(controller.specialUser).toBeFalse();
            done();
        });
        it('and call openModal', function(done) {
            controller.openModal();
            expect(fakePayload).toEqual({ name: 'name', surname: 'surname', email: 'email', phone: 'phone' });
            done();
        });
    });

    describe('When the activate function is called', function () {
        it('and call $onInit with product price === 0', function(done) {
            localStorage.set('bobInfo', {
                slices: [
                    {
                        products: [
                            {
                                price: 0
                            }
                        ]
                    }
                ]
            });
            controller.$onInit();
            expect(controller.specialUser).toBeTrue();
            done();
        });

        it('should function openModal when specialUser is true', function(done) {
            controller.specialUser = true;
            controller.openModal();
            let payload = {...fakePayload, type_checkin: 'business'};
            expect(payload).toEqual({name: 'name', surname: 'surname', email: 'email', phone: 'phone', type_checkin: 'business'})
            done();
        })
    });


});
