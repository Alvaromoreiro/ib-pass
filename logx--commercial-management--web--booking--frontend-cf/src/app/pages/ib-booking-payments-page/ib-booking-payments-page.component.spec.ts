import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { IbBookingPaymentsPageComponent } from '@src/app/pages/ib-booking-payments-page/ib-booking-payments-page.component';
import { IbBookingPaymentsPageService } from '@src/app/pages/ib-booking-payments-page/services/ib-booking-payments-page.service';
import { AJSBookingModalService } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { BookingModalServiceMock } from '@test-mocks/Services/BookingModalServiceMock';
import { BookingPaymentsPageServiceMock } from '@test-mocks/unit/app/pages/ib-booking-payments-page/BookingPaymentsPageServiceMock';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentViewType } from '@src/app/core/enums/ib-booking-paymments/ib-booking-payments-enum';
import { By } from '@angular/platform-browser';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { NewMainHeaderFacadeTokenMock } from '@test-mocks/class/NewMainHeaderFacadeMock';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
@Component({
    selector: 'ib-booking-pmt',
    template: `
        <div><p class="mytext">{{text}}</p></div>
    `
})
export class IbBookingPmt {
    text = PaymentViewType.NEW;
}
@Component({
    selector: 'ib-booking-pmt-component-legacy',
    template: `
        <div><p class="mytext">{{text}}</p></div>
    `
})
export class IbBookingPmtComponentLegacy {
    text = PaymentViewType.OLD;
}

let fakeBookingModalService: BookingModalServiceMock;
let fakeBookingPaymentsPageService: BookingPaymentsPageServiceMock;
describe('IbBookingPaymentsPageComponent', () => {
    let component: IbBookingPaymentsPageComponent;
    let fixture: ComponentFixture<IbBookingPaymentsPageComponent>;
    let storageService : CommonsSessionStorageService;
    let fakeNewMainHeaderFacade: any;
    beforeEach(async () => {
        fakeBookingModalService = new BookingModalServiceMock();
        fakeBookingPaymentsPageService = new BookingPaymentsPageServiceMock();
        fakeNewMainHeaderFacade = new NewMainHeaderFacadeTokenMock();

        storageService = new StorageServiceMock() as any;
        await TestBed.configureTestingModule({
            declarations: [
                IbBookingPaymentsPageComponent,
                IbBookingPmtComponentLegacy,
                IbBookingPmt
            ],
            imports: [
                CommonModule
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            providers: [
                { provide: AJSBookingModalService, useValue: fakeBookingModalService },
                { provide: CommonsSessionStorageService, useValue: storageService },
                { provide: IbBookingHeaderFacadeService, useValue: fakeNewMainHeaderFacade }
            ]
        } ).overrideComponent(
            IbBookingPaymentsPageComponent,
            {
                set: {
                    providers: [
                        { provide: IbBookingPaymentsPageService, useValue: fakeBookingPaymentsPageService }
                    ]
                }
            }
        ).compileComponents();
        fixture = TestBed.createComponent(IbBookingPaymentsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
        expect( component.componentType ).toEqual( PaymentViewType.EMPTY );
    } );
    describe( 'when ngOnInit is called', () => {
        beforeEach(()=> {
            storageService.remove(BkiStorageConstants.PAYMENTS_VIEWTYPE);
        });
        it( 'should set componentType to OLD', fakeAsync(() => {
            fakeBookingPaymentsPageService.checkPaymentsViewType = jasmine.createSpy( 'checkPaymentsViewType' ).and.callFake(()=>Promise.resolve(PaymentViewType.OLD));
            component.ngOnInit();
            tick(100);
            flushMicrotasks();
            fixture.detectChanges();
            const text = fixture.debugElement.query(By.css('.mytext'));
            expect( component.componentType ).toEqual( PaymentViewType.OLD );
            expect(text.nativeElement.textContent.trim()).toBe(PaymentViewType.OLD);
        }));
        it( 'should set componentType to NEW', fakeAsync(() => {
            fakeBookingPaymentsPageService.checkPaymentsViewType = jasmine.createSpy( 'checkPaymentsViewType' ).and.callFake(()=>Promise.resolve(PaymentViewType.NEW));
            component.ngOnInit();
            tick(100);
            flushMicrotasks();
            fixture.detectChanges();
            const text = fixture.debugElement.query(By.css('.mytext'));
            expect( component.componentType ).toEqual( PaymentViewType.NEW );
            expect(text.nativeElement.textContent.trim()).toBe(PaymentViewType.NEW);
        }));
        it( 'should set OLD due to stored value', fakeAsync(() => {
            fakeBookingPaymentsPageService.checkPaymentsViewType = jasmine.createSpy( 'checkPaymentsViewType' ).and.callFake(()=>Promise.resolve(PaymentViewType.NEW));
            storageService.set(BkiStorageConstants.PAYMENTS_VIEWTYPE, 'OLD');
            component.ngOnInit();
            tick(100);
            flushMicrotasks();
            fixture.detectChanges();
            const text = fixture.debugElement.query(By.css('.mytext'));
            expect( component.componentType ).toEqual( PaymentViewType.OLD );
            expect(text.nativeElement.textContent.trim()).toBe(PaymentViewType.OLD);
        }));
    });
    describe( 'when forceOld is called', () => {
        it( 'should set componentType to OLD', () => {
            storageService.remove(BkiStorageConstants.PAYMENTS_VIEWTYPE);
            component.forceOld();
            fixture.detectChanges();
            const text = fixture.debugElement.query(By.css('.mytext'));
            expect( component.componentType ).toEqual( PaymentViewType.OLD );
            expect(text.nativeElement.textContent.trim()).toBe(PaymentViewType.OLD);
        });
    });
});
