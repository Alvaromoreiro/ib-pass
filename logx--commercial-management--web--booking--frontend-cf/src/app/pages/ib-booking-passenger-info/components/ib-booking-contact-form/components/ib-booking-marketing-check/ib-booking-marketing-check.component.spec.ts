import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { IbBookingMarketingCheckComponent } from '@pages/ib-booking-passenger-info/components/ib-booking-contact-form/components/ib-booking-marketing-check/ib-booking-marketing-check.component';
import { IbCUserUtilsService } from 'ib-web-commons/utils';

class MockIbCUserUtilsService {
    isSoftUser = jasmine.createSpy();
    isIbPlus = jasmine.createSpy();
}

describe('IbBookingMarketingCheckComponent', () => {

    let component: IbBookingMarketingCheckComponent;
    let fixture: ComponentFixture<IbBookingMarketingCheckComponent>;
    let mockUserUtils: MockIbCUserUtilsService;
    let form: FormGroup;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [IbBookingMarketingCheckComponent],
            providers: [
                { provide: IbCUserUtilsService, useClass: MockIbCUserUtilsService }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbBookingMarketingCheckComponent);
        component = fixture.componentInstance;
        mockUserUtils = TestBed.inject(IbCUserUtilsService) as any;

        const fb = new FormBuilder();
        form = fb.group({
            isMarketingAccepted: [false]
        });

        component.parentForm = form;
        component.showMarketingPerm = true;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('set denyNewsletter to false when IB Plus hard user', () => {
        mockUserUtils.isIbPlus.and.returnValue(true);
        mockUserUtils.isSoftUser.and.returnValue(false);

        component.ngOnInit();

        expect(component['showDenyNewsletter']).toBeFalse();
    });

    it('set denyNewsletter to true when IB Plus soft user', () => {
        mockUserUtils.isIbPlus.and.returnValue(true);
        mockUserUtils.isSoftUser.and.returnValue(true);

        component.ngOnInit();

        expect(component['showDenyNewsletter']).toBeTrue();
    });

    it('set denyNewsletter to true when non-IB Plus user', () => {
        mockUserUtils.isIbPlus.and.returnValue(false);
        mockUserUtils.isSoftUser.and.returnValue(false);

        component.ngOnInit();

        expect(component['showDenyNewsletter']).toBeTrue();
    });

    it('checkDenyNewsletter should return false only for IB Plus hard user', () => {
        mockUserUtils.isIbPlus.and.returnValue(true);
        mockUserUtils.isSoftUser.and.returnValue(false);

        const result = component.checkDenyNewsletter();

        expect(result).toBeFalse();
    });

    it('should emit marketingClick with form value', () => {
        spyOn(component.marketingClick, 'emit');
        form.get('isMarketingAccepted')?.setValue(true);

        component.onMarketingClick();

        expect(component.marketingClick.emit).toHaveBeenCalledWith(true);
    });

});