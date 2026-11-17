import * as angular from 'angular';

const createFakeBiometricBoardModel = () => ({
    initializeModel: function () {},
    passenger: { name: '', surname: '' },
    biometricData: { name: '', surname: '', documentEmissionCountry: '' },
    segmentsPassengersInfo: {
        passengers: [{ passenger: { name: '', surname: '' } }]
    }
});

const createInfoForm = (isValid, hasNewDocumentError = undefined) => ({
    $submitted: '',
    $valid: isValid,
    ...(hasNewDocumentError === undefined ? {} : {
        document_number: { $error: { new_document: hasNewDocumentError } }
    })
});

const createFormDisabledModel = () => ({
    biometricData: {
        email: [{ email: 'ejemplo@ejemplo.com' }],
        documentNumber: [{ documentNumber: 1 }],
        documentEmissionCountry: [{ documentEmissionCountry: 1 }],
        documentType: { type: [1] }
    }
});

const mockTranslateFilter = function () {
    return '';
};

const mockLiteralFormatterFilter = function () {
    return '';
};

const configureBiometricFormModule = (options: {
    model: object;
    modalService: object;
    appConstants: object;
    boardingCardsService: object;
    documentMock?: object;
}) => {
    angular.mock.module('ib-checkin-biometric-boarding-form-module', 'LocalStorageModule', function($provide) {
        $provide.value('CommonsModalService', options.modalService);
        $provide.value('object', {});
        $provide.value('BiometricBoardModel', options.model);
        $provide.value('CheckinAppConstants', options.appConstants);
        if (options.documentMock) {
            $provide.value('document', options.documentMock);
        }
        $provide.value('translateFilter', mockTranslateFilter);
        $provide.value('LinksFilterFilter', mockTranslateFilter);
        $provide.value('literalFormatterFilter', mockLiteralFormatterFilter);
        $provide.value('BoardingCardsService', options.boardingCardsService);
    });
};

describe('ib-checkin-biometric-boarding-form', function () {

    let $controller, $rootScope, $scope, controller,$localStorageService,$q,$timeout,$document, element;
    let fakeBiometricBoardModel = createFakeBiometricBoardModel();

    let fakeBoardingCardsService = {
        'searchBoardingCardsInformation' : jasmine.createSpy()
    };

    let dummyElement = document.createElement('div');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);

    beforeEach(function () {
        configureBiometricFormModule({
            model: fakeBiometricBoardModel,
            modalService: {},
            appConstants: {},
            boardingCardsService: fakeBoardingCardsService
        });
        inject(function (_$controller_, _$rootScope_, _$timeout_, _localStorageService_,_$document_, $compile) {

            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();

            $localStorageService = _localStorageService_;
            $timeout = _$timeout_;
            $document = _$document_;
            
            controller = $controller('ibChekinBiometricBoardingFormController', {
                $scope: $scope,
                $rootScope: $rootScope,
                $localStorageService : $localStorageService,
                $timeout: $timeout,
                $document: $document
            });
            $scope.$apply();
        });
    });

    describe('when $onInit() is called', function () {
        beforeEach(function () {
            fakeBiometricBoardModel.segmentsPassengersInfo.passengers = [
                {
                    passenger: {
                        name: '',
                        surname: ''
                    }
                }
            ];
        });

        it('The model should be defined' , function() {
            controller.$onInit();
            expect(controller).toBeDefined();
        });

    });

});

