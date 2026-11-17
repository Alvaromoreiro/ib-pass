import { CallBundleService } from './ib-call-bundle-service';
import * as angular from 'angular';

describe('CallBundleService', () => {
    let service: CallBundleService;
    let proxy: jasmine.SpyObj<CommonsGenericProxy>;
    let errorService: jasmine.SpyObj<CommonsNewHttpUtilsErrorService>;
    let localStorageService: jasmine.SpyObj<angular.local.storage.ILocalStorageService>;

    beforeEach(() => {
        proxy = jasmine.createSpyObj<CommonsGenericProxy>('CommonsGenericProxy', ['getGeneric', 'putGeneric']);
        errorService = jasmine.createSpyObj<CommonsNewHttpUtilsErrorService>('CommonsNewHttpUtilsErrorService', ['controlError']);
        errorService.controlError.and.callFake((error, reject) => reject(error));
        localStorageService = jasmine.createSpyObj<angular.local.storage.ILocalStorageService>('localStorageService', ['get']);
        localStorageService.get.and.returnValue('flow-123');
        service = new CallBundleService(
            { DEFAULT_ENDPOINTS: { bundleServiceURI: '/bundles/', putBundleURI: '/bundles/manage/' } } as unknown as CheckinAncillariesConstants,
            localStorageService,
            errorService,
            proxy
        );
    });

    it('returns bundle data from the check-in endpoint', async () => {
        const responseData = { bundles: [{ id: 'bundle-1' }] };
        proxy.getGeneric.and.returnValue(Promise.resolve({ data: responseData }));

        const result = await service.getBundle();

        expect(proxy.getGeneric).toHaveBeenCalledWith('/bundles/flow-123');
        expect(result).toBe(responseData);
    });

    it('sends the selected bundle request and returns response data', async () => {
        const request = { bundleId: 'bundle-1', bundleItems: [] };
        const responseData = { accepted: true };
        proxy.putGeneric.and.returnValue(Promise.resolve({ data: responseData }));

        const result = await service.putBundle(request);

        expect(proxy.putGeneric).toHaveBeenCalledWith('/bundles/manage/flow-123', request);
        expect(result).toBe(responseData);
    });

    it('delegates bundle retrieval errors and rejects with the original error', async () => {
        const error = { status: 500 };
        proxy.getGeneric.and.returnValue(Promise.reject(error));

        await expectAsync(service.getBundle()).toBeRejectedWith(error);

        expect(errorService.controlError).toHaveBeenCalledWith(error, jasmine.any(Function));
    });

    it('delegates bundle update errors and rejects with the original error', async () => {
        const error = { status: 503 };
        proxy.putGeneric.and.returnValue(Promise.reject(error));

        await expectAsync(service.putBundle({ bundleId: 'bundle-1' })).toBeRejectedWith(error);

        expect(errorService.controlError).toHaveBeenCalledWith(error, jasmine.any(Function));
    });
});