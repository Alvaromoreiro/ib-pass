import { fakeAsync, flushMicrotasks, TestBed } from "@angular/core/testing";
import { IbBookingItineraryService } from "@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/services/ib-booking-itinerary-service.service";
import { CallItineraryService } from "@shared/http-services/sse-avm/ib-call-itinerary.service";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { IbBookingPetsFlowServiceMock } from '@test-mocks/Services/IbBookingPetsFlowServiceMock';
import { IbBookingPetsFlowService } from "@src/app/shared/services/ib-utils/ib-bookig-pets-flow.service";

import { firstValueFrom, of, throwIfEmpty } from "rxjs";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";
import { BKMCallItineraryService } from "@src/app/shared/http-services/booking-manager/ib-bkm-call-itinerary.service";
import { BKMCallItineraryServiceMock } from "test/mocks/Services/BKMCallItineraryServiceMock";
import { BkiStorageConstants } from "@src/app/core/constants/ib-booking-storage-constants";

class CallItineraryServiceMock {
    public outboundResponse = {data: {}};
    public inboundResponse = {data: {}}

    public getReturnItinerary = jasmine.createSpy('getReturnItinerary').and.callFake(
        () => of(this.inboundResponse).pipe(throwIfEmpty(() => new Error()))
    )
    public getOutboundItinerary = jasmine.createSpy('getOutboundItinerary')
        .and.callFake(()=> of(this.outboundResponse).pipe(throwIfEmpty(() => new Error()))
    )
};
// @ts-ignore
interface ServiceTest extends  IbBookingItineraryService{
    CallItineraryService: CallItineraryServiceMock,
    CommonsSessionStorageService: StorageServiceMock,
    IbBookingPetsFlowService: IbBookingPetsFlowServiceMock,
    BKMCallItineraryService: BKMCallItineraryServiceMock

}

