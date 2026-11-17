describe('DangerousObjectsModalController Test', function () {
    var $controller, $rootScope, object, controller, $fakeFilter, $translate, CheckinAppConstants;
    var fakeIbUtilsService = {
        setTitlePage: jasmine.createSpy('setTitlePage').and.callFake(function () {
            return 'TITULO'
        }),
    };
    var fakeCkiDatalayerConstants = require('test/constants/datalayer-cki-constants.json');
    var fakeCheckinAppConstants = {
        QUADRIGAM: {
            'SEARCH': 'IBCOSE',
            'LOGGED_SEARCH': 'IBCOSEII',
            'FLIGHTS_PASSENGERS': 'IBCOAC',
            'FLIGHTS_PASSENGERS_DUPLICATED': 'IBCOED',
            'FLIGHTS_PASSENGERS_PA': 'IBCOACPA',
            'APIS_PASSENGERS': 'IBCOACII',
            'FLY_NOW': 'IBFNPA',
            'FLIGHT_CONFIRMATION': 'IBFNCOPA',
            'UPGRADE': 'CKIANCUPP',
            'ANCILLARIES': 'CKIANC',
            'EARLY_ANCILLARIES': 'ECKIANC',
            'PAYMENTS': 'CKIANPURC',
            'BOARDING_CARDS': 'IBCOBP',
            'CKI_CONFIRMATION': 'IBCOCF',
            'PAYMENTS_PCC': 'IBPCC',
            'PAYMENTS_REJECTED': 'IBREJC',
            'PAYMENTS_DENIED': 'IBCCDN',
            'PAYMENTS_CANCELLED': 'IBCNCL',
            'UN_SEARCH': 'UNCOSE',
            'UN_RECOVERY': 'UNCOAC',
            'UN_CONFIRM': 'UNCONF',
            'DANGEROUS_OBJECTS_MODAL': 'CKDANG'
        },
        TITLE_PAGE: {
            'FLIGHTS_PASSENGERS': 'CKI_TITLE_PAGE_IBCOAC',
            'DANGEROUS_OBJECTS_MODAL': 'CKI_TITLE_PAGE_CKDANG'
        }
    };
    var fakeHealthDeclaration = {
        subtitle: '',
        claim: '',
        atentionText: '',
        conditions: [],
        check: ''
    };
    var fakeObject = {
        prefix: '(+34)',
        prefixAlt: '',
        telephone: '901 111 500',
        telephoneAlt: '',
        text: 'Reservas y Venta:',
        textAlt: '',
        timeText: '24h',
        healthDeclaration: fakeHealthDeclaration
    };
    var fake$uibModalInstance = {
        result: { 'then': function () { } },
        close: jasmine.createSpy(),
        dismiss: jasmine.createSpy()
    };
    var fakeDatalayerUtilsService = {
        sendDatalayerEvent: jasmine.createSpy().and.callFake(angular.noop),
        sendDatalayerModalEvent: jasmine.createSpy().and.callFake(angular.noop),
        updateDatalayerWithQuadrigam: jasmine.createSpy().and.callFake(angular.noop),
        removeDatalayerModalAttrs: jasmine.createSpy().and.callFake(angular.noop),
        updateDatalayerInfo: jasmine.createSpy().and.callFake(angular.noop),
    };
    var $fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter){
        var filterFunc = function () {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return label;
                };
                break;
            case 'literalFormatter':
                filterFunc = function (label) {
                    return label;
                };
                break;
            default:
                break;
        }
        return filterFunc;
    });
    var fakeTranslate = {
        onReady: jasmine.createSpy().and.callThrough()
    }
    const fakeDatalayerCKIService = {
        setProcessAndStep: jasmine.createSpy().and.callFake(angular.noop)
    };

    beforeEach(function () {
        angular.mock.module('ib-cki-modal-module', function ($provide) {
            $provide.value('CkiDatalayerConstants', fakeCkiDatalayerConstants);
            $provide.value('CheckinAppConstants', fakeCheckinAppConstants);
            $provide.value('CkiDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('$uibModalInstance', fake$uibModalInstance);
            $provide.value('$translate', fakeTranslate);
            $provide.value('$filter', $fakeFilter);
            $provide.value('object', fakeObject);
            $provide.value('IbUtilsService', fakeIbUtilsService);
            $provide.value('CkiDataLayerService', fakeDatalayerCKIService);
        });
        inject(function (_$controller_, _$rootScope_, _object_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            object = _object_;
            CheckinAppConstants = fakeCheckinAppConstants;

            controller = $controller('DangerousObjectsModalController', {
                $rootScope: $rootScope,
                $uibModalInstance: fake$uibModalInstance,
                $filter: $fakeFilter,
                $translate: fakeTranslate,
                object: fakeObject,
                CkiDatalayerUtilsService: fakeDatalayerUtilsService,
                CheckinAppConstants: fakeCheckinAppConstants,
                IbUtilsService: fakeIbUtilsService
            });
        });
    });

    describe('when activate() is called', function () {
        it('send Datalayer modal event and set model properties', function () {
            controller.$onInit();
            controller.model.healthDeclaration = fakeHealthDeclaration;
            expect(controller.model.dangerConditions).toBe(false);
            expect(controller.model.healthDeclaration).toBeDefined();
        });
        it('shold check prefix and telephone to form phoneNumber string', function () {
            controller.$onInit();
            controller.model.healthDeclaration = fakeHealthDeclaration;
            controller.model.prefix = '';
            controller.model.telephone = '';
            expect(controller.model.phoneNumber).toBeDefined();
        })
    });

    describe('when acceptAndContinue() is called', function () {
        it('should check if dangerousObjects and $valid true propertie ', function () {
            controller.dangerousObjects = {
                $valid: true,
                $submitted: false
            }
            controller.acceptAndContinue();
            expect(fake$uibModalInstance.close).toHaveBeenCalled();
        });
        it('should check false dangerousObjects ', function () {
            controller.close();
            expect(fake$uibModalInstance.dismiss).toHaveBeenCalled();
        });
    });
    describe('when close() is called', function () {
        it('close modal', function () {
            controller.close();
            expect(fake$uibModalInstance.dismiss).toHaveBeenCalled();
        });
    });

});
