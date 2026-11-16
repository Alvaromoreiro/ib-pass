describe('AdvancedSearchTransformer test', () => {
    let service, passengersConstant;
    const fakeWindow = {location: {
        origin: 'http://www.iberia.com',
        pathname:'/flights'
    }};
    const fakeSearchURL = 'http://www.iberia.com/flights?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=2&BEGIN_CITY_01=MAD&END_CITY_01=BOS&BEGIN_DAY_01=01&BEGIN_MONTH_01=203001&BEGIN_YEAR_01=2030&END_DAY_01=10&END_MONTH_01=203001&END_YEAR_01=2030&FARE_TYPE=N&quadrigam=IBHMPA&ADT=1&CHD=1&INF=1&BNN=1&YTH=1&YCD=1&residentCode=RC&familianumerosa=F1&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES&pagoAvios=true&pagoPuntos=true';
    const fakeRootscope = {
        appLang: 'es',
        appMarket: 'ES',
        $broadcast: ()=>{}
    };
    const fakeLocalStorage = {
        get: jasmine.createSpy('localStorageGet').and.callFake((key) => { return  {};}),
        set: jasmine.createSpy('localStorageSet').and.callFake(()=>{})
    };
    const areas = [{code:'ES_COMM_AREA_SPAIN',description:'España',cities:[
        {code:'MAD',description:'Madrid',country:{code:'ES',description:'España'}}
    ]},
    {code:'ES_COMM_AREA_AMERICA',description:'America',cities:[
        {code:'BOS',description:'Bostón',country:{code:'US',description:'USA'}}
    ]}
    ];
    const citiesListResult= [
        {
            code: 'MAD',
            description: 'Madrid',
            country: 'ES',
            countryLong: 'España',
            group: 'España',
            selected: false
        },
        {
            code: 'BOS',
            description: 'Bostón',
            country: 'US',
            countryLong: 'USA',
            group: 'America',
            selected: false
        }
    ];
    const fakeSearchData = {
        tripOptionSelected: {code: 2},
        cabinSelected: {code: 'N'},
        cityOrigin: citiesListResult[0],
        cityDestiny: citiesListResult [1],
        selectedOutbondDate: new Date ('01/01/2030'),
        selectedReturnDate: new Date ('01/10/2030'),
        flexDates: true,
        payWithAvios: true,
        payWithPoints: true,
        discountFamily: {value: 'F1'},
        discountResident: {value: 'RC'},
        passengersSelected : [
            { passengerType: 'ADULT', count: 1},
            { passengerType: 'SENIOR', count: 1},
            { passengerType: 'YOUNG', count: 1},
            { passengerType: 'YOUTH', count: 1},
            { passengerType: 'CHILD', count: 1},
            { passengerType: 'INFANT', count: 1}
        ]
    };
    beforeEach(() => {
        angular.mock.module('ib-header-advanced-search-module', 'ib-ui-city-passenger-constanst-component-module', ($provide) => {
            $provide.value('$window', fakeWindow);
            $provide.value('$rootScope', fakeRootscope);
            $provide.value('localStorageService', fakeLocalStorage);
        });
        inject((_AdvancedSearchTransformer_, _$timeout_ ,_IbUiPassengerSelectorConstants_) => {
            passengersConstant = _IbUiPassengerSelectorConstants_;
            service = _AdvancedSearchTransformer_;
        });
    });
    it ('Test initializeAreasModel', (done)=>{
        const citiesTransform = service.initializeAreasModel(areas, 'MAD','BOS');
        expect(citiesTransform.cities.listGroups).toEqual(['España', 'America']);
        expect(citiesTransform.cities.listCities).toEqual(citiesListResult);
        done();

    });
    it('Initialize Cabin Model', (done) => {
        const cabinModel = service.initializeCabinsModel(true);
        expect(cabinModel).toEqual(true);
        done();
    });
    describe ('Test createURLParams',  () => {
        it ('Test without market Redirection', (done) => {
            const resultado = service.createNewAdvancedSearch(fakeSearchData);
            expect(resultado).toEqual(fakeSearchURL);
            done();
        });
    });
});