import { DigitalDataService } from './../../../../../../src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { TestBed } from '@angular/core/testing';
import { DigitalDataServiceMock } from 'test/mocks/class/DigitalDataServiceMock';
import { DigitalDataEventsService } from '../../../../../../src/app/shared/services/ib-datalayer/services/ib-digital-data-events.service';

// @ts-ignore
interface ServiceTest extends DigitalDataEventsService { 
    DigitalDataService: DigitalDataServiceMock
}

describe('DigitalDataEventsService Test', () => {
    let service: ServiceTest;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                DigitalDataEventsService,
                { provide: DigitalDataService, useValue: new DigitalDataServiceMock() },
            ],
        });
        service = TestBed.inject( DigitalDataEventsService ) as unknown as any;
    } );
    
    describe( 'When updateDatalayerEvent is called', () => {
        it( 'It should call getEventObject and emitEvent', () => {
            const { DigitalDataService } = service;
            service.updateDatalayerEvent( '', '', '', '' );
            expect( DigitalDataService.emitEvent ).toHaveBeenCalled()
        } );
    } );
    describe( 'When getEventStepLabel is called', () => {
        it( 'It should return the correct path', () => {
            const result = service.getEventStepLabel( 'availability' );
            expect( result ).toEqual( 'disponibilidad' );
        } );
    } );
});