import { AncillariesService } from './ib-web-ancillaries-temporal-service';

type TestSpy = jasmine.Spy<(...args: unknown[]) => unknown>;

interface ILocalStorageMock {
    get: jasmine.Spy<(key: string) => unknown>;
    set: jasmine.Spy<(key: string, value: unknown) => void>;
}

interface ITransformerMock {
    transformDeleteResponse: TestSpy;
    genAviosPriorityReq: TestSpy;
    calculateTotalBaggages: TestSpy;
    calculateTotalSpeqs: TestSpy;
    countBaggageTotal: TestSpy;
    countSpeqsTotal: TestSpy;
    countSeatsTotal: TestSpy;
    calculateTotalSeats: TestSpy;
    updateSeatInformation: TestSpy;
    getUpdateSeatInfo: TestSpy;
    buildAncillariesRequest: TestSpy;
    genReqAviosAncillariesBaggages: TestSpy;
    genAviosSpeqReq: TestSpy;
    genAviosAncillariesSummaryReq: TestSpy;
    genAviosFlexOnDemandReq: TestSpy;
    deleteAncillaryByType: TestSpy;
    deleteAncillaryBySubType: TestSpy;
}

interface ICommonsAncillariesMock {
    deleteAncillarie: TestSpy;
    updateAncillaries: TestSpy;
}

interface IModalServiceMock {
    isWaiting: TestSpy;
    isNotWaiting: TestSpy;
    setErrorMessage: TestSpy;
    setErrorCode: TestSpy;
    isError: TestSpy;
    showWaitingModal: TestSpy;
    showGenericError: TestSpy;
    openAviosAccumulatedModal: TestSpy;
}

const createModalServiceMock = (): IModalServiceMock => ({
    isWaiting: jasmine.createSpy('isWaiting'),
    isNotWaiting: jasmine.createSpy('isNotWaiting'),
    setErrorMessage: jasmine.createSpy('setErrorMessage'),
    setErrorCode: jasmine.createSpy('setErrorCode'),
    isError: jasmine.createSpy('isError'),
    showWaitingModal: jasmine.createSpy('showWaitingModal'),
    showGenericError: jasmine.createSpy('showGenericError').and.returnValue({ result: Promise.resolve() }),
    openAviosAccumulatedModal: jasmine.createSpy('openAviosAccumulatedModal').and.returnValue({ result: Promise.resolve() })
});

const createTransformerMock = (): ITransformerMock => ({
    transformDeleteResponse: jasmine.createSpy('transformDeleteResponse'),
    genAviosPriorityReq: jasmine.createSpy('genAviosPriorityReq'),
    calculateTotalBaggages: jasmine.createSpy('calculateTotalBaggages'),
    calculateTotalSpeqs: jasmine.createSpy('calculateTotalSpeqs'),
    countBaggageTotal: jasmine.createSpy('countBaggageTotal'),
    countSpeqsTotal: jasmine.createSpy('countSpeqsTotal'),
    countSeatsTotal: jasmine.createSpy('countSeatsTotal'),
    calculateTotalSeats: jasmine.createSpy('calculateTotalSeats'),
    updateSeatInformation: jasmine.createSpy('updateSeatInformation'),
    getUpdateSeatInfo: jasmine.createSpy('getUpdateSeatInfo'),
    buildAncillariesRequest: jasmine.createSpy('buildAncillariesRequest'),
    genReqAviosAncillariesBaggages: jasmine.createSpy('genReqAviosAncillariesBaggages'),
    genAviosSpeqReq: jasmine.createSpy('genAviosSpeqReq'),
    genAviosAncillariesSummaryReq: jasmine.createSpy('genAviosAncillariesSummaryReq'),
    genAviosFlexOnDemandReq: jasmine.createSpy('genAviosFlexOnDemandReq'),
    deleteAncillaryByType: jasmine.createSpy('deleteAncillaryByType'),
    deleteAncillaryBySubType: jasmine.createSpy('deleteAncillaryBySubType')
});

