import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
describe('BookingMetasearchPassengersController test', () => {
    let scope, rootScope, controller;
    const controllerDependencies = {
        $scope: {},
        CommonsSessionStorageService: {}
    };
    // var FakeBookingAppConstants = getJSONFixture('./constants/BookingAppConstants-mock.json');
    const fakeBookingAppConstants = {
        OPTIONS_PASSENGERS_METASEARCH: {
            options: [
                { type: 'ADULT', option: [1, 2, 3, 4, 5, 6, 7, 8, 9], value: 3 },
                { type: 'CHILD', option: [0, 1, 2, 3, 4, 5, 6, 7, 8], value: 2 },
                { type: 'INFANT', option: [0, 1, 2, 3, 4, 5, 6, 7, 8], value: 1 }
            ]
        },
        BOOKING_PARAMS_NAMES: {
            LARGE_FAMILY_TYPE: '',
            RESIDENT: ''
        }
    };
    const mockbookingUrlParams = {
        modeWeb: null,
        searchOrigin: null,
        tripType: 'RoundTrip',
        senior: null,
        adult: 1,
        young: null,
        teenager: null,
        child: 1,
        infant: 1,
        resident: null,
        largeFamilyType: null,
        flexDates: null,
        preferredCabin: null,
        payWithAvios: null,
        payWithPoints: null,
        ibGroup: null,
        referralId: 'GoogleFlightSearch',
        displayedPrice: 62,
        slices: [
            [
                '1'
            ],
            [
                '2'
            ]
        ],
        userCurrency: 'EUR',
        priceCurrency: 'EUR',
        numTrips: null,
        originDestinations: [
            {
                origin: 'MAD',
                destination: 'ALC',
                date: '2020-03-19',
                flightNumber: '8858',
                bookingCode: 'O',
                carrier: 'IB',
                cabin: 'Economy'
            },
            {
                origin: 'ALC',
                destination: 'MAD',
                date: '2020-03-23',
                flightNumber: '8865',
                bookingCode: 'A',
                carrier: 'IB',
                cabin: 'Economy'
            }
        ],
        bookingCode1: 'O',
        backToUrl: null,
        codeTracking: null,
        travelAgent: null
    };

    const initialPassengersMock = [
        { type: 'ADULT', option: [1, 2, 3, 4, 5, 6, 7, 8, 9], value: 3 },
        { type: 'CHILD', option: [0, 1, 2, 3, 4, 5, 6, 7, 8], value: 2 },
        { type: 'INFANT', option: [0, 1, 2, 3, 4, 5, 6, 7, 8], value: 1 }
    ];
    const fakeBookingUtilService = {
        getURLFirstParameterByName: jasmine.createSpy().and.callFake(() => {
            return '';
        })
    };
    const fakeFilter = jasmine.createSpy('$filter').and.callFake((filter) => {
        function defaultFilterFunc () {
            return [];
        }

        function translateFilterFunc () {
            return 'Translated Text';
        }

        let filterFunc = defaultFilterFunc;
        switch (filter) {
                case 'translate':
                    filterFunc = translateFilterFunc;
                    break;
                default:
                    break;
        }

        return filterFunc;
    });
    beforeEach(() => {
        const storageService =  new StorageServiceMock();
        controllerDependencies.CommonsSessionStorageService = storageService;
        angular.mock.module('ib-booking-metasearch-passengers-module', ($provide) => {
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('CommonsSessionStorageService', storageService);
            $provide.value('$filter', fakeFilter);
        });
        inject(($rootScope, $controller) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            controllerDependencies.$scope = scope;
            controllerDependencies.CommonsSessionStorageService.set('bookingUrlParams', mockbookingUrlParams);
            controller = $controller('BookingMetasearchPassengersController', controllerDependencies);
        });
        scope.$digest();
    });

    describe('When the controller is called', () => {
        it('This should init the model according passengers type', (done) => {
            controllerDependencies.CommonsSessionStorageService.set('specialDiscounts', [{ type: 'PRUEBA', discountType: 'CODEPRUEBA' }]);
            controller.specialDiscounts =  [{ type: 'PRUEBA', discountType: 'CODEPRUEBA', option: [{code: 'CODEPRUEBA'}] }];
            controller.specialDiscountsApplied =  [{ type: 'PRUEBA', discountType: 'CODEPRUEBA' }];
            controller.initialPassengers = initialPassengersMock;
            controller.items = initialPassengersMock;
            controller.$onInit();
            expect(controller.initialPassengers[0].type).toEqual('ADULT');
            expect(controller.initialPassengers[1].type).toEqual('CHILD');
            expect(controller.initialPassengers[2].type).toEqual('INFANT');
            done();
        });
    });

    describe('When updateInitialInfo() is called', () => {
        beforeEach(() => {
            controllerDependencies.CommonsSessionStorageService.set('specialDiscounts', [{ type: 'PRUEBA', discountType: 'CODEPRUEBA' }]);
        });
        it('Should saved information about discount applicated', (done) => {
            controller.items = [];
            controller.items[0] = {
                value: 0
            };
            scope.$emit('updateInitialInfo');
            scope.$digest();
            expect(controller.initialDiscountsApplied[0].type).toEqual('PRUEBA');
            done();
        });
    });

    describe('When passengerCountChangeFail() is called', () => {
        beforeEach(() => {
            controllerDependencies.CommonsSessionStorageService.set('addPassengers', [{ passengerType: 'ADULT' }, { passengerType: 'CHILD' }, { passengerType: 'INFANT' }]);
        });
        it('this allocation the quantity to according passenger type', (done) => {
            controller.items = [];
            controller.items[0] = {
                value: 0
            };
            scope.$emit('passengerCountChangeFail', 0, 2);
            scope.$digest();
            expect(controller.items[0].value).toEqual(2);
            done();
        });
    });

    describe('When passengersDiscountsSelectors() is called', () => {
        beforeEach(() => {
            controller.specialDiscounts = [{}];
        });
        it('This save the type discount in the model ', (done) => {
            const selectedMock = { code: 'CODEPRUEBA2', name: 'NAMEPRUEBA' };
            controller.passengersDiscountsSelectors(0, 'PRUEBA', selectedMock);
            expect(controllerDependencies.CommonsSessionStorageService.get('specialDiscounts')[0].discountType).toEqual('CODEPRUEBA2');
            expect(controller.specialDiscounts[0].value).toEqual('NAMEPRUEBA');
            done();
        });
    });

    describe('When passengersSelectors() is called', () => {
        beforeEach(() => {
            const passengers = [{ ADULT: 3, CHILD: 2, INFANT: 1 }];
            controllerDependencies.CommonsSessionStorageService.set('availabilityRequestData', { passengers: passengers });
        });
        it('If there are no changes, emit false and keep availability passengers', (done) => {
            controllerDependencies.CommonsSessionStorageService.set('addPassengers', undefined);
            controllerDependencies.CommonsSessionStorageService.set('specialDiscounts', []);
            controller.items = initialPassengersMock;
            controller.initialPassengers = initialPassengersMock;
            controller.initialDiscountsApplied = [];
            controller.passengers =  [{ ADULT: 3, CHILD: 2, INFANT: 1 }];
            spyOn(scope, '$emit');
            controller.passengersSelectors(0);
            expect(controllerDependencies.CommonsSessionStorageService.get('addPassengers')[0].ADULT).toEqual(3);
            expect(controllerDependencies.CommonsSessionStorageService.get('addPassengers')[0].CHILD).toEqual(2);
            expect(controllerDependencies.CommonsSessionStorageService.get('addPassengers')[0].INFANT).toEqual(1);
            expect(scope.$emit).toHaveBeenCalledWith('newSeach', false);

            done();
        });
        it('If there is a change in the selection, emit true', (done) => {
            controllerDependencies.CommonsSessionStorageService.set('addPassengers', [{ passengerType: 'ADULT', count: '1' }]);
            controller.initialPassengers = angular.copy(initialPassengersMock);
            controller.items = angular.copy(initialPassengersMock);
            controller.items[0].value = 4;
            spyOn(scope, '$emit');
            controller.passengersSelectors(0);
            expect(scope.$emit).toHaveBeenCalledWith('newSeach', true);

            done();
        });
        it('If passenger  quantity mayor that 9 , this show message error', (done) => {
            controller.items = [];
            controller.items[0] = {
                value: 0
            };
            controller.initialPassengers = initialPassengersMock;
            controller.items[0].value = 11;
            controller.passengersSelectors(0);
            expect(controller.errorMessage).toEqual(3);
            done();
        });
    });
});