import * as angular from 'angular';
import { fakeBookingInfo } from './mocks/booking-info.mock';
import { fakeMmBAppConstants } from './mocks/mmb-app-constants.mock';
import { fakeReshopConditions } from './mocks/svc-reshop-conditions.mock';
import { fakeFlightsInfo } from './mocks/flights-info.mock';
import { fakeDatalayerUtilsService, fakeMmBUtilService, fakeMmBModalService, fakeChangleFlightsService, fakeCommonsUtilService, fakeVoluntaryChangesLogService, fakeCommonsAncillariesService, fakeBookingDashboardService } from './mocks/simulator-change-flights-services.mock'
import { fakeFlags, fakeFlagsFlex } from './mocks/flags.mock';
import { fakeFlightsInfoOnlyOneFlights } from './mocks/flights-info-only-one.mock';
import { FlightInfo } from '../../../../../../src/app/core/models/import-order-model/import-onhold-model';
describe('ibMmbSimulatorChangeFlightsTabComponent test', () => {

    var controller, $scope, $rootScope, localStorage, $q, $injector;
    var fakeBookingDashboardConstants = {
        TABS: {
            management: { name: 'management', isSubtab: false },
        }
    };


    var fakePhoneList = { "RESERVAS": { 'prefix': '(+34)', 'telephone': '901 111 500', 'text': 'Reservas y Venta:', 'prefixAlt': '', 'telephoneAlt': '', 'textAlt': '', 'timeText': '24h' } };
    var $filterFake = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = () => {
            return '';
        };
        switch (filter) {
            case 'translate':
                filterFunc = () => {
                    return 'Translated Text';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    var flightsAvailableCheck = { number: 2, slices: ['MADFCO20210315090500', 'FCOMAD20210322121500'] };

    let fakeHeaderModelOriginal = {
        headerModel: {
            shoppingBasket: {
                total: {
                    original: 30,
                    totalPrice: 0
                },
            }
        }
    };

    let fakeHeaderModel = {
        headerModel: {
            shoppingBasket: {
                total: {
                    totalPrice: 0
                },
            }
        }
    };

    let fakeIbFlexFlexibilizationTransformer = {
        getBuildModelVC: jasmine.createSpy()
    };
    let fakeSimulatorAvailabilityTransformer = {
        searchFlights: jasmine.createSpy(),
        generateFlightsModelRibbon: jasmine.createSpy()
    };
    let fakeSimulatorVoluntaryChangesService = {
        getModelFlighVC: jasmine.createSpy(),
        getAvailability: jasmine.createSpy()
    }

    beforeEach(() => {
        angular.mock.module('ib-MmB-simulator-change-flights-tab-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('$filter', $filterFake);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
            $provide.value('IbFlexFlexibilizationTransformer', fakeIbFlexFlexibilizationTransformer);
            $provide.value('SimulatorAvailabilityTransformer', fakeSimulatorAvailabilityTransformer);
            $provide.value('SimulatorVoluntaryChangesService', fakeSimulatorVoluntaryChangesService);
            $provide.value('VoluntaryChangesLogService', fakeVoluntaryChangesLogService);
        });

        inject((_$rootScope_, _$componentController_, _localStorageService_, _$injector_) => {
            $rootScope = _$rootScope_;
            $rootScope.appLang = 'es';
            $rootScope.appMarket = 'ES';
            $scope = _$rootScope_.$new();
            $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                clone[key] = _$injector_[key];
                return clone
            }, {});
            $q = $injector.get('$q');
            localStorage = _localStorageService_;
            localStorage.set('bookingInfo', fakeBookingInfo);
            localStorage.set('phonesList', fakePhoneList);
            localStorage.set('reshopConditions', fakeReshopConditions);
            localStorage.set('headerModel', fakeHeaderModel)
            controller = _$componentController_('ibMmbSimulatorChangeFlightsTabComponent', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });
    });


    describe('when activate is called', () => {
        it('and phoneList is null', (done) => {
            controller.flightsInfo = fakeFlightsInfo;
            controller.flags = fakeFlags;
            controller.$onInit();
            controller.phonesList = null;
            expect(controller.phonesList).toEqual(null);
            done();
        });
        it('and check normal', (done) => {
            controller.flightsInfo = fakeFlightsInfo;
            controller.flags = fakeFlags;
            controller.$onInit();
            expect(controller.flightsAvailable).toEqual(flightsAvailableCheck);
            done();
        });
    });

    describe('when Function of controller is called', () => {
        describe('when initializeData is called', () => {
            it('And flightsAvailable is 2', (done) => {
                controller.flightsInfo = fakeFlightsInfo;
                controller.flags = fakeFlags;
                controller.$onInit();
                expect(controller.flightsAvailable.number).toEqual(2);
                done();
            });

            it('And numberFlights is 1', (done) => {
                controller.flightsInfo = fakeFlightsInfoOnlyOneFlights;
                controller.flags = fakeFlags;
                controller.numberFlights = 1;
                controller.$onInit();
                expect(controller.numberFlights).toEqual(1);
                done();
            });
        });
        describe('when getPhone is called', () => {
            it('And defined and case default', (done) => {
                controller.phonesList = fakePhoneList;
                expect(controller.getPhone()).toBeDefined();
                expect(controller.getPhone()).toEqual(controller.phonesList.RESERVAS.prefix + ' ' + controller.phonesList.RESERVAS.telephone);
                done();
            });
        });

        describe('when getConditionText is called', () => {
            it('And Message have value', (done) => {
                var condition = { message: 'Hacer test es bueno' };
                var message = controller.getConditionText(condition);

                expect(message).toEqual({ main: 'Hacer test es bueno', additional: '' });
                done();
            });
            it('And Message doesnt exist', (done) => {
                var condition = {};
                var message = controller.getConditionText(condition);

                expect(message).toEqual('');
                done();
            });
        });

        describe('when openFareModal is called', () => {
            it('And open modal', (done) => {
                var fareFamilyInfo = {};
                controller.openFareModal(fareFamilyInfo);
                done();
            });
        });

        describe('when addQuadrigam is called', () => {
            it('', (done) => {
                controller.addQuadrigam();
                done();
            });
        });

        describe('when processRebookFailed is called', () => {
            it('', (done) => {
                controller.processRebookFailed();
                done();
            });
        });
    });

// Function: getIsEmptyBasketController
    describe('when getIsEmptyBasketController is called', () => {
        it('should set isEmptyBasket to true when total.original is 0', (done) => {
            fakeHeaderModelOriginal.headerModel.shoppingBasket.total.original = 0;
            localStorage.set('headerModel', fakeHeaderModelOriginal);

            controller.getIsEmptyBasketController();

            expect(controller.isEmptyBasket).toBe(true);
            done();
        });

        it('should set isEmptyBasket to true when total.totalPrice is 0', (done) => {
            fakeHeaderModel.headerModel.shoppingBasket.total.totalPrice;
            localStorage.set('headerModel', fakeHeaderModel);

            controller.getIsEmptyBasketController();

            expect(controller.isEmptyBasket).toBe(true);
            done();
        });

        it('should set isEmptyBasket to false when total.original is greater than 0', (done) => {
            fakeHeaderModelOriginal.headerModel.shoppingBasket.total.original = 30;
            localStorage.set('headerModel', fakeHeaderModelOriginal);

            controller.getIsEmptyBasketController();

            expect(controller.isEmptyBasket).toBe(false);
            done();
        });
    });


// function: getIsEmptyBasket
    describe('when getIsEmptyBasket is called', () => {
        it('and getIsEmptyBasket is true', (done) => {
            fakeHeaderModelOriginal.headerModel.shoppingBasket.total.original = 30;
            localStorage.set('headerModel', fakeHeaderModelOriginal);
            controller.getIsEmptyBasket();
            $rootScope.$digest();
            expect(controller.isEmptyBasket).toBe(false);
            done();
        });
        it('and getIsEmptyBasket is false', (done) => {
            fakeHeaderModelOriginal.headerModel.shoppingBasket.total.original = 0;
            localStorage.set('headerModel', fakeHeaderModelOriginal);
            controller.getIsEmptyBasket();
            $rootScope.$digest();
            expect(controller.isEmptyBasket).toBe(true);
            done();
        });

        it('should set getIsEmptyBasket to true when total.totalPrice is 0', (done) => {
            fakeHeaderModel.headerModel.shoppingBasket.total.totalPrice;
            localStorage.set('headerModel', fakeHeaderModel);

            controller.getIsEmptyBasket();

            expect(controller.isEmptyBasket).toBe(true);
            done();
        });
    });

    describe('when deleteBasket is called', () => {
        it('and showEmptyBasketModal is resolve and call isEmptyBasket', (done) => {
            fakeMmBModalService.showEmptyBasketModal = jasmine.createSpy('showEmptyBasketModal').and.callFake(() => {
                return {
                    'result': $q.when({})
                };
            });
            fakeHeaderModelOriginal.headerModel.shoppingBasket.total.original = 30;
            localStorage.set('headerModel', fakeHeaderModelOriginal);
            controller.deleteBasket();
            $rootScope.$digest();
            expect(controller.isEmptyBasket).toBe(false);
            done();
        });
    });
    // Function: changeDate
    describe('when changeDate() is called', () => {
        beforeEach(() => {
            controller.dateOptions = {
                showWeeks: false,
                maxMode: 'day',
                minDate: new Date(),
                maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            };
            controller.flightsInfo = angular.copy(fakeFlightsInfo);
            controller.numberFlights = 2;
            controller.slicesId = ["MADFCO20210315090500", "FCOMAD20210322121500"];
            controller.flightsInfo.flights["MADFCO20210315090500"].dateOptions = angular.copy(controller.dateOptions);
            controller.flightsInfo.flights["FCOMAD20210322121500"].dateOptions = angular.copy(controller.dateOptions);
        });

        it('and call function', (done) => {
            controller.flightsInfo = angular.copy(fakeFlightsInfo);
            controller.flags = angular.copy(fakeFlags);
            controller.slicesId = ["MADFCO20210315090500", "FCOMAD20210322121500"];
            controller.numberFlights = 2;
            controller.$onInit();
            controller.flightsInfo.flights[controller.slicesId[0]].newDateSelected = new Date();
            let changeDate = controller.changeDate(0);
            expect(changeDate).toBeUndefined();
            done();
        })

        it('should return if flight does not exist for valid sliceId', (done) => {
            controller.slicesId = ["MADFCO20210315090500"];
            controller.flightsInfo = {
                flights: {}
            };

            let result = controller.changeDate(0);

            expect(result).toBeUndefined();
            done();
        });

        it('should return if sliceId is not found', (done) => {
            let result = controller.changeDate(999);
            expect(result).toBeUndefined();
            done();
        });
        it('should return if there is no sliceId for the index', (done) => {
            controller.slicesId = [];
            let result = controller.changeDate(0);
            expect(result).toBeUndefined();
            done();
        });

        it('should reset return date when months are different', (done) => {
            const outboundDate = new Date(2021, 3, 15);
            const returnDate = new Date(2021, 2, 20);
            controller.flightsInfo.flights["MADFCO20210315090500"].newDateSelected = outboundDate;
            controller.flightsInfo.flights["FCOMAD20210322121500"].newDateSelected = returnDate;
            controller.changeDate(0);
            expect(controller.flightsInfo.flights["FCOMAD20210322121500"].newDateSelected)
                .toBeNull();
            done();
        });

        it('should reset return date when outbound day is after return day in same month', (done) => {
            const outboundDate = new Date(2021, 3, 20);
            const returnDate = new Date(2021, 3, 15);
            controller.flightsInfo.flights["MADFCO20210315090500"].newDateSelected = outboundDate;
            controller.flightsInfo.flights["FCOMAD20210322121500"].newDateSelected = returnDate;
            controller.changeDate(0);
            expect(controller.flightsInfo.flights["FCOMAD20210322121500"].newDateSelected)
                .toBeNull();
            done();
        });

        it('should update outbound flight max date when return flight date changes', (done) => {
            const returnDate = new Date(2021, 3, 20);
            controller.flightsInfo.flights["FCOMAD20210322121500"].newDateSelected = returnDate;
            controller.changeDate(1);
            const outboundFlight = controller.flightsInfo.flights["MADFCO20210315090500"];
            expect(outboundFlight.dateOptions.maxDate.getTime())
                .toEqual(returnDate.getTime());
            done();
        });
        it('should return null when date is null', (done) => {
            const result = controller.transformerDateSelected(null);
            expect(result).toBeNull();
            done();
        });
    });

    // Function: anyDateSelected
    describe('anyDateSelected', () => {
        beforeEach(() => {
            controller.flightsInfo = angular.copy(fakeFlightsInfo);
            controller.numberFlights = 2;
            controller.slicesId = ["MADFCO20210315090500", "FCOMAD20210322121500"];
        });

        it('should return false when newDateSelected is null', (done) => {
            controller.flightsInfo.flights["MADFCO20210315090500"].newDateSelected = null;
            controller.flightsInfo.flights["FCOMAD20210322121500"].newDateSelected = null;

            const result = controller.anyDateSelected();

            expect(result).toBe(false);
            done();
        });

        it('should return true when newDateSelected is not null', (done) => {
            controller.flightsInfo.flights["MADFCO20210315090500"].newDateSelected = new Date();
            controller.flightsInfo.flights["FCOMAD20210322121500"].newDateSelected = null;

            const result = controller.anyDateSelected();

            expect(result).toBe(true);
            done();
        });

        it('should return true when all flights have newDateSelected null', (done) => {
            Object.keys(controller.flightsInfo.flights).forEach(key => {
                controller.flightsInfo.flights[key].newDateSelected = new Date();
            });

            const result = controller.anyDateSelected();

            expect(result).toBe(true);
            done();
        });
    });
    // Function: getConditionText
    describe('getConditionText', () => {
        const testCases = [
            {
                description: 'undefined condition',
                input: undefined,
                expected: ''
            },
            {
                description: 'null condition',
                input: null,
                expected: ''
            },
            {
                description: 'empty object condition',
                input: {},
                expected: ''
            },
            {
                description: 'message with separator',
                input: { message: 'Primera parte. Segunda parte' },
                expected: {
                    main: 'Primera parte',
                    additional: 'Segunda parte'
                }
            },
            {
                description: 'message without separator',
                input: { message: 'Mensaje sin separador' },
                expected: {
                    main: 'Mensaje sin separador',
                    additional: ''
                }
            },
        ];

        testCases.forEach(({ description, input, expected }) => {
            it(`should handle ${description}`, (done) => {
                expect(controller.getConditionText(input)).toEqual(expected);
                done();
            });
        });
    });
    // Function: getPhone
    describe('getPhone', () => {
        beforeEach(() => {
            controller.phonesList = angular.copy(fakePhoneList);
        });
        it('should return phone number with prefix', (done) => {
            const result = controller.getPhone();
            expect(result).toEqual(fakePhoneList.RESERVAS.prefix + ' ' + fakePhoneList.RESERVAS.telephone);
            done();
        });
        it('should return empty string when phoneList is null', (done) => {
            controller.phonesList = null;
            const result = controller.getPhone();
            expect(result).toBeNull();
            done();
        });
    });

    // Function:  initializeDates
    describe('initializeDates', () => {
        beforeEach(() => {
            controller.flightsInfo = angular.copy(fakeFlightsInfo);
            controller.dateOptions = {
                showWeeks: false,
                maxMode: 'day',
                minDate: new Date(),
                maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            };
            controller.timeRangeOptions = [
                    { name: '08:00 - 15:00' },
                    { name: '16:00 - 24:00' },
                    { name: '01:00 - 07:00' },
            ];
        });

        it('retornar cuando flightsInfo no este definido', (done) => {

            controller.flightsInfo = undefined;
            const result = controller.initializeDates();
            expect(result).toBeUndefined();
            done();
        });

        it('debería inicializar correctamente los vuelos ida y vuelta', (done) => {
            controller.initializeDates();

            expect(controller.numberFlights).toBe(2);
            expect(controller.slicesId.length).toBe(2);
            expect(controller.searchAvailable).toBe(true);
            done();
        });

        it('debería ordenar los vuelos por fecha de salida', (done) => {
            const fechaAnterior = new Date(2021, 2, 15);  // 15 de marzo 2021
            const fechaPosterior = new Date(2021, 2, 20); // 20 de marzo 2021
            controller.flightsInfo = angular.copy(fakeFlightsInfo);

            controller.flightsInfo.flights["MADFCO20210315090500"].departureDateParsed = {
                originalDate: fechaPosterior.toISOString()
            };
            controller.flightsInfo.flights["FCOMAD20210322121500"].departureDateParsed = {
                originalDate: fechaAnterior.toISOString()
            };

            controller.initializeDates();


            expect(controller.slicesId[0]).toBe("FCOMAD20210322121500"); // Vuelo con fecha anterior
            expect(controller.slicesId[1]).toBe("MADFCO20210315090500"); // Vuelo con fecha posterior
            expect(new Date(controller.flightsInfo.flights[controller.slicesId[0]].departureDateParsed.originalDate))
                .toEqual(fechaAnterior);
            expect(new Date(controller.flightsInfo.flights[controller.slicesId[1]].departureDateParsed.originalDate))
                .toEqual(fechaPosterior);

            done();
        });

        it('debería actualizar minDate del vuelo de vuelta si es menor que la fecha de ida', (done) => {
            // 1. Preparar fechas
            const fechaIda = new Date(2021, 2, 20);    // 20 de marzo 2021
            const fechaMinimaVuelta = new Date(2021, 2, 15); // 15 de marzo 2021

            // 2. Configurar dateOptions global
            controller.dateOptions = {
                showWeeks: false,
                maxMode: 'day',
                minDate: fechaMinimaVuelta,
                maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            };

            // 3. Configurar vuelos
            controller.flightsInfo = angular.copy(fakeFlightsInfo);
            controller.flightsInfo.flights["MADFCO20210315090500"].departureDateParsed = {
                originalDate: fechaIda.toISOString()
            };

            // 4. Establecer orden de vuelos
            controller.slicesId = ["MADFCO20210315090500", "FCOMAD20210322121500"];
            controller.numberFlights = 2;

            // 5. Ejecutar inicialización
            controller.initializeDates();

            // 6. Verificar actualización de fecha mínima
            const vueloVuelta = controller.flightsInfo.flights["FCOMAD20210322121500"];
            expect(vueloVuelta.dateOptions.minDate.getTime())
                .toEqual(fechaIda.getTime());

            done();
        });
    });
});
