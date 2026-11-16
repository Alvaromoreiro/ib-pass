import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { IbMmbPaymentPageComponent } from '@src/components/ib-MmB-payment/ib-Mmb-payment-page.component';
import { IbMmbPaymentsPageService } from '@src/components/ib-MmB-payment/services/ib-Mmb-payments-page.service';
import { AJSMmbModalService } from '@src/components/ib-reusable-components/ib-MmB-modal/services/upgraded/ib-Mmb-modal-service-bridge.service';
import { MmbPaymentsPageServiceMock } from './mocks/MmbPaymentsPageServiceMock';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgReactModule } from '@src/app/react/wrapper/ng-react.module';
import { PaymentViewType } from '@src/components/ib-MmB-payment/enums/ib-Mmb-payments-enum';
import { CommonsBrowserStorageService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/services/StorageServiceMock';
import { MmbModalServiceMock } from '@test/mocks/services/MmbModalServiceMock';
@Component({
    selector: 'ib-mmb-pmt',
    template: `
        <div><p class="mytext">{{text}}</p></div>
    `
})
export class IbMmbPmt {
    text = PaymentViewType.NEW;
}

@Component({
    selector: 'ib-mmb-pmt-component-legacy',
    template: `
        <div><p class="mytext">{{text}}</p></div>
    `
})
export class IbMmbPmtComponentLegacy {
    text = PaymentViewType.OLD;
}

let fakeMmbModalService: MmbModalServiceMock;
let fakeMmbPaymentsPageService: MmbPaymentsPageServiceMock;


describe('IbMmbPaymentPageComponent', () => {
    let component: IbMmbPaymentPageComponent;
    let fixture: ComponentFixture<IbMmbPaymentPageComponent>;
    let localStorageMock = new StorageServiceMock();
    let sessionStorageMock = new StorageServiceMock();
    beforeEach(async () => {
        localStorageMock.clear();
        sessionStorageMock.clear();
        fakeMmbModalService = new MmbModalServiceMock();
        fakeMmbPaymentsPageService = new MmbPaymentsPageServiceMock();
        await TestBed.configureTestingModule({
            declarations: [
                IbMmbPaymentPageComponent,
                IbMmbPmtComponentLegacy,
                IbMmbPmt
            ],
            imports: [
                CommonModule,
                NgReactModule
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            providers: [
                { provide: AJSMmbModalService, useValue: fakeMmbModalService },
                { provide: CommonsBrowserStorageService, useValue: localStorageMock },
                { provide: CommonsSessionStorageService, useValue: sessionStorageMock },
            ],
        } ).overrideComponent(
            IbMmbPaymentPageComponent,
            {
                set: {
                    providers: [
                        { provide: IbMmbPaymentsPageService, useValue: fakeMmbPaymentsPageService },

                    ]
                }
            }
        ).compileComponents();
        fixture = TestBed.createComponent(IbMmbPaymentPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it(' should create', () => {
        expect(component).toBeTruthy();
        // expect( component.componentType ).toEqual( PaymentViewType.EMPTY );
    } );

    describe(' when ngOnInit is called', () => {
        it( ' should set componentType to OLD', fakeAsync(() => {
            localStorageMock.set('ib-MmB-app.forcePaymentType','OLD');
            component.ngOnInit();
            tick(100);
            flushMicrotasks();
            fixture.detectChanges();
            expect( component.componentType ).toEqual( PaymentViewType.OLD );
        }));

        it( ' should set componentType to NEW', fakeAsync(() => {
            localStorageMock.set('ib-MmB-app.forcePaymentType','NEW');
            component.ngOnInit();
            tick(100);
            flushMicrotasks();
            fixture.detectChanges();
            expect( component.componentType ).toEqual( PaymentViewType.NEW );
        }));

        it( ' should set componentType to CHECK', fakeAsync(() => {
            localStorageMock.set('ib-MmB-app.forcePaymentType', 'CHECK');
            fakeMmbPaymentsPageService.checkPaymentsViewType = jasmine.createSpy( 'checkPaymentsViewType' ).and.callFake(()=>PaymentViewType.NEW);
            component.ngOnInit();
            tick(100);
            flushMicrotasks();
            fixture.detectChanges();
            expect( component.componentType ).toEqual( PaymentViewType.NEW );
        }));

        it( ' should set componentType to OLDVC when flowApp is MMBVC and forcePaymentType is not set', fakeAsync(() => {
            sessionStorageMock.set('flowApp', 'MMBVC');
            component = new IbMmbPaymentPageComponent(
                sessionStorageMock as any,
                localStorageMock as any,
                fakeMmbPaymentsPageService as any,
                fakeMmbModalService as any
            );
            component.ngOnInit();
            tick(100);
            flushMicrotasks();
            expect( component.componentType ).toEqual( PaymentViewType.OLDVC );
        }));

        it( ' should set componentType to OLD when flowApp is MMB and forcePaymentType is not set', fakeAsync(() => {
            sessionStorageMock.set('flowApp', 'MMB');
            component = new IbMmbPaymentPageComponent(
                sessionStorageMock as any,
                localStorageMock as any,
                fakeMmbPaymentsPageService as any,
                fakeMmbModalService as any
            );
            component.ngOnInit();
            tick(100);
            flushMicrotasks();
            expect( component.componentType ).toEqual( PaymentViewType.OLD );
        }));
    });

    describe(' when forceOld is called', () => {
        it(' should set componentType to OLD when flowApp is MMB', () => {
            sessionStorageMock.set('flowApp', 'MMB');
            component = new IbMmbPaymentPageComponent(
                sessionStorageMock as any,
                localStorageMock as any,
                fakeMmbPaymentsPageService as any,
                fakeMmbModalService as any
            );
            component.forceOld();
            expect(component.componentType).toBe(PaymentViewType.OLD);
        });

        it(' should set componentType to OLDVC when flowApp is MMBVC', () => {
            sessionStorageMock.set('flowApp', 'MMBVC');
            component = new IbMmbPaymentPageComponent(
                sessionStorageMock as any,
                localStorageMock as any,
                fakeMmbPaymentsPageService as any,
                fakeMmbModalService as any
            );
            component.forceOld();
            expect(component.componentType).toBe(PaymentViewType.OLDVC);
        });

        it(' should set componentType to OLD when flowApp is not set (defaults to MMB)', () => {
            component.forceOld();
            expect(component.componentType).toBe(PaymentViewType.OLD);
        });
    });
});
