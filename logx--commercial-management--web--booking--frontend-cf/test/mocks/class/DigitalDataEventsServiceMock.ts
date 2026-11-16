export class DigitalDataEventsServiceMock {
    sendDigitalDataStepEvent = jasmine.createSpy( 'sendDigitalDataStepEvent' );
    getEventObject = jasmine.createSpy( 'getEventObject' );
    updateDatalayerEvent = jasmine.createSpy( 'updateDatalayerEvent' );
    getEventStepLabel = jasmine.createSpy( 'getEventStepLabel' ).and.returnValue('');
}