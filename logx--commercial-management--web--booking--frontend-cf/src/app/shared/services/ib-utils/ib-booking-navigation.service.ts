import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class BookingNavigationService {
    constructor (
        private Router: Router
    ) {}

    get currentURL () {
        return this.Router.url;
    }

    public navigateTo = (path: string, extras?: NavigationExtras ) => {
        const defaultExtras: NavigationExtras = { skipLocationChange: false };
        extras = { ...defaultExtras, ...extras };
        return this.Router.navigate([path], extras);
    };

    public navigateByUrl = (url: string, extras?: NavigationExtras ) => {
        const defaultExtras: NavigationExtras = { skipLocationChange: false };
        extras = { ...defaultExtras, ...extras };
        return  this.Router.navigateByUrl(url, extras);
    };
}