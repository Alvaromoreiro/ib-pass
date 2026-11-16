import { Injectable } from '@angular/core';
import { ClearHyphenPipe } from '@src/app/shared/pipes/clear-hyphen.pipe';
import { DigitalDataService } from './ib-digital-data.service';
import { DigitalDataEvents, DigitalDataStepsPaths } from '@src/app/core/constants/ib-digital-data-constants';

export type DigitalDataEventType = {
    eventCategory: string;
    eventAction: string;
    eventLabel: string;
    eventName: string;
};

@Injectable({providedIn: 'root'})
export class DigitalDataEventsService {
    constructor (
        private DigitalDataService: DigitalDataService
    ) { }
    
    public updateDatalayerEvent = ( eventCategory: string, eventAction: string, eventLabel: string, eventName: string ): void => {
        const extendedDigitalDataInfo: DigitalDataEventType = this.getEventObject( eventCategory, eventAction, eventLabel, eventName );
        this.DigitalDataService.emitEvent( DigitalDataEvents.EVENT_NAME_INTERACTION, extendedDigitalDataInfo);
    };
    
    private cleanHyphenPipe = ( input: string ): string => {
        const pipe = new ClearHyphenPipe();
        return pipe.transform( input );
    };
    
    private getEventObject = ( eventCategory: string, eventAction: string, eventLabel: string, eventName: string ) => {
        const object = <DigitalDataEventType> {};
        object[ DigitalDataEvents.EVENT_CATEGORY ] = this.cleanHyphenPipe( eventCategory );
        object[ DigitalDataEvents.EVENT_ACTION ] = this.cleanHyphenPipe( eventAction );
        object[ DigitalDataEvents.EVENT_LABEL ] = this.cleanHyphenPipe( eventLabel );
        object[ DigitalDataEvents.EVENT_NAME ] = this.cleanHyphenPipe( eventName );
        return object;
    };
    
    public getEventStepLabel = ( path: string ): string => DigitalDataStepsPaths[ path ] ?? '';

    
}