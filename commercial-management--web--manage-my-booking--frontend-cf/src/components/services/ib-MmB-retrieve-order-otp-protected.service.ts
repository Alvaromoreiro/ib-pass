import { downgradeToAJSService} from "ib-web-commons/utils";
import { Injectable } from '@angular/core';
import { IbMmbRetrieveOrderService } from "./ib-MmB-retrieve-order.service";
import { OtpModalModel } from "@src/app/core/models/ib-lotus-otp-models";
import { IbLotusOtpModalService } from "@src/app/shared/components/ib-lotus-otp-modal/ib-lotus-otp-modal.service";
import { MmBAppConstants } from "@src/ib-MmB-constants";
import { MmbCommonsErrorsResponseGeneral } from "@src/app/core/models/general-errors-model";


@Injectable({
    providedIn: 'root'
})
export class IbMmbRetrieveOrderOtpProtectedService {
    constructor(
        private IbLotusOtpModalService: IbLotusOtpModalService,
        private IbMmbRetrieveOrderService: IbMmbRetrieveOrderService,

    ) {

    }

    public generateOtpModel = (locator: string, surname: string, error: MmbCommonsErrorsResponseGeneral ) => {
        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + MmBAppConstants.TIMEOUT_OTP_LOTUS);
        const viewModel: OtpModalModel = {
            pnr: locator,
            surname: surname,
            flowId: error?.flowId,
            email: error?.otp?.email,
            sessionExpiration: expirationDate.toISOString(),
            sessionId: error?.otp?.sessionToken,
            sessionRequested: currentDate.toISOString(), 
        };
        return viewModel;
    }
    
    retrieveOrder = (surname: string, locator: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.IbMmbRetrieveOrderService.retrieveOrderPostPromised(surname, locator).then((data) => {
                resolve(data);
            }, (error: MmbCommonsErrorsResponseGeneral) => {
                // error.errorCode === 403 && error.internalErrorCode === 'SSE_ORM_6969'
                if (error.errorCode === 403 && error.internalErrorCode === 'SSE_ORM_6969') {
                   
                    this.IbLotusOtpModalService.showOTPModal(this.generateOtpModel(locator, surname, error))
                    .then((state) => {
                        resolve(state?.data);
                    }, (state) => {
                        if(!state?.errorData) {
                            reject({
                                errorCode: 0,
                                internalErrorCode: 'OTP_MODAL_CLOSED_BY_USER'
                            });
                            return
                        }
                        reject(state.errorData);

                    });
                } else {
                    reject(error);
                }
            });
        });
    }



};

downgradeToAJSService('IbMmbRetrieveOrderOtpProtectedService', IbMmbRetrieveOrderOtpProtectedService, 'ib-MmB-services-module');
