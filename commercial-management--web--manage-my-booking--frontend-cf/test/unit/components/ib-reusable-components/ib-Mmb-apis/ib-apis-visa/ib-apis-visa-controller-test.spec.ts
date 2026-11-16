describe('ApisVisaController test', function () {
    var controller, $scope, $rootScope, $controller;

    var fakeBookingDashboardConstants = {
        APIS_FORM: {
            DOCUMENT_TYPES: {
                'DNI': 'DNI',
                'GREENCARD': 'GREENCARD',
                'REDRESSNUMBER': 'REDRESSNUMBER',
                'KNOWNTRAVELERNUMBER': 'KNOWNTRAVELERNUMBER',
                'OTHERS': 'OTHERS',
                'PSPT': 'PSPT',
                'TITLE': 'TITLE',
                'VISA': 'VISA',
                'CREWCERT': 'CREWCERT',
                'RESCARD': 'RESCARD',
                'MILITARYCARD': 'MILITARYCARD'
            }
        }
    };

    beforeEach(function () {
        angular.mock.module('ib-apis-visa-module', function ($provide) {
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
        });
        inject(function (_$rootScope_, _$controller_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('ApisVisaController', {
                $scope: $scope
            });
        });
    });

    // errors with vm.pasVisaData.requiredFields.includes('NUM_DOC')
    describe('when activate() is called', function() {
        it('with all required initialized and call checkRequiredFields()', function(done) {
            controller.pasVisaData = {};
            controller.pasVisaData.requiredFields= ['NUM_DOC','CNTRY_DOC','EXPIRY_DOC'];
            controller.$onInit();
            expect(controller.documentNumber).toBe(true);
            expect(controller.issueCountry).toBe(true);
            expect(controller.expiryDate).toBe(true);
            done();
        });
        it('with only NUM_DOC initialized and call checkRequiredFields()', function(done) {
            controller.pasVisaData = {};
            controller.pasVisaData.requiredFields= ['NUM_DOC'];
            controller.$onInit();
            expect(controller.documentNumber).toBe(true);
            expect(controller.issueCountry).toBe(false);
            expect(controller.expiryDate).toBe(false);
            done();
        });
        it('with only CNTRY_DOC initialized and call checkRequiredFields()', function(done) {
            controller.pasVisaData = {};
            controller.pasVisaData.requiredFields= ['CNTRY_DOC'];
            controller.$onInit();
            expect(controller.documentNumber).toBe(false);
            expect(controller.issueCountry).toBe(true);
            expect(controller.expiryDate).toBe(false);
            done();
        });
        it('with only EXPIRY_DOC initialized and call checkRequiredFields()', function(done) {
            controller.pasVisaData = {};
            controller.pasVisaData.requiredFields= ['EXPIRY_DOC'];
            controller.$onInit();
            expect(controller.documentNumber).toBe(false);
            expect(controller.issueCountry).toBe(false);
            expect(controller.expiryDate).toBe(true);
            done();
        });
    });

    describe('when callVisaExpiryDateCtrl() is called', function() {
        it('pasVisaData number exist should emit "nextStep" ', function () {
            controller.pasVisaData = {};
            controller.pasVisaData.number = "4455544";
            expect(controller.pasVisaData).toBeDefined();
            expect(controller.pasVisaData.number).toBeDefined();
            controller.callVisaExpiryDateCtrl();
        });
        it('pasVisaData issuerCountry exist should emit "nextStep" ', function () {
            controller.pasVisaData = {};
            controller.pasVisaData.issuerCountry = "DE";
            expect(controller.pasVisaData).toBeDefined();
            expect(controller.pasVisaData.issuerCountry).toBeDefined();
            controller.callVisaExpiryDateCtrl();
        });
        it('pasVisaData number exist but is empty should emit "nextStep" ', function () {
            controller.pasVisaData = {};
            controller.pasVisaData.number = "";
            expect(controller.pasVisaData).toBeDefined();
            expect(controller.pasVisaData.number).toBeDefined();
            controller.callVisaExpiryDateCtrl();
        });
    });

    describe('when checkRequiredFields() is called', function() {
        it ('required fields > 0', function() {
            controller.$onInit();
        });
    });

    describe('when isDocCountryDisabled() is called', function() {

        it('selected doc code equal to greencard', function() {
            controller.pasVisaData = {};
            controller.pasVisaData = {
                'selectedDoc': {
                    'type': {
                        'code': 'GREENCARD'
                    }
                }
            };
            controller.isDocCountryDisabled();
            expect(controller.pasVisaData.selectedDoc.type.code).toBe(fakeBookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.GREENCARD);
        });

        it('selected doc code equal to redress number', function() {
            controller.pasVisaData = {};
            controller.pasVisaData = {
                'selectedDoc': {
                    'type': {
                        'code': 'REDRESSNUMBER'
                    }
                }
            };
            controller.isDocCountryDisabled();
            expect(controller.pasVisaData.selectedDoc.type.code).toBe(fakeBookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.REDRESSNUMBER);
        });

        it('selected doc code equal to known traveler number', function() {
            controller.pasVisaData = {};
            controller.pasVisaData = {
                'selectedDoc': {
                    'type': {
                        'code': 'KNOWNTRAVELERNUMBER'
                    }
                }
            };
            controller.isDocCountryDisabled();
            expect(controller.pasVisaData.selectedDoc.type.code).toBe(fakeBookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.KNOWNTRAVELERNUMBER);
        });
    });
});
