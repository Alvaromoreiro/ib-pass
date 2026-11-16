import { ViewContainerRef } from '@angular/core';

export class IbBookingAppContainerRefServiceMock {
    appContainerRef = jasmine.createSpy( 'appContainerRef' ).and.callFake( () => <ViewContainerRef> {} );
}
