describe('IbFlexAvailabilityTripController Test', () => {
    let $controller;
    let $rootScope;
    let $scope;
    let IbFlexAvailabilityTripController;
    let fakeEvent = {
        preventDefault: () => { }
    };
    let fakeMmBModalService = {
        'showGenericModal': jasmine.createSpy('showGenericModal').and.callFake(() => {
            return {
                'result': {
                    'then': () => { }
                }
            };
        })
    };
    let fakeMmBUtilsSharedService = {
        'updateSisterCitiesModel': jasmine.createSpy()
    };
    let fakelocalStorageService = {
        'get': jasmine.createSpy()
    };
    let fakeSlice = [
        {
            sliceId: 'MADIBZ20200718114500',
            type: 'REGULAR',
            departureDateTime: '2020-07-18 11:45',
            arrivalDateTime: '2020-07-18 13:00',
            duration: 75,
            stopsNumber: 0,
            price: {
                fare: 223,
                currency: 'EUR'
            },
            detailedPrices: [
                null
            ],
            segments: [
                {
                    id: 'test'
                }
            ],
            overnight: false,
            passengerFlags: [
                null
            ]
        }
    ];

    const fakeSelectedSlices = {
        'order': {
            'selectedSlices': [
                {
                    'date': {
                        'serviceDate': '2019-09-04',
                        'slidePosition': 5,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 4,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2019,
                            'originalDate': '2019-09-04T00:00:00+02:00',
                            'formatedDate': '04/09/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    'index': 'OD1'
                },
                {
                    'date': {
                        'serviceDate': '2019-09-09',
                        'slidePosition': 8,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 9,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2019,
                            'originalDate': '2019-09-09T00:00:00+02:00',
                            'formatedDate': '09/09/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    'index': 'OD2'
                }
            ]
        }
    };
    
    let fakeItem = {
        'filter': true
    };

    beforeEach(() => {
        angular.mock.module('ib-flexibilization-availability-trip-module', ($provide) => {
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
            $provide.value('localStorageService', fakelocalStorageService);
        });
        inject((_$controller_, _$rootScope_, _localStorageService_) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            IbFlexAvailabilityTripController = $controller('IbFlexAvailabilityTripController', { $scope: $scope, $rootScope: $rootScope });
        });
            
        $rootScope.$digest();
    });
    describe('when IbFlexAvailabilityTripController is init', () => {
        describe('and init function is called', () => {
            it('IbFlexAvailabilityTripController should be defined', (done) => {
                IbFlexAvailabilityTripController.$onInit();
                expect(IbFlexAvailabilityTripController).toBeDefined();
                expect(IbFlexAvailabilityTripController.listFlightFilter).toBeDefined();
                done();
            });
        });

        describe('and optionSelected function is called', () => {
            it('optionSelected should be emit', (done) => {
                spyOn($rootScope, '$emit');
                IbFlexAvailabilityTripController.optionSelected();
                expect($rootScope.$emit).toHaveBeenCalledWith('optionSelected');
                done();
            });
        });

        describe('and removeStateFlight function is called', () => {
            it('totalShow should be defined', (done) => {
                IbFlexAvailabilityTripController.selectedSlices = {...fakeSelectedSlices};
                IbFlexAvailabilityTripController.listSlicesShow = 1;
                let fakeSliceConfIndex = 0;
                IbFlexAvailabilityTripController.removeStateFlight(fakeSliceConfIndex);
                expect(IbFlexAvailabilityTripController.removeStateFlight).toBeDefined();
                expect(IbFlexAvailabilityTripController.listSlicesShow).toEqual(0);
                done();
            });
            it('fakeSliceConfIndex > listSlicesShow', (done) => {
                IbFlexAvailabilityTripController.selectedSlices = {...fakeSelectedSlices};
                IbFlexAvailabilityTripController.listSlicesShow = 1;
                let fakeSliceConfIndex = 5;
                IbFlexAvailabilityTripController.removeStateFlight(fakeSliceConfIndex);
                expect(IbFlexAvailabilityTripController.listSlicesShow).toEqual(1);
                done();
            });
        });

        describe('and clickListFlightFilter function is called', () => {
            it('selectedListFlightFilter to be Item', (done) => {
                let fakeItemNew = 0;
                IbFlexAvailabilityTripController.clickListFlightFilter(fakeItemNew, fakeEvent);
                expect(IbFlexAvailabilityTripController.selectedListFlightFilter).toBe(fakeItemNew);
                done();
            });
        });
        describe('and activateFilter function is called', () => {
            it('choosedFilter to be Item.filter and filterReverse false', (done) => {      
                IbFlexAvailabilityTripController.choosedFilter = null;
                IbFlexAvailabilityTripController.activateFilter(fakeItem, fakeEvent);
                expect(IbFlexAvailabilityTripController.choosedFilter).toBe(fakeItem.filter);
                expect(IbFlexAvailabilityTripController.filterReverse).toEqual(false);
                done();
            });
            it('filterReverse true', (done) => {
                IbFlexAvailabilityTripController.choosedFilter = true;
                IbFlexAvailabilityTripController.filterReverse = false;
                IbFlexAvailabilityTripController.activateFilter(fakeItem, fakeEvent);
                expect(IbFlexAvailabilityTripController.choosedFilter).toBe(fakeItem.filter);
                expect(IbFlexAvailabilityTripController.filterReverse).toEqual(true);
                done();
            });
        });

        describe('and openSisterCity function is called', () => { //miguel
            beforeEach(() => {
                inject(($q) => {
                    fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                        return {
                            'result': $q.when([])
                        };
                    });

                    IbFlexAvailabilityTripController.slices = fakeSlice;

                });
            });
            it('showGenericModal have been called and resolve', (done) => {
                IbFlexAvailabilityTripController.openSisterCity();
                $rootScope.$digest();
                expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
                done();
            });
            it('showGenericModal have been called and reject', (done) => {
                inject(($q) => {
                    fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                        return {
                            'result': $q.reject({})
                        };
                    });
                });
                IbFlexAvailabilityTripController.openSisterCity();
                $rootScope.$digest();
                expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
                done();
            });
        });
    });
});
