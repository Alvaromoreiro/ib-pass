import { AncGetCachedInformationService } from './ib-get-cached-information-service';
import { CommonsBrowserStorageService } from 'ib-web-commons/utils';
import { CkiAncillariesUtilsService } from '@pages/ib-web-ancillaries/services/ib-ckeckin-ancillaries-utils';
import * as angular from 'angular';

describe('AncGetCachedInformationService', () => {
    let service: AncGetCachedInformationService;
    let browserStorageService: jasmine.SpyObj<CommonsBrowserStorageService>;
    let ancillariesUtilsService: jasmine.SpyObj<CkiAncillariesUtilsService>;
    let errorService: jasmine.SpyObj<CommonsNewHttpUtilsErrorService>;
    let proxy: jasmine.SpyObj<CommonsGenericProxy>;
        let filter: jasmine.Spy;
    let timeout: jasmine.Spy<ng.ITimeoutService>;
    let timeoutCallback: (() => void) | null;

    const createService = (): AncGetCachedInformationService => new AncGetCachedInformationService(
        {
            cachedInformationURI: '/booking/checkinId/',
            DEFAULT_ENDPOINTS: { cachedInformationURI: '/default/booking/checkinId/' }
        } as unknown as CheckinAncillariesConstants,
        browserStorageService,
        ancillariesUtilsService,
        errorService,
        proxy,
        filter as unknown as angular.IFilterService,
        timeout as unknown as ng.ITimeoutService
    );

    beforeEach(() => {
        browserStorageService = jasmine.createSpyObj<CommonsBrowserStorageService>('CommonsBrowserStorageService', ['get']);
        browserStorageService.get.and.returnValue('flow-123');
        ancillariesUtilsService = jasmine.createSpyObj<CkiAncillariesUtilsService>('CkiAncillariesUtilsService', ['getEndpoint']);
        ancillariesUtilsService.getEndpoint.and.returnValue(null);
        errorService = jasmine.createSpyObj<CommonsNewHttpUtilsErrorService>('CommonsNewHttpUtilsErrorService', ['controlError']);
        errorService.controlError.and.callFake((error, reject) => reject(error));
        proxy = jasmine.createSpyObj<CommonsGenericProxy>('CommonsGenericProxy', ['getGeneric']);
            filter = jasmine.createSpy('$filter').and.callFake(() => jasmine.createSpy('translate').and.returnValue('Session expired'));
        timeoutCallback = null;
        timeout = jasmine.createSpy('$timeout').and.callFake((callback: () => void) => {
            timeoutCallback = callback;
        }) as jasmine.Spy<ng.ITimeoutService>;
        service = createService();
    });

    it('requests cached information from the configured endpoint', async () => {
        const responseData = { bookingId: 'booking-1' };
        ancillariesUtilsService.getEndpoint.and.returnValue('/configured');
        proxy.getGeneric.and.returnValue(Promise.resolve({ data: responseData }));

        const result = await service.getCachedInformation();

        expect(ancillariesUtilsService.getEndpoint).toHaveBeenCalledWith('pac-prm-rs');
        expect(proxy.getGeneric).toHaveBeenCalledWith('/configured/booking/checkinId/flow-123/cached');
        expect(result).toBe(responseData);
    });

    it('uses the default endpoint when no session endpoint is configured', async () => {
        proxy.getGeneric.and.returnValue(Promise.resolve({ data: { status: 'OK' } }));

        const result = await service.getCachedInformation();

        expect(proxy.getGeneric).toHaveBeenCalledWith('/default/booking/checkinId/flow-123/cached');
        expect(result).toEqual({ status: 'OK' });
    });

    it('delegates request failures to the HTTP error service', async () => {
        const error = { status: 503, message: 'Service unavailable' };
        proxy.getGeneric.and.returnValue(Promise.reject(error));

        await expectAsync(service.getCachedInformation()).toBeRejectedWith(error);

        expect(errorService.controlError).toHaveBeenCalledWith(error, jasmine.any(Function));
    });

    it('rejects with a session-expired error when the check-in id is missing', async () => {
        browserStorageService.get.and.returnValue(null);
        proxy.getGeneric.and.returnValue(new Promise(() => {}));

        const result = service.getCachedInformation();
        timeoutCallback?.();

        await expectAsync(result).toBeRejectedWith(jasmine.objectContaining({
            errorCode: 'IB_00002',
            message: 'Session expired',
            internalErrorCode: 'IB_00002'
        }));
            expect(filter as unknown as angular.IFilterService).toHaveBeenCalledWith('translate');
    });
});
