import * as angular from 'angular';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';

describe('FiltersModalController test', () => {
    let controller,rootScope, scope;
    const controllerDependencies = {
        $scope: {},
        $rootScope: {newFare:'',$broadcast:()=>{}},
        filter: {},
        window:{}
    };

    const fakeUibModalInstance = {
        dismiss: jasmine.createSpy('dismiss'),
        close: jasmine.createSpy('close'),
        result: Promise.resolve()
    }

    const fakeDatalayerUtilsService = {
        sendDatalayerEvent: jasmine.createSpy('sendDatalayerEvent'),
        setProcessAndStep: jasmine.createSpy('setProcessAndStep'),
        sendDatalayerModalEvent: jasmine.createSpy('sendDatalayerModalEvent'),
    };

    const fakeCurrencyService = {
        formatPrice: jasmine.createSpy('formatPrice'),
        getCurrencyObject: jasmine.createSpy('getCurrencyObject'),
    }
    const fakeObject = {
        filterOptions: {
            cabin:{
                cabinAvailable: true,
                cabinType: 'E'
            },
            cabinType: {
                anyCabin: true
            },
            departureHours: {
                minValue: 7,
                maxValue: 23,
            },
            arrivalHours: {
                minValue: 7,
                maxValue: 23,
            },
            avios: 5,
            price:{
                minValue: 2,
                maxValue: 5
            },
            pricesByCabin:{'E':[{
                minValue: 7,
                maxValue: 23,
            }]},
            stopsNumber1:'test',
            stopsNumber2:'test',
            stopsNumber3:'test',
        },
        initialFilterOptions:{
            departureHours: {
                minValue: 7,
                maxValue: 23,
            },
            arrivalHours: {
                minValue: 7,
                maxValue: 23,
            },
            price: 0
        }
    }

    beforeEach(() => {
        angular.mock.module('ib-booking-modal-module', ($provide) => {
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('$uibModalInstance', fakeUibModalInstance);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('object', fakeObject);
            $provide.value('BookingAppConstants', BookingAppConstants);
        });

        inject(($controller, _$rootScope_,object,$filter,$window) => {
            rootScope = _$rootScope_;
            scope = _$rootScope_.$new();
            controllerDependencies.$scope = scope;
            controllerDependencies.$rootScope = rootScope;
            controllerDependencies.filter = $filter;
            controllerDependencies.window = $window;
            controller = $controller('FiltersModalController', controllerDependencies);
            scope.$digest();
        });

    });
    describe('when activate() is called ', () => {
        beforeEach(() => {
        });
        it('it will create a modal', () => {
            controller.$onInit();
            expect(controller).toBeDefined();
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
        });
    });
    describe('when closeModal() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            controller.close();
            expect(fakeUibModalInstance.dismiss).toHaveBeenCalled();
        });
    });
    describe('when acceptModal() is called ', () => {
        beforeEach(() => {
            controller.model.filterOptions.price = {
                minValue: 2,
                maxValue: 5
            }
        });
        it('', () => {
            controller.accept('prueba');
            expect(fakeUibModalInstance.close).toHaveBeenCalled();
        });
    });
    describe('when updateRangePrices() is called ', () => {
        beforeEach(() => {
            controller.model.filterOptions.price = {
                minValue: 2,
                maxValue: 5
            }
        });
        it('and cabinType is anyCabin, it will update prices of the cabin', () => {
            controller.updateRangePrices('anyCabin');
            expect(controller.model.filterOptions.price).toEqual(0);
        });
        it('and cabinType is E, it will update prices of the cabin', () => {
            controller.updateRangePrices('E');
            expect(controller.model.filterOptions.price).toEqual([{
                minValue: 7,
                maxValue: 23,
            }]);
        });
    });
});
