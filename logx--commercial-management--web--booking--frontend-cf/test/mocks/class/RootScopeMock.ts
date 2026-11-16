import { CustomerDataMock } from '../storage/CustomerData-mock';
import { phonesListMock } from '../storage/PhonesList-mock';

export class RootScopeMock {
    newFare = false;
    phonesList = phonesListMock;
    showHeaders = false;
    keepAliveRefreshFlow = false;
    public isMobile = {
        general: false,
        header: false
    };
    public $on = jasmine.createSpy( '$on' );
    public $broadcast = jasmine.createSpy( '$broadcast' );
    public $emit = jasmine.createSpy( '$emit' );
    public customerData = CustomerDataMock;
    public isShuttleFlow = false;
    public routes = {
        icons:'/iberia-web-content/iconos'
    };
    public destinationCity: string | null = 'Bilbao';
}
