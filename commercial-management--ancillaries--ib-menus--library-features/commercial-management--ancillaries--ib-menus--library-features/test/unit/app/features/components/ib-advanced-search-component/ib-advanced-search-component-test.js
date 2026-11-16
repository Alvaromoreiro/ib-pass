describe('AdvSeeker test', () => {
    const initialModel = {
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
    const DISCOUNT_SEARCH_RESIDENT = {
        type: 'HEADER_ADVANCED_SEARCH_RESIDENT',
        name: 'resident',
        subname: 'largeFamilyType',
        items: [
            {
                description: 'HEADER_ADVANCED_SEARCH_NO_RESIDENT',
                value: ''
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_RESIDENT_CANARIAS',
                value: 'RC'
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_RESIDENT_CANARIAS',
                value: 'DC'
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_RESIDENT_BALEARES',
                value: 'BP'
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_RESIDENT_BALEARES',
                value: 'BI'
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_RESIDENT_MELILLA',
                value: 'RM'
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_RESIDENT_CEUTA',
                value: 'RE'
            }
        ]
    };
    const DISCOUNT_SEARCH_FAMILY= {
        type: 'HEADER_ADVANCED_SEARCH_FAMILIA_NUM',
        name: 'family',
        items: [
            {
                description: 'HEADER_ADVANCED_SEARCH_NO_FAMILY',
                value: ''
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_FAMILY_GENERAL',
                value: 'F1'
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_FAMILY_SPECIAL',
                value: 'F2'
            }
        ]
    };

    const fakeAdvancedServiceModel = {
        initializeModel: jasmine.createSpy('initializeModel').and.callFake(() => initialModel),
        updateDiscountsData: jasmine.createSpy('initializeModel').and.callFake(() => {})
    };
    const cabinTypes = [
        {code: 'R', description: 'Más Económica', cabinClass: 'ECONOMY'},
        {code: 'N', description: 'Turista Premium', cabinClass: 'PREMIUMTOURIST'},
        {code: 'B', description: 'Business Class', cabinClass: 'BUSINESS'}
    ];
    const areas = [{code:'ES_COMM_AREA_SPAIN',description:'España',cities:[
        {code:'MAD',description:'Madrid',country:{code:'ES',description:'España'}}
    ]},
    {code:'ES_COMM_AREA_AMERICA',description:'America',cities:[
        {code:'BOS',description:'Bostón',country:{code:'US',description:'USA'}}
    ]}
    ];
    const fakePassengerConf = {origin:'MAD',destination: ['*']};
    const fakePassengerList =  {
        SENIOR: [fakePassengerConf],
        YOUNG: [fakePassengerConf],
        TEENAGER: [fakePassengerConf],
        specialPassengerMarket: 'ES'
    };
    const citiesListResult= [
        {
            code: 'MAD',
            description: 'Madrid (MAD)',
            country: 'ES',
            countryLong: 'España',
            group: 'España',
            selected: false
        },
        {
            code: 'BOS',
            description: 'Bostón (BOS)',
            country: 'US',
            countryLong: 'USA',
            group: 'America',
            selected: false
        }
    ];
    const destinationAreas = {
        cities: {
            listGroups: ['España', 'America'],
            listCities: citiesListResult
        },
        origin: citiesListResult[0],
        destiny: citiesListResult[1]
    };
    const fakeAdvancedSearchService = {
        getCabinTypes: () => Promise.resolve(cabinTypes),
        getDestinationAreas: ()=> Promise.resolve (destinationAreas),
        getSpecialPassengerOriginDestination: () => {
            fakeLocalStorage.set('specialPassengersByMarketList', fakePassengerList);
            return Promise.resolve(fakePassengerList);
        },
        createRequestNewAdvancedSearch: ()=> '/newSearch/'
    };
    const fakeLastStorageService = {
        pushSearch: ()=> {}
    };
    const fakeCommonsModalService = {
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(() => {})
    };
    const fakeCommonsLocalDiscountService = {
        getDiscountsConfig: jasmine.createSpy('getDiscountsConfig').and.callFake(()=> {return { resident: DISCOUNT_SEARCH_RESIDENT, largeFamily: DISCOUNT_SEARCH_FAMILY};}),
        getResidentsDiscountsForRoute : jasmine.createSpy('getResidentsDiscountsForRoute').and.callFake(()=>{})
    };
    const fakeRedirectionService = {
        externalRedirect: jasmine.createSpy('externalRedirect').and.callFake(()=>{})
    };
    const fakeWindow = {
    };
    const trips = [
        {
            dateFlight: '01/01/2030',
            destinyCity: 'Madrid',
            destinyCode: 'MAD',
            originCity: 'Bostón',
            originCode: 'BOS',
            passengers: 1,
            returnFlight: '01/10/2030',
            tripType: '2'
        }
    ];
    const fakeLocalStorage = {
        storage: {},
        get: (key) => {
            try{
                return JSON.parse(fakeLocalStorage.storage[key]);
            } catch(e) {
                return null;
            }
        },
        set: (key, value)=>{
            fakeLocalStorage.storage[key]=JSON.stringify(value);
        },
        clear : () => {
            fakeLocalStorage.storage = {};
        },
        remove: () => {}
    };
    const bookingURLParams =  {
        resident: 'RC',
        largeFamilyType:'F1',
        flexDates: true,
        preferredCabin: 'R'
    };
    const fakeFilter = ()=>{ return () =>{};};
    const passengers = {
        numberPassengers: 6,
        numAdults: 1,
        numSeniors: 1,
        numYouth: 1,
        numTeenager: 1,
        numChilds: 1,
        numInfants: 1
    };
    const fakeContainerForm = {
        $submitted: false,
        $valid: true,
        selector_city_0: {$setValidity: ()=>{}, submitted: false},
        selector_city_1: {$setValidity: ()=>{}, submitted: false},
        selector_city_2: {$setValidity: ()=>{}, submitted: false},
        selector_city_3: {$setValidity: ()=>{}, submitted: false}
    };
    let controller, $scope, $rootScope, $componentController, $timeout;
    beforeEach(() => {
        angular.mock.module('ib-header-advanced-search-module',  ($provide) => {
            $provide.value('AdvancedHeaderSearchService', fakeAdvancedSearchService);
            $provide.value('ibAdvancedSearchServiceModel', fakeAdvancedServiceModel);
            $provide.value('CommonsModalService', fakeCommonsModalService);
            $provide.value('CommonLocalDiscountsService', fakeCommonsLocalDiscountService);
            $provide.value('RedirectionService', fakeRedirectionService);
            $provide.value('$window', fakeWindow);
            $provide.value('$filter', fakeFilter);
            $provide.value('$timeout', (cb)=>{cb();});
            $provide.value('LastSearchStorageService', fakeLastStorageService);
            $provide.value('localStorageService', fakeLocalStorage);
        });
        angular.mock.inject((_$componentController_, _$rootScope_,_IbUiPassengerSelectorConstants_,_$timeout_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $componentController = _$componentController_;
            $timeout=_$timeout_;
            controller = $componentController('ibAdvancedHeaderSearchComponent',
                {$rootScope, $scope, IbUiPassengerSelectorConstants: _IbUiPassengerSelectorConstants_},
                {trips, passengers, redemption: false, isOnbusiness: false}
            );
            fakeLocalStorage.set('bookingUrlParams', bookingURLParams);
            controller.model.discountResident= {value: 'RC'};
            controller.model.discountFamily= {value: 'F1'};
            controller.$onInit();
            controller.containerForm = fakeContainerForm;
            $rootScope.flowName = 'BKI';
            $rootScope.$digest();
        });
    });
    describe('Initialize AdvSeeker Component', () => {
        it ('Market description does not have value', (done) => {
            controller.marketDescription = '';
            fakeLocalStorage.clear();
            fakeLocalStorage.set('commercialData',{market: {code: 'ES'}});
            fakeLocalStorage.set('bookingUrlParams', bookingURLParams);
            controller.$onInit();
            expect(controller.marketDescription).toEqual('ES');
            done();

        });
        xit ('Previously initiated', (done) =>{
            controller.$onInit();
            done();
        });
    });
    describe('Test before Initialized', ()=> {
        xit('Update passenger selected', (done)=> {
            const passengerSelected = [
                {passengerType: 'SENIOR', count:2, isActive:true},
                {passengerType: 'ADULT', count:1, isActive:true},
                {passengerType: 'YOUNG', count:1, isActive:true},
                {passengerType: 'YOUTH', count:1, isActive:true},
                {passengerType: 'CHILD', count:1, isActive:true},
                {passengerType: 'INFANT', count:1, isActive:true}
            ];
            controller.updateSelectedPassengers(null, passengerSelected);
            expect(controller.model.passengers.numberPassengers).toEqual(7);
            expect(controller.model.passengers.numSeniors).toEqual(2);
            expect(controller.model.passengers.numAdults).toEqual(1);
            expect(controller.model.passengers.numYouth).toEqual(1);
            expect(controller.model.passengers.numChilds).toEqual(1);
            expect(controller.model.passengers.numInfants).toEqual(1);
            done();
        });
        it('Test zeroInDate', ()=>{
            expect(controller.zeroInDate(9)).toEqual('09');
        });
        describe('updateDateOptionsOutbount ', ()=> {
            xit('tripOptionSelected equals 3', (done)=> { // TO DO: fix error: Cannot set properties of null (setting 'code')
                spyOn(controller, 'goMultipleTracksSearchEnginePage');
                controller.model.tripOptionSelected.code = 3;
                controller.updateDateOptionsOutbount();
                expect(controller.goMultipleTracksSearchEnginePage).toHaveBeenCalled();
                done();
            });
            it('tripOptionSelected equals 1', (done)=> {
                controller.model.tripOptionSelected.code = 1;
                controller.updateDateOptionsOutbount();
                expect(controller.model.selectedReturnDate ).toEqual(null);
                done();
            });
            it('tripOptionSelected equals 2', (done)=> {
                controller.model.tripOptionSelected.code = 2;
                controller.model.selectedOutbondDate = new Date('10/02/2022 00:01');

                controller.updateDateOptionsOutbount();
                expect(controller.model.selectedReturnDate ).toEqual(new Date('10/03/2022 00:01'));
                done();
            });
        });
        xit ('Test newSearch', (done)=> {
            fakeLastStorageService.pushSearch = jasmine.createSpy('fakeLastStorageService').and.callFake(()=>{});
            controller.newSearch();
            expect(fakeLastStorageService.pushSearch).toHaveBeenCalled();
            done();
        });
        xdescribe('updateSelectedCity  ', ()=> {
            it('INDEX 0 Origin', (done) => {
                controller.updateSelectedCity (null, {code:'MAD'}, 0);
                done();
            });
            it('INDEX 0 DES', (done) => {
                controller.updateSelectedCity (null, {code:'BOS'}, 0);
                done();
            });
            it('INDEX 1 Origin', (done) => {
                controller.updateSelectedCity (null, {code:'MAD'}, 1);
                done();
            });
            it('INDEX 1 DES', (done) => {
                controller.updateSelectedCity (null, {code:'BOS'}, 1);
                done();
            });
        });
        describe ('updateDiscuount', ()=> {
            it('test With city out of spain', ()=> {
                controller.updateDiscount (citiesListResult[1]);
                expect(controller.model.discountResident).toEqual(DISCOUNT_SEARCH_RESIDENT.items[0]);
                expect(controller.model.discountFamily).toEqual(DISCOUNT_SEARCH_FAMILY.items[0]);
            });
            it('test With city out of spain and selected discount and there is equivalent', ()=> {
                fakeCommonsLocalDiscountService.getResidentsDiscountsForRoute = ()=> {
                    return ['DC','RB'];
                };
                controller.model.discountResident.value= 'RC';
                controller.model.discountResident.description= 'HEADER_ADVANCED_SEARCH_RESIDENT_CANARIAS';
                controller.updateDiscount (citiesListResult[0]);
                expect(controller.model.discountResident).toEqual(DISCOUNT_SEARCH_RESIDENT.items[2]);

            });
        });
        it('TEST goMultipleTracksSearchEnginePage', (done)=> {
            fakeRedirectionService.externalRedirect = jasmine.createSpy('externalRedirect').and.callFake(()=>{});
            controller.goMultipleTracksSearchEnginePage ();
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalled();
            done();
        });

        describe('Test Select payWithAvios', ()=> {
            beforeEach(()=>{
                spyOn(controller, 'checkAviosSpecialPassengerToAdults');
                controller.model.desResiConfig = DISCOUNT_SEARCH_RESIDENT;
                controller.model.desFamilyConfig = DISCOUNT_SEARCH_FAMILY;
                controller.model.passengersSelected = [
                    {passengerType: 'SENIOR', count:2, isActive:true},
                    {passengerType: 'ADULT', count:1, isActive:true},
                    {passengerType: 'YOUNG', count:1, isActive:true},
                    {passengerType: 'YOUTH', count:1, isActive:true},
                    {passengerType: 'CHILD', count:1, isActive:true},
                    {passengerType: 'INFANT', count:1, isActive:true}
                ];
                controller.model.passengers = {
                    numberPassengers:0,
                    numInfants:0
                };
            });
            it('Test selectpPay false', ()=>{
                controller.selectPayWithAvios(false);
                expect(controller.checkAviosSpecialPassengerToAdults).toHaveBeenCalled();
            });
            it('Test selectpPay true', ()=>{
                controller.selectPayWithAvios(true);
                expect(controller.checkAviosSpecialPassengerToAdults).toHaveBeenCalled();
                expect(controller.model.passengers.numInfants).toEqual(0);
            });
        });
        describe('TEST checkAviosSpecialPassengerToAdults', ()=>{
            beforeEach(()=>{
                controller.model.passengersSelected = [
                    {passengerType: 'SENIOR', count:1, isActive:true},
                    {passengerType: 'ADULT', count:1, isActive:true},
                    {passengerType: 'YOUNG', count:2, isActive:true},
                    {passengerType: 'YOUTH', count:3, isActive:true},
                    {passengerType: 'CHILD', count:1, isActive:true},
                    {passengerType: 'INFANT', count:1, isActive:true}
                ];
                controller.model.passengers = passengers;
            });
            it ('Test in case avios false', ()=>{
                controller.checkAviosSpecialPassengerToAdults (false);
                expect(controller.model.passengersSelected[0].count).toEqual(passengers.numSeniors);
                expect(controller.model.passengersSelected[2].count).toEqual(passengers.numTeenager);
                expect(controller.model.passengersSelected[3].count).toEqual(passengers.numYouth);
            });
            xit ('Test in case avios true', ()=>{
                controller.checkAviosSpecialPassengerToAdults (true);

            });
        });
        describe ('TEST triggerCollapse', ()=>{
            it('Test open true', () => {
                spyOn(controller, 'toggle');
                controller.isOpen=true;
                controller.triggerCollapse ();
                fakeWindow.onclick({target: {closest:()=>{return null;}}});
                expect(controller.isOpen).toEqual(false);
            });
            it('Test open false', () => {
                spyOn(controller, 'toggle');
                controller.isOpen=false;
                controller.triggerCollapse ();
                expect(controller.isCollapsed).toEqual(true);
            });
        });
        it('TEST controlCollapse', ()=>{
            controller.controlCollapse ({keyCode: 27});
            expect(controller.isOpen).toEqual(false);
        });
        it ('TEST toggle', ()=> {
            controller.isOpen=true;
            controller.isCollapsed = true;
            controller.toggle();
            expect(controller.isOpen).toEqual(false);
            expect(controller.isCollapsed).toEqual(false);
        });
        it ('TEST validateRadioResident', ()=> {
            const flag = controller.validateRadioResident ({value:''});
            expect(flag).toEqual(true);
        });
        it ('TEST - ShowDiscuountResident',  ()=> {
            fakeCommonsLocalDiscountService.isResidentAvailable = () => true;
            const flag = controller.showDiscountResident();
            expect(flag).toEqual(true);

        });
        it('TEST - ClickoutCollapse', ()=> {
            controller.isOpen=true;
            controller.isCollapsed = false;
            controller.clickoutCollapse ();
            expect(controller.isOpen).toEqual(false);
            expect(controller.isCollapsed ).toEqual(true);
        });

    });
});