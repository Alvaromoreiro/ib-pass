import { Injectable } from '@angular/core';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { PrefixData } from '@src/app/core/models/ib-booking-passenger-info/components/ib-booking-contact-form-model';

@Injectable({
    providedIn: 'root'
})
export class IbBookingContactFormDataService {

    private emailSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private prefixSubject: BehaviorSubject<PrefixData> = new BehaviorSubject<PrefixData>({code:'', countryCode:'', description: ''});
    private phoneSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private denyNewsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
    public email$: Observable<string> = this.emailSubject.asObservable();
    public prefix$: Observable<PrefixData> = this.prefixSubject.asObservable();
    public phone$: Observable<string> = this.phoneSubject.asObservable();
    public denyNews$: Observable<boolean> = this.denyNewsSubject.asObservable();
  
    constructor () {}
  
    setEmail (value: string): void {
        this.emailSubject.next(value);
    }
  
    getEmail (): string {
        return this.emailSubject.getValue();
    }
  
    setPrefix (value: PrefixData): void {
        this.prefixSubject.next(value);
    }
  
    getPrefix (): PrefixData {
        return this.prefixSubject.getValue();
    }

    setPhone (value: string): void {
        this.phoneSubject.next(value);
    }
  
    getPhone (): string {
        return this.phoneSubject.getValue();
    }
    
    setDenyNews (value: boolean): void {
        this.denyNewsSubject.next(value);
    }

    getDenyNews (): boolean {
        return this.denyNewsSubject.getValue();
    }

    resetData ():void {
        this.emailSubject.next('');
        this.prefixSubject.next({code:'', countryCode:'', description: ''});
        this.phoneSubject.next('');
        this.denyNewsSubject.next(false);
    }

}

downgradeToAJSService('IbBookingContactFormDataService', IbBookingContactFormDataService, 'ib-booking-passenger-info-module');
