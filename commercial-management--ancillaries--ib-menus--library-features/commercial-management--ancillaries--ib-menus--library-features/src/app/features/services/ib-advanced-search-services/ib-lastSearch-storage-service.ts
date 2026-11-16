import angular from 'angular';

export class LastSearchStorageService {
    private MAX_LENGTH :number;
    constructor (private CommonsBrowserStorageService: CommonsBrowserStorageService ) {
        this.MAX_LENGTH = 30;
    }

    public getAllStoredSearchs = () :LastSearchStorageModel.list => {
        let list :object = this.CommonsBrowserStorageService.getObject('ib-booking.lastSearchs');
        list = angular.equals(list, {})? []:list;
        return (list) as LastSearchStorageModel.list;
    };

    public getStoredSearch = (index: number) :LastSearchStorageModel.search => {
        return this.getAllStoredSearchs()[index];
    };

    /** Filter searchs list according to a new search if provided
     * @param list : List of search data
     * @param newEntry new search data that will be added to the storage
     * @returns A filtered search data list according to the filter criteria
     */
    private filterSearchList = (list: LastSearchStorageModel.list, newEntry : LastSearchStorageModel.search = undefined) : LastSearchStorageModel.list => {
        /**@returns true if the element it's not expired or its departureDate it's after today and if the analised element its not equivelent to a given newEntry */
        const filterCriteria = (element: LastSearchStorageModel.search) :boolean =>{
            const todayTS: number = new Date().getTime();
            const numPasElement = element.adultos + element.niños + element.senior + element.joven +element.bebes;
            const numPasSearch = newEntry.adultos + newEntry.niños + newEntry.senior + newEntry.joven + newEntry.bebes;
            return element.expirationTimestamp >= todayTS
                    && new Date(`${element.fechaIda.year}/${element.fechaIda.month}/${element.fechaIda.day}`).getTime() >= new Date().setHours(0, 0, 0, 0)
                    && (element === undefined
                        || !(element.iataOrigen === newEntry.iataOrigen
                            && element.iataDestino === newEntry.iataDestino
                            && angular.equals(element.fechaIda, newEntry.fechaIda)
                            && angular.equals(element.fechaVuelta, newEntry.fechaVuelta)
                            && numPasElement === numPasSearch)
                    );
        };
        return list.filter(filterCriteria);
    };

    public pushSearch = (search: LastSearchStorageModel.search) : LastSearchStorageModel.list => {
        const lastSearchs: LastSearchStorageModel.list = this.getAllStoredSearchs();
        const listFiltered: LastSearchStorageModel.list = this.filterSearchList(lastSearchs, search);
        search.expirationTimestamp = new Date().setDate(new Date().getDate() + 90);
        listFiltered.unshift(search);
        if (listFiltered.length > this.MAX_LENGTH) {
            listFiltered.pop();
        }
        this.CommonsBrowserStorageService.setObject('ib-booking.lastSearchs', listFiltered);
        return listFiltered;
    };
}
LastSearchStorageService.$inject =  ['CommonsBrowserStorageService'];
try {
    const mod = angular.module('ib-header-advanced-search-module');
    mod.service(
        'LastSearchStorageService',
        LastSearchStorageService
    );
} catch (error) {
    const mod = angular.module('ib-header-advanced-search-module', ['ib-commons-utils-module']);
    mod.service(
        'LastSearchStorageService',
        LastSearchStorageService
    );
}