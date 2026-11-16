namespace LastSearchStorageModel {
    export type search =  {
        expirationTimestamp?: number,
        iataOrigen:string,
        iataDestino:string,
        fechaIda:{day:string, month:string, year:string},
        fechaVuelta:{day:string, month:string, year: string},
        fechasFlexibles:boolean,
        adultos:number,
        niños:number,
        bebes:number,
        senior:number,
        joven:number,
        tarifa:string,
        residentes:string,
        familia:string,
        pagoAvios:boolean,
        pagoPuntos:boolean,
        youngType:string
    };
    export type list = search[];
}