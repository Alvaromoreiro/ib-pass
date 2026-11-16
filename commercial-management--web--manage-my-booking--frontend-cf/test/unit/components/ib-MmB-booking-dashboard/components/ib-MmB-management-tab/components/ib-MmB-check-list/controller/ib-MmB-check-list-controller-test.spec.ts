describe('MmBCheckListController test', function () {
    var controller, $scope, $rootScope;

    beforeEach(function () {
        angular.mock.module('ib-MmB-check-list-module', function () { });
        inject(function (_$rootScope_, $controller) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();

            controller = $controller('MmBCheckListController', {
                $scope: $scope
            });
        });
    });

    describe('init component', function () {
        it('its create correctly without seat', inject(function ($timeout) {
            controller.$onInit();
            controller.progressList = 0;
            controller.document = false;
            controller.model = {
                seat: [],
                baggage: [],
                insurance: []
            }
            $timeout.flush();
            controller.openLink();
            expect(controller.$onInit).toBeDefined();
        }));
        it('its create correctly with seat and bagage', inject(function ($timeout) {
            controller.$onInit();
            controller.progressList = 0;
            controller.document = false;
            controller.model = {
                seat: [{
                    "type": "seat",
                    "orderItemId": "IBdb2faeb5ba6a4543bbbf2947a64585bf_02",
                    "passengerId": "ADULT_01",
                    "row": "40",
                    "column": "A",
                    "segmentId": "IB576620190507",
                    "emd": "PENDING_PAYMENT",
                    "price": {
                        "fare": 51,
                        "tax": 99.87,
                        "total": 150.87,
                        "currency": "EUR",
                        "ticketingFee": 0
                    }
                }],
                baggage: [{
                    "type": "baggage",
                    "emd": "PENDING_PAYMENT",
                    "currency": "EUR",
                    "fare": "",
                    "tax": "",
                    "ticketingFee": "",
                    "total": "",
                    "preFormatedTotal": 150.87,
                    "baseTotal": 150.87,
                    "units": 1,
                    "departureCity": "Atenas",
                    "departureCityCode": "ATH",
                    "arrivalCity": "Bilbao",
                    "arrivalCityCode": "BIO",
                    "symbol": "€"
                }],
                insurance: []
            }
            $timeout.flush();
            controller.openLink();
            expect(controller.$onInit).toBeDefined();
        }));

        it('should be check if openlink exists', function () {
            expect(controller.openLink).toBeDefined();
        });
    });
});