describe('AncillariesService', () => {
    let service: AncillariesService;
    let storage: Record<string, unknown>;
    let localStorageService: ILocalStorageMock;
    let location: { path: jasmine.Spy<(path: string) => unknown> };
    let transformer: ITransformerMock;
    let commonsAncillariesService: ICommonsAncillariesMock;
    let modalService: IModalServiceMock;
    let rootScope: { $broadcast: TestSpy; $emit: TestSpy };
    let constants: {
        TYPE_ANCILLARIE: {
            SEAT: string;
            GLOBICK: string;
            CO2_FOOTPRINT: string;
            INSURANCE: string;
            FLEXIBILITY: string;
            PRIORITY_BOARDING: string;
            BAGGAGE: string;
            SPEQS: string;
        };
        PAGES_ROUTES: { PAYMENTS: string; BOARDING_CARDS: string };
    };
    let currencyService: { formatPrice: TestSpy };
    let sessionStorageService: { set: jasmine.Spy<(key: string, value: unknown) => void> };
    let callBundleService: { putBundle: TestSpy };
    let headerFacade: { updateHeaderModel: TestSpy };
    let datalayerMenus: { updateDataLayer: TestSpy };

    const createService = (): AncillariesService => new AncillariesService(
        location as unknown as ConstructorParameters<typeof AncillariesService>[0],
        {} as ConstructorParameters<typeof AncillariesService>[1],
        transformer as unknown as ConstructorParameters<typeof AncillariesService>[2],
        localStorageService as unknown as ConstructorParameters<typeof AncillariesService>[3],
        { getPayments: jasmine.createSpy('getPayments') } as unknown as ConstructorParameters<typeof AncillariesService>[4],
        commonsAncillariesService as unknown as ConstructorParameters<typeof AncillariesService>[5],
        currencyService as unknown as ConstructorParameters<typeof AncillariesService>[6],
        modalService as unknown as ConstructorParameters<typeof AncillariesService>[7],
        constants as unknown as ConstructorParameters<typeof AncillariesService>[8],
        rootScope as unknown as ConstructorParameters<typeof AncillariesService>[9],
        {} as ConstructorParameters<typeof AncillariesService>[10],
        {} as ConstructorParameters<typeof AncillariesService>[11],
        {
            setAncillariesAction: jasmine.createSpy('setAncillariesAction'),
            setAncillariesDatalayer: jasmine.createSpy('setAncillariesDatalayer')
        } as unknown as ConstructorParameters<typeof AncillariesService>[12],
        {} as ConstructorParameters<typeof AncillariesService>[13],
        {} as ConstructorParameters<typeof AncillariesService>[14],
        {} as ConstructorParameters<typeof AncillariesService>[15],
        headerFacade as unknown as ConstructorParameters<typeof AncillariesService>[16],
        datalayerMenus as unknown as ConstructorParameters<typeof AncillariesService>[17],
        callBundleService as unknown as ConstructorParameters<typeof AncillariesService>[18],
        sessionStorageService as unknown as ConstructorParameters<typeof AncillariesService>[19]
    );

    beforeEach(() => {
        storage = {};
        localStorageService = {
            get: jasmine.createSpy('get') as jasmine.Spy<(key: string) => unknown>,
            set: jasmine.createSpy('set') as jasmine.Spy<(key: string, value: unknown) => void>
        };
        localStorageService.get.and.callFake((key: string) => storage[key]);
        localStorageService.set.and.callFake((key: string, value: unknown) => {
                storage[key] = value;
        });
        location = { path: jasmine.createSpy('path') as jasmine.Spy<(path: string) => unknown> };
        transformer = createTransformerMock();
        commonsAncillariesService = {
            deleteAncillarie: jasmine.createSpy('deleteAncillarie'),
            updateAncillaries: jasmine.createSpy('updateAncillaries')
        };
        modalService = createModalServiceMock();
        rootScope = {
            $broadcast: jasmine.createSpy('$broadcast'),
            $emit: jasmine.createSpy('$emit')
        };
        constants = {
            TYPE_ANCILLARIE: {
                SEAT: 'SEAT',
                GLOBICK: 'GLOBICK',
                CO2_FOOTPRINT: 'CO2_FOOTPRINT',
                INSURANCE: 'INSURANCE',
                FLEXIBILITY: 'FLEXIBILITY',
                PRIORITY_BOARDING: 'PRIORITY_BOARDING',
                BAGGAGE: 'BAGGAGE',
                SPEQS: 'SPEQS'
            },
            PAGES_ROUTES: {
                PAYMENTS: '/payments',
                BOARDING_CARDS: '/boarding-cards'
            }
        };
        currencyService = { formatPrice: jasmine.createSpy('formatPrice').and.returnValue('EUR 12.50') };
        sessionStorageService = { set: jasmine.createSpy('set') };
        callBundleService = { putBundle: jasmine.createSpy('putBundle').and.returnValue(Promise.resolve()) };
        headerFacade = { updateHeaderModel: jasmine.createSpy('updateHeaderModel') };
        datalayerMenus = { updateDataLayer: jasmine.createSpy('updateDataLayer') };
        service = createService();
    });

    it('stores the selected seat model and navigates to the seat map', () => {
        const model = { selectedSeats: [] };

        service.modifiedSeats('segment-1', 'passenger-1', model);

        expect(storage['ancillariesTransformedInfo']).toBe(model);
        expect(storage['seatMapSegment']).toEqual({ segmentId: 'segment-1', pasId: 'passenger-1' });
        expect(location.path).toHaveBeenCalledWith('/ckiancseat');
    });

    it('delegates ancillary counts and seat transformations', () => {
        const trips = [{ id: 'trip-1' }];
        const seats = [{ id: 'seat-1' }];
        transformer.calculateTotalBaggages.and.returnValue(2);
        transformer.calculateTotalSpeqs.and.returnValue(3);
        transformer.countBaggageTotal.and.returnValue(4);
        transformer.countSpeqsTotal.and.returnValue(5);
        transformer.countSeatsTotal.and.returnValue(6);
        transformer.calculateTotalSeats.and.returnValue(7);
        transformer.getUpdateSeatInfo.and.returnValue({ updated: true });

        expect(service.calculateTotalBaggages(trips)).toBe(2);
        expect(service.calculateTotalSpeqs(trips)).toBe(3);
        expect(service.countBaggageTotal(trips)).toBe(4);
        expect(service.countSpeqsTotal(trips)).toBe(5);
        expect(service.countSeatsTotal(seats)).toBe(6);
        expect(service.calculateTotalSeats(seats)).toBe(7);
        service.updateSeatInformation(trips, seats);
        expect(service.getUpdateSeatInfo(seats)).toEqual({ updated: true });
        expect(transformer.updateSeatInformation).toHaveBeenCalledWith(trips, seats);
    });

    it('shows the supplied error and resets the waiting state', () => {
        const error = { message: 'Request failed', internalErrorCode: 'ERR_01' };

        service.showError(error);

        expect(modalService.isNotWaiting).toHaveBeenCalled();
        expect(modalService.setErrorMessage).toHaveBeenCalledWith(error.message);
        expect(modalService.setErrorCode).toHaveBeenCalledWith(error.internalErrorCode);
        expect(modalService.isError).toHaveBeenCalledWith(error, null, null);
    });

    it('redirects to boarding cards for non-payment 412 errors', () => {
        service.showServiceError({ errorCode: 412, data: { errors: [{ code: 'OTHER_ERROR' }] } });

        expect(storage['nextStepAllowed']).toBe(false);
        expect(location.path).toHaveBeenCalledWith('/boarding-cards');
    });

    it('keeps the payment flow available for the exempt 412 error', () => {
        const error = { errorCode: 412, data: { errors: [{ code: 'PMT_PPM_8005' }] }, message: 'Payment pending' };
        spyOn(service, 'showPaymentError');

        service.showServiceError(error);

        expect(storage['nextStepAllowed']).toBe(true);
        expect(service.showPaymentError).toHaveBeenCalledWith(error);
        expect(location.path).not.toHaveBeenCalled();
    });

    it('redirects to boarding cards when no payment is required', () => {
        service.getPaymentsSuccess({ paymentMethods: [] });

        expect(modalService.isNotWaiting).toHaveBeenCalled();
        expect(storage['nextStepAllowed']).toBe(false);
        expect(location.path).toHaveBeenCalledWith('/boarding-cards');
    });

    it('formats an insurance offer using its premium', () => {
        const offer = { premium: 12.5 };

        const result = service.getPriceOfferInsurance('EUR', offer);

        expect(currencyService.formatPrice).toHaveBeenCalledWith('EUR', 12.5, true, false);
        expect(result).toEqual({ originalPrice: 12.5, currencyPrice: 'EUR 12.50' });
    });

    it('stores preorder availability when an issued item is a preorder', () => {
        service.checkPreorder({ issuedItems: [{ type: 'SEAT' }, { type: 'PREORDER' }] });

        expect(storage['hasPreorderAncillarie']).toBe(true);
    });

    it('starts the payment flow when no insurance cancellation is needed', () => {
        spyOn(service, 'updateAncillariesSuccess');

        service.generateRequestAncillaries([], [], null);

        expect(modalService.isWaiting).toHaveBeenCalled();
        expect(service.updateAncillariesSuccess).toHaveBeenCalledWith(null);
    });

    it('deletes a previously selected insurance before continuing without insurance', async () => {
        storage['hasSelectedInsurance'] = true;
        commonsAncillariesService.deleteAncillarie.and.returnValue(Promise.resolve({ failedToDelete: [] }));
        transformer.buildAncillariesRequest.and.returnValue([]);
        spyOn(service, 'updateAncillariesSuccess');

        service.generateRequestAncillaries([], [], null);
        await Promise.resolve();

        expect(commonsAncillariesService.deleteAncillarie).toHaveBeenCalledWith([{ type: 'INSURANCE' }]);
        expect(storage['hasSelectedInsurance']).toBe(false);
        expect(service.updateAncillariesSuccess).toHaveBeenCalledWith(null);
    });

    it('deletes a seat and returns the transformed response', async () => {
        const response = { success: true };
        const transformedResponse = { data: response, error: null };
        commonsAncillariesService.deleteAncillarie.and.returnValue(Promise.resolve(response));
        transformer.transformDeleteResponse.and.returnValue(transformedResponse);

        const result = await service.cancelSeat('segment-1', 'passenger-1');

        expect(commonsAncillariesService.deleteAncillarie).toHaveBeenCalledWith([{
            type: 'SEAT',
            segments: [{ id: 'segment-1', passengers: ['passenger-1'] }]
        }]);
        expect(modalService.isWaiting).toHaveBeenCalled();
        expect(modalService.isNotWaiting).toHaveBeenCalled();
        expect(result).toBe(response);
    });

    it('builds and sends a single-trip transfer update', async () => {
        storage['summaryInfo'] = { currencies: [{ code: 'EUR' }] };
        commonsAncillariesService.updateAncillaries.and.returnValue(Promise.resolve());

        await service.updateGlobickTransfers('2026-10-06', 'Car', 18, 'client-1', 'trip-1', 'booking-1');

        expect(commonsAncillariesService.updateAncillaries).toHaveBeenCalledWith([{
            type: 'GLOBICK',
            clientId: 'client-1',
            currency: 'EUR',
            items: [{
                product: 'TRANS',
                bookingReference: 'booking-1',
                name: 'Car',
                price: 18,
                startDate: '2026-10-06',
                endDate: ''
            }]
        }]);
        expect(modalService.showWaitingModal).toHaveBeenCalled();
        expect(modalService.isNotWaiting).toHaveBeenCalled();
    });

    it('builds and sends a return transfer update for both trips', async () => {
        storage['summaryInfo'] = { currencies: [{ code: 'EUR' }] };
        commonsAncillariesService.updateAncillaries.and.returnValue(Promise.resolve());

        await service.updateGlobickTransfersReturn(
            '2026-10-06', '2026-10-13', 'Car', 18, 20,
            'client-1', 'trip-1', 'booking-1', 'trip-2', 'booking-2'
        );

        expect(commonsAncillariesService.updateAncillaries).toHaveBeenCalledWith([{
            type: 'GLOBICK',
            clientId: 'client-1',
            currency: 'EUR',
            items: [
                {
                    product: 'TRANS', bookingReference: 'booking-1', name: 'Car', price: 18,
                    startDate: '2026-10-06', endDate: ''
                },
                {
                    product: 'TRANS', bookingReference: 'booking-2', name: 'Car', price: 20,
                    startDate: '2026-10-13', endDate: ''
                }
            ]
        }]);
        expect(modalService.isNotWaiting).toHaveBeenCalled();
    });

    it('uses the payment error reason when available and otherwise the message', () => {
        service.showPaymentError({ errorCode: 412, data: { errors: [{ reason: 'Payment declined' }] } });
        expect(modalService.setErrorMessage).toHaveBeenCalledWith('Payment declined');

        modalService.setErrorMessage.calls.reset();
        service.showPaymentError({ errorCode: 500, message: 'Service unavailable' });

        expect(modalService.setErrorMessage).toHaveBeenCalledWith('Service unavailable');
        expect(modalService.isError).toHaveBeenCalledWith(500, null, null);
    });

    it('broadcasts transfer basket updates when transfers are removed', () => {
        service.deleteGlobickTransfersFromBasket();

        expect(rootScope.$broadcast).toHaveBeenCalledWith('updateHeaderGlobickTransfers', null);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('basketUpdateCommonHeader');
    });

    it('stores the transfer deletion request in session storage', () => {
        storage['bookingReferencesTransfers'] = ['booking-1', 'booking-2'];

        const request = service.deleteGlobickTransfers();

        expect(request).toEqual([{
            type: 'GLOBICK',
            items: [{ product: 'TRANS', bookingReferences: ['booking-1', 'booking-2'] }]
        }]);
        expect(sessionStorageService.set).toHaveBeenCalledWith('removeGlobickTransfers', request);
    });

    it('builds and stores Avios ancillary requests and broadcasts summary changes', () => {
        const priorityRequest = [{ id: 'passenger-1', ancillaries: [{ type: 'PRIORITY_BOARDING', slices: [] }] }];
        const baggageRequest = [{ id: 'passenger-1', ancillaries: [{ type: 'BAGGAGE', slices: [] }] }];
        const speqRequest = [{ id: 'passenger-1', ancillaries: [{ type: 'SPEQS', slices: [] }] }];
        const flexRequest = [{ type: 'FLEXIBILITY' }];
        transformer.genAviosPriorityReq.and.returnValue(priorityRequest);
        transformer.genReqAviosAncillariesBaggages.and.returnValue(baggageRequest);
        transformer.genAviosSpeqReq.and.returnValue(speqRequest);
        transformer.genAviosFlexOnDemandReq.and.returnValue(flexRequest);

        expect(service.getReqAviosAncillariesPriorityBoarding([])).toBe(priorityRequest);
        expect(service.getReqAviosAncillariesBaggages([])).toBe(baggageRequest);
        expect(service.getReqAviosAncillariesSpeq([])).toBe(speqRequest);
        expect(service.getAviosAncillariesFlex([])).toBe(flexRequest);
        service.getAviosAncillariesSummaryReq({ id: 'passenger-1' }, 'BAGGAGE');

        expect(storage['genAviosAncillariesPriority']).toBe(priorityRequest);
        expect(storage['genAviosAncillariesBaggages']).toBe(baggageRequest);
        expect(storage['genAviosAncillariesSpeq']).toBe(speqRequest);
        expect(storage['genAviosAncillariesFlex']).toBe(flexRequest);
        expect(transformer.genAviosAncillariesSummaryReq).toHaveBeenCalledWith({ id: 'passenger-1' }, 'BAGGAGE');
        expect(rootScope.$broadcast).toHaveBeenCalledWith('flightAviosInfo');
    });

    it('removes Avios ancillaries by type and stores the remaining items', () => {
        const passengers = [{
            id: 'passenger-1',
            ancillaries: [{ type: 'BAGGAGE' }, { type: 'SEAT' }]
        }];
        storage['flightAviosInfo'] = { passengers };
        transformer.deleteAncillaryByType.and.returnValue(passengers);

        service.deleteAviosAncillaries('slice-1', 'BAGGAGE');

        expect(transformer.deleteAncillaryByType).toHaveBeenCalledWith('slice-1', 'BAGGAGE', passengers);
        expect(storage['genAviosAncillariesBaggages']).toEqual([{
            id: 'passenger-1', ancillaries: [{ type: 'BAGGAGE' }]
        }]);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('updateCalcAvios', storage['flightAviosInfo']);
    });

    it('broadcasts carbon footprint basket updates when the item is removed', () => {
        service.deleteCarbonFootprintFromBasket();

        expect(rootScope.$broadcast).toHaveBeenCalledWith('updateHeaderCarbonFootprint', null);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('basketUpdateCommonHeader');
    });

    it('updates a carbon footprint and shows a generic error when the update fails', async () => {
        commonsAncillariesService.updateAncillaries.and.returnValue(Promise.resolve());

        await service.updateCarbonFootprint(18, 12);

        expect(commonsAncillariesService.updateAncillaries).toHaveBeenCalledWith([{
            type: 'CO2_FOOTPRINT', kilosCo2Equivalent: 18, price: 12
        }]);
        expect(modalService.isNotWaiting).toHaveBeenCalled();

        const error = { message: 'Update failed' };
        commonsAncillariesService.updateAncillaries.and.returnValue(Promise.reject(error));
        let rejected = false;
        try {
            await service.updateCarbonFootprint(18, 12);
        } catch {
            rejected = true;
        }

        expect(rejected).toBe(true);
        expect(modalService.showGenericError).toHaveBeenCalledWith(error, false, null);
    });

    it('deletes a carbon footprint and handles a rejected delete request', async () => {
        commonsAncillariesService.deleteAncillarie.and.returnValue(Promise.resolve());

        await service.deleteCarbonFootprint();

        expect(commonsAncillariesService.deleteAncillarie).toHaveBeenCalledWith([{ type: 'CO2_FOOTPRINT' }]);
        expect(modalService.isNotWaiting).toHaveBeenCalled();

        const error = { message: 'Delete failed' };
        commonsAncillariesService.deleteAncillarie.and.returnValue(Promise.reject(error));
        await service.deleteCarbonFootprint();

        expect(modalService.showGenericError).toHaveBeenCalledWith(error, false, null);
    });

    it('creates a bundle request with the selected items', () => {
        service.createBundleRequest({
            id: 'bundle-1',
            items: [{ type: 'BAGGAGE', subtype: 'CHECKED', quantity: 1 }]
        });

        expect(callBundleService.putBundle).toHaveBeenCalledWith({
            bundleId: 'bundle-1',
            bundleItems: [{ type: 'BAGGAGE', subtype: 'CHECKED', quantity: 1 }]
        });
    });

    it('cleans ancillary session data and keeps supported cart items', () => {
        const shoppingBasket = {
            baggages: {}, seats: {}, insurance: {}, flexibilization: {}, upgrading: {}, speqs: {}, priorityBoarding: {}
        };
        const headerModel = { headerModel: { shoppingBasket } };
        const cart = {
            ecommerce: {
                items: [
                    { item_name: 'baggage' },
                    { item_name: 'seat' },
                    { item_name: 'unknown' }
                ]
            }
        };
        storage['headerModel'] = headerModel;
        storage['addToCart'] = cart;

        service.cleanSessionAncillaries();

        expect(shoppingBasket.baggages).toEqual({ segments: [], hasBaggage: false });
        expect(shoppingBasket.seats).toEqual({ segments: [], hasSeats: false });
        expect(shoppingBasket.insurance).toEqual({ info: null, hasInsurance: false });
        expect(headerFacade.updateHeaderModel).toHaveBeenCalledWith(headerModel);
        expect(storage['passengerBaggagesTrips']).toBeNull();
        expect(storage['seatsAvailableSegments']).toEqual([]);
        expect(rootScope.$emit).toHaveBeenCalledWith('cleanPriorityBoarding');
        expect(rootScope.$emit).toHaveBeenCalledWith('modifyPendingSeat');
        expect(cart.ecommerce.items).toEqual([{ item_name: 'baggage' }, { item_name: 'seat' }]);
        expect(datalayerMenus.updateDataLayer).toHaveBeenCalledWith(cart.ecommerce);
    });
});