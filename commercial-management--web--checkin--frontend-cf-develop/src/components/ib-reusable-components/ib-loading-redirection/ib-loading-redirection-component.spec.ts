import * as angular from 'angular';

describe('ibLoadingRedirection component', () => {
    let $componentController: (name: string, locals?: object, bindings?: object) => object;
    let storageValues: Record<string, unknown>;
    let localStorageService: { get: jasmine.Spy; remove: jasmine.Spy };
    let loginInfoService: { checkCustomerStatus: jasmine.Spy };
    let headerFacade: { initHeader: jasmine.Spy };
    let modalService: {
        showWaitingModal: jasmine.Spy;
        finishWaiting: jasmine.Spy;
        showGenericDynamicModal: jasmine.Spy;
    };
    let location: { path: jasmine.Spy };

    beforeEach(() => {
        storageValues = {};
        localStorageService = {
            get: jasmine.createSpy('get').and.callFake((key: string) => storageValues[key]),
            remove: jasmine.createSpy('remove')
        };
        const finalizer = jasmine.createSpy('finally').and.callFake((callback: () => void) => {
            callback();
        });
        loginInfoService = {
            checkCustomerStatus: jasmine.createSpy('checkCustomerStatus').and.returnValue({
                catch: jasmine.createSpy('catch').and.returnValue({ finally: finalizer })
            })
        };
        headerFacade = { initHeader: jasmine.createSpy('initHeader') };
        modalService = {
            showWaitingModal: jasmine.createSpy('showWaitingModal'),
            finishWaiting: jasmine.createSpy('finishWaiting'),
            showGenericDynamicModal: jasmine.createSpy('showGenericDynamicModal')
        };
        location = { path: jasmine.createSpy('path') };

        angular.mock.module('ib-loading-redirection-module', ($provide: ng.auto.IProvideService) => {
            $provide.value('localStorageService', localStorageService);
            $provide.value('CkiCommonsGetLoginInfoService', loginInfoService);
            $provide.value('NewMainHeaderFacade', headerFacade);
            $provide.value('CommonsModalService', modalService);
            $provide.value('$location', location);
            $provide.value('CheckinAppConstants', { FLIGHTTYPE: 'round-trip' });
        });

        angular.mock.inject((
            _$componentController_: (name: string, locals?: object, bindings?: object) => object
        ) => {
            $componentController = _$componentController_;
        });
    });

    it('loads the header and redirects to the saved flow after checking customer status', () => {
        storageValues = {
            headerModel: {
                headerModel: {
                    currency: 'EUR',
                    shoppingBasket: ['bag'],
                    showModalBackHome: false
                }
            },
            headerInfo: { origin: 'MAD' },
            userLogged: true,
            customerData: { name: 'traveller' },
            actualStepFlow: 'ibcoac'
        };

        $componentController('ibLoadingRedirection', {});

        expect(localStorageService.remove).toHaveBeenCalledWith('customerData');
        expect(loginInfoService.checkCustomerStatus).toHaveBeenCalledWith(true);
        expect(localStorageService.remove).toHaveBeenCalledWith('headerModel');
        expect(headerFacade.initHeader).toHaveBeenCalledWith(
            jasmine.objectContaining({
                originDestination: { origin: 'MAD' },
                flightType: 'round-trip',
                currency: 'EUR',
                shoppingBasket: ['bag'],
                showModalBackHome: false
            }),
            { hasSteps: false, steps: 'DEFAULT_STEPS', position: 0 },
            jasmine.objectContaining({ userLogged: true, loggedData: { name: 'traveller' } })
        );
        expect(location.path).toHaveBeenCalledWith('/ibcoac');
    });

    it('uses the home route and exposes login and error callbacks when no flow or header exists', () => {
        storageValues = { actualStepFlow: undefined };

        $componentController('ibLoadingRedirection', {});

        expect(headerFacade.initHeader).not.toHaveBeenCalled();
        expect(location.path).toHaveBeenCalledWith('/');
    });

    it('shows the loading modal and handles errors from the header login callbacks', () => {
        storageValues = { headerModel: { headerModel: {} } };
        $componentController('ibLoadingRedirection', {});
        const callbacks = headerFacade.initHeader.calls.mostRecent().args[2];

        callbacks.onLogin();
        callbacks.onError({ message: 'login failed', stateUserLogged: true });

        expect(modalService.showWaitingModal).toHaveBeenCalledWith(
            'ib-modal-loading-plane',
            'ib-modals ib-modals--transparent ib-modals--loading-page',
            true
        );
        expect(modalService.finishWaiting).toHaveBeenCalled();
        expect(modalService.showGenericDynamicModal).toHaveBeenCalledWith(
            true,
            'generic-login-modal-error.html',
            { message: 'login failed', stateUserLogged: true },
            'GenericErrorModalController',
            'ib-modals--backdrop-off'
        );
    });
});
