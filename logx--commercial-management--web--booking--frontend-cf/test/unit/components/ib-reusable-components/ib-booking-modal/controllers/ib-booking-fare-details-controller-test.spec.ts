import angular from 'angular';

describe('FareModalController test', () => {
    let controller,rootScope, scope;
    const controllerDependencies = {
        $scope: {},
        $rootScope: {newFare:'',$broadcast:()=>{}},
        filter: {},
        window:{}
    };

    const fakeUibModalInstance = {
        dismiss: jasmine.createSpy('dismiss'),
        close: jasmine.createSpy('close'),
        result: Promise.resolve()
    }
    const fakeUibModalStack = {
        dismissAll: jasmine.createSpy('dismissAll'),
    }

    const fakeDatalayerUtilsService = {
        sendDatalayerEvent: jasmine.createSpy('sendDatalayerEvent'),
        setProcessAndStep: jasmine.createSpy('setProcessAndStep'),
        sendDatalayerModalEvent: jasmine.createSpy('sendDatalayerModalEvent'),
    };

    const fakeBookingRedirectionService = {
        externalRedirect : jasmine.createSpy('externalRedirect')
    }

    const fakeCurrencyService = {
        formatPrice: jasmine.createSpy('formatPrice'),
        getCurrencyObject: jasmine.createSpy('getCurrencyObject'),
    }
    const fakeObject = {
        selectedFareInfo:{
            cabinType:'E'
        },
        fareFamilyConditions:{
            faresInfo:[{
                commercialCode:'Básica',
                cabinType:'E'
            }]
        }
    }

    const mockLinksFilterFilter = function () {
        return '';
    }

    const fakeLiteralFormatterFilter =  () =>{
        return '';
    }
    const fakeTranslateFilter =  () =>{
        return '';
    }

    beforeEach(() => {
        angular.mock.module('ib-booking-modal-module', ($provide) => {
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('$uibModalInstance', fakeUibModalInstance);
            $provide.value('$uibModalStack', fakeUibModalStack);
            $provide.value('BookingRedirectionService', fakeBookingRedirectionService);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('object', fakeObject);
            $provide.value('literalFormatterFilter', fakeLiteralFormatterFilter);
            $provide.value('translateFilter', fakeTranslateFilter);
            $provide.value('LinksFilterFilter', mockLinksFilterFilter);
        });

        inject(($controller, _$rootScope_,object,$filter,$window) => {
            rootScope = _$rootScope_;
            scope = _$rootScope_.$new();
            controllerDependencies.$scope = scope;
            controllerDependencies.$rootScope = rootScope;
            controllerDependencies.filter = $filter;
            controllerDependencies.window = $window;
            controllerDependencies.$rootScope.newFare = 'prueba';
            sessionStorage.setItem('ib-booking-app.selectedTripInfo','[{"info":{"cabins":[{"fareFamilies":[{"commercialName":"Básica", "farePriceToCalculate":"5"},{"commercialName":"Óptima", "farePriceToCalculate":"5"}]}]}}]');
            sessionStorage.setItem('ib-booking-app.commercialData','{"currency": "€"}');
            controller = $controller('FareModalController', controllerDependencies);
            scope.$digest();
        });

    });
    describe('when activate() is called ', () => {
        beforeEach(() => {
        });
        it('it will create a modal', () => {
            expect(controller).toBeDefined();
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
        });
    });
    describe('when closeModal() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            controller.close();
            expect(fakeUibModalStack.dismissAll).toHaveBeenCalled();
        });
    });
    describe('when acceptModal() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            controller.accept('prueba');
            expect(fakeUibModalInstance.close).toHaveBeenCalledWith('prueba');
        });
    });
    describe('when recoverMainPage() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            controller.return();
            expect(fakeBookingRedirectionService.externalRedirect).toHaveBeenCalled();
        });
    });
    describe('when findFareDetail() is called ', () => {
        beforeEach(() => {
        });
        it('and it is combo 1', () => {
            controller.findFareDetail('prueba',1);
            expect(controller.model.comboFirst).toEqual('prueba');
        });
        it('and it is combo 2', () => {
            controller.findFareDetail('prueba',2);
            expect(controller.model.comboSecond).toEqual('prueba');
        });
        it('and it is combo 0', () => {
            controller.findFareDetail('prueba',0);
            expect(controller.model.comboFirst).toEqual('prueba');
        });
    });
});
