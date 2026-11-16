describe('IbShuttleAviosAndMoneyController test', function () {

    var $controller, $rootScope, $scope, controller, localStorageService;

    var fakeBookingModalService = {
        'showGenericModal': jasmine.createSpy(),
        'openFareWindowModal': jasmine.createSpy(),
    }

    beforeEach(function () {
        angular.mock.module('ib-shuttle-avios-and-money-module', 'LocalStorageModule', 'ib-commons-utils-module', function ($provide) {
            $provide.value('CurrencyService', {
                'getCurrencyObject': function (fare) {
                    return fare;
                },
                'formatPrice': function (price) {
                    return price;
                }

            });
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('BookingAppConstants', { 'BOOKING_PARAMS_NAMES': { 'CHECK_AVIOS': true } });

        });
        inject(function (_$controller_, _$rootScope_, _localStorageService_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            controller = $controller('IbShuttleAviosAndMoneyController', { $scope: $scope, $rootScope: $rootScope, localStorageService: localStorageService });

        });
    });

    describe('when activate() is called', function () {

        it('if exist model should emit event of selected offer', function () {
            controller.model = {
                fareRate: [
                    {
                        'selected': true
                    }
                ]
            }
            spyOn($rootScope, '$broadcast');
            controller.$onInit();
            expect($rootScope.$broadcast).toHaveBeenCalled();
        });

        it('if exist model should emit event of selected offer', function () {
            controller.model = {}
            controller.$onInit();
        });

        it('Should call getCurrency', function () {
            var price = 1;
            localStorageService.set('fareData', {
                'contextMetadata': {
                    'language': 'es',
                    'country': 'ES',
                    'currencies': [
                        {
                            'code': 'EUR',
                            'description': 'Euro',
                            'symbol': '€',
                            'alignment': 'R',
                            'groupingSeparator': '.',
                            'decimalSeparator': ',',
                            'decimals': 2
                        }
                    ]

                }
            });
            controller.getCurrency(price);
            $rootScope.$digest();
            expect(localStorageService.get('fareData')).toBeDefined();
            expect(localStorageService.get('fareData')).not.toBeNull();
            expect(price).toBeGreaterThan(0);
            expect(controller.getCurrency(price)).toBeDefined();

        });

        it('should call selectOffer with offer', function (done) {
            var offer = {};
            controller.selectOffer(offer);
            expect(controller.offerSelected).toEqual(true);
            done();
        });

        it('should call selectOffer without offer', function (done) {
            var offer = null;
            controller.selectOffer(offer);
            expect(controller.offerSelected).toEqual(undefined);
            done();
        });
    });

    describe('when goToShuttleOpen() is called', function () {

        it('Should emit event change to obtention', function () {
            spyOn($rootScope, '$broadcast');
            controller.goToShuttleOpen();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('changeToObtention');
        });
    });

    describe('when showGenericModal() is called', function () {

        it('Should use showGenericModal from BookingModalService ', function () {
            inject(function () {
                fakeBookingModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(function () {
                    return { 'result': { 'then': function () { } } };
                });
            });
            controller.openModalLinks();
            $rootScope.$digest();
        });
    });

});
