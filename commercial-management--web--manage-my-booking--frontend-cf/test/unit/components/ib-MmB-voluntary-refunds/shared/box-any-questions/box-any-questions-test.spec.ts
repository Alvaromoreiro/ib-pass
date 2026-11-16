import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateServiceMock } from '@test/mocks/services/translate-service-angular-mock';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IbBoxAnyQuestionsComponent } from '@src/components/ib-MmB-voluntary-refunds/shared/box-any-questions/box-any-questions.component';

describe('Component: ibBoxAnyQuestionsComponent', () => {
    let component: IbBoxAnyQuestionsComponent;
    let fixture: ComponentFixture<IbBoxAnyQuestionsComponent>;
    let fakeTranslate: TranslateServiceMock;

    beforeEach(() => {
        fakeTranslate = new TranslateServiceMock();

        TestBed.configureTestingModule({
            imports: [
                TranslateModule,
            ],
            declarations: [IbBoxAnyQuestionsComponent],
            providers: [
                { provide: TranslateService, useValue: fakeTranslate},
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(IbBoxAnyQuestionsComponent);
        component = fixture.componentInstance;
    });

    it('should create the component when init', () => {
        expect(component).toBeTruthy();
    });
});
