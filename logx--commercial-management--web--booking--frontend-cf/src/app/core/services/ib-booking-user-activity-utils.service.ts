import { Injectable } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IgnoreOrderService } from '../../shared/http-services/sse-orm/ib-booking-ignore-order.service';
import { KeepAliveService } from '../../shared/http-services/sse-avm/ib-keep-alive.service';
import { UserActivityModalComponent } from '@src/app/shared/components/ib-booking-user-activity-modal/ib-booking-user-activity-modal.component';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { KeepAliveConstants } from '../constants/ib-keep-alive-constants';
import { BkiStorageConstants } from '../constants/ib-booking-storage-constants';

@Injectable({providedIn: 'root'})
export class UserActivityUtilsService {
    constructor (
        private IgnoreOrderService: IgnoreOrderService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private KeepAliveService: KeepAliveService,
        private IbCModalService: IbCModalService
    ) { }
    
    public callKeepAliveService = async () => {
        const responseId = this.CommonsSessionStorageService.get( BkiStorageConstants.RESPONSE_ID ) as string;
        const createOrderData: any = this.CommonsSessionStorageService.get( BkiStorageConstants.CREATE_ORDER_DATA );
        const orderId = createOrderData?.order?.orderId ?? null;
        const flowId = createOrderData?.flowId ?? null;
        if (responseId && !createOrderData) {
            return this.KeepAliveService.keepAliveAvm( responseId );
        } else if (orderId || flowId) {
            return this.KeepAliveService.keepAliveOrm( flowId ?? orderId );
        }
    };
    
    public checkOrderToIgnore = (): void => {
        const createOrder: any = this.CommonsSessionStorageService.get( BkiStorageConstants.CREATE_ORDER_DATA );
        const orderId: string = createOrder?.order?.orderId ?? null;
        try{
            if ( orderId ) this.IgnoreOrderService.ignoreOrder( orderId );
        } catch (error) {}
    };
    
    public showSessionModal = () => {
        const modalOptions = {
            modalBlocked: true,
            windowClass: 'ib-modals bki-dialog ib-modals--max-prio'
        };
        const modalRef = this.IbCModalService.showGenericComponentModal( UserActivityModalComponent, modalOptions);
        return modalRef;
    };

    public setKeepAliveNextCall = () => {
        this.CommonsSessionStorageService.set(BkiStorageConstants.NEXT_KEEP_ALIVE_CALL, Date.now() + KeepAliveConstants.DEFAULT_SESSION_TIME);
    };
    public clearKeepAliveNextCall = () => {
        this.CommonsSessionStorageService.remove(BkiStorageConstants.NEXT_KEEP_ALIVE_CALL);
    };

    public getNextKeepAliveCall = (): number => {
        const storedTime = this.CommonsSessionStorageService.get<number>(BkiStorageConstants.NEXT_KEEP_ALIVE_CALL);
        if (!storedTime) {
            return KeepAliveConstants.DEFAULT_SESSION_TIME;   
        }
        return Math.max(storedTime - Date.now(), 0);
    };
}