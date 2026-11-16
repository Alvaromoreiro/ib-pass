import { CommonsComponentUtils } from '../../utils/ib-commons-component-utils';
import { CommonsHttpServicesConstantsType } from '../../constants/ib-commons-http-service-constants';
import { CommonsUserUtilsService } from '../../utils/ib-commons-user-utils.service';
import {
    getSalesforceUrl,
    getSFClientId
} from '../../utils/ib-salesforce-utils';
import { CommonsModalService } from '../../ib-modal/services/ib-modal-service';


@Component(
    "ib-ui-login-reusable-iframe-component",
    "ibUiLoginReusableIframeComponent",
    {
    bindings: {
    loading: "<",
    flow: "@",
    },
    controllerAs: "ibUiLoginReusableIframeCtrl",
    templateUrl: [
    "$rootScope",
    ($rootScope: CommonsRootScope) => {
    return `${$rootScope.routes.templates}ib-ui-login-reusable-iframe-view.html`;
    },
    ],
    },
    [
    "$document",
    "$timeout",
    "$rootScope",
    "$scope",
    "$window",
    "CommonsComponentUtils",
    "CommonsHttpServicesConstants",
    "CommonsUserUtilsService",
    "localStorageService",
    "CommonsModalService",
    ],
    [],
)
class ibUiLoginReusableIframeController implements ng.IController {
    public isLoading: boolean;
    public afterLogin: typeof Function;
    public onError: typeof Function;
    public loading: typeof Function;
    public iframeType: string;
    public flow: string;
    private counter: boolean;
    private iframeElement: HTMLIFrameElement;


    private get doc (): Document {
        return this.$document[0] as unknown as Document;
    }

    constructor (
        private $document: ng.IDocumentService,
        private $timeout: ng.ITimeoutService,
        private $rootScope: CommonsRootScope,
        private $scope: ng.IScope,
        private $window: ng.IWindowService,
        private CommonsComponentUtils: CommonsComponentUtils,
        private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private localStorageService: ng.local.storage.ILocalStorageService,
        private CommonsModalService: CommonsModalService
    ) {
        this.injectPreconnect();
        this.$window.addEventListener('message', this.iframeSendLocalInfo);
        this.$window.addEventListener('IDENTITY_LOGIN_FAILURE', this.loadIframe);
        this.$scope.$on('$destroy', () => {
            this.$window.removeEventListener('message', this.iframeSendLocalInfo);
            this.$window.removeEventListener(
                'IDENTITY_LOGIN_FAILURE',
                this.loadIframe
            );
        });
    }

    $onInit = (): void => {
        this.loadIframe();
    };

    private injectPreconnect (): void {
        const salesforceOrigin = getSalesforceUrl().replace('/IbIdentity', '');
        const head = this.doc.head;

        if (head.querySelector(`link[href="${salesforceOrigin}"][rel="preconnect"]`)) {
            return;
        }

        const preconnect = this.doc.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = salesforceOrigin;
        preconnect.crossOrigin = 'anonymous';

        const dnsPrefetch = this.doc.createElement('link');
        dnsPrefetch.rel = 'dns-prefetch';
        dnsPrefetch.href = salesforceOrigin;

        head.appendChild(preconnect);
        head.appendChild(dnsPrefetch);
    }

    private iframeSendLocalInfo = (event: MessageEvent): void => {
        if (this.isSalesforceOrigin(event.origin) && typeof event.data === 'string') {
            this.handleSalesforceMessage(event.data);
            return;
        }

    };

    private isSalesforceOrigin (origin: string): boolean {
        const envs = this.CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS;
        const allowedOrigins = [
            envs.PREE.replace('/IbIdentity', ''),
            envs.PREB.replace('/IbIdentity', ''),
            envs.INT_AWS.replace('/IbIdentity', ''),
            envs.PRE_AWS.replace('/IbIdentity', ''),
            envs.PRO_AWS,
            envs.PRO
        ];
        return allowedOrigins.includes(origin);
    }

    private handleSalesforceMessage (data: string): void {
        const prefix = data.split('_')[0];

        if (prefix === 'ibLoginReusableIframeHeight') {
            const iframeReusableLogin = this.doc.getElementById('iframeReusableLoginId') as HTMLIFrameElement;
            iframeReusableLogin.style.height = data.split('_')[1];
            this.CommonsComponentUtils.equalHeight(this.doc.getElementById('check_in_boxes'), false);
        } else if (data === ('ibLoginIframe' + this.iframeType)) {
            this.loading();
        } else if (prefix === 'ibLoginPassangerHeight') {
            this.$window.dispatchEvent(new Event('resize'));
        }

        if (data === 'loginOnRRSS') {
            localStorage.setItem('returnURL', window.location.origin + window.location.pathname + window.location.search + '#!/loading');
        }
    }


    private loginIframeLoaded = () => {
        this.isLoading = false;
        this.CommonsComponentUtils.equalHeight(
            this.doc.getElementById('check_in_boxes'),
            false
        );
    };

    private loadIframe = () => {
        if (this.iframeElement) {
            this.iframeElement.remove();
            if (this.flow === 'BKI_RG') {
                let modalBody: string = 'REST_SERVICE_ERROR_GENERAL';
                const modalObject: CommonsErrorsModel.CommonsErrorsDataGeneral = {
                    message: modalBody,
                    needsTranslate: true
                };
                this.CommonsModalService.showGenericError(modalObject, true, null);
            }
        }

        this.iframeElement = this.doc.createElement('iframe');
        const iframeUri =
            getSalesforceUrl() +
            this.CommonsHttpServicesConstants.SALESFORCE_TOKEN.iframeURI;
        const iframeClientId = getSFClientId();

        this.isLoading = true;
        switch (this.flow) {
                case 'BKI':
                    this.iframeType = '3';
                    break;
                case 'MMB_CKI':
                    this.iframeType = '4';
                    break;
                case 'BKI_RG':
                    this.iframeType = '5';
                    break;
        }
        this.iframeElement.src =
            iframeUri +
            'expid_' +
            this.iframeType +
            this.$rootScope.appMarket +
            this.$rootScope.appLang;
        if (this.CommonsUserUtilsService.isSoftUser()) {
            this.iframeElement.src += '1';
        }
        this.iframeElement.src +=
            '?response_type=code&prompt=login&client_id=' +
            iframeClientId +
            '&redirect_uri=' +
            this.$window.location.origin +
            '/integration/ibplus/login/';
        this.iframeElement.onload = this.loginIframeLoaded;
        this.iframeElement.width = '100%';
        this.iframeElement.id = 'iframeReusableLoginId';
        this.$timeout(() => {
            this.doc
                .getElementById('iframeReusableLogin')
                .appendChild(this.iframeElement);
        });
    };
}
