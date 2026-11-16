import * as angular from 'angular';

import '../../../../src/components/routing/ib-MmB-router-config';

xdescribe('ib-MmB-router-config', () => {
    let $routeProviderMock;
    let MmBRouterConstantsMock;
    let ibRouterConfigInstance;
    let fakeMmBAppConstants = {};
    let fakeAddOnService = {};
    let fakeLocalStorageService = {};

    beforeEach(() => {
        $routeProviderMock = {
            when: jasmine.createSpy('when').and.returnValue({}),
            otherwise: jasmine.createSpy('otherwise')
        };

        MmBRouterConstantsMock = {
            PAGES_URL: {
                SEARCH: '/chktrp',
                BOOKING_MANAGE: '/manage',
                CHANGE_FLIGHT: '/change',
                FLIGHT_CONFIRMATION: '/confirm',
                BOOKINGS_LIST: '/list',
                PASSENGERS_INFO: '/passengers',
                PAYMENTS: '/payments',
                MMB_PAYMENTS_CONFIRM: '/payments-confirm',
                NEW_MMB_PAYMENTS_CONFIRM: '/new-payments-confirm',
                MMB_CONFIRMATION_ORDER: '/confirmation-order',
                MMB_COMMUNICATION_LOST: '/communication-lost',
                MMB_DASHBOARD: '/dashboard',
                MMB_INVOLUNTARY_CHANGE: '/involuntary-change',
                DISRUPTION_DASHBOARD: '/disruption-dashboard',
                DISRUPTION_REFUND: '/disruption-refund',
                REBOOK_ERROR: '/rebook-error',
                ANCILLARIES: '/ancillaries'
            },
            templatesRoute: 'web-manage-my-booking/templates/',
            managementViewRoute: 'manage-view.html',
            flightConfirmationViewRoute: 'flight-confirmation.html',
            bookingsListViewRoute: 'bookings-list.html',
            passengersInfoView: 'passengers-info.html',
            mmbPaymentTemplate: '<div>Payment</div>',
            paymentsConfirmMmbRoute: 'payments-confirm.html',
            mmbConfirmationTemplate: '<div>Confirmation</div>',
            confirmationMmbOrderViewRoute: 'confirmation-order.html',
            mmbCommunicationLostViewRoute: 'communication-lost.html',
            mmbInvoluntaryChangeViewRoute: 'involuntary-change.html',
            disruptionDashboardRoute: 'disruption-dashboard.html',
            disruptionRefundRoute: 'disruption-refund.html',
            rebookErrorViewRoute: 'rebook-error.html',
            ancillariesRoute: 'ancillaries.html'
        };
        

        angular.mock.module('LocalStorageModule','ib-MmB-routing-module',($provide: any) => {
            $provide.value('$routeProvider', $routeProviderMock);
            $provide.value('MmBRouterConstants', MmBRouterConstantsMock);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('AddOnService', fakeAddOnService);
            $provide.value('localStorageService', fakeLocalStorageService);
        });
    });

    beforeEach(inject(['$injector', ($injector: any) => {
        ibRouterConfigInstance = $injector.get('ibRouterConfig');
    }]));

    it('debería instanciar ibRouterConfig y ejecutar active()', () => {
        expect(ibRouterConfigInstance).toBeDefined();
        expect(typeof ibRouterConfigInstance.active).toBe('function');
        ibRouterConfigInstance.active();
        expect($routeProviderMock.when).toHaveBeenCalled();
        expect($routeProviderMock.otherwise).toHaveBeenCalledWith({ redirectTo: MmBRouterConstantsMock.PAGES_URL.SEARCH });
    });
});
