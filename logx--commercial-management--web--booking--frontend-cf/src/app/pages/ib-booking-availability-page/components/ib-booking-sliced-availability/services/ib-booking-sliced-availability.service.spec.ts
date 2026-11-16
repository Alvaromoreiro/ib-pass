import { TestBed, fakeAsync } from '@angular/core/testing';
import { IbSetPartnersSelectionUtilsService } from '@shared/components/ib-booking-partners-modal/ib-set-partners-selection.service';
import { IbBookingSlicedAvailabilityService } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/services/ib-booking-sliced-availability.service';
import { AJSIbBookingAvailabilityPageService } from '@src/app/pages/ib-booking-availability-page/services/ib-booking-availability-page-utils-bridge.service';
import { AJSBookingAvailabilityService } from '@src/app/pages/ib-booking-availability-page/services/ib-booking-availability-service.bride.service';
import { IbBookingItineraryService } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/services/ib-booking-itinerary-service.service';
import { AJSSlicedAvailabilityDataTransformer } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/services/ib-availability-data-transformer-bridge.service';
import { AJSBookingAvailabilityTransformer } from '@shared/services/ib-booking-availability/transformers/ajs-upgrade/ib-booking-availability-transformer-bridge.service';
import { BookingRedirectionService } from '@shared/services/ib-utils/ib-booking-redirection.service';
import { DatalayerBKIConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-bki-constants';
import { AJSBookingModalService } from '@shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { CommonsSessionStorageService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { lastValueFrom, of, throwError } from 'rxjs';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { AJSDatalayerBKIService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { IbBookingPetsFlowServiceMock } from '@test-mocks/Services/IbBookingPetsFlowServiceMock';
import { IbBookingPetsFlowService } from '@src/app/shared/services/ib-utils/ib-bookig-pets-flow.service';
import { BookingErrorPageStore } from '@src/app/core/store/ib-booking-error-page.store';
import { IbAvailabilityRibbonService } from './ib-availability-ribbon.service';
import { IbAvailabilityRibbonServiceMock } from '@test-mocks/unit/app/pages/ib-booking-availability/ib-booking-sliced-availability/ib-sliced-availability.component.classes-mocks';


class IbBookingItineraryServiceMock {
    public outboundResponse = {};
    public inboundResponse = {};
    public ribbonResponse = {};
    public getOutboundAvailability = jasmine.createSpy('getOutboundAvailability')
        .and.callFake(() => of(this.outboundResponse));
    public getInboundAvailability = jasmine.createSpy('getInboundAvailability')
        .and.callFake(()=> of(this.inboundResponse));
    public getRibbonAvailability = jasmine.createSpy('getRibbonAvailability')
        .and.callFake(()=> of(this.ribbonResponse));
}

class BookingRedirectionServiceMock {
    public path = jasmine.createSpy('path').and.returnValue('path');
}
class AvailabilityDataTransformerMock {
    transformGetAvailabilityData = jasmine.createSpy('transformGetAvailabilityData').and.callFake((data) => (data ?? {}));
}
class BookingAvailabilityTransformerMock {
    createRequestAvailability = jasmine.createSpy('createRequestAvailability').and.returnValue({});
    getDetailedFaresInfo = jasmine.createSpy('getDetailedFaresInfo').and.returnValue(
        {
            conditions: {
                TEST: {
                    info: { code: 'TEST', icon: null }
                }
            }

        }
    );
    createGetFareRequest = jasmine.createSpy('createGetFareRequest').and.returnValue('');

}

class BookingModalServiceMock {
    showWaitingModal = jasmine.createSpy('showWaitingModal');
    showGenericModal = jasmine.createSpy('showGenericModal').and.returnValue({result:Promise.resolve()});
    showGenericError = jasmine.createSpy('showGenericError').and.returnValue({ result: Promise.resolve() });
    showFaresModal = jasmine.createSpy('showFaresModal').and.returnValue({ result: Promise.resolve() });
    finishWaiting = jasmine.createSpy('finishWaiting');
    showBKISliceTimeLeftModal = jasmine.createSpy('showBKISliceTimeLeftModal').and.returnValue({ result: Promise.resolve() });
}

class IbBookingAvailabilityPageUtilsServiceMock {
    checkLoadingCalendarSlides = jasmine.createSpy('checkLoadingCalendarSlides');
    equalFareHeights = jasmine.createSpy('equalFareHeights');
    updateHeaderDates= jasmine.createSpy('equalFareHeights');
}

class BookingAvailabilityServiceMock {
    selectAvailabilityResponse:Promise<{ warnings: { code: string; }[]; }> | Promise<void> = Promise.resolve();
    selectAvailability = jasmine.createSpy('selectAvailability').and.callFake(() => this.selectAvailabilityResponse);
    getSliceTimeLeftReturn = { totalMins: 119 };
    getSliceTimeLeft = jasmine.createSpy('getSliceTimeLeft').and.callFake(() => this.getSliceTimeLeftReturn);
}

class IbCUserUtilsServiceMock {
    isIbplusResponse: boolean = true;
    isUserLoggedResponse:boolean = true;
    isUserLogged = jasmine.createSpy('isUserLogged').and.callFake(() => this.isUserLoggedResponse);
    isIbPlus = jasmine.createSpy('isIbPlus').and.callFake(() => this.isIbplusResponse);
}
class IbSetPartnersSelectionUtilsServiceMock {
    checkPartnerDiscountSelection = jasmine.createSpy('checkPartnerDiscountSelection').and.returnValue(Promise.resolve());
}
class DatalayerBKIServiceMock {
    updateDatalayerObject = jasmine.createSpy('updateDatalayerObject').and.callFake(()=>{});
}

class BookingErrorPageStoreMock {
    setError = jasmine.createSpy('setError');
}

let fakeIbBookingItineraryService: IbBookingItineraryServiceMock;
let fakeBookingRedirectionService: BookingRedirectionServiceMock;
let fakeCommonsSessionStorageService = new StorageServiceMock();
let fakeAvailabilityDataTransformer: AvailabilityDataTransformerMock;
let fakeBookingAvailabilityTransformer: BookingAvailabilityTransformerMock;
let fakeBookingModalService: BookingModalServiceMock;
let fakeIbBookingAvailabilityPageUtilsService: IbBookingAvailabilityPageUtilsServiceMock;
let fakeBookingAvailabilityService: BookingAvailabilityServiceMock;
let service: IbBookingSlicedAvailabilityService;
let fakeIbSetPartnersSelectionUtilsService: IbSetPartnersSelectionUtilsServiceMock;
let fakeDatalayerBKIServiceMock: DatalayerBKIServiceMock;
const {availabilityData: availabilityDataMock, selectedSlices: selectedSlicesMock} = require('@test-mocks/unit/app/pages/ib-booking-availability/ib-booking-sliced-availability/ib-booking-sliced-availability-mocks.json');
let fakeIbCUserUtilsService: IbCUserUtilsServiceMock;

describe('Test IbBookingSlicedAvailabilityService', () => {
    beforeEach(() => {
        fakeCommonsSessionStorageService.clear();
        fakeIbBookingItineraryService = new IbBookingItineraryServiceMock();
        fakeBookingRedirectionService = new BookingRedirectionServiceMock();
        fakeAvailabilityDataTransformer = new AvailabilityDataTransformerMock();
        fakeBookingAvailabilityTransformer = new BookingAvailabilityTransformerMock();
        fakeBookingModalService = new BookingModalServiceMock();
        fakeIbBookingAvailabilityPageUtilsService = new IbBookingAvailabilityPageUtilsServiceMock();
        fakeBookingAvailabilityService = new BookingAvailabilityServiceMock();
        fakeIbCUserUtilsService = new IbCUserUtilsServiceMock();
        fakeIbSetPartnersSelectionUtilsService = new IbSetPartnersSelectionUtilsServiceMock();
        fakeDatalayerBKIServiceMock = new DatalayerBKIServiceMock();
        
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: IbBookingItineraryService, useValue: fakeIbBookingItineraryService },
                { provide: BookingRedirectionService, useValue: fakeBookingRedirectionService },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: AJSSlicedAvailabilityDataTransformer, useValue: fakeAvailabilityDataTransformer },
                { provide: AJSBookingAvailabilityTransformer, useValue: fakeBookingAvailabilityTransformer },
                { provide: AJSBookingModalService, useValue: fakeBookingModalService },
                { provide: AJSIbBookingAvailabilityPageService, useValue: fakeIbBookingAvailabilityPageUtilsService },
                { provide: AJSBookingAvailabilityService, useValue: fakeBookingAvailabilityService },
                { provide: IbCUserUtilsService, useValue: fakeIbCUserUtilsService },
                { provide: IbSetPartnersSelectionUtilsService, useValue: fakeIbSetPartnersSelectionUtilsService},
                { provide: AJSDatalayerBKIService, useValue: fakeDatalayerBKIServiceMock },
                { provide: IbBookingPetsFlowService, useClass: IbBookingPetsFlowServiceMock},
                { provide: IbAvailabilityRibbonService, useClass: IbAvailabilityRibbonServiceMock},
                {provide: BookingErrorPageStore, useClass: BookingErrorPageStoreMock},
                IbBookingSlicedAvailabilityService

            ]
        });
        service = TestBed.inject(IbBookingSlicedAvailabilityService);
    });
    
    
    describe('Test checkSelectedSliceTimeLeft', () => {
        beforeEach(() => {
            fakeBookingAvailabilityService.getSliceTimeLeftReturn = { totalMins: 119 };
            fakeBookingModalService.showBKISliceTimeLeftModal =
                jasmine.createSpy('showBKISliceTimeLeftModal').and.returnValue({ result: Promise.resolve() });
        });
        it('Time is less than 2 Hours', (done) => {
            service.checkSelectedSliceTimeLeft(null).then(() => {
                expect(fakeBookingModalService.showBKISliceTimeLeftModal).toHaveBeenCalled();
                done();
            }, () => done.fail());

        });
        it('Time is more than 2 Hours', (done) => {
            fakeBookingAvailabilityService.getSliceTimeLeftReturn = { totalMins: 300 };
            service.checkSelectedSliceTimeLeft(null).then(() => {
                expect(fakeBookingModalService.showBKISliceTimeLeftModal).not.toHaveBeenCalled();
                done();
            }, () => done.fail());
        });
        it('Time is less than 2 Hours and reject', (done) => {
            fakeBookingModalService.showBKISliceTimeLeftModal = jasmine.createSpy('showBKISliceTimeLeftModal').and.returnValue({ result: Promise.reject() });
            service.checkSelectedSliceTimeLeft(null).then(() => {
                done.fail();
            }, () => done());
        });
    });
    

    describe( 'Test setSlicedRequestFareInfo', () => {
        
        const buildParams = () => ({
            selectedSlices: [{ id: 'slice1' } as unknown as any],
            responseId: 'response-id',
            requestFareInfo: { fare: 'mock' }
        });

        beforeEach(() => {
            spyOn(service as any, 'onFareRequestSuccess');
            fakeBookingAvailabilityService.selectAvailabilityResponse = Promise.resolve();
            fakeBookingRedirectionService.path.calls.reset();
            fakeBookingModalService.finishWaiting.calls.reset();
            fakeBookingModalService.showGenericError.calls.reset();
        });        
        
        it('should execute full success flow', async () => {
            const { selectedSlices, responseId, requestFareInfo } = buildParams();
            fakeBookingAvailabilityTransformer.createGetFareRequest.and.returnValue(requestFareInfo);
            fakeBookingAvailabilityService.selectAvailability.and.resolveTo('fare-response');
            await service.setSlicedRequestFareInfo(selectedSlices, responseId, true);
            expect(fakeBookingAvailabilityTransformer.createGetFareRequest).toHaveBeenCalledWith({
                availabilityData: { responseId },
                selectedSlices
            });
            expect(fakeBookingModalService.showWaitingModal).toHaveBeenCalledWith(
                'ib-modal-loading-plane',
                'ib-modals ib-modals--transparent ib-modals--loading-page',
                true
            );
            expect(fakeBookingAvailabilityService.selectAvailability).toHaveBeenCalled();
            expect((service as any).onFareRequestSuccess).toHaveBeenCalledWith(
                'fare-response',
                selectedSlices,
                true
            );
        });

        it( 'should throw error when selectAvailability fails', async () => {
            const { selectedSlices, responseId, requestFareInfo } = buildParams();
            const error = new Error('failure');
            fakeBookingAvailabilityTransformer.createGetFareRequest.and.returnValue(requestFareInfo);
            fakeBookingAvailabilityService.selectAvailability.and.rejectWith(error);
            let thrownError: unknown;
            try {
                await service.setSlicedRequestFareInfo(selectedSlices, responseId);
            } catch (e) {
                thrownError = e;
            }
            expect(thrownError).toBe(error);
            expect(fakeBookingAvailabilityTransformer.createGetFareRequest).toHaveBeenCalled();
            expect(fakeBookingModalService.showWaitingModal).toHaveBeenCalled();
            expect(fakeBookingAvailabilityService.selectAvailability).toHaveBeenCalled();
            expect((service as any).onFareRequestSuccess).not.toHaveBeenCalled();
        } );
        
        it('should use default allowedRecapStep as false', async () => {
            const { selectedSlices, responseId, requestFareInfo } = buildParams();
            fakeBookingAvailabilityTransformer.createGetFareRequest.and.returnValue(requestFareInfo);
            fakeBookingAvailabilityService.selectAvailability.and.resolveTo('fare-response');
            await service.setSlicedRequestFareInfo(selectedSlices, responseId);
            expect((service as any).onFareRequestSuccess).toHaveBeenCalledWith(
                'fare-response',
                selectedSlices,
                false
            );
        });
    });

    describe('Test setStoredReleatedContent', () => {
        it('test relatedcontent maping', () => {
            const related = {test: 7767676};
            const result = service.setStoredReleatedContent(related);
            expect(result).toEqual([{key: 'test', value: related.test.toString()}]);
        });
    });
    describe('Test storeSelectedSliceData', () => {
        it('Validate that trip was stored in session', () => {
            const trips = [
                {
                    info: {
                        segments: [
                            {id: 1}, {id:2}
                        ]
                    }}
            ];
            service.storeSelectedSliceData(trips as any);
            const segments = fakeCommonsSessionStorageService.get('selectedTripSegments');
            expect(segments).toEqual([[{id: 1}, {id:2}]]);
        });
    });
    describe('Test openFareWindowModal', () => {
        it('launch fare comparation modal', fakeAsync(() => {
            service.openFareWindowModal({} as any, {} as any);
            expect(fakeBookingModalService.showFaresModal).toHaveBeenCalled();
        }));
    });
    describe('getEquivalentSlices', () => {
        it('test equivelent slices', () => {
            const availabilityData = JSON.parse(JSON.stringify(availabilityDataMock), (key, val) => ((key === '$$hashKey') ? undefined : val));
            const sliceData = JSON.parse(JSON.stringify(selectedSlicesMock), (key, val) => ((key === '$$hashKey') ? undefined : val));
            const result = service.getEquivalentSlices(availabilityData, sliceData);
            expect(result).toEqual(sliceData);
        });
    });

    describe('nextSliceDate', () => {
        it('test next slice', () => {
            service.nextSliceDate(true, availabilityDataMock, 0);
            expect(fakeIbBookingAvailabilityPageUtilsService.checkLoadingCalendarSlides).toHaveBeenCalled();
        });
    });
    describe('loadMobileSlideDates', () => {
        it('test next slice', () => {
            service.loadMobileSlideDates(true, availabilityDataMock, 0, 0);
            expect(fakeIbBookingAvailabilityPageUtilsService.checkLoadingCalendarSlides)
                .toHaveBeenCalledWith(availabilityDataMock.originDestinations[0], true, null, false, 0);
        });
    });

    describe('Test updateBookingAvailabilityDates', () => {
        it('when update dates is called', () => {
            const selectedSliceInfo = {
                serviceDate:'date'
            };
            fakeCommonsSessionStorageService.set('availabilityRequestData', {slices:[{date:'fecha'}]});
            fakeCommonsSessionStorageService.set('bookingUrlParams', {originDestinations:[{date:'fecha'}]});
            service.updateBookingAvailabilityDates(selectedSliceInfo, 0);
            expect(fakeCommonsSessionStorageService.get('bookingUrlParams'))
                .toEqual({ originDestinations: [{ date: 'date' }] });
            expect(fakeCommonsSessionStorageService.get('availabilityRequestData'))
                .toEqual({ slices: [{ date: 'date' }] });

        });
    });

    describe('Test updateParametersWithDiscounts', () => {
        it('When selectedDiscounts', () => {
            const bkiURLParams = {};
            fakeCommonsSessionStorageService.set('bookingUrlParams', bkiURLParams);
            fakeCommonsSessionStorageService.set('availabilityRequestData', 'value');
            service.updateParametersWithDiscounts({ largeFamilyType: 'F2', resident: 'RC' });
            expect(fakeCommonsSessionStorageService.get('availabilityRequestData')).toBeNull();
            expect(fakeCommonsSessionStorageService.get('bookingUrlParams')).toEqual({ largeFamilyType: 'F2', resident: 'RC' });
        });
    });

    describe('getOutboundAvailability', () => {
        it('must call service and go OK', (done) => {
            lastValueFrom(service.getOutboudAvailabilityGrid())
                .then(() => {
                    expect(fakeIbBookingItineraryService.getOutboundAvailability).toHaveBeenCalled();
                    done();
                }, ()=> done.fail());
        });
    });
    describe('getOutboundAvailability KO response', () => {
        const errorTestCases = [
            {
                description: 'when 500 go to ibkerror',
                errorResponse: { errorCode: 500 },
                expectedPath: '/ibbkerror',
                setup: () => {},
                shouldVerifyFinishWaiting: true
            },
            {
                description: 'when 404 and internal SSE_AVM_12001 go to ibkerror',
                errorResponse: { errorCode: 404, internalErrorCode: 'SSE_AVM_12001' },
                expectedPath: '/caldit',
                setup: () => {},
                shouldVerifyFinishWaiting: false
            },
            {
                description: 'when 404 and petsFlow',
                errorResponse: { errorCode: 404, internalErrorCode: 'SSE_AVM_12001' },
                expectedPath: '/errpetc',
                setup: () => {
                    const IbBookingPetsFlowService = service['IbBookingPetsFlowService'] as IbBookingPetsFlowServiceMock;
                    IbBookingPetsFlowService.isPetsFlow = true;
                },
                shouldVerifyFinishWaiting: false
            }
        ];

        errorTestCases.forEach(({ description, errorResponse, expectedPath, setup, shouldVerifyFinishWaiting }) => {
            it(description, (done) => {
                setup();
                fakeIbBookingItineraryService.getOutboundAvailability =
                    jasmine.createSpy('getOutboundAvailability').and.callFake(
                        () => throwError(() => errorResponse)
                    );
                lastValueFrom(service.getOutboudAvailabilityGrid())
                    .then(
                        () => done.fail(),
                        () => {
                            if (shouldVerifyFinishWaiting) {
                                expect(fakeBookingModalService.finishWaiting).toHaveBeenCalled();
                            }
                            expect(fakeBookingRedirectionService.path).toHaveBeenCalledWith(expectedPath);
                            done();
                        });
            });
        });

    });
    describe('getInboundAvailability', () => {
        it('must call service and go OK', (done) => {
            lastValueFrom(service.getInboundAvailability('', '', 98))
                .then(() => {
                    expect(fakeIbBookingItineraryService.getInboundAvailability).toHaveBeenCalled();
                    done();
                }, ()=> done.fail());
        });
    });

    describe('getOutboudAvailabilityGrid', () => {
        it('must get transformed response', (done) => {
            lastValueFrom(service.getOutboudAvailabilityGrid())
                .then(() => {
                    expect(fakeAvailabilityDataTransformer.transformGetAvailabilityData).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Object));
                    done();
                });
        });

        it('must map itinerary DTO fields before transform', (done) => {
            fakeIbBookingItineraryService.outboundResponse = {
                offers: [{ price: { tax: 19 } }],
                originDestinations: [{ origin: 'MAD', destination: 'BIO', slices: [] }],
                passengers: [],
                responseId: 'resp-1',
                fareFamilyConditions: [{ commercialCode: 'OPTIMA' }],
                contextMetadata: { currencies: [] },
                uniqueProductSuproductPairs: [],
                relatedContent: [],
                brandedFares: [],
                freeBaggageAllowances: [],
                warnings: null,
                flightRatio: 'OW'
            } as any;

            lastValueFrom(service.getOutboudAvailabilityGrid())
                .then(() => {
                    const transformedCallArg = fakeAvailabilityDataTransformer.transformGetAvailabilityData.calls.mostRecent().args[0];
                    expect(transformedCallArg.tax).toBe(19);
                    expect(transformedCallArg.selectedSlices).toEqual([]);
                    expect(transformedCallArg.warnings).toEqual([]);
                    expect(transformedCallArg.responseId).toBe('resp-1');
                    done();
                }, () => done.fail());
        });
    });

    describe('getInboundAvailabilityGrid', () => {

        const createTransformedResponseMock = () => ({
            transformedAvailabilityData: {
                originDestinations: [{ showOd: true }, { showOd: false }],
                fareFamilyConditions: []
            },
            originCalendarInfo: [],
            datalayerObject: {},
            digitalDataObject: {},
            fareFamilyConditions: [],
            specialDiscounts: [],
            allAvailableOffers: []
        });

        it('Get full availability', (done) => {
            const { inboundData, outboundData } = require('@test-mocks/unit/app/pages/ib-booking-availability/ib-booking-sliced-availability/ib-booking-sliced-itinerary-transformed-responses.json');
            fakeIbBookingItineraryService.inboundResponse = { availability: inboundData };
            fakeAvailabilityDataTransformer.transformGetAvailabilityData.and.returnValue(createTransformedResponseMock());
            lastValueFrom(service.getInboundAvailabilityGrid(outboundData, '', 1))
                .then((data) => {
                    expect(fakeIbBookingItineraryService.getInboundAvailability).toHaveBeenCalled();
                    expect(data.transformedAvailabilityData.originDestinations[0].showOd).toBeFalse();
                    expect(data.transformedAvailabilityData.originDestinations[1].showOd).toBeTrue();
                    expect(data.datalayerObject['resultadosIda']).toBe(outboundData.datalayerObject['resultadosIda']);
                    expect(data.digitalDataObject['Slice1Results']).toBe(outboundData.digitalDataObject['Slice1Results']);
                    done();
                }, ()=> done.fail());
        });

        it('must normalize warnings and tax fallback from itinerary DTO', (done) => {
            const { outboundData } = require('@test-mocks/unit/app/pages/ib-booking-availability/ib-booking-sliced-availability/ib-booking-sliced-itinerary-transformed-responses.json');
            const inboundDto = {
                offers: [],
                originDestinations: [],
                passengers: [],
                responseId: 'inbound-1',
                fareFamilyConditions: [{ commercialCode: 'TURISTA' }],
                contextMetadata: { currencies: [] },
                uniqueProductSuproductPairs: [],
                relatedContent: [],
                brandedFares: [],
                freeBaggageAllowances: [],
                warnings: null,
                flightRatio: 'RT'
            };
            fakeIbBookingItineraryService.inboundResponse = { availability: inboundDto };
            fakeAvailabilityDataTransformer.transformGetAvailabilityData.and.returnValue(createTransformedResponseMock());

            lastValueFrom(service.getInboundAvailabilityGrid(outboundData, '', 1))
                .then(() => {
                    const transformedCallArg = fakeAvailabilityDataTransformer.transformGetAvailabilityData.calls.mostRecent().args[0];
                    expect(transformedCallArg.tax).toBe(0);
                    expect(transformedCallArg.warnings).toEqual([]);
                    expect(transformedCallArg.responseId).toBe('inbound-1');
                    done();
                }, () => done.fail());
        });
    });
    describe('Test checkPartnerDiscountSelection', () => {
        it('Test user not logged', (done) => {
            fakeIbCUserUtilsService.isIbplusResponse = false;
            service.checkPartnerDiscountSelection().then(() => {
                expect(fakeIbSetPartnersSelectionUtilsService.checkPartnerDiscountSelection).not.toHaveBeenCalled();
                done();
            }, () => { done.fail(); });
        });
        it('Test user is logged', (done) => {
            fakeIbCUserUtilsService.isIbplusResponse = true;
            service.checkPartnerDiscountSelection().then(() => {
                expect(fakeIbSetPartnersSelectionUtilsService.checkPartnerDiscountSelection).toHaveBeenCalled();
                done();
            }, () => { done.fail(); });
        });
    });


    describe('Test check filterDigitalDataSliceResults', () => {
        it('Validate delete Slice2Results', () => {
            let datalayerObject = {[DatalayerBKIConstants.SLICE_2_RESULTS] : 'test'};
            datalayerObject = service.filterDigitalDataSliceResults(datalayerObject, 0);
            expect(datalayerObject).toEqual({});
        });
    });
    describe('getRibbonAvailability', () => {
        it('must get transformed response', (done) => {
            lastValueFrom(service.getRibbonAvailability())
                .then(() => {
                    expect(fakeBookingAvailabilityTransformer.createRequestAvailability).toHaveBeenCalled();
                    expect((service as any).IbAvailabilityRibbonService.getRibbonAvailability).toHaveBeenCalled();
                    expect(service.calendarData).toEqual({} as any);
                    done();
                });
        });
    });
});
