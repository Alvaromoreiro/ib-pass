// import {ibBookingLocalDiscountSelector} from '@src/app/features/components/ib-booking-availability/ib-booking-local-discunts-selector/ib-booking-local-discount-selector';
import angular from 'angular';
describe('ibBookingLocalDiscountSelector test', () => {
    let controller, scope;
    let controllerDependencies = {

        location:{},
        scope: {},
        rootScope:''
    };

    let bindings = {
    };

    const fakeBookingLocalDiscountsService = {
        getDiscountsConfig: jasmine.createSpy('getDiscountsConfig').and.returnValue({
            resident:{
                title:'',
                selected: '',
                items:[{value:'BP'}]
            },
            largeFamily:{
                title:'',
                selected: '',
                items:[{value:'RC'}]
            }
        }),
        getResidentsDiscountsForRoute: jasmine.createSpy('getResidentsDiscountsForRoute')
    }


    const fakeBookingLocalDiscountSelectorService = {
        updateResidentDiscountCookie: jasmine.createSpy('updateResidentDiscountCookie'),
        updateFamilyDiscountCookie: jasmine.createSpy('updateFamilyDiscountCookie'),
        updateURLWithDiscounts: jasmine.createSpy('updateURLWithDiscounts')
    }

    beforeEach(() =>{
        angular.mock.module('ib-booking-local-discount-selector-module', ($provide) => {
            $provide.value('BookingLocalDiscountsService', fakeBookingLocalDiscountsService);
            $provide.value('BookingLocalDiscountSelectorService', fakeBookingLocalDiscountSelectorService);

        });
        inject((_$componentController_,$rootScope) =>{
            scope = $rootScope.$new();
            controllerDependencies.scope = scope;
            controllerDependencies.rootScope = $rootScope;
            controller = _$componentController_('ibBookingLocalDiscountSelector', controllerDependencies, bindings);
            $rootScope.$digest();
            scope.$apply();
            // controllerDependencies.scope.$apply();
        });

    });

    describe('When controller is called ', () =>{
        beforeEach(() =>{
            fakeBookingLocalDiscountsService.getResidentsDiscountsForRoute = jasmine.createSpy('getResidentsDiscountsForRoute').and.returnValue(['BP','RC'])
        })
        it(', it will be defined', () =>{
            controller.residentCodeSelected = 'BP';
            controller.familyCodeSelected = 'RC';
            controller.$onInit();
            expect(controller).toBeDefined();
        });
        it(', it will have one discount', () =>{
            fakeBookingLocalDiscountsService.getResidentsDiscountsForRoute = jasmine.createSpy('getResidentsDiscountsForRoute').and.returnValue(['BP'])
            controller.residentCodeSelected = 'BP';
            controller.familyCodeSelected = 'RC';
            controller.$onInit();
            expect(controller.isResident).toBeTruthy();
        });
        it(', it will not have any discount', () =>{
            fakeBookingLocalDiscountsService.getResidentsDiscountsForRoute = jasmine.createSpy('getResidentsDiscountsForRoute').and.returnValue([])
            controller.residentCodeSelected = 'BP';
            controller.familyCodeSelected = 'RC';
            controller.$onInit();
            expect(controller.availableResidentDisc ).toBeFalsy();
        });
    });
    const setRouteDiscounts = (values = ['BP', 'RC']) => {
        fakeBookingLocalDiscountsService.getResidentsDiscountsForRoute = jasmine
            .createSpy('getResidentsDiscountsForRoute')
            .and.returnValue(values);
    };

    describe('When discounts change ', () => {
        const changeCases = [
            {
                label: 'updates resident discount',
                change: (ctrl) => ctrl.residentDiscountsChange('BP'),
                expectedResident: 'BP',
                expectedFamily: 'RC',
                cookieSpy: 'updateResidentDiscountCookie',
                cookieArg: 'BP'
            },
            {
                label: 'updates family discount',
                change: (ctrl) => ctrl.familyDiscountsChange('RX'),
                expectedResident: 'BC',
                expectedFamily: 'RX',
                cookieSpy: 'updateFamilyDiscountCookie',
                cookieArg: 'RX'
            }
        ];

        beforeEach(() => setRouteDiscounts(['BP', 'RC']));

        changeCases.forEach(({ label, change, expectedResident, expectedFamily, cookieSpy, cookieArg }) => {
            it(`, ${label}`, () => {
                controller.residentCodeSelected = 'BC';
                controller.familyCodeSelected = 'RC';
                controller.familyDiscounts = { selected: { value: 'RC', description: '' }, title: '', items: [] };

                change(controller);

                expect(controller.residentCodeSelected).toEqual(expectedResident);
                expect(controller.familyCodeSelected).toEqual(expectedFamily);
                expect(fakeBookingLocalDiscountSelectorService.updateURLWithDiscounts)
                    .toHaveBeenCalledWith(expectedResident, expectedFamily);
                expect((fakeBookingLocalDiscountSelectorService as any)[cookieSpy]).toHaveBeenCalledWith(cookieArg);
            });
        });
    });
});
