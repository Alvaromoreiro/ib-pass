export type lastSearchStopoverModel = {
    adultos?: number;
    bebes?: number;
    checkIdaYVuelta: boolean
    expirationTimestamp: number;
    fechaIda: string;
    fechaVuelta: string;
    iataOrigen: string;
    iataDestino: string;
    locale: string;
    nights: number;
    niños: number;
    nombreDestino: string;
    nombreOrigen: string;
    pasajeros: string;
    stopOverIda: boolean;
};
export type lastSearchStopoverListModel = lastSearchStopoverModel[];