'use strict';
describe('test for CashRefundConfirmationTransformer', function() {

    var fakeCurrencyService ={
        'formatPrice': jasmine.createSpy(),
        'getCurrencyObject' : jasmine.createSpy(),
    };

    var CashRefundConfirmationTransformer, localStorageService, rootScope;

    var fakeCashCurrenciesList = [
        {
            "code":"EUR","description":"Euro","symbol":"€", "currencySymbol": "€", "alignment":"R","groupingSeparator":".","decimalSeparator":",","decimals":2,"recommendedDisplay":"symbol"
        },
        {
            "code":"DOLAR","description":"Dolar","symbol":"$", "currencySymbol": "$", "alignment":"R","groupingSeparator":".","decimalSeparator":",","decimals":2,"recommendedDisplay":"symbol"
        }
    ];

    var fakeCashEmailNotification = 'test@email.com';

    var fakeCashEmailNotificationValue = 'test1@email.com';

    beforeEach(function() {
        angular.mock.module('ib-Mmb-cash-refund-confirmation-module', 'LocalStorageModule', function($provide){
            $provide.value('CurrencyService', fakeCurrencyService);
        });

        inject(function(_CashRefundConfirmationTransformer_, _localStorageService_, _$rootScope_) {
            CashRefundConfirmationTransformer = _CashRefundConfirmationTransformer_;
            localStorageService = _localStorageService_;
            rootScope = _$rootScope_;
            localStorageService.set('cashCurrenciesList', fakeCashCurrenciesList);
        });
    });

    describe('when generateCashConfirmationData is called', function() {
        it('should return appropiate cashTotalPriceData object when matches currency from cashCurrenciesList', function(done) {
            CashRefundConfirmationTransformer.generateCashConfirmationData({ total: 100, currency: 'EUR'});
            done();
        });

        it('should return appropiate cashTotalPriceData object when not matches currency from cashCurrenciesList', function(done) {
            CashRefundConfirmationTransformer.generateCashConfirmationData({ total: 100, currency: 'dolar'});
            done();
        });
    });

    describe('when generateCashConfirmationRequest is called', function() {
        beforeEach(function() {
            inject(function(_localStorageService_) {
                localStorageService.set('cashEmailNotification', fakeCashEmailNotification);
            });
        });

        it('should return appropiate request object when cashEmailNotification exists in localStorage', function(done) {
            CashRefundConfirmationTransformer.generateCashConfirmationRequest('EB3');
            expect(CashRefundConfirmationTransformer.generateCashConfirmationRequest('EB3')).toEqual({ flowId: 'EB3', emailNotification: null });
            done();
        });
    });

    describe('when generateCashConfirmationRequest is called', function() {
        beforeEach(function() {
            inject(function(_localStorageService_) {
                localStorageService.set('cashEmailNotification', null);
                localStorageService.set('cashEmailNotificationValue', fakeCashEmailNotificationValue);
            });
        });

        it('should return appropiate request object when cashEmailNotification not exists in localStorage', function(done) {
            CashRefundConfirmationTransformer.generateCashConfirmationRequest('EB3');
            expect(CashRefundConfirmationTransformer.generateCashConfirmationRequest('EB3')).toEqual({ flowId: 'EB3', emailNotification: { email: fakeCashEmailNotificationValue }});
            done();
        });
    });
});
