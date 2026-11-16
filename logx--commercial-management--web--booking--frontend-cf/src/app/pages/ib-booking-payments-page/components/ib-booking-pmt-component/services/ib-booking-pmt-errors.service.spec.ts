import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { IbBookingPmtErrorsService } from '@pages/ib-booking-payments-page/components/ib-booking-pmt-component/services/ib-booking-pmt-errors.service';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { TranslateService } from '@ngx-translate/core';
import { IbPaymentsIssuesService } from '@shared/http-services/sse-orm/ib-payment-issues.service';
import { AJSRootScope } from 'ib-web-commons/utils';
import { IbCModalServiceMock } from 'test/mocks/class/IbCModalServiceMock';
import { TranslateServiceMock } from 'test/mocks/Services/TranslateServiceAngularMock';


class PaymentIssueServiceMock {
    response = { code: 'DEFAULT_ERROR', options: [] };
    getPaymentIssue = jasmine.createSpy('getPaymentIssue').and.callFake(() => Promise.resolve(this.response));
}

class RootScopeMock {
    $broadcast = jasmine.createSpy('$broadcast');
}
// @ts-ignore
interface ServiceTest extends IbBookingPmtErrorsService{
    IbPaymentsIssuesService: PaymentIssueServiceMock,
    IbCModalService: IbCModalServiceMock,
    $rootScope: RootScopeMock
}
interface BtnConfig {
    id:string,
    text:string
    action: () => void
}

