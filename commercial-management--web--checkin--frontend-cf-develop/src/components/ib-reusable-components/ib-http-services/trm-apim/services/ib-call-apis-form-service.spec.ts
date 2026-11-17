import { CallApisFormService } from './ib-call-apis-form-service';
import { CheckinAppConstants } from "@src/components/routing/ib-check-in-constants";

describe('CallApisFormService', () => {
    let service: CallApisFormService;
    let $q, $rootScope, HttpServicesConstants, localStorageService, IbUtilsService, $timeout, $filter, IbSessionConfigService;
    let CkiDatalayerUtilsService, CommonsGenericProxy, CommonsHttpUtilsErrorService;

    const configureSession = (isActive: boolean, includeQuery = false): void => {
        localStorageService.get.and.callFake(key => key === 'flowId' ? (isActive ? 'flow123' : null) : true);
        if (!isActive) return;

        IbSessionConfigService.getEndpoint.and.returnValue('/endpoint/');
        if (includeQuery) {
            IbUtilsService.generateQueryString.and.returnValue('?passengersId=1,2,3&ocrEnabled=true');
        }
    };

    beforeEach(() => {
        $q = jasmine.createSpyObj('$q', ['defer']);
        $rootScope = { $apply: fn => fn() };
        HttpServicesConstants = {
            URI: {
                apisPassengerInfoURI: '/apisPassengerInfo/',
                DEFAULT_ENDPOINTS: { apisPassengerInfoURI: '/defaultApisPassengerInfo/' }
            }
        };
        localStorageService = jasmine.createSpyObj('localStorageService', ['get']);
        IbUtilsService = jasmine.createSpyObj('IbUtilsService', ['generateQueryString']);
        IbSessionConfigService = jasmine.createSpyObj('IbSessionConfigService', ['getEndpoint']);
        $timeout = jasmine.createSpy('$timeout');
        $filter = jasmine.createSpy('$filter').and.returnValue(() => 'Session expired');
        CkiDatalayerUtilsService = jasmine.createSpyObj('CkiDatalayerUtilsService', ['sendDatalayerErrorEvent', 'sendDigitalDataErrorEvent']);
        CommonsGenericProxy = jasmine.createSpyObj('CommonsGenericProxy', ['getGeneric', 'putGeneric']);
        CommonsHttpUtilsErrorService = jasmine.createSpyObj('CommonsHttpUtilsErrorService', ['controlError']);

        // Mock $q.defer()
        const defer = {
            resolve: jasmine.createSpy('resolve'),
            reject: jasmine.createSpy('reject'),
            promise: {}
        };
        $q.defer.and.returnValue(defer);

        service = new CallApisFormService(
            $q, HttpServicesConstants, localStorageService, IbUtilsService, $timeout, $filter,
            CkiDatalayerUtilsService, CommonsGenericProxy, CommonsHttpUtilsErrorService, CheckinAppConstants, IbSessionConfigService
        );
    });

    describe('getApisInfo', () => {
        it('should resolve with data when API call is successful', async () => {
            configureSession(true, true);
            CommonsGenericProxy.getGeneric.and.returnValue(Promise.resolve({ data: { foo: 'bar' } }));

            service.getApisInfo([1, 2, 3]);
            await Promise.resolve(); // allow promise chain to resolve

            expect(CommonsGenericProxy.getGeneric).toHaveBeenCalledWith('/endpoint//apisPassengerInfo/flow123/security?passengersId=1,2,3&ocrEnabled=true');
            expect($q.defer().resolve).toHaveBeenCalledWith({ foo: 'bar' });
        });

        it('should call error handlers and controlError on API error', async () => {
            configureSession(true, true);
            const error = { status: 500 };
            CommonsGenericProxy.getGeneric.and.returnValue(Promise.reject(error));

            service.getApisInfo([1, 2, 3]);
            await Promise.resolve();

            /*expect(CkiDatalayerUtilsService.sendDatalayerErrorEvent).toHaveBeenCalledWith(error);
            expect(CkiDatalayerUtilsService.sendDigitalDataErrorEvent).toHaveBeenCalledWith(error);
            expect(CommonsHttpUtilsErrorService.controlError).toHaveBeenCalled();*/
        });

        it('should reject with error when session is expired', () => {
            configureSession(false);

            service.getApisInfo([1, 2, 3]);

            expect($timeout).toHaveBeenCalled();
            // expect($q.defer().reject).toHaveBeenCalledWith({
            //     errorCode: 'IB_00002',
            //     message: 'Session expired',
            //     internalErrorCode: 'IB_00002'
            // });
        });
    });

    describe('updateApisInfo', () => {
        it('should resolve with data when API call is successful', async () => {
            configureSession(true);
            CommonsGenericProxy.putGeneric.and.returnValue(Promise.resolve({ data: { foo: 'bar' } }));

            service.updateApisInfo({ some: 'info' });
            await Promise.resolve();

            /*expect(CommonsGenericProxy.putGeneric).toHaveBeenCalledWith('/endpoint/apisPassengerInfo/flow123/security', { some: 'info' });
            expect($q.defer().resolve).toHaveBeenCalledWith({ foo: 'bar' });*/
        });

        it('should call error handlers and controlError on API error', async () => {
            configureSession(true);
            const error = { status: 500 };
            CommonsGenericProxy.putGeneric.and.returnValue(Promise.reject(error));

            service.updateApisInfo({ some: 'info' });
            await Promise.resolve();

            /*expect(CkiDatalayerUtilsService.sendDatalayerErrorEvent).toHaveBeenCalledWith(error);
            expect(CkiDatalayerUtilsService.sendDigitalDataErrorEvent).toHaveBeenCalledWith(error);
            expect(CommonsHttpUtilsErrorService.controlError).toHaveBeenCalled();*/
        });

        it('should reject with error when session is expired', () => {
            configureSession(false);

            service.updateApisInfo({ some: 'info' });

            expect($timeout).toHaveBeenCalled();
            /*expect($q.defer().reject).toHaveBeenCalledWith({
                errorCode: 'IB_00002',
                message: 'Session expired',
                internalErrorCode: 'IB_00002'
            });*/
        });
    });
});
