import { SimpleChange, SimpleChanges } from '@angular/core';
import { mockGeneralInfo } from '@test-mocks/Responses/mockImportGeneralInfo';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IbGeneralInfoOnHoldConfComponent } from '@pages/ib-booking-on-hold-confirmation/components/ib-general-info-on-hold-conf/ib-general-info-on-hold-conf.component';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { CommonsSessionStorageService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { BookingRedirectionServiceMock } from '@test-mocks/class/BookingRedirectionServiceMock';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import dayjs from 'dayjs';
import { AJSBookingModalService } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';

const fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();
const fakeCommonsUserUtilsService = {
    isIbZero: jasmine.createSpy('isIbZero'),
    isUserLoggedONB: jasmine.createSpy('isUserLoggedONB'),
    isUserLogged: jasmine.createSpy('isUserLogged')
};

let fakeBookingRedirectionService: BookingRedirectionServiceMock;

const fakeBookingModalService = {
    showWaitingModal : jasmine.createSpy('showWaitingModal')
};


describe('IbGeneralInfoOnHoldConfComponent', () => {
    let component: IbGeneralInfoOnHoldConfComponent;
    let fixture: ComponentFixture<IbGeneralInfoOnHoldConfComponent>;
    fakeBookingRedirectionService = new BookingRedirectionServiceMock();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ IbGeneralInfoOnHoldConfComponent ],
            imports: [
                TranslateModule.forRoot(),
                IbBookingSharedModule
            ],
            providers: [
                { provide: IbCUserUtilsService, useValue: fakeCommonsUserUtilsService },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: BookingRedirectionService, useValue: fakeBookingRedirectionService },
                { provide: AJSBookingModalService, useValue: fakeBookingModalService}
            ]

        })
            .compileComponents();

        fixture = TestBed.createComponent(IbGeneralInfoOnHoldConfComponent);
        component = fixture.componentInstance;
        component.generalInfo = mockGeneralInfo;
        fixture.detectChanges();
    });
    afterEach(fakeAsync(()=>{
        discardPeriodicTasks();
    }));

    xit('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('When component is created', () => {
        beforeEach(() => {
            const endTime = dayjs().add(2, 'minutes').valueOf();
            fakeCommonsSessionStorageService.set('bookingInfo', {onHoldInformation:{remainingTime: 1200, paidDeposit: {currency:'EUR', fare: 5}, timeLimits: endTime}});
        });
        xit('should begin on hold counter', fakeAsync(() => {
            const expectedValues = [
                { seconds: 59 },
                { seconds: 58 },
                { seconds: 57 },
                { seconds: 56 }
            ];
            let index = 0;
            component.ngOnInit();
            const subscription = component.remainingTime$.subscribe(value => {
                expect(value.seconds.toString()).toEqual(expectedValues[index].seconds.toString());
                index++;
            });
            tick(1000);
            tick(1000);
            tick(1000);
            subscription.unsubscribe();
            flush();
        }));
    });

    describe('When confirmOrder is called', () => {
        it('should emit confirmOnHoldOrder event', () => {
            spyOn( component.confirmOnHoldOrder, 'emit' );
            component.confirmOrder();
            expect(component.confirmOnHoldOrder.emit).toHaveBeenCalled();
        });
    });

    describe('When cancelOrder is called', () => {
        it('should emit cancelOnHoldOrder event', () => {
            spyOn( component.cancelOnHoldOrder, 'emit' );
            component.cancelOrder();
            expect(component.cancelOnHoldOrder.emit).toHaveBeenCalled();
        });
    });
    describe('When redirectToAncillaries is called', () => {
        it('should emit confirmOnHoldOrder event with ancillaries path', () => {
            spyOn(component.confirmOnHoldOrder, 'emit');
            component.redirectToAncillaries();
       
            expect(component.confirmOnHoldOrder.emit).toHaveBeenCalledWith('/ibcmtv');
        });
    });
    describe('When ngOnChanges is called', () => {
        it('should set multicity flight type state', () => {
            const changes: SimpleChanges = {
                generalInfo: new SimpleChange(false, true, false)
            };
            component.ngOnChanges(changes);
            expect(component.isMulticity).toBeFalsy();
        });
    });
});