describe('Test IbBookingItineraryService', () => {
    let service : ServiceTest;
    beforeEach(()=> {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                IbBookingItineraryService,
                { provide: CallItineraryService, useClass:  CallItineraryServiceMock},
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock},
                { provide: IbBookingPetsFlowService, useClass: IbBookingPetsFlowServiceMock },
                { provide: BKMCallItineraryService, useClass: BKMCallItineraryServiceMock }
            ]
        });
        service = TestBed.inject( IbBookingItineraryService ) as any;
    });

    describe('Test checkUseBookingManager method', () => {
        it('should return true if isPetsFlow is true', () => {
            const { IbBookingPetsFlowService } = service;       
            IbBookingPetsFlowService.isPetsFlow = true;
            expect(service['checkUseBookingManager']()).toBeTrue();
        });
        it('should return true if forceBookingManager is true', () => {
            const { CommonsSessionStorageService } = service;       
            CommonsSessionStorageService.set(BkiStorageConstants.FORCE_BOOKING_MANAGER_ITINERARY, true);
            expect(service['checkUseBookingManager']()).toBeTrue();
        }); 
        it('should return false if both forceBookingManager and isPetsFlow are false', () => {
            const { CommonsSessionStorageService, IbBookingPetsFlowService } = service;       
            CommonsSessionStorageService.set(BkiStorageConstants.FORCE_BOOKING_MANAGER_ITINERARY, false);
            IbBookingPetsFlowService.isPetsFlow = false;
            expect(service['checkUseBookingManager']()).toBeFalse();
        });
    });


    describe('Test getInboundAvailability', () => {
        it('And response OK', fakeAsync(() => {
            const {CallItineraryService} = service;
            CallItineraryService.inboundResponse = { data: {
                    flights: [],
                    segments: [],
                    fareFamilyConditions: ['a']
            } };
            let response = null;
            firstValueFrom(service.getInboundAvailability('test', 'id', 1234))
                .then((data) => {
                    response = data;
                })
            flushMicrotasks();
            expect(response).toEqual({ availability: {
                    flights: [],
                    segments: [],
                    fareFamilyConditions: ['a']
            } })
        }));
    });
    describe('Test getOutboundAvailability', () => {
        const availabilityData: any = {
            slices: [
                { date: new Date() },
                { date: new Date() }
            ],
        }
        it('And response OK', fakeAsync(() => {           
            const {CallItineraryService} = service;
            CallItineraryService.outboundResponse = { data: {
                fareFamilyConditions: ['a']
            } };
            firstValueFrom(service.getOutboundAvailability(availabilityData))
                .then((data) => {
                    expect(data).toEqual({
                        fareFamilyConditions: ['a']
                    } as any);
                  
                });
            flushMicrotasks();
        }));
    });


    describe('Test when Digital Manager flow is active', () => {
        it('should use BKMCallItineraryService when isPetsFlow is true', fakeAsync(() => {
            const { BKMCallItineraryService, IbBookingPetsFlowService } = service;
            IbBookingPetsFlowService.isPetsFlow = true;
            firstValueFrom(service.getOutboundAvailability({} as AvailabilityTransformerModel.ItineraryRequestData))
                .then((data) => {
                    expect(BKMCallItineraryService.getOutboundItinerary).toHaveBeenCalled();
                });
            flushMicrotasks();
        }));    
    });

    describe('Test detectNotAvailability pipe', () => {
        const availabilityData: any = {
             slices: [
                { date: new Date() },
                { date: new Date() }
            ],
        };

        describe('When response has no warnings', () => {
            it('should accept null warnings from DTO payload', fakeAsync(() => {
                const { CallItineraryService } = service;
                const mockResponse = { data: { fareFamilyConditions: ['a'], warnings: null } };
                CallItineraryService.outboundResponse = mockResponse;

                let result = null;
                let error = null;

                firstValueFrom(service.getOutboundAvailability(availabilityData))
                    .then((data) => {
                        result = data;
                    })
                    .catch((err) => {
                        error = err;
                    });

                flushMicrotasks();
                expect(result).toEqual(mockResponse.data);
                expect(error).toBeNull();
            }));

            it('should return response without modifications via getOutboundAvailability', fakeAsync(() => {
                const { CallItineraryService } = service;
                const mockResponse = { data: { flights: [], segments: [], fareFamilyConditions: ['a'] } };
                CallItineraryService.outboundResponse = mockResponse;
                
                let result = null;
                let error = null;
                
                firstValueFrom(service.getOutboundAvailability(availabilityData))
                    .then((data) => {
                        result = data;
                    })
                    .catch((err) => {
                        error = err;
                    });
                
                flushMicrotasks();
                expect(result).toEqual(mockResponse.data);
                expect(error).toBeNull();
            }));

            it('should return response without modifications via getInboundAvailability', fakeAsync(() => {
                const { CallItineraryService } = service;
                const mockResponse = { data: { flights: [], segments: [], fareFamilyConditions: ['a'] } };
                CallItineraryService.inboundResponse = mockResponse;
                
                let result = null;
                let error = null;
                
                firstValueFrom(service.getInboundAvailability('testResponseId', 'testOfferId', 1))
                    .then((data) => {
                        result = data;
                    })
                    .catch((err) => {
                        error = err;
                    });
                
                flushMicrotasks();
                expect(result).toEqual({ availability: mockResponse.data });
                expect(error).toBeNull();
            }));
        });

        describe('When response has warnings but not SSE_AVM_12001', () => {
            it('should return response without modifications', fakeAsync(() => {
                const { CallItineraryService } = service;
                const mockResponseData = { 
                    flights: [], 
                    segments: [],
                    fareFamilyConditions: ['a'],
                    warnings: [
                            { code: 'OTHER_WARNING', description: 'Some other warning' }
                    ]
                };
                
                CallItineraryService.outboundResponse = { data: mockResponseData };
                
                let result = null;
                let error = null;
                
                firstValueFrom(service.getOutboundAvailability(availabilityData))
                    .then((data) => {
                        result = data;
                    })
                    .catch((err) => {
                        error = err;
                    });
                
                flushMicrotasks();
                expect(result).toEqual(mockResponseData);
                expect(error).toBeNull();
            }));
        });

        describe('When response has SSE_AVM_12001 warning', () => {
            it('should throw specific error via getOutboundAvailability', fakeAsync(() => {
                const { CallItineraryService } = service;
                const mockResponseData = { 
                    flights: [], 
                    segments: [],
                    warnings: [
                        { 
                            code: 'SSE_AVM_12001', 
                            description: 'No availability found for the selected criteria' 
                        }
                    ] 
                };
                
                CallItineraryService.outboundResponse = { data: mockResponseData };
                
                let result = null;
                let error = null;
                
                firstValueFrom(service.getOutboundAvailability(availabilityData))
                    .then((data) => {
                        result = data;
                    })
                    .catch((err) => {
                        error = err;
                    });
                
                flushMicrotasks();
                expect(result).toBeNull();
                expect(error).toEqual({
                    errorCode: 404,
                    internalErrorCode: 'SSE_AVM_12001',
                    message: 'No availability found for the selected criteria',
                    needsTranslate: false,
                    details: null
                });
            }));

        });

        describe('When fareFamilyConditions is empty', () => {
            it('should throw empty error object', fakeAsync(() => {
                const { CallItineraryService } = service;
                const mockResponseData = {
                    fareFamilyConditions: [],
                    warnings: null
                };

                CallItineraryService.outboundResponse = { data: mockResponseData };

                let result = null;
                let error = null;

                firstValueFrom(service.getOutboundAvailability(availabilityData))
                    .then((data) => {
                        result = data;
                    })
                    .catch((err) => {
                        error = err;
                    });

                flushMicrotasks();
                expect(result).toBeNull();
                expect(error).toEqual({});
            }));
        });

        describe('When using Booking Manager services', () => {
            it('should handle SSE_AVM_12001 warning via BKMCallItineraryService', fakeAsync(() => {
                const { BKMCallItineraryService, IbBookingPetsFlowService } = service;
                IbBookingPetsFlowService.isPetsFlow = true;
                
                const mockResponseData = { 
                    fareFamilyConditions: ['a'],
                    flights: [], 
                    segments: [],
                    warnings: [
                        { 
                            code: 'SSE_AVM_12001', 
                            description: 'No pets flights available' 
                        }
                    ] 
                };
                
                BKMCallItineraryService.outboundResponse = { 
                    code: 200,
                    data: mockResponseData 
                };
                
                let result = null;
                let error = null;
                
                firstValueFrom(service.getOutboundAvailability(availabilityData))
                    .then((data) => {
                        result = data;
                    })
                    .catch((err) => {
                        error = err;
                    });
                
                flushMicrotasks();
                expect(result).toBeNull();
                expect(error).toEqual({
                    errorCode: 404,
                    internalErrorCode: 'SSE_AVM_12001',
                    message: 'No pets flights available',
                    needsTranslate: false,
                    details: null
                });
                expect(BKMCallItineraryService.getOutboundItinerary).toHaveBeenCalled();
            }));
        });
    });
});
