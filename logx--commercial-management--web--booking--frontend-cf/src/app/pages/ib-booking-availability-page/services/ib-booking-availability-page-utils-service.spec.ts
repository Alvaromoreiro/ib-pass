import * as angular from 'angular';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { IbBookingAvailabilityPageUtilsService } from '@src/app/pages/ib-booking-availability-page/services/ib-booking-availability-page-utils-service';
import { BookingAvailabilityConstants } from '@src/app/core/constants/ib-booking-availability-constants';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { DigitalDataServiceMock } from '@test-mocks/class/DigitalDataServiceMock';
describe('IbBookingAvailabilityPageUtilsService Test', () => {
    var rootScope, IbBookingAvailabilityPageUtilsService: IbBookingAvailabilityPageUtilsService, timeout, fakeWindow;
    let fakeLocalStorage = new StorageServiceMock();

    const fakeBookingAvailabilityConstants = BookingAvailabilityConstants;
    const fakeBookingAvailabilityService = {
        getCalendarRibbon: jasmine.createSpy('getCalendarRibbon'),
        getURLFirstParameterByName: jasmine.createSpy('getURLFirstParameterByName'),
        isRedemptionShuttleFlow: jasmine.createSpy('isRedemptionShuttleFlow')

    };

    const fakeBookingModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal'),
        finishWaiting: jasmine.createSpy('finishWaiting')
    };

    const fakeBookingRedirectionService = {
        redirectToLoginPage : jasmine.createSpy('redirectToLoginPage'),
        path: jasmine.createSpy('path').and.callFake(()=> {})
    };

    const fakeBookingUtilService = {
        getURLFirstParameterByName: jasmine.createSpy('getURLFirstParameterByName')
    };
    const fakeNewMainHeaderFacade = {
        updateHeaderModel: jasmine.createSpy('updateHeaderModel')
    };

    const fakeBookingAppConstants = BookingAppConstants;
    const fakeBookingComponentUtils = {
        equalHeight: jasmine.createSpy('equalHeight').and.returnValue(null)
    };
    let fakeDigitalDataService = new DigitalDataServiceMock();

    beforeEach( () => {
        angular.mock.module('ib-booking-availability-module', ($provide) => {
            $provide.value('CommonsSessionStorageService', fakeLocalStorage);
            $provide.value('BookingAvailabilityConstants', fakeBookingAvailabilityConstants);
            $provide.value('BookingAvailabilityService', fakeBookingAvailabilityService);
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('BookingRedirectionService', fakeBookingRedirectionService);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            $provide.value('BookingComponentUtils', fakeBookingComponentUtils);
            $provide.value('DigitalDataService', fakeDigitalDataService);

        });
        inject(($rootScope, _IbBookingAvailabilityPageUtilsService_, $timeout, $window) => {
            IbBookingAvailabilityPageUtilsService = _IbBookingAvailabilityPageUtilsService_;
            rootScope = $rootScope;
            timeout = $timeout;
            fakeWindow = $window;
        });
        fakeLocalStorage.set('actualStepFlow', 'availability');
    
    });
    describe('when areAllSegmentsSelected is called', () => {
        beforeEach(inject(() => {

        }));
        it('', () => {
            const segments = [{value:'value'}];
            let returnValue = IbBookingAvailabilityPageUtilsService.areAllSegmentsSelected(segments);
            expect(returnValue).toBeTruthy();
        });
    });

    describe('when getSelectedFareFamily is called', () => {
        beforeEach(inject(() => {

        }));
        it('', () => {
            const fareFamilies = {cabins:[{fareFamilies:[{commercialCode:'ES'}]}]};
            let returnValue = IbBookingAvailabilityPageUtilsService.getSelectedFareFamily({commercialCode:'ES'}, 0, fareFamilies);
            expect(returnValue).toBeTruthy();
        });
    });
    describe('when isReadyToCallRedemptionFare is called', () => {
        beforeEach(inject(() => {

        }));
        it('and all slices are selected', () => {
            const model = {currentOriginDestinationIndex:true, availabilityData:{originDestinations:[{}]}, selectedSlices:[{info:{segments:'value'}, selectedSegments:[{}]}]};
            let returnValue = IbBookingAvailabilityPageUtilsService.isReadyToCallRedemptionFare(model);
            expect(returnValue).toBeFalsy();
        });
        it('and not all slices are selected', () => {
            const model = {currentOriginDestinationIndex:0, availabilityData:{originDestinations:[{}]}, selectedSlices:['value']};
            let returnValue = IbBookingAvailabilityPageUtilsService.isReadyToCallRedemptionFare(model);
            expect(returnValue).toBeFalsy();
        });
    });
    describe('when onLogin is called', () => {
        beforeEach(inject(() => {

        }));
        it('', () => {
            IbBookingAvailabilityPageUtilsService.onLogin();
            expect(fakeBookingModalService.showWaitingModal).toHaveBeenCalled();
        });
    });
    describe('when onError is called', () => {
        beforeEach(inject(() => {

        }));
        it('', () => {
            IbBookingAvailabilityPageUtilsService.onError();
            expect(fakeBookingModalService.finishWaiting).toHaveBeenCalled();
        });
    });
    describe('when redirectToLogin is called', () => {
        beforeEach(inject(() => {

        }));
        it('', () => {
            IbBookingAvailabilityPageUtilsService.redirectToLogin();
            expect(fakeBookingRedirectionService.redirectToLoginPage).toHaveBeenCalled();
        });
    });
    describe('when isSameFlight is called', () => {
        beforeEach(inject(() => {

        }));
        it('', () => {
            let returnData = IbBookingAvailabilityPageUtilsService.isSameFlight({segments:[{flight:{marketingCarrier:{code:'ES'}, marketingFlightNumber:'IB'}}]}, {info:{segments:[{flight:{marketingCarrier:{code:'ES'}, marketingFlightNumber:'IB'}}]}});
            expect(returnData).toBeTruthy();
        });
    });
    describe('when updateHeaderDates is called', () => {
        const datesExample = {dates:{
            outboundFlight:'2025-09-10',
            formatedOutboundFlight:new Date(new Date('2025-09-10').setHours(0, 0, 0, 0)).toISOString(),
            returnFlight :'2025-09-11',
            formatedReturnFlight: new Date(new Date('2025-09-11').setHours(0, 0, 0, 0)).toISOString()
        }};
        beforeEach(inject(() => {
            fakeLocalStorage.set('originDestination', structuredClone(datesExample));
        }));
        it('it will update return flight', () => {
            IbBookingAvailabilityPageUtilsService.updateHeaderDates(1, '2025-09-15');
            const result = {...datesExample};
            result.dates.returnFlight = '2025-09-15';
            result.dates.formatedReturnFlight = new Date(new Date(result.dates.returnFlight).setHours(0, 0, 0, 0)).toISOString();
            expect(fakeLocalStorage.get('originDestination')).toEqual(result);
        });
        it('it will update outbound flight', () => {
            IbBookingAvailabilityPageUtilsService.updateHeaderDates(0, '2025-09-09');
            const result = {...datesExample};
            result.dates.outboundFlight = '2025-09-09';
            result.dates.formatedOutboundFlight = new Date(new Date(result.dates.outboundFlight).setHours(0, 0, 0, 0)).toISOString();
            expect(fakeLocalStorage.get('originDestination')).toEqual(result);
        });
    });
    describe('when generateOldOriginDestinationInfo is called', () => {
        beforeEach(inject(() => {
        }));
        it('', () => {
            let returnData = IbBookingAvailabilityPageUtilsService.generateOldOriginDestinationInfo(0, {originDestinations:[{selectedFilters:'test', filterOptions:'test'}]});
            expect(returnData).toEqual({selectedFilters: ['test'], filterOptions: ['test']});
        });
    });
    describe('when initializeLang is called', () => {
        beforeEach(inject(() => {
            rootScope.appLang = 'ES';
        }));
        it('and language is defined', () => {
            let returnData = IbBookingAvailabilityPageUtilsService.initializeLang();
            expect(returnData).toEqual('es');
        });
        it('and language is not defined', () => {
            rootScope.appLang = null;
            let returnData = IbBookingAvailabilityPageUtilsService.initializeLang();
            expect(returnData).toEqual('es');
        });
    });
    describe('when initializeMarket is called', () => {
        beforeEach(inject(() => {
            rootScope.appMarket = 'ES';
        }));
        it('and market is defined', () => {
            let returnData = IbBookingAvailabilityPageUtilsService.initializeMarket();
            expect(returnData).toEqual('ES');
        });
        it('and market is not defined', () => {
            rootScope.appMarket = null;
            let returnData = IbBookingAvailabilityPageUtilsService.initializeMarket();
            expect(returnData).toEqual('ES');
        });
    });
    describe('when setIsPointsOBFlow is called', () => {
        beforeEach(inject(() => {

        }));
        it('and OB points are set in URL', () => {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((valor) => {
                if(valor?.includes('pagoPuntos')){
                    return true;
                } else return null;
            });
            IbBookingAvailabilityPageUtilsService.setIsPointsOBFlow(true);
            expect(rootScope.isPointsOBFlow).toBeTruthy();
        });
        it('and OB points are not set in URL', () => {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((valor) => {
                return null;
            });
            fakeLocalStorage.set('searchFlightType', 'redemptionFlight');
            fakeLocalStorage.set('userLogged', 'ONB');
            IbBookingAvailabilityPageUtilsService.setIsPointsOBFlow(true);
            expect(rootScope.isPointsOBFlow).toBeTruthy();
        });
    });
    describe('when setIsRedemptionFlow is called', () => {
        beforeEach(inject(() => {

        }));
        it('and OB points are set in URL', () => {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((valor) => {
                if(valor?.includes('pagoAvios')){
                    return true;
                } else return null;
            });
            IbBookingAvailabilityPageUtilsService.setIsRedemptionFlow(true);
            expect(rootScope.isRedemptionFlow).toBeTruthy();
        });
        it('and OB points are not set in URL', () => {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((valor) => {
                return null;
            });
            fakeLocalStorage.set('searchFlightType', 'redemptionFlight');
            fakeLocalStorage.set('userLogged', 'ONB');
            IbBookingAvailabilityPageUtilsService.setIsRedemptionFlow(true);
            expect(rootScope.isRedemptionFlow).toBeTruthy();
        });
    });
    describe('when initLocalStorage is called', () => {
        beforeEach(inject(() => {
            fakeLocalStorage.set('redirectionPaymentCallback', true);
            fakeLocalStorage.set('flowApp', 'BBKIOH');
        }));
        it('', () => {
            IbBookingAvailabilityPageUtilsService.initLocalStorage();
            expect(fakeLocalStorage.get('actualStepFlow')).toEqual('availability');
            expect(fakeLocalStorage.get('flowApp')).toEqual('BBKIOH');
        });
    });
    describe('when initLocalStorage is called', () => {
        let bookingAvailabilityService;
        beforeEach(inject(() => {
            bookingAvailabilityService = IbBookingAvailabilityPageUtilsService;
            spyOn(bookingAvailabilityService, 'isRedemptionShuttleFlow').and.callThrough();
        }));
        it('should call isRedemptionShuttleFlow function isRedemptionFlow is true', () => {
            rootScope.isRedemptionFlow = true;
            bookingAvailabilityService.initLocalStorage();
            expect(bookingAvailabilityService.isRedemptionShuttleFlow).toHaveBeenCalledTimes(1);
        });
        it('should not call isRedemptionShuttleFlow function isRedemptionFlow is false', () => {
            rootScope.isRedemptionFlow = false;
            bookingAvailabilityService.initLocalStorage();
            expect(bookingAvailabilityService.isRedemptionShuttleFlow).toHaveBeenCalledTimes(0);
        });
    });
    describe('when setPaymentStatusValue is called', () => {
        beforeEach(inject(() => {

        }));
        it('and paymentStatus is OK', () => {
            let returnData = IbBookingAvailabilityPageUtilsService.setPaymentStatusValue(true, 'OK');
            expect(returnData).toEqual(true);
        });
        it('and paymentStatus is KO', () => {
            let returnData = IbBookingAvailabilityPageUtilsService.setPaymentStatusValue(true, 'KO');
            expect(returnData).toEqual(false);
        });
        it('and paymentStatus is undefined', () => {
            let returnData = IbBookingAvailabilityPageUtilsService.setPaymentStatusValue(true, undefined);
            expect(returnData).toEqual(true);
        });
    });
    describe('when resetShowBasketDiscounts is called', () => {
        beforeEach(inject(() => {

        }));
        it(' , it will reset shopping basket', () => {
            IbBookingAvailabilityPageUtilsService.resetShowBasketDiscounts({headerModel:{shoppingBasket:{discountsModel:{total:0, discounts:{}, hasDiscounts:false}}}});
            expect(fakeNewMainHeaderFacade.updateHeaderModel).toHaveBeenCalledWith({headerModel:{shoppingBasket:{discountsModel:{total:0, discounts:{}, hasDiscounts:false}}}});
        });
    });
    describe('when checkLoadingCalendarSlides is called', () => {
        beforeEach(inject(() => {
            spyOn(rootScope, '$broadcast');
            fakeBookingAvailabilityService.getCalendarRibbon = jasmine.createSpy('getCalendarRibbon').and.callFake(()=>{
                return Promise.resolve({});
            });
        }));
        it(' , it will return slides', () => {
            IbBookingAvailabilityPageUtilsService.checkLoadingCalendarSlides({calendarSlides:{slides:[{}], currentInitialSlide:1}}, true, true, false, 0);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('finishLoadingSlides');
        });
        it(' , it will call calendar ribbon', () => {
            IbBookingAvailabilityPageUtilsService.checkLoadingCalendarSlides({calendarSlides:{slides:[{state:'LOADING'}], currentInitialSlide:3}}, true, true, false, 0);
            expect(fakeBookingAvailabilityService.getCalendarRibbon).toHaveBeenCalled();
        });
    });
    describe('when scrollToOdStart is called', () => {
        beforeEach(inject(() => {
        }));
        it('should not scroll if neither the origin destination nor the selected slice have an offset', () => {
            const elementSpy = jasmine.createSpy('element');
            elementSpy.and.returnValue({
                offset: () => {
                    return null;
                }
            });
            IbBookingAvailabilityPageUtilsService.scrollToOdStart(1, []);
            timeout.flush();

            expect(elementSpy).not.toHaveBeenCalledWith('html, body');
        });
    });
    describe('when checkSliceCompatibility is called', () => {
        beforeEach(inject(() => {
        }));
        it('', () => {
            const currentSelectedSlice = {
                    originDestinationId:0,
                    info:{
                        segments:[{
                            segmentId:0,
                            offers:[{
                                offerId:0
                            }],
                            cabins:[{
                                isCabinCompatible:true
                            }]
                        }],
                        sliceId:0,
                        selectedFareFamily:{
                            offers:[{
                                offerId:0
                            }]
                        },
                        sliceSelectedSegments:0,
                        selectedCabin:0
                    }
                }, selectedSlices = [{
                    selectedSegments: [{
                        info:{
                            cabins:[{
                                notAvailableCabins:[{
                                    originDestinationId:0,
                                    segmentId:0,
                                    sliceId:0,
                                    offerId:0
                                }],
                                isCabinCompatible: true
                            }]
                        },
                        cabin:0
                    }]
                }];
            let returnValue = IbBookingAvailabilityPageUtilsService.checkSliceCompatibility(currentSelectedSlice, selectedSlices);
            expect(returnValue).toBeFalsy();
        });
    });
    describe('when checkSegmentCompatibility is called', () => {
        beforeEach(inject(() => {
        }));
        it('', () => {
            const currentSelectedSegment = {info:{selectedFareFamily:{offers:[{offerId:0}]}}};
            const selectedSlices = [{selectedSegments:[{info:{cabins:[{notAvailableCabins:[{offerId:0}]}]}, cabin:0}]}];
            let returnValue = IbBookingAvailabilityPageUtilsService.checkSegmentCompatibility(currentSelectedSegment, 0, selectedSlices);
            expect(returnValue).toBeTrue();
        });
    });
});
