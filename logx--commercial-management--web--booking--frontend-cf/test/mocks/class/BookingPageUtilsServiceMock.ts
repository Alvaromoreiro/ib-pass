export class BookingPageUtilsServiceMock {
    public setPageTitle = jasmine.createSpy( 'setPageTitle' ).and.callFake( () => '' );
    public getDeviceType = jasmine.createSpy( 'getDeviceType' ).and.returnValue( 'device' );
    getFooterModel = jasmine.createSpy( 'getFooterModel' );
    isUserLogged = jasmine.createSpy( 'isUserLogged' );
}
