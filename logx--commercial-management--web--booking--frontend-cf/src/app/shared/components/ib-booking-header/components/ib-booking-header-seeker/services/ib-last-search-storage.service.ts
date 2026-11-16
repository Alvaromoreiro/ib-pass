import { Injectable } from '@angular/core';
import { SeekerStorageSearch, SeekerStorageSearchList } from '@src/app/core/models/ib-booking-availability/header-seeker-model';
import { lastSearchStopoverModel } from '@src/app/core/models/stopover/lastSearchStopover-model';
import { CommonsBrowserStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { isEqual } from 'lodash-es';

@Injectable({
    providedIn: 'root'
})
export class IbLastSearchStorageService {
    private MAX_LENGTH :number;
    constructor (
        private CommonsBrowserStorageService: CommonsBrowserStorageService
    ) {
        this.MAX_LENGTH = 30;
    }

    public getAllStoredSearchs = (isHMad = false): SeekerStorageSearchList => {
        const storedSearchList = isHMad
            ? this.CommonsBrowserStorageService.get('ib-booking.lastSearchsSO')
            : this.CommonsBrowserStorageService.get('ib-booking.lastSearchs');

        return Array.isArray(storedSearchList) ? storedSearchList : [];
    };


    public getStoredSearch = ( index: number ): SeekerStorageSearch => {
        return this.getAllStoredSearchs()[ index ];
    };

    /** Filter searchs list according to a new search if provided
     * @param list : List of search data
     * @param newEntry new search data that will be added to the storage
     * @returns A filtered search data list according to the filter criteria
     */
    private filterSearchList = ( list: SeekerStorageSearchList, newEntry: SeekerStorageSearch = undefined ): SeekerStorageSearchList=> {
        /**@returns true if the element it's not expired or its departureDate it's after today and if the analised element its not equivelent to a given newEntry */
        const filterCriteria = ( element: SeekerStorageSearch ): boolean => {
            const todayTS: number = new Date().getTime();
            const numPasElement = element.adultos + element.niños + element.senior + element.joven + element.bebes;
            const numPasSearch = newEntry.adultos + newEntry.niños + newEntry.senior + newEntry.joven + newEntry.bebes;
            return element.expirationTimestamp >= todayTS
                && new Date( `${ element.fechaIda.year }/${ element.fechaIda.month }/${ element.fechaIda.day }` ).getTime() >= new Date().setHours( 0, 0, 0, 0 )
                && ( element === undefined
                    || !( element.iataOrigen === newEntry.iataOrigen
                        && element.iataDestino === newEntry.iataDestino
                        && isEqual( element.fechaIda, newEntry.fechaIda )
                        && isEqual( element.fechaVuelta, newEntry.fechaVuelta )
                        && numPasElement === numPasSearch )
                );
        };
        return list.filter( filterCriteria );
    };



    public pushSearch = ( search: SeekerStorageSearch): SeekerStorageSearchList=> {
        const lastSearchs: SeekerStorageSearchList= this.getAllStoredSearchs(false);
        const listFiltered: SeekerStorageSearchList= this.filterSearchList( lastSearchs, search );
        search.expirationTimestamp = new Date().setDate( new Date().getDate() + 90 );
        listFiltered.unshift( search );
        if ( listFiltered.length > this.MAX_LENGTH ) {
            listFiltered.pop();
        }

        this.CommonsBrowserStorageService.set( 'ib-booking.lastSearchs', listFiltered );
        return listFiltered;       
    };

    public pushSearchSO = ( search: SeekerStorageSearch, lastSearchSO: lastSearchStopoverModel): SeekerStorageSearchList=> {
        const lastSearchs: SeekerStorageSearchList= this.getAllStoredSearchs(true);
        const listFiltered: SeekerStorageSearchList= this.filterSearchList( lastSearchs, search );
        search.expirationTimestamp = new Date().setDate( new Date().getDate() + 90 );
        listFiltered.unshift( search );
        if ( listFiltered.length > this.MAX_LENGTH ) {
            listFiltered.pop();
        }
      
        const listSOfiltered : any = [];
        let searchSO;
        listFiltered.forEach((element) => {
            searchSO = {
                adultos: element.adultos,
                bebes: element.bebes,
                checkIdaYVuelta: search.fechaVuelta.day.length > 0 ? true : false,
                expirationTimestamp: element.expirationTimestamp,
                fechaIda: element.fechaIda.day + '/' + element.fechaIda.month + '/' + element.fechaIda.year,
                fechaVuelta: element.fechaVuelta.day + '/' + element.fechaVuelta.month + '/' + element.fechaVuelta.year,
                nombreDestino: element.iataDestino,
                nombreOrigen: element.iataOrigen,
                niños: element.niños,
                stopOverIda: lastSearchSO.stopOverIda,
                nights: lastSearchSO.nights,
                locale: lastSearchSO.locale
            };
            listSOfiltered.push(searchSO);
        }),
        this.CommonsBrowserStorageService.set( 'ib-booking.lastSearchsSO', listSOfiltered );
        return listSOfiltered;

    };
}

downgradeToAJSService('IbLastSearchStorageService', IbLastSearchStorageService, 'ib-header-seeker-module', ['ib-commons-modal-service-module', 'ib-commons-http-service-module', 'ib-booking-city-selector-module']);
