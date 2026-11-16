import { TestBed, ComponentFixture } from '@angular/core/testing';
import { IbOnbNotAvailabilityComponent } from '@src/app/pages/ib-onb-not-availability/ib-onb-not-availability.component';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateServiceMock } from 'test/mocks/Services/TranslateServiceAngularMock';
import { TranslatePipeMock } from 'test/mocks/pipes/TranslatePipeMock';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AJSDatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { DigitalDataServiceMock } from 'test/mocks/class/DigitalDataServiceMock';
import { DigitalDataUtilsServiceMock } from 'test/mocks/class/DigitalDataUtilsServiceMock';


let fakeTranslateService;
let fakeDigitalDataUtilsService: DigitalDataUtilsServiceMock;
let fakeDigitalDataService: DigitalDataServiceMock;

class BookingRedirectionServiceMock {
    externalRedirect= jasmine.createSpy();
}
class fakeDatalayerUtilsServiceMock {
    updateDigitalDataWithQuadrigam= jasmine.createSpy();
    setProcessAndStep= jasmine.createSpy();
    updateDatalayerViewEvent= jasmine.createSpy();
}
describe('IbOnbNotAvailabilityComponent', () => {
    let component: IbOnbNotAvailabilityComponent;
    let fixture: ComponentFixture<IbOnbNotAvailabilityComponent>;
    fakeTranslateService = new TranslateServiceMock();
    let fakeSessionStorage: StorageServiceMock;
    let fakeBookingRedirectionService: BookingRedirectionServiceMock;
    let fakeDatalayerUtilsService : fakeDatalayerUtilsServiceMock;
    beforeEach(() => {
        fakeSessionStorage = new StorageServiceMock();
        fakeBookingRedirectionService = new BookingRedirectionServiceMock();
        fakeDatalayerUtilsService = new fakeDatalayerUtilsServiceMock();
        TestBed.configureTestingModule({
            declarations: [IbOnbNotAvailabilityComponent, TranslatePipeMock],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: CommonsSessionStorageService, useValue: fakeSessionStorage },
                { provide: TranslateService, useValue: fakeTranslateService },
                { provide: BookingRedirectionService, useValue: fakeBookingRedirectionService},
                { provide: AJSDatalayerUtilsService, useValue: fakeDatalayerUtilsService},
                { provide: AJSRootScope, useValue: {} },
                { provide: DigitalDataService, useValue: fakeDigitalDataService },
                { provide: DigitalDataUtilsService, useValue: fakeDigitalDataUtilsService }
            ],
            schemas: [NO_ERRORS_SCHEMA] 
        }).compileComponents();

        fixture = TestBed.createComponent(IbOnbNotAvailabilityComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should redirect to redemption search engine page', () => {
        const params = {
            Language: 'es',
            Market: 'ES',
            VersionWeb: 'angularjs',
            ModeWeb: 'tablet',
            Quadrigam: 'IBBKERROR',
            TrackingCode: 'es/ES/IBBKERROR',
            UserStatus: 'no_logado',
            Process: 'booking',
            Step: 'error'
        };
  
        spyOn(component['CommonsSessionStorageService'], 'get').and.returnValue(params); 
        component.goRedemptionSearchEnginePage();
  
        expect(component['CommonsSessionStorageService'].get).toHaveBeenCalledWith('confirmationDigitalInfo');
    });
  

    it('should redirect to home page', () => {
    
        component.goHomePage();

        expect(component['BookingRedirectionService'].externalRedirect).toHaveBeenCalledWith(window.location.origin);
    });
});
