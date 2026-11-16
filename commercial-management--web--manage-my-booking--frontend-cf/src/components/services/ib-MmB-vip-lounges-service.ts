import { MMBDatalayerConstants } from "./ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

@Service(
    'ib-MmB-services-module', [
        'CommonsGenericProxy',
        'MmBAppConstants',
        'MmBDatalayerUtilsService'
    ], [])
export class VipLoungesService {
    private readonly EXCLUSIVE_SERVICE_LAUNCHER_URL = `${this.MmBAppConstants.cloudServiceCustomerExperience}/viplounges/wc/customer--customer-experience--exclusive-benefits-launcher.es.js`;
    private readonly VIP_LOUNGES_CARD_URL = `${this.MmBAppConstants.cloudServiceCustomerExperience}/viplounges/wc/customer--customer-experience--vip-lounge-card.es.js`;
    private readonly FAST_TRACK_CARD_URL = `${this.MmBAppConstants.cloudServiceCustomerExperience}/viplounges/wc/customer--customer-experience--fast-track-card.es.js`;

    private dynamicImporter = (url: string) => import(/* webpackIgnore: true */ url);
    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: MmBAppConstants,
        private MmBDatalayerUtilsService
    ) {}

    getVipLounges = (flowId: string, frequentFlyer) => {
        return new Promise((resolve, reject) => {
            const endpoint = this.MmBAppConstants.DEFAULT_ENDPOINTS.vipLoungesURI;
            this.CommonsGenericProxy.postGeneric(endpoint, {'flowId': flowId, 'frequentFlyer': frequentFlyer}).then(
                (response) => {
                    resolve(response.data);
                },
                () => {
                    reject();
                });
        });
    };

    public getFastTrackCardComponent = async (): Promise<boolean> => {
        try {
            await this.dynamicImporter(this.FAST_TRACK_CARD_URL);
            this.MmBDatalayerUtilsService.updateDatalayerEvents(
                MMBDatalayerConstants.EXCLUSIVE_SERVICES_EVENT_CATEGORY_VALUES.EXCLUSIVE_SERVICES,
                MMBDatalayerConstants.DATALAYER_EVENT_TYPES.IMPRESSIONS,
                MMBDatalayerConstants.EXCLUSIVE_SERVICES_EVENT_LABEL_VALUES.FAST_TRACK_CARD,
                MMBDatalayerConstants.DatalayerGeneralConstants.EVENT_NAME_INTERACTION
            );
            return true;
        } catch (error) {
            return false;
        }
    };

    public getExclusiveServicesLauncherComponent = async (): Promise<boolean> => {
        try {
            await this.dynamicImporter(this.EXCLUSIVE_SERVICE_LAUNCHER_URL);
            this.MmBDatalayerUtilsService.updateDatalayerEvents(
                MMBDatalayerConstants.EXCLUSIVE_SERVICES_EVENT_CATEGORY_VALUES.EXCLUSIVE_SERVICES,
                MMBDatalayerConstants.DATALAYER_EVENT_TYPES.IMPRESSIONS,
                MMBDatalayerConstants.EXCLUSIVE_SERVICES_EVENT_LABEL_VALUES.BENEFITS_SECTION,
                MMBDatalayerConstants.DatalayerGeneralConstants.EVENT_NAME_INTERACTION
            );
            return true;
        } catch (error) {
            return false;
        }
    };

    public getVipInvitationsComponent = async (): Promise<boolean> => {
        try {
            await this.dynamicImporter(this.VIP_LOUNGES_CARD_URL);
            this.MmBDatalayerUtilsService.updateDatalayerEvents(
                MMBDatalayerConstants.EXCLUSIVE_SERVICES_EVENT_CATEGORY_VALUES.EXCLUSIVE_SERVICES,
                MMBDatalayerConstants.DATALAYER_EVENT_TYPES.IMPRESSIONS,
                MMBDatalayerConstants.EXCLUSIVE_SERVICES_EVENT_LABEL_VALUES.CARD_VIP,
                MMBDatalayerConstants.DatalayerGeneralConstants.EVENT_NAME_INTERACTION
            );
            return true;
        } catch (error) {
            return false;
        }
    };
}
export interface ExclusiveServicesComponentConfig {
    target?: HTMLElement | string;
    development: boolean;
    exclusiveServicesCardVipData: any;
}