describe('ib-checkin-biometric-boarding-form with databuildform', function () {

    let $controller, $rootScope, $scope, controller,$localStorageService,$q,$timeout,$document, fakeBiometricBoardModel, fakeCommonsModalService, fakedocument;

    fakeBiometricBoardModel = createFakeBiometricBoardModel();

    fakeCommonsModalService =  {
        'closeAllCurrentModals' : jasmine.createSpy('closeAllCurrentModals').and.callFake(function () {
            return true;
        })
    }

    fakedocument = {
        'getElementById' : jasmine.createSpy('getElementById').and.callFake(function () {
            return {className : ''};
        })
    }

    let mockBoardingCardsService = { 'test': 'test' };

    let fakeBoardingCardsService = {
        'searchBoardingCardsInformation' : jasmine.createSpy()
    };

    let CheckinAppConstants = require('test/constants/ib-check-in-constants.json');

    beforeEach(function () {
        configureBiometricFormModule(
            {
                model: fakeBiometricBoardModel,
                modalService: fakeCommonsModalService,
                appConstants: CheckinAppConstants,
                boardingCardsService: fakeBoardingCardsService,
                documentMock: fakedocument
            }
        );
        inject(function (_$controller_, _$rootScope_, _$timeout_, _localStorageService_,_$document_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $localStorageService = _localStorageService_;
            $timeout = _$timeout_;
            $document = _$document_;
            $localStorageService.set('biometricBoardingForm', {countriesList : [{'barcelona':''}], documentsByCountry: [{'spain': ''}]});
            controller = $controller('ibChekinBiometricBoardingFormController', {
                $scope: $scope,
                $rootScope: $rootScope,
                $localStorageService : $localStorageService,
                $timeout: $timeout,
                $document: $document
            });
        });
    });

    describe('when $onInit() is called', function () {
        it('The model should be defined' , function() {
            fakeBoardingCardsService.searchBoardingCardsInformation = jasmine.createSpy('searchBoardingCardsInformation').and.callFake(() => {
                return Promise.resolve(mockBoardingCardsService);
            });
            controller.$onInit();
            expect(controller).toBeDefined();
        });
    });

    describe('when checkBiometricBoarding() is called', function () {
        it('The model should be defined' , function() {
            controller.infoForm = createInfoForm(true);
            controller.model = fakeBiometricBoardModel;
            controller.checkBiometricBoarding();
        });
    });

    describe('when updateDocumentsType() is called', function () {
        it('The model should be defined' , function() {
            controller.infoForm = createInfoForm(true);
            controller.model = fakeBiometricBoardModel;
            controller.updateDocumentsType();
        });
    });

    describe('when updateDocumentNumber() is called', function () {
        it('The model should be defined' , function() {
            controller.infoForm = createInfoForm(true);
            controller.model = {
                biometricData : {
                    documentEmissionCountry: null
                }
            };
            controller.updateDocumentNumber();
        });
    });

    describe('when existDocument() is called', function () {
        it('The model should be defined' , function() {
            controller.infoForm = createInfoForm(true);
            controller.model = {
                selectedDocument: {
                    type: ''
                }
            };
            controller.existDocument({type: ''});
        });
    });

    describe('when changeDocument() is called', function () {
        it('The model should be defined' , function() {
            controller.infoForm = createInfoForm(true, true);
            controller.model = {
                selectedDocument: {
                    type: ''
                }
            };
            controller.changeDocument({type: ''});
        });

        it('The model should be defined without a new-document error', function() {
            controller.infoForm = createInfoForm(true, false);
            controller.model = {
                selectedDocument: {
                    type: ''
                }
            };
            controller.changeDocument({type: ''});
        });
    });

    describe('when btnFormDisabled() is called', function () {
        it('The model should be defined' , function() {
            controller.infoForm = createInfoForm(true);
            controller.model = createFormDisabledModel();
            controller.checkInfo = true;
            controller.btnFormDisabled();
        });

        it('The model should be defined when the form is invalid', function() {
            controller.infoForm = createInfoForm(false);
            controller.model = createFormDisabledModel();
            controller.checkInfo = true;
            controller.btnFormDisabled(true);
        });
    });

    describe('when btnConfirmation() is called', function () {
        it('should broadcast event', function () {
            spyOn($rootScope, '$broadcast');
            const biometricData = {
                email : [{email :'ejemplo@ejemplo.com'}],
                documentNumber  : [{documentNumber  : 1}],
                documentEmissionCountry : [{documentEmissionCountry :1}],
                documentType : {type : [1]}
            };
            controller.model = {
                biometricData
            };

            controller.btnConfirmation();

            expect($rootScope.$broadcast).toHaveBeenCalledWith('goToConfirmationEvent', biometricData);
        });
    });

    describe('when close() is called', function () {
        it('The model should be defined' , function() {
            controller.close();
        });
    });

    describe('when biometricProfileCheckError() is called', function () {
        it('The model should be defined, when errorCode is 404' , function() { 
            controller.biometricProfileCheckError(null,{errorCode : 404, internalErrorCode: 'XXX'});
            expect(controller.showErrorNotActive).toBeTrue();
            expect(controller.showErrorNotActiveGeneric).toBeFalse();
        });

        it('The model should be defined, when errorCode is 500' , function() {
            controller.biometricProfileCheckError(null,{errorCode : 500, internalErrorCode: 'XXX'});
            expect(controller.showErrorNotActive).toBeTrue();
            expect(controller.showErrorNotActiveGeneric).toBeTrue();
        });

        it('The model should be defined, when errorCode is 412 and internalErrorCode is CUST_BIO_0001' , function() {
            controller.biometricProfileCheckError(null,{errorCode : 412, internalErrorCode: 'CUST_BIO_0001'});
            expect(controller.showErrorNotActive).toBeTrue();
            expect(controller.showErrorDocumentMatch).toBeTrue();
        });

        it('The model should be defined, when errorCode is 412 and internalErrorCode is CUST_BIO_0003' , function() {
            controller.biometricProfileCheckError(null,{errorCode : 412, internalErrorCode: 'CUST_BIO_0003'});
            expect(controller.showErrorNotActive).toBeTrue();
            expect(controller.showErrorDocumentDate).toBeTrue();
        });    

        it('The model should be defined, when errorCode is 412 and internalErrorCode is ERROR_204' , function() {
            controller.model = {
                passenger : {
                    status : ''
                }
            }
            controller.biometricProfileCheckError(null,{errorCode : 412, internalErrorCode: 'ERROR_204'});
            expect(controller.showErrorNotActive).toBeTrue();
            expect(controller.showErrorNotActiveGeneric).toBeFalse();
            expect(controller.showFormLoading).toBeFalse();
            expect(controller.model.passenger.status).toBe(CheckinAppConstants.BIOMETRIC.STATUS.NOT_ACTIVE);
        });
    });

    describe('when biometricProfileCheckAssociate() is called', function () {
        const expectAssociationFailure = (description: string, expectedErrorFlag: string) => {
            controller.model = {
                code: 206,
                data: {
                    validatedAssociatedStatus: [{
                        associatedStatus: [{
                            boardingCard: '',
                            status: 'FAILED',
                            description
                        }]
                    }]
                }
            };
            controller.biometricProfileCheckAssociate('', controller.model);
            expect(controller.showErrorNotActive).toBeTrue();
            expect(controller[expectedErrorFlag]).toBeTrue();
        };

        it('The model should be defined, when model.code is 200' , function() {
            controller.model = {
                code: 200
            }
            controller.biometricProfileCheckAssociate('', controller.model);
            expect(controller.showFormActive).toBeTrue();
            expect($localStorageService.get('showBiometricSummaryModule')).toBe('summary');
            //expect(controller.showFormLoading).toBeFalse();
        });

        it('The model should be defined, when model.code is 206' , function() {
            expectAssociationFailure('CONNECTIVITY_PROBLEMS', 'showErrorNotActiveGeneric');
        });

        it('The model should be defined, when model.code is 206' , function() {
            expectAssociationFailure('DOCUMENT_EXPIRES_BEFORE_FLIGHT', 'showErrorDocumentDate');
        });
    });
});
