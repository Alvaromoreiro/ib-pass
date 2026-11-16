import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { AJSRootScope, CommonsSessionStorageService, downgradeToAJSComponent } from "ib-web-commons/utils";
import { IbMmbAviosSummaryService } from "./services/ib-MmB-avios-summary-service";
import { TranslateService } from "@ngx-translate/core";
import { IbCLinkPipe } from "ib-web-commons/pipes";

@Component({
    selector: 'ib-mmb-avios-summary',
    templateUrl: './ib-MmB-avios-summary-view.component.html',
    styleUrls: ['./ib-MmB-avios-summary.component.scss'],
    providers: [IbMmbAviosSummaryService]
})
export class IbMmbAviosSummaryComponent implements OnInit, OnDestroy {
    public request;
    public isUserLogged: boolean;
    public serviceError: boolean = false;
    public isLoading: boolean = true;
    public modelSummary;
    public flowApp: string;
    public actualStep: string;
    public service_error: string;
    public show: boolean = false;
    public urlRegisterLink: string;

    constructor(
        private IbMmbAviosSummaryService: IbMmbAviosSummaryService,
        private localStorageService: CommonsSessionStorageService,
        @Inject(AJSRootScope) public $rootScope: CommonsRootScope,
        private translateService: TranslateService,
        private linkPipe: IbCLinkPipe
    ) {
        this.flightConfirmationEvent();
        this.$rootScope.$on('updateAvios', this.updatedAvios);
        this.urlRegisterLink = this.linkPipe.transform('LOGIN_MODULE_REGISTER_LINK', { withMarket: true, withOrigin: true });
    }

    ngOnInit(): void {
        this.isUserLogged = this.localStorageService.get('userLogged');
        this.request = this.localStorageService.get('flightAviosInfo');
        if (this.request !== null) {
            this.getCalculateAviosSummary();
        } else {
            this.isLoading = false;
            this.serviceError = true;
        }
        this.flowApp = this.localStorageService.get('flowApp');
        this.getMessageServiceError();
    }

    ngOnDestroy(): void {
        this.flightConfirmationEvent();
    }

    flightConfirmationEvent = (): void => {
        this.$rootScope.$on('flightAviosInfo', this.getCalculateAviosSummary);
    }

    getMessageServiceError = (): void => {
        this.actualStep = this.localStorageService.get('actualStepFlow');
        this.service_error = this.translateService.instant('SBE_SERVICE_ERROR_TEXT');
    }

    getCalculateAviosSummary = (): void =>{
        this.isLoading = true;
        this.request = this.localStorageService.get('flightAviosInfo');
        this.IbMmbAviosSummaryService.getCalculateAviosSummary(this.request).then(
            (response) => {
                this.modelSummary = response;
                this.serviceError = false;
                this.isLoading = false;
            },
            (error) => {
                this.serviceError = true;
                this.isLoading = false;
            }
        );
    }

    updatedAvios = (): void => {
        const calculatedPoints: any = this.localStorageService.get('CalculatedPoints');
        this.show = calculatedPoints.Avios !== 0;
    }
}

downgradeToAJSComponent('IbMmbAviosSummary', {
    component: IbMmbAviosSummaryComponent
}, 'ib-mmb-confirmation.module');
