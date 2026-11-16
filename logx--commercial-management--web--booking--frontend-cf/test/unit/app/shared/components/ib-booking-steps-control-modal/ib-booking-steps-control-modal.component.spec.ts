import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepModalControl, StepsControlModalComponent } from '@src/app/shared/components/ib-booking-steps-control-modal/ib-booking-steps-control-modal.component';
import { NgbActiveModalMock } from 'test/mocks/class/NgbActiveModalMock';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipeMock } from 'test/mocks/pipes/TranslatePipeMock';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterPathsConstants as PATH } from '@src/app/core/constants/ib-booking-router-paths-constants';
import { AllowedPathsStep } from '../../../../../../src/app/core/constants/ib-booking-router-paths-constants';
import { DigitalDataEventsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-events.service';
import { DigitalDataEventsServiceMock } from '../../../../../mocks/class/DigitalDataEventsServiceMock';

let componentModel: StepModalControl = {
    currentStep: PATH.ibpurc as AllowedPathsStep,
    nextStep: PATH.availability as AllowedPathsStep
};
// @ts-ignore
interface ComponentTest extends StepsControlModalComponent {
    NgbActiveModal: NgbActiveModalMock,
    DigitalDataEventsService: DigitalDataEventsServiceMock
}

describe('StepsControlModalComponent', () => {
    let component: ComponentTest;
    let fixture: ComponentFixture<StepsControlModalComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ StepsControlModalComponent, TranslatePipeMock ],
            imports: [ CommonModule ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: NgbActiveModal, useClass: NgbActiveModalMock },
                { provide: DigitalDataEventsService, useValue: new DigitalDataEventsServiceMock() }
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(StepsControlModalComponent);
        component = fixture.componentInstance as unknown as ComponentTest;
        component.model = componentModel;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    } );
    describe('When ngOnInit is called', () => {
        it( 'it should initializa with new search with availability', () => {
            component.model = {
                nextStep: PATH.availability as AllowedPathsStep,
                currentStep: PATH.ibairp as AllowedPathsStep
            }
            component.ngOnInit();
            expect( component.newSearch ).toBe( true );
        });
        it( 'it should initializa with new search with shuttle', () => {
            component.model = {
                nextStep: PATH.ibshuttle as AllowedPathsStep,
                currentStep: PATH.ibairp as AllowedPathsStep
            }
            component.ngOnInit();
            expect( component.newSearch ).toBe( true );
        });
    } );
    describe( 'When close is called', () => {
        it( 'It should call NgbActiveModal close method', () => {
            const { NgbActiveModal, DigitalDataEventsService } = component;
            component.close();
            expect( NgbActiveModal.close ).toHaveBeenCalled();
            expect( DigitalDataEventsService.updateDatalayerEvent ).toHaveBeenCalled();
        } );
    } ); 
    describe( 'When dismiss is called', () => {
        it( 'It should call NgbActiveModal dismiss', () => {
            const { NgbActiveModal, DigitalDataEventsService } = component;
            component.dismiss();
            expect( NgbActiveModal.dismiss ).toHaveBeenCalled();
            expect( DigitalDataEventsService.updateDatalayerEvent ).toHaveBeenCalled();
        });
    } );
});