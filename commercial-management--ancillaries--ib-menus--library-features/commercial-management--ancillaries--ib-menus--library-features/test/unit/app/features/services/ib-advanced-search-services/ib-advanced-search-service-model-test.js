describe('ibAdvancedSearchServiceModel test', () => {
    let service,localStorageService;
    const modelExample = {
        showDatepicker: false,
        tripOptions: [{ description: 'HEADER_ADVANCED_SEARCH_ONE_WAY', code: 1 }, { description: 'HEADER_ADVANCED_SEARCH_ROUND_TRIP', code: 2 }, { description: 'HEADER_ADVANCED_SEARCH_MULTICITY', code: 3 }],
        passengersSelected: [],
        payWithAvios: false,
        payWithPoints: false,
        aviosChecked: false,
        resetToggleCounter: false,
        tripOptionSelected: null,
        specialPassengerTypeHasError: false,
        specialTypeAvailableLastSearch: false,
        cityOrigin: null,
        cities: null,
        cityDestiny: null,
        cabinSelected: null,
        passengers: null,
        passengersConditions:  { passengersCount: 0, maxChilds: 0, totalAdults: 0, passengersWithInfants: 0 },
        selectedOutbondDate: new Date(),
        selectedReturnDate: new Date(),
        flexDates: true,
        discountResident: null,
        discountFamily: null,
        desResiConfig: null,
        desFamilyConfig: null,
        typeCabins:[]
    };
    const residentDiscountConfig = {type:'HEADER_ADVANCED_SEARCH_RESIDENT',name:'resident',items:[{description:'HEADER_ADVANCED_SEARCH_NO_RESIDENT',value:''},{description:'HEADER_ADVANCED_SEARCH_RESIDENT_CANARIAS',value:'RC'},{description:'HEADER_ADVANCED_SEARCH_RESIDENT_CANARIAS',value:'DC'},{description:'HEADER_ADVANCED_SEARCH_RESIDENT_BALEARES',value:'BP'},{description:'HEADER_ADVANCED_SEARCH_RESIDENT_BALEARES',value:'BI'},{description:'HEADER_ADVANCED_SEARCH_RESIDENT_MELILLA',value:'RM'},{description:'HEADER_ADVANCED_SEARCH_RESIDENT_CEUTA',value:'RE'}]};
    const familyDiscountConfig = {type:'HEADER_ADVANCED_SEARCH_FAMILIA_NUM',name:'family',items:[{description:'HEADER_ADVANCED_SEARCH_NO_FAMILY',value:''},{description:'HEADER_ADVANCED_SEARCH_FAMILY_GENERAL',value:'F1'},{description:'HEADER_ADVANCED_SEARCH_FAMILY_SPECIAL',value:'F2'}]};
    const fakeUrlParams = {
        resident: residentDiscountConfig.items[1].value,
        largeFamilyType: familyDiscountConfig.items[1].value
    };


    beforeEach(() => {
        angular.mock.module('ib-header-advanced-search-module', 'LocalStorageModule', ($provide) => {});
        inject((_ibAdvancedSearchServiceModel_, _localStorageService_) => {
            localStorageService = _localStorageService_;
            service = _ibAdvancedSearchServiceModel_;
        });
    });
    describe ('Test InitModel', ()=> {
        it('Without Local discounts', (done)=> {
            const model = service.initializeModel();
            expect(model).toBeDefined();
            expect (model.passengersConditions).toEqual(modelExample.passengersConditions);
            expect(model.tripOptions).toEqual(modelExample.tripOptions);
            expect(typeof (model.selectedOutbondDate)).toEqual('object');
            expect(typeof (model.selectedReturnDate)).toEqual('object');
            done();
        });
        it('With Local discounts', (done)=> {
            localStorageService.set('bookingUrlParams', fakeUrlParams);
            const model = service.initializeModel(residentDiscountConfig, familyDiscountConfig);
            expect(model).toBeDefined();
            expect (model.passengersConditions).toEqual(modelExample.passengersConditions);
            expect(model.tripOptions).toEqual(modelExample.tripOptions);
            expect(typeof (model.selectedOutbondDate)).toEqual('object');
            expect(typeof (model.selectedReturnDate)).toEqual('object');
            expect(model.desResiConfig).toEqual(residentDiscountConfig);
            expect(model.desFamilyConfig).toEqual(familyDiscountConfig);
            expect(model.desResiConfig).toEqual(residentDiscountConfig);
            expect(model.discountResident).toEqual(residentDiscountConfig.items[1]);
            expect(model.discountFamily).toEqual(familyDiscountConfig.items[1]);
            done();
        });
    });
    describe ('Test updateDiscountData', ()=> {
        it('Test without data',(done)=> {
            localStorageService.remove('bookingUrlParams');
            const model = service.updateDiscountsData(modelExample, residentDiscountConfig, familyDiscountConfig);
            expect(model.discountResident).toEqual(residentDiscountConfig.items[0]);
            expect(model.discountFamily).toEqual(familyDiscountConfig.items[0]);
            done();
        });
    });


});