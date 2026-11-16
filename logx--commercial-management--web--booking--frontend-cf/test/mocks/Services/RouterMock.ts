export class RouterMock {
    navigate = jasmine.createSpy( 'navigate' );
    routerState = {
        snapshot: {
            url: ''
        }
    };
}
