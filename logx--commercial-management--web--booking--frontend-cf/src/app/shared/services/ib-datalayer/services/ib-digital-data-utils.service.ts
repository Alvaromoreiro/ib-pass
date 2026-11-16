import { Injectable } from '@angular/core';
import { DigitalDataService } from './ib-digital-data.service';
import { DatalayerConstants } from '../constants/ib-datalayer-constants';
import { CommonsSessionStorageService, downgradeToAJSService, IbCTokenUtilsService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { DigitalDataConstants, DigitalDataValues } from '@src/app/core/constants/ib-digital-data-constants';
import { DigitalDataViewCounterService } from './ib-digital-data-view-counter.service';
import { DatalayerBKIConstants } from '../constants/ib-datalayer-bki-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { PaymentsInfoType } from '@src/app/core/models/ib-booking-payments/ib-booking-payments-model';

export type DigitalDataQuadrigramUpdate={
    mustUpdateView: boolean;
};
@Injectable({providedIn: 'root'})
export class DigitalDataUtilsService {
    public LANG: string;
    public MARKET: string;
    constructor (
        private DigitalDataService: DigitalDataService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbCUserUtilsService: IbCUserUtilsService,
        private IbCTokenUtilsService: IbCTokenUtilsService,
        private DigitalDataViewCounterService: DigitalDataViewCounterService
    ) {}

    setInitialProperties = () => {
        const digital_data: any = this.DigitalDataService.getDigitalData() || {};
        this.LANG = digital_data?.Language || '';
        this.MARKET = digital_data?.Market || '';

    };

    getProcess = (): string => {
        return this.DigitalDataService.getDigitalDataProcess();
    };

    /**
     * set the current Digital Data Process
     */
    setProcessAndStep = ( process: string, step: string, quadrigam?: string ): void => {
        if ( !process || !step ) return;
        const extendedDigitalDataInfo = {};
        const stepLocal: string = ( DatalayerConstants.DATALAYER_ANCILLARIES_STEPS[ quadrigam ] ) ? DatalayerConstants.DATALAYER_ANCILLARIES_STEPS[ quadrigam ] : step;
        const processLocal: string =  process;
        if ( quadrigam ) {
            extendedDigitalDataInfo[ DigitalDataConstants.QUADRIGAM ] = quadrigam;
        }
        extendedDigitalDataInfo[ DigitalDataConstants.PROCESS ] = processLocal;
        extendedDigitalDataInfo[ DigitalDataConstants.STEP ] = stepLocal;
        this.DigitalDataService.addDigitalDataInfo( extendedDigitalDataInfo );
    };

    emitViewEvent = (): void => {
        this.DigitalDataService.emitViewEvent();
    };

    generateConfirmationDigitalDataObject = (): void => {
        const paymentsInfo: PaymentsInfoType = this.CommonsSessionStorageService.get(BkiStorageConstants.PAYMENTS_INFO);
        const appliedDiscountsTypes =paymentsInfo.appliedDiscounts.status===true;
        
        const quadrigamToStep = {
            OHBKCF: DatalayerConstants.DATALAYER_VIEWS.ONHOLD_CONFIRMATION,
            ONHOLD: DatalayerConstants.DATALAYER_VIEWS.ONHOLD_PAYMENT
        };
        
        const confirmationDigitalInfo: object = this.CommonsSessionStorageService.get(BkiStorageConstants.CONFIRM_DIGITALDATA_INFO) || {};
        const pmtModel: any = this.CommonsSessionStorageService.get(BkiStorageConstants.PMT_MODEL_INFO);
        confirmationDigitalInfo[DigitalDataConstants.STEP] = quadrigamToStep[confirmationDigitalInfo[DigitalDataConstants.QUADRIGAM]] || DatalayerConstants.DATALAYER_VIEWS.CONFIRMATION;
        this.DigitalDataService.removeDigitalDataInfo([DatalayerBKIConstants.CASH_AVIOS_OFFER, DigitalDataConstants.VOUCHER_SHOWN]);
        delete confirmationDigitalInfo[DatalayerBKIConstants.CASH_AVIOS_OFFER];
        delete confirmationDigitalInfo[DigitalDataConstants.VOUCHER_SHOWN]; 
        
        const discountsApplied = Object.keys(paymentsInfo.appliedDiscounts.types||{});
        const aviosApplied =  ['AVIOS', 'AVIOS_REDEMPTION'].some(type => discountsApplied.includes(type)) || paymentsInfo.fullAvios;
        confirmationDigitalInfo[DigitalDataConstants.CASH_AVIOS_USED] = aviosApplied ? DigitalDataValues.YES_LOWERCASE : DigitalDataValues.NO_LOWERCASE;
        confirmationDigitalInfo[DigitalDataConstants.VOUCHER_USED] =  discountsApplied.includes('VOUCHER') ? DigitalDataValues.YES_LOWERCASE : DigitalDataValues.NO_LOWERCASE;
        confirmationDigitalInfo[DatalayerBKIConstants.VOUCHER_RECORD] = confirmationDigitalInfo[DigitalDataConstants.VOUCHER_USED] === DigitalDataValues.YES_LOWERCASE ? this.CommonsSessionStorageService.get('PNR') : '';
        this.updateDigitalDataWithQuadrigam(pmtModel.quadrigams.confirmation, confirmationDigitalInfo);
    };
        
    
    updateDigitalDataWithQuadrigam = ( quadrigam: string, extendedObject: any  ): void => {
        this.setInitialProperties();
        const extendDatalayer = {};

        if ( typeof quadrigam === 'string' ) {
            extendDatalayer[ DigitalDataConstants.QUADRIGAM ] = quadrigam.replace( /\//g, '' );
            extendDatalayer[ DigitalDataConstants.CODE ] = this.LANG + '/' + this.MARKET + '/' + quadrigam.replace( /\//g, '' );

            const NView = this.DigitalDataViewCounterService.increment(quadrigam);
            extendDatalayer[ DigitalDataConstants.NVIEW ] = NView;
        }
        this.updateDigitalData(extendDatalayer, extendedObject);
    };
    
    updateDigitalData = (  newDigitalData: object, digitalDataModel: any= {} ): void => {
        if ( typeof digitalDataModel !== 'object' || digitalDataModel === null ) {
            digitalDataModel = {};
        }
        if ( typeof digitalDataModel === 'object' && digitalDataModel?.eventCategory !== 'ancillaries' ) {
            Object.assign( digitalDataModel, newDigitalData );
        }
        digitalDataModel[ DigitalDataConstants.USER_STATE ] = this.getUserState();
        this.DigitalDataService.addDigitalDataInfo( digitalDataModel );
    };
    
    discountsToString = (
        acc: string,
        current: discountAppliedResponse
    ): string => {
        let discString = current?.type ?? '';
        
        switch (current.type) {
                case BookingAppConstants.DISCOUNT_TYPES.CORPORATE:
                    if (current.discountType === 'ODM') {
                        discString += `_${current.discountType}`;
                    }
                    discString += `_${current.corporateCodes}`;
                    break;

                case BookingAppConstants.DISCOUNT_TYPES.RESIDENT:
                    discString += `_${current.discountCode}`;
                    break;

                case BookingAppConstants.DISCOUNT_TYPES.LARGE_FAMILY:
                    discString += `_${current.discountType}`;
                    break;

                case BookingAppConstants.DISCOUNT_TYPES.PARTNER:
                    discString += `_${current.partner.partnerId}`;
                    break;

                default:
                    break;
        }

        return acc += acc.length === 0 ? discString : `|${discString}`;
    };

    updateDiscountData = (discountArray: discountAppliedResponse[] = []): void => {
        const extendedDigitalDataInfo = { DiscountsApplied: '' };

        if (Array.isArray(discountArray)) {
            const discountStr: string = discountArray.reduce(this.discountsToString, '');
            extendedDigitalDataInfo.DiscountsApplied = discountStr;
            this.DigitalDataService.addDigitalDataInfo(extendedDigitalDataInfo);
        }
    };
    updatePreviousPageQuadrigam = ( ): void => {
        const digital_data: any = this.DigitalDataService.getDigitalData();
        let quadrigamToSet = digital_data?.[ DigitalDataConstants.QUADRIGAM ]?? '';
        this.DigitalDataService.addDigitalDataInfo( {
            [ DigitalDataConstants.PREVIOUS_PAGE ]: quadrigamToSet
        } );
    };

    private getUserState = (): string => {
        if ( !this.IbCUserUtilsService.isUserLogged() ) return DatalayerConstants.DATALAYER_USER_STATES.ANONYMOUS;
        const userLogged: boolean |null = this.CommonsSessionStorageService.get( BkiStorageConstants.USER_LOGGED );
        const logged: CommonsDatalayerServiceTypes.LoggedDatalayer | null = this.CommonsSessionStorageService.get( BkiStorageConstants.USER_STATE);
        return this.updateUserStateBasedOnLoggedInfo( this.getUserRoleState(), logged, userLogged );
    };

    private getUserRoleState = (): string => {
        if ( !this.IbCUserUtilsService.getUserRole() ) {
            this.IbCTokenUtilsService.getUserTypeFromToken();
        }
        return this.IbCUserUtilsService.isIbPlus()
            ? ( this.IbCUserUtilsService.isSoftUser() ? DatalayerConstants.DATALAYER_USER_STATES.LOGGED_FF_SOFT : DatalayerConstants.DATALAYER_USER_STATES.LOGGED_FF_HARD )
            : ( this.IbCUserUtilsService.isSoftUser() ? DatalayerConstants.DATALAYER_USER_STATES.LOGGED_IB_SOFT : DatalayerConstants.DATALAYER_USER_STATES.LOGGED_IB_HARD );
    };

    private updateUserStateBasedOnLoggedInfo = ( userState: string, logged: CommonsDatalayerServiceTypes.LoggedDatalayer | null, userLogged: any ): string => {
        if ( logged && logged.loggedBy ) {
            return ( logged.loggedBy === 'email' ) ? DatalayerConstants.DATALAYER_USER_STATES.LOGGED_MAIL : userState;
        } else {
            return ( userLogged === BookingAppConstants.LOGIN_ONB ) ? DatalayerConstants.DATALAYER_USER_STATES.LOGGED_ONB : userState;
        }
    };
    
    
}
downgradeToAJSService('DigitalDataUtilsService', DigitalDataUtilsService, 'ib-datalayer-bki-module');
