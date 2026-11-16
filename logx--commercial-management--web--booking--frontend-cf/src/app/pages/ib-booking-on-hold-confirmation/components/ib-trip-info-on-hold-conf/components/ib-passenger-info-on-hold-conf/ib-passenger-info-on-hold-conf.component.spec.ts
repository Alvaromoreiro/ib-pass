import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbPassengerInfoOnHoldConfComponent } from '@pages/ib-booking-on-hold-confirmation/components/ib-trip-info-on-hold-conf/components/ib-passenger-info-on-hold-conf/ib-passenger-info-on-hold-conf.component';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';

class IbCModalServiceMock {
    showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.returnValue({
        result: Promise.resolve(),
        componentInstance: { model:{}}
    });
}

const mockSpecialNeeds = [{
    departureCity: {
        code: 'MAD',
        name: 'ADOLFO SUAREZ BARAJAS',
        terminal: '4S',
        city: {
            code: 'MAD',
            description: 'Madrid',
            countryCode: 'ES',
            country: {
                code: 'ES',
                description: 'Spain'
            }
        }
    },
    arrivalCity: {
        code: 'LHR',
        name: 'HEATHROW',
        terminal: '5',
        city: {
            code: 'LON',
            description: 'London',
            countryCode: 'GB',
            country: {
                code: 'GB',
                description: 'United Kingdom'
            }
        }
    },
    specialNeeds: [
        {
            serviceCode: 'BLND',
            text: 'BLND',
            status: {
                code: 'HK',
                description: 'Confirmed'
            }
        }
    ],
    showSpecialNeed: true
}];

describe('IbPassengerInfoOnHoldConfComponent', () => {
    let component: IbPassengerInfoOnHoldConfComponent;
    let fixture: ComponentFixture<IbPassengerInfoOnHoldConfComponent>;

    const fakeIbCModalService = new IbCModalServiceMock();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbPassengerInfoOnHoldConfComponent],
            providers: [
                { provide: IbCModalService, useValue: fakeIbCModalService }
            ],
            imports: [
                TranslateModule.forRoot(),
                IbBookingSharedModule
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IbPassengerInfoOnHoldConfComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe('Call openSpecialNeedsModal', () => {
        it('should open special needs modal', () => {
            component.openSpecialNeedsModal(mockSpecialNeeds);
            expect(fakeIbCModalService.showGenericComponentModal).toHaveBeenCalled();
        });
    });
});
