export class IgnoreOrderServiceMock {
    public response = Promise.resolve();
    ignoreOrder = jasmine.createSpy( 'ignoreOrder' ).and.callFake( () => this.response );
}