describe('IbBookingPmtErrorsService', () => {
    let service: ServiceTest;
    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                IbBookingPmtErrorsService,
                { provide: IbCModalService, useClass: IbCModalServiceMock },
                { provide: TranslateService, useValue: new TranslateServiceMock ()},
                { provide: IbPaymentsIssuesService, useClass: PaymentIssueServiceMock },
                { provide: AJSRootScope, useClass: RootScopeMock }
            ]
        });
        service = TestBed.inject(IbBookingPmtErrorsService) as any;
        
    });

    describe('Test handleCustomPaymentsErrors when service response is OK', () => {
        // Based on Payment Issue Service 
        const testErrors = [
            { code: 'PMT_CTX_INVALID_ORDER', options: [{ code: 'PMT_CTX_EXIT', description: 'PMT_CTX_EXIT' }] },
            { code: 'PMT_CTX_MISSING_ORDER', options: [{ code: 'PMT_CTX_EXIT', description: 'PMT_CTX_EXIT' }] },
            { code: 'PMT_CTX_RESIDENT_VALIDATION_ERROR', options: [{ code: 'PMT_CTX_EXIT', description: 'PMT_CTX_EXIT' }] },
            { code: 'PMT_CTX_RESIDENT_VALIDATION_UNAVAILABLE', options: [
                { code: 'PMT_CTX_EXIT', description: 'PMT_CTX_EXIT' },
                { code: 'PMT_CTX_RESIDENT_FREE_ONHOLD', description: 'PMT_CTX_RESIDENT_FREE_ONHOLD' }
            ] },
            { code: 'PMT_CTX_UNAVAILABLE', options: [{ code: 'PMT_CTX_REDIRECT', description: 'PMT_CTX_REDIRECT' }] },
            { code: 'PMT_DENIED', options: [
                { code: 'PMT_EXIT', description: 'PMT_EXIT' },
                { code: 'PMT_FREE_ONHOLD', description: 'PMT_FREE_ONHOLD' }
            ] },
            { code: 'PMT_REJECTED', options: [
                { code: 'PMT_CHANGE_PAYMENT_METHOD', description: 'PMT_CHANGE_PAYMENT_METHOD' },
                { code: 'PMT_FREE_ONHOLD', description: 'PMT_FREE_ONHOLD' }
            ] },
            { code: 'PMT_BINES_CONTROL', options: [
                { code: 'PMT_EXIT', description: 'PMT_EXIT' },
                { code: 'PMT_CHANGE_PAYMENT_METHOD', description: 'PMT_CHANGE_PAYMENT_METHOD' },
                { code: 'PMT_DELETE_DISCOUNT', description: 'PMT_DELETE_DISCOUNT' }
            ] },
            { code: 'PMT_PCC_WARNING', options: [
                { code: 'PMT_CHANGE_PAYMENT_METHOD', description: 'PMT_CHANGE_PAYMENT_METHOD' },
                { code: 'PMT_FREE_ONHOLD', description: 'PMT_FREE_ONHOLD' },
                { code: 'PMT_ACCEPT_WARNING_AND_CONTINUE', description: 'PMT_ACCEPT_WARNING_AND_CONTINUE' }
            ] }
        ];



        testErrors.forEach((error) => {
            it(`should call renderErrorModal on ${error.code}`, fakeAsync(() => {
                let {IbCModalService, IbPaymentsIssuesService,  $rootScope}  = service;
                const mockPmtIssueRequest: any = { issueId: '123' };
                const continueCallback = jasmine.createSpy('continueCallback');
                const onholdFreeCallback = jasmine.createSpy('onholdFreeCallback');
                const pccContinue = jasmine.createSpy('pccContinue');
                const testAction = ( button :BtnConfig) => {
                    button.action();
                    switch (button.id) {
                            case 'PMT_CTX_RESIDENT_FREE_ONHOLD':
                            case 'PMT_FREE_ONHOLD':
                                expect(onholdFreeCallback).toHaveBeenCalled();
                                break;
                            case 'PMT_CTX_REDIRECT':
                            case 'PMT_CHANGE_PAYMENT_METHOD':
                                expect(continueCallback).toHaveBeenCalled();
                                break;
                            case 'PMT_ACCEPT_WARNING_AND_CONTINUE':
                                expect(pccContinue).toHaveBeenCalled();
                                break;
                        
                            default:
                                expect($rootScope.$broadcast).toHaveBeenCalled();
                        
                    }
                    continueCallback.calls.reset();
                    onholdFreeCallback.calls.reset();
                    pccContinue.calls.reset();
                    $rootScope.$broadcast.calls.reset();
                };
               



                IbPaymentsIssuesService.response = error;

                service.handleCustomPaymentsErrors({
                    pmtIssueRequest: mockPmtIssueRequest,
                    continueCallback,
                    onholdFreeCallback,
                    pccContinue
                });
                flushMicrotasks();

                if (error.code === 'PMT_CTX_UNAVAILABLE') {
                    expect(continueCallback).toHaveBeenCalled();
                    return;
                }
                
                expect(IbPaymentsIssuesService.getPaymentIssue).toHaveBeenCalledWith(mockPmtIssueRequest);
                expect(IbCModalService.showGenericComponentModal).toHaveBeenCalled();
                const model: {actionButtons: BtnConfig[]}
                 = IbCModalService.showGenericComponentModalResponse.componentInstance.model;
                model.actionButtons.forEach((btn) => testAction(btn));
                
            }));
        });
    });
    describe('Test handleCustomPaymentsErrors when service response is ERROR', () => {
        it('should call showGenericModal when getPaymentIssue fails', fakeAsync(() => {
            let {IbCModalService, IbPaymentsIssuesService,  $rootScope}  = service;
            const mockPmtIssueRequest: any = { issueId: '123' };
            const continueCallback = jasmine.createSpy('continueCallback');
            const onholdFreeCallback = jasmine.createSpy('onholdFreeCallback');
            const pccContinue = jasmine.createSpy('pccContinue');
            IbPaymentsIssuesService.getPaymentIssue = jasmine.createSpy('getPaymentIssue').and.callFake(() => Promise.reject('error'));
            service.handleCustomPaymentsErrors({
                pmtIssueRequest: mockPmtIssueRequest,
                continueCallback,
                onholdFreeCallback,
                pccContinue
            });
            flushMicrotasks();
            expect(IbPaymentsIssuesService.getPaymentIssue).toHaveBeenCalledWith(mockPmtIssueRequest);
            expect(IbCModalService.showGenericModal).toHaveBeenCalled();
            expect($rootScope.$broadcast).toHaveBeenCalled();
        }));
    });
    describe('Test displayGenericError', () => {
        it('should call showGenericModal', () => {
            let {IbCModalService}  = service;
            service.displayGenericError();
            expect(IbCModalService.showGenericModal).toHaveBeenCalled();
        });
        it('should call showGenericModal with the correct arguments', () => {
            let {IbCModalService}  = service;
            service.displayGenericError();
            expect(IbCModalService.showGenericModal).toHaveBeenCalledWith(
                { body: 'REST_SERVICE_ERROR_GENERAL', accept: 'MODAL_BACK_HOME_BUTTON' },
                { modalBlocked: true }
            );
        });
        it('should broadcast backToMainRoot after modal is closed', fakeAsync(() => {
            let {IbCModalService, $rootScope}  = service;
            service.displayGenericError();
            expect(IbCModalService.showGenericModal).toHaveBeenCalled();
            flushMicrotasks();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('backToMainRoot', true, false);
        }));
    });

    describe('Test handleContextError', () => {
        it('should call renderErrorModal when status is 409', () => {
            let {IbCModalService}  = service;
            const errorMessage = { error: { code: 'DEFAULT_ERROR' }, status: 409 } as any;
            const continueCallback = jasmine.createSpy('continueCallback');
            const onholdFreeCallback = jasmine.createSpy('onholdFreeCallback');
            service.handleContextError({ errorMessage, continueCallback, onholdFreeCallback });
            expect(IbCModalService.showGenericComponentModal).toHaveBeenCalled();
        });
        it('should call continueCallback when status is not 409', () => {
            const errorMessage = { error: { code: 'DEFAULT_ERROR' }, status: 200 } as any;
            const continueCallback = jasmine.createSpy('continueCallback');
            const onholdFreeCallback = jasmine.createSpy('onholdFreeCallback');
            service.handleContextError({ errorMessage, continueCallback, onholdFreeCallback });
            expect(continueCallback).toHaveBeenCalled();
        });

    });


});
