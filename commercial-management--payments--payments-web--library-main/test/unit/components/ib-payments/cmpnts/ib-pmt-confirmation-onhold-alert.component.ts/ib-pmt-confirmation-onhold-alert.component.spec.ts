import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbPmtConfirmationOnholdAlertComponent } from '../../../../../../src/app/feature/components/ib-pmt-confirmation-onhold-alert/ib-pmt-confirmation-onhold-alert.component';
import { TranslateService } from '@ngx-translate/core';
import { ElementRef } from '@angular/core';

class TranslateServiceMock {
    instant (key: string, params?: object) {
        return `${key}-${JSON.stringify(params)}`;
    }
}

xdescribe('IbPmtConfirmationOnholdAlertComponent', () => {
    let component: IbPmtConfirmationOnholdAlertComponent;
    let fixture: ComponentFixture<IbPmtConfirmationOnholdAlertComponent>;
    let mockTranslateService:TranslateServiceMock;
    let mockElementRef: ElementRef;

    beforeEach(async () => {
        mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
        mockElementRef = new ElementRef(document.createElement('div'));
        mockTranslateService = new TranslateServiceMock();

        await TestBed.configureTestingModule({
            declarations: [IbPmtConfirmationOnholdAlertComponent],
            providers: [
                { provide: TranslateService, useValue: mockTranslateService },
                { provide: ElementRef, useValue: mockElementRef }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbPmtConfirmationOnholdAlertComponent);
        component = fixture.componentInstance;
        const referenceDate = new Date();
        referenceDate.setHours(referenceDate.getHours() + 24);
        component.endOrderTime = {
            hour: referenceDate.getHours(),
            minutes: referenceDate.getMinutes(),
            year: referenceDate.getFullYear(),
            monthNumber: referenceDate.getMonth() + 1,
            day: referenceDate.getDate(),
            formatedDate: `${referenceDate.getDate()}/${referenceDate.getMonth() + 1}/${referenceDate.getFullYear()}`,
            dateTime:'',
            weekDay:'',
            month:'',
            hoursLeft:24
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get the correct title', () => {
        const translated = mockTranslateService.instant('ONHOLD_CONFIRMATION_ALERT_TITLE', {hours: 24});
        const title = component['getTitle']();
        expect(title).toEqual(translated);
    });

    it('should render the component', () => {
        spyOn(component['reactRoot'], 'render');
        component.ngOnInit();
        expect(component['reactRoot'].render).toHaveBeenCalled();
    });

    it('should unmount the component on destroy', () => {
        spyOn(component['reactRoot'], 'unmount');
        component.ngOnDestroy();
        expect(component['reactRoot'].unmount).toHaveBeenCalled();
    });

    it('should broadcast redirectToMMB on CTA action', () => {
        spyOn(component['rootScope'], '$broadcast');
        component['ctaAction']();
        expect(component['rootScope'].$broadcast).toHaveBeenCalledWith('redirectToMMB');
    });
});
