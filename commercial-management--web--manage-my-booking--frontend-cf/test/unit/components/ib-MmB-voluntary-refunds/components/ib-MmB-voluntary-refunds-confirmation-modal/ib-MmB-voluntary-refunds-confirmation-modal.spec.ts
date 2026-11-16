import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateServiceMock } from '@test/mocks/services/translate-service-angular-mock';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IbMmBVoluntaryRefundsConfirmationModalComponent } from '@src/components/ib-MmB-voluntary-refunds/components/ib-MmB-voluntary-refunds-confirmation-modal/ib-MmB-voluntary-refunds-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IbMmbVoluntaryRefundsService } from '@src/components/ib-MmB-voluntary-refunds/services/ib-MmB-voluntary-refunds.service';
import { IbMmbVoluntaryRefundsConfirmationService } from '@src/components/ib-MmB-voluntary-refunds/services/ib-mmb-voluntary-refunds-confirmation.service';
import { EventEmitter } from '@angular/core';
import { IbCModalService } from 'ib-web-commons/ib-modal';

class NgbActiveModalMock {
    close = jasmine.createSpy('close').and.returnValue({result:Promise.resolve('')});
};
class IbMmbVoluntaryRefundsServiceMock {
    updateWorkflowDatalayerInfo = jasmine.createSpy('updateWorkflowDatalayerInfo').and.returnValue({result:Promise.resolve('')});
};

class IbMmbVoluntaryRefundsConfirmationMock {
    voluntaryRefundsItinRefundConfirmationPromised = jasmine.createSpy('voluntaryRefundsItinRefundConfirmationPromised').and.callFake(() => { return {then:Promise.resolve('')}});
}

class EventEmitterService {
    getNewCurrentStep: EventEmitter<number> = new EventEmitter();
}

class IbCModalServiceMock {
    showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.returnValue({result:Promise.resolve('')});
};

