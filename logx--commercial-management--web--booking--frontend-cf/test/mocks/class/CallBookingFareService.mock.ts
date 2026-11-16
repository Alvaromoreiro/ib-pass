import { of, throwIfEmpty, lastValueFrom } from 'rxjs';
const responseExample = require('../Responses/FareData-mock.json');

export class CallBookingFareServiceMock {
    public response;

    constructor() {
        this.response = JSON.parse(JSON.stringify(responseExample));
    } 

    public postFareRx = jasmine.createSpy('postFareRx').and.callFake(() => {
        return of({data:this.response}).pipe(throwIfEmpty());
    });

    public postFarePromised = jasmine.createSpy('postFarePromised').and.callFake(() => {
        return lastValueFrom(this.postFareRx());
    });

}