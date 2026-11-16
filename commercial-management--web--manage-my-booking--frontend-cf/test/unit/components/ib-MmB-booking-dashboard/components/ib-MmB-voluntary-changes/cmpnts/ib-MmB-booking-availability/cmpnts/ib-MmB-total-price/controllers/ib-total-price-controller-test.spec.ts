describe('ibMmbTotalPrice test', function () {

    var $componentController, $rootScope, $scope, controller;

    var fakeCurrencyService = {
        'formatPrice': function(currency, price){
            return price;
        },
        'getCurrencyObject': jasmine.createSpy('getCurrencyObject').and.callFake(angular.noop)
    }

    var fake$sce = {
        'trustAsHtml' : jasmine.createSpy('trustAsHtml').and.callFake(function(){
            return 'test';
        })
    }

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
    });

    var fakeMmBModalService = {
        'showWaitingModal': jasmine.createSpy()
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-total-price-module', function($provide) {
            $provide.value('$filter',$fakeFilter);
            $provide.value('$sce',fake$sce);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('MmBModalService', fakeMmBModalService);
        });
        inject(function (_$componentController_, _$rootScope_) {
            $componentController = _$componentController_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $componentController('ibMmbTotalPrice', { $scope: $scope, $rootScope: $rootScope });
        });
        controller.model = {};
        controller.model.relatedContent = [{'value':'test'}];
        controller.model.contextMetadata = {};
        controller.model.contextMetadata.currencies = [{
            code: 'EUR',
            description: 'Euro',
            symbol: '€',
            alignment: 'L',
            groupingSeparator: '.',
            decimalSeparator: ',',
            decimals: 2,
            recommendedDisplay: 'symbol'
        }];
        controller.model.totalPrice = 10;
        $rootScope.$digest();
    });

    describe('when activate() is called, if there are conditions model.', function () {
        it('conditions should be defined' , function() {
            controller.$onInit();
            expect(controller.conditions).toEqual('test');
        });
    });

    describe('when activate() is called, if there arent conditions model.', function () {
        it('conditions should be defined' , function() {
            controller.model = {};
            controller.model.relatedContent = false;
            controller.$onInit();
            expect(controller.conditions).toEqual(null);
        });
    });

    describe('when total price is defined', function () {
        it('and its positive, show to pay label' , function() {

            controller.model.totalPrice = 10;
            controller.$onInit();
            expect(controller.price).toEqual(10);
            expect(controller.label).toEqual('MMB_VC_LABEL_TOTAL_PRICE_TO_PAY');
            expect(controller.labelButton).toEqual('MMB_VC_MODAL_CONTINUE');
        });

        it('and its negative, show refund label' , function() {

            controller.model.totalPrice = -10;
            controller.$onInit();
            expect(controller.price).toEqual(10);
            expect(controller.label).toEqual('MMB_VC_LABEL_TOTAL_PRICE_REPAY_WITH_VOUCHER');
            expect(controller.labelButton).toEqual('MMB_VC_MODAL_CONTINUE');
        });

        it('and its zero, show to pay label' , function() {

            controller.model.totalPrice = 0;
            controller.$onInit();
            expect(controller.price).toEqual(0);
            expect(controller.label).toEqual('MMB_VC_LABEL_TOTAL_PRICE_TO_PAY');
            expect(controller.labelButton).toEqual('MMB_VC_MODAL_CONTINUE');
        });
    });

    xdescribe('when a event changeOnTotalPrice is called', function(){
        it('update label an total price with new value' , function() {

            controller.$onInit();
            controller.model.totalPrice = 5;
            expect(controller.price).toEqual(5);
            expect(controller.label).toEqual('MMB_VC_LABEL_TOTAL_PRICE_TO_PAY');
            expect(controller.labelButton).toEqual('MMB_VC_MODAL_CONTINUE');
            controller.model.totalPrice = -5;
            $rootScope.$broadcast('changeOnTotalPrice', true);
            expect(controller.price).toEqual(5);
            expect(controller.label).toEqual('MMB_VC_LABEL_TOTAL_PRICE_REPAY_WITH_VOUCHER');
            expect(controller.labelButton).toEqual('MMB_VC_MODAL_CONTINUE');
            controller.model.totalPrice = 10;
            $rootScope.$broadcast('changeOnTotalPrice', true);
            expect(controller.price).toEqual(10);
            expect(controller.label).toEqual('MMB_VC_LABEL_TOTAL_PRICE_TO_PAY');
            expect(controller.labelButton).toEqual('MMB_VC_MODAL_CONTINUE');
        });
    })

    describe('when accept() is called', function () {
        it('should call onAccept with correct values' , function() {
            controller.onAccept = function(){};
            spyOn(controller, 'onAccept');
            controller.accept();
            expect(controller.onAccept).toHaveBeenCalledWith({ message: 'Accept' })
        });
    });

});
