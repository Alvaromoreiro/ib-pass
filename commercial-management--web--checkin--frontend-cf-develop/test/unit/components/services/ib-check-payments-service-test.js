describe('CheckPaymentsService', function () {
    var service;
    var rootScope;
    var q;
    var location;
    var conditionsService;
    var localStorageService;
    var modalService;

    beforeEach(function () {
        conditionsService = {
            getPaymentConditions: jasmine.createSpy('getPaymentConditions')
        };
        localStorageService = {
            get: jasmine.createSpy('get').and.returnValue('flow-1'),
            set: jasmine.createSpy('set')
        };
        modalService = {
            isNotWaiting: jasmine.createSpy('isNotWaiting'),
            showGenericError: jasmine.createSpy('showGenericError')
        };

        angular.mock.module('ib-checkin-services-module', function ($provide) {
            $provide.value('IbCConditionsService', conditionsService);
            $provide.value('localStorageService', localStorageService);
            $provide.value('ModalService', modalService);
        });

        inject(function (_CheckPaymentsService_, _$rootScope_, _$q_, _$location_) {
            service = _CheckPaymentsService_;
            rootScope = _$rootScope_;
            q = _$q_;
            location = _$location_;
        });
    });

    it('stores payment conditions and navigates to purchase when the request resolves', function () {
        var paymentsInfo = { paymentMethods: ['card'] };
        conditionsService.getPaymentConditions.and.returnValue(q.when(paymentsInfo));

        service.checkPayments();
        rootScope.$digest();

        expect(localStorageService.get).toHaveBeenCalledWith('flowId');
        expect(conditionsService.getPaymentConditions).toHaveBeenCalledWith('flow-1');
        expect(localStorageService.set).toHaveBeenCalledWith('paymentsInfo', paymentsInfo);
        expect(location.path()).toBe('/ibpurc');
        expect(modalService.isNotWaiting).toHaveBeenCalled();
    });

    it('shows the generic error and navigates to booking when the request rejects', function () {
        var error = { message: 'Payment conditions unavailable' };
        conditionsService.getPaymentConditions.and.returnValue(q.reject(error));
        modalService.showGenericError.and.returnValue({ result: q.when() });

        service.checkPayments();
        rootScope.$digest();

        expect(modalService.showGenericError).toHaveBeenCalledWith(error, true);
        expect(location.path()).toBe('/ibcose');
    });
});