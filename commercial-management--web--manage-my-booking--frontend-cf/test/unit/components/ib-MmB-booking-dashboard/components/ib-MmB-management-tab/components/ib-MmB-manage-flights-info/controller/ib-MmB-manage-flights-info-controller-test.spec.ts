import angular from 'angular';
import { ManageFlightsInfoControllerMock } from '../mocks/manage-flights-info-controller.mock';
describe('MmBManageFlightsInfoController test', function () {
    var controller, $scope, localStorageService, $rootScope, $filter;

    var fakeBookingInfo1 = {
        order: {
            bookingReferences: [{
                reference: 'V6X6LR',
                provider: 'IB'
            }]
        }
    };

    var $fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function () {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return label;
                } as any;
                break;
            default:
                break;
        }

        return filterFunc;
    })

    beforeEach(function () {
        angular.mock.module('ib-MmB-manage-flights-info-module', 'LocalStorageModule', function ($provide) {
            $provide.value('$filter', $fakeFilter);
        });
        inject(function (_$rootScope_, _localStorageService_, $controller) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            localStorageService.set('bookingInfo', fakeBookingInfo1);
            localStorageService.set('PNR', 'V6X6LR');
            controller = $controller('MmBManageFlightsInfoController', {
                $scope: $scope,
                $rootScope: $rootScope,
                localStorageService: _localStorageService_
            });
        });
        controller.$onInit();
        $rootScope.$digest();
    });

    describe('when the component is created', () => {
        it('Should set popoverFlights correctly', (done) => {
            expect(controller.popoverFlights).toEqual(
                [{ 'text': 'IBCOAC_MMB_REQUEST_BILL_LINK_TITLE', 'path': null, 'event': null },
                { 'text': 'MMB_CHANGE_FLIGHTS_TITLE', 'path': null, 'event': null },
                { 'text': 'MMB_NULLIFY_FLIGHTS_TITLE', 'path': null, 'event': null }]
            );
            done();
        });
    });

    describe('getFlightIcon function', () => {
        describe('when flight is an airplane', () => {
            it('should return icon-avion_ida for first flight (index 0)', () => {
                const flight = ManageFlightsInfoControllerMock.mockAirplaneFlightOutbound;
                const result = controller.getFlightIcon(flight, 0);
                
                expect(result).toBe('icon-avion_ida');
            });

            it('should return icon-avion_vuelta for second flight (index 1)', () => {
                const flight = ManageFlightsInfoControllerMock.mockAirplaneFlightReturn;
                const result = controller.getFlightIcon(flight, 1);

                expect(result).toBe('icon-avion_vuelta');
            });
            
        });

        describe('when flight is a train', () => {
            it('should return icon-tren for train flights regardless of index', () => {
                const trainFlight = ManageFlightsInfoControllerMock.mockTrainFlight;
                const result0 = controller.getFlightIcon(trainFlight, 0);
                const result1 = controller.getFlightIcon(trainFlight, 1);

                expect(result0).toBe('icon-tren');
                expect(result1).toBe('icon-tren');
            });
        });
    });
});