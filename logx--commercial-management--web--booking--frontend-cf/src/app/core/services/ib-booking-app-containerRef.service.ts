import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable({ providedIn: 'root'})
export class IbBookingAppContainerRefService {
    private ref;
    
    set appContainerRef (ref: ViewContainerRef) {
        this.ref = ref;
    }
    get appContainerRef (){
        return this.ref;
    }
}