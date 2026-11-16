describe('AnonymousSearchController test', () => {

    let $rootScope, $scope, AnonymousSearchModel, localStorageService, controller;

    beforeEach(() => {
        angular.mock.module('ib-anonymous-search-module', 'LocalStorageModule', () => {});
        inject((_$controller_, _$rootScope_, _AnonymousSearchModel_,  _localStorageService_) => {
            AnonymousSearchModel = _AnonymousSearchModel_;
            localStorageService = _localStorageService_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();

            controller = _$controller_('AnonymousSearchController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });
    });

    it('initializeModel exists', () => {
        expect(AnonymousSearchModel.surname).toEqual('');
        expect(AnonymousSearchModel.pnr).toEqual('');
        expect(AnonymousSearchModel.isAirShuttle).toBeFalsy();
    });

    describe('when activate() function is called', () => {
        let sameCase = (pnr) => {
            localStorageService.set('confirmationPNR', true);
            localStorageService.set('pnrSurname', 'MY86G');
            localStorageService.set('PNR', pnr);
            controller.$onInit();
            expect(controller.model.surname).toBe('MY86G');
            expect(controller.model.isAirShuttle).toBe(false);
        };
        it('should initialize properties correctly', () => {
            sameCase('test');
            expect(controller.model.pnr).toBe('test');
            expect(controller.getPNRLength()).toEqual(6);
        });
        it('should initialize properties correctly pnr.length > 7', () => {
            sameCase('testtesttesttest');
            expect(controller.model.pnr).toBe('testtesttesttest');
            expect(controller.getPNRLength()).toEqual(14);
        });
        it('should return the correct value with empty', () => {
            localStorageService.set('confirmationPNR', false);
            controller.$onInit();
            expect(controller.model.surname).toBe('');
            expect(controller.model.pnr).toBe('');
            expect(controller.getPNRLength()).toEqual(14);
        });
    });

    describe('when removeCustomizeFlight() function is called', () => {
        it('should remove customizeFlight from localStorage', () => {
            localStorageService.set('customizeFlight', 'test');
            controller.removeCustomizeFlight();
            expect(localStorageService.get('customizeFlight')).toBe(null);
        });
    });

    describe('when initBooking() function is called', () => {
        it('if form is valid, emit event with correct object values, submitted value is false', () => {
            controller.currentForm = { $valid: true };
            controller.initBooking(controller.currentForm);
            expect(controller.currentForm.$submitted).toBe(false);
        });
    });

    describe('when openGenericModal() function is called', () => {
        it('emit event with correct object values', () => {
            controller.openGenericModal('md', 'test', false);
        });
    });
});
