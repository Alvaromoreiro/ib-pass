import { BookingAvailabilityConstants } from '@core/constants/ib-booking-availability-constants';
import angular from 'angular';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';


describe('BKIGenericModalController test', () => {
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
        commercialName:'Básica',
        cabinType:0
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
    const fakeSessionStorageService  =  new StorageServiceMock();

    beforeEach(() => {
        angular.mock.module('ib-booking-modal-module', ($provide) => {
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('$uibModalInstance', fakeUibModalInstance);
            $provide.value('BookingRedirectionService', fakeBookingRedirectionService);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('object', fakeObject);
            $provide.value('literalFormatterFilter', fakeLiteralFormatterFilter);
            $provide.value('translateFilter', fakeTranslateFilter);
            $provide.value('LinksFilterFilter', mockLinksFilterFilter);
            $provide.value('BookingAvailabilityConstants', BookingAvailabilityConstants);
            $provide.value('CommonsSessionStorageService', fakeSessionStorageService);
        });

        inject(($controller, _$rootScope_,object,$filter,$window) => {
            rootScope = _$rootScope_;
            scope = _$rootScope_.$new();
            controllerDependencies.$scope = scope;
            controllerDependencies.$rootScope = rootScope;
            controllerDependencies.filter = $filter;
            controllerDependencies.window = $window;
            controllerDependencies.$rootScope.newFare = 'prueba';
            fakeSessionStorageService.set('ib-booking-app.selectedTripInfo',[{"info":{"cabins":[{"fareFamilies":[{"commercialName":"Básica", "farePriceToCalculate":"5"},{"commercialName":"Óptima", "farePriceToCalculate":"5"}]}]}}]);
            fakeSessionStorageService.set('ib-booking-app.commercialData',{"currency": "€"});
            controller = $controller('BKIGenericModalController', controllerDependencies);
            scope.$digest();
        });

    });
    describe('when activate() is called and controller is created', () => {
        beforeEach(() => {
        });
        it(', a modal will be created and it is Básica commercialName', () => {
            fakeSessionStorageService.set('ib-booking-app.selectedTripInfo',[{"info":{"cabins":[{"fareFamilies":[{"commercialName":"Básica", "farePriceToCalculate":"5"},{"commercialName":"Óptima", "farePriceToCalculate":"5"}]}]}},{"info":{"cabins":[{"fareFamilies":[{"commercialName":"Básica", "farePriceToCalculate":"5"},{"commercialName":"Óptima", "farePriceToCalculate":"5"}]}]}}]);
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
            expect(controller.fareBannerText).toEqual('');
        });
        it(', a modal will be created and it is Optima commercialName', () => {
            controller.model.commercialNameES = 'Óptima';
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
            expect(controller.fareBannerText).toEqual('');
        });
        it(', a modal will be created and it is Confort commercialName', () => {
            controller.model.commercialNameES = 'Confort';
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
            expect(controller.fareBannerText).toEqual('');
        });
        it(', a modal will be created and it is Óptima Flex commercialName', () => {
            controller.model.commercialNameES = 'Óptima Flex';
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
            expect(controller.fareBannerText).toEqual('');
        });
        it(', a modal will be created and it is Turista Premium Óptima commercialName', () => {
            controller.model.commercialNameES = 'Turista Premium Óptima';
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
            expect(controller.fareBannerText).toEqual('');
        });
        it(', a modal will be created and it is Turista Premium Óptima Flex commercialName', () => {
            controller.model.commercialNameES = 'Turista Premium Óptima Flex';
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
            expect(controller.fareBannerText).toEqual('');
        });
        it(', a modal will be created and it is Turista Premium Promocional commercialName', () => {
            controller.model.commercialNameES = 'Turista Premium Promocional';
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
            expect(controller.fareBannerText).toEqual('');
        });
        it(', a modal will be created and it is Turista Premium Promocional Flex commercialName', () => {
            controller.model.commercialNameES = 'Turista Premium Promocional Flex';
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
            expect(controller.fareBannerText).toEqual('');
        });
        it(', a modal will be created and it is Business Óptima commercialName', () => {
            controller.model.commercialNameES = 'Business Óptima';
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
            expect(controller.fareBannerText).toEqual('');
        });
        it(', a modal will be created and it is Business Confort commercialName', () => {
            controller.model.commercialNameES = 'Business Confort';
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
            expect(controller.fareBannerText).toEqual('');
        });
        it(', a modal will be created and it is Business Promocional commercialName', () => {
            controller.model.commercialNameES = 'Business Promocional';
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
            expect(controller.fareBannerText).toEqual('');
        });
        it(', a modal will be created and it is Business Promocional Flex commercialName', () => {
            controller.model.commercialNameES = 'Business Promocional Flex';
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
            expect(controller.fareBannerText).toEqual('');
        });
    });
    describe('when getFareSubCodeClassModal() is called ', () => {
        beforeEach(() => {
        });
        it('and it will return a css class if code is CA_1 PERM', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_1 PERM'])
            expect(returnValue).toEqual('ib-list-fares__icon--tick icon-circle-check');
        });
        it('and it will return a css class if code is CA_CAMBIO CON PENALTY', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_CAMBIO CON PENALTY'])
            expect(returnValue).toEqual('ib-list-fares__icon--with-penalty icon-reembolsos-old');
        });
        it('and it will return a css class if code is CA_CAMBIO DOBLE', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_CAMBIO DOBLE'])
            expect(returnValue).toEqual('ib-list-fares__icon--with-penalty icon-reembolsos-old');
        });
        it('and it will return a css class if code is CA_CAMBIO ESTUDIANTE EMBAJADA', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_CAMBIO ESTUDIANTE EMBAJADA'])
            expect(returnValue).toEqual('ib-list-fares__icon--tick icon-circle-check');
        });
        it('and it will return a css class if code is CA_CAMBIO GRATUITO ERASMUS', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_CAMBIO GRATUITO ERASMUS'])
            expect(returnValue).toEqual('ib-list-fares__icon--tick icon-circle-check');
        });
        it('and it will return a css class if code is CA_CAMBIO JOVEN', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_CAMBIO JOVEN'])
            expect(returnValue).toEqual('ib-list-fares__icon--with-penalty icon-reembolsos-old');
        });
        it('and it will return a css class if code is CA_CAMBIO PERMITIDO_LEVEL_NO_SHOW_NO', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_CAMBIO PERMITIDO_LEVEL_NO_SHOW_NO'])
            expect(returnValue).toEqual('ib-list-fares__icon--tick icon-circle-check');
        });
        it('and it will return a css class if code is CA_CAMBIO SIEMPRE', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_CAMBIO SIEMPRE'])
            expect(returnValue).toEqual('ib-list-fares__icon--tick-active icon-circle-check');
        });
        it('and it will return a css class if code is CA_CAMBIOS NO PERMITIDOS O CON PENALTY', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_CAMBIOS NO PERMITIDOS O CON PENALTY'])
            expect(returnValue).toEqual('ib-list-fares__icon--with-penalty icon-reembolsos-old');
        });
        it('and it will return a css class if code is CA_CAMBIOS NO PERMITIDOS', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_CAMBIOS NO PERMITIDOS'])
            expect(returnValue).toEqual('ib-list-fares__icon--cancel icon-wrong');
        });
        it('and it will return a css class if code is CA_CAMBIOS PERMITIDOS_NO_SHOW', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_CAMBIOS PERMITIDOS_NO_SHOW'])
            expect(returnValue).toEqual('ib-list-fares__icon--tick icon-circle-check');
        });
        it('and it will return a css class if code is CA_CAMBIOS PERMITIDOS', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_CAMBIOS PERMITIDOS'])
            expect(returnValue).toEqual('ib-list-fares__icon--with-penalty icon-reembolsos-old');
        });
        it('and it will return a css class if code is CA_REEMBOLSO CON PENALTY', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_REEMBOLSO CON PENALTY'])
            expect(returnValue).toEqual('ib-list-fares__icon--with-penalty icon-reembolsos-old');
        });
        it('and it will return a css class if code is CA_REEMBOLSO ESTUDIANTE EMBAJADA', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_REEMBOLSO ESTUDIANTE EMBAJADA'])
            expect(returnValue).toEqual('ib-list-fares__icon--with-penalty icon-reembolsos-old');
        });
        it('and it will return a css class if code is CA_REEMBOLSO NO PERMITIDO O CON PENALTY', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_REEMBOLSO NO PERMITIDO O CON PENALTY'])
            expect(returnValue).toEqual('ib-list-fares__icon--with-penalty icon-reembolsos-old');
        });
        it('and it will return a css class if code is CA_REEMBOLSO NO PERMITIDO', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_REEMBOLSO NO PERMITIDO'])
            expect(returnValue).toEqual('ib-list-fares__icon--cancel icon-wrong');
        });
        it('and it will return a css class if code is CA_REEMBOLSO SIEMPRE_NO_SHOW', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_REEMBOLSO SIEMPRE_NO_SHOW'])
            expect(returnValue).toEqual('ib-list-fares__icon--tick icon-circle-check');
        });
        it('and it will return a css class if code is CA_REEMBOLSO SIEMPRE', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_REEMBOLSO SIEMPRE'])
            expect(returnValue).toEqual('ib-list-fares__icon--tick-active icon-circle-check');
        });
        it('and it will return a css class if code is CA_REEMBOLSO_PERMITIDO_LEVEL_NO_SHOW_NO', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_REEMBOLSO_PERMITIDO_LEVEL_NO_SHOW_NO'])
            expect(returnValue).toEqual('ib-list-fares__icon--tick icon-circle-check');
        });
        it('and it will return a css class if code is CA_REEMBOLSOS_PERMITIDOS_BD_NO_SHOW_NO_PERMITIDO', () => {
            let returnValue = controller.getFareSubCodeClassModal(['CA_REEMBOLSOS_PERMITIDOS_BD_NO_SHOW_NO_PERMITIDO'])
            expect(returnValue).toEqual('ib-list-fares__icon--tick icon-circle-check');
        });
    });
    describe('when clickNextFare() is called ', () => {
        beforeEach(() => {
        });
        it('and it call isFareSelectedEvent', () => {
            spyOn(controllerDependencies.$rootScope, '$broadcast');
            controller.clickNextFare()
            expect(controllerDependencies.$rootScope.$broadcast).toHaveBeenCalled();
        });
        it('and it call isFareSelectedEvent', () => {
            fakeSessionStorageService.set('ib-booking-app.selectedTripInfo',[{"info":{"cabins":[{"fareFamilies":[{"commercialName":"Básica", "farePriceToCalculate":"5"},{"commercialName":"Óptima", "farePriceToCalculate":"5"}]}]}},{"info":{"cabins":[{"fareFamilies":[{"commercialName":"Básica", "farePriceToCalculate":"5"},{"commercialName":"Óptima", "farePriceToCalculate":"5"}]}]}}])
            spyOn(controllerDependencies.$rootScope, '$broadcast');
            controller.clickNextFare()
            expect(controllerDependencies.$rootScope.$broadcast).toHaveBeenCalled();
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
    describe('when enablePassengerWarning() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            spyOn(controllerDependencies.$rootScope, '$broadcast');
            controller.enableWarning();
            expect(controllerDependencies.$rootScope.$broadcast).toHaveBeenCalled();
        });
    });
    describe('when closeModal() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            controller.close();
            expect(fakeUibModalInstance.dismiss).toHaveBeenCalled();
        });
    });
    describe('when acceptModal() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            controller.accept();
            expect(fakeUibModalInstance.close).toHaveBeenCalled();
        });
    });
    describe('when acceptBuyAvios() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            controller.acceptBuyAvios();
            expect(fakeBookingRedirectionService.externalRedirect).toHaveBeenCalled();
        });
    });
    xdescribe('when getFareFamilyIcon() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            let returnValue = controller.getFareFamilyIcon(0);
            expect(returnValue).toEqual(null);
        });
    });
    describe('when openModalConditionsEvent() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            spyOn(controllerDependencies.$rootScope, '$broadcast');
            controller.openModalConditionsEvent();
            expect(controllerDependencies.$rootScope.$broadcast).toHaveBeenCalled();
        });
    });
});
