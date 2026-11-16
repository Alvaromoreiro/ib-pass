import { Injectable, Inject } from '@angular/core';
import { WINDOW_TOKEN } from '../../../../../core/config/ib-booking-app-tokens';
import { BookingHeaderConstants } from '../../ib-booking-header-constants';
import { IbCUserUtilsService } from 'ib-web-commons/utils';

@Injectable({providedIn: 'root'})
export class BookingHeaderGreyBarTransformerService {
    constructor (
        @Inject( WINDOW_TOKEN ) private $window: Window,
        private CommonsUserUtilsService: IbCUserUtilsService
    ) { }

    public initGreyBar ( model ) {
        let greyBarModel = undefined;

        if(model) {
            greyBarModel={
                login: {
                    onLogin: model.onLogin || this.$window.location.reload,
                    afterLogin: model.afterLogin || this.$window.location.reload,
                    onError: model.onError || this.$window.location.reload
                },
                loggedData:{},
                userLogged: model.userLogged,
                isONB: model.userLogged === BookingHeaderConstants.LOGIN_TYPES.ONB
            };

            if(model.loggedData) {
                greyBarModel.isLogged = true;
                greyBarModel.loggedData= this.updateLoggedData(model.loggedData);

            }else{
                greyBarModel.isLogged = false;
            }
            greyBarModel.show = model.show  === true || model.show === false ? model.show : true;
        }

        return greyBarModel;
    }



    public updateLoggedData ( customerData ) {
        let loggedData;
        const isIbZero = this.CommonsUserUtilsService.isIbZero();
        const isSoftUser = this.CommonsUserUtilsService.isSoftUser();
        if( customerData?.personalInfo ) {
            if((customerData?.generalInfo?.avios === 0) && !customerData?.generalInfo?.aviosTransformed) {
                customerData.generalInfo.aviosTransformed = customerData.generalInfo?.avios?.toString();
            }
            loggedData = {
                name: customerData.personalInfo.name || customerData.personalInfo.contactEmail,
                surname:!isSoftUser ? customerData.personalInfo.surname1 : null,
                avios: !isIbZero ? customerData.generalInfo.aviosTransformed : null,
                isLogged: !isSoftUser
            };
        } else {
            loggedData = {
                name: customerData?.userInfo?.firstName,
                surname: !isSoftUser ? customerData?.userInfo?.lastName : null,
                points: customerData?.pointsTransformed,
                isLogged: !isSoftUser 
            };
        }
        return loggedData;
    }
}