describe('Component: IbMmBVoluntaryRefundsConfirmationModalComponent', () => {
    let component: IbMmBVoluntaryRefundsConfirmationModalComponent;
    let fixture: ComponentFixture<IbMmBVoluntaryRefundsConfirmationModalComponent>;
    let fakeTranslate: TranslateServiceMock;
    let fakeNgbActiveModal:NgbActiveModalMock = new NgbActiveModalMock();
    let fakeIbMmbVoluntaryRefundsService: IbMmbVoluntaryRefundsServiceMock = new IbMmbVoluntaryRefundsServiceMock();
    let fakeIbMmbVoluntaryRefundsConfirmationService: IbMmbVoluntaryRefundsConfirmationMock = new IbMmbVoluntaryRefundsConfirmationMock();
    let fakeEventEmitterService: EventEmitterService = new EventEmitterService();
    let fakeIbCModalService: IbCModalServiceMock;

    beforeEach(() => {
        fakeTranslate = new TranslateServiceMock();
        fakeIbCModalService = new IbCModalServiceMock();
        TestBed.configureTestingModule({
            imports: [
                TranslateModule,
            ],
            declarations: [
                IbMmBVoluntaryRefundsConfirmationModalComponent
            ],
            providers: [
                { provide: TranslateService, useValue: fakeTranslate},
                { provide: NgbActiveModal, useValue: fakeNgbActiveModal },
                { provide: IbCModalService, useValue: fakeIbCModalService },
                { provide: IbMmbVoluntaryRefundsService, useValue: fakeIbMmbVoluntaryRefundsService},
                { provide: IbMmbVoluntaryRefundsConfirmationService, useValue: fakeIbMmbVoluntaryRefundsConfirmationService}
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(IbMmBVoluntaryRefundsConfirmationModalComponent);
        component = fixture.componentInstance;
    });

    it('should create the component when init', () => {
        expect(component).toBeTruthy();
    });

    it('should IbMmbVoluntaryRefundsService called', () => {
        component.ngOnInit();
        expect(fakeIbMmbVoluntaryRefundsService.updateWorkflowDatalayerInfo).toHaveBeenCalled();
    });

    it('should NgbActiveModal called', () => {
        component.closeModal();
        expect(fakeNgbActiveModal.close).toHaveBeenCalled();
    });

    describe('when accept method is called and resolve the promise', () => {
        beforeEach(() => {
            fakeIbMmbVoluntaryRefundsConfirmationService.voluntaryRefundsItinRefundConfirmationPromised = jasmine.createSpy('voluntaryRefundsItinRefundConfirmation').and.callFake(function () {
                return Promise.resolve({data: {}});
            });
            component.currentStep = 1;
            component.getNewCurrentStep = fakeEventEmitterService.getNewCurrentStep;
        });

        it('should emit currentStep and call closeModal', (async () => {
            spyOn(fakeEventEmitterService.getNewCurrentStep, 'emit');
            await component.accept();
            expect(component.showSpinner).toBe(false);
            expect(component.currentStep).toEqual(2);
            expect(fakeEventEmitterService.getNewCurrentStep.emit).toHaveBeenCalledWith(2);
            expect(fakeNgbActiveModal.close).toHaveBeenCalled();
        }));
    });

    describe('when accept method is called and reject the promise with error different from 409', () => {
        beforeEach(() => {
            fakeIbMmbVoluntaryRefundsConfirmationService.voluntaryRefundsItinRefundConfirmationPromised = jasmine.createSpy('voluntaryRefundsItinRefundConfirmation').and.callFake(function () {
                return Promise.reject({ status: 500, error: { errors: [
                    {
                      "code": "SSE_ORM_9002",
                      "reason": "Inténtalo de nuevo y si el problema persiste, por favor ponte en contacto con nosotros.",
                      "uuid": null,
                      "timeStamp": "2024-02-14 08:31"
                    }
                  ]
                }});
            });
        });

        it('should call closeModal', (async () => {
            await component.accept();
            expect(component.showSpinner).toBe(false);
            expect(fakeNgbActiveModal.close).toHaveBeenCalled();
            expect(fakeIbCModalService.showGenericComponentModal).toHaveBeenCalled();
        }));
    });

    describe('when accept method is called and reject the promise with error 409 & code is HAL_SSE_ORM_0039 with caseNumber', () => {
        const fakeCaseNumber = '20260514-50457411';

        beforeEach(() => {
            fakeIbMmbVoluntaryRefundsConfirmationService.voluntaryRefundsItinRefundConfirmationPromised = jasmine.createSpy('voluntaryRefundsItinRefundConfirmation').and.callFake(function () {
                return Promise.reject({ status: 409, error: {
                    "code": "HAL_SSE_ORM_0039",
                    "reason": null,
                    "uuid": null,
                    "timeStamp": "2026-05-14 05:53",
                    "caseNumber": fakeCaseNumber
                }});
            });
            component.currentStep = 1;
            component.getNewCurrentStep = fakeEventEmitterService.getNewCurrentStep;
        });

        it('should emit currentStep, confirmationData with caseNumber and call closeModal', (async () => {
            spyOn(fakeEventEmitterService.getNewCurrentStep, 'emit');
            spyOn(component.confirmationData, 'emit');
            await component.accept();
            expect(component.showSpinner).toBe(false);
            expect(component.currentStep).toEqual(2);
            expect(fakeEventEmitterService.getNewCurrentStep.emit).toHaveBeenCalledWith(2);
            expect(fakeNgbActiveModal.close).toHaveBeenCalled();
            expect(component.confirmationData.emit).toHaveBeenCalledWith({ caseNumber: fakeCaseNumber } as any);
        }));
    });

    describe('when accept method is called and reject the promise with error 409 & code is SSE_MMB_1015 with caseNumber', () => {
        const fakeCaseNumber = 'CASE-001';

        beforeEach(() => {
            fakeIbMmbVoluntaryRefundsConfirmationService.voluntaryRefundsItinRefundConfirmationPromised = jasmine.createSpy('voluntaryRefundsItinRefundConfirmation').and.callFake(function () {
                return Promise.reject({ status: 409, error: {
                    "code": "SSE_MMB_1015",
                    "caseNumber": fakeCaseNumber,
                    "reason": "Se ha producido un error en el reembolso de sus documentos. Contacte con el call center.",
                    "uuid": null,
                    "timeStamp": "2024-02-14 08:31"
                }});
            });
            component.currentStep = 1;
            component.getNewCurrentStep = fakeEventEmitterService.getNewCurrentStep;
        });

        it('should emit currentStep, confirmationData with caseNumber and call closeModal', (async () => {
            spyOn(fakeEventEmitterService.getNewCurrentStep, 'emit');
            spyOn(component.confirmationData, 'emit');
            await component.accept();
            expect(component.showSpinner).toBe(false);
            expect(component.currentStep).toEqual(2);
            expect(fakeEventEmitterService.getNewCurrentStep.emit).toHaveBeenCalledWith(2);
            expect(fakeNgbActiveModal.close).toHaveBeenCalled();
            expect(component.confirmationData.emit).toHaveBeenCalledWith({ caseNumber: fakeCaseNumber } as any);
        }));
    });

    describe('when accept method is called and reject the promise with error 409 & code is SSE_MMB_1015 without caseNumber', () => {
        beforeEach(() => {
            fakeIbMmbVoluntaryRefundsConfirmationService.voluntaryRefundsItinRefundConfirmationPromised = jasmine.createSpy('voluntaryRefundsItinRefundConfirmation').and.callFake(function () {
                return Promise.reject({ status: 409, error: {
                    "code": "SSE_MMB_1015",
                    "caseNumber": "",
                    "reason": "Se ha producido un error en el reembolso de sus documentos. Contacte con el call center.",
                    "uuid": null,
                    "timeStamp": "2024-02-14 08:31"
                }});
            });
            component.currentStep = 1;
            component.getNewCurrentStep = fakeEventEmitterService.getNewCurrentStep;
        });

        it('should not emit confirmationData and still advance the step', (async () => {
            spyOn(fakeEventEmitterService.getNewCurrentStep, 'emit');
            spyOn(component.confirmationData, 'emit');
            await component.accept();
            expect(component.showSpinner).toBe(false);
            expect(component.currentStep).toEqual(2);
            expect(fakeEventEmitterService.getNewCurrentStep.emit).toHaveBeenCalledWith(2);
            expect(fakeNgbActiveModal.close).toHaveBeenCalled();
            expect(component.confirmationData.emit).not.toHaveBeenCalled();
        }));
    });
});
