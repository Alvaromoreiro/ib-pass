import { Injectable } from '@angular/core';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IbBookingRegisterFormDataService {

    private nameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private lastNameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private emailSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private passwordSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private checkSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private marketingCheckSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public name$: Observable<string> = this.nameSubject.asObservable();
    public lastName$: Observable<string> = this.lastNameSubject.asObservable();
    public email$: Observable<string> = this.emailSubject.asObservable();
    public password$: Observable<string> = this.passwordSubject.asObservable();
    public check$: Observable<boolean> = this.checkSubject.asObservable();
    public marketingCheck$: Observable<boolean> = this.marketingCheckSubject.asObservable();

    constructor () {}

    setName (value: string): void {
        this.nameSubject.next(value);
    }

    getName (): string {
        return this.nameSubject.getValue();
    }

    setLastName (value: string): void {
        this.lastNameSubject.next(value);
    }

    getLastName (): string {
        return this.lastNameSubject.getValue();
    }

    setEmail (value: string): void {
        this.emailSubject.next(value);
    }

    getEmail (): string {
        return this.emailSubject.getValue();
    }

    setPassword (value: string): void {
        this.passwordSubject.next(value);
    }

    getPassword (): string {
        return this.passwordSubject.getValue();
    }

    setCheck (value: boolean): void {
        this.checkSubject.next(value);
    }

    getCheck (): boolean {
        return this.checkSubject.getValue();
    }

    setMarketingCheck (value: boolean): void {
        this.marketingCheckSubject.next(value);
    }

    getMarketingCheck (): boolean {
        return this.marketingCheckSubject.getValue();
    }

    resetData (): void {
        this.nameSubject.next('');
        this.lastNameSubject.next('');
        this.emailSubject.next('');
        this.passwordSubject.next('');
        this.checkSubject.next(false);
        this.marketingCheckSubject.next(false);
    }
}

downgradeToAJSService('IbBookingRegisterFormDataService', IbBookingRegisterFormDataService, 'ib-booking-passenger-info-module');