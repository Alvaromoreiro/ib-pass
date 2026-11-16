import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { DigitalDataProcess, DigitalDataSteps } from '@src/app/core/constants/ib-digital-data-constants';
import { IbBookingOnHoldAnulationComponent } from '@src/app/pages/ib-booking-on-hold-anulation/ib-booking-on-hold-anulation.component';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { BookingPageUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-page-utils.service';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { AJSRootScope } from 'ib-web-commons/utils';
import { BookingPageUtilsServiceMock } from '@test-mocks/class/BookingPageUtilsServiceMock';
import { RootScopeMock } from '@test-mocks/class/RootScopeMock';

const ORIGIN ='http://localhost:9876';
const TWITTER_URL = 'BKI_TITLE_PAGE_CONF_ONHOLD_CANCEL';

class DigitalDataUtilsServiceMock {
    updateDigitalDataWithQuadrigam = jasmine.createSpy('updateDigitalDataWithQuadrigam');
    setProcessAndStep = jasmine.createSpy('setProcessAndStep');
    emitViewEvent = jasmine.createSpy('emitViewEvent');
}

class BookingRedirectionServiceMock {
    externalRedirect = jasmine.createSpy('externalRedirect');
}

class WindowTokenMock {
    location = {
        origin: 'http://localhost:9876'
    };
}

@Pipe({
    name: 'link'
})
export class LinkPipeMock implements PipeTransform {
    public transform (query: string, ...args: any[]): unknown {
        return query;
    }
}

describe('IbBookingOnHoldAnulationComponent', () => {
    let component: IbBookingOnHoldAnulationComponent;
    let fixture: ComponentFixture<IbBookingOnHoldAnulationComponent>;
    let fakeBookingPageUtilsService: BookingPageUtilsServiceMock;
    let fakeDigitalDataUtilsService: DigitalDataUtilsServiceMock;
    let fakeBookingRedirectionService: BookingRedirectionServiceMock;
    let fakeWindow: WindowTokenMock;
    let fakeRootScope: RootScopeMock;

    beforeEach(async () => {
        fakeBookingPageUtilsService = new BookingPageUtilsServiceMock();
        fakeDigitalDataUtilsService = new DigitalDataUtilsServiceMock();
        fakeBookingRedirectionService = new BookingRedirectionServiceMock();
        fakeWindow = new WindowTokenMock();
        fakeRootScope = new RootScopeMock();

        await TestBed.configureTestingModule({
            declarations: [
                IbBookingOnHoldAnulationComponent,
                LinkPipeMock
            ],
            imports: [
                TranslateModule.forRoot(),
                IbBookingSharedModule
            ],
            providers: [
                { provide: BookingPageUtilsService, useValue: fakeBookingPageUtilsService },
                { provide: DigitalDataUtilsService, useValue: fakeDigitalDataUtilsService },
                { provide: WINDOW_TOKEN, useValue: fakeWindow },
                { provide: BookingRedirectionService, useValue: fakeBookingRedirectionService },
                { provide: AJSRootScope, useValue: fakeRootScope }

            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IbBookingOnHoldAnulationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the Anulation Component', () => {
        expect(component).toBeTruthy();
    });

    it('should call setPageTitle and updateDatalayerInfo on ngOnInit', () => {
        component.ngOnInit();
        expect(fakeBookingPageUtilsService.setPageTitle).toHaveBeenCalledWith(TWITTER_URL);
        expect(fakeDigitalDataUtilsService.setProcessAndStep).toHaveBeenCalledWith(DigitalDataProcess.ONHOLD_CONFIRMATION, DigitalDataSteps.ONHOLD_CONF_CANCEL, BookingAppConstants.QUADRIGAMS.ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION);
    });

    it('should call externalRedirect with correct origin in backToHome', () => {
        component.backToHome();
        expect(fakeBookingRedirectionService.externalRedirect).toHaveBeenCalledWith(ORIGIN);
    });

});
