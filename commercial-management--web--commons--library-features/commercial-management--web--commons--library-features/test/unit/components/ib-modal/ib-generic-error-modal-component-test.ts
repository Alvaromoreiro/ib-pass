import * as angular from 'angular';
import 'angular-mocks';

describe('Component: ibGenericErrorModalComponent', () => {

    let $componentController;
    let controller;
    let scope;

    const mockModalInstance = {
        close: jasmine.createSpy('close'),
        dismiss: jasmine.createSpy('dismiss'),
        result: {
            then: jasmine.createSpy('then')
        }
    };

    const mockWindow = {
        location: {
            origin: 'https://www.iberia.com',
            pathname: '/es/gestion-de-reservas'
        }
    };

    const mockDatalayerUtilsService = {
        sendDatalayerErrorEvent: jasmine.createSpy('sendDatalayerErrorEvent'),
        removeDatalayerErrorAttrs: jasmine.createSpy('removeDatalayerErrorAttrs')
    };

    const mockRedirectionService = {
        externalRedirect: jasmine.createSpy('externalRedirect')
    };

    const mockCommonsConstants = {
        APP_TYPES: {
            MANAGEMYBOOKING: 'MMB'
        }
    };

    const mockLocalStorageService = {
        get: jasmine.createSpy('get'),
        set: jasmine.createSpy('set'),
        remove: jasmine.createSpy('remove')
    };

    beforeEach(() => {
        angular.mock.module('ib-commons-modal-service-module');

        inject(($rootScope, _$componentController_) => {
            scope = $rootScope.$new();
            $componentController = _$componentController_;
        });

        mockModalInstance.close.calls.reset();
        mockModalInstance.dismiss.calls.reset();
        mockRedirectionService.externalRedirect.calls.reset();
        mockLocalStorageService.get.calls.reset();
        mockLocalStorageService.get.and.callFake(key => {
            return null;
        });
    });

    const createController = (bindings) => {
        return $componentController('ibGenericErrorModalComponent', {
            $scope: scope,
            $window: mockWindow,
            DatalayerUtilsService: mockDatalayerUtilsService,
            RedirectionService: mockRedirectionService,
            CommonsConstants: mockCommonsConstants,
            localStorageService: mockLocalStorageService
        }, bindings);
    };

    describe('Initialization ($onInit)', () => {
        it('should initialize the model from resolve object and send datalayer event', () => {
            const bindings = {
                modalInstance: mockModalInstance,
                resolve: { object: { title: 'Test Error' } }
            };
            controller = createController(bindings);
            controller.$onInit();

            expect(controller.model.title).toBe('Test Error');
            expect(mockDatalayerUtilsService.sendDatalayerErrorEvent).toHaveBeenCalledWith(controller.model);
        });
    });

    describe('Modal Actions', () => {

        it('should call modalInstance.close() when accept() is called', () => {
            const bindings = { modalInstance: mockModalInstance, resolve: { object: {} } };
            controller = createController(bindings);
            controller.accept();
            expect(mockModalInstance.close).toHaveBeenCalled();
        });

        it('should call modalInstance.dismiss() when close() is called', () => {
            const bindings = { modalInstance: mockModalInstance, resolve: { object: {} } };
            controller = createController(bindings);
            controller.close();
            expect(mockModalInstance.dismiss).toHaveBeenCalled();
        });

        it('should redirect if a redirect URL is provided in resolve object', () => {
            const bindings = {
                modalInstance: mockModalInstance,
                resolve: { object: { redirect: 'https://www.iberia.com/login' } }
            };
            controller = createController(bindings);
            controller.accept();

            expect(mockRedirectionService.externalRedirect).toHaveBeenCalledWith('https://www.iberia.com/login');
            expect(mockModalInstance.close).not.toHaveBeenCalled();
        });

        it('should redirect on session timeout error code', () => {
            const bindings = {
                modalInstance: mockModalInstance,
                resolve: { object: { internalErrorCode: 'SSE_ORM_9999' } }
            };
            controller = createController(bindings);
            controller.accept();

            expect(mockRedirectionService.externalRedirect).toHaveBeenCalledWith(mockWindow.location.origin);
            expect(mockModalInstance.close).not.toHaveBeenCalled();
        });
    });

    describe('MMB Inflight Redirection Logic', () => {

        it('should NOT redirect if it is not MMB app', () => {
            mockLocalStorageService.get.and.callFake(key => {
                if (key === 'flowApp') return 'BBKI'; 
                if (key === 'bookingInfoLight') return 'true';
                return null;
            });

            const bindings = { modalInstance: mockModalInstance, resolve: { object: {} } };
            controller = createController(bindings);
            controller.accept();

            expect(mockRedirectionService.externalRedirect).not.toHaveBeenCalled();
            expect(mockModalInstance.close).toHaveBeenCalled();
        });

        it('should NOT redirect if bookingInfoLight does not exist', () => {
            mockLocalStorageService.get.and.callFake(key => {
                if (key === 'flowApp') return 'MMB';
                if (key === 'bookingInfoLight') return null; 
                return null;
            });

            const bindings = { modalInstance: mockModalInstance, resolve: { object: {} } };
            controller = createController(bindings);
            controller.accept();

            expect(mockRedirectionService.externalRedirect).not.toHaveBeenCalled();
            expect(mockModalInstance.close).toHaveBeenCalled();
        });

        it('should redirect to MMB searcher when conditions are met', () => {
            mockLocalStorageService.get.and.callFake(key => {
                if (key === 'flowApp') return 'MMB';
                if (key === 'bookingInfoLight') return 'some_data';
                return null;
            });

            const bindings = { modalInstance: mockModalInstance, resolve: { object: {} } };
            controller = createController(bindings);
            controller.accept();

            const expectedUrl = mockWindow.location.origin + mockWindow.location.pathname + '#!/' + 'chktrp';
            expect(mockRedirectionService.externalRedirect).toHaveBeenCalledWith(expectedUrl);
            expect(mockModalInstance.close).toHaveBeenCalled(); 
        });
    });
});