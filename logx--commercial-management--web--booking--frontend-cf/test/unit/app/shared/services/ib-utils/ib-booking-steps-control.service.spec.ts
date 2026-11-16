import { TestBed } from '@angular/core/testing';
import { StepsControlService } from '../../../../../../src/app/shared/services/ib-utils/ib-booking-steps-control.service';
import { IbCModalServiceMock } from 'test/mocks/class/IbCModalServiceMock';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { StepModalControl } from '@src/app/shared/components/ib-booking-steps-control-modal/ib-booking-steps-control-modal.component';

// @ts-ignore
interface ServiceTest extends StepsControlService {
    IbCModalService: IbCModalServiceMock;
}

describe('StepsControlService Test', () => {
    let service: ServiceTest;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                { provide: IbCModalService, useClass: IbCModalServiceMock }
            ],
        });
        service = TestBed.inject(StepsControlService as unknown as any );
    });
    describe( 'When showStepsControlModal is called', () => {
        beforeEach( () => {
            service['modalRef'] = null;
        });

        it( 'It should open the component modal and return the modalRef', () => {
            const model = <StepModalControl> { nextStep: 'availability', currentStep: 'ibairp' };
            const modal = service.showStepsControlModal( model );
            expect( modal.componentInstance.model ).toEqual( model );
        });
        it('When modal already exists, it should return the same modalRef', () => { 
            service['modalRef'] = 'MODAL_REF' as any;
            const modal = service.showStepsControlModal( { nextStep: 'availability', currentStep: 'ibairp' } );
            expect( modal ).toBe( 'MODAL_REF' as any );

        });

    });

    

});