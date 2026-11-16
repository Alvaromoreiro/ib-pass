
export class StepsNavigationServiceMock {
    checkButtonsActivation = jasmine.createSpy( 'checkButtonsActivation' ).and.callFake( () => true );
}