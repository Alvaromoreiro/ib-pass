describe('MmBModalInvoiceRequestController test', () => {
    var controller, $rootScope, $scope, $controller, $q, timeout, $object, localStorageService;

    var fake$uibModalInstance = {
        dismiss: jasmine.createSpy(),
        close: jasmine.createSpy(),
        result: { 'then': () => { } }
    }

    var fakeObject = {
        invoiceDetail: {
            shippingData: {
                emal: 'ab@ab.com'
            }
        }
    };

    var fakeInvoiceDuplicateService = {
        sendInvoiceDuplicate: jasmine.createSpy('sendInvoiceDuplicate').and.callFake(() => {
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
    }

    let fakeMmBAppConstants = {
        QUADRIGAM: {
            INVOICE_MODAL_ISSUED: 'test',
            INVOICE_MODAL_REVIEW_REQUEST: 'test',
            INVOICE_MODAL_RESEND: 'test',
            INVOICE_ERROR_RESEND: 'test'
        },
        INVOICE_STATES: {
            ISSUED: 'ISSUED'
        }
    };

    let fakeMmBDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(() => { }),
        'updateDatalayerViewEvent': jasmine.createSpy('updateDatalayerViewEvent').and.callFake(() => { }),
        'setProcessAndStep': jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy()
    };

    let fakeMmBUtilService = {
        isUserLogged: jasmine.createSpy()
    };

    let fakeMMBDatalayerConstants = {
        DIGITAL_DATA_PROCESS: {
            test: 'test'
        },
        DIGITAL_DATA_STEP: {
            test: 'test'
        },
        DATALAYER_EVENT_TYPES: {
            VIEW: 'VIEW'
        }
    }

    beforeEach(() => {
        angular.mock.module('ib-MmB-modal-module', 'LocalStorageModule',  ($provide) => {
            $provide.value('$uibModalInstance', fake$uibModalInstance);
            $provide.value('object', fakeObject);
            $provide.value('InvoiceDuplicateService', fakeInvoiceDuplicateService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeMmBDatalayerUtilsService);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('MMBDatalayerConstants', fakeMMBDatalayerConstants);
        });
        inject((_$rootScope_, _localStorageService_, _$controller_, _object_, $timeout, _$q_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            timeout = $timeout;
            $q = _$q_;
            $object = _object_;
            localStorageService = _localStorageService_;
            $controller = _$controller_;
            controller = $controller('MmBModalInvoiceRequestController', {
                $scope: $scope,
                $rootScope: $rootScope,
                localStorageService: localStorageService,
                object: fakeObject,
                $timeout: timeout
            });
            controller.showOk = false;
            controller.showError = false;
            controller.showErrorConfirmation = false;
            controller.showOkConfirmation = false;
            controller.submitted = false;
            controller.modalInvoiceForm = {
                $submitted: false,
                $valid: true,
                email: {
                    $modelValue: 'ab@ab.com'
                }
            }
            $rootScope.$digest();
        });
    });

    describe('when functions is called ', () => {
        it('activate() is Called and stateRequested is ISSUED', (done) => {
            controller.model.invoiceDetail.stateRequested = 'ISSUED';
            controller.$onInit();
            expect(controller).toBeDefined();
            expect(controller.showOk).toBe(false);
            expect(controller.showError).toBe(false);
            expect(controller.submitted).toBe(false);
            expect(controller.showErrorConfirmation).toBe(false);
            expect(controller.showOkConfirmation ).toBe(false);
            done();
        });

        it('activate() is Called and stateRequested is not ISSUED', (done) => {
            controller.model.invoiceDetail.stateRequested = '';
            controller.$onInit();
            expect(controller).toBeDefined();
            done();
        });


        it('closeModal() is Called', (done) => {
            controller.close();
            expect(controller.submitted ).toEqual(false);
            expect(controller.showError).toEqual(false);
            done();
        });
    });

    describe('when resend is called ', () => {
        it('modalInvoiceForm.$valid is false', (done) => {
            controller.modalInvoiceForm.$valid = false;
            controller.resend();
            timeout.flush();
            $rootScope.$digest();
            expect(controller.validationError).toEqual(true);
            expect(controller.model.showOk).toEqual(false);
            expect(controller.model.showError).toEqual(false);
            expect(controller.model.submitted ).toEqual(false);
            done();
        });

        it('modalInvoiceForm.$valid is true and service response is OK', (done) => {
            fakeInvoiceDuplicateService.sendInvoiceDuplicate = jasmine.createSpy('sendInvoiceDuplicate').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
            controller.resend();
            timeout.flush();
            $rootScope.$digest();
            expect(controller.model.showOk).toEqual(true);
            expect(controller.model.showError).toEqual(false);
            done();
        });

        it('modalInvoiceForm.$valid is true and service response is OK PARTIAL', (done) => {
            fakeInvoiceDuplicateService.sendInvoiceDuplicate = jasmine.createSpy('sendInvoiceDuplicate').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve([{status: 'FAILURE'}]);
                return deferred.promise;
            });
            controller.resend();
            timeout.flush();
            $rootScope.$digest();
            expect(controller.model.showOk).toEqual(false);
            expect(controller.model.showError).toEqual(true);
            done();
        });

        it('modalInvoiceForm.$valid is true and service response is ERROR', (done) => {
            fakeInvoiceDuplicateService.sendInvoiceDuplicate = jasmine.createSpy('sendInvoiceDuplicate').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject();
                return deferred.promise;
            });
            controller.resend();
            timeout.flush();
            $rootScope.$digest();
            // expect(controller.model.showError).toEqual(true);
            // expect(controller.model.showOk).toEqual(false);
            // expect(controller.model.submitted).toEqual(false);
            done();
        });
    });

});
