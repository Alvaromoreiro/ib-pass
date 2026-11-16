import { Pipe, PipeTransform } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { FlowApp } from '../../../app/core/models/ib-flowapp-model';

type City = {
    code: string;
    description: string;
};

type Segment = {
    departure: {
        city: City;
    };
    arrival: {
        city: City;
    };
};

type Slice = {
    sliceId: string;
    segments: Segment[];
};

@Pipe({
    name: 'originDestination'
})
export class OriginDestinationPipe implements PipeTransform {

    constructor (
        private commonsSessionStorageService: CommonsSessionStorageService
    ) {}

    /**
    * Busca un slice por ID y retorna la ruta de origen-destino formateada.
    * @param value Array de objetos FlightSlice.
    * @param sliceId El ID del slice que se desea buscar (ej: 'MADBIO20251111114500').
    * @param _short opcional para obtener la ruta versión corta MAD - BIO.
    * @returns La ruta formateada (ej: 'Madrid (MAD) - Bilbao (BIO)').
    */
    transform (sliceId: string | null | undefined, _short?: boolean): string {

        const sliceEncontrado: Slice = this.getSlicesByFlow(sliceId);

        // Si no encuentra el slice, devuelve el mismo string que llega como argumento
        if (!sliceEncontrado) {
            return sliceId;
        }

        const segments: Segment[] = sliceEncontrado.segments;

        if (!segments || segments.length === 0) {
            return 'no segments found';
        }

        const primerSegmento: Segment = segments[0];
        const ciudadOrigen: City = primerSegmento.departure.city;

        const ultimoSegmento: Segment = segments[segments.length - 1];
        const ciudadDestino: City = ultimoSegmento.arrival.city;

        const origenFormateado = _short ? ciudadOrigen.code : `${ciudadOrigen.description} (${ciudadOrigen.code})`;

        const destinoFormateado = _short ? ciudadDestino.code : `${ciudadDestino.description} (${ciudadDestino.code})`;

        return `${origenFormateado} - ${destinoFormateado}`;
    }

    private noValidSlice (slices: Slice[], sliceId: string): boolean {
        return !slices || slices.length === 0 || !sliceId;
    }

    private getSlicesByFlow (sliceId: string | null | undefined): Slice {
        const flowApp = this.commonsSessionStorageService.get('flowApp');
        switch (flowApp) {
                case FlowApp.MMB:
                case FlowApp.MMBANC:
                    return this.getSlicesMMB(sliceId);
                case FlowApp.BBOOKING:
                case FlowApp.BOOKING:
                    return this.getSlicesBKI(sliceId);
                case FlowApp.CHECKIN:
                default:
                    return null;
        }
    }

    private getSlicesMMB (sliceId: string | null | undefined, _short?: boolean): Slice {
        const slices = ((this.commonsSessionStorageService.get('bookingInfo') as any).order.slices) as Slice[];

        if (this.noValidSlice(slices, sliceId)) {
            return null;
        }

        const sliceEncontrado: Slice = slices.find(
            (slice: Slice) => slice.sliceId === sliceId
        );

        return sliceEncontrado;
    }

    private getSlicesBKI (sliceId: string | null | undefined, _short?: boolean): Slice {
        const slices = ((this.commonsSessionStorageService.get('createOrderData') as any).order.slices) as Slice[];

        if (this.noValidSlice(slices, sliceId)) {
            return null;
        }

        const sliceEncontrado: Slice = slices.find(
            (slice: Slice) => slice.sliceId === sliceId
        );

        return sliceEncontrado;
    }
}
