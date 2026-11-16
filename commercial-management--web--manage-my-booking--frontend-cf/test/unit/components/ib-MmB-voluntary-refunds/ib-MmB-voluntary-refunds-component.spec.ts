import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslatePipeMock } from '@test/unit/utils/pipe-mock.pipe';
import { Observable, Subscriber } from 'rxjs';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbMmBVoluntaryRefundsComponent } from '@src/components/ib-MmB-voluntary-refunds/ib-MmB-voluntary-refunds.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AJSMmbModalService } from '@src/components/ib-reusable-components/ib-MmB-modal/services/upgraded/ib-Mmb-modal-service-bridge.service';
import { AJSMmBDatalayerUtilsService } from "@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service-bridge.service";
import { IbMmbVoluntaryRefundsService } from '@src/components/ib-MmB-voluntary-refunds/services/ib-MmB-voluntary-refunds.service';
import { MmBRxProxy } from '@src/components/services/proxy/ib-MmB-rx-proxy.service';

class IbCModalServiceMock {
    showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.returnValue({
        componentInstance: {
            currentStep: 0,
            steps: []
        }
    });
};

class MmBModalServiceMock {
    showGenericInfoModal = jasmine.createSpy('showGenericInfoModal').and.returnValue({result:Promise.resolve('')});
};

class NgbActiveModalMock {
    close = jasmine.createSpy('close').and.returnValue({result:Promise.resolve('')});
};

let fakeIbMmbVoluntaryRefundsService = {

};

class MmBRxProxyMock {
    public responseExample = { code: 200, data: 'data'}
    public post = jasmine.createSpy('post').and.callFake(() => new Observable((subscriber: Subscriber<any>) => {
            subscriber.next(this.responseExample);
            subscriber.complete();
        })
    )
}

describe('Component: IbMmBVoluntaryRefundsComponent', () => {
    let component: IbMmBVoluntaryRefundsComponent;
    let fixture: ComponentFixture<IbMmBVoluntaryRefundsComponent>;
    let fakeIbCModalService: IbCModalServiceMock;
    let fakeMmBModalService: MmBModalServiceMock;
    let fakeNgbActiveModalService: NgbActiveModalMock;
    let fakeRootScope = { routes: { images: null } };
    let fakeMmBDatalayerUtilsService = {
        updateDatalayerInfo: jasmine.createSpy().and.returnValue('')
    };
    let fakeMmBRxProxy: MmBRxProxyMock;
    let fakeCommonsSessionStorageService = {
        clearAll: jasmine.createSpy()
    };

    beforeEach(() => {
        fakeIbCModalService = new  IbCModalServiceMock();
        fakeMmBModalService = new MmBModalServiceMock();
        fakeNgbActiveModalService = new NgbActiveModalMock();
        fakeMmBRxProxy = new MmBRxProxyMock();
        TestBed.configureTestingModule({
            declarations: [
                IbMmBVoluntaryRefundsComponent,
                TranslatePipeMock
            ],
            providers: [
                { provide: AJSMmBDatalayerUtilsService, useValue: fakeMmBDatalayerUtilsService },
                { provide: MmBRxProxy, useValue: fakeMmBRxProxy },
                { provide: NgbActiveModal, useValue: fakeNgbActiveModalService },
                { provide: IbCModalService, useValue: fakeIbCModalService },
                { provide: AJSMmbModalService, useValue: fakeMmBModalService },
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: IbMmbVoluntaryRefundsService, useValue: fakeIbMmbVoluntaryRefundsService},
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(IbMmBVoluntaryRefundsComponent);
        component = fixture.componentInstance;
    });

    it('should create the component when init', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should close modal when closeModal is called', () => {
        component.closeModal();
        expect(fakeNgbActiveModalService.close).toHaveBeenCalled();
    });

    it('should getSteps is called when withPayments true', () => {
        let data = {withPayments: true}
        expect(component['getSteps'](data)).toEqual(['MMB_CASH_REFUND_MODAL_STEP_1_TITLE', 'MMB_CASH_REFUND_MODAL_STEP_2_TITLE', 'MMB_CASH_REFUND_MODAL_STEP_3_TITLE']);
    });

    it('should getSteps is called when withPayments false', () => {
        let data = {withPayments: false}
        expect(component['getSteps'](data)).toEqual(['MMB_CASH_REFUND_MODAL_STEP_1_TITLE', 'MMB_CASH_REFUND_MODAL_STEP_3_TITLE']);
    });

    it('should showModalAndClose is called', () => {
        component.currentStep = 0;
        component.steps = ['MMB_CASH_REFUND_MODAL_STEP_1_TITLE', 'MMB_CASH_REFUND_MODAL_STEP_3_TITLE'];
        component.showModalAndClose();
        expect(fakeIbCModalService.showGenericComponentModal).toHaveBeenCalled();
    });

    it('when isConfirmationStep is called and return true', () => {
        component.currentStep = 2;
        component.steps = ['test', 'test', 'MMB_CASH_REFUND_MODAL_STEP_3_TITLE']
        const res = component.isConfirmationStep();
        expect(res).toBeTrue();
    });

    it('when isConfirmationStep is called and return false', () => {
        component.currentStep = 0;
        component.steps = ['test', 'test', 'MMB_CASH_REFUND_MODAL_STEP_3_TITLE']
        const res = component.isConfirmationStep();
        expect(res).toBeFalse();
    });

    it('when checkStep is called and call showModalAndClose', () => {
        component.currentStep = 0;
        component.steps = ['test', 'test', 'MMB_CASH_REFUND_MODAL_STEP_3_TITLE']
        component.checkStep();
        expect(fakeIbCModalService.showGenericComponentModal).toHaveBeenCalled();
    });

    xit('when checkStep is called and redirect home', () => {
        component.currentStep = 2;
        component.steps = ['test', 'test', 'MMB_CASH_REFUND_MODAL_STEP_3_TITLE']
        component.checkStep();
        expect(fakeCommonsSessionStorageService.clearAll).toHaveBeenCalled();
    });
});
