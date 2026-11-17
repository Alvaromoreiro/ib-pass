describe('BiometricsHandlerProvider Test', function (){
    var BiometricsHandlerProvider, fakeModalService;
    
    var fakeModalService = {
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(function () {
            return { 'result': { 'then': angular.noop } };
        }),
        showConfigurableModal:  jasmine.createSpy('showConfigurableModal').and.callFake(function () {
            return { 'result': { 'then': angular.noop } };
        })
    };
    var fakeRedirectionService = {
        'newNavigation': jasmine.createSpy('newNavigationSpy')
    }

    beforeEach(function(){
        angular.mock.module('ib-checkin-biometric-boarding-module', 'LocalStorageModule', function($provide){
            $provide.value('ModalService', fakeModalService);
            $provide.value('RedirectionService', fakeRedirectionService);

        });
        
        inject(function(_BiometricsHandlerProvider_){
            BiometricsHandlerProvider = _BiometricsHandlerProvider_;
        });
    });


    describe('defaultErrorHandler() is called with the error information object', function (){    
        it('should get the code on error object and call ModalService', function (done){
            var mockError = {
                'code': '400CUST_BIO_9001',
                'reason': 'The boarding card\'s format is not correct.',
                'uuid': null,
                'timeStamp': '2019-09-12 11:24'
            };
            var mockErrorInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'REST_SERVICE_ERROR_GENERAL',
                'needsTranslate': true,
                'internalErrorCode': '400CUST_BIO_9001',
                'confirmation':true
            };
            
            BiometricsHandlerProvider.defaultErrorHandler(mockError);

            expect(mockErrorInfo.internalErrorCode).toEqual('400CUST_BIO_9001');
            
            expect(fakeModalService.showGenericModal).toHaveBeenCalledWith(mockErrorInfo, false);

            done();
        });
    });

    describe('expirationDateErrorHandler() is called with the error information object', function (){    
        it('should get the code on error object and call ModalService', function (done){
            var mockError = {
                'code': '412CUST_BIO_0003',
                'reason': 'The boarding card\'s format is not correct.',
                'uuid': null,
                'timeStamp': '2019-09-12 11:24'
            };
            var mockErrorInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_ID_DOCUMENT_EXPIRATION',
                'needsTranslate': true,
                'internalErrorCode': '412CUST_BIO_0003'
            };
            
            BiometricsHandlerProvider.expirationDateErrorHandler(mockError);
            expect(mockErrorInfo.internalErrorCode).toEqual('412CUST_BIO_0003');
            expect(fakeModalService.showGenericModal).toHaveBeenCalledWith(mockErrorInfo, false);
            done();
        });
    });

    describe('userDataInconsistencyHandler() is called with the error information object', function (){    
        it('should get the code on error object and call ModalService', function (done){
            var mockError = {
                'code': '400CUST_BIO_9001',
                'reason': 'The boarding card\'s format is not correct.',
                'uuid': null,
                'timeStamp': '2019-09-12 11:24'
            };
            var mockErrorInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_BOARDING_CARD_FORMAT_NOT_CORRECT',
                'needsTranslate': true,
                'internalErrorCode': '400CUST_BIO_9001'
            };
            BiometricsHandlerProvider.userDataInconsistencyHandler(mockError);
            expect(mockErrorInfo.internalErrorCode).toEqual('400CUST_BIO_9001');
            expect(fakeModalService.showGenericModal).toHaveBeenCalledWith(mockErrorInfo, true);
            done();
        });
    });

    describe('infoAssociatedNotFoundPnrHandler() is called with the error information object', function (){    
        it('should get the code on error object and call ModalService', function (done){
            var mockError = {
                'code': '409CUST_BIO_9001',
                'reason': 'The boarding card\'s format is not correct.',
                'uuid': null,
                'timeStamp': '2019-09-12 11:24'
            };
            var mockErrorInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_ASSOCIATED_INFO_PNR_NOT_FOUND',
                'needsTranslate': true,
                'internalErrorCode': '409CUST_BIO_9001',
                'confirmation': true
            };
            BiometricsHandlerProvider.infoAssociatedNotFoundPnrHandler(mockError);
            expect(mockErrorInfo.internalErrorCode).toEqual('409CUST_BIO_9001');
            expect(fakeModalService.showGenericModal).toHaveBeenCalledWith(mockErrorInfo, false);
            done();
        });
    });

    describe('orderNotFoundHandler() is called with the error information object', function (){    
        it('should get the code on error object and call ModalService', function (done){
            var mockError = {
                'code': '400CUST_BIO_0004',
                'reason': 'The boarding card\'s format is not correct.',
                'uuid': null,
                'timeStamp': '2019-09-12 11:24'
            };
            var mockErrorInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_BOARDING_CARD_INVALID_INCONSISTENCE',
                'needsTranslate': true,
                'internalErrorCode': '400CUST_BIO_0004',
                'confirmation':true
            };
            BiometricsHandlerProvider.orderNotFoundHandler(mockError);
            expect(mockErrorInfo.internalErrorCode).toEqual('400CUST_BIO_0004');
            expect(fakeModalService.showGenericModal).toHaveBeenCalledWith(mockErrorInfo, true);
            done();
        });
    });

    describe('flightNotFoundHandler() is called with the error information object', function (){    
        it('should get the code on error object and call ModalService', function (done){
            var mockError = {
                'code': '400CUST_BIO_0005',
                'reason': 'The boarding card\'s format is not correct.',
                'uuid': null,
                'timeStamp': '2019-09-12 11:24'
            };
            var mockErrorInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_FLIGHT_NOT_FOUND',
                'needsTranslate': true,
                'internalErrorCode': '400CUST_BIO_0005',
                'confirmation':true
            };
            BiometricsHandlerProvider.flightNotFoundHandler(mockError);
            expect(mockErrorInfo.internalErrorCode).toEqual('400CUST_BIO_0005');
            expect(fakeModalService.showGenericModal).toHaveBeenCalledWith(mockErrorInfo, true);
            done();
        });
    });

    describe('passengerDataIdConflictHandler() is called with the error information object', function (){    
        it('should get the code on error object and call ModalService', function (done){
            var mockError = {
                'code': '412CUST_BIO_0001',
                'reason': 'The boarding card\'s format is not correct.',
                'uuid': null,
                'timeStamp': '2019-09-12 11:24'
            };
            var mockErrorInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_PASSENGER_INFO_DOESNT_MATCH',
                'needsTranslate': true,
                'internalErrorCode': '412CUST_BIO_0001',
                'biometricDocumentError': true,
            };
            BiometricsHandlerProvider.passengerDataIdConflictHandler(mockError);
            expect(mockErrorInfo.internalErrorCode).toEqual('412CUST_BIO_0001');
            expect(fakeModalService.showGenericModal).toHaveBeenCalledWith(mockErrorInfo, true);
            done();
        });
    });

    describe('documentNotFoundHandler() is called with the error information object', function (){    
        it('should get the code on error object and call ModalService', function (done){
            var mockError = {
                'code': '404CUST_BIO_0011',
                'reason': 'The boarding card\'s format is not correct.',
                'uuid': null,
                'timeStamp': '2019-09-12 11:24'
            };
            var mockErrorInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_REQUEST_DOCUMENT_NOT_FOUND',
                'needsTranslate': true,
                'internalErrorCode': '404CUST_BIO_0011',
                'biometricDocumentError': true,
            };
            BiometricsHandlerProvider.documentNotFoundHandler(mockError);
            expect(mockErrorInfo.internalErrorCode).toEqual('404CUST_BIO_0011');
            expect(fakeModalService.showGenericModal).toHaveBeenCalledWith(mockErrorInfo, true);
            done();
        });
    });

    describe('invalidDateFormatHandler() is called with the error information object', function (){    
        it('should get the code on error object and call ModalService', function (done){
            var mockError = {
                'code': '400CUST_BIO_0002',
                'reason': 'The boarding card\'s format is not correct.',
                'uuid': null,
                'timeStamp': '2019-09-12 11:24'
            };
            var mockErrorInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_INVALID_DATE_FORMAT',
                'needsTranslate': true,
                'internalErrorCode': '400CUST_BIO_0002',
                'biometricDocumentError': true,
            };
            BiometricsHandlerProvider.invalidDateFormatHandler(mockError);
            expect(mockErrorInfo.internalErrorCode).toEqual('400CUST_BIO_0002');
            expect(fakeModalService.showGenericModal).toHaveBeenCalledWith(mockErrorInfo, true);
            done();
        });
    });

    describe('biometricGenericModalHandler() is called with the error information object', function (){    
        it('should get the code on error object and call ModalService', function (done){
            var mockError = {
                'code': '404BIO_AENA_0001',
                'reason': 'The boarding card\'s format is not correct.',
                'uuid': null,
                'timeStamp': '2019-09-12 11:24'
            };
            var mockErrorInfo = {
                'internalErrorCode': '404BIO_AENA_0001',
                'goToConfirmation': function(){
                    },
                'moreInformation': function(){

                },
                'biometricDocumentError':true
            };
            BiometricsHandlerProvider.biometricGenericModalHandler(mockError);
            expect(mockErrorInfo.internalErrorCode).toEqual('404BIO_AENA_0001');
            done();
        });
    });

});