import { CallPriceMatrixService } from '@src/app/shared/http-services/sse-avm/ib-call-booking-price-matrix-service.service';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { PriceMatrixTransformer } from '../transformers/price-matrix-transformer.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PriceMatrixService {
    
    constructor (
        private PriceMatrixTransformer: PriceMatrixTransformer,
        private CallPriceMatrixService: CallPriceMatrixService
    ) { }
    
    public getPriceMatrix = async (): Promise<unknown> => {
        const requestData = this.PriceMatrixTransformer.generateRequestData();

        const data = await this.CallPriceMatrixService.getPriceMatrixPromised(requestData, false);

        return this.PriceMatrixTransformer.transformGetPriceMatrixData(data);
    };
    
}
downgradeToAJSService( 'BookingPriceMatrixService', PriceMatrixService, 'ib-booking-price-matrix-module' );