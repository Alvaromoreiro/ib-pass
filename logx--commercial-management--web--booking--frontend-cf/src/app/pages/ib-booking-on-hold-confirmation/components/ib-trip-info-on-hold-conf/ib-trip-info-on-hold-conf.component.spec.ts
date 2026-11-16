import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IbTripInfoOnHoldConfComponent } from '@pages/ib-booking-on-hold-confirmation/components/ib-trip-info-on-hold-conf/ib-trip-info-on-hold-conf.component';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { OnHoldModelMockClass } from '@test-mocks/unit/app/pages/ib-booking-on-hold-confirmation/on-hold-model.mock';

const OhModelMock = new OnHoldModelMockClass();
describe('IbTripInfoOnHoldConfComponent', () => {
    let component: IbTripInfoOnHoldConfComponent;
    let fixture: ComponentFixture<IbTripInfoOnHoldConfComponent>;
    let generalInfoMock = OhModelMock.model.generalInfo;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbTripInfoOnHoldConfComponent],
            imports: [
                TranslateModule.forRoot(),
                IbBookingSharedModule
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IbTripInfoOnHoldConfComponent);
        component = fixture.componentInstance;
        component.generalInfo = generalInfoMock;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
