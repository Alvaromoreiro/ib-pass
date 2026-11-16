import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class PassengerFormUtilsService {
    constructor () {}
    
    
    public getPreselectedFieldValue = (passengerInfo, fieldKey: string, code: string) => {
        const allValues = passengerInfo?.requiredFields[fieldKey]?.values || [];
        return allValues.find(item => item.code === code);
    };
}