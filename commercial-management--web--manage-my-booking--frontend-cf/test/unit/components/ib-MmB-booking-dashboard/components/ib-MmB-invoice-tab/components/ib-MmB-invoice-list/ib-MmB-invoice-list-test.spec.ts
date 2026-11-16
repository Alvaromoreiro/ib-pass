describe('ibMmbInvoiceListComponent test', function () {
    var $controller, $rootScope, $scope, controller, invoiceToAdd, invoiceToDelete, localStorageService, $q, $window;

    var fakeMmBModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(angular.noop),
        finishWaiting: jasmine.createSpy('finishWaiting').and.callFake(angular.noop),
        showInvoiceRequestModal: jasmine.createSpy('showInvoiceRequestModal').and.callFake(function () {
            return {
                result: $q.when({})
            };
        }),
        showGenericModal: jasmine.createSpy(),
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(modalFake)
    };

    function modalFake() {
        return { 'result': { 'then': function () { } } };
    }

    var fakeMmBAppConstants = {
        templatesRoute: 'web-manage-my-booking/templates/',
        QUADRIGAM: {
            INVOICE_LIST: 'test'
        }
    };

    var fakeInvoiceList = [
        {
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

    var fakeListInvoicesResult2 = [
        {
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
        }
    ];

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

    var faketranslate = {
        'onReady': jasmine.createSpy().and.returnValue(new Promise(resolve => resolve(true))),
        'storageKey': jasmine.createSpy('storageKey').and.callFake(function () { }),
        'storage': jasmine.createSpy('storage').and.callFake(function () { }),
        'preferredLanguage': jasmine.createSpy('preferredLanguage').and.callFake(function () { }),
        'use': jasmine.createSpy('use').and.callFake(function () { })
    };

    let fakeInvoiceListService = {
        'getInvoiceList': jasmine.createSpy('getInvoiceList').and.callFake(function () {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        })
    }
    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(function () { }),
        'updateDatalayerViewEvent': jasmine.createSpy('updateDatalayerViewEvent').and.callFake(function () { }),
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
            FACGDR: 'test',
            FACLIS: 'test',
            FACLISF: 'test'
        },
        DIGITAL_DATA_STEP: {
            FACGDR: 'test',
            FACLIS: 'test',
            FACLISF: 'test'
        },
    }
    beforeEach(function () {
        angular.mock.module('ib-MmB-invoice-list-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('$filter', $fakeFilter);
            $provide.value('$translate', faketranslate);
            $provide.value('InvoiceListService', fakeInvoiceListService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
        });
        inject(function ($componentController, _$rootScope_, _localStorageService_, _$q_, _$window_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $componentController('ibMmbInvoiceList', {
                $scope: $scope,
                $translate: faketranslate
            });
            localStorageService = _localStorageService_;
            $q = _$q_;
            $window = _$window_;
            controller.getInvoiceData = jasmine.createSpy()
        });
    });

    describe('when activate() function is called', function () {
        it('should set correctValue to properties', function () {
            localStorageService.set('listInvoices', fakeListInvoicesResult);
            controller.$onInit();
            expect(controller.requestInvoiceSingular).toBeDefined();
            expect(controller.requestInvoicePlural).toBeDefined();
        });
    });

    describe('templateUrl definition', () => {
        it('templateUrl should be defined', inject(($compile, $rootScope, $httpBackend) => {
            $httpBackend.expectGET('web-manage-my-booking/templates/ib-MmB-invoice-list-view.html').respond(200, '<div id="test-template"></div>');
            const scope = $rootScope.$new();
            const element = $compile('<ib-mmb-invoice-list></ib-mmb-invoice-list>')(scope);
            scope.$digest();
            $httpBackend.flush();
            expect(element.html()).toContain('id="test-template"');
        }));
    });

    describe('when addRemoveInvoiceItem() function is called', function () {
        it('should add one item when invoice checked property is true', function () {
            controller.listInvoicesSelected = [];
            controller.listInvoices = [
                { ticketNumber: 1, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '117,56 €', state: 'Emitida', checked: false },
                { ticketNumber: 2, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '217,56 €', state: 'Solicitada', checked: true },
                { ticketNumber: 3, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '317,56 €', state: 'Emitida', checked: false }
            ];
            invoiceToAdd = controller.listInvoices[1];
            controller.addRemoveInvoiceItem(invoiceToAdd);
            expect(controller.listInvoicesSelected).toContain(invoiceToAdd);
        });

        it('should remove one item when invoice checked property is false', function () {
            controller.listInvoicesSelected = [
                { ticketNumber: 1, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '117,56 €', state: 'Emitida', checked: true },
                { ticketNumber: 2, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '217,56 €', state: 'Solicitada', checked: false },
                { ticketNumber: 3, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '317,56 €', state: 'Emitida', checked: true }
            ];
            controller.listInvoices = [
                { ticketNumber: 1, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '117,56 €', state: 'Emitida', checked: true },
                { ticketNumber: 2, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '217,56 €', state: 'Solicitada', checked: false },
                { ticketNumber: 3, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '317,56 €', state: 'Emitida', checked: true }
            ];
            invoiceToDelete = controller.listInvoices[1];
            controller.addRemoveInvoiceItem(invoiceToDelete);
            expect(controller.listInvoicesSelected).not.toContain(invoiceToDelete);
        });

        it('should add one item when invoice checked property is true & set checkAll to true', function () {
            controller.listInvoicesSelected = [];
            controller.listInvoices = [
                { ticketNumber: 2, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '217,56 €', state: 'Solicitada', checked: true }
            ];
            invoiceToAdd = controller.listInvoices[0];
            controller.addRemoveInvoiceItem(invoiceToAdd);
            expect(controller.listInvoicesSelected).toContain(invoiceToAdd);
            expect(controller.checkAll).toBe(true);
        });
    });

    describe('when addAllInvoiceItem() function is called', function () {
        it('should add all items when checked is true', function () {
            controller.listInvoicesSelected = [];
            controller.listInvoices = [
                { ticketNumber: 1, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '117,56 €', state: 'Emitida', checked: true },
                { ticketNumber: 2, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '217,56 €', state: 'Solicitada', checked: false },
                { ticketNumber: 3, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '317,56 €', state: 'Emitida', checked: true }
            ];
            controller.checkAll = true;
            controller.addAllInvoiceItem();
            expect(controller.listInvoicesSelected).toEqual(controller.listInvoices);
        });

        it('should remove all items when checked is false', function () {
            controller.listInvoicesSelected = [];
            controller.listInvoices = [
                { ticketNumber: 1, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '117,56 €', state: 'Emitida', checked: true },
                { ticketNumber: 2, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '217,56 €', state: 'Solicitada', checked: false },
                { ticketNumber: 3, route: 'MAD-BCN-MAD', concept: 'Vuelos - Teresa Dominique Lapierre', price: '317,56 €', state: 'Emitida', checked: true }
            ];
            controller.checkAll = false;
            controller.addAllInvoiceItem();
            expect(controller.listInvoicesSelected.length).toEqual(0);
        });
    });

    describe('when requestInvoices() function is called', function () {
        it('should set correct variables values when window is mobile', function () {
            $window.innerWidth = 320;
            localStorageService.set('listInvoices', fakeListInvoicesResult);
            controller.listInvoices = fakeInvoiceList;
            controller.requestInvoices();
            expect(controller.checkRequestInvoice).toBe(true);
            expect(controller.selectableList).toBe(true);
            expect(controller.showOkConfirmation).toBe(false);
            expect(controller.visibleForm).toBe(false);
            expect(controller.listInvoices).toEqual(fakeListInvoicesResult);
        });

        it('should set correct variables values when window is desktop', function () {
            $window.innerWidth = 1280;
            localStorageService.set('listInvoices', fakeListInvoicesResult);
            controller.listInvoices = fakeInvoiceList;
            controller.requestInvoices();
            expect(controller.checkRequestInvoice).toBe(true);
            expect(controller.selectableList).toBe(true);
            expect(controller.showOkConfirmation).toBe(false);
            expect(controller.visibleForm).toBe(true);
            expect(controller.listInvoices).toEqual(fakeListInvoicesResult);
        });

        it('should set list invoices empty', function () {
            $window.innerWidth = 1280;
            localStorageService.set('listInvoices', null);
            controller.requestInvoices();
            expect(controller.checkRequestInvoice).toBe(true);
            expect(controller.selectableList).toBe(true);
            expect(controller.showOkConfirmation).toBe(false);
            expect(controller.visibleForm).toBe(true);
            expect(controller.listInvoices).toEqual([]);
        });
    });

    describe('when completeInvoiceData() function is called', function () {
        it('should set correct variables values', function () {
            controller.completeInvoiceData();
            expect(controller.showInvoiceData).toBe(true);
            expect(controller.checkRequestInvoice).toBe(true);
            expect(controller.visibleForm).toBe(true);
        });
    });

    describe('when closeCompleteInvoiceData() function is called', function () {
        it('should set correct variables values', function () {
            controller.closeCompleteInvoiceData();
            controller.getInvoiceData();
            expect(controller.showInvoiceData).toBe(false);
            expect(controller.checkRequestInvoice).toBe(false);
            expect(controller.selectableList).toBe(false);
            expect(controller.visibleForm).toBe(false);
        });
    });

    describe('when checkNumberInvoices() function is called', function () {
        it('should set correct literals when have more than one invoice', function () {
            controller.requestInvoicePlural = 'Solicitar facturas';
            localStorageService.set('listInvoices', fakeListInvoicesResult);
            controller.checkNumberInvoices();
            expect(controller.literalRequestInvoice ).toBe('Solicitar facturas');
        });

        it('should set correct literals when have one invoice', function () {
            controller.requestInvoiceSingular = 'Solicitar factura';
            localStorageService.set('listInvoices', fakeListInvoicesResult2);
            controller.checkNumberInvoices();
            expect(controller.literalRequestInvoice).toBe('Solicitar factura');
        });
    });

    describe('when consult() function is called', function () {
        it('should set correct property values', function () {
            controller.consult();
        });
    });
});
