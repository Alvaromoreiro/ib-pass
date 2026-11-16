describe('IbShuttleController test', function () {

    var $controller, $rootScope, $scope, controller, localStorageService;
    var FakeShuttleFareService = {
        'getShuttleFare': jasmine.createSpy()
    };

    var fareShuttleData = {
        passengerInfo: '',
        slices: '',
        priceInfo: '',
        fareFamilyConditions: ''
    }

    beforeEach(function () {
        angular.mock.module('ib-shuttle-module', 'LocalStorageModule', function ($provide) {

            $provide.value('IbShuttleService', {
                getInitUrlParams: function () {
                    return {};
                }
            });

            $provide.value('ShuttleFareService', FakeShuttleFareService);

            $provide.value('IbFareShuttleTransformer', {
                transform: function(data){}
            });
            $provide.value('BookingModalService', {
                showWaitingModal: function (template, className, close) {

                },
                finishWaiting: function(){
                    
                }
            });

        });

        inject(function (_$controller_, _$rootScope_, _localStorageService_, $q) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;

            FakeShuttleFareService.getShuttleFare = jasmine.createSpy('getShuttleFare').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject({
                    data: {},
                    fareShuttleResponse: fareShuttleData
                });

                return deferred.promise;
            });

            controller = $controller('IbShuttleController', { $scope: $scope, $rootScope: $rootScope });
            
        });
        $rootScope.$digest();
    });

    describe('when activate() is called', function () {

        it('Should have activate method', function () {
            controller.fareShuttleRequest = fareShuttleData;

        });

    });

});