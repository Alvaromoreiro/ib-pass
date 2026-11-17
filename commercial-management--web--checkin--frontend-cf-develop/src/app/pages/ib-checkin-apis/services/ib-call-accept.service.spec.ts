import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import {
  AJSAcceptObjectsPolicyServiceToken
} from '@src/app/shared/http-services/pacc-pacc/bridges/ib-accept-objects-bridge.service';
import {
  AJSCheckAncillariesServiceToken
} from '@src/app/shared/services/bridges/ib-check-ancillaries-bridge.service';
import {
  AJSCheckPaymentsServiceToken
} from '@src/components/services/Utils/bridges/ib-check-payments-bridge.service';
import {
  AJSFlightsPassengersServiceToken
} from '@src/components/ib-check-in-flights-passengers/services/bridges/ib-flights-and-passengers-bridge.service';
import {
  AJSCommonsAncillariesServiceToken
} from '@src/components/services/Utils/bridges/ib-common-ancillaries-bridge.service';
import {
  AJSCallAncillariesServiceToken
} from '@src/app/shared/http-services/ass-fass/bridges/ib-call-ancillaries-bridge.service';
import {
  AJSUpgradingAncillaryToUpgradeInfoMapperServiceToken
} from '@src/app/shared/services/ib-upgrading/bridges/ib-upgrading-ancillary-to-upgrade-info-mapper-bridge.service';
import { AJSModalService } from '@src/app/shared/services/ib-modal/ib-modal-service-bridge.service';
import { IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { AcceptService } from './ib-call-accept.service';
import { AJSFlightsPassengersUtilsServiceToken } from '@src/components/services/Utils/bridges/ib-flights-passengers-utils-bridge.service';
import { IbCheckinSeatSummaryService } from '@src/app/pages/ib-checkin-seat-summary/services/ib-checkin-seat-summary.service';
import { AJSGetCKICachedInformationServiceToken } from '@src/app/shared/http-services/pac-prm/bridges/ib-get-cached-information-bridge.service';
import { IbAncillariesPaymentUtilsService } from '@src/app/shared/services/ib-utils/ib-ancillaries-payment-utils.service';
import { IbPassengerBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-passenger-booking-utils.service';
import { IbBoardingCardsPrintTransformer } from '@src/app/shared/services/ib-boarding-cards/ib-boarding-cards-print-transformer.service';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';

// Generic helpers to create resolved/rejected promises without duplication
function resolvedPromise<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

function rejectedPromise<T = unknown>(error: unknown): Promise<T> {
  return Promise.reject(error);
}

// Basic mock for ModalService.result (like $uibModalInstance)
function createModalResultMock(obj?: unknown) {
  return {
    then: (success: (value: unknown) => void, dismiss?: (value: unknown) => void) => {
      if (success) {
        success(obj ?? {}); // dummy response
      }
    }
  };
}

// Service Mocks
class FlightsPassengersUtilsMock {
  getAcceptUpdateInformation = jasmine.createSpy('getAcceptUpdateInformation')
    .and.returnValue({ mock: 'requestAcceptInfo' });

  updateSelectedPassengers = jasmine.createSpy('updateSelectedPassengers')
    .and.callFake((selected, cached) => cached);

  updateSelectedSegments = jasmine.createSpy('updateSelectedSegments')
    .and.callFake((available, uncheckable) => available);
}

class IbAncillariesPaymentUtilsServiceMock{
  setAncillariesCurrency = jasmine.createSpy('setAncillariesCurrency');
  setAncillariesBob = jasmine.createSpy('setAncillariesBob');
}

class IbUtilsServiceMock {
  goIbCose = jasmine.createSpy('goIbCose');
}


class IbPassengerBookingUtilsServiceMock {
  updateCachedInfo = jasmine.createSpy('updateCachedInfo')
    .and.returnValue([]);
}

class CommonsSessionStorageServiceMock {
  private store = new Map<string, unknown>();

  get = jasmine.createSpy('get').and.callFake((key: string) => this.store.get(key));
  set = jasmine.createSpy('set').and.callFake((key: string, value: unknown) => this.store.set(key, value));
  remove = jasmine.createSpy('remove').and.callFake((key: string) => this.store.delete(key));
}

class AcceptObjectsPolicyServiceMock {
  acceptForbiddenObjectsPolicy = jasmine
    .createSpy('acceptForbiddenObjectsPolicy')
    .and.returnValue(resolvedPromise({}));
}

class ModalServiceMock {
  isWaiting = jasmine.createSpy('isWaiting');
  isNotWaiting = jasmine.createSpy('isNotWaiting');
  finishWaiting = jasmine.createSpy('finishWaiting');

  showGenericError = jasmine.createSpy('showGenericError')
    .and.callFake(() => ({ result: createModalResultMock() }));

  showGenericModal = jasmine.createSpy('showGenericModal')
    .and.callFake(() => ({ result: createModalResultMock() }));

  openSplitModal = jasmine.createSpy('openSplitModal')
    .and.callFake(() => ({ result: createModalResultMock() }));
}

class GetCKICachedInformationServiceMock {
  getCachedInformation = jasmine
    .createSpy('getCachedInformation')
    .and.returnValue(resolvedPromise({ passengers: [], locator: 'ABCD12' }));
}

class CheckAncillariesServiceMock {
  checkAncillaries = jasmine
    .createSpy('checkAncillaries')
    .and.returnValue(resolvedPromise({}));
}

class CheckPaymentsServiceMock {
  checkPayments = jasmine.createSpy('checkPayments');
}

class FlightsPassengersServiceMock {
  checkAvailabilitySeatsPassengers = jasmine
    .createSpy('checkAvailabilitySeatsPassengers')
    .and.returnValue(resolvedPromise(true));
}

class CommonsAncillariesServiceMock {
  getAncillarieSummary = jasmine
    .createSpy('getAncillarieSummary')
    .and.returnValue(resolvedPromise({
      currencies: [],
      context: { issueCurrency: 'EUR', segments: [] },
      freeItems: []
    }));
}

class CallAncillariesServiceMock {
  getUpgradingAncillarie = jasmine
    .createSpy('getUpgradingAncillarie')
    .and.returnValue(resolvedPromise({ ancillaries: [] }));
}

class UpgradingAncillaryToUpgradeInfoMapperServiceMock {
  map = jasmine
    .createSpy('map')
    .and.returnValue(null);
}

class IbCheckinRedirectionUtilsServiceMock {
  path = jasmine.createSpy('path').and.returnValue({ search: () => { } });
  reload = jasmine.createSpy('reload');
  search = jasmine.createSpy('search');
}

class IbCheckinSeatSummaryServiceMock {
  sendSeatSummaryEventToMonetate = jasmine.createSpy('sendSeatSummaryEventToMonetate');
  checkRedirectionPage = jasmine.createSpy('checkRedirectionPage');
}

class IbBoardingCardsPrintTransformerMock {
  getPrintedInformation = jasmine
    .createSpy('getPrintedInformation')
    .and.returnValue(null);
}

// Helper function to create service with all dependencies configured
function createService() {
  TestBed.configureTestingModule({
    providers: [
      AcceptService,
      { provide: AJSFlightsPassengersUtilsServiceToken, useClass: FlightsPassengersUtilsMock },
      { provide: IbUtilsService, useClass: IbUtilsServiceMock },
      { provide: IbPassengerBookingUtilsService, useClass: IbPassengerBookingUtilsServiceMock },
      { provide: AJSAcceptObjectsPolicyServiceToken, useClass: AcceptObjectsPolicyServiceMock },
      { provide: AJSModalService, useClass: ModalServiceMock },
      { provide: AJSGetCKICachedInformationServiceToken, useClass: GetCKICachedInformationServiceMock },
      { provide: AJSCheckAncillariesServiceToken, useClass: CheckAncillariesServiceMock },
      { provide: AJSCheckPaymentsServiceToken, useClass: CheckPaymentsServiceMock },
      { provide: AJSFlightsPassengersServiceToken, useClass: FlightsPassengersServiceMock },
      { provide: AJSCommonsAncillariesServiceToken, useClass: CommonsAncillariesServiceMock },
      { provide: AJSCallAncillariesServiceToken, useClass: CallAncillariesServiceMock },
      { provide: AJSUpgradingAncillaryToUpgradeInfoMapperServiceToken, useClass: UpgradingAncillaryToUpgradeInfoMapperServiceMock },
      { provide: CommonsSessionStorageService, useClass: CommonsSessionStorageServiceMock },
      { provide: IbCheckinRedirectionUtilsService, useClass: IbCheckinRedirectionUtilsServiceMock },
      { provide: IbCheckinSeatSummaryService, useClass: IbCheckinSeatSummaryServiceMock },
      { provide: IbAncillariesPaymentUtilsService, useClass: IbAncillariesPaymentUtilsServiceMock },
      { provide: IbBoardingCardsPrintTransformer, useClass: IbBoardingCardsPrintTransformerMock }
    ]
  });

  const service = TestBed.inject(AcceptService);
  const flightsPassengersUtils = TestBed.inject(AJSFlightsPassengersUtilsServiceToken) as unknown as FlightsPassengersUtilsMock;
  const ibUtilsService = TestBed.inject(IbUtilsService) as unknown as IbUtilsServiceMock;
  const ibPassengerBookingService = TestBed.inject(IbPassengerBookingUtilsService) as unknown as IbPassengerBookingUtilsServiceMock;
  const acceptObjectsPolicy = TestBed.inject(AJSAcceptObjectsPolicyServiceToken) as unknown as AcceptObjectsPolicyServiceMock;
  const modalService = TestBed.inject(AJSModalService) as unknown as ModalServiceMock;
  const sessionStorage = TestBed.inject(CommonsSessionStorageService) as unknown as CommonsSessionStorageServiceMock;
  const redirectionService = TestBed.inject(IbCheckinRedirectionUtilsService) as unknown as IbCheckinRedirectionUtilsServiceMock;
  const getCachedInfo = TestBed.inject(AJSGetCKICachedInformationServiceToken) as unknown as GetCKICachedInformationServiceMock;
  const checkAncillaries = TestBed.inject(AJSCheckAncillariesServiceToken) as unknown as CheckAncillariesServiceMock;
  const checkPayments = TestBed.inject(AJSCheckPaymentsServiceToken) as unknown as CheckPaymentsServiceMock;
  const flightsPassengersService = TestBed.inject(AJSFlightsPassengersServiceToken) as unknown as FlightsPassengersServiceMock;
  const commonsAncillaries = TestBed.inject(AJSCommonsAncillariesServiceToken) as unknown as CommonsAncillariesServiceMock;
  const callAncillaries = TestBed.inject(AJSCallAncillariesServiceToken) as unknown as CallAncillariesServiceMock;
  const upgradingAncillaryToUpgradeInfoMapper = TestBed.inject(AJSUpgradingAncillaryToUpgradeInfoMapperServiceToken) as unknown as UpgradingAncillaryToUpgradeInfoMapperServiceMock;
  const ibCheckinSeatSummaryService = TestBed.inject(IbCheckinSeatSummaryService) as unknown as IbCheckinSeatSummaryServiceMock;
  const ibAncillariesPaymentService = TestBed.inject(IbAncillariesPaymentUtilsService) as unknown as IbAncillariesPaymentUtilsServiceMock;
  const ibBoardingCardsPrintTransformer = TestBed.inject(IbBoardingCardsPrintTransformer) as unknown as IbBoardingCardsPrintTransformerMock;

  return {
    service,
    flightsPassengersUtils,
    ibUtilsService,
    ibPassengerBookingService,
    acceptObjectsPolicy,
    modalService,
    sessionStorage,
    redirectionService,
    getCachedInfo,
    checkAncillaries,
    checkPayments,
    flightsPassengersService,
    commonsAncillaries,
    callAncillaries,
    upgradingAncillaryToUpgradeInfoMapper,
    ibCheckinSeatSummaryService,
    ibAncillariesPaymentService,
    ibBoardingCardsPrintTransformer
  };
}

describe('AcceptService', () => {
  let service: AcceptService;
  let sessionStorage: CommonsSessionStorageServiceMock;
  let modalService: ModalServiceMock;
  let redirectionService: IbCheckinRedirectionUtilsServiceMock;
  let acceptObjectsPolicy: AcceptObjectsPolicyServiceMock;
  let ibUtilsService: IbUtilsServiceMock;
  let ibPassengerBookingService: IbPassengerBookingUtilsServiceMock;
  let getCachedInfo: GetCKICachedInformationServiceMock;
  let checkAncillaries: CheckAncillariesServiceMock;
  let checkPayments: CheckPaymentsServiceMock;
  let flightsPassengersService: FlightsPassengersServiceMock;
  let commonsAncillaries: CommonsAncillariesServiceMock;
  let callAncillaries: CallAncillariesServiceMock;
  let upgradingAncillaryToUpgradeInfoMapper: UpgradingAncillaryToUpgradeInfoMapperServiceMock;
  let ibCheckinSeatSummaryService: IbCheckinSeatSummaryServiceMock;
  let ibAncillariesPaymentService: IbAncillariesPaymentUtilsServiceMock;
  let ibBoardingCardsPrintTransformer: IbBoardingCardsPrintTransformerMock;
  let flightsPassengersUtils: FlightsPassengersUtilsMock;

  beforeEach(() => {
    ({
      service,
      sessionStorage,
      modalService,
      redirectionService,
      acceptObjectsPolicy,
      ibUtilsService,
      ibPassengerBookingService,
      getCachedInfo,
      checkAncillaries,
      checkPayments,
      flightsPassengersService,
      commonsAncillaries,
      callAncillaries,
      upgradingAncillaryToUpgradeInfoMapper,
      ibCheckinSeatSummaryService,
      flightsPassengersUtils,
      ibAncillariesPaymentService,
      ibBoardingCardsPrintTransformer
    } = createService());
  });

  // Helper to set session storage values without repetition
  function setSession(key: string, value: unknown) {
    sessionStorage.set(key, value);
  }

  // ===============================
  // TESTS FOR callAccept
  // ===============================
  it('should call acceptForbiddenObjectsPolicy with the generated request', fakeAsync(() => {
    setSession('availableSegments', [1, 2, 3]);

    const passengers = [{ id: 1 }];
    const printBoardingCard = false;
    const nextStep = 'NEXT';
    const isEarly = false;

    const acceptResponse = {
      code: 200,
      data: {
        acceptedSegments: [],
        locator: null
      }
    };

    acceptObjectsPolicy.acceptForbiddenObjectsPolicy.and.returnValue(resolvedPromise(acceptResponse));

    service.callAccept(passengers, printBoardingCard, nextStep, isEarly);
    tick();

    expect(acceptObjectsPolicy.acceptForbiddenObjectsPolicy).toHaveBeenCalled();
  }));

  it('should handle acceptForbiddenObjectsPolicy error by showing error modal', async () => {
    const error = { internalErrorCode: 'IB_00001' };

    acceptObjectsPolicy.acceptForbiddenObjectsPolicy.and.returnValue(rejectedPromise(error));

    await service.callAccept([], false, 'NEXT', false);

    expect(modalService.finishWaiting).toHaveBeenCalled();
    expect(modalService.showGenericError).toHaveBeenCalledWith(error, false, null);
  });

  it('should navigate to goIbCose when there are no acceptedSegments and no cache error', async () => {
    const acceptResponse = {
      code: 200,
      data: {
        acceptedSegments: []
      }
    };

    acceptObjectsPolicy.acceptForbiddenObjectsPolicy.and.returnValue(resolvedPromise(acceptResponse));
    getCachedInfo.getCachedInformation.and.returnValue(resolvedPromise({ passengers: [] }));

    await service.callAccept([], false, 'NEXT', false);

    const calls = modalService.showGenericError.calls.allArgs().map(args => args[0]?.message);
    expect(calls).not.toContain('NOT_ACCEPTED_SEGMENT_ERROR');
  });

  it('should call seatNotAvailableError when isEarly is true and no seats are assigned', fakeAsync(() => {
    const acceptResponse = {
      code: 200,
      data: {
        acceptedSegments: [
          {
            passengers: [{ seat: null }]
          }
        ],
        locator: null
      }
    };

    acceptObjectsPolicy.acceptForbiddenObjectsPolicy.and.returnValue(resolvedPromise(acceptResponse));
    flightsPassengersService.checkAvailabilitySeatsPassengers.and.returnValue(resolvedPromise(false));

    spyOn(service, 'seatNotAvailableError');

    service.callAccept([], false, 'NEXT', true);
    tick();

    expect(service.seatNotAvailableError).toHaveBeenCalled();
  }));

  it('should redirect to ibcoac if accept and cached throw an error', fakeAsync( () => {
    const error = { internalErrorCode: 'IB_00001' };
    acceptObjectsPolicy.acceptForbiddenObjectsPolicy.and.returnValue(rejectedPromise(error));
    getCachedInfo.getCachedInformation.and.returnValue(rejectedPromise(error));
    redirectionService.path.and.returnValue('/ibcoac');

    service.callAccept([], false, 'NEXT', false);
    tick();

    expect(modalService.finishWaiting).toHaveBeenCalled();
    expect(redirectionService.reload).toHaveBeenCalled();
    expect(ibCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
  }));

  it('should go continueFlow if had uncheckable segments but any accepted', fakeAsync(() => {
    const acceptResponse = {
      code: 200,
      data: {
        acceptedSegments: [
          {
            passengers: [{ seat: null }]
          }
        ],
        locator: null
      }
    };

    setSession('availableSegments', [1]);
    ibPassengerBookingService.updateCachedInfo.and.returnValue([1]);
    acceptObjectsPolicy.acceptForbiddenObjectsPolicy.and.returnValue(resolvedPromise(acceptResponse));

    service.callAccept([], false, 'NEXT', false);
    tick();

    expect(flightsPassengersUtils.updateSelectedSegments).toHaveBeenCalledWith([1], [1]);
    expect(sessionStorage.set).toHaveBeenCalledWith('availableSegments', [1]);
    expect(modalService.showGenericError).toHaveBeenCalled();
    expect(modalService.isNotWaiting).toHaveBeenCalled();
  }));

  it('should go to ibcose if it had uncheckable segments and was not accepted', fakeAsync(() => {
    const acceptResponse = {
      code: 200,
      data: {
        acceptedSegments: [
          {
            passengers: [{ seat: null }]
          }
        ],
        locator: null
      }
    };

    setSession('availableSegments', []);
    ibPassengerBookingService.updateCachedInfo.and.returnValue([1]);
    acceptObjectsPolicy.acceptForbiddenObjectsPolicy.and.returnValue(resolvedPromise(acceptResponse));

    service.callAccept([], false, 'NEXT', false);
    tick();

    expect(flightsPassengersUtils.updateSelectedSegments).toHaveBeenCalledWith([], [1]);
    expect(sessionStorage.set).toHaveBeenCalledWith('availableSegments', []);
    expect(modalService.showGenericError).toHaveBeenCalled();
    expect(modalService.isNotWaiting).toHaveBeenCalled();
    expect(ibCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
    expect(ibUtilsService.goIbCose).toHaveBeenCalled();
  }));

  it('should show generic error if cached service failed', fakeAsync(() => {
    const acceptResponse = {
      code: 200,
      data: {
        acceptedSegments: [
          {
            passengers: [{ seat: null }]
          }
        ],
        locator: "test"
      }
    };

    acceptObjectsPolicy.acceptForbiddenObjectsPolicy.and.returnValue(resolvedPromise(acceptResponse));
    getCachedInfo.getCachedInformation.and.returnValue(rejectedPromise(''));

    service.callAccept([], false, 'NEXT', false);
    tick();

    expect(ibCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
    expect(modalService.showGenericError).toHaveBeenCalled();
  }));

  it('should go ibcose and start new search if is another locator', fakeAsync(() => {
    const acceptResponse = {
      code: 200,
      data: {
        acceptedSegments: [
          {
            passengers: [{ seat: null }]
          }
        ],
        locator: "test"
      }
    };
    setSession('checkinSurname', 'test');

    acceptObjectsPolicy.acceptForbiddenObjectsPolicy.and.returnValue(resolvedPromise(acceptResponse));
    modalService.openSplitModal.and.callFake(() => ({ result: createModalResultMock(acceptResponse) }));
    redirectionService.path.and.returnValue(redirectionService);

    service.callAccept([], false, 'NEXT', false);
    tick();

    expect(ibCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
    expect(redirectionService.path).toHaveBeenCalledWith('/ibcose');
    expect(redirectionService.search).toHaveBeenCalledWith({ surname: 'test', pnr: acceptResponse.data.locator });
  }));

  it('should show generic error if is early and the service failed', fakeAsync(() => {
    const acceptResponse = {
      code: 200,
      data: {
        acceptedSegments: [
          {
            passengers: [{ seat: null }]
          }
        ],
        locator: "test"
      }
    };
    setSession('checkinSurname', 'test');

    acceptObjectsPolicy.acceptForbiddenObjectsPolicy.and.returnValue(resolvedPromise(acceptResponse));
    flightsPassengersService.checkAvailabilitySeatsPassengers.and.returnValue(rejectedPromise("error"));

    service.callAccept([], false, 'NEXT', true);
    tick();

    expect(ibCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
    expect(modalService.showGenericError).toHaveBeenCalled();
    expect(ibUtilsService.goIbCose).toHaveBeenCalled();
  }));

  // ===============================
  // TESTS FOR nextViewAfterAccept
  // ===============================
  it('nextViewAfterAccept should redirect to /ibecbp if ancillariesDisabled is true', () => {
    setSession('bookingInfo', { ancillariesDisabled: true });

    service.nextViewAfterAccept(false, 'NEXT', { code: 200, data: {} });

    expect(ibCheckinSeatSummaryService.checkRedirectionPage).toHaveBeenCalledWith('ibecbp');
    expect(sessionStorage.set).toHaveBeenCalledWith(CheckinAppConstants.STORAGE_KEYS.ACCEPT_INFO, {});
  });

  it('nextViewAfterAccept (202) should show NO_SHOW modal and then call checkAncillaries', () => {
    setSession('bookingInfo', { ancillariesDisabled: false });
    spyOn(service, 'checkAncillaries');

    const response = { code: 202, data: { foo: 'bar' } };

    service.nextViewAfterAccept(false, 'NEXT', response);

    expect(modalService.showGenericModal).toHaveBeenCalled();
    expect(service.checkAncillaries).toHaveBeenCalledWith(false, 'NEXT', response.data);
  });

  it('nextViewAfterAccept with other code should directly call checkAncillaries', () => {
    setSession('bookingInfo', { ancillariesDisabled: false });
    spyOn(service, 'checkAncillaries');

    const response = { code: 200, data: { foo: 'bar' } };

    service.nextViewAfterAccept(true, 'STEP', response);

    expect(service.checkAncillaries).toHaveBeenCalledWith(true, 'STEP', response.data);
  });

  it('nextViewAfterAccept should call getPrintedInformation from IbBoardingCardsPrintTransformer', () => {
    ibBoardingCardsPrintTransformer.getPrintedInformation.and.returnValue(null);

    service.nextViewAfterAccept(false, 'NEXT', { code: 200, data: {} });

    expect(ibBoardingCardsPrintTransformer.getPrintedInformation).toHaveBeenCalled();
    expect(sessionStorage.get('confirmationInfo')).toBe(null);
  });

  // ===============================
  // TESTS FOR serviceError
  // ===============================
  it('serviceError(true) should redirect to /ibpurc', () => {
    service.serviceError(true);

    expect(modalService.isNotWaiting).toHaveBeenCalled();
    expect(redirectionService.path).toHaveBeenCalledWith('/ibpurc');
    expect(ibCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
  });

  it('serviceError(false) should redirect to /ibecbp', () => {
    service.serviceError(false);

    expect(modalService.isNotWaiting).toHaveBeenCalled();
    expect(ibCheckinSeatSummaryService.checkRedirectionPage).toHaveBeenCalledWith('ibecbp');
  });

  // ===============================
  // TESTS FOR checkAncillaries
  // ===============================
  it('checkAncillaries with printBoardingCard and no pendingPayments should request summary and redirect to /ibecbp', async () => {
    setSession('pendingPayments', false);
    setSession('PNR', 'ABC123');

    await service.checkAncillaries(true, 'NEXT', {});

    expect(commonsAncillaries.getAncillarieSummary).toHaveBeenCalled();
    expect(redirectionService.path).toHaveBeenCalledWith('/ibecbp');
    expect(ibCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
  });

  it('checkAncillaries with printBoardingCard and pendingPayments true should call checkPayments', async () => {
    setSession('pendingPayments', true);
    setSession('PNR', 'ABC123');

    await service.checkAncillaries(true, 'NEXT', {});

    expect(checkPayments.checkPayments).toHaveBeenCalled();
    expect(ibCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
  });

  it('checkAncillaries without printBoardingCard and with mapped UPGRADING partial ancillary should redirect to /ckiancupp', fakeAsync(() => {
    const responseData = {};
    const upgradingAncillarieResponse = {
      currencies: [{
        code: 'EUR',
        description: 'Euro',
        symbol: '€',
        alignment: 'R',
        groupingSeparator: '.',
        decimalSeparator: ',',
        decimals: 2,
        recommendedDisplay: 'symbol'
      }],
      ancillaries: [{
        type: 'UPGRADING',
        status: { code: 'AVAILABLE' },
        currency: 'EUR',
        offers: [{
          id: 'FIRST',
          offerSegmentsClass: [{
            segmentId: '3',
            cabinClass: { code: 'U', type: 'BUSINESS', description: 'Business' }
          }]
        }]
      }]
    };
    const mappedUpgradeInfo = {
      type: 'UPGRADING',
      currency: { code: 'EUR' },
      offers: [{
        id: 'FIRST',
        offerSegmentClasses: [{
          segment: 3,
          cabinClass: { code: 'U', type: 'BUSINESS', description: 'Business' }
        }]
      }]
    };

    callAncillaries.getUpgradingAncillarie.and.returnValue(resolvedPromise(upgradingAncillarieResponse));
    upgradingAncillaryToUpgradeInfoMapper.map.and.returnValue(mappedUpgradeInfo);
    setSession('PNR', 'ABC123');

    service.checkAncillaries(false, 'NEXT', responseData);
    tick();

    expect(callAncillaries.getUpgradingAncillarie).toHaveBeenCalled();
    expect(upgradingAncillaryToUpgradeInfoMapper.map).toHaveBeenCalledWith(upgradingAncillarieResponse);
    expect(sessionStorage.get('upgradeInfo')).toEqual(mappedUpgradeInfo);
    expect(commonsAncillaries.getAncillarieSummary).not.toHaveBeenCalled();
    expect(redirectionService.path).toHaveBeenCalledWith('/ckiancupp');
    expect(ibCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
  }));

  it('checkAncillaries without printBoardingCard should continue normal flow when mapper returns null', fakeAsync(() => {
    setSession('PNR', 'ABC123');
    setSession('availableSegments', [1]);
    setSession('passengersSelected', [1]);

    service.checkAncillaries(false, CheckinAppConstants.SHUTTLE_NEXT_STEPS.SEATS_MAP, {
      upgrading: {
        offers: [{ id: 'LEGACY_ACCEPT_OFFER' }]
      }
    });
    tick();

    expect(callAncillaries.getUpgradingAncillarie).toHaveBeenCalled();
    expect(upgradingAncillaryToUpgradeInfoMapper.map).toHaveBeenCalled();
    expect(sessionStorage.get('upgradeInfo')).toBeUndefined();
    expect(commonsAncillaries.getAncillarieSummary).toHaveBeenCalled();
    expect(checkAncillaries.checkAncillaries).toHaveBeenCalled();
    expect(redirectionService.path).not.toHaveBeenCalledWith('/ckiancupp');
    expect(ibCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
  }));

  it('checkAncillaries without printBoardingCard should continue normal flow when getUpgradingAncillarie fails', fakeAsync(() => {
    callAncillaries.getUpgradingAncillarie.and.returnValue(rejectedPromise({}));
    setSession('PNR', 'ABC123');
    setSession('availableSegments', [1]);
    setSession('passengersSelected', [1]);

    service.checkAncillaries(false, CheckinAppConstants.SHUTTLE_NEXT_STEPS.SEATS_MAP, {});
    tick();

    expect(callAncillaries.getUpgradingAncillarie).toHaveBeenCalled();
    expect(upgradingAncillaryToUpgradeInfoMapper.map).not.toHaveBeenCalled();
    expect(commonsAncillaries.getAncillarieSummary).toHaveBeenCalled();
    expect(checkAncillaries.checkAncillaries).toHaveBeenCalled();
    expect(redirectionService.path).not.toHaveBeenCalledWith('/ckiancupp');
    expect(ibCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
  }));

  it('should show generic modal error and go ibcose if ancillaries failed and are uncheckableSegments', fakeAsync(() => {
    const acceptMock = { acceptedSegments: [{ passengers: [{ status: 'CHECKED', seat: null, purchaseSeatRequired: true }] }] };
    commonsAncillaries.getAncillarieSummary.and.returnValue(rejectedPromise("ancillaries-error"));

    service.checkAncillaries(false, CheckinAppConstants.SHUTTLE_NEXT_STEPS.SEATS_MAP, acceptMock);
    tick();

    expect(ibCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
    expect(modalService.showGenericError).toHaveBeenCalled();
    expect(ibUtilsService.goIbCose).toHaveBeenCalled();
  }));

  // ===============================
  // TESTS FOR seatNotAvailableError
  // ===============================
  it('seatNotAvailableError should show modal and call goIbCose in both callbacks', () => {
    service.seatNotAvailableError();

    expect(modalService.isNotWaiting).toHaveBeenCalled();
    expect(modalService.showGenericModal).toHaveBeenCalled();

    const goIbCose = (ibUtilsService.goIbCose as jasmine.Spy);
    expect(goIbCose).toHaveBeenCalled();
  });
});