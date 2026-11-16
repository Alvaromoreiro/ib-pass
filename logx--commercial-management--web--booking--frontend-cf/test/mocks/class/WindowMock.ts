export class WindowMock {

    constructor ( private distinctive: string = '' ) { }

    public innerWidth = 1280;
    public outerWidth = 1280;
    public innerHeight = 800;
    public outerHeight = 800;

    public resizeTo = ( width: number, height: number ) => {
        this.outerWidth = width;
        this.outerHeight = height;
        this.innerWidth = width;
        this.innerHeight = height;
    };

    public resize = ( event: Event ) => {
        window.dispatchEvent( event );
    };

    public dispatchEvent = ( event: Event ) => {
        window.dispatchEvent( new Event( `mock${ this.distinctive }-${ event.type }` ) );
    };

    public removeEventListener = ( evName: string = '', callback: ( args ) => {} ) => {
        window.removeEventListener( `mock${ this.distinctive }-${ evName }`, callback );
    };

    public addEventListener = ( evName: string = '', callback: ( args ) => {} ) => {
        window.addEventListener( `mock${ this.distinctive }-${ evName }`, callback );
    };
    public location = {
        protocol: 'http:',
        hostname: 'localhost',
        port: '9876',
        host: 'localhost:9876',
        hash: '#!/availability',
        origin: 'http://localhost:9876',
        pathname: '/',
        search: '?id=79016969',
        href: '',
        reload: jasmine.createSpy('window.location.reload').and.callThrough()
    }
    public document = window.document;
}
