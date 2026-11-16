import angular from 'angular';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { IB_HEADER_SEEKER_CONSTANTS } from './ib-header-seeker-constants';
describe('AdvancedHeaderSearchController test', () => {

    let controller, scope;
    let controllerDependencies = {

        location:{},
        scope: {
            $on:(functionName,modal)=>{},
            $broadcast:(functionName,modal)=>{}
        },
        rootScope: {
            $broadcast:(functionName,modal)=>{},
            $emit:(functionName,modal)=>{}
        } as any,
        filter:{},
        window:{},
        timeout:{
            flush: ()=>{}
        }
    };

    let bindings = {
    };
    const mockDestinationAreas = {
        cities:{
            listCities:[
                {
                    country:'ES',
                    code:'MAD'
                },
                {
                    country:'ES',
                    code:'BCN'
                }
            ]
        },
        origin:{},
        destiny:{}
    }
    const mockCabins = [{
        code:'E'
    }]
    const mockModel = {

        showDatepicker: false,
        tripOptions: [ { description: 'HEADER_ADVANCED_SEARCH_ONE_WAY', code: 1 }, { description: 'HEADER_ADVANCED_SEARCH_ROUND_TRIP', code: 2 }, { description: 'HEADER_ADVANCED_SEARCH_MULTICITY', code: 3 } ],
        tripOptionSelected: { description: 'HEADER_ADVANCED_SEARCH_ONE_WAY', code: 1 },
        passengersSelected: [],
        payWithAvios: false,
        payWithPoints: false,
        aviosChecked: false,
        resetToggleCounter: false,
        specialPassengerTypeHasError: false,
        specialTypeAvailableLastSearch: false,
        cityOrigin: { country: 'ES', code: 'MAD' },
        cityDestiny: { country: 'ES', code: 'BCN' },
        cities: null,
        originAllowedCities: null,
        destinationAllowedCities: null,
        cabinSelected: null,
        passengers: { numAdults: 1, numChilds: 0, numInfants: 0, numberPassengers: 1 },
        passengersConditions: { passengersCount: 0, maxChilds: 0, totalAdults: 0, passengersWithInfants: 0 },
        selectedOutbondDate: new Date(),
        selectedReturnDate: new Date(),
        flexDates: true,
        discountResident: null,
        discountFamily: null,
        desResiConfig: null,
        desFamilyConfig: null,
        typeCabins:[],
        stops: [
            {description: 'STOP_OVER_ON_GO', code: 1},
            {description: 'STOP_OVER_ON_RETURN', code: 2}
        ],
        stopOptionSelected: {description: 'STOP_OVER_STOPS'},
        nights: [
            {description: '1', code: 1, allowed: true},
            {description: '2', code: 2, allowed: true},
            {description: '3', code: 3, allowed: true},
            {description: '4', code: 4, allowed: true},
            {description: '5', code: 5, allowed: true},
            {description: '6', code: 6, allowed: true},
            {description: '7', code: 7, allowed: true},
            {description: '8', code: 8, allowed: true},
            {description: '9', code: 9, allowed: true}
        ],
        nightOptionSelected: {description:'STOP_OVER_NIGHTS'}
    }
    const mockTrips = [
        {
            dateFlight: '08/08/2024',
            returnFlight:'09/08/2024'
        },
        {
            dateFlight: '12/08/2024',
            returnFlight:'13/08/2024'
        },
        {
            dateFlight: '20/08/2024',
            returnFlight:'21/08/2024'
        }
    ]
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

    const fakeCommonsCookiesService = {
        updateCookieValue: jasmine.createSpy('updateCookieValue')
    }
    const fakeIbBookingHeaderSeekerModelService = {
        initializeModel: jasmine.createSpy('initializeModel').and.returnValue(structuredClone(mockModel)),
        updateDiscountsData: jasmine.createSpy('updateDiscountsData')
    }
    const fakeCommonsModalService = {
        showGenericError: jasmine.createSpy('showGenericError')
    }
    const fakeRedirectionService = {
        externalRedirect: jasmine.createSpy('externalRedirect')
    }
    const fakeLastSearchStorageService = {
        pushSearch: jasmine.createSpy('pushSearch'),
        pushSearchSO: jasmine.createSpy('pushSearchSO')
    }
    const fakeIbBookingHeaderSeekerService = {
        getCabinTypes: jasmine.createSpy('getCabinTypes'),
        getDestinationAreas: jasmine.createSpy('getDestinationAreas'),
        getSpecialPassengerOriginDestination: jasmine.createSpy('getSpecialPassengerOriginDestination'),
        createRequestNewAdvancedSearch: jasmine.createSpy('createRequestNewAdvancedSearch'),
        createRequestNewAdvancedSearchHMad: jasmine.createSpy('createRequestNewAdvancedSearchHMad'),
    }
    const fakeIbUiPassengerSelectorConstants = {
        PASSENGER_TYPES: {
            DEFAULT: 'DEFAULT',
            SENIOR: 'SENIOR',
            ADULT: 'ADULT',
            YOUNG: 'YOUNG',
            YOUTH: 'YOUTH',
            CHILD: 'CHILD',
            INFANT: 'INFANT',
            SPECIAL_NEEDS: 'SPECIAL_NEEDS'
        }
    }
    const fakeLinksFilterFilter = () => {
        return '';
    }
    const fakeStorage = new StorageServiceMock();
    const fakeIbBookingPetsFlowService = {
        isPetFlow: jasmine.createSpy('isPetFlow')
    }
    beforeEach(() =>{
        angular.mock.module('ib-header-seeker-module', ($provide) => {
            $provide.value('IbBookingHeaderSeekerModelService', fakeIbBookingHeaderSeekerModelService);
            $provide.value('IbBookingHeaderSeekerService', fakeIbBookingHeaderSeekerService);
            $provide.value('CommonsModalService', fakeCommonsModalService);
            $provide.value('BookingLocalDiscountsService', fakeBookingLocalDiscountsService);
            $provide.value('CommonsSessionStorageService', fakeStorage);
            $provide.value('RedirectionService', fakeRedirectionService);
            $provide.value('IbLastSearchStorageService', fakeLastSearchStorageService);
            $provide.value('IbUiPassengerSelectorConstants', fakeIbUiPassengerSelectorConstants);
            $provide.value('CommonsCookiesService', fakeCommonsCookiesService);
            $provide.value('LinksFilterFilter', fakeLinksFilterFilter);
            $provide.value('IbBookingPetsFlowService', fakeIbBookingPetsFlowService);
        });
        inject((_$componentController_,$rootScope, $filter, $window, $timeout) =>{
            scope = $rootScope.$new();
            controllerDependencies.scope = scope;
            controllerDependencies.rootScope = $rootScope;
            controllerDependencies.filter = $filter;
            controllerDependencies.window = $window;
            controllerDependencies.timeout = $timeout;
            controller = _$componentController_('ibHeaderSeekerComponent', controllerDependencies, bindings);
            controller.trips = mockTrips;
            fakeStorage.set('bookingUrlParams',{preferredCabin: 'E'});
            controller.passenger = structuredClone(mockModel.passengers);
            controller.ibBookingCitySeekerCityService = {
                buildCitiesModel: jasmine.createSpy('buildCitiesModel').and.returnValue({
                    cities: [],
                    citiesOutsideSpain: [],
                    cityOrigin: { country: 'ES', code: 'MAD' },
                    cityDestiny: { country: 'ES', code: 'BCN' }
                })
            };
            $rootScope.$digest();
            scope.$apply();
        });
        
    });

    describe('When controller is called ', () =>{
        beforeEach(() =>{
            fakeIbBookingHeaderSeekerService.getCabinTypes = jasmine.createSpy('getCabinTypes').and.returnValue(Promise.resolve(mockCabins))
            fakeIbBookingHeaderSeekerService.getDestinationAreas = jasmine.createSpy('getDestinationAreas').and.returnValue(Promise.resolve(mockDestinationAreas))
            fakeIbBookingHeaderSeekerService.getSpecialPassengerOriginDestination = jasmine.createSpy('getSpecialPassengerOriginDestination').and.returnValue(Promise.resolve(''))
        })
        it(', it will be defined', () =>{
            controller.$onInit();
            expect(controller).toBeDefined();
        });
    });
    describe('When updateSelectedPassengers is called ', () =>{
        beforeEach(() =>{
            controller.model.passengers = {
                numberPassengers: 0
            }
        })
        it(', it update data of selected passengers', () =>{
            const mockUpdatePassengers = [
                {
                    passengerType: 'DEFAULT',
                    count:1
                },
                {
                    passengerType: 'SENIOR',
                    count:1
                },
                {
                    passengerType: 'ADULT',
                    count:2
                },
                {
                    passengerType: 'YOUNG',
                    count:1
                },
                {
                    passengerType: 'YOUTH',
                    count:1
                },
                {
                    passengerType: 'CHILD',
                    count:1
                },
                {
                    passengerType: 'INFANT',
                    count:1
                },
                {
                    passengerType: 'SPECIAL_NEEDS',
                    count:1
                }
            ]
            controller.updateSelectedPassengers(event,mockUpdatePassengers);
            expect(controller.model.passengers.numberPassengers).toEqual(9);
        });
    });
    describe('When changeNightOption is called ', () =>{
        it(', it will set night option', () =>{
            controller.changeNightOption();
            expect(controller.nightOptionChanged).toBeTrue();
        });
    });
    describe('When changeStopOption is called ', () =>{
        it(', it will set stop option', () =>{
            controller.changeStopOption();
            expect(controller.stopOptionChanged).toBeTrue();
        });
    });
    describe('When updateDateOptionsOutbount is called ', () =>{
        it('and tripCode is 1, it will set returnDate to null', () =>{
            controller.model.tripOptionSelected = {
                code:1
            }
            controller.updateDateOptionsOutbount();
            expect(controller.model.selectedReturnDate).toBeNull();
        });
        it('and tripCode is 3, it will set returnDate equal to outboundDate', () =>{
            controller.model.tripOptionSelected = {
                code:3
            }
            controller.updateDateOptionsOutbount();
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalled();
        });
        it('and tripCode is 2, it will set returnDate', () =>{
            controller.model.tripOptionSelected = {
                code:2
            }
            controller.updateDateOptionsOutbount();
            // expect(controller.model.selectedReturnDate).toEqual(new Date('08/09/2024'));
            expect(controller.showStopOption).toBeTrue();
        });
    });

    describe('When clickoutCollapse is called ', () =>{
        it(', it will collapse dropdown', () =>{
            controller.isOpen = true;
            controller.isCollapsed = false;
            controller.clickoutCollapse();
            expect(controller.isCollapsed).toBeTrue();
        });
    });
    describe('When openCalendarAction is called ', () =>{
        it(', it will open calendar', () =>{
            controller.openCalendar = true;
            controller.openCalendarAction();
            controllerDependencies.timeout.flush();
            spyOn(controllerDependencies.scope,'$broadcast')
            // expect(controllerDependencies.scope.$broadcast).toHaveBeenCalled();
            expect(controller.openCalendar).toBeTrue();
        });
    });
    describe('When checkMaximumNights is called', () => {
        beforeEach(() => {
            controller.model = {
                tripOptionSelected: { code: 1 },
                nights: [
                    { description: '1', code: 1, allowed: true },
                    { description: '2', code: 2, allowed: true },
                    { description: '3', code: 3, allowed: true }
                ],
                nightOptionSelected: { description: '2', code: 2 },
                selectedOutbondDate: new Date('2024-08-08'),
                selectedReturnDate: new Date('2024-08-10')
            };
            controller.isHMad = true;
        });

        it('should allow all nights if tripOptionSelected code is 1', () => {
            controller.checkMaximumNights();
            expect(controller.model.nights.every(night => night.allowed)).toBeTrue();
        });

        it('should restrict nights based on the difference between outbound and return dates if tripOptionSelected code is not 1', () => {
            controller.model.tripOptionSelected.code = 2;
            controller.model.selectedOutbondDate = new Date('2024-08-08');
            controller.model.selectedReturnDate = new Date('2024-08-09');
            controller.checkMaximumNights();
            expect(controller.model.nights[0].allowed).toBeTrue();
            expect(controller.model.nights[1].allowed).toBeFalse();
        });

        it('should update nightOptionSelected if the selected night is no longer allowed', () => {
            controller.model.tripOptionSelected.code = 2;
            controller.model.selectedOutbondDate = new Date('2024-08-08');
            controller.model.selectedReturnDate = new Date('2024-08-09');
            controller.model.nightOptionSelected = { description: '3', code: 3 };
            controller.checkMaximumNights();
            expect(controller.model.nightOptionSelected.code).toEqual(1);
        });

        it('should not perform any operation if isHMad is false', () => {
            controller.isHMad = false;
            const originalNights = [...controller.model.nights];
            controller.checkMaximumNights();
            expect(controller.model.nights).toEqual(originalNights);
        });
    });
    describe('When close is called', () => {
        it('should broadcast the toggleAdvancedSearch event with false', () => {
            spyOn(controllerDependencies.rootScope, '$broadcast');
            controller.close();
            expect(controllerDependencies.rootScope.$broadcast).toHaveBeenCalledWith('toggleAdvancedSearch', false);
        });

    });

    describe('When newSearch is called', () => {
        function updateModel() {
            controller.model = {
                specialPassengerTypeHasError: false,
                passengersSelected: [],
                selectedOutbondDate: new Date('2024-08-08'),
                selectedReturnDate: new Date('2024-08-10'),
            };
            controller.CommonsSessionStorageService.set('InitialAdvancedSearchModel', controller.model);
        }
        beforeEach(() => {
            controller.containerForm = { $submitted: false, $valid: true };
            controller.CommonsSessionStorageService.clear();
            spyOn(controller, 'close');
            spyOn(controller, 'updateLastSearchList');
            controller.containerForm.$valid = true;
            controller.model = structuredClone(mockModel);
            controller.model.tripOptionSelected = { code: 3 };
            controller.model.specialPassengerTypeHasError = false;
            fakeRedirectionService.externalRedirect.calls.reset();
            controller.close.calls.reset();
            controller.updateLastSearchList.calls.reset();
            updateModel();
            
        });

        it('should close the advanced search modal', () => {
            controller.newSearch();
            expect(controller.close).toHaveBeenCalled();
        });

        it('should remove InitialAdvancedSearchModel and ignoreOrderBKI from localStorage', () => {
            controller.newSearch();
            expect(controller.CommonsSessionStorageService.get('InitialAdvancedSearchModel')).toBeNull();
            expect(controller.CommonsSessionStorageService.get('ignoreOrderBKI')).toBeNull();

        });

        it('should update the last search list', () => {
            controller.newSearch();
            expect(controller.updateLastSearchList).toHaveBeenCalledWith(controller.model);
        });

        it('should redirect to the new search URL', () => {
            const mockUrl = 'https://example.com/search';
            fakeIbBookingHeaderSeekerService.createRequestNewAdvancedSearch.and.returnValue(mockUrl);
            controller.newSearch();
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalledWith(mockUrl);
        });

        it('should not proceed if the form is invalid', () => {
            
            controller.containerForm.$valid = false;
            controller.newSearch();
            expect(controller.close).not.toHaveBeenCalled();
            expect(fakeRedirectionService.externalRedirect).not.toHaveBeenCalled();
        });

        it('should not proceed if there is a special passenger type error', () => {
            controller.model.specialPassengerTypeHasError = true;
            controller.newSearch();
            expect(controller.close).not.toHaveBeenCalled();
            expect(fakeRedirectionService.externalRedirect).not.toHaveBeenCalled();
        });
    });


    describe('When newHMadSearch is called', () => {
        beforeEach(() => {
            controller.containerForm = { $submitted: false, $valid: true };
            spyOn(controller, 'updateHMadCookie');
            spyOn(controller, 'generateLastSearchStopover');
            fakeRedirectionService.externalRedirect.calls.reset();
            controller.model.discountResident = {value: 'BP'};
            controller.model.discountFamily = {value: 'F1'};
            controller.containerForm.$valid = true;
            controller.model.specialPassengerTypeHasError = false;
        });

        it('should update the HMad cookie', () => {
            const mockHMadSearch = { cookie: 'mockCookie', url: 'https://example.com/hmad-search' };
            fakeIbBookingHeaderSeekerService.createRequestNewAdvancedSearchHMad.and.returnValue(mockHMadSearch);

            controller.newHMadSearch();

            expect(controller.updateHMadCookie).toHaveBeenCalledWith(mockHMadSearch.cookie);
        });

        it('should generate the last search stopover', () => {
            const mockHMadSearch = { cookie: 'mockCookie', url: 'https://example.com/hmad-search' };
            fakeIbBookingHeaderSeekerService.createRequestNewAdvancedSearchHMad.and.returnValue(mockHMadSearch);

            controller.newHMadSearch();

            expect(controller.generateLastSearchStopover).toHaveBeenCalled();
        });

        it('should redirect to the HMad search URL', () => {
            const mockHMadSearch = { cookie: 'mockCookie', url: 'https://example.com/hmad-search' };
            fakeIbBookingHeaderSeekerService.createRequestNewAdvancedSearchHMad.and.returnValue(mockHMadSearch);

            controller.newHMadSearch();

            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalledWith(mockHMadSearch.url);
        });

        it('should not proceed if the form is invalid', () => {
            controller.containerForm.$valid = false;

            controller.newHMadSearch();

            expect(controller.updateHMadCookie).not.toHaveBeenCalled();
            expect(controller.generateLastSearchStopover).not.toHaveBeenCalled();
            expect(fakeRedirectionService.externalRedirect).not.toHaveBeenCalled();
        });

        it('should not proceed if there is a special passenger type error', () => {
            controller.model.specialPassengerTypeHasError = true;

            controller.newHMadSearch();

            expect(controller.updateHMadCookie).not.toHaveBeenCalled();
            expect(controller.generateLastSearchStopover).not.toHaveBeenCalled();
            expect(fakeRedirectionService.externalRedirect).not.toHaveBeenCalled();
        });
    });

    describe('When updatePassengersModel is called', () => {
        
        it('should update passengersConditions correctly', () => {
            controller.model.passengersSelected = [
                { passengerType: 'ADULT', count: 2 },
                { passengerType: 'CHILD', count: 1 }
            ];

            controller.model.passengersConditions = {
                totalAdults: 0,
                maxChilds: 0,
                passengersCount: 0,
                passengersWithInfants: 0
            };

            controller.updatePassengersModel({
                numAdults: 2,
                numChilds: 1,
                numInfants: 0,
                numberPassengers: 3
            });

            expect(controller.model.passengersConditions.passengersCount).toBe(3);
            expect(controller.model.passengersConditions.totalAdults).toBe(2);
        });

    });
    describe('When onDateUpdated is called', () => {

        it('should call calculatePetsDisabledByTime and checkMaximumNights', () => {
            spyOn(controller as any, 'calculatePetsDisabledByTime');
            spyOn(controller, 'checkMaximumNights');

            (controller as any).onDateUpdated();

            expect((controller as any).calculatePetsDisabledByTime).toHaveBeenCalled();
            expect(controller.checkMaximumNights).toHaveBeenCalled();
        });

    });
    describe('When onPassengersChange is called', () => {

        it('should update passengersSelected and persist it in localStorage', () => {
            const mockPassengers = [
                { passengerType: 'ADULT', count: 2 }
            ];

            spyOn(controller.CommonsSessionStorageService, 'set');

            controller.onPassengersChange(mockPassengers);

            expect(controller.model.passengersSelected).toEqual(mockPassengers);
            expect(controller.CommonsSessionStorageService.set)
                .toHaveBeenCalledWith('AdvancedSearchPassengersModel', mockPassengers);
        });

    });
    describe('When onPetsChange is called', () => {

        it('should update isPetsSelected state', () => {
            controller.isPetsSelected = false;

            controller.onPetsChange(true);

            expect(controller.isPetsSelected).toBeTrue();
        });

        it('should persist true value in sessionStorage using PETS_CHECKED_KEY', () => {
            const setItemSpy = spyOn(window.sessionStorage, 'setItem');

            controller.onPetsChange(true);

            expect(setItemSpy).toHaveBeenCalledWith(
                IB_HEADER_SEEKER_CONSTANTS.PETS_CHECKED_KEY,
                JSON.stringify(true)
            );
        });

        it('should persist false value in sessionStorage using PETS_CHECKED_KEY', () => {
            const setItemSpy = spyOn(window.sessionStorage, 'setItem');

            controller.onPetsChange(false);

            expect(setItemSpy).toHaveBeenCalledWith(
                IB_HEADER_SEEKER_CONSTANTS.PETS_CHECKED_KEY,
                JSON.stringify(false)
            );
        });

    });
    describe('When calculatePetsDisabledByTime is called', () => {

        beforeEach(() => {
            jasmine.clock().install();
            jasmine.clock().mockDate(new Date('2024-01-01T00:00:00'));
        });

        afterEach(() => {
            jasmine.clock().uninstall();
        });


        it('should set isToggleDisabledByTime to false when no departure date exists', () => {
            controller.model = {};
            controller.isToggleDisabledByTime = true;

            (controller as any).calculatePetsDisabledByTime();

            expect(controller.isToggleDisabledByTime).toBeFalse();
        });

        it('should enter disabled state when departure date is within 48h', () => {
            controller.model = {
                selectedOutbondDate: new Date('2024-01-02')
            };

            controller.hasEnteredDisabledByTime = false;
            controller.isPetsSelected = true;

            (controller as any).calculatePetsDisabledByTime();

            expect(controller.hasEnteredDisabledByTime).toBeTrue();
            expect(controller.isPetsSelected).toBeFalse();
            expect(controller.isToggleDisabledByTime).toBeTrue();
        });


        it('should restore isPetsSelected when leaving disabled state and coming from PET flow', () => {
            controller.model = {
                selectedOutbondDate: new Date('2024-01-04')
            };

            controller.hasEnteredDisabledByTime = true;
            controller.isPetFlight = true;
            controller.isPetsSelected = false;
            controller.isToggleDisabledByTime = true;

            (controller as any).calculatePetsDisabledByTime();

            expect(controller.hasEnteredDisabledByTime).toBeFalse();
            expect(controller.isPetsSelected).toBeTrue();
            expect(controller.isToggleDisabledByTime).toBeFalse();
        });

        it('should not restore isPetsSelected when not coming from PET flow', () => {
            controller.model = {
                selectedOutbondDate: new Date('2024-01-04')
            };

            controller.hasEnteredDisabledByTime = true;
            controller.isPetFlight = false;
            controller.isPetsSelected = false;

            (controller as any).calculatePetsDisabledByTime();

            expect(controller.isPetsSelected).toBeFalse();
            expect(controller.hasEnteredDisabledByTime).toBeFalse();
        });


    });

    describe('When resolveAdultInfoAgeLiteral is called', () => {
        //teenagerAvailable: boolean, seniorAvailable: boolean, youngAvailable: boolean
        it('should return teen literal when teenagerAvailable is true and seniorAvailable is false', () => {
            controller.teenagerTypeAvailable = true;
            controller.seniorTypeAvailable = false;
            controller.youngTypeAvailable = false;
            const result = controller.resolveAdultInfoAgeLiteral();
            expect(result).toBe('HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_TEEN_AGE_TEXT');
        });

        it('should return young literal when youngAvailable is true and seniorAvailable is false', () => {
            controller.teenagerTypeAvailable = false;
            controller.seniorTypeAvailable = false;
            controller.youngTypeAvailable = true;
            const result = controller.resolveAdultInfoAgeLiteral();
            expect(result).toBe('HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_YOUNG_AGE_TEXT');
        });

        it('should return senior literal when only seniorAvailable is true', () => {
            controller.teenagerTypeAvailable = false;
            controller.seniorTypeAvailable = true;
            controller.youngTypeAvailable = false;
            const result = controller.resolveAdultInfoAgeLiteral();
            expect(result).toBe('HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_SENIOR_AGE_TEXT');
        });

        it('should return senior and teen literal when seniorAvailable and teenagerAvailable are true', () => {
            controller.teenagerTypeAvailable = true;
            controller.seniorTypeAvailable = true;
            controller.youngTypeAvailable = false;
            const result = controller.resolveAdultInfoAgeLiteral();
            expect(result).toBe('HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_SENIOR_AND_TEEN_AGE_TEXT');
        });

        it('should return senior and young literal when seniorAvailable and youngAvailable are true', () => {
            controller.teenagerTypeAvailable = false;
            controller.seniorTypeAvailable = true;
            controller.youngTypeAvailable = true;
            const result = controller.resolveAdultInfoAgeLiteral();
            expect(result).toBe('HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_SENIOR_AND_YOUNG_AGE_TEXT');
        });

        it('should return default adult literal when all passenger types are unavailable', () => {
            controller.teenagerTypeAvailable = false;
            controller.seniorTypeAvailable = false;
            controller.youngTypeAvailable = false;
            const result = controller.resolveAdultInfoAgeLiteral();
            expect(result).toBe('HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_AGE_TEXT');
        });

    });
});
