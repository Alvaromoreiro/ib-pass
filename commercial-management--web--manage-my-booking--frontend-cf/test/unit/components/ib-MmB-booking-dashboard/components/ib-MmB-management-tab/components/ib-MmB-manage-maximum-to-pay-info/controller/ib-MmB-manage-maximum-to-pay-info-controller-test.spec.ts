describe('MmBManageMaximumToPayInfoController test', function () {
    var controller, $scope, localStorageService, $rootScope, $timeout;

    var $filterFake = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function () {
            return ('');
        };
        switch (filter) {
            case 'translate':
                filterFunc = function () {
                    return 'Translated Text';
                };
                break;
            case 'LinksFilter':
                filterFunc = function () {
                    return 'Linked Text';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });
    var fakeMmBModalService = {
        'showGenericModal': jasmine.createSpy(),
        'showGenericError': jasmine.createSpy(),
        'finishWaiting': jasmine.createSpy(),
        'showWaitingModal': jasmine.createSpy()
    }
    var fakeExternalAncillariesService = {
        'getExternalAncillaryUrl': jasmine.createSpy()
    }
    var fakeMmBUtilsSharedService = {
        'generateRedirectionForm': jasmine.createSpy(),
        'generateRedirectionFormCancel': jasmine.createSpy()
            .and.returnValue('<form id="submit_hidden_form"></form>')
    }
    var fakeModel = [{
        'pendingAmount': 20
    }];

    var fakeFlowID = 'TWFuYWdlTXlCb29raW5nQElCOTJlNmJjZTQ4MTViNDFiM2IxODI0MzJjZjE2OTZiOWM%3D';

    var fakeRequestData = {
        type: 'PAYMENT',
        payingPerson: 0,
        holderTraveling: ''
    };

    var mockResponse = { data: 'promise' };

    beforeEach(function () {
        angular.mock.module('ib-MmB-manage-maximum-to-pay-info-module', 'LocalStorageModule', function ($provide) {
            $provide.value('$filter', $filterFake);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('ExternalAncillariesService', fakeExternalAncillariesService);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
        });
        inject(function (_$rootScope_, _localStorageService_, $filter, $controller, _$timeout_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            $filter = $filter;
            $timeout = _$timeout_;
            localStorageService.set('yourPurchase', { pendingAmount: 100 });
            localStorageService.set('paymentpassengerIdIBV', 0);
            localStorageService.set('PNR', 'TEST_PNR'); 
            localStorageService.set('flowId', fakeFlowID);
            $rootScope.appMarket = 'ES';
            $rootScope.appLang = 'ES';
            controller = $controller('MmBManageMaximumToPayInfoController', {
                $scope: $scope,
                $rootScope: $rootScope,
                $filter: $filter,
                localStorageService: _localStorageService_
            });
            controller.model = fakeModel;
        });

    });

    describe('when the component is created', function () {
        it('Should set popoverHolidays correctly', function () {
            expect(controller.popoverHolidays[1].path).toEqual(null);
        });
    });

    describe('when activate is called', function () {
        it('Should purchase is defined', function () {
            controller.$onInit();
            expect(controller.model[0].pendingAmount).toEqual(100);
        });
    });
    describe('when pendingPaymentIBV is called', function () {
        beforeEach(inject(function ($q) {
            fakeExternalAncillariesService.getExternalAncillaryUrl = jasmine.createSpy('getExternalAncillaryUrl').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));
        it('Should process payment successfully when payingPerson is 0', function (done) {
            controller.pendingPaymentIBV();
            $rootScope.$digest();
            
            setTimeout(function() {
                expect(fakeMmBUtilsSharedService.generateRedirectionFormCancel).toHaveBeenCalledWith(mockResponse);
                done();
            }, 0);
        });
    });

    describe('when pendingPaymentIBV is called with error', function () {
        beforeEach(inject(function ($q) {
            fakeExternalAncillariesService.getExternalAncillaryUrl = jasmine.createSpy('getExternalAncillaryUrl').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(null);
                return deferred.promise;
            });
            fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(function () {
                return {
                    result: {then: angular.noop}
                };
            });
            localStorageService.set('paymentpassengerIdIBV', 99);
        }));
        
        it('Should handle error correctly', function () {
            controller.pendingPaymentIBV();
            $rootScope.$digest();
            
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            expect(fakeMmBModalService.showGenericError).toHaveBeenCalledWith(null);
        });

        it('Should call localStorageService.get with paymentpassengerIdIBV', function () {
            const localStorageGet = spyOn(localStorageService,'get').and.callThrough();
            controller.pendingPaymentIBV();
            expect(localStorageGet).toHaveBeenCalledWith('paymentpassengerIdIBV');
        });
    });

    describe('when payingPerson is null', function () {
        beforeEach(function () {
            localStorageService.set('paymentpassengerIdIBV', null);
        });
        
        it('Should emit IBVPayerNotSelected event', function () {
            spyOn($rootScope, '$emit');
            controller.pendingPaymentIBV();
            expect($rootScope.$emit).toHaveBeenCalledWith('IBVPayerNotSelected');
        });
    });
});