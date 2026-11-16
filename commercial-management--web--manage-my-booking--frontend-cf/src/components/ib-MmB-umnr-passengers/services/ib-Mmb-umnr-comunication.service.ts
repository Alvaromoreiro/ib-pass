import { Injectable } from '@angular/core';
import { downgradeToAJSService } from "ib-web-commons/utils";
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class IbMmbUmnrComunicationService  {
    private initialData = new BehaviorSubject<object>({});
    actualData = this.initialData.asObservable();

    sendData(data: object) {
        this.initialData.next(data);
    };
}

downgradeToAJSService('IbMmbUmnrUtilsService', IbMmbUmnrComunicationService, 'ib-mmb-umnr-passengers-module')