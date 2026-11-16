describe('ChangleFlightsService test', function () {
    var ChangleFlightsService, rootScope, $q;

    var fakeDisruptionPeriodsService = {
        'getDisruptionPeriods': jasmine.createSpy()
    };

    var fakeChangeFlightsTransformer = {
        'transformBlackOutPeriods': jasmine.createSpy()
    };

    var response = {
        blackoutPeriods:[],
        allowedPeriods:[
            {
                dateTo:'12-06-1994'
            }
        ]
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-change-flights-service', function ($provide) {
            $provide.value('DisruptionPeriodsService', fakeDisruptionPeriodsService);
            $provide.value('ChangeFlightsTransformer', fakeChangeFlightsTransformer);
        });
        inject(function (_ChangleFlightsService_,  $rootScope, _$q_) {
            ChangleFlightsService = _ChangleFlightsService_;
            rootScope = $rootScope;
            $q=_$q_;
            fakeChangeFlightsTransformer.transformBlackOutPeriods = jasmine.createSpy('transformBlackOutPeriods').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(response);
                return deferred.promise;
            });
        });
    });

    describe('when ChangleFlightsService() is called', function () {
        it('And getDisruptionPeriods resolve', function () {
            inject(function ($q) {
                fakeDisruptionPeriodsService.getDisruptionPeriods = jasmine.createSpy('getDisruptionPeriods').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
            });
            ChangleFlightsService.getDisruptionPeriods().then(function (data) {
                expect(data).toEqual(response);
            });
            rootScope.$digest();
        });

        it('And getDisruptionPeriods reject', function () {
            inject(function ($q) {
                fakeDisruptionPeriodsService.getDisruptionPeriods = jasmine.createSpy('getDisruptionPeriods').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.reject();
                    return deferred.promise;
                });
            });
            ChangleFlightsService.getDisruptionPeriods().then(function (data) {
                expect(data).toEqual(response);
            });
            rootScope.$digest();
        });
    });
});
