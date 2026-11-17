describe('CheckinBiometricErrorFilter Test', function() {

    var BiometricErrorFilter;


    var fakeBiometricHandlerProvider = {
        userDataInconsistencyHandler: jasmine.createSpy('userDataInconsistencyHandler').and.callFake(angular.noop),
        invalidDateFormatHandler: jasmine.createSpy('invalidDateFormatHandler').and.callFake(angular.noop),
        orderNotFoundHandler: jasmine.createSpy('orderNotFoundHandler').and.callFake(angular.noop),
        flightNotFoundHandler: jasmine.createSpy('flightNotFoundHandler').and.callFake(angular.noop),
        documentNotFoundHandler: jasmine.createSpy('documentNotFoundHandler').and.callFake(angular.noop),
        biometricGenericModalHandler: jasmine.createSpy('biometricGenericModalHandler').and.callFake(angular.noop),
        infoAssociatedNotFoundPnrHandler: jasmine.createSpy('infoAssociatedNotFoundPnrHandler').and.callFake(angular.noop),
        expirationDateErrorHandler: jasmine.createSpy('expirationDateErrorHandler').and.callFake(angular.noop),
        passengerDataIdConflictHandler: jasmine.createSpy('passengerDataIdConflictHandler').and.callFake(angular.noop),
        defaultErrorHandler: jasmine.createSpy('defaultErrorHandler').and.callFake(angular.noop)
    };

    var mocksErrors = [
        '400CUST_BIO_9001',
        '400CUST_BIO_0002',
        '400CUST_BIO_0004',
        '400CUST_BIO_0005',
        '404CUST_BIO_0011',
        '404BIO_AENA_0001',
        '409CUST_BIO_9001',
        '412CUST_BIO_0003',
        '412CUST_BIO_0001'
    ];

    describe('Management error Handler', function(){
        var mockFunction = jasmine.createSpy('handle').and.callFake(function(){
            angular.noop
        });
        beforeEach(function(){
            angular.mock.module('ib-checkin-biometric-boarding-module', function($provide){
                $provide.value('BiometricsHandlerProvider', fakeBiometricHandlerProvider);
            });

            inject(function(_BiometricErrorFilter_){
                BiometricErrorFilter = _BiometricErrorFilter_;
                fakeBiometricHandlerProvider.defaultErrorHandler = jasmine.createSpy('defaultErrorHandler').and.callFake(angular.noop);
                BiometricErrorFilter.errorHandler = {'400CUST_BIO_9001' : {'apply' : mockFunction}};
            });
        });
        it('handler with error param', function (done) {
            var errorMock = {'errorCode':'400','internalErrorCode':'CUST_BIO_9001'};
            BiometricErrorFilter.errorHandlerManagement(errorMock);
            expect(mockFunction).toHaveBeenCalledWith(errorMock);
            done();
        });

        it('handler without valid error param', function (done) {
            BiometricErrorFilter.errorHandlerManagement({'errorCode':'999','internalErrorCode':'CUST_BIO_0000'});
            expect(fakeBiometricHandlerProvider.defaultErrorHandler).toHaveBeenCalled();
            done();
        });
    });

    describe('Create error Handler', function(){
        beforeEach(function(){
            angular.mock.module('ib-checkin-biometric-boarding-module', function($provide){
                $provide.value('BiometricsHandlerProvider', fakeBiometricHandlerProvider);
            });
    
            inject(function(_BiometricErrorFilter_){
                BiometricErrorFilter = _BiometricErrorFilter_;
            });
    
        });
        it('return functions', function (done) {

            expect(BiometricErrorFilter.errorHandler[mocksErrors[0]].apply).toEqual(jasmine.any(Function));
            expect(BiometricErrorFilter.errorHandler[mocksErrors[1]].apply).toEqual(jasmine.any(Function));
            expect(BiometricErrorFilter.errorHandler[mocksErrors[2]].apply).toEqual(jasmine.any(Function));
            expect(BiometricErrorFilter.errorHandler[mocksErrors[3]].apply).toEqual(jasmine.any(Function));
            expect(BiometricErrorFilter.errorHandler[mocksErrors[4]].apply).toEqual(jasmine.any(Function));
            expect(BiometricErrorFilter.errorHandler[mocksErrors[5]].apply).toEqual(jasmine.any(Function));
            expect(BiometricErrorFilter.errorHandler[mocksErrors[6]].apply).toEqual(jasmine.any(Function));
            expect(BiometricErrorFilter.errorHandler[mocksErrors[7]].apply).toEqual(jasmine.any(Function));
            expect(BiometricErrorFilter.errorHandler[mocksErrors[8]].apply).toEqual(jasmine.any(Function));

            done();
        });

    });

});