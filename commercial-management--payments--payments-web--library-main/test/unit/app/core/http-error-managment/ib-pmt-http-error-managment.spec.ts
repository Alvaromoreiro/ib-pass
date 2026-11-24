import angular from 'angular';

describe('PmtHttpErrorManagement - payment init safeguards', () => {
    let management: any;
    let rootScope: any;
    let fakeModal: any;
    let fakeWindow: any;
    let localStorageStore: Record<string, unknown>;

    const errorObject = {
        message: 'service error',
        errorCode: 449,
        internalErrorCode: 'PMT_PPM_8015',
        actualAttemps: 0,
        paymentMethodCallback: jasmine.createSpy('paymentMethodCallback'),
        url: '/rdu-loc/rs/loc/v1/location/country'
    };

    beforeEach(() => {
        localStorageStore = {};
        rootScope = {
            $broadcast: jasmine.createSpy('$broadcast'),
            $emit: jasmine.createSpy('$emit')
        };
        fakeWindow = {
            location: {
                reload: jasmine.createSpy('reload')
            }
        };
        fakeModal = {
            finishWaiting: jasmine.createSpy('finishWaiting'),
            showGenericError: jasmine.createSpy('showGenericError').and.returnValue({
                result: {
                    then: () => undefined
                }
            })
        };

        angular.mock.module('ib-pmt-services-http-module', ($provide: angular.auto.IProvideService) => {
            $provide.value('$rootScope', rootScope);
            $provide.value('PmtModalService', fakeModal);
            $provide.value('$window', fakeWindow);
            $provide.value('localStorageService', {
                get: jasmine.createSpy('get').and.callFake((key: string) => localStorageStore[key] ?? null),
                set: jasmine.createSpy('set').and.callFake((key: string, value: unknown) => {
                    localStorageStore[key] = value;
                }),
                remove: jasmine.createSpy('remove').and.callFake((key: string) => {
                    delete localStorageStore[key];
                })
            });
            $provide.value('PmtConstants', {
                MODALS: { GENERIC_ERROR_MODAL_PAYMENT: 'pmt-generic-error-payment-modal' },
                APP_TYPES: { ONHOLD: 'ONHOLD', CHECKIN: 'CKI' }
            });
            $provide.value('CommonsHttpUtilsErrorService', {});
            $provide.value('$location', { path: jasmine.createSpy('path') });
            $provide.value('$timeout', (fn: () => void) => fn());
            $provide.value('RedirectionService', {});
            $provide.value('$route', { reload: jasmine.createSpy('reload') });
            $provide.value('DatalayerConstants', {
                DATALAYER_MODAL_ID: { STATE: { BLANKSPACE: 'BLANKSPACE' } }
            });
            $provide.value('DatalayerUtilsService', {});
            $provide.value('DigitalDataService', {});
            $provide.value('CommonsUtilService', {
                checkWarningCheckOut: () => false
            });
        });

        inject((_PmtHttpErrorManagement_: any) => {
            management = _PmtHttpErrorManagement_;
        });
    });

    const getLastModalConfig = () => fakeModal.showGenericError.calls.mostRecent().args[0];

    it('blockPaymentInitDataError should show Iberia Pay reload modal and schedule page reload', () => {
        management.blockPaymentInitDataError(errorObject);

        expect(rootScope.$broadcast).toHaveBeenCalledWith('endPaymentEventCard', false);
        expect(fakeModal.finishWaiting).toHaveBeenCalled();
        expect(getLastModalConfig().title).toBe('IBERIA_PAY_ERROR_GENERAL_TITLE');
        expect(getLastModalConfig().message).toBe('IBERIA_PAY_ERROR_GENERAL');
        expect(getLastModalConfig().showbuttons.accept.text).toBe('IBERIA_PAY_ERROR_GENERAL_BUTTON');
        expect(fakeModal.showGenericError).toHaveBeenCalled();
    });

    it('keepOnHold without errorIssueService should use init reload modal', () => {
        management.keepOnHold(errorObject);

        expect(getLastModalConfig().title).toBe('IBERIA_PAY_ERROR_GENERAL_TITLE');
    });

    it('keepOnHold with errorIssueService should show PCC on-hold modal', () => {
        localStorageStore.errorIssueService = { otherPayment: false };

        management.keepOnHold(errorObject);

        expect(getLastModalConfig().title).toBe('REJECTED_PAYMENT_MODAL_TITLE');
        expect(fakeWindow.location.reload).not.toHaveBeenCalled();
    });

    it('rejectedCreditCardError without errorIssueService should use init reload modal', () => {
        management.rejectedCreditCardError(errorObject);

        expect(getLastModalConfig().title).toBe('IBERIA_PAY_ERROR_GENERAL_TITLE');
    });

    it('retryPCCOrOnHold without errorIssueService should use init reload modal', () => {
        management.retryPCCOrOnHold(errorObject);

        expect(getLastModalConfig().title).toBe('IBERIA_PAY_ERROR_GENERAL_TITLE');
    });
});
