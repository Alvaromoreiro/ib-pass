import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import angular from 'angular';
describe('BookingAncOffersController test', () => {

    let scope;
    let controllerDependencies = {
        $scope : {
            $apply: ()=>{},
            $emit: (event:string, ...args)=>{},
            $on:(event:string, ...args)=>{},
            $broadcast:(event:string, ...args)=>{}
        },
        $rootScope:{
            $broadcast:(event:string, ...args)=>{}
        }
    };
    let controller;
    let fakeSessionStorage = new StorageServiceMock();
    const fakeCurrencyService = {
        formatPrice: jasmine.createSpy('formatPrice'),
        getCurrencyObject: jasmine.createSpy('getCurrencyObject'),
        formatAvios: jasmine.createSpy('formatAvios')
    };
    const fakeBookingModalService = {
        showGenericModal: jasmine.createSpy('showGenericModal'),
        showGenericError: jasmine.createSpy('showGenericError')
    };
    const fakeNewMainHeaderFacade = {
        updateBasketFlexibilization: jasmine.createSpy('updateBasketFlexibilization')
    };
    const fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function (label) {
            return label;
        };
        switch (filter) {
                case 'translate':
                    filterFunc = function (label) {
                        return label;
                    };
                    break;
                case 'EliminateAccentFilter':
                    filterFunc = (label:string):string => {
                        label = label.replace(/[áàäâÁÀÄÂ]/g, 'a');
                        label = label.replace(/[éèëêÉÈËÊ]/g, 'e');
                        label = label.replace(/[íìïîÍÌÏÎ]/g, 'i');
                        label = label.replace(/[óòöôÓÒÖÔ]/g, 'o');
                        label = label.replace(/[úùüûÚÙÜÛ]/g, 'u');
                        label = label.replace(/[ñÑ]/g, 'n');
                        label = label.replace(/(\s)/g, '-');
                        return label.toLowerCase();
                    };

                    break;
                default:
                    break;
        }

        return filterFunc;
    });

    beforeEach(() =>{
        const moduleName = 'ib-booking-ancillaries-offers-module';
        angular.mock.module(moduleName, ($provide) => {
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('localStorageService', fakeSessionStorage);
            $provide.value('CommonsSessionStorageService', fakeSessionStorage);
            $provide.value('$filter', fakeFilter);
        });
        inject(($controller, $rootScope) =>{
            scope = $rootScope.$new();
            controllerDependencies.$scope = scope;
            controllerDependencies.$rootScope = $rootScope;
            fakeSessionStorage.set('commercialData', {currency:{symbol:'€'}});
            controller = $controller('BookingAncOffersController', controllerDependencies);
            scope.$digest();
        });
    });

    describe('When controller is called ', () =>{
        beforeEach(()=>{
            fakeSessionStorage.set('headerModel', {headerModel:{shoppingBasket:{total:{totalPrice:5}}}});
        });
        it('it will be defined', () =>{
            expect(controller).toBeDefined();
        });
        it('it will call onInit', () =>{
            const expectedTotals = [5, 10, 12.75];
            controller.$onInit();
            expect(controller.totals).toEqual(expectedTotals);
        });
    });
    describe('When emptyFlex is called ', () =>{
        beforeEach(()=>{
        });
        it('it will define selectedFare to empty', () =>{
            const eventName = 'emptyFlex';
            const expectedSelectedFare = [false, false, false, true];
            controllerDependencies.$scope.$broadcast(eventName, {});
            expect(controller.selectedFare).toEqual(expectedSelectedFare);
        });

    });
    describe('When selectFlex is called ', () =>{
        beforeEach(()=>{
            fakeSessionStorage.set('headerModel', {headerModel:{shoppingBasket:{total:{totalPrice:5, formatted:'5€'}, currency:'€'}}});
        });

        const selectFlexTestCases = [
            {
                flexType: 'FLIGHT_CHANGE',
                expectedResponse: {
                    description: 'ANCILLARIES_FLEXIBILITY_FLIGHT_CHANGE_TITLE',
                    passengerPrices: [{id: 'ADULT_01'}],
                    percentage: 80,
                    status: { code: 'AVAILABLE', reason: null },
                    subtype: 'FLIGHT_CHANGE'
                }
            },
            {
                flexType: 'VOUCHER_REFUND',
                expectedResponse: {
                    description: 'ANCILLARIES_FLEXIBILITY_VOUCHER_REFUND_CHANGE_TITLE',
                    passengerPrices: [{id: 'ADULT_01'}],
                    percentage: 80,
                    status: { code: 'AVAILABLE', reason: null },
                    subtype: 'VOUCHER_REFUND'
                }
            },
            {
                flexType: 'PACK_FLEX',
                expectedResponse: {
                    description: 'ANCILLARIES_FLEXIBILITY_PACK_FLEXIBILITY',
                    passengerPrices: [{id: 'ADULT_01'}],
                    percentage: 80,
                    status: { code: 'AVAILABLE', reason: null },
                    subtype: 'FLEXIBILITY_PACK'
                }
            }
        ];

        selectFlexTestCases.forEach(({ flexType, expectedResponse }) => {
            it(`it will select a ${flexType} ancillary`, () => {
                const storageKey = 'selectedFlex';
                controller.selectFlex(flexType);
                expect(fakeSessionStorage.get(storageKey)).toEqual(expectedResponse);
            });
        });
    });
    describe('When deleteFlex is called ', () =>{
        beforeEach(()=>{
            fakeSessionStorage.set('headerModel', {headerModel:{shoppingBasket:{total:{totalPrice:5, formatted:'5€'}, currency:'€'}}});
        });
        it('it will define selectedFare to empty', () =>{
            const selectedFlexKey = 'selectedFlex';
            const emptyFlexEvent = 'emptyFlex';
            const fareSelectedEvent = 'isFareSelectedAncOffers';
            fakeSessionStorage.set(selectedFlexKey, 'filled');
            spyOn(controllerDependencies.$rootScope, '$broadcast');
            controller.deleteFlex();
            expect(controllerDependencies.$rootScope.$broadcast).toHaveBeenCalledWith(emptyFlexEvent);
            expect(controllerDependencies.$rootScope.$broadcast).toHaveBeenCalledWith(fareSelectedEvent, false);
            expect(fakeSessionStorage.get(selectedFlexKey)).toBeFalsy();
        });
    });
    describe('When openModal is called ', () =>{
        beforeEach(()=>{
            fakeBookingModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(()=>{
                return {result: Promise.resolve('')};
            });
        });
        it('it will open generic modal', () =>{
            const template = 'template';
            const cssClass = 'classTpl';
            const mockEvent = {key:'1', keyCode:1, preventDefault:()=>null};
            controller.openModal(template, cssClass, mockEvent);
            expect(fakeBookingModalService.showGenericModal).toHaveBeenCalled();
        });
    });
});

