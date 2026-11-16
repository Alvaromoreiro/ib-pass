import { CustomerDataMock } from '../storage/CustomerData-mock';
import { phonesListMock } from '../storage/PhonesList-mock';

export class RootScopeMock {
    newFare = false;
    phonesList = phonesListMock;
    showHeaders = false;
    public isMobile = {
        general: false,
        header: false
    };
    public $on = jasmine.createSpy( '$on' );
    public $broadcast = jasmine.createSpy( '$broadcast' );
    public customerData = CustomerDataMock;
}
