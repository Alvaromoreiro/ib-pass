import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { GetPaymentContextError } from '@src/app/core/models/ib-booking-payments/ib-booking-payments-error.model';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { TranslateService } from '@ngx-translate/core';
import { BookingPaymentErrorModalComponent, BookingPaymentErrrorModalModel } from '../../ib-booking-payment-error-modal/ib-booking-payment-error-modal.component';
import { AJSRootScope, CommonsRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbPaymentsIssuesService, GetPaymentsIssues } from '@src/app/shared/http-services/sse-orm/ib-payment-issues.service';

export interface IbBookingPmtContextErrorsServiceArgs {
    continueCallback: () => void,
    onholdFreeCallback: () => any;
    errorMessage: HttpErrorResponse,
}
export interface IbBookingPmtCustomErrorsServiceArgs {
    pmtErrorDescription?: string,
    continueCallback: () => void,
    onholdFreeCallback: () => void,
    pccContinue?: ()=> any,
    pmtIssueRequest: GetPaymentsIssues,

}
interface getButtonConfigArgs {
    btnType: string,
    onholdFreeCallback?: () => any,
    continuePayAction?: () => any,
    continueCallback? : (args?: any) => void 
}



@Injectable()
export class IbBookingPmtErrorsService {
    private titlesMap = { 
        DEFAULT: 'PCC_CARD_ERROR_MODAL_TITLE',
        PMT_REJECTED: 'REJECTED_PAYMENT_MODAL_TITLE',
        PMT_DENIED: 'REJECTED_PAYMENT_MODAL_TITLE'
    };
    private subtitlesMap = { 
        PMT_PCC_WARNING: 'PCC_CARD_ERROR_MODAL_SUBTITLE',
        PMT_REJECTED: 'ERROR_PAYMENT_MODAL_SUBTITLE',
        PMT_DENIED: 'ERROR_PAYMENT_MODAL_SUBTITLE'
    };
    private bodiesMap = {
        DEFAULT: 'REST_SERVICE_ERROR_GENERAL',
        PMT_CTX_RESIDENT_VALIDATION_UNAVAILABLE: 'SARA_VALIDATION_UNAVAILABLE',
        PMT_CTX_RESIDENT_VALIDATION_ERROR: 'SARA_VALIDATION_RETRY'
        //PMT_PCC_WARNING: 'PCC_PAYMENT_WARNING'
        //PMT_REJECTED: 'REJECTED_PAYMENT_WARNING',
        //PMT_DENIED: 'REJECTED_PAYMENT_WARNING'
    };

    constructor (
        private IbCModalService: IbCModalService,
        private TranslateService: TranslateService,
        private IbPaymentsIssuesService: IbPaymentsIssuesService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope
    ) {}


    
    public getButtonConfig = ({btnType, onholdFreeCallback, continuePayAction, continueCallback}: getButtonConfigArgs) :BookingPaymentErrrorModalModel['actionButtons'][0] => {
        let btn :BookingPaymentErrrorModalModel['actionButtons'][0];
        switch(btnType)  {
                case 'PMT_FREE_ONHOLD':
                case 'PMT_CTX_RESIDENT_FREE_ONHOLD':
                    btn = {id: 'PMT_CTX_RESIDENT_FREE_ONHOLD', class:'ib-button--inverse', text: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_3', action: onholdFreeCallback ?? (()=> {}) };
                    break;
                case 'PMT_ACCEPT_WARNING_AND_CONTINUE':
                    btn = {id: 'PMT_ACCEPT_WARNING_AND_CONTINUE', text: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_1', action: continuePayAction ?? (()=> {})};
                    break;
                case 'PMT_CHANGE_PAYMENT_METHOD':
                    btn = {id: 'PMT_CHANGE_PAYMENT_METHOD', text: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_2', action: continueCallback ?? (() => {})};
                    break;
                default: 
                    btn = {id: 'PMT_CTX_EXIT',  text: 'MODAL_BACK_HOME_BUTTON', action: ()=> {
                        this.CommonsSessionStorageService.remove('createOrderData');
                        this.$rootScope.$broadcast('backToMainRoot', true, false);
                    }};

        }
        return btn;
    };
    public handleContextError = ({errorMessage = {} as HttpErrorResponse, onholdFreeCallback, continueCallback}: IbBookingPmtContextErrorsServiceArgs) => {
        let cont = true;
        const error : GetPaymentContextError = errorMessage.error;
        const {status} = errorMessage;
        
        if(status === 409) {
            this.renderErrorModal({error, continueCallback, onholdFreeCallback});
            return;
        }
        cont && continueCallback();
    };

    public handleCustomPaymentsErrors = ({pmtIssueRequest, pmtErrorDescription, continueCallback, onholdFreeCallback, pccContinue}: IbBookingPmtCustomErrorsServiceArgs) => {
        this.IbPaymentsIssuesService.getPaymentIssue(pmtIssueRequest)
            .then((data: GetPaymentContextError) => {
                this.renderErrorModal({error:data, pmtErrorDescription, continueCallback, onholdFreeCallback, continuePayAction: pccContinue});
            })
            .catch((error)=> {
                this.IbCModalService.showGenericModal({body: 'REST_SERVICE_ERROR_GENERAL', accept: this.TranslateService.instant('MODAL_BACK_HOME_BUTTON')}, {modalBlocked: true})
                    .result.finally(()=> {
                        this.CommonsSessionStorageService.remove('createOrderData');
                        this.$rootScope.$broadcast('backToMainRoot', true, false);
                    });
            });
    };


    private getTitlesAndBody = (errorCode: string, pmtErrorDescription?: string)=> {
        return {
            title: this.TranslateService.instant(this.titlesMap[errorCode] ?? this.titlesMap.DEFAULT),
            body: this.TranslateService.instant(this.bodiesMap[errorCode] ?? pmtErrorDescription??this.bodiesMap.DEFAULT),
            subtitle: this.subtitlesMap[errorCode]  ? this.TranslateService.instant(this.subtitlesMap[errorCode]) : '' 
        };
    };


    private renderErrorModal = ({error, pmtErrorDescription, continueCallback, onholdFreeCallback, continuePayAction}: {error: GetPaymentContextError, continueCallback : () => void, pmtErrorDescription?: string, onholdFreeCallback?: ()=> void, continuePayAction?: ()=>any}) => {
        const options = error.options ?? []; 
        if (options.length === 1 && options[0].code  === 'PMT_CTX_REDIRECT'){
            continueCallback();
            return;
        }
        const {title, body, subtitle} =  this.getTitlesAndBody(error.code, pmtErrorDescription);
        let model: BookingPaymentErrrorModalModel = {
            title,
            body,
            subtitle,
            actionButtons: [this.getButtonConfig({btnType:'PMT_CTX_EXIT'})]
        };
        if(options.length>0){
            model.actionButtons = options.map((option)=> {
                return this.getButtonConfig({btnType:option.code, onholdFreeCallback, continueCallback, continuePayAction});
            });
        }
        const modal = this.IbCModalService.showGenericComponentModal( BookingPaymentErrorModalComponent, { modalBlocked: true});
        const componentInstance = modal.componentInstance;
        componentInstance.model = model;
        return true; 
    };

    public displayGenericError = () => {
        this.IbCModalService.showGenericModal({body: 'REST_SERVICE_ERROR_GENERAL', accept: this.TranslateService.instant('MODAL_BACK_HOME_BUTTON')}, {modalBlocked: true})
            .result.finally(()=> {
                this.CommonsSessionStorageService.remove('createOrderData');
                this.$rootScope.$broadcast('backToMainRoot', true, false);
            });
    };



}
