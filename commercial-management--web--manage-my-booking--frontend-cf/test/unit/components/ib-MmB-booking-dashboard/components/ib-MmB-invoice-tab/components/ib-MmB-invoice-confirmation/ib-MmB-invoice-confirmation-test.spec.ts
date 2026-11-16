import angular from "angular";
import { filterFake } from '@test/mocks/constants/filterTranslate-mock';

describe('ibMmbInvoiceConfirmationComponent test', () => {
    var $componentController, $rootScope,  $scope, controller, $q, invoiceIssueService, localStorageService;

    var fakeInvoiceIssueService = {
        addInvoiceIssue: jasmine.createSpy()
    };

    var fakeListInvoicesSelected = [
        { ticketNumber: '0751415064667', route: 'MAD-BIO', concept: 'Vuelos', price: '90' },
        { ticketNumber: '0751415064680', route: 'MAD-BIO', concept: 'Vuelos', price: '50' }
    ];

    var fakeListInvoicesSelected2 = [
        { ticketNumber: '0751415064667', route: 'MAD-BIO', concept: 'Vuelos', price: '90' }
    ];

    var fakeInvoiceDetail = {
        billingData: {
            name: 'Antonio',
            surname: 'Perez',
            identityInformation: '56031044P',
            address: 'address1',
            postalCode: '28001',
            city: 'Madrid',
            province: 'Madrid',
            country: 'España'
        },
        shippingData: {
            language: 'ES',
            email: 'aa@email.com'
        }
    };

    var fakeMmBModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(angular.noop),
        finishWaiting: jasmine.createSpy('finishWaiting').and.callFake(angular.noop),
        showGenericModal: jasmine.createSpy(),
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(modalFake)
    };

    function modalFake() {
        return { 'result': { 'then': () => { } } };
    }

    let fakeInvoiceListService = {
        'getInvoiceList': jasmine.createSpy('getInvoiceList').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
         })
    }

    var fakeInvoiceList = [
        {
            "checked": false,
            "ticket": {
                "name": "TEST",
                "surname": "TEST",
                "ticketNumber": "0751419175767",
                "date": "2023-07-25",
                "iata": 78496445,
                "office": "IBERIA.COM MAD175 NDC MADRID ES",
                "route": "MADRID-BILBAO"
            },
            "shippingData": {
                "language": "ES",
                "email": "aa@email.com"
            },
            "billingData": {
                "name": "Antonio",
                "surname": "Perez",
                "identityInformation": "56031044P",
                "address": "address1",
                "postalCode": "28001",
                "city": "Madrid",
                "province": "Madrid",
                "country": "España"
            },
            "invoicesPriceDetailDataWebList": [
                {
                    "concept": "EMISION",
                    "number": "5445516",
                    "date": "2023-07-25",
                    "numDuplicates": 0,
                    "currency": "EUR",
                    "subjectTaxationPrice": 0.0,
                    "noSubjectTaxationPrice": 0.0,
                    "vatTaxType": 10.0,
                    "vatTaxAmount": 0.0,
                    "totalFare": 17.0,
                    "totalRates": 20.22,
                    "totalAmount": 0.0
                }
            ]
        },
        {
            "checked": true,
            "ticket": {
                "name": "TEST",
                "surname": "TEST",
                "ticketNumber": "0755578267038",
                "date": "2023-07-25",
                "iata": 78496445,
                "office": "IBERIA.COM MAD175 NDC MADRID ES",
                "route": "MADRID-BILBAO"
            },
            "shippingData": {
                "language": "ES",
                "email": "aa@email.com"
            },
            "billingData": {
                "name": "Antonio",
                "surname": "Perez",
                "identityInformation": "56031044P",
                "address": "address1",
                "postalCode": "28001",
                "city": "Madrid",
                "province": "Madrid",
                "country": "España"
            },
            "invoicesPriceDetailDataWebList": [
                {
                    "concept": "EMISION",
                    "number": "5445515",
                    "date": "2023-07-25",
                    "numDuplicates": 0,
                    "currency": "EUR",
                    "subjectTaxationPrice": 0.0,
                    "noSubjectTaxationPrice": 0.0,
                    "vatTaxType": 10.0,
                    "vatTaxAmount": 0.0,
                    "totalFare": 13.0,
                    "totalRates": 0.0,
                    "totalAmount": 0.0
                }
            ]
        },
        {
            "checked": false,
            "ticket": {
                "name": "TEST",
                "surname": "TEST",
                "ticketNumber": "0755578267036",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "checked": false,
            "ticket": {
                "name": "TEST",
                "surname": "TEST",
                "ticketNumber": "0755578267037",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        }
    ];

    var fakeListInvoicesResult = [
        {
            "checked": false,
            "ticket": {
                "name": "TEST",
                "surname": "TEST",
                "ticketNumber": "0755578267036",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "checked": false,
            "ticket": {
                "name": "TEST",
                "surname": "TEST",
                "ticketNumber": "0755578267037",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        }
    ];

    var fakeMmBAppConstants = {
        templatesRoute: 'web-manage-my-booking/templates/',
        QUADRIGAM: {
            INVOICE_CONFIRMATION: 'test',
            INVOICE_ERROR_SUMMARY: 'test'
        }
    };

    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(() => { }),
        'updateDatalayerViewEvent': jasmine.createSpy('updateDatalayerViewEvent').and.callFake(() => { }),
        'setProcessAndStep': jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy()
    };
    let fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy(),
        'updateSisterCitiesModel': jasmine.createSpy(),
        'generateRequestFlexibilization': jasmine.createSpy()
    };
    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            'VIEW': 'TEST_4'
        },
        DIGITAL_DATA_PROCESS: {
            FACSOK: 'test',
            FACSKO: 'test'
        },
        DIGITAL_DATA_STEP: {
            FACSOK: 'test',
            FACSKO: 'test'
        },
    }

    var fakeNewRequestInvoices = [
        '0751419175767'
    ];

    var fakeNewRequestInvoicesFailure = [
        '0755578267038'
    ];

    var partialOkDataResponse = {
        results: [
            {
                ticketId: '0751415064667',
                status: 'SUCCESS',
                code: null
            },
            {
                ticketId: '0751415064680',
                status: 'FAILURE',
                code: 'IVM_IVS_0022'
            }
        ]
    };

    var faketranslate = {
        'onReady': jasmine.createSpy().and.returnValue(new Promise(resolve => resolve(true))),
        'storageKey': jasmine.createSpy('storageKey').and.callFake(() => { }),
        'storage': jasmine.createSpy('storage').and.callFake(() => { }),
        'preferredLanguage': jasmine.createSpy('preferredLanguage').and.callFake(() => { }),
        'use': jasmine.createSpy('use').and.callFake(() => { })
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-invoice-confirmation-module', 'LocalStorageModule', function ($provide) {
            $provide.value('$filter', filterFake);
            $provide.value('$translate', faketranslate);
            $provide.value('InvoiceIssueService', fakeInvoiceIssueService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('InvoiceListService', fakeInvoiceListService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
        });
        inject(function (_$rootScope_, _$componentController_,  _$q_, _InvoiceIssueService_,  _localStorageService_, _$translate_) {
            $rootScope = _$rootScope_;
            $componentController = _$componentController_;
            $scope = $rootScope.$new();
            $q = _$q_;
            invoiceIssueService = _InvoiceIssueService_;
            localStorageService = _localStorageService_;
            controller = $componentController('ibMmbInvoiceConfirmation', {
                $scope: $scope,
                $translate: faketranslate
            });
            controller.getInvoiceData = jasmine.createSpy()
            controller.listInvoicesSelected = [];
        });
    });

    describe('templateUrl definition', () => {
        it('templateUrl should be defined', inject(($compile, $rootScope, $httpBackend) => {
            $httpBackend.expectGET('web-manage-my-booking/templates/ib-MmB-invoice-confirmation-view.html').respond(200, '<div id="test-template"></div>');
            const scope = $rootScope.$new();
            scope.listInvoicesSelected = [];
            const element = $compile('<ib-MmB-invoice-confirmation list-invoices-selected="listInvoicesSelected"></ib-MmB-invoice-confirmation>')(scope);
            scope.$digest();
            $httpBackend.flush();
            expect(element.html()).toContain('id="test-template"');
        }));
    });

    describe('when activate() function is called', () => {
        it('should initialize properties', (done) => {
            let copyfakeListInvoicesSelected = [...fakeListInvoicesSelected];
            controller.listInvoicesSelected = copyfakeListInvoicesSelected;
            controller.activate();
            done();
        });
    });

    describe('when close() function is called', () => {
        it('should set correctValue to properties & filter not emitted list invoices', (done) => {
            let newArray = [];
            newArray.push(fakeListInvoicesResult[0]);
            controller.listInvoices = newArray;
            controller.close();
            expect(controller.checkRequestInvoice).toBe(true);
            expect(controller.showConfirmation).toBe(false);
            done();
        });
    });

    describe('when requestInvoices() function is called', () => {
        beforeEach(() => {
            $rootScope.appLang = 'en';
        });

        it('should set correctValue to properties when service response is OK', (done) => {
            inject(function ($q) {
                fakeInvoiceIssueService.addInvoiceIssue = jasmine.createSpy('addInvoiceIssue').and.callFake(() => {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
            });
            let copyfakeInvoiceList = [...fakeInvoiceList];
            let copyfakeListInvoicesSelected = [...fakeListInvoicesSelected];
            let copyfakeInvoiceDetail = {...fakeInvoiceDetail};
            localStorageService.set('invoiceList', copyfakeInvoiceList);
            localStorageService.set('newRequestInvoices', []);
            controller.listInvoicesSelected = copyfakeListInvoicesSelected;
            controller.invoiceDetail = copyfakeInvoiceDetail;
            controller.requestInvoices();
            invoiceIssueService.addInvoiceIssue().then((data) =>  {
                expect(controller.showErrorConfirmation).toBe(false);
                expect(controller.showConfirmation).toBe(false);
                expect(controller.showInvoiceData).toBe(false);
                expect(controller.checkRequestInvoice).toBe(false);
                expect(controller.selectableList).toBe(false);
                expect(controller.showOkConfirmation).toBe(true);
                expect(localStorageService.get('newRequestInvoices')).toEqual(['0751415064667', '0751415064680']);
                expect(localStorageService.get('invoiceList')[0].billingData).toEqual(copyfakeInvoiceDetail.billingData);
                expect(localStorageService.get('invoiceList')[0].shippingData).toEqual(copyfakeInvoiceDetail.shippingData);
                localStorageService.clearAll();
                done();
            })
            $rootScope.$digest();
        });

        it('should set correctValue to properties when service response is OK & have previously localStorage data', (done) => {
            inject(function ($q) {
                fakeInvoiceIssueService.addInvoiceIssue = jasmine.createSpy('addInvoiceIssue').and.callFake(() => {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
            });
            let copyfakeInvoiceList = [...fakeInvoiceList];
            let copyfakeNewRequestInvoices = [...fakeNewRequestInvoices];
            let copyfakeListInvoicesSelected = [...fakeListInvoicesSelected];
            let copyfakeInvoiceDetail = {...fakeInvoiceDetail};
            localStorageService.set('invoiceList', copyfakeInvoiceList);
            localStorageService.set('newRequestInvoices', copyfakeNewRequestInvoices);
            controller.listInvoicesSelected = copyfakeListInvoicesSelected;
            controller.invoiceDetail = copyfakeInvoiceDetail;
            controller.requestInvoices();
            invoiceIssueService.addInvoiceIssue().then((data) =>  {
                expect(controller.showErrorConfirmation).toBe(false);
                expect(controller.showConfirmation).toBe(false);
                expect(controller.showInvoiceData).toBe(false);
                expect(controller.checkRequestInvoice).toBe(false);
                expect(controller.selectableList).toBe(false);
                expect(controller.showOkConfirmation).toBe(true);
                expect(localStorageService.get('newRequestInvoices')).toEqual([copyfakeNewRequestInvoices[0], '0751415064667', '0751415064680']);
                localStorageService.clearAll();
                done();
            })
            $rootScope.$digest();
        });


        it('should set correctValue to properties when service response is OK & have previously localStorage data but newRequestInvoices empty', (done) => {
            inject(function ($q) {
                fakeInvoiceIssueService.addInvoiceIssue = jasmine.createSpy('addInvoiceIssue').and.callFake(() => {
                    var defer = $q.defer();
                    defer.resolve(partialOkDataResponse);
                    return defer.promise;
                });
            });
            let copyfakeInvoiceList = [...fakeInvoiceList];
            let copyfakeListInvoicesSelected = [...fakeListInvoicesSelected];
            let copyfakeInvoiceDetail = {...fakeInvoiceDetail};
            localStorageService.set('invoiceList', copyfakeInvoiceList);
            localStorageService.set('newRequestInvoices', null);
            localStorageService.set('newRequestInvoicesFailure', null);
            controller.listInvoicesSelected = copyfakeListInvoicesSelected;
            controller.invoiceDetail = copyfakeInvoiceDetail;
            controller.requestInvoices();
            invoiceIssueService.addInvoiceIssue().then((data) =>  {
                expect(data).toEqual(partialOkDataResponse);
                expect(controller.showErrorConfirmation).toBe(false);
                expect(controller.showConfirmation).toBe(false);
                expect(controller.showInvoiceData).toBe(false);
                expect(controller.checkRequestInvoice).toBe(false);
                expect(controller.visibleForm ).toBe(false);
                expect(controller.selectableList).toBe(false);
                expect(controller.showOkConfirmation).toBe(false);
                expect(controller.showPartialErrorConfirmation).toBe(true);
                expect(localStorageService.get('newRequestInvoices')).toEqual(['0751415064667']);
                expect(localStorageService.get('newRequestInvoicesFailure')).toEqual(['0751415064680']);
                localStorageService.clearAll();
                done();
            })
            $rootScope.$digest();
        });

        it('should set correctValue to properties when service response is partial OK', (done) => {
            inject(function ($q) {
                fakeInvoiceIssueService.addInvoiceIssue = jasmine.createSpy('addInvoiceIssue').and.callFake(() => {
                    var defer = $q.defer();
                    defer.resolve(partialOkDataResponse);
                    return defer.promise;
                });
            });
            let copyfakeInvoiceList = [...fakeInvoiceList];
            let copyfakeListInvoicesSelected = [...fakeListInvoicesSelected];
            let copyfakeInvoiceDetail = {...fakeInvoiceDetail};
            localStorageService.set('invoiceList', copyfakeInvoiceList);
            localStorageService.set('newRequestInvoices', []);
            controller.listInvoicesSelected = copyfakeListInvoicesSelected;
            controller.invoiceDetail = copyfakeInvoiceDetail;
            controller.requestInvoices();
            invoiceIssueService.addInvoiceIssue().then((data) =>  {
                expect(data).toEqual(partialOkDataResponse);
                expect(controller.showErrorConfirmation).toBe(false);
                expect(controller.showConfirmation).toBe(false);
                expect(controller.showInvoiceData).toBe(false);
                expect(controller.checkRequestInvoice).toBe(false);
                expect(controller.visibleForm ).toBe(false);
                expect(controller.selectableList).toBe(false);
                expect(controller.showOkConfirmation).toBe(false);
                expect(controller.showPartialErrorConfirmation).toBe(true);
                expect(localStorageService.get('newRequestInvoices')).toEqual(['0751415064667']);
                expect(localStorageService.get('newRequestInvoicesFailure')).toEqual(['0751415064680']);
                localStorageService.clearAll();
                done();
            })
            $rootScope.$digest();
        });

        it('should set correctValue to properties when service response is partial OK & have previously localStorage data', (done) => {
            inject(function ($q) {
                fakeInvoiceIssueService.addInvoiceIssue = jasmine.createSpy('addInvoiceIssue').and.callFake(() => {
                    var defer = $q.defer();
                    defer.resolve(partialOkDataResponse);
                    return defer.promise;
                });
            });
            let copyfakeInvoiceList = [...fakeInvoiceList];
            let copyfakeNewRequestInvoices = [...fakeNewRequestInvoices];
            let copyfakeNewRequestInvoicesFailure = [...fakeNewRequestInvoicesFailure];
            let copyfakeListInvoicesSelected = [...fakeListInvoicesSelected];
            let copyfakeInvoiceDetail = {...fakeInvoiceDetail};
            localStorageService.set('invoiceList', copyfakeInvoiceList);
            localStorageService.set('newRequestInvoices', copyfakeNewRequestInvoices);
            localStorageService.set('newRequestInvoicesFailure', copyfakeNewRequestInvoicesFailure);
            controller.listInvoicesSelected = copyfakeListInvoicesSelected;
            controller.invoiceDetail = copyfakeInvoiceDetail;
            controller.requestInvoices();
            invoiceIssueService.addInvoiceIssue().then((data) =>  {
                expect(data).toEqual(partialOkDataResponse);
                expect(controller.showErrorConfirmation).toBe(false);
                expect(controller.showConfirmation).toBe(false);
                expect(controller.showInvoiceData).toBe(false);
                expect(controller.checkRequestInvoice).toBe(false);
                expect(controller.visibleForm ).toBe(false);
                expect(controller.selectableList).toBe(false);
                expect(controller.showOkConfirmation).toBe(false);
                expect(controller.showPartialErrorConfirmation).toBe(true);
                expect(localStorageService.get('newRequestInvoices')).toEqual([copyfakeNewRequestInvoices[0], '0751415064667']);
                expect(localStorageService.get('newRequestInvoicesFailure')).toEqual([copyfakeNewRequestInvoicesFailure[0], '0751415064680']);
                localStorageService.clearAll();
                done();
            })
            $rootScope.$digest();
        });

        it('should set correctValue to properties when service response is KO', (done) => {
            inject(function ($q) {
                fakeInvoiceIssueService.addInvoiceIssue = jasmine.createSpy('addInvoiceIssue').and.callFake(() => {
                    var defer = $q.defer();
                    defer.reject();
                    return defer.promise;
                });
            });
            let copyfakeListInvoicesSelected = [...fakeListInvoicesSelected];
            let copyfakeInvoiceDetail = {...fakeInvoiceDetail};
            controller.listInvoicesSelected = copyfakeListInvoicesSelected;
            controller.invoiceDetail = copyfakeInvoiceDetail;
            controller.requestInvoices();
            invoiceIssueService.addInvoiceIssue().then(angular.noop, function (error) {
                expect(controller.showErrorConfirmation).toBe(true);
                done();
            })
            $rootScope.$digest();
        });
    });

    describe('when getTicketsNumber() function is called', () => {
        it('should return specific tickets number', (done) => {
            let copyfakeListInvoicesSelected = [...fakeListInvoicesSelected];
            controller.listInvoicesSelected = copyfakeListInvoicesSelected;
            var arrticketsNumber = ['0751415064667', '0751415064680'];
            expect(controller.getTicketsNumber()).toEqual(arrticketsNumber);
            done();
        });
    });

    describe('when checkNumberInvoicesSelected() function is called', () => {
        it('should set correct literals when have more than one invoice', () => {
            let copyfakeListInvoicesSelected = [...fakeListInvoicesSelected];
            controller.listInvoicesSelected = copyfakeListInvoicesSelected;
            controller.requestInvoicePlural = 'Solicitar facturas';
            controller.checkNumberInvoicesSelected();
            expect(controller.literalRequestInvoice ).toBe('Solicitar facturas');
        });

        it('should set correct literals when have one invoice', () => {
            let copyfakeListInvoicesSelected2 = [...fakeListInvoicesSelected2];
            controller.listInvoicesSelected = copyfakeListInvoicesSelected2;
            controller.requestInvoiceSingular = 'Solicitar factura';
            controller.checkNumberInvoicesSelected();
            expect(controller.literalRequestInvoice ).toBe('Solicitar factura');
        });
    });

});
