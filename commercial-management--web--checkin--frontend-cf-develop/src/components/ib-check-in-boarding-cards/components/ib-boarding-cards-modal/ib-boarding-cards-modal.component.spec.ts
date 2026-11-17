import { Component, Pipe } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbBoardingCardsModalComponent } from './ib-boarding-cards-modal.component';
import { IbBoardingCardsModalService } from './services/ib-boarding-cards-modal.service';
import { mockBoardingCardsModelMap, mockDocumentsSegments } from './mocks/ib-boarding-cards-modal.mocks';

@Pipe({
    name: "translate"
})
export class TranslatePipeMock implements PipeTransform {
    public name: string = "translate";

    public transform(query: string, ...args: unknown[]): string {
        return query;
    }
}

@Component({
    selector: 'ib-button',
    template: ''
})
class MockIbButtonComponent {}

@Component({
    selector: 'ib-segment-section',
    template: ''
})
class MockIbSegmentSectionComponent {}

describe('IbBoardingCardsModalComponent', () => {
    let component: IbBoardingCardsModalComponent;
    let fixture: ComponentFixture<IbBoardingCardsModalComponent>;

    let fakeIbBoardingCardsModalService: jasmine.SpyObj<IbBoardingCardsModalService>;

    beforeEach(async () => {
        fakeIbBoardingCardsModalService = jasmine.createSpyObj("IbBoardingCardsModalService", ["closeGoogleWalletModal", "mapSegmentsInformation"]);

        await TestBed.configureTestingModule({
            declarations: [
                IbBoardingCardsModalComponent,
                TranslatePipeMock,
                MockIbButtonComponent,
                MockIbSegmentSectionComponent
            ],
            providers: [
                {
                    provide: IbBoardingCardsModalService,
                    useValue: fakeIbBoardingCardsModalService

                }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbBoardingCardsModalComponent);
        component = fixture.componentInstance;

        component.model = { segments: mockDocumentsSegments };

        fixture.detectChanges();
    });

    describe('component initialize', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should set segmentsMap when execute onInit', () => {
            fakeIbBoardingCardsModalService.mapSegmentsInformation.and.returnValue(mockBoardingCardsModelMap);

            component.ngOnInit();

            expect(component.segmentsMap).toEqual(mockBoardingCardsModelMap);
        });
    });

    describe('closeModal', () => {
        it('expect close modal with dismiss state', () => {
            component.closeModal();

            expect(fakeIbBoardingCardsModalService.closeGoogleWalletModal).toHaveBeenCalledWith('dismiss');
        });
    });
});
