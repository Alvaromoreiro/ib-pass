
describe('test for module ib-flexibilization-info-module - controllers', () => {
    let ibFlexibilizationInfoComponent, $componentController, $controller, $rootScope, $scope, localStorageService, $injector;

    const blackOutPeriodsDataMock = {
        allowedPeriods: [
            {
                dateFrom: '2022-01-01 00:00:00',
                dateTo: '2022-01-02 00:00:00',
                id: 1
            },
            {
                dateFrom: '2022-01-03 00:00:00',
                dateTo: '2022-01-04 00:00:00',
                id: 2
            }
        ]
    };
    const fakeFilter = jasmine.createSpy('$filter').and.callFake((filter) => {
        var filterFunc :any = function () {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return 'test';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    let fakeflexibilizationInfoDates = {
        flexibilizationInfoDates: {
            allowedPeriods: [{
                dateFrom: '2025-10-10',
                dateTo: '2025-12-12',
            }],
            flexibilizationDate: {
                dateFrom: '2025-10-10',
                dateTo: '2025-12-12',
            }
        }
    };

    beforeEach(() => {
        angular.mock.module('ib-flexibilization-info-module', 'LocalStorageModule', ($provide) => {
            $provide.value('$filter', fakeFilter);
        });
        inject((_$componentController_, _$injector_) => {
            $componentController = _$componentController_;
            $injector = Object.keys(_$injector_).reduce((clone, key) => {
                clone[key] = _$injector_[key];
                return clone
            } , {});
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            localStorageService = $injector.get('localStorageService');
            ibFlexibilizationInfoComponent = $componentController('ibFlexibilizationInfo', {
                $rootScope: $rootScope,
                localStorageService: localStorageService
            }, fakeflexibilizationInfoDates);
        });
    });

    describe('test for ibFlexibilizationInfoComponent', () => {

        it('IbFlexibilizationInfoController should be defined', () => {
            expect(ibFlexibilizationInfoComponent).toBeDefined();
        });


        it('test for IbFlexibilizationInfoController.$onInit', (done) => {
            let localStorageGetSpy = spyOn(localStorageService, 'get');
            localStorageGetSpy.withArgs( 'blackOutPeriodsData').and.returnValue( blackOutPeriodsDataMock);
            localStorageGetSpy.withArgs('showAlertFlexibilization').and.returnValue(true);
            ibFlexibilizationInfoComponent.$onInit();
            $rootScope.$digest();
            expect(ibFlexibilizationInfoComponent.$onInit).toBeDefined();
            done();
        });

    });

    describe('should $onInit and differents cases', () => {

        it('and flexibilizationInfoDates.allowedPeriods > 1 and equal 1 and flexibilizationDate is different', (done) => {
            fakeflexibilizationInfoDates = {
                flexibilizationInfoDates: {
                    allowedPeriods: [{
                        dateFrom: '2025-10-10',
                        dateTo: '2025-12-12',
                    },
                    {
                        dateFrom: '2025-12-12',
                        dateTo: '2025-12-12',
                    }],
                    flexibilizationDate: {
                        dateFrom: '2025-10-10',
                        dateTo: '2025-12-12',
                    }
                }
            };
            ibFlexibilizationInfoComponent.flexibilizationInfoDates = fakeflexibilizationInfoDates.flexibilizationInfoDates;

            let responseFlexibilizationDate = {
                dateFrom : '10/10/2025',
                dateTo: '12/12/2025',
                text: 'test',
                type: '',
                message: ''
            };
            let responseAllowedDates = [
                {
                    dateFrom : '10/10/2025',
                    dateTo: '12/12/2025',
                    text: 'test',
                    type: '',
                    message: ''
                },
                {
                    dateFrom : '12/12/2025',
                    dateTo: '12/12/2025',
                    text: 'test',
                    type: '',
                    message: ''
                }
            ];

            ibFlexibilizationInfoComponent.$onInit();
            $rootScope.$digest();
            expect(ibFlexibilizationInfoComponent.flexibilizationDate).toEqual(responseFlexibilizationDate);
            expect(ibFlexibilizationInfoComponent.allowedDates).toEqual(responseAllowedDates);

            done();
        });

        it('and flexibilizationInfoDates.allowedPeriods > 1 and equal 2 and flexibilizationDate is different', (done) => {
            fakeflexibilizationInfoDates = {
                flexibilizationInfoDates: {
                    allowedPeriods: [{
                        dateFrom: '2025-10-10',
                        dateTo: '2025-10-10',
                    },
                    {
                        dateFrom: '2025-12-12',
                        dateTo: '2025-12-12',
                    }],
                    flexibilizationDate: {
                        dateFrom: '2025-10-10',
                        dateTo: '2025-12-12',
                    }
                }
            };
            ibFlexibilizationInfoComponent.flexibilizationInfoDates = fakeflexibilizationInfoDates.flexibilizationInfoDates;

            let responseFlexibilizationDate = {
                dateFrom : '10/10/2025',
                dateTo: '12/12/2025',
                text: 'test',
                type: '',
                message: ''
            };
            let responseAllowedDates = [
                {
                    dateFrom : '10/10/2025',
                    dateTo: '10/10/2025',
                    text: 'test',
                    type: '',
                    message: ''
                },
                {
                    dateFrom : '12/12/2025',
                    dateTo: '12/12/2025',
                    text: 'test',
                    type: '',
                    message: ''
                }
            ];

            ibFlexibilizationInfoComponent.$onInit();
            $rootScope.$digest();
            expect(ibFlexibilizationInfoComponent.flexibilizationDate).toEqual(responseFlexibilizationDate);
            expect(ibFlexibilizationInfoComponent.allowedDates).toEqual(responseAllowedDates);
            done();
        });

        it('and flexibilizationInfoDates.allowedPeriods > 1 and different and flexibilizationDate is different', (done) => {
            fakeflexibilizationInfoDates = {
                flexibilizationInfoDates: {
                    allowedPeriods: [{
                        dateFrom: '2025-10-10',
                        dateTo: '2025-11-11',
                    },
                    {
                        dateFrom: '2025-11-12',
                        dateTo: '2025-12-12',
                    }],
                    flexibilizationDate: {
                        dateFrom: '2025-10-10',
                        dateTo: '2025-12-12',
                    }
                }
            };
            ibFlexibilizationInfoComponent.flexibilizationInfoDates = fakeflexibilizationInfoDates.flexibilizationInfoDates;

            let responseFlexibilizationDate = {
                dateFrom : '10/10/2025',
                dateTo: '12/12/2025',
                text: 'test',
                type: '',
                message: ''
            };
            let responseAllowedDates = [
                {
                    dateFrom : '10/10/2025',
                    dateTo: '11/11/2025',
                    text: 'test',
                    type: '',
                    message: ''
                },
                {
                    dateFrom : '12/11/2025',
                    dateTo: '12/12/2025',
                    text: 'test',
                    type: '',
                    message: ''
                }
            ];

            ibFlexibilizationInfoComponent.$onInit();
            $rootScope.$digest();
            expect(ibFlexibilizationInfoComponent.flexibilizationDate).toEqual(responseFlexibilizationDate);
            expect(ibFlexibilizationInfoComponent.allowedDates).toEqual(responseAllowedDates);
            done();
        });

        it('and flexibilizationInfoDates.allowedPeriods === 1 and equal and flexibilizationDate is equal', (done) => {
            fakeflexibilizationInfoDates = {
                flexibilizationInfoDates: {
                    allowedPeriods: [{
                        dateFrom: '2025-12-12',
                        dateTo: '2025-12-12',
                    }],
                    flexibilizationDate: {
                        dateFrom: '2025-12-12',
                        dateTo: '2025-12-12',
                    }
                }
            };
            ibFlexibilizationInfoComponent.flexibilizationInfoDates = fakeflexibilizationInfoDates.flexibilizationInfoDates;

            let responseFlexibilizationDate = {
                dateFrom : '12/12/2025',
                dateTo: '12/12/2025',
                text: 'test',
                type: '',
                message: ''
            };
            let responseAllowedDates = [
                {
                    dateFrom : '12/12/2025',
                    dateTo: '12/12/2025',
                    text: 'test',
                    type: '',
                    message: ''
                }
            ];

            ibFlexibilizationInfoComponent.$onInit();
            $rootScope.$digest();
            expect(ibFlexibilizationInfoComponent.flexibilizationDate).toEqual(responseFlexibilizationDate);
            expect(ibFlexibilizationInfoComponent.allowedDates).toEqual(responseAllowedDates);
            done();
        });

        it('and flexibilizationInfoDates.allowedPeriods === 1 and different and flexibilizationDate is equal', (done) => {
            fakeflexibilizationInfoDates = {
                flexibilizationInfoDates: {
                    allowedPeriods: [{
                        dateFrom: '2025-10-10',
                        dateTo: '2025-12-12',
                    }],
                    flexibilizationDate: {
                        dateFrom: '2025-12-12',
                        dateTo: '2025-12-12',
                    }
                }
            };
            ibFlexibilizationInfoComponent.flexibilizationInfoDates = fakeflexibilizationInfoDates.flexibilizationInfoDates;

            let responseFlexibilizationDate = {
                dateFrom : '12/12/2025',
                dateTo: '12/12/2025',
                text: 'test',
                type: '',
                message: ''
            };
            let responseAllowedDates = [
                {
                    dateFrom : '10/10/2025',
                    dateTo: '12/12/2025',
                    text: 'test',
                    type: '',
                    message: ''
                }
            ];

            ibFlexibilizationInfoComponent.$onInit();
            $rootScope.$digest();
            expect(ibFlexibilizationInfoComponent.flexibilizationDate).toEqual(responseFlexibilizationDate);
            expect(ibFlexibilizationInfoComponent.allowedDates).toEqual(responseAllowedDates);
            done();
        });

        it('and flexibilizationInfoDates is null', (done) => {
            fakeflexibilizationInfoDates = {
                flexibilizationInfoDates: null
            };

            ibFlexibilizationInfoComponent.flexibilizationInfoDates = null;

            let response = {
                dateFrom : null,
                dateTo: null,
                text: 'test',
                type: '',
                message: ''
            }

            ibFlexibilizationInfoComponent.$onInit();
            $rootScope.$digest();
            expect(ibFlexibilizationInfoComponent.flexibilizationDate).toEqual(response);
            done();
        });
    });

    describe('Should changeState', () => {
        it('and changeState to be defined', (done) => {

            spyOn(localStorageService, 'set').withArgs('showAlertFlexibilization',false).and.returnValue(true);

            ibFlexibilizationInfoComponent.changeState();

            expect(ibFlexibilizationInfoComponent.changeState).toBeDefined();
            done();
        });

    });
});
