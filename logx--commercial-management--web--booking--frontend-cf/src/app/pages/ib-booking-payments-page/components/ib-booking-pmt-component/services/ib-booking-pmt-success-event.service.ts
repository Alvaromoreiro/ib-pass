import { Injectable } from '@angular/core';
import { IbPaymentSuccessService } from '@shared/http-services/sse-orm/ib-payment-succes.service';
import { IncidentItem } from '@core/models/ib-booking-payments/ib-booking-payments-success.model';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

@Injectable({providedIn: 'root'})
export class IbBookingPmtSuccessEventService {

    constructor (
        private IbPaymentSuccessService: IbPaymentSuccessService,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService
    ) { }

    private removePartnerFromCart = () => {
        this.NewMainHeaderFacade.deleteDiscountFromBasket(BookingAppConstants.DISCOUNT_TYPES.PARTNER);
    };

    private INCIDENT_ACTIONS_MAP = {
        'PAY_PAY_8031': this.removePartnerFromCart.bind(this)
    };

    
    public processPaymentSuccessStatus = async ( contextId: string, flowId: string ) => {
        try {
            const paymentSuccessStatus =  await this.IbPaymentSuccessService.postPaymentSuccess({
                contextId, flowId
            });
            if(!paymentSuccessStatus) return null;
            const incidentList = paymentSuccessStatus.incidentList ?? [];
            this.processIncidents(incidentList);
            
        } catch (error) {
            //Error catched to avoid error bubling
            return null;    
        }
    };

    private processIncidents = ( incident: IncidentItem[]) => {
        incident.forEach( incident => {
            const action = this.INCIDENT_ACTIONS_MAP[incident.code];
            action?.(incident);
        } );
    };

}
