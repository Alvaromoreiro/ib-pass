import { Inject, Injectable } from '@angular/core';
import { WarningsOrder } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { BookingHeaderConstants } from '@src/app/shared/components/ib-booking-header/ib-booking-header-constants';
import { AJSBookingModalService, BookingModalServiceType } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

@Injectable({providedIn: 'root'})
export class IbBookingPassengerOrderWarningsService {
    
    constructor (
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType
        
    ){}
    
    private rules ={
        'SSE_ORM_30003': async (message: string)=>{
            this.NewMainHeaderFacade.deleteDiscountFromBasket(BookingHeaderConstants.DISCOUNT_TYPES.PARTNER);
            return await this.BookingModalService.showGenericError({
                message: message
            },
            true).result.catch(() => {});
            
        }
    };
    
    
    manageWarnings = async ( warnings: WarningsOrder[] ) => {
        if ( warnings?.length ) {
            
            for (const warning of warnings) {
                await this.rules[warning.code]?.(warning.description);
            }
            
        }
        return Promise.resolve();
    };
    
}


downgradeToAJSService('IbBookingPassengerOrderWarningsService', IbBookingPassengerOrderWarningsService, 'ib-booking-passenger-info-module', []);
