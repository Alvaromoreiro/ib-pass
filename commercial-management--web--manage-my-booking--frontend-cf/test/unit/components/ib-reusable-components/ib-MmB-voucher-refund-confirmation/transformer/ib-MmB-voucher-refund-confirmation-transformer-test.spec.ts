describe('VoucherRefundConfirmationTransformer Test', function () {
    var VoucherRefundConfirmationTransformer,localStorageService, $q, $rootScope, $scope;

    var fakeVoucherCurrenciesList = [
        {
            "code":"EUR","description":"Euro","symbol":"€","alignment":"R","groupingSeparator":".","decimalSeparator":",","decimals":2,"recommendedDisplay":"symbol"
        },{
            "code":"EUR","description":"Euro","symbol":"€","alignment":"R","groupingSeparator":".","decimalSeparator":",","decimals":2,"recommendedDisplay":"symbol"
        }
    ];

    var fakeMmBAppConstants = { };

    var fakeCurrencyService = {
        'formatPrice' : jasmine.createSpy('formatPrice'),
        'getCurrencyObject' : jasmine.createSpy('getCurrencyObject')
    };

    var fakeVoucherInfo = {
        'vouchers' : [
            {
                'voucherCode' : 'prueba',
                'price': {
                    'fare' : '3000',
                    'totalRefund' : '2000'
                },
                'passenger' : {
                    'firstName' : 'pepe',
                    'firstSurname' : 'perez',
                    'externalPersonalInfo' : { }
                }
            },
            {
                'voucherCode' : 'prueba',
                'price': {
                    'fare' : '3000',
                    'totalRefund' : '2000'
                },
                'passenger' : {
                    'firstName' : 'pepe',
                    'firstSurname' : 'perez',
                    'externalPersonalInfo' : { }
                }
            }
        ]
    };

    var fakeVoucherPriceInfo = {
        'totalRefund' : '10',
        'fare' : '3000',
        'extraVoucherAmount' : '1000',
        'extraVoucherPercent' : '10',
        'currency': 'EUR'
    };

    var fakePrice = {
        'total' : '1000'
    };

    var fakeFlowId = 'TWFuYWdlTXlCb29raW5nQElCYjkyOWYwYTBmZGFjNGNkOWE4ODczMzdlY2YzZTc2MWY%3D';
    var fakeVoucherEmailNotification = true;
    var fakeData = '';
    var fakeVoucherEmailNotificationValue = 'email@prueba.com'

    beforeEach(function () {
        angular.mock.module('ib-MmB-booking-dashboard-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CurrencyService', fakeCurrencyService);
        });
        inject(function (_$rootScope_,_VoucherRefundConfirmationTransformer_,_localStorageService_,_$q_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            $q = _$q_;
            VoucherRefundConfirmationTransformer = _VoucherRefundConfirmationTransformer_;
        });
        $rootScope.$digest();
    });

    describe('When init', function() {
        it('VoucherRefundConfirmationTransformer should be defined', function () {
            expect(VoucherRefundConfirmationTransformer).toBeDefined();
        });
    });

    describe('When generateVoucherData is called', function() {
        beforeEach(inject(function (_localStorageService_) {
            localStorageService.set('voucherCurrenciesList', fakeVoucherCurrenciesList);
            fakeCurrencyService.formatPrice = jasmine.createSpy('formatPrice').and.callFake(function(){
                var deferred = $q.defer();
                deferred.resolve('50€');
                return deferred.promise;
            })
        }));
        it('VoucherRefundConfirmationTransformer should be defined', function () {
            VoucherRefundConfirmationTransformer.generateVoucherData(fakeVoucherInfo, fakeVoucherPriceInfo, fakePrice);
            expect(VoucherRefundConfirmationTransformer).toBeDefined();
            expect(fakeCurrencyService.formatPrice).toHaveBeenCalled();
        });
    });

    describe('When generateVoucherData is called', function() {
        beforeEach(inject(function (_localStorageService_) {
            localStorageService.set('voucherCurrenciesList', fakeVoucherCurrenciesList);
            fakeCurrencyService.formatPrice = jasmine.createSpy('formatPrice').and.callFake(function(){
                var deferred = $q.defer();
                deferred.resolve('50€');
                return deferred.promise;
            })
            fakeVoucherInfo.vouchers[0].passenger.externalPersonalInfo = {
                'name' : 'pepe',
                'firstSurname' : 'perez',
                'lastSurname' : 'moreno'
            }
            fakeVoucherInfo.vouchers[1].passenger.externalPersonalInfo = {
                'name' : 'pepe',
                'firstSurname' : 'perez',
                'lastSurname' : 'moreno'
            }
        }));
        it('and passenger.externalPersonalInfo exist', function () {
            VoucherRefundConfirmationTransformer.generateVoucherData(fakeVoucherInfo, fakeVoucherPriceInfo, fakePrice);
            expect(VoucherRefundConfirmationTransformer).toBeDefined();
            expect(fakeCurrencyService.formatPrice).toHaveBeenCalled();
        });
    });

    describe('When generateConfirmationRefundRequest is called', function() {
        beforeEach(inject(function (_localStorageService_) {
            localStorageService.set('flowId', fakeFlowId);
            localStorageService.set('voucherEmailNotificationValue', fakeVoucherEmailNotificationValue);
            fakeData = 'ONE';
        }));
        it('and voucherEmailNotification exist', function () {
            VoucherRefundConfirmationTransformer.generateConfirmationRefundRequest(fakeData);
            expect(VoucherRefundConfirmationTransformer).toBeDefined();

        });
    });

    describe('When generateConfirmationRefundRequest is called', function() {
        beforeEach(inject(function (_localStorageService_) {
            localStorageService.set('flowId', fakeFlowId);
            localStorageService.set('voucherEmailNotification', fakeVoucherEmailNotification);
            localStorageService.set('voucherEmailNotificationValue', fakeVoucherEmailNotificationValue);
            fakeData = 'ONE';
        }));
        it('and voucherEmailNotification not exist', function () {
            VoucherRefundConfirmationTransformer.generateConfirmationRefundRequest(fakeData);
            expect(VoucherRefundConfirmationTransformer).toBeDefined();

        });
    });
});
