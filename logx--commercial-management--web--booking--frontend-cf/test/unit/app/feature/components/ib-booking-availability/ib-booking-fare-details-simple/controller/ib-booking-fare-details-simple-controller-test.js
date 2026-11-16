import {StorageServiceMock} from '../../../../../../../mocks/Services/StorageServiceMock';
describe('BookingFareDetailsController Test', function () {
    var scope, controller, timeout, translateFilter;

    // fakeFareData = '';
    // fakeModelData = '';
    const fakeSessionStorage = new StorageServiceMock();

    var fakeConstanst= {
        FARE_CABIN_TYPE:{
            TURIST: 'E',
            BUSINESS_CLASS: 'B',
            TURIST_PREMIUM:'N',
            TURIST_PREMIUM_T:'T',
        },
        FARE_COMERCIAL_NAME_ES:{
            BASICA:'basica',
            OPTIMA: 'optima',
            CONFORT: 'confort',
            FLEXIBLE: 'flexible',
            OPTIMA_FLEXIBLE: 'optima-flex',
            TURISTA_PREMIUM_PROMOCIONAL: 'turista-premium-promocional',
            TURISTA_PREMIUM_FLEXIBLE: 'turista-premium-flexible',
            TURISTA_PREMIUM_PROMOCIONAL_FLEX:'turista-premium-promocional-flex',
            BUSINESS_PROMOCIONAL: 'business-promocional',
            BUSINESS_FLEXIBLE: 'business-flexible',
            BUSINESS_PROMOCIONAL_FLEX: 'business-promocional-flex'
        },
        dateLanguages: {
            EN: 'en',
            DE: 'de',
            PT: 'pt',
            NL: 'nl',
            FR: 'fr'
        }
    }
    let fakeNewMainHeaderFacade = {
        updateBasketFlexibilization: jasmine.createSpy('updateBasketFlexibilization'),
    };
    let fakeBookingModalService = {
        showBKIGenericModal: jasmine.createSpy('showBKIGenericModal')
    }
    let fakeCurrencyService = {

    };
    const elementMock = [
        {
            dispatchEvent: () => { },
            addEventListener: () => {}
        }

    ]
    beforeEach(function () {
        fakeSessionStorage.clear();
        angular.mock.module('ib-booking-fare-details-simple-module', 'ib-commons-filters-module','pascalprecht.translate', function ($provide) {
            $provide.value('BookingAppConstants', fakeConstanst);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            $provide.value('CommonsSessionStorageService', fakeSessionStorage);
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('$element', elementMock);
        });


        inject(function ($controller, $rootScope, $timeout, $filter) {
            scope = $rootScope.$new();
            timeout = $timeout;
            fakeSessionStorage.set('confirmationDigitalInfo',{Language: 'en'});

            controller = $controller('BookingFareDetailsController', {
                '$scope': scope
            });

            translateFilter = $filter('translate', {});

            scope.$digest();
        });

    });

    describe('When isFareSelected is called', function () {
        beforeEach(function () {
            fakeSessionStorage.set('ancOffers',true);
        });

        it(', is redemption and selectedSegmentIndex is not defined', function (done) {

            controller.redemption = true;
            spyOn(scope, '$emit');

            controller.isFareSelected();

            expect(scope.$emit).toHaveBeenCalledWith('selectedRedemptionFareFamily', undefined, undefined, 0);
            done();
        });

        it(', is redemption and selectedSegmentIndex is 10', function (done) {

            controller.selectedSegmentIndex = 10;
            controller.redemption = true;
            spyOn(scope, '$emit');

            controller.isFareSelected();

            expect(scope.$emit).toHaveBeenCalledWith('selectedRedemptionFareFamily', undefined, undefined, 10);
            done();
        });

        it(' and is not redemption', function (done) {

            controller.redemption = false;
            spyOn(scope, '$emit');

            controller.isFareSelected();

            expect(scope.$emit).toHaveBeenCalledWith('selectedFareFamily', undefined, undefined);
            done();
        });
    });

    describe('When openModalConditions is called', function () {
        it(' When openModalConditions is called', function (done) {

            var event = { preventDefault: function () { } };
            spyOn(scope, '$emit');

            controller.openModalConditions(event);

            expect(scope.$emit).toHaveBeenCalledWith('openFareModal', undefined);
            done();
        });
    });

    describe('When resizeFareDetailsBox is called', function () {
        it('', function (done) {

            var element = angular.element('<div style="color:red">');

            controller.resizeFareDetailsBox(element);
            timeout.flush();

            expect(element.attr('style')).toBe(undefined);
            done();
        });
    });

    describe('When getFareIcon is called', function () {
        it(' and type is CABINA', function (done) {

            var result = controller.getFareIcon('CABINA');

            expect(result).toBe('icon-navegador_avion');
            done();
        });

        it(' and type is EQMANO', function (done) {

            var result = controller.getFareIcon('EQMANO');

            expect(result).toBe('icon-e_equipaje');
            done();
        });
        it(' and type is EQPERSONAL', function (done) {

            var result = controller.getFareIcon('EQPERSONAL');

            expect(result).toBe('icon-equipaje-de-mano-mochila');
            done();
        });

        it(' and type is EQBODEGA', function (done) {

            var result = controller.getFareIcon('EQBODEGA');

            expect(result).toBe('icon-e_equipaje_facturado');
            done();
        });

        it(' and type is ASIENTO', function (done) {

            var result = controller.getFareIcon('ASIENTO');

            expect(result).toBe('icon-asiento-normal');
            done();
        });
        it(' and type is ASIENTO24H', function (done) {

            var result = controller.getFareIcon('ASIENTO24H');

            expect(result).toBe('icon-asiento-normal');
            done();
        });

        it(' and type is ASIENTOXL', function (done) {

            var result = controller.getFareIcon('ASIENTOXL');

            expect(result).toBe('icon-asiento-plus');
            done();
        });

        it(' and type is CAMBIO', function (done) {

            var result = controller.getFareIcon('CAMBIO');

            expect(result).toBe('icon-cambios_y_reembolsos');
            done();
        });

        it(' and type is REEMBOLSO', function (done) {

            var result = controller.getFareIcon('REEMBOLSO');

            expect(result).toBe('icon-reembolsos');
            done();
        });

        it(' and type is CHECKINDESK', function (done) {

            var result = controller.getFareIcon('CHECKINDESK');

            expect(result).toBe('icon-check_in');
            done();
        });

        it(' and type is SALAVIP', function (done) {

            var result = controller.getFareIcon('SALAVIP');

            expect(result).toBe('icon-sala_vip');
            done();
        });

        it(' and type is FASTTRACK', function (done) {

            var result = controller.getFareIcon('FASTTRACK');

            expect(result).toBe('icon-fast_track');
            done();
        });

        it(' and type is EMBARQUE', function (done) {

            var result = controller.getFareIcon('EMBARQUE');

            expect(result).toBe('icon-priority-boarding');
            done();
        });

        it(' and type is EQPPRIOR', function (done) {

            var result = controller.getFareIcon('EQPPRIOR');

            expect(result).toBe('icon-e_facturacion_prioritaria');
            done();
        });

        it(' and type is COMIDA', function (done) {

            var result = controller.getFareIcon('COMIDA');

            expect(result).toBe('icon-c_comidas_nuevas');
            done();
        });


        it(' and type is TARJEMBANTIC', function (done) {

            var result = controller.getFareIcon('TARJEMBANTIC');

            expect(result).toBe('icon-tarjeta_de_embarque');
            done();
        });
    });



    describe('When getFareSubCodeClass is called', function () {
        it('and code includes CA_1 PERM', function (done) {
            const response = controller.getFareSubCodeClass('CA_1 PERM');

            expect(response).toEqual('ib-list-icon-fare__item--tick');
            done();
        });
        it('and code includes CA_CAMBIO CON PENALTY', function (done) {
            const response = controller.getFareSubCodeClass('CA_CAMBIO CON PENALTY');

            expect(response).toEqual('ib-list-icon-fare__item--with-penalty');
            done();
        });
        it('and code includes CA_CAMBIO DOBLE', function (done) {
            const response = controller.getFareSubCodeClass('CA_CAMBIO DOBLE');

            expect(response).toEqual('ib-list-icon-fare__item--with-penalty');
            done();
        });
        it('and code includes CA_CAMBIO ESTUDIANTE EMBAJADA', function (done) {
            const response = controller.getFareSubCodeClass('CA_CAMBIO ESTUDIANTE EMBAJADA');

            expect(response).toEqual('ib-list-icon-fare__item--tick');
            done();
        });
        it('and code includes CA_CAMBIO GRATUITO ERASMUS', function (done) {
            const response = controller.getFareSubCodeClass('CA_CAMBIO GRATUITO ERASMUS');

            expect(response).toEqual('ib-list-icon-fare__item--tick');
            done();
        });
        it('and code includes CA_CAMBIO JOVEN', function (done) {
            const response = controller.getFareSubCodeClass('CA_CAMBIO JOVEN');

            expect(response).toEqual('ib-list-icon-fare__item--with-penalty');
            done();
        });
        it('and code includes CA_CAMBIO PERMITIDO_LEVEL_NO_SHOW_NO', function (done) {
            const response = controller.getFareSubCodeClass('CA_CAMBIO PERMITIDO_LEVEL_NO_SHOW_NO');

            expect(response).toEqual('ib-list-icon-fare__item--tick');
            done();
        });
        it('and code includes CA_CAMBIO SIEMPRE', function (done) {
            const response = controller.getFareSubCodeClass('CA_CAMBIO SIEMPRE');

            expect(response).toEqual('ib-list-icon-fare__item--tick-active');
            done();
        });
        it('and code includes CA_CAMBIOS NO PERMITIDOS O CON PENALTY', function (done) {
            const response = controller.getFareSubCodeClass('CA_CAMBIOS NO PERMITIDOS O CON PENALTY');

            expect(response).toEqual('ib-list-icon-fare__item--with-penalty');
            done();
        });
        it('and code includes CA_CAMBIOS NO PERMITIDOS', function (done) {
            const response = controller.getFareSubCodeClass('CA_CAMBIOS NO PERMITIDOS');

            expect(response).toEqual('ib-list-icon-fare__item--cancel');
            done();
        });
        it('and code includes CA_CAMBIOS PERMITIDOS_NO_SHOW', function (done) {
            const response = controller.getFareSubCodeClass('CA_CAMBIOS PERMITIDOS_NO_SHOW');

            expect(response).toEqual('ib-list-icon-fare__item--tick');
            done();
        });
        it('and code includes CA_CAMBIOS PERMITIDOS', function (done) {
            const response = controller.getFareSubCodeClass('CA_CAMBIOS PERMITIDOS');

            expect(response).toEqual('ib-list-icon-fare__item--with-penalty');
            done();
        });
        it('and code includes CA_REEMBOLSO CON PENALTY', function (done) {
            const response = controller.getFareSubCodeClass('CA_REEMBOLSO CON PENALTY');

            expect(response).toEqual('ib-list-icon-fare__item--with-penalty');
            done();
        });
        it('and code includes CA_REEMBOLSO ESTUDIANTE EMBAJADA', function (done) {
            const response = controller.getFareSubCodeClass('CA_REEMBOLSO ESTUDIANTE EMBAJADA');

            expect(response).toEqual('ib-list-icon-fare__item--with-penalty');
            done();
        });
        it('and code includes CA_REEMBOLSO NO PERMITIDO O CON PENALTY', function (done) {
            const response = controller.getFareSubCodeClass('CA_REEMBOLSO NO PERMITIDO O CON PENALTY');

            expect(response).toEqual('ib-list-icon-fare__item--with-penalty');
            done();
        });
        it('and code includes CA_REEMBOLSO NO PERMITIDO', function (done) {
            const response = controller.getFareSubCodeClass('CA_REEMBOLSO NO PERMITIDO');

            expect(response).toEqual('ib-list-icon-fare__item--cancel');
            done();
        });
        it('and code includes CA_REEMBOLSO SIEMPRE_NO_SHOW', function (done) {
            const response = controller.getFareSubCodeClass('CA_REEMBOLSO SIEMPRE_NO_SHOW');

            expect(response).toEqual('ib-list-icon-fare__item--tick');
            done();
        });
        it('and code includes CA_REEMBOLSO SIEMPRE', function (done) {
            const response = controller.getFareSubCodeClass('CA_REEMBOLSO SIEMPRE');

            expect(response).toEqual('ib-list-icon-fare__item--tick-active');
            done();
        });
        it('and code includes CCA_REEMBOLSO_PERMITIDO_LEVEL_NO_SHOW_NO', function (done) {
            const response = controller.getFareSubCodeClass('CCA_REEMBOLSO_PERMITIDO_LEVEL_NO_SHOW_NO');

            expect(response).toEqual('ib-list-icon-fare__item--tick');
            done();
        });
        it('and code includes CA_REEMBOLSOS_PERMITIDOS_BD_NO_SHOW_NO_PERMITIDO', function (done) {
            const response = controller.getFareSubCodeClass('CA_REEMBOLSOS_PERMITIDOS_BD_NO_SHOW_NO_PERMITIDO');

            expect(response).toEqual('ib-list-icon-fare__item--tick');
            done();
        });
    });
});
