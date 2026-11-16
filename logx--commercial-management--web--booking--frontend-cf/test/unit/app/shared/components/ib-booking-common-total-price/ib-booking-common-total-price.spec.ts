import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { IbBookingCommonTotalPriceComponent } from "@src/app/shared/components/ib-booking-common-total-price/ib-booking-common-total-price.component";
import { TranslatePipeMock } from "test/mocks/pipes/TranslatePipeMock";
import { TranslateServiceMock } from "test/mocks/Services/TranslateServiceAngularMock";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { IbBookingPriceDetailModalService } from "@src/app/shared/services/ib-booking-price-detail-modal/ib-booking-price-detail-modal.service";

class fakeIbBookingPriceDetailModalServiceMock {
    checkShouldShowCTA = jasmine.createSpy('checkShouldShowCTA').and.returnValue(true)
};


describe('IbBookingCommonTotalPriceComponent', () => {
    let component;
    let fixture: ComponentFixture<IbBookingCommonTotalPriceComponent>;
    let translateServiceMock: TranslateServiceMock;
    let fakeCommonsSessionStorageService; let fakeIbBookingPriceDetailModalService;

    beforeEach(async () => {
        translateServiceMock = new TranslateServiceMock();
        fakeCommonsSessionStorageService = new StorageServiceMock();
        fakeIbBookingPriceDetailModalService = new fakeIbBookingPriceDetailModalServiceMock();

        await TestBed.configureTestingModule({
            declarations: [IbBookingCommonTotalPriceComponent, TranslatePipeMock],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: TranslateService, useValue: translateServiceMock },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: IbBookingPriceDetailModalService, useValue: fakeIbBookingPriceDetailModalService }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbBookingCommonTotalPriceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize correctly on ngOnInit', () => {
        spyOn(component, 'setTermsControl');
        spyOn(component, 'onHoldConfiguration');
        spyOn(component, 'setNextButtonText');

        component.ngOnInit();

        expect(component.setTermsControl).toHaveBeenCalled();
        expect(component.onHoldConfiguration).toHaveBeenCalled();
        expect(component.setNextButtonText).toHaveBeenCalled();
    });

    it('should set next button text correctly', () => {
        component.customContinueText = '';
        component.setNextButtonText();
        expect(component.nextButtonText).toBe('AVAILABILITY_BUTTON');
        component.customContinueText = 'CUSTOM_TEXT';
        component.setNextButtonText();
        expect(component.nextButtonText).toBe('CUSTOM_TEXT');
    });

    it('should configure on-hold state correctly', () => {
        component.isOnHold = true;
        component.onHoldConfiguration();
        expect(component.totalPrice).toBe('GENERAL_FREE_LABEL');
        expect(component.nextButtonText).toBe('TOTAL_PRICE_COMPONENT_HOLD_BUTTON');
    });

    it('should set terms control correctly', () => {
        component.setTermsControl();

        expect(component.termsControl).toBeInstanceOf(FormControl);
        expect(component.termsControl.value).toBe(false);
        expect(component.termsControl.validator).toBeTruthy();
    });

    it('should validate terms control correctly', () => {
        component.termsAndConditionsCheck = 'someValue';
        component.setTermsControl();
        component.termsControl.setValue(true);
        expect(component.checkTermsControlValid()).toBe(true);
        component.termsControl.reset();
        expect(component.checkTermsControlValid()).toBe(false);
        component.termsAndConditionsCheck = null;
        expect(component.checkTermsControlValid()).toBe(true);
    });

    it('should emit continue event correctly', () => {
        spyOn(component.continueEvent, 'emit');
        spyOn(component, 'checkTermsControlValid').and.returnValue(true);

        component.onContinueEvent();

        expect(component.continueEvent.emit).toHaveBeenCalled();
    });

    it('should not emit continue event if terms control is invalid', () => {
        spyOn(component.continueEvent, 'emit');
        spyOn(component, 'checkTermsControlValid').and.returnValue(false);

        component.onContinueEvent();

        expect(component.continueEvent.emit).not.toHaveBeenCalled();
    });
    

    it('should change accept terms correctly', () => {
        component.acceptTerms = false;
        component.changeAcceptTerms();
        expect(component.acceptTerms).toBe(true);
        component.changeAcceptTerms();
        expect(component.acceptTerms).toBe(false);
    });


        
});